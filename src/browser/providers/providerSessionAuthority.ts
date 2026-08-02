import { createHash } from "node:crypto";
import { getCurrentRuntimeProfiles } from "../../config/model.js";
import { createConfiguredServiceAccountId } from "../../config/serviceAccountIdentity.js";
import type { BrowserProviderConfig, ProviderUserIdentity } from "./types.js";

type MutableRecord = Record<string, unknown>;

export interface ProviderSessionContext {
	providerId: BrowserProviderConfig["id"];
	auracallRuntimeProfile: string | null;
	browserProfile: string | null;
	sourceBrowserProfile?: string | null;
	managedBrowserProfile: string | null;
	browserProcessId?: number | null;
	browserTargetId?: string | null;
	devtoolsHost?: string | null;
	devtoolsPort?: number | null;
}

export interface ProviderAccountExpectation {
	providerId: BrowserProviderConfig["id"];
	configuredIdentity: ProviderUserIdentity | null;
	configuredServiceAccountId: string | null;
	source: "runtime-profile" | "global-config" | null;
}

export type ProviderSessionVerdict = "match" | "missing" | "conflict" | "stale";
export type ProviderSessionDimensionState = "match" | "unknown" | "conflict";

export interface ProviderSessionDimensionEvidence {
	dimension:
		| "email"
		| "handle"
		| "user-id"
		| "account-id"
		| "organization"
		| "plan"
		| "structure"
		| "account-level";
	state: ProviderSessionDimensionState;
	expected: string | null;
	observed: string | null;
	expectationSource: ProviderAccountExpectation["source"];
	observationSource: string | null;
}

export interface ProviderSessionProof {
	verdict: ProviderSessionVerdict;
	providerId: BrowserProviderConfig["id"];
	expectation: ProviderAccountExpectation;
	observation: ProviderUserIdentity | null;
	sessionFingerprint: string | null;
	dimensions: ProviderSessionDimensionEvidence[];
	observedAt: string;
	failureReason:
		| "provider_session_expectation_missing"
		| "provider_session_observation_missing"
		| "provider_session_provenance_missing"
		| "provider_session_stale"
		| "provider_session_dimension_conflict"
		| null;
	provenance: ProviderSessionContext;
}

export interface ProviderSessionAuthority {
	resolveExpectation(context: ProviderSessionContext): ProviderAccountExpectation;
	verify(input: {
		context: ProviderSessionContext;
		expectation: ProviderAccountExpectation;
		observation: ProviderUserIdentity | null;
	}): ProviderSessionProof;
	validateProof(context: ProviderSessionContext, proof: ProviderSessionProof): ProviderSessionProof;
	assertProof(proof: ProviderSessionProof): ProviderSessionProof;
}

export interface ProviderSessionAuthorization {
	authority: ProviderSessionAuthority;
	context: ProviderSessionContext;
	expectation: ProviderAccountExpectation;
	proof?: ProviderSessionProof | null;
	onProof?: (proof: ProviderSessionProof) => void;
}

export interface ProviderSessionProofSummary {
	providerId: BrowserProviderConfig["id"];
	verdict: ProviderSessionVerdict;
	failureReason: ProviderSessionProof["failureReason"];
	observedAt: string;
	sessionFingerprint: string | null;
	dimensions: Array<{
		dimension: ProviderSessionDimensionEvidence["dimension"];
		state: ProviderSessionDimensionState;
		expectedFingerprint: string | null;
		observedFingerprint: string | null;
		expectationSource: ProviderAccountExpectation["source"];
		observationSource: string | null;
	}>;
	provenance: ProviderSessionContext;
}

export function createProviderSessionAuthority(
	config: MutableRecord,
	options: { now?: () => Date } = {},
): ProviderSessionAuthority {
	const now = options.now ?? (() => new Date());
	return {
		resolveExpectation(context) {
			const resolved = resolveConfiguredProviderIdentity(config, context);
			return {
				providerId: context.providerId,
				configuredIdentity: resolved.identity,
				configuredServiceAccountId: createConfiguredServiceAccountId(
					context.providerId,
					resolved.serviceConfig,
				),
				source: resolved.source,
			};
		},
		verify({ context, expectation, observation }) {
			const dimensions = buildDimensionEvidence(expectation, observation);
			const primary = dimensions.filter((entry) => PRIMARY_DIMENSIONS.has(entry.dimension));
			const qualifiers = dimensions.filter((entry) => !PRIMARY_DIMENSIONS.has(entry.dimension));
			const sessionFingerprint = createProviderSessionFingerprint(context);
			const verdict: ProviderSessionVerdict =
				expectation.providerId !== context.providerId
					? "stale"
					: !sessionFingerprint
						? "missing"
					: primary.some((entry) => entry.state === "conflict") ||
								qualifiers.some((entry) => entry.state === "conflict")
							? "conflict"
							: primary.length === 0 || primary.some((entry) => entry.state === "unknown")
								? "missing"
								: "match";
			const failureReason = resolveProviderSessionFailureReason({
				verdict,
				expectation,
				observation,
				sessionFingerprint,
			});
			return {
				verdict,
				providerId: context.providerId,
				expectation,
				observation,
				sessionFingerprint,
				dimensions,
				observedAt: now().toISOString(),
				failureReason,
				provenance: { ...context },
			};
		},
		validateProof(context, proof) {
			const fingerprint = createProviderSessionFingerprint(context);
			if (
				proof.providerId === context.providerId &&
				proof.sessionFingerprint &&
				proof.sessionFingerprint === fingerprint
			) {
				return proof;
			}
			return {
				...proof,
				verdict: "stale",
				failureReason: "provider_session_stale",
				provenance: { ...context },
			};
		},
		assertProof(proof) {
			if (proof.verdict === "match") return proof;
			throw new ProviderSessionAuthorityError(proof);
		},
	};
}

