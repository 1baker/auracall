import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test, vi } from "vitest";
import { createBrokerCdpSession, type BrokerCdpTransport } from "../../packages/browser-service/src/brokerCdpClient.js";
import { setAuracallHomeDirOverrideForTest } from "../../src/auracallHome.js";
import type { BrowserRunOptions } from "../../src/browser/types.js";

const mocks = vi.hoisted(() => ({ acquire: vi.fn(), rawCdp: Object.assign(vi.fn(), {
	// biome-ignore lint/style/useNamingConvention: chrome-remote-interface API name.
	List: vi.fn(),
	// biome-ignore lint/style/useNamingConvention: chrome-remote-interface API name.
	Close: vi.fn(),
}) }));
vi.mock("chrome-remote-interface", () => ({ default: mocks.rawCdp }));
vi.mock("../../src/browser/service/agentBrowserBridge.js", async importOriginal => ({
	...await importOriginal<typeof import("../../src/browser/service/agentBrowserBridge.js")>(),
	acquireAgentBrowserBrokerTab: mocks.acquire,
}));
import { runBrowserMode } from "../../src/browser/index.js";

const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => {
	for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
	setAuracallHomeDirOverrideForTest(null);
	vi.unstubAllEnvs();
	vi.clearAllMocks();
});

test.each(["chatgpt", "grok"] as const)("%s provider uses native authority without raw endpoint discovery or prompt input", async target => {
	const root = await mkdtemp(join(tmpdir(), "native-provider-"));
	cleanups.push(() => rm(root, { recursive: true, force: true }));
	setAuracallHomeDirOverrideForTest(root);
	vi.stubEnv("AURACALL_AGENT_BROWSER_BRIDGE", "required");
	const binding = { attachmentId: "attachment", browserId: "session:retained", profileId: "fixture-profile",
		sessionName: "retained", targetId: "exact-target", generation: "generation" };
	const command = vi.fn<BrokerCdpTransport["command"]>(async request => ({ ...request,
		error: { code: -32000, message: "FIXTURE_STOP_BEFORE_PROMPT" } }));
	const detach = vi.fn<BrokerCdpTransport["detach"]>(async request => ({ ...request, detached: true, browserPreserved: true }));
	const session = createBrokerCdpSession({ binding, transport: {
		command, events: () => new Promise(() => {}), detach,
	} });
	cleanups.push(() => session.close());
	const url = target === "chatgpt" ? "https://chatgpt.com/c/original" : "https://grok.com/c/original";
	mocks.acquire.mockResolvedValue({ baseUrl: "http://127.0.0.1:47777", browserId: binding.browserId,
		profileId: binding.profileId, sessionName: binding.sessionName, browserProcessId: 41234,
		serviceTabHandle: { ...binding, url, valid: true }, requestedUrl: url,
		brokerTransport: "native", brokerSession: session, detachRequired: true, releaseRequired: false });
	const nativeBrokerTransport: BrowserRunOptions["nativeBrokerTransport"] = {
		socketPath: "/fixture/native.sock", authToken: "NEVER_LOG_THIS_FIXTURE_TOKEN",
		taskContext: async () => ({}), attachTaskContext: async () => ({ taskAuthority: {}, taskStepId: "step", taskEvidenceBytes: 4096 }),
	};
	const hints: unknown[] = [];
	const logs: unknown[] = [];
	await expect(runBrowserMode({ prompt: "DO_NOT_SUBMIT", nativeBrokerTransport,
		config: { target, url, chatgptUrl: url, grokUrl: url, manualLogin: true,
			manualLoginProfileDir: join(root, "profile"), debug: true, modelStrategy: "ignore",
			remoteChrome: { host: "invalid.example", port: 9222 } },
		log: (...args: unknown[]) => { logs.push(args); },
		runtimeHintCb: hint => { hints.push(hint); },
	})).rejects.toThrow("FIXTURE_STOP_BEFORE_PROMPT");
	expect(mocks.acquire).toHaveBeenCalledOnce();
	expect(mocks.acquire.mock.calls[0]?.[1]).toEqual({ nativeTransport: nativeBrokerTransport });
	expect(command).toHaveBeenCalled();
	expect(command.mock.calls.every(([request]) => request.method.endsWith(".enable") || request.method === "Runtime.evaluate")).toBe(true);
	expect(detach).toHaveBeenCalledOnce();
	expect(mocks.rawCdp).not.toHaveBeenCalled();
	expect(mocks.rawCdp.List).not.toHaveBeenCalled();
	expect(mocks.rawCdp.Close).not.toHaveBeenCalled();
	expect(hints).toContainEqual(expect.objectContaining({ agentBrowserTransport: "native", agentBrowserBinding: binding }));
	expect(JSON.stringify(hints)).not.toContain("9222");
	expect(JSON.stringify([hints, logs])).not.toContain(nativeBrokerTransport.authToken);
});
