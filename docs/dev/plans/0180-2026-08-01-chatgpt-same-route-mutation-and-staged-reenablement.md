# ChatGPT Same-Route Mutation And Staged Re-enablement | 0180-2026-08-01

State: OPEN
Lane: P01
Plan version: 15

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
  99.48 KB. Local verification then separated two blobs: the requested catalog-
  named DOCX is 108,667 bytes at SHA-256 `a6ef6841...`, while a distinct later
  generated-output DOCX is 99,476 bytes at SHA-256 `480b6881...`. The operator's
  `...fresh-1.docx` was not checksummed by this agent. The remaining question is
  therefore whether the later control is safely related to the requested asset,
  not a proven alternate route to identical bytes. Fresh-session work is
  governed by
  `docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md`.
- Packet A provider-free diagnosis confirms the requested catalog file and
  later `download-dom` output are separate assets and that existing response
  identity validation rejects cross-asset capture. It also found a distinct
  blocker: artifact catalog items do not carry exact selected-asset identity
  into provider work, so `maxItems = 1` can select an earlier artifact. Packet B
  now filters eligible raw candidates by exact artifact identity before ChatGPT
  family deduplication and `maxItems`. Direct ID outranks URI, URI-only rows
  remain URI-selected, and source/title fallbacks require one unambiguous
  candidate. Final independent review passed; browser and live gates remain
  closed.

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
  99.48 KB. This proves a later generated-output control is downloadable; it
  does not prove byte or logical identity with the requested catalog asset.
- `remaining_gap`: bind the later live control to the requested catalog asset
  without weakening Plan 0180 M6 cross-asset identity checks. Preserve the
  actual provider filename and distinguish a catalog alias from the downloaded
  asset identity.
- `handoff`: the next session must start from
  `docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md`,
  perform provider-free identity diagnosis first, and stop at the browser gate
  if no retained `default` target exists. No browser launch or click,
  materialization retry, scheduler resume, or continuous live-follow
  re-enablement is authorized by this checkpoint.

## Checkpoint 14

- `plan_version`: 13
- `progress_classification`: regression corrected; unsafe implementation
  inference removed; provider-free diagnosis is ready.
- `identity_correction`: the catalog-named local DOCX has SHA-256
  `a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b`
  and size 108,667 bytes. The separately preserved generated-output DOCX has
  SHA-256
  `480b68813ebbcadf9f5089f0119329fd4a2cecd1a2176aca632688140e27ded6`
  and size 99,476 bytes. The operator-observed `...fresh-1.docx` remains an
  unchecksummed third observation. The `480b...` blob also retains multiple
  filesystem aliases, including the quarantined January transcript association;
  the context snapshot binds the valid generated output to download artifact
  `download-dom:a71ab5c2-df5f-4f77-a9de-b235cd876154:0`. Size, checksum reuse,
  and filename aliases are not provider/source identity evidence.
- `runtime_gate`: API PID `29769`, scheduler paused, five completions paused,
  queued/running materialization jobs zero, and browser mutations zero. The
  earlier managed `default` browser PID is gone and CDP port `45011` is closed;
  no retained target exists to inspect under the prior no-launch authority.
- `packet_boundary`: Packet A may inspect persisted evidence, use CodeGraph,
  and create a provider-free red-capable diagnosis/fixture plan. It may not
  implement product code, install, launch a browser, click a control, or run a
  live materialization. Each later packet requires review and the applicable
  explicit gate.
- `next_gate`: complete Packet A and review its evidence. If live DOM evidence
  remains necessary, obtain explicit authorization to launch exactly one
  managed `default` ChatGPT target for read-only inspection.

## Checkpoint 15

- `plan_version`: 14
- `progress_classification`: blocker reduction; unsafe artifact fallback
  identified provider-free before browser work.
- `route_diagnosis`: catalog files flow through `downloadConversationFile` and
  generated `download-dom` items flow through `materializeConversationArtifact`.
  Existing capture validation accepts only the requested provider-file URL or
  exact response filename, and focused cross-asset/download-button regressions
  pass 2/2. The later artifact is not a safe implicit fallback for the 403 file.