export function createProviderSessionAuthorization(
	config: MutableRecord,
	context: ProviderSessionContext,
	options: { now?: () => Date; onProof?: (proof: ProviderSessionProof) => void } = {},
): ProviderSessionAuthorization {
	const authority = createProviderSessionAuthority(config, { now: options.now });
	return {
		authority,
		context: { ...context },
		expectation: authority.resolveExpectation(context),
		onProof: options.onProof,
	};
}

export function summarizeProviderSessionAuthorization(
	authorization: ProviderSessionAuthorization,
): {
	providerId: BrowserProviderConfig["id"];
	expectationSource: ProviderAccountExpectation["source"];
	configuredIdentityPresent: boolean;
	configuredServiceAccountIdPresent: boolean;
	context: ProviderSessionContext;
} {
	return {
		providerId: authorization.expectation.providerId,
		expectationSource: authorization.expectation.source,
		configuredIdentityPresent: authorization.expectation.configuredIdentity !== null,
		configuredServiceAccountIdPresent:
			authorization.expectation.configuredServiceAccountId !== null,
		context: { ...authorization.context },
	};
}

export class ProviderSessionAuthorityError extends Error {
	readonly code: ProviderSessionProof["failureReason"];
	readonly proof: ProviderSessionProof;

	constructor(proof: ProviderSessionProof) {
		super(formatProviderSessionFailure(proof));
		this.name = "ProviderSessionAuthorityError";
		this.code = proof.failureReason;
		this.proof = proof;
	}
}

export function assertProviderSessionAuthorization(
	authorization: ProviderSessionAuthorization | null | undefined,
	observation: ProviderUserIdentity | null,
	contextPatch: Partial<ProviderSessionContext> = {},
): ProviderSessionProof {
	if (!authorization) {
		throw new Error("Provider-session authorization context is missing.");
	}
	const context = { ...authorization.context, ...contextPatch };
	const proof = authorization.authority.verify({
		context,
		expectation: authorization.expectation,
		observation,
	});
	recordProviderSessionProof(authorization, proof);
	return authorization.authority.assertProof(proof);
}

export function recordProviderSessionProof(
	authorization: ProviderSessionAuthorization,
	proof: ProviderSessionProof,
): ProviderSessionProof {
	authorization.proof = proof;
	authorization.onProof?.(proof);
	return proof;
}

export function summarizeProviderSessionProof(
	proof: ProviderSessionProof,
): ProviderSessionProofSummary {
	return {
		providerId: proof.providerId,
		verdict: proof.verdict,
		failureReason: proof.failureReason,
		observedAt: proof.observedAt,
		sessionFingerprint: proof.sessionFingerprint,
		dimensions: proof.dimensions.map((entry) => ({
			dimension: entry.dimension,
			state: entry.state,
			expectedFingerprint: redactProviderAccountValue(entry.expected),
			observedFingerprint: redactProviderAccountValue(entry.observed),
			expectationSource: entry.expectationSource,
			observationSource: entry.observationSource,
		})),
		provenance: { ...proof.provenance },
	};
}

function redactProviderAccountValue(value: string | null): string | null {
	if (!value) return null;
	return `sha256:${createHash("sha256").update(value).digest("hex").slice(0, 16)}`;
}

function resolveConfiguredProviderIdentity(
	config: MutableRecord,
	context: ProviderSessionContext,
): {
	identity: ProviderUserIdentity | null;
	serviceConfig: unknown;
	source: ProviderAccountExpectation["source"];
} {
	const runtimeProfiles = getCurrentRuntimeProfiles(config);
	const runtimeProfile = context.auracallRuntimeProfile
		? asRecord(runtimeProfiles[context.auracallRuntimeProfile])
		: null;
	const profileService = asRecord(asRecord(runtimeProfile?.services)?.[context.providerId]);
	const globalService = asRecord(asRecord(config.services)?.[context.providerId]);
	const profileIdentity = normalizeConfiguredIdentity(asRecord(profileService?.identity));
	const globalIdentity = normalizeConfiguredIdentity(asRecord(globalService?.identity));
	const identity = profileIdentity ?? globalIdentity;
	const serviceConfig = profileIdentity
		? profileService
		: globalIdentity
			? globalService
			: profileService ?? globalService;
	return {
		identity,
		serviceConfig,
		source: profileIdentity
			? "runtime-profile"
			: globalIdentity
				? "global-config"
				: null,
	};
}

