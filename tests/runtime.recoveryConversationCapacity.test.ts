import { expect, it, vi } from 'vitest';
import { createConfiguredStoredStepExecutor } from '../src/runtime/configuredExecutor.js';
import { BrowserAutomationError } from '../src/oracle/errors.js';
import { CHATGPT_CONVERSATION_CAPACITY_CODE } from '../src/browser/providers/chatgptConversationCapacity.js';

it.each(['capacity', 'other-browser', 'plain-error', 'lookalike'] as const)(
  'preserves only typed capacity failures during recovery: %s', async (kind) => {
    const details = { code: CHATGPT_CONVERSATION_CAPACITY_CODE, retryable: false, recoveryAction: 'new_conversation_required', messageId: 'exact-assistant' };
    const failure = kind === 'capacity' ? new BrowserAutomationError('Capacity exhausted', details)
      : kind === 'other-browser' ? new BrowserAutomationError('Different browser failure', { code: 'other' })
      : kind === 'lookalike' ? Object.assign(new Error('Untyped capacity'), { details })
      : new Error('Network failure');
    const runBrowserModeImpl = vi.fn(async () => { throw new Error('UNEXPECTED_SUBMISSION'); });
    const browserResponseArtifactMaterializer = vi.fn(async () => ({ artifacts: [], notes: [] }));
    const resumeBrowserSessionImpl = vi.fn(async () => { throw failure; });
    const execute = createConfiguredStoredStepExecutor({
      runtimeProfiles: { default: { engine: 'browser', defaultService: 'chatgpt', browserProfile: 'default',
        services: { chatgpt: { manualLoginProfileDir: '/tmp/recovery-capacity-test' } } } },
    }, { runBrowserModeImpl, resumeBrowserSessionImpl, browserResponseArtifactMaterializer });
    const result = execute?.({
      record: { runId: 'recovery-capacity-test', revision: 1, bundle: {
        run: { id: 'recovery-capacity-test', initialInputs: {} },
        events: [
          { type: 'note-added', stepId: 'step-1', payload: { runtimeEvidence: {
            state: 'response-incoming', evidenceRef: 'chatgpt-assistant-snapshot', details: {
              service: 'chatgpt', chromeTargetId: 'original-target', chromePort: 45012,
              chromeHost: '127.0.0.1', tabUrl: 'https://chatgpt.com/c/original-conversation',
            },
          } } },
          { type: 'note-added', stepId: 'step-1', note: 'recovered stranded running step for host replay', payload: { source: 'service-host' } },
        ],
      } } as never,
      step: { id: 'step-1', agentId: 'test', runtimeProfileId: 'default', service: 'chatgpt', input: {
        prompt: 'Create the document.', artifacts: [], notes: [], structuredData: {
          metadata: { outputContract: { mode: 'artifact', artifactFileName: 'original.docx' } },
        },
      } } as never,
    });
    if (kind === 'capacity') {
      await expect(result).rejects.toBe(failure);
    } else {
      await expect(result).rejects.toThrow('refusing to replay the prompt');
      await expect(result).rejects.not.toHaveProperty('details');
    }
    expect(resumeBrowserSessionImpl).toHaveBeenCalledOnce();
    expect(runBrowserModeImpl).not.toHaveBeenCalled();
    expect(browserResponseArtifactMaterializer).not.toHaveBeenCalled();
  },
);
