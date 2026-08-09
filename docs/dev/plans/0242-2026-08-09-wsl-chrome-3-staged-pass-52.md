# WSL Chrome 3 Staged Pass-52 Canary | 0242-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Outcome: ACTIVE_ONE_PASS_52_CANARY
Goal execution state: ACTIVE
Gate state: OPEN_CHECKPOINT_COMMIT_REQUIRED

## Stable Objective

Run exactly one controlled pass on the retained `chatgpt/wsl-chrome-3`
completion after Plan 0241 proved a useful exact-file materialization. Advance
only pass 51 to at most pass 52, monitor its sole child and parent to their
first terminal result, and stop with the global scheduler and every wider
completion still paused.

## Current State

- Plan 0241 closed `C1_useful_yield` at pushed commit `e118b230`. Exact job
  `hmj_f315844a2d144fd0a3ecad37b004d4dc` downloaded one readable
  `Fence Guidelines.pdf` on attempt one with four-dimension identity proof
  `match`, then returned active history jobs and the exact browser to zero.
- Source and installed history-materialization bundles match exactly at
  `73d7de35b4661f2c7456b9887d31ce3ac85ef0380f3820eb46242a1cc4ab22a4`.
  API PID 55894 is active/running with `NRestarts=0`.
- Completion `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`
  is `idle_waiting` at pass 51, force ceiling null, error null, provider guard
  null, and retains full-missing-assets reconciliation with all asset kinds,
  `maxItems=6`, snapshot refresh enabled, and `force=false`.
- Scheduler is operator-paused and idle with active requests/reservations zero.
  Active history jobs, queued completions, and running completions are zero.
  Wider ChatGPT completions remain paused at default/wsl-chrome-2/
  wsl-chrome-4 passes 7/2/34. The exact managed browser is absent and port
  45015 is closed.
- The durable history-job index SHA-256 before this packet is
  `23d824ad3e371d863ded780da62d71825473dfad44ec3c0b51631086f3da2e30`.
  Current status reports 600 remote-known missing-local assets and 123 locally
  materialized assets for this target; those counts are readback, not authority
  for a wider campaign.

## Authority And Non-Goals

- The operator's `ok go` after Plan 0241 closeout authorizes this separately
  bounded staged action: one exact `run-one-pass` control on the retained
  `wsl-chrome-3` completion.
- Authorized effects: one completion control, at most one pass advance, one
  resulting durable child, one child attempt, at most one exact managed-browser
  launch/close, and the child's already-persisted `maxItems=6` materialization
  ceiling.
- Excluded: global scheduler control, any other completion control, pass 53,
  retry, force mutation, config/policy mutation, account-library mode change,
  provider-guard control, install/restart, direct runtime JSON edits, prompt
  submission, browser click, ChatGPT `Answer now`, separate materialization
  job, substitute asset/job, and automatic or wider resume.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; the user
  did not request delegation, and the completion/child/browser boundary must
  remain serialized.

## Execution Graph

1. Audit, commit, and push this frozen gate.
2. Re-read worktree, API, scheduler, exact/wider completion, guard, active-job,
   browser, bundle-parity, and durable-index state. Stop on drift.
