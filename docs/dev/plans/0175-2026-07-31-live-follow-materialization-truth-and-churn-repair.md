# Live-Follow Materialization Truth And Churn Repair | 0175-2026-07-31

State: OPEN
Lane: P01
Plan version: 1

## Goal

Repair the provider-free algorithms that let failed asset materialization look
like a benign skip and determine whether false identity drift or repeated
terminal selection is causing avoidable live browser churn before live-follow
can be considered for a bounded resume.

## Current State

- The scheduler and all four ChatGPT completion lanes are operator-paused.
- Persisted job `hmj_acbb3da47a0f45afae1bf9255c29e95c` records six failed
  transfers and one skip while both the job and result are classified
  `skipped`.
- A provider-free public-service regression reproduces the contradiction: a
  reconciliation result with one failed transfer becomes a skipped job.
- Existing serialization, provider-guard propagation, and process-memory
  containment tests are green; this plan does not reopen those controls.

## Scope

- Derive reconciliation and phase status from aggregate materialization
  metrics through the canonical result-status resolver.
- Audit every sibling aggregate in the history materialization service for the
  same failure-erasure pattern and cover any repaired seam provider-free.
- Test whether qualified ChatGPT service-account bindings correctly match the
  same detected email identity without weakening tenant qualifiers.
- Test whether failed or terminal asset-family evidence can be selected again
  by later reconciliation passes and repair only confirmed replay paths.
- Update operator-facing status documentation with the verified resume gate.

## Non-Goals

- No live provider pass, browser replay, guard clearance, or completion resume.
- No interaction-budget increase, cooldown reduction, or retry-policy bypass.
- No broad browser adapter rewrite without a deterministic failing seam.
- No reclassification of provider-side HTTP 403 responses as successful
  materialization.

## Acceptance Criteria

- [x] A deterministic persisted-state check proves the historical
  failed-as-skipped contradiction twice.
- [x] A public-service regression is red for all-failed reconciliation.
- [x] Reconciliation job, result, and materialization-phase statuses are
  `failed` when no asset materializes and at least one transfer fails.
- [x] Sibling history-materialization aggregates preserve the same canonical
  status semantics, with focused regression coverage where affected.
- [x] ChatGPT identity matching either proves the historical drift legitimate
  or gains a provider-free regression and bounded normalization repair.
- [x] Terminal/failed asset-family replay is either ruled out by tests or
  repaired with a provider-free regression.
- [x] Focused and adjacent tests, typecheck, production build, scoped lint,
  plan audit, and diff hygiene pass.
- [ ] Installed/runtime state is audited without resuming provider work; any
  later live proof remains a separately gated bounded action.

## Hard Bounds And Stop Conditions

- Maximum implementation attempts per confirmed defect: 2.
- Maximum review/rework cycles: 1.
- Do not resume the scheduler or any completion lane in this plan.
- Do not issue direct browser-provider commands for validation.
- Stop implementation expansion when a suspected defect cannot be reproduced
  through persisted evidence or a provider-free test.

## Definition Of Done

The plan closes only when confirmed materialization truth/replay defects are
provider-free green, repository validation passes, documentation reflects the
safe operational state, and the installed runtime remains paused with no live
provider work triggered.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: diagnosis -> implementation
- `progress_classification`: substantive
- `evidence`: persisted job `hmj_acbb3da47a0f45afae1bf9255c29e95c`
  fails the failed-result invariant twice; the new public-service regression
  receives `failed=1` but persists result/job status `skipped`.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: repair the canonical reconciliation aggregate
  status seam, turn the regression green, then test the next ranked
  hypotheses without live provider traffic.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: implementation -> validated-install-wait
- `progress_classification`: substantive
- `evidence`: provider-free public-seam regressions now cover failed ordinary
  reconciliation, project-source, account-library reconciliation, and the
  live-follow all-failed stop. Focused suites pass 142/142; typecheck,
  production build, scoped Biome, full lint with 203 existing warnings, the
  175-plan audit with zero errors, and diff hygiene pass.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: commit and push the validated slice, install
  only while scheduler and every completion remain operator-paused, then
  verify byte identity and paused runtime readback without a provider pass.
