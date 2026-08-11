# WSL Chrome 3 Terminal-Unavailable One-Canary Gate | 0262-2026-08-11

State: CLOSED
Lane: P01
Plan version: 5
Gate state: CLOSED_ONE_CANARY_NOT_ACCEPTED
Goal execution state: PAUSED_AT_FUTURE_LIVE_GATE

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
- The canary harness now has a pure provider-free outcome classifier. It
  preserves successful nonempty-context acceptance and accepts terminal online
  unavailability only from one exact changed sanitized receipt with provider
  `chatgpt`, outcome `failed`, attempt count 1, no pending operation, no child
  timeout, and last stage
  `provider:chatgpt.readConversationPayload.failed.conversation_unavailable.v1`.
  It never parses stderr to accept terminal state.
- Nine harness tests and the exact `--dry-run` pass. Dry-run reports zero
  provider calls and browser launches and preserves the frozen route/profile,
  refresh, zero-retry, 120-second context, and 150-second child bounds.
- Built adapter SHA-256 is
  `1f3941267e762d72b1caf12d41fce6fbd4f70e12cd6300b6c55e6e6d180beb4a`;
  installed remains
  `fac2bd9b1de04ed3ec2ed9b19e64ceb5b1766232224b7d4acb3a7fd2dcd6bea7`.
- API PID 81249 is active/running with `NRestarts=0`; scheduler is
  paused/paused; completion queued/running counts and active history jobs are
  zero; and the target remains idle-waiting/pass 56 with null
  error/next/force.
- Fresh final preparation admission found an unrelated live AuraCall browser run using the
  exact `wsl-chrome-3/chatgpt` managed browser profile. Parent PID 5165 launched
  Chrome root PID 5747 at 08:12:49 CDT, and PID 5747 owns port 45015. Its command
  is a separate LitScout declaration campaign, not this canary or an API job.
  The original AuraCall parent later exited and left the exact Chrome root
  orphaned. The operator separately authorized closing those processes if
  necessary; one port-scoped close removed only the attributed Chrome tree.

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

- [x] Provider-free harness acceptance matches both permitted outcomes and
  rejects timeout, retry, and pending-operation near misses.
- [x] Explicit approval and fresh drift-free zero-owner admission.
- [x] One healthy install/restart with exact installed/source parity.
- [ ] Exactly one attempt yields either current nonempty context or
  `provider:chatgpt.readConversationPayload.failed.conversation_unavailable.v1`.
- [ ] No post-payload predicate failure follows a terminal-unavailable stage.
- [x] Exact browser/job cleanup returns to zero.
- [x] Target stays pass 56 and scheduler stays paused/paused.
- [x] Materialization and every other excluded effect remain zero.

## Frozen Live Command Packet | Withheld Until Approval

1. Re-run read-only admission and stop unless Git is clean and synchronized,
   the API is active/running, scheduler state and posture are both paused,
   completion queued/running counts and active history jobs are zero, the
   target is idle-waiting at pass 56 with null error/next/force, browser-tools
   reports no port-45015 owner, and `ss` reports no port-45015 listener.
2. Run exactly `pnpm run install:user-runtime-service` once. This combined
   command builds and installs the current checkout, refreshes the user API
   unit, and performs the plan's one API restart. Do not issue a separate
   `systemctl restart`.
3. Require `systemctl --user show auracall-api.service -p ActiveState -p
   SubState -p MainPID -p NRestarts` to report active/running with a nonzero
   PID and `NRestarts=0`. Require exact SHA-256 parity between
   `dist/src/browser/providers/chatgptAdapter.js` and
   `~/.auracall/user-runtime/node_modules/auracall/dist/src/browser/providers/chatgptAdapter.js`.
4. Run exactly once:

   ```text
   pnpm tsx scripts/chatgpt-context-canary.ts --profile wsl-chrome-3 --conversation-id 6a40724d-8688-83ea-ab36-7458e921ed19 --timeout-ms 120000 --command-timeout-ms 150000 --auracall-bin /home/ecochran76/.local/bin/auracall
   ```

   The harness-generated child command is frozen to explicit `--target
   chatgpt --refresh --retry-attempts 0 --timeout-ms 120000 --json-only`.
