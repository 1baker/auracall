# Live-Follow Development Mode RCA And Repair | 0154-2026-07-14

State: CLOSED
Lane: P01

## Goal

Create an explicitly armed development mode for one selected account-mirror
target, use it to determine why `chatgpt/wsl-chrome-3` repeatedly times out
after the recent throughput increase, and repair the live-follow pipeline so a
single cycle can inventory and materialize several conversations without being
constrained by 24/7 production pacing assumptions.

The repair must keep safe unattended operation as the default. Development
mode is a bounded diagnostic execution contract, not a second permanent
scheduler policy and not a way to bypass CAPTCHA, sign-in, provider-guard,
foreground ownership, or browser-operation exclusivity.

## Current State

- 2026-07-14 installed verification update: development controls are disabled,
  the request-scoped development proof processed nine conversations and
  materialized three checksum-backed assets, and the installed production
  runtime contains bounded cache hydration, aborting provider deadlines,
  provider-cooldown parking, and coalesced ChatGPT context/file inventory.
- 2026-07-14 late-cycle RCA update: passive CDP screenshots confirmed the
  managed ChatGPT account was clear, then bounded materialization job
  `hmj_6a556ef21b2f482f9bb133328bb445a4` succeeded with four checksum-backed
  assets from three conversations and zero failures. The following metadata
  pass isolated a different defect: three ChatGPT context reads reached their
  90-second deadline while the selected conversation rendered a blank message
  surface or fell back to the home screen. Chrome history and cache timestamps
  proved an aborted read continued navigating for roughly three minutes after
  the completion had failed, eventually writing a valid two-message context.
  The repair now gives ChatGPT detail surfaces 240 seconds of browser work plus
  configured governor allowance, closes the disposable CDP target on abort,
  and compares collector failures with the last successful refresh rather than
  a later ledger-persistence timestamp. Offline validation is `349/349`
  account-mirror/ChatGPT tests plus TypeScript; installed proof was pending at
  that checkpoint.
- 2026-07-14 installed closeout: service PID `16076` on
  `127.0.0.1:18095` completed two consecutive unattended production metadata
  cycles after the repair. Completion
  `acctmirror_completion_97f5c243-1713-4419-b461-14e10596c4b5` advanced from
  pass 1 through pass 3 and returned to `idle_waiting` with `error=null`.
  The two accepted refreshes completed at `2026-07-15T03:58:50.146Z` and
  `2026-07-15T04:11:59.016Z`; the second read two conversation details in
  140.5 and 114.3 seconds under the 300-second effective deadline, advanced
  the detail cursor from 1 to 3, retained `consecutiveFailureCount=0`, and
  kept the provider guard clear. Follow-on job
  `hmj_9c45c1f0926e406aa0fde734dcb13ff9` succeeded with four conversations,
  one materialized asset, seven skips, and zero failures. After completion,
  CDP port `45015` closed, service tasks fell from 207 to 11, and no active
  materialization work or disposable target remained. Development capability
  readback is `armed=false`. This evidence supersedes the historical blocker
  snapshots below and closes installed acceptance.
- Historical blocker snapshot: the provider-side failure also preserved one
  unresolved code symptom. Production completion
  `acctmirror_completion_e6d6e275-59e5-4fc0-adfa-19e8be364320` completed
  discovery, then three coalesced `readConversationContext` calls each timed
  out at roughly 82 seconds against a 90-second effective deadline. ChatGPT
  raised a new requests-too-quickly guard at `2026-07-14T15:22:07.406Z`, with
  cooldown through `2026-07-14T15:37:07.406Z`.
- Per the provider hard-stop policy, that completion is explicitly `paused`
  with its durable detail cursor at conversation index 3. It must not resume
  until a human clears/verifies the visible ChatGPT state; after clearance,
  one bounded real command must precede any further DOM inspection or the two
  unattended acceptance cycles.
- Historical validation snapshot: TypeScript/build was green, focused collector/refresh/
  completion tests `126/126`, broader account-mirror tests `229/229`, scoped
  Biome and `git diff --check` clean, and plan audit `154` candidates with zero
  errors. Plan state remains `OPEN` because the two unattended cycles have not
  passed and completion/status/phase projections still need installed recovery
  proof after the guard clears.
- Offline follow-up explained the apparent 82-second elapsed time against a
  90-second provider deadline: this host's wall clock advanced roughly 27
  seconds during a 30-second monotonic sleep, while collector elapsed fields
  used `Date.now()` and Node timeout scheduling used the monotonic clock. Stage
  elapsed diagnostics now use `performance.now()`, so deadline evidence and
  timer behavior share the same clock.
