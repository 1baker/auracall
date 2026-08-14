# Runtime-Core Fixture Lint Ratchet | 0302-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Extend the warning-strict test ratchet across the runtime runner and response
service by replacing compile-only fixture assertions with explicit guards.

## Current State

- Runtime runner and response-service test files have zero Biome diagnostics.
- Required first-step and persisted-run fixtures fail with run-specific labels.
- The strict-test command covers four runtime/HTTP integration suites.

## Scope

- Replace four runner first-step assertions.
- Replace four repeated assertions following one nullable persisted-run read.
- Add both cleaned suites to the warning-strict test ratchet.
- Update planning and durable fix records.

## Non-Goals

- Do not use optional chaining for required runtime fixtures.
- Do not suppress warnings or weaken lint rules.
- Do not alter runtime execution or response behavior.

## Acceptance Criteria

- [x] `pnpm lint:tests:strict` reports zero diagnostics across four files.
- [x] Complete runner and response-service suites pass.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free runtime fixtures only.

## Definition Of Done

The plan closes when both runtime-core suites join the strict ratchet and full
repository lint falls from 163 to 155 warnings without suppression.

## Execution Evidence

- Four required runner first-step entries now use labeled fixture guards.
- The nullable cancelled-response run is narrowed once before revision and
  bundle mutation, removing four repeated assertions.
- The strict-test command now covers four cleaned integration files.
- Both complete suites, typecheck, build, strict gates, full lint at 155
  warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all runtime-core fixture lint criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic strict lint plus complete runtime-core suites
- material_blockers: none
- next_action_or_stop_reason: publish the expanded runtime-core test ratchet
