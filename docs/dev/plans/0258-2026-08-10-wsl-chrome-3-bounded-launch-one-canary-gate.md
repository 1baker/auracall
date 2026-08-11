# WSL Chrome 3 Bounded Launch One-Canary Gate | 0258-2026-08-10

State: OPEN
Lane: P01
Plan version: 1
Gate state: PREPARED_AWAITING_APPROVAL
Goal execution state: PREPARED_AWAITING_APPROVAL

## Stable Goal Objective

After explicit approval and fresh zero-owner admission, install the Plan 0257
bounded native-launch repair once and run exactly one zero-retry, redaction-safe
conversation-context canary on `wsl-chrome-3`. Accept only current nonempty
context plus exact cleanup. Do not materialize, control a completion, resume the
scheduler, submit a prompt, or widen to another route or browser profile.

## Prepared Evidence

- The matching unbounded native-launch mechanism is repaired provider-free:
  debugger port probes are one-second bounded and immediately abortable; abort
  joins both exact cleanup and the in-flight launch task.
- Sanitized stages now distinguish registry lookup, process inspection,
  profile cleanup, port probe, process spawn, and debugger readiness.
- Focused tests pass 34/34, broader browser tests pass 159/159, and the full
  suite passes 307 files/2797 tests with 65 skipped. Typecheck, build, lint, and
  plan audit pass.
- Built/installed parity is intentionally red before the gate:
  `chromeLifecycle.js` source is
  `2a4e6d3bd680e4e83d0b42d80dccebdfbb05891bf9d3cf69a7f3de4538a38028`
  while installed is
  `0dc0afe075ab8c3225b1fe90d03754a644b2d35f62f57ae6065f4c02fd2112f5`.
  `manualLogin.js` source is
  `8d2e061e7805d58cc2c36b1e8d2eae6337d9452b3244af41673301fb2e0e68fa`
  while installed is
  `d001c42c9ba5f5a185f30b42d54105a2d05013bbee97165dbd413596dcb5de89`.
- Closing posture is API PID 69726 active/running with `NRestarts=0`, scheduler
  paused/paused, target idle-waiting/pass 56 with null error/next/force, active
  history jobs zero, no exact managed Chrome owner, and port 45015 unbound.

## Authority And Effect Boundary

- Approval covers one user-runtime install, one API restart, one exact
  source/installed parity check, one managed `wsl-chrome-3/chatgpt` launch, one
  exact conversation-context read, and one exact owned cleanup.
- The sole route is conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`; the child command retains
  `--refresh --retry-attempts 0 --timeout-ms 120000 --json-only` through the
  redaction-safe canary harness.
- Model selection, prompts, clicks, downloads, uploads, `Answer now`,
  materialization, completion controls, scheduler controls, guard/config
  changes, direct runtime-state edits, retries, other routes, and wider browser
  profiles remain excluded.

## Execution Packet After Approval

1. Re-read Git, API, scheduler, completion, job, guard, exact process, port,
   and agent-browser ownership. Stop on drift, a challenge, or any exact owner.
2. Install committed source once and restart only the AuraCall API. Require
   active/running health, `NRestarts=0`, and exact browser-service parity.
3. Run `scripts/chatgpt-context-canary.ts` once for the exact route and profile
   with the fixed 120-second command timeout and zero retries. Never retry.
4. Accept only a current nonempty context, one unique successful receipt,
   `attemptCount=1`, and `pendingOperation=null`. Any timeout or failure closes
   this plan; retain only the sanitized terminal receipt and new launch stage.
5. Close only a canary-owned browser. Prove exact profile owners, port 45015,
   and active jobs return to zero; prove pass 56 and scheduler paused/paused did
   not move.

## Acceptance Criteria

- [ ] Explicit approval and fresh drift-free zero-owner admission.
- [ ] One healthy install/restart with exact installed/source parity.
- [ ] One successful zero-retry context receipt and current nonempty context.
- [ ] Exact browser/job cleanup returns to zero.
- [ ] Target remains pass 56 and scheduler remains paused/paused.
- [ ] Materialization, completion/scheduler control, prompt, download, guard,
  retry, and wider-profile effects remain zero.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`;
  `max_browser_closes: 1`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_model_selections: 0`; `max_prompt_submissions: 0`;
  `max_downloads: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Preparation Checkpoint | Bounded Launch Repair Awaiting One Canary

- `checkpoint_id`: `P0258-C01`.
- `state_transition`: P0257_CLOSED_PROVIDER_FREE_REPAIR_VALIDATED ->
  P0258_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: canary_prepared.
- `evidence`: the provider-free repair, expanded stage receipt, full
  validation, deliberate source/installed hash delta, and closing zero-owner
  runtime posture are recorded above.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before install/restart and the sole live
  context canary until this exact effect packet is explicitly approved.
- `authority_classification`: preparation only; all runtime/browser/provider
  effects remain excluded before approval.
- `review_disposition_summary`: another Plan 0256 retry is rejected. This is a
  fresh gate over a new bounded probe and joined launch-task contract, with
  exact substages that make either success or failure decisive.

## Definition Of Done

The installed repair passes one fresh zero-retry context canary and exact
cleanup while pass 56, scheduler pause, and every excluded effect remain
unchanged. Any failure closes the plan immediately without another attempt.
