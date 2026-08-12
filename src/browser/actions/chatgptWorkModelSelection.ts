import { logDomFailure } from "../domDebug.js";
import type { BrowserLogger, BrowserModelStrategy, ChromeClient } from "../types.js";
import { buildClickDispatcher } from "./domEvents.js";

type WorkModelOutcome =
	| { status: "already-selected" | "switched"; label?: string | null }
	| { status: "trigger-not-found" }
	| { status: "option-not-found"; availableOptions?: string[] }
	| { status: "selection-not-confirmed"; label?: string | null };

export async function ensureChatgptWorkModelSelection(
	Runtime: ChromeClient["Runtime"],
	desiredModel: string,
	logger: BrowserLogger,
	strategy: BrowserModelStrategy,
): Promise<void> {
	const outcome = await Runtime.evaluate({
		expression: buildChatgptWorkModelSelectionExpression(desiredModel, strategy),
		awaitPromise: true,
		returnByValue: true,
	});
	const result = outcome.result?.value as WorkModelOutcome | null | undefined;
	if (result?.status === "already-selected" || result?.status === "switched") {
		logger(`Work model picker: ${result.label ?? desiredModel}`);
		return;
	}
	await logDomFailure(Runtime, logger, "chatgpt-work-model-selector");
	if (result?.status === "option-not-found") {
		const available = result.availableOptions?.filter(Boolean) ?? [];
		const hint = available.length > 0 ? ` Available: ${available.join(", ")}.` : "";
		throw new Error(`Unable to find Work model option matching "${desiredModel}".${hint}`);
	}
	if (result?.status === "trigger-not-found") {
		throw new Error(
			"Unable to locate the dedicated ChatGPT Work model selector. AuraCall did not fall back to the Chat model picker.",
		);
	}
	throw new Error(`ChatGPT Work model "${desiredModel}" did not remain selected after activation.`);
}

function buildChatgptWorkModelSelectionExpression(
	desiredModel: string,
	strategy: BrowserModelStrategy,
): string {
	const desiredLiteral = JSON.stringify(desiredModel);
	const strategyLiteral = JSON.stringify(strategy);
	return `(async () => {
    ${buildClickDispatcher()}
    const DESIRED_MODEL = ${desiredLiteral};
    const STRATEGY = ${strategyLiteral};
    const normalize = (value) => String(value ?? '').replace(/[^a-z0-9]+/gi, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
    const visible = (node) => {
      if (!(node instanceof HTMLElement)) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const selectedWork = Array.from(document.querySelectorAll('[role="radio"]'))
      .find((node) => visible(node) && normalize(node.textContent) === 'work' &&
        (node.getAttribute('aria-checked') === 'true' || node.getAttribute('data-state') === 'on'));
    if (!selectedWork) return { status: 'trigger-not-found' };
    const workRoot = selectedWork.closest('[data-mode="work"], [data-chat-mode="work"], [data-testid*="work"]');
    const roots = workRoot ? [workRoot] : [];
    const triggers = roots.flatMap((root) => Array.from(root.querySelectorAll(
      'button[aria-label*="model" i], [data-testid*="work-model"], [data-testid*="model-selector"]'
    ))).filter(visible);
    const trigger = triggers.find((node) => normalize([
      node.getAttribute('aria-label'), node.getAttribute('data-testid'), node.textContent,
    ].filter(Boolean).join(' ')).includes('model'));
    if (!trigger) return { status: 'trigger-not-found' };
    if (!dispatchClickSequence(trigger)) return { status: 'selection-not-confirmed' };
    await new Promise((resolve) => setTimeout(resolve, 150));
    const target = normalize(DESIRED_MODEL);
    const options = Array.from(document.querySelectorAll(
      '[role="menu"] [role="menuitemradio"], [role="listbox"] [role="option"], [role="radiogroup"] [role="radio"]'
    )).filter((node) => visible(node) && !['chat', 'work'].includes(normalize(node.textContent)));
    const labels = options.map((node) => String(node.textContent ?? '').replace(/\\s+/g, ' ').trim()).filter(Boolean);
    const selected = options.find((node) => node.getAttribute('aria-checked') === 'true' ||
      node.getAttribute('aria-selected') === 'true' || node.getAttribute('data-state') === 'on');
    if (STRATEGY === 'current') {
      return selected
        ? { status: 'already-selected', label: String(selected.textContent ?? '').trim() }
        : { status: 'selection-not-confirmed' };
    }
    const match = options.find((node) => normalize(node.textContent) === target);
    if (!match) return { status: 'option-not-found', availableOptions: labels };
    const alreadySelected = match.getAttribute('aria-checked') === 'true' ||
      match.getAttribute('aria-selected') === 'true' || match.getAttribute('data-state') === 'on';
    if (alreadySelected) {
      return { status: 'already-selected', label: String(match.textContent ?? '').trim() };
    }
    if (!dispatchClickSequence(match)) return { status: 'selection-not-confirmed' };
    const startedAt = performance.now();
    while (performance.now() - startedAt < 5000) {
      if (match.getAttribute('aria-checked') === 'true' || match.getAttribute('aria-selected') === 'true' ||
        match.getAttribute('data-state') === 'on') {
        return { status: 'switched', label: String(match.textContent ?? '').trim() };
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return { status: 'selection-not-confirmed', label: String(match.textContent ?? '').trim() };
  })()`;
}

export function buildChatgptWorkModelSelectionExpressionForTest(desiredModel: string): string {
	return buildChatgptWorkModelSelectionExpression(desiredModel, "select");
}
