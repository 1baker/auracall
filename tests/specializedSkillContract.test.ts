import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	collectSpecializedSkillContractErrors,
	type SpecializedSkillContractSources,
} from "../scripts/specializedSkillContract.js";
import { HTTP_ROUTE_MANIFEST } from "../src/http/routeManifest.js";

const mcpToolPaths = [
	"src/mcp/tools/agentSetupPackage.ts",
	"src/mcp/tools/apiKeys.ts",
	"src/mcp/tools/apiStatus.ts",
	"src/mcp/tools/configEntities.ts",
	"src/mcp/tools/projectEnsure.ts",
	"src/mcp/tools/responseBatch.ts",
	"src/mcp/tools/responseCreate.ts",
	"src/mcp/tools/runStatus.ts",
];

function readRepositorySources(): SpecializedSkillContractSources {
	return {
		httpServerText: readFileSync(resolve("src/http/responsesServer.ts"), "utf8"),
		httpRouteManifest: HTTP_ROUTE_MANIFEST,
		mcpToolText: mcpToolPaths.map((path) => readFileSync(resolve(path), "utf8")).join("\n"),
		packageText: readFileSync(resolve("package.json"), "utf8"),
		agentSetupSkillText: readFileSync(resolve("skills/auracall-agent-setup/SKILL.md"), "utf8"),
		apiWorkflowSkillText: readFileSync(resolve("skills/auracall-api-workflow/SKILL.md"), "utf8"),
		endpointDocText: readFileSync(resolve("docs/openai-endpoints.md"), "utf8"),
		workflowDocText: readFileSync(resolve("docs/agent-workflows.md"), "utf8"),
	};
}

describe("specialized skill endpoint contract", () => {
	it("accepts current HTTP, MCP, package, skill, and documentation authority", () => {
		expect(collectSpecializedSkillContractErrors(readRepositorySources())).toEqual([]);
	});

	it("rejects missing runtime authorities and stale specialized guidance", () => {
		const sources = readRepositorySources();
		const errors = collectSpecializedSkillContractErrors({
			...sources,
			httpServerText: "",
			mcpToolText: "",
			packageText: JSON.stringify({ scripts: {} }),
			agentSetupSkillText: "Confirm `mutationTarget` is `registry` for a new/updated bound agent",
			apiWorkflowSkillText: "$OPENAI_BASE_URL/../status smoke:che447-grading-batch",
			endpointDocText:
				"no `POST /v1/chat/completions` adapter yet; no streaming, auth, or chat/completions adapter",
			workflowDocText: "",
		});

		expect(errors).toContain(
			"skills/auracall-agent-setup/SKILL.md: redacted handoff cannot expose mutationTarget",
		);
		expect(errors).toContain(
			"skills/auracall-api-workflow/SKILL.md: forbidden general workflow smoke:che447-grading-batch",
		);
		expect(errors).toContain(
			"docs/openai-endpoints.md: contains retired chat-completions/auth claim",
		);
		expect(errors).toContain("src/http/responsesServer.ts: missing handler reference for models");
		expect(errors).toContain(
			"src/mcp/tools: missing agent_setup_handoff_create registration authority",
		);
	});
});
