export const HANDOFF_TARGET_ADAPTER_NAMES = [
	"packet",
	"chatgpt-browser",
	"gemini-browser",
] as const;

export type HandoffTargetAdapterName = (typeof HANDOFF_TARGET_ADAPTER_NAMES)[number];

export const DEFAULT_HANDOFF_TARGET_ADAPTER: HandoffTargetAdapterName = "packet";

export function isHandoffTargetAdapterName(value: string): value is HandoffTargetAdapterName {
	return HANDOFF_TARGET_ADAPTER_NAMES.some((adapterName) => adapterName === value);
}
