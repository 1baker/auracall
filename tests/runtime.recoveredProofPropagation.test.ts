import { expect, it, vi } from "vitest";
import {
	assertProviderSessionAuthorization,
	type ProviderSessionProof,
} from "../src/browser/providers/providerSessionAuthority.js";
import {
	createConfiguredStoredStepExecutor,
	type CreateConfiguredStoredStepExecutorDeps,
} from "../src/runtime/configuredExecutor.js";

it("passes the freshly verified broker proof through the recovered-response shortcut without submission", async () => {
	const handle = {
		browserId: "session:retained",
		profileId: "chatgpt-pro",
		sessionName: "retained",
		targetId: "restored-target",
		url: "https://chatgpt.com/c/original-conversation",
		valid: true,
	};
	let verifiedProof: ProviderSessionProof | undefined;
	const runBrowserModeImpl = vi.fn(async () => {
		throw new Error("UNEXPECTED_SUBMISSION");
	});
	const resumeBrowserSessionImpl = vi.fn(async () => {
		throw new Error("UNEXPECTED_RESUME");
	});
	const broker: NonNullable<
		CreateConfiguredStoredStepExecutorDeps["reattachAgentBrowserBrokerTabImpl"]
	> = async (input) => {
		expect(input.providerSessionAuthorization).toBeDefined();
		verifiedProof = assertProviderSessionAuthorization(
			input.providerSessionAuthorization,
			{ email: "expected@example.com", source: "auth-session" },
			{ browserProcessId: 12345, browserTargetId: handle.targetId },
		);
		expect(verifiedProof.verdict).toBe("match");
		return {
			baseUrl: "http://127.0.0.1:47777",
			browserId: handle.browserId,
			browserProcessId: 12345,
			profileId: handle.profileId,
			sessionName: handle.sessionName,
			serviceTabHandle: handle,
			canonicalTargetId: handle.targetId,
			chromeHost: "127.0.0.1",
			chromePort: 49505,
			recoveredResponse: {
				userMessageId: "original-user",
				answerMessageId: "original-assistant",
				answerText: "The original document is ready.",
			},
		};
	};
	const materializer = vi.fn<
		NonNullable<CreateConfiguredStoredStepExecutorDeps["browserResponseArtifactMaterializer"]>
	>(async (input) => {
		expect(input.providerSessionProof).toBe(verifiedProof);
		expect(input.providerSessionProof).toMatchObject({
			verdict: "match",
			provenance: { browserProcessId: 12345, browserTargetId: handle.targetId },
		});
		expect(input).toMatchObject({
			answerMessageId: "original-assistant",
			conversationId: "original-conversation",
			tabTargetId: handle.targetId,
			chromeHost: "127.0.0.1",
			chromePort: 49505,
		});
		return { artifacts: [{ id: "original.docx", kind: "file", path: "/tmp/original.docx" }], notes: [] };
	});
	const execute = createConfiguredStoredStepExecutor(
		{
			runtimeProfiles: {
				default: {
					engine: "browser",
					defaultService: "chatgpt",
					browserProfile: "default",
					services: {
						chatgpt: {
							manualLoginProfileDir: "/tmp/recovered-proof",
							identity: { email: "expected@example.com" },
						},
					},
				},
			},
		},
		{
			runBrowserModeImpl,
			resumeBrowserSessionImpl,
			reattachAgentBrowserBrokerTabImpl: broker,
			withAgentBrowserBrokerCleanupImpl: async (_bridge, action) => action(),
			browserResponseArtifactMaterializer: materializer,
		},
	);
	const result = await execute?.({
		record: {
			runId: "recovered-proof",
			revision: 1,
			bundle: {
				run: { id: "recovered-proof", initialInputs: {} },
				events: [
					{
						type: "note-added",
						stepId: "step-1",
						payload: {
							runtimeEvidence: {
								state: "response-incoming",
								evidenceRef: "chatgpt-assistant-snapshot",
								details: {
									service: "chatgpt",
									chromeTargetId: "old-target",
									chromePort: 45012,
									chromeHost: "127.0.0.1",
									tabUrl: handle.url,
									agentBrowserBaseUrl: "http://127.0.0.1:47777",
									agentBrowserBrowserId: handle.browserId,
									agentBrowserProfileId: handle.profileId,
									agentBrowserSessionName: handle.sessionName,
									agentBrowserServiceTabHandle: { ...handle, targetId: "old-target" },
								},
							},
						},
					},
					{
						type: "note-added",
						stepId: "step-1",
						note: "recovered stranded running step for host replay",
						payload: { source: "service-host" },
					},
				],
			},
		} as never,
		step: {
			id: "step-1",
			agentId: "recovery-test",
			runtimeProfileId: "default",
			service: "chatgpt",
			input: {
				prompt: "Create the document.",
				artifacts: [],
				notes: [],
				structuredData: {
					metadata: { outputContract: { mode: "artifact", artifactFileName: "original.docx" } },
				},
			},
		} as never,
	});
	expect(result).toBeDefined();
	expect(materializer).toHaveBeenCalledOnce();
	expect(runBrowserModeImpl).not.toHaveBeenCalled();
	expect(resumeBrowserSessionImpl).not.toHaveBeenCalled();
});
