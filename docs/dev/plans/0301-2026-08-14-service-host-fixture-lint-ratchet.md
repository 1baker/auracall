# Service-Host Fixture Lint Ratchet | 0301-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Extend the warning-strict test ratchet to service-host integration fixtures by
replacing compile-only array assertions with explicit labeled presence checks.

## Current State

- `tests/runtime.serviceHost.test.ts` has zero Biome warnings and errors.
- Required first-step and local-action fixtures fail explicitly when missing.
- The strict-test lint command covers both HTTP and service-host integration
  suites.

## Scope

- Replace all 13 non-null assertions in the service-host integration suite.
- Reuse one generic labeled fixture guard within the file.
- Add the cleaned suite to the warning-strict test ratchet.
- Update planning and durable fix records.

## Non-Goals

- Do not use empty-object fallbacks for required fixtures.
- Do not suppress warnings or weaken lint rules.
- Do not alter runtime service-host behavior.

## Acceptance Criteria

- [x] `pnpm lint:tests:strict` reports zero diagnostics across both files.
- [x] The complete service-host integration suite passes.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free integration fixtures only.

## Definition Of Done

The plan closes when the service-host suite joins the strict ratchet and the
full repository lint total falls from 176 to 163 warnings without suppression.

## Execution Evidence

- Required step and local-action array entries now pass through
  `requireFixtureValue(...)` with run-specific labels before spreading.
- All 13 compile-only non-null assertions were removed from the suite.
- The strict-test lint command now covers two cleaned integration files.
- The complete service-host suite, typecheck, build, strict gates, full lint at
  163 warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all service-host fixture lint criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic strict lint plus complete service-host suite
- material_blockers: none
- next_action_or_stop_reason: publish the expanded strict test-file ratchet
