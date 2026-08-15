# Dashboard Session Readiness Smoke | 0326-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Turn dashboard-session readiness validation into a durable provider-free
end-to-end smoke that runs in CI across the real HTTP, CLI, and MCP surfaces.

## Current State

- `/status.auth`, CLI `api status`, and MCP `api_status` share the resolved
  non-secret readiness contract.
- A one-off fixture command proved the CLI strict flag's exit behavior, but the
  receipt is not reproducible from a repository-owned command.
- The existing `smoke:mcp-api-status` targets installed binaries and scheduler
  posture; it is not CI-safe source-runtime coverage for auth readiness.
- CI runs lint, tests, and the Ubuntu build, but no real-process readiness smoke.

## Scope

- Add one source-runtime `smoke:dashboard-session-readiness` command.
- Use an isolated temporary AuraCall home and ephemeral loopback ports.
- Start real API servers for externally routed ready and scoped-only key sets.
- Verify exact `/status.auth` readiness without exposing credential metadata.
- Run the actual CLI subprocess and prove normal JSON plus strict success/fail
  exit behavior.
- Run the actual MCP server over stdio and prove structured readiness plus
  strict expectation success/failure.
- Guarantee server, MCP, subprocess, and temporary-home cleanup on success or
  failure.
- Run the smoke in the GitHub Actions OS matrix and document the command.

## Non-Goals

- Do not use installed user-runtime binaries or active `~/.auracall` state.
- Do not bind publicly, configure ingress, restart services, or use real keys.
- Do not launch browsers, providers, or live tests.
- Do not change readiness semantics or add another endpoint.
- Do not fold scheduler-specific installed-runtime smoke behavior into this
  focused command.

## Acceptance Criteria

- [x] The ready case reports required/ready true and one unscoped operator key
      through HTTP, CLI JSON, and MCP structured/text output.
- [x] The scoped-only case reports required true, ready false, and zero
      operator keys through HTTP, CLI JSON, and MCP structured/text output.
- [x] CLI strict readiness exits 0 only for the ready case and nonzero with the
      exact mismatch for scoped-only.
- [x] MCP strict readiness succeeds only for the ready case and returns an
      error containing the exact mismatch for scoped-only.
- [x] The smoke uses only source-runtime entrypoints, loopback ephemeral ports,
      synthetic credentials, and an isolated temporary AuraCall home that is
      removed in `finally`.
- [x] `package.json` exposes `smoke:dashboard-session-readiness`, and CI runs it
      on Ubuntu, macOS, and Windows.
- [x] Focused smoke, contract tests, provider-disabled tests, typecheck,
      zero-warning lint, build, plan audit, CodeGraph sync, and diff hygiene pass.

## Definition Of Done

The plan closes when one repository-owned CI command proves the real HTTP,
CLI, and MCP readiness behavior for both usable and guaranteed-lockout
deployments without touching active state or providers.

## Execution Evidence

- `pnpm run smoke:dashboard-session-readiness` started real ready and
  scoped-only servers and returned `http=true cli=0 mcp=ok operatorKeys=1`,
  `http=false cli=1 mcp=error operatorKeys=0`, and `PASS`.
- Four focused files passed 24 tests, including the new case-model and
  non-secret projection contract tests.
- The isolated provider-disabled suite passed 2,954 tests with 65 expected
  skips across 349 test files.
- Typecheck, zero-warning lint across 848 files, production build, and the
  327-plan library audit with zero validation errors passed.
- CodeGraph synced to 924 files, 17,647 nodes, and 69,002 edges; affected
  analysis selected the new focused smoke test. Diff hygiene passed.
- The smoke owns synthetic credentials and its temporary AuraCall home and
  removes them in `finally`; no active config, service, ingress, browser,
  provider, or key state was touched.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; the smoke owns shared subprocesses, MCP transport, and
  cleanup sequencing
- expected_write_surface: one smoke script, package/CI wiring, focused tests,
  and current operator/planning documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or every spawned resource
  is cleaned with one exact blocker recorded
