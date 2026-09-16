# Aggregate Status Latency | 0315-2026-08-25

State: OPEN
Lane: P08
Operational state: SOURCE_INTEGRATED_INSTALLED_BLOCKED
Branch: fix/issue-9-aggregate-status
Target: main
Integration: merge
Revision: 6 | 2026-09-16
Work item: ecochran76/auracall#9

## Recovery Packet | 2026-09-16

- Recover candidate `025453473c5957fb72abb7ed787cb6d1266951e6` on canonical
  base `b35077504ae92972cf22c4957e7c30036c43dbce`, preserving current-main
  artifact-recovery-planner wiring. Historical runtime statements below remain
  historical evidence; this packet performs no installed or provider action.
- One implementation worker owns the six runtime/HTTP source files, affected
  tests, and these planning records. The primary owns issue publication,
  integration, runtime guard readback, and installed acceptance. Current user
  authorization for subagents supersedes the historical no-subagent constraint
  for this recovery; no nested delegation is needed.
- Recover bulk persisted-record listing and local-claim snapshots, bounded
  archive availability reads, and independent status projection concurrency.
  Preserve bundle-only exclusion, directory errors, permission/device failure
  evidence, ordinary checksum refresh, and all aggregate fields.
- Validate the runtime suites and combined affected HTTP status cases; resolve
  the historical identity-keyed hydration ordering failure before acceptance.
  Run typecheck, build, scoped lint, CodeGraph, and planning/lane audits.
- Terminal condition: locally committed provider-free evidence returned to the
  primary. Publication and installed acceptance remain open; this packet cannot
  close issue 9 or consume install/restart and scheduler pause/resume allowances.
- Model routing: the existing Astra/high audit worker is reused for bounded
  implementation to avoid duplicate context. The audit recommended Sol/high,
  but the parallel thread limit prevented opening another worker; the primary
  retained forge, integration, runtime, and acceptance authority.

## Stable Objective

Make the installed aggregate `GET /status` and `auracall api status` path
complete within the existing default five-second client budget on the current
AuraCall corpus, without deleting status evidence, weakening payload semantics,
or launching provider/browser work.

## Current State

- Main-aligned recovery merged through PR 17 at canonical receipt
  `1fdd4d088d0c0374f97e3482e31e23736af1d877`; provider-free source integration
  is complete and installed proof remains pending. The historical candidate's diagnosis measured
  local claims at 5.1 seconds, archive hydration at 3.9-6.0 seconds, and repeated
  browser/job readback. Its source timings (4.76, 4.18, 1.53 seconds) are historical,
  not current installed acceptance.
- Recovery retains recorded checksums for availability reads, probes at most
  one byte through a read-only file handle, preserves directory/read errors,
  and excludes bundle-only legacy directories from persisted-record listings.
- The full combined HTTP run reproduced the historical identity-keyed fixture
  failure (325 passed, 1 failed). That fixture enabled unrelated startup
  reconciliation and expected zero remaining from two remote artifacts and one
  local artifact. It now disables startup resume/reconciliation and asserts one
  remaining artifact. Production materialization arithmetic is unchanged.
- Provider-free receipts are recorded in
  `docs/dev/notes/2026-09-16-issue-9-provider-free-recovery.md`: 327 combined
  affected tests passed, followed by 218 HTTP tests after strengthening the
  availability-preference and immutable-registry assertions. ASL-R5 and the
  installed/publication portions of ASL-R6 remain unproved.
- A post-test cwd census found unexpected managed Chrome PID `14066`, port
  `45013`, using `wsl-chrome-2/chatgpt` with `about:blank`. Source checks pass,
  but zero browser effect is disproved; see the receipt for exact provenance.
  The worker did not attach or terminate. The primary verified and terminated
  the exact six attributable Chrome/crashpad processes and reports a clean
  profile-path census. This cleaned test-induced side effect does not establish
  the original zero-browser-effect invariant; installed proof remains open.

## Historical Baseline | 2026-08-25

