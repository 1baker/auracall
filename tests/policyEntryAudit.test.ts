import { describe, expect, it, vi } from 'vitest';
import { collectMissingPolicyTargets } from '../scripts/policy-entry-audit.js';

describe('policy entry audit', () => {
  it('reports each missing AGENTS.md policy target once in stable order', () => {
    const exists = vi.fn((path: string) => path.endsWith('0001-policy-management.md'));
    const errors = collectMissingPolicyTargets(
      [
        '- `docs/dev/policies/0030-model-selection-and-calibration.md`',
        '- `docs/dev/policies/0001-policy-management.md`',
        '- `docs/dev/policies/0030-model-selection-and-calibration.md`',
      ].join('\n'),
      '/repo',
      exists,
    );

    expect(errors).toEqual([
      'AGENTS.md: referenced policy target does not exist: docs/dev/policies/0030-model-selection-and-calibration.md',
    ]);
    expect(exists).toHaveBeenCalledTimes(2);
  });

  it('returns no errors when every referenced policy target exists', () => {
    expect(
      collectMissingPolicyTargets(
        '- `docs/dev/policies/0030-model-selection-and-calibration.md`',
        '/repo',
        () => true,
      ),
    ).toEqual([]);
  });
});
