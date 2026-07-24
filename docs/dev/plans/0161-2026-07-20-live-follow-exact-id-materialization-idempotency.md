# Live-Follow Materialization Asset-Family Idempotency | 0161-2026-07-20

State: CLOSED
Lane: P01

## Goal

Prevent live-follow materialization from repeating terminal asset-family work
when catalog aliases differ from archived filenames, while giving explicit
selected conversation IDs the same terminal suppression as general candidates.

## Current State

- Installed pass 19 proved collector browser churn is bounded, but its
  materialization job rewrote the same checksum-backed PDF routes as pass 18.
- Live receipt inspection corrected the initial exact-ID hypothesis: completion
  uses `reuseSnapshotConversationIds`, while the repeated PDF came through the
  general backlog candidate branch.
- The catalog represented that PDF as a sandbox UI label and a `download-dom`
  row, while the archive represented its decoded filename with source
  `download`. Those aliases produced different signatures and reselected the
  conversation.
- Public service-seam regression tests cover the live alias mismatch, selected
  batches, and singular direct-conversation requests.
- The first installed singular-ID smoke exposed that `conversationId` still
  bypassed the reconciliation gate; it was stopped by service restart before
  materialization completed. The repaired singular path now performs the same
  local terminal-family check before any provider work.
- Installed job `hmj_ea1faa9513f64594b393c4803eaa8425` skipped the live
  duplicate immediately with no managed browser process. Scheduler and
  completion remain paused at pass 19.
- Pass 21 reopened the plan: job `hmj_28e768323dc04d8589860fcffb6ec821`
  repeated three pass-20 checksums under the same archive item IDs for
  conversation `6a5d4332-f814-83ea-8b12-e9dfbdbf6571`. One formerly failed
  PDF was genuinely new, but the job still reported all four rows as
  materialized. The remaining gap is cross-job terminal suppression for a
  freshly refreshed conversation whose cached catalog representation changes
  file availability while retaining prior artifact/file families.
- Root-cause regression now proves the remaining gap was not archive lookup or
  pacing: a conversation with one archived family and one pending family was
  correctly selected, but the terminal-family evidence stopped at the
  conversation gate and the materializer spent its transfer budget on the
  archived asset again.
- The repair carries candidate-specific terminal families through the existing
  provider-work context and filters artifact/file candidates before `maxItems`
  and before provider transfer. It therefore removes duplicate browser
  download churn instead of merely correcting post-run metrics.
- The repaired production build is installed as API PID `8318`. The target and
  scheduler remain paused at pass 21, the provider guard is clear, active
  materialization jobs are zero, and the stale managed Chrome/CDP process left
  by pass 21 was terminated before install. Install/readback opened no browser.
- Bounded pass 22 kept collector pacing healthy—four detail chats, `5/8`
  logical interactions, 43 CDP calls, and no provider guard—but job
  `hmj_81ca38cbd6194f7eb3a6a5451a45a81c` replayed four locally materialized
  families. Live catalog and archive reads disproved archive truncation and
  showed two remaining durability gaps: download labels were not always
  canonicalized to their URI/file filename, and prior successful job entries
  were ignored when archive-index visibility lagged.
- The follow-up repair canonicalizes download families by filename on catalog,
  archive, and prior-job evidence. A prior `materialized`/`duplicate` entry is
  terminal only while its recorded local path is still a regular file, so
  missing outputs remain eligible for repair. The runtime is installed as API
  PID `58127`; scheduler/completion are paused at pass 22, the guard is clear,
  active jobs are zero, and no managed ChatGPT browser/CDP listener exists.
  The next quiet-interval acceptance remains pending.
- Bounded pass 23 again kept collector behavior safe—four collector-reused detail chats,
  `5/8` logical interactions, 45 CDP calls, and no provider guard—but job
  `hmj_763186250d4a481c8dccbf52b4b3b946` replayed five prior families. The
  broad reconciliation candidates had no cached asset manifests, so reconciliation
  intersected durable terminal evidence with an empty candidate-family set and
  passed an empty exclusion list into live provider discovery.
