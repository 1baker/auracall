# ChatGPT Pending-Operation Installed Up-To-Three Canaries | 0223-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_BOUNDED_LIVE_EXECUTION
Goal execution state: ACTIVE_BOUNDED_PACKET

## Stable Goal Objective

Install the pushed Plan 0222 pending-operation observability repair once,
restart only the AuraCall API once, then prepare and execute serialized fresh
`wsl-chrome-3` canaries until one proves clean or three attempts have settled.
Keep the scheduler and every wider completion paused.

## Current State

- Source is clean, pushed, and synchronized at `c806d607`; the repair commit is
  `77b8057b`.
- Rebuilt ChatGPT adapter SHA-256 is
  `919e2529f2c2e59ad7d29d0b48377eac82ddf7aa8c04009012082d6d9509f4b9`;
  installed runtime remains the prior
  `3917b2d213f3ee828117b0c2335f37980d1e2d0dc43881c0ff540465ba9e633d`.
- API PID 13464 is active/running with `NRestarts=0`. Scheduler state/posture is
  paused, foreground and queued/running work are zero, and active history jobs
  are zero.
- Default, `wsl-chrome-2`, and `wsl-chrome-4` are paused at passes `7/2/34`.
  All ChatGPT provider guards are null.
- Target completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446` is blocked at
  pass 45 with force ceiling null. Its last child
  `hmj_a3c6daa3e06d45a49889638047a4561f` is terminal failed at `6/0/3/4`.

## Authority And Scope

- The operator explicitly authorized preparation and execution of
  `wsl-chrome-3` canaries with a maximum of three attempts.
- One install and one API restart are authorized before the first canary so the
  pushed diagnostic field is actually present in installed receipts.
- Each canary is exactly one `run-one-pass` control on the target completion.
  Attempts are serialized; each prior child and parent must settle before the
  next control.
- Unused attempts are not consumed after a clean canary. No new micro-approval
  is required between attempts while the frozen goal, target, safety controls,
  and cumulative limits remain unchanged.
- Read-only monitoring may cover API/service health, scheduler posture, target
  completion, fresh children and receipts, active jobs, provider guards, and
  the three wider ChatGPT completions.
- No scheduler control, wider completion control, manual browser navigation,
  browser-tools mutation, prompt/composer action, `Answer now`, guard bypass,
  direct runtime JSON edit, second install, or second restart is authorized.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Execution Packet

1. Require clean synchronized source, the exact pre-install hashes and stopped
   runtime state above, null ChatGPT guards, and zero active history jobs.
2. Run `pnpm run install:user-runtime` exactly once. Require exact source /
   installed adapter SHA-256 parity.
3. Restart `auracall-api.service` exactly once. Require active/running,
   `NRestarts=0`, unchanged scheduler posture, zero active jobs, unchanged
   wider targets, and target blocked/pass 45 with force ceiling null.
4. For attempt `N` in `1..3`, issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
5. Bind the returned pass and sole fresh child. Monitor until child and parent
   are terminal. Audit full child metrics and each promoted context-read
   receipt, including both `lastStage` and `pendingOperation`.
6. Stop successfully on the first clean canary. Otherwise continue only after
   reconfirming a terminal child, zero active jobs, healthy API, paused
   scheduler, unchanged wider passes, null provider guard, no CAPTCHA/human
   verification, and no unauthorized browser/composer mutation.
7. After attempt three, stop regardless of outcome and close with the exact
   terminal evidence. Do not resume scheduler or wider completions.

## Clean Canary Proof

- Exactly one fresh child is created by the attempt and reaches a terminal
  state without retry or reuse.
- Provider identity matches all four bound dimensions and provider-guard
  exclusions remain zero.
- No conversation-context timeout or other retryable failure remains; parent
  settles without `account_mirror_materialization_failed` and with force
  ceiling null.
- Materialization may succeed or legitimately skip already-local/unrouteable
  evidence, but no selected item may remain failed.
- Scheduler stays paused, wider passes stay `7/2/34`, active jobs return zero,
  and API remains healthy.

## Acceptance Criteria

- [ ] Plan artifact is audited, committed, and pushed before effects.
- [ ] Exactly one install and one API restart produce source/runtime parity and
  a healthy stopped-control preflight.
- [ ] Between one and three fresh serialized `wsl-chrome-3` canaries settle;
  no fourth canary occurs.
- [ ] Every failed attempt has exact terminal child metrics and promoted
  `lastStage` / `pendingOperation` evidence before another attempt.
- [ ] Execution stops early on clean proof or after attempt three.
- [ ] Scheduler and wider completions never resume; no manual browser, prompt,
  `Answer now`, guard bypass, or direct runtime edit occurs.
- [ ] Final runtime readback, plan audit, docs, commit, and push are complete.

## Local Goal Bounds

- `max_canary_attempts: 3`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_target_completion_controls: 3`; `max_scheduler_controls: 0`;
  `max_wider_completion_controls: 0`; `max_manual_browser_navigations: 0`;
  `max_browser_tools_mutations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`;
  `max_review_rework_cycles: 1`; `max_hardening_checkpoints: 0`;
  `checkpoint_interval: 1 canary`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: bounded_cumulative_attempts`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.

## Hard Stops

- Stop on CAPTCHA, human verification, auth/identity mismatch, provider guard,
  provider cooldown requiring bypass, API crash/restart, scheduler movement,
  wider completion movement, more than one child from a control, nonterminal
  prior child, active-job overlap, browser/composer mutation outside the
  governed product path, or any need to weaken an existing deadline/guard.
- A hard stop preserves remaining numeric attempts but does not authorize a
  workaround. Repeated failure without a clean proof stops after attempt three.
- No canary result authorizes scheduler or wider completion resume.

## Checkpoint 1 | Three-Canary Gate Prepared

- `checkpoint_id`: `P0223-C01`.
- `state_transition`: P0222_COMPLETE_PROVIDER_FREE ->
  P0223_AUTHORIZED_BOUNDED_LIVE_EXECUTION.
- `progress_classification`: outcome_progress.
- `authority_classification`: explicit operator authority for up to three
  serialized `wsl-chrome-3` canaries; install/restart are the necessary bounded
  activation step; scheduler and wider completion authority remain zero.
- `evidence`: clean synchronized source; exact source/installed hash mismatch;
  API PID 13464 active/running with zero restarts; scheduler paused; active
  jobs zero; wider passes `7/2/34`; target blocked/pass 45; all ChatGPT guards
  null.
- `effect_accounting`: installs 0/1, restarts 0/1, canaries 0/3, target
  completion controls 0/3, scheduler controls 0, wider controls 0.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: no open blocking finding at preflight; any
  safety hard stop terminates the packet.
- `next_action_or_stop_reason`: audit, commit, and push this gate before the
  sole install.
