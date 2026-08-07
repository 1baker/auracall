# WSL Chrome 2 Provider-Session Observation Recovery | 0212-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: DIAGNOSING_IDENTITY_OBSERVATION
Gate state: READ_ONLY_BROWSER_INSPECTION

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

## Local Goal Bounds

- `max_plan_versions: 2`; `max_source_commits: 1`; `max_closeout_commits: 2`;
  `max_read_only_browser_inspections: 1`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_provider_retries_before_repair: 0`;
  `max_wsl_chrome_2_recovery_attempts: 1`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_completion_control_actions: 3`;
  `max_emergency_completion_pauses: 4`; `max_scheduler_resume_actions: 1`;
  `max_scheduler_pause_actions: 1`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [ ] Exact managed-browser inspection distinguishes healthy expected account
  from sign-in/challenge/identity drift without mutation.
- [ ] If local code is at fault, focused regression and affected validation
  pass, committed and installed runtime hashes match, and the API is healthy.
- [ ] `wsl-chrome-2` reaches a stable live-follow state with authoritative
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
