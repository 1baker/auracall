# ChatGPT Same-Route Mutation And Staged Re-enablement | 0180-2026-08-01

State: OPEN
Lane: P01
Plan version: 4

## Stable Objective

Eliminate redundant same-route ChatGPT browser mutations that can bypass the
operator-visible live-follow interaction budget, then prove exactly one bounded
default-account collector/materializer pass before any continuous or scheduler
reenablement.

## Current State

- M1-M4 and M6 are installed and provider-free green. All four ChatGPT targets
  retain the conservative 6/min interaction ceiling and 120-second action
  cooldowns.
- The account-mirror scheduler and five unrelated completions remain paused;
  no queued, running, or idle-waiting work remains.
- The single newly authorized default-profile canary
  `acctmirror_completion_a49a13cf-7cf0-42b6-851a-fac101d0e342` was cancelled
  fail-closed during pass 0. It issued a second payload-recovery reload for the
  exact same conversation 3.448 seconds after the first 95.381-second reload
  completed.
- No materialization job, provider guard, rate-limit, CAPTCHA, verification,
  identity conflict, or second pass occurred. The live packet is consumed and
  must not be retried without new explicit authorization.
- The provider-free follow-up repair makes the settled payload retry
  direct-fetch-only and extends diagnostics to identify repeated same-route
  `navigate` or `reload` start attempts while the second mutation is still in
  flight. Commit/install parity remains before any future live gate.

## Architecture Decision

Keep provider-specific route intent in the ChatGPT adapter, but enforce physical
same-route suppression and mutation accounting at the existing browser-service
navigation/governor seam. Do not add another scheduler, collector-local throttle,
or compatibility alias.

One public behavior must hold: requesting a conversation already loaded in the
attached browser target must not emit another physical navigation unless the
caller explicitly invokes a governed recovery action. Every recovery navigation
or reload must consume the same interaction-governor policy as the provider
action that caused it.

## Bounded Execution Packet

Owner: primary implementation lane.

Expected write surface:

- existing browser-service navigation/mutation interface;
- ChatGPT adapter wiring only if needed to carry governed recovery intent;
- focused browser/provider tests;
- live-follow pacing configuration;
- this plan, `docs/dev/dev-journal.md`, `docs/dev-fixes-log.md`, and affected
  operator documentation.

Terminal condition: provider-free validation and installed/source parity are
green with the scheduler and unrelated completions still paused, followed by at
most one separately gated default ChatGPT bounded pass.

## Milestones

### M1 | Deterministic Red Characterization

- Add one fast provider-free test through the existing navigation/provider
  interface that starts on the requested conversation route.
- Prove the current implementation emits a redundant physical navigation or
  permits a recovery mutation without governor accounting.
- Minimize the fixture until every remaining action is required to reproduce
  the defect.

### M2 | Deep-Seam Repair

- Make same-route navigation a successful no-op after canonical URL comparison.
- Keep query/hash semantics explicit; do not suppress a materially different
  route.
- Route intentional recovery reload/navigation through the existing interaction
  governor and mutation diagnostics.
- Preserve current behavior when the target is not already on the requested
  route or its route cannot be read reliably.

### M3 | Conservative Pacing And Provider-Free Validation

- Set all four configured ChatGPT live-follow targets to 6 browser interactions
  per minute while retaining the 120-second action-specific cooldowns and the
  current full-sweep/full-missing-assets policy.
- Run the focused red/green test, adjacent browser/provider/account-mirror tests,
  typecheck, clean build, lint, plan audit, and diff hygiene.
- Record the behavioral change and durable lesson in operator documentation.

### M4 | Install And Paused-Posture Proof

- Commit and push the green repair before installation.
- Install the committed runtime and prove source/installed parity plus a new API
  PID.
- Verify the scheduler remains paused, all unrelated completions remain paused,
  provider guards remain clear, and queued/running work remains zero.

### M5 | One Default Bounded Canary

- Start exactly one `chatgpt/default` completion with `maxPasses=1`.
- Do not resume the scheduler or another completion and do not retry.
- Require terminal collector/materializer provider-session parity, zero failed
  materializations, zero redundant same-route physical mutations, no provider
  guard/rate-limit/CAPTCHA/verification signal, and restored zero-work posture.

### M6 | Exact Asset Capture And Availability Truth

- Add a provider-free regression proving a response for a generated artifact
  cannot be persisted under a requested user-uploaded file identity.