- Both exact-ID and broad-candidate paths now carry the full provider/runtime/identity-scoped
  terminal-family set into provider discovery. This lets newly discovered DOM
  assets be filtered before `maxItems` even when the collector row has not yet
  published its asset manifest. The repair is installed as API PID `57255`;
  completion remained paused at pass 23 pending live proof.
- Pass 24 exposed that completion-owned requests leave `conversationIds` empty
  and carry collector rows in `reuseSnapshotConversationIds`. The first pass-24
  child job was interrupted by service restart 49 seconds before its provider
  boundary, so it made no provider contact. A corrected regression now covers
  the actual broad-candidate branch and the repair is installed there.

## Scope

- Canonicalize percent-encoded download filenames and `download-dom` source
  aliases against archived `download` assets.
- Prefer a downloadable URI filename over UI action text when forming a
  catalog download-family signature.
- Build the terminal asset-family signature set once per reconciliation job
  and apply it to exact selected conversation IDs when signatures exist.
- Apply the same terminal-family preflight to direct singular `conversationId`
  requests while preserving their direct result/source shape.
- For mixed conversations, pass already-terminal families into provider work
  and exclude them before transfer selection and budget consumption.
- Preserve exact-ID fallback work for missing catalog rows or rows without
  usable asset-family signatures.
- Preserve `force: true` replay semantics.
- Keep completion and scheduler controls paused during install and readback.

## Non-Goals

- No additional live browser pass.
- No pacing or materialization-cap increase.
- No provider-specific selector or download behavior changes.
- No public request or response shape changes.

## Acceptance Criteria

- [x] A selected `force: false` conversation whose asset family is already
  available in the run archive does not refresh or materialize again.
- [x] Sandbox UI-label, percent-encoded filename, and `download-dom` aliases
  converge with the archived download family and do not reselect the chat.
- [x] Selected rows without usable catalog asset signatures retain existing
  provider-work fallback behavior.
- [x] `force: true` remains an explicit replay override.
- [x] Focused tests and TypeScript pass.
- [x] A mixed conversation with one archived and one pending family transfers
  only the pending family; the archived family does not consume `maxItems`.
- [x] Production build, lint/format, diff check, and plan audit pass.
- [x] Installed service readback is paused and quiescent without a live pass.
- [x] Two consecutive live-follow jobs do not report an existing checksum and
  archive item ID as newly materialized when `force: false`.

## Definition Of Done

The plan closes when catalog/archive aliases and exact-ID terminal suppression
are enforced through the existing history-materialization interface,
regression coverage passes, docs match operator behavior, and the repaired
installed runtime remains paused with no provider contact.

## Closeout Evidence

- `115/115` focused history-materialization and completion tests pass.
- TypeScript, production build, scoped Biome, full repository lint, diff
  check, and plan audit pass; full lint retains the existing 203 warnings.
- The provider-free real-catalog harness skipped
  `6a568ccb-3938-83ea-a635-02dde7634d3f` without invoking provider-work
  sentinels.
- Installed job `hmj_ea1faa9513f64594b393c4803eaa8425` returned `skipped`
  with `materialized=0` and no AuraCall-managed ChatGPT browser process.
- Installed scheduler and completion read back `paused`; completion remains at
  pass 19 and active history-materialization jobs are zero.
- Post-closeout bounded pass 20 completed with two detail chats, `6/8` logical
  interactions, 39 CDP calls, no provider guard, and no completion error.
  Materialization job `hmj_26d34691f4af41afbada26934c24d60a` produced four
  checksums absent from earlier job receipts while classifying the paired
  `download-dom`/sandbox rows as one duplicate family. Final scheduler,
  completion, job, managed-browser, CDP, and service-task readbacks are clean.
- Reopened after bounded pass 21: collector work remained guard-clear at `4/8`
  interactions and 36 CDP calls, but materialization repeated checksums
  `bb975262...`, `dd3d6ffe...`, and `a063235c...` under the same archive IDs as
  pass 20. Checksum `9023eb78...` was genuinely new. Rate-limit tuning remains
  unchanged pending repair and consecutive-pass proof.
