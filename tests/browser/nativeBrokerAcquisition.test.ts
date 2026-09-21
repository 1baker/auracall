import { mkdtemp, rm } from "node:fs/promises";
import { createServer, type Socket } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { connectToChromeTarget } from "../../packages/browser-service/src/chromeLifecycle.js";
import {
	acquireAgentBrowserBrokerTab, AgentBrowserAttachmentCleanupError,
	detachAgentBrowserBrokerTab, reattachAgentBrowserBrokerTab,
	withAgentBrowserBrokerCleanup, type AgentBrowserBridgeDependencies,
	captureAgentBrowserNativeResponse,
} from "../../src/browser/service/agentBrowserBridge.js";
import { createProviderSessionAuthorization } from "../../src/browser/providers/providerSessionAuthority.js";
import { RECOVERY_RESPONSE_SNAPSHOT } from "../../src/browser/service/recoveryResponseBinding.js";
import { createConfiguredStoredStepExecutor } from "../../src/runtime/configuredExecutor.js";

const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); });
const handle = { browserId: "session:retained", profileId: "chatgpt-pro", sessionName: "retained",
	targetId: "exact-target", tabId: "target:exact-target", url: "https://chatgpt.com/c/exact-response", valid: true };
const binding = { attachmentId: "attachment", browserId: handle.browserId, profileId: handle.profileId,
	sessionName: handle.sessionName, targetId: handle.targetId, generation: "generation" };
const context = { taskAuthority: { fixture: true }, taskStepId: "attach-step", taskEvidenceBytes: 4096 };
type Packet = { id: string; brokerRequest: { operation: string; requestId: string; binding: unknown; cursor?: number;
	method?: string; params?: Record<string, unknown> } };

async function fixture(change: (data: Record<string, unknown>) => void = () => {}, detachFails = false,
	receiptBinding = binding, commandReply: (request: Packet["brokerRequest"]) => unknown = () => ({}),
	browserOverrides: Record<string, unknown> = {}) {
	const root = await mkdtemp(join(tmpdir(), "broker-acquisition-"));
	const socketPath = join(root, "daemon.sock");
	const packets: Packet[] = [];
	const operations: string[] = [];
	const sockets = new Set<Socket>();
	const server = createServer(socket => {
		sockets.add(socket);
		socket.on("error", () => {});
		socket.on("close", () => sockets.delete(socket));
		let bytes = "";
		socket.on("data", chunk => {
			bytes += chunk.toString();
			if (!bytes.endsWith("\n")) return;
			const packet: Packet = JSON.parse(bytes);
			packets.push(packet);
			const request = packet.brokerRequest;
			operations.push(request.operation);
			const data = request.operation === "detach"
				? { detached: !detachFails, browserPreserved: true }
				: request.operation === "events" ? { cursor: request.cursor, overflow: false, events: [] }
					: { result: commandReply(request) };
			socket.end(`${JSON.stringify({ id: packet.id, success: true,
				data: { binding: request.binding, requestId: request.requestId, ...data } })}\n`);
		});
	});
	await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(socketPath, resolve); });
	cleanups.push(async () => {
		for (const socket of sockets) socket.destroy();
		await new Promise<void>(resolve => server.close(() => resolve()));
		await rm(root, { recursive: true, force: true });
	});
	const requests: Array<Record<string, unknown>> = [];
	const fetch = vi.fn(async (url: unknown, init?: RequestInit) => {
		const reply = (data: unknown) => Response.json({ success: true, data });
		if (String(url).endsWith("/api/service/browsers")) return reply({ browsers: [{
			id: handle.browserId, profileId: handle.profileId, pid: 41234, health: "ready", tabHandles: [handle],
			...browserOverrides }] });
		if (String(url).includes("/api/service/access-plan?")) return reply({ selectedProfile: { id: handle.profileId },
			decision: { profileReuse: { recommendedAction: "reuse_existing_browser" }, serviceRequest: {
				available: true, request: { action: "tab_new", url: handle.url, browserId: handle.browserId, sessionName: handle.sessionName } } } });
		const request = JSON.parse(String(init?.body));
		requests.push(request);
		operations.push(request.action);
		if (request.action === "tab_new") return reply({ serviceTabHandle: handle });
		if (request.action !== "cdp_attach") throw new Error("Unexpected legacy cleanup or browser mutation");
		const data: Record<string, unknown> = { attached: true, controlPlaneMode: "broker", binding: { ...receiptBinding },
			serviceTabHandle: { ...handle }, browserProcessPreserved: true, closeBrowserOnDetach: false,
			detachRequired: true, transportAction: "__broker_transport" };
		change(data);
		return reply(data);
	});
	const attachTaskContext = vi.fn(async () => context);
	const dependencies: AgentBrowserBridgeDependencies = {
		fetch: fetch as typeof globalThis.fetch, listStreamFiles: async () => ["/fixture/dashboard-service-backend.stream"],
		readStreamFile: async () => "47777", nativeTransport: { socketPath, authToken: "fixture-token",
			taskContext: async () => context, attachTaskContext },
	};
	const acquire = (lane: "initial" | "recovery", abortSignal?: AbortSignal) => lane === "initial"
		? acquireAgentBrowserBrokerTab({ mode: "required", targetServiceId: "chatgpt", profileId: handle.profileId,
			url: handle.url, abortSignal }, dependencies)
		: reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
			serviceTabHandle: handle, abortSignal }, dependencies);
	return { packets, requests, operations, fetch, dependencies, attachTaskContext, acquire };
}

