# Context Read Command Lifecycle Timeout And Receipt Repair | 0208-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS_PROVIDER_FREE
Goal execution state: DIAGNOSING
Gate state: CANARY_WITHHELD_NO_CURRENT_EVIDENCE

## Stable Goal Objective

Reproduce, diagnose, and repair the installed conversation-context command path
that exceeded its 120-second inner deadline and reached the outer process
ceiling without a fresh terminal receipt in Plan 0207. Cover the complete local
command lifecycle, prove the repair provider-free, and install it at most once
only after all source gates pass. Do not contact the provider or browser again,
rerun the exact conversation read, create or execute a canary, start
materialization, or resume scheduler/completion loops.

## Current State

- Plan 0207 consumed its sole installed live read. The command used
  `--timeout-ms 120000` under a 150-second outer ceiling, reached exit 124 after
  143.90 measured seconds, and preserved neither a fresh context cache nor a
  fresh terminal receipt.
- The retained receipt is still the older Plan 0205
  `provider_session_provenance_missing` failure. The exact context cache remains
  SHA-256 `0c71832d99b423ed3de9e496e43346ac917b1d2de27573632ebbf30f5762b7b4`
  with eleven artifacts; the frozen cone still has null live-control fields.
- Read-only agent-browser inspection after the stop proved the managed browser
  process and exact ChatGPT conversation are healthy: the page is rendered,
  visible, interactive, and free of login, CAPTCHA, dialog, and provider-error
  blockers. The live CDP target ID differs from AuraCall's persisted target ID,
  which is a bounded target-rebinding clue, not authorization for another live
  read.
- The existing provider-free `LlmService.getConversationContext(...)`
  never-promise suite passes 9/9 in 149ms, so it does not reproduce the full
  installed command failure.
- Opening state is clean and synchronized at `b1de9862`. Source and installed
  shared-service hashes match at
  `2bf2ea406e0209ff435c41dcca0d21c62f4d921249665ec82575f89b23c1e0a9`.
  API PID 44127 is active/running with zero restarts; scheduler and six active
  completions remain paused, queued/running/idle-waiting are `0/0/0`, default
  ChatGPT pass 4 is unchanged, background drain is idle, and active history
  jobs remain zero.

## Authority And Ownership

- The operator's repeated `ok go` and explicit request to diagnose the failure,
  plan the fix, and execute authorize this bounded provider-free repair and at
  most one validated user-runtime install/restart.
- Authorized: plan/docs; a deterministic full-command provider-free fixture;
  CodeGraph tracing; source and test edits at the command/options/timeout/
  receipt seam; targeted, affected, and full non-live validation; one safe
  install/restart; installed provider-free proof; frozen-runtime readback;
  audit/commit/push.
- Excluded: provider/browser/DOM contact; context refresh; prompt; `Answer now`;
  download; durable job; canary execution; materialization callback; alternate
  asset/conversation; mutation of the frozen cache or receipt as evidence;
  direct runtime JSON edits; and scheduler, completion, guard, or loop actions.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Diagnostic And Repair Contract

1. Add one fast deterministic provider-free regression that executes the real
   context command boundary and can hang before the existing service-level
   deadline while all provider callbacks remain disabled.
2. Test the ranked causes one variable at a time:
   - target/session resolution or rebinding waits before the deadline begins;
   - persisted-target replacement waits outside cancellation;
   - terminal receipt ownership begins only after pre-provider setup;
   - aborted browser work leaves an active handle that prevents CLI exit;
   - CLI timeout options are lost before the service call.
3. Use CodeGraph to trace the exact command-to-options-to-service-to-receipt
   flow only after the red-capable loop exists. Repair the earliest shared
   lifecycle boundary that can guarantee a single terminal result without
   provider-specific aliases or retries.
4. Preserve fail-closed provider-session authority, stable timeout/abort codes,
   metadata-only receipt privacy, and adapter cancellation. Never infer target
   ownership from target ID, endpoint, URL, or matching account alone.
5. Run focused and affected tests, typecheck, lint, build, full non-live tests,
   diff hygiene, and closed-world review. Install/restart once only if green.
