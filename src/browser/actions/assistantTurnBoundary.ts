/**
 * Keep the pre-submit DOM boundary authoritative when it was observable.
 *
 * Prompt-commit verification may finish after ChatGPT has already mounted an
 * assistant wrapper. Using that later count as the response boundary can hide
 * the very response we need to collect. The committed count is therefore only
 * a fallback when the pre-submit count was unavailable.
 */
export function resolveAssistantMinTurnIndex(
	preSubmitTurns: number | null,
	committedTurns: number | null | undefined,
): number | null {
	if (
		typeof preSubmitTurns === "number" &&
		Number.isFinite(preSubmitTurns) &&
		preSubmitTurns >= 0
	) {
		return Math.floor(preSubmitTurns);
	}
	if (
		typeof committedTurns === "number" &&
		Number.isFinite(committedTurns) &&
		committedTurns >= 0
	) {
		return Math.max(0, Math.floor(committedTurns) - 1);
	}
	return null;
}
