# ChatGPT Current Model Strategy And Attachment Canary | 0278-2026-08-12

State: CLOSED
Lane: P01
Plan version: 1
Gate state: INSTALLED_REATTACH_FAILED_SAFE
Goal execution state: COMPLETE

## Current State

Plan 0277 installed the current attachment implementation but failed safe
before upload or prompt submission because Chat's `current` model strategy
still built a `chat-model` plan. That invoked the volatile model menu and its
retry wrapper even though the operator explicitly requested preservation of
the active model. Exact tab/lease cleanup passed and the retained browser plus
API remain healthy.

## Stable Objective

Make `--browser-model-strategy current` preserve the active ChatGPT model
without opening or traversing the model selector, install the repaired pushed
checkpoint once, and prove one zero-retry installed attachment round trip.

## Authority And Bounds

- Provider-free scope is the Chat/Work model-selection plan resolver, its
  focused tests, and required documentation.
- After a committed/pushed green source gate, run one canonical
  `install:user-runtime-service` and one installed-wrapper canary with the
  existing tracked public fixture, explicit Chat, `current`, forced upload,
  keep-browser, and one deterministic response token.
- The canary is a new successor proof after a source-level causal repair; it is
  not a rerun of Plan 0277's unchanged failing packet.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- Do not enter Work, open/select Chat model or effort controls, click `Answer
  now`, invoke tools/connectors, use provider-library files, or upload private
  data.
- Do not mutate scheduler, completion, account-mirror, live-follow, or
  materialization controls. Preserve the retained browser.
- Stop on any first-canary error, CAPTCHA, identity mismatch, selector drift,
  install/parity/health failure, or uncertainty about prompt submission. No
  retry or second prompt is authorized.

## Acceptance Criteria

- [x] A focused red/green test proves Chat `current` resolves to no model-menu
      action while `select` and Work semantics remain intact.
- [x] Adjacent tests, typecheck, touched lint, build, diff hygiene, CodeGraph,
      and active/goal planning audits pass.
- [ ] One install produces repaired source/installed parity and healthy API
      handoff with `NRestarts=0`.
- [ ] One installed-wrapper canary performs one upload and one prompt, returns
      `AURACALL_CHATGPT_ATTACHMENT_DRAWER_OK_0277`, and never enters model-menu
      traversal or retry.
- [ ] Exact tab/lease cleanup preserves the retained browser; final docs, Git,
      origin, and installed state agree.

## Local Goal Bounds

- `max_repair_cycles: 1`; `max_installs: 1`; `max_api_restarts: 1`;
  `max_prompt_submissions: 1`; `max_prompt_retries: 0`; `max_file_uploads: 1`;
  `max_model_menu_actions: 0`; `max_browser_closes: 0` for the retained
  browser; `max_scheduler_controls: 0`; `max_completion_controls: 0`;
  `max_materialization_controls: 0`; `max_subagents: 0`.

## Activation Checkpoint | Causal Repair Active

- `checkpoint_id`: `P0278-C01`.
- `state_transition`: P0277_COMPLETE_FAILED_SAFE ->
  P0278_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: CodeGraph identifies `resolveChatgptModelSelectionPlan()` as the
  shared local/remote boundary that maps Chat `current` plus a configured
  desired model to `chat-model`, which then enters `ensureModelSelection()` and
  its retry wrapper. README defines `current` as keeping the active model.
- `authority_classification`: provider-free repair/validation is active;
  successor install and canary remain gated on a pushed green checkpoint.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: prove the minimal plan-routing repair and full
  source gate, then commit/push before runtime effects.

## Source Gate Checkpoint | Ready To Install

- `checkpoint_id`: `P0278-C02`.
- `state_transition`: P0278_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0278_ACTIVE_READY_TO_INSTALL.
- `progress_classification`: blocker_reduction.
- `evidence`: the resolver now maps `current` and `ignore` to no model-menu
  action while explicit Chat `select` and Work `select` routing remain intact.
  Focused mode tests pass 8/8; the adjacent ten-file gate passes 179 with one
  pre-existing skip; typecheck, zero-warning touched lint, production build,
  diff hygiene, and active/goal audits pass.
- `authority_classification`: the successor install and canary remain unspent.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit/push the causal repair, install once,
  verify parity/health, then spend the sole attachment canary.

## Terminal Checkpoint | Stale Reattach Failed Safe

- `checkpoint_id`: `P0278-C03`.
- `state_transition`: P0278_ACTIVE_INSTALLED_CANARY ->
  P0278_COMPLETE_FAILED_SAFE.
- `progress_classification`: blocker_reduction.
- `runtime_evidence`: the sole install moved API PID 25301 to healthy PID
  27211 with `NRestarts=0` and exact parity for the model-strategy plus three
  attachment modules. The first wrapper invocation stopped locally at the
  duplicate-prompt guard because Plan 0277's interrupted session remained
  marked running; it acquired no browser lease and caused no provider effect.
  Supported `auracall session` recovery cleared that marker but, because the
  recorded dedicated target was gone and no conversation id existed, it
  rebound to a retained same-origin tab and captured an unrelated answer.
- `cleanup_evidence`: no Plan 0278 prompt, upload, new browser, or operation
  lock occurred. API PID 27211 is healthy; the retained browser remains; the
  stale session is terminal rather than running.
- `authority_classification`: this plan closes failed-safe. Plan 0279 owns the
  provider-free exact-target reattach repair and a new installed canary; no
  direct runtime edit, retry prompt, or scheduler/completion/materialization
  control is authorized here.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: require recorded-target fail-closed behavior
  before another installed attachment proof.

## Definition Of Done

`current` has executable non-mutating semantics, one installed attachment
round trip passes without model-menu activity or retry, shared runtime state is
preserved, and every source/install/test/Git task closes with current evidence.
