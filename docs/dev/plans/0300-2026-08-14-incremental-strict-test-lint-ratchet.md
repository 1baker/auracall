# Incremental Strict Test Lint Ratchet | 0300-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Start an incremental warning-strict test lint boundary by making the largest
safe integration-test cluster warning-clean and ratcheting it into normal lint.

## Current State

- `tests/http.responsesServer.test.ts` has zero Biome warnings and errors.
- Nullable runtime-control fixture reads fail explicitly with labeled errors.
- `pnpm lint` runs a strict cleaned-test-file gate before reporting warning
  debt in test files that have not yet been migrated.

## Scope

- Replace all 21 non-null assertions in the HTTP integration suite.
- Centralize explicit fixture presence checks in one generic helper.
- Add the cleaned HTTP test file to an incremental warning-strict test gate.
- Update planning and durable fix records.

## Non-Goals

- Do not use optional chaining where fixture presence is required.
- Do not suppress warnings or weaken lint rules.
- Do not alter production or provider behavior.

## Acceptance Criteria

- [x] `pnpm lint:tests:strict` reports zero diagnostics.
- [x] The complete HTTP integration suite passes.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free integration fixtures only.

## Definition Of Done

The plan closes when the cleaned HTTP suite passes its strict lint ratchet and
the full repository lint total falls from 197 to 176 warnings without rule
suppression.

## Execution Evidence

- Five nullable run reads and one nested local-action request now pass through
  `requireFixtureValue(...)` before fixture mutation.
- All 21 compile-only non-null assertions were removed from the HTTP suite.
- `lint:tests:strict` is part of `pnpm lint`, providing an additive ratchet for
  later cleaned test files.
- The full HTTP suite, typecheck, build, strict gates, full lint at 176
  warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all incremental strict-test criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic strict HTTP test lint plus complete suite execution
- material_blockers: none
- next_action_or_stop_reason: publish the first strict test-file ratchet
