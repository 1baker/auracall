import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { createProviderSessionAuthorization } from '../browser/providers/providerSessionAuthority.js';
import { observeAgentBrowserProjectResponse, reattachAgentBrowserBrokerTab, type AgentBrowserBrokerReattachInput } from '../browser/service/agentBrowserBridge.js';
import { BROWSER_INLINE_PROMPT_CHAR_BUDGET, buildBrowserPromptWithRequestInstructions } from './configuredExecutor.js';
import { shouldUseAuraCallStepOutputContract } from './stepOutputContract.js';
import { getExecutionRunDir, getExecutionRunRecordPath, type ExecutionRunStoredRecord } from './store.js';
import { ExecutionRunRecordBundleSchema } from './schema.js';
import type { ExecutionRuntimeControlContract } from './contract.js';

export const RecoveryObservationBodySchema = z.object({}).strict();
export class RecoveryObservationBusyError extends Error {}
export const RECOVERY_OBSERVATION_FILENAME = 'recovery-observation.json';
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const object = (value: unknown): Record<string, any> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};

/** Only the currently reproducible direct inline transport is eligible. */
export function reconstructRecoveryWire(record: ExecutionRunStoredRecord) {
  const { bundle } = record;
  const step = bundle.steps[0];
  const initial = object(bundle.run.initialInputs);
  const hints = object(initial.auracall);
  const projectId = hints.chatgptNewConversationProjectId;
  const newProject = projectId !== undefined;
  const failure = object(step?.failure?.details);
  if (newProject && (typeof projectId !== 'string' || !/^g-p-[a-f0-9]{32}$/.test(projectId)
      || step?.failure?.code !== 'runner_execution_failed' || step.failure.ownerStepId !== step.id
      || hints.chatgptConversationUrl || failure.code !== 'chatgpt_new_conversation_outcome_unknown'
      || failure.phase !== 'after' || failure.retryable !== false || failure.projectId !== projectId)) {
    throw new Error('Recovery requires a typed after-submit new-project failure');
  }
  if (bundle.run.id !== record.runId || bundle.run.status !== 'failed' || bundle.run.sourceKind !== 'direct'
      || bundle.steps.length !== 1 || !step || step.status !== 'failed' || step.service !== 'chatgpt'
      || hints.service !== 'chatgpt' || hints.transport !== 'browser'
      || bundle.leases.some(lease => lease.status === 'active')) throw new Error('Recovery requires one terminal failed direct ChatGPT browser step');
  const prompt = step.input.prompt;
  // More than ten attachments may add a bundle-manifest prefix to the wire.
  // Without durable transport metadata, do not infer whether bundling occurred.
  if (newProject && (step.input.artifacts.length > 10
      || (Array.isArray(initial.attachments) && initial.attachments.length > 10))) {
    throw new Error('Recovery bundled attachment transport is unsupported');
  }
  if (typeof prompt !== 'string' || !prompt.trim() || prompt !== initial.requestInput
      || shouldUseAuraCallStepOutputContract(step.input.structuredData)
      || step.dependsOnStepIds.length || step.input.handoffIds.length
      || ['taskContext', 'taskOverrideStructuredContext', 'humanEscalationResume'].some(key => step.input.structuredData[key] != null)) {
    throw new Error('Recovery cannot faithfully reconstruct this request transport');
  }
  const metadata = object(step.input.structuredData.metadata);
  if (metadata.browserPromptTransport !== undefined && metadata.browserPromptTransport !== 'auto'
      && metadata.browserPromptTransport !== 'inline_required') throw new Error('Unsupported browser prompt transport policy');
  const codexCorrelation = typeof object(metadata.codexSubmission).token === 'string'
    && Boolean(object(metadata.codexSubmission).token);
  // The review loop binds its original request with a guard identity, fresh
  // nonce, submission fingerprint and private learning-trace digest. The nonce
  // may live in the attached review goal rather than the short chat prompt.
  const guardCorrelation = metadata.workflow === 'codex-pro-guard'
    && Number.isInteger(metadata.round) && metadata.round >= 1 && metadata.round <= 20
    && typeof metadata.guard_id === 'string'
    && /^(?:document-[0-9a-f]{24}-r[1-9][0-9]*|codex-pro-guard-[0-9a-f]{32})$/.test(metadata.guard_id)
    && typeof metadata.guard_nonce === 'string'
    && /^codex-pro-guard-[0-9a-f]{32}$/.test(metadata.guard_nonce)
    && typeof metadata.submission_fingerprint === 'string'
    && /^[0-9a-f]{64}$/.test(metadata.submission_fingerprint)
    && typeof metadata.learning_trace_digest === 'string'
    && /^[0-9a-f]{64}$/.test(metadata.learning_trace_digest)
    && object(metadata.guardFileReview).schema === 'codex.pro_guard_file_handoff.v1';
  if (JSON.stringify(metadata) !== JSON.stringify(initial.metadata)
      || (!codexCorrelation && !guardCorrelation)) throw new Error('Recovery requires saved request correlation');
  // Mirror runner.formatTaskInputArtifactsPromptContext for this explicitly
  // dependency-free transport; never reconstruct attachment content from files.
  const artifactLines = step.input.artifacts.slice(0, 5).map(artifact =>
    `- ${artifact.kind}:${artifact.title ?? artifact.path ?? artifact.uri ?? artifact.id}`);
  if (step.input.artifacts.length > 5) artifactLines.push(`- ... +${step.input.artifacts.length - 5} more`);
  const executionPrompt = artifactLines.length ? `${prompt}\n\nTask input artifacts:\n${artifactLines.join('\n')}` : prompt;
  const wire = buildBrowserPromptWithRequestInstructions({ step }, executionPrompt.trim(), 'chatgpt');
  if (wire.length > BROWSER_INLINE_PROMPT_CHAR_BUDGET && (!newProject || metadata.browserPromptTransport !== 'inline_required')) {
    throw new Error('Recovery attachment transport is unsupported');
  }
  const runtimeProfile = hints.runtimeProfile;
  if (typeof runtimeProfile !== 'string' || !runtimeProfile || step.runtimeProfileId !== runtimeProfile) throw new Error('Recovery runtime profile mismatch');
  // Direct single-step lease heartbeats historically omit stepId; the run,
  // service, agent and runtime profile still bind their evidence below.
  const evidence = bundle.events.filter(event => event.runId === record.runId && (event.stepId === step.id || event.stepId == null))
    .map(event => object(object(event.payload).runtimeEvidence)).filter(event => event.state === 'browser-runtime-hint');
  const details = object(evidence.at(-1)?.details);
  const handle = object(details.agentBrowserServiceTabHandle);
  let attachedUserMessageId: string | undefined;
  if (!newProject) {
    const attachments = Array.isArray(initial.attachments) ? initial.attachments : [];
    if (step.input.artifacts.length !== attachments.length || step.input.artifacts.length > 10) {
      throw new Error('Recovery attachment transport is unsupported');
    }
    if (step.input.artifacts.length > 0) {
      const receipt = object(details.attachmentUiReceipt);
      const paths = step.input.artifacts.map(artifact => artifact.path);
      const submittedIndex = bundle.events.findIndex(event => event.runId === record.runId
        && (event.stepId === step.id || event.stepId == null)
        && object(event.payload).runtimeEvidence?.evidenceRef === 'chatgpt-prompt-submitted');
      let receiptIndex = -1;
      bundle.events.forEach((event, index) => {
        if (event.runId === record.runId && (event.stepId === step.id || event.stepId == null)
            && object(object(event.payload).runtimeEvidence).details?.attachmentUiReceipt != null) {
          receiptIndex = index;
        }
      });
      if (step.failure?.code !== 'runner_execution_failed' || step.failure.ownerStepId !== step.id
          || failure.phase !== 'after' || failure.retryable !== false
          || submittedIndex < 0 || receiptIndex <= submittedIndex
          || receipt.schema !== 'auracall.browser_attachment_ui_receipt.v1'
          || receipt.uploadCompletion !== 'confirmed' || receipt.sentUserTurnAttachments !== 'confirmed'
          || typeof receipt.submittedUserId !== 'string' || !receipt.submittedUserId.trim()
          || !Array.isArray(receipt.attachmentPaths) || receipt.attachmentPaths.length !== paths.length
          || paths.some((path, index) => typeof path !== 'string' || !path
            || receipt.attachmentPaths[index] !== path)
          || new Set(paths).size !== paths.length
          || step.input.artifacts.some((artifact, index) => {
            const attachment = object(attachments[index]);
            return artifact.kind !== 'file' || !artifact.id || !artifact.uri || !artifact.title
              || attachment.id !== artifact.id || attachment.uri !== artifact.uri
              || attachment.fileName !== artifact.title;
          })) throw new Error('Recovery attached request lacks exact sent-turn provenance');
      attachedUserMessageId = receipt.submittedUserId;
    }
  }
  const evidenceUrl = typeof details.tabUrl === 'string' ? details.tabUrl : '';
  const url = new URL(newProject ? evidenceUrl : String(hints.chatgptConversationUrl));
  const projectLanding = newProject
    ? /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/project$/.exec(url.pathname)
    : null;
  const projectConversation = newProject
    ? /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.exec(url.pathname)
    : null;
  if (url.origin !== 'https://chatgpt.com' || url.username || url.password || url.search || url.hash
      || (newProject
        ? projectLanding?.[1] !== projectId && projectConversation?.[1] !== projectId
        : !/^\/g\/g-p-[a-f0-9]{32}(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(url.pathname))) {
    throw new Error('Recovery requires the original project conversation');
  }
  if (details.service !== 'chatgpt' || details.agentId !== step.agentId
      || details.runtimeProfileId !== runtimeProfile || details.tabUrl !== url.href
      || details.agentBrowserRequestedUrl !== url.href || handle.url !== url.href
      || !details.agentBrowserBrowserId || !details.agentBrowserProfileId || !details.agentBrowserSessionName
      || !Number.isInteger(details.agentBrowserProcessId) || details.agentBrowserProcessId < 1
      || !handle.targetId || (details.agentBrowserRequestedHost ?? null) !== (hints.browserHost ?? null)
      || (newProject && (details.projectId !== projectId || details.browserAuthority !== 'agent-browser'
        || handle.browserId !== details.agentBrowserBrowserId || handle.profileId !== details.agentBrowserProfileId
        || handle.sessionName !== details.agentBrowserSessionName))) throw new Error('Recovery original browser provenance is incomplete');
  return { step, prompt, wire, metadata, url: url.href, runtimeProfile, details, handle,
    attachedUserMessageId, projectId: newProject ? projectId as string : undefined };
}

export async function observeFailedResponse(input: {
  responseId: string; config: Record<string, unknown>; control: ExecutionRuntimeControlContract;
}, deps: {
  readRecordBytes?: (id: string) => Promise<Buffer>;
  observe?: typeof reattachAgentBrowserBrokerTab;
  observeProject?: typeof observeAgentBrowserProjectResponse;
} = {}) {
  if (!/^resp_[a-zA-Z0-9_-]+$/.test(input.responseId)) throw new Error('Invalid response identity');
  const read = deps.readRecordBytes ?? (id => fs.readFile(getExecutionRunRecordPath(id)));
  const assertIdle = async () => {
    // Pending work is not executing work. Inspect every status because even a
    // terminal record with an active lease must fail closed; never use age or
    // a limit that could hide an executing record behind pending records.
    const records = await input.control.listRuns({ statuses: ['running', 'planned', 'succeeded', 'failed', 'cancelled'] });
    if (records.some(record => record.bundle.run.status === 'running'
        || record.bundle.steps.some(step => step.status === 'running')
        || record.bundle.leases.some(lease => lease.status === 'active'))) {
      throw new RecoveryObservationBusyError('Recovery observation requires an idle runtime');
    }
  };
  await assertIdle();
  const before = await read(input.responseId);
  const parsed = JSON.parse(before.toString('utf8')) as ExecutionRunStoredRecord;
  parsed.bundle = ExecutionRunRecordBundleSchema.parse(parsed.bundle);
  if (parsed.runId !== input.responseId) throw new Error('Stored response identity mismatch');
  const source = reconstructRecoveryWire(parsed);
  const authorization = createProviderSessionAuthorization(input.config, {
    providerId: 'chatgpt', auracallRuntimeProfile: source.runtimeProfile,
    browserProfile: String(source.details.browserProfileId), managedBrowserProfile: null,
    browserProcessId: null, browserTargetId: null,
  });
  const observationInput: AgentBrowserBrokerReattachInput = {
    observationOnly: true, recoveryPrompt: source.wire, providerSessionAuthorization: authorization,
    expectedUserMessageId: source.attachedUserMessageId,
    baseUrl: source.details.agentBrowserBaseUrl, browserId: source.details.agentBrowserBrowserId,
    browserHost: source.details.agentBrowserRequestedHost as AgentBrowserBrokerReattachInput['browserHost'],
    expectedBrowserProcessId: source.details.agentBrowserProcessId,
    profileId: source.details.agentBrowserProfileId, sessionName: source.details.agentBrowserSessionName,
    serviceTabHandle: source.handle, url: source.url, agentName: source.step.agentId,
    taskName: 'failed-response-observation', abortSignal: AbortSignal.timeout(25_000),
  };
  const result = source.projectId
    ? await (deps.observeProject ?? observeAgentBrowserProjectResponse)({ ...observationInput,
        projectId: source.projectId, expectedBrowserProcessId: source.details.agentBrowserProcessId })
    : await (deps.observe ?? reattachAgentBrowserBrokerTab)(observationInput);
  await assertIdle();
  if (!before.equals(await read(input.responseId))) throw new Error('Original failed record changed during observation');
  if (!result.recoveredResponse || authorization.proof?.verdict !== 'match'
      || !result.browserProcessId || !result.canonicalTargetId) throw new Error('Recovery observation lacks verified response or account proof');
  return {
    schema: 'auracall.response_recovery_observation.v1' as const,
    response_id: input.responseId, original_status: 'failed' as const,
    original_record_digest: sha(before), request_metadata: source.metadata,
    logical_prompt_sha256: sha(source.prompt), wire_prompt_sha256: sha(source.wire),
    ...(source.projectId ? { observation_kind: 'after_submit_new_project' as const, project_id: source.projectId } : {}),
    conversation_url: source.projectId ? result.requestedUrl : source.url, runtime_profile: source.runtimeProfile, observed_at: new Date().toISOString(),
    user_message_id: result.recoveredResponse.userMessageId, assistant_message_id: result.recoveredResponse.answerMessageId,
    answer_text: result.recoveredResponse.answerText, answer_sha256: sha(result.recoveredResponse.answerText),
    account_verdict: 'match' as const, browser_process_id: result.browserProcessId, target_id: result.canonicalTargetId,
    prompt_submitted: false as const, original_run_modified: false as const,
  };
}

/** Persist verified recovery evidence beside, never inside, the failed run. */
export async function persistRecoveryObservation(
  observation: Awaited<ReturnType<typeof observeFailedResponse>>,
  options: { runDir?: string } = {},
): Promise<string> {
  const runId = observation.response_id;
  if (!/^resp_[a-zA-Z0-9_-]+$/.test(runId)
      || observation.schema !== 'auracall.response_recovery_observation.v1'
      || observation.original_status !== 'failed' || observation.original_run_modified !== false
      || observation.prompt_submitted !== false || observation.account_verdict !== 'match'
      || !observation.user_message_id || !observation.assistant_message_id
      || !observation.answer_text.trim() || observation.answer_text.length > 256_000
      || observation.answer_sha256 !== sha(observation.answer_text)) {
    throw new Error('Recovery observation is not eligible for durable evidence');
  }
  const runDir = options.runDir ?? getExecutionRunDir(runId);
  const recordPath = path.join(runDir, 'record.json');
  const [directory, recordInfo] = await Promise.all([fs.lstat(runDir), fs.lstat(recordPath)]);
  if (!directory.isDirectory() || directory.isSymbolicLink()
      || !recordInfo.isFile() || recordInfo.isSymbolicLink()
      || sha(await fs.readFile(recordPath)) !== observation.original_record_digest) {
    throw new Error('Original failed record changed before recovery evidence persistence');
  }
  const target = path.join(runDir, RECOVERY_OBSERVATION_FILENAME);
  const payload = Buffer.from(JSON.stringify(observation) + '\n');
  const temporary = path.join(runDir, `.recovery-observation-${randomUUID()}.tmp`);
  const handle = await fs.open(temporary, 'wx', 0o600);
  try {
    try {
      await handle.writeFile(payload);
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      await fs.link(temporary, target);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const existingInfo = await fs.lstat(target);
      if (!existingInfo.isFile() || existingInfo.isSymbolicLink()
          || !payload.equals(await fs.readFile(target))) {
        throw new Error('Recovery evidence conflicts with an existing observation');
      }
    }
  } finally {
    await fs.unlink(temporary);
  }
  return target;
}
