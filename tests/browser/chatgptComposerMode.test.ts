import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
	buildChatgptComposerModeExpressionForTest,
	ensureChatgptComposerMode,
	resolveChatgptModelSelectionPlanForTest,
} from "../../src/browser/actions/chatgptComposerMode.js";
import { buildChatgptWorkModelSelectionExpressionForTest } from "../../src/browser/actions/chatgptWorkModelSelection.js";

class FixtureElement extends EventTarget {
	textContent: string;
	private readonly attributes = new Map<string, string>();
	onClick?: () => void;
	closestResult: FixtureElement | null = null;
	querySelectorAllResult: FixtureElement[] = [];

	constructor(text: string, attributes: Record<string, string> = {}) {
		super();
		this.textContent = text;
		for (const [name, value] of Object.entries(attributes)) this.attributes.set(name, value);
	}

	getAttribute(name: string): string | null {
		return this.attributes.get(name) ?? null;
	}

	setAttribute(name: string, value: string): void {
		this.attributes.set(name, value);
	}

	getBoundingClientRect() {
		return { left: 0, top: 0, width: 100, height: 30 };
	}

	closest(): FixtureElement | null {
		return this.closestResult;
	}

	querySelectorAll(): FixtureElement[] {
		return this.querySelectorAllResult;
	}

	click(): void {
		this.onClick?.();
	}

	override dispatchEvent(event: Event): boolean {
		if (event.type === "click") this.onClick?.();
		return true;
	}
}

class FixtureMouseEvent extends Event {}

