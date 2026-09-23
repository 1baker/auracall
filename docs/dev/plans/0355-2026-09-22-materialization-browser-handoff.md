# Materialization browser handoff | 0355-2026-09-22

State: CLOSED
Lane: P48
Branch: fix/issue-29-materialization-browser-handoff
Target: main
Integration: merge
Work item: ecochran76/auracall#29

## Current State

PR 31 integrated the provider-free repair into canonical `main` at
`5cef9d58266ddbe3e5046db2f7b453c2f65bdbce`. The issue 10 one-shot canary
proved candidate fairness but the child
materialization job encountered transient managed-profile owner PID `37909`
after the parent completion refresh. The browser-service second-Chrome guard
correctly failed closed. Provider-free diagnosis found that refresh cleanup
reported `terminated` immediately after signaling the process and completion
did not gate child creation on a failed cleanup receipt.

## Objective

Make the completion-refresh to materialization-child browser handoff explicit:
wait boundedly for managed-profile ownership to clear, and refuse to create the
child job when cleanup cannot prove release.

## Non-Goals

- Do not weaken the second-Chrome guard or infer an unattributable owner is safe.
- Do not install source, operate a browser, contact a provider, or retry issue 10.
- Do not alter candidate fairness, materialization budgets, or provider heuristics.

## Acceptance Criteria

- A provider-free refresh regression proves cleanup waits for owner release.
- A provider-free completion regression proves failed cleanup blocks child creation.
- Existing responsive-owner reuse and second-Chrome fail-closed tests remain green.
- Focused tests, typecheck, lint, plan audits, and affected-test analysis pass.
- The repair is linked to issue 29 and integrated through a pull request.

## Definition Of Done

Canonical main contains the bounded release wait, fail-closed child gate,
regressions, and documentation receipts. Issue 29 is closed. Installed/live
acceptance remains a separate authority boundary and issue 10 was not retried.

## Installed Acceptance Update | 2026-09-23

Plan 0356's single zero-retry live canary disproved the wider handoff outcome.
Parent cleanup correctly released attributable PID `11917`, but the child then
launched PID `36730` and probed ownership before its DevTools endpoint became
attributable. Issue 29 is reopened for the remaining child-launch readiness
defect; the provider-free parent cleanup repair remains integrated.
