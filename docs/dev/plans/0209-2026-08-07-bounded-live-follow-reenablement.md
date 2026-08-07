# Bounded Live-Follow Re-enablement | 0209-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: DIAGNOSING
Gate state: AWAITING_CURRENT_EXACT_CONTEXT

## Stable Goal Objective

Within at most ten goal turns, diagnose and repair the remaining blockers to
safe live-follow operation, prove one exact ChatGPT/default materialization
canary with `maxItems=1`, and re-enable only the four configured and
authoritatively identified ChatGPT live-follow targets in bounded stages. Do
not enable disabled or unconfigured targets, bypass provider guards, submit a
prompt, click `Answer now`, widen the canary, or treat transport health as
useful-yield proof.

## Current State

- Plan 0208 installed the shared full-command deadline/receipt repair. Source
  and installed hashes match at
  `5e8c3360ae67d5e85788477902d37b6199a9ea2c960862a27bbef8a6afbb4893`
  for the CLI and
  `3602b6c33015d03ae2ef40c4905f5d8772c6899aea98df1b87887f3d04a57a00`
  for the shared service. Its installed provider-free preflight-hang proof
  terminates, aborts, invokes zero provider callbacks, and records attempt
  count zero with `preflight:buildListOptions`.
- API PID 67435 is active/running with zero restarts. The fast installed
  readiness assertion is deliberately red: the scheduler is operator-paused,
  all six retained completions are paused, and queued/running/idle-waiting are
  `0/0/0`. There is no concurrent foreground work or active materialization
  job.
- Four ChatGPT targets (`default`, `wsl-chrome-2`, `wsl-chrome-3`, and
  `wsl-chrome-4`) are configured `desiredState=enabled`, have authoritative
  identity evidence, zero consecutive failures, and no provider guard. The
  default completion is the safest first target: pass 4, no error, and a
  complete current evidence cycle.
- Gemini and Grok are outside the re-enablement set. Gemini/default is disabled
  with unknown identity, `auracall-gemini-pro` retains a `google-sorry` guard,
  and Grok/default is disabled after 21 consecutive failures. Their retained
  paused completions must not be resumed.
