import { describe, expect, test } from "vitest";
import {
	buildChatgptContextCanaryArgs,
	selectChangedConversationContextReceipt,
	summarizeChatgptContextPayload,
} from "../../scripts/chatgpt-context-canary.js";

describe("chatgpt context canary", () => {
	test("builds one explicit refresh with cache fallback and retries disabled", () => {
		const args = buildChatgptContextCanaryArgs({
			profile: "wsl-chrome-3",
			conversationId: "6a40724d-8688-83ea-ab36-7458e921ed19",
			timeoutMs: 120_000,
		});

		expect(args).toEqual([
			"--profile",
			"wsl-chrome-3",
			"conversations",
			"context",
			"get",
			"6a40724d-8688-83ea-ab36-7458e921ed19",
			"--target",
			"chatgpt",
			"--refresh",
			"--retry-attempts",
			"0",
			"--timeout-ms",
			"120000",
			"--json-only",
		]);
	});

	test("reduces context to counts without retaining message or asset content", () => {
		const summary = summarizeChatgptContextPayload({
			conversationId: "conversation-safe",
			messages: [
				{ role: "user", text: "private prompt" },
				{ role: "assistant", text: "private answer" },
			],
			files: [{ id: "file-private", name: "private.docx" }],
			artifacts: [{ id: "artifact-private", title: "Private report" }],
			sources: [{ url: "https://private.example" }],
		});

		expect(summary).toEqual({
			conversationId: "conversation-safe",
			messageCount: 2,
			fileCount: 1,
			artifactCount: 1,
			sourceCount: 1,
		});
		expect(JSON.stringify(summary)).not.toMatch(/private prompt|private answer|private\.docx|private\.example/);
	});

	test("selects exactly one changed receipt and returns only its sanitized contract", () => {
		const selected = selectChangedConversationContextReceipt(
			new Map([["/cache/account-a/receipt.json", "old-hash"]]),
			[
				{
					path: "/cache/account-a/receipt.json",
					sha256: "new-hash",
					payload: {
						identityKey: "private identity envelope",
						items: {
							object: "conversation_context_read_receipt",
							version: 1,
							provider: "chatgpt",
							accountScopeHash: "scope-safe",
							conversationId: "conversation-safe",
							outcome: "succeeded",
							timeoutMs: 120_000,
							elapsedMs: 1_234,
							attemptCount: 1,
							lastStage: "complete",
							pendingOperation: null,
							completedAt: "2026-08-10T21:00:00.000Z",
							errorCode: null,
							privateField: "must not escape",
						},
					},
				},
			],
			"conversation-safe",
		);

		expect(selected).toEqual({
			object: "conversation_context_read_receipt",
			version: 1,
			provider: "chatgpt",
			accountScopeHash: "scope-safe",
			conversationId: "conversation-safe",
			outcome: "succeeded",
			timeoutMs: 120_000,
			elapsedMs: 1_234,
			attemptCount: 1,
			lastStage: "complete",
			pendingOperation: null,
			completedAt: "2026-08-10T21:00:00.000Z",
			errorCode: null,
		});
		expect(JSON.stringify(selected)).not.toContain("must not escape");
	});

	test("rejects ambiguous changed receipts", () => {
		expect(() =>
			selectChangedConversationContextReceipt(
				new Map(),
				[
					{ path: "/cache/a.json", sha256: "a", payload: {} },
					{ path: "/cache/b.json", sha256: "b", payload: {} },
				],
				"conversation-safe",
			),
		).toThrow(/exactly one changed conversation-context receipt/i);
	});
});
