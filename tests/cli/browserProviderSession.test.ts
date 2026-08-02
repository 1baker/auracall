import { describe, expect, test } from 'vitest';
import type { ResolvedUserConfig } from '../../src/config.js';
import type { BrowserSessionConfig } from '../../src/sessionStore.js';
import { buildRootBrowserProviderSessionAuthorization } from '../../src/cli/browserProviderSession.js';

describe('buildRootBrowserProviderSessionAuthorization', () => {
  test('binds the selected runtime and browser profiles to configured ChatGPT account authority', () => {
    const userConfig = {
      auracallProfile: 'default',
      profiles: {
        default: {
          browserProfile: 'wsl-chrome-2',
          services: {
            chatgpt: { identity: { email: 'operator@example.com' } },
          },
        },
      },
    } as unknown as ResolvedUserConfig;
    const browserConfig = {
      target: 'chatgpt',
      auracallProfileName: 'default',
      chromeProfile: 'Default',
      manualLoginProfileDir: '/tmp/managed/default/chatgpt',
    } as BrowserSessionConfig;

    const authorization = buildRootBrowserProviderSessionAuthorization(userConfig, browserConfig);

    expect(authorization).toBeDefined();
    expect(authorization?.context).toMatchObject({
      providerId: 'chatgpt',
      auracallRuntimeProfile: 'default',
      browserProfile: 'wsl-chrome-2',
      sourceBrowserProfile: 'Default',
      managedBrowserProfile: '/tmp/managed/default/chatgpt',
      browserProcessId: null,
      browserTargetId: null,
    });
    expect(authorization?.expectation).toMatchObject({
      configuredIdentity: { email: 'operator@example.com' },
      source: 'runtime-profile',
    });
    expect(browserConfig).not.toHaveProperty('providerSessionAuthorization');
  });
});
