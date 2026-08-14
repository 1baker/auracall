# Full Suite Fixture Drift Repair | 0310-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Repair the two provider-free full-suite failures exposed after the zero-warning
baseline: browser login source-path fixture drift and media queue event-wait
flakiness.

## Current State

- Login resolution receives a real temporary bootstrap cookie database.
- The media release path pins WSL browser selection, proves blocker/request key
  parity, and synchronizes directly on its queued event.
- Focused and complete provider-disabled validation pass.

## Scope

- Give the login test a real temporary bootstrap cookie source.
- Synchronize the media release-path test directly on its queue event.
- Assert the test blocker and production media request use the same dispatcher
  key.
- Run focused and full provider-disabled validation.

## Non-Goals

- Do not execute browsers, providers, or live-test flags.
- Do not weaken bootstrap source validation or browser-operation locking.
- Do not change production runtime behavior unless focused evidence reveals a
  genuine product defect.

## Acceptance Criteria

- [x] Both previously failing tests pass repeatedly.
- [x] The focused browser login and media queue suites pass.
- [x] The provider-disabled full suite passes.
- [x] Typecheck, build, zero-warning lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when both fixture contracts are deterministic and the complete
provider-disabled suite is green without changing runtime behavior.

## Execution Evidence

- Three consecutive focused runs passed all eight login/media tests.
- The exact media blocker/request dispatcher keys match before execution.
- With all 27 discovered live flags unset and an isolated AuraCall home, 2,910
  tests passed across 318 files; 65 opt-in tests skipped across 21 files.
- Typecheck, production build, zero-warning lint across 829 files, plan audit,
  and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all fixture repair criteria accepted
- progress_classification: outcome_progress
- evidence: repeated focused proof plus green provider-disabled full suite
- material_blockers: none
- next_action_or_stop_reason: publish and continue repository cleanup audit
