import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createBrokerCdpSession, type BrokerCdpBinding, type BrokerCdpSession } from "../../../packages/browser-service/src/brokerCdpClient.js";
import { createNativeBrokerTransport, type NativeBrokerTransportOptions } from "../../../packages/browser-service/src/nativeBrokerTransport.js";
import { BrowserAutomationError } from "../../oracle/errors.js";
import { buildChatgptAuthSessionIdentityExpression, normalizeChatgptAuthSessionIdentity } from "../providers/chatgptAdapter.js";
import { assertProviderSessionAuthorization, type ProviderSessionAuthorization } from "../providers/providerSessionAuthority.js";
import { bindRecoveredResponse, RECOVERY_RESPONSE_API_SNAPSHOT, RECOVERY_RESPONSE_SNAPSHOT, RecoveryResponseBindingError, type RecoveryResponseBinding } from "./recoveryResponseBinding.js";

const DEFAULT_TIMEOUT_MS = 5_000;
const DEFAULT_BROKER_INVENTORY_CONVERGENCE_TIMEOUT_MS = 15_000;
const DEFAULT_BROKER_INVENTORY_POLL_INTERVAL_MS = 250;
const DEFAULT_BROKER_INVENTORY_MAX_ATTEMPTS = 61;
export const AGENT_BROWSER_CLEANUP_UNVERIFIED = "agent_browser_cleanup_unverified";

export type AgentBrowserBridgeMode = "auto" | "required" | "off";

export type AgentBrowserHost =
	| "local_headless"
	| "local_headed"
	| "docker_headed"
	| "remote_headed"
	| "cloud_provider"
	| "attached_existing";

export type AgentBrowserBridgeResult = {
  recoveredResponse?: RecoveryResponseBinding;
	acquisitionDecision?: string;
	acquisitionEvidence?: "broker_inventory" | "planned_request_legacy" | "service_response";
	baseUrl: string;
	browserId: string;
	browserProcessId?: number;
	browserHost?: AgentBrowserHost;
	canonicalTargetId?: string;
	chromeHost?: string;
	chromePort?: number;
	brokerTransport?: "native";
	brokerSession?: BrokerCdpSession;
	exactUrlTargetCount?: number;
	detachRequired?: boolean;
	releaseRequired?: boolean;
	profileId: string;
	requestedUrl?: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	tabReconciliation?: "preserved_selection_only";
	detachState?: "attached" | "detaching" | "detached";
	releaseState?: "preserved" | "retained" | "releasing" | "released";
	detachPromise?: Promise<void>;
};

export type AgentBrowserBrokerInput = {
	viewStreamProvider?: string;
	controlInputProvider?: string;
	displayIsolation?: string;
	abortSignal?: AbortSignal;
	agentName?: string;
	logger?: (message: string) => void;
	mode?: AgentBrowserBridgeMode;
	browserHost?: AgentBrowserHost | null;
	profileId?: string | null;
	targetId?: string | null;
	serviceName?: string;
	targetServiceId: "chatgpt" | "gemini" | "grok";
	taskName?: string;
	url: string;
};

export type AgentBrowserBrokerReattachInput = {
  /** Original native receipt to reconcile before acquiring a replacement attachment. */
  originalNativeBinding?: BrokerCdpBinding;
  /** Observe only: never attach, navigate, acquire, release, or submit. */
  observationOnly?: boolean;
  providerSessionAuthorization?: ProviderSessionAuthorization;
  /** Full original wire prompt. Enables read-only recovery from a restored target. */
  recoveryPrompt?: string;
  /** Exact submitted user turn when recovery relies on sent attachment UI evidence. */
  expectedUserMessageId?: string;
	expectedBrowserProcessId?: number;
	abortSignal?: AbortSignal;
	agentName?: string;
	baseUrl?: string | null;
	browserId: string;
	browserHost?: AgentBrowserHost | null;
	logger?: (message: string) => void;
	profileId: string;
	serviceName?: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	taskName?: string;
	url?: string | null;
};

type BrowserRecord = {
	displayIsolation?: string | null;
	viewStreams?: Array<{ provider?: string; controlInput?: string | null }>;
	browserBuild?: string | null;
	browserBuildProof?: {
		applied?: boolean | null;
		browserBuild?: string | null;
		browserPid?: number | null;
		cdpEndpoint?: string | null;
		profileId?: string | null;
	} | null;
	cdpEndpoint?: string | null;
	health?: string | null;
	host?: AgentBrowserHost | null;
	id?: string | null;
	pid?: number | null;
	profileId?: string | null;
	tabHandles?: Array<Record<string, unknown>>;
};

type BrokerCandidate = {
	browser: BrowserRecord;
	handle: Record<string, unknown>;
};

function verifiedBrowserProcessId(browser: BrowserRecord): number {
	const direct = Number(browser.pid);
	if (Number.isInteger(direct) && direct > 0) return direct;
	const proof = browser.browserBuildProof;
	const proven = Number(proof?.browserPid);
	if (proof?.applied === true && Number.isInteger(proven) && proven > 0
		&& typeof browser.cdpEndpoint === "string" && proof.cdpEndpoint === browser.cdpEndpoint
		&& typeof browser.profileId === "string" && proof.profileId === browser.profileId
		&& (!browser.browserBuild || proof.browserBuild === browser.browserBuild)) {
		return proven;
	}
	throw new Error("agent-browser retained tab has no live browser process identity");
}

function optionalVerifiedBrowserProcessId(browser: BrowserRecord): number | null {
	try {
		return verifiedBrowserProcessId(browser);
	} catch {
		return null;
	}
}

function selectRetainedViewStream(
	browser: BrowserRecord,
	input: Pick<AgentBrowserBrokerInput, "viewStreamProvider" | "controlInputProvider">,
): { provider: string; controlInput: string } | null {
	const streams = (browser.viewStreams ?? []).flatMap((stream) =>
		typeof stream.provider === "string" && typeof stream.controlInput === "string"
			? [{ provider: stream.provider, controlInput: stream.controlInput }]
			: [],
	);
	const requested = streams.filter(
		(stream) =>
			(!input.viewStreamProvider || stream.provider === input.viewStreamProvider) &&
			(!input.controlInputProvider || stream.controlInput === input.controlInputProvider),
	);
	if (requested.length === 1) return requested[0];
	if (input.viewStreamProvider || input.controlInputProvider) return null;
	if (streams.length === 1) return streams[0];
	const standard = streams.filter(
		(stream) => stream.provider === "cdp_screencast" && stream.controlInput === "cdp_input",
	);
	return standard.length === 1 ? standard[0] : null;
}

type JsonResponse = {
	data?: Record<string, unknown>;
	decision?: Record<string, unknown>;
	success?: boolean;
};

export type AgentBrowserBridgeDependencies = {
	/** Explicit trusted configuration only; never discover credentials or mint authority. */
	nativeTransport?: Omit<NativeBrokerTransportOptions, "binding"> & {
		bindSessionName?(sessionName: string): void;
		bindObservedTargetUrl?(url: string): void;
		currentTargetSnapshot?(): {
			conversationId?: string;
			serviceTabHandle: Record<string, unknown>;
			url: string;
		} | null;
		synchronizeTargetAfterMutation?(signal: AbortSignal): Promise<{
			conversationId?: string;
			serviceTabHandle: Record<string, unknown>;
			url: string;
		}>;
		onBrokerEvent?(event: { method: string; params: unknown }): void;
		attachTaskContext(input: {
			serviceTabHandle: Record<string, unknown>;
			url: string;
			labels: { serviceName: string; agentName: string; taskName: string };
		}, signal: AbortSignal): Promise<{
			taskAuthority: Record<string, unknown>; taskStepId: string; taskEvidenceBytes: number;
		}>;
	};
	fetch?: typeof globalThis.fetch;
	inventoryConvergenceTimeoutMs?: number;
	inventoryMaxAttempts?: number;
	inventoryPollIntervalMs?: number;
	listStreamFiles?: () => Promise<string[]>;
	readStreamFile?: (filePath: string) => Promise<string>;
	sleep?: (milliseconds: number) => Promise<void>;
};

export function resolveAgentBrowserBridgeMode(
	value = process.env.AURACALL_AGENT_BROWSER_BRIDGE,
): AgentBrowserBridgeMode {
	if (value === "off" || value === "required") return value;
	return "auto";
}

function normalizeChromeHost(host: string): string {
	const normalized = host
		.trim()
		.toLowerCase()
		.replace(/^\[|\]$/g, "");
	if (normalized === "localhost" || normalized === "::1") return "127.0.0.1";
	return normalized;
}

async function requestJson(
	fetchImpl: typeof globalThis.fetch,
	baseUrl: string,
	route: string,
	init: RequestInit,
	abortSignal?: AbortSignal,
	timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<JsonResponse> {
	const timeout = AbortSignal.timeout(timeoutMs);
	const signal = abortSignal ? AbortSignal.any([abortSignal, timeout]) : timeout;
	const response = await fetchImpl(`${baseUrl}${route}`, { ...init, signal });
	const body = (await response.json()) as JsonResponse;
	if (!response.ok || body.success === false) {
		throw new Error(
			`agent-browser ${route} failed with HTTP ${response.status}: ${JSON.stringify(body)}`,
		);
	}
	return body;
}

function serviceStreamPriority(filePath: string): number {
	return path.basename(filePath).includes("dashboard-service-backend") ? 0 : 1;
}

async function discoverServiceRoutes(
	deps: Required<
		Pick<AgentBrowserBridgeDependencies, "fetch" | "listStreamFiles" | "readStreamFile">
	>,
	abortSignal?: AbortSignal,
): Promise<Array<{ baseUrl: string; browsers: BrowserRecord[]; streamPath?: string }>> {
	const files = (await deps.listStreamFiles().catch(() => []))
		.filter((file) => file.endsWith(".stream"))
		.sort(
			(left, right) =>
				serviceStreamPriority(left) - serviceStreamPriority(right) || left.localeCompare(right),
		);
	const routes: Array<{ baseUrl: string; browsers: BrowserRecord[]; streamPath?: string }> = [];
	for (const filePath of files) {
		const streamPort = Number((await deps.readStreamFile(filePath).catch(() => "")).trim());
		if (!Number.isInteger(streamPort) || streamPort < 1) continue;
		const baseUrl = `http://127.0.0.1:${streamPort}`;
		try {
			const response = await requestJson(
				deps.fetch,
				baseUrl,
				"/api/service/browsers",
				{ method: "GET" },
				abortSignal,
			);
			routes.push({
				baseUrl,
				browsers: (response.data?.browsers ?? []) as BrowserRecord[],
				streamPath: filePath,
			});
		} catch {
			// Stale service stream files are expected and ignored.
		}
	}
	return routes;
}

function parseBrowserWebSocketEndpoint(value: unknown): { host: string; port: number } {
	if (typeof value !== "string" || !value.trim()) {
		throw new Error("agent-browser CDP attach returned no browser WebSocket URL");
	}
	let parsed: URL;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error("agent-browser CDP attach returned an invalid browser WebSocket URL");
	}
	const port = Number(parsed.port);
	// The legacy connector uses plain host/port discovery. Never silently strip
	// TLS, credentials or a capability path while treating it as equivalent authority.
	if (!Number.isInteger(port) || port < 1 || parsed.protocol !== "ws:"
		|| parsed.username || parsed.password || parsed.search || parsed.hash
		|| !/^\/devtools\/browser\/[^/]+$/.test(parsed.pathname)) {
		throw new Error("agent-browser CDP attach returned an unsupported browser WebSocket URL");
	}
	return { host: normalizeChromeHost(parsed.hostname), port };
}

