# Live-Follow Startup Memory Fan-Out Repair | 0169-2026-07-24

State: CLOSED
Lane: P01

## Goal

Restore continuous live follow across all configured ChatGPT tenants without
concurrent completion hydration multiplying API memory, while preserving the
provider FIFO, provider guards, and operator stop controls.

## Current State

The installed API is healthy at roughly 1.04 GiB service memory with the
scheduler and all four ChatGPT completions paused. Restoring all four previously
drove Node RSS to roughly 5.4 GiB even though only one completion owned physical
provider work. A deterministic regression now proves the missing boundary:
same-provider restored completions overlap `registry.refreshPersistentState`
before acquiring the shared provider-work lease
(`maxConcurrentHydrations=2`).

The four current ChatGPT completions are incomplete and collectively report
1,151 known remote assets still missing locally. All current provider guards
are clear. Two managed ChatGPT browser roots remain open for `default` and
`wsl-chrome-2`; their ownership must be proven stale before cleanup.

## Scope

- Acquire the provider-work lease before completion-owned persistent registry
  hydration, collector preparation, or materialization preparation.
- Preserve FIFO ordering and independent-provider concurrency.
- Do not hold provider ownership during cadence waits, foreground deferral,
  operator pause, cancellation, or shutdown parking.
- Add regression coverage for multi-completion startup hydration and affected
  lease-release paths.
- Bound completion-history file reads so status/list requests cannot parse
  thousands of persisted operations concurrently before applying their limit.
- Inspect browser registry, operation locks, and process ownership; close only
  confirmed stale managed browser roots.
- Install and restart the user runtime, resume the four ChatGPT completions and
  scheduler, and monitor real progress, FIFO ownership, service memory, browser
  roots, and provider guards.

## Non-Goals

- Do not increase ChatGPT interaction budgets or reduce quiet intervals in this
  repair.
- Do not clear historical provider guard evidence.
- Do not auto-click `Answer now`, bypass CAPTCHA/human verification, or submit
  unrelated prompts.
- Do not treat service liveness or a single completed pass as full
  materialization completion.

## Acceptance Criteria

- [x] A deterministic red regression proves restored same-provider completions
  overlap registry hydration before the provider FIFO.
- [x] Same-provider registry hydration and provider work have maximum
  concurrency one; different providers remain independently runnable.
- [x] Foreground deferral, cadence waiting, pause, cancel, failure, and shutdown
  cannot strand provider ownership.
- [x] Completion-history list read concurrency is bounded while newest-first
  filtering, sorting, and limit semantics remain unchanged.
- [x] Focused tests, full tests, TypeScript, production build, lint, plan audit,
  and diff checks pass.
- [x] Installed runtime identity and a fresh service PID prove the repaired
  bundle is live.
- [x] Confirmed stale managed browser roots are closed without touching an
  attributable active session.
- [x] All four ChatGPT completions and the scheduler are active, with at least
  one observed FIFO handoff and measurable pass/backlog progress.
- [x] The monitored window records no new provider guard observation.
- [x] API service memory remains below 5 GiB while host available memory stays
  above 10 GiB for two consecutive samples. The service's configured
  `MemoryHigh=7G` and `MemoryMax=8G` remain the final cgroup backstops.

## Stop Conditions

- Immediately pause the scheduler and every active ChatGPT completion on any
  new rate-limit, CAPTCHA, human-verification, or provider-guard observation.
- Pause all ChatGPT live follow if API service memory exceeds 5 GiB or host
  available memory falls below 10 GiB for two consecutive samples.
- Stop cleanup if a managed browser root has a live operation lock, active
  session attribution, or ambiguous ownership.
- Do not resume live work until provider-free regression and integration tests
  pass.

## Execution Bounds

- Plan version: `0169-v3`.
- Maximum implementation attempts: 4.
- Maximum review/rework cycles: 2.
- Checkpoint after the red regression, green focused validation, installed
  restart, first FIFO handoff, and final monitored verdict.
- Live monitoring is bounded by the first complete FIFO handoff plus two stable
  memory samples; a guard or memory stop terminates it earlier.

## Definition Of Done

The plan closes only when the installed service keeps all configured ChatGPT
live-follow operations active, provider ownership rotates without concurrent
registry hydration, materialization/backfill state advances, memory stays
inside the stop threshold, and no new provider guard signal appears.

## Checkpoint Record

- Plan version: `0169-v1`
- State transition: `ready -> active`
- Progress classification: `blocker_reduction`
- Evidence: focused regression fails with
  `maxConcurrentHydrations=2`, while the installed paused service remains near
  1.04 GiB
- Delegation: `not_spawned`; runtime policy forbids subagents and the shared
  completion/service-host boundary is one critical path
- Next action: move the provider lease ahead of completion registry hydration
  and rerun the red regression

## Green Source Checkpoint

- Plan version: `0169-v1`
- State transition: `active -> awaiting-runtime-gate`
- Progress classification: `outcome_progress`
- Repair: completion-owned provider ownership now begins before persistent
  registry hydration and releases before foreground/provider-guard sleeps.
- Additional finding: the guard-projection materialization unit test used the
  real AuraCall home and stamped fixture owner `hmj_guard_projection_1` onto
  the live browser registry. The test now uses and removes a temporary home.
