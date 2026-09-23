import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createMediaGenerationService, type MediaGenerationService } from '../../media/service.js';
import { probeMediaGenerationBrowserDiagnostics } from '../../media/browserDiagnostics.js';
import { createExecutionResponsesService, type ExecutionResponsesService } from '../../runtime/responsesService.js';
import {
  createDefaultRuntimeRunBrowserDiagnosticsProbe,
} from '../../http/responsesServer.js';
import { readAuraCallRunStatus } from '../../runStatus.js';
import {
  inspectRuntimeRun,
  type ProbeRuntimeRunBrowserDiagnosticsInput,
  type RuntimeRunInspectionBrowserDiagnosticsProbeResult,
} from '../../runtime/inspection.js';
import type { observeFailedResponse } from '../../runtime/responseRecoveryObservation.js';

const runStatusInputShape = {
  id: z.string().min(1),
  diagnostics: z.enum(['browser-state']).optional(),
} satisfies z.ZodRawShape;

const runStatusArtifactShape = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  path: z.string().nullable().optional(),
  uri: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  materialization: z.string().nullable().optional(),
  remoteUrl: z.string().nullable().optional(),
  checksumSha256: z.string().nullable().optional(),
  previewArtifactId: z.string().nullable().optional(),
  previewSize: z.number().nullable().optional(),
  previewChecksumSha256: z.string().nullable().optional(),
  fullQualityDiffersFromPreview: z.boolean().nullable().optional(),
  downloadLabel: z.string().nullable().optional(),
  downloadVariant: z.string().nullable().optional(),
  downloadOptions: z.array(z.string()).nullable().optional(),
});

const runStatusStepShape = z.object({
  stepId: z.string().nullable().optional(),
  order: z.number().optional(),
  agentId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  runtimeProfileId: z.string().nullable().optional(),
  browserProfileId: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
});

const runStatusTimingShape = z.object({
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  elapsedMs: z.number().int().nonnegative().nullable().optional(),
  runningForMs: z.number().int().nonnegative().nullable().optional(),
});

const runStatusPollingShape = z.object({
  recommendedPollMs: z.number().int().nonnegative(),
  reason: z.string(),
});

const runStatusOutputShape = {
  id: z.string(),
  object: z.literal('auracall_run_status'),
  kind: z.enum(['response', 'media_generation']),
  status: z.string(),
  updatedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  timing: runStatusTimingShape.optional(),
  polling: runStatusPollingShape.optional(),
  lastEvent: z.unknown().nullable().optional(),
  stepCount: z.number().int().nonnegative().optional(),
  steps: z.array(runStatusStepShape).optional(),
  artifactCount: z.number().int().nonnegative(),
  artifacts: z.array(runStatusArtifactShape),
  browserDiagnostics: z.unknown().optional(),
  metadata: z.record(z.string(), z.unknown()),
  failure: z.unknown().nullable().optional(),
  effectiveStatus: z.literal('completed_recovered').optional(),
  recoveryObservation: z.unknown().optional(),
} satisfies z.ZodRawShape;

export interface RegisterRunStatusToolDeps {
  responsesService?: Pick<ExecutionResponsesService, 'readResponse'>;
  mediaGenerationService?: Pick<MediaGenerationService, 'readGeneration'>;
  probeRuntimeRunBrowserDiagnostics?: (
    input: ProbeRuntimeRunBrowserDiagnosticsInput,
  ) => Promise<RuntimeRunInspectionBrowserDiagnosticsProbeResult | null>;
  observeFailedResponse?: (responseId: string) => ReturnType<typeof observeFailedResponse>;
}

export function registerRunStatusTool(
  server: McpServer,
  deps: RegisterRunStatusToolDeps = {},
): void {
  const responsesService = deps.responsesService ?? createExecutionResponsesService();
  const mediaGenerationService = deps.mediaGenerationService ?? createMediaGenerationService();
  server.registerTool(
    'run_status',
    {
      title: 'Read Aura-Call run status',
      description:
        'Read compact status for one Aura-Call run id across response/team chats and media generations without re-invoking the provider.',
      inputSchema: runStatusInputShape,
      outputSchema: runStatusOutputShape,
    },
    createRunStatusToolHandler({
      responsesService,
      mediaGenerationService,
      probeRuntimeRunBrowserDiagnostics: deps.probeRuntimeRunBrowserDiagnostics,
      observeFailedResponse: deps.observeFailedResponse,
    }),
  );
}

