# ChatGPT Visible-File Scan Timeout Repair | 0213-2026-08-07

State: CLOSED
Lane: P01
Plan version: 1
Outcome: STOPPED_POST_REPAIR_MESSAGE_READ_TIMEOUT
Goal execution state: BLOCKED
Gate state: FAIL_CLOSED

## Stable Goal Objective

Repair the exact repeated `wsl-chrome-3` ChatGPT visible-file context-read
timeout, prove one post-repair completion cycle, then finish one-at-a-time
re-enablement of the four intended ChatGPT live-follow targets and resume the
scheduler last. Preserve strict identity, guard, CAPTCHA, and no-prompt rules.

## Current State

- Plan 0212 recovered authenticated `wsl-chrome-2`, proved default and
  replacement child receipts clean, and stopped twice on the same
  `wsl-chrome-3` conversation-context timeout.
- The sole retry made useful yield (`1/6/1`) but the remaining failed row again
  has no provider asset ID, no local path, and zero transfer evidence.
- The fresh context-read receipt binds the timeout to
  `provider:chatgpt.readVisibleConversationFiles` after one provider context
  attempt. The adapter's injected DOM reader can execute the full visible-file
  collection up to 20 times even after the conversation surface is ready.
- Default and replacement `wsl-chrome-2` are paused, `wsl-chrome-3` is blocked
  at pass 40, `wsl-chrome-4` is paused, scheduler is paused, active history
  jobs are zero, and API PID 57978 is healthy with zero restarts.

## Authority And Scope

- Standing re-enablement authority covers one local adapter repair, focused
  tests, one source commit/push, one install/restart, one exact post-repair
  `wsl-chrome-3` pass, then staged `wsl-chrome-4` and scheduler-last controls.
- The repair may bound the already-ready visible-file DOM scan and expose only
  a test seam. It may not weaken identity, guard, unavailable-asset,
  requested-asset, or completion failure semantics.
- No browser click/navigation, prompt, `Answer now`, direct runtime JSON edit,
  force materialization, Gemini/Grok change, or account-library apply is in
  scope.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Execution Packets

1. Add a red adapter regression proving a context's visible-file probe uses
   one bounded DOM collection rather than a repeated full-conversation scan.
2. Replace the 20-pass injected polling loop with one collection after the
   existing conversation-surface readiness gate; preserve normalization and
   the outer 10-second CDP timeout.
3. Run focused adapter tests, adjacent context/materialization/completion
   tests, typecheck, lint, and build; commit/push before install.
4. Install/restart once, prove source/installed parity and healthy service, then
   run one exact blocked `wsl-chrome-3` `run_one_pass` and settle its child.
