# Materialization child launch readiness | 0357-2026-09-23

State: CLOSED
Lane: P50
Branch: fix/issue-29-child-launch-readiness
Target: main
Integration: merge
Work item: ecochran76/auracall#29

## Current State

Plan 0356's one authorized installed canary proved parent cleanup but exposed a
second lifecycle race. Child Chrome PID `36730` owned the exact managed browser
profile before its DevTools endpoint became attributable. All six child reads
failed at `browserManagedProfileOwnerProbe`; the second-Chrome guard correctly
refused another launch and the scheduler remains paused.

## Objective

Let a bounded child operation re-discover and reuse an already-starting managed
Chrome once its DevTools endpoint becomes attributable, without weakening the
second-Chrome guard.

## Non-Goals

- Do not launch a second Chrome while any process owns the managed profile.
- Do not install, restart, resume the scheduler, contact a provider, or spend a
  new canary without separate explicit authority.
- Do not alter candidate selection, retry budgets, or provider heuristics.

## Acceptance Criteria

- A provider-free red/green regression reproduces PID visibility before port
  attribution and proves bounded reattachment without another launch.
- A persistently unattributable owner still fails closed.
- Caller cancellation interrupts the readiness wait.
- Focused and affected tests, typecheck, build, lint, plan audits, and diff
  hygiene pass.
- The repair is linked to issue 29 and integrated through a pull request.

## Definition Of Done

Canonical main contains the bounded readiness repair, regression coverage, and
documentation receipts. Installed/live acceptance remains a separate authority
boundary; the scheduler remains paused until that acceptance succeeds.

## Result

PR 35 merged the bounded owner-readiness repair into canonical `main` at
`52cf3641494b623c9fdf6ce2ca105e2430e9e231`. The exact PID-before-port
regression went red before the repair and green after it. The affected packet
passed 112 tests, typecheck, production build, full lint with zero errors, and
the 357-candidate plan audit with zero validation errors. Fresh process census
found no managed browser owner. No install or live effect occurred; issue 29
remains open and unassigned for separately authorized installed acceptance.