test.each(["complete", "wrong-account", "account-changed-after-read", "wrong-prompt", "wrong-url",
	"streaming", "exception", "oversized", "persistence-failure", "detach-failure", "aborted"])(
	"native recovered response capture: %s", async kind => {
		let accountReads = 0;
		const f = await fixture(undefined, kind === "detach-failure", binding, request => {
			expect(request.method).toBe("Runtime.evaluate");
			const snapshot = request.params?.expression === RECOVERY_RESPONSE_SNAPSHOT;
			if (!snapshot) accountReads += 1;
			const value = snapshot ? { url: kind === "wrong-url" ? "https://chatgpt.com/c/wrong" : handle.url,
				generating: kind === "streaming", messages: [
					{ role: "user", id: "user-original", text: kind === "wrong-prompt" ? "other" : "original prompt" },
					{ role: "assistant", id: "answer-original", text: kind === "oversized" ? "x".repeat(1000001) : "existing answer" },
				] } : { user: { email: kind === "wrong-account" || (kind === "account-changed-after-read" && accountReads > 1)
				? "wrong@example.com" : "expected@example.com" } };
			return { result: { type: "object", value }, ...(kind === "exception" ? { exceptionDetails: { text: "failed" } } : {}) };
		});
		const bridge = await f.acquire("recovery");
		if (!bridge) throw new Error("missing bridge");
		const authorization = createProviderSessionAuthorization({ profiles: { default: { services: {
			chatgpt: { identity: { email: "expected@example.com" } },
		} } } }, { providerId: "chatgpt", auracallRuntimeProfile: "default", browserProfile: "default",
			managedBrowserProfile: "/tmp/native-recovery-fixture" });
		const onAcquired = vi.fn(async () => {
			expect(f.packets).toHaveLength(0);
			if (kind === "persistence-failure") throw new Error("persistence failed");
		});
		const controller = new AbortController();
		if (kind === "aborted") controller.abort();
		const result = captureAgentBrowserNativeResponse(bridge, { prompt: "original prompt", url: handle.url,
			providerSessionAuthorization: authorization, onAcquired, abortSignal: controller.signal });
		if (kind === "complete") {
			await expect(result).resolves.toEqual({ userMessageId: "user-original", answerMessageId: "answer-original", answerText: "existing answer" });
			expect(accountReads).toBe(2);
		} else if (kind === "detach-failure") {
			await expect(result).rejects.toMatchObject({ details: { code: "agent_browser_cleanup_unverified" } });
		} else await expect(result).rejects.toThrow();
		expect(onAcquired).toHaveBeenCalledTimes(kind === "aborted" ? 0 : 1);
		const commands = f.packets.filter(packet => packet.brokerRequest.operation === "command");
		if (kind === "aborted" || kind === "persistence-failure") expect(commands).toHaveLength(0);
		expect(commands.every(packet => packet.brokerRequest.method === "Runtime.evaluate")).toBe(true);
		expect(f.requests.every(request => request.action === "cdp_attach")).toBe(true);
		expect(f.packets.filter(packet => packet.brokerRequest.operation === "detach")).toHaveLength(1);
		await bridge.brokerSession?.close().catch(() => undefined);
		expect(f.packets.filter(packet => packet.brokerRequest.operation === "detach")).toHaveLength(1);
	});

