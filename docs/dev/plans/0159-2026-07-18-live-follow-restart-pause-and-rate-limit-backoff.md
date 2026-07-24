# Live-Follow Restart Pause And Rate-Limit Backoff | 0159-2026-07-18

State: CLOSED
Lane: P01

## Goal

Prevent a service restart or a short fixed cooldown from turning a paused
ChatGPT live-follow lane into repeated unattended provider work.

## Current State

- The routine scheduler is operator-paused, but that control is process-local
  and startup cadence is scheduled unconditionally after a service restart.
- `chatgpt/wsl-chrome-3` has accumulated 16 consecutive failures and 23
  same-day blocked scheduler attempts in the latest 50 rows.
- Fresh `readConversationContext` limits currently settle into the same
  15-minute repeated cooldown instead of escalating with the recurring
  detection streak.
- The managed ChatGPT tab has been closed and CDP port 45015 is not listening.

## Scope

- Persist scheduler pause/resume operator state under the AuraCall home cache
  and hydrate it before startup cadence is scheduled.
- Preserve a bounded per-browser-profile history of real ChatGPT rate-limit
  detections and escalate cooldowns from 5 minutes through 15 and 45 minutes
  to a six-hour cap.
- Preserve detection history across successful guard writes while allowing old
  history to age out automatically.
- Make routine scheduler refreshes request managed-browser cleanup on both
  success and failure.
- Install with the scheduler paused and prove restart persistence without
  contacting ChatGPT.

## Non-Goals

- Do not resume the scheduler or the paused completion.
- Do not click through, dismiss, or otherwise automate provider warnings.
- Do not relax browser interaction limits or materialization caps.
- Do not modify unrelated dirty-worktree changes.

## Execution Tracks

- Critical path: lock scheduler restart persistence and cooldown escalation
  with deterministic tests, implement the narrow state seams, then validate.
- Low-conflict documentation: update operator behavior, journal, fixes log,
  roadmap, and runbook in the same slice.
- Installed proof: install only after tests pass, persist pause immediately,
  restart once, and compare scheduler history plus browser/CDP state.

## Acceptance Criteria

- [x] A paused scheduler remains paused across server recreation and does not
  schedule startup cadence.
- [x] Resume persists the enabled posture and restores scheduling explicitly.
- [x] Repeated ChatGPT detections escalate deterministically to a bounded
  six-hour maximum and the history ages out after its retention window.
- [x] Guard success paths retain the bounded detection history.
- [x] Scheduler-owned refreshes request managed-browser cleanup.
- [x] Focused tests, TypeScript, build, scoped Biome, diff check, and plan audit pass.
- [x] Installed service restart reports the scheduler paused with no new
  scheduler ledger row, ChatGPT browser, or CDP listener.

## Definition Of Done

The plan closes when operator pause survives an API service restart, recurring
ChatGPT rate limits back off beyond a fixed 15-minute loop, routine browser
cleanup is requested, and installed readback proves no provider contact during
the restart verification.

## Closeout Evidence

- `64/64` focused guard, LLM-service, refresh-service, and scheduler tests pass;
  three focused HTTP scheduler-control regressions also pass.
- TypeScript, production build, repository lint, scoped Biome, `git diff
  --check`, and the plan-library audit pass. Lint retains 203 pre-existing
  warning-level diagnostics and exits successfully under repo policy.
- Installed PID `10191` contains the durable scheduler-control module,
  six-hour ChatGPT cooldown cap, and scheduler browser-cleanup request.
- After restart, `/status` reports scheduler `paused=true`, `state=paused`, and
  no wake/start/completion timestamps. The latest ledger boundary remains
  `2026-07-18T13:34:51.673Z`; the paused completion remains at pass 16.
- The persisted control record reports `paused=true`; no managed
  `wsl-chrome-3/chatgpt` Chrome process or CDP listener on port 45015 exists.
- Readiness verification uses one bounded `/status` request. Short-timeout
  polling was rejected because timed-out clients do not cancel server-side
  status assembly and can create artificial concurrent memory pressure.
