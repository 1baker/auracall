export type BundledSkillArtifact = {
	directory: string;
	text: string;
};

export const EXPECTED_BUNDLED_SKILLS = [
	"auracall",
	"auracall-agent-setup",
	"auracall-api-workflow",
	"auracall-chatgpt",
	"auracall-gemini",
] as const;

const REQUIRED_SKILL_FRAGMENTS: Readonly<Record<string, readonly string[]>> = {
	auracall: [
		"pnpm run install:user-runtime",
		"auracall --dry-run summary --files-report",
		"auracall status --hours 72",
	],
	"auracall-agent-setup": ["name: auracall-agent-setup", "AuraCall Agent Setup"],
	"auracall-api-workflow": ["name: auracall-api-workflow", "AuraCall API Workflow"],
	"auracall-chatgpt": [
		"auracall setup --target chatgpt",
		"auracall --engine browser --model chatgpt:sol-high",
	],
	"auracall-gemini": [
		"auracall setup --target gemini --export-cookies",
		"auracall --engine browser --model gemini-3-pro",
	],
};

const RETIRED_SKILL_PATTERNS: ReadonlyArray<{ label: string; pattern: RegExp }> = [
	{ label: "retired Oracle package", pattern: /@steipete\/oracle/gu },
	{ label: "retired Oracle command", pattern: /(^|\n)\s*oracle(?:\s|$)/gu },
	{ label: "retired Oracle branding", pattern: /\bOracle\b/gu },
];

function frontmatterName(text: string): string | null {
	return text.replace(/\r\n?/gu, "\n").match(/^---\n[\s\S]*?^name:\s*([^\n]+)\n[\s\S]*?^---$/m)?.[1]?.trim() ?? null;
}

function hasPattern(text: string, pattern: RegExp): boolean {
	pattern.lastIndex = 0;
	return pattern.test(text);
}

export function collectBundledSkillErrors(
	directoryNames: readonly string[],
	artifacts: readonly BundledSkillArtifact[],
	readmeText: string,
): string[] {
	const errors: string[] = [];
	const actualDirectories = new Set(directoryNames);
	const expectedDirectories = new Set<string>(EXPECTED_BUNDLED_SKILLS);
	const artifactsByDirectory = new Map(
		artifacts.map((artifact) => [artifact.directory, artifact.text]),
	);

	for (const directory of EXPECTED_BUNDLED_SKILLS) {
		if (!actualDirectories.has(directory)) {
			errors.push(`skills/${directory}: missing bundled skill directory`);
		}
		const text = artifactsByDirectory.get(directory)?.replace(/\r\n?/gu, "\n");
		if (!text) {
			errors.push(`skills/${directory}/SKILL.md: missing bundled skill instructions`);
			continue;
		}
		if (frontmatterName(text) !== directory) {
			errors.push(`skills/${directory}/SKILL.md: frontmatter name must be ${directory}`);
		}
		for (const fragment of REQUIRED_SKILL_FRAGMENTS[directory] ?? []) {
			if (!text.includes(fragment)) {
				errors.push(`skills/${directory}/SKILL.md: missing required contract ${fragment}`);
			}
		}
		for (const { label, pattern } of RETIRED_SKILL_PATTERNS) {
			if (hasPattern(text, pattern)) {
				errors.push(`skills/${directory}/SKILL.md: ${label}`);
			}
		}
	}

	for (const directory of actualDirectories) {
		if (!expectedDirectories.has(directory)) {
			errors.push(`skills/${directory}: unexpected bundled skill directory`);
		}
	}

	if (!readmeText.includes("pnpm run install:user-runtime")) {
		errors.push("README.md: bundled skill installation must install the user runtime");
	}
	if (!readmeText.includes("**Codex skill**")) {
		errors.push("README.md: missing Codex skill installation section");
	}
	for (const directory of EXPECTED_BUNDLED_SKILLS) {
		if (!readmeText.includes(`skills/${directory}`)) {
			errors.push(`README.md: bundled skill installation must include skills/${directory}`);
		}
	}
	for (const { label, pattern } of RETIRED_SKILL_PATTERNS) {
		if (hasPattern(readmeText.slice(readmeText.indexOf("**Codex skill**")), pattern)) {
			errors.push(`README.md: Codex skill installation contains ${label}`);
		}
	}

	return errors;
}
