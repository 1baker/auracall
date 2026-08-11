# WSL Chrome 3 Terminal-Unavailable One-Canary Gate | 0262-2026-08-11

State: OPEN
Lane: P01
Plan version: 3
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
- Fresh read-only posture is API PID 81249 active/running with `NRestarts=0`,
  scheduler paused/paused, completion queued/running counts 0/0, target
  idle-waiting/pass 56 with null error/next/force, active history jobs zero,
  exact profile owners zero, and port 45015 unbound.

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
- [ ] Explicit approval and fresh drift-free zero-owner admission.
- [ ] One healthy install/restart with exact installed/source parity.
- [ ] Exactly one attempt yields either current nonempty context or
  `provider:chatgpt.readConversationPayload.failed.conversation_unavailable.v1`.
- [ ] No post-payload predicate failure follows a terminal-unavailable stage.
- [ ] Exact browser/job cleanup returns to zero.
- [ ] Target stays pass 56 and scheduler stays paused/paused.
- [ ] Materialization and every other excluded effect remain zero.

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

## Definition Of Done

One installed zero-retry canary distinguishes current context from exact online
unavailability, exact cleanup succeeds, and pass 56 plus scheduler pause remain
unchanged. The plan does not materialize or resume wider execution under either
outcome.
