# Installed materialization browser handoff acceptance | 0356-2026-09-23

State: CLOSED
Lane: P49
Operational state: TERMINAL_FAILED_HANDOFF
Branch: ops/issue-29-live-acceptance
Target: main
Integration: merge
Work item: ecochran76/auracall#29

## Objective

Install the issue 29 provider-free repair and run one zero-retry
`wsl-chrome-3` completion pass to prove the parent refresh releases its managed
browser before child history materialization begins.

## Authority And Bounds

- One supported user-runtime install and API restart.
- Temporarily pause the account-mirror scheduler, let existing work settle,
  run one `run_one_pass`, and restore only if doing so cannot create a retry.
- Do not touch Gemini, clear provider guards, send prompts, or retry a terminal
  failed canary.

## Result

Source and installed runtime matched at 525 `dist` files with aggregate SHA-256
`29bb1d851f11472f5240f7643bc3765f2d376bf31ad4b99465dd3bf7b76f4fec`.
The API restarted once under PID `10657` with zero crash restarts. Exact
ChatGPT identity matched the configured Pro personal account.

The sole control advanced completion
`acctmirror_completion_c4accb96-e1c9-4dee-8643-3bd6934569cd` from pass 26 to
27. Parent refresh `acctmirror_9d80bb0e-235c-4b37-a16d-516944db05be`
reported bounded cleanup `terminated` for attributable PID `11917`, and child
`hmj_f6d222a1b51545a8ae51037190d6f301` began.

Live acceptance then failed. The child launched transient Chrome PID `36730`
but all six snapshot refreshes reached
`preflight:browserManagedProfileOwnerProbe` before a responsive DevTools
endpoint could be attributed. The second-Chrome guard refused another launch,
all attempts recorded `assetsAttempted: 0`, and no retry ran.

## Final Safety State

The child is terminal failed, the completion is blocked at pass 27 with a null
force ceiling, active materialization jobs are zero, the exact managed browser
has no owner or listener, and API PID `10657` remains healthy with zero crash
restarts. The scheduler remains paused because restoring it would permit an
autonomous retry of the confirmed defect. Issue 29 is reopened. PR 33
integrated this terminal receipt at
`d8c9282ebb6a6e2776f6b306ad648d5cadb6fab6`.
