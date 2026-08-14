import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ResolvedUserConfig } from "../../src/config.js";

const runPrompt = vi.fn(async () => ({
	text: "",
	conversationId: "gemini-target-1",
	url: "https://gemini.google.com/app/gemini-target-1",
	tabTargetId: "gemini-tab-1",
}));

const tempRoots: string[] = [];

afterEach(async () => {
	for (const root of tempRoots.splice(0)) {
		await rm(root, { recursive: true, force: true, maxRetries: 2 });
	}
	runPrompt.mockClear();
});

describe("Gemini handoff browser adapter", () => {
	it("submits approved compact context and selected files through Gemini browser mode", async () => {
		const root = await tempRoot("auracall-gemini-handoff-adapter-");
		const selectedPath = path.join(root, "handoff-context.txt");
		await writeFile(selectedPath, "selected handoff context", "utf8");
		const {
			approveHandoffTargetSubmit,
			approveHandoffTargetUpload,
			prepareCrossServiceHandoffPacket,
			recoverHandoffLive,
		} = await import("../../src/handoff/service.js");
		const { createGeminiBrowserHandoffTargetAdapter } = await import(
			"../../src/handoff/geminiBrowserAdapter.js"
		);
		const prepared = await prepareCrossServiceHandoffPacket({
			config: fixtureConfig(),
			outputRoot: root,
			handoffId: "gemini-browser-adapter-fixture",
			sourceProvider: "chatgpt",
			sourceRuntimeProfile: "source-chatgpt",
			sourceRef: "https://chatgpt.com/c/source",
			targetProvider: "gemini",
			targetRuntimeProfile: "target-gemini",
			targetRef: "https://gemini.google.com/app/target-gemini-handoff",
			targetModelSelector: "gemini-3-pro",
			sourceContext: { messages: [{ role: "user", content: "handoff adapter" }] },
			sourceManifest: {
				items: [manifestItemFixture({ id: "gemini_attachment", localPath: selectedPath })],
			},
			generatedAt: "2026-08-14T14:00:00.000Z",
		});
		const adapter = createGeminiBrowserHandoffTargetAdapter(
			{
				auracallProfile: "target-gemini",
				browser: {
					target: "gemini",
					keepBrowser: true,
				},
				runtimeProfiles: fixtureConfig().runtimeProfiles,
			} as ResolvedUserConfig,
			{ service: { runPrompt } },
		);

		await approveHandoffTargetUpload({
			handoffId: "gemini-browser-adapter-fixture",
			outputRoot: root,
			packageDigest: prepared.targetPackage.packageDigest,
		});
		const uploadRecovery = await recoverHandoffLive({
			handoffId: "gemini-browser-adapter-fixture",
			outputRoot: root,
			generatedAt: "2026-08-14T14:01:00.000Z",
			targetAdapter: adapter,
		});
		expect(uploadRecovery.recovery).toMatchObject({
			executor: "provider_native_file_prompt_adapter",
			executedAction: "upload",
			status: "recovered",
		});
		const uploadJson = JSON.parse(
			await readFile(
				path.join(root, "gemini-browser-adapter-fixture", "target", "upload-result.json"),
				"utf8",
			),
		);
		expect(uploadJson).toMatchObject({
			status: "uploaded",
			rows: [
				expect.objectContaining({
					sourceManifestItemId: "gemini_attachment",
					providerFileId: expect.stringMatching(/^gemini-prompt-attachment-[a-f0-9]{32}$/),
				}),
			],
		});

		await approveHandoffTargetSubmit({
			handoffId: "gemini-browser-adapter-fixture",
			outputRoot: root,
			packageDigest: prepared.targetPackage.packageDigest,
		});
		const submitRecovery = await recoverHandoffLive({
			handoffId: "gemini-browser-adapter-fixture",
			outputRoot: root,
			generatedAt: "2026-08-14T14:02:00.000Z",
			targetAdapter: adapter,
		});

		expect(runPrompt).toHaveBeenCalledWith(
			expect.objectContaining({
				completionMode: "prompt_submitted",
				prompt: expect.stringContaining("## Compact Context JSON"),
				configuredUrl: "https://gemini.google.com/app/target-gemini-handoff",
				conversationId: "target-gemini-handoff",
				desiredModel: "gemini-3-pro",
				modelStrategy: "select",
				attachments: [
					expect.objectContaining({
						path: path.join(
							root,
							"gemini-browser-adapter-fixture",
							"target",
							"selected-files",
							"001-Selected_file-gemini_attachment",
						),
						displayPath: "001-Selected_file-gemini_attachment",
					}),
				],
			}),
		);
		expect(submitRecovery).toMatchObject({
			recovery: {
				executor: "provider_native_file_prompt_adapter",
				executedAction: "submit",
				status: "recovered",
			},
			afterResumePlan: {
				nextAction: "complete",
			},
		});
	});

	it("fails a provider-mismatched upload without invoking Gemini", async () => {
		const root = await tempRoot("auracall-gemini-handoff-mismatch-");
		const selectedPath = path.join(root, "handoff-context.txt");
		await writeFile(selectedPath, "selected handoff context", "utf8");
		const { approveHandoffTargetUpload, prepareCrossServiceHandoffPacket, recoverHandoffLive } =
			await import("../../src/handoff/service.js");
		const { createGeminiBrowserHandoffTargetAdapter } = await import(
			"../../src/handoff/geminiBrowserAdapter.js"
		);
		const prepared = await prepareCrossServiceHandoffPacket({
			config: fixtureConfig(),
			outputRoot: root,
			handoffId: "gemini-browser-mismatch",
			sourceProvider: "gemini",
			sourceRuntimeProfile: "target-gemini",
			sourceRef: "https://gemini.google.com/app/source",
			targetProvider: "chatgpt",
			targetRuntimeProfile: "source-chatgpt",
			targetRef: "https://chatgpt.com/c/target",
			sourceContext: { messages: [{ role: "user", content: "mismatch" }] },
			sourceManifest: {
				items: [manifestItemFixture({ id: "mismatch", localPath: selectedPath })],
			},
		});
		await approveHandoffTargetUpload({
			handoffId: prepared.run.id,
			outputRoot: root,
			packageDigest: prepared.targetPackage.packageDigest,
		});

		const recovery = await recoverHandoffLive({
			handoffId: prepared.run.id,
			outputRoot: root,
			targetAdapter: createGeminiBrowserHandoffTargetAdapter(
				{
					auracallProfile: "target-gemini",
					browser: { target: "gemini" },
				} as ResolvedUserConfig,
				{ service: { runPrompt } },
			),
		});

		expect(recovery.recovery).toMatchObject({ status: "recovered", executedAction: "upload" });
		const uploadJson = JSON.parse(
			await readFile(path.join(prepared.packetPath, "target", "upload-result.json"), "utf8"),
		);
		expect(uploadJson).toMatchObject({
			status: "failed",
			rows: [],
			failedRows: [
				expect.objectContaining({
					status: "failed",
					error: "Gemini browser handoff adapter cannot upload to chatgpt.",
					retryable: false,
				}),
			],
		});
		expect(runPrompt).not.toHaveBeenCalled();
	});
});

async function tempRoot(prefix: string): Promise<string> {
	const root = await mkdtemp(path.join(os.tmpdir(), prefix));
	tempRoots.push(root);
	return root;
}

function fixtureConfig(): Record<string, unknown> {
	return {
		runtimeProfiles: {
			"source-chatgpt": {
				browserProfile: "chatgpt-browser",
				services: { chatgpt: { identity: { email: "source@example.com" } } },
			},
			"target-gemini": {
				browserProfile: "gemini-browser",
				services: { gemini: { identity: { email: "target@example.com" } } },
			},
		},
	};
}

function manifestItemFixture(overrides: Partial<{ id: string; localPath: string | null }> = {}) {
	return {
		id: overrides.id ?? "selected",
		kind: "file" as const,
		title: "Selected file",
		localPath: Object.hasOwn(overrides, "localPath")
			? (overrides.localPath ?? null)
			: "/tmp/selected.txt",
		archiveItemId: null,
		sourceRef: null,
		mimeType: "text/plain",
		sizeBytes: 10,
		checksumSha256: "e".repeat(64),
		materializationMethod: null,
		importanceHint: 1,
	};
}
