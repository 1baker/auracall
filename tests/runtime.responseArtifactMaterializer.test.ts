import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConversationArtifact } from '../src/browser/providers/domain.js';

const fake = vi.hoisted(() => ({ buildListOptions: vi.fn(), materialize: vi.fn() }));
vi.mock('../src/browser/llmService/providers/index.js', () => ({
  createLlmService: () => ({
    buildListOptions: fake.buildListOptions,
    materializeConversationArtifacts: fake.materialize,
  }),
}));
import { materializeBrowserResponseArtifacts } from '../src/runtime/configuredExecutor.js';

describe('configured response materializer ownership boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fake.buildListOptions.mockResolvedValue({
      providerSessionAuthorization: {
        authority: { resolveExpectation: () => ({}) }, context: {},
      },
    });
  });

  const input = () => ({
    service: 'chatgpt' as const, executionConfig: {}, conversationId: 'conversation',
    answerMessageId: 'current', projectId: null, configuredUrl: null,
    tabUrl: null, tabTargetId: 'retained-target', chromeHost: '127.0.0.1', chromePort: 1234,
    providerSessionProof: {
      verdict: 'match', providerId: 'chatgpt', provenance: { browserProcessId: 123 },
    } as never,
  });

  it('passes exact ownership selection to conversation materialization and retains provenance', async () => {
    const candidates: ConversationArtifact[] = [
      { id: 'old', title: 'final.docx', messageId: 'old', uri: 'sandbox:/mnt/data/final.docx' },
      { id: 'current', title: 'final.docx', messageId: 'current', uri: 'sandbox:/mnt/data/final.docx' },
      { id: 'unknown', title: 'final.docx', uri: 'sandbox:/mnt/data/final.docx' },
    ];
    fake.materialize.mockImplementation(async (_id, options) => {
      const selected = candidates.filter(a => !options.excludeArtifact(a, candidates));
      return { artifacts: selected, files: selected.map(a => ({
        id: a.id, name: a.title, localPath: `/fixture/${a.id}/final.docx`,
      })), manifestPath: null };
    });
    const result = await materializeBrowserResponseArtifacts(input());
    expect(fake.materialize).toHaveBeenCalledTimes(1);
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0]).toMatchObject({
      id: 'current', path: '/fixture/current/final.docx',
      metadata: { responseMessageId: 'current' },
    });
  });

  it('never invokes conversation materialization without response identity', async () => {
    await expect(materializeBrowserResponseArtifacts({ ...input(), answerMessageId: null }))
      .rejects.toThrow('exact assistant message id');
    expect(fake.materialize).not.toHaveBeenCalled();
  });

  it('retains the existing provider-session authority gate', async () => {
    await expect(materializeBrowserResponseArtifacts({ ...input(), providerSessionProof: null }))
      .rejects.toThrow('successful provider-session proof');
    expect(fake.materialize).not.toHaveBeenCalled();
  });
});