export class AgentBrowserAttachmentCleanupError extends AggregateError {
	readonly bridge: AgentBrowserBridgeResult;

	constructor(errors: unknown[], bridge: AgentBrowserBridgeResult) {
		super(errors, "agent-browser attachment endpoint validation and matching detach both failed");
		this.name = "AgentBrowserAttachmentCleanupError";
		this.bridge = bridge;
	}
}

async function attachNativeBrokerSession(
	bridge: AgentBrowserBridgeResult,
	labels: Record<string, unknown>,
	configuration: NonNullable<AgentBrowserBridgeDependencies["nativeTransport"]>,
	fetchImpl: typeof globalThis.fetch,
	abortSignal?: AbortSignal,
): Promise<AgentBrowserBridgeResult> {
	const requestedUrl = bridge.requestedUrl;
	const liveUrl = bridge.serviceTabHandle.url;
	if (!requestedUrl || typeof liveUrl !== "string" || !brokerUrlsMatch(liveUrl, requestedUrl)) {
		throw new Error("broker_native_exact_url_required");
	}
	// ChatGPT can represent the same conversation with or without a project slug.
	// Candidate selection binds the conversation identity; native authority must use
	// the exact URL currently reported by the retained tab, not a display alias.
	const url = liveUrl;
	const handleSessionName = bridge.serviceTabHandle.sessionName;
	if (typeof handleSessionName !== "string" || handleSessionName !== bridge.sessionName) {
		throw new Error("broker_native_handle_session_mismatch");
	}
	configuration.bindSessionName?.(handleSessionName);
	const signal = abortSignal ? AbortSignal.any([abortSignal, AbortSignal.timeout(15_000)]) : AbortSignal.timeout(15_000);
	signal.throwIfAborted();
	let abortWait = () => {};
	const interrupted = new Promise<never>((_resolve, reject) => {
		abortWait = () => reject(new Error("broker_native_attach_authorization_interrupted"));
		signal.addEventListener("abort", abortWait, { once: true });
	});
	const context = await Promise.race([
		Promise.resolve().then(() => { signal.throwIfAborted(); return configuration.attachTaskContext({
			serviceTabHandle: structuredClone(bridge.serviceTabHandle), url,
			labels: {
				serviceName: String(labels.serviceName),
				agentName: String(labels.agentName),
				taskName: String(labels.taskName),
			},
		}, signal); }),
		interrupted,
	]).finally(() => signal.removeEventListener("abort", abortWait));
	signal.throwIfAborted();
	const nativeConfiguration = { ...configuration };
	if (!context || !context.taskAuthority || typeof context.taskAuthority !== "object"
		|| Array.isArray(context.taskAuthority) || typeof context.taskStepId !== "string" || !context.taskStepId.trim()
		|| !Number.isSafeInteger(context.taskEvidenceBytes) || context.taskEvidenceBytes < 1
		|| Buffer.byteLength(JSON.stringify(context)) > 65_536) {
		throw new Error("broker_native_attach_task_context_required");
	}
	const owned: AgentBrowserBridgeResult = { ...bridge, brokerTransport: "native",
		detachRequired: true, detachState: "attached" };
	try {
		const attached = await requestJson(fetchImpl, bridge.baseUrl, "/api/service/request", {
			method: "POST", headers: { "content-type": "application/json" },
			body: JSON.stringify({ action: "cdp_attach", ...labels,
				cdpAttachmentAllowed: true, runtimeProfile: bridge.profileId,
				serviceTabHandle: bridge.serviceTabHandle, url,
				// The service endpoint flattens its outer params into the daemon
				// command. Preserve the cdp_attach action's own params one level down.
				params: { params: { brokerTransport: true, expectedUrl: url } },
				taskAuthority: context.taskAuthority, taskStepId: context.taskStepId,
				taskEvidenceBytes: context.taskEvidenceBytes }),
		}, signal, 15_000);
		const data = attached.data;
		const binding = data?.binding as BrokerCdpBinding | undefined;
		if (!binding || binding.browserId !== bridge.browserId || binding.profileId !== bridge.profileId
			|| binding.sessionName !== bridge.sessionName || binding.targetId !== bridge.serviceTabHandle.targetId) {
			throw new Error("broker_native_acquisition_identity_mismatch");
		}
		owned.brokerSession = createBrokerCdpSession({ binding,
			transport: createNativeBrokerTransport({ ...nativeConfiguration, binding }),
			pollTimeoutMs: 45_000,
			onEvent: nativeConfiguration.onBrokerEvent });
		const handle = data?.serviceTabHandle as Record<string, unknown> | undefined;
		if (data?.attached !== true || data.controlPlaneMode !== "broker" || data.transportAction !== "__broker_transport"
			|| data.detachRequired !== true || data.browserProcessPreserved !== true || data.closeBrowserOnDetach !== false
			|| !handle || handle.valid !== true || handle.url !== url
			|| handle.browserId !== bridge.browserId || handle.profileId !== bridge.profileId
			|| handle.sessionName !== bridge.sessionName || handle.targetId !== binding.targetId
			|| ["browserId", "profileId", "sessionName", "targetId", "tabId", "leaseId", "leaseState", "ownerSessionId", "cleanupPolicy", "profileOrigin"]
				.some(key => bridge.serviceTabHandle[key] != null && handle[key] !== bridge.serviceTabHandle[key])) {
			throw new Error("broker_native_acquisition_receipt_invalid");
		}
		owned.serviceTabHandle = { ...handle };
		return owned;
	} catch (error) {
		// Never substitute the legacy handle-only HTTP detach for an opaque native
		// attachment. Unknown or mismatched identity must remain unreconciled.
		if (!owned.brokerSession) throw new AgentBrowserAttachmentCleanupError([error], owned);
		try { await owned.brokerSession.close(); owned.detachState = "detached"; }
		catch (cleanupError) { throw new AgentBrowserAttachmentCleanupError([error, cleanupError], owned); }
		throw error;
	}
}

async function validateAttachedBrowserEndpoint(
	attached: JsonResponse,
	identity: Pick<AgentBrowserBridgeResult, "baseUrl" | "browserId" | "profileId" | "serviceTabHandle" | "sessionName">,
	fetchImpl: typeof globalThis.fetch,
): Promise<{ host: string; port: number }> {
	try {
		return parseBrowserWebSocketEndpoint(attached.data?.browserWebSocketUrl);
	} catch (error) {
		// Attachment already succeeded, but ownership cannot reach the outer run
		// scope yet. Reconcile it here, independently of an aborted run signal.
		const bridge: AgentBrowserBridgeResult = {
				...identity,
				detachRequired: attached.data?.detachRequired !== false,
				detachState: "attached",
				releaseRequired: false,
		};
		try {
			await detachAgentBrowserBrokerTab(bridge, { fetch: fetchImpl });
		} catch (cleanupError) {
			throw new AgentBrowserAttachmentCleanupError([error, cleanupError], bridge);
		}
		throw error;
	}
}

function targetEnvironmentValue(
	prefix: string,
	target: AgentBrowserBrokerInput["targetServiceId"],
): string | null {
	const targetValue = process.env[`${prefix}_${target.toUpperCase()}`]?.trim();
	return targetValue || process.env[prefix]?.trim() || null;
}

export function resolveAgentBrowserBrokerProfile(
	target: AgentBrowserBrokerInput["targetServiceId"],
): string | null {
	return targetEnvironmentValue("AURACALL_AGENT_BROWSER_PROFILE", target);
}

export function resolveAgentBrowserBrokerTarget(
	target: AgentBrowserBrokerInput["targetServiceId"],
): string | null {
	const value = targetEnvironmentValue("AURACALL_AGENT_BROWSER_TARGET", target);
	if (!value) return null;
	if (!/^[A-Fa-f0-9]{32}$/.test(value)) {
		throw new Error(`Configured agent-browser target for ${target} is invalid`);
	}
	return value;
}

export function resolveAgentBrowserBrokerUrl(
	target: AgentBrowserBrokerInput["targetServiceId"],
	fallback: string,
): string {
	if (target === "chatgpt" && isCanonicalChatgptConversationUrl(fallback)) {
		return fallback;
	}
	return targetEnvironmentValue("AURACALL_AGENT_BROWSER_URL", target) ?? fallback;
}

function isCanonicalChatgptConversationUrl(value: string): boolean {
	try {
		const parsed = new URL(value);
		if (
			parsed.protocol !== "https:" ||
			parsed.hostname !== "chatgpt.com" ||
			parsed.search ||
			parsed.hash
		) {
			return false;
		}
		return /^\/(?:c\/[a-zA-Z0-9-]+|g\/[a-zA-Z0-9-]+\/c\/[a-zA-Z0-9-]+)\/?$/.test(parsed.pathname);
	} catch {
		return false;
	}
}

function brokerUrlsMatch(actual: unknown, expected: string): boolean {
	if (actual === expected) return true;
	if (typeof actual !== "string") return false;
	const conversationId = (value: string): string | null => {
		try {
			const parsed = new URL(value);
			if (parsed.protocol !== "https:" || parsed.hostname !== "chatgpt.com") return null;
			const match = parsed.pathname.match(/\/c\/([a-zA-Z0-9-]+)\/?$/);
			return match?.[1] ?? null;
		} catch {
			return null;
		}
	};
	const actualId = conversationId(actual);
	return Boolean(actualId && actualId === conversationId(expected));
}

