# Terminal Asset-Family Canonicalization And Provider-Free Reselection | 0198-2026-08-06

State: CLOSED
Lane: IMPLEMENTATION
Plan version: 1
Outcome: COMPLETE_PROVIDER_FREE_CANARY_WITHHELD
Goal execution state: COMPLETE_CANARY_WITHHELD
Gate state: NOT_READY_DUPLICATE_ASSET_SELECTION

## Stable Goal Objective

Canonicalize persisted terminal canvas identity at the history-materialization
family boundary, prove the repair provider-free in source and installed
runtime, and rerun the exact `chatgpt/default` `maxItems=1` selection with all
provider callbacks disabled. Adjudicate the existing one-canary gate without
creating or running a durable materialization job and without resuming any
scheduler or completion.

## Current State

- Plan 0197 proved that broad `maxItems=1` selects conversation
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a` and then the already-readable canvas
  `canvas:67ccf9fbca7c81918873702a1d607c72`.
- Persisted Plan 0193 history evidence records that exact asset with
  `providerId=canvas:67ccf9fbca7c81918873702a1d607c72`, title
  `Che4470 Exam Guide`, 3,362 bytes, and SHA-256
  `514d0ddc7425970fbc48bd3c9a84a7fc4234a0a1ebfa836f8b6f77795d37fe2d`.
- `historyEntryAssetFamilySignatures()` derives sources through
  `readAssetFamilySourceFromId()`. That helper does not recognize the explicit
  `canvas:` namespace, so terminal evidence emits `artifact:unknown:che4470
  exam guide` while current catalog evidence emits `artifact:canvas:che4470
  exam guide`.
- API PID 1212 is healthy with zero crash restarts. Scheduler and all six
  completions are paused; active history-materialization jobs are zero.

## Authority And Ownership

- The operator's `ok go` authorizes this bounded provider-free successor:
  plan/docs, one deterministic red/green repair, validation, one build, one
  user-runtime install/restart for exact installed parity, and two in-memory
  reselection simulations with provider-capable callbacks disabled.
- It does not authorize a durable history-materialization job, provider or
  browser work, asset materialization, snapshot refresh, scheduler/completion/
  guard action, force, retry, or unattended continuation.
- Critical-path owner: primary agent. Work is serialized because the terminal
  identity contract, installed parity, and current-cache simulation share one
  invariant. `subagent_status=not_spawned`.

## Canonicalization Contract

1. A persisted provider asset ID whose colon-delimited namespace contains
   `canvas` has canonical family source `canvas`.
2. Existing source aliases remain unchanged: download/download-dom,
   image/image-dom, deep-research, conversation, chatgpt-library, and account.
3. Unknown namespaces remain `unknown`; title normalization, asset kind,
   terminal-evidence qualification, tenant filtering, and selection order do
   not change.
4. A readable terminal canvas and the current catalog canvas with the same
   normalized title must produce the same family signature before `maxItems`
   is consumed.

## Work Units And Dependencies

### Packet A | Deterministic Red Proof

- Extend `tests/runtime.historyMaterializationService.test.ts` with a readable
  prior terminal canvas whose `providerId` is `canvas:<id>`.
- Require provider work context to contain
  `artifact:canvas:che4470 exam guide` alongside the existing download-family
  exclusion.
- Run the focused test once before source repair and require the expected
  missing-canvas-signature failure.

### Packet B | Minimal Repair And Validation

- Change only `src/runtime/historyMaterializationService.ts` by teaching the
  existing provider-ID source parser the explicit canvas namespace.
- Run the focused regression, the full history-materialization test file,
  typecheck, scoped lint, diff hygiene, the documented provider-free adjacent
  suites, full serialized tests, and one production build.
- Update operator/testing docs and checkpoint the accepted source before
  installed mutation.

### Packet C | Installed Reselection And Gate Adjudication

- Reconfirm paused posture and zero active work, install the accepted build
  once, and restart only the user API service once.
- Require source/installed runtime hash parity.
- Seed an in-memory job store from persisted history and run broad
  `chatgpt/default` `maxItems=1` with every provider-capable callback throwing
  `PROVIDER_CALLBACK_DISABLED:<name>`.
- If broad selection reaches one target, resolve its first post-exclusion
  asset and bind it with one exact catalog-item in-memory simulation. If no
  nonterminal candidate remains, record that terminal outcome rather than
  substituting another route.
- Freeze a canary request only if current catalog/archive/job evidence proves
  the exact selected asset is non-local and non-terminal. Do not run it.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 3`;
  `max_codegraph_calls: 12`; `max_source_files: 1`; `max_test_files: 1`;
  `max_red_green_cycles: 1`; `max_review_rework_cycles: 1`;
  `max_builds: 1`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_in_memory_simulations: 2`; `max_duration_minutes: 60`.
- `max_live_jobs: 0`; `max_provider_callbacks: 0`; `max_browser_actions: 0`;
  `max_materialized_assets: 0`; `max_snapshot_refreshes: 0`; `max_retries: 0`.
- `max_completion_actions: 0`; `max_scheduler_actions: 0`;
  `max_guard_actions: 0`; `max_config_writes: 0`;
  `max_direct_runtime_json_edits: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## Goal State Machine

