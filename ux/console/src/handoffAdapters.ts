import {
	DEFAULT_HANDOFF_TARGET_ADAPTER,
	HANDOFF_TARGET_ADAPTER_NAMES,
	type HandoffTargetAdapterName,
} from "../../../src/handoff/targetAdapterContract.js";

const HANDOFF_TARGET_ADAPTER_LABELS = {
	packet: "Packet",
	"chatgpt-browser": "ChatGPT browser",
	"gemini-browser": "Gemini browser",
} satisfies Record<HandoffTargetAdapterName, string>;

export { DEFAULT_HANDOFF_TARGET_ADAPTER };
export type { HandoffTargetAdapterName };

export const HANDOFF_TARGET_ADAPTER_OPTIONS = HANDOFF_TARGET_ADAPTER_NAMES.map((value) => ({
	value,
	label: HANDOFF_TARGET_ADAPTER_LABELS[value],
}));

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
