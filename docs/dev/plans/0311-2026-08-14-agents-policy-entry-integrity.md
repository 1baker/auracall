# AGENTS Policy Entry Integrity | 0311-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Repair the repository policy-loading contract by removing nonexistent policy
references from `AGENTS.md` and making the deterministic plan audit reject any
future reference to an absent policy module.

## Current State

- `docs/dev/policies/` contains canonical modules `0001` through `0027`.
- `AGENTS.md` references exactly those 27 existing modules.
- `plans:audit` rejects any referenced policy path absent from the canonical
  directory.

## Scope

- Remove the 25 nonexistent duplicate-generation references.
- Add a small parser for canonical `docs/dev/policies/*.md` references.
- Integrate missing-policy validation into `plans:audit`.
- Add focused regression tests and update governing history.

## Non-Goals

- Do not rewrite or renumber the 27 existing policy modules.
- Do not change runtime, browser, provider, or release behavior.
- Do not reconcile historical OPEN feature plans in this slice.

## Acceptance Criteria

- [x] Every policy path referenced by `AGENTS.md` exists.
- [x] A missing referenced policy deterministically fails the audit helper.
- [x] The repository plan audit passes with zero validation errors.
- [x] Focused tests, typecheck, zero-warning lint, and diff hygiene pass.

## Definition Of Done

The plan closes when `AGENTS.md` is an accurate policy-loading contract and the
existing deterministic audit prevents missing-policy reference drift.

## Execution Evidence

- Removed 25 nonexistent paths while preserving all 27 canonical references.
- Direct path parity reports 27 referenced, 27 existing, and zero missing.
- Four focused governance tests pass, including deterministic missing-policy
  reporting.
- Typecheck, zero-warning lint across 831 files, plan audit with zero errors,
  and diff hygiene pass.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all policy entry integrity criteria accepted
- progress_classification: outcome_progress
- evidence: exact path parity plus deterministic regression coverage
- material_blockers: none
- next_action_or_stop_reason: publish the governance repair
