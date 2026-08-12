# ChatGPT Attachment Drawer Focus Order Canary | 0280-2026-08-12

State: OPEN
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_REPAIR_ACTIVE
Goal execution state: ACTIVE

## Current State

Plan 0279 installed the exact reattach fence and its sole canary passed
identity, Chat mode, and non-mutating current-model handling. It then failed
before upload or prompt because AuraCall measured the attachment trigger before
bringing the dedicated retained-browser tab forward. Exact inspection on that
same tab showed the current trigger, both drawer rows, and unrestricted local
file input; a direct trigger click opened the drawer.

## Stable Objective

Make attachment drawer opening focus-safe, prove the current workbench contract
provider-free, install exact runtime bytes, and complete one unique attachment
upload/send/readback canary without model selection or prompt retry.

## Authority And Bounds

- Provider-free scope is the shared ChatGPT composer popover opener, focused
  tests, adjacent validation, and required docs.
- Establish foreground focus before reading click coordinates. Preserve the
  CDP pointer path and permit one bounded shared-helper DOM-click fallback when
  the pointer path does not expose the popover.
- After a pushed green gate, run one canonical install and one unique installed
  wrapper canary using the tracked public fixture, explicit Chat/current/
  forced-upload/keep-browser, and the exact expected token.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- No model/effort menu, Work, `Answer now`, connector/tool, provider-library
  file, private attachment, direct runtime edit, or background control action.
- Preserve retained PID 39698/port 45015. Stop on any canary failure, CAPTCHA,
  identity mismatch, response mismatch, or uncertain submission. No prompt
  retry or second prompt.

## Acceptance Criteria

- [x] A provider-free regression proves the tab is foregrounded before the
      composer trigger is measured and clicked.
- [x] Current drawer rows and unrestricted `#upload-files` validation remain
      green; adjacent tests, typecheck, lint, build, diff hygiene, CodeGraph,
      and planning audits pass.
- [ ] One install produces source/runtime parity and healthy API handoff.
- [ ] One unique installed canary uploads once, submits once, returns exactly
      `AURACALL_CHATGPT_ATTACHMENT_DRAWER_OK_0277`, and uses no model menu or
      prompt retry.
- [ ] Exact target/lease cleanup preserves the retained browser and final
      docs, Git, origin, service, scheduler, and installed runtime agree.

## Local Goal Bounds

- `max_repair_cycles: 1`; `max_installs: 1`; `max_api_restarts: 1`;
  `max_provider_canaries: 1`; `max_prompt_submissions: 1`;
  `max_prompt_retries: 0`; `max_file_uploads: 1`;
  `max_model_menu_actions: 0`; `max_browser_closes: 0` for retained browser;
  `max_scheduler_controls: 0`; `max_completion_controls: 0`;
  `max_materialization_controls: 0`; `max_subagents: 0`.

## Activation Checkpoint | Focus Order Repair Active

- `checkpoint_id`: `P0280-C01`.
- `state_transition`: P0279_COMPLETE_FAILED_SAFE ->
  P0280_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: the failed canary's durable log records `menu-not-found` before
  upload/prompt. Exact retained-tab DOM then showed `#composer-plus-btn`, both
  required drawer rows, and unrestricted `#upload-files`; direct DOM click
  opened `.popover`. CodeGraph shows `openComposerPopoverWithCdp()` measured
  the trigger before `Page.bringToFront()`, making the coordinate stale across
  retained-tab focus/reflow.
- `authority_classification`: source repair/validation active; install and live
  canary gated on a pushed green checkpoint.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: validate the focus-before-measure repair and
  shared-helper fallback, then commit/push before the sole install/canary.

## Definition Of Done

The current ChatGPT attachment drawer opens reliably on a retained dedicated
tab, local upload and exact readback pass once, no unrelated surface is
selected, retained runtime state is preserved, and Git/install/testing work is
closed.

## Source Gate Checkpoint | Ready To Install

- `checkpoint_id`: `P0280-C02`.
- `state_transition`: P0280_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0280_ACTIVE_READY_TO_INSTALL.
- `progress_classification`: blocker_reduction.
- `evidence`: the focus-order regression passes 13/13 in its focused file; the
  14-file attachment/current/model/reattach/config boundary passes 165/165.
  Typecheck, zero-warning touched lint, production build, diff hygiene,
  CodeGraph at 888 files/16,793 nodes/57,013 edges, and active/goal planning
  audits pass with zero validation errors.
- `authority_classification`: the sole install and successor canary remain
  unspent and gated on commit/push of this checkpoint.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit/push the green source gate, run the one
  canonical install, verify parity/health, then run the unique canary once.
