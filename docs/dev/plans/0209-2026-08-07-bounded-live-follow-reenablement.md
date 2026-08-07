# Bounded Live-Follow Re-enablement | 0209-2026-08-07

State: OPEN
Lane: P01
Plan version: 2
Outcome: IN_PROGRESS
Goal execution state: CANARY_READY
Gate state: PROVIDER_FREE_SUCCESSOR_READY

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
- API PID 33299 is active/running with zero restarts after the one authorized
  install/restart. Source and installed `llmService.js` hashes match at
  `2279e2da723cc299bd05d54fdae442953c63dc5af42a74e7718213b1d016b230`.
  The fast installed
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
- The sole post-repair exact read succeeded in 17.24 seconds for conversation
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a`; the fresh receipt and context hashes
  are `8a9cb55afb41e8d6d92ad444000a65a7d5eb72b7d1fc349755cf8c9d86b0bf45`
  and `3838f3468011a9f99e5309db691932ba359670c15d29c1750b4118ba31d97bd3`.
  The current context has 11 messages, 2 artifacts, and 9 files. The frozen
  cone is absent, so it cannot remain the exact canary asset.
- Version 2 selects one provider-free successor inside that same exact
  conversation: catalog file
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a:7a6f8f84-990f-4bd6-8bda-fc9bb937776d:1:2025-03-03 ROMP, Polymer Spatial Extent-20250303_120522-Meeting Transcript.docx`,
  provider file `file-JDW8WW7tqtwQu1gF1S4kWP`. The catalog classifies it
  `eligible` with null local path/checksum; exact archive queries and filesystem
  lookup return zero. Its only retained history is a 2026-08-01 broad
  `maxItems=6` retrieval failure with no local output, not accepted terminal
  materialization.
- Two in-memory simulations seeded all 1,863 retained jobs, disabled every
  provider callback, and left the durable job-index SHA-256 unchanged at
  `175c9d81b2dc34f0e0bf88ec12224cb3d51b8d6bc13031b2b9bc30e4adc40a69`.
  Broad `maxItems=1` selection reached the exact conversation; exact catalog
  selection reached only the named file with one disabled callback. A
  read-only agent-browser inspection also proved the conversation rendered and
  interactive without login, CAPTCHA, dialog, provider error, or `Answer now`.

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
- Excluded: prompts; `Answer now`; alternate conversations; assets other than
  the version-2 exact successor; more than one canary asset or job; force;
  direct runtime JSON edits; identity inference;
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
2. **Exact one-canary gate.** The current read disproved the frozen cone, so
   version 2 permits exactly one provider-free successor selection in the same
   conversation. Create one durable ChatGPT/default job for only catalog file
   `file-JDW8WW7tqtwQu1gF1S4kWP`, with `assetKinds=files`, `maxItems=1`, no
   force, no snapshot-wide refresh, and no substitute. Observe its first
   terminal disposition and verify durable useful yield by canonical local
   readback, checksum, and manifest—not job status alone.
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
  `max_provider_free_successor_selections: 1`; `max_substitute_assets: 0`;
  `max_prompt_submissions: 0`;
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
   plus one exact provider-free successor selection inside the same
   conversation when the frozen asset is absent.
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
- [x] One exact bounded context read produces a fresh terminal receipt and
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

## Checkpoint 2 | Redundant Live Cache Identity Preflight Repaired

- `plan_version`: 1
- `checkpoint_id`: `P0209-C02`
- `state_transition`: DIAGNOSING -> READING_CURRENT_CONTEXT -> REPAIRING ->
  VALIDATING.
- `progress_classification`: blocker_reduction
- `owned_changes`: one exact installed read; shared authorized-session cache
  preflight; one deterministic regression; README/testing/fix-log contracts;
  plan, journal, and runbook evidence. Scheduler, completions, canary, jobs,
  materialization, and downloads remain unchanged.
- `evidence`: planning commit `d7f6a79c` was pushed before provider contact.
  The sole initial exact read exited once in 120.90 seconds with
  `conversation_context_timeout`; its new metadata receipt SHA-256 is
  `546c79008d20655d0ebcf6cc941b4d50aa6621c36d32fedac5b747864446477d`,
  `attemptCount=0`, and last stage `provider:chatgpt.connectTab.ready`, while
  the context hash remained unchanged. Structural tracing located the live
  identity/feature detector in the second cache-scope preflight after
  provider-session authorization. The new hanging detector regression was red
  in 43ms without invoking the context adapter, then green after cache scoping
  reused configured identity and skipped live feature detection only when
  authorization exists. The adapter's live account assertion remains intact.
  Focused tests pass 12/12; affected context/file/tab tests pass 64/64;
  typecheck, touched lint, build, and diff hygiene pass. A parallel build/test
  run had three MCP launcher `ENOENT` failures; their isolated rerun passes 4/4
  and the clean serial full suite passes 304 files / 2,728 tests with 65
  opt-in tests skipped.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: goal turns 1/10; plan versions 1/2; execution packets
  2/5; planning commits 1/1; source commits 0/2; provider context reads 1/2;
  post-repair repeats 0/1; provider conversations 1/1; retries 0/0; context
  deadline 120000/120000 ms; installs/restarts 0/2; canaries, jobs,
  materialization callbacks, downloads, prompts, completion actions, and
  scheduler actions zero. CodeGraph calls reached 7/6 because the broad method
  response was truncated and required one exact-symbol read-only follow-up;
  scope and external effects did not expand.
