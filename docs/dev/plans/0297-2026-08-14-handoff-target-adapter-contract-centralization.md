# Handoff Target Adapter Contract Centralization | 0297-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make CLI, HTTP validation and discovery, and the operator console derive handoff
target-adapter identifiers from one closed-world contract.

## Current State

- One source module owns the ordered adapter identifiers, type, default, and
  runtime type guard.
- Backend validation, route discovery, CLI help/defaults, and console option
  values derive from that contract while presentation labels remain UI-owned.

## Scope

- Centralize adapter identifiers and their default.
- Replace duplicated identifier unions and lists in executable surfaces.
- Add direct contract and cross-surface regression tests.
- Update planning and durable fix records.

## Non-Goals

- Do not centralize UI display labels in backend code.
- Do not change adapter behavior or run browser/provider work.
- Do not mutate installed runtime or configuration.

## Acceptance Criteria

- [x] Executable adapter surfaces derive identifiers from one source contract.
- [x] Tests prove the exact closed world, default, type guard, and console parity.
- [x] Focused tests, typecheck, build, lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free static and fixture validation only.

## Definition Of Done

The plan closes when shared-contract tests and all broad repository gates pass
without browser, provider, service, config, or installed-runtime mutation.

## Execution Evidence

- `src/handoff/targetAdapterContract.ts` owns the adapter tuple, inferred type,
  packet default, and runtime type guard.
- CLI help/defaults, HTTP schema/discovery/defaults, and console option values
  consume the shared contract.
- Focused tests, typecheck, production build, full lint at the accepted warning
  baseline, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all shared-contract criteria accepted
- progress_classification: hardening
- evidence: provider-free exact contract and cross-surface assertions
- material_blockers: none
- next_action_or_stop_reason: publish the drift-resistant adapter contract
