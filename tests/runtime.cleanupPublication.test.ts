import { expect, test, vi } from "vitest";
import {
	withAgentBrowserBrokerCleanup,
	type AgentBrowserBridgeResult,
} from "../src/browser/service/agentBrowserBridge.js";
import type { BrowserRunResult } from "../src/browser/types.js";
import { createConfiguredStoredStepExecutor } from "../src/runtime/configuredExecutor.js";

test.each([false, true])("unverified cleanup cannot publish or replay a provider result (recovery: %s)", async (recovery) => {
	const handle = { browserId: "session:retained", profileId: "chatgpt-pro",
		sessionName: "retained", targetId: "original-target",
		url: "https://chatgpt.com/c/original-conversation", valid: true };
	const bridge: AgentBrowserBridgeResult = {
		baseUrl: "http://127.0.0.1:47777", browserId: handle.browserId,
		profileId: handle.profileId, sessionName: handle.sessionName, serviceTabHandle: handle,
		browserProcessId: 41234, canonicalTargetId: handle.targetId,
		chromeHost: "127.0.0.1", chromePort: 45012, requestedUrl: handle.url,
		detachRequired: true, detachState: "attached", releaseRequired: false,
	};
	const requests: Array<Record<string, unknown>> = [];
	const fetch = vi.fn(async (_url: unknown, init?: RequestInit) => {
		requests.push(JSON.parse(String(init?.body)));
		return Response.json({ success: true, data: { detached: false } });
	});
	const answer = { answerText: "Completed once", answerMarkdown: "Completed once",
		answerMessageId: "original-answer", tabUrl: handle.url };
	const submit = vi.fn(async () => answer as BrowserRunResult);
	const runBrowserModeImpl = vi.fn(async () => withAgentBrowserBrokerCleanup(bridge, submit,
		{ fetch: fetch as typeof globalThis.fetch }));
	const resumeBrowserSessionImpl = vi.fn(async () => answer);
	const reattachAgentBrowserBrokerTabImpl = vi.fn(async () => bridge);
	const materializer = vi.fn();
	const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
		engine: "browser", defaultService: "chatgpt", browserProfile: "default",
		services: { chatgpt: { manualLoginProfileDir: "/tmp/cleanup-publication-fixture" } },
	} } }, {
		runBrowserModeImpl, resumeBrowserSessionImpl, reattachAgentBrowserBrokerTabImpl,
		withAgentBrowserBrokerCleanupImpl: (acquired, action) =>
			withAgentBrowserBrokerCleanup(acquired, action, { fetch: fetch as typeof globalThis.fetch }),
		browserResponseArtifactMaterializer: materializer,
	});
	const events = recovery ? [{ type: "note-added", stepId: "step-1", payload: {
		runtimeEvidence: { state: "response-incoming", evidenceRef: "chatgpt-assistant-snapshot",
			details: { service: "chatgpt", chromeTargetId: handle.targetId, chromePort: 45012,
				chromeHost: "127.0.0.1", tabUrl: handle.url, browserAuthority: "agent-browser",
				agentBrowserBridgeMode: "required", agentBrowserBaseUrl: bridge.baseUrl,
				agentBrowserBrowserId: handle.browserId, agentBrowserProfileId: handle.profileId,
				agentBrowserSessionName: handle.sessionName, agentBrowserServiceTabHandle: handle,
				agentBrowserRequestedUrl: handle.url, agentBrowserCanonicalTargetId: handle.targetId,
				agentBrowserProcessId: 41234 } },
	} }, { type: "note-added", stepId: "step-1",
		note: "recovered stranded running step for host replay", payload: { source: "service-host" } }] : [];
	await expect(execute?.({
		record: { runId: "cleanup-publication", revision: 1,
			bundle: { run: { id: "cleanup-publication", initialInputs: {} }, events } } as never,
		step: { id: "step-1", agentId: "cleanup-test", runtimeProfileId: "default", service: "chatgpt",
			input: { prompt: "Original request", artifacts: [], notes: [], structuredData: {} } } as never,
	})).rejects.toMatchObject({ name: "BrowserAutomationError", details: {
		code: "agent_browser_cleanup_unverified", retryable: false, phase: "after",
		providerOperationCompleted: true,
	} });
	expect(submit).toHaveBeenCalledTimes(recovery ? 0 : 1);
	expect(runBrowserModeImpl).toHaveBeenCalledTimes(recovery ? 0 : 1);
	expect(resumeBrowserSessionImpl).toHaveBeenCalledTimes(recovery ? 1 : 0);
	expect(reattachAgentBrowserBrokerTabImpl).toHaveBeenCalledTimes(recovery ? 1 : 0);
	expect(materializer).not.toHaveBeenCalled();
	expect(requests).toEqual([expect.objectContaining({ action: "cdp_detach", serviceTabHandle: handle })]);
});
