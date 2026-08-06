# Bounded Conversation Context Read Timeout And Terminal Receipt | 0204-2026-08-06

State: OPEN
Lane: OPERATIONS
Plan version: 1
Outcome: PENDING_PROVIDER_FREE_REPAIR
Goal execution state: IMPLEMENTING_PROVIDER_FREE
Gate state: LIVE_REFRESH_WITHHELD

## Stable Goal Objective

Make direct and shared conversation-context reads terminate within a bounded
deadline when a provider promise never settles, propagate cancellation into
the provider adapter, and preserve a durable last-stage terminal receipt. Lock
the Plan 0203 hang with provider-free regression coverage and install the
validated runtime once if all gates pass. Do not run another provider refresh,
canary, materialization job, or scheduler/completion loop.

## Current State

- Plan 0203 consumed one exact ChatGPT context refresh. Browser state changed,
  but the installed command emitted no output, committed no fresh cache, and
  remained alive for more than thirty minutes until the owned CLI process was
  interrupted with exit 130.
- A fast provider-free harness now reproduces the exact containment defect:
  `LlmService.getConversationContext(...)` remains pending when
  `provider.readConversationContext(...)` returns a never-settling promise.
- `withRetry(...)` awaits the provider promise directly and only makes retry
  decisions after rejection. `BrowserProviderListOptions` supports an
  `abortSignal`, but the shared direct context-read seam does not create a
  deadline or require a terminal receipt.
- Existing `llmServiceContext` coverage passes 7/7 because it covers success,
  rejection, cache fallback, rate-limit hard stops, and transient retry, not a
  never-settling provider.
- CodeGraph is healthy at 876 files, 16,518 nodes, and 55,969 edges. Impact is
  limited to the shared LLM service, browser client facade, direct CLI,
  account-mirror metadata collection, and history snapshot refresh.
- Opening repo state is clean and synchronized at `1a6900c5`. API PID 87441 is
  healthy; scheduler and six active completions are paused; default pass 4 is
  unchanged; foreground is idle; scoped guard is clear; active history jobs
  are zero.

## Authority And Ownership

- The operator's `ok go`, issued directly after the recommendation to add a
  top-level context-read deadline, abort propagation, and durable stage
  receipt before any later live refresh, authorizes this provider-free repair
  and at most one validated user-runtime install/restart.
- Authorized: plan/docs; source and exact tests; provider-free never-promise,
  abort, retry, cache, and receipt simulations; type/lint/build/test validation;
  one source commit; one install/restart after all source gates; installed
  provider-free proof; terminal docs/audit/commit/push; frozen-runtime readback.
- Excluded: provider/browser contact, live context refresh, browser-tools/DOM
  inspection, prompt submission, `Answer now`, download, materialization
  callback, durable job, canary, asset substitution, scheduler/completion/guard
  action, force, direct runtime JSON editing, or loop resume.
- Critical-path owner: primary agent. The repair is one shared seam and the
  current instructions do not authorize delegation; `subagent_status=not_spawned`.

## Repair Contract

1. Add one explicit context-read deadline contract at the shared LLM-service
   seam. The default must be finite, documented, testable, and overridable by a
   bounded caller option.
2. Compose the deadline with any caller-supplied `AbortSignal`; never discard a
   prior cancellation source. Pass the resulting signal to the provider and
   clean up timers/listeners on every terminal path.
3. A timeout must abort provider cleanup, reject once with a stable structured
   code, and be non-retryable. Ordinary transient failures retain their current
   retry semantics.
4. Track only bounded stage labels, never transcript or private content. On
   success, failure, timeout, or caller abort, preserve a provider/account/
   conversation-scoped terminal receipt with outcome, deadline, elapsed time,
   attempts, and last observed stage.
5. Cache fallback semantics remain explicit. A caller requiring live refresh
   must receive the terminal timeout; no stale cache may silently upgrade that
   outcome to current evidence.
6. Add provider-free coverage at the real `LlmService.getConversationContext`
   seam for never-settling provider work, abort propagation, non-retry,
   receipt persistence/readback, timer cleanup, existing transient retry, and
   successful cache write.
7. Update operator-facing context-read/testing documentation and the durable
   fix log. Do not add a provider-specific timeout alias if the shared contract
   suffices.

## Expected Write Surface

- Shared context-read/service/cache types and implementation.
- Direct CLI/browser-client option/readback surfaces only where needed to make
  the bounded deadline and receipt operator-visible.
