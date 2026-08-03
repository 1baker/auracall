# Plan 0180 ChatGPT Download-Route Fresh-Agent Handoff

Date: 2026-08-02
State: Packet B and target/model guard installed; corrected control stopped on missing ChatGPT session authority
Governing plan: `docs/dev/plans/0180-2026-08-01-chatgpt-same-route-mutation-and-staged-reenablement.md`
Scope: diagnose whether the direct-route catalog asset and later generated output are safely related; do not resume live follow or spend another materialization attempt

## 2026-08-02 Resume-Boundary Update

Packet B is installed at API PID `81726` with source/installed parity. The
separately authorized fresh ChatGPT positive control did not reach ChatGPT:
`--browser-target chatgpt` was combined with no explicit model, the CLI retained
default `grok-4.20`, and the request was submitted to Grok conversation
`3d5d24dd-ec36-426c-b48f-836f0629652f`.

Read-only inspection confirmed that wrong-provider turn contains the exact TXT
upload and generated DOCX control, but no materialization ran. Do not use those
Grok assets as M5 evidence. The packet is consumed, the preexisting Grok browser
was left open and idle, and the interrupted local session still reports
`running`. Scheduler and five completions remain paused; queued/running targets,
active materialization jobs, and ChatGPT guards remain zero/clear. Repair or
prove the provider/model binding before requesting fresh authorization for one
explicitly model-bound ChatGPT attempt.

The subsequent provider-free guard is commit `1fda7598` and is installed with
source/installed `browserConfig.js` hash `ee91c9f...`. One newly authorized,
explicitly model-bound attempt then reached the correct `default/chatgpt`
managed profile but stopped before upload/submission because canonical ChatGPT
provider-session authorization was absent. Session
`m5-fresh-docx-control-chatgpt` is terminal `error`; it has no conversation ID,
and no materialization job was created. Do not retry or infer account authority
from its successful login DOM check. The next packet is provider-free diagnosis
or repair of canonical provider-session authorization.

## Mission

Determine why AuraCall resolves the exact Exam DOCX catalog item to provider
file id `file_000000005a1471fd8c7c84bc199426d4`, receives HTTP 403 `Forbidden`
from that `files-download` endpoint, and stops, while the operator can download
a later generated-output DOCX near the end of the same chat as:

`ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh-1.docx`

The operator reports the downloaded file is about 99.48 KB. The current agent
did not repeat or checksum that manual download. A separately preserved local
generated-output DOCX is 99,476 bytes, but the requested catalog-named local
DOCX is a different 108,667-byte blob. Treat the operator observation as strong
input about route availability, not as proof that either local file is the same
asset. Independently bind the live DOM/control identity before changing code.

The currently authorized outcome is a provider-free identity diagnosis and a
red-capable fixture/repair plan. Implementation is a separate reviewed packet.
Any later browser launch, download click, or live proof also requires explicit
operator authorization.

## Authority Order

1. `AGENTS.md` and the relevant files under `docs/dev/policies/`.
2. This handoff for the current resume boundary.
3. Plan 0180, especially Current State, M5, M6, Hard Stops, and Checkpoints
   10-14.
4. `ROADMAP.md` and `RUNBOOK.md` Turn 391 for current lane and runtime posture.
5. Persisted job receipt:
   `/home/ecochran76/.auracall/runtime/archive/history-materialization-jobs/index.json`,
   job `hmj_50e7aa9598be44fc950ddb1b89d4ca2f`.
6. Browser/materialization implementation and tests, discovered structurally
   through CodeGraph before native source search.
7. Live DOM/CDP evidence from the retained `default` ChatGPT browser profile.

Do not treat the earlier chat transcript or a stale port/PID in this note as
live authority. Re-read current runtime state first.

## Exact Target And Known Evidence

- Chat URL:
  `https://chatgpt.com/c/67ccf9d7-9310-8004-b5e1-478dba6eab3a`
- Chat title observed previously: `ChE 4470 Study Guide`
- Requested catalog title:
  `ChE 4470-5470 Exam 2 Spring 2025.docx`
