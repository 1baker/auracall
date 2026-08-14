# Session Display Diagnostics Fixture Ratchet | 0306-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove the final two warnings from the session-display coverage suite by typing
its registry-diagnostics mock and completing the required fixture shape.

## Scope

- Type the hoisted mock against `ReattachRegistryDiagnostics`.
- Add required expected-profile fields to the non-null fixture.
- Add the complete suite to warning-strict test lint.
- Run focused and broad provider-free validation.

## Acceptance Criteria

- [x] The complete session-display coverage suite is warning-clean.
- [x] All suite tests and broad repository gates pass.
- [x] Full lint falls from 107 to 105 warnings.

## Non-Goals

- Do not change session-display production behavior.
- Do not run browser or provider work.

## Execution Evidence

- The hoisted mock declares `Promise<ReattachRegistryDiagnostics | null>`.
- The non-null fixture supplies its required expected profile path and name.
- All eight suite tests, typecheck, build, strict gates, full lint at 105
  warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all session-display fixture criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic suite plus eight-test provider-free matrix
- material_blockers: none
- next_action_or_stop_reason: publish the session-display strict-test ratchet
