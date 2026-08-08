# ChatGPT Post-Navigation Pending-Operation Observability | 0222-2026-08-08

State: CLOSED
Lane: P01
Plan version: 1
Gate state: COMPLETE_PROVIDER_FREE_EFFECT_GATE_WITHHELD
Goal execution state: COMPLETE

## Stable Goal Objective

Provider-free, reproduce the pass-45 receipt gap after
`provider:chatgpt.skipSameRouteNavigation`, make the currently pending
operation observable rather than reporting only the last completed action,
and implement at most one repair seam if a deterministic red proves it. Stop
before install, restart, provider/browser contact, materialization, completion
control, scheduler control, or another canary.

## Current State

- Plan 0221's sole installed canary advanced pass `44 -> 45` and created only
  child `hmj_a3c6daa3e06d45a49889638047a4561f`.
- The child matched all four provider identity dimensions and had zero
  provider-guard exclusions, but failed on attempt one with conversations/
  materialized/skipped/failed `6/0/3/4`.
- One context succeeded in 11350 ms. Four later contexts timed out once after
  109085, 109095, 109088, and 109097 ms. Every timeout receipt retained last
  stage `provider:chatgpt.skipSameRouteNavigation`.
- `lastStage` is updated only when scrape telemetry observes a provider action
  or CDP call. `chatgpt.waitPostPayloadReadiness` is emitted only after the
  preceding payload-read promise settles, so the retained receipt narrows the
  gap but cannot name the in-flight await inside it.
- Installed/source adapter parity remains `3917b2d2...633d`; API PID 13464 is
  healthy with zero restarts; scheduler is paused; active jobs are zero; wider
  ChatGPT passes remain `7/2/34`; target is blocked/pass 45 with force ceiling
  null.

## Authority And Scope

- Authorized work is repository-local and provider-free: plan/docs, fake-CDP
  or equivalent deterministic tests, diagnostic state semantics, and at most
  one evidence-backed repair within the existing context-read boundary.
- The feedback loop must exercise the real adapter-to-`LlmService` telemetry
  seam and fail on the exact symptom: a timeout receipt that names only a
  completed marker while an unobserved operation remains pending.
- Paired operation start/settled/error evidence may be added at the narrowest
  provider-owned boundary. Receipt changes must contain bounded diagnostic
  metadata only, never raw conversation content, credentials, or provider
  payloads.
- Expected write surface: this plan and canonical docs; focused tests under
  `tests/browser/`; `src/browser/providers/chatgptAdapter.ts` and/or the
  existing context-read receipt/telemetry boundary only when the red requires
  them.
- No install, service restart, API mutation, provider/browser call, manual
  navigation, materialization start, completion control, scheduler control,
  prompt, click, `Answer now`, guard bypass, or direct runtime JSON edit is in
  scope.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Execution Packet

1. Build one fast deterministic provider-free reproducer at the real
   adapter/receipt seam. Run it red before changing production behavior.
2. Minimize the sequence so every retained fake-CDP or telemetry event is
   load-bearing.
3. Rank three to five falsifiable hypotheses and map each accepted probe to a
   specific prediction.
4. Add only the diagnostic boundary needed to distinguish the ranked
   hypotheses. Tagged temporary diagnostics, if any, use `[DEBUG-p0222]` and
   are removed before closeout.
5. If the red proves one bounded repair seam, implement it and make the exact
   reproducer green. Otherwise close with the newly precise diagnosis and no
   speculative repair.
6. Run focused and adjacent provider-free suites, typecheck, touched-surface
   lint, production build when runtime output changes, plan audit, and diff
   hygiene. Commit and push, then stop before effects.

## Acceptance Criteria

- [x] One named, agent-runnable command is fast, deterministic, and red-capable
  for the exact missing-pending-operation symptom.
- [x] The minimized baseline run is captured red before production behavior
  changes.
- [x] Three to five hypotheses are ranked with falsifiable predictions and
  tested one variable at a time.
- [x] Timeout receipts distinguish the last completed action from the
  currently pending operation at the post-navigation boundary.
- [x] Any accepted repair is proven by the exact red turning green; otherwise
  the plan closes diagnosis-only without speculative behavior changes.
- [x] Focused/adjacent provider-free validation, typecheck, lint, applicable
  build, plan audit, and diff hygiene pass.
