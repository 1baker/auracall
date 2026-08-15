export type HttpRouteMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type StaticHttpRouteDefinition = {
	methods: readonly HttpRouteMethod[];
	pathParameters?: Readonly<Record<string, "segment" | "rest">>;
	statusTemplate: string;
};

const route = (
	methods: readonly HttpRouteMethod[],
	statusTemplate: string,
	options: Pick<StaticHttpRouteDefinition, "pathParameters"> = {},
): StaticHttpRouteDefinition => ({ methods, statusTemplate, ...options });

export const HTTP_ROUTE_MANIFEST = {
	status: route(["GET"], "/status"),
	statusControl: route(["POST"], "POST /status"),
	recoveryDetailTemplate: route(["GET"], "/status/recovery/{run_id}"),
	teamRunsCreate: route(["POST"], "/v1/team-runs"),
	teamRunInspection: route(
		["GET"],
		"/v1/team-runs/inspect?taskRunSpecId={task_run_spec_id}|teamRunId={team_run_id}|runtimeRunId={runtime_run_id}",
	),
	projectEnsure: route(["POST"], "POST /v1/projects/ensure"),
	tenantPoolTeamEnsure: route(["POST"], "POST /v1/tenant-pool-teams/ensure"),
	agentSetupPackagesCreate: route(["POST"], "POST /v1/agent-setup-packages"),
	agentSetupHandoffsCreate: route(["POST"], "POST /v1/agent-setup-handoffs"),
	runtimeRunsRecent: route(
		["GET"],
		"/v1/runtime-runs/recent[?sourceKind=team-run|direct][&status=planned|running|succeeded|failed|cancelled][&browserAuthority=agent-browser|compatibility-fallback|explicit-off|unreported][&limit=25]",
	),
	runtimeRunInspection: route(
		["GET"],
		"/v1/runtime-runs/inspect?runId={run_id}|teamRunId={team_run_id}|taskRunSpecId={task_run_spec_id}|runtimeRunId={runtime_run_id}[&runnerId={runner_id}][&probe=service-state][&diagnostics=browser-state][&authority=scheduler]",
	),
	dashboardSession: route(["GET", "POST", "DELETE"], "GET/POST/DELETE /v1/dashboard/session"),
	models: route(["GET"], "/v1/models"),
	chatCompletionsCreate: route(["POST"], "/v1/chat/completions"),
	responsesCreate: route(["POST"], "/v1/responses"),
	responsesGetTemplate: route(["GET"], "/v1/responses/{response_id}"),
	responseBatchesCreate: route(["POST"], "/v1/response-batches"),
	responseBatchesGetTemplate: route(["GET"], "/v1/response-batches/{batch_id}"),
	responseBatchesCancelTemplate: route(["POST"], "POST /v1/response-batches/{batch_id}/cancel"),
	responseBatchesRetryTemplate: route(["POST"], "POST /v1/response-batches/{batch_id}/retry"),
	mediaGenerationsCreate: route(["POST"], "/v1/media-generations"),
	mediaGenerationsGetTemplate: route(["GET"], "/v1/media-generations/{media_generation_id}"),
	mediaGenerationsMaterializeTemplate: route(
		["POST"],
		"POST /v1/media-generations/{media_generation_id}/materialize",
	),
	mediaGenerationsStatusTemplate: route(
		["GET"],
		"/v1/media-generations/{media_generation_id}/status[?diagnostics=browser-state]",
	),
	runArchive: route(
		["GET"],
		"/v1/archive[?kind=response|response_batch|team_run|media_generation|upload|generated_artifact|provider_conversation|evidence][&provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&projectId={provider_project_id}][&agent={agent_id}][&team={team_id}][&responseId={response_id}][&batchId={batch_id}][&status={status}][&fileAvailable=true|false][&assetAvailability=available|unavailable|pending][&q={query}][&limit=50]",
	),
	runArchiveAssetLookup: route(
		["GET"],
		"/v1/archive/assets/lookup?checksumSha256={sha256}|cacheKey={cache_key}|providerArtifactId={provider_artifact_id}|artifactId={artifact_id}[&limit=50]",
	),
	search: route(
		["GET"],
		"/v1/search[?q={query}][&kind=conversation|artifact|upload|run|evidence][&provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&tenant={bound_identity_key}][&status={status}][&fileAvailable=true|false][&assetAvailability=available|unavailable|pending][&materialization=queued|running|succeeded|skipped|failed|cancelled|active|terminal][&limit=80][&cursor={cursor}]",
	),
	runArchiveBackfill: route(["POST"], "/v1/archive/backfill"),
	runArchiveEvidenceCreate: route(["POST"], "/v1/archive/evidence"),
	runArchiveItemTemplate: route(["GET"], "/v1/archive/items/{archive_item_id}", {
		pathParameters: { archive_item_id: "rest" },
	}),
	runArchiveItemAssetTemplate: route(["GET"], "/v1/archive/items/{archive_item_id}/asset", {
		pathParameters: { archive_item_id: "rest" },
	}),
	runArchiveItemMaterializeTemplate: route(
		["POST"],
		"/v1/archive/items/{archive_item_id}/materialize",
		{ pathParameters: { archive_item_id: "rest" } },
	),
	runArchiveMaterializationsCreate: route(["POST"], "/v1/archive/materializations"),
	runArchiveMaterializationsList: route(
		["GET"],
		"/v1/archive/materializations[?status=queued|running|succeeded|skipped|failed|cancelled|active|terminal][&archiveItemId={archive_item_id}][&limit=50]",
	),
	runArchiveMaterializationTemplate: route(
		["GET", "POST"],
		"/v1/archive/materializations/{job_id}",
	),
	historyMaterializationsCreate: route(["POST"], "/v1/account-mirrors/materializations"),
	historyMaterializationsList: route(
		["GET"],
		"/v1/account-mirrors/materializations[?detail=summary|full][&status=queued|running|succeeded|skipped|failed|cancelled|active|terminal][&provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&sourceType=conversation|project_sources|catalog_item|archive_item|reconciliation|account_library_reconciliation][&limit=50]",
	),
	historyMaterializationTemplate: route(
		["GET", "POST"],
		"/v1/account-mirrors/materializations/{job_id}[?detail=summary|full]",
	),
	accountMirrorRecoveryCandidates: route(
		["GET"],
		"/v1/account-mirrors/recovery-candidates[?provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&tenant={bound_identity_key}][&status=eligible|needs_detail_refresh|deferred|blocked|unsupported|terminal][&action={action}][&includeSearchRows=true|false][&limit=50]",
	),
	runStatusTemplate: route(["GET"], "/v1/runs/{run_id}/status[?diagnostics=browser-state]"),
	apiLogTail: route(["GET"], "/v1/api/logs/tail[?maxBytes=32768]"),
	preflightRunTemplate: route(["GET"], "/v1/preflight/lazy-live-follow/runs/{run_id}"),
	preflightRunLogTemplate: route(
		["GET"],
		"/v1/preflight/lazy-live-follow/runs/{run_id}/log[?maxBytes=32768]",
	),
	accountMirrorStatus: route(
		["GET"],
		"/v1/account-mirrors/status[?provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&explicitRefresh=true]",
	),
	accountMirrorCatalog: route(
		["GET"],
		"/v1/account-mirrors/catalog[?provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&kind=projects|conversations|artifacts|files|media|all][&limit=50]",
	),
	accountMirrorCatalogItemTemplate: route(
		["GET"],
		"/v1/account-mirrors/catalog/items/{item_id}?provider={chatgpt|gemini|grok}&runtimeProfile={runtime_profile}&kind={kind}",
	),
	accountMirrorCatalogItemAssetTemplate: route(
		["GET"],
		"/v1/account-mirrors/catalog/items/{item_id}/asset?provider={chatgpt|gemini|grok}&runtimeProfile={runtime_profile}&kind={kind}",
	),
	accountMirrorPreviewSessions: route(["GET"], "/v1/account-mirrors/preview-sessions"),
	accountMirrorPreviewSessionsCreate: route(["POST"], "POST /v1/account-mirrors/preview-sessions"),
	accountMirrorPreviewSessionTemplate: route(
		["GET", "PATCH", "DELETE"],
		"/v1/account-mirrors/preview-sessions/{preview_session_id}",
	),
	accountMirrorRefresh: route(["POST"], "/v1/account-mirrors/refresh"),
	accountMirrorReconciliationsCreate: route(["POST"], "/v1/account-mirrors/reconciliations"),
	accountMirrorReconciliationsList: route(
		["GET"],
		"/v1/account-mirrors/reconciliations[?status=active|planned|queued|running|idle_waiting|paused|blocked|completed|completed_with_skips|cancelled|failed][&limit=50]",
	),
	accountMirrorReconciliationsGetTemplate: route(
		["GET"],
		"/v1/account-mirrors/reconciliations/{campaign_id}",
	),
	accountMirrorReconciliationsControlTemplate: route(
		["POST"],
		'POST /v1/account-mirrors/reconciliations/{campaign_id} {"action":"pause|resume|cancel|run_next_pass"}',
	),
	accountMirrorCompletionsCreate: route(["POST"], "/v1/account-mirrors/completions"),
	accountMirrorCompletionsList: route(
		["GET"],
		"/v1/account-mirrors/completions[?detail=summary|full][&status=active|queued|running|idle_waiting|paused|completed|blocked|failed|cancelled][&provider={chatgpt|gemini|grok}][&runtimeProfile={runtime_profile}][&limit=50]",
	),
	accountMirrorCompletionsGetTemplate: route(
		["GET"],
		"/v1/account-mirrors/completions/{completion_id}[?detail=summary|full]",
	),
	accountMirrorCompletionsControlTemplate: route(
		["POST"],
		'POST /v1/account-mirrors/completions/{completion_id} {"action":"pause|resume|cancel|run_one_pass"}',
	),
	accountMirrorDevelopmentRunsCreate: route(["POST"], "POST /v1/account-mirrors/development-runs"),
	accountMirrorDevelopmentRunTemplate: route(
		["GET", "POST"],
		'GET/POST /v1/account-mirrors/development-runs/{development_run_id} {"action":"cancel"}',
	),
	accountMirrorDevelopmentPolicy: route(
		["GET", "POST"],
		"GET/POST /v1/account-mirrors/development-policy",
	),
	accountMirrorSchedulerHistory: route(["GET"], "/v1/account-mirrors/scheduler/history[?limit=10]"),
	accountMirrorSchedulerDiagnostics: route(
		["GET"],
		"/v1/account-mirrors/scheduler/diagnostics[?provider={chatgpt|gemini|grok}&runtimeProfile={runtime_profile}|completionId={completion_id}]",
	),
	browserProcesses: route(["GET"], "/v1/browser/processes"),
	browserDomDriftObservations: route(
		["GET"],
		"/v1/browser/dom-drift-observations[?service={chatgpt|gemini|grok}&surface={surface}&status=observed|accepted|rejected&limit=50]",
	),
	browserDomDriftObservationAcceptTemplate: route(
		["POST"],
		"POST /v1/browser/dom-drift-observations/{observation_id}/accept",
	),
	configAgents: route(["GET"], "/v1/config/agents"),
	configAgentTemplate: route(["PUT", "DELETE"], "PUT/DELETE /v1/config/agents/{agent_id}"),
	agentConfigChoices: route(["GET"], "/v1/config/agent-choices"),
	configTeams: route(["GET"], "/v1/config/teams"),
	configTeamTemplate: route(["PUT", "DELETE"], "PUT/DELETE /v1/config/teams/{team_id}"),
	agentRegistryDiagnostics: route(["GET"], "/v1/config/agent-diagnostics"),
	configApiKeys: route(["GET"], "/v1/config/api-keys"),
	configApiKeyIssue: route(["POST"], "POST /v1/config/api-keys/issue"),
	configApiKeyDeleteTemplate: route(["DELETE"], "DELETE /v1/config/api-keys/{key_id}"),
	configSnapshotExport: route(["POST"], "POST /v1/config/snapshots/export"),
	configSnapshotImport: route(["POST"], "POST /v1/config/snapshots/import"),
	workbenchCapabilitiesList: route(
		["GET"],
		"/v1/workbench-capabilities?provider={chatgpt|gemini|grok}&category={category}[&entrypoint=grok-imagine][&diagnostics=browser-state][&discoveryAction=grok-imagine-video-mode]",
	),
	handoffStatusTemplate: route(["GET"], "/v1/handoffs/{handoff_id}/status[?outputDir={path}]"),
	handoffResumeTemplate: route(
		["POST"],
		'POST /v1/handoffs/{handoff_id}/resume {"outputDir":"optional"}',
	),
	handoffRepairTemplate: route(
		["POST"],
		'POST /v1/handoffs/{handoff_id}/repair {"outputDir":"optional"}',
	),
	handoffExportTemplate: route(
		["POST"],
		'POST /v1/handoffs/{handoff_id}/export {"outputDir":"optional"}',
	),
	handoffRecoverLiveTemplate: route(
		["POST"],
		'POST /v1/handoffs/{handoff_id}/recover-live {"outputDir":"optional","targetAdapter":"{target_adapter}"}',
	),
} as const satisfies Record<string, StaticHttpRouteDefinition>;

