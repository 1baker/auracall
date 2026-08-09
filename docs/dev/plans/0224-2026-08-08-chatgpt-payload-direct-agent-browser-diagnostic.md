# ChatGPT Payload Direct Agent-Browser Diagnostic | 0224-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_BOUNDED_DIRECT_BROWSER_DIAGNOSTIC
Goal execution state: ACTIVE_BOUNDED_PACKET

## Stable Goal Objective

Plan and execute one bounded direct browser diagnostic that attaches
agent-browser to the exact AuraCall-managed `wsl-chrome-3` ChatGPT browser,
emulates the currently failing conversation-payload operation with explicit
milestones, and determines whether the live stall occurs during fetch headers,
body consumption, JSON parsing, or by-value transfer. Keep raw conversation
content out of every receipt and retain the scheduler, completion, and
materialization stop boundaries.

## Current State

- Plan 0223 exhausted three serialized canaries at passes `45 -> 48`. All three
  children failed `6/0/3/4`; nine of 12 timeout receipts named
  `provider:chatgpt.readConversationPayload` and three remained localized only
  to `cdp:Runtime.evaluate`.
- API PID 95638 is active/running with `NRestarts=0`. Scheduler state/posture is
  paused; foreground and queued/running work are zero; active history jobs are
  zero; wider ChatGPT completions remain paused at passes `7/2/34`; target is
  blocked/pass 48 with force ceiling null; all ChatGPT guards are clear.
- No AuraCall `wsl-chrome-3` Chrome process currently owns the exact managed
  browser profile. Its authoritative directory is
  `~/.auracall/browser-profiles/wsl-chrome-3/chatgpt`, its configured browser is
  `/usr/bin/google-chrome`, and its configured DevTools port is `45015`.
- Agent-browser 0.28.0 is healthy, but its same-named managed runtime profile is
  a different directory under `~/.agent-browser`. That profile is rejected for
  this diagnostic. AuraCall `browser-tools start` must launch the exact AuraCall
  profile; agent-browser may then attach only through CDP port `45015`.

## Authority And Effect Boundary

- The operator directed `plan and execute` after approving the proposed direct
  agent-browser inspection. This plan is the durable live-effect packet.
- One AuraCall-owned launch may open ChatGPT root on the exact managed profile.
  This single initial navigation is necessary because no retained target is
  alive. No conversation-route navigation, reload, click, input, prompt,
  composer action, or `Answer now` action is allowed.
- Agent-browser may attach to port `45015`, read URL/title/DOM challenge state,
  and run one payload diagnostic for known repeatedly failing conversation
  `6a5245ad-7180-83ea-a3e4-7d2e81015af9`.
- The diagnostic may issue exactly one authenticated GET to
  `/backend-api/conversation/<id>`. It must apply an in-page 9000-ms
  `AbortController`, an agent-browser action deadline, and an outer process
  deadline.
- The in-page operation may retain only a temporary marker containing stage,
  status, timing, content type, body length, parse outcome, and mapping count.
  It must not place the raw body in global page state, stdout, a file, repo
  artifact, service record, or diagnostic receipt.
- To test the by-value boundary without exposing content, the evaluation may
  return synthetic text equal to the body length only when length is at most
  16 MiB. Larger bodies skip the synthetic transfer and return bounded metadata.
  The raw evaluation result is discarded; the follow-up marker read is the
  only retained receipt.
- Close only the Chrome process bound to port `45015` after the marker is read
  or after any hard stop. Do not kill or modify any unrelated browser process.
- Provider-free docs and probe-command preparation are authorized. Source
  behavior changes, install, API restart, materialization, completion control,
  scheduler control, direct runtime JSON edits, and any retry are excluded.

## Ranked Hypotheses And Predictions

1. `H1_body_read`: the authenticated fetch receives headers, but
   `response.text()` does not settle. Prediction: the final marker remains
   `headers-received` until the abort or outer deadline.
2. `H2_cdp_by_value`: the body and bounded parse finish, but returning a large
   by-value result stalls CDP. Prediction: a post-timeout marker reads
   `return-ready` with a body length at or below the synthetic-transfer ceiling.
3. `H3_fetch_headers`: the provider request itself does not produce headers.
   Prediction: the marker remains `fetch-started` and records an abort/error.