6. Prove the installed command lifecycle with provider and browser callbacks
   disabled, then reconfirm every frozen scheduler/completion/canary/
   materialization control.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 1`;
  `max_planning_commits: 1`; `max_source_commits: 1`;
  `max_closeout_commits: 1`; `max_codegraph_calls: 5`;
  `max_ranked_hypotheses: 5`; `max_instrumentation_rounds: 2`;
  `max_provider_commands: 0`; `max_browser_commands: 0`;
  `max_context_refreshes: 0`; `max_provider_callbacks: 0`;
  `max_durable_jobs_created: 0`; `max_canary_executions: 0`;
  `max_materialization_callbacks: 0`; `max_download_actions: 0`;
  `max_prompt_submissions: 0`; `max_scheduler_actions: 0`;
  `max_completion_actions: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_plan_audit_command_groups: 2`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## State Machine

1. `AWAITING_FULL_COMMAND_REPRO -> DIAGNOSING` after the audited and pushed
   planning boundary plus one red-capable deterministic provider-free repro.
2. `DIAGNOSING -> REPAIRING` only when evidence distinguishes the causal path
   from the ranked alternatives without weakening target/session authority.
3. `REPAIRING -> VALIDATING` after the full-command regression turns green and
   service-level timeout, caller-abort, and provenance regressions remain green.
4. `VALIDATING -> COMPLETE_PROVIDER_FREE_LIVE_WITHHELD` only after source and
   installed provider-free proofs plus frozen-runtime readback pass.
5. Any need for provider/browser contact, target-ownership inference, a second
   install/restart, runtime-control mutation, or repeated no-progress transition
   stops `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [ ] One fast deterministic full-command regression reproduces a pre-service
  wait with zero provider/browser callbacks, then terminates within its inner
  deadline and persists one fresh terminal receipt after the repair.
- [ ] Ranked hypotheses are resolved with structural evidence and the causal
  boundary is documented without relying on the provider or live browser.
- [ ] Existing service-level never-promise, caller-abort, provenance, explicit
  endpoint, and fail-closed authority coverage remains green.
- [ ] Focused/affected tests, typecheck, lint, build, full non-live suite, diff
  hygiene, and closed-world review pass.
- [ ] At most one install/restart produces source/runtime parity and one
  provider/browser-callback-disabled installed command-lifecycle proof.
- [ ] Plan, ROADMAP, RUNBOOK, journal, fixes log, audits, git/remote state, and
  final frozen-runtime readback agree; no live read, canary, job,
  materialization, or loop/control action occurs.

## Hard Stops And Non-Goals

- Do not contact ChatGPT or inspect the live browser/DOM again in this packet.
- Do not rerun the exact conversation refresh to test the repair.
- Do not infer managed-session ownership from target or endpoint coincidence.
- Do not run the frozen cone canary or resume scheduler/completion loops.

## Definition Of Done

The full local context command lifecycle has a finite deadline and one durable
terminal receipt even when pre-provider resolution never settles, while
existing provider-session authority and service-level cancellation remain
fail-closed. Source and installed provider-free proofs are green, and the
one-canary gate, materialization, scheduler, and completions remain frozen.

## Checkpoint 1 | Full-Command Provider-Free Repair Opened

- `plan_version`: 1
- `checkpoint_id`: `P0208-C01`
- `state_transition`: STOPPED_FAIL_CLOSED -> AWAITING_FULL_COMMAND_REPRO.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0208 and canonical planning/doc wiring only.
- `evidence`: Plan 0207 outer-ceiling exit 124 with no fresh receipt; healthy
  read-only browser inspection; live/persisted target-ID mismatch; existing
  narrow service suite green 9/9; clean synchronized `b1de9862`; source/runtime
  parity; frozen API/scheduler/completion/job posture.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; existing diagnostic test commands
  1; all planning/source/closeout commits, CodeGraph calls, instrumentation,
  installs/restarts, provider/browser commands, callbacks, refreshes, jobs,
  canaries, materialization, prompts, downloads, and runtime-control counts
  zero inside this plan.
- `remaining_criteria`: all six acceptance items.
- `authority_classification`: provider-free local repair and one conditional
  install/restart only; live read and every effectful canary/materialization/
  control gate remain withheld.
- `review_disposition_summary`: the Plan 0207 incident is frozen as the real
  reproducer; broad provider/browser discovery is closed.
- `next_action_or_stop_reason`: audit, commit, and push the planning boundary;
  then add the exact full-command provider-free regression before source
  diagnosis or repair.
