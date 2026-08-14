import { describe, expect, it } from 'vitest';
import {
  collectActiveRoadmapPlanPaths,
  collectActiveRoadmapPlanStateErrors,
} from '../scripts/roadmapPlanState.js';

describe('roadmap active plan state audit', () => {
  it('finds canonical plan links only inside Active bullets', () => {
    const roadmap = [
      '- Active bounded repair:',
      '  [plan](docs/dev/plans/0292-2026-08-14-roadmap-active-state-audit.md)',
      '  Current work remains provider-free.',
      '- Closed accepted prior repair:',
      '  [plan](docs/dev/plans/0291-2026-08-14-server-side-run-authority-filter.md)',
      '- Active next checkpoint is:',
      '  - maintenance mode without a plan link',
    ].join('\n');

    expect(collectActiveRoadmapPlanPaths(roadmap)).toEqual([
      'docs/dev/plans/0292-2026-08-14-roadmap-active-state-audit.md',
    ]);
  });

  it('rejects terminal plans while accepting OPEN and PLANNED targets', () => {
    const roadmap = [
      '- Active closed target:',
      '  [closed](docs/dev/plans/closed.md)',
      '- Active cancelled target:',
      '  [cancelled](docs/dev/plans/cancelled.md)',
      '- Active open target:',
      '  [open](docs/dev/plans/open.md)',
      '- Active planned target:',
      '  [planned](docs/dev/plans/planned.md)',
    ].join('\n');
    const states = new Map<string, string | null>([
      ['docs/dev/plans/closed.md', 'CLOSED'],
      ['docs/dev/plans/cancelled.md', 'CANCELLED'],
      ['docs/dev/plans/open.md', 'OPEN'],
      ['docs/dev/plans/planned.md', 'PLANNED'],
    ]);

    expect(collectActiveRoadmapPlanStateErrors(roadmap, states)).toEqual([
      'ROADMAP.md: Active label references terminal plan docs/dev/plans/closed.md (State: CLOSED)',
      'ROADMAP.md: Active label references terminal plan docs/dev/plans/cancelled.md (State: CANCELLED)',
    ]);
  });
});
