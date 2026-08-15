import path from "node:path";
import {
	ensureServicesRegistry,
	normalizeServiceModelToken,
	resolveServiceModelLabels,
} from "../../services/registry.js";
import { pressButton, pressButtonWithTrustedPointer, waitForPredicate } from "../service/ui.js";
import type { BrowserAttachment, BrowserLogger, ChromeClient } from "../types.js";

const GEMINI_MODEL_PICKER_SELECTOR = [
	'button[data-test-id="bard-mode-menu-button"]',
	'button[aria-label="Open mode picker"]',
	'button[aria-label*="Model"]',
].join(",");

const GEMINI_MODEL_OPTION_SELECTOR = [
	'[role="menuitemradio"]',
	'[role="menuitem"]',
	".mat-mdc-menu-item",
	".cdk-overlay-pane button",
].join(",");

const GEMINI_PROMPT_UPLOAD_TRIGGER_SELECTOR = 'button[aria-label="Open upload file menu"]';
const GEMINI_PROMPT_UPLOAD_ITEM_SELECTOR = '[data-test-id="local-images-files-uploader-button"]';

type GeminiModelSelectionDeps = {
	ensureServicesRegistryImpl?: typeof ensureServicesRegistry;
	pressButtonImpl?: typeof pressButton;
	waitForPredicateImpl?: typeof waitForPredicate;
};

type GeminiAttachmentDeps = {
	pressButtonWithTrustedPointerImpl?: typeof pressButtonWithTrustedPointer;
	waitForPredicateImpl?: typeof waitForPredicate;
	chooserTimeoutMs?: number;
};

function normalizeGeminiModelLabel(value: string): string {
	return normalizeServiceModelToken(value).replace(/^gemini\s+/, "");
}

function buildGeminiModelCandidates(labels: string[], fallback: string): string[] {
	return Array.from(
		new Set(
			[...labels, fallback]
				.flatMap((label) => [normalizeServiceModelToken(label), normalizeGeminiModelLabel(label)])
				.filter(Boolean),
		),
	);
}

const GEMINI_MODEL_MENU_INSPECTION = `(() => {
  const normalize = (value) => String(value ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[\\u2022•]+/g, ' ')
    .replace(/[_.-]+/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim()
    .toLowerCase();
  const visible = (node) => {
    if (!(node instanceof Element)) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  };
  const labelOf = (node) => {
    const explicit = node.getAttribute?.('aria-label') || node.getAttribute?.('data-model-label');
    const titled = node.querySelector?.('[data-test-id*="title"], [class*="title"]')?.textContent;
    const firstLine = String(node.innerText || node.textContent || '').split(/\\r?\\n/).find(Boolean);
    return String(explicit || titled || firstLine || '').replace(/\\s+/g, ' ').trim();
  };
  const items = Array.from(document.querySelectorAll(${JSON.stringify(GEMINI_MODEL_OPTION_SELECTOR)}))
    .filter(visible)
    .map((node) => ({
      node,
      label: labelOf(node),
      normalized: normalize(labelOf(node)).replace(/^gemini\\s+/, ''),
      disabled:
        node.getAttribute?.('aria-disabled') === 'true' ||
        (node instanceof HTMLButtonElement && node.disabled),
      selected:
        node.getAttribute?.('aria-checked') === 'true' ||
        node.getAttribute?.('aria-selected') === 'true' ||
        node.getAttribute?.('data-selected') === 'true' ||
        /(^|\\s)(selected|active)(\\s|$)/i.test(String(node.className || '')),
    }))
    .filter((entry) => entry.label && !/^(tools?|upload|new chat)$/i.test(entry.label));
  return { normalize, visible, labelOf, items };
})()`;

