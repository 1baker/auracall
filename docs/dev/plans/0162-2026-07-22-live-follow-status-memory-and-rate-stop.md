# Live-Follow Status Memory And Immediate Rate Stop | 0162-2026-07-22

State: CLOSED
Lane: P01

## Goal

Make completion/materialization monitoring safe for continuous operation and
make a visible ChatGPT rate-limit warning terminate the active provider read
at the first adapter observation instead of allowing recovery or follow-on
browser work to continue.

## Current State

- Provider-free completion/materialization readbacks raised the installed
  AuraCall service from about 1.4 GiB to 3.3 GiB current memory with a 6.2 GiB
  peak after reboot.
- The completion list and detail routes serialize full persisted operations,
  including `lastRefresh` and lifecycle history, and refresh materialization
  state before returning monitoring data.
- One failed ChatGPT detail attempt spent 242.7 seconds inside one conversation
  context call while the persistent rate-limit warning was observed multiple
  times before the outer collector stopped.
- The durable scheduler is paused. Provider/browser work must remain disabled
  throughout implementation and installed readback.
- Delegation receipt: `not_spawned`; both repairs overlap the same dirty,
  safety-critical runtime and validation boundary, so parallel mutation would
  add reconciliation risk without an independent work lane.

## Scope

- Add an explicitly bounded summary projection for completion monitoring.
- Make CLI list/status monitoring request the bounded projection by default.
- Preserve an explicit full-detail read for diagnostics without making it the
  polling default.
- Stop ChatGPT account-mirror context work immediately when a rate-limit
  blocking surface appears during readiness/recovery.
- Ensure one provider call produces one propagated hard-stop outcome and
  closes its managed tab without recovery navigation, reload, or retry churn.
- Keep scheduler and provider execution paused during installation/readback.

## Non-Goals

- No live provider pass or deliberate reproduction of a rate-limit warning.
- No clearing of the persisted provider guard.
- No increase to provider interaction rates or materialization caps.
- No broad redesign of persisted completion receipts.

## Acceptance Criteria

- [x] CLI completion list/status responses are bounded independently of the
  size of `lastRefresh`, lifecycle history, or materialization job details.
- [x] Full detail remains available only through an explicit request mode.
- [x] Compact monitoring does not refresh or mutate materialization state.
- [x] A rate-limit surface discovered during a readiness wait aborts the
  adapter call before reload, reopen, retry, or subsequent extraction.
- [x] The hard-stop is propagated once and managed-tab cleanup still runs.
- [x] Focused regressions fail before the repair and pass after it.
- [x] TypeScript, production build, scoped formatting/lint, diff check, and
  plan audit pass.
- [x] Installed provider-free readback shows the scheduler paused, no managed
  browser/CDP listener, and bounded memory behavior across repeated compact
  monitoring reads.

## Definition Of Done

The plan closes when compact monitoring is the default CLI contract, explicit
full diagnostics remain available, the ChatGPT adapter stops at its first
rate-limit observation with cleanup, repository validation passes, and the
installed service remains paused and quiescent under repeated compact reads.

## Closeout Evidence

- HTTP, CLI, and MCP completion monitoring now default to bounded summary
  projections; HTTP and MCP retain explicit `detail=full` diagnostics.
  History-materialization list/status monitoring uses the same compact-default
  contract. Compact `/status` assembly no longer refreshes materialization
  state.
- ChatGPT account-mirror readiness waits execute a throttled hard-stop probe.
  The existing blocking-surface error propagates through the owning adapter
  call before readiness recovery can reload/reopen, while the existing tab
  cleanup boundary remains intact.
- Red/green regressions covered the readiness interrupt, compact/full
  completion routes, no-refresh status assembly, and compact child-job
  monitoring. The final adjacent suite passed 227/227 tests and focused HTTP
  coverage passed 3/3. Typecheck and production build passed; lint passed with
  the existing 203 warnings; `git diff --check` and the plan audit passed.
- Installed runtime proof preserved `paused=true`, opened no AuraCall managed
  browser or CDP 45015 listener, and completed 20 successful compact
  completion/materialization read pairs. API PID `960249` and restart count
  remained fixed during the load; current memory moved from about 1.00 GiB to
  1.14 GiB and the 1.61 GiB startup peak did not increase. The service had one
  automatic restart immediately after installation, then remained active and
  stable for the proof.
