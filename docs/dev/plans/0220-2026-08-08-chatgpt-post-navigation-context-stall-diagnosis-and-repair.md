# ChatGPT Post-Navigation Context Stall Diagnosis And Repair | 0220-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Goal execution state: ACTIVE_PROVIDER_FREE_DIAGNOSIS
Future canary gate: WITHHELD_UNTIL_PROVIDER_FREE_REPAIR_GREEN

## Stable Goal Objective

Diagnose the pass-44 ChatGPT conversation-context stalls after the last
completed `chatgpt.skipSameRouteNavigation` action, build a deterministic
provider-free reproduction of the exact later boundary, repair only the proven
operation, and validate the complete context/materialization path. If and only
if that gate is green, prepare one fresh `wsl-chrome-3` canary behind a
separate live-effect gate. Do not install, restart, contact a provider/browser,
start materialization, control a completion, or resume the scheduler.

## Current Evidence

- Plan 0219 consumed its only pass-44 canary and closed fail-closed. Child
  `hmj_fbbe8fa545fd4589b505706053b31f4d` matched every provider-session
  identity dimension but failed four of six conversation contexts once each
  after 109618, 109526, 109513, and 109611 ms.
- All four promoted receipts ended at
  `provider:chatgpt.skipSameRouteNavigation`; one earlier context completed in
  14049 ms. The marker proves successful no-mutation navigation settlement but
  still does not identify the later blocking await.
- Current structural trace shows that the context reader next attempts the
  bounded conversation-payload read, then unconditionally calls
  `waitForPredicate` for post-payload surface readiness before starting bounded
  message pages. `waitForPredicate` has a loop deadline, but each underlying
  `Runtime.evaluate` currently has neither a DevTools protocol timeout nor an
  independent transport deadline.
- This is a candidate boundary, not yet an accepted cause. A red-capable
  provider-free sequence must prove whether the stall occurs there or earlier
  in the payload read before source behavior changes.
- Current source and installed adapter hashes are both
  `688442b51b7769b80df67e860bd96b53e1ff350fbd4bca4f51750b94d77ef0b7`.
  API PID 9910 is active/running with zero crash restarts; scheduler is paused;
  active history jobs are zero; wider ChatGPT completions are paused at passes
  `7/2/34`; and `wsl-chrome-3` is blocked/pass 44 with force ceiling null.

## Authority And Effect Boundary

- Provider-free source, tests, plans, journal, runbook, roadmap, and fix-log
  changes are authorized under the standing diagnosis/repair objective.
- Fake CDP may simulate successful same-route settlement, a bounded payload
  response, a stalled later evaluation, abort, and a next independent context.
  It must not connect to Chrome or any provider.
- Installed-runtime changes, API restarts, browser/provider calls, browser
  clicks/navigation, prompts, `Answer now`, materialization jobs, completion
  controls, scheduler controls, guard bypass, and direct runtime-state edits
  are excluded.
- A successor may prepare one exact canary artifact after all provider-free
  criteria pass, but this plan cannot authorize or execute that live packet.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Provider-Free Execution Packets

### Packet A | Tight post-marker red sequence

1. Expose only the narrow context-reader seam needed by tests.
2. Simulate successful same-route settle and a completed bounded payload read.
3. Leave the first later CDP evaluation unsettled and require the context read
   to terminate at an inner deadline rather than the outer context deadline.
4. Run the named test red against current behavior and capture the exact
   call/stage mismatch.

### Packet B | Ranked falsification

After Packet A is red, record three to five ranked, falsifiable hypotheses and
their observable predictions. Change one simulated boundary at a time. Admit a
repair only after the red sequence distinguishes the failing operation.

### Packet C | Narrow repair

Implement one repair seam proved by Packet B. Preserve full message, file,
source, artifact, identity, provider-guard, mutation-audit, chunking, outer
deadline, abort, and fail-closed semantics. Add bounded stage telemetry if it
is necessary to make future receipts identify the exact operation. Remove any
temporary debug instrumentation before validation.

### Packet D | Integrated validation and canary preparation

Run the focused red/green test, full ChatGPT adapter suite, browser-service UI
tests when touched, retained-session lifecycle tests, context tests,
history-materialization tests, completion tests, typecheck, zero-warning
touched Biome, production build, plan audit, and diff hygiene. Re-read runtime
state without mutation. Close this plan and prepare a separate one-canary plan
only if every provider-free criterion is green.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_model_turns: 10`;
  `max_diagnosis_hypotheses: 5`; `max_provider_free_repair_iterations: 3`;
  `max_source_repair_seams: 1`; `max_test_seam_exports: 1`;
  `max_canary_plans_prepared: 1`; `max_installs: 0`;
  `max_service_restarts: 0`; `max_provider_browser_calls: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [ ] One deterministic, fast, agent-runnable provider-free command is red on
  the exact post-marker stall boundary and records the precise stalled call.
- [ ] Three to five ranked hypotheses and predictions are recorded before the
  source repair.
- [ ] One proven seam is repaired and the exact red sequence becomes green
  without weakening content, identity, guard, or outer-deadline rules.
- [ ] Integrated provider-free validation, plan audit, and diff hygiene pass.
- [ ] Runtime readback remains stopped and unchanged except for independently
  changing read-only facts; any drift is reported rather than overwritten.
- [ ] If provider-free proof is complete, one fresh canary plan is prepared and
  withheld. No install, restart, browser/provider call, materialization start,
  completion control, or scheduler control occurs.

## Hard Stops

- Stop source repair if the focused red cannot distinguish the candidate
  operation, if more than one production seam must change, or if the proposed
  repair truncates or skips context content.
- Stop on dirty overlapping work, unexpected runtime/control movement,
  provider contact, a browser launch, identity/guard weakening, or a test that
  requires live credentials.
- A green provider-free gate authorizes only canary preparation. It does not
  authorize installation, restart, pass 45, a child job, another completion,
  or scheduler resume.

## Checkpoint 1 | Provider-Free Successor Opened

- `checkpoint_id`: `P0220-C01`
- `state_transition`: P0219_STOPPED_FAIL_CLOSED_REPEATED_CONTEXT_TIMEOUTS ->
  POST_NAVIGATION_PROVIDER_FREE_DIAGNOSIS_ACTIVE.
- `progress_classification`: evidence_and_authority_gain.
- `structural_evidence`: the next unobserved boundaries are bounded payload
  read followed by unconditional post-payload `waitForPredicate`; the latter's
  individual CDP evaluation is not interruptible today.
- `runtime_readback`: API PID 9910 active/running, zero restarts; scheduler
  paused; active jobs zero; wider passes `7/2/34`; target blocked/pass 44 with
  force ceiling null.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  materialization starts 0, completion controls 0, scheduler controls 0.
- `next_action_or_stop_reason`: commit and push this authority checkpoint, then
  build and run the exact provider-free red sequence before ranking hypotheses
  or modifying production behavior.
