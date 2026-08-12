# Reattach Target Fence And Attachment Canary | 0279-2026-08-12

State: CLOSED
Lane: P01
Plan version: 1
Gate state: INSTALLED_CANARY_FAILED_SAFE
Goal execution state: COMPLETE_FAILED_SAFE

## Current State

Plan 0278 installed the non-mutating `current` strategy, but its locally
blocked canary exposed unsafe recovery of Plan 0277's interrupted session. The
session recorded an exact dedicated target and no conversation id; after that
target was closed, reattach fell back by root URL to another retained ChatGPT
tab and marked the session completed from unrelated content.

## Stable Objective

Fail closed when an exact recorded prompt target is absent and no conversation
id can safely reacquire the run, install the repair, and complete one unique
zero-retry current-model attachment upload/send/readback proof.

## Authority And Bounds

- Provider-free scope is exact reattach target selection/core recovery, focused
  tests, and required docs.
- Preserve safe conversation-id recovery and exact target-id reattach. For a
  recorded target with no conversation id, absence must never fall through to
  same-origin URL or first-page selection and must not launch recovery.
- After a pushed green gate, run one canonical install and one installed
  wrapper canary with a unique prompt, the tracked public fixture, explicit
  Chat/current/forced-upload/keep-browser, and exact expected token.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- No model/effort menu, Work, `Answer now`, connector/tool, provider-library
  file, private attachment, direct runtime edit, or background control action.
- Preserve the retained browser. Stop on any first provider-canary failure,
  CAPTCHA, identity mismatch, selector drift, response mismatch, or uncertain
  submission. No prompt retry or second prompt.

## Acceptance Criteria

- [x] A provider-free regression proves missing exact target plus absent
      conversation id returns `stale-target`, does not connect, does not
      recover, and cannot select an unrelated same-origin tab.
- [x] Exact-target and conversation-id reattach tests remain green; adjacent
      attachment/current tests, typecheck, lint, build, diff hygiene,
      CodeGraph, and planning audits pass.
- [x] One install produces source/runtime parity and healthy API handoff.
- [ ] One unique installed canary uploads once, submits once, returns the exact
      fixture token, and uses no model menu or retry.
- [x] Exact tab/lease cleanup preserves the retained browser and final docs,
      Git, origin, service, and installed runtime agree.

## Local Goal Bounds

- `max_repair_cycles: 1`; `max_installs: 1`; `max_api_restarts: 1`;
  `max_prompt_submissions: 1`; `max_prompt_retries: 0`; `max_file_uploads: 1`;
  `max_model_menu_actions: 0`; `max_browser_closes: 0` for retained browser;
  `max_scheduler_controls: 0`; `max_completion_controls: 0`;
  `max_materialization_controls: 0`; `max_subagents: 0`.

## Activation Checkpoint | Exact Target Fence Active

- `checkpoint_id`: `P0279-C01`.
- `state_transition`: P0278_COMPLETE_FAILED_SAFE ->
  P0279_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: CodeGraph shows `pickTarget()` prefers exact id but falls through
  to URL/first page when it is absent; `resumeBrowserSessionCore()` then
  recovers every classified failure. The observed stale new-chat session has
  exact `chromeTargetId`, root `tabUrl`, and no `conversationId`, so URL
  fallback cannot prove association.
- `authority_classification`: source repair/validation active; install and live
  canary gated on a pushed green checkpoint.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: prove the exact-target fence, validate broadly,
  then commit/push before the sole install/canary.

## Source Gate Checkpoint | Ready To Install

- `checkpoint_id`: `P0279-C02`.
- `state_transition`: P0279_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0279_ACTIVE_READY_TO_INSTALL.
- `progress_classification`: blocker_reduction.
- `evidence`: missing exact target plus no conversation id now returns
  `stale-target`; connect and recovery remain zero; helper selection refuses
  URL fallback. The 11-file reattach/current/attachment gate passes 196 tests
  with one pre-existing skip; typecheck, production build, diff hygiene,
  zero-warning source lint, CodeGraph, and active/goal audits pass. Whole-file
  reattach-test lint retains 14 pre-existing warnings outside this diff.
- `authority_classification`: the sole install and live canary remain unspent.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit/push this fence, install once, verify
  parity/health, then run the one unique provider canary.

## Definition Of Done

Stale target recovery cannot capture another tab, the installed runtime is
current, one unique attachment round trip succeeds, retained runtime state is
preserved, and all outstanding Git/install/testing work is closed.

## Terminal Checkpoint | Installed Canary Failed Safe

- `checkpoint_id`: `P0279-C03`.
- `state_transition`: P0279_ACTIVE_READY_TO_INSTALL ->
  P0279_COMPLETE_FAILED_SAFE.
- `progress_classification`: blocker_localized.
- `evidence`: the sole install produced exact six-module source/runtime parity
  and healthy API PID 50659. The sole canary reused retained PID 39698/port
  45015, passed exact Pro/personal identity, retained Chat, skipped the model
  picker for `current`, and failed before upload or prompt with
  `chatgpt-workbench-attachment-menu-not-found`. Exact retained-tab inspection
  then proved the current plus trigger, both required rows, and unrestricted
  `#upload-files` input exist; a direct click opens them. The dedicated target
  and operation lock cleared without closing the retained browser.
- `authority_classification`: the prompt/upload budget remained unspent, but
  this plan's one canary attempt is consumed. Plan 0280 inherits the standing
  goal and owns the focus-before-measure repair plus successor acceptance.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: superseded by Plan 0280; do not retry under
  this closed plan.
