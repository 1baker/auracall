# Plan 0180 ChatGPT Download-Route Fresh-Agent Handoff

Date: 2026-08-02
State: ready for a fresh read-only diagnosis and provider-free repair plan
Governing plan: `docs/dev/plans/0180-2026-08-01-chatgpt-same-route-mutation-and-staged-reenablement.md`
Scope: diagnose the live ChatGPT download-route mismatch; do not resume live follow or spend another materialization attempt

## Mission

Determine why AuraCall resolves the exact Exam DOCX catalog item to provider
file id `file_000000005a1471fd8c7c84bc199426d4`, receives HTTP 403 `Forbidden`
from that `files-download` endpoint, and stops, while the operator can download
the intended document from links near the end of the same chat as:

`ChE_4470_5470_Exam_2_Spring_2025_Problem_3_updated_fresh-1.docx`

The operator reports the downloaded file is about 99.48 KB. This is consistent
with the preserved 99,476-byte local DOCX, but the current agent did not repeat
the operator's manual download. Treat the operator observation as strong input
and independently bind the live DOM/control identity before changing code.

The desired outcome is a provider-free red/green repair plan, followed by an
implementation that follows the exact live download control without reviving
the earlier cross-asset aliasing defect. A later live proof is a separate
operator authorization.

## Authority Order

1. `AGENTS.md` and the relevant files under `docs/dev/policies/`.
2. This handoff for the current resume boundary.
3. Plan 0180, especially Current State, M5, M6, Hard Stops, and Checkpoints
   10-13.
4. `ROADMAP.md` and `RUNBOOK.md` Turn 389 for current lane and runtime posture.
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
- Existing local checksum:
  `a6ef6841e43c7f3162f093fbbc74e45ceafd9b3616af5c6a45d96a1839d42b7b`
- Existing local size from prior inspection: 99,476 bytes.
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

Do not use `wsl-chrome-3` for this chat. Do not infer provider login from Chrome
browser sign-in. Browser identity is provenance; provider-app evidence is
provider-session authority.

## Current Working Diagnosis

The catalog selector is no longer the primary defect. The remaining mismatch
is likely between two provider surfaces:

1. AuraCall follows the exact catalog file tile/provider-file endpoint and gets
   403 from what may be a stale or non-downloadable file identity.
2. The chat's later generated-output/download controls expose a live DOCX with
   a different provider-supplied filename but matching expected content/size.

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
sed -n '1,240p' docs/dev/notes/0001-2026-08-02-plan-0180-chatgpt-download-route-handoff.md
sed -n '1,640p' docs/dev/plans/0180-2026-08-01-chatgpt-same-route-mutation-and-staged-reenablement.md
sed -n '1,240p' docs/dev/browser-service-tools.md
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

## First Bounded Work Packet

1. Use CodeGraph context first for the ChatGPT conversation-file listing,
   `downloadConversationFile`, response capture, viewer/download-control
   fallback, file identity validation, and history materialization selection
   flow. Use one explore call for the surfaced symbol bodies.
2. Inspect the retained `default` ChatGPT target through the repo browser tools.
   Resolve the current CDP port from runtime/service state; do not assume the
   previously observed port `45011` is still current.
3. Keep the first live inspection read-only. Locate the near-end DOCX links or
   controls and record bounded DOM evidence: visible label, containing message,
   anchor `href`, `download` attribute, provider identifiers, control ancestry,
   and relation to the requested catalog tile. Do not click or download yet.
4. Compare that live control path with the direct `files-download` route used by
   job `hmj_50e7aa9598be44fc950ddb1b89d4ca2f`.
5. Write one deterministic provider-free failing fixture that represents the
   observed dual-surface shape: stale/forbidden direct file endpoint plus an
   exact later download control with a provider-supplied filename.
6. Design the narrowest repair at the existing ChatGPT adapter/browser-service
   seam. Prefer `armDownloadCapture`, `readDownloadCapture`, or
   `waitForDownloadCapture` if the live control requires a trusted click. Keep
   provider-specific matching in the ChatGPT adapter and reusable capture
   mechanics in browser-service.
7. Require response/control identity before filesystem or archive mutation.
   Preserve the actual provider filename and represent any catalog alias
   explicitly; never rewrite one asset's bytes under another asset identity.

## Acceptance Criteria For The Repair Slice

- A provider-free red fixture reproduces the 403-direct-route/live-control
  mismatch.
- The repair selects the exact near-end download control using source-local
  evidence, not a page-wide same-extension fallback.
- The materialized entry preserves the actual provider filename and remains
  traceably related to the requested catalog item.
- Cross-asset response identity tests from Plan 0180 M6 remain green.
- `provider_unavailable` remains reserved for structured provider evidence;
  generic 403 remains `retrieval_failed` until another exact route succeeds.
- Focused ChatGPT adapter, file materialization, and history materialization
  suites pass, followed by typecheck, production build, lint baseline, plan
  audit, and diff hygiene.
- The committed repair is pushed and installed with source/runtime hash parity
  while scheduler and all retained completions remain paused.
- No new live download/materialization attempt occurs without explicit user
  authorization after the provider-free repair is reviewed.

## Hard Stops And Non-Authorizations

- Do not resume the scheduler or continuous live follow.
- Do not resume any retained completion.
- Do not create or retry a history-materialization job.
- Do not click the near-end download control during the initial read-only CDP
  inspection.
- Never auto-click ChatGPT's `Answer now` button.
- Stop immediately on rate limit, provider guard, CAPTCHA, verification, login,
  account mismatch, or browser-profile mismatch.
- Do not launch a second Chrome process against the managed `default` browser
  profile; reuse the retained target/service lane.
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
validation and runtime readbacks. Keep M5 OPEN until one separately authorized
bounded default-account collector/materializer pass reaches zero failed
materializations and all existing safety criteria.
