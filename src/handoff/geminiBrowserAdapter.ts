import { createHash } from "node:crypto";
import { GeminiService } from "../browser/llmService/providers/geminiService.js";
import type { ResolvedUserConfig } from "../config.js";
import {
	createProviderNativeHandoffTargetAdapter,
	type HandoffProviderNativePromptInput,
	type HandoffProviderNativePromptResult,
	type HandoffProviderNativeUploadInput,
	type HandoffProviderNativeUploadResult,
	type HandoffTargetAdapter,
} from "./service.js";

export function createGeminiBrowserHandoffTargetAdapter(
	userConfig: ResolvedUserConfig,
	options?: { service?: Pick<GeminiService, "runPrompt"> },
): HandoffTargetAdapter {
	const runtimeProfileId =
		typeof userConfig.auracallProfile === "string" ? userConfig.auracallProfile : null;
	const acquiredAt = new Date().toISOString();
	const operation = {
		kind: "handoff_target_submit",
		id: null,
		provider: "gemini",
		runtimeProfileId,
		browserProfileId: null,
		sourceType: "handoff",
		sourceKey: null,
		reason: "gemini-browser-handoff-prompt-attachment",
	};
	const service =
		options?.service ??
		GeminiService.create(userConfig, {
			browserProcessOwner: {
				owner: {
					...operation,
					acquiredAt,
					heartbeatAt: acquiredAt,
				},
				operation,
				lease: {
					id: `handoff_target_submit:gemini:${runtimeProfileId ?? "default"}`,
					ownerId: null,
					acquiredAt,
					heartbeatAt: acquiredAt,
					expiresAt: null,
					cleanupPolicy: "handoff-target-submit-provider-work",
				},
			},
		});
	return createProviderNativeHandoffTargetAdapter(
		{
			submit: (input) => submitGeminiHandoffPrompt(service, input),
		},
		{
			upload: stageGeminiPromptAttachments,
		},
	);
}

async function stageGeminiPromptAttachments(
	input: HandoffProviderNativeUploadInput,
): Promise<HandoffProviderNativeUploadResult> {
	if (input.provider !== "gemini") {
		return {
			files: input.files.map((file) => ({
				sourceManifestItemId: file.sourceManifestItemId,
				status: "failed",
				error: `Gemini browser handoff adapter cannot upload to ${input.provider}.`,
				retryable: false,
			})),
		};
	}
	return {
		files: input.files.map((file) => ({
			sourceManifestItemId: file.sourceManifestItemId,
			status: "uploaded",
			providerFileId: buildGeminiPromptAttachmentId(input.packageDigest, file),
		})),
	};
}

async function submitGeminiHandoffPrompt(
	service: Pick<GeminiService, "runPrompt">,
	input: HandoffProviderNativePromptInput,
): Promise<HandoffProviderNativePromptResult> {
	if (input.provider !== "gemini") {
		throw new Error(`Gemini browser handoff adapter cannot submit to ${input.provider}.`);
	}
	const result = await service.runPrompt({
		prompt: buildGeminiHandoffPrompt(input),
		attachments: input.uploadedFiles.map((file) => ({
			path: file.absolutePath,
			displayPath: file.filename,
			sizeBytes: file.sizeBytes,
		})),
		completionMode: "prompt_submitted",
		configuredUrl: input.conversationRef,
		conversationId: extractGeminiConversationId(input.conversationRef),
		projectId: input.projectRef,
		desiredModel: normalizeString(input.modelSelector),
		modelStrategy: normalizeString(input.modelSelector) ? "select" : undefined,
	});
	const targetConversationRef =
		normalizeString(result.url) ??
		(result.conversationId
			? `https://gemini.google.com/app/${encodeURIComponent(result.conversationId)}`
			: null) ??
		input.conversationRef;
	return {
		targetConversationRef,
		providerMessageId: normalizeString(result.tabTargetId)
			? `gemini-tab:${normalizeString(result.tabTargetId)}`
			: null,
		responseSummary: "Gemini browser handoff prompt submitted with selected attachments.",
		responseExcerpt: `Submitted ${input.uploadedFiles.length} selected attachment(s) through Gemini browser mode.`,
	};
}

function buildGeminiHandoffPrompt(input: HandoffProviderNativePromptInput): string {
	const compactContextJson = JSON.stringify(input.compactContext, null, 2);
	return [
		input.prompt.trimEnd(),
		"## Compact Context JSON",
		"```json",
		compactContextJson,
		"```",
		input.uploadedFiles.length > 0
			? [
					"## Attached Files",
					...input.uploadedFiles.map(
						(file) =>
							`- ${file.filename} (${file.sourceManifestItemId}, ${file.sizeBytes} bytes, ${file.checksumSha256})`,
					),
				].join("\n")
			: null,
	]
		.filter((part): part is string => Boolean(part))
		.join("\n\n");
}

function buildGeminiPromptAttachmentId(
	packageDigest: string,
	file: HandoffProviderNativeUploadInput["files"][number],
): string {
	const digest = createHash("sha256")
		.update(
			JSON.stringify({
				packageDigest,
				sourceManifestItemId: file.sourceManifestItemId,
				checksumSha256: file.checksumSha256,
			}),
		)
		.digest("hex")
		.slice(0, 32);
	return `gemini-prompt-attachment-${digest}`;
}

function extractGeminiConversationId(value: string | null): string | null {
	const normalized = normalizeString(value);
	if (!normalized) return null;
	try {
		const url = new URL(normalized);
		const match = url.pathname.match(/\/app\/([^/?#]+)/);
		return match?.[1] ? decodeURIComponent(match[1]) : null;
	} catch {
		const match = normalized.match(/\/app\/([^/?#]+)/);
		return match?.[1] ? decodeURIComponent(match[1]) : null;
	}
}

function normalizeString(value: unknown): string | null {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
