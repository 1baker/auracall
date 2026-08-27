import { describe, expect, it } from "vitest";
import { resolveAssistantMinTurnIndex } from "../../src/browser/actions/assistantTurnBoundary.js";

describe("resolveAssistantMinTurnIndex", () => {
	it("preserves the pre-submit boundary when commit verification observes new assistant wrappers", () => {
		expect(resolveAssistantMinTurnIndex(8, 12)).toBe(8);
	});

	it("derives a conservative boundary from the committed count only when pre-submit observation failed", () => {
		expect(resolveAssistantMinTurnIndex(null, 10)).toBe(9);
	});

	it("returns null when neither observation is usable", () => {
		expect(resolveAssistantMinTurnIndex(null, undefined)).toBeNull();
	});
});
