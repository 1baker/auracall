# ChatGPT Fallback Terminal-Unavailable Provider-Free Repair | 0261-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: ACTIVE_PROVIDER_FREE
Goal execution state: ACTIVE

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

- [ ] One deterministic fast red reproduces ignored exact fallback 404/410.
- [ ] Exact fallback 404/410 becomes a sanitized terminal-unavailable error;
  direct 404 followed by fallback 200 still recovers.
- [ ] The context caller preserves the terminal error instead of converting it
  to post-payload predicate failure.
- [ ] Existing evidence persistence retains historical artifact/file/archive
  records while recording `not_found_or_unavailable` and deriving
  `terminal_unavailable`.
- [ ] Provider-free `maxItems=1` selection skips terminal evidence and advances
  to one routeable candidate without a callback for the terminal row.
- [ ] Focused and adjacent tests, typecheck, build, scoped lint, plan audit,
  diff hygiene, commit, and push pass.
- [ ] All excluded effects remain zero; scheduler remains paused and no
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
