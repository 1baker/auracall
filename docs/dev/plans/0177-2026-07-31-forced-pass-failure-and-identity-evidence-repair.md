# Forced-Pass Failure And Identity-Evidence Repair | 0177-2026-07-31

State: OPEN
Lane: P01
Plan version: 1

## Goal

Repair the two provider-free defects proved by Plan 0176: same-email ChatGPT
sessions must not be classified as drift merely because provider evidence omits
configured account qualifiers, and a forced live-follow pass must apply its
completion-owned materialization failure before returning idle.

## Current State

- Scheduler posture/state and all six persisted completions are paused.
- Default ChatGPT completion
  `acctmirror_completion_7c207690-de8a-40a4-82b8-61edd830a25c` is paused at
  pass 36 with no provider guard.
- Job `hmj_e10de506d132411fb88a0f7511ce7487` truthfully settled failed with
  `materialized=0 skipped=1 failed=6`.
- All six failures compare the configured qualified service account
  `ecochran76@gmail.com|plan=team|structure=workspace` against authoritative
  provider-app evidence for the same email that omits comparable qualifier
  values.
- `run_one_pass` cleared its force ceiling and returned idle while its owned
  materialization job remained asynchronous; later hydration updated the
  failed cursor/outcome without transitioning the completion to blocked.

## Scope

- Add one public identity-preflight regression proving same-email identity with
  absent detected qualifiers is accepted.
- Preserve strict drift when both configured and detected qualifier values are
  present and conflict.
- Add one completion-service regression proving forced-pass owned
  materialization settles to terminal and an all-failed result returns the
  completion as `blocked` with `account_mirror_materialization_failed`.
- Implement the smallest changes behind the existing identity-preflight and
  completion-control interfaces.
- Update operator-facing testing and durable repair documentation.

## Non-Goals

- No scheduler/completion resume, live provider pass, browser probe, guard
  clear, account binding change, or materialization retry.
- No relaxation of explicit email, account, organization, plan, or structure
  conflicts when both sides provide comparable evidence.
- No new endpoint, control action, config knob, or browser-adapter heuristic.
- No redesign of the materialization worker or completion persistence format.

## Acceptance Criteria

- [x] A deterministic public identity-preflight regression fails before the
  repair for same-email identity with absent detected qualifiers.
- [x] Same-email identity with absent detected qualifiers passes after the
  repair, while explicit plan/structure conflict remains drift.
- [x] A deterministic completion-service regression fails before the repair
  because `run_one_pass` returns idle before its owned failed materialization
  is applied.
- [x] The forced pass waits for the owned materialization terminal and returns
  `blocked` with `account_mirror_materialization_failed`, without a second
  collector refresh.
- [x] Focused tests, adjacent tests, typecheck, production build, scoped lint,
  plan audit, and diff hygiene pass.
- [ ] Installed runtime is promoted only while scheduler and all completion
  lanes remain paused; installed/source hashes and post-restart paused status
  are proved without provider work.

## Hard Bounds And Stop Conditions

- One red-green implementation cycle per defect, plus one bounded integrated
  rework cycle if validation finds a cross-seam defect.
- No live browser/provider validation in this plan.
- Stop rather than weaken tenant isolation if the same-email case cannot be
  distinguished from explicit qualifier conflict provider-free.
- Stop rather than add a second collector pass if materialization settlement
  cannot be owned inside the existing forced-pass completion lifecycle.

## Definition Of Done

The plan closes when both provider-free regressions are red then green, strict
conflict behavior remains covered, the existing public interfaces are
unchanged, repository and installed-runtime validation pass, and all live
provider lanes remain paused.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: authorized -> regression-ready
- `progress_classification`: substantive
- `evidence`: Plan 0176 persisted the exact same-email qualifier-omission
  failure and asynchronous failed-materialization lifecycle; commits
  `1430bfd4` and `718ba4f0` are pushed and the worktree is clean.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: commit the provider-free authority packet,
  create one public regression at a time, record red evidence, and make the
  minimum green repair without touching live provider state.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: regression-ready -> integrated-validation
- `progress_classification`: substantive
- `evidence`: identity regression failed 1/12 before repair and passes 12/12;
  forced-pass failure regression timed out before repair and passes after the
  completion retains ownership through terminal materialization. Combined
  identity/completion suites pass 74/74; adjacent ChatGPT service and HTTP
  response-server suites pass 218/218. Integrated relevant tests pass 292/292;
  typecheck, production build, four-file scoped Biome lint, 177-plan audit with
  zero errors, and diff hygiene pass. Biome formatter output remains excluded
  because two touched legacy files intentionally retain their existing
  single-quote/space style; lint is clean and no formatting-only rewrite was
  mixed into this repair.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: run typecheck, production build, scoped lint,
  full relevant tests, plan audit, and diff hygiene; then commit/push before a
  paused-only installed-runtime promotion.
