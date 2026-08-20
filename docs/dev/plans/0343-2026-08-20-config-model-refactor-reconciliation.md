# Config Model Refactor Reconciliation | 0343-2026-08-20

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reconcile Plan 0007's maintenance-only current state with its stale future-
refactor sections, map every original acceptance criterion to executable
evidence, and close the umbrella only if no base-layer config gap remains.

## Current State

- Target `browserProfiles` and `runtimeProfiles` are schema-accepted and
  authoritative over bridge `browserFamilies` and `profiles`.
- Runtime, agent, and team selection compose through shared runtime/browser
  resolution; target, bridge, and legacy fallback order is explicit.
- Browser-owned precedence, service-owned precedence, conservative migration,
  compatibility output, and config diagnostics are implemented and tested.
- Plan 0007's detailed ledger already classified the lane as maintenance-only,
  but later sections still called shipped aliases and agent/team seams future.

## Scope

- Map the original browser/runtime/compatibility/identity/agent/team acceptance
  bar to current source and provider-free tests.
- Reconcile Plan 0007, the target-shape authority, roadmap, active-plan index,
  testing quickstart, runbook, journal, and durable lessons.
- Preserve supported bridge aliases and separately owned Plan 0008/0009 work.

## Non-Goals

- Do not change runtime, browser, migration, schema, CLI, or provider behavior.
- Do not remove compatibility keys or perform broad internal symbol renames.
- Do not close Plan 0008 or Plan 0009 without their own acceptance audits.
- Do not introduce typed agent defaults or broaden browser-family architecture.

## Acceptance Criteria

- [x] Browser and runtime profile selection are explicit and target-first.
- [x] Bridge and legacy configs retain deterministic load/migration behavior.
- [x] Browser-owned and service-owned precedence is explicit and tested.
- [x] Managed-profile/cache resolution follows the selected profile path.
- [x] Agent/team composition references runtime/browser layers without hidden
      browser ownership.
- [x] Diagnostics expose mixed shapes, compatibility residue, misplaced
      ownership, and invalid higher-layer references.
- [x] Stale future/placeholder language and retired absolute links are removed
      from the reconciled umbrella authority.
- [x] Focused tests, typecheck, governance/link checks, plan audit, diff
      hygiene, and CodeGraph sync/status pass.

## Definition Of Done

Plan 0007 and this reconciliation close when current source and tests prove the
complete base-layer contract and remaining Plan 0008/0009 work is explicitly
separate rather than hidden under the umbrella.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; this is one documentation-only authority audit
- expected_write_surface: Plans 0007/0343, target-shape doc, Plan 0008/0009
  references, roadmap, plan index, testing, runbook, journal, and fixes log
- validation: four focused provider-free test files, typecheck, governance and
  current-link tests, plan audit, portable-path scan, diff hygiene, CodeGraph
- terminal_condition: both plans close with every original criterion proved,
  or Plan 0007 stays open with the exact missing behavior recorded

## Execution Notes

- CodeGraph and source reads mapped schema acceptance, target-first and legacy
  selection, shared agent/team composition, migration, doctor, and selected
  browser-profile resolution. No base-layer behavior gap was found.
- Four focused files pass 98 tests: 39 config-model, 27 migration, 25 resolver,
  and 7 browser-profile assertions.
- Typecheck, governance/link tests, the 344-plan audit, portable-path scan,
  diff hygiene, and CodeGraph sync/status pass.
- Plan 0007 and Plan 0343 close accepted without runtime behavior changes.
