import type { AccountMirrorProvider } from "./politePolicy.js";
import type { AccountMirrorCollectorPhase } from "./statusRegistry.js";

export function resolveAccountMirrorCollectorSweepMode(
	configuredSweepMode: "steady_follow" | "full_sweep",
	requestedPhase: AccountMirrorCollectorPhase | null,
): "steady_follow" | "full_sweep" {
	return requestedPhase === "detail-inventory" ? "steady_follow" : configuredSweepMode;
}

export function resolveAccountMirrorCollectorTimeoutMs(
	provider: AccountMirrorProvider,
	sweepMode: "steady_follow" | "full_sweep",
): number | undefined {
	if (provider === "gemini") return sweepMode === "full_sweep" ? 900_000 : 300_000;
	if (provider === "chatgpt") return 900_000;
	return undefined;
}
