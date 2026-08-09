# Fence Guidelines Installed One-Canary | 0241-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Outcome: ACTIVE_INSTALL_EXACT_CANARY
Goal execution state: ACTIVE
Gate state: INSTALL_PARITY_AND_FRESH_READBACK_REQUIRED

## Stable Objective

Install the validated broad catalog-family repair, prove source/installed
parity, and run at most one direct `wsl-chrome-3` exact-catalog canary for the
frozen `Fence Guidelines.pdf` file while the scheduler and every completion
control remain untouched.

## Current State

- Plan 0240 closed at pushed commit `e2f7d7ec`. All 76 focused history tests,
  typecheck, scoped lint, build, and provider-free retained replay passed.
- Current source bundle SHA-256 is
  `73d7de35b4661f2c7456b9887d31ce3ac85ef0380f3820eb46242a1cc4ab22a4`;
  installed bundle SHA-256 is the prior
  `625739bca9473885de39eadf3b104664ca009ddbd5200987c64237f941744455`,
  so one install/restart is required before live work.
- Broad provider-free `maxItems=1` now selects conversation
  `6a526cdb-580c-83ea-ab97-ab95a85f6975`. One exact replay freezes file catalog
  item
  `6a526cdb-580c-83ea-ab97-ab95a85f6975:c836da7e-c513-419a-8c13-a8ab62a0873d:0:Fence Guidelines.pdf`,
  provider file ID `file_00000000c980722f8f18eeb8a63d72a7`, on
  `chatgpt/wsl-chrome-3`, bound identity `eric.cochran@soylei.com`.
- The exact replay reached one disabled `materializeConversation` seam with no
  unexpected/provider implementation call; cache detail had no local path or
  checksum; archive/job terminal admission did not reject it; the 1,884-job
  index stayed byte-identical at `641836ac...b41087`.
- API PID 90242 is healthy with zero restarts. Scheduler is paused/idle, active
  exact history jobs are zero, target completion is idle-waiting at pass 51,
  wider ChatGPT completions remain paused at 7/2/34, and the exact managed
  browser/port 45015 are absent.

## Authority And Non-Goals

- The standing goal authorizes this bounded installed successor and sole exact
  canary; no scheduler or completion resume is authorized or implied.
- Authorized effects: one user-runtime/service install path and resulting API
  restart; one durable exact history-materialization job, one attempt, at most
  one exact managed-browser launch/close, and at most one file download.
- Excluded: scheduler control, completion control or pass 52, guard control,
  retry, force, snapshot refresh, prompt submission, browser click, ChatGPT
  `Answer now`, a second job/asset/browser, direct runtime JSON edits, and wider
  materialization.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; delegation
  was not requested, and install/gate/job/browser cleanup share one serialized
  runtime boundary.

## Execution Graph

1. Audit, commit, and push this frozen gate; re-read stopped runtime posture.
2. Execute one `install:user-runtime-service`; prove exact bundle parity and a
   healthy single API restart with stopped controls preserved.
3. Recheck exact catalog ownership, active-job zero, cache-only no-local state,
   terminal archive/job absence, exact browser absence, scheduler pause, target
   pass 51, and wider passes 7/2/34.
4. Create one direct exact file job with `maxItems=1`, `force=false`, no snapshot
   refresh, and provider-work timeout 300000 ms.
5. Monitor only that job plus API, exact browser, scheduler, target, and wider
   completion posture to its first terminal state. Do not retry.
