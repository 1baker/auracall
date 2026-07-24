# Live-Follow Provider Fair Serialization | 0166-2026-07-23

State: CLOSED
Lane: P01

## Goal

Allow routine live follow across all configured ChatGPT tenants without two
completion loops issuing physical provider work at the same time.

## Current State

Plan 0165 proved that four independently configured ChatGPT tenants can use
distinct cache identities and that post-materialization quiet windows work.
Before this repair, the routine scheduler remained paused because each
unbounded completion owned an independent async loop, while browser-operation
dispatch keys were scoped to a managed browser profile. Different ChatGPT
profiles could therefore collect or materialize concurrently.

## Scope

- Add one fair FIFO provider-work coordinator to the completion service.
- Acquire one provider lease before collector or complete-ledger
  materialization work.
- Retain the lease across completion-owned materialization until the job
  reaches a terminal provider-work settlement.
- Release immediately after settlement or after a collector that queues no
  materialization; do not hold the lease during the following cadence window.
- Make pause, cancel, failure, and shutdown release or abandon queued ownership
  safely.
- Expose compact lifecycle evidence when a completion waits for and acquires
  provider serialization.
- Install, resume the routine scheduler, and prove rotation without concurrent
  ChatGPT provider work or a new guard observation.

## Non-Goals

- Do not serialize unrelated providers with each other.
- Do not replace managed-browser-profile dispatcher locking.
- Do not relax the existing per-target interaction or cadence limits.
- Do not clear historical provider guard evidence.

## Acceptance Criteria

- [x] A red regression starts two same-provider live-follow completions and
  proves the second can enter provider work before the first settles.
- [x] Same-provider work is FIFO and at most one completion owns the provider
  lease.
- [x] Different providers remain independently runnable.
- [x] Materialization retains ownership until terminal settlement, while the
  subsequent quiet window does not.
- [x] Pause/cancel/failure cannot strand provider ownership or a waiter.
- [x] Focused tests, TypeScript, production build, lint, plan audit, and diff
  checks pass.
- [x] Installed-runtime readback proves the scheduler can reconcile all four
  ChatGPT targets while physical provider work remains serialized.
- [x] A guarded live watch records no new ChatGPT rate-limit observation.

## Stop Conditions

- Pause the scheduler and all active ChatGPT completions on any new provider
  rate-limit observation.
- Do not enable the scheduler until provider-free concurrency tests pass.
- Do not treat service liveness alone as proof of fair rotation.

## Definition Of Done

The plan closes when the installed routine scheduler can keep all configured
ChatGPT completions active, provider work rotates one target at a time, and a
guarded live watch shows no overlap or new rate-limit signal.

## Outcome

- Provider-free verification passes `83/83` focused tests, TypeScript,
  production build, scoped Biome, full lint with 203 existing warnings, plan
  audit, and `git diff --check`.
- The installed API restarted as PID `3259141` with the shared coordinator
  injected into both scheduler and completion services.
- Scheduler resume at `2026-07-24T02:01:57.575Z` created one ChatGPT owner on
  `default`. Business, Consulting, SoyLei, and Personal completion loops were
  resumed and all four serialized behind that owner rather than opening
  provider work concurrently.
- The first live handoff completed without a new guard observation: the
  scheduler released, Business returned to its cadence wait, and Consulting
  became the only active managed ChatGPT browser while SoyLei and Personal
  remained FIFO waiters.
- The watch retained the historical SoyLei detections exactly as found and
  kept the other three detection lists empty. It did not clear guard evidence.
- Scheduler diagnostics still observed two same-route navigation/reload pairs
  during the initial pass. That remaining per-owner churn is a bounded
  follow-up; it does not invalidate provider-wide exclusion or justify more
  aggressive rate-limit settings.
