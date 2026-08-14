# Operational Scripts Lint Zero Baseline | 0299-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make operational `scripts/` lint-clean and enforce that zero-warning boundary
alongside the production-source gate.

## Current State

- Operational scripts have zero Biome warnings and errors.
- Fixture sequences fail explicitly when empty instead of relying on non-null
  assertions.
- Required uppercase environment-variable names remain exact through computed
  object keys.
- `pnpm lint` runs warning-strict source and scripts gates before the remaining
  test-fixture warning report.

## Scope

- Remove five non-null assertions from the archive-materialization smoke.
- Remove two naming diagnostics without changing environment-variable names.
- Add a warning-strict operational-scripts lint script to the normal gate.
- Update planning and durable fix records.

## Non-Goals

- Do not suppress warnings or weaken lint rules.
- Do not alter installed runtime or execute provider work.
- Do not rewrite test-fixture warning debt in this slice.

## Acceptance Criteria

- [x] `pnpm lint:scripts:strict` reports zero diagnostics.
- [x] The archive-materialization smoke passes provider-free.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free local smoke and static validation only.

## Definition Of Done

The plan closes when the strict scripts gate passes, the changed smoke passes,
and the full repository lint total falls from 204 to 197 warnings without rule
suppression.

## Execution Evidence

- Fixed job ids are a readonly tuple, so indexed fixture jobs are total.
- Reusable fixture sequences now throw a labeled error when created without a
  usable value rather than asserting an index exists.
- The asset-readback smoke uses computed keys for the exact required
  `AURACALL_DISABLE_KEYTAR` environment name.
- `lint:scripts:strict` is part of `pnpm lint`; the provider-free smoke,
  typecheck, build, strict gates, full lint at 197 test warnings, plan audit,
  and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all operational-scripts lint criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic strict scripts lint plus local smoke execution
- material_blockers: none
- next_action_or_stop_reason: publish the enforced operational-scripts baseline
