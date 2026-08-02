# ChatGPT Same-Route Mutation And Staged Re-enablement | 0180-2026-08-01

State: OPEN
Lane: P01
Plan version: 12

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
- The latest separately authorized default-profile canary
  `acctmirror_completion_ec8ec770-b33c-47ba-8f9c-049bf9b97588` completed one
  collector pass with zero duplicate same-route mutations and no rate-limit,
  provider guard, CAPTCHA, verification, identity conflict, or second pass.
  Owned job `hmj_b092ea72656f437bb7f7ace64b20e401` then failed once with 0
  materialized, 6 skipped, and 1 `retrieval_failed`; therefore M5 remains open
  and the live packet is consumed without retry.
- The failed asset belongs to
  `https://chatgpt.com/c/67ccf9d7-9310-8004-b5e1-478dba6eab3a` and is
  `2025-02-03 Step Growth Part 2-20250203_120935-Meeting Transcript.docx`.
  Direct CDP inspection on the correct `default` browser profile found the exact
  live chat, exact file tile, provider file id, and MIME type. One authenticated
  in-page fetch to the tile's `files-download` endpoint returned HTTP 200 JSON
  with `error_code = file_not_found`, `error_type = GetDownloadLinkError`, and
  `status = error`. The provider has therefore confirmed this exact asset is
  unavailable; the visible tile is stale.
- The canary exposed a provider-free lifecycle defect: the bounded parent
  reported `completed` before its owned job settled failed. Commit `fd5587c2`
  now keeps bounded and live-follow operations nonterminal through owned-job
  settlement and blocks failures with
  `account_mirror_materialization_failed`. It is pushed and installed under API
  PID `77948`, with scheduler and completion pauses intact.
- Provider-free regression `bd69437f` repairs the observed
  `json_missing_download_url` parser boundary. ChatGPT file-download JSON may
  now yield a signed URL as the JSON string itself, through the established
  `download_url`, or through bounded shallow/nested URL fields. Malformed and
  error-only JSON still fail as `retrieval_failed`; response identity checks
  remain mandatory before bytes are written. The commit is pushed and installed
  at API PID `91466` with source/runtime hash parity. This removes one known
  retrieval defect but does not prove that the exact transcript is currently
  retrievable; its availability remains unknown until a separately authorized
  one-attempt canary.
- Successor Plan 0181 completed five additional provider-free repairs: bounded
  response-shape evidence, structured availability classification, strongest-
  failure retention, effective capture polling deadlines, and aborting per-stage
  fetch timeouts. Commits through `91fd08da` are pushed and installed under API
  PID `66696` with source/runtime parity and all pauses intact. These repairs
  improve the next exact-file attempt but do not change M5 or prove the
  transcript available.
- Commit `ff45b48f` repairs the final diagnostic gap exposed by direct CDP:
  ChatGPT's live error envelope uses snake-case `error_code`, `error_type`, and
  `error_message`, while the capture parser previously normalized only camel-
  case keys. The installed adapter now maps both forms into structured evidence,
  so this response becomes terminal `provider_unavailable` rather than generic
  `retrieval_failed`. The historical receipt is not rewritten. M5 and all
  re-enablement gates remain open because the consumed canary still materialized
  0/1 and no successful replacement live proof has run.
- The separately authorized one-attempt positive-control job
  `hmj_4295f645a45a4cfd881bdc6c4d7c871a` addressed the exact catalog item
  `ChE 4470-5470 Exam 2 Spring 2025.docx`, but its receipt proved AuraCall
  attempted a different cached file, `2025-01-22 Introduction...Transcript.docx`.
  That different file returned provider-confirmed `file_not_found`; the job
  failed 0/1 and was not retried. Commit `eccb3780` now carries the selected
  catalog file identity through provider work and excludes every nonmatching
  file before `maxItems` is applied. It is pushed and installed under API PID
  `29769`; the repair is provider-free green but has not received another live
  attempt. M5 and re-enablement remain open.