- Exact catalog item ID:
  `67ccf9d7-9310-8004-b5e1-478dba6eab3a:d69912db-e287-4c61-bd33-a12ff3f97c04:0:ChE 4470-5470 Exam 2 Spring 2025.docx`
- Provider file ID used by the failed direct route:
  `file_000000005a1471fd8c7c84bc199426d4`
- Operator-observed download filename near the end of the chat:
  `ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh-1.docx`
- Requested catalog-named local blob:
  `ChE 4470-5470 Exam 2 Spring 2025.docx`, SHA-256
  `a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b`,
  108,667 bytes.
- Separately preserved generated-output local blob:
  `ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh.docx`, SHA-256
  `480b68813ebbcadf9f5089f0119329fd4a2cecd1a2176aca632688140e27ded6`,
  99,476 bytes.
- That `480b...` blob also remains reachable under multiple preserved filenames,
  including the quarantined false January transcript association. The context
  snapshot independently identifies the generated output as download artifact
  `download-dom:a71ab5c2-df5f-4f77-a9de-b235cd876154:0` in message
  `d6018171-1609-460c-aa5a-976b6483910f`. Blob aliases are defect evidence, not
  asset-identity authority.
- The operator-observed `...fresh-1.docx` has not been checksummed by this
  agent. Its reported size does not establish byte or logical identity with
  either preserved blob.
- Failed proof job:
  `hmj_50e7aa9598be44fc950ddb1b89d4ca2f`, one attempt, 0 materialized,
  1 failed, non-retryable `retrieval_failed`.
- Direct-route failure shape: HTTP 403, JSON `{"detail":"Forbidden"}`,
  `json_missing_download_url`, matched tile, fallback attempted.
- The exact-selector repair itself is live-proven: the failed job attempted the
  requested Exam item, not the earlier Introduction transcript.

## Critical Identity Boundary

Keep these identities separate:

- AuraCall runtime profile: `default`
- browser profile: `default`
- source browser profile: `Default`
- managed browser profile:
  `/home/ecochran76/.auracall/browser-profiles/default/chatgpt`
- provider account/session: the configured default ChatGPT account, authorized
  only by provider-app evidence
- blob checksum: byte identity only; never provider/source identity
- archive or filesystem alias: preserved provenance evidence only; a prior
  quarantined alias is not authority to join assets

Do not use `wsl-chrome-3` for this chat. Do not infer provider login from Chrome
browser sign-in. Browser identity is provenance; provider-app evidence is
provider-session authority.

## Current Working Diagnosis

The catalog selector is no longer the primary defect. The remaining question
crosses two provider surfaces and at least two distinct local byte identities:

1. AuraCall follows the exact catalog file tile/provider-file endpoint and gets
   403 from what may be a stale or non-downloadable file identity.
2. The chat's later generated-output/download controls expose a live DOCX with
   a different provider-supplied filename. Its relationship to the catalog
   asset is unproven.

This is not yet proof that the two surfaces share one safe materialization
identity. The repair must bind the selected chat output/control to the requested
catalog asset using source-local evidence, response filename, and byte/content
identity. Do not accept a nearby downloadable DOCX merely because its size or
extension looks plausible.

## Startup Commands

Run from `/home/ecochran76/workspace.local/auracall`:

```bash
git log --oneline -5
git status --short --branch
git rev-list --left-right --count origin/main...HEAD
sed -n '1,240p' AGENTS.md
sed -n '1,360p' docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md
sed -n '1,720p' docs/dev/plans/0180-2026-08-01-chatgpt-same-route-mutation-and-staged-reenablement.md
sed -n '1,240p' README.md
sed -n '1,260p' docs/testing.md
sed -n '1,240p' docs/dev/plans/0008-2026-04-14-browser-profile-family-refactor.md
sed -n '1,240p' docs/dev/plans/0001-2026-04-14-execution.md
sed -n '1,240p' docs/dev/browser-service-upgrade-backlog.md
sed -n '1,576p' docs/dev/browser-service-tools.md
tail -n 220 docs/dev-fixes-log.md
```

