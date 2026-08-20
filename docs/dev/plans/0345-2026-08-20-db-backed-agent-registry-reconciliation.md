# DB-Backed Agent Registry Reconciliation | 0345-2026-08-20

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Audit Plan 0065's registry, catalog, execution, authorization, diagnostics, and
snapshot criteria against current source and provider-free tests, then close
the umbrella only if every original acceptance criterion is complete.

## Current State

- Registry-default API/MCP mutations, revision metadata, effective catalog
  reads, execution resolution, scoped authorization, secret-free diagnostics,
  and selected/all snapshots are implemented.
- Plan 0065 still says snapshot export/import remains, immediately after
  recording CLI, MCP, HTTP, and dashboard snapshot support as implemented.
- Its migration checklist also retains old `config doctor` wording even though
  registry conflict/key health moved to the dedicated agent-diagnostics
  contract and registry payload schemas are enforced at storage boundaries.

## Scope

- Map every original Plan 0065 criterion to current source and tests.
- Reconcile Plan 0065, the roadmap, curated plan index, testing quickstart,
  runbook, journal, and durable lessons.
- Preserve separately scoped revision browsing/rollback, migration advice, and
  full dashboard editing as future enhancements.

## Non-Goals

- Do not change registry, config, runtime, auth, HTTP, MCP, CLI, or dashboard
  behavior unless verification exposes a real acceptance gap.
- Do not migrate existing user config or inspect/mutate live user registry
  state.
- Do not add public revision routes, rollback, or full dashboard CRUD.
- Do not reprioritize other open plans or authorize live provider work.

## Acceptance Criteria

- [x] Registry-default creation avoids config-file collection rewrites.
- [x] Config and registry agents share deterministic discovery and execution.
- [x] Revision/source metadata and config-wins conflicts are retained.
- [x] Registry-backed agent/team authorization works with scoped keys.
- [x] Secret-free diagnostics expose conflicts, disabled records, config issues,
      and missing scoped targets across operator surfaces.
- [x] Selected/all snapshot export and import work through CLI, MCP, and HTTP.
- [x] Plan 0065 leaves the curated active-plan index and closes without hiding
      separately scoped enhancements.
- [x] Focused tests, typecheck, governance/link checks, plan audit, portable-
      path scan, diff hygiene, and CodeGraph sync/status pass.

## Definition Of Done

Plan 0065 and this reconciliation close when current executable evidence proves
every registry acceptance criterion, stale remaining-work prose is removed,
and unselected enhancements remain explicit without changing runtime behavior.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; one documentation-only authority audit
- expected_write_surface: Plans 0065/0345, roadmap, plan index, testing,
  runbook, journal, and fixes log
- validation: focused registry/catalog/auth/diagnostics/snapshot tests,
  typecheck, governance/link tests, plan audit, portable-path scan, diff
  hygiene, and CodeGraph status
- terminal_condition: both plans close with every criterion proved, or Plan
  0065 stays open with the exact missing behavior recorded

## Execution Notes

- CodeGraph plus direct source reads map the SQLite/JSON store, effective
  catalog, config service, execution provider, authorization, diagnostics, and
  snapshot paths. No acceptance gap was found.
- Nine core/interface files pass 68 tests; four filtered HTTP assertions prove
  merged discovery, scoped authorization, diagnostics, and snapshots.
- The old config-doctor checklist is satisfied by the dedicated diagnostics
  surface for conflict visibility and schema-validating store boundaries;
  config-to-registry migration advice remains a separately scoped enhancement.
- Typecheck, governance/link tests, the 346-plan audit, portable-path scan,
  diff hygiene, and CodeGraph sync/status pass.
- Plans 0065 and 0345 close accepted without runtime behavior changes.
