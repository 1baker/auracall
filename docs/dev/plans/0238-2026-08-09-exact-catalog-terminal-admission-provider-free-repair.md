# Exact Catalog Terminal Admission Provider-Free Repair | 0238-2026-08-09

State: CLOSED
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Outcome: COMPLETE_REPAIR_PROVIDER_ZERO_TEST_BROWSER_SIDE_EFFECT_CLEANED
Goal execution state: COMPLETE_PROVIDER_FREE
Gate state: LIVE_CANARY_EXCLUDED_PENDING_FRESH_NONTERMINAL_ASSET

## Stable Objective

Make exact history-materialization catalog-item admission agree with readable
archive and terminal-job evidence, lock the Plan 0237 mismatch down with a
deterministic regression, and rerun the real `maxItems=1` selector path with
every provider-capable callback disabled.

## Current State

- Plan 0237 closed at pushed commit `ae8e0140` after broad provider-free
  selection chose conversation `6a5e4bf8-972c-83ea-ad2f-3ad57f2a153f` and an
  exact simulation bound a DOCX that archive truth already proved readable.
- The exact `catalogItemId` path binds `selectedCatalogAsset` and immediately
  reaches `reconcileConversationTarget`; it does not currently apply the
  terminal-family check used by direct-conversation and broad reconciliation
  paths.
- Current installed API PID 8247 is healthy. The scheduler remains
  paused/idle, active/running history work is zero, wider ChatGPT completions
  remain paused at passes `7/2/34`, and `wsl-chrome-3` remains idle-waiting at
  pass 51.

## Authority And Non-Goals

- The operator's `ok go` authorizes the smallest source/test/docs repair and
  provider-free validation necessary to prevent an exact already-terminal
  catalog asset from crossing the provider boundary.
- Authorized writes: source, regression tests, this plan, journal, fixes log,
  and ordinary git commits/pushes after green validation.
- Excluded: runtime installation or restart, browser launch/attach/navigation,
  provider callback, durable history-materialization job, download,
  scheduler/completion/guard control, live canary, retry, and wider
  materialization.
- Critical-path owner: primary agent. Delegation was not requested and
  `subagent_status=not_spawned`.

## Diagnostic Contract

1. Add a focused service regression whose exact catalog artifact has a
   matching readable archive family and `force=false`.
2. Prove the current code calls `materializeConversation`, reproducing the
   exact unsafe admission.
3. Apply the smallest shared terminal-evidence check before the exact provider
   seam. Preserve `force=true` override semantics and account-library handling.
4. Prove the regression skips with no refresh/provider callback and retains a
   truthful terminal result.
