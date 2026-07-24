# ChatGPT Identity Timeout Follow-Up | 0155-2026-07-15

State: CLOSED
Lane: P01

## Goal

Repair the fresh `chatgpt/wsl-chrome-3` identity-stage timeout that appeared
after Plan 0154 closed, without weakening provider guards or changing the
production interaction cadence.

## Current State

- Three unattended attempts failed during identity at 90 seconds, at
  `2026-07-15T12:58:53.060Z`, `13:08:32.269Z`, and `13:19:21.685Z`.
- Chrome BrowserMetrics continued updating for roughly 2 minutes 49 seconds
  after each caller timeout, proving the underlying cold browser work remained
  alive after the wrapper rejected.
- The exact resolver used by ChatGPT identity returns `90_000`: 30 seconds of
  discovery work plus the configured 60-second page-refresh allowance. Prior
  installed evidence proved normal ChatGPT blank/cold recovery takes 114-140
  seconds and fits the 300-second detail envelope.
- Provider guard is clear, development controls are disabled, and no active
  completion or materialization job owns the browser.
- Installed proof also isolated a host prerequisite: WSLg had stopped and
  exposed no X11 or Wayland socket, so managed Chrome could not launch. A
  temporary `Xvfb :0` display allowed a bounded proof without changing the
  production configuration; the temporary display was stopped afterward.

## Scope

- Give ChatGPT discovery/identity calls 240 seconds of browser work plus the
  existing governor allowance; preserve other providers' discovery budgets.
- Bind identity reads to the same abort-driven CDP connection/target cleanup
  already used by ChatGPT conversation-context reads.
- Install the repair and prove one bounded production refresh completes
  identity with no provider guard or orphan target.

## Non-Goals

- Do not change interaction frequency, cooldowns, CAPTCHA/sign-in handling, or
  provider-guard policy.
- Do not reopen Plan 0154 or redesign the live-follow phase model.
- Do not mix unrelated dirty-worktree model/selector changes into this slice.

## Acceptance Criteria

- [x] A deterministic regression test proves ChatGPT discovery resolves to a
  300-second effective bound under the installed 60-second cooldown policy.
- [x] Identity abort cleanup closes a disposable CDP connection/target.
- [x] Focused tests, TypeScript, build, scoped Biome, diff check, and plan audit
  pass.
- [x] Installed `chatgpt/wsl-chrome-3` refresh completes identity and returns
  zero consecutive failures with provider guard clear.
- [x] No stale lock, disposable target, or active materialization job remains
  after proof.

## Closeout Evidence

- Installed service PID `1201511` returned HTTP `202` with
  `status=completed` for the bounded production refresh.
- Identity completed in `2888ms` with `providerCallTimeoutMs=300000`; four
  context reads then completed in `121728ms`, `128538ms`, `118972ms`, and
  `120703ms` under the same bound.
- Installed status advanced `lastSuccessAt` to
  `2026-07-15T13:54:10.674Z`, reset `consecutiveFailureCount` to `0`, cleared
  `lastFailureAt`, and kept the provider guard clear.
- The retained catalog advanced to 116 conversations, 277 artifacts, and 247
  files, with 10 detail surfaces remaining for normal live-follow cycles.
- Post-proof readback found no queued/running target work, no active history
  materialization job, and no listener on the managed Chrome CDP ports.

## Definition Of Done

The plan closes when the installed runtime proves the identity phase can use
the realistic ChatGPT recovery envelope, abort cleanup is regression-tested,
and unattended safety controls remain unchanged.
