import { expect, it, vi } from "vitest";
import { createConfiguredStoredStepExecutor } from "../src/runtime/configuredExecutor.js";

it("does not submit an artifact correction after recovering an existing response", async () => {
	const runBrowserModeImpl = vi.fn(async () => {
		throw new Error("UNEXPECTED_PROVIDER_SUBMISSION");
	});
	const materializer = vi.fn(async () => {
		throw new Error("provider-session proof unavailable after recovery");
	});
	const execute = createConfiguredStoredStepExecutor(
		{
			runtimeProfiles: {
				default: {
					engine: "browser",
					defaultService: "chatgpt",
					browserProfile: "default",
					services: { chatgpt: { manualLoginProfileDir: "/tmp/recovery-no-correction" } },
				},
			},
		},
		{
			runBrowserModeImpl,
			resumeBrowserSessionImpl: vi.fn(async () => ({
				answerText: "The original document is ready.",
				answerMarkdown: "The original document is ready.",
				answerMessageId: "original-answer",
			})),
			browserResponseArtifactMaterializer: materializer,
		},
	);
	await expect(
		execute?.({
			record: {
				runId: "recovery-no-correction",
				revision: 1,
				bundle: {
					run: { id: "recovery-no-correction", initialInputs: {} },
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
										chromeTargetId: "original-target",
										chromePort: 45012,
										chromeHost: "127.0.0.1",
										tabUrl: "https://chatgpt.com/c/original-conversation",
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
						metadata: {
							outputContract: {
								mode: "artifact",
								artifactFileName: "original.docx",
							},
						},
					},
				},
			} as never,
		}),
	).rejects.toThrow("without required artifact original.docx");
	expect(materializer).toHaveBeenCalledOnce();
	expect(runBrowserModeImpl).not.toHaveBeenCalled();
});