export async function selectGeminiModel(
	client: Pick<ChromeClient, "Runtime" | "Input">,
	desiredModel: string,
	logger: BrowserLogger = () => undefined,
	deps: GeminiModelSelectionDeps = {},
): Promise<void> {
	const ensureRegistry = deps.ensureServicesRegistryImpl ?? ensureServicesRegistry;
	const press = deps.pressButtonImpl ?? pressButton;
	const wait = deps.waitForPredicateImpl ?? waitForPredicate;
	const registry = await ensureRegistry();
	const resolvedLabels = resolveServiceModelLabels(registry, "gemini", desiredModel);
	const candidates = buildGeminiModelCandidates(resolvedLabels, desiredModel);

	if (resolvedLabels.length === 0 || candidates.length === 0) {
		throw new Error(
			`Unsupported Gemini model "${desiredModel}"; no bundled picker label is registered.`,
		);
	}

	const opened = await press(client.Runtime, {
		selector: GEMINI_MODEL_PICKER_SELECTOR,
		interactionStrategies: ["pointer", "click"],
		timeoutMs: 10_000,
	});
	if (!opened.ok) {
		throw new Error(
			`Unable to open the Gemini model picker: ${opened.reason ?? "trigger unavailable."}`,
		);
	}

	const menuReady = await wait(
		client.Runtime,
		`(() => {
      const state = ${GEMINI_MODEL_MENU_INSPECTION};
      return state.items.length > 0
        ? { available: state.items.map((entry) => entry.label).slice(0, 12) }
        : null;
    })()`,
		{ timeoutMs: 5_000, description: "Gemini model picker options" },
	);
	if (!menuReady.ok) {
		throw new Error("Gemini model picker opened but exposed no visible model options.");
	}

	const located = await client.Runtime.evaluate({
		expression: `(() => {
      const state = ${GEMINI_MODEL_MENU_INSPECTION};
      const candidates = ${JSON.stringify(candidates)};
      const target = state.items.find((entry) => candidates.includes(entry.normalized));
      if (!target) {
        return { ok: false, available: state.items.map((entry) => entry.label).slice(0, 12) };
      }
      if (target.disabled) {
        return { ok: false, disabled: true, label: target.label, available: state.items.map((entry) => entry.label).slice(0, 12) };
      }
      target.node.scrollIntoView({ block: 'center', inline: 'center' });
      const rect = target.node.getBoundingClientRect();
      return {
        ok: true,
        label: target.label,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    })()`,
		returnByValue: true,
	});
	const target = located.result?.value as
		| {
				ok?: boolean;
				disabled?: boolean;
				label?: string;
				available?: string[];
				x?: number;
				y?: number;
		  }
		| undefined;
	if (!target?.ok || typeof target.x !== "number" || typeof target.y !== "number") {
		const available = (target?.available ?? []).filter(Boolean);
		const availableHint = available.length > 0 ? ` Available: ${available.join(", ")}.` : "";
		const disabledHint = target?.disabled
			? ` Matching option ${JSON.stringify(target.label)} is disabled.`
			: "";
		throw new Error(
			`Unable to select exact Gemini model "${resolvedLabels[0]}".${disabledHint}${availableHint}`,
		);
	}

	await client.Input.dispatchMouseEvent({ type: "mouseMoved", x: target.x, y: target.y });
	await client.Input.dispatchMouseEvent({
		type: "mousePressed",
		x: target.x,
		y: target.y,
		button: "left",
		clickCount: 1,
	});
	await client.Input.dispatchMouseEvent({
		type: "mouseReleased",
		x: target.x,
		y: target.y,
		button: "left",
		clickCount: 1,
	});

	const verificationExpression = `(() => {
    const state = ${GEMINI_MODEL_MENU_INSPECTION};
    const candidates = ${JSON.stringify(candidates)};
    const trigger = Array.from(document.querySelectorAll(${JSON.stringify(GEMINI_MODEL_PICKER_SELECTOR)}))
      .find(state.visible);
    const triggerLabel = trigger ? state.normalize(state.labelOf(trigger)).replace(/^gemini\\s+/, '') : '';
    if (candidates.includes(triggerLabel)) {
      return { selected: true, label: state.labelOf(trigger), source: 'trigger' };
    }
    const selected = state.items.find((entry) => entry.selected && candidates.includes(entry.normalized));
    return selected ? { selected: true, label: selected.label, source: 'selected-row' } : null;
  })()`;
	let verified = await wait(client.Runtime, verificationExpression, {
		timeoutMs: 1_500,
		description: "Gemini selected model state",
	});
	if (!verified.ok) {
		const reopened = await press(client.Runtime, {
			selector: GEMINI_MODEL_PICKER_SELECTOR,
			interactionStrategies: ["pointer", "click"],
			timeoutMs: 5_000,
		});
		if (reopened.ok) {
			verified = await wait(client.Runtime, verificationExpression, {
				timeoutMs: 3_000,
				description: "Gemini selected model row verification",
			});
		}
	}
	if (!verified.ok) {
		throw new Error(
			`Gemini model click did not verify the requested selection "${resolvedLabels[0]}"; refusing prompt insertion.`,
		);
	}
	logger(`Selected Gemini model: ${String(target.label ?? resolvedLabels[0])}`);
}

