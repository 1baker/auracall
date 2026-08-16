import { describe, expect, it } from 'vitest';
import {
  collectActivePlanIndexPaths,
  collectActivePlanIndexStateErrors,
} from '../scripts/planIndexState.js';

describe('plan index active state audit', () => {
  it('collects canonical paths only from the bounded active section', () => {
    const planIndex = [
      '# Canonical Plan Index',
      '',
      'Current canonical active execution plan:',
      '- `docs/dev/plans/open.md`',
      '- `docs/dev/plans/planned.md`',
      '',
      'Audit helper:',
      '- `docs/dev/plans/ignored.md`',
    ].join('\n');

    expect(collectActivePlanIndexPaths(planIndex)).toEqual([
      'docs/dev/plans/open.md',
      'docs/dev/plans/planned.md',
    ]);
  });

  it('accepts OPEN and PLANNED while rejecting every non-active state class', () => {
    const planIndex = [
      'Current canonical active execution plan:',
      '- `docs/dev/plans/open.md`',
      '- `docs/dev/plans/planned.md`',
      '- `docs/dev/plans/closed.md`',
      '- `docs/dev/plans/cancelled.md`',
      '- `docs/dev/plans/missing.md`',
      '- `docs/dev/plans/state-less.md`',
      '- `docs/dev/plans/unknown.md`',
      '',
      'Audit helper:',
    ].join('\n');
    const states = new Map<string, string | null>([
      ['docs/dev/plans/open.md', 'OPEN'],
      ['docs/dev/plans/planned.md', 'PLANNED'],
      ['docs/dev/plans/closed.md', 'CLOSED'],
      ['docs/dev/plans/cancelled.md', 'CANCELLED'],
      ['docs/dev/plans/state-less.md', null],
      ['docs/dev/plans/unknown.md', 'PAUSED'],
    ]);

    expect(collectActivePlanIndexStateErrors(planIndex, states)).toEqual([
      'docs/dev/plan-index.md: active entry references terminal plan docs/dev/plans/closed.md (State: CLOSED)',
      'docs/dev/plan-index.md: active entry references terminal plan docs/dev/plans/cancelled.md (State: CANCELLED)',
      'docs/dev/plan-index.md: active entry references missing plan docs/dev/plans/missing.md',
      'docs/dev/plan-index.md: active entry references plan without canonical State: docs/dev/plans/state-less.md',
      'docs/dev/plan-index.md: active entry references non-active plan docs/dev/plans/unknown.md (State: PAUSED; expected OPEN/PLANNED)',
    ]);
  });

  it('rejects duplicate and malformed active-section entries', () => {
    const planIndex = [
      'Current canonical active execution plan:',
      '- `docs/dev/plans/open.md`',
      '- `docs/dev/plans/open.md`',
      '- docs/dev/plans/not-code-formatted.md',
      '',
      'Audit helper:',
    ].join('\n');

    expect(
      collectActivePlanIndexStateErrors(
        planIndex,
        new Map([['docs/dev/plans/open.md', 'OPEN']]),
      ),
    ).toEqual([
      'docs/dev/plan-index.md: duplicate active plan docs/dev/plans/open.md',
      'docs/dev/plan-index.md: malformed active-plan entry "- docs/dev/plans/not-code-formatted.md"',
    ]);
  });

  it('rejects a missing active-plan section', () => {
    expect(
      collectActivePlanIndexStateErrors(
        '# Canonical Plan Index\n\nAudit helper:\n- `pnpm run plans:audit`',
        new Map(),
      ),
    ).toEqual([
      'docs/dev/plan-index.md: missing "Current canonical active execution plan:" section',
    ]);
  });
});
