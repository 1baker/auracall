import { describe, expect, test } from 'vitest';
import { buildDetachedSessionProcessArgs, shouldDetachSession } from '../../src/cli/detach.js';

describe('buildDetachedSessionProcessArgs', () => {
  test('preserves the current Node loader arguments', () => {
    expect(
      buildDetachedSessionProcessArgs({
        execArgv: ['--import', 'tsx/loader.mjs'],
        entrypoint: '/repo/bin/auracall.ts',
        sessionId: 'session-123',
      }),
    ).toEqual([
      '--import',
      'tsx/loader.mjs',
      '--',
      '/repo/bin/auracall.ts',
      '--exec-session',
      'session-123',
    ]);
  });
});

describe('shouldDetachSession', () => {
  test('disables detach when env disables it', () => {
    const result = shouldDetachSession({
      engine: 'api',
      model: 'gpt-5.1',
      waitPreference: true,
      disableDetachEnv: true,
    });
    expect(result).toBe(false);

    const browser = shouldDetachSession({
      engine: 'browser',
      model: 'chatgpt:premium',
      waitPreference: false,
      disableDetachEnv: true,
    });
    expect(browser).toBe(false);
  });

  test('disables detach for non-pro models (gemini, codex, 5.1)', () => {
    const result = shouldDetachSession({
      engine: 'api',
      model: 'gemini-3-pro',
      waitPreference: true,
      disableDetachEnv: false,
    });
    expect(result).toBe(false);

    const codex = shouldDetachSession({
      engine: 'api',
      model: 'gpt-5.1-codex',
      waitPreference: true,
      disableDetachEnv: false,
    });
    expect(codex).toBe(false);

    const standard = shouldDetachSession({
      engine: 'api',
      model: 'gpt-5.1',
      waitPreference: true,
      disableDetachEnv: false,
    });
    expect(standard).toBe(false);
  });

  test('allows an explicitly non-waiting local browser run to detach', () => {
    const result = shouldDetachSession({
      engine: 'browser',
      model: 'chatgpt:premium',
      waitPreference: false,
      disableDetachEnv: false,
    });

    expect(result).toBe(true);
  });

  test('keeps the default waiting browser run inline', () => {
    const result = shouldDetachSession({
      engine: 'browser',
      model: 'chatgpt:premium',
      waitPreference: true,
      disableDetachEnv: false,
    });

    expect(result).toBe(false);
  });

  test('allows explicit no-wait for a non-pro local API run', () => {
    const result = shouldDetachSession({
      engine: 'api',
      model: 'gpt-5.1',
      waitPreference: false,
      disableDetachEnv: false,
    });

    expect(result).toBe(true);
  });

  test('allows detach for pro models when env permits', () => {
    const pro52 = shouldDetachSession({
      engine: 'api',
      model: 'gpt-5.2-pro',
      waitPreference: true,
      disableDetachEnv: false,
    });
    expect(pro52).toBe(true);
  });
});
