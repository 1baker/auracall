// biome-ignore-all lint/suspicious/noExplicitAny: recovery fixtures intentionally mutate untyped persisted payloads.
// biome-ignore-all lint/style/noNonNullAssertion: fixture fields are created immediately before these assertions.
import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { createExecutionRun, createExecutionRunEvent, createExecutionRunRecordBundle, createExecutionRunSharedState, createExecutionRunStep } from '../src/runtime/model.js';
import { DEFAULT_TEAM_RUN_EXECUTION_POLICY } from '../src/teams/types.js';
import { observeFailedResponse, reconstructRecoveryWire, RecoveryObservationBodySchema, RecoveryObservationBusyError } from '../src/runtime/responseRecoveryObservation.js';
import { observeAgentBrowserProjectResponse, reattachAgentBrowserBrokerTab } from '../src/browser/service/agentBrowserBridge.js';

const url = 'https://chatgpt.com/g/g-p-11111111111111111111111111111111/c/11111111-1111-1111-1111-111111111111';
const runId = 'resp_recover';
const stepId = `${runId}:step:1`;
const at = '2026-09-11T19:20:00.000Z';
const handle = { browserId: 'session:retained', profileId: 'chatgpt-pro', sessionName: 'retained', targetId: 'target-1', valid: true, url };
function fixture() {
  const metadata = { codexSubmission: { token: 'correlation-token', stage: 'pro:right:1' } };
  const bundle = createExecutionRunRecordBundle({
    run: createExecutionRun({ id: runId, sourceKind: 'direct', sourceId: null, status: 'failed', createdAt: at, updatedAt: at,
      trigger: 'api', requestedBy: null, entryPrompt: 'Exact request', initialInputs: { requestInput: 'Exact request', metadata,
        auracall: { runtimeProfile: 'default', service: 'chatgpt', transport: 'browser', chatgptConversationUrl: url, browserHost: 'remote_headed' } },
      sharedStateId: `${runId}:state`, stepIds: [stepId], policy: DEFAULT_TEAM_RUN_EXECUTION_POLICY }),
    steps: [createExecutionRunStep({ id: stepId, runId, agentId: 'api-responses', runtimeProfileId: 'default', browserProfileId: 'default',
      service: 'chatgpt', kind: 'prompt', status: 'failed', order: 1, dependsOnStepIds: [],
      input: { prompt: 'Exact request', notes: ['Exact instructions'], artifacts: [], handoffIds: [], structuredData: { metadata } } })],
    sharedState: createExecutionRunSharedState({ id: `${runId}:state`, runId, status: 'failed', artifacts: [], structuredOutputs: [], notes: [], history: [], lastUpdatedAt: at }),
    events: [createExecutionRunEvent({ id: 'e1', runId, stepId, type: 'note-added', createdAt: at, payload: { runtimeEvidence: {
      state: 'browser-runtime-hint', details: { service: 'chatgpt', agentId: 'api-responses', runtimeProfileId: 'default', browserProfileId: 'default', tabUrl: url,
        agentBrowserRequestedUrl: url, agentBrowserBrowserId: handle.browserId, agentBrowserProfileId: handle.profileId,
        agentBrowserSessionName: handle.sessionName, agentBrowserProcessId: 1234,
        agentBrowserRequestedHost: 'remote_headed', agentBrowserServiceTabHandle: handle,
        agentBrowserBaseUrl: 'http://127.0.0.1:47777' } } } })],
  });
  return { runId, revision: 2, persistedAt: at, bundle };
}
const config = { profiles: { default: { services: { chatgpt: { identity: { email: 'expected@example.com' } } } } } };
describe('trusted failed response observation', () => {
  it.each(['valid', 'streaming', 'duplicate', 'wrong-account', 'changed-record', 'busy', 'pending', 'pending-leased', 'terminal-leased', 'running-step'] as const)('%s', async kind => {
    const record = fixture();
    const original = Buffer.from(JSON.stringify(record));
    const wire = reconstructRecoveryWire(record).wire;
    const actions: string[] = [];
    const fetch = vi.fn(async (resource: unknown, init?: RequestInit) => {
      let data: unknown;
      if (String(resource).endsWith('/api/service/browsers')) data = { browsers: [{ id: handle.browserId, profileId: handle.profileId,
        health: 'ready', host: 'remote_headed', pid: 1234, tabHandles: [handle] }] };
      else {
        const body = JSON.parse(String(init?.body)); actions.push(body.action);
        expect(body.action).toBe('evaluate');
        if (String(body.expression).includes('data-message-author-role')) data = { result: { url, generating: kind === 'streaming',
          messages: [{ role: 'user', id: 'u1', text: wire }, { role: 'assistant', id: 'a1', text: '{"answer":"exact"}' },
            ...(kind === 'duplicate' ? [{ role: 'user', id: 'u2', text: wire }] : [])] } };
        else data = { result: { user: { email: kind === 'wrong-account' ? 'wrong@example.com' : 'expected@example.com' } } };
      }
      return new Response(JSON.stringify({ success: true, data }));
    });
    let reads = 0;
    const pending = fixture();
    pending.runId = pending.bundle.run.id = 'resp_unrelated';
    pending.bundle.run.status = kind === 'busy' ? 'running' : kind === 'terminal-leased' ? 'failed' : 'planned';
    pending.bundle.steps[0]!.status = kind === 'running-step' ? 'running' : 'runnable';
    if (kind === 'pending-leased' || kind === 'terminal-leased') pending.bundle.leases.push({ status: 'active' } as never);
    const listRuns = vi.fn(async () => ['busy', 'pending', 'pending-leased', 'terminal-leased', 'running-step'].includes(kind) ? [pending] : []);
    const result = observeFailedResponse({ responseId: runId, config, control: { listRuns } as never }, {
      readRecordBytes: async () => (++reads > 1 && kind === 'changed-record') ? Buffer.from(`${original.toString()} `) : original,
      observe: input => reattachAgentBrowserBrokerTab(input, { fetch: fetch as never, listStreamFiles: async () => [], readStreamFile: async () => '' }),
    });
    if (kind === 'valid' || kind === 'pending') {
      expect(await result).toMatchObject({ schema: 'auracall.response_recovery_observation.v1', response_id: runId,
        original_status: 'failed', original_record_digest: createHash('sha256').update(original).digest('hex'),
        account_verdict: 'match', user_message_id: 'u1', assistant_message_id: 'a1', prompt_submitted: false, original_run_modified: false });
      expect(actions).toEqual(['evaluate', 'evaluate']);
    } else if (['busy', 'pending-leased', 'terminal-leased', 'running-step'].includes(kind)) {
      await expect(result).rejects.toBeInstanceOf(RecoveryObservationBusyError);
    } else await expect(result).rejects.toThrow();
    expect(listRuns).not.toHaveBeenCalledWith(expect.objectContaining({ limit: 1 }));
    if (['busy', 'pending-leased', 'terminal-leased', 'running-step'].includes(kind)) expect(fetch).not.toHaveBeenCalled();
    expect(JSON.stringify(record)).toBe(original.toString());
  });
  it.each(['attachments', 'oversize', 'mismatched-input', 'missing-correlation', 'active', 'wrong-project'] as const)('rejects %s before browser work', kind => {
    const record = fixture();
    const step = record.bundle.steps[0];
    if (!step) throw new Error('fixture step missing');
    if (kind === 'attachments') step.input.artifacts.push({} as never);
    if (kind === 'oversize') record.bundle.run.initialInputs.requestInput = step.input.prompt = 'x'.repeat(60001);
    if (kind === 'mismatched-input') step.input.prompt = 'wrong';
    if (kind === 'missing-correlation') step.input.structuredData.metadata = {};
    if (kind === 'active') record.bundle.run.status = 'running';
    if (kind === 'wrong-project') (record.bundle.run.initialInputs.auracall as any).chatgptConversationUrl = 'https://chatgpt.com/';
    expect(() => reconstructRecoveryWire(record)).toThrow();
  });
  it('rejects caller supplied answer or prompt', () => {
    expect(() => RecoveryObservationBodySchema.parse({ answer_text: 'fake' })).toThrow();
    expect(() => RecoveryObservationBodySchema.parse({ prompt: 'fake' })).toThrow();
    expect(RecoveryObservationBodySchema.parse({})).toEqual({});
  });
  it('accepts legacy unscoped heartbeat only in the exact single-step run', () => {
    const record = fixture();
    record.bundle.events[0]!.stepId = null;
    expect(reconstructRecoveryWire(record).wire).toContain('Request instructions:\n- Exact instructions');
    record.bundle.events[0]!.runId = 'other-run';
    expect(() => reconstructRecoveryWire(record)).toThrow();
  });
});

