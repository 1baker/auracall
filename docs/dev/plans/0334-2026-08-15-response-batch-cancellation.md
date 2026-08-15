# Durable Response-Batch Cancellation | 0334-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Add a first-class, durable response-batch cancellation control that reuses the
existing child-run cancellation authority without replaying prompts, stealing
foreign leases, or hiding partial outcomes.

## Current State

- Response batches durably record child response ids and aggregate their
  current statuses.
- The execution service host already cancels queued runs and active runs owned
  by its configured local runner, records durable cancellation events, and
  fails closed for active leases owned by another runner.
- Operators can cancel one runtime run through the generic status-control
  surface, but HTTP and MCP batch clients must currently enumerate children and
  orchestrate those calls themselves.
- Retry and per-child priority are still absent and have materially different
  duplicate-execution and scheduler-order semantics.

## Scope

- Expose response cancellation through the existing execution responses
  service so batch orchestration can use the same host authority.
- Add a batch service operation that attempts each child exactly once, returns
  per-child `cancelled`, `not-active`, `not-found`, `not-owned`, or unexpected
  `error` evidence,
  and includes authoritative post-control batch status.
- Add `POST /v1/response-batches/{batch_id}/cancel` with optional `note`.
- Authorize batch cancellation against the stored team, agent, service, and
  runtime-profile selections before mutating any child.
- Add MCP `response_batch_cancel` parity.
- Keep cancellation idempotent: already-cancelled children remain cancelled,
  while completed or failed children remain terminal and are not rewritten.
- Update route discovery, endpoint/workflow/testing docs, roadmap, runbook,
  journal, and fixes guidance.

## Non-Goals

- Do not add batch or child retry; retry requires a new durable response id and
  explicit duplicate-execution policy.
- Do not add per-child priority or change service-host scheduler ordering.
- Do not steal, expire, or force-release a lease owned by another runner.
- Do not cancel provider work outside the existing run-cancellation boundary,
  delete response or batch records, or claim remote provider-side abort when
  only local durable execution was cancelled.
- Do not change batch creation, dispatch-pool assignment, concurrency limits,
  or existing readback shapes.

## Acceptance Criteria

- [x] Batch cancellation cancels every queued child and every active child
      owned by the local host through existing durable run cancellation.
- [x] Completed and failed children remain unchanged; already-cancelled
      children make repeat cancellation idempotent.
- [x] Foreign-owned active leases remain running and return `not-owned`
      evidence instead of being force-cancelled.
- [x] The cancellation result reports per-child outcomes, aggregate outcome
      counts, whether the request fully settled the batch, and authoritative
      post-control batch status.
- [x] HTTP cancellation returns `404` for an unknown batch, rejects invalid
      bodies before mutation, and enforces stored batch scopes before any
      child cancellation.
- [x] MCP exposes the same service result without inventing separate
      cancellation semantics.
- [x] Route manifest, specialized skill contracts, user docs, and focused
      service/HTTP/MCP tests agree on the new control.
- [x] Typecheck, zero-warning lint, build, plan audit, CodeGraph sync, diff
      hygiene, complete provider-disabled tests, and exact-SHA
      Ubuntu/macOS/Windows CI pass.

## Definition Of Done

The plan closes when an authorized HTTP or local MCP caller can request one
batch cancellation, inspect every child outcome, and rely on stored child runs
as the durable authority without prompt replay, foreign-lease takeover, or
ambiguous partial success.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; response cancellation, batch aggregation, HTTP auth,
  and MCP schemas share one coupled control contract, and delegation is not
  authorized for this turn
- expected_write_surface: response and batch services, HTTP route/handler,
  MCP response-batch tool, focused tests, endpoint/workflow/testing docs,
  route/skill contracts, Plan 0334, roadmap, runbook, journal, and fixes log
- max_work_unit_attempts: 2 per failing contract before split or reframe
- max_review_rework_cycles: 1
- terminal_condition: durable idempotent cancellation and partial-outcome
  evidence pass all local and exact-SHA cross-platform gates, or the existing
  ownership model disproves safe batch composition and the blocker is recorded

## Execution Notes

- The response service now exposes the service host's existing durable cancel
  result. The batch service attempts every recorded child once, captures
  unexpected per-child errors, and recomputes authoritative status afterward.
- HTTP validates its strict optional-note body and authorizes all stored child
  team, agent, service, and runtime-profile selections before the first
  cancellation. MCP projects the same service result and marks partial
  settlement as an error result requiring attention.
- Five focused service, HTTP, MCP, route-manifest, and specialized-skill suites
  pass 247 tests. Typecheck, zero-warning lint, production build, 335-plan
  audit, diff hygiene, and CodeGraph sync pass. The complete provider-disabled
  suite passes 331 files / 3,010 tests with 19 files / 55 intended live skips;
  exact-SHA CI also passes.
- Exact-SHA acceptance run
  [31912516695](https://github.com/1baker/auracall/actions/runs/31912516695)
  passed at `a2eb9307dbbdbf00400e6e26f95d391666987571`. Ubuntu 22/Node 22,
  Ubuntu 24/Node 24, macOS/Node 22, and serialized Windows/Node 22 all
  passed frozen install, runtime checking, zero-warning lint, maintained PTY
  coverage, the complete provider-disabled suite, and readiness smoke; Ubuntu
  22 also passed the production build. Plan 0334 closes accepted.
