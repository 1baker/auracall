# ChatGPT Materialization Candidate Observability And Default Proof | 0190-2026-08-04

State: CLOSED
Lane: P01
Plan version: 2
Outcome: COMPLETE_AUTHORITY_WITHHELD
Governing objective: implement Plan 0189's observability successor, install it,
and require one bounded default-account materialization proof with explicit
eligible/selected counts before granting any unattended live-follow authority.

## Stable Objective

Add a provider-free regression for the truthful global-backlog-versus-selection
distinction, expose explicit `eligibleCandidates` and `selectedCandidates` in
reconciliation job results and completion/status hydration, install the accepted
runtime, and consume exactly one bounded `chatgpt/default` artifacts+files
materialization proof. Preserve every scheduler/completion pause. The proof may
support or reject a later unattended-live-follow proposal; it does not itself
grant that authority.

## Current State

- Plan 0189 proved that the metadata-current 62 missing-local assets are a
  global inventory, not a promise of downloadable work. The latest bounded job
  selected four conversation results and emitted seven terminal skips with zero
  materialized and zero failed assets, but current job/completion readback does
  not expose its eligible or selected candidate denominator.
- Reconciliation derives catalog candidates from routeability, selected-kind
  evidence, freshness, terminal-family history, and bounded target/asset
  budgets. `maxItems` limits selected work; it does not define eligibility.
- Scheduler and six retained completions are paused, the exact default
  completion is paused at pass 4, active work is zero, guards are clear, and the
  last verified installed API PID was `1091` with zero restarts. Current
  pre-install readback must confirm or supersede this snapshot.

## Authority And Ownership

- The active thread goal explicitly authorizes this provider-free
  implementation, one build/install/restart, and one bounded default-account
  materialization proof with explicit counts.
- It does not authorize scheduler resume, completion resume/control, a new
  completion, a live-follow pass, force, snapshot refresh, retry, provider
  prompt, broad browser diagnosis, guard clearing, or unattended operation.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; the user did
  not request delegation and direct CodeGraph exploration is required.
- Expected write surface: history-materialization result/selection code,
  completion hydration/persistence, focused tests, README/testing docs, this
  plan, `ROADMAP.md`, `RUNBOOK.md`, `docs/dev/dev-journal.md`, and
  `docs/dev-fixes-log.md`.

## Candidate Count Contract

- `eligibleCandidates`: candidates admitted by cached routeability,
  selected-kind, freshness, and persisted terminal-family gates before the
  current job's target/asset ceiling. This is never the global missing-local
  count and never promises that provider work will yield bytes.
- `selectedCandidates`: eligible candidates actually admitted after within-job
  family deduplication, provider-guard stops, and target/asset ceilings. A
  selected candidate can still settle as a truthful terminal skip.
- Both counts are nonnegative, `selectedCandidates <= eligibleCandidates`, are
  preserved in compact job monitoring and completion materialization outcome,
  and default to zero when older persisted data lacks the fields.

## Local Goal Bounds

- `max_red_green_cycles: 2`; one exact red regression and one green rerun.
- `max_codegraph_calls: 24`; structural discovery/impact only, with direct source
  validation after writes while the index refreshes.
- `max_source_files: 6`; history selection/result plus completion hydration,
  persistence, shared status type, HTTP projection, and CLI normalization. The
  initial four-file estimate expanded once when typecheck proved both compact
  status normalization boundaries were part of the public contract.
- `max_review_rework_cycles: 1`; one consolidated audit and one repair pass.
- `max_builds: 1`, `max_install_restarts: 1`, `max_live_jobs: 1`,
  `max_provider_prompts: 0`, `max_completion_actions: 0`,
  `max_scheduler_actions: 0`, `max_guard_actions: 0`, and `max_retries: 0`.
- The sole live job must be `provider=chatgpt`, `runtimeProfile=default`, exact
  configured identity bound, `reconcile=true`, `assetKinds=artifacts,files`,
  `maxItems=1`, `force=false`, and `refreshSnapshot=false`.
- `max_duration_minutes: 90`; checkpoint after planning, provider-free green,
  install parity, live settlement, and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `RED` after the regression proves the missing count can remain
   nonzero while eligible/selected are independently zero or bounded.
2. `RED` -> `PROVIDER_FREE_GREEN` after result, monitoring, completion
   hydration, persistence, targeted tests, and broader provider-free validation
   preserve the count contract.