- Exact LLM-service/cache/CLI tests plus adjacent affected coverage.
- README/testing/fixes log/journal/ROADMAP/RUNBOOK/this plan.
- Built and installed generated output only through the existing governed
  install command after source validation.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 2`;
  `max_planning_commits: 1`; `max_source_commits: 1`;
  `max_closeout_commits: 1`; `max_codegraph_calls: 3`;
  `max_review_passes: 1`; `max_remediation_cycles: 1`;
  `max_focused_test_commands: 6`; `max_affected_test_commands: 3`;
  `max_full_suite_commands: 1`; `max_provider_free_simulations: 3`;
  `max_user_runtime_installs: 1`; `max_service_restarts: 1`;
  `max_provider_browser_operations: 0`; `max_live_context_refreshes: 0`;
  `max_durable_jobs_created: 0`; `max_materialization_callbacks: 0`;
  `max_download_actions: 0`; `max_prompt_submissions: 0`;
  `max_materialized_assets: 0`; `max_scheduler_actions: 0`;
  `max_completion_actions: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_json_edits: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## State Machine

1. `IMPLEMENTING_PROVIDER_FREE -> VALIDATING_PROVIDER_FREE` after the exact
   never-settling red regression becomes green with abort and receipt proof.
2. `VALIDATING_PROVIDER_FREE -> READY_TO_INSTALL` only after focused/affected
   tests, typecheck, touched lint, build, and one closed-world diff review pass.
3. `READY_TO_INSTALL -> COMPLETE_PROVIDER_FREE_LIVE_WITHHELD` after at most one
   safe install/restart, exact source/runtime parity, installed provider-free
   timeout receipt proof, and frozen-runtime readback.
4. If install cannot preserve the frozen runtime safely, close
   `COMPLETE_SOURCE_ONLY_INSTALL_WITHHELD`.
5. Any provider/browser contact, live refresh, materialization/job/canary, or
   loop/control mutation transitions to `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [ ] Planning boundary is audited, committed, pushed, and clean before source
  changes.
- [ ] A real-seam red regression proves a never-settling provider currently
  leaves context reads pending.
- [ ] The shared finite deadline composes caller abort, cancels provider work,
  rejects once, and never retries timeout/caller-abort outcomes.
- [ ] A bounded durable receipt records provider, conversation, outcome,
  deadline, elapsed time, attempt count, and last stage without private content.
- [ ] Success, cache fallback, explicit live-required failure, and ordinary
  transient retry semantics remain covered and unchanged except for the new
  finite bound.
- [ ] Focused/affected tests, typecheck, lint, build, diff hygiene, and one
  closed-world review pass are green.
- [ ] If installed, source/runtime parity and installed provider-free proof pass
  while scheduler/completion pauses, default pass 4, clear guard, idle
  foreground, and zero active jobs remain unchanged.
- [ ] README, testing docs, fixes log, journal, ROADMAP, RUNBOOK, plan audit,
  commits, clean worktree, remote parity, and the still-withheld live/canary
  gate agree.

## Hard Stops And Non-Goals

- Do not rerun the Plan 0203 conversation or contact any provider.
- Do not click ChatGPT `Answer now` or any artifact/download control.
- Do not turn timeout into an automatic retry, stale-cache success claim, or
  provider-specific heuristic.
- Do not record transcript text, artifact titles, URLs with private payloads,
  or other unbounded browser data in the receipt.
- Do not resume scheduler/completion loops or start materialization.

## Definition Of Done

Every shared context read has a finite, aborting terminal boundary and a
bounded durable last-stage receipt; the never-settling provider regression and
installed provider-free proof are green; all runtime pauses are preserved; and
no provider refresh, canary, job, or materialization ran.

## Checkpoint 1 | Provider-Free Repair Authorized

- `plan_version`: 1
- `checkpoint_id`: `P0204-C01`
- `state_transition`: STOPPED_FAIL_CLOSED -> IMPLEMENTING_PROVIDER_FREE.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0204 and governing-doc wiring only; no source, test,
  installed runtime, provider/browser, cache receipt, job, materialization, or
  control change yet.
- `evidence`: explicit successor `ok go`; deterministic provider-free red
  harness (`RED: direct getConversationContext is still pending after provider
  promise never settles`); existing focused suite 7/7; CodeGraph healthy and
  bounded impact; clean synchronized `1a6900c5`; green goal-policy audit; frozen
  runtime posture.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; CodeGraph calls 3/3; all commits,
  source/tests, review/remediation, installs/restarts, provider/browser/live
  reads, jobs, callbacks, prompts, downloads, assets, control actions, and
  direct JSON edits 0.
- `remaining_criteria`: all eight acceptance items.
- `authority_classification`: in-envelope provider-free implementation,
  validation, and conditional install; every live/provider/materialization and
  control gate remains withheld.
- `review_disposition_summary`: Plan 0203 terminal evidence is accepted as the
  frozen reproducer; no broad discovery pass is reopened.
- `next_action_or_stop_reason`: audit/commit/push this boundary, then add the
  exact red regression before implementing the shared timeout and receipt.