function exactBrokerCandidates(input: {
	browsers: BrowserRecord[];
	profileId: string;
	url: string;
	browserId?: string | null;
	sessionName?: string | null;
	targetId?: string | null;
}): BrokerCandidate[] {
	const expectedBrowserId =
		input.browserId ?? (input.sessionName ? `session:${input.sessionName}` : null);
	return input.browsers.flatMap((browser) => {
		if (
			browser.health !== "ready" ||
			browser.profileId !== input.profileId ||
			(expectedBrowserId && browser.id !== expectedBrowserId)
		) {
			return [];
		}
		return (browser.tabHandles ?? []).flatMap((handle) => {
			const handleBrowserId = typeof handle.browserId === "string" ? handle.browserId : null;
			const handleProfileId = typeof handle.profileId === "string" ? handle.profileId : null;
			const handleSessionName = typeof handle.sessionName === "string" ? handle.sessionName : null;
			const targetId = typeof handle.targetId === "string" ? handle.targetId.trim() : "";
			const matches =
				handle.valid === true &&
				brokerUrlsMatch(handle.url, input.url) &&
				Boolean(targetId) &&
				(!input.targetId || targetId === input.targetId) &&
				(!browser.id || handleBrowserId === browser.id) &&
				handleProfileId === input.profileId &&
				(!input.sessionName || handleSessionName === input.sessionName);
			return matches ? [{ browser, handle }] : [];
		});
	});
}

function requireUniqueBrokerCandidate(
	candidates: BrokerCandidate[],
	context: string,
): BrokerCandidate {
	if (candidates.length !== 1) {
		throw new Error(
			`agent-browser ${context} requires exactly one exact broker target; found ${candidates.length}`,
		);
	}
	return candidates[0];
}

function serviceTabHandleFromResponse(response: JsonResponse): Record<string, unknown> | null {
	const direct = response.data?.serviceTabHandle;
	if (direct && typeof direct === "object" && !Array.isArray(direct)) {
		return direct as Record<string, unknown>;
	}
	const tab = response.data?.tab;
	if (tab && typeof tab === "object" && !Array.isArray(tab)) {
		const nested = (tab as Record<string, unknown>).serviceTabHandle;
		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			return nested as Record<string, unknown>;
		}
	}
	return null;
}

function tabAcquisitionFromResponse(response: JsonResponse): {
	decision: string;
	evidence: "planned_request_legacy" | "service_response";
} {
	const sharedAcquisition = response.data?.sharedAcquisition;
	if (
		!sharedAcquisition ||
		typeof sharedAcquisition !== "object" ||
		Array.isArray(sharedAcquisition)
	) {
		return { decision: "planned_tab_new_legacy", evidence: "planned_request_legacy" };
	}
	const record = sharedAcquisition as Record<string, unknown>;
	if (
		record.mode !== "tab_new" ||
		record.action !== "opened_new_tab" ||
		record.tabOpened !== true
	) {
		throw new Error(
			`agent-browser tab request returned contradictory acquisition evidence: ${JSON.stringify(record)}`,
		);
	}
	return { decision: "opened_new_tab", evidence: "service_response" };
}

function validatePlannedTabRequest(
	request: Record<string, unknown> | undefined,
	url: string,
	browserHost?: AgentBrowserHost | null,
): Record<string, unknown> {
	if (!request || request.action !== "tab_new" || request.url !== url) {
		throw new Error(
			`agent-browser access plan did not return an exact tab_new request for ${url}: ${JSON.stringify(request ?? null)}`,
		);
	}
	if (browserHost) {
		const params = request.params;
		const plannedHost =
			params && typeof params === "object" && !Array.isArray(params)
				? (params as Record<string, unknown>).browserHost
				: null;
		if (plannedHost !== browserHost) {
			throw new Error(
				`agent-browser access plan did not preserve requested browser host ${browserHost}: ${JSON.stringify(request)}`,
			);
		}
	}
	return request;
}

function retainedBrokerCandidates(input: {
	browsers: BrowserRecord[];
	browserId: string;
	profileId: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	url?: string | null;
}): BrokerCandidate[] {
	const expectedTargetId = String(input.serviceTabHandle.targetId ?? "").trim();
	if (!expectedTargetId) return [];
	return input.browsers.flatMap((browser) => {
		if (
			browser.health !== "ready" ||
			browser.id !== input.browserId ||
			browser.profileId !== input.profileId
		) {
			return [];
		}
		return (browser.tabHandles ?? []).flatMap((handle) => {
			const matches =
				handle.valid === true &&
				handle.targetId === expectedTargetId &&
				(!input.url || brokerUrlsMatch(handle.url, input.url)) &&
				handle.browserId === input.browserId &&
				handle.profileId === input.profileId &&
				handle.sessionName === input.sessionName;
			return matches ? [{ browser, handle }] : [];
		});
	});
}

function distinctTargetCount(candidates: BrokerCandidate[]): number {
	return new Set(
		candidates.map(({ handle }) => String(handle.targetId ?? "").trim()).filter(Boolean),
	).size;
}

async function waitForRetainedBrokerCandidate(input: {
	abortSignal?: AbortSignal;
	baseUrl: string;
	browserId: string;
	dependencies: AgentBrowserBridgeDependencies;
	fetch: typeof globalThis.fetch;
	profileId: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	url: string;
}): Promise<{ browsers: BrowserRecord[]; candidate: BrokerCandidate }> {
	const timeoutMs =
		input.dependencies.inventoryConvergenceTimeoutMs ??
		DEFAULT_BROKER_INVENTORY_CONVERGENCE_TIMEOUT_MS;
	const maxAttempts =
		input.dependencies.inventoryMaxAttempts ?? DEFAULT_BROKER_INVENTORY_MAX_ATTEMPTS;
	const pollIntervalMs =
		input.dependencies.inventoryPollIntervalMs ?? DEFAULT_BROKER_INVENTORY_POLL_INTERVAL_MS;
	const sleep =
		input.dependencies.sleep ??
		((milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
	const convergenceSignal = AbortSignal.timeout(timeoutMs);
	const signal = input.abortSignal
		? AbortSignal.any([input.abortSignal, convergenceSignal])
		: convergenceSignal;
	let lastCandidates: BrokerCandidate[] = [];

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			const browsersResponse = await requestJson(
				input.fetch,
				input.baseUrl,
				"/api/service/browsers",
				{ method: "GET" },
				signal,
				DEFAULT_TIMEOUT_MS,
			);
			const browsers = (browsersResponse.data?.browsers ?? []) as BrowserRecord[];
			lastCandidates = retainedBrokerCandidates({
				browsers,
				browserId: input.browserId,
				profileId: input.profileId,
				serviceTabHandle: input.serviceTabHandle,
				sessionName: input.sessionName,
				url: input.url,
			});
			if (lastCandidates.length === 1) {
				return { browsers, candidate: lastCandidates[0] };
			}
			if (lastCandidates.length > 1) {
				requireUniqueBrokerCandidate(lastCandidates, "returned-handle verification");
			}
		} catch (error) {
			if (!convergenceSignal.aborted || input.abortSignal?.aborted) throw error;
			break;
		}
		if (attempt < maxAttempts && !convergenceSignal.aborted) {
			await sleep(pollIntervalMs);
		}
	}

	return {
		browsers: [],
		candidate: requireUniqueBrokerCandidate(
			lastCandidates,
			"returned-handle verification after bounded inventory convergence",
		),
	};
}

async function releaseNewBrokerTabAfterAcquisitionFailure(input: {
	baseUrl: string;
	fetch: typeof globalThis.fetch;
	labels: { agentName: string; serviceName: string; taskName: string };
	profileId: string;
	serviceTabHandle: Record<string, unknown>;
}): Promise<void> {
	const response = await requestJson(
		input.fetch,
		input.baseUrl,
		"/api/service/request",
		{
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				action: "tab_handle_release",
				...input.labels,
				runtimeProfile: input.profileId,
				serviceTabHandle: input.serviceTabHandle,
			}),
		},
		undefined,
		15_000,
	);
	if (response.data?.released !== true && response.data?.tabMissing !== true) {
		throw new Error(
			`agent-browser failed-acquisition tab release was not verified: ${JSON.stringify(response.data ?? {})}`,
		);
	}
}

