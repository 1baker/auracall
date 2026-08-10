# ChatGPT Staged Wider Recovery And Scheduler Resume | 0247-2026-08-09

State: OPEN
Lane: P01
Plan version: 1
Goal execution state: ACTIVE
Gate state: AUTHORIZED_PRE_DEFAULT_PASS

## Stable Objective

Restore the three paused, configured ChatGPT live-follow completions through
one serialized bounded pass each, prove all four ChatGPT lanes stable, then run
one scheduler canary and resume normal scheduler cadence. Preserve disabled
Gemini/Grok targets and all identity, guard, pacing, and browser safeguards.

## Current State

- Operator explicitly authorized broader completion recovery after Plan 0246
  closed the structured-exception repair and pass-56 canary.
- Source and installed runtime match at history-materialization hash
  `73d7de35b4661f2c7456b9887d31ce3ac85ef0380f3820eb46242a1cc4ab22a4`
  and ChatGPT adapter hash
  `ff3fe974478c6f28b975c82444a122c60759bc9404d4518337e1396c90d8baf6`.
  API PID 85854 is active/running with `NRestarts=0`.
- Scheduler is operator-paused/idle with foreground work false. Active history
  jobs and exact managed browsers are zero. All four ChatGPT guards are clear.
- Configured ChatGPT completions are default paused/pass 7,
  `wsl-chrome-2` paused/pass 2, `wsl-chrome-3` idle-waiting/pass 56, and
  `wsl-chrome-4` paused/pass 34; all have null force/next/error.
- Only those four ChatGPT targets have live follow enabled. Gemini and Grok
  live follow is disabled or unconfigured; the retained Gemini
  `google-sorry` guard remains excluded and must not be cleared or contacted.

## Authority And Non-Goals

- Authorized by the operator's explicit `authorized` response to the proposed
  broader completion recovery gate.
- Authorized: three serialized `run-one-pass` controls on the exact paused
  ChatGPT completions; one scheduler `run-once` canary; one scheduler resume;
  read-only monitoring; one emergency scheduler pause after resume; docs,
  audits, commit, and push.
- Excluded: Gemini/Grok completion or provider work; guard clearance; config,
  identity, pacing, or materialization-policy mutation; direct runtime JSON
  edits; install/restart; separate materialization; prompt submission; browser
  click; ChatGPT `Answer now`; retries or substitute completions.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; the four
  lanes share one provider serialization boundary and must remain sequential.

## Execution Graph

1. Audit, commit, and push this exact opening gate. Freshly re-read Git,
   hashes, API, scheduler, all target states, guards, jobs, and browsers.
2. Invoke `run-one-pass` exactly once on ChatGPT/default completion
   `acctmirror_completion_db1266f9-7b50-41d5-bf32-1adaddb735b3`; require only
   pass 8, one child/attempt, failed count zero, identity match, parent
   absorption, and full cleanup.
3. Only after step 2 is green, invoke `run-one-pass` exactly once on
   `wsl-chrome-2` completion
   `acctmirror_completion_bc68cd94-3f8e-4c2d-bd40-fc4299a5e591`; require only
   pass 3 and the same terminal receipts.
4. Only after step 3 is green, invoke `run-one-pass` exactly once on
   `wsl-chrome-4` completion
   `acctmirror_completion_65de7626-9aaf-4585-8224-601bee2cada4`; require only
   pass 35 and the same terminal receipts.
5. Require all four ChatGPT completions `idle_waiting`, disabled providers
   unchanged, scheduler paused/idle, guards clear, jobs/browser zero.
6. POST one `accountMirrorScheduler.action=run-once` with `dryRun=false` while
   the operator pause remains durable. Require exactly one new scheduler event
   selecting an enabled ChatGPT target and one clean terminal provider cycle.
7. POST one `accountMirrorScheduler.action=resume`. Verify normal scheduled/
   idle/running posture, durable unpaused state, enabled-target set unchanged,
   and no fault. If one automatic cycle begins during closeout, monitor only
   that cycle to terminal; emergency-pause on any hard-stop signal.
8. Verify current runtime, close docs, audit, commit, and push.

## Local Goal Bounds

- `max_work_unit_attempts: 5`; `max_review_rework_cycles: 0`;
  `max_hardening_checkpoints: 5`; `checkpoint_interval: 1 provider cycles`.
