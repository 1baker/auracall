import { expect, it, vi } from 'vitest';
import { createExecutionRequest } from '../src/runtime/apiModel.js';
import { createConfiguredStoredStepExecutor } from '../src/runtime/configuredExecutor.js';

const project = 'g-p-0123456789abcdef0123456789abcdef';
const conversation = `https://chatgpt.com/g/${project}/c/01234567-89ab-cdef-0123-456789abcdef`;

it('preserves the explicit request hint and rejects invalid or ambiguous destinations', () => {
  expect(createExecutionRequest({ model: 'test', input: 'test', auracall: { chatgptNewConversationProjectId: project } }).auracall?.chatgptNewConversationProjectId).toBe(project);
  for (const id of ['', 'g-p-short', `${project}/project`, project.toUpperCase()]) {
    expect(() => createExecutionRequest({ model: 'test', input: 'test', auracall: { chatgptNewConversationProjectId: id } })).toThrow();
  }
  expect(() => createExecutionRequest({ model: 'test', input: 'test', auracall: { chatgptNewConversationProjectId: project, chatgptConversationUrl: conversation } })).toThrow();
  expect(() => createExecutionRequest({ model: 'test', input: 'test', auracall: { chatgptDestination: 'normal_new', chatgptNewConversationProjectId: project } })).toThrow();
  expect(() => createExecutionRequest({ model: 'test', input: 'test', auracall: { chatgptDestination: 'existing_conversation' } })).toThrow();
});

it.each([
  ['normal_new', { chatgptDestination: 'normal_new' }, { projectId: null, conversationId: null, chatgptNewConversationProjectId: null, url: 'https://chatgpt.com/' }],
  ['new_project_conversation', { chatgptDestination: 'new_project_conversation', chatgptNewConversationProjectId: project }, { projectId: project, conversationId: null, chatgptNewConversationProjectId: project, url: `https://chatgpt.com/g/${project}/project` }],
  ['existing_conversation', { chatgptDestination: 'existing_conversation', chatgptConversationUrl: conversation }, { projectId: null, conversationId: null, chatgptNewConversationProjectId: null, url: conversation }],
] as const)('resolves explicit ChatGPT destination mode before browser acquisition: %s', async (_name, auracall, expected) => {
  const runBrowserModeImpl = vi.fn(async () => ({ answerText: 'Ready', answerMarkdown: 'Ready', answerMessageId: 'assistant-1', tookMs: 1, answerTokens: 1, answerChars: 5, tabUrl: conversation }));
  const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
    engine: 'browser', defaultService: 'chatgpt', browserProfile: 'default',
    services: { chatgpt: { projectId: 'g-p-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', manualLoginProfileDir: '/tmp/destination-test' } },
  } } }, { runBrowserModeImpl });
  if (!execute) throw new Error('Configured executor was not created.');
  await execute({
    record: { runId: 'destination-test', revision: 1, bundle: { run: { id: 'destination-test', initialInputs: { auracall } }, events: [] } } as never,
    step: { id: 'step-1', agentId: 'test', runtimeProfileId: 'default', service: 'chatgpt', input: { prompt: 'Write the document', artifacts: [], notes: [], structuredData: {} } } as never,
  });
  expect(runBrowserModeImpl).toHaveBeenCalledWith(expect.objectContaining({ config: expect.objectContaining(expected) }));
});

it('uses a policy-selected agent destination without inspecting prompt content', async () => {
  const runBrowserModeImpl = vi.fn(async () => ({ answerText: 'Ready', answerMarkdown: 'Ready', answerMessageId: 'assistant-1', tookMs: 1, answerTokens: 1, answerChars: 5, tabUrl: conversation }));
  const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: { engine: 'browser', defaultService: 'chatgpt', services: { chatgpt: { manualLoginProfileDir: '/tmp/agent-destination-test' } } } }, agents: {
    proposal: { runtimeProfile: 'default', service: 'chatgpt', projectId: project, chatgptDestination: 'new_project_conversation' },
  } }, { runBrowserModeImpl });
  if (!execute) throw new Error('Configured executor was not created.');
  await execute({
    record: { runId: 'agent-destination-test', revision: 1, bundle: { run: { id: 'agent-destination-test' }, events: [] } } as never,
    step: { id: 'step-1', agentId: 'proposal', runtimeProfileId: 'default', service: 'chatgpt', input: { prompt: 'Unrelated words must not change destination.', artifacts: [], notes: [], structuredData: {} } } as never,
  });
  expect(runBrowserModeImpl).toHaveBeenCalledWith(expect.objectContaining({ config: expect.objectContaining({ projectId: project, chatgptNewConversationProjectId: project, url: `https://chatgpt.com/g/${project}/project` }) }));
});

it.each(['valid', 'wrong-project', 'missing-url', 'missing-artifact', 'conflict'] as const)('routes new chat once and verifies the returned destination: %s', async (kind) => {
  const runBrowserModeImpl = vi.fn(async () => ({ answerText: 'Ready', answerMarkdown: 'Ready', answerMessageId: 'assistant-1', tookMs: 1, answerTokens: 1, answerChars: 5,
    tabUrl: kind === 'missing-url' ? undefined : kind === 'wrong-project' ? 'https://chatgpt.com/c/01234567-89ab-cdef-0123-456789abcdef' : conversation,
  }));
  const materializer = vi.fn(async () => ({ artifacts: [], notes: [] }));
  const execute = createConfiguredStoredStepExecutor({ runtimeProfiles: { default: {
    engine: 'browser', defaultService: 'chatgpt', browserProfile: 'default',
    services: { chatgpt: { projectId: 'g-p-stale-config', manualLoginProfileDir: '/tmp/new-project-test' } },
  } } }, { runBrowserModeImpl, browserResponseArtifactMaterializer: materializer });
  const result = execute?.({
    record: { runId: 'new-project-test', revision: 1, bundle: { run: { id: 'new-project-test', initialInputs: { auracall: {
      chatgptNewConversationProjectId: project, ...(kind === 'conflict' ? { chatgptConversationUrl: conversation } : {}),
    } } }, events: [] } } as never,
    step: { id: 'step-1', agentId: 'test', runtimeProfileId: 'default', service: 'chatgpt', input: {
      prompt: 'Write the document', artifacts: [], notes: [], structuredData: kind === 'missing-artifact' ? { metadata: { outputContract: { mode: 'artifact', artifactFileName: 'original.docx' } } } : {},
    } } as never,
  });
  if (kind === 'valid') await expect(result).resolves.toBeDefined();
  else await expect(result).rejects.toThrow();
  expect(runBrowserModeImpl).toHaveBeenCalledTimes(kind === 'conflict' ? 0 : 1);
  if (kind !== 'conflict') expect(runBrowserModeImpl).toHaveBeenCalledWith(expect.objectContaining({ config: expect.objectContaining({
    projectId: project, chatgptNewConversationProjectId: project, conversationId: null,
    url: `https://chatgpt.com/g/${project}/project`, chatgptUrl: `https://chatgpt.com/g/${project}/project`,
  }) }));
  if (kind === 'wrong-project' || kind === 'missing-url') expect(materializer).not.toHaveBeenCalled();
});
