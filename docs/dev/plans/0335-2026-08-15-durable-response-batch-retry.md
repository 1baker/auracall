# Durable Response-Batch Retry | 0335-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Add a first-class response-batch retry control that creates fresh durable
responses from failed or cancelled children while proving lineage,
idempotency, and crash-safe partial recovery.

## Current State

- Response batches retain durable child response ids plus routing, dispatch,
  and limit metadata.
- Each stored direct response run retains the complete normalized request,
  including prompt input, instructions, tools, attachments, and AuraCall
  routing.
- Batch cancellation is durable and idempotent, but retry is still caller-
  orchestrated and can accidentally duplicate provider execution.
- The existing response creation path always generates a fresh random id and
  does not yet expose a guarded source-response clone operation.

## Scope

- Retry only source children whose authoritative response status is `failed`
  or `cancelled`; never replay queued, running, completed, or missing work.
- Require an idempotency key and derive deterministic retry batch and child
  response ids from the source batch, key, and source child identity.
- Persist an atomic first-writer retry-batch record before creating children.
  The record carries hashed-key/request-fingerprint lineage and deterministic
  source-to-target mappings so an interrupted call can resume missing children
  without duplicating existing ones.
- Clone the complete request from each stored source response into its fresh
  target id. Add explicit source batch, source response, retry batch, hashed
  key, and request-fingerprint metadata without mutating the source run.
- Reject reuse of one idempotency key with a different selected-child request
  before child creation.
- Allow an optional explicit `responseIds` subset; otherwise retry every
  failed or cancelled source child. Validate the entire selection and all
  stored authorization scopes before the first mutation.
- Add `POST /v1/response-batches/{batch_id}/retry` and MCP
  `response_batch_retry` with one shared service receipt.
- Update route discovery, specialized skill contracts, user docs, roadmap,
  runbook, journal, fixes guidance, and focused tests.

## Non-Goals

- Do not reuse or reset a source response id, mutate source terminal state, or
  click a provider-owned Retry affordance.
- Do not retry completed, queued, running, finalizing, stranded, recoverable,
  foreign-leased, or missing children.
- Do not silently change dispatch-pool assignment, agent, team, service,
  runtime profile, model, attachments, tools, instructions, or batch limits.
- Do not add automatic retry policy, retry schedules, retry-count ceilings,
  per-child priority, or scheduler ordering changes.
- Do not claim all-or-nothing provider execution. Partial child-creation
  failures remain explicit and resumable under the same idempotency key.

## Acceptance Criteria

- [x] A retry clones the complete stored source request into a fresh response
      id and preserves the terminal source run unchanged.
- [x] Only failed or cancelled children are eligible; every other source state
      is rejected before any retry record or child is created.
- [x] The retry batch and child ids are deterministic for one source batch and
      idempotency key, with explicit durable source-to-target lineage.
- [x] Atomic first-writer persistence rejects conflicting selection reuse and
      lets the same request resume only missing children after partial failure.
- [x] Repeating a completed retry request returns/reuses the same durable batch
      and response ids without duplicate execution.
- [x] HTTP validates the strict request body, returns `404` for an unknown
      source batch, returns `409` for no eligible or conflicting requests, and
      authorizes all selected stored scopes before mutation.
- [x] MCP exposes the same retry receipt and error semantics without a second
      retry implementation.
- [x] Route manifest, specialized skill contracts, user docs, and focused
      response-service/batch-service/HTTP/MCP tests agree on the control.
- [x] Typecheck, zero-warning lint, build, plan audit, CodeGraph sync, diff
      hygiene, complete provider-disabled tests, and exact-SHA
      Ubuntu/macOS/Windows CI pass.

## Definition Of Done

The plan closes when an authorized caller can safely retry failed or cancelled
batch children exactly once per idempotency key, resume interrupted child
creation without duplication, and inspect durable lineage from every fresh
response back to its source.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; response cloning, atomic batch persistence,
  idempotency, HTTP authorization, and MCP schemas share one coupled contract,
  and delegation is not authorized for this turn
- expected_write_surface: response and batch services, HTTP route/handler,
  MCP response-batch tool, focused tests, endpoint/workflow/testing docs,
  route/skill contracts, Plan 0335, roadmap, runbook, journal, and fixes log
- max_work_unit_attempts: 2 per failing contract before split or reframe
- max_review_rework_cycles: 1
- terminal_condition: deterministic fresh-id retry and resumable idempotency
  pass all local and exact-SHA cross-platform gates, or a durable-store
  invariant disproves the design and the blocker is recorded

## Execution Notes

- The response service reconstructs the complete normalized request from the
  authoritative failed or cancelled run and creates a deterministic fresh id.
  Existing deterministic targets are reused only when their durable lineage
  matches the requested source, retry batch, key hash, and fingerprint.
- The batch service writes the complete retry plan with atomic first-writer
  semantics before creating children. A simulated interruption between child
  creations proves that repeating the same request reuses the completed child
  and creates only the missing target; concurrent persistence proves both
  callers observe one winning record.
- HTTP and MCP share the same receipt. HTTP validates strict input, authorizes
  only the selected stored scopes, returns `202` for accepted work and `409`
  for contract rejection. Status exposes batch-level lineage and each job
  carries its source mapping.
- Four focused runtime/HTTP/MCP/route suites pass 252 tests. Typecheck,
  zero-warning lint over 851 files, production build, 336-plan audit with zero
  validation errors, CodeGraph sync, diff hygiene, and the complete
  provider-disabled suite pass. The suite reports 331 files / 3,015 tests
  passed with 19 files / 55 intentional live skips.
- Exact-SHA acceptance run
  [31913863421](https://github.com/1baker/auracall/actions/runs/31913863421)
  passed at `e8f6be8a6f10e3346d374b04bb516d3fc6f42d54`. Ubuntu 22/Node 22,
  Ubuntu 24/Node 24, macOS/Node 22, and serialized Windows/Node 22 all
  passed frozen install, runtime checking, zero-warning lint, maintained PTY
  coverage, the complete provider-disabled suite, and readiness smoke; Ubuntu
  22 also passed the production build. Plan 0335 closes accepted.
