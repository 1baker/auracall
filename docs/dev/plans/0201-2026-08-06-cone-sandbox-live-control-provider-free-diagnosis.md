# Cone Sandbox Live-Control Provider-Free Diagnosis | 0201-2026-08-06

State: CLOSED
Lane: DIAGNOSIS
Plan version: 1
Outcome: COMPLETE_DIAGNOSED_REPAIR_WITHHELD
Goal execution state: COMPLETE_DIAGNOSED_REPAIR_WITHHELD
Gate state: REPAIR_APPROVAL_REQUIRED_LIVE_RETRY_WITHHELD

## Stable Goal Objective

Determine, without provider or browser contact, why Plan 0200's exact selected
cone cross-section sandbox artifact reached the connected ChatGPT materializer
but produced zero download attempts and settled skipped. Reconcile the indexed
source path, persisted canary telemetry, and exact cached asset evidence; name
the narrow repair seam and its provider-free acceptance tests. Do not implement
the repair, retry the canary, start materialization, or resume any loop.

## Current State

- Plan 0200 consumed its sole live authorization and closed
  `COMPLETE_TERMINAL_NO_MATERIALIZATION`; its gate is permanently
  `CONSUMED_STOP_NO_RETRY`.
- Exact item
  `ec160eac-e457-4ae8-abb1-dfeaae5e8bec:download:sandbox:/mnt/data/plt_4.png`
  reached `chatgpt.materializeArtifact.connected=1`, while download attempts,
  successes, and failures were `0/0/0` and the manifest disposition was
  `skipped` with no local/archive asset.
- Provider-session email, plan, structure, and account-level dimensions all
  matched. This diagnosis therefore separates provider authorization from live
  artifact-control resolution.
- Scheduler and all six completions remain paused; default completion pass 4
  is unchanged; foreground work and active history jobs are zero; the scoped
  ChatGPT/default guard is clear.
- Diagnosis proves a live-control admission gap. The fresh context retained
  nine provider-payload artifacts and appended two DOM download probes to make
  eleven merged artifacts. The exact cone is payload-only and has a
  `messageId` but no `messageIndex`, `turnId`, or `buttonIndex`; the two visible
  controls are unrelated later DOCX downloads. No availability marker excludes
  the unmatched payload download before provider materialization.

## Authority And Ownership

- Authorized: plan/docs, CodeGraph source-path inspection, read-only persisted
  cache/job/manifest/telemetry evidence, provider-free simulations, existing
  focused tests, diagnosis closeout, and a bounded repair recommendation.
- Excluded: source/test implementation, install/restart, config/runtime JSON
  mutation, provider/browser contact, browser-tools, durable job creation,
  materialization, retry, alternate target, snapshot refresh, force,
  scheduler/completion/guard action, or any loop resume.
- Critical-path owner: primary agent; `subagent_status=not_spawned`.
- Repo policy is already aligned; no policy adoption change belongs here.

## Diagnostic Question

For the exact catalog item, which identity or resolver branch prevents the
selected cached sandbox artifact from binding to an actionable live download
control after the provider page is connected, and which provider-free fixture
proves that branch?

## Execution Contract

1. Audit, commit, and push this diagnosis boundary before substantive work.
2. Trace selection through service and ChatGPT adapter materialization using
   CodeGraph, including every pre-download skipped return.
3. Adjudicate the exact cached catalog item, Plan 0200 job/manifest, and scrape
   telemetry without contacting the provider.
4. Run at most one provider-free reproducer and two existing focused test
   commands if source evidence alone does not close the cause.
5. Close with a proved cause or a sharply bounded unresolved branch, exact
   repair seam, provider-free acceptance tests, and unchanged live controls.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 2`;
  `max_codegraph_calls: 8`; `max_provider_free_simulations: 1`;
  `max_focused_test_commands: 2`; `max_source_writes: 0`;
  `max_test_writes: 0`; `max_provider_browser_operations: 0`;
  `max_durable_jobs_created: 0`; `max_materialized_assets: 0`;
  `max_installs: 0`; `max_service_restarts: 0`;
  `max_scheduler_actions: 0`; `max_completion_actions: 0`;
  `max_guard_actions: 0`; `max_config_writes: 0`;
  `max_direct_runtime_json_edits: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## Goal State Machine

1. `DIAGNOSING_PROVIDER_FREE -> COMPLETE_DIAGNOSED_REPAIR_WITHHELD` when the
   exact pre-download skip cause, repair seam, and provider-free regression
   contract are established.
2. `DIAGNOSING_PROVIDER_FREE -> COMPLETE_BOUNDED_UNRESOLVED` only when source
   and persisted evidence reduce the uncertainty to one exact provider-free
   probe or fixture that requires a separately authorized implementation slice.
