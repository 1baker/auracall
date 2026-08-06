# Archive Terminal Identity Admission And Provider-Free Reselection | 0199-2026-08-06

State: OPEN
Lane: IMPLEMENTATION
Plan version: 1
Outcome: PENDING
Goal execution state: AWAITING_INSTALL
Gate state: NOT_READY_DUPLICATE_ASSET_SELECTION

## Stable Goal Objective

Canonicalize bound-identity admission for readable archive asset-family
evidence, prove the repair provider-free in source and installed runtime, and
rerun exact `chatgpt/default` `maxItems=1` selection with all provider-capable
callbacks disabled. Reassess the existing one-canary gate without creating or
running a durable materialization job and without resuming any scheduler or
completion.

## Current State

- Plan 0198 installed explicit canvas-family canonicalization and provider-free
  reselection now suppresses the already-readable Plan 0193 canvas.
- The exact next catalog asset is `Generated image`, artifact ID
  `2af065f6-0a6e-43ea-a0fb-1d79e8a5e675:image:file-service://file-SZiAKACzbxAnLLpvjh2VUr`,
  in conversation `67ccf9d7-9310-8004-b5e1-478dba6eab3a`.
- Durable archive evidence records that same artifact as a readable
  1,245,306-byte file with SHA-256
  `2ccf18dca7d0dcbf703842806f54725591e8663293fa85e194ef4a8e7537d76b`.
- `materializedArchiveAssetFamilySignatures()` compares a requested plain
  identity to the archive item's composite service-account identity with raw
  string equality. The catalog path already uses
  `accountMirrorIdentityKeysMatch()`, so the same tenant is admitted by one
  path and rejected by the other.
- Source and installed runtime are synchronized at `45558077`. API PID 811 is
  healthy with zero crash restarts. Scheduler and all six completions are
  paused; default pass count is 4; foreground, queued/running completions, and
  active history-materialization jobs are zero.

## Authority And Ownership

- The operator's `ok go` authorizes this bounded provider-free successor:
  plan/docs, one deterministic red/green repair, provider-free validation, one
  build, one user-runtime install and API restart for installed parity, and at
  most two in-memory reselection simulations with provider-capable callbacks
  disabled.
- It does not authorize a durable history-materialization job, provider or
  browser work, asset materialization, snapshot refresh, force, retry,
  scheduler/completion/guard action, or canary execution.
- Critical-path owner: primary agent. Work is serialized because the archive
  admission contract, installed bundle, and current-cache simulation share one
  invariant. `subagent_status=not_spawned`.
- The repo policy selector reports the mature local policy set already aligned;
  no policy adoption or migration change belongs to this packet.

## Canonical Admission Contract

1. When a request carries a bound identity, a readable archive asset is
   admitted only when both identities are present, provider-comparable, and
   canonically equal under `accountMirrorIdentityKeysMatch()`.
2. A plain identity and the same provider tenant's qualified
   `service-account:<provider>:...` identity match without weakening provider,
   runtime-profile, or availability filters.
3. Conflicting, missing, malformed, provider-unknown, or incomparable archive
   identity evidence remains excluded.
4. Historical materialization jobs, account-library-specific archive
   admission, asset-family parsing, selection order, and item ceilings remain
   unchanged in this packet.

## Work Units And Dependencies

### Packet A | Deterministic Red Proof

- Update the existing archived-family regression so its readable ChatGPT
  archive item stores a composite service-account identity while the request
  uses the same tenant's plain identity.
- Require the existing `artifact:download:recovered guide` exclusion and
  current candidate order to remain unchanged.
- Run only that focused test before source repair and require the exclusion to
  disappear under the old raw-equality behavior.

### Packet B | Minimal Repair And Validation

- Change only `src/runtime/historyMaterializationService.ts` by replacing raw
  archive identity equality at `materializedArchiveAssetFamilySignatures()`
  with the existing positive provider-aware matcher.
- Keep missing/provider-unknown identity evidence fail-closed.
- Run the focused regression, full history-materialization suite, documented
  adjacent provider-free suites, typecheck, scoped lint, diff hygiene, full
  serialized tests, plan audit, and one production build.
- Update operator/testing docs and push the accepted source before installed
  mutation.

### Packet C | Installed Reselection And Gate Adjudication

- Reconfirm paused posture and zero active work, install the accepted build
  once, and restart only the user API service once.
- Require source/installed history-materialization bundle hash parity.
- Seed an in-memory job store from persisted history and run broad
  `chatgpt/default` artifacts+files `maxItems=1` with every provider-capable
  callback throwing `PROVIDER_CALLBACK_DISABLED:<name>`.
- If broad selection reaches one target, bind its first post-exclusion asset
  with one exact catalog-item in-memory simulation. If no candidate remains or
  another duplicate/mismatch appears, record that terminal outcome rather than
  substituting another route.
- Freeze a canary request only if current catalog/archive/job/file evidence
  proves the exact selected asset is non-local and non-terminal. Do not run it.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 3`;
  `max_codegraph_calls: 10`; `max_source_files: 1`; `max_test_files: 1`;
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
   provider-free validation, one build, and pushed source checkpoint.
4. `AWAITING_INSTALL -> AWAITING_CANARY_APPROVAL` only if installed parity and
   fresh simulations resolve one exact non-local, non-terminal asset.
5. `AWAITING_INSTALL -> COMPLETE_CANARY_WITHHELD` if no safe candidate remains
   or another fail-closed selection condition is proved.
6. Provider/browser contact, durable job creation, materialization, lost pause,
   active work, identity ambiguity, or a budget breach transitions to
   `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [x] The deterministic composite-archive/plain-request fixture fails before
  repair for the missing archived-family exclusion and passes afterward.
