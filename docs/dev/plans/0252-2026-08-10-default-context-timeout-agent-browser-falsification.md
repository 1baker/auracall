# Default Context-Timeout Agent-Browser Falsification | 0252-2026-08-10

State: CLOSED
Lane: P01
Plan version: 4
Gate state: CLOSED_DIRECT_BROWSER_HEALTHY
Goal execution state: COMPLETE_DIAGNOSIS
Outcome: ENCLOSING_RETAINED_CLIENT_SETTLEMENT_DEFECT

## Stable Goal Objective

Directly inspect the four pass-9 ChatGPT/default conversation-context failures
with agent-browser before accepting a code diagnosis. Reproduce the production
read sequence as metadata-only browser milestones, compare the four failed
routes with the known-good neighboring route, and determine the first operation
that fails to settle. Keep materialization, completion controls, and the
scheduler stopped.

## Current State

- Plan 0251 closed after sole child `hmj_22f3b386babb424fa0fc46e3a254f6bb`
  failed `0/3/4`. Four one-attempt receipts ended near 110 seconds with last
  completed stage `provider:chatgpt.skipSameRouteNavigation`; neighboring
  conversation `6a636202-3ce0-83ea-8a52-6b5e287fdc31` completed in 11444 ms.
- The marker proves that same-route navigation was skipped after readiness
  settled. It does not prove the later pending operation. The production order
  is payload read, post-payload readiness, paged message extraction, file and
  artifact probes.
- Installed API PID 27774 is active/running with `NRestarts=0`. Scheduler state
  is paused; default completion is blocked/pass 9 with force/next null and
  error `account_mirror_materialization_failed`; active history jobs are zero.
- No Chrome process owns the exact managed browser profile
  `~/.auracall/browser-profiles/default/chatgpt`; `browser-tools inspect`
  returns no live DevTools instances. Agent-browser remote control doctor is
  ready.

## Authority And Effect Boundary

- The operator explicitly required direct agent-browser inspection before
  trusting the suspected diagnosis and then replied `ok go`. This plan is the
  bounded browser-effect packet.
- One AuraCall-owned launch may open ChatGPT using the exact `default/chatgpt`
  managed browser profile. Agent-browser may attach once to the actual live
  DevTools port owned by that exact process.
- Inspect exactly these failed routes:
  `6a40724d-8688-83ea-ab36-7458e921ed19`,
  `6a4071e7-2478-83ea-bbf7-b75a382d98b0`,
  `6a303b38-a97c-8333-8103-d47ce9a110cd`, and
  `6a03ed4c-85c8-8333-91e1-ee4e269ad457`; use only
  `6a636202-3ce0-83ea-8a52-6b5e287fdc31` as the control.
- For each route, agent-browser may perform one route navigation, confirm the
  same-route ready surface, and run one metadata-only emulation of the direct
  payload fetch. When that fetch is non-2xx, agent-browser may clear its request
  log, reload that exact route once, and pass the single exact 2xx conversation
  response directly into the validated metadata-only reducer. It may then run
  post-payload readiness, paged message counting/length aggregation, and
  visible file/artifact counts.
- Each operation must have an inner browser deadline and an outer command
  deadline. Retain only stage, elapsed time, HTTP status, parse state, mapping
  count, message count/aggregate character length, and file/artifact counts.
  Raw messages, payloads, headers, cookies, request IDs, URLs with query data,
  identity values, and filenames must not reach stdout or a durable artifact.
- One bounded DOM snapshot may confirm ordinary authenticated ChatGPT and the
  absence of login, CAPTCHA, challenge, verification, or `Answer now` state;
  do not retain conversation content.
- Close the exact attached session/browser after terminal evidence. Do not
  close or mutate unrelated browser processes.
- Source repair, install, API restart, materialization, completion control,
  scheduler control, guard/config mutation, prompt submission, clicks,
  downloads, reloads beyond the one exact fallback reload per route, direct
  runtime-state edits, and retries are excluded.

## Ranked Hypotheses And Predictions

1. `H1_payload_read`: same-route readiness settles and the direct fetch returns
   non-2xx, but the exact reload response discovery/body read fails or times
   out. The first failed milestone will be fallback discovery/detail, while
   the control settles.
2. `H2_post_payload_readiness`: payload metadata settles, but the next ready
   predicate does not. The first failed milestone will be post-payload
   readiness.
3. `H3_message_paging`: payload and readiness settle, but one bounded message
   page or by-value aggregate does not. The first failed milestone will name
   the message page offset.
4. `H4_later_probe`: messages settle and the first failure is file, download,
   image, canvas, or frame metadata probing. This rejects a message/payload
   diagnosis.
5. `H5_outer_sequence_or_receipt`: every isolated operation settles for all
   five routes. This rejects a page-operation diagnosis and moves the defect to
   retained-session sequencing, callback/receipt settlement, or the enclosing
   110-second context controller.

## Execution Packet

1. Audit, commit, and push this gate before launching a browser.
2. Re-read Git, API, scheduler, completion, jobs, guards, exact managed-profile
   ownership, and agent-browser readiness. Stop on drift.
