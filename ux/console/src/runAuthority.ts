export type BrowserAuthority = "agent-browser" | "compatibility-fallback" | "explicit-off";
export type AgentBrowserBridgeMode = "auto" | "required" | "off";

export interface BrowserAuthorityPresentation {
  authority: BrowserAuthority;
  mode: AgentBrowserBridgeMode | null;
  label: string;
  tone: "ready" | "warning" | "draft";
  warning: {
    title: string;
    detail: string;
  } | null;
}

const AUTHORITY_PRESENTATION: Record<
  BrowserAuthority,
  Pick<BrowserAuthorityPresentation, "label" | "tone">
> = {
  "agent-browser": {
    label: "Agent-browser broker",
    tone: "ready",
  },
  "compatibility-fallback": {
    label: "Compatibility fallback",
    tone: "warning",
  },
  "explicit-off": {
    label: "Compatibility path (explicit off)",
    tone: "draft",
  },
};

const BRIDGE_MODES = new Set<AgentBrowserBridgeMode>(["auto", "required", "off"]);

export function readBrowserAuthorityPresentation(
  runStatus: unknown,
): BrowserAuthorityPresentation | null {
  if (!isRecord(runStatus)) return null;
  const metadata = isRecord(runStatus.metadata) ? runStatus.metadata : null;
  const diagnostics = isRecord(metadata?.runtimeDiagnosticsSummary)
    ? metadata.runtimeDiagnosticsSummary
    : null;
  const summary = isRecord(diagnostics?.browserAuthoritySummary)
    ? diagnostics.browserAuthoritySummary
    : null;
  if (!summary || !isBrowserAuthority(summary.browserAuthority)) return null;
  const authority = summary.browserAuthority;
  const presentation = AUTHORITY_PRESENTATION[authority];
  const mode = isBridgeMode(summary.bridgeMode) ? summary.bridgeMode : null;
  return {
    authority,
    mode,
    ...presentation,
    warning:
      authority === "compatibility-fallback"
        ? {
            title: "Compatibility browser fallback",
            detail: `Agent-browser authority was not established. This run used AuraCall's compatibility browser path${mode ? ` (mode ${mode})` : ""}.`,
          }
        : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBrowserAuthority(value: unknown): value is BrowserAuthority {
  return (
    value === "agent-browser" || value === "compatibility-fallback" || value === "explicit-off"
  );
}

function isBridgeMode(value: unknown): value is AgentBrowserBridgeMode {
  return typeof value === "string" && BRIDGE_MODES.has(value as AgentBrowserBridgeMode);
}
