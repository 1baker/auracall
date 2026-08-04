# ChatGPT Two-Gate Live Acceptance | 0185-2026-08-04

State: OPEN
Lane: P01
Plan version: 1
Governing goal: finish the bounded ChatGPT live-flow repair and testing campaign
without an unbounded retry loop.
Supports: Plan 0180 M5; succeeds closed Plan 0184.

## Stable Objective

Use the installed response/native identity-parity repair in exactly one fresh
two-asset ChatGPT direct proof. Enter exactly one `chatgpt/default`
`maxPasses=1` canary only if that proof materializes the exact uploaded TXT and
generated DOCX with zero failures. Preserve the global scheduler pause and stop
at the first failed live gate without a retry, replacement chat, or repair loop.

## Current State

- Historical Plan 0182 and Plan 0183 live failures remain recorded at 2/2.
  The operator explicitly authorized this separate successor packet on
  2026-08-04 after reviewing that the second failure resulted from incomplete
  provider-free boundary coverage, not merely an inadequate numeric ceiling.
- Plan 0184 reproduced the exact intercepted-response `(7)`/unsuffixed failure,
  unified both filename gates under one strict classifier, retained exact
  provider-file URL precedence and cross-asset rejection, passed 2,714 tests,
  and installed commit `957b37c0` byte-identically.
- API PID `65381` is active/running with zero restarts. Scheduler posture/state
  are paused, five retained completions are paused, active materialization jobs
  are zero, the default ChatGPT target has no active completion or provider
  guard, and the canonical fixture is 505 bytes at SHA-256
  `5d17e7ec1b61d4c6eaaefbb3bfd8ae542bb5a373113a506c681ade0aa641044b`.
- Plan 0180 M5 remains open. A successful direct proof is necessary but not
  sufficient; the conditional canary is a separate live acceptance gate.

## Authority And Ownership

- Authority is the operator's 2026-08-04 `ok go` accepting the recommended
  two-gate packet: one exact two-asset proof and one conditional one-pass
  canary, with no assumption that either will succeed.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; governing
  runtime policy prohibits delegation without explicit user authorization and
  both live gates share one serialized authenticated browser/runtime surface.
- Expected documentation write surface: this plan, Plan 0180, `ROADMAP.md`,
  `RUNBOOK.md`, `docs/dev/dev-journal.md`, `docs/dev-fixes-log.md`, and the Plan
  0180 handoff note. No production-code edit or install is authorized here.
- The managed `default/chatgpt` account, AuraCall runtime profile, browser
  profile, and bound identity must match before provider work.

## Local Goal Bounds

- `historical_goal_live_failures: 2`; preserve them as prior evidence rather
  than resetting or relabeling them.
- `max_new_fresh_prompt_submissions: 1` using exactly the canonical 505-byte
  fixture, one unique root slug, and the established DOCX prompt.
- `max_new_direct_materialization_jobs: 1`; `maxItems=2`, `attemptCount=1`,
  exact conversation and four-dimension provider-session identity, with no
  retry or replacement job.
- `max_new_live_follow_completion_starts: 1`; reachable only after direct-proof
  success and configured with `maxPasses=1`.
- `max_new_live_follow_owned_materialization_jobs: 1`; no manual retry,
  replacement, or second pass.
- `max_new_live_failures: 1`; a failed direct proof prevents the canary, and a
  failed canary closes this plan terminally.
- `max_code_repair_attempts: 0`, `max_install_or_restart_attempts: 0`, and
  `max_review_rework_cycles: 0`. Any new defect becomes evidence for a later
  separately reviewed provider-free packet.
- `max_live_stages: 2`; direct proof, then conditional canary.
- `checkpoint_interval: 1 slices` and before each live stage and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `DIRECT_TURN_COMPLETE` only after one fresh ChatGPT root turn
   uploads exactly the canonical fixture and returns the requested DOCX.
2. `DIRECT_TURN_COMPLETE` -> `DIRECT_PROOF_PASSED` only after the sole
   `maxItems=2` job settles with the exact TXT and DOCX materialized, zero
   failures, exact provider-session identity, and artifact validation green.
3. `DIRECT_PROOF_PASSED` -> `CANARY_ACTIVE` by starting exactly one new default
   completion with `maxPasses=1`; the scheduler and retained completions remain
   paused.
4. `CANARY_ACTIVE` -> `COMPLETE` only after its one pass and owned materializer
   settle with zero failed assets, no duplicate route mutation, no guard or
   verification signal, and restored paused zero-work posture.
5. Any failed asset, identity mismatch, ambiguous asset, rate limit, provider
   guard, CAPTCHA/verification page, second pass, unexpected scheduler or
   retained-completion activity, or other live contradiction ->
   `FAILED_TERMINAL`; no retry edge exists.

## Work Units

### W1 | Preflight And Fresh Direct Turn

- Reconfirm clean pushed source, installed parity, healthy service, paused
  scheduler/completions, zero active jobs, null default active completion,
  clear default ChatGPT guard, exact fixture size/checksum, and unused slug.
- Run one explicit `default/chatgpt` browser session using model `gpt-5.2`,
  `browser-model-strategy=current`, `browser-attachments=always`, exactly one
  file, and the established prompt. Wait for terminal completion.

### W2 | Sole Two-Asset Materialization And Validation

- Create one direct job for the fresh conversation with exact default browser
  and account binding, refresh enabled, asset kinds artifacts/files/media,
  `maxItems=2`, force enabled, and `attemptCount=1`.
