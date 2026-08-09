# ChatGPT Payload Settlement Installed Pass-50 Canary | 0234-2026-08-09

State: CLOSED
Lane: P01
Plan version: 3
Gate state: CONSUMED_C4_OTHER_TERMINAL_FAILURE_NO_RESUME
Goal execution state: COMPLETE_STOPPED_AT_FIRST_TERMINAL_RESULT

## Stable Goal Objective

Install the pushed Plan 0233 payload-reader settlement repair exactly once,
restart only the AuraCall API exactly once, prove source/installed parity and
the stopped runtime boundary, then run exactly one pass-50 canary on the
existing `wsl-chrome-3` completion with its persisted `maxItems=6` ceiling.
Monitor its one child and parent to a terminal
result and stop. Do not retry, resume the scheduler, resume any wider
completion, control a provider guard, or start any separate materialization.

## Current State

- The one installed canary is consumed and closed as
  `C4_other_terminal_failure`. It advanced only pass 49 to 50 and created only
  child `hmj_99a99200ff9a4218a018f5717e274a64`, which ran attempt 1 and failed
  terminally without a retry.
- The Plan 0233 defect did not recur. Two conversation context reads completed
  (`14275ms` and `108511ms`) with `lastStage=complete`; two later reads timed
  out at `provider:chatgpt.readVisibleDownloadArtifactProbes` (`109086ms` and
  `109094ms`). No receipt named or left pending
  `provider:chatgpt.readConversationPayload`.
- The child attempted five conversations, selected five candidates, skipped
  five asset outcomes, materialized zero, and failed two. The parent settled
  blocked at pass 50 with `forceRunUntilPassCount=null` and
  `account_mirror_materialization_failed`; no pass 51 or second child exists.
- Final runtime readback is API PID 5590 active/running with zero restarts,
  source/installed adapter parity at
  `10274e4c6c5894faf4013531313222b5f4cf2f11ff9605826ec22b28d32d76e5`,
  scheduler paused/idle, queued/running work zero, active history jobs zero,
  wider ChatGPT completions still paused at `7/2/34`, provider guard clear,
  and exact `wsl-chrome-3` browser process count zero.

- Plan 0233 closed provider-free at pushed commit `49868b4d`. The exact real
  adapter regression failed red with a completed exact response body and an
  enclosing reader still pending, then passed after the governed reload was
  made concurrent with body settlement.
- Provider-free validation passed ChatGPT adapter 151/151, browser-service UI
  54/54, TypeScript typecheck, production build, scoped Biome, plan audit, and
  diff hygiene.
- Plan 0232 previously proved the retained `wsl-chrome-3` account/browser lane
  authenticated and response detail retrievable, then closed its exact browser.
  That evidence is historical and does not replace current preflight.
- Fresh stopped-runtime evidence is API PID 32737 with zero restarts,
  target blocked/pass 49/force null, active history jobs zero, wider ChatGPT
  completions paused at `7/2/34`, scheduler paused/idle, provider guard clear,
  and exact-profile browser process count zero. Two additional non-ChatGPT
  completions are paused, making the global paused count five with queued and
  running counts zero.
- The target's persisted `materializationMaxItems=6`; its prior pass attempted
  six selected conversations. Plan 0197's `maxItems=1` contract belonged to an
  older direct `chatgpt/default` exact-asset job consumed under Plan 0200. It is
  not an invariant of this `wsl-chrome-3` completion. This plan authorizes one
  pass and one child, not one selected conversation.
- Current built adapter SHA-256 is
  `10274e4c6c5894faf4013531313222b5f4cf2f11ff9605826ec22b28d32d76e5`;
  installed adapter remains the prior
  `14668c680a393fd89495c97005486471d3535f9084de0c630e4d0887d8dc6045`,
  proving the sole install is necessary.
- The operator authorized this bounded installed canary with `ok go` after the
  Plan 0233 closeout recommendation. That approval does not authorize a retry,
  scheduler resume, wider completion resume, or a second child.

## External Gates

1. Plan 0233 is closed, validated, committed, and pushed: satisfied by
   `49868b4d`.
2. The operator gives fresh approval for exactly this installed canary:
   satisfied by `ok go` on 2026-08-09.