3. `PROVIDER_FREE_GREEN` -> `INSTALLED` after commit/push, build/install/restart,
   exact source/runtime parity, and paused zero-work posture.
4. `INSTALLED` -> `PROOF_SETTLED` after the sole default-account job reaches a
   terminal state and its exact job plus `/status` completion readback expose
   explicit eligible/selected counts.
5. `PROOF_SETTLED` -> `COMPLETE_AUTHORITY_WITHHELD` unless the proof has
   `eligibleCandidates > 0`, `selectedCandidates > 0`, selected not above
   eligible, zero failed assets, exact account/session match, no guard or
   duplicate mutation, and restored paused zero-work posture. Even if all hold,
   this plan records only `COMPLETE_AUTHORITY_CANDIDATE`; a new explicit
   operator decision is required to grant unattended live-follow authority.

## Acceptance Criteria

- [x] A provider-free red/green regression proves global missing-local backlog
  and reconciliation eligible/selected counts are separate denominators.
- [x] Terminal-family exclusions, within-job deduplication, and `maxItems`
  retain their behavior while result metrics report deterministic nonnegative
  counts with selected not above eligible.
- [x] Compact job monitoring plus completion hydration/persistence expose both
  fields, including zero defaults for older persisted operations.
- [x] Focused tests, full provider-free validation, typecheck, build, scoped
  lint, planning/goal audits, and diff hygiene pass; operator docs are current.
- [x] The accepted commit is pushed and installed with exact source/runtime
  parity while scheduler, completions, guards, and active-work posture remain
  fail-closed.
- [x] Exactly one bounded default-account materialization job settles without
  retry and its exact job and `/status` readbacks show explicit eligible and
  selected counts plus final materialized/skipped/failed disposition.
- [x] Final authority classification is evidence-derived; no unattended
  live-follow, scheduler, or completion authority is granted inside this plan.

## Hard Stops And Non-Goals

- Stop before the live job on failed validation, install mismatch, nonzero
  active work, missing/ambiguous configured identity, provider guard, unhealthy
  installed service, or any lost pause.
- Stop the live phase after the sole job regardless of outcome. Do not retry,
  force, refresh the snapshot, run a completion pass, resume the exact
  completion, or clear a guard.
- Do not redefine the 62 global assets as eligible, infer downloadable bytes
  from a positive candidate count, weaken terminal-family exclusion, increase
  the materialization budget, or redesign the scheduler.

## Definition Of Done

Close only after provider-free implementation and installed parity are proven,
the sole bounded default-account job has settled with explicit counts, every
pause is preserved, and the authority classification is recorded truthfully.
Absence of positive eligible/selected work is a valid proof result but requires
unattended authority to remain withheld.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0189 complete -> explicit active-goal authority ->
  observability implementation/default proof ready.
- `progress_classification`: blocker_reduction
- `evidence`: clean synchronized `main`; Plan 0189 root cause and successor;
  CodeGraph identified `materializeReconciliation`, result metrics, compact job
  monitoring, and completion outcome hydration as the bounded seams.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph calls 19/24 including discovery/status-related
  lookups; source 0/4; red/green 0/2; builds 0/1; installs 0/1; live jobs 0/1;
  forbidden actions 0/0.
- `remaining_criteria`: all seven acceptance items.
- `next_action_or_stop_reason`: wire this plan into canonical authority, commit
  the planning slice, then add and run the exact red regression before source
  implementation.

## Checkpoint 2 | Provider-Free Contract Implemented

- `plan_version`: 1
- `state_transition`: `READY` -> `RED` -> provider-free implementation green;
  full validation still active before `PROVIDER_FREE_GREEN` is granted.
- `progress_classification`: outcome_progress
- `evidence`: the exact regression failed at both missing fields, then the
  focused history/completion/CLI packet passed 151/151 with typecheck. The
  fixture distinguishes seven global missing-local assets, three eligible
  candidates, and two selected candidates while retaining family dedupe and
  remaining budget. Legacy persistence defaults to 0/0 and clamps selected to
  eligible. The first full suite reached 2,713 passes and one unrelated HTTP
  background-drain timing miss; the exact miss passed 1/1 on isolated rerun.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 21/24; source 6/6; red/green 2/2; review
  rework 0/1; builds 0/1; installs 0/1; live jobs 0/1; forbidden actions 0/0.