- The next separately authorized exact-asset proof
  `hmj_50e7aa9598be44fc950ddb1b89d4ca2f` proved the selector repair live: the
  requested, attempted, and failed entry all identify `ChE 4470-5470 Exam 2
  Spring 2025.docx`, including provider file id
  `file_000000005a1471fd8c7c84bc199426d4`. The provider returned HTTP 403 JSON
  `{"detail":"Forbidden"}` from the matched `files-download` endpoint, so
  AuraCall correctly retained non-retryable `retrieval_failed` rather than
  claiming deletion, expiry, or provider unavailability. The job ran once,
  materialized 0/1, and was not retried. M5 and re-enablement remain open.
- Operator verification after that proof found working DOCX links near the end
  of the same chat. They download as
  `ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh-1.docx` at about
  99.48 KB, consistent with the preserved 99,476-byte local Exam DOCX. This
  disproves any working assumption that the intended document itself vanished;
  the remaining defect is a download-route/identity mismatch between the 403
  provider-file endpoint and the later live chat control. Fresh-session work is
  governed by
  `docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md`.

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
- `installed_evidence`: commit `8485446c` is pushed at ahead/behind `0/0` and
  installed under active API PID `37737`. Source/installed SHA-256 parity is
  `17e91822f828db82250ed6403f5bcd57bcdf9e5c1ae14f0ead3981e140478b3d`
  for the ChatGPT adapter and
  `a6b0a58ff7410f08e4ab65562cbd4d55c3b935d3af5d7e09a99a5897c1267151`
  for the response server. Restart readback reports scheduler `paused`, five
  active records all paused, and `activeCompletionId=null`.
- `next_gate`: the M5 acceptance box remains open. Another live pass requires a
  new explicit operator authorization and is not part of this packet;
  scheduler/continuous re-enablement remains prohibited before that proof.

## Checkpoint 6

- `plan_version`: 5
- `progress_classification`: live gate failed closed; two provider-free runtime
  boundaries repaired and installed.
- `live_receipt`: bounded completion
  `acctmirror_completion_3cec1299-f0ce-4511-9fc8-705b5e042312` started at
  `2026-08-01T16:53:39.877Z`. Conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19` completed reload mutation
  `df81db64-e7e9-42c9-a950-cfa0c31db9de` at
  `2026-08-01T17:01:02.561Z`, then reopened and started reload mutation
  `3fd5ff00-d16e-4609-ac80-f5594aa1d306` at
  `2026-08-01T17:01:46.158Z`. Diagnostics emitted
  `repeated-same-route-attempt`, and the operator cancelled at
  `2026-08-01T17:02:13.119Z` without a retry.
- `post_cancel_receipt`: the pre-repair in-flight collector continued after
  cancellation, advanced pass count to 1, and queued job
  `hmj_153db2c1a1b54933b3518027478298c`. The job terminated with 1 materialized,
  6 skipped, and 1 `retrieval_failed` across 4 conversations. Provider-session
  proof matched the configured default ChatGPT account; no rate-limit, ChatGPT
  provider guard, CAPTCHA, verification, or identity conflict appeared.
- `repair`: ChatGPT detail chunks now retain their scoped provider session and
  use `preserveActiveTab=true` for continuation, so a cursor cannot reopen or
  reload the already-loaded route. Completion cancellation and API shutdown now
  abort the active refresh signal; a collector that resolves despite abort
  cannot increment the pass or create materialization work.
- `validation`: focused and adjacent suites pass 274/274. Full-suite effective
  result is 303 files and 2,689 tests passing with 65 live/TTY skips after one
  unrelated 5-millisecond rolling-budget timing miss passed in isolation.
  TypeScript, production build, lint with 207 retained warning-level
  diagnostics, and diff hygiene pass.
- `installed_evidence`: commits `fc924d69` and `b3629d10` are pushed at
  ahead/behind `0/0` and installed under active API PID `75678`. Source and
  installed SHA-256 match for the collector
  `70bead7fce9096207591254ff4f750ccc213f914fcc3ae56699a5d77602e7973`
  and completion service
  `93dfcf30ff84ffb03ad33c6f2ca03fe8bd7fbb4a84c45e72fbd57244b45d41ee`.
  Readback reports scheduler `paused`, five retained completions all paused,
  zero active materialization jobs, idle background drain, and clear
  `chatgpt/default` provider guard.
- `next_gate`: M5 remains open because the canary produced both a duplicate
  mutation and one failed retrieval. Do not rerun it or re-enable scheduler or
  continuous live follow without a fresh explicit operator authorization.

## Checkpoint 7

- `plan_version`: 6
- `progress_classification`: same-route repair proved live; materialization and
  bounded-parent truth failed closed; provider-free lifecycle repair installed.
- `live_receipt`: completion
  `acctmirror_completion_ec8ec770-b33c-47ba-8f9c-049bf9b97588` started at
  `2026-08-01T18:02:32.269Z`, ran exactly one full-sweep/full-missing-assets
  pass, and queued owned job `hmj_b092ea72656f437bb7f7ace64b20e401`.
  Browser diagnostics recorded zero duplicate same-route attempts. Provider-
  session proof matched email, plan, structure, and account-level dimensions.
- `hard_stop_result`: the owned job ran once and failed at
  `2026-08-01T18:14:24.102Z` with 0 materialized, 6 skipped, and 1
  `retrieval_failed`. The exact failed file is
  `2025-02-03 Step Growth Part 2-20250203_120935-Meeting Transcript.docx` in
  `https://chatgpt.com/c/67ccf9d7-9310-8004-b5e1-478dba6eab3a`.
  Tile matching and fallback occurred, but HTTP 200 `files-download` JSON
  omitted a download URL (`json_missing_download_url`). Availability remains
  unknown; do not relabel it provider unavailable or expired.
