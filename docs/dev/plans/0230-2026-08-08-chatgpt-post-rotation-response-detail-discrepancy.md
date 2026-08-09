# ChatGPT Post-Rotation Response-Detail Discrepancy | 0230-2026-08-08

State: PLANNED
Lane: P01
Plan version: 1
Gate state: AWAITING_CREDENTIAL_ROTATION_AND_FRESH_LIVE_APPROVAL
Goal execution state: READY_TURN_3_OF_10_AFTER_EXTERNAL_GATE

## Stable Goal Objective

After the operator confirms that the ChatGPT session exposed during Plan 0228
has been revoked or rotated and the exact `wsl-chrome-3` managed browser profile
has been reauthenticated, run one fresh exact-profile agent-browser discrepancy
session. Reproduce same-route direct 404, clear tracking, reload once, and use
Plan 0229's metadata-only request-discovery/detail helper to distinguish a
stalled response-body CDP read from a retrievable body and callback/session
ownership divergence. Close the exact browser and stop before source, canary,
materialization, scheduler, or wider-completion effects.

## Current State

- Plan 0227's sole installed pass-49 canary failed `6/0/3/4`; four contexts
  timed out near 115.1 seconds with pending operation
  `provider:chatgpt.readConversationPayload`.
- Plan 0228 proved direct JSON 404 in 177 ms and exactly one reload 200 response
  for the expected conversation API, then hard-stopped when raw agent-browser
  request-list JSON exposed sensitive authentication headers. D2 and D4 are
  rejected; D1 versus D3 remains unresolved.
- Plan 0229's provider-free harness captures a secret-bearing request list and
  detail internally, selects one exact 2xx candidate, applies independent
  discovery/detail deadlines and an output cap, and returns only closed-world
  metadata. Its red exposed all synthetic sentinels; its final focused suite is
  green at 10/10.
- The exact browser is closed. API PID 32737 is active/running with zero
  restarts; target remains blocked/pass 49/force null; scheduler and wider
  completions remain paused; active history jobs are zero.

## External Gates

1. Operator confirms the affected ChatGPT session was revoked or rotated.
2. Operator confirms the exact `wsl-chrome-3` managed browser profile was
   reauthenticated after rotation.
3. Operator gives fresh approval to consume this one live browser packet.
4. This plan is changed from `PLANNED` to `OPEN`, audited, committed, and pushed
   after those confirmations and before browser launch.

No browser or provider action is allowed while any gate remains unmet.

## Authority And Effect Boundary After All Gates

- Launch exactly one AuraCall-owned ChatGPT browser for runtime profile
  `wsl-chrome-3`; bind one named agent-browser session only to its actual PID,
  managed directory, and live DevTools port.
- Read root URL/title and one bounded snapshot. Stop on login loss, wrong
  identity, challenge, CAPTCHA, verification, provider guard, or process/port
  mismatch. Never click `Answer now`.
- Navigate once to known failed conversation
  `6a5245ad-7180-83ea-a3e4-7d2e81015af9`. Run one direct authenticated GET with
  a 9-second in-page abort and retain only status/timing/length/parse metadata.
- Clear tracked network requests once and reload once. Do not run raw
  agent-browser request-list or request-detail output. Invoke only the Plan 0229
  helper with the exact conversation API URL, a 5-second discovery deadline, a
  15-second detail deadline, and an 8 MiB output cap.
- Close the named session and exact browser after the first terminal helper
  outcome. Do not retry a timeout, missing body, empty candidate set, ambiguity,
  malformed result, output cap, or child failure.
- Source edits, install/restart, materialization, completion/scheduler controls,
  another canary, clicks, prompts, guard bypass, and direct runtime-state edits
  are excluded.

## Terminal Discrepancy Classification

1. `D1_response_body_live_stall`: helper discovery selects one exact 2xx
   candidate, but detail outcome is `timeout`. Current agent-browser source has
   only one post-lookup await in that handler—unbounded
   `Network.getResponseBody`—so this is live causal evidence for a response-body
   transport stall.
2. `D3_body_retrievable`: helper completes with body present, JSON parse state,
   and non-null mapping count. This rejects response-body transport and shifts
   the AuraCall discrepancy to callback ordering, CDP target/session ownership,
   or enclosing payload-reader settlement.