- The exact Plan 0197 conversation is
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a`. Its frozen cone catalog item is
  `ec160eac-e457-4ae8-abb1-dfeaae5e8bec:download:sandbox:/mnt/data/plt_4.png`.
  The retained eleven-artifact context and terminal receipt are stale at
  SHA-256
  `0c71832d99b423ed3de9e496e43346ac917b1d2de27573632ebbf30f5762b7b4`
  and `529a39994334256ae21201612bf40b0ce03201381d4f5e9f562537e5b3db1903`.
  A read-only agent-browser inspection already proved the exact conversation
  rendered and interactive without login, CAPTCHA, dialog, or provider error.

## Authority And Ownership

- The operator explicitly requested up to ten turns of diagnosis and repair
  with live-follow re-enablement as the objective. This is standing authority
  for the bounded packets below, including the necessary exact read, one
  canary, repairs that stay within the same safeguards, and staged resume of
  only the four already-enabled ChatGPT targets.
- Authorized: plan/docs; installed and provider-free readbacks; one initial
  exact context refresh and one post-repair repeat only if the first terminal
  evidence discovers a local defect; provider-free exact-asset adjudication;
  one `maxItems=1` canary; necessary source/test repair and at most two
  green-gated installs/restarts; individually bounded ChatGPT completion
  resumes; one scheduler resume after completion proof; observation and
  emergency re-pause; audit/commit/push.
- Excluded: prompts; `Answer now`; alternate conversations; more than one
  canary asset or job; force; direct runtime JSON edits; identity inference;
  CAPTCHA/guard bypass; enabling Gemini, Grok, disabled, or unconfigured
  targets; broad materialization before the canary; and unattended retry
  loops.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Ranked Diagnostic Hypotheses

1. The operator pause and unmet exact-context/canary gate are the only current
   blockers. Prediction: a fresh exact read terminates with a current receipt,
   while configured ChatGPT identities and guards remain clean.
2. A paused completion retains a failure state that would churn when resumed.
   Prediction: the staged readiness readback shows a completion error, failure
   counter, guard, or non-progressing lifecycle before scheduler resume.
3. Target rebinding still fails despite Plan 0208's lifecycle repair.
   Prediction: the sole exact read terminates with a fresh target/session error
   or bounded timeout receipt rather than current context.
4. The frozen cone has no current live download control. Prediction: fresh
   evidence explicitly classifies `missing_live_control`; no canary is run and
   a provider-free successor packet is required.
5. Resume control is unhealthy independently of provider work. Prediction: a
   bounded completion resume fails to reach running or idle-waiting while API,
   identity, and guard preconditions remain green.

## Execution Packets

1. **Current exact evidence.** Audit, commit, and push this boundary. Reconfirm
   hash parity and frozen runtime, then run one installed read-only context
   refresh for only the exact conversation using the 120-second inner deadline
   under a 150-second outer ceiling. Stop at its first terminal exit and do not
   retry.
2. **Exact one-canary gate.** Adjudicate only the frozen cone from the current
   receipt/cache. If it has one unambiguous live control, create exactly one
   durable ChatGPT/default job with `maxItems=1`, no force, no snapshot-wide
   refresh, and no substitute. Observe its first terminal disposition and
   verify durable useful yield by canonical local readback, checksum, and
   manifest—not job status alone.
3. **Repair only on evidence.** If packet 1 or 2 exposes a local defect, build a
   fast deterministic red-capable fixture at that seam, test the ranked cause
   one variable at a time, make the smallest safety-preserving repair, run
   focused/affected/full non-live validation, and install/restart only after
   all gates pass. A second exact read is allowed only as post-repair acceptance
   for the same conversation; the canary budget remains one total.
4. **First live-follow stage.** Resume only the existing ChatGPT/default
   completion for one bounded pass. Require authoritative identity, no guard,
   no duplicate completion, finite provider budget, monotonic pass/cycle
   progress, and return to a stable running or idle-waiting state. Re-pause on
   no progress, repeated failure, provider guard, identity drift, or unexpected
   materialization fanout.
5. **Configured ChatGPT expansion.** Resume the three remaining enabled
   ChatGPT completions individually only after the prior stage is green. Resume
   the scheduler last. Observe at least one scheduler wake/pass and verify the
   four enabled targets stay active or idle-waiting without guard/error churn;
   disabled and unconfigured targets remain unchanged.

## Local Goal Bounds

- `max_goal_turns: 10`; `max_plan_versions: 2`;
  `max_execution_packets: 5`; `max_planning_commits: 1`;
  `max_source_commits: 2`; `max_closeout_commits: 2`;
  `max_ranked_hypotheses: 5`; `max_codegraph_calls: 6`;
  `max_instrumentation_rounds: 3`; `max_provider_context_refresh_commands: 2`;
  `max_provider_context_refreshes_before_local_repair: 1`;
  `max_provider_refresh_retries_per_packet: 0`;
  `max_provider_conversations_touched: 1`;
  `max_inner_context_timeout_ms: 120000`;
  `max_outer_process_timeout_seconds: 150`;
  `max_browser_inspections: 1`; `max_durable_jobs_created: 1`;
  `max_canary_executions: 1`; `max_canary_items: 1`;
  `max_materialization_callbacks: 1`; `max_download_actions: 1`;
  `max_substitute_assets: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_installs: 2`;
  `max_service_restarts: 2`; `max_completion_resume_actions: 4`;
  `max_emergency_completion_pause_actions: 4`;
  `max_scheduler_resume_actions: 1`; `max_scheduler_pause_actions: 1`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_plan_audit_command_groups: 4`.
- Provider work after re-enablement remains subject to each completion's
  configured per-pass interaction budget. No forced extra pass is authorized
  solely to manufacture progress evidence.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## State Machine

1. `DIAGNOSING -> READING_CURRENT_CONTEXT` after the audited and pushed plan
   plus final provider-free preflight.
2. `READING_CURRENT_CONTEXT -> CANARY_READY` only on a fresh successful receipt
   with one exact unambiguous live-control correlation.
3. `CANARY_READY -> CANARY_PROVING` only for one exact `maxItems=1` job.
4. `CANARY_PROVING -> RESUMING_DEFAULT` only after durable useful yield and
   unchanged safety controls. A terminal no-control or no-yield disposition
   stops for evidence-driven repair or provider-free successor selection.
5. `RESUMING_DEFAULT -> RESUMING_CHATGPT_TARGETS` only after one bounded default
   pass advances without guard, identity drift, replacement churn, or broad
   materialization.
