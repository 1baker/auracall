# Production Source Lint Zero Baseline | 0298-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make shipped `src/` code lint-clean and enforce that zero-warning boundary
before the repository's broader test and smoke-fixture warning report.

## Current State

- Production source has zero Biome warnings and errors.
- `pnpm lint` runs a warning-strict source gate before the existing full-repo
  lint report.
- Remaining warning debt is isolated to tests and smoke scripts.

## Scope

- Replace legacy prototype ownership calls with `Object.hasOwn(...)`.
- Give the prompt-composer test-hook export a convention-compliant name.
- Add a warning-strict production-source lint script to the normal lint gate.
- Update planning and durable fix records.

## Non-Goals

- Do not suppress warnings or weaken lint rules.
- Do not mechanically rewrite test fixtures or smoke scripts in this slice.
- Do not run browser/provider work or mutate installed runtime.

## Acceptance Criteria

- [x] `pnpm lint:src:strict` reports zero diagnostics.
- [x] API-key and prompt-composer behavior remains covered by focused tests.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free static and fixture validation only.

## Definition Of Done

The plan closes when the strict source gate passes, affected tests pass, and
the full repository lint total falls from 208 to 204 warnings without rule
suppression.

## Execution Evidence

- `Object.hasOwn(...)` now performs all three API-key env ownership checks.
- The prompt-composer test hooks use a convention-compliant internal export.
- `lint:src:strict` is part of `pnpm lint`, so future source warnings fail the
  normal repository gate.
- Focused tests, typecheck, production build, strict source lint, full lint at
  204 test/smoke warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all production-source lint criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic warning-strict source lint plus affected tests
- material_blockers: none
- next_action_or_stop_reason: publish the enforced production-source baseline