3. This Plan 0234 `OPEN` transition is audited, committed, and pushed.
4. Fresh readback proves source build health; API active/running with no crash
   restart; scheduler paused/idle; active jobs and queued/running work zero;
   target blocked/pass 49/force null with its persisted `maxItems=6`; wider
   ChatGPT completions paused at `7/2/34`; all five globally active completions
   paused; canonical ChatGPT guard clear; and no exact `wsl-chrome-3` browser
   process. Satisfied at 2026-08-09T12:51:44-05:00; reread once immediately
   after this checkpoint is pushed and before installation.

No install, restart, provider/browser call, completion control, or
materialization effect is allowed while any gate remains unmet.

## Frozen Effect Packet After All Gates

1. Build current pushed source if necessary and record the source adapter
   SHA-256. Run `pnpm run install:user-runtime` exactly once and require the
   installed adapter SHA-256 to match before restart.
2. Restart `auracall-api.service` exactly once. Require a new active/running PID
   with zero crash restarts, exact adapter parity, scheduler paused, no active
   jobs, wider passes `7/2/34`, and target blocked/pass 49/force null.
3. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
4. Require pass `49 -> 50`, exactly one fresh child, and no pass 51. Monitor only
   that child, the parent, service health, stopped scheduler, active jobs, and
   the three wider ChatGPT completions until terminal.
5. Stop after the first terminal result. If an AuraCall-owned exact browser is
   retained, close only that exact browser/session and prove its process/port
   cleanup. Do not retry or resume anything.

## Terminal Classification

1. `C1_clean_payload_settlement`: one child reaches terminal success without
   `readConversationPayload` pending/timeout evidence, selected context and
   asset work are terminal, failed count is zero, and the parent settles
   without `account_mirror_materialization_failed`.
2. `C2_repeated_payload_timeout`: the child again times out or remains pending
   at `provider:chatgpt.readConversationPayload`. Stop with no retry and return
   to provider-free ownership/cleanup diagnosis.
3. `C3_auth_or_challenge_stop`: login loss, wrong identity, CAPTCHA, challenge,
   verification, `Answer now`, provider guard, or profile/process mismatch.
   Stop and clean up the exact browser without another provider action.
4. `C4_other_terminal_failure`: any other child or parent failure, ambiguous
   fanout, pass drift, second child, API fault, scheduler drift, or wider-target
   movement. Stop and preserve bounded metadata for a successor diagnosis.

## Acceptance Criteria

- [x] All four external gates are satisfied before effects.
- [x] Exactly one install and one API restart produce source/installed adapter
  parity and preserve stopped-runtime state.
- [x] Exactly one `wsl-chrome-3` `run-one-pass` advances pass 49 to 50 and
  creates exactly one fresh child under the existing `maxItems=6` ceiling.
- [x] Exactly one C1-C4 terminal classification is recorded without retry.
- [x] Exact child/parent evidence distinguishes payload-reader settlement from
  authentication, challenge, provider guard, or unrelated failure.
- [x] API returns healthy, active jobs return zero, scheduler remains paused,
  wider completions remain paused at `7/2/34`, and any exact browser is closed.
