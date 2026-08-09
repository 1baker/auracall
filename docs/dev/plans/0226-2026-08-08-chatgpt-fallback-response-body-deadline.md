# ChatGPT Fallback Response-Body Deadline | 0226-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_DIAGNOSIS_AND_REPAIR
Goal execution state: ACTIVE_TURN_1_OF_10

## Stable Goal Objective

Continue the ChatGPT context-stall repair for at most ten goal turns. First,
provider-free reproduce and repair the post-404 fallback whose
`Network.getResponseBody` can remain unsettled after its outer timer is cleared.
Validate and push the repair, then use a separate installed canary packet. If
that canary is unsuccessful, run another exact-profile agent-browser session
that emulates the deterministic production sequence and records discrepancies
before any further repair or canary.

## Current State

- Plan 0225 directly proved the initial authenticated payload request is not
  the long stall for known failing conversation
  `6a5245ad-7180-83ea-a3e4-7d2e81015af9`: HTTP 404, fetch 311 ms, body 1 ms,
  parse 0 ms, total in-page 312 ms, raw content not retained.
- The 404 sends `readChatgptConversationPayloadWithClient` into its governed
  reload/network-capture fallback. The `Network.loadingFinished` handler clears
  the 10000-ms body-promise timer before awaiting `Network.getResponseBody`,
  which has no independent deadline. A never-settling response-body request can
  therefore leave the payload reader pending until the outer context deadline.
- Existing tests cover the initial Runtime evaluation deadline, direct-only
  retry, preserve-active-tab behavior, and the successful fallback reload. No
  test leaves fallback `getResponseBody` unsettled.
- Source is clean and synchronized at `1f291f28`. API PID 95638 is
  active/running with `NRestarts=0`; scheduler and wider completions remain
  paused; active history jobs zero; target blocked/pass 48 with force null; the
  exact managed browser is closed.

## Authority And Scope

- Provider-free source, test, plan, roadmap, runbook, journal, fix-log, and
  necessary user-facing deadline semantics are authorized in this packet.
- The correct red seam is the real exported payload reader with fake Runtime,
  Network, and Page domains. It must produce initial 404, exact 200 network
  response events, and a never-settling `getResponseBody` promise.
- One production repair seam may add a shorter transport deadline to the CDP
  response-body request and preserve an outer fallback-body deadline until the
  bounded request settles. Full payload parsing and fallback semantics remain.
- No install, API restart, browser/provider contact, materialization,
  completion/scheduler control, prompt, click, navigation, reload, `Answer now`,
  guard bypass, or direct runtime JSON edit is authorized here.
- A successor may prepare and execute one installed `wsl-chrome-3` canary under
  the standing operator goal only after this provider-free slice is green,
  committed, and pushed. An unsuccessful canary must transition to one new
  exact-profile agent-browser discrepancy session before another source change
  or canary.

## Ranked Hypotheses And Predictions

1. `H1_cleared_timer_unbounded_body`: clearing the fallback body timer before
   awaiting `getResponseBody` removes all settlement bounds. Prediction: the
   exact fake-CDP test remains pending after 10001 ms on current source and
   resolves null after a shorter response-body deadline plus preserved outer
   timer.
2. `H2_reload_settle`: `reloadAndSettle` itself is the live stall. Prediction:
   the fake Page reload never returns before network-body handling; contradicted
   if the red reaches `getResponseBody` and only that promise remains pending.
3. `H3_missing_network_event`: the expected response event never occurs.
   Prediction: the unchanged outer body timer already resolves null at 10000 ms;
   this cannot explain a 116-second payload pending operation.
4. `H4_direct_fetch`: the initial browser fetch/body/parse/by-value operation is
   slow. Prediction: the exact-profile direct probe would stall; rejected by
   Plan 0225's 312-ms terminal marker.