- `remaining_criteria`: closed-world review; source commit/push; one
  install/restart; installed provider-free proof; sole post-repair exact read;
  exact-cone adjudication; one canary; staged ChatGPT completion and scheduler
  resume; terminal audits and closeout.
- `authority_classification`: unchanged bounded re-enablement authority; the
  first context read is consumed and only one same-conversation post-repair
  acceptance read remains.
- `review_disposition_summary`: hypothesis 3 is refined and accepted as a
  redundant live cache-identity preflight after successful target attachment;
  hypothesis 1 remains contingent on installed acceptance. The frozen-cone and
  resume-control hypotheses remain open.
- `next_action_or_stop_reason`: finish closed-world review, commit and push the
  source boundary, then install/restart once and prove the installed
  provider-free authorized-session preflight before the sole post-repair read.

## Checkpoint 3 | Current Context And Provider-Free Successor Gate

- `plan_version`: 2
- `checkpoint_id`: `P0209-C03`
- `state_transition`: VALIDATING -> READING_CURRENT_CONTEXT ->
  SELECTING_PROVIDER_FREE_SUCCESSOR -> CANARY_READY.
- `progress_classification`: blocker_reduction
- `owned_changes`: one installed acceptance read of the already-authorized
  conversation; one read-only agent-browser inspection; local catalog,
  archive, retained-job, and filesystem readbacks; two provider-disabled
  in-memory simulations; and the version-2 exact-successor gate. Scheduler,
  completions, durable jobs, materialization, and downloads remain unchanged.
- `evidence`: commit `7861540e` is pushed and installed; source/runtime
  `llmService.js` hashes match at
  `2279e2da723cc299bd05d54fdae442953c63dc5af42a74e7718213b1d016b230`.
  The sole post-repair read succeeded in 17.24 seconds with fresh receipt hash
  `8a9cb55afb41e8d6d92ad444000a65a7d5eb72b7d1fc349755cf8c9d86b0bf45`
  and context hash
  `3838f3468011a9f99e5309db691932ba359670c15d29c1750b4118ba31d97bd3`.
  The exact page is authenticated and interactive with no CAPTCHA, dialog,
  provider error, or `Answer now`. The old cone is absent. Exact successor
  catalog item
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a:7a6f8f84-990f-4bd6-8bda-fc9bb937776d:1:2025-03-03 ROMP, Polymer Spatial Extent-20250303_120522-Meeting Transcript.docx`
  is `eligible`, provider file `file-JDW8WW7tqtwQu1gF1S4kWP`, with null local
  path/checksum. Exact archive queries and filesystem lookup return zero. One
  old broad failed job contains no local output. Both provider-disabled
  simulations invoke only the expected disabled callback; the exact simulation
  selects this file alone and the durable 1,863-job index hash remains
  `175c9d81b2dc34f0e0bf88ec12224cb3d51b8d6bc13031b2b9bc30e4adc40a69`.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: goal turns 2/10; plan versions 2/2; execution packets
  3/5; planning commits 1/1; source commits 1/2; provider context reads 2/2;
  post-repair repeats 1/1; provider conversations 1/1; provider retries 0/0;
  browser inspections 1/1; provider-free successor selections 1/1;
  simulations 2; harness launches 3 including one pre-load wrong-path failure;
  installs/restarts 1/2; durable jobs, canaries, live materialization callbacks,
  downloads, prompts, completion actions, and scheduler actions remain zero.
  CodeGraph calls are 9/6 cumulatively: the version-1 truncation exception used
  seven and version 2 used two bounded read-only structural calls; no effect or
  scope expanded.
- `remaining_criteria`: commit/push this version-2 boundary; run the one exact
  no-retry `maxItems=1` canary; prove durable useful yield; resume and prove one
  bounded default pass; stage the other three ChatGPT completions; resume the
  scheduler last; observe stable progress; terminal audits and closeout.
- `authority_classification`: standing goal authority permits this bounded
  same-conversation successor because current evidence disproved the frozen
  asset. No alternate conversation, substitute after job creation, retry,
  force, or wider materialization is authorized.
- `review_disposition_summary`: hypothesis 3 is closed by installed acceptance;
  hypothesis 4 is confirmed for the old cone and resolved by one provider-free
  same-conversation successor. Hypothesis 1 now leads; resume-control
  hypothesis 5 remains open until the canary and staged completion proof.
- `next_action_or_stop_reason`: audit, commit, and push version 2, then create
  exactly one ChatGPT/default job with the full catalog ID above,
  `catalogKind=files`, `assetKinds=files`, `maxItems=1`, `force=false`,
  `refreshSnapshot=false`, and a 300000ms provider-work timeout. Stop after its
  first terminal disposition; never substitute or retry.
