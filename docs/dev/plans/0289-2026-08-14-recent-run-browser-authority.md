# Recent Run Browser Authority | 0289-2026-08-14

State: CLOSED
Lane: P01

## Stable Objective

Expose bounded persisted browser authority on recent runtime-run summaries so
the operator console can identify and filter compatibility-fallback runs before
selection without issuing per-row status requests or touching a browser.

## Current State

- Plan 0288 warns in the selected-run inspector after generic run status loads.
- `/v1/runtime-runs/recent` and MCP `runtime_runs_recent` summarize the same
  stored run records but omit browser authority.
- The Runs table therefore cannot signal or filter fallback runs until one is
  selected.

## Architecture Boundary

- Use one shared reducer for full response status and recent-run summaries.
- Preserve the existing backward scan and legacy broker-provenance inference.
- Add only the public authority/mode/time/source summary; do not expose broker
  routes, browser ids, profiles, sessions, or target handles.
- Keep recent-list and console reads persisted-only and provider/browser-free.

## Scope

- Extract the durable authority reducer from response-model projection.
- Add `browserAuthoritySummary` to recent-run HTTP and MCP output contracts.
- Add authority presentation/search data to runtime rows in `/console`.
- Add a Runs-table Authority column and filter for fallback, broker,
  explicit-off, and unreported states.
- Cover extraction, HTTP/MCP projection, filter semantics, and console build.

## Non-Goals

- Adding a new route or live health request.
- Changing browser routing or fallback behavior.
- Adding authority to live-follow rows that have no runtime-run record.
- Adding global fallback counts or alert persistence beyond current run data.

## Acceptance Criteria

- [x] Full response status and recent-run summaries use the same authority
  reducer and preserve legacy broker inference.
- [x] HTTP and MCP recent-run output expose the bounded summary without private
  broker provenance.
- [x] The Runs table displays authority and can filter fallback, broker,
  explicit-off, and unreported rows before selection.
- [x] Focused tests, typecheck, lint, production build, diff hygiene, and plan
  audit pass.
- [x] Installed recent-run HTTP readback and `/console` asset prove the feature
  without a browser/provider action.

## Definition Of Done

An operator can find every persisted fallback run in the recent Runs workbench
without selecting rows individually or initiating browser work.

## Installed Acceptance

- `GET /v1/runtime-runs/recent?limit=100` returned 71 persisted rows and
  projected response `resp_5ff8161469f64a61bf12107c2616ad15` with bounded
  `browserAuthority: agent-browser` from legacy provenance.
- `/console?view=runs` returned HTTP 200 and served
  `/console/assets/index-B3T9BMm5.js`; the installed bundle contains the
  Authority filter, Unreported/Explicit off options, table header, and Browser
  fallback metric.
- Source and installed hashes matched for the shared reducer, response model,
  recent-list projection, MCP tool, console HTML, JavaScript, and stylesheet.
- The API service is active/running with zero restarts. The acceptance used
  only persisted HTTP/UI assets and did not call a provider or browser.

Complete.
