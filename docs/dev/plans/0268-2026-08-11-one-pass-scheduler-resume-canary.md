# One-Pass Scheduler Resume Canary | 0268-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: ACTIVE_ONE_SCHEDULER_PASS
Goal execution state: ACTIVE_BOUNDED_EXECUTION

## Current State

Plan 0267 closed `C1_useful_pass_progress`: exact `wsl-chrome-3` pass 57
materialized six verified assets with zero failures. Git is clean and
synchronized at `2030ce52`; API PID 1886 is active/running with
`NRestarts=0`; source and installed scheduler, reconciler, completion, HTTP,
and ChatGPT adapter hashes match exactly. The scheduler is enabled in execute
mode at a 600000 ms cadence but durably paused/paused with no prior wake in
this process. Active history jobs are zero.

The deterministic installed selector admits only enabled eligible targets and
chooses one. Current ChatGPT posture predicts `default`: it is eligible,
in-progress/pass 9 with 12 detail surfaces, 88 missing-local assets, no active
completion, and a clear guard. `wsl-chrome-3` is eligible but complete/pass 57;
`wsl-chrome-2` and `wsl-chrome-4` are operator-paused. Default and
`wsl-chrome-3` have no browser owner on ports 45011/45015. The unrelated
retained `wsl-chrome-2` owner on 45013 and `wsl-chrome-4` owner on 45017 are
outside this packet and must not be touched.

## Stable Objective

Exercise the real durable scheduler-resume path for exactly its first
operator-resume pass, immediately restore the durable scheduler pause after
that pass starts, observe the sole selected refresh and any one default
completion it reconciles, contain that completion before a second pass, verify
all runtime/file receipts, and stop.

## Authority And Non-Goals

- The operator's `ok go` explicitly approves the recommended short
  scheduler-resume canary.
- Authorized: one scheduler `resume`; one scheduler pass; one planned scheduler
  `pause` after that pass starts; the selector's sole expected
  `chatgpt/default` refresh; at most one newly reconciled default completion,
  its first pass/child/attempt, and one exact completion `pause`; at most six
  materializations; read-only monitoring; exact owned cleanup; docs/audit/
  commit/push.
- This is not an unattended or lasting scheduler resume. The scheduler must end
  paused before closeout under every outcome.
- Excluded: a second scheduler pass, scheduler dry-run/run-once, controls on
  existing `wsl-chrome-2/3/4` completions, Gemini/Grok provider work, retries,
  substitute completions, separate materialization, install/restart,
  force/guard/config/account-library/identity/pacing mutation, direct runtime
  edits, prompts, model selection, clicks, ChatGPT `Answer now`, uploads, or
  unrelated browser cleanup.
- Critical-path owner: primary agent. No subagent is authorized.

## Installed Control-Flow Proof

- `resume` durably writes `paused=false` and schedules an immediate
  `operator-resume` pass.
- A scheduler pass selects exactly one eligible enabled target and performs one
  refresh.
- A `pause` received while the pass is running durably writes `paused=true`;
  the active pass may settle, but the 600000 ms cadence successor cannot be
  scheduled.
- After pass settlement, live-follow reconciliation may start one new default
  completion because default has no active completion. Existing
  `wsl-chrome-2/4` paused completions remain untouched and the existing
  `wsl-chrome-3` completion remains the steady-follow owner.

## Frozen Execution Packet

1. Audit, commit, and push this gate. Re-read Git, installed hashes, API,
   scheduler, target decisions, completions, guards, active jobs, browsers,
   sockets, and host memory.
2. Record the pre-control scheduler history timestamp/count and current
   process-local `lastStartedAt`.
3. POST one `accountMirrorScheduler.action=resume` to local `/status`. Require
   execute mode and a successful `resume` control receipt.
4. Poll read-only status at sub-second cadence for a fresh
   `lastWakeReason=operator-resume` plus fresh `lastStartedAt`. Once observed,
   POST the sole `pause` immediately. A local exit trap attempts that same
   idempotent pause if the observer exits early. If no first-pass start appears
   within 30 seconds, pause and stop without another resume.
5. Require durable paused/paused immediately, then monitor the already-started
   pass to terminal. Require exactly one new scheduler ledger row and expected
   selection `chatgpt/default`; any different target is a terminal hard stop,
   not authority for another pass.
6. After scheduler settlement, detect at most one newly reconciled default
   completion. If present, issue one exact `pause` immediately. Allow only its
   already-started first pass, at most one child/attempt, retained
   `maxItems=6`, and `force=false`; monitor that owned work to terminal and
   require the parent paused before stopping.
7. Independently verify identity/guard evidence and every claimed file by MIME,
   size, SHA-256, manifest, and one canonical archive lookup. Inspect exact
   ports 45011/45015 and close at most one canary-owned leftover process per
   profile only after ownership attribution. Never touch ports 45013/45017.
8. Verify scheduler paused, no second scheduler row/pass, active jobs zero,
   unrelated completion passes unchanged, healthy API/parity, clean/synced
   Git, then close docs, audit, commit, push, and stop.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 0`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 provider cycle`.
