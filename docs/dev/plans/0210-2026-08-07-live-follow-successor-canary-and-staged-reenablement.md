# Live-Follow Successor Canary And Staged Re-enablement | 0210-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: SELECTING_PROVIDER_FREE_SUCCESSOR
Gate state: PROVIDER_FREE_ONLY

## Stable Goal Objective

Within the operator-approved ten-turn campaign, prove one useful exact
ChatGPT/default materialization canary and re-enable only the four configured,
authoritatively identified ChatGPT live-follow targets in bounded stages, with
the scheduler last. Do not enable excluded providers, weaken identity or guard
controls, submit prompts, click `Answer now`, retry a terminal asset, or treat
transport/job status as useful-yield proof.

## Current State

- Clean synchronized `4fb7da3c`; API PID 33299 is active/running with zero
  restarts. Scheduler and all six retained completions are paused; enabled
  ChatGPT targets are 4, running 0, paused 4, and active history jobs are zero.
- Plan 0209's sole exact canary ended once as non-retryable
  `provider_unavailable`: ChatGPT returned `file_not_found` /
  `GetDownloadLinkError` for `file-JDW8WW7tqtwQu1gF1S4kWP`. It produced zero
  local/archive output and must never be retried.
- Current provider-free recovery readback incorporates that terminal evidence:
  ChatGPT/default retrievable missing assets decreased from 14 to 13, files
  decreased from 7 to 6, and failed-terminal files increased from 0 to 1.
  The account-level action remains `start_materialization_policy_completion`.
- The current exact conversation cache remains
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a`, with 11 messages, 2 artifacts, and 9
  files at context SHA-256
  `3838f3468011a9f99e5309db691932ba359670c15d29c1750b4118ba31d97bd3`.
  No additional provider context read or browser inspection is needed to select
  the next candidate.

## Authority And Ownership

- The active user-approved objective grants standing authority for ordinary
  bounded successor packets toward live-follow re-enablement. Repo policy
  states that a packet hard stop ends that execution window but does not revoke
  the goal or create a new approval gate by itself. Plan 0210 therefore renews
  one bounded exact-canary window without changing provider, tenant,
  conversation, identity, objective, acceptance criteria, or safety controls.
- Authorized: provider-free catalog/archive/job/cache readbacks; one
  callback-disabled `maxItems=1` selection simulation; one exact new canary
  only after its frozen gate is audited, committed, and pushed; evidence-driven
  local repair if the canary exposes a local defect; default-first staged
  completion resume; the other three configured ChatGPT targets; scheduler
  resume last; emergency re-pause; audit/commit/push.
- Excluded: previously terminal assets; alternate conversations; more than one
  successor asset/job/canary; retries; force; prompts; `Answer now`; direct
  runtime JSON edits; identity inference; CAPTCHA/guard bypass; Gemini, Grok,
  disabled, unconfigured, or unknown-identity targets; broad materialization
  before useful yield.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Ranked Diagnostic Hypotheses

1. Terminal-family exclusion advances deterministic selection to one different
   current file. Prediction: a provider-disabled simulation invokes exactly one
   callback for the same conversation and does not select either Plan 0209 file.
2. All remaining exact-conversation files already have terminal or readable
   family evidence. Prediction: simulation selects no asset and the packet
   stops provider-free.
3. A remaining current file is catalog-eligible but provider-unavailable.
   Prediction: the sole canary matches identity/tile and returns a structured
   terminal provider response with no retry.
4. A remaining current file is retrievable. Prediction: the sole canary creates
   one readable local file plus checksum, manifest, and archive evidence.
5. Useful yield is proven but completion control is unhealthy. Prediction: the
   bounded default pass fails to advance or stabilize, requiring emergency
   re-pause before any expansion.

## Execution Packets

1. **Provider-free exact selection.** Seed an in-memory job store from all
   retained history jobs, disable every provider callback, and simulate only
   ChatGPT/default, the exact cached conversation, `assetKinds=files`, and
   `maxItems=1`. Freeze the selected full catalog ID/provider file ID only when
   it is different from both terminal Plan 0209 families.
2. **Closed-world eligibility gate.** Require catalog eligibility, null local
   path/checksum, zero canonical archive result, no matching readable file,
   and no accepted terminal family evidence. Update this plan to version 2,
   audit, commit, and push the exact request before provider work.
3. **One successor canary.** Create exactly one durable job with the frozen
   provider/runtime/browser/identity/conversation/catalog fields,
   `catalogKind=files`, `assetKinds=files`, `maxItems=1`, `force=false`,
   `refreshSnapshot=false`, and 300000ms provider-work timeout. Stop after its
   first terminal disposition. Useful yield requires readable bytes, checksum,
   manifest, archive readback, and no unexpected fanout.
4. **Staged live-follow resume.** Only after useful yield, run one bounded pass
   of the retained ChatGPT/default completion and require monotonic pass/cycle
   progress, authoritative identity, clear guard, finite interaction budget,
   and stable running/idle-waiting posture. Then resume the other three enabled
   ChatGPT completions individually and the scheduler last.

## Local Goal Bounds

- `max_goal_turns: 10`; `max_plan_versions: 2`;
  `max_execution_packets: 4`; `max_planning_commits: 2`;
  `max_source_commits: 1`; `max_closeout_commits: 2`;
  `max_ranked_hypotheses: 5`; `max_codegraph_calls: 2`;
  `max_provider_context_refresh_commands: 0`;
  `max_browser_inspections: 0`; `max_provider_free_simulations: 1`;
  `max_provider_free_successor_selections: 1`;
  `max_provider_callbacks_during_selection: 0`;
  `max_durable_jobs_created: 1`; `max_canary_executions: 1`;
  `max_canary_items: 1`; `max_materialization_callbacks: 1`;
  `max_download_actions: 1`; `max_provider_retries: 0`;
  `max_substitute_assets_after_freeze: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_completion_resume_actions: 4`;
  `max_emergency_completion_pause_actions: 4`;
  `max_scheduler_resume_actions: 1`; `max_scheduler_pause_actions: 1`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_plan_audit_command_groups: 4`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## State Machine

