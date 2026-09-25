import { logDomFailure } from "../domDebug.js";
import type { BrowserLogger, BrowserModelStrategy, ChromeClient } from "../types.js";
import { buildClickDispatcher } from "./domEvents.js";

export type ChatgptComposerMode = "chat" | "work";

type ComposerModeOutcome =
	| { status: "already-selected" | "default-chat" | "switched"; mode: ChatgptComposerMode }
	| { status: "mode-not-found"; availableModes: string[]; controlsAbsent?: boolean }
	| { status: "selection-not-confirmed"; mode: ChatgptComposerMode };

export type ChatgptModelSelectionPlan =
	| { kind: "chat-model"; model: string; strategy: BrowserModelStrategy }
	| { kind: "work-model"; model: string; strategy: BrowserModelStrategy }
	| { kind: "work-current" }
	| { kind: "ignore" };

export function normalizeChatgptComposerMode(
	value: string | null | undefined,
): ChatgptComposerMode {
	if (value == null || value.trim().length === 0) return "chat";
	const normalized = value.trim().toLowerCase();
	if (normalized === "chat" || normalized === "work") return normalized;
	throw new Error(`Invalid ChatGPT mode: "${value}". Expected "chat" or "work".`);
}

export async function ensureChatgptComposerMode(
	Runtime: ChromeClient["Runtime"],
	desiredMode: ChatgptComposerMode,
	logger: BrowserLogger,
): Promise<void> {
	const deadline = Date.now() + 5_000;
	let result: ComposerModeOutcome | null | undefined;
	for (;;) {
		const outcome = await Runtime.evaluate({
			expression: buildChatgptComposerModeExpression(desiredMode),
			awaitPromise: true,
			returnByValue: true,
		});
		result = outcome.result?.value as ComposerModeOutcome | null | undefined;
		// Project pages can report readyState=complete before their composer and
		// mode controls hydrate. Only repeat a no-controls observation: never
		// repeat an uncertain click/selection or an explicitly unavailable mode.
		if (result?.status !== "mode-not-found" || result.controlsAbsent !== true || result.availableModes.length > 0 || Date.now() >= deadline) break;
		await new Promise((resolve) => setTimeout(resolve, Math.min(100, deadline - Date.now())));
	}
	const label = desiredMode === "chat" ? "Chat" : "Work";
	if (result?.status === "already-selected") {
		logger(`ChatGPT mode: ${label} (already selected)`);
		return;
	}
	if (result?.status === "default-chat") {
		logger("ChatGPT mode: Chat (default composer; no mode switcher present)");
		return;
	}
	if (result?.status === "switched") {
		logger(`ChatGPT mode: ${label}`);
		return;
	}
	await logDomFailure(Runtime, logger, "chatgpt-composer-mode");
	if (result?.status === "mode-not-found") {
		const available = result.availableModes.filter(Boolean);
		const hint = available.length > 0 ? ` Available: ${available.join(", ")}.` : "";
		throw new Error(`Unable to find the ChatGPT ${label} mode control.${hint}`);
	}
	throw new Error(`ChatGPT ${label} mode did not remain selected after activation.`);
}

export function resolveChatgptModelSelectionPlan(input: {
	mode: ChatgptComposerMode;
	desiredModel: string | null | undefined;
	workModel: string | null | undefined;
	strategy: BrowserModelStrategy;
}): ChatgptModelSelectionPlan {
	if (input.strategy === "ignore" || input.strategy === "current") return { kind: "ignore" };
	if (input.mode === "work") {
		const workModel = input.workModel?.trim();
		return workModel
			? { kind: "work-model", model: workModel, strategy: input.strategy }
			: { kind: "work-current" };
	}
	const desiredModel = input.desiredModel?.trim();
	return desiredModel
		? { kind: "chat-model", model: desiredModel, strategy: input.strategy }
		: { kind: "ignore" };
}