6. `RESUMING_CHATGPT_TARGETS -> LIVE_FOLLOW_REENABLED` only after all four
   enabled ChatGPT targets and the scheduler are running/idle-waiting as
   intended and at least one scheduler observation proves useful progress.
7. Any CAPTCHA, provider guard, identity ambiguity, duplicate completion,
   uncontrolled materialization, repeated same-state no-progress transition,
   or exhausted local bound moves to `STOPPED_FAIL_CLOSED` and re-pauses any
   component resumed by this plan.

## Acceptance Criteria

- [ ] The deterministic readiness verifier is initially red and becomes green
  only when the scheduler and intended ChatGPT completions are genuinely
  re-enabled.
- [ ] One exact bounded context read produces a fresh terminal receipt and
  current classification, or a newly discovered local defect is repaired and
  accepted with at most one post-repair repeat.
- [ ] Exactly one `maxItems=1` canary either proves one durable locally readable
  asset with checksum/manifest evidence or stops truthfully without retry,
  substitute, force, or widened materialization.
- [ ] ChatGPT/default completes one bounded resumed pass with authoritative
  identity, no provider guard, finite interaction budget, and monotonic useful
  progress before any other completion or scheduler resume.
- [ ] Only the four configured enabled ChatGPT targets are active or
  idle-waiting after staged expansion; Gemini, Grok, disabled, and unconfigured
  targets remain unchanged.
- [ ] The scheduler completes at least one observed wake/pass without failure,
  replacement churn, guard activation, identity drift, or unexpected job
  fanout.
- [ ] Relevant tests, runtime/source parity, plan and goal audits, repo docs,
  git/remote state, and final installed readback agree.

## Hard Stops And Non-Goals

- Never click ChatGPT `Answer now`, submit a prompt, bypass a provider guard,
  or continue against any CAPTCHA/human-verification surface.
- Never fuzzy-match an account, conversation, or asset. Stop on identity or
  live-control ambiguity.
- Do not enable or resume Gemini, Grok, disabled, or unconfigured targets.
- Do not run a second canary, retry a provider command within a packet, force
  materialization, or allow `maxItems>1` before the exact canary proves useful
  yield.

## Definition Of Done

The one exact canary has proved useful durable output, the four configured
ChatGPT live-follow targets and scheduler are re-enabled in bounded stages,
the readiness verifier is green, and current installed readback shows stable
identity, clear guards, monotonic progress, no unexpected active jobs, and no
resume of excluded targets.

## Checkpoint 1 | Re-enablement Diagnosis Opened

- `plan_version`: 1
- `checkpoint_id`: `P0209-C01`
- `state_transition`: COMPLETE_PROVIDER_FREE_LIVE_WITHHELD -> DIAGNOSING.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0209 and canonical planning/doc wiring only; no new
  provider read, canary, job, materialization, download, source/runtime change,
  or resume action yet.
- `evidence`: clean synchronized `95d1ce7b`; API PID 67435 active/running with
  zero restarts; deterministic readiness assertion exit 1; scheduler paused;
  six completions paused; four enabled authoritative guard-clear ChatGPT
  targets; default completion pass 4 with complete cycle and no error; disabled
  Grok/Gemini exclusions; Plan 0208 installed lifecycle proof and hash parity;
  frozen exact conversation/asset/cache/receipt identity.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: goal turns 1/10; plan versions 1/2; readiness verifier
  1; ranked hypotheses 5/5; all planning/source/closeout commits, CodeGraph
  calls, instrumentation, provider context reads, browser inspections, jobs,
  canaries, callbacks, downloads, installs/restarts, prompts, scheduler and
  completion actions zero inside this plan.
- `remaining_criteria`: all seven acceptance items.
- `authority_classification`: standing bounded re-enablement authority for the
  five ordered packets; excluded providers and hard stops remain closed.
- `review_disposition_summary`: hypothesis 1 leads; hypothesis 2 is rejected
  for the four ChatGPT targets by zero failure counters and clear guards but
  accepted as the reason to exclude retained Grok/Gemini completions. The
  target-rebind, live-control, and resume-control hypotheses remain open.
- `next_action_or_stop_reason`: run plan and goal audits, commit and push this
  planning boundary, then perform the final frozen preflight before the sole
  initial exact context read.
