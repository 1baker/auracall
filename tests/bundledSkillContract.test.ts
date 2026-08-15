import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	collectBundledSkillErrors,
	EXPECTED_BUNDLED_SKILLS,
	type BundledSkillArtifact,
} from "../scripts/bundledSkillContract.js";

function repositorySkillState(): {
	directoryNames: string[];
	artifacts: BundledSkillArtifact[];
} {
	const skillsDirectory = resolve("skills");
	const directoryNames = readdirSync(skillsDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
	const artifacts = directoryNames.flatMap((directory) => {
		const skillPath = join(skillsDirectory, directory, "SKILL.md");
		return existsSync(skillPath) ? [{ directory, text: readFileSync(skillPath, "utf8") }] : [];
	});
	return { directoryNames, artifacts };
}

describe("bundled skill contract", () => {
	it("accepts the complete repository skill bundle and README installation", () => {
		const state = repositorySkillState();
		expect(state.directoryNames).toEqual([...EXPECTED_BUNDLED_SKILLS].sort());
		expect(
			collectBundledSkillErrors(
				state.directoryNames,
				state.artifacts,
				readFileSync(resolve("README.md"), "utf8"),
			),
		).toEqual([]);
	});

	it("rejects retired names, commands, incomplete frontmatter, and README drift", () => {
		expect(
			collectBundledSkillErrors(
				["oracle", "auracall"],
				[
					{
						directory: "auracall",
						text: "---\nname: oracle\ndescription: Legacy.\n---\n\nOracle\n\noracle --help\n",
					},
				],
				"**Codex skill**\ncp -R skills/oracle ~/.codex/skills/oracle\n",
			),
		).toContain("skills/oracle: unexpected bundled skill directory");
	});

	it("reports every expected directory when the bundle is absent", () => {
		const errors = collectBundledSkillErrors([], [], "**Codex skill**");
		for (const directory of EXPECTED_BUNDLED_SKILLS) {
			expect(errors).toContain(`skills/${directory}: missing bundled skill directory`);
			expect(errors).toContain(`skills/${directory}/SKILL.md: missing bundled skill instructions`);
			expect(errors).toContain(
				`README.md: bundled skill installation must include skills/${directory}`,
			);
		}
	});

	it("requires the README installation section", () => {
		expect(collectBundledSkillErrors([], [], "")).toContain(
			"README.md: missing Codex skill installation section",
		);
	});
});
