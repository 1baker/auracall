# ChatGPT Reconciliation Candidate Funnel | 0191-2026-08-05

State: CLOSED
Lane: COMPLETE
Plan version: 1
Governing objective: explain the default-account 62-missing / 14-retrievable /
zero-eligible contradiction with a deterministic provider-free reconciliation
candidate funnel.

## Stable Objective

Extend reconciliation result metrics with an explicit conversation-unit
candidate funnel whose mutually exclusive exclusion counts account for every
catalog row before eligibility and every eligible row before selection. Keep
the existing asset-unit recovery inventory separate. Prove the current cached
default-account contradiction without provider work, then identify the exact
remaining semantic repair instead of weakening terminal evidence blindly.

## Current State

- Plan 0190 installed explicit `eligibleCandidates` and `selectedCandidates`.
  Its sole job reported 0/0 while status still reported 62 remote-known assets
  missing locally.
- Current provider-free recovery planning gives the missing asset denominator:
  30 artifacts plus 32 files; 6 artifacts plus 8 files are classified
  retrievable, while 24 artifacts plus 24 files are account-library
  metadata-only and require browser detail.
- Current cached catalog contains 31 conversations, 35 artifacts, and 33 files.
  No conversation carries terminal routeability evidence; five are routeable
  and 26 are unknown. One conversation carries 20 missing-local asset signals.
- The reconciliation selector separately excludes catalog rows by conversation
  evidence and asset-family history, but the result does not expose those
  reasons. Therefore 14 retrievable assets versus zero eligible conversations
  is a real cross-projection contradiction, not proof that all 62 assets are
  unactionable.

## Authority And Ownership

- The operator's 2026-08-05 `ok go` authorizes the recommended provider-free
  candidate-funnel repair and current-cache readback.
- It does not authorize install/restart, a new history-materialization job,
  provider/browser interaction, completion control, scheduler control, guard
  control, retry, force, or unattended live-follow.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; direct
  CodeGraph exploration is required and the user did not authorize delegation.
- Stable path and durable state: this repo, `ROADMAP.md`, `RUNBOOK.md`, and
  `docs/dev/dev-journal.md`; no snapshot or bundle is required.

## Contract

- Asset recovery remains an asset-unit projection. For the current default
  account it must continue to report `remoteKnownMissingLocal=62`,
  `retrievableMissingLocal=14`, and `unsupportedMetadataOnly=48`.
- Reconciliation adds a conversation-unit `candidateFunnel` with:
  - discovered catalog conversation rows;
  - mutually exclusive pre-eligibility exclusions by stable reason;
  - eligible candidates;
  - mutually exclusive post-eligibility exclusions by stable reason;
  - selected candidates.
- The arithmetic must be explicit:
  - discovered = pre-eligibility exclusions + eligible;
  - eligible = post-eligibility exclusions + selected.
- The funnel must not reinterpret asset counts as conversations, promise bytes,
  weaken persisted terminal-family evidence, or change selection order/budgets.

## Local Goal Bounds

- `max_codegraph_calls: 12`; nine discovery calls consumed before plan opening.
- `max_red_green_cycles: 2`; one public-result tracer bullet and at most one
  incremental invariant case.
- `max_source_files: 1`; keep the deep module inside
  `historyMaterializationService.ts`.
- `max_test_files: 1`; use the existing public service fixture.
- `max_review_rework_cycles: 1`; one consolidated review and one repair pass.
- `max_builds: 1`; `max_install_restarts: 0`; `max_live_jobs: 0`;
  `max_provider_interactions: 0`; `max_completion_actions: 0`;
  `max_scheduler_actions: 0`; `max_guard_actions: 0`; `max_retries: 0`.
- `max_duration_minutes: 60`; checkpoint after planning, red, green/current
  readback, and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `RED` when the public result fixture lacks the exclusive funnel.
2. `RED` -> `PROVIDER_FREE_GREEN` when the funnel passes arithmetic invariants
   without changing selection or disposition behavior.
3. `PROVIDER_FREE_GREEN` -> `CURRENT_CAUSE_IDENTIFIED` when a provider-free
   current-cache readback names the exact exclusion reason(s) behind 31 catalog
   conversations and zero eligibility.
4. `CURRENT_CAUSE_IDENTIFIED` -> `COMPLETE` after docs, validation, audits,
   commit/push, remote parity, and unchanged paused runtime readback.