test("restart reconciliation verifies original detach before one exact native reacquisition", async () => {
	const nextBinding = { ...binding, attachmentId: "recovery-attachment" };
	const f = await fixture(undefined, false, nextBinding);
	const bridge = await reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
		serviceTabHandle: handle, originalNativeBinding: binding }, f.dependencies);
	expect(f.operations).toEqual(["detach", "cdp_attach"]);
	expect(f.packets[0]?.brokerRequest.binding).toEqual(binding);
	expect(bridge.brokerSession?.binding).toEqual(nextBinding);
	await withAgentBrowserBrokerCleanup(bridge, async () => "read-only recovery");
	await detachAgentBrowserBrokerTab(bridge);
	expect(f.operations).toEqual(["detach", "cdp_attach", "detach"]);
	expect(f.packets[1]?.brokerRequest.binding).toEqual(nextBinding);
});

test.each(["complete", "aborted", "missing-writer", "writer-failure"])("stored native recovery without replay: %s", async kind => {
	const nextBinding = { ...binding, attachmentId: "recovered-runtime-attachment" };
	const f = await fixture(undefined, false, nextBinding, request => ({ result: { type: "object", value:
		request.params?.expression === RECOVERY_RESPONSE_SNAPSHOT
			? { url: handle.url, generating: false, messages: [
				{ role: "user", id: "original-user", text: "original prompt" },
				{ role: "assistant", id: "original-answer", text: "existing answer" },
			] } : { user: { email: "expected@example.com" } },
	} }));
	const submit = vi.fn();
	const rawResume = vi.fn();
	const heartbeat = vi.fn(async () => {
		if (kind === "writer-failure") throw new Error("durable writer failed");
	});
	const materializer = vi.fn();
	const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
		engine: "browser", defaultService: "chatgpt", browserProfile: "default",
		services: { chatgpt: { manualLoginProfileDir: "/tmp/native-runtime-recovery", identity: { email: "expected@example.com" } } },
	} } }, { runBrowserModeImpl: submit, resumeBrowserSessionImpl: rawResume,
		nativeBrokerTransport: f.dependencies.nativeTransport, browserResponseArtifactMaterializer: materializer,
		reattachAgentBrowserBrokerTabImpl: (input, dependencies) => reattachAgentBrowserBrokerTab(input, { ...f.dependencies, ...dependencies }),
	});
	const details = { service: "chatgpt", chromeTargetId: handle.targetId, tabUrl: handle.url,
		agentBrowserTransport: "native", agentBrowserBinding: binding,
		agentBrowserBaseUrl: "http://127.0.0.1:47777", agentBrowserBrowserId: handle.browserId,
		agentBrowserProfileId: handle.profileId, agentBrowserSessionName: handle.sessionName,
		agentBrowserServiceTabHandle: handle };
	const events = [{ type: "note-added", stepId: "step-1", payload: { runtimeEvidence: {
		state: "response-incoming", evidenceRef: "chatgpt-assistant-snapshot", details,
	} } }, { type: "note-added", stepId: "step-1", note: "recovered stranded running step for host replay",
		payload: { source: "service-host" } }];
	const controller = new AbortController();
	if (kind === "aborted") controller.abort(new Error("recovery cancelled"));
	const result = execute?.({ record: { runId: "native-recovery", revision: 1,
		bundle: { run: { id: "native-recovery", initialInputs: {} }, events } } as never,
		step: { id: "step-1", agentId: "fixture", runtimeProfileId: "default", service: "chatgpt",
			input: { prompt: "original prompt", artifacts: [], notes: [], structuredData: {} } } as never,
		abortSignal: controller.signal,
		runtimeEvidence: kind === "missing-writer" ? undefined : { heartbeat } as never });
	if (kind === "complete") await expect(result).resolves.toMatchObject({ output: { summary: "existing answer" } });
	else await expect(result).rejects.toThrow();
	expect(submit).not.toHaveBeenCalled();
	expect(rawResume).not.toHaveBeenCalled();
	expect(materializer).not.toHaveBeenCalled();
	if (kind === "aborted" || kind === "missing-writer") {
		expect(f.operations).toEqual([]);
		return;
	}
	expect(f.packets.filter(packet => packet.brokerRequest.operation === "detach")).toHaveLength(2);
	if (kind === "writer-failure") {
		expect(f.packets.filter(packet => packet.brokerRequest.operation === "command")).toHaveLength(0);
	}
	expect(heartbeat).toHaveBeenCalledWith(expect.objectContaining({ details: expect.objectContaining({
		agentBrowserTransport: "native", agentBrowserBinding: nextBinding,
	}) }));
	expect(f.requests.map(request => request.action)).toEqual(["cdp_attach"]);
	expect(f.operations[0]).toBe("detach");
	expect(f.operations.at(-1)).toBe("detach");
});

