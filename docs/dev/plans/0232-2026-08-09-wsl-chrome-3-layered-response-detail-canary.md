# WSL-Chrome-3 Layered Response-Detail Canary | 0232-2026-08-09

State: PLANNED
Lane: P01
Plan version: 1
Gate state: AWAITING_FRESH_LIVE_APPROVAL
Goal execution state: PREPARED_NOT_AUTHORIZED

## Stable Goal Objective

Run one fresh exact-profile `wsl-chrome-3` agent-browser canary using Plan
0231's layered network metadata helper. Distinguish request-discovery client
acquisition/transport, request-discovery daemon-worker execution,
response-detail client acquisition/transport, and response-detail
daemon-worker execution without exposing raw network material. Close the exact
browser after the first terminal result. Do not install or restart AuraCall,
start materialization, control any completion or scheduler, or resume wider
work.

## Current State

- Plan 0230 proved the exact direct conversation request returns parseable JSON
  404 quickly, then its helper timed out before candidate selection because the
  5-second discovery deadline covered an 8.7-10.5-second agent-browser command
  path.
- Plan 0231 reproduced that boundary with a real provider-free child, added
  daemon-worker `--job-timeout-ms` values inside positive acquisition/transport
  envelopes, and made the terminal stage public without widening the redaction
  surface. Focused validation is green at 13/13.
- The prior exact browser/session is closed. At Plan 0230 closeout, API PID
  32737 was healthy with zero restarts; target completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446` remained
  blocked/pass 49/force null; active jobs were zero; wider ChatGPT completions
  were paused at `7/2/34`; scheduler was paused/idle; guard was null.
- Those runtime values are historical preconditions, not current proof. They
  must be reread after fresh approval and immediately before any browser launch.

## External Gates

1. Plan 0231 is closed, audited, committed, and pushed with a clean/synchronized
   worktree and exact focused validation: pending final closeout commit.
2. The operator gives fresh approval to consume exactly this one live browser
   canary after reviewing this frozen packet: not satisfied.
3. Current readback proves healthy API, target blocked/pass 49/force null,
   active jobs zero, wider completions and scheduler paused, guard null, and no
   exact-profile browser process: not yet reread.

No browser or provider action is allowed while any gate remains unmet.

## Authority After All Gates

- Launch exactly one AuraCall-owned ChatGPT browser for AuraCall runtime profile
  `wsl-chrome-3`; bind exactly one named agent-browser session to its actual
  PID, managed browser profile directory, and live DevTools port.
- Read root URL/title and one bounded snapshot. Stop on login loss, wrong
  identity/origin, challenge, CAPTCHA, verification, provider guard, process/
  port mismatch, or `Answer now`. Never click `Answer now`.
- Navigate once to conversation
  `6a5245ad-7180-83ea-a3e4-7d2e81015af9`; run one metadata-only direct payload
  GET with the existing 9-second in-page abort; clear tracked network requests
  once; reload once.
- Invoke only:
  `pnpm tsx scripts/browser-service/agent-browser-network-metadata.ts` with the
  exact session/port/URL, acquisition timeout 15000 ms, discovery-worker timeout
  5000 ms, detail-worker timeout 15000 ms, and output cap 8388608 bytes.
- Close the named session and exact browser immediately after the first
  terminal helper result. No retry, second reload, raw request listing/detail,
  source change, install/restart, materialization, completion/scheduler/guard
  control, or wider resume is authorized.

## Terminal Classification

1. `C1_discovery_command_timeout`: `outcome=timeout` and
   `stage=request_discovery_command`; acquisition/transport still exceeds the
   caller envelope. Stop provider-free for command-path diagnosis.
2. `C2_discovery_worker_timeout`: `outcome=timeout` and
   `stage=request_discovery`; request enumeration itself exceeded its daemon
   worker budget. Stop provider-free at request discovery.
3. `C3_detail_command_timeout`: one candidate selected, then
   `outcome=timeout` and `stage=response_detail_command`; response-detail
   acquisition/transport failed before a worker classification.
4. `C4_detail_worker_timeout`: one candidate selected, then
   `outcome=timeout` and `stage=response_detail`; this is direct live evidence
   that the bounded response-detail operation did not settle.
5. `C5_detail_completed`: `outcome=completed`, `stage=completed`, exact request
   and URL matches true, and status/body metadata retained. Use body
   presence/parse/mapping metadata to adjudicate the AuraCall callback/session
   ownership discrepancy; never retain content.
6. `C6_selection_or_harness_stop`: zero/ambiguous candidates, malformed shape,
   output limit, child failure, mismatch, or absent body. Stop without retry
   and return to the exact provider-free seam named by the result.

## Acceptance Criteria

- [ ] All three external gates are satisfied and recorded before launch.
- [ ] Exactly one fresh exact-profile browser and one named attachment run.
- [ ] Healthy authenticated identity/no-challenge proof precedes navigation.
- [ ] One direct metadata GET, one clear, one reload, and one layered helper
  invocation occur; no raw network output reaches stdout/stderr/artifacts.
- [ ] Exactly one C1-C6 classification is recorded without retry.
- [ ] Exact session/browser are closed and stopped runtime boundaries are
  reread unchanged.
- [ ] No install/restart, source, materialization, completion/scheduler/guard,
  prompt, click, `Answer now`, wider-resume, or direct runtime-edit effect
  occurs.

## Local Goal Bounds

- `max_browser_launches: 1`; `max_agent_browser_attaches: 1`;
  `max_conversation_navigations: 1`; `max_direct_payload_gets: 1`;
  `max_network_log_clears: 1`; `max_page_reloads: 1`;
  `max_metadata_helper_runs: 1`; `max_browser_closes: 1`;
  `max_installs: 0`; `max_api_restarts: 0`; `max_source_edits: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_controls: 0`;
  `max_wider_resumes: 0`; `max_browser_clicks: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Hard Stops

- Stop before launch unless fresh approval, committed Plan 0231 closeout, and
  every current stopped-runtime precondition are proven.
- Stop on profile/PID/port mismatch, login loss, wrong identity/origin,
  CAPTCHA, challenge, verification, provider guard, or stopped-runtime drift.
- Stop after the first helper result and close the exact browser. Never retry
  raw or reduced network inspection.
- Stop on any raw request ID, URL/query, header, cookie, body, stderr, child
  error, account identity, or credential reaching public output or artifacts.
- No result authorizes source repair, install/restart, materialization,
  completion/scheduler/guard control, another canary, or wider resume.

## Prepared Checkpoint | Fresh Canary Withheld

- `checkpoint_id`: `P0232-C01`.
- `state_transition`: P0231_CLOSED_LAYERED_DEADLINES_GREEN_CANARY_PREPARED ->
  P0232_PLANNED_AWAITING_FRESH_LIVE_APPROVAL.
- `progress_classification`: blocker_reduction.
- `authority_classification`: preparation only; live effects remain behind all
  three explicit gates.
- `evidence`: Plan 0230 exact live discrepancy and cleanup; Plan 0231 real-child
  red plus 13/13 green layered-deadline/redaction suite.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `next_action_or_stop_reason`: stop. After Plan 0231 closeout is pushed, wait
  for fresh operator approval, then reread all runtime gates before launch.
