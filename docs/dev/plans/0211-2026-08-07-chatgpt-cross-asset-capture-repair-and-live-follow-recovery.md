# ChatGPT Cross-Asset Capture Repair And Live-Follow Recovery | 0211-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: IN_PROGRESS
Goal execution state: REPAIRING_CAPTURE_IDENTITY
Gate state: SOURCE_VALIDATION

## Stable Goal Objective

Repair the confirmed ChatGPT signed-content capture race, prove the installed
runtime never accepts a neighboring asset as the requested file, restore the
blocked default completion in one bounded stage, then resume only the other
three configured authoritative ChatGPT targets and the scheduler last. Keep
Gemini, Grok, prompts, `Answer now`, guard bypass, fuzzy identity, and broad
unobserved materialization excluded.

## Current State And Cause

- Plan 0210's artifact canary succeeded with one durable PNG, but the next
  default `run-one-pass` launched retained-policy reconciliation job
  `hmj_57c42114cf43475f82d36d63ec23c6db` with `maxItems=6`.
- Metadata progress was healthy: pass count advanced `4 -> 5`, all four
  provider-session identity dimensions matched, and provider guard was null.
- The child job attempted four conversations, materialized one 505-byte `.txt`
  file, skipped five entries, and failed one transfer. The failed request was
  `auracall-m5-source-20260802T185953Z(7).txt`; the first successful captured
  signed-content response belonged to neighboring
  `auracall-m5-20260802T185953Z(7).docx`.
- `downloadChatgptConversationFileWithClient` treated every successful
  `/backend-api/estuary/content` response as the winner and checked filename
  identity only after returning from the bounded capture loop. The late guard
  correctly prevented wrong bytes from being written, but it could no longer
  wait for the requested response.
- The worktree repair applies the existing exact/collision-suffix/provider-ID
  classifier inside `recordCaptureCandidate`. A mismatched signed response is
  retained as diagnostic failure evidence while the same 20-second window
  continues; only an identity-valid response becomes `captured`.
- Focused ChatGPT adapter tests pass 140/140; adjacent history-materialization,
  completion-service, and MCP tests pass 141/141; typecheck passes. No install,
  restart, post-repair provider action, completion resume, or scheduler resume
  has run.

## Authority And Scope

- Standing goal authority covers this evidence-driven local repair, one
  green-gated user-runtime install/API restart, one exact repaired-lane live
  proof, and staged re-enablement only after that proof.
- The exact regression target is the failed ChatGPT/default conversation/file
  pair from job `hmj_57c42114cf43475f82d36d63ec23c6db`; no substitute target may
  be selected during the proof.
- The successful sibling `.txt` materialization is durable evidence and must
  not be redownloaded. The mismatched `.docx` response must never be accepted
  for the target `.txt` path.
- Direct runtime JSON edits, terminal provider-file retries from Plans 0209/
  0210, alternate providers, prompts, `Answer now`, and guard/CAPTCHA bypass
  remain excluded.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Execution Packets

1. **Source gate.** Finish focused/adjacent tests, typecheck, touched lint,
   build, diff review, goal audit, and plan-library audit. Commit and push the
   source/tests/docs as one bounded repair.
2. **Installed parity.** Install the committed user runtime and API service
   once, restart once, and require active service plus exact source/runtime
   hash parity. Scheduler and non-default completions stay paused.
3. **Exact repaired-lane proof.** Use provider-free retained-job/catalog
   readback to freeze the exact failed `.txt` lane and determine the least
   expansive supported replay surface. Permit one live transfer attempt only;
   require exact response identity and readable checksum/archive evidence, or
   stop without a substitute or second attempt.
4. **Staged recovery.** Clear/restart only the retained blocked default
   completion through its supported control surface, observe one bounded pass,
   then resume the other three intended ChatGPT completions one at a time and
   the scheduler last. Stop on any guard, identity drift, failed transfer,
   retry/churn, or unexpected fanout.

## Local Goal Bounds

- `max_plan_versions: 2`; `max_source_commits: 1`; `max_closeout_commits: 2`;
  `max_installs: 1`; `max_service_restarts: 1`; `max_live_transfer_attempts: 1`;
  `max_live_transfer_items: 1`; `max_provider_retries: 0`;
  `max_substitute_assets: 0`; `max_completion_control_actions: 4`;
  `max_emergency_completion_pauses: 4`; `max_scheduler_resume_actions: 1`;
  `max_scheduler_pause_actions: 1`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_additional_browser_inspections: 0`;
  `max_additional_codegraph_calls: 1`; `max_subagents: 0`.

## Acceptance Criteria

- [x] A regression proves mismatched `.docx` signed-content identity is
  rejected while exact, collision-suffix, and provider-ID-bound captures stay
  accepted.
- [x] Focused and adjacent non-live tests plus typecheck pass.
- [ ] Build, lint baseline, audits, diff review, commit, and push pass.
- [ ] Installed source/runtime hashes match after exactly one restart.
- [ ] One exact live repaired-lane proof yields only the requested `.txt` or
  stops without accepting a neighboring response.
- [ ] Default completion becomes stable with no guard, identity drift, failure,
  retry, or unexpected materialization fanout.
- [ ] Only the four intended ChatGPT targets and scheduler are re-enabled;
  excluded targets remain unchanged.

## Hard Stops

- Do not use `force`, edit retained runtime JSON, erase terminal evidence,
  select an alternate asset, or run a second provider transfer in the exact
  proof packet.
- Do not resume another completion or the scheduler until exact repaired-lane
  identity is proven in the installed runtime.
- Any CAPTCHA, provider guard, identity mismatch, neighboring response,
  provider-terminal response, or uncontrolled child job stops the packet and
  re-pauses plan-owned controls.

## Checkpoint 1 | Source Repair Validated

- `plan_version`: 1
- `checkpoint_id`: `P0211-C01`
- `state_transition`: P0210_STOPPED_FAIL_CLOSED -> SOURCE_VALIDATION.
- `progress_classification`: blocker_reduction
- `owned_changes`: ChatGPT capture identity helper, in-loop candidate gate,
  focused regression coverage, and canonical docs only.
- `evidence`: exact runtime failure names `.txt` requested versus `.docx`
  captured; focused adapter tests 140/140; adjacent materialization/completion/
  MCP tests 141/141; typecheck green; default completion blocked at pass 5;
  other intended completions and scheduler unchanged/paused.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: source gate completion; install/parity; exact live
  proof; staged target and scheduler recovery; final audits/readbacks.
- `authority_classification`: evidence-driven local repair and bounded
  successor under the unchanged operator-approved live-follow objective.
- `next_action_or_stop_reason`: finish build/lint/audits and review, then commit
  and push before the sole install/restart.
