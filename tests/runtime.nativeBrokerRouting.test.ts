import { afterEach, expect, test, vi } from "vitest";
import type { BrowserRunOptions } from "../src/browser/types.js";
import { createConfiguredStoredStepExecutor } from "../src/runtime/configuredExecutor.js";
import { resumeBrowserSessionCore } from "../src/browser/reattachCore.js";

const binding = { attachmentId: "original-attachment", browserId: "session:retained", profileId: "chatgpt-pro",
	sessionName: "retained", targetId: "original-target", generation: "original-generation" };
const nativeTransport: NonNullable<BrowserRunOptions["nativeBrokerTransport"]> = {
	socketPath: "/fixture/native.sock", authToken: "FIXTURE_TOKEN_NOT_EVIDENCE",
	taskContext: async () => ({}), attachTaskContext: async () => ({ taskAuthority: {}, taskStepId: "step", taskEvidenceBytes: 4096 }),
};

afterEach(() => vi.unstubAllEnvs());

test("required configured execution creates the production native broker authority provider", async () => {
	vi.stubEnv("AURACALL_AGENT_BROWSER_BRIDGE", "required");
	vi.stubEnv("AURACALL_AGENT_BROWSER_SESSION", "chatgpt-pro");
	const runBrowserModeImpl = vi.fn(async (options: BrowserRunOptions) => {
		expect(options.nativeBrokerTransport).toMatchObject({
			socketPath: expect.stringMatching(/agent-browser\/chatgpt-pro\.sock$/),
		});
		expect(typeof options.nativeBrokerTransport?.authToken).toBe("function");
		expect(typeof options.nativeBrokerTransport?.attachTaskContext).toBe("function");
		throw new Error("FIXTURE_STOP_BEFORE_BROWSER");
	});
	const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
		engine: "browser", defaultService: "chatgpt", browserProfile: "default",
		services: { chatgpt: { manualLoginProfileDir: "/tmp/native-runtime-fixture" } },
	} } }, { runBrowserModeImpl });
	await expect(execute?.({ record: { runId: "configured-native", revision: 1,
		bundle: { run: { id: "configured-native", initialInputs: {} }, events: [] } } as never,
		step: { id: "step-1", agentId: "fixture", runtimeProfileId: "default", service: "chatgpt",
			input: { prompt: "DO_NOT_SUBMIT", artifacts: [], notes: [], structuredData: {} } } as never,
	})).rejects.toThrow("FIXTURE_STOP_BEFORE_BROWSER");
	expect(runBrowserModeImpl).toHaveBeenCalledOnce();
});

test.each(["initial", "persisted-native", "configured-recovery", "missing-binding", "missing-marker",
	"mixed-native-first", "mixed-native-last", "mixed-native-pre-submit"])(
	"native configured execution preserves authority and forbids legacy recovery: %s", async kind => {
		const recovery = kind !== "initial";
		const heartbeat = vi.fn(async () => {});
		const runBrowserModeImpl = vi.fn(async (options: BrowserRunOptions) => {
			expect(options.nativeBrokerTransport).toBe(nativeTransport);
			expect(options.config).not.toHaveProperty("nativeBrokerTransport");
			await options.runtimeHintCb?.({ agentBrowserTransport: "native", agentBrowserBinding: binding,
				chromeTargetId: binding.targetId, tabUrl: "https://chatgpt.com/c/original" });
			throw new Error("FIXTURE_STOP_BEFORE_PROVIDER");
		});
		const resumeBrowserSessionImpl = vi.fn();
		const reattachAgentBrowserBrokerTabImpl = vi.fn();
		const materializer = vi.fn();
		const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
			engine: "browser", defaultService: "chatgpt", browserProfile: "default",
			services: { chatgpt: { manualLoginProfileDir: "/tmp/native-runtime-fixture" } },
		} } }, { runBrowserModeImpl, resumeBrowserSessionImpl, reattachAgentBrowserBrokerTabImpl,
			browserResponseArtifactMaterializer: materializer,
			nativeBrokerTransport: kind === "initial" || kind === "configured-recovery" ? nativeTransport : undefined });
		const details = { service: "chatgpt", chromePort: 9222, chromeHost: "127.0.0.1",
			chromeTargetId: binding.targetId, tabUrl: "https://chatgpt.com/c/original",
			...(kind === "configured-recovery" ? {} : {
				agentBrowserTransport: kind === "missing-marker" ? undefined : "native",
				agentBrowserBinding: kind === "missing-binding" ? undefined : binding,
			}) };
		const events: Array<Record<string, unknown>> = recovery ? [{ type: "note-added", stepId: "step-1", payload: {
			runtimeEvidence: { state: "response-incoming", evidenceRef: "chatgpt-assistant-snapshot", details },
		} }, { type: "note-added", stepId: "step-1", note: "recovered stranded running step for host replay",
			payload: { source: "service-host" } }] : [];
		if (kind.startsWith("mixed-")) {
			const nativeEvent = { type: "note-added", stepId: "step-1", payload: { runtimeEvidence: {
				state: "attached", evidenceRef: "broker-attached", details: {
					service: "chatgpt", agentBrowserTransport: "native", agentBrowserBinding: binding,
					...(kind === "mixed-native-pre-submit" ? {} : {
						chromeTargetId: binding.targetId, tabUrl: "https://chatgpt.com/c/original",
					}),
				},
			} } };
			delete (details as Partial<typeof details>).agentBrowserTransport;
			delete (details as Partial<typeof details>).agentBrowserBinding;
			if (kind === "mixed-native-first") events.unshift(nativeEvent);
			else events.push(nativeEvent);
		}
		const result = execute?.({ record: { runId: "native-routing", revision: 1,
			bundle: { run: { id: "native-routing", initialInputs: {} }, events } } as never,
			step: { id: "step-1", agentId: "fixture", runtimeProfileId: "default", service: "chatgpt",
				input: { prompt: "DO_NOT_SUBMIT", artifacts: [], notes: [], structuredData: {} } } as never,
			runtimeEvidence: { heartbeat } as never });
		if (!recovery) {
			await expect(result).rejects.toThrow("FIXTURE_STOP_BEFORE_PROVIDER");
			expect(heartbeat).toHaveBeenCalledWith(expect.objectContaining({ details: expect.objectContaining({
				agentBrowserTransport: "native", agentBrowserBinding: binding,
			}) }));
			expect(JSON.stringify(heartbeat.mock.calls)).not.toContain(nativeTransport.authToken);
		} else {
			await expect(result).rejects.toThrow(/reconciliation|refusing raw Chrome recovery/);
		}
		expect(runBrowserModeImpl).toHaveBeenCalledTimes(recovery ? 0 : 1);
		expect(resumeBrowserSessionImpl).not.toHaveBeenCalled();
		expect(reattachAgentBrowserBrokerTabImpl).not.toHaveBeenCalled();
		expect(materializer).not.toHaveBeenCalled();
	},
);

test.each([undefined, 9222])("native reattach core never discovers or reopens Chrome (saved port: %s)", async chromePort => {
	const listTargets = vi.fn();
	const connect = vi.fn();
	const recoverSession = vi.fn();
	await expect(resumeBrowserSessionCore({ agentBrowserTransport: "native", agentBrowserBinding: binding,
		chromePort, chromeTargetId: binding.targetId }, undefined, vi.fn<(message: string) => void>(), { listTargets, connect, recoverSession }))
		.rejects.toThrow("raw Chrome recovery is forbidden");
	expect(listTargets).not.toHaveBeenCalled();
	expect(connect).not.toHaveBeenCalled();
	expect(recoverSession).not.toHaveBeenCalled();
});