- [x] Installed runtime and all live controls remain unchanged; exact evidence
  is committed and pushed.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_reproducer_designs: 2`;
  `max_reproducer_runs_before_red: 3`; `max_hypotheses: 5`;
  `max_production_repair_seams: 1`; `max_review_rework_cycles: 1`;
  `max_installs: 0`; `max_service_restarts: 0`;
  `max_provider_browser_calls: 0`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_browser_clicks: 0`; `max_browser_navigations: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Hard Stops

- Stop on any provider/browser contact, installed/runtime mutation, live job or
  completion movement, scheduler movement, dirty worktree not owned by this
  packet, inability to construct the tight red within its bounds, or a required
  second production repair seam.
- Do not infer current-await causality from `lastStage`; require the red and
  paired operation evidence.
- Another installed canary or wider resume requires a separately prepared
  effect artifact and explicit approval.

## Checkpoint 1 | Provider-Free Successor Opened

- `checkpoint_id`: `P0222-C01`
- `state_transition`: P0221_STOPPED_FAIL_CLOSED ->
  PROVIDER_FREE_PENDING_OPERATION_DIAGNOSIS_ACTIVE.
- `progress_classification`: blocker_reduction.
- `authority_classification`: the operator approved the recommended
  provider-free successor; live-effect authority remains zero.
- `evidence`: pass-45 child and promoted receipt metrics above; current source
  flow shows `skipSameRouteNavigation`, then payload read, then
  `waitPostPayloadReadiness`, while the outer receipt records only the latest
  telemetry update.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  materialization starts 0, completion controls 0, scheduler controls 0.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: missing pending-operation identity is blocking;
  another live canary is rejected from this packet.
- `next_action_or_stop_reason`: build and run the exact fast red before any
  production behavior change.

## Checkpoint 2 | Deterministic Red, Bounded Repair, And Closeout

- `checkpoint_id`: `P0222-C02`.
- `state_transition`: PROVIDER_FREE_PENDING_OPERATION_DIAGNOSIS_ACTIVE ->
  COMPLETE_PROVIDER_FREE_EFFECT_GATE_WITHHELD.
- `progress_classification`: blocker_reduction_complete.
- `exact_reproducer`:
  `pnpm vitest run tests/browser/llmServiceContext.test.ts -t "preserves the pending ChatGPT payload operation separately"`.
- `baseline_red`: the real adapter-to-`LlmService` fake-CDP sequence failed
  twice in 51 ms and 48 ms because the timeout receipt retained
  `provider:chatgpt.skipSameRouteNavigation` but had no `pendingOperation`.
  All other expected receipt fields matched.
- `ranked_hypothesis_disposition`:
  1. confirmed blocking: scrape telemetry had no explicit pending-operation
     state, so the outer receipt could only promote completed action/CDP
     counters;
  2. rejected: emitting a `.start` provider action would move `lastStage` but
     still conflate completed and currently pending semantics;
  3. rejected: CDP-only telemetry would report `Runtime.evaluate` and lose the
     provider-owned payload boundary;
  4. covered by the repair: outer abort may win before the underlying task
     settles, so pending state remains until that task's own `finally`;
  5. covered by the repair: token-owned entries prevent a settled operation
     from clearing a newer operation or restoring an already-settled one.
- `repair`: one generic scrape-telemetry pending-operation scope wraps the
  initial ChatGPT payload read. Snapshot receipts now carry optional bounded
  `pendingOperation` metadata while `lastStage` remains the last completed
  marker. Token-owned entry tests prove nested and out-of-order settlement
  semantics; no raw provider data is retained.
- `exact_green`: the same reproducer passes in 42-46 ms and records
  `lastStage=provider:chatgpt.skipSameRouteNavigation` plus
  `pendingOperation=provider:chatgpt.readConversationPayload`.
- `validation`: focused adapter/context/materialization tests pass 235/235;
  the seven-file adjacent gate passes 390/390; TypeScript typecheck, production
  build, full lint with 206 retained warnings, and zero-fix scoped Biome on the
  six formatter-managed touched files pass; `[DEBUG-p0222]` marker scan is
  empty; plan audit and diff hygiene pass at closeout.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  materialization starts 0, completion controls 0, scheduler controls 0,
  browser clicks/navigations 0, prompts 0, `Answer now` clicks 0, guard bypasses
  0, direct runtime JSON edits 0.
- `next_action_or_stop_reason`: stop before effects. A fresh pass-46
  `wsl-chrome-3` canary requires a separate frozen effect artifact and explicit
  approval; scheduler and wider completion resume remain excluded.