- `persisted_evidence`: the requested file belongs to message
  `d69912db-e287-4c61-bd33-a12ff3f97c04`; generated artifact
  `download-dom:a71ab5c2-df5f-4f77-a9de-b235cd876154:0` belongs to message
  `d6018171-1609-460c-aa5a-976b6483910f`. No persisted relationship field joins
  them.
- `red_loop`: a temporary expectation at the existing artifact-catalog test
  required exact selected artifact identity. The focused Vitest command failed
  1/1 because provider work received only the conversation target and
  `assetKinds: ["artifacts"]`, with no fourth `selectedCatalogAsset` argument.
  The temporary assertion was removed and the unchanged baseline passed 1/1.
- `root_cause`: `HistoryMaterializationSelectedCatalogAsset` supports only
  `kind: "file"`; `selectedCatalogFileFromCatalogItem` returns null for artifact
  items; and `excludeArtifact` applies only family exclusions, not exact catalog
  identity, before `maxItems`.
- `next_gate`: review Packet B in the handoff. The proposed provider-free repair
  adds a discriminated artifact selector and filters exact artifact identity
  before budget. Do not install, launch a browser, click, or run a catalog-
  artifact materialization until the repair and its validation are reviewed.

## Checkpoint 16

- `plan_version`: 15
- `progress_classification`: Packet B provider-free implementation and review
  complete; browser/live gate unchanged.
- `implementation`: selected catalog identity is now a discriminated file/
  artifact selector. Exact artifact selection runs against eligible raw
  candidates before ChatGPT family deduplication and `maxItems`.
- `identity_precedence`: direct artifact ID is strongest; URI is authoritative
  only without a direct ID, and URI-derived lookup keys are not IDs. Message/
  turn fields are compared by domain and, with title/kind when present, must
  narrow to exactly one candidate. Title-only fallback is unique-only.
- `tdd_receipt`: coverage proves exact later `download-dom` selection, same-
  title ambiguity rejection, shared message/turn rejection, shared-URI ID
  precedence, URI-only selector construction, and pre-budget filtering.
- `review_receipt`: one bounded read-only auditor found pre-selector dedup,
  non-unique source matching, shared-URI precedence, and URI-only catalog typing
  edges. All were reconciled; final closure audit passed with no findings. The
  reviewed `llmService.ts` seam expansion is necessary for pre-dedup selection.
- `validation`: focused history/ChatGPT/LLM tests 239/239; typecheck, production
  build, touched-file lint, repository lint with the existing 207-warning
  baseline, plan audit with zero validation errors, and diff hygiene pass. One
  initial full-suite run had an unrelated Gemini spacing assertion miss by 2 ms
  and its exact rerun passed; the remediated suite then passed 303 files/2,699
  tests with 65 skips. Final validation is recorded in the commit receipt.
- `runtime_gate`: no install, browser launch, click, provider request, live
  materialization, scheduler resume, or completion resume occurred. M5 and all
  re-enablement gates remain open.

## Checkpoint 17

- `plan_version`: 16
- `state_transition`: Packet B complete -> one fresh M5/M6 positive-control
  packet authorized and awaiting installed parity.
- `progress_classification`: bounded live target preparation; M5 remains open
  until the packet reaches its terminal evidence.
- `authorization`: the operator authorized one new root ChatGPT conversation
  containing exactly one user-uploaded source file, one prompt asking ChatGPT
  to generate a DOCX artifact, a wait for the turn to finish, and exact
  materialization verification of both assets.
- `control_identity`: source fixture
  `docs/dev/fixtures/auracall-m5-source-20260802T185953Z.txt`, control ID
  `AURACALL-M5-20260802T185953Z`, requested generated filename
  `auracall-m5-20260802T185953Z.docx`.
- `preflight`: API PID `29769`; scheduler operator-paused; five retained
  completions paused; target counts queued `0` / running `0`; active history
  materialization jobs `0`; all four ChatGPT provider guards clear.
