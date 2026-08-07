# WSL Chrome 2 Provider-Session Observation Recovery | 0212-2026-08-07

State: OPEN
Lane: P01
Plan version: 2
Outcome: PAUSED_RETRYABLE_WSL_CHROME_3_TIMEOUT
Goal execution state: RECOVERY_RETRY_GATE
Gate state: WSL_CHROME_3_ONE_PASS_RETRY

## Stable Goal Objective

Diagnose and repair the exact `wsl-chrome-2` ChatGPT provider-session
observation failure, then continue one-at-a-time recovery of the four intended
ChatGPT live-follow targets and resume the scheduler last. Preserve strict
account identity, CAPTCHA, provider-guard, and no-prompt boundaries.

## Current State

- Plan 0211 repaired and installed the cross-asset capture gate. Its exact
  `.txt` canary succeeded and default pass 6 settled cleanly with child job
  materialized/skipped/failed `1/6/0`.
- Resuming `wsl-chrome-2` launched managed browser PID 16464 on DevTools port
  45013, then failed before materialization with
  `provider_session_observation_missing`. Its configured expected identity is
  the personal Pro account `consult@polymerconsultinggroup.com`.
- Default was re-paused at pass 6. `wsl-chrome-3` and `wsl-chrome-4` remain
  paused, `wsl-chrome-2` is terminal-failed at pass 31, the scheduler is
  paused, active history jobs are zero, and no guard is active.
- The operator completed the human login. Exact read-only browser evidence then
  showed the configured Personal Pro account, and replacement completion
  `acctmirror_completion_bc68cd94-3f8e-4c2d-bd40-fc4299a5e591` passed identity
  and two live-follow cycles. Its first two children succeeded with
  materialized/skipped/failed `4/3/0` and `2/5/0`.
- Default advanced to pass 7 and its child ended skipped with identity match and
  materialized/skipped/failed `0/7/0`. `wsl-chrome-3` advanced to pass 39, but
  child `hmj_a5a0e6beb28742e98f5e199b9f7bfcfd` failed `0/5/2`. Full receipt
  evidence identifies two independent 120-second conversation-context timeouts,
  with identity match and zero download attempts.
- The rollout stopped at that gate. Default and the replacement `wsl-chrome-2`
  completion are paused, `wsl-chrome-3` is blocked, `wsl-chrome-4` remains
  paused, the scheduler remains paused, and active history jobs are zero.

## Authority And Scope

- Standing goal authority covers provider-free diagnosis, one read-only
  agent-browser inspection of the exact existing `wsl-chrome-2` managed
  browser, an evidence-driven local repair if account state is healthy, and one
  bounded recovery attempt after audited/pushed/installed parity.
- Inspection may read URL, title, visible authentication/account state,
  dialogs, CAPTCHA/guard state, and basic interactivity. It may not click,
  navigate, sign in, submit a prompt, select a model, or use `Answer now`.
- If the expected account is logged out, ambiguous, challenged, or visibly
  different, stop for human interaction. Do not copy cookies, bootstrap from
  another source browser profile, fuzzy-merge identities, or retry automation.
- Gemini, Grok, account-library apply, direct runtime JSON edits, destructive
  browser lifecycle controls, and unrelated profiles remain excluded.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Execution Packets

1. **Read-only exact-profile inspection.** Attach only to DevTools port 45013
   without creating or navigating a page. Classify healthy expected account,
   human sign-in/challenge gate, or local observation defect.
2. **Provider-free repair gate.** If the expected account is visibly healthy,
   trace the observation path, add a red/green regression, validate the
   affected surface, and commit/push before one install/restart. If not, stop.
3. **One-target proof.** Permit one supported bounded recovery of only
   `wsl-chrome-2`; require authoritative identity, no guard, and stable
   completion state before another target.
4. **Staged remainder.** Resume `wsl-chrome-3`, then `wsl-chrome-4`, observe
   each, and resume the scheduler last. Re-pause plan-owned controls on any
   identity, guard, CAPTCHA, failure, or uncontrolled-fanout signal.
5. **Version-2 timeout recovery.** Because the failed rows have no provider
   asset identity, no transfer attempt, and are classified retryable rather
   than terminal family evidence, permit exactly one `run_one_pass` recovery
   on the blocked `wsl-chrome-3` completion. Keep every other completion and
   the scheduler paused until its completion cycle and child job settle. Stop
   on any repeated timeout, failure, identity/guard signal, or missing receipt.

## Local Goal Bounds

- `max_plan_versions: 2`; `max_source_commits: 1`; `max_closeout_commits: 2`;
  `max_read_only_browser_inspections: 1`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_provider_retries_before_repair: 0`;
  `max_wsl_chrome_2_recovery_attempts: 1`;
  `max_wsl_chrome_3_timeout_recovery_attempts: 1`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_completion_control_actions: 4`;
  `max_emergency_completion_pauses: 4`; `max_scheduler_resume_actions: 1`;
  `max_scheduler_pause_actions: 1`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [x] Exact managed-browser inspection distinguishes healthy expected account
  from sign-in/challenge/identity drift without mutation.
- [ ] If local code is at fault, focused regression and affected validation
  pass, committed and installed runtime hashes match, and the API is healthy.
- [x] `wsl-chrome-2` reaches a stable live-follow state with authoritative
  provider-session identity and no guard or materialization failure.
- [ ] Default, `wsl-chrome-2`, `wsl-chrome-3`, and `wsl-chrome-4` are the only
  enabled ChatGPT completion targets; scheduler is resumed last.
- [ ] Gemini, Grok, prompts, `Answer now`, and account-library apply remain
  unchanged and excluded.

## Hard Stops