- Plan 0314 restored `chatgpt/wsl-chrome-3` live follow and normal scheduler
  operation. Narrow completion and scheduler diagnostics remain responsive.
- Aggregate status completes only with a larger 30-second budget, observed in
  11-22 seconds. Three consecutive default installed probes timed out with
  `exit 124` after 7.2-7.8 seconds.
- API PID `62038` is active/running with zero restarts. The latest scheduled
  live-follow pass completed without backpressure and exact browser cleanup.
- The aggregate response combines several persisted/runtime projections. The
  expensive component and multiplicity are not yet proved; source changes are
  forbidden until a measured, falsifiable diagnosis identifies them.

## Authority And Bounds

- The operator approved the recommended separate bounded performance plan.
- One critical-path owner; the 2026-09-16 recovery packet records the current
  user-authorized delegation exception to the historical no-subagent rule.
- Build a fast red-capable timing loop before source diagnosis. Record 3-5
  ranked falsifiable hypotheses before profiling or instrumentation.
- One bounded profiling/instrumentation pass and one diagnosis-backed repair
  slice. Temporary instrumentation must use one searchable debug prefix and be
  removed before closeout.
- A client-timeout-only change cannot satisfy this plan. Preserve current
  aggregate payload semantics unless a separately documented contract defect
  proves a field should move or disappear.
- Provider/browser work, prompt/composer action, materialization, cache/data
  deletion, and destructive recovery are out of scope.
- Installed adoption permits at most one supported install/service restart.
  Before it, pause the account-mirror scheduler at most once from a clean idle
  ownership state; after installed latency proof and clean ownership, resume it
  at most once. Hard stop on an active pass, provider guard, unknown ownership,
  exact managed-browser presence, or any human-verification surface.

## Execution Graph

1. Publish P08 custody and preserve the installed default-status timing repro.
2. Minimize the repro and rank/test 3-5 falsifiable cost hypotheses using
   CodeGraph plus measured profiling at the real aggregation seams.
3. Add a regression at the narrowest seam that reproduces the multiplicative
   cost, then implement the smallest semantics-preserving repair.
4. Run focused/affected provider-free validation, typecheck, lint, build,
   CodeGraph, plan audit, and diff hygiene.
5. From clean scheduler/browser ownership, install once and prove three
   consecutive default-budget aggregate reads plus narrow endpoint parity.
6. Resume the scheduler once, verify normal scheduled posture, record evidence,
   and close P08.

## Acceptance Criteria

- `ASL-R1`: one agent-runnable timing command reproduces the exact installed
  default-status timeout in at least 3/3 baseline runs.
- `ASL-R2`: profiling proves the dominant aggregate-status cost and its call
  multiplicity; the accepted hypothesis, rejected alternatives, and measured
  before/after evidence are durable.
- `ASL-R3`: a regression test exercises the real expensive call pattern and
  fails before the fix, then passes after it without removing response fields.
- `ASL-R4`: focused and affected tests, typecheck, scoped lint, build,
  CodeGraph, plan audit, and diff hygiene pass.
- `ASL-R5`: installed source is byte-identical; three consecutive default
  `auracall api status --json` probes complete successfully within five seconds
  each, while narrow completion/scheduler endpoints remain responsive.
- `ASL-R6`: one install/restart maximum, one scheduler pause/resume maximum,
  no provider/browser effect, no duplicate ownership, zero restart loop, clean
  Git/origin parity, and reconciled P08 documentation.

## Non-Goals

- No live-follow semantic change, retry-policy change, scheduler cadence
  change, provider selector change, browser automation, or account mutation.
- No status-field deletion, payload split, stale-data substitution, or broad
  cache architecture rewrite merely to hit the timing target.
- No cleanup of unrelated processes, branches, worktrees, or persisted data.

## Definition Of Done

- All six criteria have current source, installed, and runtime evidence.
- The default status command succeeds on the real current corpus without a
  larger timeout, and normal scheduler operation is restored after proof.
- P08 is closed/integrated with the measured root cause and durable lesson.