4. `H4_payload_size_or_parse`: the payload body completes but is exceptionally
   large or JSON parsing is materially slow/fails. Prediction: the marker
   reaches `body-ready` with a large length or `parse-failed` with bounded error
   class only.
5. `H5_sequence_dependency`: the complete isolated probe settles within its
   inner deadline. Prediction: the marker reaches `return-ready` and the defect
   requires the broader context-reader navigation/session sequence rather than
   the standalone payload operation.

## Execution Packet

1. Audit, commit, and push this plan plus canonical authority wiring before any
   browser launch.
2. Re-read scheduler/completion/job/guard state and ensure no process owns the
   exact managed profile.
3. Launch once with:
   `pnpm tsx scripts/browser-tools.ts --auracall-profile wsl-chrome-3 --browser-target chatgpt start`.
   Require DevTools port `45015` and the exact managed profile path.
4. Attach agent-browser to `45015`; read URL and title and inspect a bounded DOM
   snapshot. Stop on wrong origin, login loss, CAPTCHA, challenge, verification,
   provider guard, or profile mismatch.
5. Run the single milestone evaluation with one authenticated payload GET,
   discarding its size-matched synthetic result. Do not retry.
6. Read only `window.__auracallP0224` bounded marker metadata. Classify the
   highest reached stage against H1-H5, then delete the marker.
7. Terminate only port-45015 Chrome, confirm it is gone, and re-read all stopped
   runtime boundaries.
8. Record exact evidence in this plan, `ROADMAP.md`, `RUNBOOK.md`, journal, and
   fix log. Validate plan audit/diff hygiene, commit, and push.

## Acceptance Criteria

- [ ] Authority artifact is audited, committed, and pushed before effects.
- [ ] Exactly one exact-profile browser launch and no unrelated browser effect
  occurs.
- [ ] Agent-browser attaches only to CDP 45015 and proves a healthy ChatGPT
  surface before the payload probe.
- [ ] Exactly one known-conversation payload GET settles or times out with a
  bounded final milestone; no raw content is retained.
- [ ] The result accepts/rejects at least one ranked hypothesis and states what
  remains unknown.
- [ ] Exact launched Chrome is closed and scheduler/completion/materialization
  boundaries remain stopped and unchanged.
- [ ] Final docs, plan audit, diff check, commit, and push are complete.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_browser_launches: 1`;
  `max_initial_navigations: 1`; `max_conversation_navigations: 0`;
  `max_page_reloads: 0`; `max_payload_gets: 1`;
  `max_payload_probe_attempts: 1`; `max_agent_browser_attaches: 1`;
  `max_marker_reads: 2`; `max_browser_closes: 1`;
  `max_synthetic_transfer_chars: 16777216`; `max_installs: 0`;
  `max_api_restarts: 0`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_browser_clicks: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Hard Stops

- Stop before the payload GET on profile mismatch, login loss, wrong origin,
  CAPTCHA, challenge, verification, provider guard, browser-profile lock, an
  unexpected live holder, or stopped-control drift.
- Stop after the first payload attempt regardless of outcome. A client timeout
  is evidence, not authority to retry.
- Stop if the probe would print, persist, or expose raw conversation content,
  credentials, cookies, identity payloads, or headers.
- Stop on any need for navigation, reload, click, provider mutation,
  materialization, completion control, scheduler control, install, or restart
  beyond the exact packet above.

## Checkpoint 1 | Direct Diagnostic Prepared

- `checkpoint_id`: `P0224-C01`.
- `state_transition`: P0223_COMPLETE_ATTEMPTS_EXHAUSTED_FAIL_CLOSED ->
  P0224_AUTHORIZED_DIRECT_DIAGNOSTIC_PREPARED.
- `progress_classification`: blocker_reduction.
- `authority_classification`: explicit operator direction to plan and execute
  the proposed bounded agent-browser diagnostic; wider runtime authority zero.
- `evidence`: source synchronized at `265215b9`; stopped runtime and profile
  facts above; agent-browser profile-name collision discovered and rejected.
- `effect_accounting`: browser launches 0/1, initial navigations 0/1, payload
  GETs 0/1, marker reads 0/2, browser closes 0/1; all excluded effects zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: exact AuraCall profile binding is blocking and
  resolved through AuraCall-owned launch plus agent-browser CDP attachment.
- `next_action_or_stop_reason`: audit, commit, and push this gate, then re-run
  stopped-state preflight before the sole launch.
