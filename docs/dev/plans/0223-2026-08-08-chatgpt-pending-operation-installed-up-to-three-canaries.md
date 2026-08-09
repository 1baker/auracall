# ChatGPT Pending-Operation Installed Up-To-Three Canaries | 0223-2026-08-08

State: CLOSED
Lane: P01
Plan version: 1
Gate state: COMPLETE_ATTEMPTS_EXHAUSTED_FAIL_CLOSED
Goal execution state: COMPLETE

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

- [x] Plan artifact is audited, committed, and pushed before effects.
- [x] Exactly one install and one API restart produce source/runtime parity and
  a healthy stopped-control preflight.
- [x] Between one and three fresh serialized `wsl-chrome-3` canaries settle;
  no fourth canary occurs.
- [x] Every failed attempt has exact terminal child metrics and promoted
  `lastStage` / `pendingOperation` evidence before another attempt.
- [x] Execution stops early on clean proof or after attempt three.
- [x] Scheduler and wider completions never resume; no manual browser, prompt,
  `Answer now`, guard bypass, or direct runtime edit occurs.
- [x] Final runtime readback, plan audit, docs, commit, and push are complete.

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

## Checkpoint 2 | Canary Attempt 1 Failed With New Pending Evidence

- `checkpoint_id`: `P0223-C02`.
- `state_transition`: AUTHORIZED_GATE_PREPARED -> ATTEMPT_1_TERMINAL_FAILED.
- `progress_classification`: blocker_reduction.
- `activation_evidence`: the sole install produced source/installed adapter
  parity at `919e2529f2c2e59ad7d29d0b48377eac82ddf7aa8c04009012082d6d9509f4b9`;
  the sole restart produced API PID 95638 active/running with `NRestarts=0`
  while stopped controls remained unchanged.
- `canary`: the first control advanced pass `45 -> 46` and created exactly
  child `hmj_844540c7e0d94b45b50c5f092f74d22c`. It ran attempt one only and
  settled failed with conversations/materialized/skipped/failed `6/0/3/4`,
  eligible/selected `102/6`.
- `identity_and_guard`: provider session verdict `match`; email, plan,
  structure, and account-level dimensions all matched; candidate-funnel
  provider-guard exclusions were zero and all ChatGPT guards remained null.
- `receipt_evidence`:
  - one context succeeded in 17076 ms with `lastStage=complete` and
    `pendingOperation=null`;
  - conversation `6a568ccb-3938-83ea-a635-02dde7634d3f` timed out in 117084 ms
    at `lastStage=cdp:Runtime.evaluate`, `pendingOperation=null`;
  - conversation `6a563289-d5d8-83ea-9a2b-0e89e7078dff` timed out in 117094 ms
    at `lastStage=cdp:Runtime.evaluate`, `pendingOperation=null`;
  - conversation `6a5245ad-7180-83ea-a3e4-7d2e81015af9` timed out in 117084 ms
    after `provider:chatgpt.skipSameRouteNavigation` with
    `pendingOperation=provider:chatgpt.readConversationPayload`;
  - conversation `6a5245f5-0b10-83ea-b8fd-fa664bb743c5` timed out in 116974 ms
    after the same completed marker with the same pending payload operation.
- `post_attempt_boundary`: parent is blocked/pass 46 with force ceiling null;
  API PID 95638 remains healthy with zero restarts; scheduler is paused; active
  jobs and queued/running work are zero; wider passes remain `7/2/34`; guards
  remain null.
- `effect_accounting`: installs 1/1, restarts 1/1, canaries 1/3, target
  completion controls 1/3, scheduler controls 0, wider controls 0.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: clean-canary proof is blocking and unmet;
  attempt 1 newly localizes two failures to the payload read while two remain
  only CDP-localized. No safety hard stop fired.
- `next_action_or_stop_reason`: execute serialized attempt 2 under the
  unchanged target, controls, and cumulative bounds.

## Checkpoint 3 | Canary Attempt 2 Repeats Payload-Read Stall

- `checkpoint_id`: `P0223-C03`.
- `state_transition`: ATTEMPT_1_TERMINAL_FAILED ->
  ATTEMPT_2_TERMINAL_FAILED.