- [x] No second install/restart/canary, scheduler or wider-completion resume,
  guard control, prompt submission, click, `Answer now`, direct runtime JSON
  edit, or separate materialization start occurs.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_completion_controls: 1`;
  `max_fresh_children: 1`; `max_child_attempts: 1`; `max_pass_advance: 1`;
  `max_browser_launches: 1`; `max_browser_closes: 1`;
  `max_scheduler_controls: 0`; `max_other_completion_controls: 0`;
  `max_guard_controls: 0`; `max_separate_materialization_starts: 0`;
  `max_retries: 0`; `max_prompt_submissions: 0`; `max_browser_clicks: 0`;
  `max_answer_now_clicks: 0`; `max_direct_runtime_json_edits: 0`;
  `max_wider_resumes: 0`; `max_subagents: 0`.

## Hard Stops

- Stop before installation unless Plan 0234 is audited, committed, pushed, and
  every fresh runtime precondition matches the frozen packet.
- Stop before the canary unless install parity, the one API restart, and the
  full stopped-runtime recheck pass.
- Stop on login loss, wrong identity, CAPTCHA, challenge, verification,
  `Answer now`, guard activation, process/profile mismatch, target/pass drift,
  scheduler movement, active-job pressure, or wider-completion movement.
- Stop after the first terminal child/parent classification. No outcome grants
  a retry, second pass, scheduler resume, wider completion resume, or separate
  materialization authority.

## Checkpoint 1 | One Installed Canary Opens Behind Runtime Readback

- `checkpoint_id`: `P0234-C01`.
- `state_transition`: P0233_CLOSED_PROVIDER_FREE_GREEN_LIVE_WITHHELD ->
  P0234_OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED.
- `progress_classification`: outcome_progress.
- `authority_classification`: exactly one install, one API restart, and one
  exact `wsl-chrome-3` pass-50 canary are approved after all external gates;
  retries, scheduler/wider resume, guard control, and separate materialization
  remain excluded.
- `evidence`: pushed repair `49868b4d`; deterministic red-to-green regression;
  adjacent provider-free validation; operator `ok go`.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: one installed end-to-end proof is necessary to
  validate the repaired callback settlement in the actual AuraCall ownership
  and retained-session path. The prior metadata browser canary is prerequisite
  evidence, not a substitute for the product canary.
- `next_action_or_stop_reason`: audit, commit, and push this gate, then perform
  the complete fresh readback. Stop on any mismatch; otherwise consume the one
  install/restart/canary packet and close at its first terminal result.

## Checkpoint 2 | Runtime Gate Satisfied With Existing Six-Item Ceiling

- `checkpoint_id`: `P0234-C02`.
- `state_transition`: P0234_OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED ->
  P0234_ALL_GATES_SATISFIED_PREINSTALL_RECHECK_REQUIRED.
- `progress_classification`: blocker_reduction.
- `authority_classification`: the approved effect remains one install, one API
  restart, and one existing completion pass with one child. The persisted child
  request may select up to six conversations; no retry, second child, scheduler
  resume, wider completion resume, guard control, or separate job is admitted.
- `evidence`: Plan 0234 open commit `9275a0dd`; API PID 32737 active/running with
  zero restarts; source/installed adapter hashes intentionally differ before
  install; scheduler paused/idle and active request count zero; history jobs
  active zero; target blocked/pass 49/force null and `maxItems=6`; exact target
  status eligible with provider guard state clear and null kind/action; wider
  ChatGPT passes paused at `7/2/34`; total paused completions five with queued/
  running zero; exact-profile browser process count zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: the initial `maxItems=1` wording is rejected as
  a cross-plan carryover from the older exact-asset canary. The current target's
  six-item ceiling is accepted only inside one pass/one-child authority and is
  current persisted configuration, not a runtime mutation.
- `next_action_or_stop_reason`: audit, commit, and push this corrected
  checkpoint. Then immediately reread every gate; stop on drift, otherwise run
  the one install/restart/canary sequence.

## Checkpoint 3 | Pass 50 Stops At A Later Provider Stage

- `checkpoint_id`: `P0234-C03`.
- `state_transition`: P0234_ALL_GATES_SATISFIED_PREINSTALL_RECHECK_REQUIRED ->
  P0234_CLOSED_C4_OTHER_TERMINAL_FAILURE.
- `progress_classification`: outcome_progress_with_new_blocker.
- `authority_classification`: the sole install, API restart, completion
  control, pass advance, browser launch, child, and attempt are consumed. No
  retry, pass 51, scheduler/wider resume, guard control, or separate
  materialization is authorized.
- `evidence`: source and installed adapter SHA-256 both
  `10274e4c6c5894faf4013531313222b5f4cf2f11ff9605826ec22b28d32d76e5`;
  API restart PID 5590 with zero restarts; parent pass `49 -> 50`; sole child
  `hmj_99a99200ff9a4218a018f5717e274a64`; two successful context receipts at
  `14275ms` and `108511ms`; two timeout receipts at
  `provider:chatgpt.readVisibleDownloadArtifactProbes` after `109086ms` and
  `109094ms`; child failed two assets from five conversations; parent blocked
  at pass 50 with force null; final active jobs/browser processes zero;
  scheduler paused/idle; wider paused passes `7/2/34`; guard clear.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: Plan 0233 materially moved the live failure
  boundary past payload settlement, but the canary is not clean because the
  downstream visible-download probe exhausted the same context deadline for
  two conversations. This is C4 rather than a repeated payload timeout or an
  authentication/challenge stop.
- `next_action_or_stop_reason`: stop with no retry. A provider-free successor
  must make `readVisibleDownloadArtifactProbes` independently bounded or
  interruptible and prove that exact later-stage settlement before any fresh
  installed canary, scheduler resume, or wider completion resume.