- [x] Conflicting, missing, malformed, and provider-unknown archive identity
  evidence remains fail-closed; existing catalog matching stays green.
- [x] Focused/adjacent/full provider-free validation, typecheck, scoped lint,
  diff hygiene, plan audit, and one production build pass.
- [ ] Pushed source and installed runtime have exact parity after one bounded
  install/restart.
- [ ] Fresh `maxItems=1` simulation suppresses the already-readable Generated
  image before the item ceiling and invokes zero provider implementations.
- [ ] The exact post-repair selection is adjudicated against current
  catalog/archive/job/file evidence and the canary gate is truthfully ready or
  withheld; no canary runs.
- [ ] Scheduler and six completions remain paused; active work/jobs remain
  zero; docs, plan audit, clean worktree, and remote parity are current.

## Hard Stops And Non-Goals

- Do not admit missing or incomparable identity evidence merely because an
  archive file is readable.
- Do not change historical job admission, account-library admission, family
  parsing, or selection order inside this packet.
- Do not skip a newly selected duplicate ad hoc; stop and report the next exact
  mismatch if the repair exposes one.
- Do not create or run the one-canary job under this plan.
- Do not resume or start the scheduler, a policy completion, or any other
  materialization loop.

## Definition Of Done

Readable archive terminal evidence uses provider-aware positive identity
matching, the already-readable Generated image is suppressed before
`maxItems=1`, the fresh exact next selection is adjudicated provider-free, the
one-canary gate is truthful but unconsumed, and all runtime pauses remain
intact.

## Checkpoint 1 | Successor Active

- `plan_version`: 1
- `checkpoint_id`: `P0199-C01`
- `state_transition`: READY -> ACTIVE_SOURCE.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0199 and governing-doc wiring before source edits.
- `evidence`: clean synchronized `45558077`; CodeGraph healthy at 875 files /
  16,499 nodes / 55,868 edges and localizes raw identity equality to
  `materializedArchiveAssetFamilySignatures()`, while the existing positive
  matcher is `accountMirrorIdentityKeysMatch()`. Direct runtime readback shows
  API PID 811 healthy, scheduler and six completions paused, default pass 4,
  zero active work/jobs, and governed fingerprint
  `b4c9f41ac6bbb75e60c8e7132555fd02a3284e795125e747a9182137b34bb1f6`.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: planning packet 1/1; source/test/red-green/build/
  install/restart/simulation/provider/live/control actions 0.
- `remaining_criteria`: all seven acceptance items.
- `next_action_or_stop_reason`: change only the existing archive-family fixture
  to composite identity and establish the single expected red proof.

## Checkpoint 2 | Deterministic Red Proof

- `plan_version`: 1
- `checkpoint_id`: `P0199-C02`
- `state_transition`: ACTIVE_SOURCE -> AWAITING_REVIEW.
- `progress_classification`: blocker_reduction
- `owned_changes`: one composite archive identity adjustment in the existing
  archived-family regression; no source behavior changed before the red proof.
- `evidence`: the focused test failed once because the first archive-backed
  materialization call had no provider-work context; raw identity equality
  skipped the readable archive row, so
  `artifact:download:recovered guide` was absent.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 1/3; test files 1/1; red-green 1/1 red phase;
  source/build/install/restart/simulation/provider/live/control actions 0.
- `remaining_criteria`: minimal matcher repair, fail-closed green coverage,
  broader validation, installed parity, fresh reselection, gate adjudication,
  and closeout.
- `next_action_or_stop_reason`: replace only raw readable-archive identity
  equality with positive provider-aware matching and run the bounded green
  proof.

## Checkpoint 3 | Source Green And Awaiting Install

- `plan_version`: 1
- `checkpoint_id`: `P0199-C03`
- `state_transition`: AWAITING_REVIEW -> AWAITING_INSTALL.
- `progress_classification`: blocker_reduction
- `owned_changes`: one archive-family admission repair, one existing regression
  fixture, and synchronized plan/operator/testing/fix-log documentation.
- `evidence`: focused green 1/1; adjacent provider-free packet 314/314;
  `pnpm run check`, scoped Biome lint, and diff hygiene pass; serialized full
  suite passes 304 files / 2,716 tests with 21 files / 65 opt-in live tests
  skipped; the sole production build passes. Existing tenant-binding coverage
  preserves conflicting, missing, malformed, and incomparable fail-closed
  outcomes, while the new guard also rejects unknown archive providers.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 2/3; source files 1/1; test files 1/1;
  red-green 1/1; builds 1/1; installs/restarts/simulations/provider/live/control
  actions 0.
- `remaining_criteria`: pushed source checkpoint, installed hash parity, at
  most two provider-disabled simulations, exact asset adjudication, preserved
  paused runtime, and closeout.
- `next_action_or_stop_reason`: audit and push the accepted source checkpoint,
  reconfirm quiescence, then perform the sole no-build install/API restart.
