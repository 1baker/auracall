# Default DOCX Installed One-Canary Gate | 0249-2026-08-10

State: OPEN
Lane: P01
Plan version: 3
Goal execution state: ACTIVE
Gate state: AUTHORIZED_PRE_CANARY

## Stable Objective

Install the pushed Plan 0248 ChatGPT viewer-download label repair exactly once,
then run one exact default-profile DOCX materialization canary at `maxItems=1`.
Stop after its terminal receipt regardless of outcome. Do not control any
completion or resume, run, or otherwise change the scheduler.

## Frozen Starting Evidence

- Plan 0248 directly inspected default conversations
  `6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9` and
  `6a6fb365-db60-83ea-803e-42007bbc1c61`. Each has one canonical generated
  `auracall-m5-20260802T185953Z.docx` backed by a sandbox
  `/workspace/scratch/...` URI and a live JavaScript button-only control.
- Activation opens a preview/card, but the current nested native-download
  control is labelled `Download file`; the installed adapter accepts only
  exact `Download`. There is no anchor, `href`, or `download` attribute for a
  captured-URL rescue.
- The provider-free regression failed on the exact legacy matcher and is green
  after narrowly accepting `Download` or `Download file`. The repaired branch
  records sanitized counter
  `chatgpt.clickArtifactViewerDownload.currentFileLabel.v1`.
- Focused adapter/materialization/history validation passes 278 tests. Full
  provider-free validation passes 2,766 tests in 305 files with 65 opt-in tests
  skipped; typecheck, production build, scoped Biome, and diff hygiene pass.
- Built adapter SHA-256 is
  `223f3f84a913f11074878569920873565c823a6f46a69ff973ce03566e393522`;
  installed adapter intentionally remains
  `ff3fe974478c6f28b975c82444a122c60759bc9404d4518337e1396c90d8baf6`.
- API PID 1466 is active/running with `NRestarts=0`. Scheduler is
  operator-paused/idle, foreground work false, active requests and drain
  reservations zero. Active history jobs and DevTools-enabled browsers are
  zero. Default remains blocked/pass 8; `wsl-chrome-2` paused/pass 2,
  `wsl-chrome-3` idle-waiting/pass 56, and `wsl-chrome-4` paused/pass 34.

## Authority Boundary

- This document prepares the exact future gate only. It does not authorize an
  install, service restart, browser launch, provider call, asset download,
  materialization job, completion control, scheduler control, retry, prompt,
  click outside the canary's internal exact asset transfer, or `Answer now`.
- Activation requires a fresh explicit operator authorization after this
  prepared plan is committed and pushed.
- The future authorized packet may perform at most one install, one service
  restart, one exact default managed-browser lifecycle, one exact
  history-materialization create, and one resulting provider attempt.
- Completion controls remain zero. Scheduler controls remain zero. Gemini,
  Grok, `wsl-chrome-2`, `wsl-chrome-3`, and `wsl-chrome-4` remain untouched.

## Exact Future Canary

- source conversation:
  `6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9`
- provider / AuraCall runtime profile / browser profile:
  `chatgpt` / `default` / `default`
- bound identity:
  `service-account:chatgpt:ecochran76@gmail.com|plan=team|structure=workspace`
- request: `assetKinds=[artifacts]`, `maxItems=1`, `refreshSnapshot=false`,
  `force=false`, provider work timeout 120000 ms
- frozen create command:

```sh
auracall api history-materialization-create --port 18095 --provider chatgpt --runtime-profile default --browser-profile default --bound-identity-key 'service-account:chatgpt:ecochran76@gmail.com|plan=team|structure=workspace' --conversation-id 6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9 --asset-kind artifacts --max-items 1 --provider-work-timeout-ms 120000 --json
```

The command is recorded for a later packet and must not run under the present
authority.

## Activation Preconditions

1. Re-read Git status/ancestry and require clean synced `main` at the pushed
   Plan 0248/0249 closeout commit.
2. Re-read API/service provenance, scheduler, all four ChatGPT target states,
   guards, active jobs, and browser ownership. Require the frozen states above
   or stop for plan review.
3. Activate this gate in docs, audit, commit, and push before any effect.
4. Install/restart exactly once; require healthy service and exact source /
   installed adapter hash parity before creating the canary.
5. Re-prove scheduler paused/idle, active jobs zero, no unexpected managed
   browser, and exact default identity authority.

## Acceptance And Hard Stops

- Success requires one selected canonical DOCX, one materialized non-empty
  file with correct DOCX MIME/extension, one independently recomputed SHA-256,
  one available canonical archive item with no duplicate, downloads `1/1/0`,
  and the sanitized current-label counter at least once.
