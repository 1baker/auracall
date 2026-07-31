import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");

async function listTypeScriptFiles(root: string): Promise<string[]> {
	const files: string[] = [];
	for (const entry of await fs.readdir(root, { withFileTypes: true })) {
		const absolutePath = path.join(root, entry.name);
		if (entry.isDirectory()) files.push(...await listTypeScriptFiles(absolutePath));
		else if (entry.isFile() && entry.name.endsWith(".ts")) files.push(absolutePath);
	}
	return files;
}

describe("provider-session authority structure", () => {
	test("removes the distributed expected-identity authorization vocabulary", async () => {
		const files = [
			...await listTypeScriptFiles(path.join(repositoryRoot, "src")),
			...await listTypeScriptFiles(path.join(repositoryRoot, "bin")),
		];
		const forbidden = [
			"expectedUserIdentity",
			"expectedServiceAccountId",
			"identityPreflightFallbackIdentity",
			"resolveHistoryMaterializationExpectedIdentity",
			"normalizeExpectedProviderIdentity",
			"providerIdentitiesMatch",
			"identitiesMatchForDoctor",
		];
		const violations: string[] = [];
		for (const file of files) {
			const source = await fs.readFile(file, "utf8");
			for (const identifier of forbidden) {
				if (source.includes(identifier)) {
					violations.push(`${path.relative(repositoryRoot, file)}:${identifier}`);
				}
			}
		}
		expect(violations).toEqual([]);
	});

	test("localizes configured expectation construction to the canonical entry seams", async () => {
		const files = [
			...await listTypeScriptFiles(path.join(repositoryRoot, "src")),
			...await listTypeScriptFiles(path.join(repositoryRoot, "bin")),
		];
		const allowed = new Set([
			"src/browser/providers/providerSessionAuthority.ts",
			"src/browser/llmService/llmService.ts",
			"src/cli/profileIdentitySmokeCommand.ts",
			"src/runtime/configuredExecutor.ts",
		]);
		const constructors: string[] = [];
		for (const file of files) {
			const source = await fs.readFile(file, "utf8");
			if (source.includes("createProviderSessionAuthority(")) {
				constructors.push(path.relative(repositoryRoot, file));
			}
		}
		expect(constructors.sort()).toEqual([...allowed].sort());
	});
});
