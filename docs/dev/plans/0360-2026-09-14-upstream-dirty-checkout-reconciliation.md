# Plan 0360 — staged upstream merge and dirty-checkout reconciliation

State: CLOSED

Current status: provider-free accepted and locally integrated. The commit
containing this closeout is the reconciliation checkpoint; no full install,
browser run, or publication is part of Plan 0360.

## Authority and custody

- User's bounded “ok go” follows the recommendation to re-establish custody,
  reconcile this plan with the implemented assistant-response packet, and run
  broader provider-free validation before committing or installing.
- Integration worktree: `runtime/auracall-integration-20260914`, with the upstream merge still uncommitted.
- Original checkout: `corpora/repos/auracall`, currently with 35 tracked edits
  and 35 untracked files. The current private byte-verified custody baseline is
  `runtime/auracall-snapshot-20260919-GvOez6/changed-files.tar.gz` (70 paths,
  SHA-256 `8b8fbd7591e635452848de1d9fabd75fd123b2491416886428b6bdcff057911e`).
- The earlier 68-path snapshot remains historical evidence but is no longer a
  byte-identical current baseline: five archived files changed size and the
  configured-native-authority source/test pair was added before this checkpoint.
- No copying of the original checkout as a whole and no change to the installed AuraCall runtime or retained browser.

## Independent review and selected carry

- Two read-only reviews classified tracked overlap and untracked dependencies. All 35 tracked edits differ from the staged merge; 22 overlap staged merge paths. Six new native/recovery modules are absent from the integration tree.
- Carried the scheduler reservation replacement in `serviceHost.ts` with its two parameterized regression tests. Rejected claims and gates release capacity only to future candidates, without retroactively reserving skipped rows.
- Carried the closed Plan 0358 required-document-set contract in `configuredExecutor.ts` with `runtime.requiredDocumentSet.test.ts`. An explicit file set requires every exact local filename, rejects malformed sets before submission, and cannot fall back to legacy single-file correction.
- Carried exact response-owned artifact control and download binding in `chatgptArtifactControls.ts` and `chatgptAdapter.ts` with two focused test files. The regression test failed 11/11 before the resolver fix; the complete artifact selection/materialization lane now passes 273/273.
- Carried the assistant-response identity and submitted-user ordering packet in
  `assistantResponse.ts`, `index.ts`, and `reattachCore.ts`. Completion and copy
  controls must bind to the exact captured message; visible streaming status
  blocks terminal capture; reattach preserves only a valid assistant message
  ID; same-text replies require distinct identities plus proof that the answer
  follows the exact submitted user turn.
- The original checkout's outer composer-mode retry was not copied. The staged
  upstream implementation already waits for root/project mode-control hydration
  and rejects absent controls on new root composers, so the older patch is
  represented by stronger upstream behavior.
- Corrected one ambiguous mechanical patch placement discovered by the partial-download regression and removed the now-unused permissive downloader.
- Native broker, configured-native-authority, failed-run response recovery, and
  explicit new-conversation work remain separate OPEN packets. They are not
  enabled by this carry.

## Verification and release gate

- `git diff --check`: pass.
- Focused Vitest: 135/135 passed across `runtime.serviceHost`, `runtime.requiredDocumentSet`, and `runtime.configuredExecutor`.
- `pnpm typecheck`: pass.
- Biome lint on the four touched source/test files: pass.
- Exact artifact control/download Vitest: 273/273 passed; targeted Biome lint and typecheck passed.
- Assistant response/browser/reattach Vitest: 123 passed with one existing skip
  across four files. The pre-fix focused response packet failed six assertions;
  the reconciled implementation passes them.
- Current `pnpm typecheck`, targeted Biome lint on the six assistant packet
  source/test files, and `git diff --check`: pass.
- The first comprehensive run exposed two stale Skill-run fixture failures and
  one cancellation-return race. The Skill fixture now mocks the carried
  pre-Send Pro-intelligence guard. Runner finalization now stops its watcher and
  heartbeat, releases the lease once, and returns that exact persisted record
  instead of a pre-`finally` snapshot.
- Final provider-disabled comprehensive Vitest: 3,430 passed and 55 skipped
  across 380 files (361 passed files, 19 skipped live/provider files).
- Full lint (including strict source, script, and test lanes), production build,
  typecheck, and `git diff --check`: pass. Lint retains 13 informational test
  suggestions and zero gate-failing warnings.
- Plan library audit: 425 candidates, zero validation errors.
- The integration worktree currently has 374 staged merge paths, 25 unstaged
  tracked paths, four untracked paths, and zero unresolved merge paths.
- The archived paths now have an exhaustive, one-path-once disposition in
  `docs/dev/notes/2026-09-19-plan0360-dirty-checkout-disposition.md`: 17
  selectively integrated, two represented by stronger staged behavior, 12
  reconciled as historical documentation, and 39 preserved for separate OPEN
  recovery/authority work.
- The model/intelligence overlap is reconciled. Agent ModelLabs/Homelab owns
  prompt policy through Plan 0361; its final pre-Send slider-value-4 guard is an
  accepted dependency. Plan 0360 owns integration around that invariant and
  does not weaken, duplicate, or claim its live proof.
- No live/provider validation, full integration installation, or ChatGPT Pro
  relevance audit has been claimed. Plan 0361 separately installed only its
  narrow three-file runtime patch; a retained-browser Send/readback remains
  pending Agent Browser authority.

## Successor boundary

Full installed/source parity and retained-browser acceptance remain a later
explicit runtime slice. Plan 0361 stays OPEN for its live Send and must continue
through Agent Browser's retained authority rather than a duplicate browser lane.
The 39 deferred archive paths require their own authority/recovery plans and
must not be inferred as accepted by this closeout.
