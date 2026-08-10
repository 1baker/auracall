# ChatGPT Governed Payload Reload Settlement Repair | 0253-2026-08-10

State: CLOSED
Lane: P01
Plan version: 2
Gate state: PROVIDER_FREE_REPAIR_ACCEPTED
Goal execution state: PAUSED_AT_SEPARATE_ONE_CANARY_GATE

## Stable Goal Objective

Eliminate the default ChatGPT conversation-context timeout mechanism isolated
by Plan 0252. Prove the exact causal ordering provider-free, repair governed
fallback reload and retained-client cleanup settlement, and prepare a separate
one-canary approval gate. Keep the scheduler paused and do not start
materialization or provider/browser work in this plan.

## Current State

- Plan 0252 directly inspected the known-good control and all four pass-9
  failures. Every route, exact fallback payload, message page, and later DOM
  probe is currently healthy; provider/auth/route unavailability is rejected.
- Installed mutation evidence proves at least one fire-and-forget fallback
  reload outlived its child job and later failed on a closed WebSocket.
- Current source registers fallback Network listeners, starts
  `reloadAndSettle` without joining it, and starts the ten-second response-body
  timer before the interaction governor has authorized the physical reload.
- The public `readConversationContext` path binds abort cleanup but, unlike the
  shared abort-bound helper, does not await cleanup when abort has started.
- Git is clean and synced at `7e29a0a9`. API PID 27774 is active/running with
  zero restarts; scheduler state is paused; default completion is blocked/pass
  9; active history materialization jobs and exact AuraCall-managed browser
  owners are zero.

## Authority And Effect Boundary

- The operator authorized up to ten goal turns to fix the diagnosed defect.
  Ordinary provider-free implementation, validation, documentation, commit,
  and push are in scope under the standing goal authority.
- Expected write surface is limited to the ChatGPT adapter, its focused tests,
  and governing operational docs. A browser-service change is admitted only if
  the first deterministic red proves the defect belongs in the reusable reload
  primitive.
- Provider/browser calls, managed-browser launch/attach, install, API restart,
  completion control, materialization, scheduler control, direct runtime-state
  edits, guard/config changes, clicks, downloads, and prompts are excluded.
- No canary is executed here. A fresh canary remains a distinct effect gate
  after provider-free validation and installed-source parity preparation.

## Ranked Hypotheses And Predictions

1. `H1_governor_timer_inversion`: the fallback body timer starts before the
   page-refresh governor releases the reload. A fake governor delayed beyond
   ten seconds will make current code return `null` before `Page.reload`; moving
   governance ahead of body acquisition will keep the read pending and then
   return the exact payload.
2. `H2_reload_listener_lifetime`: fallback listeners and the reload task outlive
   the payload read. Two sequential reads on one fake client will expose stale
   subscriptions or a late reload completion; disposing listeners and settling
   owned reload work will leave no first-read activity after return.
3. `H3_abort_cleanup_not_joined`: the public context method returns/rejects
   while retained-session cleanup is still pending. A controlled abort with a
   blocked close promise will settle current code before cleanup; routing the
   method through the shared abort-bound connection helper will wait.
4. `H4_provider_or_route_failure`: rejected by Plan 0252 direct inspection and
   retained only as a regression guard; no provider work is needed to test it.

## Execution Packet

1. Add one public-seam fake-CDP test for H1 and prove it red with fake time.
2. Apply only the minimum ordering change required to make H1 green.
3. Add one sequential fallback test for H2. If red, add explicit listener
   disposal and bounded reload ownership; if green, retain the test as proof and
   do not widen implementation.
4. Add one abort/cleanup settlement test at the public connection boundary for
   H3 and replace duplicated cleanup sequencing with the existing shared helper
   if red.
5. Run focused ChatGPT adapter/tab-lifecycle tests after each vertical slice,
   then integrated provider-free browser/account-mirror tests, typecheck,
   touched lint, build, planning audit, and diff check.
6. Reconcile plan/roadmap/runbook/journal/fix log, commit, and push. Prepare but
   do not execute the separate installed one-canary gate.

## Local Goal Bounds

