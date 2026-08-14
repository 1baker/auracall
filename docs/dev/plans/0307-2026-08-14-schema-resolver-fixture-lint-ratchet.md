# Schema Resolver Fixture Lint Ratchet | 0307-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove all 22 warnings from the provider-free schema resolver suite by making
the exported loaded-input contract accurately partial, checking config literals
against it, and preserving the resolved-model projection boundary without `any`.

## Current State

- Loaded config exposes the accurate partial `UserConfigInput` contract.
- Twenty-one resolver fixtures are checked against that exported type.
- The resolved-model projection uses a plain object copy without assertion.
- Warning-strict test lint covers 17 complete suites plus the shared helper.

## Scope

- Export the partial `UserConfigInput` type used by `LoadConfigResult.config`.
- Check every affected config literal with `satisfies UserConfigInput`.
- Project the resolved result through a plain object copy.
- Add the complete suite to warning-strict test lint.
- Update planning records and validate provider-free behavior.

## Non-Goals

- Do not change resolver or config-model production behavior.
- Do not weaken schema or lint rules.
- Do not run browser or provider work.

## Execution Shape

- Critical path: one serialized implementation and validation lane.
- Attempt bound: one implementation attempt plus one bounded type-remediation
  pass if the exported contract exposes a real fixture mismatch.

## Acceptance Criteria

- [x] `tests/schema/resolver.test.ts` has zero Biome diagnostics.
- [x] The complete resolver suite passes provider-free.
- [x] Typecheck, build, full lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when the complete suite joins strict-test lint and full
repository lint falls from 105 to 83 warnings without suppression.

## Execution Evidence

- `LoadConfigResult.config` now uses exported `UserConfigInput`, matching the
  loader's partial-file contract while leaving resolved config strict.
- All 21 affected input literals use `satisfies UserConfigInput`; the model
  projection receives `{ ...result }` at its record boundary.
- All 25 resolver tests, 11 config-loader tests, typecheck, production build,
  strict gates, full lint at 83 warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all schema resolver fixture criteria accepted
- progress_classification: outcome_progress
- evidence: zero-diagnostic resolver suite plus 36 provider-free tests
- material_blockers: none
- next_action_or_stop_reason: publish the schema resolver strict-test ratchet