export function createRunStatusToolHandler(
  deps: Required<Pick<RegisterRunStatusToolDeps, 'responsesService' | 'mediaGenerationService'>> &
    Pick<RegisterRunStatusToolDeps, 'probeRuntimeRunBrowserDiagnostics' | 'observeFailedResponse'>,
) {
  return async (input: unknown) => {
    const textContent = (text: string) => [{ type: 'text' as const, text }];
    const payload = z.object(runStatusInputShape).parse(input);
    const status = await readAuraCallRunStatus(payload.id, {
      responsesService: deps.responsesService,
      mediaGenerationService: deps.mediaGenerationService,
    });
    if (!status) {
      throw new Error(`Run "${payload.id}" not found.`);
    }
    if (payload.diagnostics === 'browser-state') {
      if (status.kind === 'response') {
        const inspection = await inspectRuntimeRun({
          runId: status.id,
          includeBrowserDiagnostics: true,
          probeBrowserDiagnostics:
            deps.probeRuntimeRunBrowserDiagnostics ?? createDefaultRuntimeRunBrowserDiagnosticsProbe(),
        });
        status.browserDiagnostics = inspection.browserDiagnostics;
      } else {
        const mediaGeneration = await deps.mediaGenerationService.readGeneration(status.id);
        if (mediaGeneration) {
          status.browserDiagnostics = await probeMediaGenerationBrowserDiagnostics(mediaGeneration);
        }
      }
    }
    let recoveryObservation: Awaited<ReturnType<typeof observeFailedResponse>> | undefined;
    if (status.kind === 'response' && status.status === 'failed'
        && isAfterSubmitNewProjectOutcomeUnknown(status.failure)
        && deps.observeFailedResponse) {
      try {
        recoveryObservation = await deps.observeFailedResponse(status.id);
      } catch {
        // The original failure remains authoritative when strict recovery
        // eligibility, runtime idleness, or browser identity cannot be proven.
      }
    }
    const recovered = recoveryObservation !== undefined;
    const effectiveStatus = recovered ? 'completed_recovered' as const : undefined;
    const recoveredAnswer = recoveryObservation?.answer_text;
    const structuredContent = {
      ...status,
      ...(effectiveStatus ? { effectiveStatus } : {}),
      ...(recoveryObservation ? { recoveryObservation } : {}),
    };
    const lastEvent = readLastEventLabel(status.lastEvent);
    return {
      isError: status.status === 'failed' && !recovered,
      content: textContent(
        recoveredAnswer !== undefined
          ? `Run ${status.id} recovered its completed ChatGPT response without replaying the prompt.\n\n${recoveredAnswer}`
          : `Run ${status.id} (${status.kind}) is ${status.status}; last event ${lastEvent}; artifacts ${status.artifactCount}.`,
      ),
      structuredContent: structuredContent as typeof structuredContent & Record<string, unknown>,
    };
  };
}

function isAfterSubmitNewProjectOutcomeUnknown(value: unknown, depth = 0): boolean {
  if (depth > 8 || value === null || value === undefined) return false;
  if (Array.isArray(value)) {
    return value.some((item) => isAfterSubmitNewProjectOutcomeUnknown(item, depth + 1));
  }
  if (typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (record.code === 'chatgpt_new_conversation_outcome_unknown'
      && record.phase === 'after' && record.retryable === false) return true;
  return Object.values(record).some((item) => isAfterSubmitNewProjectOutcomeUnknown(item, depth + 1));
}

function readLastEventLabel(lastEvent: unknown): string {
  if (!lastEvent || typeof lastEvent !== 'object') return 'none';
  const record = lastEvent as Record<string, unknown>;
  return stringOrNull(record.event) ?? stringOrNull(record.type) ?? 'unknown';
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}