test("uncertain original detach stops before authorization or reacquisition", async () => {
	const f = await fixture(undefined, true);
	await expect(reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
		serviceTabHandle: handle, originalNativeBinding: binding }, f.dependencies)).rejects.toThrow();
	expect(f.operations).toEqual(["detach"]);
	expect(f.attachTaskContext).not.toHaveBeenCalled();
});

test("native attachment accepts a project-slug alias but authorizes the live retained URL", async () => {
	const f = await fixture();
	const requestedUrl = "https://chatgpt.com/g/g-p-fixture-project/c/exact-response";
	const bridge = await reattachAgentBrowserBrokerTab({ ...handle, url: requestedUrl,
		baseUrl: "http://127.0.0.1:47777", serviceTabHandle: handle }, f.dependencies);
	expect(bridge.requestedUrl).toBe(requestedUrl);
	expect(f.attachTaskContext).toHaveBeenCalledWith(expect.objectContaining({
		url: handle.url,
		serviceTabHandle: expect.objectContaining({ url: handle.url, targetId: handle.targetId }),
	}), expect.any(AbortSignal));
});

test("reattachment accepts a fully matching applied browser-build PID proof after daemon restart", async () => {
	const endpoint = "ws://127.0.0.1:38463/devtools/browser/recovered";
	const f = await fixture(undefined, false, binding, () => ({}), {
		pid: null, cdpEndpoint: endpoint, browserBuild: "stock_chrome",
		browserBuildProof: { applied: true, browserPid: 41234, cdpEndpoint: endpoint,
			profileId: handle.profileId, browserBuild: "stock_chrome" },
	});
	await expect(reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
		serviceTabHandle: handle }, f.dependencies)).resolves.toMatchObject({ browserProcessId: 41234 });
});