- `hard_bounds`: one chat, one uploaded file, one submitted turn, one generated
  DOCX, and at most one materialization job for the fresh conversation. No
  retry, scheduler resume, completion resume, unrelated provider work, or
  automatic re-enablement decision.
- `hard_stops`: stop on upload mismatch, missing fresh conversation identity,
  response timeout, rate limit, CAPTCHA, verification, identity conflict,
  duplicate same-route mutation, ambiguous asset identity, any failed
  materialization, or loss of paused zero-work posture.
- `acceptance`: the terminal turn exposes the exact upload and generated DOCX
  as distinct provider assets; the bounded materialization receipt selects
  both exact identities, writes both local files, and the local upload bytes
  match the source fixture while the DOCX is a valid ZIP/OOXML document that
  contains the control ID. Passing this packet satisfies M5 but does not by
  itself authorize scheduler or continuous live-follow re-enablement.

## Checkpoint 18

- `plan_version`: 17
- `state_transition`: fresh M5/M6 positive-control packet authorized -> hard-
  stopped and consumed on provider mismatch; no retry authorized.
- `progress_classification`: no M5 progress; the live attempt exposed a CLI
  provider/model binding defect before any ChatGPT or materialization work.
- `install_receipt`: Packet B installed successfully at API PID `81726`.
  Source and installed SHA-256 hashes match for
  `historyMaterializationService.js` (`7d91d7265a4bfe95bda28e78df3127ec06de139a3cf685229c821c8bf259a2f2`)
  and `llmService.js` (`a52eeaac94d20ef7e3de6aa8fe0a7579177c556d71a7c42c0e31a21f03a4ba09`).
- `incident`: the installed CLI invocation included
  `--browser-target chatgpt` but no explicit model. Resolution retained default
  model `grok-4.20`, selected `https://grok.com/`, reused the preexisting
  managed Grok browser, uploaded the sole fixture, and submitted the prompt
  before the provider mismatch was visible in command output.
- `wrong_provider_evidence`: read-only DOM inspection found completed Grok
  conversation `3d5d24dd-ec36-426c-b48f-836f0629652f`, title
  `AURACALL-M5-20260802T185953Z DOCX Created - Grok`, the exact visible upload
  `auracall-m5-source-20260802T185953Z.txt`, and generated file control
  `auracall-m5-20260802T185953Z.docx`. The assistant confirmation includes the
  exact control ID and says the required three-item list was included.
- `acceptance_result`: not run for the authorized provider. No ChatGPT request
  occurred; no history-materialization job was created; neither asset was
  locally materialized or validated. Wrong-provider UI evidence cannot satisfy
  M5 or M6.
- `post_stop_posture`: API PID `81726`; scheduler paused; five retained
  completions paused; queued/running targets `0`/`0`; all four ChatGPT provider
  guards clear; active history-materialization jobs `0`. The reused preexisting
  Grok browser was left open and idle to avoid disrupting operator state. The
  interrupted local AuraCall session still reports `running` and is not a
  terminal receipt.
- `next_gate`: first repair or otherwise prove provider/model binding with a
  provider-free pre-submit assertion. A later positive control must explicitly
  bind a ChatGPT model and requires fresh operator authorization; do not reuse
  this consumed packet or materialize its Grok artifacts.

## Checkpoint 19

- `plan_version`: 18
- `state_transition`: provider-mismatch hard stop -> provider-free repair green;
  one new explicitly model-bound ChatGPT attempt authorized by the operator's
  `continue` instruction.
- `red_receipt`: the public `buildBrowserConfig` regression passed
  `model: "grok-4.20"` with `browserTarget: "chatgpt"` and resolved target
  `grok`; the focused Vitest command failed 1/1 on that exact symptom.
- `root_cause`: target derivation gave a recognized Grok or Gemini model higher
  precedence than an explicit `browserTarget`, allowing incompatible explicit
  intent to reach browser profile resolution and submission.
