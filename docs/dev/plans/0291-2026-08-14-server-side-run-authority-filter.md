# Plan 0291 | Server-Side Recent-Run Authority Filter

State: CLOSED
Lane: P01
Plan version: 1
Date: 2026-08-14

## Stable Objective

Make browser-authority discovery complete within a bounded recent-run request
by applying the authority predicate before the list limit, and expose the same
read-only filter through HTTP, MCP, and the Runs workbench.

## Current State

- Plan 0289 projects bounded browser authority on every returned recent-run
  row and filters the first 50 rows in the browser.
- Older matching fallback or unreported runs can be hidden when newer
  non-matching rows consume that client-side window.
- HTTP and MCP already share the runtime control list seam, which filters
  status and source before applying the limit.

## Architecture Boundary

- Add one closed-world authority predicate at the persisted runtime-store seam
  so status, source, authority, ordering, and limit compose deterministically.
- Reuse the existing shared durable authority reducer; do not inspect a live
  browser or duplicate authority inference.
- Preserve the console's local predicate as a defensive presentation guard
  while its selector requests the matching bounded server list.

## Scope

- Add `browserAuthority` filtering to runtime list contracts and storage.
- Accept the filter in `GET /v1/runtime-runs/recent` and MCP
  `runtime_runs_recent`.
- Refetch recent runtime rows when the Runs authority selector changes.
- Document and test pre-limit filtering, including `unreported`.

## Non-Goals

- Browser/provider work or routing changes.
- Filtering live-follow completion rows at the runtime-store seam.
- Pagination, global aggregation, or alert persistence.
- Modifying Plan 0290's broker discovery implementation.

## Bounds And Write Surface

- maximum implementation attempts: 2
- review/rework cycles: 1 closed-world pass if validation finds a regression
- expected code surface: runtime authority/store contracts, recent HTTP/MCP
  adapters, console request wiring, and focused tests
- expected documentation surface: this plan, roadmap, runbook, journal, fix
  log, README, endpoint/MCP/testing docs

## Acceptance Criteria

- [x] Authority filtering occurs before the requested limit and composes with
  existing source/status filters.
- [x] `agent-browser`, `compatibility-fallback`, `explicit-off`, and
  `unreported` have one shared closed-world filter contract.
- [x] HTTP and MCP reject invalid authority values and return only matching
  bounded rows without browser/provider work.
- [x] The Runs selector requests matching server rows and retains local
  defensive filtering for mixed completion rows.
- [x] Focused tests, typecheck, lint, production build, diff hygiene, and plan
  audit pass.

## Execution Receipt C01

- state_transition: ready -> active
- acceptance_state: server-side filtering not yet implemented
- progress_classification: outcome_progress
- evidence: Plan 0290 is committed and published; the runtime store currently
  applies status/source filters before sorting and limit, while the console
  applies authority only after fetching 50 rows.
- material_blockers: none
- next_action_or_stop_reason: implement the shared pre-limit predicate and
  adapters, then run provider-free validation.

## Execution Receipt C02

- state_transition: active -> complete
- acceptance_state: all acceptance criteria verified
- progress_classification: verified_completion
- implementation: the shared persisted authority reducer now supplies a
  store-level predicate before sort/limit; HTTP and MCP accept the same four
  filter values, and the Runs selector refetches the matching bounded list
  while retaining its local mixed-row guard.
- source_verification: 268/268 tests passed across runtime control, response
  status, HTTP, MCP, and console authority suites; typecheck and production
  build passed; full lint completed at the unchanged 208-warning baseline;
  plan audit reported 292 candidates and zero errors; diff hygiene passed.
- installed_verification: the authenticated installed endpoint returned only
  the existing `agent-browser` run for `browserAuthority=agent-browser`, an
  unknown filter returned HTTP 400, and the installed console bundle contains
  both `browserAuthority` and `runtime-runs/recent` request wiring. Source and
  installed hashes match for runtime store, HTTP server, and MCP tool; the API
  is active/running with zero restarts.
- effect_boundary: all acceptance used local persisted state and static assets;
  no browser or provider request ran.
- material_blockers: none
- next_action_or_stop_reason: stop this bounded slice; reassess the next
  operator-observability recommendation under the standing cleanup goal.