5. Rerun the retained Plan 0237 broad and exact `maxItems=1` simulation in
   memory with all provider-capable callbacks disabled. The already-readable
   exact asset must no longer reach the disabled provider seam.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 slices`.
- `max_codegraph_calls: 4`; `max_provider_free_simulations: 2`;
  `max_source_files: 2`; `max_test_files: 1`.
- `provider_callbacks: 0`; `browser_effects: 0`; `durable_runtime_jobs: 0`;
  `scheduler_completion_guard_actions: 0`; `installs_restarts: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0` because this successor inherits the completed
  goal-level discovery pass;
  `review_verification_mode: closed_world`.
- `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`.
- `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`.
- `checkpoint_record_fields: plan_version, state_transition,
  progress_classification, evidence, subagent_status, next_action_or_stop_reason,
  authority_classification, review_disposition_summary`.

## Acceptance Criteria

- [x] A deterministic focused test fails on the current exact
  already-materialized catalog-item behavior and passes after the repair.
- [x] Exact `force=false` catalog artifacts/files skip when their selected
  family is terminal; `force=true` and non-terminal exact items retain current
  behavior.
- [x] Focused tests, typecheck, scoped lint, diff hygiene, and both plan audits
  pass.
- [x] The current retained provider-free simulation no longer admits the known
  readable DOCX to a provider callback.
- [x] Final durable runtime and scheduler/completion posture remain unchanged;
  the incidental broad-test managed-browser process is exactly cleaned.

## Opening Checkpoint | Provider-Free Repair Ready

- `checkpoint_id`: `P0238-C01`.
- `state_transition`: P0237_CLOSED_NOT_READY_ALREADY_MATERIALIZED_ASSET ->
  P0238_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: Plan 0237 exact archive proof; structural trace of the unguarded
  `catalogItemId` branch; current healthy paused runtime readback.
- `owned_changes`: this plan and journal entry only before the red regression.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit/push this bounded packet, then add and
  run the exact terminal-admission regression before editing production code.
- `authority_classification`: ordinary bounded successor under the approved
  provider-free objective; live effects remain excluded.
- `review_disposition_summary`: unguarded exact catalog admission is accepted
  as the blocking finding; alias/family breadth and archive scan limits remain
  hypotheses pending the focused test.

## Final Checkpoint | Exact Terminal Admission Closed

- `checkpoint_id`: `P0238-C02`.
- `state_transition`: P0238_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0238_CLOSED_PROVIDER_FREE_REPAIR_COMPLETE.
- `progress_classification`: blocker_reduction.
- `evidence`: the focused test failed red with archive lookup count zero, then
  passed for exact artifact and conversation-file families; the full service
  file passed 74/74; typecheck, scoped lint, production build, diff hygiene,
  and both plan audits passed.
- `provider_free_replay`: 1,884 retained jobs seeded in memory; broad
  `maxItems=1` selected the same Plan 0237 conversation and entered one
  disabled stub; the exact known DOCX settled skipped with provider-boundary
  count zero. A diagnostic attempt to clone the broad stub context function
  produced a harness-only serialization error after target capture; no
  provider implementation ran.
- `durable_state`: history job-index SHA-256 stayed byte-identical at
  `641836ac5c8c1293a94714334e0cae5e40c3996c6ca2950a78fb2ad932b41087`.
- `broad_validation`: 2,758 tests passed; two unrelated
  `llmServiceContext` tests failed under the wide concurrent run. Isolated
  rerun passed the pre-provider timeout case and retained only the known
  pending-payload-operation assertion; this is nonblocking baseline evidence,
  not part of the accepted finding.
- `test_side_effect`: final readback found exact managed-browser main PID 38900
  launched at 16:04:35 during the wide suite on port 45015. Browser registry
  evidence scoped the profile to AuraCall's prior history-materialization
  owner. The exact main PID was terminated once; final process and listener
  checks are empty. No navigation, provider implementation, or download was
  observed.
- `owned_changes`: one runtime source file, one regression test file,
  user/operator docs, plan, journal, and fixes log.
- `subagent_status`: not_spawned.
- `budget_consumption`: CodeGraph 4/4; provider-free simulations 2/2;
  provider implementation callbacks 0; durable jobs 0; intended browser
  effects 0; unexpected broad-test launches 1 and exact restorative closes 1;
  scheduler/completion/guard actions 0; installs/restarts 0.
- `remaining_criteria`: none for this provider-free repair. A live canary still
  requires a fresh provider-free selection that freezes a non-terminal exact
  asset; this plan grants no live authority.
- `next_action_or_stop_reason`: close, audit, commit, and push. Do not install
  or run a canary under this packet.
- `authority_classification`: the source repair and simulations stayed within
  the provider-free successor, but broad validation caused one unintended
  managed-browser launch outside the zero-browser bound. Exact cleanup restored
  the opening posture; the deviation is recorded rather than normalized away.
- `review_disposition_summary`: the unguarded exact branch was confirmed and
  fixed. Alias breadth remains a future selection concern only if the next
  provider-free pass cannot freeze a non-terminal exact item. Broad-test
  managed-browser isolation is recorded as `nonblocking_backlog`; it does not
  weaken the exact admission proof, but future provider-free broad validation
  must isolate AuraCall home or bracket exact PID/port state.
