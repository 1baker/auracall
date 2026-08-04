# ChatGPT Materialization Selection Diagnosis | 0189-2026-08-04

State: CLOSED
Lane: P01
Plan version: 2
Outcome: COMPLETE
Governing objective: explain provider-free why 62 metadata-current missing-local
assets produce zero downloadable selections.

## Stable Objective

Build a deterministic red-capable mismatch loop over the current status and
latest job, trace the status-to-selection flow through CodeGraph, test one
ranked hypothesis set with provider-free fixtures/readbacks, and record the
root cause plus the smallest safe successor. Preserve all runtime pauses.

## Current State

- Plan 0188 closed detail inventory at zero and `mirrorCompleteness=complete`.
  The separate `full_missing_assets` readback remains
  `materialization_required`, with 30 artifacts and 32 files known remote but
  missing locally.
- Four consecutive owned jobs across Plans 0186/0188 total 0 materialized / 28
  skipped / 0 failed. Latest job `hmj_86d37c10800b4ff39e9b928c951b52f0`
  is terminal `skipped` and the exact completion remains paused at pass 4.
- Scheduler and six retained completions are paused, queued/running completion
  counts are 0/0, default guard is null, and API PID `1091` is healthy with
  zero restarts.
- CodeGraph is healthy with 875 indexed files, 16,483 nodes, and 55,701 edges.

## Authority And Ownership

- The operator's 2026-08-04 `ok go` authorizes the recommended provider-free,
  read-only routeability/materializer-selection diagnosis. It does not
  authorize a fix, source/config mutation, build/install/restart, live job,
  provider/browser action, completion control, or scheduler action.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; runtime
  policy prohibits delegation without explicit authorization, and repo policy
  requires direct CodeGraph exploration for structural questions.
- Expected write surface: this plan, `ROADMAP.md`, `RUNBOOK.md`,
  `docs/dev/dev-journal.md`, and `docs/dev-fixes-log.md` only.

## Local Goal Bounds

- `max_feedback_loop_runs: 3`; two baseline reproductions and at most one final
  confirmation. The loop must be deterministic, fast, agent-runnable, and red
  on the exact 62-versus-zero mismatch.
- `max_codegraph_calls: 4`; one status check already consumed separately from
  this flow budget, then context/explore/trace only as needed.
- `max_provider_free_probe_commands: 3`; targeted existing tests or read-only
  fixture/cache classifiers only.
- `max_hypothesis_sets: 1`; 3-5 ranked falsifiable hypotheses, tested once.
- `max_review_rework_cycles: 0`; no fix/review loop in this diagnosis.
- `max_source_changes: 0`, `max_config_changes: 0`, `max_builds: 0`,
  `max_install_restarts: 0`, `max_live_jobs: 0`, `max_provider_interactions: 0`,
  `max_completion_actions: 0`, and `max_scheduler_actions: 0`.
- `max_duration_minutes: 45`; stop with the strongest supported finding rather
  than widening scope.
- `checkpoint_interval: 1 slices` and after feedback-loop construction,
  hypothesis testing, and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `RED_LOOP` only after two identical nonzero mismatch verdicts.
2. `RED_LOOP` -> `HYPOTHESES` after the smallest current-state input that still
   proves metadata-current missing-local count above zero plus a terminal
   zero-materialized latest job is identified.
3. `HYPOTHESES` -> `ROOT_CAUSE_SUPPORTED` only when CodeGraph flow plus a
   provider-free probe falsifies alternatives and supports one cause.
4. `ROOT_CAUSE_SUPPORTED` -> `COMPLETE` after docs, audits, current paused
   runtime readback, commit/push, and remote parity.
5. If no tight loop or supported cause exists within bounds, close terminally
   with the missing evidence; do not speculate or mutate.

## Acceptance Criteria

- [x] One exact provider-free command reproduces the 62-versus-zero mismatch
  twice with deterministic nonzero exit and captured compact evidence.
- [x] CodeGraph identifies the separate backlog projection and materialization
  candidate-selection inputs/call path without grep-based reconstruction.
- [x] One ranked hypothesis set is tested with no provider or source mutation.
- [x] Root cause is stated at the correct certainty level with the smallest
  safe repair/validation successor and explicit non-goals.
- [x] Canonical docs, audits, runtime preservation, commit/push, and remote
  parity describe the terminal result.

## Hard Stops And Non-Goals

- No source/test/config edit, fix, build/install/restart, new job, live follow,
  browser/provider work, guard clear, or speculative broad redesign.
- This diagnosis may recommend a repair packet, but cannot execute it.

## Definition Of Done

Close complete only after a tight red-capable loop and provider-free evidence
support one root cause. Otherwise close terminally with the exact unresolved
boundary and required next evidence.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0188 complete -> explicit operator authority ->
  provider-free selection diagnosis ready.
