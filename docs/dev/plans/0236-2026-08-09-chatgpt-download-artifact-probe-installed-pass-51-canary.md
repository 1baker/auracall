# ChatGPT Download-Artifact Probe Installed Pass-51 Canary | 0236-2026-08-09

State: OPEN
Lane: P01
Plan version: 1
Gate state: OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED
Goal execution state: READY_BEHIND_EXTERNAL_GATES

## Stable Goal Objective

Install the pushed Plan 0235 download-artifact probe settlement repair exactly
once, restart only the AuraCall API exactly once, prove source/installed parity
and the stopped-runtime boundary, then run exactly one pass-51 canary on the
existing `wsl-chrome-3` completion with its persisted `maxItems=6` ceiling.
Monitor its one child and parent to the first terminal result and stop. Do not
retry, resume the scheduler, resume any wider completion, control a provider
guard, or start any separate materialization.

## Current State

- Plan 0235 closed provider-free at pushed commit `a6f938c5`. Its exact
  real-seam regression failed red when a never-settling artifact-probe
  `Runtime.evaluate` outlived the local budget, then passed after the probe was
  changed to one ready-DOM collection with protocol and host deadlines plus
  pending-operation telemetry.
- Provider-free validation passed ChatGPT adapter 153/153, context 13/13,
  browser-service UI 54/54, TypeScript typecheck, production build, scoped
  Biome, diff hygiene, and the plan audit with 235 plans and zero errors.
- Plan 0234 consumed one installed pass-50 canary. Its sole child
  `hmj_99a99200ff9a4218a018f5717e274a64` completed two conversation reads but
  timed out two later reads at
  `provider:chatgpt.readVisibleDownloadArtifactProbes`; the parent stopped
  blocked at pass 50 with `forceRunUntilPassCount=null` and no retry.
- The target persists `materializationMaxItems=6`. This packet authorizes one
  completion pass and one child under that existing ceiling; it does not mutate
  the ceiling or restore the older Plan 0197 direct-job `maxItems=1` contract.
- Last provider-free readback found API PID 5590 active/running with zero
  restarts, scheduler paused/idle, active work zero, wider ChatGPT completions
  paused at `7/2/34`, target blocked/pass 50/force null, guard clear, and no
  exact `wsl-chrome-3` browser process. That evidence is historical and must be
  reread before installation.
- Current source adapter SHA-256 was
  `076d74e4e7f708f07cfbb58c6a0fe093388010ab096d61a1b9e0e8aad91161ec`;
  installed adapter SHA-256 remained
  `10274e4c6c5894faf4013531313222b5f4cf2f11ff9605826ec22b28d32d76e5`,
  proving one install was needed at the last readback.
- The operator authorized this exact bounded installed canary with `ok go` on
  2026-08-09. That approval does not authorize a retry, scheduler resume, wider
  completion resume, guard control, or a second child.

## External Gates

1. Plan 0235 is closed, validated, committed, and pushed: satisfied by
   `a6f938c5`.
2. The operator gives fresh approval for exactly this installed canary:
   satisfied by `ok go` on 2026-08-09.
3. This Plan 0236 `OPEN` transition is audited, committed, and pushed.
4. Fresh readback proves source build health; API active/running with no crash
   restart; scheduler paused/idle; active jobs and queued/running work zero;
   target blocked/pass 50/force null with its persisted `maxItems=6`; wider
   ChatGPT completions paused at `7/2/34`; all globally active completions
   paused; canonical ChatGPT guard clear; and no exact `wsl-chrome-3` browser
   process. Satisfied at 2026-08-09T14:11:08-05:00; reread once immediately
   after this checkpoint is pushed and before installation.

No install, restart, provider/browser call, completion control, or
materialization effect is allowed while any gate remains unmet.

## Frozen Effect Packet After All Gates

1. Record the built source adapter SHA-256. Run `pnpm run install:user-runtime`
   exactly once and require installed/source adapter parity before restart.
2. Restart `auracall-api.service` exactly once. Require a new active/running PID
   with zero crash restarts, exact adapter parity, scheduler paused, no active
   jobs, wider passes `7/2/34`, and target blocked/pass 50/force null.
