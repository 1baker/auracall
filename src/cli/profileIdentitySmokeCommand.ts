import { getPreferredRuntimeProfileName } from '../config/model.js';
import {
  createProviderSessionAuthority,
  type ProviderSessionContext,
  type ProviderSessionProof,
} from '../browser/providers/providerSessionAuthority.js';
import type { BrowserProviderConfig, ProviderUserIdentity } from '../browser/providers/types.js';

type MutableRecord = Record<string, unknown>;

export const PROFILE_IDENTITY_SMOKE_CONTRACT = 'auracall.profile-identity-smoke';
export const PROFILE_IDENTITY_SMOKE_CONTRACT_VERSION = 2;
export const PROFILE_IDENTITY_SMOKE_BATCH_CONTRACT = 'auracall.profile-identity-smoke.batch';

export type ProfileIdentitySmokeProvider = BrowserProviderConfig['id'];
export const PROFILE_IDENTITY_SMOKE_PROVIDERS: readonly ProfileIdentitySmokeProvider[] = [
  'chatgpt',
  'gemini',
  'grok',
];

export interface ResolvedConfiguredProviderIdentity {
  identity: ProviderUserIdentity | null;
  serviceAccountId: string | null;
  source: 'profile' | 'config' | null;
}

export interface ProfileIdentitySmokeNegativeCheck {
  requested: boolean;
  ok: boolean;
  expectedReason: string;
  proof: ProviderSessionProof | null;
}

export interface ProfileIdentitySmokeReport {
  contract: typeof PROFILE_IDENTITY_SMOKE_CONTRACT;
  version: typeof PROFILE_IDENTITY_SMOKE_CONTRACT_VERSION;
  generatedAt: string;
  runtimeProfile: string | null;
  target: ProfileIdentitySmokeProvider;
  launchedBrowser: boolean;
  expected: ResolvedConfiguredProviderIdentity;
  actualIdentity: ProviderUserIdentity | null;
  identityStatus: unknown;
  localReport: unknown;
  providerSessionProof: ProviderSessionProof;
  negative: ProfileIdentitySmokeNegativeCheck;
}

export interface ProfileIdentitySmokeBatchReport {
  contract: typeof PROFILE_IDENTITY_SMOKE_BATCH_CONTRACT;
  version: typeof PROFILE_IDENTITY_SMOKE_CONTRACT_VERSION;
  generatedAt: string;
  runtimeProfile: string | null;
  mode: 'all' | 'all-bound';
  targets: ProfileIdentitySmokeProvider[];
  reports: ProfileIdentitySmokeReport[];
  ok: boolean;
}

function describeProviderIdentity(identity: ProviderUserIdentity | null | undefined): string | null {
  if (!identity) return null;
  for (const candidate of [identity.email, identity.handle, identity.name, identity.id, identity.accountId]) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return null;
}

export function normalizeProfileIdentitySmokeProvider(value: unknown): ProfileIdentitySmokeProvider {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'chatgpt' || normalized === 'gemini' || normalized === 'grok') {
    return normalized;
  }
  throw new Error(`Invalid provider "${String(value)}". Use "chatgpt", "gemini", or "grok".`);
}

export function resolveProfileIdentitySmokeTargets(
  config: MutableRecord,
  input: {
    explicitTarget?: unknown;
    all?: boolean;
    allBound?: boolean;
    runtimeProfileId?: string | null;
    explicitAgentId?: string | null;
    fallbackTarget?: unknown;
  },
): ProfileIdentitySmokeProvider[] {
  if (input.all && input.allBound) {
    throw new Error('Use only one of --all or --all-bound.');
  }
  if (input.explicitTarget && (input.all || input.allBound)) {
    throw new Error('Use --target with a single smoke, or --all/--all-bound for a profile-wide smoke.');
  }
  if (input.all) {
    return [...PROFILE_IDENTITY_SMOKE_PROVIDERS];
  }
  if (input.allBound) {
    return PROFILE_IDENTITY_SMOKE_PROVIDERS.filter((providerId) => {
      const expected = resolveConfiguredProviderIdentity(config, {
        providerId,
        runtimeProfileId: input.runtimeProfileId,
        explicitAgentId: input.explicitAgentId ?? null,
      });
      return Boolean(expected.identity || expected.serviceAccountId);
    });
  }
  return [normalizeProfileIdentitySmokeProvider(input.explicitTarget ?? input.fallbackTarget ?? 'chatgpt')];
}