export async function reattachAgentBrowserBrokerTab(
	input: AgentBrowserBrokerReattachInput,
	dependencies: AgentBrowserBridgeDependencies = {},
): Promise<AgentBrowserBridgeResult> {
  if (input.originalNativeBinding && (!dependencies.nativeTransport || input.observationOnly
    || input.recoveryPrompt || input.providerSessionAuthorization)) {
    throw new Error('Native attachment reconciliation requires native transport and broker-scoped response capture');
  }
  if (input.observationOnly && (!input.recoveryPrompt || !input.url || !input.providerSessionAuthorization)) {
    throw new Error('Recovery observation requires original prompt, URL and account authority');
  }
	const fetchImpl = dependencies.fetch ?? globalThis.fetch;
	const deps = {
		fetch: fetchImpl,
		listStreamFiles: dependencies.listStreamFiles ?? listServiceStreamFiles,
		readStreamFile:
			dependencies.readStreamFile ?? ((filePath: string) => readFile(filePath, "utf8")),
	};
	const logger = input.logger ?? (() => undefined);
	const labels = {
		serviceName: input.serviceName ?? "AuraCall",
		agentName: input.agentName ?? "codex-backend",
		taskName: input.taskName ?? "chatgpt-restart-recovery",
	};
	const discoveredRoutes = await discoverServiceRoutes(deps, input.abortSignal);
	const routes = [...new Map(discoveredRoutes.map((route) => [route.baseUrl, route])).values()];
	if (input.baseUrl) {
		routes.sort(
			(left, right) =>
				Number(right.baseUrl === input.baseUrl) - Number(left.baseUrl === input.baseUrl),
		);
	}
	if (input.baseUrl && !routes.some((route) => route.baseUrl === input.baseUrl)) {
		try {
			const response = await requestJson(
				fetchImpl,
				input.baseUrl,
				"/api/service/browsers",
				{ method: "GET" },
				input.abortSignal,
				15_000,
			);
			routes.unshift({
				baseUrl: input.baseUrl,
				browsers: (response.data?.browsers ?? []) as BrowserRecord[],
			});
		} catch {
			// A service stream port may change across daemon replacement; discovery is authoritative.
		}
	}
	let matchedRoutes = routes.flatMap((route) => {
		const candidates = retainedBrokerCandidates({
			browsers: route.browsers,
			browserId: input.browserId,
			profileId: input.profileId,
			serviceTabHandle: input.serviceTabHandle,
			sessionName: input.sessionName,
			url: input.url,
		});
		if (candidates.length > 1) {
			throw new Error(
				`agent-browser restart recovery requires exactly one retained broker target per service route; found ${candidates.length}`,
			);
		}
		return candidates.map((candidate) => ({ route, candidate }));
	});
	let recoveredResponse: RecoveryResponseBinding | undefined;
	if (matchedRoutes.length === 0 && !input.originalNativeBinding && input.recoveryPrompt && input.url) {
		const oldTarget = input.serviceTabHandle.targetId;
		const oldTargetRecords = routes.flatMap(route => route.browsers.flatMap(browser =>
			(browser.tabHandles ?? []).filter(handle => handle.targetId === oldTarget)
				.map(handle => ({ browser, handle }))));
		if (oldTargetRecords.some(({ handle }) => handle.valid === true)) {
			throw new Error('Original recovery target is still recorded; refusing replacement');
		}
		const restored = routes.flatMap(route => exactBrokerCandidates({
			browsers: route.browsers, browserId: input.browserId, profileId: input.profileId,
			sessionName: input.sessionName, url: input.url!,
		}).map(candidate => ({ route, candidate })));
		const identities = new Set(restored.map(({ candidate }) => JSON.stringify([
			candidate.browser.id, candidate.browser.pid, candidate.browser.cdpEndpoint, candidate.handle.targetId,
		])));
		if (identities.size === 0 && input.observationOnly
			&& /^https:\/\/chatgpt\.com\/g\/g-p-[a-f0-9]{32}(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(input.url)
			&& Number.isInteger(input.expectedBrowserProcessId) && Number(input.expectedBrowserProcessId) > 0
			&& oldTargetRecords.length > 0
			&& oldTargetRecords.every(({ handle }) => handle.valid === false && handle.staleReason === 'tab_closed')) {
			const acquired = await acquireAgentBrowserBrokerTab({
				abortSignal: input.abortSignal, agentName: labels.agentName,
				browserHost: input.browserHost, mode: 'required', profileId: input.profileId,
				serviceName: labels.serviceName, targetId: null, targetServiceId: 'chatgpt',
				taskName: `${labels.taskName}-exact-url-observation`, url: input.url,
			}, { ...dependencies, nativeTransport: undefined });
			if (!acquired || acquired.acquisitionDecision !== 'opened_new_tab'
				|| acquired.browserId !== input.browserId || acquired.profileId !== input.profileId
				|| acquired.sessionName !== input.sessionName
				|| acquired.browserProcessId !== input.expectedBrowserProcessId
				|| acquired.requestedUrl !== input.url || acquired.serviceTabHandle.url !== input.url) {
				if (acquired) await detachAgentBrowserBrokerTab(acquired, { fetch: fetchImpl });
				throw new Error('Exact-URL recovery observation acquisition changed browser authority');
			}
			return await withAgentBrowserBrokerCleanup(acquired, () => reattachAgentBrowserBrokerTab({
				...input, baseUrl: acquired.baseUrl, expectedBrowserProcessId: acquired.browserProcessId,
				serviceTabHandle: acquired.serviceTabHandle,
			}, { ...dependencies, nativeTransport: undefined }), { fetch: fetchImpl });
		}
		if (identities.size !== 1) throw new Error('Restored recovery requires one unambiguous broker-owned target');
		const selected = restored[0]!;
		if (input.browserHost && selected.candidate.browser.host !== input.browserHost) {
			throw new Error('Restored recovery browser host does not match the requested host');
		}
		matchedRoutes = [selected];
	}
	if (matchedRoutes.length === 0) {
		throw new Error(
			"agent-browser restart recovery requires exactly one retained broker target; found 0",
		);
	}
	const { route, candidate } = matchedRoutes[0];
	if (input.originalNativeBinding) {
		const original = input.originalNativeBinding;
		if (matchedRoutes.length !== 1 || !input.url || input.url !== input.serviceTabHandle.url
			|| input.url !== candidate.handle.url || route.baseUrl !== input.baseUrl
			|| original.browserId !== input.browserId || original.profileId !== input.profileId
			|| original.sessionName !== input.sessionName || original.targetId !== candidate.handle.targetId
			|| ['tabId', 'leaseId', 'leaseState', 'ownerSessionId', 'cleanupPolicy', 'profileOrigin'].some(
				key => input.serviceTabHandle[key] != null && input.serviceTabHandle[key] !== candidate.handle[key])) {
			throw new BrowserAutomationError(
				'Native original attachment identity changed; refusing reconciliation or reacquisition',
				{ code: 'agent_browser_native_identity_changed', retryable: false, phase: 'after' },
			);
		}
	}
	if (input.browserHost && candidate.browser.host !== input.browserHost) {
		throw new Error(
			`agent-browser restart recovery found browser host ${String(candidate.browser.host ?? "missing")} instead of requested ${input.browserHost}`,
		);
	}
	const canonicalTargetId = String(candidate.handle.targetId ?? "").trim();
	const browserProcessId = verifiedBrowserProcessId(candidate.browser);
	// A surviving physical target does not establish which answer belongs to this run.
	if (input.recoveryPrompt && input.url) {
		for (let attempt = 0; attempt < 41; attempt += 1) {
			const observation = await requestJson(fetchImpl, route.baseUrl, '/api/service/request', {
				method: 'POST', headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ action: 'evaluate', ...labels, runtimeProfile: input.profileId,
					browserId: input.browserId, sessionName: input.sessionName,
					serviceTabHandle: candidate.handle, expression: RECOVERY_RESPONSE_SNAPSHOT,
					timeoutMs: 10000, maxReturnBytes: 1000000, returnByValue: true }),
			}, input.abortSignal, 15000);
			if (observation.data?.resultTruncated === true) throw new Error('Recovery snapshot was truncated');
			try {
				recoveredResponse = bindRecoveredResponse(observation.data?.result, input.recoveryPrompt, input.url,
					input.expectedUserMessageId);
				break;
			} catch (error) {
				const virtualizedUser = error instanceof RecoveryResponseBindingError
					&& error.reason.startsWith('prompt_matches_0_') && error.reason.endsWith('_users_0');
				if (virtualizedUser) {
					const apiObservation = await requestJson(fetchImpl, route.baseUrl, '/api/service/request', {
						method: 'POST', headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ action: 'evaluate', ...labels, runtimeProfile: input.profileId,
							browserId: input.browserId, sessionName: input.sessionName,
							serviceTabHandle: candidate.handle, expression: RECOVERY_RESPONSE_API_SNAPSHOT,
							awaitPromise: true, timeoutMs: 10000, maxReturnBytes: 1000000, returnByValue: true }),
					}, input.abortSignal, 15000);
					if (apiObservation.data?.resultTruncated === true) throw new Error('Recovery API snapshot was truncated');
					recoveredResponse = bindRecoveredResponse(apiObservation.data?.result, input.recoveryPrompt, input.url,
						input.expectedUserMessageId);
					break;
				}
				const awaitingHydration = error instanceof RecoveryResponseBindingError
					&& error.reason.startsWith('prompt_matches_0_') && error.reason.endsWith('_users_none');
				if (!awaitingHydration || attempt === 40) throw error;
				await new Promise(resolve => setTimeout(resolve, 250));
				input.abortSignal?.throwIfAborted();
			}
		}
	}
	if (input.providerSessionAuthorization) {
		const observation = await requestJson(fetchImpl, route.baseUrl, '/api/service/request', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ action: 'evaluate', ...labels, runtimeProfile: input.profileId,
				browserId: input.browserId, sessionName: input.sessionName,
				serviceTabHandle: candidate.handle,
				expression: buildChatgptAuthSessionIdentityExpression(), awaitPromise: true,
				returnByValue: true, timeoutMs: 10000, maxReturnBytes: 16384 }),
		}, input.abortSignal, 15000);
		if (observation.data?.resultTruncated === true) {
			throw new Error('Recovery provider-session observation was truncated');
		}
		assertProviderSessionAuthorization(input.providerSessionAuthorization,
			normalizeChatgptAuthSessionIdentity(observation.data?.result as Parameters<typeof normalizeChatgptAuthSessionIdentity>[0]),
			{ browserProcessId, browserTargetId: canonicalTargetId });
	}
	const exactUrlTargetCount = input.url
		? distinctTargetCount(
				exactBrokerCandidates({
					browsers: route.browsers,
					browserId: input.browserId,
					profileId: input.profileId,
					sessionName: input.sessionName,
					url: input.url,
				}),
			)
		: 1;
	if (input.observationOnly) {
		return {
			recoveredResponse, baseUrl: route.baseUrl, browserId: input.browserId,
			browserProcessId, browserHost: candidate.browser.host ?? undefined,
			canonicalTargetId, profileId: input.profileId, requestedUrl: input.url ?? undefined,
			serviceTabHandle: candidate.handle, sessionName: input.sessionName,
			detachRequired: false, releaseRequired: false,
		};
	}
	if (dependencies.nativeTransport) {
		if (input.originalNativeBinding) {
			input.abortSignal?.throwIfAborted();
			// No polling, page command, or legacy detach. The daemon retains the
			// exact attachment's sticky cleanup result across client restarts.
			const binding = { ...input.originalNativeBinding };
			dependencies.nativeTransport.bindSessionName?.(binding.sessionName);
			const transport = createNativeBrokerTransport({ ...dependencies.nativeTransport, binding });
			await createBrokerCdpSession({ binding, transport }).close();
			input.abortSignal?.throwIfAborted();
		}
		const recovered = await attachNativeBrokerSession({
			acquisitionDecision: "retained_restart_reattach", acquisitionEvidence: "broker_inventory",
			recoveredResponse, baseUrl: route.baseUrl, browserId: input.browserId,
			browserHost: candidate.browser.host ?? undefined, browserProcessId, canonicalTargetId,
			exactUrlTargetCount, profileId: input.profileId, requestedUrl: input.url ?? undefined,
			serviceTabHandle: candidate.handle, sessionName: input.sessionName,
			tabReconciliation: "preserved_selection_only", releaseRequired: false,
		}, labels, dependencies.nativeTransport, fetchImpl, input.abortSignal);
		if (input.originalNativeBinding && recovered.brokerSession?.binding.attachmentId === input.originalNativeBinding.attachmentId) {
			await detachAgentBrowserBrokerTab(recovered, dependencies);
			throw new Error('Native recovery reused the original attachment identity');
		}
		return recovered;
	}
	const attached = await requestJson(
		fetchImpl,
		route.baseUrl,
		"/api/service/request",
		{
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				action: "cdp_attach",
				...labels,
				cdpAttachmentAllowed: true,
				runtimeProfile: input.profileId,
				serviceTabHandle: candidate.handle,
			}),
		},
		input.abortSignal,
		15_000,
	);
	const endpoint = await validateAttachedBrowserEndpoint(attached, {
		baseUrl: route.baseUrl, browserId: input.browserId, profileId: input.profileId,
		serviceTabHandle: candidate.handle, sessionName: input.sessionName,
	}, fetchImpl);
	logger(
		`[agent-browser] Reattached retained target ${String(candidate.handle.targetId)} through ${input.browserId}; AuraCall will not rediscover or launch Chrome.`,
	);
	return {
		acquisitionDecision: "retained_restart_reattach",
		recoveredResponse,
		acquisitionEvidence: "broker_inventory",
		baseUrl: route.baseUrl,
		browserId: input.browserId,
		browserHost: candidate.browser.host ?? undefined,
		browserProcessId,
		canonicalTargetId,
		chromeHost: endpoint.host,
		chromePort: endpoint.port,
		exactUrlTargetCount,
		detachRequired: attached.data?.detachRequired !== false,
		detachState: attached.data?.detachRequired === false ? "detached" : "attached",
		profileId: input.profileId,
		requestedUrl: input.url ?? undefined,
		serviceTabHandle: candidate.handle,
		sessionName: input.sessionName,
		tabReconciliation: "preserved_selection_only",
	};
}

