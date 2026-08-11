# WSL Chrome 3 Terminal-Unavailable One-Canary Gate | 0262-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: PREPARED_AWAITING_APPROVAL
Goal execution state: PAUSED_AT_LIVE_EFFECT_GATE

## Stable Goal Objective

After separate approval and fresh zero-owner admission, install the Plan 0261
repair once and run exactly one zero-retry context canary for ChatGPT
conversation `6a40724d-8688-83ea-ab36-7458e921ed19` on `wsl-chrome-3`.
Accept either current nonempty context or the new exact sanitized
`conversation_unavailable` stage. Close after exact owned cleanup. Do not start
materialization, resume/control the completion or scheduler, submit a prompt,
or widen the route or browser profile.

## Prepared Evidence

- Plan 0261 reproduced the ignored exact fallback 404 provider-free, repaired
  only exact fallback 404/410, and preserved direct-404/fallback-200 recovery.
- Context-level coverage proves the coded terminal error is propagated before
  the post-payload readiness wait.
- Existing evidence persistence and selection tests prove a terminal online
  state preserves historic artifact/file inventories and excludes the row
  before provider work and `maxItems=1` consumption.
- Focused/adjacent validation passes 272/272; typecheck, build, scoped Biome,
  and plan audit pass.
- Built adapter SHA-256 is
  `1f3941267e762d72b1caf12d41fce6fbd4f70e12cd6300b6c55e6e6d180beb4a`;
  installed remains
  `fac2bd9b1de04ed3ec2ed9b19e64ceb5b1766232224b7d4acb3a7fd2dcd6bea7`.
- Current read-only posture is API PID 3323 active/running with
  `NRestarts=0`, scheduler paused/paused, target idle-waiting/pass 56 with null
  error/next/force, exact profile owners zero, and port 45015 unbound.

## Authority And Effect Boundary

- Approval covers one user-runtime install, one AuraCall API restart, one
  source/installed adapter parity check, one exact managed
  `wsl-chrome-3/chatgpt` launch, one context read, one sanitized receipt
  readback, and one exact owned cleanup.
- The canary command retains `--refresh --retry-attempts 0 --timeout-ms 120000
  --json-only`; the child timeout remains 150000 ms.
- Materialization, completion/scheduler control, prompt/model selection,
  clicks, downloads/uploads, `Answer now`, guard/config changes, direct runtime
  state edits, retries, other routes, and wider profiles remain excluded.

## Acceptance Criteria

- [ ] Explicit approval and fresh drift-free zero-owner admission.
- [ ] One healthy install/restart with exact installed/source parity.
- [ ] Exactly one attempt yields either current nonempty context or
  `provider:chatgpt.readConversationPayload.failed.conversation_unavailable.v1`.
- [ ] No post-payload predicate failure follows a terminal-unavailable stage.
- [ ] Exact browser/job cleanup returns to zero.
- [ ] Target stays pass 56 and scheduler stays paused/paused.
- [ ] Materialization and every other excluded effect remain zero.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`;
  `max_browser_closes: 1`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_model_selections: 0`; `max_prompt_submissions: 0`;
  `max_downloads: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Preparation Checkpoint | One Fresh Classified Canary Withheld

- `checkpoint_id`: `P0262-C01`.
- `state_transition`: P0261_CLOSED_PROVIDER_FREE_VALIDATED ->
  P0262_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: canary_prepared.
- `authority_classification`: preparation only. No install, restart,
  browser/provider call, context read, materialization, completion/scheduler
  action, or other live effect is active before approval.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop at the live-effect gate. After approval,
  re-read Git/API/scheduler/completion/job/process/port/agent-browser state and
  stop on any exact owner, challenge, active job, or posture drift.

## Definition Of Done

One installed zero-retry canary distinguishes current context from exact online
unavailability, exact cleanup succeeds, and pass 56 plus scheduler pause remain
unchanged. The plan does not materialize or resume wider execution under either
outcome.