- `remaining_criteria`: clean full-suite/build/lint/audits; commit/push; install
  parity and paused posture; sole proof; final authority classification.
- `next_action_or_stop_reason`: rerun the clean full-suite gate after docs,
  execute the sole production build and scoped lint/audits, then commit/push.

## Checkpoint 3 | Provider-Free Green

- `plan_version`: 1
- `state_transition`: implementation green -> `PROVIDER_FREE_GREEN`.
- `progress_classification`: outcome_progress
- `evidence`: clean rerun passed 304 files / 2,714 tests with 65 skips;
  typecheck, sole production build, nine-file scoped Biome lint, completion
  hydration smoke, live-follow-health parity smoke, plan audit with zero
  validation errors, goal-policy audit, and diff hygiene pass. The prior lone
  background-drain timing miss passed isolated and did not recur.
- `subagent_status`: `not_spawned`; all validation is primary-agent evidence.
- `budget_consumption`: CodeGraph 21/24; source 6/6; red/green 2/2; review
  rework 0/1; builds 1/1; installs 0/1; live jobs 0/1; forbidden actions 0/0.
- `remaining_criteria`: commit/push; installed source/runtime parity and paused
  zero-work posture; sole default proof; final authority classification.
- `next_action_or_stop_reason`: commit and push the accepted provider-free
  slice, then run the single permitted install/restart and verify parity before
  any live proof.

## Checkpoint 4 | Installed

- `plan_version`: 1
- `state_transition`: `PROVIDER_FREE_GREEN` -> `INSTALLED`.
- `progress_classification`: outcome_progress
- `evidence`: commits `ae7b9e71` and `eb61fa9f` are pushed on `origin/main`;
  the accepted build installed once with `--skip-build`; API PID changed from
  `1091` to `3892` with zero restarts; all six emitted contract files match the
  installed runtime byte-for-byte. Pre/post readback preserved the paused
  scheduler, six paused completions, default completion paused at pass 4, zero
  queued/running completion work, zero active history jobs, zero foreground
  work, and a null default guard. Legacy default completion hydration exposes
  explicit candidate counts at 0/0.
- `subagent_status`: `not_spawned`; install and readback are primary-agent
  evidence.
- `budget_consumption`: CodeGraph 21/24; source 6/6; red/green 2/2; review
  rework 0/1; builds 1/1; installs 1/1; live jobs 0/1; forbidden actions 0/0.
- `remaining_criteria`: sole default proof and final authority classification.
- `next_action_or_stop_reason`: queue exactly one fixed-scope job and poll only
  that identifier to terminal; stop without retry regardless of disposition.

## Final Checkpoint | Complete Authority Withheld

- `plan_version`: 2
- `state_transition`: `INSTALLED` -> `PROOF_SETTLED` ->
  `COMPLETE_AUTHORITY_WITHHELD`.
- `progress_classification`: accepted_completion
- `evidence`: sole job `hmj_f4b10eef7bca43228144c0acfa8eac92`
  settled `skipped` without retry. Its request was `chatgpt/default`, exact
  configured identity, reconciliation, artifacts+files, `maxItems=1`, no
  snapshot refresh, and no force. Exact result metrics are conversations 0,
  eligible 0, selected 0, materialized 0, skipped 0, failed 0, and duplicate
  aliases 0. No provider session opened. `/status` independently preserves
  explicit 0/0 candidate counts on the existing default completion outcome;
  the direct proof did not and was not authorized to move that completion's
  cursor. Final readback shows scheduler and six completions paused, default
  completion at pass 4, queued/running work 0/0, active history jobs 0, null
  default guard, duplicate same-route attempts 0, and healthy PID `3892` with
  zero restarts.
- `subagent_status`: `not_spawned`; all proof and final judgment are
  primary-agent evidence.
- `budget_consumption`: CodeGraph 21/24; source 6/6; red/green 2/2; review
  rework 0/1; builds 1/1; installs 1/1; live jobs 1/1; retries 0/0; provider
  prompts 0/0; completion actions 0/0; scheduler actions 0/0; guard actions
  0/0.
- `remaining_criteria`: none inside Plan 0190.
- `next_action_or_stop_reason`: terminal stop. Candidate counts were explicit
  but not positive, so the proof rejects unattended live-follow authority.
  Any further live action requires a new explicit operator decision and a new
  bounded plan.
