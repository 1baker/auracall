# Durable Response-Batch Priority | 0336-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Add enforceable, starvation-bounded response-batch priority that is durable,
observable, authorization-aware, and owned by the existing service-host
scheduler rather than by metadata-only client convention.

## Current State

- The service host orders actionable runs by execution class and then oldest
  `createdAt`; capped drains have no caller-controlled priority input.
- Response batches durably retain child identity, limits, dispatch, retry
  lineage, and request metadata, but no closed-world priority contract.
- Batch concurrency, browser-rate, and tenant gates run before lease
  acquisition and must remain authoritative regardless of priority.
- Targeted one-run drains and already leased work do not participate in queue
  ordering and must not be preempted.

## Scope

- Add a closed `low | normal | high | urgent` batch priority vocabulary with
  `normal` as the compatibility default for new and legacy records.
- Persist requested priority on the batch and every child request; expose both
  requested and current effective priority in batch status.
- Add one general service-host execution-priority resolver seam. Within one
  actionable execution class, sort higher effective priority first and retain
  oldest-first FIFO for ties. Preserve the existing runnable-before-recovery
  class policy and reserved recovery capacity.
- Age every queued candidate upward by one tier per 15 minutes, capped at
  `urgent`, so recurring high-priority work cannot starve older normal, low,
  or non-batch work indefinitely.
- Keep priority subordinate to execution, tenant, concurrency, rate, lease,
  runner-affinity, and recovery gates. Priority changes selection order only;
  it never preempts active work or grants execution authority.
- Require unscoped operator authority for HTTP `high` and `urgent` batch
  creation. Scoped callers may create `low` and `normal` batches. Local MCP is
  an operator surface and exposes the complete vocabulary.
- Make retry batches inherit the source batch priority without a retry-time
  escalation field.
- Update status/MCP schemas, endpoint discovery docs, API workflow guidance,
  testing guidance, roadmap, runbook, journal, and durable fixes guidance.

## Non-Goals

- Do not add per-child priority, mutable reprioritization, cancellation,
  preemption, or interruption of active provider/browser work.
- Do not let priority reorder runnable work behind stranded recovery across
  execution classes or remove the existing reserved recovery slot.
- Do not accept arbitrary numeric weights, provider-native priority, cron
  scheduling, deadlines, or automatic retry policy.
- Do not weaken API-key scopes, runner affinity, tenant budgets, batch limits,
  lease ownership, or fail-closed browser/provider controls.

## Acceptance Criteria

- [x] Batch create persists one closed-world priority, defaults legacy/new
      omission to `normal`, and copies it into every child run.
- [x] Untargeted capped drains execute higher effective priority before lower
      priority within the same actionable class, with FIFO ordering for ties.
- [x] Fifteen-minute tier aging is recomputed from durable creation time and
      eventually raises old low/normal/non-batch work to `urgent` without
      mutating stored requested priority.
- [x] Priority never bypasses execution gates, active leases, runner affinity,
      concurrency/rate/tenant limits, or the existing recovery-slot policy.
- [x] HTTP rejects scoped `high` or `urgent` creation before batch/child
      persistence, while scoped `low`/`normal`, unscoped operator calls, and
      local MCP use the shared batch service contract.
- [x] Retry batches inherit source priority and expose fresh effective-priority
      aging without accepting escalation in the retry body.
- [x] HTTP, MCP, route/status discovery, specialized skills, user docs, and
      focused batch/service-host tests agree on priority semantics.
- [x] Typecheck, zero-warning lint, build, plan audit, CodeGraph sync, diff
      hygiene, complete provider-disabled tests, and exact-SHA
      Ubuntu/macOS/Windows CI pass.

## Definition Of Done

The plan closes when batch priority changes actual durable scheduler selection,
ages without starvation, remains subordinate to every safety/ownership gate,
and is observable and authorized consistently across HTTP and MCP.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; host ordering, batch metadata, authorization, and
  public schemas form one coupled scheduler contract, and delegation is not
  authorized for this turn
- expected_write_surface: response batch service, service host, HTTP host
  composition/authorization, MCP schema, focused tests, endpoint/workflow/
  testing docs, Plan 0336, roadmap, runbook, journal, and fixes log
- max_work_unit_attempts: 2 per failing contract before split or reframe
- max_review_rework_cycles: 1
- terminal_condition: durable priority and aging pass complete local and
  exact-SHA cross-platform gates, or scheduler invariants disprove this design
  and the blocker is recorded

## Execution Notes

- Batch creation now stores requested priority on the durable batch and every
  child request. Status reports requested/effective tiers, age boost, and the
  fixed 15-minute interval; legacy and non-batch work safely default to
  `normal`.
- The service host resolves priority during candidate inspection, after the
  actionable execution class is known and before capped selection. Higher
  effective tiers run first within a class, FIFO breaks ties, and the existing
  runnable/recovery policy plus reserved recovery capacity remain unchanged.
- HTTP denies scoped `high`/`urgent` requests before catalog or persistence
  work while allowing scoped `low`/`normal` and unscoped operators. MCP exposes
  the complete local-operator vocabulary, and retry inherits source priority.
- Four focused host/batch/HTTP/MCP suites pass 322 tests. Typecheck,
  zero-warning lint over 851 files, production build, 337-plan audit with zero
  validation errors, bundled-skill validation, CodeGraph sync, diff hygiene,
  and the complete provider-disabled suite pass. The suite reports 328 files /
  2,977 tests passed with 22 files / 96 intentional live skips.
- Exact-SHA acceptance run
  [31915204142](https://github.com/1baker/auracall/actions/runs/31915204142)
  passed at `cb557d23a9a9aae02384d877c8bafe4e85061586`. Ubuntu 22/Node 22,
  Ubuntu 24/Node 24, macOS/Node 22, and serialized Windows/Node 22 all
  passed frozen install, runtime checking, zero-warning lint, maintained PTY
  coverage, the complete provider-disabled suite, and readiness smoke; Ubuntu
  22 also passed the production build. Plan 0336 closes accepted.
