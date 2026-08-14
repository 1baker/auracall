# ChatGPT Developer-App Test Current-Model Contract | 0282-2026-08-13

State: OPEN
Lane: P01

## Stable Objective

Make submitted ChatGPT developer-app tests preserve the already-active Chat
model instead of inheriting the generic `select` / `Instant` browser default,
so a connector smoke can reach app selection and prompt submission without an
unrequested model transition.

## Current State

- LitScout Plan 0412's sole canary invocation stopped before prompt submission
  because AuraCall requested `Instant` while the live controls exposed
  `Advanced`, `ModelGPT-5.6 Sol`, and `EffortPro`.
- Exact reconciliation proves zero prompt submissions, connector calls, or
  canonical LitScout effects; one extra empty ChatGPT tab is retained.
- CodeGraph traces the failure through
  `ChatgptDeveloperAppBrowserAdapter.submitTest()` into
  `ChatgptService.runPrompt()`. The adapter injects only `composerTool`, so the
  created browser inherits the generic model-selection default.
- The shared Chat path already defines `modelStrategy=current` as a strict
  no-model-menu action.

## Scope

- Add one provider-free adapter regression that models stale
  `desiredModel=Instant` / `modelStrategy=select` input.
- Override only submitted developer-app test browsers to
  `modelStrategy=current` while preserving the exact app composer tool.
- Run the focused developer-app and current-model suites, then typecheck,
  touched lint, build, CodeGraph readback, planning audits, and diff hygiene.
- Record the operator-facing semantic: `apps test --submit` preserves the
  active Chat model.

## Non-Goals

- Running another LitScout connector canary or reopening Plan 0412 history.
- Selecting a model, effort level, composer mode, or another app.
- Installing AuraCall, restarting services, launching or closing a browser,
  cleaning the retained extra tab, or changing scheduler/completion state in
  the provider-free slice.
- Changing generic browser defaults or Chat/Work selector semantics.

## Acceptance Criteria

- [x] A deterministic adapter regression fails on the current omission and
  proves the submitted test browser receives `modelStrategy=current`.
- [x] The exact app name remains the submitted browser's `composerTool`.
- [x] The prompt input, single submission semantics, and timeout remain
  unchanged.
- [x] Focused and adjacent provider-free tests, typecheck, lint, build,
  CodeGraph, planning audits, and diff hygiene pass.
- [ ] Source is committed and pushed before any installed-runtime change.

## Provider-Free Checkpoint

- Red proof: the focused test received `desiredModel=Instant` and
  `modelStrategy=select` from the adapter-created browser and failed its
  `modelStrategy=current` assertion.
- Green proof: `tests/browser/chatgptDeveloperApps.test.ts` passes 16/16; the
  adjacent browser/config/CLI/schema selection set passes 176/176.
- `pnpm run typecheck`, touched-file `biome check`, and `pnpm run build` pass.
- CodeGraph is current at 17,150 nodes / 67,168 edges and maps `submitTest()`
  directly to `runPrompt()` with two production CLI callers.
- Goal-only planning audit passes. Active-plan audit has only its seven
  accepted historical baseline findings after canonical Plan 0282 wiring.
- No install, service restart, browser action, prompt submission, connector
  call, LitScout mutation, cleanup, or scheduler/completion effect occurred.

## Effect Boundary

This source slice may edit repository source, tests, and docs only. It may not
install, restart, attach, launch, submit a provider prompt, call a connector,
mutate LitScout, clean browser state, or alter scheduler/completion controls.

## Definition Of Done

The plan closes provider-free when the submitted developer-app test path
provably preserves the current model at the real adapter seam and all source
gates pass. Installation and a new LitScout P3 subject require a distinct
pushed activation boundary after this repair is accepted.
