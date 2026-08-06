# Archive Availability Metadata Normalization | 0196-2026-08-05

State: OPEN
Lane: IMPLEMENTATION
Plan version: 1
Outcome: PENDING
Goal execution state: AWAITING_INSTALL_GATE

## Stable Goal Objective

Make archive metadata self-consistent after successful file hydration: clear
stale unavailable evidence, preserve stable pre-hydration filtering, validate
source and installed behavior provider-free, and keep all scheduler,
completion, browser, provider, and materialization controls paused.

This is the stable `/goal` contract. Material changes require a new plan
version or bounded successor rather than silent scope expansion.

## Current State

- Plan 0195 is closed and installed at commit `5618e674`. Stable archive list
  filters now apply before filesystem hydration, so unrelated paths cannot
  poison filtered provider-free reads.
- The repaired transcript archive row currently has authoritative
  `fileAvailable=true`, an asset link, size 20,016, and SHA-256
  `af15c06cb7aca655c224b47a9f6d443a8b97fb30578bd1ae52ae9f3f6748370a`.
- Its nested metadata remains contradictory: `unavailableReason` is
  `local-file-missing`, `missingLocalPath` points to the now-readable file, and
  `materialization` still records the refresh-owned unavailable object.
- CodeGraph localizes the cause to `enrichFileMetadata()`: successful hydration
  spreads the prior metadata before adding current availability fields, but it
  never removes refresh-owned unavailable evidence. `fileMetadataChanged()`
  already compares all three stale fields and can persist their removal.
- Installed API PID 57927 is healthy with zero crash restarts. Scheduler and all
  six completions remain paused; active history-materialization jobs are zero.

## Authority And Ownership

- This turn authorizes planning, goal creation, plan wiring, audit, commit, and
  push only. It does not authorize source, test, installed-runtime, service, or
  durable archive mutation.
- A later explicit `ok go` against this reviewed plan authorizes the bounded
  packets below, including one provider-free build/install/restart cycle. It
  never authorizes provider/browser work, a durable job, or control mutation.
- Critical-path owner: primary agent. The work is serialized because the test,
  source helper, archive refresh, and installed proof share one invariant.
  `subagent_status=not_spawned`; delegation was not requested and no independent
  lane should outrun the source contract.

## Metadata Invariant

For an archive upload or generated artifact after hydration:

1. `fileAvailable=true` requires a readable regular file, current checksum,
   size, cache key, and asset link.
2. When item availability is true, refresh-owned unavailable evidence must be
   absent from metadata:
   - `unavailableReason`
   - `missingLocalPath`
   - `materialization` only when it is the object
     `{status: unavailable, source: archive-read-refresh, ...}`
3. Successful materialization provenance from another owner must be preserved.
   Do not delete string or object metadata that describes a cached attachment,
   provider manifest, history job, or other successful origin.
4. When a path is still missing, current unavailable evidence and the
   refresh-owned unavailable object remain required.
5. Top-level availability and nested metadata must not disagree after the
   indexed item is written back.

## Work Units And Dependencies

### Packet A | Contract And Deterministic Red Proof

- Extend `tests/runtime.archiveService.test.ts` with a prior-unavailable upload
  whose file becomes readable before the archive read.
- Require the refreshed row and persisted index item to retain current
  checksum/size/link fields while omitting only the three refresh-owned stale
  unavailable fields.
- Add an adjacent assertion that a still-missing file retains unavailable
  evidence, plus a preservation assertion for non-refresh materialization
  provenance.
- Keep Plan 0195's unrelated-path single/batch regression green.
- Terminal transition: `ACTIVE_SOURCE -> AWAITING_REVIEW` only after the new
  assertion is red for the expected stale-field reason.

### Packet B | Minimal Source Repair And Provider-Free Validation

- Change only `src/runtime/archiveService.ts`.
- Introduce one narrowly named metadata-normalization helper used by
  `enrichFileMetadata()` when `fileAvailable === true`.