- `repair`: infer the model provider once and reject a recognized explicit
  target/model conflict during config construction. Compatible explicit pairs,
  model-only inference, and unknown-model fallback retain their existing
  behavior.
- `green_receipt`: `tests/cli/browserConfig.test.ts` passes 31/31. The operator
  contract now requires `--browser-target` and recognized provider model to
  agree.
- `live_authorization`: after validation, commit, install, and exact source/
  installed parity, run at most one new root ChatGPT conversation with the same
  sole fixture and requested DOCX. Bind both `--browser-target chatgpt` and an
  explicit ChatGPT model. Preserve Checkpoint 17's remaining hard bounds and
  stop conditions; no Grok reuse, cross-provider materialization, or retry.

## Checkpoint 20

- `plan_version`: 19
- `state_transition`: provider-free target/model repair green -> corrected
  ChatGPT packet hard-stopped and consumed before upload/submission.
- `validation_and_commit`: the exact mismatch regression first failed 1/1 and
  then `tests/cli/browserConfig.test.ts` passed 31/31. Typecheck, production
  build, touched-file lint, plan audit, and diff hygiene passed. Commit
  `1fda7598` is pushed with `origin/main...HEAD` at `0 0`.
- `install_receipt`: source and installed `dist/src/cli/browserConfig.js` both
  have SHA-256
  `ee91c9f19e287fad8d1c502a5f711967a72fc40101c12e31edcd27f206b16680`.
  API service is active at PID `62920` with zero restarts.
- `pre_submit_guard_proof`: the original explicit ChatGPT target with ambient
  `grok-4.20` model now fails with the target/model conflict before browser
  mutation. The corrected command explicitly bound target `chatgpt` and model
  `gpt-5.2`.
- `live_result`: the corrected command resolved `https://chatgpt.com/`, managed
  profile `/home/ecochran76/.auracall/browser-profiles/default/chatgpt`, and
  dedicated target `F8C1F1ACD3BE681B15B4672B37950F83`. It passed the login
  DOM check, then failed provider-session preflight with `ChatGPT provider-
  session authorization is missing; browser selection cannot authorize a
  provider login.`
- `mutation_boundary`: no file upload, prompt submission, model response,
  conversation ID, generated DOCX, or materialization occurred. Session
  `m5-fresh-docx-control-chatgpt` is terminal `error`; its model receipt is also
  `error`. The history-materialization index has zero active jobs and no job
  created after `2026-08-02T19:52:00Z`.
- `post_stop_posture`: API PID `62920`; scheduler paused; five active
  completions all paused; queued/running targets `0`/`0`; active history-
  materialization jobs `0`. The reused ChatGPT browser remains open on port
  `45011` per `--browser-keep-browser`.
- `next_gate`: repair or provision canonical provider-session authorization
  through a provider-free reviewed packet. Do not infer authorization from
  browser selection or a successful login DOM check, and do not retry the live
  control without another explicit operator authorization.

## Checkpoint 21

- `plan_version`: 20
- `state_transition`: missing root provider-session authority -> provider-free
  execution-boundary repair green; one new live ChatGPT attempt authorized and
  gated on commit, install, and parity.
- `authorization`: the operator's `ok go` authorizes the provider-free repair
  and exactly one new explicitly target/model-bound ChatGPT control after the
  repaired runtime is installed and verified. Checkpoint 17's remaining hard
  bounds and stops remain unchanged.
- `root_cause`: stored/API execution built canonical provider-session authority
  from selected runtime configuration, but root CLI inline, detached, and setup
  verification paths passed browser configuration without that authority. The
  configured default ChatGPT account identity exists; browser login state was
  not used as a substitute.
- `repair`: one CLI helper constructs canonical authorization from the selected
  AuraCall runtime profile, browser profile, source browser profile, managed
  browser profile, and configured account identity. Session execution injects
  it only into the browser call, leaving persisted session configuration and
  metadata unchanged. Runtime PID and target remain bound later by the existing
  canonical preflight.
