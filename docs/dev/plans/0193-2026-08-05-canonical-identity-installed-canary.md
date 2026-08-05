# Canonical Identity Installed Canary | 0193-2026-08-05

State: CLOSED
Lane: COMPLETE
Plan version: 1
Outcome: COMPLETE_BOUNDED_CANARY_SUCCEEDED
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

- [x] The pushed Plan 0192 build is installed once with exact relevant
  source/runtime parity and one healthy service restart.
- [x] Scheduler and all six completions remain paused before and after install;
  no pre-existing queued/running mirror or active materialization job exists.
- [x] Exactly one canary uses the frozen request contract and reaches a terminal
  state without retry.
- [x] Exact result readback reports candidate funnel, eligible/selected counts,
  materialized/skipped/failed dispositions, provider-session evidence, and any
  durable output/manifest paths that exist.
- [x] Final API/guard/work posture, plan/runbook/journal, audit, commit/push,
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

## Checkpoint 2 | Installed

- `plan_version`: 1
- `state_transition`: READY -> INSTALLED.
- `progress_classification`: outcome_progress
- `evidence`: the accepted prebuilt runtime installed once with `--skip-build`;
  the API service performed its sole restart and is healthy at PID 4278 with
  zero crash restarts. Recursive `dist/` comparison found no source/installed
  differences. Scheduler and all six completions remain paused, queued/running
  mirrors are 0/0, foreground work is inactive, active materialization jobs are
  zero, the exact default identity is present, and its scoped guard is clear.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: builds 0/0; installs 1/1; live jobs 0/1; polls 0/30;
  retries/provider prompts/browser diagnostics/completion/scheduler/guard
  actions 0/0.
- `remaining_criteria`: sole canary settlement, exact outcome/final posture,
  docs/audits, commit/push, and remote parity.
- `next_action_or_stop_reason`: create exactly one frozen-contract job, record
  its id, and poll only that id to its first terminal result.

## Final Checkpoint | Complete Bounded Canary Succeeded

- `plan_version`: 1
- `state_transition`: INSTALLED -> CANARY_RUNNING -> CANARY_SETTLED -> COMPLETE.
- `progress_classification`: accepted_completion
- `evidence`: sole job `hmj_b8134a340aa441118894432f1ebe08cc`
  settled `succeeded` on attempt 1 from `2026-08-05T15:05:24.902Z` to
  `2026-08-05T15:07:46.971Z`. Its request exactly preserved
  `chatgpt/default`, bound identity `ecochran76@gmail.com`, reconciliation,
  artifacts+files, `maxItems=1`, 300,000 ms provider-work timeout, no refresh,
  and no force.
- `evidence`: result metrics are 31 discovered, zero identity mismatches, 30
  `noSelectedAssetEvidence`, one eligible, one selected, one conversation, one
  materialized, zero skipped, zero failed, and zero duplicate aliases. Provider
  session proof matched email, plan, structure, and account-level dimensions.
- `evidence`: conversation `67ccf9d7-9310-8004-b5e1-478dba6eab3a`
  materialized canvas artifact `Che4470 Exam Guide` by `canvas-content-text` as
  a 3,362-byte text file with SHA-256
  `514d0ddc7425970fbc48bd3c9a84a7fc4234a0a1ebfa836f8b6f77795d37fe2d`.
  The durable manifest is under the conversation's
  `~/.auracall/cache/providers/chatgpt/.../artifact-fetch-manifest.json` path;
  archive and job-store readback bind both paths to the canary id.
- `evidence`: final API remains healthy at PID 4278 with zero crash restarts;
  scheduler and all six completions are paused, the default completion remains
  paused at pass 4 with its prior cursor unchanged, queued/running mirrors are
  0/0, foreground work is inactive, active jobs are zero, and the scoped guard
  is clear.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: builds 0/0; installs 1/1; live jobs 1/1; polls 8/30;
  retries/provider prompts/browser diagnostics/completion/scheduler/guard
  actions and additional jobs 0/0; review/rework 0/1.
- `remaining_criteria`: none inside Plan 0193.
- `next_action_or_stop_reason`: terminal stop complete. The canary proves the
  installed canonical matcher can select and materialize the admitted asset;
  it grants no broader or unattended authority.
