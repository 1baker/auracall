import { expect, it, vi } from "vitest";
import type { BrowserRunOptions } from "../src/browser/types.js";
import { createConfiguredStoredStepExecutor } from "../src/runtime/configuredExecutor.js";

it.each([
	{ name: "complete pair", paths: ["/tmp/proposal.docx", "/tmp/proposal.pdf"], passed: true },
	{ name: "DOCX only", paths: ["/tmp/proposal.docx"], passed: false },
	{ name: "wrong PDF", paths: ["/tmp/proposal.docx", "/tmp/unrelated.pdf"], passed: false },
	{ name: "unproven collision suffix", paths: ["/tmp/proposal.docx", "/tmp/proposal(5).pdf"], passed: false },
	{ name: "same path twice", paths: ["/tmp/proposal.docx", "/tmp/proposal.docx"], passed: false },
	{ name: "remote only", paths: [], passed: false },
	{
		name: "legacy name plus incomplete set",
		paths: ["/tmp/proposal.docx"],
		passed: false,
		legacyName: "proposal.docx",
	},
])("requires every document: $name", async ({ paths, passed, legacyName }) => {
	const run = vi.fn(async (_options: BrowserRunOptions) => ({
		answerText: "Documents ready.",
		answerMarkdown: "Documents ready.",
		answerMessageId: "answer-1",
		tookMs: 1,
		answerTokens: 3,
		answerChars: 16,
		conversationId: "document-set",
		tabUrl: "https://chatgpt.com/c/document-set",
	}));
	const execute = createConfiguredStoredStepExecutor(
		{
			runtimeProfiles: {
				default: {
					engine: "browser",
					defaultService: "chatgpt",
					browserProfile: "default",
				},
			},
		},
		{
			runBrowserModeImpl: run,
			browserResponseArtifactMaterializer: async () => ({
				artifacts: paths.map((file, index) => ({ id: String(index), kind: "file", path: file })),
				notes: [],
			}),
		},
	);
	const result = execute?.({
		record: {
			runId: "document-set",
			revision: 1,
			bundle: { run: { id: "document-set", initialInputs: {} }, events: [] },
		} as never,
		step: {
			id: "step-1",
			agentId: "test",
			runtimeProfileId: "default",
			service: "chatgpt",
			input: {
				prompt: "Create proposal documents.",
				artifacts: [],
				notes: [],
				structuredData: {
					metadata: {
						outputContract: {
							mode: "artifact",
							artifactFileNames: ["proposal.docx", "proposal.pdf"],
							...(legacyName ? { artifactFileName: legacyName } : {}),
						},
					},
				},
			},
		} as never,
	});
	if (passed) await expect(result).resolves.toBeDefined();
	else await expect(result).rejects.toThrow("without required artifact");
	expect(run).toHaveBeenCalledOnce();
	expect(run.mock.calls[0]?.[0]).toMatchObject({
		prompt: expect.stringContaining("proposal.docx"),
	});
	expect(run.mock.calls[0]?.[0]).toMatchObject({ prompt: expect.stringContaining("proposal.pdf") });
});

it.each(
	[
		null,
		"proposal.pdf",
		[],
		[""],
		[1],
		["../proposal.pdf"],
		["folder\\proposal.pdf"],
		["."],
		[".."],
		["bad\u0000.pdf"],
		Array.from({ length: 33 }, (_, index) => `${index}.pdf`),
	].map((artifactFileNames) => ({ artifactFileNames })),
)("rejects malformed file sets before submission: $artifactFileNames", async ({
	artifactFileNames,
}) => {
	const run = vi.fn();
	const execute = createConfiguredStoredStepExecutor(
		{
			runtimeProfiles: {
				default: { engine: "browser", defaultService: "chatgpt", browserProfile: "default" },
			},
		},
		{ runBrowserModeImpl: run },
	);
	await expect(
		execute?.({
			record: {
				runId: "invalid-set",
				revision: 1,
				bundle: { run: { id: "invalid-set", initialInputs: {} }, events: [] },
			} as never,
			step: {
				id: "step-1",
				agentId: "test",
				runtimeProfileId: "default",
				service: "chatgpt",
				input: {
					prompt: "Create documents.",
					artifacts: [],
					notes: [],
					structuredData: {
						metadata: { outputContract: { mode: "artifact", artifactFileNames } },
					},
				},
			} as never,
		}),
	).rejects.toThrow("artifactFileNames must contain");
	expect(run).not.toHaveBeenCalled();
});