/** Capture only the original answer through native authority; publish after cleanup. */
export async function captureAgentBrowserNativeResponse(
	bridge: AgentBrowserBridgeResult,
	input: {
		prompt: string;
		url: string;
		providerSessionAuthorization: ProviderSessionAuthorization;
		abortSignal?: AbortSignal;
		/** Persist the new binding before any response read; failures still clean up. */
		onAcquired: (bridge: AgentBrowserBridgeResult) => Promise<void>;
	},
): Promise<RecoveryResponseBinding> {
	return withAgentBrowserBrokerCleanup(bridge, async () => {
		const session = bridge.brokerSession;
		if (bridge.brokerTransport !== "native" || !session || !input.prompt.trim()
			|| input.url !== bridge.requestedUrl || input.url !== bridge.serviceTabHandle.url
			|| session.binding.targetId !== bridge.serviceTabHandle.targetId
			|| session.binding.browserId !== bridge.browserId || session.binding.profileId !== bridge.profileId
			|| session.binding.sessionName !== bridge.sessionName
			|| !Number.isSafeInteger(bridge.browserProcessId) || Number(bridge.browserProcessId) < 1) {
			throw new Error("Native response recovery requires exact attachment, URL and browser identity");
		}
		input.abortSignal?.throwIfAborted();
		await input.onAcquired(bridge);
		input.abortSignal?.throwIfAborted();
		const { Runtime } = session.connect({ abortSignal: input.abortSignal });
		const evaluate = async (expression: string, maxBytes: number): Promise<unknown> => {
			const reply = await Runtime.evaluate({ expression, returnByValue: true, awaitPromise: true, timeout: 10000 });
			if (reply.exceptionDetails || reply.result?.type !== "object" || reply.result.value == null
				|| Buffer.byteLength(JSON.stringify(reply.result.value), "utf8") > maxBytes) {
				throw new Error("Native recovery observation is missing, exceptional or oversized");
			}
			return reply.result.value;
		};
		const verifyAccount = async () => {
			const identity = await evaluate(buildChatgptAuthSessionIdentityExpression(), 16384);
			assertProviderSessionAuthorization(input.providerSessionAuthorization,
				normalizeChatgptAuthSessionIdentity(identity as Parameters<typeof normalizeChatgptAuthSessionIdentity>[0]),
				{ browserProcessId: bridge.browserProcessId, browserTargetId: session.binding.targetId });
		};
		await verifyAccount();
		const snapshot = await evaluate(RECOVERY_RESPONSE_SNAPSHOT, 1000000);
		if ((snapshot as Record<string, unknown>).url !== input.url) {
			throw new Error("Native recovery rendered URL changed");
		}
		const response = bindRecoveredResponse(snapshot, input.prompt, input.url);
		await verifyAccount();
		input.abortSignal?.throwIfAborted();
		return response;
	});
}

/** Locate an unknown newly-created conversation without creating or navigating a tab. */
export async function observeAgentBrowserProjectResponse(
 input: AgentBrowserBrokerReattachInput & { projectId: string; expectedBrowserProcessId: number },
 dependencies: AgentBrowserBridgeDependencies = {},
): Promise<AgentBrowserBridgeResult> {
 if (!input.observationOnly || !input.recoveryPrompt || !input.providerSessionAuthorization
     || !/^g-p-[a-f0-9]{32}$/.test(input.projectId)
     || !Number.isInteger(input.expectedBrowserProcessId) || input.expectedBrowserProcessId < 1) {
   throw new Error('Project response observation requires exact saved authority');
 }
 const fetchImpl = dependencies.fetch ?? globalThis.fetch;
 const routes = await discoverServiceRoutes({ fetch: fetchImpl,
   listStreamFiles: dependencies.listStreamFiles ?? listServiceStreamFiles,
   readStreamFile: dependencies.readStreamFile ?? (file => readFile(file, 'utf8')) }, input.abortSignal);
 if (input.baseUrl && !routes.some(route => route.baseUrl === input.baseUrl)) {
   try {
     const response = await requestJson(fetchImpl, input.baseUrl, '/api/service/browsers', { method: 'GET' }, input.abortSignal);
     routes.push({ baseUrl: input.baseUrl, browsers: (response.data?.browsers ?? []) as BrowserRecord[] });
   } catch (error) {
     // The saved broker port may be stale; current discovered inventory remains
     // authoritative, but cancellation or no reachable route is never ignored.
     if (input.abortSignal?.aborted || !routes.length) throw error;
   }
 }
 const candidates = new Map<string, { baseUrl: string; handle: Record<string, unknown>; url: string }>();
 const closedOriginalTargets = new Map<string, { baseUrl: string; url: string }>();
 const originalTargetId = String(input.serviceTabHandle.targetId ?? '');
 let originalTarget: { baseUrl: string; handle: Record<string, unknown>; url: string } | null = null;
 for (const route of routes) for (const browser of route.browsers) {
   if (browser.id !== input.browserId || browser.profileId !== input.profileId) continue;
   let observedBrowserProcessId: number;
   try {
     observedBrowserProcessId = verifiedBrowserProcessId(browser);
   } catch {
     throw new Error('Project response browser authority changed');
   }
   if (browser.health !== 'ready' || observedBrowserProcessId !== input.expectedBrowserProcessId
       || (input.browserHost && browser.host !== input.browserHost)) {
     throw new Error('Project response browser authority changed');
   }
   for (const handle of browser.tabHandles ?? []) {
     if (handle.targetId === originalTargetId && handle.valid === false && handle.staleReason === 'tab_closed'
         && handle.browserId === input.browserId && handle.profileId === input.profileId
         && handle.sessionName === input.sessionName) {
       try {
         const closedUrl = new URL(String(handle.url));
         const closedMatch = /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.exec(closedUrl.pathname);
         if (closedUrl.origin === 'https://chatgpt.com' && !closedUrl.username && !closedUrl.password
             && !closedUrl.search && !closedUrl.hash && closedMatch?.[1] === input.projectId) {
           const existing = closedOriginalTargets.get(closedUrl.href);
           if (!existing || route.baseUrl === input.baseUrl) closedOriginalTargets.set(closedUrl.href, { baseUrl: route.baseUrl, url: closedUrl.href });
         }
       } catch {
         // A malformed stale URL is not recovery authority.
       }
     }
     if (handle.valid !== true || handle.browserId !== input.browserId || handle.profileId !== input.profileId
         || handle.sessionName !== input.sessionName || typeof handle.targetId !== 'string' || !handle.targetId) continue;
     let url: URL;
     try { url = new URL(String(handle.url)); } catch { continue; }
     const match = /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/c\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/.exec(url.pathname);
     if (url.origin !== 'https://chatgpt.com' || url.username || url.password || url.search || url.hash || match?.[1] !== input.projectId) continue;
     const prior = candidates.get(handle.targetId);
     if (prior && prior.url !== url.href) throw new Error('Project target inventory is inconsistent');
     const candidate = { baseUrl: route.baseUrl, handle, url: url.href };
     candidates.set(handle.targetId, candidate);
     if (handle.targetId === originalTargetId) {
       if (originalTarget && originalTarget.url !== candidate.url) {
         throw new Error('Original project response target inventory is inconsistent');
       }
       originalTarget = candidate;
     }
   }
 }
 // A new-project send can change the original retained target from the project
 // landing route to its canonical conversation route before AuraCall receives
 // the navigation acknowledgement. That exact saved target remains stronger
 // authority than a scan of sibling project conversations. Only fall back to
 // the bounded inventory scan when the original target did not become a
 // canonical conversation.
 const observationCandidates = originalTarget ? [originalTarget] : Array.from(candidates.values());
 if (!observationCandidates.length && closedOriginalTargets.size === 1) {
   const closed = Array.from(closedOriginalTargets.values())[0]!;
   return reattachAgentBrowserBrokerTab({ ...input, baseUrl: closed.baseUrl, url: closed.url }, dependencies);
 }
 if (!observationCandidates.length || observationCandidates.length > 8) throw new Error('Project response candidate inventory is absent or exceeds observation bound');
 const normalize = (value: string) => value.replace(/\s+/gu, ' ').trim();
 const matches: Array<{ baseUrl: string; handle: Record<string, unknown>; url: string; binding: RecoveryResponseBinding }> = [];
 for (const candidate of observationCandidates) {
   const response = await requestJson(fetchImpl, candidate.baseUrl, '/api/service/request', {
     method: 'POST', headers: { 'content-type': 'application/json' },
     body: JSON.stringify({ action: 'evaluate', serviceName: input.serviceName ?? 'AuraCall',
       agentName: input.agentName ?? 'codex-backend', taskName: input.taskName ?? 'failed-response-observation',
       runtimeProfile: input.profileId, browserId: input.browserId, sessionName: input.sessionName,
       serviceTabHandle: candidate.handle, expression: RECOVERY_RESPONSE_SNAPSHOT,
       timeoutMs: 10000, maxReturnBytes: 1000000, returnByValue: true }),
   }, input.abortSignal, 15000);
   const snapshot = response.data?.result as { messages?: Array<{ role?: string; text?: string }> } | undefined;
   if (response.data?.resultTruncated === true || !snapshot || !Array.isArray(snapshot.messages)
       || snapshot.messages.length > 200 || snapshot.messages.some(message => !message || typeof message !== 'object')) {
     throw new Error('Project response candidate snapshot is incomplete');
   }
   if (!snapshot.messages.some(message => message.role === 'user' && typeof message.text === 'string'
       && normalize(message.text) === normalize(input.recoveryPrompt!))) continue;
   // A matching but incomplete/streaming/duplicate prompt is not an unrelated tab.
   matches.push({ ...candidate, binding: bindRecoveredResponse(snapshot, input.recoveryPrompt, candidate.url) });
 }
 if (matches.length !== 1) throw new Error('Project response requires exactly one complete original prompt binding');
 const selected = matches[0]!;
 const result = await reattachAgentBrowserBrokerTab({ ...input, baseUrl: selected.baseUrl,
   serviceTabHandle: selected.handle, url: selected.url }, dependencies);
 if (result.browserProcessId !== input.expectedBrowserProcessId
     || JSON.stringify(result.recoveredResponse) !== JSON.stringify(selected.binding)) {
   throw new Error('Project response changed during account verification');
 }
 return result;
}