5. If the funnel cannot account for either denominator, close terminally with
   the unclassified remainder; do not broaden the repair or run live work.

## Acceptance Criteria

- [x] A public-service red/green regression exposes the conversation-unit
  candidate funnel on reconciliation results.
- [x] Pre-eligibility and post-eligibility reason counts are mutually exclusive,
  deterministic, and satisfy both arithmetic invariants.
- [x] Existing eligible/selected counts, selection order, budgets, terminal
  exclusions, job status, and materialization dispositions remain unchanged.
- [x] A provider-free current-cache readback explains all 31 conversations and
  names why the 14 retrievable assets produce zero eligible conversations.
- [x] README/testing/fix log, roadmap/runbook/journal, full validation, plan
  audit, commit/push, remote parity, and paused-runtime preservation are current.

## Hard Stops And Non-Goals

- No install, live job, browser/provider call, completion/scheduler/guard
  action, force, retry, or terminal-evidence weakening.
- Do not collapse assets and conversations into one funnel or declare the 14
  retrievable assets downloadable without a routeable selected conversation.
- Stop after identifying the exact mismatch. Any behavioral eligibility repair
  requires a separately reviewed successor because it can reopen provider work.

## Definition Of Done

Close only when both units are explicit, the conversation funnel accounts for
the zero selection without changing behavior, and current cached evidence names
the next semantic gate. Provider-free observability completion does not grant
install or live authority.

## Outcome

- Broad reconciliation results expose the exclusive conversation-unit funnel.
  Existing candidate totals, order, budgets, terminal-family evidence, and
  dispositions are unchanged.
- Provider-free current-cache readback accounts for all 31 conversations as
  `identityMismatch`. The request uses a plain 20-character account identity;
  the cached catalog uses a 74-character composite account-binding identity.
  Exact comparison rejects the catalog entry before all asset-selection gates.
- The 14 retrievable missing-local assets are an asset-unit inventory, not zero.
  They currently have zero admitted conversation owners under the mismatched
  identity-key contract. Canonical matching or request-key propagation is a
  separately reviewed semantic successor.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0190 authority withheld -> operator `ok go` ->
  candidate-funnel repair ready.
- `progress_classification`: blocker_reduction
- `evidence`: recovery planning reports 62 missing = 14 retrievable + 48
  metadata-only; catalog reports 31 conversations / 35 artifacts / 33 files;
  Plan 0190 job reports eligible 0 / selected 0. CodeGraph localizes the
  selection and terminal-family gates to one deep module.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 9/12; red/green 0/2; source 0/1; tests 0/1;
  builds 0/1; forbidden runtime/live actions 0/0.
- `remaining_criteria`: all five acceptance items.
- `next_action_or_stop_reason`: wire and commit this plan, then add one failing
  public-result expectation before implementation.

## Checkpoint 2 | Provider-Free Complete

- `plan_version`: 1
- `state_transition`: RED -> PROVIDER_FREE_GREEN ->
  CURRENT_CAUSE_IDENTIFIED -> COMPLETE.
- `progress_classification`: blocker_removed
- `evidence`: the exact tracer passes at three eligible / two selected with one
  post-eligibility duplicate; the adjacent fixture passes with one complete,
  one terminal-family, and one eligible row. Current cached execution reports
  discovered 31, identity mismatch 31, eligible 0, selected 0, both arithmetic
  invariants true, provider calls 0, and runtime writes 0.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 11/12; red/green 1/2 plus one bounded
  incremental green invariant; source 1/1; tests 1/1; builds 1/1;
  install/live/control/retry actions 0/0.
- `remaining_criteria`: none for Plan 0191.
- `next_action_or_stop_reason`: terminal stop before identity semantics or any
  runtime/provider action; the next repair requires a separately reviewed plan.

## Validation Receipt

- Public tracer: one passed, 72 skipped; adjacent exclusion fixture: one passed,
  72 skipped; full touched file: 73 passed.
- Full suite: 303 files / 2,713 tests passed with one unrelated 15-second
  handoff CLI timeout; the exact timed-out test passed 1/1 isolated in 13.2
  seconds. Typecheck, scoped lint, diff hygiene, and the production build pass.
- Plan audit: 191 candidates, 0 validation errors.
- Installed-state readback: API healthy; scheduler paused; six completions
  paused; queued/running completions 0/0; active materialization jobs 0;
  `chatgpt/default` guard clear. No install or runtime mutation occurred.