Verify the fail-closed runtime before any browser inspection:

```bash
systemctl --user show auracall-api.service -p MainPID -p ActiveState -p SubState -p ExecStart
/home/ecochran76/.local/bin/auracall api scheduler-diagnostics --json
/home/ecochran76/.local/bin/auracall api mirror-completions --status paused --limit 10 --json
/home/ecochran76/.local/bin/auracall api history-materialization-jobs --status queued --json
/home/ecochran76/.local/bin/auracall api history-materialization-jobs --status running --json
```

Read the exact receipt without launching browser work:

```bash
jq '.[] | select(.id == "hmj_50e7aa9598be44fc950ddb1b89d4ca2f")' \
  /home/ecochran76/.auracall/runtime/archive/history-materialization-jobs/index.json
```

Reproduce the local identity ledger without opening a browser:

```bash
rg --files /home/ecochran76/.auracall | \
  rg 'a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b|480b68813ebbcadf9f5089f0119329fd4a2cecd1a2176aca632688140e27ded6' | \
  while IFS= read -r file; do sha256sum "$file"; stat -c '%s %n' "$file"; done
```

## Packet A | Provider-Free Diagnosis

1. Use CodeGraph context first for the ChatGPT conversation-file listing,
   `downloadConversationFile`, response capture, viewer/download-control
   fallback, file identity validation, and history materialization selection
   flow. Use one explore call for the surfaced symbol bodies.
2. Reconstruct the two existing local asset identities and their discovery/
   materialization provenance from persisted manifests and context snapshots.
3. Build one deterministic provider-free red-capable fixture or harness that
   fails if a forbidden catalog-file endpoint is allowed to alias a distinct
   later generated output without explicit relationship evidence.
4. Rank the remaining hypotheses and define the exact DOM/control evidence that
   would distinguish them. Do not assume the generated output is a replacement
   for the requested catalog asset.
5. Design the narrowest prospective repair at the existing ChatGPT adapter/
   browser-service seam, but do not implement it in Packet A.
6. Require response/control identity before filesystem or archive mutation.
   Preserve the actual provider filename and represent any catalog alias
   explicitly; never rewrite one asset's bytes under another asset identity.

## Packet A Result

Packet A is complete without browser or product-code mutation:

- CodeGraph proves catalog files and `download-dom` generated outputs use
  separate materialization routes. `downloadConversationFile` cannot safely
  substitute a later generated artifact, while `materializeConversationArtifact`
  preserves the artifact's own ID, title, URI, and filename.
- Existing response identity validation is correctly fail-closed: a captured
  `files-download` URL must contain the requested provider file ID, or the
  response `Content-Disposition` filename must exactly normalize to the
  requested filename. The focused cross-asset and download-button-selection
  regressions pass 2/2.
- Persisted context lists the requested catalog file as provider file
  `file_000000005a1471fd8c7c84bc199426d4` on message
  `d69912db-e287-4c61-bd33-a12ff3f97c04`, and independently lists generated
  artifact `download-dom:a71ab5c2-df5f-4f77-a9de-b235cd876154:0` on message
  `d6018171-1609-460c-aa5a-976b6483910f`. No persisted relationship field joins
  them.
- A separate provider-free defect blocks the seemingly safe artifact route:
  exact file catalog items carry `selectedCatalogAsset` and filter before
  `maxItems`, but artifact catalog items resolve only to the conversation and
  `assetKinds: ["artifacts"]`. `HistoryMaterializationSelectedCatalogAsset`
  currently permits only `kind: "file"`, and artifact selection has no exact-ID
  filter before `maxItems`.
- A temporary assertion in
  `tests/runtime.historyMaterializationService.test.ts` required artifact catalog
  item `artifact_catalog_1` to reach materialization as an exact artifact
  selector. The command below failed deterministically because the fourth
  provider-work argument was absent. The temporary assertion was then removed,
  and the unchanged baseline test passed.

```bash
pnpm vitest run tests/runtime.historyMaterializationService.test.ts \
  -t 'resolves account mirror artifact catalog items from nested conversation metadata'
```

