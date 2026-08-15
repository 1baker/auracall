import { HTTP_ROUTE_MANIFEST, type StaticHttpRouteDefinition } from "../src/http/routeManifest.js";
import { collectHttpRouteManifestContractErrors } from "./httpRouteManifestContract.js";

export type SpecializedSkillContractSources = {
	httpServerText: string;
	httpRouteManifest?: Readonly<Record<string, StaticHttpRouteDefinition>>;
	mcpToolText: string;
	packageText: string;
	agentSetupSkillText: string;
	apiWorkflowSkillText: string;
	endpointDocText: string;
	workflowDocText: string;
};

const MCP_TOOLS = [
	"agent_setup_handoff_create",
	"agent_setup_package_create",
	"api_key_diagnostics",
	"api_key_issue",
	"api_status",
	"config_entities_list",
	"project_ensure",
	"response_batch_create",
	"response_batch_cancel",
	"response_batch_status",
	"response_create",
	"run_status",
] as const;

const AGENT_SETUP_SKILL_FRAGMENTS = [
	"auracall_agent_setup_handoff",
	"config_entities_list",
	"next.restartService",
	"On that lower-level path",
	"blockedReason",
] as const;

const API_WORKFLOW_SKILL_FRAGMENTS = [
	"AURACALL_STATUS_URL",
	"AURACALL_BATCH_URL",
	"response_create",
	"response_batch_create",
	"response_batch_cancel",
	"response_batch_status",
	"run_status",
	"auracall_execution_pending",
	"X-AuraCall-Response-Id",
	"pnpm run smoke:scoped-client-handoff",
	"pnpm run smoke:scoped-client-env -- <client.env>",
	"Treat it as effectful",
] as const;

const EXPECTED_SMOKE_SCRIPTS: Readonly<Record<string, string>> = {
	"smoke:scoped-client-env": "tsx scripts/smoke-scoped-client-env.ts",
	"smoke:scoped-client-handoff": "tsx scripts/smoke-scoped-client-handoff-workflow.ts",
};

function requireFragments(
	text: string,
	path: string,
	fragments: readonly string[],
	errors: string[],
): void {
	for (const fragment of fragments) {
		if (!text.includes(fragment)) {
			errors.push(`${path}: missing required contract ${fragment}`);
		}
	}
}

function parsePackageScripts(packageText: string, errors: string[]): Record<string, unknown> {
	try {
		const parsed: unknown = JSON.parse(packageText);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
			errors.push("package.json: expected a JSON object");
			return {};
		}
		const scripts = (parsed as Record<string, unknown>).scripts;
		if (typeof scripts !== "object" || scripts === null || Array.isArray(scripts)) {
			errors.push("package.json: scripts must be an object");
			return {};
		}
		return scripts as Record<string, unknown>;
	} catch (error) {
		errors.push(
			`package.json: invalid JSON (${error instanceof Error ? error.message : String(error)})`,
		);
		return {};
	}
}

export function collectSpecializedSkillContractErrors(
	sources: SpecializedSkillContractSources,
): string[] {
	const errors: string[] = [];

	errors.push(
		...collectHttpRouteManifestContractErrors({
			httpServerText: sources.httpServerText,
			httpRouteManifest: sources.httpRouteManifest ?? HTTP_ROUTE_MANIFEST,
		}),
	);
	for (const tool of MCP_TOOLS) {
		const pattern = new RegExp(`registerTool\\(\\s*["']${tool}["']`, "u");
		if (!pattern.test(sources.mcpToolText)) {
			errors.push(`src/mcp/tools: missing ${tool} registration authority`);
		}
	}

	const scripts = parsePackageScripts(sources.packageText, errors);
	for (const [name, command] of Object.entries(EXPECTED_SMOKE_SCRIPTS)) {
		if (scripts[name] !== command) {
			errors.push(`package.json: ${name} must be ${command}`);
		}
	}

	requireFragments(
		sources.agentSetupSkillText,
		"skills/auracall-agent-setup/SKILL.md",
		AGENT_SETUP_SKILL_FRAGMENTS,
		errors,
	);
	requireFragments(
		sources.apiWorkflowSkillText,
		"skills/auracall-api-workflow/SKILL.md",
		API_WORKFLOW_SKILL_FRAGMENTS,
		errors,
	);

	if (
		sources.agentSetupSkillText.includes(
			"Confirm `mutationTarget` is `registry` for a new/updated bound agent",
		)
	) {
		errors.push(
			"skills/auracall-agent-setup/SKILL.md: redacted handoff cannot expose mutationTarget",
		);
	}
	for (const forbidden of ["$OPENAI_BASE_URL/../status", "smoke:che447-grading-batch"]) {
		if (sources.apiWorkflowSkillText.includes(forbidden)) {
			errors.push(`skills/auracall-api-workflow/SKILL.md: forbidden general workflow ${forbidden}`);
		}
	}

	requireFragments(
		sources.endpointDocText,
		"docs/openai-endpoints.md",
		["- `POST /v1/chat/completions`", "OpenAI-compatible SSE", "optional API-key auth"],
		errors,
	);
	for (const pattern of [
		/no `POST \/v1\/chat\/completions` adapter/iu,
		/no streaming, auth/iu,
		/streaming remains unsupported/iu,
		/rejects `stream: true`/iu,
	]) {
		if (pattern.test(sources.endpointDocText)) {
			errors.push("docs/openai-endpoints.md: contains retired chat-completions/auth claim");
		}
	}
	requireFragments(
		sources.workflowDocText,
		"docs/agent-workflows.md",
		[
			"streaming/non-streaming",
			"POST /v1/response-batches/{batch_id}/cancel",
			"response_batch_cancel",
			"auracall_execution_pending",
			"X-AuraCall-Response-Id",
			"agent_setup_handoff_create",
		],
		errors,
	);

	return errors;
}
