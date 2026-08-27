import { describe, expect, test } from "vitest";
import {
	ASSISTANT_ROLE_SELECTOR,
	CONVERSATION_TURN_SELECTOR,
} from "../../src/browser/constants.ts";
import {
	buildAssistantExtractorForTest,
	buildConversationDebugExpressionForTest,
	buildCopyExpressionForTest,
	buildMarkdownFallbackExtractorForTest,
	getAssistantCompletionWatchdogThresholdsForTest,
} from "../../src/browser/pageActions.ts";

describe("browser automation expressions", () => {
	test("assistant extractor references constants", () => {
		const expression = buildAssistantExtractorForTest("capture");
		expect(expression).toContain(JSON.stringify(CONVERSATION_TURN_SELECTOR));
		expect(expression).toContain(JSON.stringify(ASSISTANT_ROLE_SELECTOR));
	});

	test("assistant extractor resolves stable identity from enclosing ChatGPT turn nodes", () => {
		const expression = buildAssistantExtractorForTest("capture");
		expect(expression).toContain("closest?.('[data-message-id]')");
		expect(expression).toContain("querySelector?.('[data-message-id]')");
		expect(expression).toContain(
			"closest?.('[data-turn-id], [data-testid^=\"conversation-turn\"]')",
		);
		expect(expression).toContain("getAttribute('data-turn-id')");
	});

	test("conversation debug expression references conversation selector", () => {
		const expression = buildConversationDebugExpressionForTest();
		expect(expression).toContain(JSON.stringify(CONVERSATION_TURN_SELECTOR));
	});

	test("markdown fallback filters user turns and respects assistant indicators", () => {
		const expression = buildMarkdownFallbackExtractorForTest("2");
		expect(expression).toContain("MIN_TURN_INDEX");
		expect(expression).toContain("role !== 'user'");
		expect(expression).toContain("copy-turn-action-button");
		expect(expression).toContain(CONVERSATION_TURN_SELECTOR);
	});

	test("copy expression scopes to assistant turn buttons", () => {
		const expression = buildCopyExpressionForTest({});
		expect(expression).toContain(JSON.stringify(CONVERSATION_TURN_SELECTOR));
		expect(expression).toContain(ASSISTANT_ROLE_SELECTOR);
		expect(expression).toContain("isAssistantTurn");
		expect(expression).toContain("copy-turn-action-button");
	});

	test("watchdog thresholds keep long streamed answers alive longer than medium answers", () => {
		expect(getAssistantCompletionWatchdogThresholdsForTest(8)).toEqual({
			completionStableTarget: 12,
			requiredStableCycles: 12,
			minStableMs: 8000,
		});
		expect(getAssistantCompletionWatchdogThresholdsForTest(32)).toEqual({
			completionStableTarget: 8,
			requiredStableCycles: 8,
			minStableMs: 1200,
		});
		expect(getAssistantCompletionWatchdogThresholdsForTest(120)).toEqual({
			completionStableTarget: 6,
			requiredStableCycles: 8,
			minStableMs: 2000,
		});
		expect(getAssistantCompletionWatchdogThresholdsForTest(700)).toEqual({
			completionStableTarget: 8,
			requiredStableCycles: 10,
			minStableMs: 3000,
		});
	});
});
