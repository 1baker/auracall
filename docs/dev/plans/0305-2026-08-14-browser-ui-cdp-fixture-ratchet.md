# Browser UI CDP Fixture Ratchet | 0305-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove the 24-warning browser-service UI test cluster and its nearby naming
suppressions by centralizing exact-name CDP client fixtures.

## Current State

- The complete suite has zero Biome diagnostics or suppressions.
- Three fixture constructors own all partial CDP client shapes.
- Exact `Page`, `Runtime`, and `Input` names remain visible through computed keys.
- Warning-strict test lint covers 15 complete suites plus the shared helper.

## Scope

- Add small Page/Runtime, Runtime/Input, and Input-only fixture constructors.
- Replace repeated CDP client literals and remove their suppressions.
- Add the complete suite to warning-strict test lint.
- Run the complete provider-free suite and broad repository gates.

## Non-Goals

- Do not change browser-service production behavior.
- Do not run live browser or provider work.
- Do not weaken lint rules.

## Acceptance Criteria

- [x] `tests/browser-service/ui.test.ts` has zero Biome diagnostics or suppressions.
- [x] The complete browser-service UI suite passes provider-free.
- [x] Typecheck, build, full lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when the suite joins strict-test lint and full repository lint
falls from 131 to 107 warnings without suppression.

## Execution Evidence

- Page/Runtime, Runtime/Input, and Input-only partial clients now share three
  computed-key fixture constructors.
- Twenty-four reported diagnostics and four nearby suppression comments were
  removed without renaming any CDP domain.
- All 58 suite tests, typecheck, production build, strict gates, full lint at
  107 warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all browser UI CDP fixture criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic suite plus 58-test provider-free matrix
- material_blockers: none
- next_action_or_stop_reason: publish the browser UI strict-test ratchet