3. Launch the exact default ChatGPT managed browser once through AuraCall
   `browser-tools`; bind the actual PID, profile path, and DevTools port.
4. Attach one named agent-browser session to that port. Confirm ordinary
   authenticated ChatGPT and no hard-stop surface.
5. Inspect the known-good control first, then the four failed routes one at a
   time. Stop after the first terminal operation on each route; never retry.
6. Compare route results and accept/reject H1-H5. Do not change source in this
   plan.
7. Close only the exact browser/session, prove jobs/browser ownership returned
   to zero, and re-read the stopped scheduler/completion state.
8. Record the evidence in this plan, roadmap, runbook, journal, and fix log;
   audit, commit, and push.

## Local Goal Bounds

- `max_browser_launches: 1`; `max_agent_browser_attaches: 1`;
  `max_conversation_navigations: 5`; `max_same_route_checks: 5`;
  `max_payload_probes: 5`; `max_message_page_probes_per_route: 256`;
  `max_dom_snapshots: 1`; `max_browser_closes: 1`;
  `max_network_log_clears: 10`; `max_page_reloads: 5`;
  `max_exact_response_details: 6`; `max_browser_clicks: 0`;
  `max_downloads: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_actions: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_actions: 0`;
  `max_config_mutations: 0`; `max_installs: 0`; `max_api_restarts: 0`;
  `max_source_repairs: 0`; `max_direct_runtime_edits: 0`;
  `max_subagents: 0`.
