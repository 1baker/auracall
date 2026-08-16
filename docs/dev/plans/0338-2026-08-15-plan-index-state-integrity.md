# Plan Index State Integrity | 0338-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Make the informational active-plan index fail closed when a listed canonical
plan is missing, duplicated, or terminal, then reconcile every current index
mismatch.

## Current State

- `scripts/audit-plan-library.ts` rejects `ROADMAP.md` bullets labeled Active
  when their linked plan is `CLOSED` or `CANCELLED`.
- `docs/dev/plan-index.md` has a bounded `Current canonical active execution
  plan:` section, but the audit does not parse or validate it.
- That section currently contains five terminal plans: 0005, 0014, 0017, 0018,
  and 0063. The remaining twelve entries are `OPEN`.
- The index is explicitly informational and curated. It does not claim to list
  every `OPEN` or `PLANNED` plan in the 338-plan library.

## Scope

- Add a small reusable parser for canonical plan paths in the bounded active
  section of `docs/dev/plan-index.md`.
- Reject a missing section, malformed active-section bullets, duplicate paths,
  missing/unindexed plans, absent/unknown state, and terminal listed plans.
- Integrate the validator into `pnpm run plans:audit` using the same canonical
  plan-state map as roadmap validation.
- Remove all five currently terminal entries from the active section.
- Document the validation contract and focused test command.

## Non-Goals

- Do not require this curated informational index to enumerate every active
  plan in the repository.
- Do not reopen, rewrite, archive, or otherwise reclassify the five terminal
  plans.
- Do not change runtime, API, MCP, browser, scheduler, or provider behavior.
- Do not broaden this slice into a complete plan-library migration.

## Acceptance Criteria

- [x] The parser returns only canonical paths from the bounded active-plan
      section and ignores later audit/legacy sections.
- [x] Validation accepts `OPEN` and `PLANNED` entries and rejects terminal,
      missing, malformed, duplicate, or state-less entries deterministically.
- [x] `scripts/audit-plan-library.ts` applies the validator to the real plan
      index and shared canonical state map.
- [x] The five frozen terminal entries are absent while every retained indexed
      entry resolves to `OPEN` or `PLANNED`.
- [x] Testing and governance docs explain the enforced one-way contract without
      implying completeness.
- [x] Focused red/green tests, typecheck, zero-warning lint, plan audit, diff
      hygiene, and CodeGraph sync pass.

## Definition Of Done

The plan closes when the canonical audit would fail on any stale or invalid
entry in the plan index's active section, the current section contains no such
entry, and executable tests preserve the curated-not-complete boundary.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; parser contract, integration, and migration are one
  small serialized governance seam
- expected_write_surface: plan-index validator and tests, plan audit, plan
  index, testing/governance docs, roadmap, runbook, journal, fixes log, Plan 0338
- required_inputs: current plan-index text, canonical plan-state map, existing
  roadmap-state validator pattern, frozen five-entry mismatch set
- validation: focused validator/roadmap tests, typecheck, strict script/test
  lint, plan audit, diff hygiene, CodeGraph sync
- terminal_condition: all invalid indexed-active states fail deterministically
  and the real index is clean, or the parser cannot isolate the documented
  active section and the blocker is recorded

## Execution Notes

- The red test failed because `scripts/planIndexState.ts` did not exist. Four
  tests now cover bounded collection, `OPEN`/`PLANNED` acceptance, terminal/
  missing/state-less/unknown rejection, duplicate and malformed entries, and a
  missing section.
- `scripts/audit-plan-library.ts` reads the real plan index and passes the same
  canonical state map to both roadmap and plan-index validators.
- Plans 0005, 0014, 0017, 0018, and 0063 were removed from the curated active
  section. Every retained entry currently resolves to `OPEN`; completeness is
  deliberately not enforced.
- A controlled negative integration probe temporarily reintroduced closed Plan
  0005. The real audit exited 1 with exactly one terminal-plan error; restoring
  the row absent returned the audit to zero validation errors.
- Six focused tests, typecheck, zero-warning lint over four touched TypeScript
  files, the 339-plan audit, diff hygiene, and CodeGraph sync/status pass. Plan
  0338 closes accepted without runtime behavior changes.
