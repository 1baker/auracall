import { describe, expect, it, vi } from 'vitest';
import {
  buildChatgptComposerModeExpressionForTest,
  ensureChatgptComposerMode,
  resolveChatgptModelSelectionPlanForTest,
} from '../../src/browser/actions/chatgptComposerMode.js';
import { buildChatgptWorkModelSelectionExpressionForTest } from '../../src/browser/actions/chatgptWorkModelSelection.js';

describe('ChatGPT composer mode', () => {
  it('targets exact Chat and Work radios and verifies Radix selected state', () => {
    const expression = buildChatgptComposerModeExpressionForTest('chat');

    expect(() => new Function(`return ${expression}`)).not.toThrow();
    expect(expression).toContain('[role="radio"]');
    expect(expression).toContain("label === 'chat' || label === 'work'");
    expect(expression).toContain("getAttribute('aria-checked') === 'true'");
    expect(expression).toContain("getAttribute('data-state') === 'on'");
  });

  it('accepts the already-selected Chat radio', async () => {
    const evaluate = vi.fn().mockResolvedValue({
      result: { value: { status: 'already-selected', mode: 'chat' } },
    });
    const logger = vi.fn();

    await ensureChatgptComposerMode({ evaluate } as never, 'chat', logger);

    expect(logger).toHaveBeenCalledWith('ChatGPT mode: Chat (already selected)');
  });

  it('fails clearly when explicit Work is unavailable', async () => {
    const evaluate = vi.fn().mockResolvedValue({
      result: { value: { status: 'mode-not-found', availableModes: ['Chat'] } },
    });

    const logger = vi.fn<(message: string) => void>();

    await expect(ensureChatgptComposerMode({ evaluate } as never, 'work', logger)).rejects.toThrow(
      /Work.*Available: Chat/i,
    );
  });

  it('routes Chat and Work model selection through disjoint plans', () => {
    expect(
      resolveChatgptModelSelectionPlanForTest({
        mode: 'chat',
        desiredModel: 'GPT-5.6 Terra',
        workModel: null,
        strategy: 'select',
      }),
    ).toEqual({ kind: 'chat-model', model: 'GPT-5.6 Terra', strategy: 'select' });

    expect(
      resolveChatgptModelSelectionPlanForTest({
        mode: 'work',
        desiredModel: 'GPT-5.6 Terra',
        workModel: null,
        strategy: 'select',
      }),
    ).toEqual({ kind: 'work-current' });

    expect(
      resolveChatgptModelSelectionPlanForTest({
        mode: 'work',
        desiredModel: 'GPT-5.6 Terra',
        workModel: 'Research',
        strategy: 'select',
      }),
    ).toEqual({ kind: 'work-model', model: 'Research', strategy: 'select' });
  });

  it('keeps the Work model selector disjoint from known Chat picker controls', () => {
    const expression = buildChatgptWorkModelSelectionExpressionForTest('Research');

    expect(() => new Function(`return ${expression}`)).not.toThrow();
    expect(expression).toContain('[data-mode="work"]');
    expect(expression).not.toContain('model-switcher-dropdown-button');
    expect(expression).not.toContain('button.__composer-pill');
    expect(expression).not.toContain('Switch model');
    expect(expression).toContain("!['chat', 'work'].includes");
    expect(expression).toContain('performance.now() - startedAt < 5000');
  });
});
