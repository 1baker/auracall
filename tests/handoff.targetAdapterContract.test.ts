import { describe, expect, it } from "vitest";
import {
	DEFAULT_HANDOFF_TARGET_ADAPTER,
	HANDOFF_TARGET_ADAPTER_NAMES,
	isHandoffTargetAdapterName,
} from "../src/handoff/targetAdapterContract.js";
import { HANDOFF_TARGET_ADAPTER_OPTIONS } from "../ux/console/src/handoffAdapters.js";

describe("handoff target adapter contract", () => {
	it("defines the ordered closed-world adapter set and default", () => {
		expect(HANDOFF_TARGET_ADAPTER_NAMES).toEqual(["packet", "chatgpt-browser", "gemini-browser"]);
		expect(DEFAULT_HANDOFF_TARGET_ADAPTER).toBe("packet");
	});

	it("derives console option values from the shared adapter set", () => {
		expect(HANDOFF_TARGET_ADAPTER_OPTIONS.map(({ value }) => value)).toEqual(
			HANDOFF_TARGET_ADAPTER_NAMES,
		);
	});

	it("narrows only supported adapter names", () => {
		for (const adapterName of HANDOFF_TARGET_ADAPTER_NAMES) {
			expect(isHandoffTargetAdapterName(adapterName)).toBe(true);
		}
		expect(isHandoffTargetAdapterName("claude-browser")).toBe(false);
	});
});