- `max_work_unit_attempts: 1`; `max_review_rework_cycles: 0`;
  `max_hardening_checkpoints: 1`; `checkpoint_interval: 1 browser session`;
  `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.

## Acceptance And Hard Stops

- Stop before route inspection on wrong PID/profile/port, wrong origin, login
  loss, CAPTCHA/challenge/verification, provider guard, duplicate profile owner,
  active materialization, scheduler drift, or raw-content exposure risk.
- Stop each route after its first failed/timed-out milestone. A timeout is
  evidence, not retry authority.
- Stop the whole packet on any need for a second reload on one route, click,
  download, prompt, `Answer now`, materialization, completion/scheduler
  control, install/restart, source repair, guard bypass, or runtime edit.
- This inspection does not authorize a canary or scheduler resume.

## Acceptance Criteria

- [x] Exact routes, control, effect bounds, and falsifiable hypotheses are
  recorded before browser work.
- [x] One exact-profile browser and one agent-browser attachment are used.
- [x] All five routes receive metadata-only terminal classifications or the
  first safety hard stop is recorded.
- [x] The first non-settling production-equivalent operation is identified, or
  H5 is accepted with the page-operation diagnosis rejected.
- [x] The exact browser closes and scheduler/completion/jobs remain stopped.
- [x] Final documentation, audit, Git cleanliness, commit, and push agree.

## Opening Checkpoint | Direct Falsification Authorized

- `checkpoint_id`: `P0252-C01`.
- `state_transition`: P0251_CLOSED_CANARY_FAILED_CONTEXT_TIMEOUTS ->
  P0252_ACTIVE_DIRECT_AGENT_BROWSER_FALSIFICATION.
- `progress_classification`: blocker_reduction.
- `evidence`: explicit operator direction; exact pass-9 receipts and control;
  current clean/synced Git; API PID 27774/zero restarts; scheduler paused;
  completion blocked/pass 9; active jobs and exact browser owners zero;
  agent-browser remote control ready.
- `subagent_status`: not_spawned.
- `effect_accounting`: every browser, provider, materialization, completion,
  scheduler, install, restart, source, and runtime-edit counter is zero.
- `next_action_or_stop_reason`: audit, commit, and push this gate, then launch
  exactly one default/chatgpt browser and execute the five-route metadata-only
  sequence.
- `authority_classification`: explicit direct-inspection authority only; no
  repair, canary, or resume authority.
- `review_disposition_summary`: the prior `skipSameRouteNavigation` marker is
  accepted only as the last completed action. Any claim that it is the blocked
  operation remains `needs_evidence` until this sequence settles.

## Control Checkpoint | Direct 404 Requires Exact Fallback Emulation

- `checkpoint_id`: `P0252-C02`.
- `state_transition`: P0252_ACTIVE_DIRECT_AGENT_BROWSER_FALSIFICATION ->
  P0252_ACTIVE_EXACT_FALLBACK_EMULATION.
- `progress_classification`: blocker_reduction.
- `evidence`: exact browser PID 4232 owns the AuraCall-managed default/chatgpt
  directory on live DevTools port 45065. Agent-browser confirmed authenticated
  ChatGPT with no login, CAPTCHA, challenge, or `Answer now` control. On the
  known-good route, same-route DOM readiness is complete; the direct
  authenticated conversation GET completed in 186 ms as a small parseable 404;
  the exact 200 route-load response body was independently reduced in 451 ms
  with one candidate and a valid JSON mapping.
- `effect_accounting`: launches 1/1, attaches 1/1, route navigations 1/5,
  payload probes 1/5, response details 1/6, reloads 0/5, closes 0/1; all
  excluded effects zero.
- `next_action_or_stop_reason`: because the production reader necessarily
  enters reload fallback after the direct 404, permit exactly one request-log
  clear, reload, and metadata-only exact response detail per route. Continue
  with the control fallback, then the four failed routes without retry.
- `authority_classification`: in-envelope direct code-step emulation required
  by the operator; no repair, materialization, completion, or scheduler scope
  added.
- `review_disposition_summary`: direct fetch/header/body stall is rejected for
  the control. Reload response discovery/body settlement and enclosing callback
  ordering remain `needs_evidence`.

## Closing Checkpoint | Browser Operations Healthy; Enclosing Settlement Defect

- `checkpoint_id`: `P0252-C03`.
- `state_transition`: P0252_ACTIVE_EXACT_FALLBACK_EMULATION ->
  P0252_CLOSED_ENCLOSING_RETAINED_CLIENT_SETTLEMENT_DEFECT.
- `progress_classification`: blocker_reduction.
- `route_evidence`: the known-good control and all four pass-9 failures loaded
  their exact routes, retained ordinary authenticated ChatGPT state, and
  exposed readable message DOM. Direct authenticated conversation GETs all
  returned the same small parseable 404 in 181-366 ms. Each exact fallback
  reload emitted exactly one 200 response; the metadata-only reducer retrieved
  and parsed bodies in 329-3798 ms with mapping counts 6, 32, 50, 14, and 10.
  Message pages were readable for every route, including the largest observed
  44-node/six-page route and the 34043-character two-node route. CAPTCHA,
  challenge, login, `Answer now`, response ambiguity, parse failure, and
  transport timeout counts were zero.
- `hypothesis_disposition`: H1, H2, H3, and H4 are rejected as current
  standalone browser/page-operation causes. H5 is accepted: the four provider
  conversations and their payloads are currently retrievable, while pass 9's
  AuraCall receipts still prove the enclosing context read timed out with
  `pendingOperation=provider:chatgpt.readConversationPayload`.
- `code_boundary`: production registers per-read Network callbacks, starts
  `reloadAndSettle` without joining it, returns when the exact body promise
  settles, and reuses a retained client for the next conversation. The direct
  agent-browser sequence serialized and settled the same operations. Therefore
  retained-client reuse, callback lifetime/target ownership, or reload cleanup
  ordering is the remaining causal boundary. Which of those three is exact
  remains provider-free `needs_evidence`; no source repair is admitted here.
- `effect_accounting`: one exact browser launch, one agent-browser attachment,
  five route navigations, five direct payload probes, five exact reloads, ten
  local request-log clears, six safe response details (one initial control
  route-load diagnostic plus five exact fallback reads), and one exact browser
  process-group close. Clicks, downloads, prompts, materialization,
  completion/scheduler controls, installs, restarts, source changes, guard
  actions, and runtime edits remained zero.
- `cleanup`: agent-browser detached; AuraCall `browser-tools kill --ports
  45065 --force` closed only the exact PID 4232 process group. Port 45065 and
  the exact AuraCall-managed browser owner are absent. Unrelated pre-existing
  agent-browser sessions were not mutated. API PID 27774 remains active/running
  with zero restarts; scheduler state remains paused; default remains
  blocked/pass 9 with force/next null; active history jobs are zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: close this diagnostic. A provider-free
  successor should reproduce two sequential fallback payload reads on one
  retained client, assert callback/listener and reload-task cleanup before the
  second read, then repair only the proven seam before any new canary.
- `authority_classification`: direct inspection complete; no repair, canary,
  materialization, or scheduler authority inferred.
- `review_disposition_summary`: browser/provider unavailability and route-size
  theories are rejected. Retained-client fallback settlement is blocking;
  its exact submechanism remains `needs_evidence` for a deterministic red.

## Definition Of Done

The exact five-route browser sequence identifies the first non-settling
operation or rejects the page-operation diagnosis, the owned browser is closed,
and all wider runtime controls remain stopped.

## Post-Close Installed Mutation Audit | Reload Task Outlives Owner

- The installed scheduler diagnostics retain three production fallback reload
  failures with `WebSocket is not open: readyState 3 (CLOSED)`. The final
  reload started at `2026-08-10T14:11:38.453Z` and recorded its failure at
  `2026-08-10T14:11:54.670Z`, after the child job had already generated its
  terminal result at `2026-08-10T14:11:43.077Z`.
- Current installed/source parity shows the payload reader creates a bounded
  ten-second response-body promise, registers per-read Network listeners, then
  starts `reloadAndSettle` with `void ...catch(() => undefined)` and awaits only
  the body promise. It neither joins/cancels the reload task nor removes those
  listeners before retained-client cleanup/reuse.
- The temporal ordering proves a reload task can outlive its owning context/job
  and then observe the closed retained WebSocket. It does not prove the closed
  WebSocket initiated the earlier context deadline; that error can be a
  downstream cleanup symptom. The exact upstream trigger therefore remains
  `needs_evidence`, while reload-task/listener lifetime is now the proven
  defective mechanism to isolate in the two-sequential-read provider-free red.
