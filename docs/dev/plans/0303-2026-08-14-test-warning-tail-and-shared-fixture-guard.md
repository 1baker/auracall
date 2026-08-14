# Test Warning Tail And Shared Fixture Guard | 0303-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Clear the ten-warning tail across nine nearly-clean test files, centralize the
fixture guard introduced by earlier ratchet plans, and expand strict-test lint.

## Current State

- Nine additional test files have zero Biome diagnostics.
- One shared utility owns required fixture-value narrowing for eight suites.
- External module, CDP domain, and Windows export names remain exact through
  computed object keys rather than lint suppressions.
- The strict-test command covers 13 complete test files plus the shared helper.

## Scope

- Replace five required-value non-null assertions with labeled guards.
- Replace five naming diagnostics with computed external keys.
- Consolidate four duplicated fixture guards into `tests/util/fixtures.ts`.
- Expand warning-strict test lint and update planning records.

## Non-Goals

- Do not rename provider, module, CDP, or environment contracts.
- Do not suppress warnings or weaken lint rules.
- Do not run provider work or mutate installed runtime.

## Acceptance Criteria

- [x] `pnpm lint:tests:strict` reports zero diagnostics across 14 files.
- [x] Every affected complete test suite passes provider-free.
- [x] Typecheck, production build, full lint, plan audit, and diff hygiene pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free fixtures only.

## Definition Of Done

The plan closes when the ten-warning tail is removed, shared guard consumers
pass, and full repository lint falls from 155 to 145 warnings without
suppression.

## Execution Evidence

- Required request ids, request bodies, media candidates, and runtime steps now
  use the shared `requireFixtureValue(...)` helper.
- Required `BrowserAutomationClient`, `Runtime`, and Windows relay export names
  are expressed through computed keys with their exact external spellings.
- Four prior local guard implementations were replaced by the shared helper.
- All affected suites, typecheck, build, strict gates, full lint at 145
  warnings, plan audit, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all warning-tail and shared-helper criteria accepted
- progress_classification: maintenance
- evidence: zero-diagnostic 14-file ratchet plus affected suite matrix
- material_blockers: none
- next_action_or_stop_reason: publish the consolidated strict-test ratchet