3. Issue exactly one completion control:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --port 18095 --timeout-ms 15000 --json`.
4. Require pass `50 -> 51`, exactly one fresh child, and no pass 52. Monitor
   only that child, the parent, service health, stopped scheduler, active jobs,
   and the three wider ChatGPT completions until terminal.
5. Stop after the first terminal result. If an AuraCall-owned exact browser is
   retained, close only that exact browser/session and prove its process/port
   cleanup. Do not retry or resume anything.

## Terminal Classification

1. `C1_clean_artifact_probe_settlement`: one child reaches terminal success
   without context pending/timeout evidence, failed count is zero, and the
   parent settles without `account_mirror_materialization_failed`.
2. `C2_repeated_download_artifact_timeout`: the child again times out or
   remains pending at `provider:chatgpt.readVisibleDownloadArtifactProbes`.
   Stop with no retry and return to provider-free diagnosis.
3. `C3_reload_or_session_downstream_failure`: the repaired artifact probe
   settles, but a distinct reload-, target-, session-, or later-stage failure
   becomes terminal. Stop and preserve the exact new stage; do not infer a
   mechanism beyond retained evidence.
4. `C4_auth_or_challenge_stop`: login loss, wrong identity, CAPTCHA, challenge,
   verification, `Answer now`, provider guard, or profile/process mismatch.
   Stop and clean up only the exact browser without another provider action.
5. `C5_other_terminal_failure`: any other child or parent failure, ambiguous
   fanout, pass drift, second child, API fault, scheduler drift, or wider-target
   movement. Stop and preserve bounded metadata for a successor diagnosis.

## Acceptance Criteria

- [ ] All four external gates are satisfied before effects.
- [ ] Exactly one install and one API restart produce source/installed adapter
  parity and preserve stopped-runtime state.
- [ ] Exactly one `wsl-chrome-3` `run-one-pass` advances pass 50 to 51 and
  creates exactly one fresh child under the existing `maxItems=6` ceiling.
- [ ] Exactly one C1-C5 terminal classification is recorded without retry.
- [ ] Exact child/parent evidence distinguishes artifact-probe settlement from
  authentication, challenge, provider guard, or a distinct downstream stage.
- [ ] API returns healthy, active jobs return zero, scheduler remains paused,
  wider completions remain paused at `7/2/34`, and any exact browser is closed.
- [ ] No second install/restart/canary, scheduler or wider-completion resume,
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

- Stop before installation unless Plan 0236 is audited, committed, pushed, and
  every fresh runtime precondition matches the frozen packet.
- Stop before the canary unless install parity, the one API restart, and the
  full stopped-runtime recheck pass.
- Stop on login loss, wrong identity, CAPTCHA, challenge, verification,
  `Answer now`, guard activation, process/profile mismatch, target/pass drift,
  scheduler movement, active-job pressure, or wider-completion movement.
- Stop after the first terminal child/parent classification. No outcome grants
  a retry, second pass, scheduler resume, wider completion resume, or separate
  materialization authority.

## Checkpoint 1 | One Pass-51 Canary Opens Behind Runtime Readback

- `checkpoint_id`: `P0236-C01`.
- `state_transition`: P0235_CLOSED_PROVIDER_FREE_GREEN_LIVE_WITHHELD ->
  P0236_OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED.
- `progress_classification`: outcome_progress.
- `authority_classification`: exactly one install, one API restart, and one
  exact `wsl-chrome-3` pass-51 canary are approved after all external gates;
  retries, scheduler/wider resume, guard control, and separate materialization
  remain excluded.
- `evidence`: pushed repair `a6f938c5`; deterministic exact-seam red-to-green
  regression; adjacent provider-free validation; pass-50 downstream terminal
  evidence; operator `ok go`.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: one installed end-to-end proof is necessary to
  decide whether the exact artifact-probe timeout is removed in the retained
  AuraCall browser lane. A pending reload/session failure remains a distinct
  falsifiable terminal class, not a claimed current mechanism.
- `next_action_or_stop_reason`: audit, commit, and push this gate, then perform
  the complete fresh readback. Stop on any mismatch; otherwise consume the one
  install/restart/canary packet and close at its first terminal result.

## Checkpoint 2 | Runtime Gate Satisfied Before Installation

- `checkpoint_id`: `P0236-C02`.
- `state_transition`: P0236_OPEN_OPERATOR_APPROVED_RUNTIME_READBACK_REQUIRED ->
  P0236_ALL_GATES_SATISFIED_PREINSTALL_RECHECK_REQUIRED.
- `progress_classification`: blocker_reduction.
- `authority_classification`: the approved effect remains one install, one API
  restart, and one existing completion pass with one child. No retry, second
  child, scheduler/wider resume, guard control, or separate job is admitted.
- `evidence`: Plan 0236 open commit `6d35993d`; main clean and synchronized;
  API PID 5590 active/running with `NRestarts=0`; source adapter SHA-256
  `076d74e4e7f708f07cfbb58c6a0fe093388010ab096d61a1b9e0e8aad91161ec`;
  installed adapter SHA-256
  `10274e4c6c5894faf4013531313222b5f4cf2f11ff9605826ec22b28d32d76e5`;
  scheduler paused/idle with active request count zero; active history jobs
  zero; target blocked/pass 50/force null and `maxItems=6`; exact target
  eligible with null provider/routine guards and idle browser health; all five
  active completions paused with queued/running zero; wider ChatGPT passes
  `7/2/34`; exact-profile browser process count zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: every stopped-runtime invariant is current and
  the exact adapter hash mismatch proves the single approved install is
  necessary. No provider or browser effect was used to satisfy this gate.
- `next_action_or_stop_reason`: audit, commit, and push this checkpoint. Then
  immediately reread every gate; stop on drift, otherwise run the one
  install/restart/canary sequence.
