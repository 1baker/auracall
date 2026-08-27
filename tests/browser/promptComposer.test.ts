import { describe, expect, test, vi } from 'vitest';
import { promptComposerTestHooks as promptComposer } from '../../src/browser/actions/promptComposer.js';

describe('promptComposer', () => {
  test('does not mistake a selected app pill label for the requested prompt', () => {
    expect(promptComposer.composerContainsPrompt('Corel33t', 'Review the existing project')).toBe(false);
    expect(
      promptComposer.composerContainsPrompt(
        'Corel33t Review the existing project',
        'Review the existing project',
      ),
    ).toBe(true);
  });

  test('waits for a delayed ProseMirror readback before rejecting a large prompt', async () => {
    const prompt = '{"schema":"digest-bound","markdown":"line one\\nline two"}'.repeat(300);
    const runtime = {
      evaluate: vi
        .fn()
        .mockResolvedValueOnce({
          result: {
            value: {
              editorText: 'stale prior prompt',
              fallbackValue: '',
              editorUserText: 'stale prior prompt',
            },
          },
        })
        .mockResolvedValueOnce({
          result: {
            value: {
              editorText: `stale prior prompt ${prompt}`,
              fallbackValue: '',
              editorUserText: `stale prior prompt ${prompt}`,
            },
          },
        }),
    } as unknown as { evaluate: (args: { expression: string; returnByValue?: boolean }) => Promise<unknown> };

    await expect(
      promptComposer.waitForPromptInComposer(
        runtime as never,
        prompt,
        JSON.stringify('#prompt-textarea'),
        JSON.stringify('textarea'),
        1_200,
      ),
    ).resolves.toMatchObject({ editorUserText: expect.stringContaining(prompt) });
    expect((runtime.evaluate as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(2);
  });

  test('does not treat cleared composer + stop button as committed without a new turn', async () => {
    vi.useFakeTimers();
    try {
      const runtime = {
        evaluate: vi
          .fn()
          // Baseline read (turn count)
          .mockResolvedValueOnce({ result: { value: 10 } })
          // Polls (repeat)
          .mockResolvedValue({
            result: {
              value: {
                turnsCount: 10,
                userMatched: false,
                prefixMatched: false,
                lastMatched: false,
                hasNewTurn: false,
                stopVisible: true,
                assistantVisible: false,
                composerCleared: true,
                inConversation: false,
              },
            },
          }),
      } as unknown as { evaluate: (args: { expression: string; returnByValue?: boolean }) => Promise<unknown> };

      const promise = promptComposer.verifyPromptCommitted(runtime as never, 'hello', 150);
      const assertion = expect(promise).rejects.toThrow(/prompt did not appear/i);
      await vi.advanceTimersByTimeAsync(250);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });

  test('allows prompt match even if baseline turn count cannot be read', async () => {
    const runtime = {
      evaluate: vi
        .fn()
        // Baseline read fails
        .mockRejectedValueOnce(new Error('turn read failed'))
        // First poll shows prompt match (baseline unknown)
        .mockResolvedValueOnce({
          result: {
            value: {
              turnsCount: 1,
              userMatched: true,
              prefixMatched: false,
              lastMatched: true,
              hasNewTurn: false,
              stopVisible: false,
              assistantVisible: false,
              composerCleared: false,
              inConversation: true,
            },
          },
        }),
    } as unknown as { evaluate: (args: { expression: string; returnByValue?: boolean }) => Promise<unknown> };

    await expect(promptComposer.verifyPromptCommitted(runtime as never, 'hello', 150)).resolves.toBe(1);
  });

  test('waits for hot conversation submit readiness until stop state clears', async () => {
    vi.useFakeTimers();
    try {
      const runtime = {
        evaluate: vi
          .fn()
          .mockResolvedValueOnce({ result: { value: { ready: false } } })
          .mockResolvedValueOnce({ result: { value: { ready: false } } })
          .mockResolvedValueOnce({ result: { value: { ready: true } } }),
      } as unknown as { evaluate: (args: { expression: string; returnByValue?: boolean }) => Promise<unknown> };

      const promise = promptComposer.waitForComposerReadyToSubmit(runtime as never, 500);
      await vi.advanceTimersByTimeAsync(250);
      await expect(promise).resolves.toBeUndefined();
      expect((runtime.evaluate as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(3);
    } finally {
      vi.useRealTimers();
    }
  });

  test('accepts immediate submit readiness when conversation is already settled', async () => {
    const runtime = {
      evaluate: vi.fn().mockResolvedValueOnce({ result: { value: { ready: true } } }),
    } as unknown as { evaluate: (args: { expression: string; returnByValue?: boolean }) => Promise<unknown> };

    await expect(promptComposer.waitForComposerReadyToSubmit(runtime as never, 500)).resolves.toBeUndefined();
    expect((runtime.evaluate as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
  });
});
