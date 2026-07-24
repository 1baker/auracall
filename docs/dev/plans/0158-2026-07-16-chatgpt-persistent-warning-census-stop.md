# ChatGPT Persistent Warning Census Stop | 0158-2026-07-16

State: CLOSED
Lane: P01

## Goal

Stop the ChatGPT target census from perpetually renewing a cooldown when the
same visible rate-limit warning remains on the managed browser page.

## Current State

- The routine account-mirror scheduler is operator-paused.
- `chatgpt/wsl-chrome-3` has not completed a successful refresh since
  2026-07-15T23:37:20.828Z and has accumulated 45 consecutive failures.
- The latest scheduler history alternates `refresh-blocked` target-census
  probes with `provider-guard` skips; each probe rewrites
  `cooldownDetectedAt` and extends the cooldown by another 15 minutes.
- The first repair escalated to `manual_clear_required`, but installed cleanup
  had already removed the browser, making the operator action impossible.

## Scope

- Close the ChatGPT tab when the same warning remains visible after its first
  automatic cooldown, then retain a bounded retry cooldown.
- Preserve first-detection cooldown behavior and all CAPTCHA/sign-in guards.
- Avoid a manual-clear state that cannot be satisfied after managed-browser
  cleanup has already removed the visible browser.
- Install while the scheduler remains paused and verify no provider work starts.

## Non-Goals

- Do not dismiss or click through the provider warning automatically; close
  its tab instead.
- Do not relax interaction limits or cooldown duration.
- Do not resume the scheduler or paused completion in this slice.
- Do not modify unrelated dirty-worktree changes.

## Acceptance Criteria

- [x] First target-census warning produces the existing bounded cooldown.
- [x] A repeated still-visible warning after that census cooldown closes the
  warning tab and records a new bounded cooldown.
- [x] Status does not persist an unsatisfiable manual-clear guard.
- [x] Focused tests, TypeScript, build, scoped Biome, diff check, and plan audit pass.
- [x] Installed scheduler remains paused with no new provider attempt.

## Definition Of Done

The plan closes when a persistent warning triggers tab cleanup plus a bounded
retry boundary rather than either autonomous renewal or impossible human
clearance.

## Closeout Evidence

- The ChatGPT census regression and full refresh-service suite pass `28/28`.
- TypeScript, production build, scoped Biome, `git diff --check`, and the plan
  audit pass with zero validation errors.
- Installed PID `5903` contains both `closeRemoteChromeTarget` and
  `account-mirror-refresh:target-census-persistent-warning-tab-closed`, is
  healthy at 11 tasks, and has no listener on CDP port 45015.
- Persisted `chatgpt/wsl-chrome-3` state has a bounded cooldown and
  `providerHardStopAtMs=null`; no unsatisfiable manual guard remains.
- The installed scheduler reports `state=paused` with no pass started, and its
  ledger remains at `2026-07-16T22:50:50.848Z`.
- One installed bounded recovery advanced completion
  `acctmirror_completion_cb75103d-0b8c-400f-ab76-209421821ec3` from pass 15 to
  16, reduced remaining detail surfaces from 15 to 12, and completed without a
  provider guard. Materialization job `hmj_45b9a036dc5144efa1b7038280e6f6c4`
  succeeded with 2 assets from 4 conversations and 0 failures. The completion
  was re-paused, the provider guard is clear, and Chrome/CDP cleanup completed.