- Mixed-family repair validation passes `152/152` runtime, LLM materialization,
  and completion tests plus TypeScript, production build, scoped Biome, full
  lint with the existing 203 warnings, diff check, and plan audit with zero
  errors. Installed artifacts contain the pre-budget artifact/file exclusion
  path; API PID `8318` is active with the scheduler/completion paused at pass
  21, guard clear, zero active materialization jobs, and no managed browser or
  CDP listener. Consecutive bounded live proof remains outstanding.
- Bounded pass 22 advanced the completion from 21 to 22 after about one hour
  quiet. Collector work stayed safe at `5/8` interactions with no guard, but
  materialization replayed four prior families. The live catalog returned the
  target rows within `kind=all&limit=500`, and the available archive contained
  only 255 items, disproving both catalog-target absence and archive-limit
  truncation. New red tests now cover descriptive-title/filename divergence
  and a successful prior job whose local output still exists. The repaired
  focused history-materialization suite passes `62/62`; the complete touched
  surface passes `157/157`, TypeScript, production build, scoped Biome, full
  lint with 203 existing warnings, diff check, and the zero-error plan audit.
  Installed-runtime and quiescence readbacks pass; consecutive live proof
  remains outstanding.
- Bounded pass 23 advanced the completion from 22 to 23 after a fresh quiet
  interval. Collector pacing remained guard-clear at `5/8`, but the child job
  replayed five prior checksum/archive families. A provider-free regression
  initially reproduced an adjacent shape: a selected conversation present in the catalog
  with no asset manifest received `excludedAssetFamilySignatures: []` despite
  a successful prior job with a readable local output. The regression failed
  before the repair and now passes; the complete history-materialization and
  provider-file surface passes `100/100`, TypeScript and production build
  pass, and full lint retains the same 203 warnings. Runtime PID `57255` is
  active at 11 tasks with completion paused at pass 23, no provider guard, and
  no managed browser/CDP listener.
- Pass 24 proved the completion-owned shape uses broad reconciliation:
  `conversationIds=[]` with three `reuseSnapshotConversationIds`. The collector
  stayed safe with 27 passive signals, `4/8` active interactions, 34 CDP calls,
  and no guard. Job `hmj_a67a37d3ae8540ffa855235635beeed0`
  was interrupted before its provider boundary when the routing mismatch was
  discovered. A corrected broad-candidate regression failed with an empty
  exclusion list, then passed after the repair.
- A public-endpoint retry was non-equivalent because its schema stripped the
  internal reuse, provider-boundary, and interaction-policy fields. Job
  `hmj_3beb6dc377414b958cf5124b2f065e37` entered running before cancellation
  and was immediately interrupted by restart; it produced no scrape telemetry
  or result. Final runtime state is paused at pass 24, guard-clear,
  browser/CDP-clear, and has zero active jobs. A later completion-owned pass is
  still required before closing the final consecutive-pass criterion.
- Completion-owned pass 25 advanced from 24 to 25 after more than two hours of
  quiet. Collector work completed with two detail chats, `3/8` active
  interactions, and no yield/error/guard. Job
  `hmj_a3a02185a5274f49855d1a1c4af6b398` preserved the internal reuse,
  quiet-boundary, and interaction-policy fields and completed `skipped` with
  `materialized=0`. Scrape telemetry recorded zero eligible artifact/file
  candidates and `downloads.attempted=0`; no checksum or archive item was
  republished. One bounded visible-file read timed out locally without a
  provider guard. This is the first clean post-repair job; one more consecutive
  completion-owned proof remains before plan closure.
- Completion-owned pass 26 supplied the second consecutive clean proof. Its
  collector read three detail chats with `4/8` active interactions, 32 CDP
  calls, and no yield/error/guard. Job
  `hmj_9c8b80ccc4544e149d5f93af566b8f2a` completed `skipped` with
  `materialized=0`, `checksumCount=0`, and zero download attempts. No prior
  checksum or archive materialization was republished, so passes 25 and 26
  close the final acceptance criterion.