function normalizeConfiguredIdentity(identity: MutableRecord | null): ProviderUserIdentity | null {
	if (!identity) return null;
	const normalized: ProviderUserIdentity = {};
	for (const key of [
		"id",
		"name",
		"handle",
		"email",
		"accountId",
		"organizationId",
		"accountPlanType",
		"accountStructure",
		"accountLevel",
	] as const) {
		const value = normalizeString(identity[key]);
		if (value) normalized[key] = value;
	}
	return Object.keys(normalized).length > 0 ? normalized : null;
}

const PRIMARY_DIMENSIONS = new Set<ProviderSessionDimensionEvidence["dimension"]>([
	"email",
	"handle",
	"user-id",
	"account-id",
	"organization",
]);

const DIMENSION_FIELDS = [
	["email", "email"],
	["handle", "handle"],
	["user-id", "id"],
	["account-id", "accountId"],
	["organization", "organizationId"],
	["plan", "accountPlanType"],
	["structure", "accountStructure"],
	["account-level", "accountLevel"],
] as const;

function buildDimensionEvidence(
	expectation: ProviderAccountExpectation,
	observation: ProviderUserIdentity | null,
): ProviderSessionDimensionEvidence[] {
	const normalizedObservation = normalizeProviderObservation(expectation.providerId, observation);
	return DIMENSION_FIELDS.flatMap(([dimension, field]) => {
		const expected = normalizeComparable(expectation.configuredIdentity?.[field]);
		if (!expected) return [];
		const observed = normalizeComparable(normalizedObservation?.[field]);
		return [{
			dimension,
			state: !observed ? "unknown" : observed === expected ? "match" : "conflict",
			expected,
			observed,
			expectationSource: expectation.source,
			observationSource: normalizeString(observation?.source),
		} satisfies ProviderSessionDimensionEvidence];
	});
}

function normalizeProviderObservation(
	providerId: BrowserProviderConfig["id"],
	observation: ProviderUserIdentity | null,
): ProviderUserIdentity | null {
	if (!observation) return null;
	if (providerId !== "chatgpt" || normalizeString(observation.accountLevel)) return observation;
	const plan = normalizeComparable(observation.accountPlanType);
	const structure = normalizeComparable(observation.accountStructure);
	const accountLevel = plan === "team" && structure === "workspace" ? "Business" : undefined;
	return accountLevel ? { ...observation, accountLevel } : observation;
}

function createProviderSessionFingerprint(context: ProviderSessionContext): string | null {
	const processId = Number.isFinite(context.browserProcessId) ? context.browserProcessId : null;
	const targetId = normalizeString(context.browserTargetId);
	if (!processId || !targetId) return null;
	return createHash("sha256")
		.update(JSON.stringify({ providerId: context.providerId, processId, targetId }))
		.digest("hex");
}

function resolveProviderSessionFailureReason(input: {
	verdict: ProviderSessionVerdict;
	expectation: ProviderAccountExpectation;
	observation: ProviderUserIdentity | null;
	sessionFingerprint: string | null;
}): ProviderSessionProof["failureReason"] {
	if (input.verdict === "match") return null;
	if (input.verdict === "stale") return "provider_session_stale";
	if (!input.sessionFingerprint) return "provider_session_provenance_missing";
	if (!input.expectation.configuredIdentity) return "provider_session_expectation_missing";
	if (!input.observation) return "provider_session_observation_missing";
	return input.verdict === "conflict"
		? "provider_session_dimension_conflict"
		: "provider_session_observation_missing";
}

function formatProviderSessionFailure(proof: ProviderSessionProof): string {
	const conflicts = proof.dimensions
		.filter((entry) => entry.state === "conflict")
		.map((entry) =>
			`${entry.dimension}: expected ${entry.expected ?? "unknown"}, observed ${entry.observed ?? "unknown"} ` +
			`(${entry.expectationSource ?? "unconfigured"} vs ${entry.observationSource ?? "unknown source"})`,
		);
	const context =
		`AuraCall runtime profile=${proof.provenance.auracallRuntimeProfile ?? "none"}, ` +
		`browser profile=${proof.provenance.browserProfile ?? "none"}, ` +
		`managed browser profile=${proof.provenance.managedBrowserProfile ?? "none"}, ` +
		`browser process=${proof.provenance.browserProcessId ?? "unknown"}, ` +
		`browser target=${proof.provenance.browserTargetId ?? "unknown"}`;
	return [
		`${proof.providerId} provider-session authorization failed (${proof.failureReason ?? proof.verdict}).`,
		...(conflicts.length > 0 ? conflicts : ["Required configured or observed provider-account evidence is missing."]),
		context,
	].join(" ");
}

function normalizeComparable(value: unknown): string | null {
	return normalizeString(value)?.toLowerCase() ?? null;
}

function normalizeString(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const normalized = value.trim();
	return normalized || null;
}

function asRecord(value: unknown): MutableRecord | null {
	return value && typeof value === "object" && !Array.isArray(value)
		? (value as MutableRecord)
		: null;
}