5. Only after clean proof, resume `wsl-chrome-4`, settle its child, resume
   default and replacement `wsl-chrome-2`, then resume scheduler last and audit
   exactly four intended ChatGPT targets.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_source_commits: 1`; `max_closeout_commits: 1`;
  `max_repair_iterations: 1`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_wsl_chrome_3_post_repair_attempts: 1`;
  `max_completion_control_actions: 4`; `max_emergency_completion_pauses: 4`;
  `max_scheduler_resume_actions: 1`; `max_scheduler_pause_actions: 1`;
  `max_browser_clicks: 0`; `max_browser_navigations: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Acceptance Criteria

- [x] Red/green regression proves one visible-file DOM collection after the
  existing surface-readiness gate; normalization behavior remains covered.
- [x] Focused and adjacent tests, typecheck, lint, and build pass; source and
  installed runtime hashes match after one restart; API is healthy.
- [ ] `wsl-chrome-3` post-repair pass and child settle without context timeout,
  provider guard, identity failure, or failed materialization.
- [ ] Default, replacement `wsl-chrome-2`, `wsl-chrome-3`, and
  `wsl-chrome-4` are the only enabled ChatGPT completion targets; scheduler is
  resumed last.
- [ ] Gemini, Grok, prompts, `Answer now`, and account-library apply remain
  unchanged and excluded.

## Hard Stops

- Stop on a failed red/green repair, install mismatch, unhealthy service,
  repeated context timeout, provider guard, identity mismatch, CAPTCHA,
  challenge, materialization failure, or uncontrolled fanout.
- Do not resume `wsl-chrome-4`, the two paused clean completions, or scheduler
  before the exact post-repair `wsl-chrome-3` child is terminal and clean.
- A failed post-repair proof closes this plan blocked; no second repair or
  provider retry is authorized.

## Checkpoint 1 | Successor Opened On Exact Local Stage

- `plan_version`: 1
- `checkpoint_id`: `P0213-C01`
- `state_transition`: P0212_STOPPED_RETRYABLE_TIMEOUT_REPEATED -> PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0213 and canonical planning/runtime evidence only.
- `evidence`: two receipts repeat one 120000-ms timeout; the fresh receipt's
  last stage is `provider:chatgpt.readVisibleConversationFiles`; the injected
  ready-surface reader permits 20 full DOM collection attempts; all runtime
  controls remain stopped and active history jobs are zero.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: red/green repair, validation, install parity, exact
  post-repair proof, staged remainder, scheduler-last audit.
- `authority_classification`: bounded successor under unchanged standing
  live-follow re-enablement authority.
- `review_disposition_summary`: accepted blocking finding is only the repeated
  visible-file full-DOM polling loop. Identity, transfer, capture, and provider
  availability findings are rejected by current receipts.
- `next_action_or_stop_reason`: audit, commit, and push this boundary, then add
  the focused red regression before editing the adapter.

## Checkpoint 2 | Provider-Free Repair Is Green

- `plan_version`: 1
- `checkpoint_id`: `P0213-C02`
- `state_transition`: PROVIDER_FREE_REPAIR -> INSTALL_GATE.
- `progress_classification`: blocker_reduction
- `owned_changes`: `chatgptAdapter.ts`, its focused regression, and canonical
  plan/journal/fix evidence.
- `evidence`: the regression failed before export/repair and passes after the
  injected expression changed from up to 20 `collect()` calls to exactly one.
  Adapter tests pass 141/141; adjacent context/materialization/completion tests
  pass 183/183; typecheck, zero-warning touched Biome, and production build pass.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: source commit/push, one install/restart with parity,
  exact post-repair `wsl-chrome-3` proof, staged remainder, scheduler-last audit.
- `authority_classification`: provider-free local repair inside the successor's
  frozen write surface.
- `review_disposition_summary`: one ready-surface scan preserves the existing
  readiness gate, normalizer, 10-second wrapper, identity, and hard stops while
  removing repeated renderer work. No broader adapter finding is accepted.
- `next_action_or_stop_reason`: commit and push the green repair, install once,
  restart once, and verify source/runtime parity before provider work.

## Checkpoint 3 | Visible-File Fix Proved; Next Message-Read Stage Blocked

- `plan_version`: 1
- `checkpoint_id`: `P0213-C03`
- `state_transition`: INSTALL_GATE -> STOPPED_POST_REPAIR_MESSAGE_READ_TIMEOUT.
- `progress_classification`: blocker_reduction
- `owned_changes`: installed Plan 0213 adapter repair and exact one-pass runtime
  proof only; no second repair or provider retry.
- `evidence`: repo and installed adapter SHA-256 both
  `71d09b49c0857ee5f9116c24dbc514f4c1d25a098c47999be4c37f29413caef6`;
  API PID 14919 is active with zero restarts; scheduler remained paused and
  active history jobs were zero before the proof. The sole `wsl-chrome-3`
  control advanced pass 40 to 41 and child
  `hmj_2a91562f15de476baf6f6217cc9c927b` matched provider identity,
  materialized/skipped/failed `2/4/1`, then stopped on the same large
  conversation. Its fresh receipt moved the last stage from the repaired
  `provider:chatgpt.readVisibleConversationFiles` seam to
  `provider:chatgpt.readConversationMessages`, timing out after 117259 ms of
  the 120000-ms context budget.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: clean `wsl-chrome-3` materialization; staged
  `wsl-chrome-4`, default, and replacement `wsl-chrome-2`; scheduler-last
  resume; four-target audit.
- `authority_classification`: Plan 0213 exhausted its one repair, one install,
  one restart, and one post-repair provider attempt. Its hard stop forbids a
  second repair or retry in this execution window.
- `review_disposition_summary`: the visible-file loop was a real defect and is
  now bypassed in current runtime evidence. The new accepted blocking finding
  is one unbounded `Runtime.evaluate` that reads every message's full
  `innerText` and returns the complete large conversation by value; identity,
  provider guard, transfer, and visible-file recurrence are rejected by the
  current receipts.
- `next_action_or_stop_reason`: close blocked. Keep all four intended
  completions and the scheduler stopped; a separately authorized successor
  must bound message extraction and provide a fresh one-canary gate.
