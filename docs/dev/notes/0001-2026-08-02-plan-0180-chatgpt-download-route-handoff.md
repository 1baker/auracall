# Plan 0180 ChatGPT Download-Route Fresh-Agent Handoff

Date: 2026-08-02
State: Packet B installed; first fresh live control consumed by Grok misroute; ChatGPT/live gate closed
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
