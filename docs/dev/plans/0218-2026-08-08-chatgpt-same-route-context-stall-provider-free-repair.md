# ChatGPT Same-Route Context Stall Provider-Free Repair | 0218-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Goal execution state: IN_PROGRESS_PROVIDER_FREE
Future canary gate: NOT_PREPARED

## Stable Goal Objective

Reproduce the installed pass-43 sequence in which one ChatGPT conversation
context succeeds and later same-route context reads stall, isolate the exact
inner operation provider-free, repair only the proven seam, and validate the
complete context/materialization path without provider callbacks. If and only
if that gate is green, prepare one fresh `wsl-chrome-3` canary behind a separate
approval boundary. Do not install, restart, invoke a browser/provider, start
materialization, control a completion, or resume the scheduler.

## Current Evidence

- Plan 0217 consumed its sole live canary and closed fail-closed. Child
  `hmj_91dddf3b7448457c8a82ccbe639cc958` attempted six conversations, produced
  `0` materialized, `3` skipped, and `4` failed rows, and matched all four
  provider-session identity dimensions with zero provider-guard exclusions.
- Conversation `6a5e4bf8-972c-83ea-ad2f-3ad57f2a153f` completed once in
  14292 ms. Four later conversations timed out once near 110 seconds with
  `errorCode=conversation_context_timeout`; their last promoted action was
  `provider:chatgpt.skipSameRouteNavigation`.
- That action proves `navigateAndSettle` returned a no-mutation result before
  the outer timeout. It does not identify which later awaited operation failed
  to settle, so the stage is routing evidence rather than a root-cause claim.
- Source and installed adapter parity was exact at
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667` when
  Plan 0217 closed. Current source remains clean and pushed at `92348f35`.
- Current readback is API PID 81696 active/running with `NRestarts=0`;
  scheduler state/posture paused; active history jobs `0`; default,
  `wsl-chrome-2`, and `wsl-chrome-4` paused at passes `7/2/34`; and target
  `wsl-chrome-3` blocked/pass `43` with force ceiling null and
  `account_mirror_materialization_failed`.

## Authority And Effect Boundary

- Provider-free source, test, plan, journal, runbook, roadmap, and fix-log
  changes are authorized under this plan.
- Deterministic fake-CDP callbacks may simulate a ready same route, a first
  successful context, a later unsettled operation, abort, cleanup, and a next
  independent read. They must not connect to Chrome or a provider.
- Installed-runtime changes, API restarts, provider/browser calls, prompt or
  composer actions, `Answer now`, browser clicks/navigation, durable history
  materialization jobs, completion controls, scheduler controls, and direct
  runtime-state edits are excluded.
- The future canary artifact may freeze one exact `wsl-chrome-3` control, but
  this plan cannot approve or execute that control. A later explicit operator
  approval is required.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Provider-Free Execution Packets

### Packet A | Tight red sequence

1. Add one focused adapter regression using fake CDP and telemetry only.
2. Simulate a conversation already at its requested route and ready surface.
3. Require the successful same-route settle to hand control directly to the
   next context operation without an unbounded or redundant readiness wait.
4. Run the named test red against current source and record the exact mismatch.

### Packet B | Ranked falsification

After Packet A is red, publish three to five ranked hypotheses with one
observable prediction each. Test one variable at a time. Do not change source
until the failing operation is localized and a regression expresses the
required behavior.

### Packet C | Narrow repair

Implement only the smallest repair proved by Packet B. Preserve full message,
file, source, artifact, identity, provider-guard, mutation-audit, chunking,
deadline, abort, and fail-closed contracts. Remove temporary instrumentation
before validation.

### Packet D | Integrated validation and canary preparation

Run the focused red/green test, full ChatGPT adapter suite, retained-session
lifecycle tests, context tests, history-materialization tests, completion
tests, typecheck, zero-warning touched Biome, production build, plan audit, and
diff hygiene. Re-read runtime state without mutating it. Then close this plan
and prepare a separate one-canary artifact with no live authorization.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_diagnosis_hypotheses: 5`;
  `max_provider_free_repair_iterations: 3`; `max_source_repair_seams: 1`;
  `max_canary_plans_prepared: 1`; `max_installs: 0`;
  `max_service_restarts: 0`; `max_provider_browser_calls: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [ ] A deterministic provider-free sequence is red against current behavior
  and reproduces the same-route handoff/stall boundary without provider calls.
- [ ] Ranked hypotheses and predictions are recorded before source repair.
- [ ] The proven seam is repaired by one narrow change and the exact red test
  becomes green without weakening content, identity, guard, or deadline rules.
- [ ] Integrated provider-free validation, plan audit, and diff hygiene pass.
- [ ] Runtime readback remains PID 81696/zero restarts, scheduler paused, jobs
  zero, passes `7/2/34/43`, and target force ceiling null unless external state
  independently changes; any such change is reported, not overwritten.
- [ ] One fresh `wsl-chrome-3` canary plan is prepared and withheld. No install,
  restart, provider/browser call, materialization start, completion control, or
  scheduler control occurs.

## Hard Stops

- Stop source repair if the focused red cannot distinguish the failing inner
  operation or if more than one seam must change.
- Stop on dirty overlapping user work, unexpected runtime/control movement,
  provider contact, a browser launch, identity/guard weakening, content
  truncation, or a test that requires live credentials.
- A green provider-free gate authorizes only canary preparation. It does not
  authorize install, restart, pass 44, a child job, retry, wider completion
  movement, or scheduler resume.

## Checkpoint 1 | Provider-Free Successor Opened

- `checkpoint_id`: `P0218-C01`
- `state_transition`: P0217_STOPPED_FAIL_CLOSED_REPEATED_CONTEXT_TIMEOUTS ->
  SAME_ROUTE_PROVIDER_FREE_DIAGNOSIS_ACTIVE.
- `progress_classification`: authority_and_evidence_gain.
- `evidence_boundary`: four repeated promoted receipts identify the last
  completed provider action but do not yet prove the later blocking operation.
- `runtime_readback`: API PID 81696 active/running, zero restarts; scheduler
  paused; active jobs zero; intended target passes `7/2/34/43`; target blocked
  with force ceiling null.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  materialization starts 0, completion controls 0, scheduler controls 0.
- `next_action_or_stop_reason`: commit and push this provider-free authority,
  then create and run the tight red fake-CDP sequence before publishing ranked
  hypotheses or changing source.
