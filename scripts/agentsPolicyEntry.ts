const CANONICAL_POLICY_REFERENCE = /docs\/dev\/policies\/[0-9]{4}-[a-z0-9-]+\.md/gu;

export function collectAgentsPolicyPaths(agentsText: string): string[] {
  return Array.from(new Set(agentsText.match(CANONICAL_POLICY_REFERENCE) ?? []));
}

export function collectMissingAgentsPolicyReferenceErrors(
  agentsText: string,
  existingPolicyPaths: ReadonlySet<string>,
): string[] {
  return collectAgentsPolicyPaths(agentsText)
    .filter((policyPath) => !existingPolicyPaths.has(policyPath))
    .map((policyPath) => `AGENTS.md: references missing policy ${policyPath}`);
}
