# Plan 0292 | Roadmap Active-State Audit

State: CLOSED
Lane: P01
Plan version: 1
Date: 2026-08-14

## Stable Objective

Prevent the roadmap from labeling a linked canonical plan `Active` after that
plan has reached a terminal state.

## Current State

- Plans 0172, 0277, and 0278 were `CLOSED` while roadmap bullets still began
  with `Active`; the labels were repaired in commit `ab0b5792`.
- The plan-library audit still reported zero errors before that manual repair
  because it validates plan headers and references but not the semantics of an
  `Active` roadmap label.

## Scope

- Parse only roadmap bullets beginning with `Active` that link a canonical
  `docs/dev/plans/*.md` artifact.
- Require those linked plans to be `OPEN` or `PLANNED`.
- Add focused parser/error tests and wire the check into the existing plan
  audit.

## Non-Goals

- Interpreting arbitrary roadmap prose or every possible status adjective.
- Reclassifying genuinely open Plans 0114 or 0281.
- Rewriting historical roadmap sections.
- Browser, provider, runtime-install, or service work.

## Bounds

- maximum implementation attempts: 2
- one focused test file plus the audit integration
- no new command or audit mode

## Acceptance Criteria

- [x] An `Active` bullet linked to a `CLOSED` or `CANCELLED` plan produces a
  deterministic validation error naming the roadmap and plan path.
- [x] `Active` links to `OPEN` or `PLANNED` plans remain valid.
- [x] Active prose without a canonical plan link is ignored.
- [x] Focused tests, typecheck, lint, plan audit, and diff hygiene pass.

## Execution Receipt C01

- state_transition: ready -> active
- acceptance_state: stale labels repaired manually; recurrence guard absent
- progress_classification: blocker_reduction
- evidence: the current audit returned zero errors while three linked CLOSED
  plans still had Active roadmap labels.
- material_blockers: none
- next_action_or_stop_reason: add the narrow parser and audit integration.

## Execution Receipt C02

- state_transition: active -> complete
- acceptance_state: all acceptance criteria verified
- progress_classification: verified_completion
- implementation: a separately testable roadmap parser finds canonical plan
  links only inside top-level Active bullets; the existing audit compares those
  targets with canonical plan states and reports terminal mismatches.
- verification: two focused parser/error tests, typecheck, scoped lint, full
  lint at the unchanged warning baseline, plan audit with 293 candidates and
  zero errors, and diff hygiene passed.
- material_blockers: none
- next_action_or_stop_reason: stop; the observed label drift now has a
  deterministic recurrence guard.