- Scope viewer fallback controls to the surface opened by the matched file tile
  and require response identity evidence before writing bytes.
- Persist an explicit distinction between provider-confirmed unavailability and
  an unsuccessful retrieval whose underlying availability remains unknown.
- Keep both outcomes out of automatic live-follow retry cadence while exposing
  them separately to completion receipts and recovery planning.
- Quarantine the known January transcript false materialization without
  deleting the preserved evidence or the valid generated exam DOCX.

## Acceptance Criteria

- [x] A deterministic test fails on redundant same-route physical navigation.
- [x] The same test passes through the existing deep navigation/provider seam.
- [x] Every physical recovery navigation/reload is governed and represented in
  operator-visible interaction evidence.
- [x] All four ChatGPT targets read back 6/min plus the existing 120-second
  action cooldowns without changing sweep/materialization policy.
- [x] Targeted and broad provider-free validation pass.
- [x] The committed repair is pushed, installed, and hash-bound to the running
  API while scheduler/completion pauses remain intact.
- [ ] Exactly one default bounded pass satisfies the M5 terminal evidence with
  no retry or unrelated work.
- [x] Cross-asset capture fails closed before filesystem or archive mutation.
- [x] Provider-unavailable and retrieval-failed assets remain separately
  queryable and are not collapsed into one terminal-failure count.

## Non-Goals

- No global scheduler resume or multi-profile live campaign.
- No continuous live-follow start in this plan.
- No metadata-only mode or weakened materialization policy.
- No provider login, account switching, cookie copying, CAPTCHA handling, or
  provider-guard clearing.
- No weakening of provider-session identity/provenance authority.

## Hard Stops

- Stop before live work if the red regression cannot reproduce a real physical
  mutation through the correct interface.
- Stop if the fix requires a second independent throttle rather than deepening
  the existing governor/navigation seam.
- Stop if install or restart starts any unrelated provider work; restore the
  persisted pause before continuing.
- Stop immediately on any rate-limit, provider guard, CAPTCHA, verification,
  identity conflict, failed materialization, or second-pass signal.
- The live packet is one attempt. Failure consumes it; no retry without a new
  explicit operator authorization.

## Definition Of Done

The plan closes only when redundant same-route physical mutations are prevented
and governed by deterministic tests, conservative pacing is installed, paused
runtime parity is proved, and one exact default bounded pass completes with
truthful session/materialization receipts and no safety signal. Scheduler and
continuous live-follow reenablement remain separately gated afterward.

## Checkpoint 1

- `plan_version`: 1
- `progress_classification`: substantive
- `evidence`: deterministic provider-free tests reproduced unconditional
  same-route `Page.navigate` and an ungoverned ChatGPT payload reload. Both are
  green after deepening `navigateAndSettle`/`reloadAndSettle`, carrying provider
  options through conversation readiness, and wiring ChatGPT recovery mutations
  through the existing governor. Focused suites pass 166/166 and adjacent suites
  pass 285/285; TypeScript passes.
- `runtime_state`: installed API remains on the prior binary with scheduler and
  completion pauses intact. All four ChatGPT config targets are staged at 6/min
  with unchanged 120-second action cooldowns and retrieval policy.
- `validation`: full provider-free suite passes 303 test files and 2,680 tests,
  with 65 opt-in/TTY tests skipped. Clean build, TypeScript, lint with zero
  errors and 205 retained warning diagnostics, plan audit, and diff hygiene
  pass.
- `next_gate`: broad provider-free validation, commit/push, install/hash parity,
  paused-posture readback, then at most one exact default bounded pass.

## Checkpoint 2

- `plan_version`: 2
- `progress_classification`: substantive
- `installed_evidence`: commit `d96f574d` is pushed at ahead/behind `0/0` and
  installed under API PID `33973`. Source/installed hashes match for
  browser-service UI
  `08e21c409207280c8163e9a7a026c62dc1390ed0077b9eafddd4f174b67b5354`
  and ChatGPT adapter
  `6807aed7bca4276a05164435292048261dfffa37a67f75836c37385d164d9406`.
  All four ChatGPT targets read back 6/min, three 120-second cooldowns, full
  sweep, full missing assets, and clear provider guards.
- `canary_evidence`: completion
  `acctmirror_completion_a3b0bf86-3ffe-481e-8bda-97a86abddc6a` completed
  exactly one pass. Its browser mutation bundle contains two legitimate target
  opens, two governed payload reloads, zero duplicate same-route attempts, and
  no rate-limit/guard/CAPTCHA signal.