- `scheduler_resume_actions: 1`; `scheduler_pause_actions: 1`;
  `scheduler_passes: 1`; `scheduler_selected_targets: 1`;
  `scheduler_refreshes: 1`; `new_default_completions: 1`;
  `new_default_completion_pause_actions: 1`;
  `new_default_completion_passes: 1`; `fresh_children: 1`;
  `child_attempts: 1`; `per_child_max_items: 6`;
  `cumulative_materialized_items: 6`; `new_browser_launches: 2`;
  `browser_closes: 2`; `downloads: 6`.
- `scheduler_second_passes: 0`; `scheduler_run_once_actions: 0`;
  `existing_completion_controls: 0`; `provider_retries: 0`;
  `substitute_completions: 0`; `separate_materialization_jobs: 0`;
  `gemini_grok_actions: 0`; `guard_actions: 0`; `config_mutations: 0`;
  `installs: 0`; `service_restarts: 0`; `direct_runtime_edits: 0`;
  `prompt_submissions: 0`; `model_selections: 0`; `browser_clicks: 0`;
  `answer_now_actions: 0`; `uploads: 0`; `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `checkpoint_record_fields: plan_version, checkpoint_id, state_transition,
  progress_classification, evidence, subagent_status, effect_accounting,
  next_action_or_stop_reason, authority_classification,
  review_disposition_summary`.

## Terminal Classification

1. `C1_scheduler_canary_progress`: sole default scheduler refresh settles
   cleanly, identity/guard/ownership stay valid, any new default completion is
   contained within its first clean pass, and scheduler ends paused.
2. `C2_clean_scheduler_no_yield`: the sole pass cleanly skips or yields without
   provider failure, no unsafe completion starts, and scheduler ends paused.
3. `C3_scheduler_path_progress_with_contained_completion_failure`: scheduler
   control/selection/repause are proven but the new default completion exposes
   one exact terminal failure; it is contained with no retry.
4. `C4_auth_guard_or_challenge_stop`: identity mismatch, provider guard,
   CAPTCHA/challenge/human verification, signed-out evidence, or `Answer now`.
5. `C5_control_or_scope_failure`: second pass, different target, fanout,
   failed re-pause, timeout, API/browser fault, missing receipt, or ambiguous
   ownership.

## Hard Stops

- Stop before resume on Git/hash/API/scheduler/target/job/ownership/resource
  drift. Do not manufacture admission by touching unrelated retained owners.
- The pause is mandatory as soon as the first pass start is observed. A pause
  failure forbids further monitoring-only optimism: retry the same idempotent
  pause at most through the exit trap, then stop and report exact state.
- Stop after the sole scheduler pass and at most the sole default completion
  pass. No retry, repair, second target, second scheduler pass, or lasting
  resume is inferred from any classification.

## Acceptance Criteria

- [x] Explicit operator approval and provider-free installed-flow proof.
- [x] Fresh clean/synced admission predicts exactly `chatgpt/default` and
  proves zero default/`wsl-chrome-3` owners plus zero active jobs.
- [ ] Active gate is audited, committed, pushed, and freshly reread before the
  sole resume.
- [ ] Exactly one operator-resume pass starts and the durable pause is restored
  before any second cadence pass.
- [ ] Sole scheduler refresh and any one new default completion are terminally
  classified with independently verified receipts.
- [ ] Final scheduler, completions, guards, jobs, browsers, sockets, API,
  parity, Git, docs, audit, commit, and remote readbacks agree.

## Activation Checkpoint | One Scheduler Pass Authorized

- `checkpoint_id`: `P0268-C01`.
- `state_transition`: P0267_CLOSED_C1_USEFUL_PASS_PROGRESS ->
  P0268_ACTIVE_ONE_SCHEDULER_PASS.
- `progress_classification`: outcome_progress.
- `evidence`: explicit operator `ok go`; clean/synced Git `2030ce52`; healthy
  API PID 1886; exact installed parity across HTTP scheduler control,
  scheduler selection, live-follow reconciliation, completion service, and
  ChatGPT adapter; scheduler paused/paused in execute mode at 600000 ms;
  active jobs zero; deterministic sole selection `chatgpt/default`; exact
  default and `wsl-chrome-3` owners zero; host available memory 38 GiB.
- `subagent_status`: not_spawned.
- `effect_accounting`: every Plan 0268 live/control/browser/download counter is
  zero at activation.
- `next_action_or_stop_reason`: audit, commit, and push this gate; repeat exact
  admission; then execute the resume/start-observation/re-pause packet once.
- `authority_classification`: one short real scheduler-resume canary with
  mandatory first-pass re-pause and bounded reconciliation containment.
- `review_disposition_summary`: a bare resume would also reconcile a new
  unbounded default completion. The frozen packet accepts only one real
  scheduler pass and proactively contains that expected completion before a
  second pass.

## Definition Of Done

Exactly one scheduler pass is classified, every scheduler-created effect is
bounded and settled, scheduler posture is durably paused, and no second pass,
retry, or unrelated target action occurs.
