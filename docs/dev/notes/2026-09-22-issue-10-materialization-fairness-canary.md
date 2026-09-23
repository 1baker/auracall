# Issue 10 Materialization Fairness Canary | 2026-09-22

Work item: `ecochran76/auracall#10`
Corrective work item: `ecochran76/auracall#29`
Lane: P18 / Plan 0325
Disposition: `COMPLETED_WITH_FAILED_HANDOFF`

## Preflight

- Current source and installed `dist` each contained 525 files with aggregate
  SHA-256
  `a9b3351a4f098434adca66ba0287ed25e88ea1bf5d5798bd94654bcc1094d51d`.
- The installed API was active at PID `12008` with zero restarts.
- The exact `wsl-chrome-3` completion was operator-paused at pass 36; the
  `default` completion was also paused; queued/running materialization jobs
  were zero.
- Fresh no-launch identity proof matched the configured Pro personal account
  and attributed the responsive managed browser at PID `19080`, DevTools port
  `38221`, to the exact profile.
- Gemini remained disabled and was neither launched nor inspected.

## One-Shot Receipt

- One `run-one-pass` control was accepted at
  `2026-09-23T01:58:22.562Z`; no retry was issued.
- Completion pass count advanced exactly once, 36 to 37.
- Exactly one child job was created:
  `hmj_a616ec85279841f6a0c6199e9871185b`.
- The job made one attempt and settled terminal `failed` at
  `2026-09-23T02:06:20.962Z`.
- Candidate funnel: 254 discovered, 206 eligible, six selected; the selected
  conversation IDs were distinct.
- All six attempt receipts recorded `assetsAttempted: 0`, preserving the
  concrete-only transfer budget when snapshot refresh failed.

## Failure And Cleanup

Each candidate stopped at `preflight:browserManagedProfileOwnerProbe` because
Chrome PID `37909` owned the exact managed profile without an attributable
responsive DevTools endpoint. AuraCall refused to launch a second Chrome and
recorded six failed/unknown-routeability entries. This is a browser lifecycle
handoff defect, not a fairness-ordering or budget-accounting failure.

After settlement, PID `37909` and the earlier PID `19080` were absent, the
provider-work serialization lease was released, active materialization jobs
were zero, and the API remained active at PID `12008` with zero restarts. The
completion is fail-closed at pass 37 with `forceRunUntilPassCount = null`; a
pause request does not rewrite a terminal blocked completion into paused.

Issue 10's only authorized canary is therefore complete and must not be
retried. Issue 29 owns provider-free repair and any separately authorized later
installed/live acceptance.
