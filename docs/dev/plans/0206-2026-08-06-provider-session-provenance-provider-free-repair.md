# Provider Session Provenance Provider-Free Repair | 0206-2026-08-06

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: ACTIVE
Gate state: CANARY_WITHHELD

## Stable Goal Objective

Reproduce, diagnose, and repair the local provenance-construction path that
caused the sole Plan 0205 exact-conversation read to stop with
`provider_session_provenance_missing`. Prove the repair provider-free and, only
after all source gates pass, install it once into the user runtime. Do not
contact ChatGPT, rerun the conversation read, create or execute a canary, start
materialization, or resume any scheduler/completion loop.

## Current State

- Plan 0205's one authorized live read is consumed. It failed closed after the
  provider observed the matching account but the authorization context retained
  only a browser target ID and DevTools endpoint; browser profile, managed
  browser profile, and process provenance were null.
- The terminal receipt records `provider_session_provenance_missing`, one
  attempt, and last stage `cdp:Runtime.enable`. The exact context cache is
  unchanged and the cone still lacks current live-control evidence.
- Source and installed Plan 0204 timeout behavior are already proven. The
  scheduler and six completions were paused, queued/running/idle-waiting were
  `0/0/0`, default pass 4 was unchanged, foreground was idle, the scoped guard
  was clear, and active history jobs were zero at Plan 0205 closeout.
- CodeGraph is healthy at 876 indexed files, 16,532 nodes, and 56,070 edges.
  Policy selection is `already-aligned`; the goal-policy audit reports no
  problems.

## Authority And Ownership

- The operator's `lk go`, interpreted in the established conversation as
  accepting the provider-free local repair recommendation, authorizes this
  bounded source/test/docs repair and at most one validated user-runtime
  install/restart.
- Authorized: provider-free fixture/harness construction; CodeGraph tracing;
  source and test edits at the provenance-construction seam; documentation;
  targeted, affected, and full non-live validation; one safe install/restart;
  installed provider-free proof; frozen-runtime readback; audit/commit/push.
- Excluded: provider/browser/DOM contact; context refresh; prompt; `Answer now`;
  download; durable job; canary execution; materialization callback; alternate
  asset/conversation; cache or receipt mutation; direct runtime JSON edits; and
  scheduler, completion, guard, or loop actions.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Diagnostic And Repair Contract

1. Establish one fast deterministic provider-free command that reaches the
   real provenance-construction seam and fails on the exact null-profile
   symptom.
2. Minimize the failing fixture, record three to five ranked falsifiable causes,
   and use CodeGraph plus one-variable probes to identify the causal path.
3. Preserve the safety authority: incomplete or mismatched sessions must still
   fail closed. Repair only the loss of already-resolved managed-session
   provenance.
4. Add a regression at the real call site and keep explicit-endpoint/manual
   caller behavior truthful; never infer ownership solely from a port, URL,
   target ID, or matching account.
5. Run focused and affected tests, typecheck, lint, build, full non-live tests,
   diff hygiene, and closed-world review. Install/restart once only if green.
6. Prove the installed repair with provider callbacks disabled and reconfirm all
   frozen scheduler/completion/canary/materialization controls.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 1`;
  `max_planning_commits: 1`; `max_source_commits: 1`;
  `max_closeout_commits: 1`; `max_codegraph_calls: 4`;
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

1. `AWAITING_PROVIDER_FREE_REPRO -> DIAGNOSING` after the audited and pushed
   planning boundary plus a red-capable deterministic repro.
2. `DIAGNOSING -> REPAIRING` only when evidence distinguishes the causal path
   from the ranked alternatives without weakening the authority gate.
3. `REPAIRING -> VALIDATING` after the regression turns green and incomplete
   provenance remains fail-closed.
4. `VALIDATING -> COMPLETE_PROVIDER_FREE_LIVE_WITHHELD` only after source and
   installed provider-free proof plus frozen-runtime readback pass.
5. Any need for provider contact, inferred ownership, second install/restart,
   runtime-control mutation, or repeated no-progress transitions to
   `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [ ] One fast, deterministic, agent-runnable regression reproduces the exact
  null provenance construction and turns green after the repair.
- [ ] The causal path is recorded from ranked falsifiable hypotheses and
  structural evidence; the fix uses resolved managed-session provenance rather
  than endpoint/account inference.
- [ ] Existing incomplete, conflicting, and stale session cases remain
  fail-closed with stable authority semantics.
- [ ] Focused/affected tests, typecheck, lint, build, full non-live suite, diff
  hygiene, and closed-world review pass.
- [ ] At most one install/restart produces source/runtime parity and one
  provider-callback-disabled installed proof.
- [ ] Plan, ROADMAP, RUNBOOK, journal, fixes log, audits, git/remote state, and
  final frozen-runtime readback agree; no live read, canary, job,
  materialization, or loop/control action occurs.

## Hard Stops And Non-Goals

- Do not contact ChatGPT or inspect a live DOM/browser target in this packet.
- Do not infer managed-session ownership from a matching account, endpoint,
  URL, or target ID alone.
- Do not weaken or bypass `provider_session_provenance_missing`.
- Do not run the frozen cone canary or resume scheduler/completion loops.

## Definition Of Done

The real local construction seam preserves verified managed-session provenance
through the exact retained-target shape, incomplete sessions still fail closed,
source and installed provider-free proofs are green, and the one-canary gate,
materialization, scheduler, and completions remain frozen.

## Checkpoint 1 | Provider-Free Repair Opened

- `plan_version`: 1
- `checkpoint_id`: `P0206-C01`
- `state_transition`: STOPPED_FAIL_CLOSED -> AWAITING_PROVIDER_FREE_REPRO.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0206 and canonical planning/doc wiring only.
- `evidence`: Plan 0205 receipt and cache adjudication; explicit operator go;
  clean synchronized `8fa0b2ff`; healthy CodeGraph; policy selector
  `already-aligned`; green goal-policy audit.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; CodeGraph calls 2/4; one policy
  selection and one goal-policy audit; all source, test, install, restart,
  provider, browser, job, callback, canary, materialization, prompt, download,
  and runtime-control counts zero.
- `remaining_criteria`: all six acceptance items.
- `authority_classification`: provider-free local repair and one conditional
  install/restart only; live read and all effectful canary/materialization/
  control authority remain withheld.
- `review_disposition_summary`: inherited closed-world verification; no new
  broad discovery pass or delegated review.
- `next_action_or_stop_reason`: audit, commit, and push the planning boundary;
  then create and run the exact provider-free regression before causal claims.
