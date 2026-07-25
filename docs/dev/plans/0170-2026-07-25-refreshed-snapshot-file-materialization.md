# Refreshed Snapshot File Materialization | 0170-2026-07-25

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make completion-owned history materialization consume the conversation-file
inventory already written by its successful snapshot-refresh phase, so a
redundant scoped file listing cannot time out and erase known file candidates
before transfer selection.

## Current State

- The repair is merged and pushed on `main` at `c20b9a66`, installed from the
  canonical checkout, and byte-identical across the complete `dist` tree.
- An operator-authorized zero-cooldown clear removed both the account-mirror
  guard and the persisted `wsl-chrome-3` browser guard while preserving rate
  history.
- Bounded completion pass 38 queued organic job
  `hmj_a65695afe9704af6b6716bb4c9f063b4`. The job refreshed conversation
  `6a568ccb-3938-83ea-a635-02dde7634d3f` with `fileCount=1`, then emitted
  `known-files-excluded` for that known terminal-local file instead of
  `no-materializable-file`.
- The receipt completed with four conversations, seven skips, zero failures,
  zero duplicate aliases, and no provider guard. The scheduler and all four
  ChatGPT completions are operator-paused; `wsl-chrome-3` is paused at pass 38.

## Scope

- When `materializeConversationFiles` is told its source snapshot is already
  refreshed, read the dedicated cached conversation-file inventory first, then
  fall back to `files[]` in the refreshed conversation-context cache instead
  of issuing a second provider listing.
- Preserve terminal-family exclusions, cached-file salvage, batch transfer,
  singular-provider fallback, provider guards, and default live-refresh
  behavior.
- Add telemetry that distinguishes dedicated file-cache reuse, refreshed
  context fallback, and live file listing.
- Install only after provider-free validation and a live idle/safe boundary.
- Verify the next organic completion-owned materialization receipt; do not
  force an extra provider pass for proof.

## Non-Goals

- No interaction-budget increase or cooldown reduction.
- No replay of Plan 0164's provider-inaccessible SIP-1133 files.
- No change to artifact-family eligibility or account-library materialization.
- No broad backlog-count redesign in this slice.

## Acceptance Criteria

- [x] A red regression proves `refresh=false` currently calls the provider file
  listing despite a populated cached conversation-file snapshot.
- [x] The repaired path selects cached refreshed files with zero provider list
  calls.
- [x] The repaired path falls back to `files[]` in the refreshed
  conversation-context cache when the dedicated file cache is empty.
- [x] Terminal-family exclusion and `maxItems` are applied to the reused cached
  list before transfer.
- [x] Default/direct materialization without `refresh=false` retains current
  provider-listing behavior.
- [x] Focused and adjacent tests, typecheck, production build, scoped lint,
  plan audit, and diff check pass.
- [x] Installed runtime is hash-consistent and restarts at a safe boundary with
  the scheduler/completion/provider guard state preserved.
- [x] A known cached file excluded by terminal-family evidence is reported as
  `known-files-excluded`, not `no-materializable-file`.
- [x] The next organic materialization receipt shows refreshed-cache reuse and
  does not classify a known cached file as missing solely because a redundant
  list timed out.

## Hard Bounds And Stop Conditions

- Maximum implementation attempts: 2.
- Maximum review/rework cycles: 1.
- Do not issue an extra live provider pass.
- Stop immediately on a new rate-limit, CAPTCHA, human-verification, or
  provider-guard observation.
- Do not restart the installed API while ChatGPT provider work owns the live
  lane.

## Definition Of Done

The plan closes only after the provider-free regression is green, the repaired
bundle is safely installed, and one organic live-follow receipt proves cached
snapshot file inventory reaches materialization selection without a redundant
provider listing.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: diagnosis -> implementation
- `progress_classification`: substantive
- `evidence`: installed job `hmj_fe91e8b54fed40a08588fdc6643d28e6`
  refreshed a one-file conversation but telemetry recorded
  `materializeConversationFiles.listTimedOut`, zero file candidates, and zero
  downloads.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: add the cache-authority regression and repair
  the file-selection seam provider-free.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: implementation -> installed-validation-wait