5. Inspect port 45015 with
   `pnpm tsx scripts/browser-tools.ts --auracall-profile wsl-chrome-3
   --browser-target chatgpt inspect --ports 45015 --json`. Run the one cleanup
   command `pnpm tsx scripts/browser-tools.ts --auracall-profile wsl-chrome-3
   --browser-target chatgpt kill --ports 45015 --force` only if that inspection
   attributes the listener to the canary-created exact managed browser profile.
   If no listener exists, no close is needed. Any different ownership stops
   without killing it.
6. Re-run the admission reads and require exact zero owners/listeners/jobs,
   target pass 56, and scheduler paused/paused. Preserve only the harness's
   sanitized JSON result and exact state counters.

No command in this section is authorized by its presence in the plan.

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

## Preparation Checkpoint | Terminal Outcome Harness Made Executable

- `checkpoint_id`: `P0262-C02`.
- `state_transition`: P0262_PREPARED_INCOMPLETE_TERMINAL_ACCEPTANCE ->
  P0262_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: provider_free_gate_hardened.
- `red_evidence`: the prepared plan allowed terminal online unavailability,
  but the harness accepted only child exit 0 plus nonempty context. The exact
  terminal fixture failed because the outcome classifier did not exist.
- `repair_evidence`: one pure function now returns only `context`,
  `terminal_unavailable`, or null from sanitized context/receipt fields. The
  terminal result requires the exact allowlisted completed stage and cannot be
  inferred from raw child stderr.
- `validation`: 9/9 exact harness tests and 194/194 adjacent context/adapter
  tests pass; typecheck, build, scoped Biome, dry-run, and plan audit pass.
- `effect_audit`: provider calls, browser launches/attachments, installs,
  restarts, live context reads, materialization, completion/scheduler controls,
  prompt/model/download actions, guard/config changes, and direct runtime
  edits remain zero.
- `authority_classification`: the live gate remains withheld. This checkpoint
  adds no approval or retry authority.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before install/restart and the one canary
  until Plan 0262 receives explicit live-effect approval.

## Preparation Checkpoint | Live Packet Frozen Without Effects

- `checkpoint_id`: `P0262-C03`.
- `state_transition`: P0262_PREPARED_AMBIGUOUS_LIVE_COMMANDS ->
  P0262_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: provider_free_execution_ambiguity_removed.
- `structural_evidence`: CodeGraph traces the exact UUID command directly to
  `LlmService.getConversationContext`; CLI-sourced `--refresh` disables cache
  fallback and retry count zero reaches the retry loop unchanged. The command
  has no prompt, model-selection, or materialization branch.
- `install_evidence`: the documented combined installer performs the one
  build/install and the one API-service restart. A second manual restart is
  explicitly forbidden.
- `cleanup_evidence`: browser-tools help confirms exact port-scoped inspect and
  kill surfaces. Cleanup is admitted only for the canary-created exact profile
  owner; unrelated ownership is a hard stop.
- `effect_audit`: only source/plan inspection, command help, and read-only
  runtime state were used. Installs, restarts, browser launches/attachments,
  provider calls, context reads, cleanup kills, materialization, and controls
  remain zero.
- `authority_classification`: the live gate remains withheld; this checkpoint
  grants no live-effect or retry authority.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: await explicit Plan 0262 approval, then re-run
  fresh admission and execute the frozen packet once or stop on drift.

## Admission Checkpoint | Unrelated Exact-Profile Owner

- `checkpoint_id`: `P0262-C04`.
- `state_transition`: P0262_PREPARED_AWAITING_APPROVAL ->
  P0262_PREPARED_AWAITING_APPROVAL_AND_ZERO_OWNER.
- `progress_classification`: live_admission_failed_closed.
- `owner_evidence`: port 45015 is listening under Chrome root PID 5747 with
  exact user-data directory
  `~/.auracall/browser-profiles/wsl-chrome-3/chatgpt`. Its parent PID 5165 is an
  unrelated active AuraCall/LitScout campaign started before this admission.
- `runtime_evidence`: API PID 81249 remains healthy; scheduler paused/paused;
  completion queued/running 0/0; active history jobs zero; and the target
  idle-waiting/pass 56 with null error/next/force.
- `effect_audit`: ownership was attributed from OS process and socket metadata
  only. No page attachment, browser inspection, kill, install, restart,
  provider call, context read, materialization, or control occurred.
- `authority_classification`: fail closed. This plan does not authorize
  interrupting or cleaning an unrelated browser owner.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: wait for PID 5165/5747 and port 45015 to settle
  naturally, then require a fresh zero-owner admission and explicit Plan 0262
  live-effect approval before executing the frozen packet.