- `max_work_unit_attempts: 3`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 1`; `checkpoint_interval: 1 red-green slice`;
  `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`;
  `max_subagents: 0`; `max_source_files: 3`; `max_test_files: 3`;
  `max_provider_calls: 0`; `max_browser_launches: 0`; `max_installs: 0`;
  `max_api_restarts: 0`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_direct_runtime_edits: 0`.

## Acceptance And Hard Stops

- The first feedback loop must be deterministic, fake-CDP, provider-free,
  runnable in seconds, and red on the exact governor/body-timer inversion.
- Do not weaken the existing requirement that an exact response body may
  complete the payload read even when the CDP `Page.reload` acknowledgement is
  delayed.
- Do not add an unbounded wait, second reload, provider retry, broad timeout
  increase, or listener leak. Abort and connection-close paths must settle.
- Stop on a required provider/browser observation, architecture widening beyond
  the declared surface, unrelated dirty work, or a need to resume/start any
  runtime effect excluded above.

## Acceptance Criteria

- [x] H1 is reproduced provider-free and the governed reload cannot lose its
  body-acquisition window before the physical reload begins.
- [x] Two sequential fallback reads do not retain first-read listeners or owned
  reload work across the second read.
- [x] Public conversation-context abort waits for retained-session cleanup.
- [x] Existing exact-body-while-reload-pending behavior remains green.
- [x] Focused/integrated provider-free tests, typecheck, touched lint, build,
  planning audit, and diff check pass.
- [x] Runtime effects remain zero and a separate one-canary gate is prepared.

## Opening Checkpoint | Provider-Free Repair Authorized

- `checkpoint_id`: `P0253-C01`.
- `state_transition`: P0252_CLOSED_ENCLOSING_RETAINED_CLIENT_SETTLEMENT_DEFECT
  -> P0253_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: direct agent-browser route/payload health; installed late closed-
  WebSocket mutation evidence; current source ordering; clean/synced Git;
  healthy stopped runtime.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit and push this gate, then write and run
  the single H1 fake-time regression before changing source.
- `authority_classification`: standing provider-free repair authority; all
  provider, browser, install, restart, completion, materialization, and
  scheduler effects remain excluded.
- `review_disposition_summary`: H1, H2, and H3 are accepted `needs_evidence`
  candidates; H4 is rejected by direct browser evidence.

## Definition Of Done

The deterministic reproducer fails before the fix and passes after it, reload
and cleanup ownership settle across sequential reads and abort, integrated
provider-free validation is green, operational docs are current, and the next
live action is a separate unexecuted one-canary gate.

## Closing Checkpoint | Governed Reload Settlement Repaired Provider-Free

- `checkpoint_id`: `P0253-C02`.
- `state_transition`: P0253_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0253_CLOSED_PROVIDER_FREE_REPAIR_ACCEPTED.
- `progress_classification`: blocker_removed_provider_free.
- `causal_evidence`: the H1 fixture held the governor beyond the old ten-second
  body window and reproduced an early `null` before `Page.reload`. The
  sequential fixture then reproduced one retained response listener and one
  retained loading listener after the first read.
- `repair`: the page-refresh governor now releases before response acquisition;
  both per-read Network subscriptions are disposed on every settlement;
  browser-service `reloadAndSettle` accepts caller-owned exact-response
  completion while preserving command-rejection failure; and the public context
  path uses the shared abort-bound connection helper that joins cleanup.
- `verification`: focused adapter/tab-lifecycle tests passed 167/167;
  integrated account-mirror/materialization tests passed 210/210; the final
  combined repair surface passed 238/238; typecheck and build passed; and the
  isolated full suite passed 799/799 suites with 2770 passed, 65 pending, and
  zero failed tests. The corrected exact-browser process bracket was absent.
- `effect_accounting`: provider calls 0, browser launches/attaches 0,
  installs/restarts 0, materialization starts 0, completion controls 0,
  scheduler controls 0, guard/config changes 0, and direct runtime edits 0.
- `next_action_or_stop_reason`: Plan 0254 is prepared and awaits explicit
  approval for one install/restart and one fresh `wsl-chrome-3` context canary.
  Scheduler, materialization, completion, and wider execution remain stopped.