- `progress_classification`: blocker_reduction
- `evidence`: metadata complete; detail surfaces 0; missing-local assets 62;
  latest job skipped with zero materialized; exact completion/scheduler and six
  retained completions paused; CodeGraph healthy.
- `subagent_status`: `not_spawned`; direct structural exploration required.
- `budget_consumption`: feedback loops 0/3; CodeGraph flow calls 0/4; probes
  0/3; hypothesis sets 0/1; elapsed 0/45 minutes; forbidden mutations 0/0.
- `remaining_criteria`: all five acceptance items.
- `next_action_or_stop_reason`: audit and commit/push this packet, then build
  and run the exact red-capable provider-free feedback loop twice.

## Checkpoint 2 | Deterministic Red Loop

- `plan_version`: 1
- `state_transition`: `READY` -> `RED_LOOP` -> `HYPOTHESES`.
- `progress_classification`: evidence_gain
- `evidence`: one compact provider-free shell assertion read `/status`, the
  exact completion, and its exact terminal job, then emitted the same nine
  scalars and exit 5 twice: metadata current true, missing local 62, detail
  surfaces 0, completion paused, job skipped, materialized 0, skipped 7, and
  failed 0. Two earlier shell drafts failed before the assertion because one
  used zsh's read-only `status` name and one exceeded the argument-list limit;
  neither was counted as a feedback-loop run.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: feedback loops 2/3; CodeGraph flow calls 0/4; probes
  0/3; hypothesis sets 1/1; forbidden mutations 0/0.
- `remaining_criteria`: trace the two projections, test the ranked hypotheses,
  state the supported cause, and close.
- `next_action_or_stop_reason`: compare the global missing-local aggregation
  with the reconciliation candidate gates and sanitized persisted-job result.

## Checkpoint 3 | Root Cause Supported

- `plan_version`: 1
- `state_transition`: `HYPOTHESES` -> `ROOT_CAUSE_SUPPORTED`.
- `progress_classification`: blocker_reduction
- `evidence`: CodeGraph and exact-source fallback show that the status backlog
  is the account-wide `remoteKnownMissingLocal` inventory, while reconciliation
  independently builds per-conversation candidates from routeable catalog
  rows, eligible manifest families, freshness evidence, and absence of terminal
  evidence. `maxItems` caps attempted targets/assets; it is not a promise that
  the global backlog contains that many currently downloadable candidates.
  The sanitized persisted latest job had `maxItems=6`, one collector-reused
  conversation, four conversation results, and seven terminal skips: known
  file families were already terminal or outside the bounded selection, two
  details exposed no downloadable artifact/file assets, and one media item had
  no account-mirror match. There were zero retryable failures. Four focused
  existing tests passed for terminal-family exclusion, collector snapshot
  reuse, remaining-budget behavior, and completion failure semantics.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: feedback loops 2/3; CodeGraph flow calls 3/4; probes
  2/3; hypothesis sets 1/1; forbidden mutations 0/0; elapsed within 45/45.
- `remaining_criteria`: canonical closeout, audits, current paused readback,
  commit/push, and remote parity.
- `next_action_or_stop_reason`: close complete. The evidence falsifies stale
  aggregation as the primary cause and falsifies an insufficient retry budget;
  it supports a projection/eligibility contract mismatch.

## Root Cause And Successor

The supported cause is a semantic mismatch between two truthful but
non-equivalent quantities. The 62 count is a global metadata inventory of
remote-known assets lacking local bytes. The job operates on a separately
derived, bounded set of routeable and nonterminal catalog candidates. The
latest selected surfaces produced terminal skips rather than transient
failures, so an additional pass or a larger retry allowance had no supported
path to materialization.

The smallest safe successor is provider-free source/test work that first adds
a red regression proving the confusing 62-versus-zero projection, then exposes
or derives explicit `eligibleCandidates` and `selectedCandidates` counts beside
the global backlog and preserves terminal skip dispositions. It must not make
global missing-local count imply downloadability, weaken terminal-family
deduplication, increase live retries, or resume the scheduler/completion.

## Final Checkpoint | Complete

- `plan_version`: 2
- `state_transition`: `ROOT_CAUSE_SUPPORTED` -> `COMPLETE`.
- `progress_classification`: accepted_completion
- `evidence`: deterministic red loop 2/2; ranked hypotheses tested; structural
  and persisted-job evidence agree; 4/4 focused tests pass; canonical docs and
  audits are current; scheduler and exact completion remain paused with no new
  job or provider action.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: feedback loops 2/3; CodeGraph flow calls 3/4; probes
  2/3; hypothesis sets 1/1; source/config/build/install/live/control mutations
  0/0; duration within ceiling.
- `remaining_criteria`: none inside Plan 0189.
- `next_action_or_stop_reason`: terminal stop. Any regression/observability
  repair requires a separately authorized provider-free implementation plan.