1. `READY -> ACTIVE_SOURCE` under the operator's explicit successor authority.
2. `ACTIVE_SOURCE -> AWAITING_REVIEW` after the expected deterministic red.
3. `AWAITING_REVIEW -> AWAITING_INSTALL` after minimal source green, broader
   provider-free validation, build, and pushed source checkpoint.
4. `AWAITING_INSTALL -> AWAITING_CANARY_APPROVAL` only if installed parity and
   fresh simulations resolve one exact non-local, non-terminal asset.
5. `AWAITING_INSTALL -> COMPLETE_CANARY_WITHHELD` if no safe candidate remains
   or another fail-closed selection condition is proved.
6. Provider/browser contact, durable job creation, asset materialization, lost
   pause, active work, identity ambiguity, or a budget breach transitions to
   `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [x] The deterministic fixture fails before source repair for the missing
  `artifact:canvas:che4470 exam guide` signature and passes afterward.
- [x] Existing family aliases and fail-closed unknown behavior remain green.
- [x] Focused/adjacent/full provider-free validation, typecheck, scoped lint,
  diff hygiene, and one production build pass.
- [x] Pushed source and installed runtime have exact parity after one bounded
  install/restart.
- [x] Fresh `maxItems=1` simulation suppresses the Plan 0193 canvas before the
  item ceiling and invokes zero provider callbacks.
- [x] The exact post-repair selection is adjudicated against current
  catalog/archive/job evidence and the canary gate is truthfully ready or
  withheld; no canary runs.
- [x] Scheduler and six completions remain paused; active work/jobs remain
  zero; docs, plan audit, clean worktree, and remote parity are current.

## Hard Stops And Non-Goals

- Do not weaken tenant binding, terminal-evidence qualification, or file/media
  identity to make the canvas match.
- Do not skip a newly selected duplicate ad hoc; stop and report the next exact
  mismatch if the repair exposes one.
- Do not create or run the one-canary job under this plan.
- Do not resume or start the scheduler, a policy completion, or any other
  materialization loop.

## Definition Of Done

Source and installed terminal history recognize the explicit canvas namespace,
the already-readable Plan 0193 canvas is suppressed before `maxItems=1`, the
fresh exact next selection is adjudicated provider-free, the one-canary gate is
truthful but unconsumed, and all runtime pauses remain intact.

## Checkpoint 1 | Successor Active

- `plan_version`: 1
- `checkpoint_id`: `P0198-C01`
- `state_transition`: READY -> ACTIVE_SOURCE.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0198 and governing-doc wiring before source edits.
- `evidence`: clean synchronized `ac726eaf`; CodeGraph healthy at 875 files /
  16,491 nodes / 55,817 edges and localizes the mismatch to
  `readAssetFamilySourceFromId()` feeding
  `historyEntryAssetFamilySignatures()`. Direct persisted readback confirms the
  exact Plan 0193 terminal `providerId` begins `canvas:`.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: planning packet 1/1; source/test/red-green/build/
  install/restart/simulation/provider/live/control actions 0.
- `remaining_criteria`: all seven acceptance items.
- `next_action_or_stop_reason`: add the deterministic canvas-family fixture and
  establish the single expected red proof.

## Checkpoint 2 | Deterministic Red Proof

- `plan_version`: 1
- `checkpoint_id`: `P0198-C02`
- `state_transition`: ACTIVE_SOURCE -> AWAITING_REVIEW.
- `progress_classification`: blocker_reduction
- `owned_changes`: one terminal-canvas fixture in the existing history-
  materialization test file; no source behavior changed before the red proof.
- `evidence`: the focused test failed once because actual exclusions contained
  `artifact:unknown:che4470 exam guide` and omitted the required
  `artifact:canvas:che4470 exam guide`.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 1/3; test files 1/1; red-green 1/1 red phase;
  source/build/install/restart/simulation/provider/live/control actions 0.
- `remaining_criteria`: minimal repair, broader validation, installed parity,
  fresh reselection, gate adjudication, and closeout.
- `next_action_or_stop_reason`: add the single explicit canvas namespace branch
  and run the bounded green/integration proof.

## Checkpoint 3 | Source Accepted

- `plan_version`: 1
- `checkpoint_id`: `P0198-C03`
- `state_transition`: AWAITING_REVIEW -> AWAITING_INSTALL.
- `progress_classification`: acceptance_progress
- `owned_changes`: one source branch, one deterministic fixture, and required
  operator/testing documentation.
- `evidence`: focused green 1/1; history suite 73/73; adjacent provider-free
  suites 314/314; typecheck, scoped Biome lint, diff hygiene, and plan audit
  pass. The serialized full suite passes 304 files / 2,716 tests with 21 files /
  65 tests skipped; the sole production build passes.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 2/3; source/test 1/1 each; red-green 1/1;
  build 1/1; install/restart/simulation/provider/live/control actions 0.
- `remaining_criteria`: pushed source checkpoint, one installed-parity cycle,
  fresh exact simulation, gate adjudication, pause verification, and closeout.
- `next_action_or_stop_reason`: commit and push accepted source/docs, then
  re-read the runtime gate before the single install/restart.

## Checkpoint 4 | Installed Reselection Closed Fail-Closed

- `plan_version`: 1
- `checkpoint_id`: `P0198-C04`
- `state_transition`: AWAITING_INSTALL -> COMPLETE_CANARY_WITHHELD.
- `progress_classification`: blocker_reduction
- `owned_changes`: one installed-parity cycle, two provider-disabled in-memory
  simulations, exact archive/job/file adjudication, and closeout docs.
- `evidence`: source and installed history-materialization bundles share SHA-256
  `c8746acfdf3199d5361d0a71803baf55ed727b43a6cb9b32df6b4ba001efe871`.
  The broad simulation seeded all 1,862 persisted jobs and passed both
  `artifact:canvas:che4470 exam guide` and its legacy unknown alias to the
  disabled provider boundary, so the Plan 0193 canvas no longer consumes the
  asset ceiling. The exact simulation then selected artifact
  `2af065f6-0a6e-43ea-a0fb-1d79e8a5e675:image:file-service://file-SZiAKACzbxAnLLpvjh2VUr`,
  title `Generated image`, in conversation
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a`. Durable history and archive evidence
  show that same artifact already materialized as a readable 1,245,306-byte
  file with SHA-256
  `2ccf18dca7d0dcbf703842806f54725591e8663293fa85e194ef4a8e7537d76b`.
  Archive exclusion compares the plain request identity to the stored
  composite service-account identity as raw strings, while the older successful
  job has a null request identity; both terminal routes are therefore skipped.
  The governed-state fingerprint remained
  `b4c9f41ac6bbb75e60c8e7132555fd02a3284e795125e747a9182137b34bb1f6`
  before and after simulation.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 3/3; source/test/red-green/build/install/restart
  1/1 each; in-memory simulations 2/2; provider/browser/live jobs/materialized
  assets/snapshot refreshes/retries/control actions 0.
- `remaining_criteria`: none inside Plan 0198. A separately reviewed
  provider-free successor must canonicalize archive terminal admission before
  any canary can become ready.
- `next_action_or_stop_reason`: stop at
  `NOT_READY_DUPLICATE_ASSET_SELECTION`; do not skip the duplicate ad hoc, run
  a canary, resume the scheduler, or resume a completion.