export async function acquireAgentBrowserBrokerTab(
	input: AgentBrowserBrokerInput,
	dependencies: AgentBrowserBridgeDependencies = {},
): Promise<AgentBrowserBridgeResult | null> {
	const newProjectComposer = input.targetServiceId === 'chatgpt' && /^https:\/\/chatgpt\.com\/g\/g-p-[a-f0-9]{32}(?:-[a-z0-9-]+)?\/project$/.test(input.url);
	const explicitProjectConversation = input.targetServiceId === 'chatgpt'
		&& /^https:\/\/chatgpt\.com\/g\/g-p-[a-f0-9]{32}(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(input.url);
	const mode = input.mode ?? resolveAgentBrowserBridgeMode();
	if (dependencies.nativeTransport && mode === "off") throw new Error("broker_native_transport_requires_bridge");
	if (mode === "off") {
		if (input.browserHost || newProjectComposer) {
			throw new Error("an explicit agent-browser host requirement conflicts with bridge mode off");
		}
		return null;
	}
	const brokerRequired = mode === "required" || Boolean(input.browserHost) || newProjectComposer || Boolean(dependencies.nativeTransport);
	const logger = input.logger ?? (() => undefined);
	let brokerAuthorityClaimed = false;
	const fetchImpl = dependencies.fetch ?? globalThis.fetch;
	const deps = {
		fetch: fetchImpl,
		listStreamFiles: dependencies.listStreamFiles ?? listServiceStreamFiles,
		readStreamFile:
			dependencies.readStreamFile ?? ((filePath: string) => readFile(filePath, "utf8")),
	};
	const labels = {
		serviceName: input.serviceName ?? "AuraCall",
		agentName: input.agentName ?? "codex-backend",
		taskName: input.taskName ?? `${input.targetServiceId}-frontend-response`,
	};
	const profileId = input.profileId ?? resolveAgentBrowserBrokerProfile(input.targetServiceId);
	let targetId = newProjectComposer ? null : input.targetId ?? null;

	try {
		const routes = await discoverServiceRoutes(deps, input.abortSignal);
		if (routes.length === 0)
			throw new Error("no healthy agent-browser service stream is available");
		if (profileId) {
			routes.sort((left, right) => {
				const leftMatches = exactBrokerCandidates({
					browsers: left.browsers,
					profileId,
					targetId,
					url: input.url,
				}).length;
				const rightMatches = exactBrokerCandidates({
					browsers: right.browsers,
					profileId,
					targetId,
					url: input.url,
				}).length;
				return Number(rightMatches > 0) - Number(leftMatches > 0);
			});
		}
		let lastError: unknown = null;
		for (const route of routes) {
			let accessPlanResolved = false;
			try {
				let retainedPosture: { browserId: string; sessionName: string; pid: number; browserHost: string; displayIsolation: string | null; viewStreamProvider: string; controlInputProvider: string } | null = null;
				if (newProjectComposer) {
					const retained = route.browsers.flatMap(browser => {
						const pid = optionalVerifiedBrowserProcessId(browser);
						return profileId && browser.profileId === profileId && browser.health === 'ready' && browser.id && pid
							&& (!input.browserHost || browser.host === input.browserHost) ? [{ browser, pid }] : [];
					});
					if (retained.length > 1) throw new Error('New project conversation retained browser authority is ambiguous');
					if (retained.length === 1) {
						const { browser, pid } = retained[0]!;
						const sessions = new Set((browser.tabHandles ?? []).filter(handle => handle.valid === true
							&& handle.browserId === browser.id && handle.profileId === profileId && typeof handle.sessionName === 'string'
							&& handle.sessionName.trim()).map(handle => String(handle.sessionName)));
						const stream = selectRetainedViewStream(browser, input);
						if (sessions.size !== 1 || !stream || !browser.host) {
							throw new Error('New project conversation retained session or display posture is missing or ambiguous');
						}
						retainedPosture = { browserId: browser.id!, sessionName: [...sessions][0]!, pid, browserHost: browser.host,
							displayIsolation: browser.displayIsolation ?? null, viewStreamProvider: stream.provider, controlInputProvider: stream.controlInput };
						for (const key of ['viewStreamProvider', 'controlInputProvider', 'displayIsolation'] as const) {
							if (input[key] !== undefined && input[key] !== retainedPosture[key]) throw new Error('Explicit browser posture conflicts with retained browser');
						}
					}
				}
				const query = new URLSearchParams({
					...labels,
					targetServiceId: input.targetServiceId,
					url: input.url,
					...(profileId ? { runtimeProfile: profileId } : {}),
					...(input.browserHost ? { browserHost: input.browserHost } : {}),
					...(retainedPosture ? { browserHost: retainedPosture.browserHost,
						...(retainedPosture.displayIsolation === null ? {} : { displayIsolation: retainedPosture.displayIsolation }),
						viewStreamProvider: retainedPosture.viewStreamProvider, controlInputProvider: retainedPosture.controlInputProvider } : {}),
				});
				const plan = await requestJson(
					fetchImpl,
					route.baseUrl,
					`/api/service/access-plan?${query.toString()}`,
					{ method: "GET" },
					input.abortSignal,
				);
				accessPlanResolved = true;
				brokerAuthorityClaimed = true;
				const decision = (plan.decision ?? plan.data?.decision) as
					| Record<string, unknown>
					| undefined;
				const selectedProfile = plan.data?.selectedProfile as Record<string, unknown> | undefined;
				const selectedProfileId = String(selectedProfile?.id ?? profileId ?? "");
				if (!selectedProfileId) throw new Error("agent-browser access plan selected no profile");

				let exactRetainedCandidates = exactBrokerCandidates({
					browsers: route.browsers,
					profileId: selectedProfileId,
					targetId,
					url: input.url,
				});
				if (targetId && exactRetainedCandidates.length !== 1) {
					const canonicalUrlCandidates = explicitProjectConversation && exactRetainedCandidates.length === 0
						? exactBrokerCandidates({ browsers: route.browsers, profileId: selectedProfileId,
							targetId: null, url: input.url }) : [];
					if (canonicalUrlCandidates.length === 1) {
						logger(`[agent-browser] Ignoring stale ambient target ${targetId}; the explicit canonical conversation URL uniquely identifies retained target ${String(canonicalUrlCandidates[0]?.handle.targetId)}.`);
						exactRetainedCandidates = canonicalUrlCandidates;
					} else if (explicitProjectConversation && canonicalUrlCandidates.length === 0) {
						logger(`[agent-browser] Ignoring stale ambient target ${targetId}; no live handle owns the explicit canonical conversation URL, so Agent Browser must acquire that exact URL.`);
						targetId = null;
					} else {
						throw new Error(
							`Configured agent-browser target ${targetId} requires exactly one ready exact retained handle; found ${exactRetainedCandidates.length}`,
						);
					}
				}
				if (!newProjectComposer && exactRetainedCandidates.length === 1) {
					const retained = exactRetainedCandidates[0];
					const launchPosture = decision?.launchPosture as Record<string, unknown> | undefined;
					const selectedBuild = String(
						(plan.data?.browserBuildSelectionSummary as Record<string, unknown> | undefined)
							?.browserBuild ?? launchPosture?.browserBuild ?? "",
					);
					const retainedBuild = String(
						retained.browser.browserBuild ??
							retained.browser.browserBuildProof?.browserBuild ??
							"",
					);
					const retainedBrowserId = String(retained.handle.browserId ?? retained.browser.id ?? "");
					const retainedSessionName = String(retained.handle.sessionName ?? "");
					if (
						selectedBuild &&
						retainedBuild === selectedBuild &&
						retainedBrowserId &&
						retainedSessionName
					) {
						logger(
							`[agent-browser] Access plan and retained inventory agree on ${selectedBuild}; reattaching the exact existing target without opening a browser or tab.`,
						);
						return await reattachAgentBrowserBrokerTab(
							{
								abortSignal: input.abortSignal,
								agentName: labels.agentName,
								baseUrl: route.baseUrl,
								browserHost: input.browserHost,
								browserId: retainedBrowserId,
								logger,
								profileId: selectedProfileId,
								serviceName: labels.serviceName,
								serviceTabHandle: retained.handle,
								sessionName: retainedSessionName,
								taskName: labels.taskName,
								url: input.url,
							},
							dependencies,
						);
					}
					if (targetId) {
						throw new Error(
							`Configured agent-browser target ${targetId} does not match the access-plan browser build`,
						);
					}
				}

				const serviceRequest = decision?.serviceRequest as Record<string, unknown> | undefined;
				const request = serviceRequest?.request as Record<string, unknown> | undefined;
				const profileReuse = decision?.profileReuse as Record<string, unknown> | undefined;
				const recommendedAction = profileReuse?.recommendedAction;
				if (
					recommendedAction !== "reuse_existing_browser" &&
					recommendedAction !== "wait_for_profile_lease" &&
					recommendedAction !== "launch_new_browser"
				) {
					throw new Error(
						`agent-browser access plan returned unsupported profile reuse action: ${String(recommendedAction)}`,
					);
				}
				if (serviceRequest?.available !== true) {
					throw new Error(
						`agent-browser access plan returned no usable tab request: ${JSON.stringify(serviceRequest)}`,
					);
				}
				let plannedRequest = validatePlannedTabRequest(request, input.url, input.browserHost);
				if (newProjectComposer) {
					// A fresh project composer needs a new tab, not a new profile lane.
					// Bind only authority explicitly selected by this access plan, then
					// revalidate it against current inventory before requesting the tab.
					const shared = profileReuse?.sharedAcquisition as Record<string, unknown> | undefined;
					const selectedBrowserId = String(profileReuse?.reusableBrowserId ?? shared?.browserId ?? '').trim();
					const selectedSessionName = String(profileReuse?.reusableSessionName ?? shared?.sessionName ?? '').trim();
					const plannedParams = plannedRequest.params as Record<string, unknown> | undefined;
					const plannedDisplayIsolation = typeof plannedParams?.displayIsolation === 'string' ? plannedParams.displayIsolation : null;
					if (plannedRequest.allowDuplicateProfileLane === true || plannedParams?.allowDuplicateProfileLane === true
						|| (retainedPosture && (plannedDisplayIsolation !== retainedPosture.displayIsolation
							|| plannedParams?.viewStreamProvider !== retainedPosture.viewStreamProvider
							|| plannedParams?.controlInputProvider !== retainedPosture.controlInputProvider))) {
						throw new Error('New project conversation access plan changed the retained posture or allowed duplication');
					}
					if (retainedPosture) {
						if (recommendedAction !== 'reuse_existing_browser' || !selectedBrowserId || !selectedSessionName
							|| selectedBrowserId !== retainedPosture.browserId || selectedSessionName !== retainedPosture.sessionName
							|| (plannedRequest.browserId != null && plannedRequest.browserId !== selectedBrowserId)
							|| (plannedRequest.sessionName != null && plannedRequest.sessionName !== selectedSessionName)) {
							throw new Error('New project conversation requires explicit retained browser/session authority from the access plan');
						}
						const current = await requestJson(fetchImpl, route.baseUrl, '/api/service/browsers', { method: 'GET' }, input.abortSignal);
						const matching = ((current.data?.browsers ?? []) as BrowserRecord[]).filter(browser =>
							browser.id === selectedBrowserId && browser.profileId === selectedProfileId && browser.health === 'ready'
							&& optionalVerifiedBrowserProcessId(browser) === retainedPosture.pid && browser.host === retainedPosture.browserHost
							&& (browser.displayIsolation ?? null) === retainedPosture.displayIsolation
							&& browser.viewStreams?.some(stream => stream.provider === retainedPosture.viewStreamProvider && stream.controlInput === retainedPosture.controlInputProvider)
							&& (!input.browserHost || browser.host === input.browserHost)
							&& (browser.tabHandles ?? []).some(handle => handle.valid === true && handle.browserId === selectedBrowserId
								&& handle.profileId === selectedProfileId && handle.sessionName === selectedSessionName));
						if (matching.length !== 1) throw new Error('New project conversation retained browser authority is stale or ambiguous');
						plannedRequest = { ...plannedRequest, browserId: selectedBrowserId, sessionName: selectedSessionName };
					} else if (recommendedAction !== 'launch_new_browser' || selectedBrowserId || selectedSessionName
						|| plannedRequest.browserId != null || plannedRequest.sessionName != null) {
						throw new Error('New project conversation cold start requires one unambiguous access-plan browser launch');
					}
				}
				const plannedSessionName =
					typeof plannedRequest.sessionName === "string" ? plannedRequest.sessionName.trim() : "";
				const requestRoute =
					routes.find(
						(candidateRoute) =>
							plannedSessionName &&
							path.basename(candidateRoute.streamPath ?? "") === `${plannedSessionName}.stream`,
					) ?? route;
				const acquired = await requestJson(
					fetchImpl,
					requestRoute.baseUrl,
					"/api/service/request",
					{
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify(plannedRequest),
					},
					input.abortSignal,
					120_000,
				);
				const returnedHandle = serviceTabHandleFromResponse(acquired);
				if (!returnedHandle) {
					throw new Error("agent-browser tab request returned no serviceTabHandle");
				}
				const acquisition = tabAcquisitionFromResponse(acquired);
				const browserId = String(returnedHandle.browserId ?? acquired.data?.browserId ?? "");
				const sessionName = String(
					returnedHandle.sessionName ??
						acquired.data?.sessionName ??
						acquired.data?.sessionId ??
						browserId.replace(/^session:/, ""),
				);
				try {
					if (returnedHandle.url !== input.url) {
						throw new Error(
							`agent-browser tab request returned a non-canonical URL: expected ${input.url}, got ${String(returnedHandle.url ?? "missing")}`,
						);
					}
					if (!browserId || !sessionName) {
						throw new Error("agent-browser tab request returned no browser/session identity");
					}
				if (returnedHandle.profileId && returnedHandle.profileId !== selectedProfileId) {
					throw new Error(
						`agent-browser returned handle profile mismatch: expected ${selectedProfileId}, got ${String(returnedHandle.profileId ?? "missing")}`,
					);
				}
					const { browsers, candidate } = await waitForRetainedBrokerCandidate({
						abortSignal: input.abortSignal,
						baseUrl: requestRoute.baseUrl,
						browserId,
						dependencies,
						fetch: fetchImpl,
						profileId: selectedProfileId,
						serviceTabHandle: returnedHandle,
						sessionName,
						url: input.url,
					});
					const serviceTabHandle = candidate.handle;
					const canonicalTargetId = String(serviceTabHandle.targetId ?? "").trim();
					const exactUrlTargetCount = distinctTargetCount(
						exactBrokerCandidates({
							browsers,
							browserId,
							profileId: selectedProfileId,
							sessionName,
							url: input.url,
						}),
					);

					const effectiveProfileId = String(serviceTabHandle.profileId ?? selectedProfileId);
					if (effectiveProfileId !== selectedProfileId) {
						throw new Error(
							`agent-browser exact target profile mismatch: expected ${selectedProfileId}, got ${effectiveProfileId}`,
						);
					}
					if (input.browserHost && candidate.browser.host !== input.browserHost) {
						throw new Error(
							`agent-browser returned browser host ${String(candidate.browser.host ?? "missing")} instead of requested ${input.browserHost}`,
						);
					}
					const browserProcessId = verifiedBrowserProcessId(candidate.browser);
					if (newProjectComposer && acquisition.decision === "opened_new_tab") {
						// Native task authority is issued against Agent Browser's active target.
						// A newly-created project composer is retained before it is necessarily
						// active, so bind the daemon to the exact returned target first.
						await requestJson(fetchImpl, requestRoute.baseUrl, "/api/service/request", {
							method: "POST",
							headers: { "content-type": "application/json" },
							body: JSON.stringify({ action: "view_focus", ...labels,
								browserId, sessionName, runtimeProfile: effectiveProfileId,
								serviceTabHandle, targetId: canonicalTargetId,
								maximize: false, allowBringToFrontFailure: true }),
						}, input.abortSignal, 15_000);
					}
					if (dependencies.nativeTransport) {
						return await attachNativeBrokerSession({
							acquisitionDecision: acquisition.decision, acquisitionEvidence: acquisition.evidence,
							baseUrl: requestRoute.baseUrl, browserId, browserHost: candidate.browser.host ?? undefined,
							browserProcessId, canonicalTargetId, exactUrlTargetCount, profileId: effectiveProfileId,
							requestedUrl: input.url, serviceTabHandle, sessionName,
							releaseRequired: acquisition.decision === "opened_new_tab",
							releaseState: acquisition.decision === "opened_new_tab" ? "retained" : "preserved",
							tabReconciliation: "preserved_selection_only",
						}, labels, dependencies.nativeTransport, fetchImpl, input.abortSignal);
					}
					const attached = await requestJson(
						fetchImpl,
						requestRoute.baseUrl,
						"/api/service/request",
						{
							method: "POST",
							headers: { "content-type": "application/json" },
							body: JSON.stringify({
								action: "cdp_attach",
								...labels,
								cdpAttachmentAllowed: true,
								runtimeProfile: effectiveProfileId,
								serviceTabHandle,
							}),
						},
						input.abortSignal,
						15_000,
					);
					const endpoint = await validateAttachedBrowserEndpoint(attached, {
						baseUrl: requestRoute.baseUrl, browserId, profileId: effectiveProfileId,
						serviceTabHandle, sessionName,
					}, fetchImpl);
					logger(
						`[agent-browser] Broker attached ${effectiveProfileId} through ${browserId}; AuraCall will not launch Chrome.`,
					);
					return {
						acquisitionDecision: acquisition.decision,
						acquisitionEvidence: acquisition.evidence,
						baseUrl: requestRoute.baseUrl,
						browserId,
						browserHost: candidate.browser.host ?? undefined,
						browserProcessId,
						canonicalTargetId,
						chromeHost: endpoint.host,
						chromePort: endpoint.port,
						exactUrlTargetCount,
						detachRequired: attached.data?.detachRequired !== false,
						detachState: attached.data?.detachRequired === false ? "detached" : "attached",
						releaseRequired: acquisition.decision === "opened_new_tab",
						releaseState: acquisition.decision === "opened_new_tab" ? "retained" : "preserved",
						profileId: effectiveProfileId,
						requestedUrl: input.url,
						serviceTabHandle,
						sessionName,
						tabReconciliation: "preserved_selection_only",
					};
				} catch (error) {
					// Do not release the target while its attachment cleanup is uncertain.
					if (error instanceof AgentBrowserAttachmentCleanupError) throw error;
					if (acquisition.decision === "opened_new_tab") {
						try {
							await releaseNewBrokerTabAfterAcquisitionFailure({
								baseUrl: requestRoute.baseUrl,
								fetch: fetchImpl,
								labels,
								profileId: selectedProfileId,
								serviceTabHandle: returnedHandle,
							});
						} catch (cleanupError) {
							throw new AggregateError(
								[error, cleanupError],
								"agent-browser acquisition verification and exact tab cleanup both failed",
							);
						}
					}
					throw error;
				}
			} catch (error) {
				if (accessPlanResolved) {
					throw error;
				}
				lastError = error;
			}
		}
		throw lastError ?? new Error("no agent-browser service route accepted the browser request");
	} catch (error) {
		if (error instanceof AgentBrowserAttachmentCleanupError) throw error;
		const message = error instanceof Error ? error.message : String(error);
		if (
			mode === "auto" &&
			!brokerRequired &&
			!brokerAuthorityClaimed &&
			!input.abortSignal?.aborted
		) {
			logger(
				`[agent-browser] No broker authority was established (${message}); continuing through AuraCall's compatibility browser path.`,
			);
			return null;
		}
		if (mode === "auto" && !brokerRequired && input.abortSignal?.aborted) {
			throw new Error(`agent-browser broker auto mode aborted before fallback: ${message}`);
		}
		if (mode === "auto" && !brokerRequired) {
			throw new Error(`agent-browser broker auto mode claimed authority but failed: ${message}`);
		}
		throw new Error(`agent-browser broker required but unavailable: ${message}`);
	}
}

export async function detachAgentBrowserBrokerTab(
	bridge: AgentBrowserBridgeResult,
	options: { abortSignal?: AbortSignal; fetch?: typeof globalThis.fetch } = {},
): Promise<void> {
	if (
		(!bridge.detachRequired || bridge.detachState === "detached") &&
		(!bridge.releaseRequired || bridge.releaseState === "released")
	) {
		return;
	}
	if (bridge.detachPromise) return bridge.detachPromise;
	const fetchImpl = options.fetch ?? globalThis.fetch;
	const requestCleanup = async (body: Record<string, unknown>): Promise<JsonResponse> => {
		const attempted = new Set<string>();
		let lastError: unknown = null;
		const requestAt = async (baseUrl: string) => {
			attempted.add(baseUrl);
			const response = await requestJson(
				fetchImpl,
				baseUrl,
				"/api/service/request",
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(body),
				},
				options.abortSignal,
				15_000,
			);
			bridge.baseUrl = baseUrl;
			return response;
		};
		try {
			return await requestAt(bridge.baseUrl);
		} catch (error) {
			lastError = error;
		}
		const routes = await discoverServiceRoutes(
			{
				fetch: fetchImpl,
				listStreamFiles: listServiceStreamFiles,
				readStreamFile: (filePath) => readFile(filePath, "utf8"),
			},
			options.abortSignal,
		);
		for (const route of routes) {
			if (attempted.has(route.baseUrl)) continue;
			try {
				return await requestAt(route.baseUrl);
			} catch (error) {
				lastError = error;
			}
		}
		throw lastError ?? new Error("no healthy agent-browser cleanup route is available");
	};
	if (bridge.detachRequired && bridge.detachState !== "detached") {
		bridge.detachState = "detaching";
	}
	bridge.detachPromise = (async () => {
		if (bridge.detachRequired && bridge.detachState !== "detached") {
			if (bridge.brokerTransport === "native") {
				if (!bridge.brokerSession) throw new Error("broker_native_cleanup_identity_unreconciled");
				await bridge.brokerSession.close();
			} else {
				const response = await requestCleanup({
					action: "cdp_detach",
					serviceName: "AuraCall",
					agentName: "codex-backend",
					taskName: "provider-frontend-response",
					runtimeProfile: bridge.profileId,
					serviceTabHandle: bridge.serviceTabHandle,
				});
				if (response.data?.detached !== true && response.data?.alreadyDetached !== true) {
					throw new Error(
						`agent-browser CDP detach was not verified: ${JSON.stringify(response.data ?? {})}`,
					);
				}
			}
			bridge.detachState = "detached";
		}
		if (bridge.releaseRequired && bridge.releaseState !== "released") {
			bridge.releaseState = "releasing";
			if (!options.fetch) {
				const targetId = String(bridge.serviceTabHandle.targetId ?? "");
				const routes = await discoverServiceRoutes(
					{
						fetch: fetchImpl,
						listStreamFiles: listServiceStreamFiles,
						readStreamFile: (filePath) => readFile(filePath, "utf8"),
					},
					options.abortSignal,
				);
				const authoritativeRoute = routes.find((route) =>
					route.browsers.some(
						(browser) =>
							browser.id === bridge.browserId &&
							(browser.tabHandles ?? []).some(
								(handle) => handle.valid === true && handle.targetId === targetId,
							),
					),
				);
				if (authoritativeRoute) bridge.baseUrl = authoritativeRoute.baseUrl;
			}
			const response = await requestCleanup({
				action: "tab_handle_release",
				serviceName: "AuraCall",
				agentName: "codex-backend",
				taskName: "provider-frontend-response",
				runtimeProfile: bridge.profileId,
				serviceTabHandle: bridge.serviceTabHandle,
			});
			if (response.data?.released !== true && response.data?.tabMissing !== true) {
				throw new Error(
					`agent-browser tab release was not verified: ${JSON.stringify(response.data ?? {})}`,
				);
			}
			bridge.releaseState = "released";
		}
	})();
	try {
		await bridge.detachPromise;
	} catch (error) {
		if (bridge.detachState === "detaching") bridge.detachState = "attached";
		if (bridge.releaseState === "releasing") bridge.releaseState = "retained";
		throw error;
	} finally {
		bridge.detachPromise = undefined;
	}
}

