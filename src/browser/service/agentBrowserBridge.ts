import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const DEFAULT_TIMEOUT_MS = 5_000;

export type AgentBrowserBridgeMode = "auto" | "required" | "off";

export type AgentBrowserBridgeResult = {
	baseUrl: string;
	browserId: string;
	browserProcessId?: number;
	chromeHost?: string;
	chromePort?: number;
	detachRequired?: boolean;
	releaseRequired?: boolean;
	profileId: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	detachState?: "attached" | "detaching" | "detached";
	releaseState?: "retained" | "releasing" | "released";
	detachPromise?: Promise<void>;
};

export type AgentBrowserBrokerInput = {
	abortSignal?: AbortSignal;
	agentName?: string;
	logger?: (message: string) => void;
	mode?: AgentBrowserBridgeMode;
	profileId?: string | null;
	serviceName?: string;
	targetServiceId: "chatgpt" | "gemini" | "grok";
	taskName?: string;
	url: string;
};

export type AgentBrowserBrokerReattachInput = {
	abortSignal?: AbortSignal;
	agentName?: string;
	baseUrl?: string | null;
	browserId: string;
	logger?: (message: string) => void;
	profileId: string;
	serviceName?: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
	taskName?: string;
	url?: string | null;
};

type BrowserRecord = {
	cdpEndpoint?: string | null;
	health?: string | null;
	id?: string | null;
	pid?: number | null;
	profileId?: string | null;
	tabHandles?: Array<Record<string, unknown>>;
};

type BrokerCandidate = {
	browser: BrowserRecord;
	handle: Record<string, unknown>;
};

type JsonResponse = {
	data?: Record<string, unknown>;
	decision?: Record<string, unknown>;
	success?: boolean;
};

export type AgentBrowserBridgeDependencies = {
	fetch?: typeof globalThis.fetch;
	listStreamFiles?: () => Promise<string[]>;
	readStreamFile?: (filePath: string) => Promise<string>;
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
): Promise<Array<{ baseUrl: string; browsers: BrowserRecord[] }>> {
	const files = (await deps.listStreamFiles().catch(() => []))
		.filter((file) => file.endsWith(".stream"))
		.sort(
			(left, right) =>
				serviceStreamPriority(left) - serviceStreamPriority(right) || left.localeCompare(right),
		);
	const routes: Array<{ baseUrl: string; browsers: BrowserRecord[] }> = [];
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
			routes.push({ baseUrl, browsers: (response.data?.browsers ?? []) as BrowserRecord[] });
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
	const parsed = new URL(value);
	const port = Number(parsed.port);
	if (!Number.isInteger(port) || port < 1) {
		throw new Error(`agent-browser CDP attach returned an invalid browser WebSocket URL: ${value}`);
	}
	return { host: normalizeChromeHost(parsed.hostname), port };
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

function exactBrokerCandidates(input: {
	browsers: BrowserRecord[];
	profileId: string;
	url: string;
	browserId?: string | null;
	sessionName?: string | null;
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
				handle.url === input.url &&
				Boolean(targetId) &&
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

function validatePlannedTabRequest(
	request: Record<string, unknown> | undefined,
	url: string,
): Record<string, unknown> {
	if (!request || request.action !== "tab_new" || request.url !== url) {
		throw new Error(
			`agent-browser access plan did not return an exact tab_new request for ${url}: ${JSON.stringify(request ?? null)}`,
		);
	}
	return request;
}

function retainedBrokerCandidates(input: {
	browsers: BrowserRecord[];
	browserId: string;
	profileId: string;
	serviceTabHandle: Record<string, unknown>;
	sessionName: string;
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
				handle.browserId === input.browserId &&
				handle.profileId === input.profileId &&
				handle.sessionName === input.sessionName;
			return matches ? [{ browser, handle }] : [];
		});
	});
}

export async function reattachAgentBrowserBrokerTab(
	input: AgentBrowserBrokerReattachInput,
	dependencies: AgentBrowserBridgeDependencies = {},
): Promise<AgentBrowserBridgeResult> {
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
	const matchedRoutes = routes.flatMap((route) => {
		const candidates = retainedBrokerCandidates({
			browsers: route.browsers,
			browserId: input.browserId,
			profileId: input.profileId,
			serviceTabHandle: input.serviceTabHandle,
			sessionName: input.sessionName,
		});
		if (candidates.length > 1) {
			throw new Error(
				`agent-browser restart recovery requires exactly one retained broker target per service route; found ${candidates.length}`,
			);
		}
		return candidates.map((candidate) => ({ route, candidate }));
	});
	if (matchedRoutes.length === 0) {
		throw new Error(
			"agent-browser restart recovery requires exactly one retained broker target; found 0",
		);
	}
	const { route, candidate } = matchedRoutes[0];
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
	const endpoint = parseBrowserWebSocketEndpoint(attached.data?.browserWebSocketUrl);
	const browserProcessId = Number(candidate.browser.pid);
	if (!Number.isInteger(browserProcessId) || browserProcessId < 1) {
		throw new Error("agent-browser retained tab has no live browser process identity");
	}
	logger(
		`[agent-browser] Reattached retained target ${String(candidate.handle.targetId)} through ${input.browserId}; AuraCall will not rediscover or launch Chrome.`,
	);
	return {
		baseUrl: route.baseUrl,
		browserId: input.browserId,
		browserProcessId,
		chromeHost: endpoint.host,
		chromePort: endpoint.port,
		detachRequired: attached.data?.detachRequired !== false,
		detachState: attached.data?.detachRequired === false ? "detached" : "attached",
		profileId: input.profileId,
		serviceTabHandle: candidate.handle,
		sessionName: input.sessionName,
	};
}