- `completion_controls: 3`; `scheduler_run_once_actions: 1`;
  `scheduler_resume_actions: 1`; `scheduler_emergency_pause_actions: 1`;
  `total_provider_passes: 5`; `total_pass_advances: 5`;
  `fresh_children: 5`; `child_attempts: 5`; `per_child_max_items: 6`;
  `cumulative_materialized_items: 30`; `browser_launches: 5`;
  `browser_closes: 5`; `downloads: 30`.
- `provider_retries: 0`; `substitute_completions: 0`;
  `other_provider_actions: 0`; `guard_actions: 0`; `config_mutations: 0`;
  `installs: 0`; `service_restarts: 0`; `separate_materialization_jobs: 0`;
  `direct_runtime_json_edits: 0`; `prompt_submissions: 0`;
  `browser_clicks: 0`; `answer_now_actions: 0`; `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `checkpoint_record_fields: plan_version, checkpoint_id, state_transition,
  progress_classification, evidence, subagent_status, effect_accounting,
  next_action_or_stop_reason, authority_classification,
  review_disposition_summary`.

## Per-Cycle Acceptance

- Exactly one expected pass advance and at most one child/attempt.
- Provider-work fence and configured interaction pacing are honored.
- Four-dimension provider-session verdict is `match`; guard remains clear.
- Child failed count is zero. Materialized assets may be zero when the clean
  receipt proves skipped/no-yield reconciliation and pass/cycle progress.
- Any materialized asset has readable file, size/MIME/checksum, manifest, and
  one available canonical archive receipt without duplicates.
- Parent absorbs to `idle_waiting` with force/next/error null; active jobs and
  owned browser return to zero before the next edge.

## Hard Stops

- Stop before any next edge on Git/hash/API drift, unexpected active work,
  duplicate browser-profile ownership, non-ChatGPT selection, disabled-target
  mutation, pass skip/fanout, second child, retry, failed item, missing receipt,
  identity mismatch/ambiguity, guard/CAPTCHA/challenge/human verification,
  prompt/`Answer now`, timeout, API/browser fault, or cleanup failure.
- Do not resume the scheduler unless all three direct lane passes and the
  paused scheduler run-once canary are green.
- After scheduler resume, one hard-stop signal consumes the sole emergency
  pause and ends the packet. No repair, retry, guard clear, or substitution is
  admitted in this plan.

## Acceptance Criteria

- [ ] Opening gate is audited, committed, pushed, and freshly reread.
- [ ] Default advances only pass 7 to 8 with a clean sole child/attempt.
- [ ] `wsl-chrome-2` advances only pass 2 to 3 with a clean sole child/attempt.
- [ ] `wsl-chrome-4` advances only pass 34 to 35 with a clean sole child/attempt.
- [ ] All four ChatGPT completions are stable; disabled providers are unchanged.
- [ ] One scheduler run-once canary is clean before one durable scheduler resume.
- [ ] Final API, scheduler, completion, guard, job, browser, file/archive, Git,
  audit, documentation, commit, and remote readbacks agree.

## Opening Checkpoint | Broader Recovery Authorized

- `checkpoint_id`: `P0247-C01`.
- `state_transition`: P0246_CLOSED_SUCCESS ->
  P0247_ACTIVE_AUTHORIZED_PRE_DEFAULT_PASS.
- `progress_classification`: outcome_progress.
- `evidence`: pushed Plan 0246 close `b6a215d0`; exact source/install hashes
  above; API PID 85854 healthy; scheduler paused/idle; active jobs/browser
  zero; ChatGPT completion passes/statuses `7 paused`, `2 paused`,
  `56 idle_waiting`, `34 paused`; clear ChatGPT guards; only ChatGPT live
  follow enabled; explicit operator authorization.
- `subagent_status`: not_spawned; serialized provider critical path.
- `effect_accounting`: all Plan 0247 effect counters zero.
- `next_action_or_stop_reason`: audit, commit, and push this gate; freshly
  verify every admission field; then run only the default pass-8 control.
- `authority_classification`: explicit wider recovery authorization with
  sequential fail-closed bounds and scheduler-last activation.
- `review_disposition_summary`: disabled-provider risk is rejected by current
  configuration; scheduler remains withheld until all direct and run-once
  proofs are green.

## Definition Of Done

The three paused ChatGPT completions each prove one clean bounded pass, all four
ChatGPT lanes are stable, one paused scheduler canary is clean, normal scheduler
cadence is durably resumed, excluded providers remain disabled/unchanged, and
all runtime plus repository evidence is current and pushed.
