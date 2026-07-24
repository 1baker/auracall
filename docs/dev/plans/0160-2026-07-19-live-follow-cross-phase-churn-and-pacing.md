# Live-Follow Cross-Phase Churn And Pacing | 0160-2026-07-19

State: CLOSED
Lane: P01

## Goal

Prevent a successful account-mirror collector pass from immediately replaying
the same ChatGPT conversation reads during history materialization, while
preserving bounded disposable-tab ownership and one effective provider pacing
contract across both phases.

## Root Cause

- Each account-mirror conversation context read opened its intended disposable
  target, then cache routing independently re-probed user identity and feature
  signature through two more browser connections.
- Completion queued materialization immediately after refresh without carrying
  the collector's quiet boundary or effective interaction policy.
- Materialization did not know which conversation snapshots the collector had
  just refreshed, so a cache miss could trigger an immediate duplicate live
  snapshot refresh for the same chat.

## Scope

- Reuse the collector's verified account identity for account-mirror context
  cache routing and skip feature-signature discovery on inventory paths.
- Persist the exact conversation IDs successfully observed for detail during a
  collector pass and hand them to materialization.
- Delay materialization provider work until the collector cooldown boundary.
- Share one job-scoped interaction governor across materialization snapshot and
  asset work.
- Retain disposable target cleanup; do not reuse a tab across unrelated chats.
- Install with scheduler and completion state paused and verify without provider
  contact.

## Acceptance Criteria

- [x] One account-mirror context read does not open nested cache-identity or
  feature-signature browser probes.
- [x] A collector-refreshed conversation is cache-materialized without a second
  live snapshot refresh in the same pass.
- [x] Materialization waits the maximum effective collector cooldown boundary.
- [x] Snapshot and materialization work share one job interaction governor.
- [x] Existing direct/manual materialization callback and scheduling semantics
  remain compatible.
- [x] Focused tests and TypeScript pass.
- [x] Production build, scoped formatting/lint, diff check, and plan audit pass.
- [x] Installed service/config readback proves the scheduler and completion are
  still paused with no provider contact.

## Definition Of Done

The plan closes when cross-phase duplicate reads and nested identity probes are
removed, the effective pacing policy spans collector-to-materialization
handoff, offline validation passes, and the installed paused runtime contains
the repair without automatically contacting ChatGPT.

## Closeout Evidence

- Focused validation passes `210/210`; TypeScript, production build, full lint,
  scoped Biome, `git diff --check`, and the plan-library audit pass. Full lint
  retains 203 warning-level diagnostics and exits successfully under repo
  policy.
- Installed runtime source contains collector snapshot reuse,
  `providerWorkNotBefore`, job-scoped interaction-policy handoff, and
  account-mirror cache routing without identity detection.
- Installed `wsl-chrome-3` pacing is `8/min` with 120-second conversation,
  refresh, and renavigation cooldowns; the six-candidate materialization cap is
  retained because duplicate/nested provider work is now removed.
- After restart, `auracall-api.service` is active as PID `77443`, scheduler
  control remains paused, completion
  `acctmirror_completion_cb75103d-0b8c-400f-ab76-209421821ec3` remains paused
  at pass 17, and no CDP 45015 listener or managed ChatGPT browser process is
  present. No live-follow resume or provider request was issued.
- A user-authorized bounded acceptance pass on 2026-07-20 advanced the same
  completion to pass 18. The collector scanned four chats with five of eight
  logical interactions, five target lifecycles, 40 CDP calls, no yield, and no
  provider guard. The prior baseline used 10 target lifecycles and 55 CDP calls
  for only three chats.
- Materialization job `hmj_732024ed753643998945b78f5e9145f3`
  carried the four exact collector-fresh conversation IDs, waited until
  `2026-07-20T12:48:48.193Z`, and inherited the installed `8/min` plus
  120-second action policy. It succeeded across four older backlog
  conversations with two checksum-backed PDF routes, six skips, and zero
  failures. Final readback shows scheduler and completion paused, guard clear,
  no active materialization jobs, and no managed Chrome/CDP 45015 lane.
- A repeat bounded pass after roughly 50 minutes of quiet time advanced the
  completion to pass 19. It read three exact chats with four of eight logical
  interactions, four target lifecycles, 34 CDP calls, no yield, no failure,
  and no provider guard. Job `hmj_09d75f08428c4173b5d407547937eeaa`
  honored the two-minute provider-work boundary and finished with two
  materialized routes, six skips, and zero failures.
- The repeat job selected the same checksum-backed PDF routes as pass 18.
  Initial structural inspection found a real exact-ID suppression asymmetry,
  but Plan 0161 receipt analysis corrected the live attribution: completion
  passed fresh IDs through `reuseSnapshotConversationIds`, and the repeated
  PDF came through general backlog selection because sandbox-label,
  percent-encoded filename, `download-dom`, and archived `download` aliases
  did not converge. This does not invalidate the closed cross-phase browser-
  churn repair, but it blocks further live passes and pacing relaxation until
  handled as a separate bounded repair.
- Final repeat-pass readback leaves the completion and scheduler paused,
  service PID `77443` active, no active history-materialization job, and no
  managed ChatGPT browser or CDP 45015 listener.