export async function withAgentBrowserBrokerCleanup<T>(
	bridge: AgentBrowserBridgeResult,
	action: () => Promise<T>,
	options: {
		fetch?: typeof globalThis.fetch;
		onCleanupError?: (error: unknown) => void;
	} = {},
): Promise<T> {
	let actionError: unknown = null;
	let actionFailed = false;
	let result!: T;
	try {
		result = await action();
	} catch (error) {
		actionError = error;
		actionFailed = true;
	}
	// A dispatched request with an unconfirmed route must remain observable.
	// Detach our transport, but do not let task-tab cleanup erase its evidence.
	if (actionError instanceof BrowserAutomationError
		&& actionError.details?.code === "chatgpt_new_conversation_outcome_unknown"
		&& actionError.details.phase === "after"
		&& actionError.details.retryable === false) {
		bridge.releaseRequired = false;
		bridge.releaseState = "preserved";
		actionError = new BrowserAutomationError(actionError.message, {
			...actionError.details,
			retainedBrowserRecovery: {
				browserAuthority: "agent-browser",
				browserId: bridge.browserId,
				browserProcessId: bridge.browserProcessId,
				profileId: bridge.profileId,
				sessionName: bridge.sessionName,
				targetId: bridge.canonicalTargetId ?? bridge.serviceTabHandle.targetId,
				serviceTabHandle: { ...bridge.serviceTabHandle },
				requestedUrl: bridge.requestedUrl,
				conversationRouteVerified: false,
				tabReleaseSuppressed: true,
			},
		}, actionError);
	}
	let detachError: unknown = null;
	let detachFailed = false;
	try {
		await detachAgentBrowserBrokerTab(bridge, { fetch: options.fetch });
	} catch (error) {
		detachError = error;
		detachFailed = true;
	}
	if (actionFailed && detachFailed) {
		if (actionError instanceof BrowserAutomationError
			&& actionError.details?.retainedBrowserRecovery) {
			throw new BrowserAutomationError(actionError.message, {
				...actionError.details,
				cleanupFailed: true,
			}, new AggregateError([actionError, detachError], "Retained tab transport detach failed"));
		}
		const describe = (error: unknown) => {
			const name = error instanceof Error && error.name ? error.name : "Error";
			const message = error instanceof Error ? error.message : String(error);
			return `${name}: ${message.replace(/\s+/g, " ").slice(0, 500)}`;
		};
		throw new BrowserAutomationError(
			`AuraCall browser operation failed (${describe(actionError)}); agent-browser detach also failed (${describe(detachError)}).`,
			{
				code: "agent_browser_operation_and_cleanup_failed",
				stage: "cleanup",
				phase: "after",
				retryable: false,
				actionError: describe(actionError),
				detachError: describe(detachError),
			},
			new AggregateError([actionError, detachError], "AuraCall browser operation and agent-browser detach both failed"),
		);
	}
	if (actionFailed) throw actionError;
	if (detachFailed) {
		let cause = detachError;
		try {
			options.onCleanupError?.(detachError);
		} catch (observerError) {
			cause = new AggregateError([detachError, observerError], "Broker cleanup and diagnostic observer failed");
		}
		// The provider already ran. A diagnostic callback is not reconciliation,
		// and publishing success here would hide an unreconciled attachment.
		throw new BrowserAutomationError("agent-browser cleanup was not verified; refusing to publish the provider result or replay the prompt", {
			code: AGENT_BROWSER_CLEANUP_UNVERIFIED,
			stage: "cleanup",
			phase: "after",
			retryable: false,
			providerOperationCompleted: true,
		}, cause);
	}
	return result;
}

