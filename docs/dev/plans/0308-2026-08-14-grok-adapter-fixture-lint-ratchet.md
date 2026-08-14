# Grok Adapter Fixture Lint Ratchet | 0308-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove all 31 warnings from the provider-free Grok adapter suite by preserving
exact external names through computed keys and centralizing required media-
materializer narrowing.

## Current State

- The complete provider-free suite has zero Biome diagnostics or suppressions.
- Exact external and sentinel names use computed keys.
- Required active-media calls share one labeled guard bound to the adapter.
- Warning-strict test lint covers 18 complete suites plus the shared helper.

## Scope

- Define exact-name constants for external/mock boundaries.
- Use computed keys in Chrome, global-DOM, and partial-client fixtures.
- Bind the required Grok materializer once through the shared labeled guard.
- Add the complete suite to strict-test lint and run broad validation.

## Non-Goals

- Do not rename provider, protocol, global, or internal sentinel contracts.
- Do not change Grok adapter production behavior.
- Do not run live browser or provider work.

## Execution Shape

- Critical path: one serialized fixture-refactor lane.
- Attempt bound: one implementation attempt plus one bounded type/test repair.

## Acceptance Criteria

- [x] `tests/browser/grokAdapter.test.ts` has zero Biome diagnostics.
- [x] The complete Grok adapter suite passes provider-free.
- [x] Typecheck, build, full lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when the suite joins strict-test lint and full repository lint
falls from 83 to 52 warnings without suppression.

## Execution Evidence

- Twenty-four exact Chrome, DOM, CDP, and focus-sentinel members now use
  computed keys without contract renaming.
- Seven materializer calls use one shared, labeled fixture guard whose result
  is bound to the originating adapter.
- All 41 suite tests, typecheck, production build, strict gates, full lint at
  52 warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all Grok adapter fixture criteria accepted
- progress_classification: hardening
- evidence: zero-diagnostic suite plus 41-test provider-free matrix
- material_blockers: none
- next_action_or_stop_reason: publish the Grok adapter strict-test ratchet
