# Current Documentation Link Portability | 0312-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Replace machine-specific repository links in current documentation with
portable relative links and make the deterministic governance audit reject
future absolute-checkout Markdown links in current docs.

## Current State

- Eleven current docs now contain portable relative links in place of all 28
  references rooted at the retired checkout.
- Every normalized local target exists in the repository.
- Append-only journals, fixes history, notes, and plan history also preserve
  old paths as evidence and must not be rewritten by this slice.

## Scope

- Normalize the 28 current-doc links relative to their containing documents.
- Add a reusable absolute-checkout link detector.
- Audit current Markdown while excluding policies and historical ledgers,
  notes, and plans.
- Add focused regression coverage and governing evidence.

## Non-Goals

- Do not rewrite historical plans, notes, journals, or fixes-log evidence.
- Do not alter command examples whose absolute paths are part of historical
  acceptance receipts.
- Do not run browsers or providers.

## Acceptance Criteria

- [x] Current documentation has zero machine-specific repository links.
- [x] Historical evidence remains outside the steady-state audit scope.
- [x] A current-doc absolute checkout link deterministically fails validation.
- [x] Focused tests, typecheck, zero-warning lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when all current local documentation links are portable and the
governance audit prevents recurrence without rewriting historical evidence.

## Execution Evidence

- Converted 28 machine-specific links across 11 current docs.
- Independent target resolution checked 31 local links in those docs with zero
  missing targets.
- Six focused governance tests, typecheck, zero-warning lint across 833 files,
  plan audit with zero errors, and diff hygiene passed.
- Historical plans, notes, journal entries, and fixes evidence were excluded
  from normalization and steady-state enforcement.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all current-doc portability criteria accepted
- progress_classification: outcome_progress
- evidence: zero absolute current-doc links and zero missing normalized targets
- material_blockers: none
- next_action_or_stop_reason: publish the portable documentation baseline
