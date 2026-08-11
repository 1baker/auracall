# WSL Chrome 3 Evaluation-Class One-Canary Gate | 0260-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: PREPARED_AWAITING_APPROVAL
Goal execution state: PREPARED_AWAITING_APPROVAL

## Stable Goal Objective

After explicit approval and fresh zero-owner admission, install the Plan 0259
provider-free repair once and run exactly one zero-retry context canary for the
same `wsl-chrome-3` conversation. Accept only current nonempty context plus
exact cleanup. If it fails, retain the new allowlisted completed failure stage
and close without retry. Do not materialize, control a completion, resume the
scheduler, submit a prompt, or widen the route or browser profile.

## Prepared Evidence

- The provider-free red reproduced the broad `Runtime.evaluate` attribution at
  the real adapter seam twice; the repaired exact loop passes 8/8.
- Safe classifiers distinguish evaluation timeout, destroyed/missing execution
  context, closed transport, protocol error, generic error, and an unsatisfied
  readiness predicate without retaining raw messages or expressions.
- Focused validation passes 186/186; the adjacent five-file packet passes
  358/358; typecheck, build, scoped Biome, plan audit, and diff hygiene pass.
- Built/installed adapter parity is intentionally red before approval:
  built `chatgptAdapter.js` is
  `fac2bd9b1de04ed3ec2ed9b19e64ceb5b1766232224b7d4acb3a7fd2dcd6bea7`
  while installed is
  `756d54dea8ac39535f2bb63444d3d2c160706a7383eaf9119487dbfc32a3361b`.
- Current posture is API PID 82312 active/running with `NRestarts=0`, scheduler
  paused/paused, target idle-waiting/pass 56 with null error/next/force, active
  history jobs zero, no exact managed Chrome owner, and port 45015 unbound.

## Authority And Effect Boundary

- Approval covers one user-runtime install, one API restart, one exact
  source/installed adapter parity check, one managed `wsl-chrome-3/chatgpt`
  launch, one exact context read, and one exact owned cleanup.
- The sole route is conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`; the canary retains
  `--refresh --retry-attempts 0 --timeout-ms 120000 --json-only`.
- Model selection, prompts, clicks, downloads, uploads, `Answer now`,
  materialization, completion controls, scheduler controls, guard/config
  changes, direct runtime-state edits, retries, other routes, and wider browser
  profiles remain excluded.

## Execution Packet After Approval

1. Re-read Git, API, scheduler, completion, job, exact process, port, and
   agent-browser ownership. Stop on drift, a challenge, or any exact owner.
2. Install committed source once and restart only the AuraCall API. Require
   active/running health, `NRestarts=0`, exact adapter parity, and fresh
   zero-owner readback.
3. Run `scripts/chatgpt-context-canary.ts` once for the exact route/profile with
   the fixed 120-second context timeout, 150-second child timeout, and zero
   retries. Never retry.
4. Accept only current nonempty context, one unique successful receipt,
   `attemptCount=1`, and `pendingOperation=null`. Any failure closes the plan;
   retain only the sanitized terminal receipt and completed allowlisted stage.
5. Close only a canary-owned browser. Re-prove exact profile owners, port
   45015, active jobs, pass 56, and scheduler paused/paused.

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

## Preparation Checkpoint | Exact Evaluation Stage Awaiting One Canary

- `checkpoint_id`: `P0260-C01`.
- `state_transition`: P0259_CLOSED_PROVIDER_FREE_REPAIR_VALIDATED ->
  P0260_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: canary_prepared.
- `evidence`: provider-free red/green evidence, safe classification contract,
  wider validation, deliberate built/installed hash delta, and zero-owner
  runtime posture are recorded above.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before install/restart and the sole live
  context canary until this exact effect packet is explicitly approved.
- `authority_classification`: preparation only; all runtime/browser/provider
  effects remain excluded before approval.
- `review_disposition_summary`: another Plan 0258 retry is rejected. This is a
  fresh gate over new completed-stage evidence and the repaired readiness
  result contract.

## Definition Of Done

The installed repair passes one fresh zero-retry context canary and exact
cleanup while pass 56, scheduler pause, and every excluded effect remain
unchanged. Any failure closes the plan immediately without another attempt.