test.each(["profileId", "sessionName", "targetId", "browserId"])("original binding %s drift stops before cleanup or attach", async key => {
	const f = await fixture();
	await expect(reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
		serviceTabHandle: handle, originalNativeBinding: { ...binding, [key]: "changed" } }, f.dependencies))
		.rejects.toThrow("identity changed");
	expect(f.operations).toEqual([]);
});

test("original URL drift cannot select a healthy retained target", async () => {
	const f = await fixture();
	await expect(reattachAgentBrowserBrokerTab({ ...handle, url: "https://chatgpt.com/c/wrong",
		baseUrl: "http://127.0.0.1:47777", serviceTabHandle: handle, originalNativeBinding: binding }, f.dependencies))
		.rejects.toThrow("found 0");
	expect(f.operations).toEqual([]);
});

test("the reconciled attachment cannot be returned as a fresh recovery attachment", async () => {
	const f = await fixture();
	await expect(reattachAgentBrowserBrokerTab({ ...handle, baseUrl: "http://127.0.0.1:47777",
		serviceTabHandle: handle, originalNativeBinding: binding }, f.dependencies)).rejects.toThrow("reused the original");
	expect(f.operations).toEqual(["detach", "cdp_attach", "detach"]);
});

describe.each(["initial", "recovery"] as const)("native %s acquisition", lane => {
	test("a raw Chrome endpoint cannot replace the requested native receipt", async () => {
		const f = await fixture(data => {
			delete data.binding;
			data.browserWebSocketUrl = "ws://127.0.0.1:9222/devtools/browser/not-authority";
		});
		await expect(f.acquire(lane)).rejects.toBeInstanceOf(AgentBrowserAttachmentCleanupError);
		expect(f.packets).toHaveLength(0);
		expect(f.requests.filter(request => request.action === "cdp_attach")).toHaveLength(1);
	});

	test("owns cleanup before admission without starting event polling", async () => {
		const f = await fixture();
		const bridge = await f.acquire(lane);
		if (!bridge?.brokerSession) throw new Error("missing native ownership");
		expect(bridge.chromeHost).toBeUndefined();
		expect(bridge.chromePort).toBeUndefined();
		await expect(connectToChromeTarget({ brokerSession: bridge.brokerSession,
			target: "wrong-target", host: "invalid.example", port: 9222 })).rejects.toThrow("target_mismatch");
		expect(f.packets).toHaveLength(0);
		expect(f.requests.filter(request => request.action === "cdp_attach")).toEqual([
			expect.objectContaining({ params: { params: { brokerTransport: true, expectedUrl: handle.url } },
				url: handle.url, ...context })]);
		await expect(withAgentBrowserBrokerCleanup(bridge, async () => { throw new Error("admission rejected"); },
			{ fetch: f.fetch as typeof globalThis.fetch })).rejects.toThrow("admission rejected");
		await bridge.brokerSession.close();
		await detachAgentBrowserBrokerTab(bridge, { fetch: f.fetch as typeof globalThis.fetch });
		expect(f.packets).toHaveLength(1);
		expect(f.packets[0]?.brokerRequest).toMatchObject({ operation: "detach", binding });
		expect(() => bridge.brokerSession?.connect()).toThrow("already_consumed");
	});

	test.each([false, true])("client and outer cleanup share one sticky detach (failure: %s)", async detachFails => {
		const f = await fixture(undefined, detachFails);
		const bridge = await f.acquire(lane);
		if (!bridge?.brokerSession) throw new Error("missing native ownership");
		const session = bridge.brokerSession;
		const action = vi.fn(async () => {
			const client = await connectToChromeTarget({ brokerSession: session, target: handle.targetId });
			await client.Runtime.enable();
			await client.close().catch(() => undefined); // Outer owner must still catch a suppressed inner failure.
			return "observed";
		});
		const result = withAgentBrowserBrokerCleanup(bridge, action, { fetch: f.fetch as typeof globalThis.fetch });
		if (detachFails) await expect(result).rejects.toMatchObject({ details: { code: "agent_browser_cleanup_unverified", retryable: false } });
		else await expect(result).resolves.toBe("observed");
		await session.close().catch(() => undefined);
		expect(f.packets.filter(packet => packet.brokerRequest.operation === "command")).toHaveLength(1);
		expect(f.packets.filter(packet => packet.brokerRequest.operation === "detach")).toHaveLength(1);
		expect(action).toHaveBeenCalledOnce();
	});

	test("cancellation after receipt still leaves pre-connect cleanup owned", async () => {
		const controller = new AbortController();
		const f = await fixture(() => controller.abort(new Error("run cancelled after attach")));
		const bridge = await f.acquire(lane, controller.signal);
		if (!bridge?.brokerSession) throw new Error("missing native ownership");
		await expect(withAgentBrowserBrokerCleanup(bridge, async () => {
			return connectToChromeTarget({ brokerSession: bridge.brokerSession, abortSignal: controller.signal });
		}, { fetch: f.fetch as typeof globalThis.fetch })).rejects.toThrow("cancelled after attach");
		expect(f.packets).toHaveLength(1);
		expect(f.packets[0]?.brokerRequest).toMatchObject({ operation: "detach", binding });
	});

	test.each(["profileId", "sessionName", "targetId", "browserId"])("mismatched %s cannot become a client or use legacy detach", async key => {
		const f = await fixture(data => { data.binding = { ...binding, [key]: "wrong" }; });
		const error = await f.acquire(lane).catch((failure: unknown) => failure);
		expect(error).toBeInstanceOf(AgentBrowserAttachmentCleanupError);
		if (!(error instanceof AgentBrowserAttachmentCleanupError)) throw new Error("missing cleanup evidence");
		await expect(detachAgentBrowserBrokerTab(error.bridge, { fetch: f.fetch as typeof globalThis.fetch }))
			.rejects.toThrow("identity_unreconciled");
		expect(f.packets).toHaveLength(0);
		expect(f.requests.filter(request => request.action === "cdp_attach")).toHaveLength(1);
	});

	test.each(["url", "profileId", "sessionName", "targetId", "browserId"])("changed receipt %s is rejected and only the matching opaque attachment is detached", async key => {
		const f = await fixture(data => { data.serviceTabHandle = { ...handle, [key]: "wrong" }; });
		await expect(f.acquire(lane)).rejects.toThrow("receipt_invalid");
		expect(f.packets).toHaveLength(1);
		expect(f.packets[0]?.brokerRequest).toMatchObject({ operation: "detach", binding });
	});

	test("authorization cancellation settles without an attach, even if permission arrives later", async () => {
		const f = await fixture();
		let finish: ((value: typeof context) => void) | undefined;
		f.attachTaskContext.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
		const controller = new AbortController();
		const pending = f.acquire(lane, controller.signal);
		const rejected = expect(pending).rejects.toThrow("authorization_interrupted");
		await vi.waitFor(() => expect(f.attachTaskContext).toHaveBeenCalledOnce());
		controller.abort();
		await rejected;
		finish?.(context);
		await new Promise(resolve => setImmediate(resolve));
		expect(f.requests.filter(request => request.action === "cdp_attach")).toHaveLength(0);
		expect(f.packets).toHaveLength(0);
	});
});

test.each(["off", "auto"] as const)("explicit native transport never falls back with bridge mode %s", async mode => {
	const f = await fixture();
	f.dependencies.listStreamFiles = async () => [];
	await expect(acquireAgentBrowserBrokerTab({ mode, targetServiceId: "chatgpt",
		profileId: handle.profileId, url: handle.url }, f.dependencies)).rejects.toThrow(
		mode === "off" ? "requires_bridge" : "required but unavailable");
	expect(f.requests).toHaveLength(0);
	expect(f.packets).toHaveLength(0);
});
