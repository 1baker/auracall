# DevTools Attachment Liveness And Stage Contract | 0283-2026-08-14

State: OPEN
Disposition: PROVIDER-FREE ACTIVE
Lane: P01

## Stable Objective

Make shared AuraCall DevTools attachment return control deterministically when
target resolution, the CDP handshake, or initial domain enablement stalls, and
report the exact failed stage before any further live developer-app inventory.

## Current State

- The retained LitScout Plan 0411 diagnostic proved ChatGPT identity but timed
  out before developer-app inventory after entering `connectDevTools()`.
- The 45-second CLI deadline releases the operation lease, but its abort signal
  currently stops at the adapter: `connectDevTools()` receives no signal or
  deadline and browser-service awaits target resolution and raw CDP attachment
  without stage-local liveness control.
- The same shared `BrowserAutomationClient.connectDevTools()` seam also serves
  Account Mirror DOM-drift evidence.
- The authorized `wsl-chrome-3` managed Chrome remains external to this source
  slice. No further live replay is authorized.

## Scope

- Add deterministic provider-free regressions for stalled target resolution,
  stalled CDP attachment, caller abort, late-client cleanup, and adapter abort
  propagation.
- Add a shared DevTools attachment option contract carrying an abort signal,
  a positive per-stage timeout, and stage callbacks.
- Bound target resolution and CDP attachment in browser-service and bound the
  developer-app adapter's initial `Runtime.enable` and `Page.enable` calls.
- Preserve existing no-options callers through backward-compatible defaults.
- Update user/operator docs, the development journal, and the durable fix log.

## Non-Goals

- Attaching to, navigating, launching, restarting, installing, or closing the
  authorized `wsl-chrome-3` managed browser profile.
- Running another LitScout inventory, connector canary, prompt, OAuth/app
  mutation, Experiment 6 action, scheduler action, or canonical DB mutation.
- Choosing a new provider-specific target-selection heuristic before stage
  evidence proves that target selection is the remaining defect.
- Changing developer-app mutation deadlines or generic Chat/Work behavior.

## Acceptance Criteria

- [x] A deterministic adapter test proves an outer abort interrupts a stalled
  `connectDevTools()` await rather than merely winning an unrelated race.
- [x] Browser-service target resolution and CDP attachment each fail with a
  named stage inside the configured positive deadline.
- [x] A CDP client resolving after timeout/abort is closed and any temporary
  endpoint is disposed exactly once.
- [x] Initial Runtime and Page domain enablement are independently bounded and
  abort-aware before the adapter publishes the client.
- [x] Existing no-options callers remain source-compatible, including Account
  Mirror DOM-drift evidence.
- [x] Focused/affected tests, typecheck, lint, build, CodeGraph readback,
  planning audits, and diff hygiene pass provider-free.
- [ ] Source and docs are committed and pushed before any installed or live
  validation is requested.

## Provider-Free Checkpoint

- The deterministic red run produced five expected failures: adapter abort,
  target-resolution deadline, CDP-stage reporting, handshake deadline, and
  late-client cleanup. The same focused slice is green at 51/51.
- The widened browser-service, ChatGPT adapter, developer-app CLI, and Account
  Mirror caller gate passes 329/329. `pnpm run typecheck`, production build,
  and `pnpm run lint` pass; repo lint retains its pre-existing warning baseline,
  while the Biome-managed changed files pass a zero-diagnostic scoped check.
- Current CodeGraph readback is up to date and confirms the shared flow
  `BrowserService.connectDevTools -> connectToChrome -> connectToChromeTarget`
  plus the developer-app and Account Mirror callers.
- Active-plan audit and goal audit return `ok: true` with no problems; plan
  library audit reports zero validation errors.
- PID 66297 remains the sole listener on port 45015 and the retained registry
  entry is unchanged. No install, restart, browser attachment/navigation,
  inventory replay, prompt, connector, app/OAuth mutation, LitScout mutation,
  or Experiment 6 action ran.

## Effect Boundary

This plan may edit repository source, tests, plans, and docs and may run
provider-free validation. It may not install AuraCall, alter a user service,
attach to or launch a browser, submit a prompt, call a connector, mutate an
app/OAuth surface, change LitScout state, or run Experiment 6.

## Definition Of Done

Plan 0283 closes provider-free when every attachment stage is demonstrably
bounded/cancellable at the real shared seams, late resources are reclaimed,
the affected caller set remains green, and the committed/pushed source is
ready for a separately authorized installed-runtime replay.
