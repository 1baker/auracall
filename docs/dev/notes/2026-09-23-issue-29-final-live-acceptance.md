# Issue 29 Final Live Acceptance | 2026-09-23

Work item: `ecochran76/auracall#29`
Lane: P51 / Plan 0358
Disposition: `ACCEPTED`

## Installed Gate

- Canonical main before installation was
  `e497767e4967a713410b83469a4c02bcd1278d9e`; the issue 29 code repair entered
  main through PR 35 at `52cf3641494b623c9fdf6ce2ca105e2430e9e231`.
- One `pnpm run install:user-runtime-service` completed and restarted the API
  once. Source and installed `dist` each contained 525 files with aggregate
  content SHA-256 `f68d789f4c96f01354a1a0285b7a4205c75ff1045777f65cf3ce7d875fa4588e`.
- The installed launcher reported `0.1.1`; API PID `7701` was active with zero
  crash restarts.

## Identity Gate

The installed identity smoke for AuraCall runtime profile `wsl-chrome-3`
matched `eric.cochran@soylei.com`, Pro, personal, with source browser profile
`Default` and managed browser profile
`~/.auracall/browser-profiles/wsl-chrome-3/chatgpt`. It launched exact Chrome
PID `9257` on DevTools port `38379`; no CAPTCHA, human-verification, identity,
or ownership ambiguity was observed.

## One-Shot Receipt

- One `run-one-pass` control was accepted at `2026-09-23T12:21:49.212Z`; no
  retry or second control was issued.
- Completion `acctmirror_completion_c4accb96-e1c9-4dee-8643-3bd6934569cd`
  advanced exactly once from pass 27 to 28 and created exactly one child,
  `hmj_e944834c227446b5ae07b7f5b2545fbb`.
- Child Chrome PID `13582` became the exact managed-profile owner on DevTools
  port `45015`. The child crossed the former owner-probe failure boundary and
  remained on one attempt.
- The child settled `succeeded` at `2026-09-23T12:43:44.045Z`: six distinct
  conversations attempted, 226 eligible, six selected, one asset materialized,
  eleven skipped, zero failed, and one checksum recorded.
- Terminal provider-session proof matched the exact configured account and
  attributed PID `13582`, target `F626833836F119B267394A06536A9754`, and port
  `45015`.

## Final Safety State

The completion is `idle_waiting` at pass 28 with a null force ceiling and its
provider-work lease released. Active history-materialization jobs are zero.
Fresh process and listener census found no managed browser owner. The scheduler
remains operator-paused. API PID `7701` remains active with zero crash restarts.
Gemini was not touched, `Answer now` was not clicked, and no retry occurred.