3. `D6_body_absent_after_detail`: helper completes but body is absent. Current
   agent-browser silently ignores `getResponseBody` errors, so this distinguishes
   a fast CDP error from a hang but requires provider-free error-observability
   work before another live probe.
4. `D7_request_selection_drift`: exact candidate count is zero or greater than
   one. Stop; do not choose heuristically or retry.
5. `D8_harness_terminal_failure`: output cap, malformed JSON, child failure, or
   request/detail mismatch. Stop and repair provider-free.

## Execution Packet After All Gates

1. Re-read relevant policies, convert this plan to `OPEN`, record rotation and
   approval without credential values, audit, commit, and push.
2. Reconfirm clean/synchronized repo, API health, target blocked/pass 49/force
   null, jobs zero, scheduler and wider completions paused, guards null, and no
   exact managed browser process.
3. Launch once, resolve exact PID/profile/live port, attach one named session,
   and prove healthy authenticated no-challenge surface.
4. Navigate once, run one direct metadata GET, clear tracking once, reload once,
   then run only the Plan 0229 metadata helper.
5. Record exactly one D1/D3/D6/D7/D8 terminal classification, close exact
   session/browser, and reread stopped runtime boundaries.
6. Close this plan, audit/diff-check, commit, and push. Stop before repair,
   install/restart, canary, materialization, completion, or scheduler effects.

## Acceptance Criteria

- [ ] All four external gates are evidenced before launch.
- [ ] Exactly one fresh exact-profile browser and one named attachment are used.
- [ ] Healthy authenticated identity and no challenge are proven before probe.
- [ ] One direct GET remains metadata-only; one clear and one reload occur.
- [ ] Only the Plan 0229 helper performs request discovery/detail, with raw
  agent-browser output absent from stdout, stderr, and repo artifacts.
- [ ] Exactly one D1/D3/D6/D7/D8 result is recorded without retry.
- [ ] Exact browser/session is closed and stopped runtime boundaries are
  unchanged.
- [ ] No excluded effect occurs; final docs/audit/commit/push are complete.

## Local Goal Bounds

- `max_browser_launches: 1`; `max_agent_browser_attaches: 1`;
  `max_conversation_navigations: 1`; `max_direct_payload_gets: 1`;
  `max_network_log_clears: 1`; `max_page_reloads: 1`;
  `max_metadata_helper_runs: 1`; `max_request_discoveries: 1`;
  `max_response_detail_reads: 1`; `max_browser_closes: 1`;
  `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_canaries: 0`;
  `max_browser_clicks: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Hard Stops

- Stop before launch unless credential rotation, reauthentication, fresh live
  approval, and committed `OPEN` authority are all proven.
- Stop on profile/PID/port mismatch, login loss, wrong identity/origin,
  CAPTCHA, challenge, verification, provider guard, or stopped-runtime drift.
- Stop after the first helper terminal outcome and close the exact browser;
  never retry raw or reduced request detail.
- Stop on any raw header, cookie, URL/query, identity, request ID, body, child
  stdout/stderr, or credential value reaching public output or repo artifacts.
- This plan never authorizes source repair, install/restart, materialization,
  completion/scheduler control, scheduler/wider resume, or another canary.

## Checkpoint 1 | Post-Rotation Probe Prepared And Gated

- `checkpoint_id`: `P0230-C01`.
- `state_transition`: P0229_PROVIDER_FREE_REDACTION_GREEN ->
  P0230_AWAITING_CREDENTIAL_ROTATION_AND_FRESH_LIVE_APPROVAL.
- `progress_classification`: blocker_reduction.
- `authority_classification`: plan preparation only; every live effect remains
  withheld behind explicit security and operator gates.
- `evidence`: Plan 0228 D2/D4 rejection and safety stop; Plan 0229 closed-world
  request discovery/detail reducer with real child timeout/output-cap proof.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: D1/D3 retained; D6-D8 added as fail-closed
  outcomes exposed by the current agent-browser handler and harness contract.
- `next_action_or_stop_reason`: wait for explicit credential rotation,
  reauthentication, and fresh approval. Do not launch or attach a browser.
