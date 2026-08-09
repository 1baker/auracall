# ChatGPT Payload Settlement Installed Pass-50 Canary | 0234-2026-08-09

State: OPEN
Lane: P01
Plan version: 1
Gate state: OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED
Goal execution state: ACTIVE_ONE_INSTALLED_CANARY

## Stable Goal Objective

Install the pushed Plan 0233 payload-reader settlement repair exactly once,
restart only the AuraCall API exactly once, prove source/installed parity and
the stopped runtime boundary, then run exactly one `wsl-chrome-3`
`maxItems=1` pass-50 canary. Monitor its one child and parent to a terminal
result and stop. Do not retry, resume the scheduler, resume any wider
completion, control a provider guard, or start any separate materialization.

## Current State

- Plan 0233 closed provider-free at pushed commit `49868b4d`. The exact real
  adapter regression failed red with a completed exact response body and an
  enclosing reader still pending, then passed after the governed reload was
  made concurrent with body settlement.
- Provider-free validation passed ChatGPT adapter 151/151, browser-service UI
  54/54, TypeScript typecheck, production build, scoped Biome, plan audit, and
  diff hygiene.
- Plan 0232 previously proved the retained `wsl-chrome-3` account/browser lane
  authenticated and response detail retrievable, then closed its exact browser.
  That evidence is historical and does not replace current preflight.
- Last retained stopped-runtime evidence was API PID 32737 with zero restarts,
  target blocked/pass 49/force null, active history jobs zero, wider ChatGPT
  completions paused at `7/2/34`, scheduler paused/idle, provider guard clear,
  and exact-profile browser process count zero. Every field must be freshly
  reread before installation and again before the canary.
- The operator authorized this bounded installed canary with `ok go` after the
  Plan 0233 closeout recommendation. That approval does not authorize a retry,
  scheduler resume, wider completion resume, or a second child.

## External Gates

1. Plan 0233 is closed, validated, committed, and pushed: satisfied by
   `49868b4d`.
2. The operator gives fresh approval for exactly this installed canary:
   satisfied by `ok go` on 2026-08-09.
3. This Plan 0234 `OPEN` transition is audited, committed, and pushed.
4. Fresh readback proves source build health; API active/running with no crash
   restart; scheduler paused/idle; active jobs and queued/running work zero;
   target blocked/pass 49/force null with `maxItems=1`; wider completions paused
   at `7/2/34`; canonical ChatGPT guard clear; and no exact `wsl-chrome-3`
   browser process.

No install, restart, provider/browser call, completion control, or
materialization effect is allowed while any gate remains unmet.

## Frozen Effect Packet After All Gates

1. Build current pushed source if necessary and record the source adapter
   SHA-256. Run `pnpm run install:user-runtime` exactly once and require the
   installed adapter SHA-256 to match before restart.
2. Restart `auracall-api.service` exactly once. Require a new active/running PID
   with zero crash restarts, exact adapter parity, scheduler paused, no active
   jobs, wider passes `7/2/34`, and target blocked/pass 49/force null.
3. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
4. Require pass `49 -> 50`, exactly one fresh child, and no pass 51. Monitor only
   that child, the parent, service health, stopped scheduler, active jobs, and
   the three wider ChatGPT completions until terminal.
5. Stop after the first terminal result. If an AuraCall-owned exact browser is
   retained, close only that exact browser/session and prove its process/port
   cleanup. Do not retry or resume anything.

## Terminal Classification

1. `C1_clean_payload_settlement`: one child reaches terminal success without
   `readConversationPayload` pending/timeout evidence, selected context and
   asset work are terminal, failed count is zero, and the parent settles
   without `account_mirror_materialization_failed`.
2. `C2_repeated_payload_timeout`: the child again times out or remains pending
   at `provider:chatgpt.readConversationPayload`. Stop with no retry and return
   to provider-free ownership/cleanup diagnosis.
3. `C3_auth_or_challenge_stop`: login loss, wrong identity, CAPTCHA, challenge,
   verification, `Answer now`, provider guard, or profile/process mismatch.
   Stop and clean up the exact browser without another provider action.
4. `C4_other_terminal_failure`: any other child or parent failure, ambiguous
   fanout, pass drift, second child, API fault, scheduler drift, or wider-target
   movement. Stop and preserve bounded metadata for a successor diagnosis.

## Acceptance Criteria

- [ ] All four external gates are satisfied before effects.
- [ ] Exactly one install and one API restart produce source/installed adapter
  parity and preserve stopped-runtime state.
- [ ] Exactly one `wsl-chrome-3` `run-one-pass` advances pass 49 to 50 and
  creates exactly one fresh child under `maxItems=1`.
- [ ] Exactly one C1-C4 terminal classification is recorded without retry.
- [ ] Exact child/parent evidence distinguishes payload-reader settlement from
  authentication, challenge, provider guard, or unrelated failure.
- [ ] API returns healthy, active jobs return zero, scheduler remains paused,
  wider completions remain paused at `7/2/34`, and any exact browser is closed.
- [ ] No second install/restart/canary, scheduler or wider-completion resume,
  guard control, prompt submission, click, `Answer now`, direct runtime JSON
  edit, or separate materialization start occurs.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_completion_controls: 1`;
  `max_fresh_children: 1`; `max_child_attempts: 1`; `max_pass_advance: 1`;
  `max_browser_launches: 1`; `max_browser_closes: 1`;
  `max_scheduler_controls: 0`; `max_other_completion_controls: 0`;
  `max_guard_controls: 0`; `max_separate_materialization_starts: 0`;
  `max_retries: 0`; `max_prompt_submissions: 0`; `max_browser_clicks: 0`;
  `max_answer_now_clicks: 0`; `max_direct_runtime_json_edits: 0`;
  `max_wider_resumes: 0`; `max_subagents: 0`.

## Hard Stops

- Stop before installation unless Plan 0234 is audited, committed, pushed, and
  every fresh runtime precondition matches the frozen packet.
- Stop before the canary unless install parity, the one API restart, and the
  full stopped-runtime recheck pass.
- Stop on login loss, wrong identity, CAPTCHA, challenge, verification,
  `Answer now`, guard activation, process/profile mismatch, target/pass drift,
  scheduler movement, active-job pressure, or wider-completion movement.
- Stop after the first terminal child/parent classification. No outcome grants
  a retry, second pass, scheduler resume, wider completion resume, or separate
  materialization authority.

## Checkpoint 1 | One Installed Canary Opens Behind Runtime Readback

- `checkpoint_id`: `P0234-C01`.
- `state_transition`: P0233_CLOSED_PROVIDER_FREE_GREEN_LIVE_WITHHELD ->
  P0234_OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED.
- `progress_classification`: outcome_progress.
- `authority_classification`: exactly one install, one API restart, and one
  exact `wsl-chrome-3` pass-50 canary are approved after all external gates;
  retries, scheduler/wider resume, guard control, and separate materialization
  remain excluded.
- `evidence`: pushed repair `49868b4d`; deterministic red-to-green regression;
  adjacent provider-free validation; operator `ok go`.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: one installed end-to-end proof is necessary to
  validate the repaired callback settlement in the actual AuraCall ownership
  and retained-session path. The prior metadata browser canary is prerequisite
  evidence, not a substitute for the product canary.
- `next_action_or_stop_reason`: audit, commit, and push this gate, then perform
  the complete fresh readback. Stop on any mismatch; otherwise consume the one
  install/restart/canary packet and close at its first terminal result.
