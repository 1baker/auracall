# Issue 9 Installed Acceptance | 2026-09-23

## Scope and authority

The operator approved the recommended bounded scheduler resume followed by
issue 9 installed aggregate-status acceptance. No assignee was added. Gemini
automation remained forbidden by its human-verification guard.

## Installed identity

- Canonical source: `092129e1153abdce8a082c208b80b0d4802d8534`
- Installed version: `0.1.1`
- Repo/installed `dist` files: 525 / 525
- Relative-path aggregate SHA-256, both trees:
  `30f58843ff76c95db59eddc54c591bd7adb1be3394a01658907897765d6910d8`
- `diff -qr dist ~/.auracall/user-runtime/node_modules/auracall/dist`: exit 0

## Aggregate and narrow acceptance

- Default installed aggregate status: 2.52s, 2.52s, 2.62s; all exit 0.
- Required-field assertion covered `object`, `ok`, `version`,
  `accountMirrorStatus`, completion metrics, scheduler state, live-follow
  scheduler state, local-claim summary, and routes; exit 0.
- Closed-port aggregate probe: exit 1, preserving transport failure behavior.
- Exact completion read: 1.22s, exit 0.
- Filtered scheduler diagnostics: 1.51s, exit 0.
- Unauthenticated scheduler history: HTTP 401 / exit 1, preserving its
  separate ops-auth contract.

## Scheduler acceptance

- Operator-paused preflight had no foreground work. One dry pass selected
  `chatgpt/wsl-chrome-3`; Gemini was not selected.
- Resume produced one execute pass from `2026-09-23T13:51:02.200Z` through
  `2026-09-23T13:58:36.666Z`, action `refresh-completed`.
- Provider session proof matched email, plan, structure, and account level.
  Dispatcher `blockedBy` was null and the provider guard was null.
- Browser cleanup status was `terminated`; a fresh exact-profile process census
  returned zero. Final scheduler state was `scheduled`, posture `healthy`,
  backpressure `none`.
- API service PID `7701` stayed active with `NRestarts=0`.

## Gemini hard stop

Fresh aggregate readback reported `gemini/auracall-gemini-pro` disabled with
provider guard `manual_clear_required`, kind `google-sorry`. The scheduler skip
decision remained `disabled`; no Gemini browser launch, guard clear, or retry
was attempted. The default Gemini target was also disabled.

## Disposition

ASL-R5 and ASL-R6 are accepted. P08 / Plan 0315 can close with issue 9 after
this receipt reaches canonical main.