export async function stageGeminiPromptAttachments(
	client: Pick<ChromeClient, "Page" | "DOM" | "Runtime" | "Input">,
	attachments: BrowserAttachment[],
	deps: GeminiAttachmentDeps = {},
): Promise<void> {
	if (attachments.length === 0) {
		return;
	}
	const pressTrusted = deps.pressButtonWithTrustedPointerImpl ?? pressButtonWithTrustedPointer;
	const wait = deps.waitForPredicateImpl ?? waitForPredicate;
	const filePaths = attachments.map((attachment) => attachment.path);
	const fileNames = filePaths.map((filePath) => path.basename(filePath));
	const page = client.Page as unknown as {
		enable(): Promise<unknown>;
		setInterceptFileChooserDialog(params: { enabled: boolean }): Promise<unknown>;
		fileChooserOpened(callback: (params: { backendNodeId?: number }) => void): void;
	};

	await page.enable();
	await client.DOM.enable();
	await page.setInterceptFileChooserDialog({ enabled: true });
	try {
		const chooserOpened = new Promise<{ backendNodeId?: number }>((resolve) => {
			page.fileChooserOpened((payload) => resolve(payload));
		});
		const menuOpened = await pressTrusted(client, {
			selector: GEMINI_PROMPT_UPLOAD_TRIGGER_SELECTOR,
			timeoutMs: 10_000,
		});
		if (!menuOpened.ok) {
			throw new Error(
				`Gemini prompt attachment menu did not open: ${menuOpened.reason ?? "trigger unavailable."}`,
			);
		}
		const uploadItemReady = await wait(
			client.Runtime,
			`(() => {
        const node = document.querySelector(${JSON.stringify(GEMINI_PROMPT_UPLOAD_ITEM_SELECTOR)});
        if (!(node instanceof Element)) return null;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 ? true : null;
      })()`,
			{ timeoutMs: 5_000, description: "Gemini local attachment picker row" },
		);
		if (!uploadItemReady.ok) {
			throw new Error("Gemini prompt attachment menu exposed no local file picker row.");
		}
		const itemPressed = await pressTrusted(client, {
			selector: GEMINI_PROMPT_UPLOAD_ITEM_SELECTOR,
			timeoutMs: 10_000,
		});
		if (!itemPressed.ok) {
			throw new Error(
				`Gemini local attachment picker row was not clickable: ${itemPressed.reason ?? "unknown reason."}`,
			);
		}
		let chooserTimeout: ReturnType<typeof setTimeout> | undefined;
		const chooser = await Promise.race([
			chooserOpened,
			new Promise<never>((_, reject) => {
				chooserTimeout = setTimeout(
					() => reject(new Error("Gemini prompt file chooser did not expose a backend node.")),
					deps.chooserTimeoutMs ?? 10_000,
				);
			}),
		]).finally(() => {
			if (chooserTimeout) clearTimeout(chooserTimeout);
		});
		if (!Number.isFinite(chooser.backendNodeId)) {
			throw new Error("Gemini prompt file chooser did not expose a backend node.");
		}
		await client.DOM.setFileInputFiles({
			backendNodeId: chooser.backendNodeId,
			files: filePaths,
		});
		const previewsReady = await wait(
			client.Runtime,
			`(() => {
        const names = ${JSON.stringify(fileNames.map((name) => name.toLowerCase()))};
        const normalize = (value) => String(value ?? '').replace(/\\s+/g, ' ').trim().toLowerCase();
        const previewText = Array.from(document.querySelectorAll('[data-test-id="file-preview"], [aria-label*="Remove file"]'))
          .map((node) => normalize(node.getAttribute?.('aria-label') || node.getAttribute?.('title') || node.textContent || ''));
        const matched = names.filter((name) => previewText.some((label) => label.includes(name)));
        return matched.length === names.length ? { matched } : null;
      })()`,
			{ timeoutMs: 30_000, description: "Gemini prompt attachment previews" },
		);
		if (!previewsReady.ok) {
			throw new Error(
				`Gemini prompt attachments did not become visible before submission: ${fileNames.join(", ")}.`,
			);
		}
	} finally {
		await page.setInterceptFileChooserDialog({ enabled: false }).catch(() => undefined);
	}
}

export const normalizeGeminiModelLabelForTest = normalizeGeminiModelLabel;
