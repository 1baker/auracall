# API Status Dashboard Session Readiness | 0325-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make dashboard-session readiness visible and enforceable through the existing
CLI and MCP API-status surfaces so deployment automation can detect a locked
operator dashboard before browser access.

## Current State

- `/status.auth` reports the resolved non-secret authentication posture,
  including operator-key count and dashboard-session required/ready state.
- Startup and both dashboard login gates explain required-but-unready posture.
- `auracall api status` and MCP `api_status` consume `/status`, but discard its
  auth projection and cannot assert dashboard-session readiness.
- `config doctor` analyzes the static config model rather than the running
  server's resolved environment-backed auth policy, so it is not the correct
  authority for this deployment check.

## Scope

- Add a backward-compatible nullable auth projection to the shared API-status
  summary.
- Include the resolved auth/session readiness in human-readable CLI output and
  MCP structured/text output without exposing key identity or secret metadata.
- Add a reusable readiness assertion.
- Add `auracall api status --expect-dashboard-session-ready` as a strict
  deployment check that fails for false or unknown readiness.
- Add the equivalent optional boolean expectation to MCP `api_status`.
- Update focused regressions and current operator documentation.

## Non-Goals

- Do not add an endpoint, a second auth resolver, or a config field.
- Do not make static `config doctor` infer environment-backed runtime state.
- Do not expose API key ids, secrets, scope contents, or session tokens.
- Do not change auth, trusted-local, session, bind, ingress, or status
  observability semantics.
- Do not mutate active config, services, ingress, browsers, providers, or keys.

## Acceptance Criteria

- [x] Shared API-status summaries project the complete non-secret `/status.auth`
      readiness contract with nullable fallback for older/malformed servers.
- [x] Human CLI output states whether a dashboard session is required and
      ready, the unscoped operator-key count, and trusted-local resolution.
- [x] `--expect-dashboard-session-ready` succeeds only when readiness is
      explicitly true and fails with an actionable actual-state message for
      false or unknown values.
- [x] MCP `api_status` exposes the same structured readiness fields, includes a
      compact text summary, and supports an optional boolean expectation.
- [x] Existing API-status scheduler, completion, live-follow, JSON, and MCP
      contracts remain compatible.
- [x] Focused CLI/MCP/server/doc tests, provider-disabled tests, typecheck,
      zero-warning lint, build, plan audit, CodeGraph sync, and diff hygiene pass.

## Definition Of Done

The plan closes when operators and automation can inspect or strictly require
the running server's dashboard-session readiness through CLI and MCP without
duplicating auth policy or exposing credential metadata, and broad provider-free
validation passes.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; the CLI and MCP surfaces share one status projection
  and assertion contract
- expected_write_surface: API-status CLI helper/registration, MCP status tool,
  focused tests, and current operator/planning documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or the shared status
  projection remains backward-compatible with one exact blocker recorded

## Execution Evidence

- The shared API-status summary now projects the running `/status.auth`
  required/scheme/key/scoped/operator/trusted-local/session readiness fields,
  with nullable values for older or malformed payloads.
- Human CLI output and MCP text/structured output expose the same non-secret
  readiness. The CLI flag and MCP expectation reuse one assertion.
- A real CLI fixture smoke proved `--expect-dashboard-session-ready` exits 0
  for explicit true and exits 1 with the exact actual-state message for false.
- Four focused CLI/MCP/schema/parity files passed 24 tests. The isolated
  provider-disabled suite passed 2,952 tests with 65 expected skips across 348
  files.
- Typecheck, zero-warning lint across 846 files, production build, the 326-plan
  audit, current CodeGraph sync and 304-test affected analysis, command help,
  and diff hygiene passed.

## Closeout

Plan 0325 closes accepted. CLI and MCP automation can now inspect and strictly
require the running server's dashboard-session readiness without duplicating
auth resolution or exposing credential metadata. No active config, service,
ingress, browser, provider, or key state was changed.