export type StaticHttpRouteKey = keyof typeof HTTP_ROUTE_MANIFEST;
export type StaticHttpStatusRoutes = { [Key in StaticHttpRouteKey]: string };

export function createStaticHttpStatusRoutes(): StaticHttpStatusRoutes {
	return Object.fromEntries(
		Object.entries(HTTP_ROUTE_MANIFEST).map(([key, definition]) => [
			key,
			definition.statusTemplate,
		]),
	) as StaticHttpStatusRoutes;
}

export function extractHttpRoutePath(statusTemplate: string): string {
	const withoutMethod = statusTemplate.replace(
		/^(?:GET|POST|PUT|PATCH|DELETE)(?:\/(?:GET|POST|PUT|PATCH|DELETE))*\s+/u,
		"",
	);
	const terminators = [
		withoutMethod.indexOf(" "),
		withoutMethod.indexOf("?"),
		withoutMethod.indexOf("["),
	].filter((index) => index >= 0);
	const end = terminators.length > 0 ? Math.min(...terminators) : withoutMethod.length;
	return withoutMethod.slice(0, end);
}

type CompiledHttpRoutePath = {
	parameterNames: readonly string[];
	pattern: RegExp;
};

const compiledHttpRoutePaths = new Map<StaticHttpRouteKey, CompiledHttpRoutePath>();

