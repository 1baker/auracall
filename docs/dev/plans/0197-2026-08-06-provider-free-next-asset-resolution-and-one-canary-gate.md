# Provider-Free Next Asset Resolution And One-Canary Gate | 0197-2026-08-06

State: CLOSED
Lane: EVIDENCE_AND_GATE
Plan version: 1
Outcome: COMPLETE_PROVIDER_FREE_CANARY_WITHHELD
Gate state: NOT_READY_DUPLICATE_ASSET_SELECTION

## Stable Objective

Resolve the exact `chatgpt/default` conversation and asset that the current
history-materialization path would select under `maxItems=1`, using only cached
and persisted local evidence with every provider callback disabled. Prepare a
single-canary approval contract without creating a durable job, starting
materialization, or changing scheduler, completion, or guard controls.

## Current State

- Plans 0195 and 0196 are closed and installed. Provider-free recovery reports
  62 remote-known missing-local assets: 14 retrievable and 48 account-library
  metadata-only.
- The provider-free `maxItems=0` funnel accounts for 31 conversations as 30
  `noSelectedAssetEvidence` rows and one eligible row held at `targetBudget`.
- API PID 1212 is active with zero crash restarts. The scheduler and all six
  retained completions are paused; queued/running completions and active
  history-materialization jobs are zero.
- Plan 0193 already materialized the canvas `Che4470 Exam Guide` as a readable
  3,362-byte local asset with SHA-256
  `514d0ddc7425970fbc48bd3c9a84a7fc4234a0a1ebfa836f8b6f77795d37fe2d`.
- What remained before this packet was the identity of the one selected
  conversation and first selected asset at `maxItems=1`, plus a bounded canary
  contract that would not imply scheduler or policy-completion authority.

## Authority And Ownership

- The operator authorizes this provider-free resolution packet and preparation
  of one approval gate. The packet may read installed status, catalog, archive,
  recovery, and persisted job evidence and may execute bounded in-memory
  simulations whose provider-facing dependencies fail closed.
- It does not authorize a durable history-materialization job, provider or
  browser work, snapshot refresh, materialization, install/restart, source or
  config changes, scheduler/completion/guard actions, retry, or unattended
  continuation.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; delegation
  was not requested, and the evidence path is serialized.
- Expected repo writes: this plan, `ROADMAP.md`, `RUNBOOK.md`,
  `docs/dev/dev-journal.md`, and `docs/dev-fixes-log.md`. Expected runtime
  writes: zero.

## Provider-Free Resolution Contract

### Conversation selection

- Reuse the frozen Plan 0193 reconciliation request:
  `chatgpt/default`, bound identity `ecochran76@gmail.com`, artifacts+files,
  `maxItems=1`, `refreshSnapshot=false`, `force=false`, provider-work timeout
  300,000 ms.
- Seed an in-memory job store from the 1,862 persisted terminal/history records.
  The in-memory store must be the only job write surface.
- Replace every provider-capable dependency with a callback that throws
  `PROVIDER_CALLBACK_DISABLED:<name>`.
- The broad reconciliation simulation must stop at its first
  `materializeConversation` boundary and record the selected target before the
  callback throws.

### Asset selection

- Resolve the current first asset with the same ordering used by
  `materializeConversationArtifacts`: cached order, eligible filtering,
  terminal-family exclusion, ChatGPT family deduplication, then `maxItems=1`.
- Bind the result independently through an exact catalog-item in-memory
  simulation. The callback context must expose `selectedCatalogAsset`; it must
  throw before provider work.
- Compare the selected catalog asset with durable archive/job evidence. A
  readable or terminal local asset makes the canary gate not ready even if the
  broad conversation funnel reports one eligible target.

## Exact Resolved Target

- Provider / AuraCall runtime profile / browser profile:
  `chatgpt` / `default` / `default`.
- Bound tenant identity:
  `service-account:chatgpt:ecochran76@gmail.com|plan=team|structure=workspace`.
