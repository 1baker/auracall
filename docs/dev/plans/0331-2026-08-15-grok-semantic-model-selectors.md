# Grok Semantic Model Selector Execution | 0331-2026-08-15

State: OPEN
Lane: P01
Plan version: 2

## Goal

Make AuraCall's Grok semantic model selectors execution-ready by resolving
stable intent into the provider's current picker labels and refusing to submit
when exact selection cannot be proved.

## Current State

- Agent discovery publishes `grok:auto`, `grok:instant`, and `grok:thinking`,
  but marks all three `executionReady=false`.
- Configured browser execution currently forwards a semantic selector nowhere;
  only a raw agent model reaches Grok's `desiredModel` control.
- The Grok adapter already recognizes current picker labels `Auto`, `Fast`, and
  `Expert` through the bundled service registry, but a missing menu or option is
  logged and ignored, allowing prompt submission on an unverified model.
- Gemini selectors remain a separate provider slice because its current native
  adapter does not yet carry model-selection inputs.

## Scope

- Add a Grok semantic-selector resolver with explicit provider-prefix
  detection and stable mappings from `auto`, `instant`, and `thinking` intent.
- Resolve configured Grok agents through that provider-specific mapping before
  browser execution while preserving raw `model` as the explicit override.
- Mark only the proven Grok selector family execution-ready in discovery.
- Make Grok model selection fail closed when the menu cannot open or the exact
  current picker option cannot be found.
- Add provider-free resolver, configured-executor, picker, discovery, and
  validation coverage plus aligned user/developer documentation.

## Non-Goals

- Do not enable or implement Gemini semantic selectors.
- Do not add Grok picker modes beyond the existing public semantic family,
  change provider rate limits, or perform a live provider prompt.
- Do not change raw-model escape-hatch behavior or ChatGPT selector semantics.
- Do not mutate installed runtime state, browser profiles, credentials, or
  provider accounts.

## Acceptance Criteria

- [x] `grok:auto`, `grok:instant`, and `grok:thinking` resolve deterministically
      to the adapter-owned current picker labels `Auto`, `Fast`, and `Expert`.
- [x] Configured Grok agents pass the resolved label as `desiredModel`, preserve
      the semantic selector in durable result metadata, and reject unsupported
      `grok:` tokens before browser execution.
- [x] Grok picker execution throws before prompt submission when its menu or
      exact option cannot be proved, with bounded available-option diagnostics.
- [x] `/v1/models` and config-choice discovery mark the three Grok selectors
      execution-ready while Gemini selectors remain explicitly deferred.
- [x] Focused selector/runtime/HTTP tests, typecheck, zero-warning lint, build,
      full provider-disabled suite, plan audit, CodeGraph sync, and diff hygiene
      pass.
- [ ] Current-SHA cross-platform CI passes the existing Ubuntu, macOS, and
      Windows matrix without provider traffic.

## Definition Of Done

The plan closes when all three public Grok semantic selectors resolve through
the configured browser path, exact picker selection fails closed, discovery
advertises only the proven readiness, and current-SHA CI passes.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; resolver, executor, picker, and discovery contracts
  share one narrow execution path, and repo policy does not authorize subagent
  delegation for this turn
- expected_write_surface: model-selector config, configured executor, Grok
  picker action/tests, discovery tests, user/testing docs, roadmap/runbook/
  journal/fix documentation
- max_work_unit_attempts: 2 per failing contract before splitting
- max_review_rework_cycles: 1
- terminal_condition: current-SHA cross-platform CI passes or exact provider-
  free evidence disproves safe selector resolution and the plan is reframed
  without advertising execution readiness

## Execution Notes

- `resolveGrokSemanticModelSelector()` now maps `auto`, `instant`/`fast`, and
  `thinking`/`expert` to `Auto`, `Fast`, and `Expert`; configured execution
  rejects an unsupported `grok:` token before invoking browser mode. A raw
  agent `model` remains the higher-priority compatibility override.
- `selectGrokMode()` now throws when its picker cannot open or no exact current
  option matches. The missing-option error carries only the bounded normalized
  labels already observed in the menu.
- The focused selector/executor/picker/discovery packet passes 30 selected
  provider-free tests. Typecheck and strict zero-warning lint pass across 849
  files; production build and the 332-plan audit pass.
- The first complete run passed 2,985 tests and exposed one unrelated
  materialization-backlog fixture mismatch in the large HTTP suite. The exact
  test passed twice in isolation without source changes; the bounded second
  complete run passed 330 files and 2,986 tests with 19 files and 55 intended
  live/host-specific tests skipped.
- Managed-browser process and listening-port inventories were unchanged before
  and after the broad run; no provider request or AuraCall-managed browser
  launch occurred. CodeGraph synced eight changed files and is current at 924
  files, 17,678 nodes, and 69,250 edges.
- Current-SHA cross-platform CI remains the sole closing gate.