- `privacy_boundary`: verbose browser configuration logs replace the authority
  object with a redacted summary containing provider, expectation source,
  presence booleans, and session context; that configuration diagnostic does
  not serialize configured email or service-account identifiers. Existing
  observed-account preflight diagnostics are a separate surface.
- `tdd_receipt`: the execution-boundary regression failed because browser work
  received no authorization; the canonical constructor and redacted-summary
  regressions failed because those helpers did not exist; and the root binding
  regression failed because its CLI module did not exist. After repair, the
  focused packet passes 5 files/60 tests.
- `validation`: focused 5 files/60 tests and the full provider-free suite at
  304 files/2,704 tests with 65 skips pass. Typecheck, production build,
  touched-file lint, plan audit with zero validation errors, and diff hygiene
  pass. Commit/push, install, parity, and live evidence remain pending at this
  checkpoint.

## Checkpoint 22

- `plan_version`: 21
- `state_transition`: root provider-session repair green -> installed/live
  authorization proven -> fresh two-asset materialization partial failure;
  M5 remains open and the live packet is consumed.
- `commit_and_install`: commit `068608e7` is pushed with
  `origin/main...HEAD` at `0 0`. Installed/source SHA-256 parity matches for
  `auracall.js` (`2c485736...`), `browserProviderSession.js`
  (`26a7b5bd...`), `sessionRunner.js` (`421b14e7...`), and
  `providerSessionAuthority.js` (`18948f4f...`). API PID `96156` is active with
  zero restarts.
- `live_turn`: session `m5-chatgpt-docx-authority-proof` completed in 3m31s
  using explicit target `chatgpt`, model `gpt-5.2`, and exactly one uploaded
  505-byte fixture. Canonical account preflight passed, the sent message
  retained the upload, and fresh conversation
  `6a6fa606-9870-83ea-9bdd-090d134ec58f` returned one downloadable
  `auracall-m5-20260802T185953Z.docx` artifact.
- `materialization_job`: the sole authorized job
  `hmj_6de2e65fda214587bccb054bda1977d9` refreshed exactly 2 messages, 1 file,
  and 1 artifact. Provider-session proof matched email, plan, structure, and
  account-level dimensions on PID `27020`, target
  `FB9AC8AB5EE0C14585DEDF16384ED6C8`.
- `docx_result`: artifact
  `download-dom:30ef7f99-9285-4351-8a41-02e6dd51aa54:0` materialized by its
  download button at 38,665 bytes with SHA-256
  `fb6cba5f0c4c8cd8a441d9186ded18092362edc3747d1ef186d737706115692a`.
  ZIP validation passes; `[Content_Types].xml` and `word/document.xml` exist;
  document text contains the exact control ID, one-upload provenance sentence,
  and all three required list items.
- `upload_result`: the exact TXT tile and provider file ID were discovered, but
  `files-download` returned HTTP 403 JSON `Forbidden` without a downloadable
  URL. It is terminal `retrieval_failed`, non-retryable, with no local path or
  checksum. The original local fixture remains 505 bytes at SHA-256
  `5d17e7ec1b61d4c6eaaefbb3bfd8ae542bb5a373113a506c681ade0aa641044b`,
  but that source copy is not provider materialization proof.
- `acceptance_result`: FAIL. The job envelope is `succeeded` because one asset
  materialized, but its own metrics are materialized 1 / failed 1. Both assets
  were not locally materialized, so M5 and every scheduler/continuous-live-
  follow gate remain open. No retry or second job ran.
- `post_stop_posture`: API PID `96156`; scheduler operator-paused; five active
  completions all paused; completion queued/running `0`/`0`; active history-
  materialization jobs `0`. The retained ChatGPT browser remains open on port
  `45011` under the authorized keep-browser setting.
- `next_gate`: repair aggregate materialization truth so any failed requested
  asset cannot produce a successful job envelope, then diagnose the fresh
  upload's 403 route provider-free. Any new provider attempt requires separate
  operator authorization.
