# Post-Repair Bounded Context Read And Canary Gate | 0207-2026-08-06

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: AWAITING_BOUNDED_CONTEXT_READ
Gate state: CANARY_WITHHELD

## Stable Goal Objective

Use the installed Plan 0206 provenance repair exactly once to refresh only the
frozen Plan 0197 conversation, preserve the terminal receipt, classify only the
frozen cone artifact from the resulting current evidence, and prepare—but do
not execute—a one-canary approval gate. Do not retry, substitute an asset,
create a job, start materialization, or resume scheduler/completion loops.

## Current State

- Plan 0206 is closed and installed. The source and installed shared LLM service
  hashes match at
  `2bf2ea406e0209ff435c41dcca0d21c62f4d921249665ec82575f89b23c1e0a9`;
  the installed local proof retains all seven managed-session provenance fields
  with zero live provider/browser calls.
- The prior exact read failed before a fresh cache write with
  `provider_session_provenance_missing`. The old context remains timestamped
  2026-08-06 10:22 local, SHA-256
  `0c71832d99b423ed3de9e496e43346ac917b1d2de27573632ebbf30f5762b7b4`,
  with eleven artifacts. The frozen cone is still payload-only and all
  live-control fields are null.
- Fresh opening readback: API PID 44127 active/running; scheduler paused; six
  completions paused; queued/running/idle-waiting `0/0/0`; default ChatGPT pass
  4; null provider guard; background drain idle; active history jobs zero.
- Repo state is clean and synchronized at `ae420d74`. No install, restart, or
  source change is needed in this packet.

## Authority And Ownership

- The operator's new `ok go`, directly accepting the recommendation for one
  separately approved bounded context read, authorizes exactly one installed
  read-only refresh for conversation `67ccf9d7-9310-8004-b5e1-478dba6eab3a`
  under `chatgpt/default`, its normal cache/receipt writes, provider-free exact
  cone adjudication, and closeout.
- Authorized: plan/docs; provider-free preflight; one installed CLI refresh with
  `--timeout-ms 120000` and a 150-second outer ceiling; terminal receipt/context
  readback; exact-cone classification; frozen one-canary gate decision;
  runtime readback; audit/commit/push.
- Excluded: a second provider command, retry, another conversation, browser
  tools, DOM follow-up, prompt, `Answer now`, download, materialization callback,
  durable job, canary execution, substitute asset, force, install/restart,
  direct runtime JSON edit, or scheduler/completion/guard/loop action.
- Critical-path owner: primary agent. The packet is serialized and delegation
  was not requested; `subagent_status=not_spawned`.

## Frozen Read And Adjudication Contract

1. Audit, commit, and push this plan boundary before provider contact.
2. Reconfirm installed/source parity, exact cache identity, paused scheduler and
   completions, default pass 4, idle background drain, null guard, and zero
   active history jobs.
3. Run exactly one installed `conversations context get` command for the frozen
   conversation with `--target chatgpt --refresh --json-only --timeout-ms
   120000`; discard stdout and wrap it in a 150-second outer process ceiling.
4. Stop at its first terminal exit. Never retry or open browser tools. Read only
   the durable terminal receipt and exact context cache afterward.
5. Classify only catalog item
   `ec160eac-e457-4ae8-abb1-dfeaae5e8bec:download:sandbox:/mnt/data/plt_4.png`:
   - `available`: require one exact canonical payload/DOM correlation with
     bounded turn ID, button index, live-control artifact ID, and URI;
   - `missing`: require explicit `liveControlState=missing` and
     `liveControlReason=missing_live_control`;
   - absent, duplicate, ambiguous, timeout, provider guard, malformed evidence,
     or any other terminal failure: stop fail-closed.
