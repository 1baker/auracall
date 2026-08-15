# Durable Response-Batch Cancellation | 0334-2026-08-15

State: OPEN
Lane: P01
Plan version: 1

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
  per-child `cancelled`, `not-active`, `not-found`, or `not-owned` evidence,
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

- [ ] Batch cancellation cancels every queued child and every active child
      owned by the local host through existing durable run cancellation.
- [ ] Completed and failed children remain unchanged; already-cancelled
      children make repeat cancellation idempotent.
- [ ] Foreign-owned active leases remain running and return `not-owned`
      evidence instead of being force-cancelled.
- [ ] The cancellation result reports per-child outcomes, aggregate outcome
      counts, whether the request fully settled the batch, and authoritative
      post-control batch status.
- [ ] HTTP cancellation returns `404` for an unknown batch, rejects invalid
      bodies before mutation, and enforces stored batch scopes before any
      child cancellation.
- [ ] MCP exposes the same service result without inventing separate
      cancellation semantics.
- [ ] Route manifest, specialized skill contracts, user docs, and focused
      service/HTTP/MCP tests agree on the new control.
- [ ] Typecheck, zero-warning lint, build, plan audit, CodeGraph sync, diff
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