1. `SELECTING_PROVIDER_FREE_SUCCESSOR -> CANARY_READY` only after one exact
   current nonterminal asset passes callback-disabled selection and closed-world
   local adjudication, followed by an audited/pushed version-2 gate.
2. `CANARY_READY -> CANARY_PROVING` for the one exact job only.
3. `CANARY_PROVING -> RESUMING_DEFAULT` only on durable useful yield.
4. `RESUMING_DEFAULT -> RESUMING_CHATGPT_TARGETS` only after one bounded default
   pass advances and stabilizes without guard, drift, churn, or broad fanout.
5. `RESUMING_CHATGPT_TARGETS -> LIVE_FOLLOW_REENABLED` only after all four
   intended ChatGPT targets and scheduler are active/idle-waiting as intended
   and at least one scheduler observation proves progress.
6. Any terminal provider response, identity ambiguity, guard/CAPTCHA, duplicate
   completion, uncontrolled materialization, retry pressure, or no-progress
   transition moves to `STOPPED_FAIL_CLOSED` and re-pauses plan-owned controls.

## Acceptance Criteria

- [ ] Provider-free simulation selects exactly one current, nonterminal file in
  the exact conversation with zero provider callbacks and zero durable writes.
- [ ] One exact `maxItems=1` canary proves one readable local asset with matching
  checksum, manifest, and archive evidence, or stops truthfully without retry.
- [ ] ChatGPT/default completes one bounded resumed pass with authoritative
  identity, clear guard, finite budget, and monotonic progress.
- [ ] Only the four configured enabled ChatGPT targets become active or
  idle-waiting; excluded targets remain unchanged.
- [ ] The scheduler completes one observed wake/pass without guard, identity
  drift, failure churn, replacement churn, or unexpected materialization.
- [ ] Current installed state, audits, docs, git, and remote readbacks agree.

## Hard Stops And Non-Goals

- Never retry either terminal Plan 0209 asset, submit a prompt, click `Answer
  now`, bypass a provider guard, or continue through CAPTCHA/human verification.
- Never fuzzy-match identity, conversation, or asset; do not select an alternate
  conversation or create a second job/canary in this packet.
- Do not resume any completion or scheduler unless the new canary proves useful
  durable output.

## Definition Of Done

One exact successor canary has proved durable useful yield, the four configured
ChatGPT live-follow targets and scheduler are re-enabled in bounded stages, and
current installed readback proves stable identities, clear guards, monotonic
progress, no unexpected jobs, and no excluded-target activation.

## Checkpoint 1 | Successor Window Opened

- `plan_version`: 1
- `checkpoint_id`: `P0210-C01`
- `state_transition`: P0209_STOPPED_FAIL_CLOSED ->
  SELECTING_PROVIDER_FREE_SUCCESSOR.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0210 and canonical planning/doc wiring only. No new
  provider callback, durable job, materialization, download, browser action,
  prompt, completion/scheduler control, install, or restart.
- `evidence`: clean synchronized `4fb7da3c`; API PID 33299 active/running with
  zero restarts; scheduler and six completions paused; enabled/running/paused
  ChatGPT targets `4/0/4`; active history jobs zero. Provider-free recovery now
  reports 13 retrievable assets, including 6 files, plus 1 failed-terminal file,
  proving the Plan 0209 provider-unavailable family is excluded.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: campaign turns 3/10; plan versions 1/2; hypotheses 5/5;
  all Plan 0210 simulations, selections, provider callbacks, jobs, canaries,
  downloads, CodeGraph calls, source changes, installs/restarts, prompts,
  completion actions, and scheduler actions zero.
- `remaining_criteria`: all six acceptance items.
- `authority_classification`: bounded successor under unchanged standing goal
  authority. The Plan 0209 hard stop ended its execution window; it did not
  revoke this approved objective. Safety and exclusion controls are unchanged.
- `review_disposition_summary`: hypothesis 1 leads because the recovery funnel
  already removed exactly one retrievable file and added one terminal file.
  Hypotheses 2-5 remain open.
- `next_action_or_stop_reason`: run goal/library audits, commit and push this
  boundary, then perform exactly one provider-disabled in-memory selection
  simulation using the current cache and retained jobs.