3. Any provider/browser contact, durable job creation, runtime mutation,
   materialization, or loop/control action transitions to `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [x] The indexed source trace identifies selection, live candidate discovery,
  identity/control binding, download-attempt accounting, and skipped returns.
- [x] Persisted exact-item, job, manifest, and telemetry evidence is reconciled
  against that trace without provider/browser contact.
- [x] The cause is proved provider-free or bounded to one exact unresolved
  branch; facts and hypotheses are explicitly separated.
- [x] The narrow repair seam and provider-free red/green acceptance contract
  are named without changing source or tests.
- [x] Scheduler and six completions remain paused, default pass 4 is unchanged,
  no active history job appears, and no excluded action runs.
- [x] Plan, ROADMAP, RUNBOOK, journal, fixes log if durable, plan audit, git
  cleanliness, and remote parity truthfully record the diagnosis.

## Hard Stops And Non-Goals

- Do not convert diagnosis into implementation under this plan.
- Do not infer a stale sandbox URI or missing DOM control until source and
  persisted evidence distinguish those branches.
- Do not retry the consumed canary or substitute another artifact.
- Do not resume the scheduler or any completion.

## Definition Of Done

The zero-attempt skip is source-and-evidence grounded, the next repair is
specified with provider-free tests, no implementation/live action occurred,
and every scheduler and completion pause remains intact.

## Checkpoint 1 | Diagnosis Boundary Opened

- `plan_version`: 1
- `checkpoint_id`: `P0201-C01`
- `state_transition`: LIVE_RETRY_WITHHELD -> DIAGNOSING_PROVIDER_FREE.
- `progress_classification`: outcome_progress
- `owned_changes`: Plan 0201 and governing-doc wiring only; no source, test,
  runtime, or live mutation.
- `evidence`: explicit operator `ok go`; Plan 0200 terminal skip with exact
  manifest and `connected=1` but downloads `0/0/0`; CodeGraph healthy at 875
  files, 16,499 nodes, and 55,870 edges; repository clean and synchronized at
  `b6c9ba2a` before planning.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; packets 0/2; CodeGraph calls 1/8;
  simulations/tests/source writes/test writes/provider-browser operations/jobs/
  assets/installs/restarts/control/config/direct-JSON actions 0.
- `remaining_criteria`: all six acceptance items.
- `next_action_or_stop_reason`: audit, commit, and push this boundary, then
  trace the exact pre-download skip path and reconcile persisted evidence.

## Diagnosis

### Proved Cause

1. `readChatgptConversationContextWithClient` independently extracts payload
   artifacts and visible DOM download probes, then merges them. Plan 0200's
   telemetry and persisted fresh context agree exactly: payload 9 + DOM
   downloads 2 + images/canvas 0 = merged 11.
2. The cone remains a payload-only artifact:
   `kind=download`, `uri=sandbox:/mnt/data/plt_4.png`,
   `messageId=ec160eac-e457-4ae8-abb1-dfeaae5e8bec`, with no live-control
   `turnId` or `buttonIndex`. The only DOM download artifacts are two later
   exam-DOCX controls with different message IDs, titles, URIs, and turn IDs.
3. The merge preserves the unmatched cone without a live-control availability
   state. Generic materializable selection therefore admits it and consumes
   the exact `maxItems=1` slot.
4. `tagChatgptArtifactButtonWithClient` requires a title/URI match and preserves
   the expected message/turn scope. No current control can match the cone. The
   helper exhausts its 10-second tagging window and returns false; the download
   branch returns null before `recordBrowserScrapeDownloadAttempt`.
5. This explains all terminal evidence: provider identity and connection pass,
   `Browser.setDownloadBehavior=1`, downloads `0/0/0`, one skipped manifest
   entry, and no file/archive row.

### Fact And Hypothesis Boundary

- Proved: the current provider payload still advertises the cone sandbox
  artifact while the current visible conversation has no matching actionable
  download control; AuraCall admits that mismatch as materializable.
- Not proved: whether the underlying sandbox object expired, the old response
  stopped rendering its control for another provider-side reason, or a hidden
  provider route could regenerate it. No repair should claim link expiry.

## Withheld Repair Contract

The next bounded provider-free implementation should:

1. Extract one pure ChatGPT payload-download-to-DOM-control resolver and use it
   both when merging context artifacts and when tagging a materialization
   control, so identity/scoping rules cannot drift.
2. Preserve unmatched payload artifacts for historical catalog evidence but
   mark sandbox downloads with an explicit non-actionable live-control state.
   `selectMaterializableConversationArtifacts` must reject that state before
   the provider callback and emit a specific `missing_live_control` disposition.
3. Enrich positively correlated payload downloads with the DOM probe's
   `turnId`, `buttonIndex`, message index, and actionable route while preserving
   canonical payload ID/URI identity.
4. Add red/green fixtures for: this exact cone plus two unrelated DOCX probes;
   a positively correlated payload/DOM pair; mismatched-message title
   collision; DOM-native download admission; and provider-callback-disabled
   `maxItems=1` selection that skips the missing cone without waiting ten
   seconds or contacting a provider.

## Checkpoint 2 | Cause Proved, Repair Withheld

- `plan_version`: 1
- `checkpoint_id`: `P0201-C02`
- `state_transition`: DIAGNOSING_PROVIDER_FREE ->
  COMPLETE_DIAGNOSED_REPAIR_WITHHELD.
- `progress_classification`: outcome_progress_with_read_only_budget_exception
- `owned_changes`: diagnosis and governing docs only; no source, test, runtime,
  installed, or live mutation.
- `evidence`: CodeGraph source trace through context merge, materializable
  selection, control tagging, and pre-attempt null return; persisted fresh
  context with 9 payload / 2 DOM / 11 merged artifacts; exact payload-only cone
  identity; unrelated two DOM DOCX controls; exact job/manifest downloads
  `0/0/0`; 134/134 existing ChatGPT adapter tests pass. Current status readback
  is API PID 66366 healthy on port 18095, scheduler paused, foreground inactive,
  six active completions all paused, default pass 4, scoped guard clear, and
  active history-materialization jobs zero.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 2/2; CodeGraph calls 9/8; focused test commands
  1/2; provider-free simulations 0/1; source/test writes, provider/browser
  operations, jobs, assets, installs, restarts, scheduler/completion/guard/
  config/direct-JSON actions 0. The ninth read-only graph call was a process
  exception used to confirm the merge-admission seam; it changed no state and
  does not widen repair or live authority.
- `remaining_criteria`: none inside Plan 0201.
- `next_action_or_stop_reason`: stop with source repair and all live retry
  withheld. A separately authorized provider-free successor may implement only
  the shared resolver, non-actionable admission state, and red/green fixtures;
  another live canary requires a later exact approval gate.