6. Positive classification may freeze
   `CANARY_READY_EXPLICIT_APPROVAL_REQUIRED`; it cannot create or run a job.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 1`;
  `max_planning_commits: 1`; `max_closeout_commits: 1`;
  `max_provider_context_refresh_commands: 1`;
  `max_provider_conversations_touched: 1`; `max_provider_refresh_retries: 0`;
  `max_inner_context_timeout_ms: 120000`;
  `max_outer_process_timeout_seconds: 150`;
  `max_provider_free_adjudications: 1`;
  `max_plan_audit_command_groups: 2`; `max_installs: 0`;
  `max_service_restarts: 0`; `max_durable_jobs_created: 0`;
  `max_canary_executions: 0`; `max_materialization_callbacks: 0`;
  `max_download_actions: 0`; `max_prompt_submissions: 0`;
  `max_scheduler_actions: 0`; `max_completion_actions: 0`;
  `max_guard_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_codegraph_calls: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## State Machine

1. `AWAITING_BOUNDED_CONTEXT_READ -> READING_BOUNDED_CONTEXT` after the pushed
   plan boundary and frozen-runtime preflight pass.
2. `READING_BOUNDED_CONTEXT -> CANARY_READY_EXPLICIT_APPROVAL_REQUIRED` only on
   a successful fresh receipt plus one exact positive live-control correlation.
3. `READING_BOUNDED_CONTEXT -> COMPLETE_CANARY_WITHHELD_MISSING_LIVE_CONTROL`
   only on a successful fresh receipt plus explicit current missing-control
   evidence.
4. `READING_BOUNDED_CONTEXT -> STOPPED_FAIL_CLOSED` on timeout, abort, command
   error, provider guard, absent/ambiguous artifact, lost pause, unexpected
   concurrent work, or any excluded action.

## Acceptance Criteria

- [ ] Planning boundary is audited, committed, and pushed before provider
  contact.
- [ ] Preflight binds the exact installed runtime, conversation/cache identity,
  and frozen scheduler/completion/guard/job posture.
- [ ] Exactly one bounded installed refresh reaches its first terminal exit,
  with no retry and one terminal receipt.
- [ ] Only the frozen cone is classified from the terminal receipt/context; no
  alternative asset or conversation is inferred.
- [ ] The one-canary gate is frozen truthfully and no canary, job,
  materialization, download, prompt, or control action runs.
- [ ] Plan, ROADMAP, RUNBOOK, journal, audits, git/remote state, and final runtime
  readback agree.

## Hard Stops And Non-Goals

- Never click ChatGPT `Answer now` or any artifact/download control.
- Never retry after the first terminal exit.
- Do not use browser tools to diagnose a terminal read inside this packet.
- Do not create or execute the canary or resume any loop.

## Definition Of Done

The sole exact refresh terminates within the installed bound, preserves one
terminal receipt, and yields either a current exact cone classification or a
truthful fail-closed stop. The one-canary gate is frozen, all scheduler and
completion pauses remain intact, and no canary/materialization runs.

## Checkpoint 1 | One Post-Repair Read Authorized

- `plan_version`: 1
- `checkpoint_id`: `P0207-C01`
- `state_transition`: COMPLETE_PROVIDER_FREE_LIVE_WITHHELD ->
  AWAITING_BOUNDED_CONTEXT_READ.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0207 and canonical planning/doc wiring only; no provider,
  cache/receipt, job, canary, materialization, runtime, or control change yet.
- `evidence`: explicit successor `ok go`; installed/source repair parity;
  installed provider-free provenance proof; exact frozen conversation, cache,
  and cone identity; current frozen runtime posture.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; all commits, provider reads,
  adjudications, audit groups, jobs, callbacks, canaries, downloads, prompts,
  assets, installs, restarts, and control actions zero.
- `remaining_criteria`: all six acceptance items.
- `authority_classification`: separately explicit one-read live authority;
  canary execution, materialization, and all loop/control authority withheld.
- `review_disposition_summary`: inherited closed-world gate; no broad discovery
  pass is reopened.
- `next_action_or_stop_reason`: audit, commit, and push this boundary; then run
  the exact frozen preflight before spending the sole read.