5. `H5_message_or_post_payload`: later readiness or message extraction is the
   stall. Prediction: live receipts would clear pending payload and advance the
   completed marker; contradicted for nine of 12 Plan 0223 receipts.

## Execution Packet

1. Audit, commit, and push this provider-free authority checkpoint.
2. Add one focused regression under the existing payload-reader describe block.
   Run exactly:
   `pnpm vitest run tests/browser/chatgptAdapter.test.ts -t "bounds a stalled fallback response-body read" --maxWorkers 1`.
   Require deterministic red on a still-pending outcome after the declared
   deadline.
3. Implement one response-body deadline seam. Keep the outer body timer active
   until the bounded request settles and prevent late settlement from replacing
   an earlier result.
4. Make the exact red green, then run the full ChatGPT adapter suite and the
   adjacent context/materialization/completion suites, typecheck, touched
   zero-warning Biome, production build, debug-marker scan, plan audit, and diff
   hygiene.
5. Record red/green evidence, close this plan, commit, and push the repair.
6. Prepare a separate one-install, one-restart, one-canary successor bound to
   the existing `wsl-chrome-3` completion at expected pass `48 -> 49`. Its
   unsuccessful edge must name a fresh exact-profile agent-browser session
   before any further canary.

## Acceptance Criteria

- [ ] Plan is audited, committed, and pushed before source changes.
- [ ] One deterministic real-seam test is red because fallback
  `getResponseBody` remains pending after its intended deadline.
- [ ] One bounded production seam makes the exact red green without truncating
  a successfully returned payload or weakening navigation/guard semantics.
- [ ] Integrated provider-free validation, typecheck, lint, build, audit, and
  diff hygiene pass.
- [ ] Runtime/provider/control effects remain zero and stopped state is re-read.
- [ ] Repair and canonical evidence are committed/pushed; one exact canary
  successor is prepared with the mandatory failed-canary agent-browser edge.

## Local Goal Bounds

- `max_goal_turns: 10`; `current_goal_turn: 1`;
  `max_plan_versions: 1`; `max_red_designs: 1`; `max_red_runs: 2`;
  `max_source_repair_seams: 1`; `max_repair_iterations: 2`;
  `max_review_rework_cycles: 1`; `max_canary_plans_prepared: 1`;
  `max_installs: 0`; `max_api_restarts: 0`;
  `max_provider_browser_calls: 0`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_browser_navigations: 0`; `max_browser_clicks: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Hard Stops

- Stop source repair if the exact fake-CDP sequence does not reach and remain
  pending specifically inside fallback `getResponseBody`, or if more than one
  production seam is required.
- Stop on content truncation, silent success after a missing full payload,
  identity/guard weakening, dirty overlapping work, live runtime movement, or
  any provider/browser effect.
- A green provider-free slice does not by itself prove installed effectiveness.
  Install/restart/canary effects require the pushed successor plan.
- After an unsuccessful canary, do not install, restart, retry, or modify source
  until one new exact-profile agent-browser discrepancy session settles and is
  recorded.

## Checkpoint 1 | Provider-Free Fallback Repair Prepared

- `checkpoint_id`: `P0226-C01`.
- `state_transition`: P0225_COMPLETE_DIRECT_DIAGNOSTIC ->
  P0226_PROVIDER_FREE_REPAIR_PREPARED.
- `progress_classification`: blocker_reduction.
- `authority_classification`: standing operator authority for up to ten turns,
  repair/canary continuation, and mandatory post-failure agent-browser work.
- `evidence`: exact direct-probe timings, source fallback sequence, clean
  synchronized repo, and stopped runtime above.
- `effect_accounting`: provider/browser, install, restart, materialization,
  completion, scheduler, navigation, click, prompt, and runtime-edit effects
  all zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: H1 is the only candidate admitted to red; H2-H5
  remain falsification controls or are already contradicted.
- `next_action_or_stop_reason`: audit, commit, and push, then add and run the one
  exact red before modifying production source.