- `progress_classification`: substantive
- `evidence`: the regression was red because the provider listing ran once,
  then green with zero provider listing calls, one cached candidate after
  exclusion and `maxItems`, one batch transfer, and
  `reuseRefreshedCache=1`. The full two-file focused surface passes `107/107`;
  typecheck, production build, full lint with 203 existing warnings, scoped
  Biome, plan audit with 170 plans and zero errors, and diff check pass.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: installed API PID `4015989` still has an open
  ChatGPT browser and scheduler foreground pass. Pause future scheduling, wait
  for physical provider work to settle, then install/restart without forcing a
  proof pass.

## Checkpoint 3

- `plan_version`: 1
- `state_transition`: installed-validation-wait -> implementation
- `progress_classification`: substantive
- `evidence`: first installed rollout was safe and preserved scheduler,
  completion, and guard controls. Organic wsl-chrome-3 job
  `hmj_2074a079f641437aa0e10ab708a6790d` then refreshed
  `6a568ccb-3938-83ea-a635-02dde7634d3f` with one file but still emitted
  `no-materializable-file`. Structural inspection proved `refresh=false` was
  propagated; the mismatch was that snapshot refresh writes context `files[]`
  while the first repair read only the separate conversation-file dataset.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: validate and reinstall the context-file
  fallback, then wait for one new organic receipt at the same safe gates.

## Checkpoint 4

- `plan_version`: 1
- `state_transition`: implementation -> installed-validation-wait
- `progress_classification`: substantive
- `evidence`: refined focused tests pass `107/107`; scoped Biome, typecheck,
  production build, full lint with 203 existing warnings, 170-plan audit, and
  diff check pass. Installed PID `1078144` is active; source and installed
  `llmService.js` share SHA-256
  `acefefaafffe05b4cb58ba2ed427a6836dc3ad7a1a317758ecc0fecffccc6c2f`.
  Provider-guard files were unchanged across restart.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: wsl-chrome-3 alone is running its next organic
  completion pass while the scheduler and other three ChatGPT completions
  remain paused. Close only after its terminal materialization receipt.

## Checkpoint 5

- `plan_version`: 1
- `state_transition`: installed-validation-wait -> guard-blocked-validation
- `progress_classification`: substantive
- `evidence`: organic job `hmj_0346175923de4538af0ab7a8bcea2409`
  reached the refined runtime. Conversation
  `6a568ccb-3938-83ea-a635-02dde7634d3f` had one cached file in both the
  conversation-context and dedicated file datasets. Its attachment manifest
  and 2026-07-20 fetch manifest prove `ISU Renewal Policy.pdf` is already a
  terminal-local 18,452,735-byte file with SHA-256
  `0ae9adee205910dbb3f0d8247d3b41a430e2317d32510eea4a617aa62b985eed`.
  Terminal exclusion was therefore correct; the remaining defect was the
  misleading `no-materializable-file` receipt. Materialization now carries
  `knownConversationFileCount` across the selection boundary and emits
  `known-files-excluded` when known files are terminal or outside the bound.
  Focused tests pass `107/107`; scoped Biome, typecheck, and production build
  pass. Source and installed history-service and LlmService bundles are
  hash-identical.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: service startup restored the previously active
  wsl-chrome-3 completion, which immediately observed ChatGPT `Too many
  requests` and set cooldown through `2026-07-25T20:29:21.846Z`. The
  completion was operator-paused; scheduler and all four ChatGPT completions
  remain paused. Do not issue another provider pass until the guard clears.

## Checkpoint 6

- `plan_version`: 1
- `state_transition`: guard-blocked-validation -> closed
- `progress_classification`: complete
- `evidence`: operator-authorized guard clearance removed both account-mirror
  and browser guard cooldown state. Bounded pass 38 queued organic job
  `hmj_a65695afe9704af6b6716bb4c9f063b4`; its full durable receipt refreshed
  conversation `6a568ccb-3938-83ea-a635-02dde7634d3f` with one file and then
  classified that file as `known-files-excluded`. The job ended with four
  conversations, seven skips, zero failures, no duplicate aliases, and no
  provider guard.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: Plan 0170 is complete. Scheduler and all four
  ChatGPT completions are paused; no further provider proof belongs to this
  plan.