- Conversation ID: `67ccf9d7-9310-8004-b5e1-478dba6eab3a`.
- Conversation URL:
  `https://chatgpt.com/c/67ccf9d7-9310-8004-b5e1-478dba6eab3a`.
- Asset kind / catalog ID: artifact /
  `canvas:67ccf9fbca7c81918873702a1d607c72`.
- Asset title / URI: `Che4470 Exam Guide` /
  `chatgpt://canvas/67ccf9fbca7c81918873702a1d607c72`.
- Current local truth: already materialized and readable, 3,362 bytes, SHA-256
  `514d0ddc7425970fbc48bd3c9a84a7fc4234a0a1ebfa836f8b6f77795d37fe2d`.

## Selection Defect And Gate Decision

- The broad simulation selected the exact conversation once and reached the
  provider boundary once. Its terminal-family exclusions contain
  `artifact:unknown:che4470 exam guide`.
- The current catalog asset is typed `canvas`, so its current selection family
  is `artifact:canvas:che4470 exam guide`. The unequal family identities do not
  suppress the already-materialized asset before `maxItems=1` is spent.
- The exact catalog-item simulation independently bound the same conversation
  and canvas in `selectedCatalogAsset` and then failed intentionally at the
  disabled provider boundary.
- Therefore the exact next asset under current selection semantics is a known
  duplicate replay, not a safe missing-local canary. Candidate eligibility is
  not sufficient approval evidence.

## Prepared One-Canary Approval Gate

Gate state is `NOT_READY_DUPLICATE_ASSET_SELECTION`. No canary may run under
this packet. A future explicit approval is valid only after all of these
preconditions have current evidence:

1. A separately reviewed provider-free repair makes terminal/archive family
   identity suppress the already-readable canvas across broad reconciliation.
2. A fresh in-memory `maxItems=1` simulation resolves exactly one conversation
   and one non-local, non-terminal asset, with all provider callbacks disabled.
3. The exact asset is frozen by `catalogItemId` and `catalogKind`, and exact
   catalog/archive/job readback proves it is neither readable nor terminal.
4. API health, source/installed parity, paused scheduler, six paused
   completions, zero queued/running work, zero active history jobs, and a clear
   scoped provider guard are reconfirmed immediately before creation.
5. The operator explicitly approves the frozen request after reviewing the
   exact conversation and asset.

If those conditions are met, the only permissible live packet is one direct
history-materialization job with:

- the frozen provider, AuraCall runtime profile, bound identity,
  `catalogItemId`, `catalogKind`, and asset kind;
- `maxItems=1`, `refreshSnapshot=false`, `force=false`, provider-work timeout
  300,000 ms;
- no scheduler resume, no completion resume/start, no guard action, no second
  job, and no retry;
- a hard stop after the sole job reaches any terminal disposition, followed by
  exact archive/file/manifest/hash and paused-posture readback.

## Local Goal Bounds

- `max_codegraph_calls: 10`; `max_read_only_runtime_command_groups: 48`;
  `max_harness_launch_attempts: 3`; `max_in_memory_simulations: 2`;
  `max_review_rework_cycles: 1`;
  `max_duration_minutes: 45`.
- `max_live_jobs: 0`; `max_provider_callbacks: 0`; `max_browser_actions: 0`;
  `max_materialized_assets: 0`; `max_installs: 0`; `max_restarts: 0`;
  `max_builds: 0`; `max_retries: 0`.
- `max_completion_actions: 0`; `max_scheduler_actions: 0`;
  `max_guard_actions: 0`; `max_config_writes: 0`; `max_runtime_writes: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY -> CONVERSATION_RESOLVED` after the broad in-memory `maxItems=1`
   simulation reaches the disabled provider boundary with exactly one target.
2. `CONVERSATION_RESOLVED -> ASSET_RESOLVED` after current cached selection and
   the exact catalog-item simulation agree on one asset.
3. `ASSET_RESOLVED -> CANARY_WITHHELD` if archive/job evidence proves that asset
   is already readable or terminal.
