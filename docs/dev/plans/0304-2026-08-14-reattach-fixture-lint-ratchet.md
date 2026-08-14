# Reattach Fixture Lint Ratchet | 0304-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove all 14 remaining lint warnings from the browser reattach suite by typing
runtime fixtures and preserving exact DevTools domain names through computed
keys.

## Current State

- The complete reattach suite has zero Biome diagnostics.
- Recovery configs and dependencies use exported production contracts.
- Exact DevTools domains use computed keys without lint suppressions.
- Warning-strict test lint covers 14 complete suites plus the shared helper.

## Scope

- Type reattach configs, dependencies, clients, and helper returns against
  exported production contracts.
- Replace literal DevTools domain keys with computed exact-name keys.
- Add the complete suite to warning-strict test lint.
- Update planning records after validation.

## Non-Goals

- Do not change production reattach behavior.
- Do not run live browser or provider work.
- Do not suppress warnings or weaken lint rules.

## Acceptance Criteria

- [x] `tests/browser/reattach.test.ts` has zero Biome diagnostics.
- [x] The complete reattach suite passes provider-free.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free fixtures only.

## Definition Of Done

The plan closes when the reattach suite is warning-clean, joins the strict-test
ratchet, and full repository lint falls from 145 to 131 warnings without
suppression.

## Execution Evidence

- Ten explicit-any casts were replaced by typed configs, helper returns,
  runtime dependencies, or an explicit unknown-to-client test boundary.
- Session config is normalized through the production resolver before it is
  exposed as resolved config.
- Four reported and six previously suppressed DevTools domain members now use
  computed exact-name keys.
- All 17 suite tests, typecheck, production build, strict gates, full lint at
  131 warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all reattach fixture lint criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic reattach suite plus 17-test provider-free matrix
- material_blockers: none
- next_action_or_stop_reason: publish the strict reattach ratchet