- Account-mirror ChatGPT readiness also no longer runs generic recovery through
  a visible rate-limit surface. A rate-limit found before recovery or after a
  failed readiness wait now throws the exact blocking-surface error immediately
  without dismissal, reload, reopen, or retry. Ordinary connection/transient
  recovery is unchanged. The repair passes 337 broader account-mirror/adapter
  tests and is installed as service PID `74822`; the completion remains paused.
- A final offline phase-ownership repair now queues missing-asset
  materialization directly from a durable complete metadata ledger instead of
  replaying identity/project/root discovery. While a materialization cursor is
  nonterminal, the completion polls that job and does not start a concurrent
  metadata refresh. Newer collector failures also override older complete
  ledger projections and hydrate an exact completion error.
- The installed runtime is now PID `38303`. Authenticated completion readback
  preserves `paused`, `passCount=0`, and the `operator_paused` lifecycle event,
  while coherently reporting `currentPhase=detail-inventory`, phase status
  `blocked`, and `error.code=account_mirror_collector_timeout`. Focused
  completion tests pass `51/51`, the broader account-mirror/ChatGPT adapter
  suite passes `340/340`, TypeScript/build/Biome/diff checks pass, and no
  provider resume was issued.

- The installed service is active on `127.0.0.1:18095`, but the filtered target
  readback is internally inconsistent: the aggregate health line says
  `severity=healthy`, while `chatgpt/wsl-chrome-3` is delayed by
  `failure-backoff` with `consecutiveFailureCount=63` and `passCount=80`.
- The exact failure is `Account mirror metadata collector timed out for
  chatgpt/wsl-chrome-3.` The outer deadline is owned by
  `createAccountMirrorRefreshService`: one `withTimeout(...)` wraps the entire
  metadata collector and defaults `collectorTimeoutMs` to `120_000`.
- The collector performs sequential identity, rail, account-file,
  conversation-file, and conversation-context work. It also applies a browser
  interaction governor plus per-call timeouts. Increasing the interaction
  budget therefore does not guarantee that the whole collector can finish
  inside the unchanged outer wall-clock deadline.
- Timeout failures abort the collector and increment the status-registry
  failure count, but the active completion remains `idle_waiting` with no
  completion error and does not advance past pass 80. The health summary does
  not currently promote this repeated target failure to attention-needed.
- Metadata evidence now says the mirror is complete with zero remaining detail
  surfaces, while the live-follow cycle still reports `detail-inventory` as
  running and the target decision correctly says `start_materialization` for a
  354-asset backlog. This stale phase disagreement can keep scheduling the
  wrong work.
- Materialization itself is not proven broken. Job
  `hmj_5f148e951472448fbc3737f48517f3f6` accepted `maxItems=6`, succeeded, and
  materialized one asset from three attempted conversations. That result shows
  candidate eligibility and downloadable-asset yield are separate from the
  metadata collector timeout.
- Current operator tuning is five-minute routine/explicit cadence, at most one
  minute of jitter, 12 browser interactions per minute, 60-second browser-read
  cooldowns, and six materialization candidates. These settings must be
  treated as diagnostic input, not as accepted production defaults.

## Working Hypotheses

1. The outer 120-second collector deadline is incompatible with multiple
   sequential provider reads once navigation, DOM settling, retries, and
   interaction pacing are included.
2. Per-call timeout fallbacks can consume most of the outer deadline while
   returning tolerated empty evidence, obscuring which stage exhausted the
   cycle budget.
3. The completion, status-registry, health-summary, and phase-ledger surfaces
   disagree about timeout failures, causing a failing target to look healthy
   and to resume `detail-inventory` after metadata has become complete.
4. Materialization selection repeatedly chooses conversations with terminal,
   duplicate, remote-image, missing-link, or otherwise nonmaterializable
   candidates, so raising `maxItems` alone does not raise successful downloads.
5. Full materialization across several chats is feasible when metadata refresh
   and binary retrieval are separated into resumable phases with independent
   deadlines and durable per-candidate outcomes.

## Development Mode Contract

Development mode must require both an installed-runtime opt-in and an explicit
request for one provider/runtime-profile target. It must never be inferred from
`NODE_ENV`, a broad profile label, or a low pacing value.

- Server opt-in: a clearly named local-only config/env capability enables
  account-mirror developer controls. The service reports whether the
  capability is armed without exposing credentials.
- Request scope: one refresh, one completion pass, or one materialization job;
  no automatic persistence into the normal live-follow subscription policy.
