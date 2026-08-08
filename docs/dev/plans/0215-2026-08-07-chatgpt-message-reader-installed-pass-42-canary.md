# ChatGPT Message Reader Installed Pass-42 Canary | 0215-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: ACTIVE_INSTALL_AND_CANARY_GATE
Goal execution state: ACTIVE_RESUMED_SUCCESSOR
Gate state: INSTALL_PENDING

## Stable Goal Objective

Install the pushed Plan 0214 paged-message repair exactly once, restart only
the AuraCall API exactly once, prove installed hash and stopped-runtime parity,
then run and settle the frozen `wsl-chrome-3` pass-42 canary. Do not resume any
wider completion or the scheduler in this plan.

## Current State

- Pushed source commit `aa45e968` replaces one all-message `innerText`
  evaluation with ordered eight-node `textContent` pages. Each page has both a
  DevTools execution timeout and a transport timeout; source evidence was
  corrected and pushed through `18b41536`.
- Provider-free validation passes 339/339 across focused and adjacent suites,
  plus typecheck, zero-warning touched lint, production build, plan audit, and
  diff check.
- Built source adapter SHA-256 is
  `11f31a2e804a1ca7ff8856d053a61ab37d017500feb8a6e2fe2913306264b978`;
  installed runtime remains Plan 0213 hash
  `71d09b49c0857ee5f9116c24dbc514f4c1d25a098c47999be4c37f29413caef6`.
- API PID 14919 is active with zero restarts. Default is paused/pass 7,
  replacement `wsl-chrome-2` paused/pass 2, `wsl-chrome-4` paused/pass 34,
  `wsl-chrome-3` blocked/pass 41 with no force ceiling, scheduler paused, and
  active ChatGPT history jobs zero.

## Authority And Scope

- The operator explicitly authorizes one user-runtime install, one API service
  restart, exact source/installed adapter parity verification, and one existing
  `wsl-chrome-3` `run-one-pass` control expected to advance pass 41 to 42 and
  create one child.
- The packet may perform read-only monitoring of the exact parent, exact child,
  service, scheduler, and four intended ChatGPT targets until terminal proof.
- No source change, second install, second restart, second canary, retry,
  completion pause/resume outside the frozen action, scheduler control,
  Gemini/Grok change, prompt, `Answer now`, click, navigation, guard bypass,
  direct runtime JSON edit, or account-library apply is in scope.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Execution Packet

1. Audit and push this exact authority boundary while runtime posture remains
   unchanged.
2. Run `pnpm run install:user-runtime` once. Require installed adapter SHA-256
   to equal the built source hash.
3. Restart `auracall-api.service` once. Wait through startup without a second
   restart; require active/running, zero crash restarts, scheduler paused, all
   target states unchanged, and active jobs zero.
4. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
5. Require parent pass 42, force ceiling cleared after settlement, exactly one
   fresh child, matching provider identity, failed count zero, no context
   timeout, no guard/challenge, active jobs zero, and no pass 43 fanout.
6. Reconfirm default, replacement `wsl-chrome-2`, and `wsl-chrome-4` unchanged
   and scheduler paused. Close and push the exact receipt; do not resume wider
   work.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_authority_commits: 1`;
  `max_closeout_commits: 1`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_canary_controls: 1`;
  `max_canary_attempts: 1`; `max_child_jobs: 1`;
  `max_other_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_source_changes: 0`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [ ] One install and one restart produce installed/source adapter hash parity
  and a healthy API while scheduler/target posture remains frozen.
- [ ] The exact pass-42 canary creates exactly one fresh child and both settle
  without context timeout, materialization failure, identity mismatch, provider
  guard, challenge, or uncontrolled fanout.
- [ ] Default stays paused/pass 7, replacement `wsl-chrome-2` paused/pass 2,
  `wsl-chrome-4` paused/pass 34, scheduler paused, and active jobs return zero.
- [ ] No source, Gemini/Grok, prompt, `Answer now`, browser navigation/click,
  account-library, wider completion, or scheduler effect occurs.
- [ ] Exact receipts are recorded, audited, committed, and pushed.

## Hard Stops

- Stop on install mismatch, unhealthy service, unexpected target/scheduler
  movement, more than one child, pass 43, context timeout, failed
  materialization, identity mismatch, provider guard, CAPTCHA/challenge, or any
  prompt/composer mutation.
- A failed canary closes this plan fail-closed. No repair, install, restart,
  retry, pause, later-target control, or scheduler control is authorized here.
- A clean canary proves only `wsl-chrome-3` repaired-lane readiness. It does not
  authorize the wider staged re-enablement or scheduler resume.

## Checkpoint 1 | Exact Effect Gate Authorized

- `plan_version`: 1
- `checkpoint_id`: `P0215-C01`
- `state_transition`: P0214_CANARY_PREPARED_AWAITING_INSTALL_GATE ->
  ACTIVE_INSTALL_AND_CANARY_GATE.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0215 and canonical authority/runtime evidence only.
- `evidence`: source hash `11f31a...978`; installed hash `71d09b...aef6`;
  API PID 14919 active/zero restarts; target states paused 7, paused 2,
  blocked 41, paused 34; scheduler paused; active jobs zero.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: one install, one restart, parity, exact pass-42 parent
  and child settlement, unchanged wider-state audit, closeout push.
- `authority_classification`: explicit bounded effect authorization; only the
  frozen existing completion may be controlled once.
- `review_disposition_summary`: Plan 0214 provider-free evidence is accepted;
  live effectiveness remains unproved until this exact canary. Wider
  re-enablement and scheduler resume remain excluded.
- `next_action_or_stop_reason`: audit, commit, and push this gate; then install
  once and verify parity before restarting the API once.
