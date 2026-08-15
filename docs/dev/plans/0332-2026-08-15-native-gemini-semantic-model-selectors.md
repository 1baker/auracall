# Native Gemini Semantic Model Selector Execution | 0332-2026-08-15

State: OPEN
Lane: P01
Plan version: 1

## Goal

Make AuraCall's existing Gemini semantic selectors execution-ready through the
maintained native browser adapter, with exact current picker selection,
attachment preservation, and no configured-agent dependency on the legacy
private web-RPC transport.

## Current State

- Discovery publishes `gemini:auto`, `gemini:instant`, and
  `gemini:thinking`, all with `executionReady=false`.
- Configured Gemini agent execution still defaults to `createGeminiWebExecutor`
  and stale private web model headers. It accepts raw model strings but cannot
  prove the current visible picker state.
- The maintained `GeminiService`/provider adapter owns browser-session
  authorization, navigation, capability selection, prompt submission, and
  response readback, but `runPlannedPrompt()` drops `desiredModel` and
  attachments before provider dispatch.
- The provider adapter can discover the mode-picker trigger but does not select
  or verify a requested model before submission.
- Current Google Gemini Apps guidance lists Gemini Flash-Lite, Gemini Flash,
  and Gemini Pro in the web model dropdown:
  <https://support.google.com/gemini/answer/13275745?hl=en-GB>.

## Scope

- Map stable Gemini semantic intent to current adapter-owned choices:
  `instant` to Flash-Lite, `auto` to Flash, and `thinking` to Pro.
- Carry `desiredModel` and prompt attachments through the shared planned-prompt
  contract into the native Gemini provider adapter.
- Add provider-local exact picker selection with bounded available-option
  diagnostics and post-selection verification before prompt insertion.
- Preserve configured Gemini attachment execution through the native adapter.
- Route configured Gemini agents through the maintained adapter instead of the
  legacy private web-RPC executor while retaining raw `model` as the explicit
  higher-priority escape hatch.
- Reject unsupported `gemini:` tokens before browser resolution and mark only
  the proven Gemini selector family execution-ready in discovery.
- Add provider-free resolver, adapter, executor, attachment, discovery, and
  documentation coverage.

## Non-Goals

- Do not perform a live Gemini prompt, launch or mutate a managed browser, or
  retry against CAPTCHA/`google.com/sorry` state.
- Do not remove the legacy Gemini web implementation where compatibility-only
  image-generation commands still reference it.
- Do not change ChatGPT/Grok selector semantics, provider rate limits, account
  bindings, installed runtime state, or credentials.
- Do not add new public selector ids beyond the existing `auto`, `instant`, and
  `thinking` family.

## Acceptance Criteria

- [ ] Gemini semantic selectors resolve deterministically to current native
      adapter model intent, while unknown `gemini:` tokens fail before browser
      execution and raw agent `model` remains the higher-priority override.
- [ ] Shared planned-prompt dispatch preserves requested model and attachments
      through `GeminiService` into the provider adapter.
- [ ] The Gemini adapter opens the current picker, selects one exact known row,
      re-reads authoritative selected state, and fails before prompt insertion
      if the trigger, row, or verification is unavailable.
- [ ] Configured Gemini agent execution uses the maintained native adapter and
      preserves response/runtime metadata without defaulting to private web-RPC
      model headers.
- [ ] `/v1/models` and config-choice discovery mark the three Gemini selectors
      execution-ready only after the native path is covered provider-free.
- [ ] Focused tests, typecheck, zero-warning lint, build, complete
      provider-disabled suite, plan audit, CodeGraph sync, and diff hygiene
      pass without browser/provider effects.
- [ ] Exact-SHA cross-platform CI passes Ubuntu, macOS, and Windows without
      provider traffic.

## Definition Of Done

The plan closes when configured Gemini semantic agents run through one
maintained native browser path that proves the selected current model before
submission, preserves attachments and metadata, advertises readiness
consistently, and passes exact-SHA cross-platform CI.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; selector transport, adapter selection, attachments,
  and configured execution share one tightly coupled prompt path, and no
  subagent delegation is authorized for this turn
- expected_write_surface: semantic selector config, planned-prompt/provider
  input contracts, Gemini native adapter/action and tests, configured executor
  and tests, service registry, discovery tests, user/testing docs, roadmap,
  runbook, journal, and fixes log
- max_work_unit_attempts: 2 per failing contract before splitting or reframing
- max_review_rework_cycles: 1
- terminal_condition: the native provider-free path and exact-SHA CI pass, or
  current source evidence disproves attachment/model preservation and readiness
  remains false with the exact blocker recorded