- `repair`: bounded completion now loops through owned materialization
  settlement before evaluating its pass cap or mirror-complete terminal branch.
  A terminal failed job hydrates its outcome and blocks the parent with
  `account_mirror_materialization_failed`; the backfill ledger remains
  `in_progress` with a pending retrieval cursor rather than claiming terminal
  unavailability.
- `validation`: account-mirror suites pass 256/256; the full provider-free suite
  passes 303 files and 2,689 tests with 65 live/TTY skips. TypeScript, production
  build, lint with the 207-warning baseline, and diff hygiene pass.
- `installed_evidence`: commit `fd5587c2` is pushed and installed under active
  API PID `77948`. Source/installed completion-service SHA-256 is
  `c0e51d641ef2df6f582b78c5421881bb9b894b4f801e7e48fb98609efa72cdd7`.
  Scheduler remains paused, five active completions are all paused, active
  history-materialization jobs are zero, background drain is idle, and current
  duplicate same-route attempts are zero.
- `next_gate`: M5 remains open because materialization yielded 0/1 and failed
  retrieval. No retry is authorized. Keep scheduler and continuous live follow
  disabled while the ChatGPT user-uploaded-file retrieval lane is repaired
  provider-free; any later live proof requires a new explicit operator gate.

## Checkpoint 8

- `plan_version`: 7
- `progress_classification`: provider-free user-uploaded-file retrieval repair
  installed; live acceptance remains open.
- `root_cause`: the ChatGPT `files-download` capture path accepted only an
  object-valued `download_url`. The failed HTTP 200 JSON response could therefore
  contain a usable signed URL in another bounded provider shape and still be
  reported as `json_missing_download_url`.
- `repair`: one self-contained resolver now accepts an absolute or root-relative
  URL from a JSON string, the established `download_url`, bounded shallow URL
  aliases, or one `data`/`result` wrapper. Non-URL strings, malformed URLs, and
  provider error objects remain failures. The existing requested-file identity
  validation still gates every filesystem write.
- `validation`: focused ChatGPT adapter coverage passes 119/119; adjacent
  adapter, file-service, history-materialization, and completion suites pass
  295/295. TypeScript, production build, and lint with the retained 207-warning
  baseline pass. Full validation reached 302 passing files and 2,689 passing
  tests with one unrelated lease-heartbeat timing failure; its single bounded
  rerun passed.
- `installed_evidence`: commit `bd69437f` is pushed at ahead/behind `0/0` and
  installed under API PID `91466`. Source/installed ChatGPT adapter SHA-256 is
  `a31b375cc44cf692cc464651f6a99b73c4ae7855a9514199080c69f376a06d1d`.
  Scheduler remains paused, five retained completions are paused, active
  completion and active materialization-job counts are zero, background drain
  is idle, and duplicate same-route attempts remain zero.
