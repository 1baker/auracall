# ChatGPT Default Two-Pass Continuous Activation | 0186-2026-08-04

State: OPEN
Lane: P01
Plan version: 1
Governing objective: prove automatic cadence on one default ChatGPT target
without granting global scheduler or indefinite unattended authority.

## Stable Objective

Start exactly one `chatgpt/default` live-follow completion under its installed
full-sweep/full-missing-assets policy, observe at most two automatic passes and
their owned materialization settlement, then pause that exact completion before
a third pass. Keep the global scheduler and every unrelated completion paused.

## Current State

- Plans 0180 and 0185 are closed complete. Their fresh two-asset proof passed
  at 2 materialized / 0 failed, and the bounded canary completed exactly one
  pass with zero materialization failures, duplicate same-route mutations, or
  provider safety signals.
- API PID `65381` is active/running with zero restarts. Scheduler state/posture
  are paused, five retained completions are paused, queued/running completions
  and materialization jobs are zero, default active completion and provider
  guard are null, and every ChatGPT status record has a null guard.
- Read-only campaign `acctmirror_reconciliation_35143c29-d627-4775-bf45-6f40ffeef5a4`
  classified `chatgpt/default` as the only eligible ChatGPT target. The three
  other ChatGPT targets have existing operator-paused completions and must not
  be resumed or policy-upgraded.
- Default is not a cheap steady-follow target: its configured policy is
  `full_sweep` plus `full_missing_assets`, max six materialization items, and
  18 remaining detail surfaces. This prevents inferring global scheduler or
  indefinite continuous authority from the one-pass canary.

## Authority And Ownership

- The operator's 2026-08-04 `ok go` accepts the prior recommendation to treat
  continuous re-enablement as a separate reviewed slice. This plan takes the
  narrowest reversible activation: one target, two passes, then exact pause.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; runtime
  policy prohibits delegation without explicit authorization, and the live
  state transition is serialized.
- Expected write surface: this plan, `ROADMAP.md`, `RUNBOOK.md`,
  `docs/dev/dev-journal.md`, and `docs/dev-fixes-log.md`. No source, config,
  install, restart, scheduler, guard, or unrelated completion mutation is
  authorized.

## Local Goal Bounds

- `max_completion_starts: 1`; exact target `chatgpt/default` only.
- `max_automatic_passes: 2`; third-pass start is a hard stop and failure.
- `max_owned_materialization_jobs: 2`; one per observed pass, no manual job.
- `max_safety_pause_actions: 1`; only the newly created completion.
- `max_live_failures: 1`; first failed collector/materializer or safety signal
  triggers exact pause and terminal closeout without retry.
- `max_live_duration_minutes: 60`; on expiry, pause the exact completion and
  close terminally rather than extending the observation.
- `max_code_repairs: 0`, `max_config_changes: 0`, `max_install_restarts: 0`,
  `max_scheduler_actions: 0`, `max_unrelated_completion_actions: 0`, and
  `max_review_rework_cycles: 0`.
- `checkpoint_interval: 1 slices` and before activation, between passes, before
  pause, and at closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `PASS_ONE_ACTIVE` by starting one default completion without a
   `maxPasses` cap, using the exact installed full-sweep/materialization policy.
2. `PASS_ONE_ACTIVE` -> `PASS_ONE_SETTLED` only after `passCount=1`, the owned
   job is terminal with zero failures, and no guard or duplicate mutation exists.
3. `PASS_ONE_SETTLED` -> `PASS_TWO_SETTLED` only after the completion wakes on
   its own cadence, reaches `passCount=2`, and its second owned job settles with
   the same clean evidence.
4. `PASS_TWO_SETTLED` -> `COMPLETE` only after pausing the exact completion and
   restoring scheduler paused, six retained completions paused, zero active
   work, null default active completion, and clear guards.
5. Any failure, guard, CAPTCHA/verification/rate limit, identity mismatch,
   duplicate same-route mutation, third pass, unrelated resume, or 60-minute
   ceiling -> exact completion pause -> `FAILED_TERMINAL`; no retry edge.

## Work Units

### W1 | Authority And Final Preflight

- Commit and push this plan before live mutation.
- Reconfirm clean remote parity, installed hash/PID health, scheduler and five
  retained completions paused, zero active work, null default active completion,
  clear guards, and unchanged default full-sweep policy.

### W2 | Two-Pass Automatic Cadence Proof

- Start exactly one default live-follow completion with explicit installed
  `full_sweep`, `full_missing_assets`, asset kind `all`, max items 6, and
  snapshot refresh. Omit `maxPasses` so the second pass must be cadence-driven.
- Observe pass one and its job to terminal settlement. Only then permit the
  same completion's automatic second pass. Do not run a force-pass control.

### W3 | Exact Pause And Closeout

- After second owned-job settlement, pause the exact completion before a third
  pass. On any stop signal, use the same one permitted pause immediately.
- Verify final paused zero-work posture, reconcile canonical docs, audit,
  commit/push, and preserve all receipts.

## Acceptance Criteria

- [x] Read-only planning identifies default as the sole eligible ChatGPT target
  and preserves the three operator-paused ChatGPT completions.
- [ ] Exactly one new default live-follow completion starts under explicit
  installed full-sweep/materialization policy while scheduler remains paused.
- [ ] The same completion reaches exactly two automatic passes; each owned job
  settles with zero failures, exact identity, no guard, and no duplicate
  same-route mutation.
- [ ] The exact completion is paused before a third pass and final runtime
  posture is scheduler paused, six completions paused, and zero active work.
- [ ] Canonical docs, audits, commit/push, and remote parity describe the exact
  terminal outcome.

## Hard Stops And Non-Goals

- No global scheduler resume, indefinite leave-running authority, other target
  resume, force pass, direct job, retry, replacement completion, code/config
  repair, install/restart, guard clear, account switch, CAPTCHA handling, or
  `Answer now` click.
- This proves automatic cadence and safe pauseability. Leaving the completion
  running beyond two passes is a later explicit operator decision.

## Definition Of Done

Plan 0186 closes complete only after two clean automatic passes plus owned-job
settlement and exact paused zero-work restoration. Any stop signal closes it
terminally after the one permitted exact pause.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plans 0180/0185 complete -> separate re-enablement review
  -> one-target two-pass activation packet ready.
- `progress_classification`: blocker_reduction
- `evidence`: installed API PID `65381` healthy; scheduler and five retained
  completions paused; active work zero; guards clear; dry-run campaign
  `acctmirror_reconciliation_35143c29-d627-4775-bf45-6f40ffeef5a4` selects only
  default and preserves three operator-paused ChatGPT completions.
- `subagent_status`: `not_spawned`; serialized live state.
- `budget_consumption`: starts 0/1; passes 0/2; owned jobs 0/2; safety pauses
  0/1; live failures 0/1; duration 0/60 minutes; all forbidden mutations 0/0.
- `remaining_criteria`: W1-W3 and the four unchecked acceptance items.
- `next_action_or_stop_reason`: audit and commit/push this authority packet,
  then run final preflight. Any mismatch stops before live activation.
