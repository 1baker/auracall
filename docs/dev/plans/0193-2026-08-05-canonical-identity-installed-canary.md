# Canonical Identity Installed Canary | 0193-2026-08-05

State: OPEN
Lane: P01
Plan version: 1
Governing objective: install the pushed Plan 0192 canonical-identity repair and
run exactly one bounded `chatgpt/default` artifacts-and-files reconciliation
canary against the newly admitted candidate.

## Stable Objective

Prove that the accepted and pushed canonical identity matcher reaches the
installed API, preserves every operator pause, and advances the exact prior
default-account request from its false zero-candidate result to a truthful
terminal result. Stop after that one job regardless of disposition.

## Current State

- Source commit `b1a6ab25` is clean, pushed, and fully provider-free validated.
  Its accepted `dist/` contains the canonical matcher; the installed runtime
  does not yet contain it.
- Provider-free current-cache evidence reports 31 discovered conversations,
  zero identity mismatches, one eligible conversation, and 30 rows with no
  selected asset evidence.
- Installed API PID 3892 is healthy with zero service restarts. Scheduler and
  all six completions are paused; queued/running mirrors are 0/0, foreground
  work is inactive, active materialization jobs are zero, and the scoped
  `chatgpt/default` guard is clear.
- Prior job `hmj_f4b10eef7bca43228144c0acfa8eac92` fixes the comparison request:
  `chatgpt/default`, bound identity `ecochran76@gmail.com`, reconciliation,
  `assetKinds=artifacts,files`, `maxItems=1`, no refresh, no force, and a
  300,000 ms provider-work timeout.

## Authority And Ownership

- The operator's `ok go` explicitly authorizes the recommended install plus
  one bounded canary described above.
- It authorizes one user-runtime installation/service restart and one new
  history-materialization job with the exact prior request shape.
- It does not authorize scheduler or completion control, live-follow resume,
  snapshot refresh, force, retry, provider prompt, browser diagnosis, guard
  clearing, a second job, unattended continuation, or source repair.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; delegation
  was not requested and this is one serialized install/job gate.
- Expected repo write surface: this plan, `ROADMAP.md`, `RUNBOOK.md`, and
  `docs/dev/dev-journal.md`. Runtime writes are limited to the installer,
  service restart, the one job record, and any materialized output/manifest
  produced by that job.

## Local Goal Bounds

- `max_builds: 0`; reuse the already accepted Plan 0192 build.
- `max_install_restarts: 1`; install once with `--skip-build`, then install the
  API service once, which performs the sole restart.
- `max_live_jobs: 1`; exact `provider=chatgpt`, `runtimeProfile=default`,
  `boundIdentityKey=ecochran76@gmail.com`, `reconcile=true`,
  `assetKinds=artifacts,files`, `maxItems=1`, `refreshSnapshot=false`,
  `force=false`, and `providerWorkTimeoutMs=300000`.
- `max_job_status_polls: 30`; poll only the returned job id at no less than
  ten-second intervals and stop at the first terminal readback.
- `max_retries: 0`; `max_provider_prompts: 0`; `max_browser_diagnostics: 0`;
  `max_completion_actions: 0`; `max_scheduler_actions: 0`;
  `max_guard_actions: 0`; `max_additional_jobs: 0`.
- `max_review_rework_cycles: 1`; `max_duration_minutes: 30`.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `INSTALLED` after one install/restart proves source/runtime parity
   and preserves the paused zero-work posture.
2. `INSTALLED` -> `CANARY_RUNNING` after exactly one fixed-scope job is accepted
   and its identifier is recorded.
3. `CANARY_RUNNING` -> `CANARY_SETTLED` on the first terminal job readback.
4. `CANARY_SETTLED` -> `COMPLETE` after exact outcome, installed state,
   planning audit, commit/push, and remote parity are recorded.
5. Any guard, identity, pause, active-work, install-parity, or job-contract
   mismatch transitions immediately to `STOPPED_FAIL_CLOSED` without retry.

## Acceptance Criteria

- [ ] The pushed Plan 0192 build is installed once with exact relevant
  source/runtime parity and one healthy service restart.
- [ ] Scheduler and all six completions remain paused before and after install;
  no pre-existing queued/running mirror or active materialization job exists.
- [ ] Exactly one canary uses the frozen request contract and reaches a terminal
  state without retry.
- [ ] Exact result readback reports candidate funnel, eligible/selected counts,
  materialized/skipped/failed dispositions, provider-session evidence, and any
  durable output/manifest paths that exist.
- [ ] Final API/guard/work posture, plan/runbook/journal, audit, commit/push,
  and remote parity are truthful and current.

## Hard Stops And Non-Goals

- Stop before the canary if installed bytes do not match accepted build output,
  the API is unhealthy, any pause is lost, active work is nonzero, the exact
  account binding is absent/ambiguous, or the scoped provider guard is not
  clear.
- Stop after the sole canary regardless of success, skip, failure, guard, or
  timeout. Do not retry, refresh, force, widen `maxItems`, run browser tools,
  clear a guard, or resume any completion/scheduler.
- A positive canary does not authorize unattended live-follow or backlog-wide
  materialization.

## Definition Of Done

The accepted canonical matcher is installed with exact parity, one and only one
fixed default-account canary settles, every operator pause is preserved, and
the exact outcome is durably recorded and pushed. No unattended authority is
created by completion of this plan.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0192 COMPLETE -> explicit operator `ok go` -> Plan
  0193 READY.
- `progress_classification`: outcome_progress
- `evidence`: clean synchronized `b1a6ab25`; accepted build contains the matcher
  while installed runtime does not; healthy PID 3892 with zero restarts,
  scheduler/six completions paused, no active work/jobs, and clear scoped
  guard; prior job supplies the frozen request contract.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: builds 0/0; installs 0/1; live jobs 0/1; polls 0/30;
  retries/provider prompts/browser diagnostics/completion/scheduler/guard
  actions 0/0.
- `remaining_criteria`: all five acceptance items.
- `next_action_or_stop_reason`: wire and push this authority packet, then run
  the sole install/restart and recheck parity plus paused posture.
