# Scheduler Pause/Scope Repair And Live-Follow Reactivation | 0269-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: ACTIVE_PROVIDER_FREE_REPAIR
Goal execution state: ACTIVE_BOUNDED_EXECUTION

## Current State

Plan 0268 closed failed-safe after one scheduler resume selected raw-eligible
`chatgpt/wsl-chrome-2` even though operator status projected its active
completion as paused. The completed scheduler pass then invoked global
live-follow reconciliation, which independently started `chatgpt/default`.
Pausing that completion changed its public state but did not abort its active
collector: it later advanced to pass 1, queued one materialization child, and
launched another browser. The child settled skipped `0/7/0`; scheduler and
default completion are now paused, active jobs and canary browser owners are
zero, and only the unrelated retained `wsl-chrome-4` owner on 45017 remains.

Git is clean and synchronized at `12841040`. API PID 1886 is active/running
with zero restarts. Source/build and installed HTTP scheduler, scheduler pass,
reconciler, completion, and ChatGPT adapter files match. CodeGraph is healthy
at 882 files, 16,661 nodes, and 56,511 edges. The repo policy selector reports
the existing `skill-repo-maintainer` composition already aligned.

## Stable Objective

Repair the scheduler/completion control boundary provider-free, prove the
observed failure classes through public interfaces, install once, pass one
bounded real scheduler run canary while the durable scheduler remains paused,
then activate live follow again only if that canary proves one pause-aware
target, target-scoped reconciliation, and no delayed paused-completion work.

## Authority And Non-Goals

- The operator explicitly authorized the fix, tests, one passing single-run
  canary, and a subsequent live-follow activation attempt.
- Provider-free authority covers source/tests/docs, focused and adjacent
  validation, build/lint/typecheck, audit, commit, and push.
- Runtime authority after a green committed gate covers one user-runtime
  install/API restart, one execute-mode scheduler `run-once` canary while the
  durable scheduler remains paused, exact owned inspection/cleanup, and—only
  after full canary acceptance—one scheduler `resume` that may remain active
  after stable initial-pass verification.
- Any canary or activation mismatch immediately restores the durable scheduler
  pause and stops without retry.
- Excluded: provider retries, a second canary, completion resume/force/cancel,
  controls on retained `wsl-chrome-2/3/4` completions, Gemini/Grok work,
  prompt/model/click/`Answer now`/upload effects, guard/config/account-library
  mutation, direct runtime edits, release/publish, and subagents.

## Required Observable Behavior

1. Scheduler selection excludes an otherwise eligible target whose active
   completion is `operator_paused`; its metrics and selected target reflect the
   same canonical eligibility decision.
2. A scheduler dry-run, skip, or targetless pass cannot start live-follow
   completions. A completed execute refresh may reconcile only its selected
   provider/runtime-profile lane.
3. Completion `pause` aborts the active run. Once pause returns, that run cannot
   increment `passCount`, queue materialization, start provider work, or launch
   a later browser. Resume remains the only way to create a fresh run.
4. Browser launch must not fall back to a dynamic port while another live Chrome
   already owns the same managed browser profile directory. Reattach when
   ownership is attributable; otherwise fail closed without a second launch.

## TDD Execution Packet

1. Add one public-seam scheduler-service red reproducing the Plan 0268 target
   mismatch; minimally make selection use a caller-supplied canonical
   selectability decision and turn it green.
2. Add one reconciler/server red proving an executed pass cannot fan out to an
   unselected lane and that dry-run/skip paths are effect-free; minimally scope
   reconciliation and turn it green.
3. Add one completion-service red that pauses a pending refresh and proves no
   pass/materialization advance after the refresh settles; abort the active run
   on pause and turn it green.
4. Add one browser-service red for a live same-managed-directory owner under
   configured-port fallback; reattach or fail closed without launching a
   duplicate and turn it green.
5. Refactor only after every tracer is green. Run focused suites after each
   slice, then adjacent HTTP/browser/history suites, typecheck, scoped Biome,
   build, diff hygiene, CodeGraph sync/impact readback, and plan audits.

## Canary And Activation Gates

- Commit/push provider-free acceptance before installation. Repeat Git,
  scheduler/completion/job/browser/port/API/resource admission immediately
  before the sole install.
- Install once with the repo-owned user-runtime installer; require healthy new
  API PID, zero restarts, and exact installed parity for every touched runtime
  file.