The red finding means no browser proof or catalog-artifact job is safe yet: an
exact generated-output request could select an earlier artifact before the
one-item budget is applied.

## Packet B | Implemented Exact-Artifact Selection Repair

Packet B is provider-free complete. Review expanded its bounded write surface
from the history service into `src/browser/llmService/llmService.ts` and its
focused tests because exact selection must run against eligible raw candidates
before ChatGPT same-title family deduplication and `maxItems`.

1. Extend `HistoryMaterializationSelectedCatalogAsset` into a discriminated
   `file | artifact` selector without weakening the existing file branch.
2. Build the artifact selector from catalog item ID, title, URI, kind, message/
   turn identity, and other provider-local identifiers that the catalog already
   preserves. Prefer exact IDs/URIs; use normalized title only when identifier
   evidence is unavailable and unambiguous.
3. Apply `matchesHistoryMaterializationSelectedCatalogArtifact` before
   `maxItems`, just as exact file selection is applied before the file budget.
4. Add red/green regressions for an earlier unrelated artifact, a same-title
   ambiguous artifact, and the exact `download-dom` item. Preserve the existing
   cross-asset response-identity tests.
5. Run focused history, ChatGPT adapter, and LLM file tests, followed by
   typecheck, build, lint baseline, plan audit, and diff hygiene. Commit and push
   the provider-free repair, but do not install or launch a browser until the
   separate runtime gate is reviewed.

Implementation result:

- Artifact catalog rows now carry direct artifact ID, URI, title, kind,
  message ID, and turn ID. Direct ID is strongest, URI is used when no direct
  ID exists, and URI-derived catalog lookup keys are not artifact IDs.
- Eligible raw artifacts are selector-filtered before ChatGPT family dedup and
  the item budget. Message/turn and title fallbacks require one field-scoped,
  kind-compatible candidate; shared source, shared URI with conflicting IDs,
  and same-title ambiguity fail closed.
- Independent audit findings were reconciled in the same slice. Final closure
  audit passed with no findings.
- Focused history, ChatGPT adapter, and LLM tests pass 239/239. Typecheck,
  touched-file lint, production build, plan audit, and diff hygiene pass.

## Browser Inspection Gate

The previously recorded managed `default` Chrome PID is gone and CDP port
`45011` is closed. No retained target is presently available. Stop here unless
the operator separately authorizes launching exactly one Chrome process against
the existing managed `default` browser profile. If authorized, use the repo
browser tools, verify provider-session identity before DOM inspection, make no
click or download, and stop on every existing browser hard stop.

## Packet A Acceptance Criteria

- [x] The local identity ledger records both preserved blobs without conflating
  filename, checksum, size, catalog identity, or generated-output provenance.
- [x] A deterministic provider-free command is red-capable for unsafe cross-asset
  aliasing in the 403-direct-route/later-control shape.
- [x] The diagnosis names the evidence still required to relate the later control
  to the requested catalog item.
- [x] A prospective repair preserves actual provider filenames and keeps Plan 0180
  M6 cross-asset identity checks intact.
- [x] No product-code implementation, install, browser launch, download, or live
  materialization occurs in Packet A.

## Packet B Acceptance Criteria

- [x] Exact artifact identity is carried from catalog resolution into provider
  work without weakening exact-file behavior.
- [x] Selection and ambiguity evaluation occur before ChatGPT deduplication and
  `maxItems`.
- [x] Direct ID, URI-only, shared-URI, shared-message/turn, same-title ambiguous,
  and exact `download-dom` cases are provider-free covered.
- [x] Independent findings were reconciled and final audit passed.
- [x] No install, browser launch, click, provider request, live materialization,
  scheduler resume, or completion resume occurred.

## Hard Stops And Non-Authorizations

- Do not resume the scheduler or continuous live follow.
- Do not resume any retained completion.
- Do not create or retry a history-materialization job.
- Do not click the near-end download control during the initial read-only CDP
  inspection.
- Never auto-click ChatGPT's `Answer now` button.
- Stop immediately on rate limit, provider guard, CAPTCHA, verification, login,
  account mismatch, or browser-profile mismatch.
