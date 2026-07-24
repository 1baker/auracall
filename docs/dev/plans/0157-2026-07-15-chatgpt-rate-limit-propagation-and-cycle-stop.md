# ChatGPT Rate-Limit Propagation And Cycle Stop | 0157-2026-07-15

State: CLOSED
Lane: P01

## Goal

Make `chatgpt/wsl-chrome-3` stop provider work as soon as any collector or
materialization read detects a ChatGPT rate limit, and prevent live follow from
resuming before that cooldown is visible in account-mirror status.

## Current State

- Completion `acctmirror_completion_cb75103d-0b8c-400f-ab76-209421821ec3`
  is operator-paused with no next attempt scheduled.
- Materialization job `hmj_97e81afa730c4e9c9152dce07a1791c7` detected
  `Too many requests` at 14:17 CDT and set a 15-minute browser guard, but
  `/status` still showed `providerGuard=null` and started another pass at
  14:22 CDT.
- A later collector detected another rate limit at 15:59 CDT but continued two
  more detail reads before completing. The projected guard then delayed the
  next cycle until 16:14 CDT, when work resumed and triggered the warning again.
- The final bounded materialization job after the operator pause reports a
  cooldown until 16:33:55 CDT. The job is terminal and the completion remains
  paused.
- The installed post-cooldown proof started exactly one bounded attempt at
  16:34:11 CDT. ChatGPT set a new guard during `listConversations` at 16:39:11;
  the refresh stopped before detail inventory or materialization, projected the
  target cooldown through 16:54:11, and was operator-paused before retry.
- The proof exposed and repaired one final cleanup gap: bounded refresh cleanup
  previously ran only after success. Guarded failures now terminate the managed
  browser too; installed PID `44066` is back to 11 tasks with no CDP listener.

## Scope

- Reproduce the missing materialization-to-status cooldown projection with a
  deterministic test at the real service boundary.
- Reproduce and repair collector continuation after an in-cycle rate-limit
  signal.
- Ensure scheduler/completion cadence consumes the propagated cooldown before
  any new provider work.
- Preserve provider guards, interaction caps, CAPTCHA/sign-in hard stops, and
  the configured full-sweep policy.
- Install and verify the target remains quiet through the active cooldown, then
  run one guarded proof only after eligibility.

## Non-Goals

- Do not weaken or override ChatGPT rate limits.
- Do not increase interaction frequency or materialization batch size.
- Do not resume unrelated paused targets.
- Do not mix unrelated model-selector changes from the dirty worktree into this
  slice.

## Acceptance Criteria

- [x] Materialization rate-limit evidence immediately projects a cooldown onto
  the matching account-mirror target.
- [x] A collector stops scheduling additional detail reads after a rate-limit
  guard is detected during the cycle.
- [x] Completion and scheduler next-attempt timing is no earlier than the
  active provider cooldown.
- [x] Focused tests, TypeScript, build, scoped Biome, diff check, and plan audit
  pass.
- [x] Installed status remains quiet while guarded and one post-cooldown proof
  completes or safely re-enters guard without extra reads.
- [x] Materialization and managed-browser cleanup reach terminal readback.

## Definition Of Done

The plan closes when the first rate-limit signal becomes the single authority
for target cooldown and all remaining provider work in that cycle stops.

Closed on 2026-07-15 with installed status, cooldown, pause, and cleanup
readbacks.