export async function acquireAgentBrowserBrokerTab(
	input: AgentBrowserBrokerInput,
	dependencies: AgentBrowserBridgeDependencies = {},
): Promise<AgentBrowserBridgeResult | null> {
	const mode = input.mode ?? resolveAgentBrowserBridgeMode();
	if (mode === "off") return null;
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

	try {
		const routes = await discoverServiceRoutes(deps, input.abortSignal);
		if (routes.length === 0)
			throw new Error("no healthy agent-browser service stream is available");
		if (profileId) {
			routes.sort((left, right) => {
				const leftMatches = exactBrokerCandidates({
					browsers: left.browsers,
					profileId,
					url: input.url,
				}).length;
				const rightMatches = exactBrokerCandidates({
					browsers: right.browsers,
					profileId,
					url: input.url,
				}).length;
				return Number(rightMatches > 0) - Number(leftMatches > 0);
			});
		}
		let lastError: unknown = null;
		for (const route of routes) {
			let accessPlanResolved = false;
			try {
				const query = new URLSearchParams({
					...labels,
					targetServiceId: input.targetServiceId,
					url: input.url,
					...(profileId ? { runtimeProfile: profileId } : {}),
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
				const plannedRequest = validatePlannedTabRequest(request, input.url);
				const acquired = await requestJson(
					fetchImpl,
					route.baseUrl,
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
				const browserId = String(returnedHandle.browserId ?? acquired.data?.browserId ?? "");
				const sessionName = String(
					returnedHandle.sessionName ??
						acquired.data?.sessionName ??
						acquired.data?.sessionId ??
						browserId.replace(/^session:/, ""),
				);
				if (!browserId || !sessionName) {
					throw new Error("agent-browser tab request returned no browser/session identity");
				}
				const browsersResponse = await requestJson(
					fetchImpl,
					route.baseUrl,
					"/api/service/browsers",
					{ method: "GET" },
					input.abortSignal,
					15_000,
				);
				const candidate = requireUniqueBrokerCandidate(
					retainedBrokerCandidates({
						browsers: (browsersResponse.data?.browsers ?? []) as BrowserRecord[],
						browserId,
						profileId: selectedProfileId,
						serviceTabHandle: returnedHandle,
						sessionName,
					}),
					`${String(recommendedAction)} returned-handle verification`,
				);
				const serviceTabHandle = candidate.handle;

				const effectiveProfileId = String(serviceTabHandle.profileId ?? selectedProfileId);
				if (effectiveProfileId !== selectedProfileId) {
					throw new Error(
						`agent-browser exact target profile mismatch: expected ${selectedProfileId}, got ${effectiveProfileId}`,
					);
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
							runtimeProfile: effectiveProfileId,
							serviceTabHandle,
						}),
					},
					input.abortSignal,
					15_000,
				);
				const endpoint = parseBrowserWebSocketEndpoint(attached.data?.browserWebSocketUrl);
				const browserProcessId = Number(candidate.browser.pid);
				if (!Number.isInteger(browserProcessId) || browserProcessId < 1) {
					throw new Error("agent-browser retained tab has no live browser process identity");
				}
				logger(
					`[agent-browser] Broker attached ${effectiveProfileId} through ${browserId}; AuraCall will not launch Chrome.`,
				);
				return {
					baseUrl: route.baseUrl,
					browserId,
					browserProcessId,
					chromeHost: endpoint.host,
					chromePort: endpoint.port,
					detachRequired: attached.data?.detachRequired !== false,
					detachState: attached.data?.detachRequired === false ? "detached" : "attached",
					releaseRequired: plannedRequest.action === "tab_new",
					releaseState: plannedRequest.action === "tab_new" ? "retained" : "released",
					profileId: effectiveProfileId,
					serviceTabHandle,
					sessionName,
				};
			} catch (error) {
				if (accessPlanResolved) {
					throw error;
				}
				lastError = error;
			}
		}
		throw lastError ?? new Error("no agent-browser service route accepted the browser request");
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (mode === "auto" && !brokerAuthorityClaimed && !input.abortSignal?.aborted) {
			logger(
				`[agent-browser] No broker authority was established (${message}); continuing through AuraCall's compatibility browser path.`,
			);
			return null;
		}
		if (mode === "auto" && input.abortSignal?.aborted) {
			throw new Error(`agent-browser broker auto mode aborted before fallback: ${message}`);
		}
		if (mode === "auto") {
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
	let result!: T;
	try {
		result = await action();
	} catch (error) {
		actionError = error;
	}
	let detachError: unknown = null;
	try {
		await detachAgentBrowserBrokerTab(bridge, { fetch: options.fetch });
	} catch (error) {
		detachError = error;
	}
	if (actionError && detachError) {
		throw new AggregateError(
			[actionError, detachError],
			"AuraCall browser operation and agent-browser detach both failed",
		);
	}
	if (actionError) throw actionError;
	if (detachError) options.onCleanupError?.(detachError);
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
