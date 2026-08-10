# Default Context-Timeout Agent-Browser Falsification | 0252-2026-08-10

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_DIRECT_INSPECTION
Goal execution state: ACTIVE

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
  same-route ready surface without another physical navigation, and run one
  metadata-only emulation of payload fetch, post-payload readiness, paged
  message counting/length aggregation, and visible file/artifact counts.
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
  downloads, reloads, direct runtime-state edits, and retries are excluded.

## Ranked Hypotheses And Predictions

1. `H1_payload_read`: same-route readiness settles, but the authenticated
   payload fetch/body/parse sequence fails or times out. The first failed
   milestone will be payload headers/body/parse, while the control settles.
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
  `max_page_reloads: 0`; `max_browser_clicks: 0`; `max_downloads: 0`;
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
- Stop the whole packet on any need for reload, click, download, prompt,
  `Answer now`, materialization, completion/scheduler control, install/restart,
  source repair, guard bypass, or runtime edit.
- This inspection does not authorize a canary or scheduler resume.

## Acceptance Criteria

- [x] Exact routes, control, effect bounds, and falsifiable hypotheses are
  recorded before browser work.
- [ ] One exact-profile browser and one agent-browser attachment are used.
- [ ] All five routes receive metadata-only terminal classifications or the
  first safety hard stop is recorded.
- [ ] The first non-settling production-equivalent operation is identified, or
  H5 is accepted with the page-operation diagnosis rejected.
- [ ] The exact browser closes and scheduler/completion/jobs remain stopped.
- [ ] Final documentation, audit, Git cleanliness, commit, and push agree.

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

## Definition Of Done

The exact five-route browser sequence identifies the first non-settling
operation or rejects the page-operation diagnosis, the owned browser is closed,
and all wider runtime controls remain stopped.