4. `ASSET_RESOLVED -> AWAITING_CANARY_APPROVAL` only if the asset is non-local,
   non-terminal, exact, and every paused precondition is current.
5. `CANARY_WITHHELD -> COMPLETE` after docs, deterministic planning audit,
   scoped zero-write proof, and git checkpoint are current.
6. Any provider/browser contact, durable job, runtime write, lost pause, active
   work, guard, or identity mismatch transitions immediately to
   `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [x] Current recovery and paused runtime posture are read back provider-free.
- [x] One broad in-memory `maxItems=1` simulation resolves the exact next
  conversation and stops at the disabled provider boundary.
- [x] One exact catalog-item in-memory simulation binds the exact next asset and
  stops at the disabled provider boundary.
- [x] Durable archive/job evidence adjudicates whether the selected asset is a
  safe missing-local canary target.
- [x] The one-canary approval contract is explicit, bounded, and fail-closed;
  its current readiness state is truthful.
- [x] Scheduler and completions remain paused; no durable job, materialization,
  provider/browser work, install/restart, control action, retry, or runtime
  mutation occurs.
- [x] Plan, roadmap, runbook, journal, fixes log, planning audit, commit/push,
  clean worktree, and remote parity are current.

## Hard Stops And Non-Goals

- Do not reinterpret a selected conversation as proof that its first asset is
  missing locally.
- Do not approve or run the already-materialized canvas as a canary.
- Do not skip the duplicate and substitute a later asset ad hoc; selection
  semantics must be repaired and simulated again before exact approval.
- Do not resume the scheduler, start or resume a policy completion, create a
  durable materialization job, refresh the provider snapshot, open a browser,
  clear a guard, install/restart, force, or retry.
- Do not broaden this packet into account-library browser-detail recovery or
  unattended live-follow authority.

## Definition Of Done

The current exact conversation and asset are resolved with provider callbacks
disabled, the duplicate replay hazard is proven against durable local evidence,
one safe canary gate is specified but withheld, zero governed runtime mutation
is proved, and every scheduler/completion pause remains intact.

## Final Checkpoint | Provider-Free Resolution Complete

- `plan_version`: 1
- `checkpoint_id`: `P0197-C01`
- `state_transition`: READY -> CONVERSATION_RESOLVED -> ASSET_RESOLVED ->
  CANARY_WITHHELD -> COMPLETE.
- `progress_classification`: blocker_identified
- `owned_changes`: planning and operator documentation only; no source,
  installed-runtime, control, or provider state.
- `evidence`: CodeGraph is healthy at 875 files / 16,491 nodes / 55,817 edges.
  The broad in-memory simulation read 1,862 persisted jobs, selected conversation
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a`, reached the provider boundary once,
  and failed intentionally with `PROVIDER_CALLBACK_DISABLED`. The exact
  catalog-item simulation bound canvas
  `canvas:67ccf9fbca7c81918873702a1d607c72` in `selectedCatalogAsset` and stopped
  identically. Archive/job readback proves the canvas is already readable with
  the 3,362-byte/hash identity above.
- `evidence`: the governed config/scheduler/completion/catalog-database/archive/
  job fingerprint was identical before and after both simulations at SHA-256
  `602a49da1435826172f033a9923b4638ca1531983cac6c6610a6b432a101f14e`.
  API PID 1212 remains active with zero restarts; all six active completions are
  paused; queued/running completions and history jobs are zero; scheduler pause
  remains true.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 10/10; read-only runtime command groups charged
  conservatively at 30/48; harness launches 3/3 after the first stopped before
  runtime reads on an ESM/CJS loader mismatch; in-memory simulations 2/2; live
  jobs, provider callbacks, browser actions, materialized assets, installs,
  restarts, builds, retries, scheduler/completion/guard/config/runtime actions
  0/0.
- `remaining_criteria`: none for this provider-free planning packet. The canary
  remains unavailable until a separately reviewed identity repair and fresh
  simulation satisfy the prepared gate.
- `next_action_or_stop_reason`: terminal provider-free stop; do not create a
  canary or resume any control.