- Remove only refresh-owned unavailable keys; preserve unknown metadata and
  successful provenance. Do not broaden filesystem error handling, filtering,
  path aliasing, or archive schema.
- Validate the focused archive suite, search projection, history
  materialization, typecheck, scoped lint, diff hygiene, and full provider-free
  suite. Run the sole production build after source acceptance.
- Commit and push the source/docs checkpoint before installed mutation.
- Terminal transition: `AWAITING_REVIEW -> AWAITING_INSTALL_GATE` only when the
  deterministic contract is green and no unrelated behavior changes.

### Packet C | Installed Readback And Closeout

- Reconfirm API health, paused scheduler/completions, zero active history jobs,
  clear provider guard, and source/remote parity.
- Install the accepted build once and restart the user API service once.
- Use one filtered provider-free archive read for the known row; allow normal
  archive hydration to persist normalization. Do not directly edit runtime JSON.
- Read back the archive row, search projection, and recovery planner. Require
  current availability/checksum/size/link, absence of refresh-owned stale
  unavailable metadata, and no regression in recovery counts.
- Reconfirm every pause and zero provider callbacks/jobs/actions, close the plan,
  audit, commit, push, and record one compact Graphiti memory if the outcome is
  durable.
- Terminal transition: `AWAITING_INSTALL_GATE -> COMPLETE` only when every
  acceptance criterion has current installed evidence.

## Parallel And Integration Design

- Critical path is fully serialized: Packet A -> Packet B -> source checkpoint
  -> Packet C -> closeout.
- No parallel source lane is justified. Documentation can be updated alongside
  validation only after the source contract is stable, but it joins before the
  source checkpoint commit.
- No subagent or nested-agent work is planned. If independent review later
  becomes necessary, it requires explicit delegation authority and is bounded
  to one findings pass plus one remediation pass.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 3`;
  `max_work_unit_attempts: 1`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 1`; `checkpoint_interval: 1 packet`.