- Keep the durable scheduler paused and run exactly one execute-mode scheduler
  `run-once`. Predict the target from the fixed canonical selector, record the
  pre/post ledger, and accept only one refresh plus reconciliation of that same
  lane. Require no new completion for any other lane, no delayed work from a
  paused completion, and exact browser ownership cleanup.
- Only after canary acceptance, issue one scheduler `resume`. Observe its first
  pass and at least one full post-pass reconciliation/readback interval. Accept
  only pause-aware selection, selected-lane reconciliation, no cross-lane
  completion creation, no duplicate managed-directory launch, active jobs
  consistent with the selected lane, healthy API/parity, and a scheduled/idle
  successor posture. Otherwise issue one fail-safe scheduler `pause` and stop.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 vertical slice`.
- `provider_free_red_green_cycles: 4`; `install_actions: 1`;
  `service_restarts: 1`; `scheduler_run_once_actions: 1`;
  `scheduler_canary_passes: 1`; `scheduler_resume_actions: 1`;
  `scheduler_fail_safe_pause_actions: 1`; `activation_observation_passes: 1`;
  `provider_retries: 0`; `second_canaries: 0`; `completion_controls: 0`;
  `other_provider_actions: 0`; `prompt_submissions: 0`; `model_selections: 0`;
  `browser_clicks: 0`; `answer_now_actions: 0`; `uploads: 0`; `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 1`; `review_verification_mode: closed_world`;
  `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`;
  `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`;
  `checkpoint_record_fields: plan_version, checkpoint_id, state_transition,
  progress_classification, evidence, subagent_status, effect_accounting,
  next_action_or_stop_reason, authority_classification,
  review_disposition_summary`.

## Hard Stops

- No provider/browser/install effect before all provider-free acceptance is
  committed and pushed.
- No live-follow resume unless the sole run-once canary passes every gate.
- Different target than canonical prediction, unselected-lane reconciliation,
  delayed paused-completion work, duplicate managed-directory ownership,
  second scheduler pass during canary, identity/guard/challenge drift, API
  health/parity failure, or ambiguous ownership stops immediately.
- Never click ChatGPT `Answer now`. Stop on CAPTCHA or human verification.

## Acceptance Criteria

- [x] Current failure mechanism, runtime posture, authority, and policy/index
  state are re-anchored.
- [ ] Four public-seam tracer bullets fail for the observed behavior before
  minimal implementation changes make them pass.
- [ ] Focused, adjacent, typecheck, lint, build, diff, CodeGraph, and plan audits
  pass from the committed provider-free repair.
- [ ] One install establishes healthy exact installed parity.
- [ ] One paused-scheduler execute canary proves canonical target selection,
  selected-lane-only reconciliation, pause integrity, and browser ownership.
- [ ] Live follow is resumed only after canary acceptance and remains healthy
  through the bounded activation observation with no cross-lane effects.
- [ ] Final runtime, Git, docs, and remote readbacks agree.

## Activation Checkpoint | Provider-Free Repair Authorized

- `checkpoint_id`: `P0269-C01`.
- `state_transition`: P0268_CLOSED_C5_SELECTOR_SCOPE_FAILURE ->
  P0269_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: explicit operator goal; clean/synced Git `12841040`; scheduler
  control paused since `2026-08-11T20:41:24.885Z`; default completion paused at
  pass 1 with terminal skipped child; active jobs and default/wsl-chrome-2
  browser owners zero; API PID 1886 healthy; exact installed parity; healthy
  CodeGraph; policy selector `already-aligned`.
- `subagent_status`: not_spawned.
- `effect_accounting`: provider/browser/install/runtime controls all zero for
  Plan 0269 at activation.
- `next_action_or_stop_reason`: audit, commit, and push the active gate, then
  execute the four provider-free vertical red-green slices.
- `authority_classification`: standing authority covers the complete fix,
  validation, sole canary, and conditional live-follow activation.
- `review_disposition_summary`: Plan 0268's four causal findings are accepted
  blocking criteria; no new broad discovery is needed before implementation.

## Definition Of Done

The observed scheduler/pause/ownership failure is repaired and provider-free
verified, the sole real canary passes, live follow is reactivated without
cross-lane or delayed paused-completion effects, and current runtime evidence
shows a healthy continuing scheduler rather than merely green source tests.