export function resolveAgentBrowserStreamDirectories(
	options: { env?: NodeJS.ProcessEnv; homeDir?: string; uid?: number } = {},
): string[] {
	const env = options.env ?? process.env;
	const homeDir = options.homeDir ?? os.homedir();
	const uid = options.uid ?? process.getuid?.() ?? os.userInfo().uid;
	const configuredSocketDir = env.AGENT_BROWSER_SOCKET_DIR?.trim();
	const agentBrowserHome = env.AGENT_BROWSER_HOME?.trim() || path.join(homeDir, ".agent-browser");
	const runtimeDir = path.join(env.XDG_RUNTIME_DIR?.trim() || `/run/user/${uid}`, "agent-browser");
	return [configuredSocketDir, agentBrowserHome, runtimeDir]
		.filter((directory): directory is string => Boolean(directory))
		.map((directory) => path.resolve(directory))
		.filter((directory, index, directories) => directories.indexOf(directory) === index);
}

async function listServiceStreamFiles(): Promise<string[]> {
	const entries = await Promise.all(
		resolveAgentBrowserStreamDirectories().map(async (directory) =>
			(await readdir(directory).catch(() => []))
				.filter((name) => name.endsWith(".stream"))
				.map((name) => path.join(directory, name)),
		),
	);
	return entries.flat();
}