- The canary must create exactly one job and one attempt, retain `maxItems=1`,
  preserve identity and provider pacing, and leave no active job or browser.
- Stop regardless of outcome after the sole terminal receipt. Do not retry,
  resume default, advance another completion, run the scheduler, or resume it.
- Stop immediately on install/hash drift, unexpected API restart, scheduler or
  completion movement, existing active job, duplicate browser ownership,
  identity mismatch, provider guard, CAPTCHA/challenge, `Answer now`, prompt
  mutation, wrong conversation/asset, multiple selection, empty/wrong file,
  missing checksum/archive proof, or absent repaired-branch evidence.
- A green canary still requires a separately authorized successor before any
  completion or scheduler action.

## Prepared Checkpoint

- `checkpoint_id`: `P0249-C01`.
- `state_transition`: P0248_PROVIDER_FREE_REPAIR_GREEN ->
  P0249_PREPARED_NOT_AUTHORIZED.
- `progress_classification`: blocker_reduction.
- `evidence`: exact direct-chat DOM distinction, deterministic red/green,
  focused and full provider-free validation, source/install hash divergence,
  and fresh stopped-runtime readback above.
- `subagent_status`: not_spawned; one serialized provider boundary.
- `effect_accounting`: every Plan 0249 effect counter is zero.
- `next_action_or_stop_reason`: stop. Await explicit activation authority for
  the one install/restart and one exact canary.
- `authority_classification`: prepared successor only; no live effect authority
  inferred from provider-free success.
- `review_disposition_summary`: the repaired label seam is the only accepted
  cause. Button tagging, browser download-path configuration, and captured URL
  fallback remain unchanged and will be distinguished by terminal telemetry.

## Activation Checkpoint | One Install And One Canary Authorized

- `checkpoint_id`: `P0249-C02`.
- `state_transition`: P0249_PREPARED_NOT_AUTHORIZED ->
  P0249_ACTIVE_AUTHORIZED_PRE_INSTALL.
- `progress_classification`: blocker_reduction.
- `evidence`: the operator explicitly replied `ok go`. Fresh admission is
  clean/synced `main` at `17568365`; API PID 1466 remains active/running with
  `NRestarts=0`; scheduler is operator-paused/idle with foreground false and
  zero requests/reservations; active history jobs and DevTools-enabled
  browsers are zero. Default remains blocked/pass 8, `wsl-chrome-2`
  paused/pass 2, `wsl-chrome-3` idle-waiting/pass 56, and `wsl-chrome-4`
  paused/pass 34; all ChatGPT guards are null.
- `subagent_status`: not_spawned; one serialized provider boundary.
- `effect_accounting`: install/restart/canary/job/attempt/browser/download
  counters remain zero at activation.
- `next_action_or_stop_reason`: audit, commit, and push this authority boundary;
  re-read admission; then install/restart exactly once.
- `authority_classification`: explicit authority covers only the frozen install
  and canary packet. Completion and scheduler controls remain excluded.
- `review_disposition_summary`: a transient background-drain readback reported
  `running` with zero requests/reservations, then settled to required idle on
  the next read. No work or state mutation was inferred from the transient.

## Installed Parity Checkpoint | Canary Eligible

- `checkpoint_id`: `P0249-C03`.
- `state_transition`: P0249_ACTIVE_AUTHORIZED_PRE_INSTALL ->
  P0249_ACTIVE_AUTHORIZED_PRE_CANARY.
- `progress_classification`: blocker_reduction.
- `evidence`: the sole `pnpm run install:user-runtime-service` completed and
  restarted the API exactly once from PID 1466 to healthy PID 27774 at
  `2026-08-10 06:06:29 CDT`, `NRestarts=0`. Source and installed ChatGPT
  adapter SHA-256 values both equal
  `223f3f84a913f11074878569920873565c823a6f46a69ff973ce03566e393522`.
  Scheduler remains operator-paused/idle with foreground false and zero
  requests/reservations; active history jobs and DevTools-enabled browsers are
  zero; ChatGPT passes/statuses remain `8/2/56/34`; guards remain null.
- `subagent_status`: not_spawned; serialized live boundary.
- `effect_accounting`: installs `1/1`; API restarts `1/1`; canary creates,
  jobs, attempts, browser launches, and downloads remain zero.
- `next_action_or_stop_reason`: audit, commit, and push this installed parity;
  then issue the frozen canary create command exactly once.
- `authority_classification`: the remaining authority is one exact
  history-materialization create and its sole attempt only.
- `review_disposition_summary`: installation and parity are accepted; no
  runtime drift or safety stop is present before the canary.
