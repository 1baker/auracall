import type { BrowserProviderListOptions } from "./types.js";

export interface BrowserScrapeTelemetrySnapshot {
	providerActions: Record<string, number>;
	cdpCalls: Record<string, number>;
	candidates: Record<string, number>;
	pendingOperation?: string | null;
	downloads: {
		attempted: number;
		succeeded: number;
		failed: number;
	};
	notes: string[];
}

export interface BrowserScrapeTelemetryRecorder extends BrowserScrapeTelemetrySnapshot {
	onUpdate?: () => void;
}

interface PendingOperationEntry {
	operation: string;
}

const pendingOperationEntries = new WeakMap<
	BrowserScrapeTelemetryRecorder,
	PendingOperationEntry[]
>();

export function createBrowserScrapeTelemetryRecorder(options?: {
	onUpdate?: () => void;
}): BrowserScrapeTelemetryRecorder {
	return {
		providerActions: {},
		cdpCalls: {},
		candidates: {},
		pendingOperation: null,
		downloads: {
			attempted: 0,
			succeeded: 0,
			failed: 0,
		},
		notes: [],
		onUpdate: options?.onUpdate,
	};
}

export function snapshotBrowserScrapeTelemetry(
	telemetry: BrowserScrapeTelemetryRecorder | null | undefined,
): BrowserScrapeTelemetrySnapshot | null {
	if (!telemetry) return null;
	return {
		providerActions: { ...telemetry.providerActions },
		cdpCalls: { ...telemetry.cdpCalls },
		candidates: { ...telemetry.candidates },
		pendingOperation: telemetry.pendingOperation ?? null,
		downloads: { ...telemetry.downloads },
		notes: [...telemetry.notes],
	};
}

export function recordBrowserScrapeProviderAction(
	options: BrowserProviderListOptions | null | undefined,
	action: string,
): void {
	const telemetry = options?.scrapeTelemetry;
	increment(telemetry?.providerActions, action);
	notify(telemetry);
}

export async function withBrowserScrapePendingOperation<T>(
	options: BrowserProviderListOptions | null | undefined,
	operation: string,
	task: () => Promise<T>,
): Promise<T> {
	const telemetry = options?.scrapeTelemetry;
	if (!telemetry) return task();
	const entries = pendingOperationEntries.get(telemetry) ?? [];
	if (!pendingOperationEntries.has(telemetry)) {
		pendingOperationEntries.set(telemetry, entries);
	}
	const entry = { operation };
	entries.push(entry);
	telemetry.pendingOperation = operation;
	notify(telemetry);
	try {
		return await task();
	} finally {
		const entryIndex = entries.indexOf(entry);
		if (entryIndex >= 0) entries.splice(entryIndex, 1);
		telemetry.pendingOperation = entries.at(-1)?.operation ?? null;
		if (entries.length === 0) pendingOperationEntries.delete(telemetry);
		notify(telemetry);
	}
}

export function recordBrowserScrapeCdpCall(
	options: BrowserProviderListOptions | null | undefined,
	method: string,
): void {
	const telemetry = options?.scrapeTelemetry;
	increment(telemetry?.cdpCalls, method);
	notify(telemetry);
}

export function recordBrowserScrapeCandidateCount(
	options: BrowserProviderListOptions | null | undefined,
	name: string,
	count: number,
): void {
	const candidates = options?.scrapeTelemetry?.candidates;
	if (!candidates) return;
	candidates[name] = Math.max(0, Math.floor(count));
	notify(options?.scrapeTelemetry);
}

export function recordBrowserScrapeDownloadAttempt(
	options: BrowserProviderListOptions | null | undefined,
): void {
	const downloads = options?.scrapeTelemetry?.downloads;
	if (!downloads) return;
	downloads.attempted += 1;
	notify(options?.scrapeTelemetry);
}

export function recordBrowserScrapeDownloadSuccess(
	options: BrowserProviderListOptions | null | undefined,
): void {
	const downloads = options?.scrapeTelemetry?.downloads;
	if (!downloads) return;
	downloads.succeeded += 1;
	notify(options?.scrapeTelemetry);
}

export function recordBrowserScrapeDownloadFailure(
	options: BrowserProviderListOptions | null | undefined,
): void {
	const downloads = options?.scrapeTelemetry?.downloads;
	if (!downloads) return;
	downloads.failed += 1;
	notify(options?.scrapeTelemetry);
}

export function recordBrowserScrapeNote(
	options: BrowserProviderListOptions | null | undefined,
	note: string,
): void {
	const notes = options?.scrapeTelemetry?.notes;
	if (!notes) return;
	notes.push(note);
	notify(options?.scrapeTelemetry);
}

function increment(target: Record<string, number> | undefined, key: string): void {
	if (!target) return;
	target[key] = (target[key] ?? 0) + 1;
}

function notify(telemetry: BrowserScrapeTelemetryRecorder | null | undefined): void {
	telemetry?.onUpdate?.();
}