- Require metrics 2 materialized / 0 failed. Verify source bytes against the
  canonical fixture. Verify the DOCX filename family, ZIP/OOXML integrity,
  exact control ID, exactly-one-upload statement, verbatim three-item list,
  checksum, and rendered visual output.

### W3 | Conditional One-Pass Canary

- Enter only after W2 passes completely. Start one new `chatgpt/default`
  completion with `maxPasses=1`; do not resume the scheduler or any retained
  completion.
- Poll the completion and its owned materialization job to terminal settlement.
  Require pass count at most one, zero failures, no duplicate same-route
  physical mutation, exact provider-session identity, and no provider safety
  signal.

### W4 | Final Posture And Durable Closeout

- Require scheduler and retained completions paused, queued/running work 0/0,
  no active materialization jobs, null default active completion, clear ChatGPT
  guard, and healthy API service with no unexpected restart.
- Reconcile Plan 0180, roadmap, runbook, journal, fixes log, and handoff to the
  actual terminal outcome. Audit, commit, push, and verify remote parity.

## Acceptance Criteria

- [x] Preflight proves the installed repaired runtime and paused zero-work
  posture before live work.
- [x] One fresh root turn uses exactly one canonical source upload and returns
  the requested DOCX without a second submission.
- [ ] One direct job at `attemptCount=1` materializes exact TXT and DOCX with
  metrics 2/0 and passes byte, content, OOXML, checksum, and rendered QA.
- [ ] Only after direct success, one new default completion runs at
  `maxPasses=1` and its owned materialization settles with zero failures,
  duplicate mutations, safety signals, or second pass.
- [ ] Final runtime posture is paused and zero-work; continuous re-enablement
  remains outside this plan.
- [ ] Canonical docs, audit, commit/push, and remote parity describe the exact
  live outcome without treating the attempt itself as success evidence.

## Hard Stops And Non-Goals

- No direct-proof retry, replacement conversation/job, second prompt, code
  repair, reinstall, scheduler resume, retained-completion resume, continuous
  live follow, account switch, guard clear, CAPTCHA handling, `Answer now`
  click, or historical cleanup.
- A direct-proof failure prevents W3. A canary failure ends W3. Either outcome
  closes the plan terminally and preserves all receipts.
- Stop before provider work on any preflight mismatch, dirty/unpushed runtime
  authority, active job, default-profile guard, unexpected completion activity,
  or ambiguous account/browser identity.

## Definition Of Done

This plan closes complete only when the exact two-asset direct proof and the
conditional one-pass canary both pass with current evidence and final paused
zero-work posture. If either live gate fails, the plan closes terminally with
no retry; another attempt is not implied by this plan.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0184 provider-free closure and operator review ->
  explicitly authorized two-gate live successor ready for final preflight.
- `progress_classification`: blocker_reduction
- `evidence`: Plan 0184 exact red/green, strict negative coverage, 2,714 green
  tests, installed/source adapter parity, healthy PID `65381`, paused scheduler,
  five paused completions, zero active jobs, null default active completion,
  clear default ChatGPT guard, and canonical 505-byte fixture checksum.
- `subagent_status`: `not_spawned`; delegation is prohibited and execution is
  serialized.
- `budget_consumption`: historical failures retained 2; new prompts 0/1;
  direct jobs 0/1; completion starts 0/1; owned canary jobs 0/1; new live
  failures 0/1; live stages 0/2; code/install/rework 0/0.
- `remaining_criteria`: W1-W4 and all six acceptance items.
- `next_action_or_stop_reason`: audit the plan and current runtime, commit/push
  this authority checkpoint, then enter W1 exactly once if preflight remains
  green.

## Checkpoint 2 | Direct Turn Complete

- `plan_version`: 1
- `state_transition`: authorized ready -> exact preflight green -> one fresh
  root ChatGPT turn completed with requested DOCX link.
- `progress_classification`: acceptance_movement
- `evidence`: session `m5-two-gate-live-acceptance` ran once from
  `2026-08-04T16:11:33.444Z` to `16:14:00.865Z`, uploaded exactly
  `docs/dev/fixtures/auracall-m5-source-20260802T185953Z.txt`, passed the bound
  Business/team account preflight, and completed fresh conversation
  `6a720f4a-49d8-83ea-9211-b99ee9ceefa1`. Its sole response returned
  `auracall-m5-20260802T185953Z.docx` as a sandbox download link. No second
  submission ran.
- `model_receipt`: the CLI contract recorded model `gpt-5.2` with
  `browser-model-strategy=current`. ChatGPT's current picker no longer exposed
  the legacy `Instant` label, so AuraCall preserved the already selected model
  and submitted once rather than forcing a different provider control.
- `post_turn_posture`: scheduler remains paused, five retained completions are
  paused, queued/running completion work is 0/0, default active completion is
  null, default ChatGPT guard is clear, and active history jobs are zero.
- `subagent_status`: `not_spawned`; the turn remained serialized.
- `budget_consumption`: historical failures retained 2; new prompts 1/1;
  direct jobs 0/1; completion starts 0/1; owned canary jobs 0/1; new live
  failures 0/1; live stages 1/2; code/install/rework 0/0.
- `remaining_criteria`: exact two-asset materialization, artifact validation,
  conditional one-pass canary, final posture, and closeout.
- `next_action_or_stop_reason`: commit/push this receipt, then create the sole
  `maxItems=2` direct materialization job for the exact fresh conversation. Any
  failed asset prevents the canary and closes the packet terminally.