const projectId = 'g-p-11111111111111111111111111111111';
function projectFixture() {
  const record = fixture();
  const step = record.bundle.steps[0]!;
  const hints = record.bundle.run.initialInputs.auracall as any;
  delete hints.chatgptConversationUrl;
  hints.chatgptNewConversationProjectId = projectId;
  step.failure = { code: 'runner_execution_failed', message: 'after-submit unknown', ownerStepId: step.id,
    details: { code: 'chatgpt_new_conversation_outcome_unknown', projectId, phase: 'after', retryable: false } };
  const details = (record.bundle.events[0]?.payload?.runtimeEvidence as any).details;
  details.projectId = projectId;
  details.browserAuthority = 'agent-browser';
  details.agentBrowserProcessId = 1234;
  details.tabUrl = details.agentBrowserRequestedUrl = `https://chatgpt.com/g/${projectId}/project`;
  details.agentBrowserServiceTabHandle = { ...handle, url: details.tabUrl };
  return record;
}
describe('after-submit new-project observation', () => {
  it('treats omitted and null requested browser hosts as the same unconstrained route', () => {
    const record = projectFixture();
    const hints = record.bundle.run.initialInputs.auracall as any;
    const details = (record.bundle.events[0]?.payload?.runtimeEvidence as any).details;
    delete hints.browserHost;
    details.agentBrowserRequestedHost = null;
    expect(reconstructRecoveryWire(record).details.agentBrowserRequestedHost).toBeNull();
  });
  it('preserves a durably bound canonical conversation as the recovery target', () => {
    const record = projectFixture();
    const details = (record.bundle.events[0]?.payload?.runtimeEvidence as any).details;
    details.tabUrl = details.agentBrowserRequestedUrl = url;
    details.agentBrowserServiceTabHandle = { ...handle, url };
    const source = reconstructRecoveryWire(record);
    expect(source.url).toBe(url);
    expect(source.handle).toMatchObject({ targetId: 'target-1', url });
  });
  it.each(['wrong-project-conversation', 'conversation-to-landing-mismatch'] as const)('rejects canonical binding drift: %s', kind => {
    const record = projectFixture();
    const details = (record.bundle.events[0]?.payload?.runtimeEvidence as any).details;
    details.tabUrl = kind === 'wrong-project-conversation'
      ? url.replace(projectId, `g-p-${'2'.repeat(32)}`)
      : url;
    details.agentBrowserRequestedUrl = details.tabUrl;
    details.agentBrowserServiceTabHandle = { ...handle,
      url: kind === 'conversation-to-landing-mismatch' ? `https://chatgpt.com/g/${projectId}/project` : details.tabUrl };
    expect(() => reconstructRecoveryWire(record)).toThrow();
  });
  it.each(['artifacts', 'attachments'] as const)('rejects potentially bundled %s without guessing the submitted prefix', kind => {
    const record = projectFixture();
    const step = record.bundle.steps[0];
    if (!step) throw new Error('fixture step missing');
    if (kind === 'artifacts') step.input.artifacts = Array.from({ length: 11 }, (_, i) => ({ id: `a${i}`, kind: 'file', path: `/fixture/${i}.md` } as never));
    else record.bundle.run.initialInputs.attachments = Array.from({ length: 11 }, (_, i) => `/fixture/${i}.md`);
    expect(() => reconstructRecoveryWire(record)).toThrow('bundled attachment transport');
  });
  it('reconstructs runner artifact suffix and keeps explicitly required large inline content', () => {
    const record = projectFixture();
    const step = record.bundle.steps[0]!;
    (step.input.structuredData.metadata as any).browserPromptTransport = 'inline_required';
    record.bundle.run.initialInputs.requestInput = step.input.prompt = 'x'.repeat(61000);
    step.input.artifacts = Array.from({ length: 6 }, (_, i) => ({ id: `a${i}`, kind: 'file', title: `source-${i}.md` } as never));
    const source = reconstructRecoveryWire(record);
    expect(source.wire).toContain('Task input artifacts:\n- file:source-0.md');
    expect(source.wire).toContain('- file:source-4.md\n- ... +1 more');
    expect(source.wire).not.toContain('file:source-5.md');
    expect(source.wire.length).toBeGreaterThan(60000);
    delete (step.input.structuredData.metadata as any).browserPromptTransport;
    expect(() => reconstructRecoveryWire(record)).toThrow('attachment transport');
  });
  it.each(['untyped', 'before', 'retryable', 'wrong-project', 'dependency', 'task-context', 'wrong-owner', 'missing-pid'] as const)('rejects %s eligibility', kind => {
    const record = projectFixture();
    const step = record.bundle.steps[0]!;
    const failure = step.failure?.details as any;
    const details = (record.bundle.events[0]?.payload?.runtimeEvidence as any).details;
    if (kind === 'untyped') delete failure.code;
    if (kind === 'before') failure.phase = 'before';
    if (kind === 'retryable') failure.retryable = true;
    if (kind === 'wrong-project') failure.projectId = `g-p-${'2'.repeat(32)}`;
    if (kind === 'dependency') step.dependsOnStepIds.push('other-step');
    if (kind === 'task-context') step.input.structuredData.taskContext = {};
    if (kind === 'wrong-owner') details.agentBrowserServiceTabHandle.sessionName = 'other';
    if (kind === 'missing-pid') delete details.agentBrowserProcessId;
    expect(() => reconstructRecoveryWire(record)).toThrow();
  });
  it.each(['valid', 'proof-pid', 'unconstrained-host', 'many-siblings', 'missing', 'ambiguous', 'duplicate-user', 'changed-answer', 'streaming', 'wrong-account', 'changed-pid', 'wrong-host', 'wrong-session', 'truncated', 'changed-record'] as const)('observes %s without mutation', async kind => {
    const record = projectFixture();
    if (kind === 'unconstrained-host') {
      delete (record.bundle.run.initialInputs.auracall as any).browserHost;
      (record.bundle.events[0]?.payload?.runtimeEvidence as any).details.agentBrowserRequestedHost = null;
    }
    const original = Buffer.from(JSON.stringify(record));
    const wire = reconstructRecoveryWire(record).wire;
    const actions: string[] = [];
    const second = { ...handle, targetId: 'target-2', url: url.replace(/11111111-1111-1111-1111-111111111111$/, '22222222-2222-2222-2222-222222222222') };
    const fetch = vi.fn(async (resource: unknown, init?: RequestInit) => {
      let data: unknown;
      if (String(resource).endsWith('/api/service/browsers')) data = { browsers: [{ id: handle.browserId, profileId: handle.profileId,
        health: 'ready', host: kind === 'wrong-host' ? 'local_headed' : 'remote_headed', pid: kind === 'proof-pid' ? null : kind === 'changed-pid' ? 1235 : 1234,
        cdpEndpoint: 'ws://127.0.0.1:45521/devtools/browser/fixture', browserBuild: 'stock_chrome',
        browserBuildProof: kind === 'proof-pid' ? { applied: true, browserPid: 1234,
          cdpEndpoint: 'ws://127.0.0.1:45521/devtools/browser/fixture', profileId: handle.profileId, browserBuild: 'stock_chrome' } : null,
        tabHandles: [{ ...handle, sessionName: kind === 'wrong-session' ? 'other' : handle.sessionName }, second,
          ...(kind === 'many-siblings' ? Array.from({ length: 9 }, (_, index) => ({ ...second,
            targetId: `sibling-${index}`, url: second.url.replace('22222222-2222-2222-2222-222222222222',
              `${String(index).padStart(8, '0')}-2222-2222-2222-222222222222`) })) : [])] }] };
      else {
        const body = JSON.parse(String(init?.body));
        actions.push(body.action);
        expect(body.action).toBe('evaluate');
        if (String(body.expression).includes('data-message-author-role')) {
          const isFirst = body.serviceTabHandle.targetId === handle.targetId;
          const matches = kind !== 'missing' && (isFirst || kind === 'ambiguous');
          data = { resultTruncated: kind === 'truncated', result: { url: body.serviceTabHandle.url,
            generating: kind === 'streaming' && isFirst,
            messages: [{ role: 'user', id: 'u1', text: matches ? wire : 'unrelated' },
              { role: 'assistant', id: 'a1', text: kind === 'changed-answer' && actions.length > 1 ? 'Changed answer' : 'Exact answer' },
              ...(kind === 'duplicate-user' && isFirst ? [{ role: 'user', id: 'u2', text: wire }] : [])] } };
        } else data = { result: { user: { email: kind === 'wrong-account' ? 'other@example.com' : 'expected@example.com' } } };
      }
      return new Response(JSON.stringify({ success: true, data }));
    });
    let reads = 0;
    const result = observeFailedResponse({ responseId: runId, config, control: { listRuns: async () => [] } as never }, {
      readRecordBytes: async () => ++reads > 1 && kind === 'changed-record' ? Buffer.from(`${original.toString()} `) : original,
      observeProject: input => observeAgentBrowserProjectResponse(input, { fetch: fetch as never, listStreamFiles: async () => [] }),
    });
    if (kind === 'valid' || kind === 'proof-pid' || kind === 'unconstrained-host' || kind === 'many-siblings' || kind === 'ambiguous') {
      expect(await result).toMatchObject({ observation_kind: 'after_submit_new_project', project_id: projectId,
        conversation_url: url, user_message_id: 'u1', assistant_message_id: 'a1', account_verdict: 'match',
        original_record_digest: createHash('sha256').update(original).digest('hex'), prompt_submitted: false, original_run_modified: false });
      expect(actions).toEqual(['evaluate', 'evaluate', 'evaluate']);
    } else await expect(result).rejects.toThrow();
    expect(actions.every(action => action === 'evaluate')).toBe(true);
    expect(JSON.stringify(record)).toBe(original.toString());
  });
});
