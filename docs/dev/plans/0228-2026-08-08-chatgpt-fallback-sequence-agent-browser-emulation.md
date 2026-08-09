# ChatGPT Fallback-Sequence Agent-Browser Emulation | 0228-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_EXACT_PROFILE_DIRECT_EMULATION
Goal execution state: ACTIVE_TURN_1_OF_10

## Stable Goal Objective

Run one fresh agent-browser session against one freshly launched exact
AuraCall-managed `wsl-chrome-3` browser and emulate the production payload
sequence for known failed conversation
`6a5245ad-7180-83ea-a3e4-7d2e81015af9`: same-route page, direct authenticated
404, network tracking, one reload, exact conversation response selection, and
one bounded response-body detail read. Retain only milestones and metadata,
then close the browser. Do not change source, install, restart, materialize,
control a completion, or resume the scheduler.

## Current State

- The installed Plan 0226 repair has exact source/runtime adapter parity at
  `14668c680a393fd89495c97005486471d3535f9084de0c630e4d0887d8dc6045`.
- Plan 0227's only canary failed `6/0/3/4`. All four failed contexts timed out
  once near 115.1 seconds after the same-route marker with pending operation
  `provider:chatgpt.readConversationPayload`; the known target conversation
  failed in 115148 ms.
- The provider-free test proves a never-settling fallback `getResponseBody`
  resolves null at 9001 ms after repair, but the live receipt proves the
  overall payload reader still does not settle within 115 seconds.
- API PID 32737 is active/running with `NRestarts=0`; scheduler is paused;
  active jobs are zero; wider completions remain paused at `7/2/34`; target is
  blocked/pass 49 with force ceiling null; guards are null; the canary browser
  is closed.

## Authority And Effect Boundary

- The operator requires this direct agent-browser emulation after an
  unsuccessful canary. This plan is the bounded browser-effect packet.
- Launch exactly one browser with AuraCall `browser-tools`, using the exact
  managed directory
  `~/.auracall/browser-profiles/wsl-chrome-3/chatgpt`. Bind agent-browser to
  the actual DevTools port owned by that exact PID; do not use agent-browser's
  same-named but different managed profile.
- One root launch, one conversation-route navigation, one direct authenticated
  payload GET, one network-log clear, one page reload, one exact response-list
  read, and one response-detail/body request are authorized.
- The direct GET retains only status, elapsed time, body length, JSON parse
  state, and mapping count. The response-detail command must pipe its JSON
  directly into a metadata-only reducer; raw body, headers, cookies, identity
  payloads, and conversation content may not reach stdout or a file.
- Apply a 9000-ms in-page abort to the direct GET and a 15000-ms outer deadline
  to response-detail retrieval. A timeout is terminal evidence; do not retry.
- Read URL/title and a bounded DOM snapshot before the probe. Stop on CAPTCHA,
  challenge, verification, login loss, wrong origin, wrong profile/PID/port,
  provider guard, or stopped-runtime drift. Never click `Answer now`.
- Close only the exact launched browser/session after terminal evidence or a
  hard stop.
- Source edits, tests beyond probe-command validation, install, restart,
  materialization, completion/scheduler controls, prompt/composer actions,
  clicks, guard bypass, direct runtime edits, and retries are excluded.

## Ranked Discrepancy Predictions

1. `D1_response_body_live_stall`: reload emits the exact 2xx conversation API
   response, but agent-browser response detail exceeds 15 seconds. This would
   align with an unsettled live `Network.getResponseBody` and show the generic
   promise wrapper is not reaching/settling the enclosing reader as expected.
2. `D2_no_exact_reload_response`: the reload never emits a 2xx exact
   conversation API request. The production fallback would then rely on its
   10-second outer no-response timer; a 115-second pending reader would imply a
   different await or timer suppression.
3. `D3_body_retrievable`: exact response detail returns within 15 seconds with
   a parseable full mapping. This rejects response-body transport as the live
   stall and shifts the discrepancy to callback ordering, target/session
   ownership, or an earlier/later payload-reader await.
4. `D4_direct_path_changed`: the same-route direct GET is no longer the quick
   404 observed in Plan 0225. This indicates live provider/path drift and makes
   the prior fallback assumption stale.
5. `D5_challenge_or_identity`: the fresh surface shows challenge, login loss,
   or wrong identity. This is a hard stop, not evidence for code repair.