- `next_gate`: do not infer that the exact transcript exists or is downloadable
  from the parser repair alone. M5 remains open. Any exact-file retrieval proof
  is a new one-attempt live canary requiring explicit operator authorization;
  scheduler and continuous live follow remain disabled.

## Checkpoint 9

- `plan_version`: 8
- `progress_classification`: provider-free blocker reduction complete; live
  acceptance remains open.
- `successor_evidence`: Plan 0181 closed five separately red/green retrieval
  defects in commits `300c7846`, `1bf89ae9`, `99bd8398`, `10183b39`, and
  `91fd08da`. Full validation passes 303 files/2,695 tests, typecheck, build,
  lint at 207 warnings, and installed adapter parity.
- `runtime_state`: API PID `66696`; scheduler and five completions paused; zero
  queued/running/idle-waiting completions, zero active materialization jobs,
  idle background drain, and zero duplicate same-route attempts.
- `next_gate`: M5 remains open. Only a new explicit authorization may consume
  one no-retry exact-file canary; continuous live follow and scheduler resume
  remain separately prohibited.

## Checkpoint 10

- `plan_version`: 9
- `progress_classification`: exact asset availability resolved; re-enablement
  acceptance remains open.
- `direct_cdp_evidence`: the `default` ChatGPT browser profile on CDP port
  `45011` loaded conversation `67ccf9d7-9310-8004-b5e1-478dba6eab3a` with title
  `ChE 4470 Study Guide`. The exact transcript tile exposed provider file id
  `file-8HnH6aAzRZWcY2932eNuJY` and DOCX MIME. Its authenticated download endpoint
  returned HTTP 200 JSON with `file_not_found`, `GetDownloadLinkError`, and
  `status = error`; no rate-limit, CAPTCHA, verification, or blocking surface
  appeared. The single diagnostic tab was closed after inspection.
- `repair`: `summarizeChatgptDownloadProviderError` normalizes both camel-case
  and live snake-case provider error keys. Structured classification now records
  this exact response as non-retryable `provider_unavailable`; transport, browser,
  malformed-payload, and identity failures remain `retrieval_failed`.
- `validation`: focused and adjacent coverage pass 301/301; the full provider-
  free suite passes 303 files/2,696 tests with 65 skips. Typecheck, production
  build, lint at the retained 207-warning baseline, and diff hygiene pass.
- `installed_evidence`: commit `ff45b48f` is pushed and installed under API PID
  `31885`. Source/installed ChatGPT adapter SHA-256 is
  `936b88c4775c0681dffc267c24e5b139679af546d4ebadde92fc16decda51074`.
  Scheduler state is paused; all five active completions are paused; queued,
  running, and idle-waiting completions are zero; active history-materialization
  jobs are zero; background drain is idle.
- `next_gate`: do not retry this confirmed-unavailable file and do not rewrite
  its historical receipt implicitly. M5 remains open because no asset was
  materialized. Scheduler and continuous live follow remain disabled pending a
  separately reviewed successful-materialization proof and explicit
  re-enablement authority.

## Checkpoint 11

- `plan_version`: 10
- `progress_classification`: positive-control attempt failed closed and exposed
  exact-catalog-selection drift; provider-free repair installed; live acceptance
  remains open.
- `authorized_attempt`: job `hmj_4295f645a45a4cfd881bdc6c4d7c871a` used the
  `default` AuraCall runtime profile, exact file catalog item, `files` only,
  `maxItems = 1`, `force = true`, and a 300-second provider-work timeout. It ran
  once with four-dimension provider-session match, one CDP attachment, two
  `Runtime.evaluate` calls, zero physical browser mutations, and no retry.
- `failure_evidence`: despite the requested Exam DOCX catalog ID, the persisted
  manifest attempted the Introduction transcript because catalog resolution
  narrowed only to the conversation and kind before applying `maxItems`. The
  different transcript returned structured `file_not_found` and was correctly
  classified non-retryable `provider_unavailable`. Result: 0 materialized, 1
  failed. The already-local Exam DOCX remained byte-identical at SHA-256
  `a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b`.
