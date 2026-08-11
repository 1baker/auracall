# Native Chrome Launch Provider-Free Localization | 0257-2026-08-10

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_REPAIR_VALIDATED_WITH_TEST_BROWSER_ESCAPE
Goal execution state: PREPARED_AWAITING_APPROVAL

## Stable Goal Objective

Explain and repair the Plan 0256 native WSL Chrome launch stall without a
provider or live managed-browser run. Decompose the broad launch stage into
sanitized registry/profile scan, process-spawn, and debugger-readiness stages;
reproduce the pending seam deterministically; make cancellation settle every
owned launch task; validate provider-free; then prepare, but do not execute, a
fresh one-canary gate. Keep scheduler and materialization paused.

## Current Evidence

- The sole Plan 0256 canary timed out once with `attemptCount=0`,
  `lastStage=preflight:browserChromeLaunch`, and `pendingOperation=null`.
- The caller abort killed the owned Chrome process group and exact cleanup
  returned the managed browser profile plus port 45015 to zero.
- `chrome-launcher@1.2.1` normally polls debugger readiness 51 times at 500 ms,
  so a roughly 115-second pending launch is not explained by its nominal retry
  window alone.
- The current public stage covers all of `launchChrome`, including registry
  lookup, OS/profile inspection, stale-state cleanup, process spawn, and
  debugger readiness. It therefore does not yet identify the exact await.

## Authority And Effect Boundary

- Allowed: CodeGraph/source inspection, sanitized retained runtime readback,
  deterministic fakes, implementation, provider-free tests, docs, audit,
  commit, and push.
- Excluded: install, API restart, managed or user browser launch, provider
  callback, conversation read, model selection, prompt, materialization,
  completion or scheduler control, guard/config mutation, direct runtime-state
  edit, retry, and wider profile.

## Execution Packet

1. Record Plan 0256's terminal evidence and keep exact runtime posture frozen.
2. Add caller-owned launch substages without exposing paths, page content, or
   provider data.
3. Reproduce a pending pre-spawn or readiness await with deterministic fakes;
   require abort to join cleanup and the in-flight launch promise.
4. Apply the narrowest reusable browser-service repair supported by the red.
5. Run focused, adjacent, full provider-free, typecheck, build, lint, and plan
   audits. Re-read exact browser/job/scheduler status after validation.
6. Close this plan and prepare a separate one-canary gate only if the red,
   repair, and cleanup contract are green. Do not run that canary here.

## Acceptance Criteria

- [x] Sanitized stages distinguish registry/profile inspection, spawn, and
  debugger readiness.
- [x] A deterministic red identifies the matching unbounded debugger-probe
  seam.
- [x] Abort rejects with the caller reason only after cleanup and the owned
  launch task settle; no late launch can escape.
- [x] Focused and full provider-free validation pass.
- [x] Browser owners/jobs return to zero and scheduler remains paused/paused.
- [x] A fresh one-canary plan is prepared but not executed.

## Local Goal Bounds

- `max_browser_launches: 0`; `max_provider_callbacks: 0`;
  `max_context_reads: 0`; `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Opening Checkpoint | Native Launch Seam Is The Only Admitted Blocker

- `checkpoint_id`: `P0257-C01`.
- `state_transition`: P0256_CLOSED_STOPPED_NATIVE_CHROME_LAUNCH_TIMEOUT ->
  P0257_ACTIVE_PROVIDER_FREE_LOCALIZATION.
- `progress_classification`: blocker_reduction.
- `evidence`: one sanitized terminal receipt confines the failure before
  provider attempt 1; exact abort cleanup is green, while the broad public
  stage and library retry constants do not identify the pending await.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: instrument and reproduce the reusable native
  launch seam provider-free. Stop before any browser/provider/runtime effect.
- `authority_classification`: standing provider-free repair authority only.
- `review_disposition_summary`: another live attempt and speculation from the
  broad stage are rejected; the next proof must be deterministic and local.

## Definition Of Done

The exact pending launch seam has a deterministic red, a reusable repair, and
green provider-free cleanup/validation. A new one-canary packet is documented
but remains unexecuted, with scheduler and materialization still paused.

## Closure Checkpoint | Bounded Probe And Joined Launch Task Validated

- `checkpoint_id`: `P0257-C02`.
- `state_transition`: P0257_ACTIVE_PROVIDER_FREE_LOCALIZATION ->
  P0257_CLOSED_PROVIDER_FREE_REPAIR_VALIDATED_WITH_TEST_BROWSER_ESCAPE.
- `progress_classification`: blocker_reduction.
- `evidence`: deterministic reds showed that native launch still used
  `chrome-launcher`'s socket probe without a socket timeout, the abort race did
  not join its in-flight launch promise, and launch substages did not reach the
  caller observer. The repair uses AuraCall's one-second bounded port probe,
  races that probe against the caller abort, prevents a deferred launch after
  cancellation, joins cleanup plus launch settlement, and reports registry,
  process inspection, profile cleanup, port probe, spawn, and debugger
  readiness stages. Focused validation passes 34 tests, the broader browser
  surface passes 159, and the full suite passes 307 files/2797 tests with 65
  skipped. Typecheck, build, lint with 206 existing warnings, and the 257-plan
  audit pass.
- `validation_escape`: the full suite itself launched exact root PID 27679 on
  port 45015 at 22:10:51 despite the provider-free packet's zero-browser bound.
  Pre-suite admission proved no owner; agent-browser claimed no matching
  session/resource. Exact PID/port cleanup removed only that test-owned process
  group, and closing readback is zero-owner/unbound-port with active jobs zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0258 is prepared for one fresh installed
  zero-retry context canary. Stop before install, restart, or browser/provider
  execution pending approval of that exact packet.
- `authority_classification`: provider-free repair is complete. The accidental
  validation browser was cleaned, but it is recorded as a local-bound
  violation; no provider callback, conversation read, prompt, materialization,
  completion/scheduler control, guard change, or runtime-state edit occurred.
- `review_disposition_summary`: the matching unbounded mechanism is repaired,
  but the historical broad receipt cannot retrospectively prove whether its
  last await was the port probe or another launch substage. The new stage
  evidence makes the next single canary decisive without another blind retry.