- Do not launch Chrome against the managed `default` browser profile without a
  new explicit operator authorization; there is no retained target now.
- Do not use `wsl-chrome-3` as a substitute when `default` is unavailable.
- Do not weaken response identity checks, accept size-only identity, or restore
  the quarantined January transcript alias.
- One later live attempt, if explicitly authorized, is no-retry and does not
  authorize scheduler/continuous re-enablement.

## Current Runtime Snapshot

Verified immediately before this handoff:

- HEAD before the handoff commit: `0c91c7506947e5ebe1c7c811b5f8b92cc6549dc5`
- `origin/main...HEAD`: `0 0`
- worktree: clean
- API: active under PID `29769`
- scheduler: paused
- retained completions: 5 paused
- queued/running history-materialization jobs: 0/0
- browser mutations: 0
- duplicate same-route attempts: 0
- managed `default` Chrome target: absent; recorded PID gone and port `45011`
  closed

Re-read these values; they are a snapshot, not permission to mutate.

## 2026-08-02 Root CLI Authorization Repair Addendum

- The operator authorized a provider-free repair and exactly one later
  ChatGPT-bound upload/DOCX attempt after commit, install, and parity.
- Root cause is now localized: root inline, detached, and setup-verification
  browser execution omitted the canonical provider-session authority already
  used by stored/API execution. The default configuration does contain the
  configured ChatGPT account identity.
- The repair constructs authority from the selected AuraCall runtime profile,
  browser profile, managed profile, and configured identity, then injects it
  only at the browser execution boundary. Runtime Chrome PID and target remain
  bound by the existing canonical preflight.
- Provider-free validation at this checkpoint: focused 5 files/60 tests,
  full suite 304 files/2,704 tests with 65 skips, typecheck, production build,
  touched lint, zero-error plan audit, and diff hygiene pass. Commit/push,
  install parity, and the one live attempt remain pending.
- Configured email and service-account identifiers are excluded from persisted
  session configuration and from the browser-config authority serialization;
  that diagnostic emits only redacted presence/source and non-secret
  provenance fields. Existing observed-account preflight output is separate.

## 2026-08-02 Fresh Control Terminal Addendum

- Commit `068608e7` is pushed and installed byte-identically. API PID `96156`
  is active with zero restarts; scheduler and all five active completions remain
  paused; completion queued/running is `0`/`0`; active materialization jobs are
  zero after the packet.
- Session `m5-chatgpt-docx-authority-proof` completed in 3m31s. It passed
  canonical default-account proof, uploaded exactly the 505-byte fixture, and
  created fresh conversation `6a6fa606-9870-83ea-9bdd-090d134ec58f` with one
  generated `auracall-m5-20260802T185953Z.docx` download.
- Sole job `hmj_6de2e65fda214587bccb054bda1977d9` discovered exactly one file and
  one artifact. Four account-proof dimensions matched. The DOCX materialized
  by exact `download-dom:30ef7f99-9285-4351-8a41-02e6dd51aa54:0` identity at
  38,665 bytes and SHA-256 `fb6cba5f...`; ZIP/OOXML and required-text checks
  pass.
- The uploaded TXT did not materialize. Its exact `files-download` endpoint
  returned HTTP 403 JSON `Forbidden` with no URL, classified non-retryable
  `retrieval_failed`. Metrics are 1 materialized / 1 failed even though the job
  envelope says `succeeded`.
- The packet is consumed with no retry or second job. M5 remains open. The next
  provider-free packet should repair aggregate job status and diagnose the
  fresh upload route; any later live attempt requires separate authorization.

## 2026-08-02 Source Preview Correction Addendum

- The HTML and screenshot supplied by the operator belong to
  `auracall-m5-source-20260802T185953Z.txt`, not the generated DOCX.
- Clicking that uploaded source tile opens a previewer whose upper-right
  control is an exact `button[aria-label="Download"]`. The operator used it
  successfully.