- Required bounds: target, maximum wall time, maximum conversations, maximum
  materialization candidates, and maximum pass count.
- Permitted overrides: collector wall-clock deadline, per-provider-call
  deadline, interaction pacing/cooldowns, phase selection, failure-backoff
  bypass, and minimum-interval bypass.
- Non-overridable controls: provider guard/CAPTCHA/sign-in hard stops,
  foreground-work preemption, browser-operation ownership, target identity
  checks, no `Answer now` click, and explicit cancellation/abort propagation.
- Evidence: every run persists an effective-policy snapshot, phase timings,
  provider actions, retries, timeouts, candidate disposition counts, browser
  mutation/target churn, and terminal reason under a diagnostic run id.
- Cleanup: the diagnostic run releases browser ownership, closes disposable
  targets, clears only its own transient lock/state, and leaves unattended
  scheduler defaults unchanged.

## Milestones

### M1 | Freeze And Reproduce The Failure

- Pause automatic execution only for `chatgpt/wsl-chrome-3`; do not alter
  unrelated targets.
- Capture a pre-change evidence packet containing filtered `/status`, scheduler
  diagnostics/history, completion JSON, status-registry persistence,
  materialization jobs, DOM-drift observations, service PID/config digest, and
  browser-process ownership.
- Reproduce one collector timeout through an explicitly bounded manual pass.
- Acceptance: the run id, target, effective limits, last successful stage,
  timed-out stage, elapsed duration, and abort cleanup are recoverable from one
  evidence packet without correlating free-form logs by hand.

### M2 | Add Stage-Level Collector Timing And Timeout Attribution

- Instrument identity, project index, root rail, project conversations,
  account files, conversation files, conversation context, persistence, and
  cleanup with start/finish/elapsed/outcome records.
- Distinguish outer collector deadline, provider-call deadline, interaction
  governor wait, navigation/DOM settling, dispatcher wait, foreground yield,
  and abort cleanup.
- Preserve partial cursor/evidence on timeout so the next diagnostic pass can
  resume from the last confirmed boundary instead of replaying the whole
  collector.
- Acceptance: an induced timeout names the precise stage and preserves a
  resumable cursor; successful tests prove timers and abort listeners are
  released.

### M3 | Implement Explicit Development Controls

- Add a typed request-scoped diagnostic policy shared by CLI and authenticated
  local API surfaces. Avoid ad hoc environment reads inside collectors.
- Require the dual opt-in described in the Development Mode Contract.
- Add a dry-run/readback command that shows normal policy versus effective
  diagnostic overrides before provider work begins.
- Add cancel/status readback for long diagnostic runs so the operator does not
  need to kill the service.
- Acceptance: production/default requests cannot set diagnostic-only fields;
  an armed local request can, and its `/status`/diagnostic readback clearly
  labels the target `development` rather than `healthy steady-follow`.

### M4 | Run A Controlled Experiment Matrix

Run one variable at a time against the same cached target frontier:

1. Current policy control: 120-second collector deadline with normal pacing.
2. Deadline-only test: extended collector wall time, unchanged pacing.
3. Pacing-only test: diagnostic pacing, unchanged conversation/candidate
   bounds, extended wall time to avoid confounding.
4. Phase-isolation test: detail inventory only, then materialization only.
5. Batch test: materialization candidate limits 3, 6, and 12 with the same
   eligibility snapshot.

For every run record wall time, conversations visited, provider interactions,
governor wait, navigation/DOM time, assets selected/materialized/duplicated/
skipped/failed, tab churn, memory, and guard state. Stop immediately on CAPTCHA,
sign-in challenge, rate-limit guard, identity drift, or browser instability.

- Acceptance: the evidence identifies whether the binding constraint is the
  outer collector deadline, a specific provider read, phase replay, candidate
  quality, or binary retrieval. Do not tune production values until this
  attribution exists.

### M5 | Repair Phase Ownership And Failure Semantics

- Make metadata collection, detail inventory, and materialization independently
  resumable operations with separate deadlines and durable cursors.
- Prevent a complete metadata mirror with zero detail surfaces from remaining
  stuck in `detail-inventory` when the target decision is materialization.
- Propagate collector failure metadata into the active completion and cycle
  ledger, including the exact stage and retry eligibility.
- Make repeated target failures affect live-follow health severity and
  attention state; `severity=healthy` is invalid while the sole enabled target
  has dozens of consecutive timeouts.
- Reset consecutive failures only after a genuinely successful relevant phase,
  not after a status hydration or unrelated materialization readback.
- Acceptance: deterministic tests cover success, timeout, partial progress,
  restart hydration, phase transition, failure health, and recovery.

