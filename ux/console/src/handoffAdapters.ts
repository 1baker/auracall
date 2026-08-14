export const HANDOFF_TARGET_ADAPTER_OPTIONS = [
	{ value: "packet", label: "Packet" },
	{ value: "chatgpt-browser", label: "ChatGPT browser" },
	{ value: "gemini-browser", label: "Gemini browser" },
] as const;

export type HandoffTargetAdapterName =
	(typeof HANDOFF_TARGET_ADAPTER_OPTIONS)[number]["value"];

export const DEFAULT_HANDOFF_TARGET_ADAPTER: HandoffTargetAdapterName = "packet";

export function buildHandoffActionBody(
	action: string,
	outputDir: string,
	targetAdapter: HandoffTargetAdapterName,
): { outputDir?: string; targetAdapter?: HandoffTargetAdapterName } {
	const normalizedOutputDir = outputDir.trim();
	return {
		...(normalizedOutputDir ? { outputDir: normalizedOutputDir } : {}),
		...(action === "recover-live" ? { targetAdapter } : {}),
	};
}
