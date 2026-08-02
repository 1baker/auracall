import type { ResolvedUserConfig } from '../config.js';
import { getPreferredRuntimeProfile, getRuntimeProfileBrowserProfileId } from '../config/model.js';
import type { BrowserSessionConfig } from '../sessionStore.js';
import {
  createProviderSessionAuthorization,
  type ProviderSessionAuthorization,
} from '../browser/providers/providerSessionAuthority.js';

export function buildRootBrowserProviderSessionAuthorization(
  userConfig: ResolvedUserConfig,
  browserConfig: BrowserSessionConfig,
): ProviderSessionAuthorization | null {
  const providerId = browserConfig.target;
  if (providerId !== 'chatgpt' && providerId !== 'gemini' && providerId !== 'grok') {
    return null;
  }
  const auracallRuntimeProfile = browserConfig.auracallProfileName ?? userConfig.auracallProfile ?? null;
  const runtimeProfile = getPreferredRuntimeProfile(userConfig, {
    explicitProfileName: auracallRuntimeProfile,
  });
  const browserProfile = getRuntimeProfileBrowserProfileId(runtimeProfile) ?? auracallRuntimeProfile;
  return createProviderSessionAuthorization(
    userConfig as unknown as Record<string, unknown>,
    {
      providerId,
      auracallRuntimeProfile,
      browserProfile,
      sourceBrowserProfile: browserConfig.chromeProfile ?? null,
      managedBrowserProfile: browserConfig.manualLoginProfileDir ?? null,
      browserProcessId: null,
      browserTargetId: null,
    },
  );
}