function buildChatgptComposerModeExpression(desiredMode: ChatgptComposerMode): string {
	const desiredLiteral = JSON.stringify(desiredMode);
	return `(async () => {
    ${buildClickDispatcher()}
    const DESIRED_MODE = ${desiredLiteral};
    const normalize = (value) => String(value ?? '').replace(/\\s+/g, ' ').trim().toLowerCase();
    const visible = (node) => {
      if (!(node instanceof HTMLElement)) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const isSelected = (node) =>
      node.getAttribute('aria-checked') === 'true' ||
      node.getAttribute('data-state') === 'on';
    const prompt = Array.from(document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]'))
      .filter(visible)
      .find((node) => {
        const label = normalize(
          node.getAttribute('aria-label') ||
          node.getAttribute('placeholder') ||
          node.textContent,
        );
        const currentProjectComposer =
          node.getAttribute('role') === 'textbox' &&
          node.getAttribute('contenteditable') === 'true' &&
          label.startsWith('new chat in ') &&
          label.length > 'new chat in '.length;
        return label === 'chat with chatgpt' || currentProjectComposer;
      });
    const promptComposerRoot = prompt?.closest('form[data-type="unified-composer"], form');
    const composerRoot = promptComposerRoot || document;
    const radios = Array.from(composerRoot.querySelectorAll('[role="radio"]'))
      .filter(visible)
      .map((node) => ({ node, label: normalize(node.textContent) }))
      .filter(({ label }) => label === 'chat' || label === 'work');
    const radioTarget = radios.find(({ label }) => label === DESIRED_MODE);
    if (radioTarget) {
      if (isSelected(radioTarget.node)) return { status: 'already-selected', mode: DESIRED_MODE };
      if (!dispatchClickSequence(radioTarget.node)) return { status: 'selection-not-confirmed', mode: DESIRED_MODE };
      const startedAt = performance.now();
      while (performance.now() - startedAt < 5000) {
        if (isSelected(radioTarget.node)) return { status: 'switched', mode: DESIRED_MODE };
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return { status: 'selection-not-confirmed', mode: DESIRED_MODE };
    }
    const modeTriggers = Array.from(composerRoot.querySelectorAll('button[aria-haspopup="menu"]'))
      .filter(visible)
      .map((node) => ({ node, label: normalize(node.textContent) }))
      .filter(({ label }) => label === 'chat' || label === 'work');
    const trigger = modeTriggers[0];
    const triggerLabel = trigger?.label;
    if (triggerLabel === DESIRED_MODE) {
      return { status: 'already-selected', mode: DESIRED_MODE };
    }
    if (!trigger && DESIRED_MODE === 'chat') {
      if (prompt && promptComposerRoot) return { status: 'default-chat', mode: DESIRED_MODE };
    }
    if (!trigger || !dispatchClickSequence(trigger.node)) {
      return {
        status: 'mode-not-found',
        controlsAbsent: !trigger && radios.length === 0 && modeTriggers.length === 0,
        availableModes: [...radios, ...modeTriggers]
          .map(({ node }) => String(node.textContent ?? '').trim()).filter(Boolean),
      };
    }
    const menuStartedAt = performance.now();
    while (performance.now() - menuStartedAt < 2000) {
      if (trigger.node.getAttribute('aria-expanded') === 'true') break;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    const menuItems = Array.from(document.querySelectorAll('[role="menuitemradio"]'))
      .filter(visible)
      .map((node) => ({ node, label: normalize(node.textContent) }))
      .filter(({ label }) => label === 'chat' || label === 'work');
    const target = menuItems.find(({ label }) => label === DESIRED_MODE);
    if (!target) {
      return {
        status: 'mode-not-found',
        availableModes: menuItems.map(({ node }) => String(node.textContent ?? '').trim()).filter(Boolean),
      };
    }
    if (!dispatchClickSequence(target.node)) return { status: 'selection-not-confirmed', mode: DESIRED_MODE };
    const startedAt = performance.now();
    while (performance.now() - startedAt < 5000) {
      if (normalize(trigger.node.textContent) === DESIRED_MODE || isSelected(target.node)) {
        return { status: 'switched', mode: DESIRED_MODE };
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return { status: 'selection-not-confirmed', mode: DESIRED_MODE };
  })()`;
}

export function buildChatgptComposerModeExpressionForTest(
	desiredMode: ChatgptComposerMode,
): string {
	return buildChatgptComposerModeExpression(desiredMode);
}

export const resolveChatgptModelSelectionPlanForTest = resolveChatgptModelSelectionPlan;