## Activation Checkpoint | Authorized Orphan Cleanup And Zero-Owner Admission

- `checkpoint_id`: `P0262-C05`.
- `state_transition`: P0262_PREPARED_AWAITING_APPROVAL_AND_ZERO_OWNER ->
  P0262_ACTIVE_INSTALL_AND_ONE_CANARY.
- `progress_classification`: live_gate_activated.
- `approval_evidence`: the operator approved continuation and separately
  authorized closing the processes if necessary.
- `owner_evidence`: AuraCall PID 5165 had already exited. Chrome root PID 5747
  remained orphaned under PPID 397, owned port 45015, and retained the exact
  `~/.auracall/browser-profiles/wsl-chrome-3/chatgpt` directory. Port-scoped
  browser-tools inspection confirmed that same browser tree.
- `cleanup_evidence`: the one authorized port-scoped close removed root PID
  5747 and four exact Chrome children. Fresh browser-tools and socket readback
  report zero owners and no port-45015 listener.
- `runtime_evidence`: Git is clean and synchronized at `06bb93d1`; API PID
  81249 is active/running with `NRestarts=0`; scheduler is paused/paused;
  completion queued/running and active history-materialization counts are zero;
  and the target remains idle-waiting/backfill-history/pass 56 with null
  error/next/force and `materializationForce=false`.
- `effect_audit`: the unrelated orphan cleanup is the only new effect. Install,
  API restart, canary/browser launch, provider/context read, materialization,
  completion/scheduler control, prompt/model/download actions, retries, guards,
  config changes, and direct runtime edits remain zero.
- `authority_classification`: activate only the already frozen combined
  install/restart, one zero-retry canary, and exact canary-owned cleanup.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: audit and publish this activation checkpoint,
  re-read zero-owner admission, then execute the frozen packet once.

## Definition Of Done

One installed zero-retry canary distinguishes current context from exact online
unavailability, exact cleanup succeeds, and pass 56 plus scheduler pause remain
unchanged. The plan does not materialize or resume wider execution under either
outcome.

## Terminal Checkpoint | Sole Canary Rejected Without Retry

- `checkpoint_id`: `P0262-C06`.
- `state_transition`: P0262_ACTIVE_INSTALL_AND_ONE_CANARY ->
  P0262_CLOSED_ONE_CANARY_NOT_ACCEPTED.
- `progress_classification`: live_hypothesis_disproved.
- `install_evidence`: the sole combined installer completed successfully,
  produced API PID 85444 active/running with `NRestarts=0`, and established
  exact source/installed adapter SHA-256 parity at
  `1f3941267e762d72b1caf12d41fce6fbd4f70e12cd6300b6c55e6e6d180beb4a`.
- `canary_evidence`: the sole zero-retry child exited 1 after 35067 ms. Its
  unique sanitized receipt records provider `chatgpt`, attempt count 1, no
  timeout, no pending operation, and last stage
  `provider:chatgpt.postPayloadReadiness.failed.predicate_unsatisfied.v1`.
  It emitted neither context nor the permitted terminal-unavailable stage.
- `browser_evidence`: ownership-checked inspection found the canary-created
  exact managed Chrome root PID 86060 on port 45015 with its only provider page
  at `https://chatgpt.com/`, not the requested conversation route.
- `cleanup_evidence`: the one canary cleanup removed PID 86060 and four exact
  Chrome children. Fresh browser-tools and socket readback are zero-owner.
- `runtime_evidence`: API PID 85444 remains healthy with exact installed
  parity; active completion/materialization counts are zero; the target remains
  idle-waiting/backfill-history/pass 56 with null error/next/force; scheduler
  remains paused/paused.
- `acceptance_state`: NOT_ACCEPTED. The fallback-404/410 terminal classifier
  was not exercised by this live failure; the exact payload shape at route loss
  remains unobserved.
- `effect_audit`: one install/restart, one browser launch/context attempt, and
  one exact canary cleanup were consumed. Retries, materialization,
  completion/scheduler controls, prompts, model selection, downloads, guards,
  config changes, direct runtime edits, and wider profiles remained zero.
- `authority_classification`: this plan is exhausted and grants no retry. Plan
  0263 may add provider-free, sanitized payload-shape plus route-loss
  localization only.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: continue provider-free under Plan 0263; any
  further installed/browser canary requires a new explicit gate.