6. Close only an AuraCall-owned exact managed browser retained by this job,
   prove process/port cleanup and active jobs zero, then record the exact
   terminal classification.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 slices`.
- `installs: 1`; `service_restarts: 1`; `durable_history_jobs: 1`;
  `job_attempts: 1`; `provider_materialization_callbacks: 1`;
  `browser_launches: 1`; `browser_closes: 1`; `downloads: 1`.
- `scheduler_actions: 0`; `completion_actions: 0`; `guard_actions: 0`;
  `retries: 0`; `force_actions: 0`; `snapshot_refreshes: 0`;
  `prompt_submissions: 0`; `browser_clicks: 0`; `answer_now_actions: 0`;
  `direct_runtime_json_edits: 0`; `wider_materialization_actions: 0`;
  `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`.
- `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`.
- `checkpoint_record_fields: plan_version, state_transition,
  progress_classification, evidence, subagent_status, next_action_or_stop_reason,
  authority_classification, review_disposition_summary`.

## Hard Stops

- Install/parity/API health fails, the durable index changes before job
  creation, the frozen item disappears or becomes terminal/local, active work
  appears, or exact browser ownership is ambiguous.
- Scheduler leaves paused/idle, target moves from pass 51, wider passes move from
  7/2/34, a provider guard appears, or any completion gets controlled.
- Auth conflict, identity mismatch, CAPTCHA/challenge/human verification,
  `Answer now`, prompt request, unexpected fanout, timeout, or provider-session
  ambiguity appears.
- Any terminal skip/failure ends this packet without retry or substitute. Record
  the exact result and preserve the stopped posture.

## Terminal Classification

1. `C1_useful_yield`: one readable local `Fence Guidelines.pdf` with exact
   provider/catalog identity, nonzero bytes, checksum, manifest/archive
   evidence, one attempt, and zero failed entries.
2. `C2_zero_failure_no_download`: terminal skip with zero failures and no local
   file; settled but not materialized.
3. `C3_provider_or_asset_terminal`: structured missing/expired/unavailable or
   other exact asset terminal result.
4. `C4_auth_or_challenge_stop`: identity/auth/challenge/verification/guard or
   `Answer now` stop.
5. `C5_other_terminal_failure`: timeout, pending operation, service fault,
   unexpected movement/fanout, or any other ambiguity.

## Acceptance Criteria

- [ ] Source and installed history-materialization bundles match exactly after
  one install/restart, and the API plus stopped runtime posture are healthy.
- [ ] The fresh exact gate still identifies the same file/provider/runtime/
  browser/identity/conversation and proves no local/terminal/active duplicate.
- [ ] Exactly one direct job runs with `catalogKind=files`, `maxItems=1`, attempt
  one, `force=false`, no snapshot refresh, and no second action.
- [ ] Terminal result is `C1_useful_yield` with readable bytes, checksum,
  manifest/archive evidence, and zero failures.
- [ ] Exact browser cleanup, active-job zero, API health, scheduler pause,
  target pass 51, wider passes 7/2/34, and guard-null posture are current.
- [ ] Plan/journal/fix evidence, audit, commit, push, and goal closeout are
  complete.

## Opening Checkpoint | Frozen Exact File Canary Ready

- `checkpoint_id`: `P0241-C01`.
- `state_transition`: P0240_CLOSED_PROVIDER_FREE_EXACT_FILE_READY ->
  P0241_ACTIVE_INSTALL_EXACT_FILE_CANARY.
- `progress_classification`: outcome_progress.
- `evidence`: pushed repair `e2f7d7ec`; provider-free broad/exact agreement on
  conversation/file/identity above; disabled seams 2 total; provider
  implementations zero; durable index unchanged; active exact jobs/browser
  zero; scheduler paused; target/wider passes 51 and 7/2/34.
- `owned_changes`: this plan/journal before one install and one exact durable
  job. Every control surface remains read-only.
- `subagent_status`: not_spawned; no delegation request and no independent safe
  lane across the installed service and exact managed browser.
- `next_action_or_stop_reason`: audit, commit, and push this gate; then execute
  the one install and fresh stopped-runtime admission readback.
- `authority_classification`: ordinary bounded successor under the standing
  goal, with the existing one-canary effect ceiling and unchanged hard stops.
- `review_disposition_summary`: truncated catalog admission is verified fixed;
  the frozen exact file is accepted for one installed canary. Scheduler or
  wider resume remains explicitly rejected.

## Definition Of Done

The installed runtime materializes the one frozen exact file or records one
truthful terminal stop, exact browser state is cleaned, scheduler/completions
never move, and all evidence is committed and pushed.
