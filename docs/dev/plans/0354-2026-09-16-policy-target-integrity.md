# Policy target integrity | 0354-2026-09-16

State: OPEN
Lane: P47
Branch: fix/issue-20-policy-target-integrity
Target: main
Integration: merge
Work item: ecochran76/auracall#20

## Current State

The missing-target defect is reproduced and repaired locally. Policy 0030 now
matches the adopted selector module body, and the ordinary plan audit validates
every backtick-delimited `AGENTS.md` durable policy target through a focused,
deterministic helper. Provider-free validation is green; publication,
integration, and final custody cleanup remain.

## Objective

Restore the adopted policy body and make the ordinary provider-free plan audit
fail deterministically whenever `AGENTS.md` names a missing durable policy file.

## Non-Goals

- No model-quality or cost calibration experiment.
- No provider, browser, installed-runtime, release, or live-system effect.
- No policy renumbering, selector-bundle mutation, or unrelated policy rewrite.

## Acceptance Criteria

- The durable 0030 policy matches the installed adopted module semantics.
- A focused unit test proves missing targets are unique, stable, and detected.
- `pnpm -s plans:audit`, focused tests, typecheck, scoped lint, goal audit, and
  active-lane audit pass at the applicable branch/publication boundary.
- The change is linked to Issue 20 and integrated through a pull request.

## Definition Of Done

Canonical main contains the policy, the deterministic guard, tests, and an
integration receipt. The temporary implementation worktree is removed only
after clean remote custody and process-owner checks.