- Stop immediately on login UI, account ambiguity/mismatch, CAPTCHA, provider
  guard, browser challenge, or missing exact managed target.
- Do not navigate, click, sign in, move cookies, restart a browser, or retry the
  failed completion before the inspection is adjudicated and any local repair
  is committed/pushed/installed.
- Do not resume another completion or the scheduler until `wsl-chrome-2` is
  authoritative and stable.
- After the version-2 gate, do not resume `wsl-chrome-4` or the scheduler until
  the sole `wsl-chrome-3` recovery pass and its child receipt are terminal and
  clean. A repeated timeout is a new fail-closed stop, not authority to retry.

## Checkpoint 1 | Successor Opened Fail-Closed

- `plan_version`: 1
- `checkpoint_id`: `P0212-C01`
- `state_transition`: P0211_STOPPED_FAIL_CLOSED -> READ_ONLY_BROWSER_INSPECTION.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0212 and canonical planning/runtime evidence only.
- `evidence`: exact completion error
  `provider_session_observation_missing`; managed PID 16464; port 45013;
  expected personal Pro identity; default and remaining intended targets
  paused; scheduler paused; active jobs zero.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: exact read-only browser classification; conditional
  local repair; one-target proof; staged remainder; final readbacks.
- `authority_classification`: bounded successor under unchanged standing
  live-follow re-enablement authority.
- `review_disposition_summary`: no new broad review; identity observation is
  the sole accepted blocking finding.
- `next_action_or_stop_reason`: audit, commit, and push this boundary, then use
  the one read-only exact-profile inspection.

## Checkpoint 2 | Exact Browser Is Signed Out

- `plan_version`: 1
- `checkpoint_id`: `P0212-C02`
- `state_transition`: READ_ONLY_BROWSER_INSPECTION -> AWAITING_HUMAN_GATE.
- `progress_classification`: blocker_reduction
- `owned_changes`: read-only exact managed-browser inspection and durable
  evidence only; no source, runtime, browser, or provider mutation.
- `evidence`: agent-browser attached to existing DevTools port 45013 and found
  exactly one tab at `https://chatgpt.com/`, title `ChatGPT`. Visible body text
  includes `Log in to get answers based on saved chats`, `Log in`, and `Sign up
  for free`; no authenticated account identity is present. There was no click,
  navigation, login attempt, CAPTCHA bypass, prompt, model selection, or
  `Answer now` action.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: a human must log the existing `wsl-chrome-2` managed
  browser into the configured `consult@polymerconsultinggroup.com` personal Pro
  account; after explicit confirmation, re-read identity and continue the
  bounded one-target proof.
- `authority_classification`: human authentication is a pre-existing security
  gate and is not delegated to automation.
- `review_disposition_summary`: local code defect rejected; the observed
  signed-out page fully explains `provider_session_observation_missing`.
- `next_action_or_stop_reason`: stop without retry or later-target resume until
  the operator completes login in the existing managed browser.

## Checkpoint 3 | Human Gate Cleared And WSL Chrome 2 Recovered

- `plan_version`: 2
- `checkpoint_id`: `P0212-C03`
- `state_transition`: AWAITING_HUMAN_GATE -> STAGED_REENABLEMENT.
- `progress_classification`: acceptance_progress
- `owned_changes`: exact read-only authentication readback, one replacement
  `wsl-chrome-2` completion, and staged completion controls only.
- `evidence`: visible authenticated `Consulting PCG` / `ChatGPT Pro` UI on the
  existing managed browser; replacement pass 1 child materialized/skipped/
  failed `4/3/0`; pass 2 child `2/5/0`; both provider-session verdicts match.
  Default pass 7 child ended `0/7/0` with identity match.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: clean `wsl-chrome-3` and `wsl-chrome-4` cycles, then
  scheduler resume and final target readback.
- `authority_classification`: standing re-enablement authority after the human
  authentication gate was explicitly cleared.
- `review_disposition_summary`: the signed-out account was the complete
  `wsl-chrome-2` observation cause; no observation-code repair was required.
- `next_action_or_stop_reason`: continue one target at a time and stop on the
  first failed child receipt.

## Checkpoint 4 | WSL Chrome 3 Stops On Retryable Context Timeouts

- `plan_version`: 2
- `checkpoint_id`: `P0212-C04`
- `state_transition`: STAGED_REENABLEMENT -> WSL_CHROME_3_ONE_PASS_RETRY.
- `progress_classification`: blocker_reduction
- `owned_changes`: emergency completion pauses, full-detail receipt diagnosis,
  and this narrowed one-pass recovery boundary only.
- `evidence`: `wsl-chrome-3` pass 39 itself reached `idle_waiting`, then child
  `hmj_a5a0e6beb28742e98f5e199b9f7bfcfd` ended failed with provider identity
  match and materialized/skipped/failed `0/5/2`. Both failed rows are snapshot
  refreshes that timed out after 120000 ms; neither row has provider asset
  identity or a local path, and scrape telemetry records downloads `0/0/0`.
  Installed classification treats timeout as `retryable`; timeout rows are not
  terminal asset-family evidence. Active history jobs are zero.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: one clean `wsl-chrome-3` recovery pass and child,
  `wsl-chrome-4`, scheduler-last resume, and final target audit.
- `authority_classification`: one bounded retry after evidence-based transient
  classification; no generic retry loop or terminal-evidence weakening.
- `review_disposition_summary`: identity drift, transfer failure, provider
  unavailability, and cross-asset capture are rejected by the receipt. The
  remaining issue is two retryable context-read timeouts.
- `next_action_or_stop_reason`: audit, commit, and push this boundary, then run
  exactly one `run_one_pass` on the blocked `wsl-chrome-3` completion while all
  other completion controls and the scheduler remain paused.