export function resolveConfiguredProviderIdentity(
  config: MutableRecord,
  input: {
    providerId: ProfileIdentitySmokeProvider;
    runtimeProfileId?: string | null;
    explicitAgentId?: string | null;
  },
): ResolvedConfiguredProviderIdentity {
  const runtimeProfileId =
    input.runtimeProfileId ??
    getPreferredRuntimeProfileName(config, {
      explicitAgentId: input.explicitAgentId ?? null,
    });
  const authority = createProviderSessionAuthority(config);
  const expectation = authority.resolveExpectation({
    providerId: input.providerId,
    auracallRuntimeProfile: runtimeProfileId,
    browserProfile: null,
    managedBrowserProfile: null,
  });
  return {
    identity: expectation.configuredIdentity,
    serviceAccountId: expectation.configuredServiceAccountId,
    source: expectation.source === 'runtime-profile' ? 'profile' : expectation.source === 'global-config' ? 'config' : null,
  };
}

export function buildProfileIdentitySmokeReport(input: {
  config: MutableRecord;
  target: ProfileIdentitySmokeProvider;
  runtimeProfileId?: string | null;
  explicitAgentId?: string | null;
  actualIdentity: ProviderUserIdentity | null;
  providerSessionProof?: ProviderSessionProof | null;
  identityStatus: unknown;
  localReport: unknown;
  launchedBrowser?: boolean;
  includeNegative?: boolean;
  generatedAt?: string;
}): ProfileIdentitySmokeReport {
  const runtimeProfile =
    input.runtimeProfileId ??
    getPreferredRuntimeProfileName(input.config, {
      explicitAgentId: input.explicitAgentId ?? null,
    });
  const expected = resolveConfiguredProviderIdentity(input.config, {
    providerId: input.target,
    runtimeProfileId: runtimeProfile,
    explicitAgentId: input.explicitAgentId ?? null,
  });
  const authority = createProviderSessionAuthority(input.config);
  const context: ProviderSessionContext = input.providerSessionProof?.provenance ?? {
    providerId: input.target,
    auracallRuntimeProfile: runtimeProfile,
    browserProfile: null,
    managedBrowserProfile: null,
  };
  const providerSessionProof = authority.verify({
    context,
    expectation: authority.resolveExpectation(context),
    observation: input.actualIdentity,
  });
  const expectedReason = 'provider_session_expectation_missing';
  const emptyAuthority = createProviderSessionAuthority({});
  const negativeProof = input.includeNegative
    ? emptyAuthority.verify({
        context,
        expectation: emptyAuthority.resolveExpectation(context),
        observation: input.actualIdentity,
      })
    : null;
  return {
    contract: PROFILE_IDENTITY_SMOKE_CONTRACT,
    version: PROFILE_IDENTITY_SMOKE_CONTRACT_VERSION,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    runtimeProfile,
    target: input.target,
    launchedBrowser: Boolean(input.launchedBrowser),
    expected,
    actualIdentity: providerSessionProof.observation,
    identityStatus: input.identityStatus,
    localReport: input.localReport,
    providerSessionProof,
    negative: {
      requested: Boolean(input.includeNegative),
      ok: input.includeNegative
        ? negativeProof?.failureReason === expectedReason
        : true,
      expectedReason,
      proof: negativeProof,
    },
  };
}

export function resolveProfileIdentitySmokeExitCode(report: ProfileIdentitySmokeReport): number {
  return report.providerSessionProof.verdict === 'match' && report.negative.ok ? 0 : 1;
}

