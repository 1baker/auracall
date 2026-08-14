import { describe, expect, it } from "vitest";
import {
	buildHandoffActionBody,
	DEFAULT_HANDOFF_TARGET_ADAPTER,
	HANDOFF_TARGET_ADAPTER_OPTIONS,
} from "../ux/console/src/handoffAdapters.js";

describe("operator console handoff adapter contract", () => {
	it("offers the closed-world HTTP adapter set with packet as the default", () => {
		expect(DEFAULT_HANDOFF_TARGET_ADAPTER).toBe("packet");
		expect(HANDOFF_TARGET_ADAPTER_OPTIONS).toEqual([
			{ value: "packet", label: "Packet" },
			{ value: "chatgpt-browser", label: "ChatGPT browser" },
			{ value: "gemini-browser", label: "Gemini browser" },
		]);
	});

	it("sends the selected adapter only for live recovery", () => {
		expect(buildHandoffActionBody("recover-live", " /tmp/handoffs ", "gemini-browser")).toEqual({
			outputDir: "/tmp/handoffs",
			targetAdapter: "gemini-browser",
		});
		expect(buildHandoffActionBody("status", "", "chatgpt-browser")).toEqual({});
		expect(buildHandoffActionBody("repair", "/tmp/handoffs", "chatgpt-browser")).toEqual({
			outputDir: "/tmp/handoffs",
		});
	});
});