function compileHttpRoutePath(key: StaticHttpRouteKey): CompiledHttpRoutePath {
	const cached = compiledHttpRoutePaths.get(key);
	if (cached) return cached;
	const routePath = extractHttpRoutePath(HTTP_ROUTE_MANIFEST[key].statusTemplate);
	const parameterNames: string[] = [];
	const patternSource = routePath
		.split(/(\{[^}]+\})/u)
		.map((part) => {
			const parameterMatch = /^\{([a-z][a-z0-9_]*)\}$/u.exec(part);
			if (parameterMatch?.[1]) {
				parameterNames.push(parameterMatch[1]);
				return HTTP_ROUTE_MANIFEST[key].pathParameters?.[parameterMatch[1]] === "rest"
					? "(.+)"
					: "([^/]+)";
			}
			return part.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		})
		.join("");
	const compiled = {
		parameterNames,
		pattern: new RegExp(`^${patternSource}$`, "u"),
	};
	compiledHttpRoutePaths.set(key, compiled);
	return compiled;
}

export function matchHttpRoutePath(
	key: StaticHttpRouteKey,
	pathname: string,
): Readonly<Record<string, string>> | null {
	const compiled = compileHttpRoutePath(key);
	const match = compiled.pattern.exec(pathname);
	if (!match) return null;
	return Object.fromEntries(
		compiled.parameterNames.map((parameterName, index) => [
			parameterName,
			decodeURIComponent(match[index + 1] ?? ""),
		]),
	);
}

