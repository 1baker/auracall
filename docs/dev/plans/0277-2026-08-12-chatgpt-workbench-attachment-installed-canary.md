# ChatGPT Workbench Attachment Installed Canary | 0277-2026-08-12

State: CLOSED
Lane: P01
Plan version: 1
Gate state: LIVE_CANARY_FAILED_SAFE
Goal execution state: COMPLETE

## Current State

Plan 0276 closed provider-free at pushed commit `3fa4d70c`, with 179 adjacent
tests passing and the current ChatGPT attachment surface represented in source.
The installed user runtime still predates that checkpoint. The API is
active/running at PID 1656 with `NRestarts=0`; the account-mirror scheduler is
`scheduled/healthy`, completion work is queued/running `0/0`, and its retained
`wsl-chrome-3` managed browser owns port 45015. That retained browser is shared
runtime state and is not a cleanup target.

## Stable Objective

Install the pushed Plan 0276 checkpoint through the canonical user-runtime
path and prove exactly one ChatGPT Chat turn uploads one small public test
fixture through the current attachment drawer, reads its contents, and returns
the exact expected token.

## Authority And Bounds

- The operator explicitly authorizes all outstanding Git, install, and testing
  tasks for the Plan 0276 workbench attachment change.
- Run the focused/adjacent provider-free gate once, then exactly one
  `pnpm run install:user-runtime-service`, including its installer-owned API
  restart.
- Run exactly one zero-retry installed-wrapper canary on AuraCall runtime
  profile `wsl-chrome-3`, Chat mode, current model strategy, one small tracked
  text fixture, and one short prompt whose response token is deterministic.
- The canary may wait behind and reuse the normal browser-operation lane. It
  must use `--browser-keep-browser`; the retained port-45015 browser and every
  unrelated process remain outside cleanup authority.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- Do not click ChatGPT `Answer now`, enter Work, select a model or effort,
  invoke a connector/tool, use the provider library, or upload any private
  file.
- Do not pause, resume, trigger, or mutate scheduler, completion,
  account-mirror, live-follow, or materialization controls.
- Stop on CAPTCHA/human verification, identity mismatch, selector ambiguity,
  install/parity/health failure, unexpected prompt-submission state, or any
  first-canary error. No retry or second prompt is authorized.
- Cleanup may release the canary's operation/process only if exact ownership
  proves it new and canary-owned. Preserve the admitted retained browser.

## Acceptance Criteria

- [x] Focused/adjacent tests, typecheck, touched lint, build, diff hygiene,
      CodeGraph readback, and planning audits pass at the pushed source
      checkpoint.
- [ ] Exactly one canonical install produces source/installed module parity
      and a healthy API with `NRestarts=0`.
- [ ] Exactly one installed-wrapper Chat canary uploads the tracked fixture
      through the current attachment drawer and returns the exact fixture
      token without retry or `Answer now`.
- [ ] The canary releases its operation lease, preserves the admitted retained
      browser, and leaves scheduler/completion/materialization controls
      untouched.
- [ ] Plan, roadmap, runbook, journal, fixes log, Git, origin, and installed
      runtime agree with the terminal result.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 0` when the
  admitted retained browser remains available; `max_prompt_submissions: 1`;
  `max_prompt_retries: 0`; `max_file_uploads: 1`; `max_browser_closes: 0` for
  the admitted retained browser; `max_scheduler_controls: 0`;
  `max_completion_controls: 0`; `max_materialization_controls: 0`;
  `max_subagents: 0`.

## Activation Checkpoint | Installed Canary Admitted

- `checkpoint_id`: `P0277-C01`.
- `state_transition`: P0276_PROVIDER_FREE_ACCEPTED ->
  P0277_ACTIVE_INSTALLED_CANARY.
- `progress_classification`: blocker_reduction.
- `runtime_evidence`: Git is clean and synchronized at `3fa4d70c`; CodeGraph
  is current at 888 files, 16,753 nodes, and 57,060 edges; API PID 1656 is
  active/running with `NRestarts=0`; scheduler is scheduled/healthy;
  completion queued/running is 0/0; retained `wsl-chrome-3` PID 39698 owns
  port 45015 under a retained display allocation.
- `authority_classification`: the one provider-free gate, one canonical
  install/restart, one installed upload/send/readback canary, exact readbacks,
  documentation, commit, and push are active. Every non-goal remains excluded.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: run the source gate, commit/push this admitted
  packet and fixture, install once, then spend the sole canary without retry.

## Source Gate Checkpoint | Ready To Install

- `checkpoint_id`: `P0277-C02`.
- `state_transition`: P0277_ACTIVE_SOURCE_GATE ->
  P0277_ACTIVE_READY_TO_INSTALL.
- `progress_classification`: blocker_reduction.
- `evidence`: the exact ten-file adjacent suite passes 179 tests with one
  pre-existing skip; typecheck, touched Biome lint with zero warnings,
  production build, diff hygiene, and active/goal planning audits pass. The
  widened typecheck also found and closed three test-only typing defects in
  the Plan 0276 fixtures before installation.
- `authority_classification`: the sole install and canary remain unspent.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit and push this admitted checkpoint, then
  run the canonical installer exactly once.

## Terminal Checkpoint | Model Current Strategy Failed Safe

- `checkpoint_id`: `P0277-C03`.
- `state_transition`: P0277_ACTIVE_INSTALLED_CANARY ->
  P0277_COMPLETE_FAILED_SAFE.
- `progress_classification`: blocker_reduction.
- `runtime_evidence`: the sole canonical install moved API PID 1656 to healthy
  PID 25301 with `NRestarts=0` and exact source/installed parity for the three
  attachment modules. The sole installed-wrapper canary reused PID 39698/port
  45015 and passed identity plus Chat-mode preflight, but
  `--browser-model-strategy current` entered Chat model-menu traversal for
  desired `GPT-5.6 Luna` and reached its internal retry diagnostics before any
  attachment upload or prompt submission.
- `cleanup_evidence`: SIGINT stopped the same process; exact dedicated target
  `17BDB1D9FB67726AADF27EFF9C943A5B` closed; its operation-lock record is
  absent; retained PID 39698/port 45015 remains; API PID 25301 is healthy; and
  completion queued/running remains 0/0.
- `authority_classification`: this plan's install and canary budgets are
  exhausted. No file upload, prompt submission, `Answer now`, model option
  selection, scheduler/completion/materialization control, retry command, or
  shared-browser cleanup occurred.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0278 owns the provider-free `current`
  strategy repair and a separately bounded installed canary.

## Definition Of Done

The pushed source and installed runtime match, one current ChatGPT workbench
attachment round trip returns the exact fixture token, shared runtime state is
preserved, and all required Git, documentation, validation, and planning
audits are closed with current evidence.
