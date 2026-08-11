# ChatGPT Fallback Terminal-Unavailable Provider-Free Repair | 0261-2026-08-11

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_VALIDATED
Goal execution state: ACTIVE_SUCCESSOR_PREPARED

## Stable Goal Objective

Reproduce the Plan 0260 route-loss failure with fake CDP at the exact ChatGPT
payload fallback boundary. Preserve recovery when the direct in-page request
returns 404 but the fallback exact response returns 200. When that exact
fallback response instead returns 404 or 410, stop before a readiness wait,
emit a sanitized `conversation-not-found-or-unavailable:` error, and let the
existing account-mirror evidence path retain historical artifacts while
marking the conversation terminal-unavailable so `maxItems=1` reconciliation
can advance without reattempting it.

## Authority And Effect Boundary

- Source, provider-free tests, plans, roadmap/runbook, journal, fixes log,
  validation, commit, and push are authorized.
- Provider callbacks, browser launch/attachment, install, API restart, live
  context read, canary, materialization start, completion/scheduler control,
  prompt/model/download actions, guard/config changes, direct runtime edits,
  and wider-profile work are excluded.
- A future live proof requires a new successor gate and fresh zero-owner
  admission. Plan 0261 cannot run it.

## Ranked Falsifiable Hypotheses

1. The exact fallback API response is 404/410, but the Network listener ignores
   non-2xx responses; the reload then lands on home and the caller reports only
   a late unsatisfied readiness predicate. Capturing an exact terminal response
   must make the provider-free read reject immediately without that wait.
2. No exact fallback response is emitted; the reload independently loses its
   route. An exact terminal-response fixture would then not match the live
   stage sequence and would require route-loss classification instead.
3. Authentication or identity failed before payload acquisition. This predicts
   an auth/identity/guard stage, contrary to the admitted canary receipt and
   initial ready conversation route.

## Provider-Free Feedback Loop

1. Add a fake-CDP adapter test with direct status 404 and exact fallback status
   404. It must currently fail because the listener ignores the response and
   returns `null` after the fallback window.
2. Preserve the existing direct-404/fallback-200 recovery tests unchanged.
3. Add a context-level propagation assertion if the existing fake seam can
   exercise it without browser/runtime effects.
4. Reuse the history-materialization tests proving terminal evidence is
   persisted, historical catalog/archive evidence is not deleted, the terminal
   row is excluded before selection, and a later routeable row consumes the
   `maxItems=1` budget with provider callbacks disabled.

## Acceptance Criteria

- [x] One deterministic fast red reproduces ignored exact fallback 404/410.
- [x] Exact fallback 404/410 becomes a sanitized terminal-unavailable error;
  direct 404 followed by fallback 200 still recovers.
- [x] The context caller preserves the terminal error instead of converting it
  to post-payload predicate failure.
- [x] Existing evidence persistence retains historical artifact/file/archive
  records while recording `not_found_or_unavailable` and deriving
  `terminal_unavailable`.
- [x] Provider-free `maxItems=1` selection skips terminal evidence and advances
  to one routeable candidate without a callback for the terminal row.
- [x] Focused and adjacent tests, typecheck, build, scoped lint, plan audit,
  diff hygiene, commit, and push pass.
- [x] All excluded effects remain zero; scheduler remains paused and no
  materialization starts.

## Local Goal Bounds

- `max_feedback_loops: 6`; `max_source_fixes: 1`; `max_subagents: 0`;
  `max_installs: 0`; `max_api_restarts: 0`; `max_browser_launches: 0`;
  `max_provider_callbacks: 0`; `max_context_reads: 0`; `max_canaries: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_prompt_submissions: 0`;
  `max_model_selections: 0`; `max_downloads: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`.

## Activation Checkpoint | Classified Live Failure To Provider-Free Red

- `checkpoint_id`: `P0261-C01`.
- `state_transition`: P0260_CLOSED_FAILED_POST_PAYLOAD_ROUTE_LOST ->
  P0261_ACTIVE_PROVIDER_FREE.
- `progress_classification`: successor_activated.
- `evidence`: the sole Plan 0260 canary reached the conversation, entered the
  payload path, and ended on ChatGPT home before the post-payload predicate
  failed. Current source accepts only fallback 2xx responses and deliberately
  supports direct-404/fallback-200 recovery. Existing account-mirror code can
  persist a canonical terminal-unavailable reason and exclude terminal rows;
  the adapter does not yet produce that reason at this exact seam.
- `authority_classification`: provider-free source/tests/docs only.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: run the deterministic exact fallback 404 red,
  then repair only the proven response-classification and propagation seam.

## Definition Of Done

The provider-free chain distinguishes recoverable direct 404 from terminal
exact-fallback 404/410, retains historic evidence, suppresses reattempt of the
terminal row before `maxItems=1`, and passes validation with every live/runtime
effect still excluded. A separate successor may prepare one fresh canary; it
must not resume the scheduler or start materialization.

## Final Checkpoint | Exact Fallback Terminal State Reaches Existing Evidence

- `checkpoint_id`: `P0261-C02`.
- `state_transition`: P0261_ACTIVE_PROVIDER_FREE ->
  P0261_CLOSED_PROVIDER_FREE_VALIDATED.
- `progress_classification`: root_cause_repaired_provider_free.
- `red_evidence`: the exact fake-CDP fallback 404 test returned `pending`
  instead of the required terminal error because the Network listener ignored
  every non-2xx exact response.
- `root_cause`: direct in-page 404 is intentionally recoverable, but exact
  fallback 404/410 had no terminal outcome. The reload could move to ChatGPT
  home while the caller waited and replaced the real state with a generic
  post-payload predicate failure.
- `repair`: exact fallback 404/410 now settles the owned response window,
  disposes listeners, throws one coded sanitized canonical error, and is
  rethrown by the context caller before post-payload readiness. Direct
  404/fallback-200 behavior is unchanged.
- `preservation_evidence`: cache-persistence coverage writes terminal
  routeability onto an existing conversation and proves its artifact and file
  inventories remain. The reconciliation fixture retains a readable historic
  local artifact, excludes its online-terminal conversation, and selects only
  the later routeable row under `maxItems=1`.
- `validation`: 170/170 adapter tests and 272/272 focused/adjacent tests pass;
  typecheck, build, scoped Biome, and the 261-plan audit pass.
- `runtime_audit`: provider/browser, install/restart, live context,
  materialization, completion/scheduler control, prompt/model/download,
  guard/config, and direct runtime effects were zero. API PID 3323 remains
  active/running with `NRestarts=0`; scheduler is paused/paused; the target is
  idle-waiting/pass 56 with null error/next/force; exact profile owners and
  port 45015 listeners are zero.
- `installed_delta`: built adapter SHA-256 is
  `1f3941267e762d72b1caf12d41fce6fbd4f70e12cd6300b6c55e6e6d180beb4a`;
  installed remains
  `fac2bd9b1de04ed3ec2ed9b19e64ceb5b1766232224b7d4acb3a7fd2dcd6bea7`.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0262 is prepared for one separately
  approved install/restart and one zero-retry same-route canary. Plan 0261
  cannot perform live work.