- `progress_classification`: blocker_reduction.
- `canary`: the second control honored `nextAttemptAt`, advanced pass
  `46 -> 47`, and created exactly child
  `hmj_602f46d472904c5b8b7b6146de9d9e66`. It ran attempt one only and settled
  failed with conversations/materialized/skipped/failed `6/0/3/4`,
  eligible/selected `102/6`.
- `identity_and_guard`: provider session verdict `match`; all four identity
  dimensions matched; candidate-funnel provider-guard exclusions were zero and
  all ChatGPT guards remained null.
- `receipt_evidence`:
  - one context succeeded in 13974 ms with `lastStage=complete` and
    `pendingOperation=null`;
  - the same four failed conversations timed out in 116842, 116842, 116814,
    and 116775 ms;
  - every timeout retained
    `lastStage=provider:chatgpt.skipSameRouteNavigation` and
    `pendingOperation=provider:chatgpt.readConversationPayload`.
- `post_attempt_boundary`: parent is blocked/pass 47 with force ceiling null;
  API PID 95638 remains healthy with zero restarts; scheduler is paused; active
  jobs and queued/running work are zero; wider passes remain `7/2/34`; guards
  remain null.
- `effect_accounting`: installs 1/1, restarts 1/1, canaries 2/3, target
  completion controls 2/3, scheduler controls 0, wider controls 0.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: clean-canary proof remains blocking and unmet;
  attempt 2 removes attempt 1's two CDP-only ambiguities by localizing all four
  repeated timeouts to the payload read. No safety hard stop fired.
- `next_action_or_stop_reason`: execute attempt 3 as the final bounded
  variability probe. Stop afterward regardless of outcome; no fourth attempt.

## Checkpoint 4 | Attempt 3 Terminal And Three-Canary Bound Exhausted

- `checkpoint_id`: `P0223-C04`.
- `state_transition`: ATTEMPT_2_TERMINAL_FAILED ->
  COMPLETE_ATTEMPTS_EXHAUSTED_FAIL_CLOSED.
- `progress_classification`: outcome_progress.
- `canary`: the third control honored the completion pacing guard, advanced
  pass `47 -> 48`, and created exactly child
  `hmj_601b75e3057d4902b2645cf92cd2fd9c`. It ran attempt one only and settled
  failed with conversations/materialized/skipped/failed `6/0/3/4`,
  eligible/selected `102/6`.
- `identity_and_guard`: provider session verdict `match`; all four identity
  dimensions matched; candidate-funnel provider-guard exclusions were zero and
  all ChatGPT guards remained null.
- `receipt_evidence`:
  - one context succeeded in 13368 ms with `lastStage=complete` and
    `pendingOperation=null`;
  - the same four failed conversations timed out in 116595, 116535, 116572,
    and 116525 ms;
  - the first timeout retained `lastStage=cdp:Runtime.evaluate` and
    `pendingOperation=null`; the other three retained the completed same-route
    marker with `pendingOperation=provider:chatgpt.readConversationPayload`.
- `three_attempt_summary`: the three controls created exactly three distinct
  children, each ran once, and advanced only passes `45 -> 46 -> 47 -> 48`.
  Aggregate job metrics are conversations/materialized/skipped/failed
  `18/0/9/12`. Of 12 timeout receipts, nine name the pending payload read and
  three remain CDP-localized with pending operation null. No clean canary was
  obtained and no fourth control occurred.
- `final_runtime_boundary`: source and installed adapter SHA-256 parity remains
  `919e2529f2c2e59ad7d29d0b48377eac82ddf7aa8c04009012082d6d9509f4b9`;
  API PID 95638 is active/running with `NRestarts=0`; scheduler state/posture is
  paused; foreground, queued/running work, and active history jobs are zero;
  wider passes remain `7/2/34`; target is blocked/pass 48 with force ceiling
  null; all ChatGPT guards are null and browser health is idle.
- `effect_accounting`: installs 1/1, restarts 1/1, canaries 3/3, target
  completion controls 3/3, scheduler controls 0, wider controls 0, manual
  browser navigations 0, prompts 0, `Answer now` clicks 0, guard bypasses 0,
  direct runtime JSON edits 0.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: clean-canary proof remains unmet. The repeated
  pending payload-read signature is blocking for another live attempt; further
  retry is rejected because the explicit cumulative bound is exhausted.
- `next_action_or_stop_reason`: stop fail-closed. Any successor should
  reproduce and repair the live payload-read boundary provider-free before a
  separately authorized canary; scheduler and wider completion resume remain
  excluded.