3. Invoke exactly once:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --port 18095 --timeout-ms 15000 --json`.
4. Require at most pass `51 -> 52`, no pass 53, and no more than one fresh
   child. Monitor only that parent/child plus the frozen safety surfaces.
5. Stop at the first terminal parent/child classification. Close only an exact
   AuraCall-owned browser retained by this packet, then prove cleanup and the
   unchanged scheduler/wider-completion posture. Do not retry.

## Local Goal Bounds

- `max_work_unit_attempts: 1`; `max_review_rework_cycles: 0`;
  `max_hardening_checkpoints: 1`; `checkpoint_interval: 1 slices`.
- `completion_controls: 1`; `pass_advances: 1`; `fresh_children: 1`;
  `child_attempts: 1`; `child_max_items: 6`; `browser_launches: 1`;
  `browser_closes: 1`; `downloads: 6`.
- `scheduler_actions: 0`; `other_completion_actions: 0`; `pass_53_actions: 0`;
  `retries: 0`; `force_mutations: 0`; `config_mutations: 0`;
  `account_library_mode_changes: 0`; `guard_actions: 0`; `installs: 0`;
  `service_restarts: 0`; `direct_runtime_json_edits: 0`;
  `prompt_submissions: 0`; `browser_clicks: 0`; `answer_now_actions: 0`;
  `separate_materialization_jobs: 0`; `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`.
- `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`.
- `checkpoint_record_fields: plan_version, state_transition,
  progress_classification, evidence, subagent_status,
  next_action_or_stop_reason, authority_classification,
  review_disposition_summary`.

## Hard Stops

- Worktree/remote drift, bundle mismatch, API fault/restart, scheduler not
  paused/idle, active work, exact target not pass 51/idle-waiting/force-null,
  wider pass movement, provider guard, or browser/profile ownership ambiguity.
- Auth conflict, identity mismatch, CAPTCHA/challenge/human verification,
  `Answer now`, prompt request, unexpected fanout, second child, pass 53,
  provider timeout, pending operation, or service failure.
- Any terminal skip or failure ends this packet without retry or substitute.
  Record its exact classification and restore only exact owned browser cleanup.

## Terminal Classification

1. `C1_useful_pass_progress`: pass 52 settles with one child, failed count zero,
   at least one materialized asset/checksum, matching provider-session proof,
   and a parent with null force/error state.
2. `C2_clean_no_yield`: pass 52 and its child settle with failed count zero but
   materialized count zero; proves bounded settlement, not backlog completion.
3. `C3_asset_or_provider_terminal`: structured unavailable/missing/expired or
   other exact provider/asset terminal result without auth/challenge evidence.
4. `C4_auth_or_challenge_stop`: identity/auth/challenge/verification/guard or
   `Answer now` stop.
5. `C5_other_terminal_failure`: timeout, pending operation, API/browser fault,
   no child, unexpected fanout, pass drift, or any other ambiguity.

## Acceptance Criteria

- [ ] Opening gate is audited, committed, pushed, and freshly reread before
  the one completion control.
- [ ] Exactly one `wsl-chrome-3` `run-one-pass` control advances no farther than
  pass 52 and creates no more than one fresh child/attempt under `maxItems=6`.
- [ ] Exactly one C1-C5 terminal classification is recorded without retry,
  substitution, or another completion/materialization action.
- [ ] Exact child/parent evidence reports identity, provider work, outcome
  counts, checksums/manifests when present, pending/error state, and cleanup.
- [ ] API stays healthy; active jobs/browser return to zero; scheduler remains
  paused/idle; wider ChatGPT passes remain 7/2/34; guard remains null.
- [ ] Plan/journal evidence, active/goal plan audits, commit, and push complete.

## Opening Checkpoint | One Pass-52 Canary Ready

- `checkpoint_id`: `P0242-C01`.
- `state_transition`: P0241_CLOSED_C1_USEFUL_YIELD ->
  P0242_ACTIVE_PASS_52_GATE.
- `progress_classification`: outcome_progress.
- `evidence`: pushed Plan 0241 close `e118b230`; source/installed parity
  `73d7de35...b22a4`; API PID 55894 healthy; exact completion
  idle-waiting/pass 51/force null/error null/guard null; active work zero;
  scheduler paused/idle; wider passes 7/2/34; exact browser absent; durable
  job-index hash `23d824ad...a2e30`.
- `subagent_status`: not_spawned; one serialized live boundary.
- `next_action_or_stop_reason`: audit, commit, and push this gate; immediately
  reread all invariants; then consume the one completion control or stop on
  drift.
- `authority_classification`: separately authorized staged action inside the
  previous one-canary prerequisite; no scheduler or wider resume.
- `review_disposition_summary`: the exact materialization path has current
  useful-yield proof, so one retained-policy completion pass is accepted. A
  second pass or automatic resume remains rejected.

## Definition Of Done

The exact completion reaches one truthful pass-52 terminal classification or
stops fail-closed, exact browser/work state is cleaned, scheduler and wider
completions never move, and the evidence is committed and pushed.