function installFixtureDocument(query: (selector: string) => FixtureElement[]): void {
	vi.stubGlobal("Element", FixtureElement);
	vi.stubGlobal("HTMLElement", FixtureElement);
	vi.stubGlobal("MouseEvent", FixtureMouseEvent);
	vi.stubGlobal("PointerEvent", FixtureMouseEvent);
	vi.stubGlobal("window", Object.fromEntries([["PointerEvent", FixtureMouseEvent]]));
	vi.stubGlobal("getComputedStyle", () => ({ visibility: "visible", display: "block" }));
	vi.stubGlobal("document", { querySelectorAll: query });
}

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("ChatGPT composer mode", () => {
	it("waits for project mode controls to hydrate without repeating uncertain selection", async () => {
		vi.useFakeTimers();
		const evaluate = vi.fn()
			.mockResolvedValueOnce({ result: { value: { status: "mode-not-found", availableModes: [], controlsAbsent: true } } })
			.mockResolvedValue({ result: { value: { status: "already-selected", mode: "chat" } } });
		const pending = ensureChatgptComposerMode({ evaluate } as never, "chat", vi.fn<(message: string) => void>());
		await vi.advanceTimersByTimeAsync(100);
		await pending;
		expect(evaluate).toHaveBeenCalledTimes(2);
	});

	it("bounds missing-control hydration checks and fails when they never appear", async () => {
		vi.useFakeTimers();
		const evaluate = vi.fn().mockResolvedValue({ result: { value: { status: "mode-not-found", availableModes: [], controlsAbsent: true } } });
		const pending = expect(ensureChatgptComposerMode({ evaluate } as never, "chat", vi.fn<(message: string) => void>())).rejects.toThrow("Chat mode control");
		await vi.advanceTimersByTimeAsync(5_000);
		await pending;
		expect(evaluate).toHaveBeenCalledTimes(51);
	});

	it("does not retry an uncertain selection", async () => {
		const evaluate = vi.fn().mockResolvedValue({ result: { value: { status: "selection-not-confirmed", mode: "chat" } } });
		await expect(ensureChatgptComposerMode({ evaluate } as never, "chat", vi.fn<(message: string) => void>())).rejects.toThrow("did not remain selected");
		expect(evaluate).toHaveBeenCalledOnce();
	});

	it("does not repeat a menu activation when no menu items were recognized", async () => {
		const evaluate = vi.fn().mockResolvedValue({ result: { value: { status: "mode-not-found", availableModes: [] } } });
		await expect(ensureChatgptComposerMode({ evaluate } as never, "work", vi.fn<(message: string) => void>())).rejects.toThrow("Work mode control");
		expect(evaluate).toHaveBeenCalledOnce();
	});

	it("marks only a no-controls DOM observation as safe to repeat", async () => {
		installFixtureDocument(() => []);
		const result = await new Function(`return ${buildChatgptComposerModeExpressionForTest("chat")}`)();
		expect(result).toEqual({ status: "mode-not-found", availableModes: [], controlsAbsent: true });
	});
	it("targets exact Chat and Work radios and verifies Radix selected state", () => {
		const expression = buildChatgptComposerModeExpressionForTest("chat");

		expect(() => new Function(`return ${expression}`)).not.toThrow();
		expect(expression).toContain('[role="radio"]');
		expect(expression).toContain("label === 'chat' || label === 'work'");
		expect(expression).toContain("getAttribute('aria-checked') === 'true'");
		expect(expression).toContain("getAttribute('data-state') === 'on'");
	});

	it("supports the current mode trigger plus menuitemradio surface", () => {
		const expression = buildChatgptComposerModeExpressionForTest("work");

		expect(expression).toContain('button[aria-haspopup="menu"]');
		expect(expression).toContain('[role="menuitemradio"]');
		expect(expression).toContain("getAttribute('aria-expanded') === 'true'");
		expect(expression).toContain("triggerLabel === DESIRED_MODE");
	});

	it("switches the observed Chat menu trigger to Work provider-free", async () => {
		const chatTrigger = new FixtureElement("Chat", {
			"aria-haspopup": "menu",
			"aria-expanded": "false",
		});
		const chatOption = new FixtureElement("Chat", { "aria-checked": "true" });
		const workOption = new FixtureElement("Work", { "aria-checked": "false" });
		let menuOpen = false;
		chatTrigger.onClick = () => {
			menuOpen = true;
			chatTrigger.setAttribute("aria-expanded", "true");
		};
		workOption.onClick = () => {
			workOption.setAttribute("aria-checked", "true");
			chatTrigger.textContent = "Work";
		};
		installFixtureDocument((selector) => {
			if (selector === '[role="radio"]') return [];
			if (selector === 'button[aria-haspopup="menu"]') return [chatTrigger];
			if (selector === '[role="menuitemradio"]') return menuOpen ? [chatOption, workOption] : [];
			return [];
		});

		const expression = buildChatgptComposerModeExpressionForTest("work");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "switched", mode: "work" });
		expect(chatTrigger.textContent).toBe("Work");
	});

	it("accepts the already-selected Chat radio", async () => {
		const evaluate = vi.fn().mockResolvedValue({
			result: { value: { status: "already-selected", mode: "chat" } },
		});
		const logger = vi.fn();

		await ensureChatgptComposerMode({ evaluate } as never, "chat", logger);

		expect(logger).toHaveBeenCalledWith("ChatGPT mode: Chat (already selected)");
	});

	it("accepts the default Chat composer when the mode switcher is absent", async () => {
		const composer = new FixtureElement("", { placeholder: "Chat with ChatGPT" });
		installFixtureDocument((selector) => {
			if (selector === '[role="radio"]' || selector === 'button[aria-haspopup="menu"]') return [];
			if (selector === 'textarea, [contenteditable="true"], [role="textbox"]') return [composer];
			return [];
		});

		const expression = buildChatgptComposerModeExpressionForTest("chat");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "default-chat", mode: "chat" });
	});

	it("ignores unrelated Work menu buttons outside the unified composer", async () => {
		const composer = new FixtureElement("", { "aria-label": "Chat with ChatGPT" });
		const unrelatedWork = new FixtureElement("Work", {
			"aria-haspopup": "menu",
			"aria-expanded": "false",
		});
		const composerForm = new FixtureElement("");
		composer.closestResult = composerForm;
		(composerForm as FixtureElement & { querySelectorAll: typeof installFixtureDocument }).querySelectorAll =
			(() => []) as never;
		installFixtureDocument((selector) => {
			if (selector === 'textarea, [contenteditable="true"], [role="textbox"]') return [composer];
			if (selector === 'button[aria-haspopup="menu"]') return [unrelatedWork];
			return [];
		});

		const expression = buildChatgptComposerModeExpressionForTest("chat");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "default-chat", mode: "chat" });
	});

	it("fails clearly when explicit Work is unavailable", async () => {
		const evaluate = vi.fn().mockResolvedValue({
			result: { value: { status: "mode-not-found", availableModes: ["Chat"] } },
		});

		const logger = vi.fn<(message: string) => void>();

		await expect(ensureChatgptComposerMode({ evaluate } as never, "work", logger)).rejects.toThrow(
			/Work.*Available: Chat/i,
		);
	});

	it("routes Chat and Work model selection through disjoint plans", () => {
		expect(
			resolveChatgptModelSelectionPlanForTest({
				mode: "chat",
				desiredModel: "GPT-5.6 Terra",
				workModel: null,
				strategy: "select",
			}),
		).toEqual({ kind: "chat-model", model: "GPT-5.6 Terra", strategy: "select" });

		expect(
			resolveChatgptModelSelectionPlanForTest({
				mode: "chat",
				desiredModel: "GPT-5.6 Luna",
				workModel: null,
				strategy: "current",
			}),
		).toEqual({ kind: "chat-model", model: "GPT-5.6 Luna", strategy: "current" });

		expect(
			resolveChatgptModelSelectionPlanForTest({
				mode: "work",
				desiredModel: "GPT-5.6 Terra",
				workModel: null,
				strategy: "select",
			}),
		).toEqual({ kind: "work-current" });

		expect(
			resolveChatgptModelSelectionPlanForTest({
				mode: "work",
				desiredModel: "GPT-5.6 Terra",
				workModel: "Research",
				strategy: "select",
			}),
		).toEqual({ kind: "work-model", model: "Research", strategy: "select" });
	});

	it("uses the current Work slider and nested model menu without Chat picker controls", () => {
		const expression = buildChatgptWorkModelSelectionExpressionForTest("GPT-5.6 Terra");

		expect(() => new Function(`return ${expression}`)).not.toThrow();
		expect(expression).toContain('[data-animated-slider-trigger="true"]');
		expect(expression).toContain("label === 'show advanced options'");
		expect(expression).toContain("label.startsWith('model ')");
		expect(expression).toContain('[role="menuitemradio"]');
		expect(expression).toContain("replace(/^gpt\\s+/, '')");
		expect(expression).not.toContain("model-switcher-dropdown-button");
		expect(expression).not.toContain("Switch model");
		expect(expression).toContain("performance.now() - startedAt < 5000");
	});

	it("selects an observed nested Work model provider-free", async () => {
		const workTrigger = new FixtureElement("Work", { "aria-haspopup": "menu" });
		const sliderMarker = new FixtureElement("");
		const modelTrigger = new FixtureElement("5.6 Sol Light", { "aria-haspopup": "menu" });
		sliderMarker.closestResult = modelTrigger;
		const advanced = new FixtureElement("Show advanced options");
		const modelMenu = new FixtureElement("Model GPT-5.6 Sol", {
			"aria-haspopup": "menu",
			"aria-expanded": "false",
		});
		const sol = new FixtureElement("GPT-5.6 Sol", { "aria-checked": "true" });
		const terra = new FixtureElement("GPT-5.6 Terra", { "aria-checked": "false" });
		let compactOpen = false;
		let advancedOpen = false;
		let modelOpen = false;
		modelTrigger.onClick = () => {
			compactOpen = true;
		};
		advanced.onClick = () => {
			advancedOpen = true;
		};
		modelMenu.onClick = () => {
			modelOpen = true;
			modelMenu.setAttribute("aria-expanded", "true");
		};
		terra.onClick = () => {
			terra.setAttribute("aria-checked", "true");
			modelTrigger.textContent = "5.6 Terra Light";
		};
		installFixtureDocument((selector) => {
			if (selector === '[role="radio"], [role="menuitemradio"]') return [];
			if (selector === 'button[aria-haspopup="menu"]') return [workTrigger, modelTrigger];
			if (selector === '[data-animated-slider-trigger="true"]') return [sliderMarker];
			if (selector === '[role="menuitem"]') return compactOpen ? [advanced] : [];
			if (selector === '[role="menuitem"][aria-haspopup="menu"]') {
				return advancedOpen ? [modelMenu] : [];
			}
			if (selector === '[role="menuitemradio"]') return modelOpen ? [sol, terra] : [];
			return [];
		});

		const expression = buildChatgptWorkModelSelectionExpressionForTest("GPT-5.6 Terra");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "switched", label: "GPT-5.6 Terra" });
		expect(modelTrigger.textContent).toBe("5.6 Terra Light");
	});

	it("accepts the current Work model on an established slugged Project conversation", async () => {
		const workBadge = new FixtureElement("Work");
		const activeConversation = new FixtureElement("Clean Room Proposal ReviewWork", {
			href: "/g/g-p-6a8bc9d6f0408191bba2b2cbf816e63a/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
			"data-active": "",
		});
		activeConversation.querySelectorAllResult = [workBadge];
		const sliderMarker = new FixtureElement("");
		const modelTrigger = new FixtureElement("5.6 SolHigh", { "aria-haspopup": "menu" });
		sliderMarker.closestResult = modelTrigger;
		vi.stubGlobal("location", {
			href: "https://chatgpt.com/g/g-p-6a8bc9d6f0408191bba2b2cbf816e63a-frakktal-t3cp-clean-room-proposal-replay/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
			pathname:
				"/g/g-p-6a8bc9d6f0408191bba2b2cbf816e63a-frakktal-t3cp-clean-room-proposal-replay/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
		});
		installFixtureDocument((selector) => {
			if (selector === '[role="radio"], [role="menuitemradio"]') return [];
			if (selector === 'button[aria-haspopup="menu"]') return [modelTrigger];
			if (selector === '[data-animated-slider-trigger="true"]') return [sliderMarker];
			if (selector === "a[href][data-active]") return [activeConversation];
			return [];
		});

		const expression = buildChatgptWorkModelSelectionExpressionForTest("GPT-5.6 Sol");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "already-selected", label: "5.6 SolHigh" });
	});

	it("does not use an established Work badge from a different Project for model selection", async () => {
		const workBadge = new FixtureElement("Work");
		const activeConversation = new FixtureElement("Wrong ProjectWork", {
			href: "/g/g-p-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
			"data-active": "",
		});
		activeConversation.querySelectorAllResult = [workBadge];
		const sliderMarker = new FixtureElement("");
		const modelTrigger = new FixtureElement("5.6 SolHigh", { "aria-haspopup": "menu" });
		sliderMarker.closestResult = modelTrigger;
		vi.stubGlobal("location", {
			href: "https://chatgpt.com/g/g-p-6a8bc9d6f0408191bba2b2cbf816e63a-frakktal-t3cp-clean-room-proposal-replay/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
			pathname:
				"/g/g-p-6a8bc9d6f0408191bba2b2cbf816e63a-frakktal-t3cp-clean-room-proposal-replay/c/6a8be0ba-011c-83ea-96b7-6c3cd3ff3ea4",
		});
		installFixtureDocument((selector) => {
			if (selector === '[role="radio"], [role="menuitemradio"]') return [];
			if (selector === 'button[aria-haspopup="menu"]') return [modelTrigger];
			if (selector === '[data-animated-slider-trigger="true"]') return [sliderMarker];
			if (selector === "a[href][data-active]") return [activeConversation];
			return [];
		});

		const expression = buildChatgptWorkModelSelectionExpressionForTest("GPT-5.6 Sol");
		const result = await new Function(`return ${expression}`)();

		expect(result).toEqual({ status: "trigger-not-found" });
	});
});