- The resulting `/home/ecochran76/Downloads/auracall-m5-source-20260802T185953Z.txt`
  is 505 bytes and SHA-256 `5d17e7ec...`; it is byte-identical to the submitted
  fixture (`cmp=0`). ChatGPT source availability is therefore proven.
- The AuraCall defect is narrower: `clickViewerDownload` required exactly one
  visible `[role="dialog"]`, so it could miss the current role-less source
  preview and fall through to the 403 direct route.
- The provider-free repair snapshots exact visible Download buttons before
  tile activation and clicks only the sole newly visible exact control. The
  old single-dialog fallback remains for older layouts. No install, live retry,
  scheduler resume, or continuous-live re-enablement is authorized by this
  correction.

## 2026-08-02 Aggregate Truth Repair Addendum

- The operator authorized provider-free aggregate repair, installation/parity
  of both pending fixes, and exactly one later no-retry ChatGPT two-asset proof.
- A public history-service regression reproduced the consumed receipt exactly:
  one materialized entry, one failed entry, result `materialized`, and durable
  job `succeeded`.
- The repaired runner publishes result/job `failed` whenever a real selected
  transfer entry fails, including mixed project-source transfers. Synthetic
  routeability placeholders and provider-guard evidence retain their existing
  dedicated semantics.
- Provider-free validation passes 304 files/2,705 tests with 65 skips plus
  typecheck, production build, touched lint, zero-error plan audit, and diff
  hygiene. Commit/install/live proof remain the next serialized gates.

## 2026-08-02 Fresh Preview Proof Terminal Addendum

- Aggregate commit `8cca7962` and preview commit `004eaf25` are pushed and
  installed with exact source/runtime parity. API PID `86598` was active with
  zero restarts; scheduler and all five completions were paused and no
  materialization job was active before the proof.
- Session `m5-chatgpt-docx-preview-proof` completed exactly one prompt using
  exactly the sole 505-byte fixture in fresh ChatGPT conversation
  `6a6fb365-db60-83ea-803e-42007bbc1c61`.
- Sole job `hmj_f4fde42cd30644699e534d5568a6f914` discovered one file and one
  artifact. All four provider-account proof dimensions matched. The generated
  DOCX materialized through the current previewer's exact Download control at
  38,509 bytes and SHA-256 `a703a4db...`; OOXML and required-content checks
  pass.
- The exact uploaded TXT tile matched, but no UI binary was captured and the
  bounded `files-download` fallback returned HTTP 403 JSON `Forbidden` with no
  URL. The repaired job/result correctly terminated `failed`, metrics 1
  materialized / 1 failed, on attempt 1.
- This packet is consumed. Do not retry or create a second job. M5 and every
  re-enablement gate remain open; diagnose the current uploaded-file preview
  activation/capture boundary provider-free before requesting another live
  proof.

## 2026-08-02 Native Source Capture Repair Addendum

- The next `ok go` authorized provider-free diagnosis and repair only. No
  install, browser/provider work, materialization retry, scheduler resume, or
  completion resume occurred.
- The exact public regression supplied a matched source tile, confirmed preview
  click, valid native browser-download bytes, and the consumed 403 fallback
  shape. It failed identically twice because the source path only accepted
  patched fetch/anchor/direct bytes and never configured Chrome's download
  manager.
- The repaired source transfer creates one isolated directory beside the final
  destination, configures Browser/Page download behavior, and consults it only
  after the exact matched preview control was clicked. It accepts exactly one
  stable, nonempty file with the requested full filename/extension after
  removing at most one terminal numeric collision suffix such as `(1)`.
  Multiple or mismatched files fail closed; scratch state is always removed.
- The first repair run exposed the no-space live filename form
  `auracall-m5-source-20260802T185953Z(1).txt`; the narrowed suffix normalization
  then made the regression green. Adapter/history/MCP tests pass 202/202; the
  full provider-free suite passes 304 files/2,706 tests with 65 skips, plus
  typecheck, production build, touched lint with one retained warning, and diff
  hygiene.
- M5 remains open. Install/parity and any later live proof require separate
  explicit authorization; never infer either from this provider-free repair.

