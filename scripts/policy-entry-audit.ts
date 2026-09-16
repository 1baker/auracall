import { existsSync } from 'node:fs';
import { join } from 'node:path';

const POLICY_TARGET_PATTERN = /`(docs\/dev\/policies\/[^`\s]+\.md)`/g;

export function collectMissingPolicyTargets(
  agentsText: string,
  repoRoot: string,
  targetExists: (absolutePath: string) => boolean = existsSync,
): string[] {
  const targets = new Set(Array.from(agentsText.matchAll(POLICY_TARGET_PATTERN), (match) => match[1]));
  return Array.from(targets)
    .sort((left, right) => left.localeCompare(right))
    .filter((target) => !targetExists(join(repoRoot, target)))
    .map((target) => `AGENTS.md: referenced policy target does not exist: ${target}`);
}
