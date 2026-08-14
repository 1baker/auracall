import type { ExecutionRuntimeDiagnosticsSummary } from './apiTypes.js';
import type { ExecutionRunRecordBundle } from './types.js';

export type ExecutionBrowserAuthoritySummary = NonNullable<
  ExecutionRuntimeDiagnosticsSummary['browserAuthoritySummary']
>;

export function readExecutionRunBrowserAuthoritySummary(
  runRecord: ExecutionRunRecordBundle,
): ExecutionBrowserAuthoritySummary | null {
  for (let index = runRecord.events.length - 1; index >= 0; index -= 1) {
    const event = runRecord.events[index];
    const payload = isRecord(event?.payload) ? event.payload : null;
    const runtimeEvidence = isRecord(payload?.runtimeEvidence) ? payload.runtimeEvidence : null;
    const details = isRecord(runtimeEvidence?.details) ? runtimeEvidence.details : null;
    const browserAuthority =
      readBrowserAuthority(details?.browserAuthority) ??
      (readString(details?.agentBrowserBrowserId) || readString(details?.agentBrowserProfileId)
        ? 'agent-browser'
        : null);
    const bridgeMode = readAgentBrowserBridgeMode(details?.agentBrowserBridgeMode);
    if (!browserAuthority) continue;
    return {
      browserAuthority,
      bridgeMode: bridgeMode ?? null,
      observedAt: readString(runtimeEvidence?.observedAt) ?? event?.createdAt ?? null,
      source: readString(runtimeEvidence?.source),
    };
  }
  return null;
}

function readBrowserAuthority(
  value: unknown,
): NonNullable<ExecutionBrowserAuthoritySummary['browserAuthority']> | null {
  return value === 'agent-browser' || value === 'compatibility-fallback' || value === 'explicit-off'
    ? value
    : null;
}

function readAgentBrowserBridgeMode(
  value: unknown,
): NonNullable<ExecutionBrowserAuthoritySummary['bridgeMode']> | null {
  return value === 'auto' || value === 'required' || value === 'off' ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