## Execution Packet

1. Audit, commit, and push this packet before browser effects. Reconfirm clean
   synchronized repo, API health, scheduler paused, jobs zero, wider passes
   `7/2/34`, target blocked/pass 49/force null, guards null, and no exact
   managed-browser process.
2. Launch once with:
   `pnpm tsx scripts/browser-tools.ts --auracall-profile wsl-chrome-3 --browser-target chatgpt start`.
   Resolve the actual PID/port and prove the exact managed directory.
3. Attach one named agent-browser session to that actual port. Read URL/title
   and a bounded snapshot; stop on D5.
4. Navigate once to
   `https://chatgpt.com/c/6a5245ad-7180-83ea-a3e4-7d2e81015af9`, then re-read
   URL/title/challenge state.
5. Run one direct authenticated GET with a 9000-ms abort and metadata-only
   result. Require terminal D4/non-D4 classification.
6. Clear agent-browser's network log, reload once, and list only requests whose
   URL exactly matches the conversation API path or that path plus query.
7. If one exact 2xx response exists, issue one response-detail request under a
   15000-ms outer deadline and reduce it in-pipe to status, elapsed time, body
   length, parse state, and mapping count. If no exact 2xx exists, classify D2.
8. Close the named agent-browser session/exact browser, verify the PID/port are
   gone, and re-read stopped runtime boundaries.
9. Record exact evidence, close the plan, audit/diff-check, commit, and push.
   Stop before any source change or further canary.

## Acceptance Criteria

- [ ] Authority artifact is audited, committed, and pushed before effects.
- [ ] Exactly one exact-profile browser is launched and agent-browser attaches
  only to its actual live port.
- [ ] Healthy authenticated ChatGPT and absence of challenge are proven before
  the sequence.
- [ ] One direct GET, one reload, one exact response selection, and at most one
  bounded response-detail request produce metadata-only terminal evidence.
- [ ] At least one D1-D5 discrepancy prediction is accepted/rejected without
  raw provider content retention.
- [ ] Exact browser/session is closed and stopped runtime boundaries remain
  unchanged.
- [ ] Final docs, plan audit, diff hygiene, commit, and push are complete.

## Local Goal Bounds

- `max_browser_launches: 1`; `max_initial_navigations: 1`;
  `max_conversation_navigations: 1`; `max_page_reloads: 1`;
  `max_direct_payload_gets: 1`; `max_network_log_clears: 1`;
  `max_exact_response_lists: 1`; `max_response_detail_reads: 1`;
  `max_agent_browser_attaches: 1`; `max_bounded_snapshots: 2`;
  `max_browser_closes: 1`; `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_browser_clicks: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Hard Stops

- Stop on profile/PID/port mismatch, login loss, wrong origin, CAPTCHA,
  challenge, verification, provider guard, stopped-control drift, raw-content
  exposure risk, or more than one exact 2xx response candidate.
- Stop after the first direct GET, reload, response-list read, or
  response-detail attempt respectively; do not retry a timeout or empty result.
- Stop on any need for source modification, install, restart, materialization,
  completion/scheduler control, click, prompt, `Answer now`, guard bypass, or
  runtime edit.
- This diagnostic does not authorize another canary or scheduler/wider resume.

## Checkpoint 1 | Exact Fallback Emulation Prepared

- `checkpoint_id`: `P0228-C01`.
- `state_transition`: P0227_COMPLETE_CANARY_UNSUCCESSFUL_AGENT_BROWSER_PREPARED
  -> P0228_AUTHORIZED_EXACT_PROFILE_DIRECT_EMULATION.
- `progress_classification`: blocker_reduction.
- `authority_classification`: standing operator requirement for a fresh direct
  agent-browser emulation after an unsuccessful canary.
- `evidence`: exact pass-49 child, terminal metrics, four promoted pending
  payload-read receipts, source/installed parity, and stopped runtime above.
- `effect_accounting`: launches 0/1, conversation navigations 0/1, reloads 0/1,
  direct GETs 0/1, response details 0/1, closes 0/1; excluded effects zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: D1-D4 are admitted as mutually distinguishing
  live sequence outcomes; D5 is safety-only.
- `next_action_or_stop_reason`: audit, commit, and push, then execute the one
  exact-profile metadata-only session and stop before source/canary work.