- `max_codegraph_calls: 4`; `max_source_files: 1`; `max_test_files: 1`;
  `max_red_green_cycles: 1`; `max_builds: 1`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_duration_minutes: 45`.
- `max_provider_calls: 0`; `max_browser_actions: 0`; `max_live_jobs: 0`;
  `max_completion_actions: 0`; `max_scheduler_actions: 0`;
  `max_guard_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_retries: 0`.
- Checkpoint fields: `plan_version`, `checkpoint_id`, `state_transition`,
  `progress_classification`, `owned_changes`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## Goal State Machine

1. `READY -> AWAITING_GATE` when this planning packet is audited and pushed.
2. `AWAITING_GATE -> ACTIVE_SOURCE` only after explicit implementation authority.
3. `ACTIVE_SOURCE -> AWAITING_REVIEW` after the deterministic red proof.
4. `AWAITING_REVIEW -> AWAITING_INSTALL_GATE` after source green, full
   provider-free validation, build, and pushed source checkpoint.
5. `AWAITING_INSTALL_GATE -> COMPLETE` after the bounded install/readback and
   closeout evidence.
6. Any failed invariant, unexpected metadata loss, provider/browser contact,
   job creation, lost pause, unexpected runtime write, dirty-worktree conflict,
   or budget breach transitions to `BLOCKED` or `FAILED` with the exact stop
   reason. It does not start a retry loop.
7. User cancellation transitions any nonterminal state to `CANCELLED`.

## Acceptance Criteria

- [x] A deterministic test proves the prior contradictory metadata and goes
  green only when successful hydration removes refresh-owned stale evidence.
- [x] Still-missing evidence and non-refresh successful provenance remain
  unchanged; Plan 0195's pre-hydration scoping regression remains green.
- [x] Focused suites, typecheck, scoped lint, diff hygiene, full suite, and the
  sole build pass with one-source/one-test scope preserved.
- [x] Source is committed/pushed before one bounded install/restart.
- [ ] Installed filtered readback normalizes the known row without direct JSON
  editing, provider callbacks, durable jobs, or control actions.
- [ ] API health, recovery planning, scheduler/completion pauses, zero active
  history jobs, docs, plan audit, clean worktree, and remote parity are current.

## Hard Stops And Non-Goals

- Do not reinterpret historical provider-manifest evidence as refresh-owned
  state without a separately reviewed contract.
- Do not clear all `materialization` metadata unconditionally; preserve
  successful provenance and durable job evidence.
- Do not generalize path aliasing, mount handling, filesystem error policy,
  archive backfill, or account-mirror selection in this goal.
- Do not directly rewrite the archive index. Installed proof must exercise the
  normal hydration/write-through path.
- Do not start a provider/browser call, history/archive materialization job,
  completion, scheduler, guard, snapshot refresh, or retry.

## Definition Of Done

The installed known row is simultaneously available and free of refresh-owned
unavailable evidence, missing rows remain truthful, successful provenance is
preserved, provider-free recovery remains healthy, every operational pause is
unchanged, and all six acceptance criteria have current evidence.

## Checkpoint 1 | Goal Planned

- `plan_version`: 1
- `checkpoint_id`: `P0196-C01`
- `state_transition`: READY -> AWAITING_GATE.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0196 plus roadmap/runbook/journal wiring only.
- `evidence`: clean synchronized `5618e674`; installed API PID 57927 healthy;
  known row available with current checksum/size/link but stale refresh-owned
  unavailable metadata; CodeGraph localizes the repair to
  `enrichFileMetadata()` and confirms `fileMetadataChanged()` already observes
  the affected keys.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: goal created; planning packet 1/1; CodeGraph 2/4;
  source/test/red-green/build/install/restart/provider/live/control actions 0.
- `remaining_criteria`: all six acceptance items.
- `next_action_or_stop_reason`: audit and push the planning packet, then remain
  at `AWAITING_GATE` until explicit implementation authority.

## Checkpoint 2 | Deterministic Red Proof

- `plan_version`: 1
- `checkpoint_id`: `P0196-C02`
- `state_transition`: AWAITING_GATE -> ACTIVE_SOURCE -> AWAITING_REVIEW.
- `progress_classification`: blocker_reduction
- `owned_changes`: one deterministic archive-service regression fixture; no
  source behavior was changed before the red proof.
- `evidence`: the focused regression failed once at the recovered upload's
  stale `unavailableReason=local-file-missing`, while the fixture also binds a
  still-missing upload and non-refresh successful materialization provenance.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: implementation packets 1/3; CodeGraph 3/4; test files
  1/1; red-green cycles 1/1 red phase; source/build/install/restart/provider/
  browser/job/control actions 0.
- `remaining_criteria`: source repair, green/full validation, source
  checkpoint, installed readback, and closeout.
- `next_action_or_stop_reason`: apply the one-helper source repair and run the
  single green phase plus provider-free validation.

## Checkpoint 3 | Source Accepted

- `plan_version`: 1
- `checkpoint_id`: `P0196-C03`
- `state_transition`: AWAITING_REVIEW -> AWAITING_INSTALL_GATE.
- `progress_classification`: acceptance_progress
- `owned_changes`: one normalization helper in `archiveService`, one extended
  archive-service fixture, and the required plan/operator documentation.
- `evidence`: expected red once; focused green once; archive 8/8;
  projection/history 23/23; typecheck and scoped Biome lint pass after one
  fixture-only nullability review correction; serialized full suite 304 files
  and 2,716 tests passed with 21 files/65 tests skipped; diff hygiene and the
  sole production build pass; source/docs checkpoint committed and pushed
  before installed mutation.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: implementation packets 2/3; CodeGraph 3/4; source/test
  files 1/1 each; red-green 1/1 complete; review rework 1/1; build 1/1;
  install/restart/provider/browser/job/control actions 0.
- `remaining_criteria`: installed filtered normalization readback, recovery and
  search readback, pause/job/API verification, closeout audit, and remote parity.
- `next_action_or_stop_reason`: revalidate the runtime gate, then perform the
  sole install/restart and provider-free installed proof.