export function buildProfileIdentitySmokeBatchReport(input: {
  reports: ProfileIdentitySmokeReport[];
  mode: 'all' | 'all-bound';
  runtimeProfile?: string | null;
  generatedAt?: string;
}): ProfileIdentitySmokeBatchReport {
  return {
    contract: PROFILE_IDENTITY_SMOKE_BATCH_CONTRACT,
    version: PROFILE_IDENTITY_SMOKE_CONTRACT_VERSION,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    runtimeProfile: input.runtimeProfile ?? input.reports[0]?.runtimeProfile ?? null,
    mode: input.mode,
    targets: input.reports.map((report) => report.target),
    reports: input.reports,
    ok: input.reports.every((report) => resolveProfileIdentitySmokeExitCode(report) === 0),
  };
}

export function resolveProfileIdentitySmokeBatchExitCode(report: ProfileIdentitySmokeBatchReport): number {
  return report.ok ? 0 : 1;
}

export function formatProfileIdentitySmokeReport(report: ProfileIdentitySmokeReport): string {
  const expected =
    describeProviderIdentity(report.expected.identity) ??
    report.expected.serviceAccountId ??
    '(missing expected identity)';
  const actual = describeProviderIdentity(report.actualIdentity) ?? '(identity not detected)';
  const expectedAccountLevel = report.expected.identity?.accountLevel ?? null;
  const actualAccountLevel = report.actualIdentity?.accountLevel ?? null;
  const status = report.providerSessionProof.verdict === 'match'
    ? 'PASS'
    : `FAIL ${report.providerSessionProof.failureReason ?? report.providerSessionProof.verdict}`;
  const negative =
    report.negative.requested
      ? `\nNegative missing-identity check: ${report.negative.ok ? 'PASS' : 'FAIL'} (${report.negative.expectedReason})`
      : '';
  return [
    `Profile identity smoke: ${status}`,
    `AuraCall runtime profile: ${report.runtimeProfile ?? '(none)'}`,
    `Target: ${report.target}`,
    `Expected: ${expected}`,
    `Actual: ${actual}`,
    expectedAccountLevel || actualAccountLevel
      ? `Account level: expected ${expectedAccountLevel ?? '(not configured)'}; actual ${actualAccountLevel ?? '(not detected)'}`
      : '',
    `Browser launched: ${report.launchedBrowser ? 'yes' : 'no'}`,
    negative.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatProfileIdentitySmokeBatchReport(report: ProfileIdentitySmokeBatchReport): string {
  const header = `Profile identity smoke batch: ${report.ok ? 'PASS' : 'FAIL'} (${report.mode}, AuraCall runtime profile ${
    report.runtimeProfile ?? '(none)'
  })`;
  const body = report.reports
    .map((single) => {
      const expected =
        describeProviderIdentity(single.expected.identity) ??
        single.expected.serviceAccountId ??
        '(missing expected identity)';
      const actual = describeProviderIdentity(single.actualIdentity) ?? '(identity not detected)';
      const expectedAccountLevel = single.expected.identity?.accountLevel ?? null;
      const actualAccountLevel = single.actualIdentity?.accountLevel ?? null;
      const accountLevel =
        expectedAccountLevel || actualAccountLevel
          ? `; account level expected ${expectedAccountLevel ?? '(not configured)'}, actual ${actualAccountLevel ?? '(not detected)'}`
          : '';
      const status = single.providerSessionProof.verdict === 'match' && single.negative.ok
        ? 'PASS'
        : `FAIL ${single.providerSessionProof.failureReason ?? single.providerSessionProof.verdict}`;
      return `- ${single.target}: ${status}; expected ${expected}; actual ${actual}${accountLevel}; launched ${
        single.launchedBrowser ? 'yes' : 'no'
      }`;
    })
    .join('\n');
  return `${header}\n${body}`;
}