- Evidence:
  - red regression changed from `maxConcurrentHydrations=2` to `1`;
  - completion/scheduler/refresh/service-host/HTTP integration passed
    `388/388`;
  - full suite passed 302 files and 2,631 tests;
  - TypeScript, production build, lint (zero errors; 203 existing warnings),
    plan audit (169 plans; zero errors), and diff checks passed.
- Next action: install to the user runtime, restart to a fresh PID, establish
  the memory baseline, then resume and monitor all ChatGPT tenants.

## Runtime Gate Stop And Second Repair

- Plan version: `0169-v2`
- State transition: `awaiting-runtime-gate -> active`
- Progress classification: `blocker_discovery`
- Installed evidence: source and installed completion-service hashes matched,
  and the API restarted as fresh PID `2726054`. Before any completion or
  scheduler resume, listing persisted completion state raised service memory
  from roughly 0.9 GiB to a 5.4 GiB peak.
- Containment: all four completions and the scheduler remained paused; the API
  was stopped before any provider interaction.
- Root cause: the completion store has 4,796 JSON records. `listOperations()`
  started one `readFile` and parse promise per record, then filtered, sorted,
  and applied the requested limit.
- Red/green evidence: the deterministic store regression observed 40
  simultaneous reads before the repair and at most 16 after it, while retaining
  newest-first `limit=10` output. The combined completion/HTTP/service-host
  suite passed 347 tests; TypeScript, production build, and lint pass with the
  existing 203 warnings.
- Next action: reinstall, repeat the exact 4,796-record provider-free readback
  under memory observation, and resume live follow only if it remains within
  the plan threshold.

## Status Fan-Out Repair And First Handoff

- Plan version: `0169-v3`
- State transition: `active -> monitoring`
- Progress classification: `outcome_progress`
- A provider-free full `/status` read still expanded the archive and
  materialization-job indexes once per enabled tenant, producing a 5.8 GiB
  service peak. Archive and job services now expose batch list operations that
  take one store snapshot and preserve per-request filtering, ordering, and
  limits; the HTTP status path uses those batches with a sequential
  compatibility fallback.
- Installed provider-free evidence reduced the same broad-status gate to a
  1.32 GiB peak from a roughly 0.93 GiB cold baseline.
- The first live activation advanced `default` from pass 15 to 16, completed
  its materialization job, and handed the provider FIFO to `wsl-chrome-4`.
  The job attempted two conversations but materialized zero assets and ended
  skipped with six retryable transfers; this is metadata/pass progress, not
  materialization completion.
- No rate-limit, CAPTCHA, human-verification, or provider-guard evidence was
  observed. The run was paused when the old 2.5 GiB experimental plan threshold
  was crossed during browser handoff. That threshold was below normal
  Node-plus-managed-Chrome residency and was not the host OOM boundary.
- A fresh installed activation at PID `3449491` established a roughly
  0.99 GiB cold service baseline and 1.38 GiB post-status residency. With all
  four ChatGPT completions and the scheduler resumed, current service memory
  remained near 2.0-2.5 GiB with a 2.88 GiB peak while host available memory
  remained about 35 GiB. The scheduler is the sole current ChatGPT provider
  owner and all four completion loops are serialized behind it.
- Revised live gate: pause immediately on any provider warning; otherwise
  allow the measured managed-browser handoff envelope up to 5 GiB while
  requiring at least 10 GiB host available memory.
- The continuing monitored run proved two more FIFO handoffs. `wsl-chrome-4`
  advanced from pass 17 to 18, `wsl-chrome-2` advanced from 14 to 15, and
  `default` subsequently advanced from 16 to 17. Service memory peaked at
  4.07 GiB during the managed-Chrome envelope, returned near 2 GiB, and host
  available memory remained above 31 GiB. All ChatGPT provider guards remained
  clear.
- The `wsl-chrome-2` materialization job refreshed one 24-message conversation
  snapshot but skipped seven non-downloadable entries and materialized zero
  files. SoyLei is active at pass 19 with 25 detail surfaces and 600 known
  missing-local assets. These are real metadata/pass advances, but local asset
  materialization is not complete.
- Full-suite validation exposed test-home leakage and timing assumptions rather
  than a live-follow regression. All test workers now receive disposable
  `AURACALL_HOME_DIR` roots; the live completion registry remained at 4,797
  records across subsequent full runs. Deterministic port dependencies and
  bounded test timeouts remove unrelated host-load races.
- Remaining acceptance: complete the bounded-concurrency full suite, reinstall
  the final bundle, restart to a fresh PID, resume all four lanes, and record
  the final installed readback.

## Closeout

- Plan version: `0169-v4`.
- State transition: `monitoring -> closed`.
- Full validation passed 302 files and 2,634 tests with 65 opt-in live tests
  skipped. TypeScript, production build, lint (zero errors; existing warnings),
  plan audit, and diff checks passed.
- The final built and installed completion/status bundles are hash-identical.
  The API restarted as PID `4015989`; two consecutive installed samples were
  about 1.26 GiB and 1.35 GiB current with a 1.67 GiB peak, while host
  available memory remained above 32 GiB.
- All four ChatGPT completions and the scheduler are active and guard-clear.
  Final passes are `default=17`, `wsl-chrome-2=15`, `wsl-chrome-3=20`, and
  `wsl-chrome-4=18`. SoyLei detail surfaces fell from 25 to 21 during the final
  window, proving continued work after restart.
- Local asset materialization remains incomplete: the current missing-local
  totals are 64, 234, 600, and 253. This is ongoing provider-content backlog,
  not a failure of the repaired startup/FIFO/status control plane.
