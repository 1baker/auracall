import { describe, expect, it } from 'vitest';
import {
  collectAgentsPolicyPaths,
  collectMissingAgentsPolicyReferenceErrors,
} from '../scripts/agentsPolicyEntry.js';

describe('AGENTS policy entry audit', () => {
  it('collects unique canonical policy references in document order', () => {
    const agentsText = [
      '- `docs/dev/policies/0001-policy-management.md`',
      '- `docs/dev/policies/0002-planning-discipline.md`',
      '- `docs/dev/policies/0001-policy-management.md`',
      '- `docs/dev/plans/0001-not-a-policy.md`',
    ].join('\n');

    expect(collectAgentsPolicyPaths(agentsText)).toEqual([
      'docs/dev/policies/0001-policy-management.md',
      'docs/dev/policies/0002-planning-discipline.md',
    ]);
  });

  it('reports every referenced policy that is absent from the canonical directory', () => {
    const agentsText = [
      '- `docs/dev/policies/0001-policy-management.md`',
      '- `docs/dev/policies/0028-missing-policy.md`',
      '- `docs/dev/policies/0029-also-missing.md`',
    ].join('\n');
    const existingPolicyPaths = new Set(['docs/dev/policies/0001-policy-management.md']);

    expect(collectMissingAgentsPolicyReferenceErrors(agentsText, existingPolicyPaths)).toEqual([
      'AGENTS.md: references missing policy docs/dev/policies/0028-missing-policy.md',
      'AGENTS.md: references missing policy docs/dev/policies/0029-also-missing.md',
    ]);
  });
});
