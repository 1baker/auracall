import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
	bindRecoveredResponse,
	RECOVERY_RESPONSE_SNAPSHOT,
} from "../../src/browser/service/recoveryResponseBinding.js";

const url = "https://chatgpt.com/c/recovery-streaming-test";
const prompt = "Generate the requested document.";

function snapshotWithStreamingStatus(visible: boolean) {
	const message = (role: string, id: string, text: string) => ({
		getAttribute: (name: string) => (name === "data-message-author-role" ? role : id),
		cloneNode: () => ({ textContent: text, querySelectorAll: () => [] }),
	});
	const status = {
		getBoundingClientRect: () => ({ width: visible ? 20 : 0, height: visible ? 20 : 0 }),
	};
	return runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, {
		location: { href: url },
		document: {
			querySelector: () => null,
			querySelectorAll: (selector: string) =>
				selector === "[data-message-author-role]"
					? [
							message("user", "user-1", prompt),
							message("assistant", "answer-1", "Partial document response"),
						]
					: selector === "[data-streaming-response-status]"
						? [status]
						: [],
		},
		window: { getComputedStyle: () => ({ display: "block", visibility: "visible", opacity: "1" }) },
	});
}

describe("recovery response streaming boundary", () => {
	it("accepts only uniquely identified later-turn generation", () => {
		const messages = [
			{ role: "user", id: "u1", text: prompt },
			{ role: "assistant", id: "a1", text: "Completed answer" },
			{ role: "user", id: "u2", text: "Different later prompt" },
		];
		const snapshot = { url, messages, generating: true,
			generationScope: { version: 1, unscoped: false, owners: ["u2"] } };
		expect(bindRecoveredResponse(snapshot, prompt, url).answerMessageId).toBe("a1");
		for (const owners of [["u1"], [null], ["missing"], [], ["u2", null], ["a1"]]) {
			expect(() => bindRecoveredResponse({ ...snapshot,
				generationScope: { version: 1, unscoped: false, owners } }, prompt, url)).toThrow();
		}
		for (const generationScope of [undefined, { version: 2, unscoped: false, owners: ["u2"] },
			{ version: 1, unscoped: true, owners: ["u2"] }]) {
			expect(() => bindRecoveredResponse({ ...snapshot, generationScope }, prompt, url)).toThrow();
		}
		expect(() => bindRecoveredResponse({ ...snapshot,
			messages: [...messages, { role: "user", id: "u2", text: "duplicate" }] }, prompt, url)).toThrow();
	});

	it("extracts later status ownership from its assistant section without changing the DOM", () => {
		const turn = { getAttribute: () => "later-turn", querySelector: () => null };
		const nodes = [
			["user", "u1", prompt], ["assistant", "a1", "Completed answer"],
			["user", "u2", "Later request"],
		].map(([role, id, text]) => ({
			getAttribute: (name: string) => name === "data-message-author-role" ? role : id,
			cloneNode: () => ({ textContent: text, querySelectorAll: () => [] }),
			compareDocumentPosition: (): number => 4,
		}));
		const status = { getBoundingClientRect: () => ({ width: 20, height: 20 }), closest: () => turn };
		const context = {
			location: { href: url },
			document: { querySelector: () => null, querySelectorAll: (selector: string) =>
				selector === "[data-message-author-role]" ? nodes : [status] },
			window: { getComputedStyle: () => ({ display: "block", visibility: "visible", opacity: "1" }) },
		};
		const snapshot = runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, context);
		expect(snapshot.generationScope.owners).toEqual(["u2"]);
		expect(bindRecoveredResponse(snapshot, prompt, url).answerMessageId).toBe("a1");
		nodes[2]!.compareDocumentPosition = () => 2;
		expect(() => bindRecoveredResponse(runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, context), prompt, url)).toThrow();
		nodes.forEach(node => { node.compareDocumentPosition = () => 5; });
		expect(() => bindRecoveredResponse(runInNewContext(RECOVERY_RESPONSE_SNAPSHOT, context), prompt, url)).toThrow();
	});
	it("rejects the partial answer when streaming status replaces the Stop button", () => {
		const snapshot = snapshotWithStreamingStatus(true);
		expect(snapshot.generating).toBe(true);
		expect(() => bindRecoveredResponse(snapshot, prompt, url)).toThrow();
	});

	it("does not treat a hidden stale streaming status as active generation", () => {
		const snapshot = snapshotWithStreamingStatus(false);
		expect(snapshot.generating).toBe(false);
		expect(bindRecoveredResponse(snapshot, prompt, url).answerMessageId).toBe("answer-1");
	});
});