- `hard_stop`: owned job `hmj_71011a4ee5a14c8b97a836f9600b5517`
  failed on attempt 1 with 0 materialized, 2 skipped, and 6 failed across 2
  conversations. Provider-session proof matched email, plan, structure, and
  account-level dimensions. The refreshed conversation was routeable, all six
  file tiles matched, and every fallback returned HTTP 200 `files-download`
  JSON without a download URL (`json_missing_download_url`), persisted as
  `missing_provider_link`.
- `runtime_state`: scheduler and five unrelated completions are paused;
  queued/running/idle-waiting completions are zero; background drain is idle;
  provider guard and rate-limit detection remain clear.
- `next_gate`: the live packet is consumed and must not be retried. Keep Plan
  0180 OPEN while a provider-free asset-download discovery repair is designed,
  regression-tested, committed, and installed. Any later live proof requires a
  fresh explicit authorization; scheduler/continuous re-enablement remains
  separately gated.

## Checkpoint 3

- `plan_version`: 3
- `progress_classification`: substantive correction
- `evidence`: job `hmj_c8901dc025c64af29a9f8f7e2e555608` used the
  `default` runtime and managed browser profiles. Its generated exam DOCX is a
  valid 99,476-byte archive, while the January transcript entry marked
  materialized has the identical SHA-256 and contains the exam, proving
  cross-asset aliasing. A follow-up probe against `wsl-chrome-3` was the wrong
  account lane and is excluded from default-profile availability evidence.
- `repair_gate`: execute M6 provider-free with vertical red/green tests. Do not
  start a browser, retry the consumed canary, or change scheduler/completion
  pause state.

## Checkpoint 4

- `progress_classification`: M6 complete; the plan remains open at the
  separately authorized live-canary and staged-reenablement gates.
- `implementation`: fallback Download discovery is scoped to one viewer dialog;
  captured bytes require provider-file-id or exact response-filename evidence;
  file manifests, history results, completion receipts, and recovery planning
  preserve `provider_unavailable` versus `retrieval_failed`.
- `runtime_repair`: the false January transcript association is quarantined in
  both archive indexes with its evidence path and checksum preserved. The valid
  generated exam DOCX remains materialized and unchanged.
- `validation`: 303 test files and 2,685 tests passed; typecheck, lint, build,
  install, installed-code parity, active service, and paused scheduler parity
  passed. No browser or provider request was run.

## Checkpoint 5

- `plan_version`: 4
- `progress_classification`: live gate failed closed; bounded provider-free
  remediation complete.
- `live_receipt`: completion
  `acctmirror_completion_a49a13cf-7cf0-42b6-851a-fac101d0e342` started at
  `2026-08-01T15:52:52.389Z` and was operator-cancelled at
  `2026-08-01T15:56:05.006Z` during `backfill_history`, before pass or
  materialization completion. Mutation `29da5703-f6a3-45a8-b8c9-bd8d48fb097b`
  reloaded conversation `6a303b38-a97c-8333-8103-d47ce9a110cd` from
  `15:53:07.067Z` through `15:54:42.448Z`; mutation
  `59e723d6-a084-4223-9bc9-6d04f4d971a0` started the same reload at
  `15:54:45.896Z`.
- `hard_stop_result`: scheduler stayed paused, active completion returned to
  null, and no materialization cursor/outcome, guard, rate-limit, CAPTCHA,
  verification, identity conflict, or second pass appeared. The diagnostics
  counter incorrectly remained zero because it only classified completed
  same-route `navigate` rows.
- `repair`: the second payload probe after DOM settling now preserves the active
  tab, allowing its authenticated direct fetch but forbidding another reload.
  Scheduler diagnostics also classify consecutive same-source, same-kind,
  same-route `navigate`/`reload` starts within five minutes, including an
  in-flight second attempt.
- `validation`: focused ChatGPT adapter, HTTP server, and scheduler diagnostics
  suites pass 338/338. The full provider-free suite passes 303 files and 2,687
  tests with 65 live/TTY skips; TypeScript, production build, repository lint
  with 207 retained warning-level diagnostics, plan audit with zero validation
  errors, and diff hygiene pass.
- `next_gate`: commit/push, install, and prove paused runtime parity. The M5
  acceptance box remains open; another live pass requires a new explicit
  operator authorization and is not part of this packet.