### M6 | Repair Materialization Throughput

- Separate candidate enumeration from download execution and persist why each
  candidate is eligible, terminal, duplicate, unsupported remote media,
  missing a provider link, or retryable.
- Exclude terminal/nonmaterializable candidate families from routine reselection
  unless an explicit force run requests them.
- Let one bounded materialization job process several conversations and several
  downloadable assets without coupling its wall clock to metadata collection.
- Use per-candidate deadlines and resumable checkpoints so one slow or broken
  asset does not fail the batch.
- Acceptance: a fixture and installed dev-mode run prove at least three
  conversations and multiple materializable assets can complete in one cycle,
  with exact disposition counts and no provider guard.

### M7 | Validate, Install, And Restore Unattended Mode

- Run focused unit/integration tests, TypeScript, scoped Biome, lint, and the
  relevant no-provider preflight smokes.
- Install the current checkout into `~/.auracall/user-runtime`, restart
  `auracall-api.service`, and verify the direct bound port.
- Run one bounded dev-mode proof, then disable developer controls and run at
  least two unattended production cycles through a quiet window.
- Confirm no stale browser-operation locks, orphaned managed Chrome trees, or
  active materialization jobs remain.
- Acceptance: installed status reports a coherent phase, zero consecutive
  failures, no guard, no attention requirement, diminishing eligible
  materialization backlog, and production-safe policy restored.

## Critical Path And Parallel Work

- Critical path, serialized: M1 reproduction -> M2 attribution -> M4 experiment
  matrix -> root-cause decision -> M5/M6 repair -> M7 installed proof.
- Low-conflict parallel tracks after M2 contracts stabilize:
  - diagnostic CLI/API schema and authorization tests;
  - health/phase-ledger projection tests;
  - materialization candidate-disposition fixtures;
  - operator documentation and evidence-packet rendering.
- One primary owner must reconcile all tracks against the installed target and
  keep this plan, `RUNBOOK.md`, and `docs/dev/dev-journal.md` current.

## Validation Matrix

| Surface | Required proof |
| --- | --- |
| Collector timeout | Exact stage, elapsed time, configured/effective deadline, abort cleanup |
| Resume cursor | Restart-safe partial progress without replaying completed stages |
| Dev-mode authorization | Dual opt-in, target-bound request, bounded fields, production rejection |
| Guard safety | CAPTCHA/sign-in/provider guard cannot be overridden |
| Phase ownership | Complete metadata advances to materialization; failures remain visible |
| Health semantics | Repeated timeout raises attention severity and exact blocker |
| Materialization | Several chats and multiple assets complete with per-candidate dispositions |
| Runtime | Installed PID/port, authenticated controls, direct status readback |
| Cleanup | No stale lock, orphan browser tree, or active job after proof |

## Non-Goals

- Do not remove or globally weaken the production 24/7 politeness defaults.
- Do not turn `NODE_ENV=development` into implicit permission for provider
  automation.
- Do not retry through CAPTCHA, sign-in challenge, provider warning, or rate
  limit guard.
- Do not conflate remote-known backlog with actually downloadable candidates.
- Do not declare success from a higher configured cap without successful asset
  and cache-file readback.
- Do not repair unrelated dirty-worktree model/selector changes in this plan.

## Acceptance Criteria

- [x] A request-scoped, dual-opt-in development mode exists with explicit
  target and resource bounds while production defaults remain unchanged.
- [x] One reproducible evidence packet attributes the current timeout to a
  precise collector stage and preserves partial progress.
- [x] Completion, status, health, and phase-ledger projections agree on
  failure, recovery, and the next eligible phase.
- [x] Metadata-complete targets can enter materialization without replaying
  unrelated rails or detail inventory.
- [x] Materialization candidate disposition prevents terminal/nonmaterializable
  rows from consuming every routine batch.
- [x] A bounded installed dev-mode run processes at least three conversations
  and materializes multiple real assets in one cycle, or records source-backed
  proof that fewer eligible downloadable assets exist.
- [x] Two subsequent unattended cycles complete without timeout, guard, stale
  lock, or orphan browser processes after developer controls are disabled.
- [x] Docs, tests, plan audit, and installed-runtime evidence are current.

## Definition Of Done

This plan closes when the current timeout is explained by stage-level evidence,
the repair makes metadata and materialization independently resumable, repeated
failures are represented honestly across status surfaces, and an installed
development-mode proof demonstrates multi-chat materialization without
weakening unattended provider safety. Developer controls must be disabled at
closeout and the repaired production path must survive two normal cycles.