## 2026-08-02 Installed Proof And Retry Terminal Addendum

- The operator authorized install, one fresh two-asset proof, and one retry only
  when well-justified and likely to succeed. Pushed repair `9c7691e5` was
  installed byte-identically before browser work.
- Fresh ChatGPT conversation `6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9`
  contains exactly one 505-byte uploaded fixture and one requested DOCX.
  ChatGPT completed an artifact-only response; AuraCall's root textual
  extraction timed out without resubmission, while the history snapshot later
  found exactly one file and one artifact.
- First job `hmj_8c9d2cc271954129a1d4fdf247999cf7` matched all four identity
  dimensions, materialized the 38,561-byte DOCX at SHA-256 `70ccc62c...`, and
  failed the source with the exact 403 `Forbidden` receipt. The DOCX is valid
  OOXML and contains every requested string.
- A narrowly scoped reused-preview-control hypothesis passed provider-free
  checks and was installed for the one authorized retry. Retry job
  `hmj_dfb704142a694f5b9f0a10db96d457ed` reproduced the same truthful `failed`
  result, metrics 1 materialized / 1 failed, with no source native-download
  success. No further retry ran.
- The hypothesis was reverted and pushed runtime `9c7691e5` restored with exact
  adapter hash parity `85d2ebe6...`; API PID `95673` is active with zero
  restarts. M5 and all re-enablement gates remain open. The next bounded work is
  provider-free branch-level preview/download telemetry; new live work requires
  new explicit authority.

## 2026-08-03 Exact Flyout DOM Proof And Provider-Free Repair Addendum

- Authenticated inspection used the retained `default` ChatGPT browser and
  clicked only the exact user-turn source tile in conversation
  `6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9`. No prompt or materialization job was
  created.
- The source preview is one visible
  `section[data-testid="screen-threadFlyOut"]` with exact aria-label
  `auracall-m5-source-20260802T185953Z(2).txt`. It contains one upper-right
  `button[aria-label="Download"]`; the page exposes no preview dialog.
- The bounded manual download produced 505 bytes at SHA-256 `5d17e7ec...` and
  is byte-identical to
  `docs/dev/fixtures/auracall-m5-source-20260802T185953Z.txt`.
- The prior retry hypothesis was structurally wrong because it required a new
  global Download node. The provider-free repair instead binds the exact
  selected filename to one visible flyout and clicks only its sole scoped exact
  Download control. Exact identity plus surface/control counts are retained in
  diagnostics/telemetry.
- Focused TDD failed before and passed after repair. Adapter/history/MCP tests
  pass 202/202; typecheck, production build, and diff hygiene pass. The full
  provider-free suite passed 2,705 tests with one unrelated 27 ms versus 30 ms
  rate-limit timing failure; its exact focused rerun passed. Scoped Biome retains
  baseline format drift and the known CDP `Runtime` naming warning.
- The repair is not installed. API PID `95673` remains the pushed pre-repair
  runtime, scheduler and five completions remain paused, and active
  `chatgpt/default` jobs remain zero. Installation plus one fresh two-asset proof
  is a separate explicit gate; never retry the two consumed jobs.

## Suggested Skills

- `agent-browser`: required for retained authenticated browser/CDP inspection
  and profile-safe browser work.
- `diagnosing-bugs`: use for the evidence-first dual-route diagnosis.
- `codegraph-workspace`: use for structural flow, callers, and impact analysis.
- `tdd`: use for the provider-free red/green repair.
- `handoff`: use again only when producing the next clean-session boundary.

## Required Closeout

Update Plan 0180, `ROADMAP.md`, `RUNBOOK.md`, `docs/dev/dev-journal.md`, and
`docs/dev-fixes-log.md` when the diagnosis or behavior changes. Preserve exact
validation and runtime readbacks. Packet A is closed at a reviewed provider-free
diagnosis and Packet B is closed at a validated exact-artifact selector repair.
Keep M5
OPEN until one separately authorized bounded default-account collector/
materializer pass reaches zero failed materializations and all existing safety
criteria.
