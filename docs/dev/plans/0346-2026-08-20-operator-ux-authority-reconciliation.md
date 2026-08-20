# Operator UX Authority Reconciliation | 0346-2026-08-20

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Separate Plan 0067's shipped legacy operator-shell evidence from its stale
product authority, preserve supported compatibility behavior, and give every
unfinished product outcome a greenfield owner.

## Current State

- Plan 0067 explicitly says `/dashboard` is no longer the product baseline and
  greenfield replacement starts at `/console`, but it remains `OPEN` and keeps
  prescribing new Search work in `ux/operator`.
- Plans 0077-0080 are closed for the first `/console` product milestones.
- `/console` has no Search workflow, while `/dashboard?nav=search` and
  `/v1/search` contain substantial reusable behavior and API evidence.
- The roadmap simultaneously freezes legacy pages and describes unfinished
  product Search work under the legacy Plan 0067 authority.

## Scope

- Audit the original shell, route, status, recovery, Search, and auth criteria
  against current source, builds, tests, and available smoke evidence.
- Cancel Plan 0067 as superseded without deleting shipped compatibility state.
- Open one bounded greenfield `/console` Search/archive successor.
- Align roadmap, curated index, testing guidance, runbook, journal, and fixes.

## Non-Goals

- Do not change frontend, API, auth, route, provider, or runtime behavior.
- Do not remove, redirect, or restyle `/dashboard` or `/ops/browser`.
- Do not copy legacy components into `ux/console` during authority cleanup.
- Do not claim fresh visual acceptance when a browser executable is unavailable.
- Do not implement semantic ranking or shared saved-view ownership.

## Acceptance Criteria

- [x] Shipped legacy `/dashboard` behavior remains documented and supported.
- [x] Plan 0067 no longer authorizes new product work on the frozen app.
- [x] Plan 0067 leaves the curated active index with a truthful terminal state.
- [x] Greenfield Search/archive scope has one actionable `/console` owner.
- [x] Roadmap product milestones distinguish legacy evidence from current
      product authority.
- [x] Operator build, focused route/search/session tests, typecheck,
      governance/link tests, plan audit, diff hygiene, and CodeGraph pass.
- [x] The failed current visual-smoke attempt and exact missing prerequisite
      are recorded rather than represented as a pass.

## Definition Of Done

Plan 0067 and this reconciliation terminate when `/console` is the only product
authority, legacy compatibility remains explicit, the missing Search milestone
has a bounded successor, and validation claims match the available evidence.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; one documentation-only authority reconciliation
- expected_write_surface: Plans 0067/0346/0347, roadmap, plan index, testing,
  runbook, journal, and fixes log
- validation: operator build, focused route/search/session tests, typecheck,
  governance/link tests, plan audit, portable-path scan, diff hygiene, and
  CodeGraph status
- terminal_condition: Plan 0067 is terminal and all product work has a current
  owner, or it stays open with the exact unresolved authority conflict

## Execution Notes

- CodeGraph and direct source reads proved the two-app split: `ux/operator`
  owns the legacy dashboard and Search precedent; `ux/console` owns the product
  Agents, inventory, overview, runs, and handoff workflows.
- `pnpm run ux:build` passes. Four focused files pass 14 assertions covering
  search projection, MCP parity, dashboard sessions, and HTTP routes.
- `pnpm run smoke:operator-search-ux` rebuilt successfully but could not find a
  Linux Chromium executable. A second bounded attempt with the detected Windows
  Chrome executable failed before launch with Puppeteer code 21; no render
  result is claimed.
- Typecheck, governance/link tests, the 348-plan audit, portable-path scan,
  diff hygiene, and CodeGraph sync/status pass.