export function matchesHttpRoute(
	key: StaticHttpRouteKey,
	method: string | undefined,
	pathname: string,
): boolean {
	if (!method || !HTTP_ROUTE_MANIFEST[key].methods.includes(method as HttpRouteMethod))
		return false;
	return matchHttpRoutePath(key, pathname) !== null;
}

const HTTP_METHOD_ORDER: readonly HttpRouteMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function createHttpEndpointBannerEntries(): string[] {
	const methodsByPath = new Map<string, Set<HttpRouteMethod>>();
	for (const definition of Object.values(HTTP_ROUTE_MANIFEST)) {
		const routePath = extractHttpRoutePath(definition.statusTemplate);
		const methods = methodsByPath.get(routePath) ?? new Set<HttpRouteMethod>();
		for (const method of definition.methods) methods.add(method);
		methodsByPath.set(routePath, methods);
	}
	return [...methodsByPath].map(([routePath, methods]) => {
		const orderedMethods = HTTP_METHOD_ORDER.filter((method) => methods.has(method));
		return `${orderedMethods.join("/")} ${routePath}`;
	});
}

export function formatHttpEndpointBanner(): string {
	const endpoints = createHttpEndpointBannerEntries();
	return `Endpoints (${endpoints.length}): ${endpoints.join(", ")}`;
}
