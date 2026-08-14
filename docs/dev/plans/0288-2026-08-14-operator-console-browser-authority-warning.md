# Operator Console Browser Authority Warning | 0288-2026-08-14

State: CLOSED
Lane: P01

## Stable Objective

Make the selected-run inspector in the AuraCall operator console visibly warn
when a browser-backed run entered the compatibility fallback path, while
showing the persisted authority and bridge mode for every recognized authority
state without performing live browser work.

## Current State

- Plan 0287 exposes bounded browser authority through generic run-status JSON.
- The `/console` Runs inspector already fetches that status for the selected
  response but only uses its output summary.
- Operators must currently open raw technical detail or use the CLI to notice a
  compatibility fallback.

## Architecture Boundary

- Derive presentation only from
  `metadata.runtimeDiagnosticsSummary.browserAuthoritySummary` on the existing
  run-status response.
- Do not add a route, probe agent-browser, inspect a provider, or infer fallback
  from missing data.
- Keep browser identifiers and broker provenance out of the presentation.

## Scope

- Add a small closed-world authority presentation helper for the three public
  authority values.
- Render a prominent warning in the selected-run inspector for
  `compatibility-fallback`.
- Render compact authority and bridge-mode details for all recognized values.
- Cover missing, malformed, broker, fallback, and explicit-off inputs with
  provider-free tests.
- Update operator documentation and durable execution records.

## Non-Goals

- Adding authority to the aggregate run table or recent-runs API.
- Changing browser routing or fallback behavior.
- Submitting a provider prompt or launching/attaching a browser.
- Adding a global alert count before per-run recent summaries carry authority.

## Acceptance Criteria

- [x] Selected fallback runs display a warning that names the compatibility
  path and explains that agent-browser authority was not established.
- [x] Broker and explicit-off runs display bounded, non-warning authority
  details; absent or malformed summaries display nothing.
- [x] Presentation tests, typecheck, lint, console build, diff hygiene, and plan
  audit pass.
- [x] Installed `/console` serves the rebuilt asset and existing broker-backed
  status readback remains provider/browser-free.

## Definition Of Done

An operator selecting a fallback run can recognize the degraded authority path
without opening raw JSON, while ordinary broker and explicit-off states remain
accurately visible without false alarms.

## Installed Acceptance

- `/console?view=runs` returned HTTP 200 and served
  `/console/assets/index-DD2wVONk.js`; the installed asset contains the fallback
  title, explanation, and browser-authority label.
- Source and installed SHA-256 hashes matched for console `index.html`, the
  hashed JavaScript bundle, and the hashed stylesheet.
- Existing response `resp_5ff8161469f64a61bf12107c2616ad15` still projected
  `browserAuthority: agent-browser` from persisted status while agent-browser
  had no ready browser in its current inventory. The read path did not require
  a provider or browser action.
- The API service is active/running with zero restarts after installation.

Complete.