- `repair`: selected file catalog identity now travels in the provider-work
  context as exact catalog ID, name, and provider file ID. Conversation-file
  enumeration excludes every nonmatching file before `maxItems` selection, so
  an exact catalog request cannot silently transfer another file.
- `validation`: the red regression failed on the missing selector and passes
  after repair. Focused history/file coverage passes 112/112; full provider-free
  validation passes 303 files/2,697 tests with 65 skips. Typecheck, production
  build, lint at the retained 207-warning baseline, and diff hygiene pass.
- `installed_evidence`: commit `eccb3780` is pushed and installed under API PID
  `29769`. Source/installed history-materialization service SHA-256 is
  `76edbae8094e0b22a88f23b713cf4033cfd78d7e5e87fbc0c74ff03850e1029c`.
  Scheduler remains paused, all five retained completions remain paused, queued/
  running/idle-waiting completions and active materialization jobs are zero,
  background drain is idle, and duplicate same-route mutations remain zero.
- `next_gate`: the one-attempt live packet is consumed. Do not retry it or infer
  re-enablement authority from the provider-free repair. M5 still requires a
  separately authorized exact-asset success after review; scheduler and
  continuous live follow remain disabled.

## Checkpoint 12

- `plan_version`: 11
- `progress_classification`: exact selector proved live; provider retrieval
  failed closed; live acceptance remains open.
- `authorized_attempt`: job `hmj_50e7aa9598be44fc950ddb1b89d4ca2f`
  requested the exact Exam DOCX catalog item with `files` only, `maxItems = 1`,
  `force = true`, and a 300-second provider-work timeout. It ran once under the
  `default` AuraCall runtime and browser profiles with four-dimension provider-
  session match and no retry.
- `selector_evidence`: the persisted entry now has the exact requested catalog
  ID, exact title `ChE 4470-5470 Exam 2 Spring 2025.docx`, and remote provider
  identity `file_000000005a1471fd8c7c84bc199426d4`. The prior wrong-file
  selection did not recur, proving installed commit `eccb3780` on the live path.
- `failure_evidence`: the matched endpoint returned HTTP 403 JSON with
  `detail = Forbidden`; no structured unavailable/not-found/expired signal was
  present. AuraCall therefore recorded non-retryable `retrieval_failed`, not
  `provider_unavailable`. Downloads were attempted 1, succeeded 0, failed 1;
  metrics were materialized 0 and failed 1. The pre-existing local Exam DOCX
  remained byte-identical at SHA-256
  `a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b`.
- `runtime_state`: API PID `29769`; scheduler and all five completions remain
  paused; queued/running materialization jobs are zero; duplicate same-route
  browser mutations remain zero. Telemetry recorded one target open plus two
  attachments and no rate-limit, CAPTCHA, verification, or identity conflict.
- `next_gate`: the exact-selector defect is live-closed, but M5 is not satisfied
  because the job materialized 0/1. Do not retry this consumed packet or resume
  scheduler/continuous live follow. A successful materialization proof requires
  a newly reviewed target whose provider endpoint is demonstrably retrievable
  and separate explicit authorization.

## Checkpoint 13

- `plan_version`: 12
- `progress_classification`: operator evidence corrects the working diagnosis;
  fresh-agent download-route investigation is ready.
- `operator_evidence`: links near the end of the exact chat download
  `ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh-1.docx` at about
  99.48 KB. This is consistent with the preserved 99,476-byte Exam DOCX and
  means the intended artifact is available through a live chat control despite
  the exact catalog provider-file endpoint returning 403.
- `remaining_gap`: bind the later live control to the requested catalog asset
  without weakening Plan 0180 M6 cross-asset identity checks. Preserve the
  actual provider filename and distinguish a catalog alias from the downloaded
  asset identity.
- `handoff`: the next session must start from
  `docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md`,
  perform one read-only CDP/DOM inspection on the retained `default` browser
  profile, then build a provider-free red/green repair. No browser click,
  materialization retry, scheduler resume, or continuous live-follow
  re-enablement is authorized by this checkpoint.
