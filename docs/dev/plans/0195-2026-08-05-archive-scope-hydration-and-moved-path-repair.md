# Archive Scope Hydration And Moved-Path Repair | 0195-2026-08-05

State: OPEN
Lane: IMPLEMENTATION
Plan version: 1
Outcome: PENDING
Governing objective: prevent unrelated archive paths from poisoning filtered
reads, migrate the one moved transcript path across its exact durable records,
and prove the installed provider-free recovery read.

## Stable Objective

Make archive list filters effective before filesystem metadata hydration, then
replace the stale May 16 transcript path with File Searcher's verified current
Google Drive path in the archive index and its owning response records. Install
the accepted build once and rerun the read-only `chatgpt/default` reassessment
without creating provider work.

## Current State

- Plan 0194 stopped because a `chatgpt/default` recovery request returned HTTP
  500 on `ENODEV` while opening an unrelated `wsl-chrome-3` upload under the
  former `/mnt/h/My Drive/ISU/che447/Seminars/...` path.
- CodeGraph proves `createRunArchiveService.listItems()` calls
  `readIndexedItems()`, which refreshes filesystem metadata for every indexed
  item before `createRunArchiveListResult()` applies provider/runtime/kind and
  availability filters.
- File Searcher's live Everything result located the exact 20,016-byte DOCX at
  `/mnt/h/My Drive/ISU/che447/Archive 2026 Spring/03-seminars/Seminars/Drew Wetterlind/2026-05-08 ChE 4470 Drew Wetterlind VTT Candidate Transcript.docx`.
  Direct SHA-256 is
  `af15c06cb7aca655c224b47a9f6d443a8b97fb30578bd1ae52ae9f3f6748370a`.
- The obsolete path occurs in exactly three runtime files:
  `runtime/archive/index.json`, the owning response `bundle.json`, and its
  `record.json`. Pre-mutation hashes are recorded in Checkpoint 1.
- API PID 4278 is healthy with zero crash restarts. Scheduler and all six
  completions are paused; queued/running completions are zero, foreground work
  is inactive, the default completion remains at pass 4, and its guard is clear.

## Authority And Ownership

- The operator's `ok do both` authorizes the recommended source repair and the
  exact stale runtime-path migration.
- This plan interprets the source repair as including focused tests, one build,
  one user-runtime install, one API-service restart, and provider-free installed
  readback. It authorizes no browser/provider work or materialization job.
- Runtime metadata writes are limited to replacing the exact obsolete path with
  the verified new path in the three named JSON files. No other field may be
  deliberately changed before normal installed readback refreshes availability,
  size, checksum, and archive links for that row.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; delegation
  was not requested and this serialized source/runtime boundary has four
  available-agent slots but no independent work unit that should outrun it.

## Local Goal Bounds

- `max_codegraph_calls: 6`; `max_source_files: 1`; `max_test_files: 1`;
  `max_red_green_cycles: 1`; `max_review_rework_cycles: 1`.
- `max_builds: 1`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_runtime_metadata_files: 3`; `max_path_replacements: exact_old_path_only`.
- `max_provider_calls: 0`; `max_live_jobs: 0`; `max_browser_actions: 0`;
  `max_completion_actions: 0`; `max_scheduler_actions: 0`;
  `max_guard_actions: 0`; `max_retries: 0`.
- `max_duration_minutes: 45`.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `RED` when an unrelated archive row that throws during hydration
   breaks a provider/runtime-filtered list read under current code.
2. `RED` -> `SOURCE_GREEN` when pre-hydration stable-field scoping makes that
   filtered read pass without changing final filter/metric semantics.
3. `SOURCE_GREEN` -> `PATH_MIGRATED` after all and only the three authorized
   JSON files contain the verified new path and no obsolete path remains in the
   owning runtime records.
4. `PATH_MIGRATED` -> `INSTALLED` after one accepted build/install/restart
   reaches exact relevant source/runtime parity with pauses preserved.
5. `INSTALLED` -> `COMPLETE` after the recovery planner and in-memory funnel
   return current provider-free results, final posture/audits are green, and
   commit/push/remote parity are recorded.
6. Any unexpected runtime reference, JSON corruption, provider/browser call,
   active work, lost pause, guard, install-parity mismatch, or failed final
   regression transitions immediately to `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [ ] A deterministic regression fails because an unrelated archive row is
  hydrated before a filtered list result and passes after the minimal repair.
- [ ] Single and batch archive list reads pre-scope only stable persisted fields
  while retaining final availability/query filters and metrics.
- [ ] Exactly three authorized runtime files replace the obsolete path with the
  File Searcher/direct-stat verified path; JSON, response identity, size, and
  SHA-256 read back correctly.
- [ ] Focused tests, typecheck, scoped lint, diff hygiene, full suite, and the
  sole build pass.
- [ ] One install/restart reaches source/runtime parity, preserves every pause,
  and the installed provider-free recovery planner plus in-memory funnel return
  exact current counts with zero provider calls/jobs.
- [ ] Docs, plan audit, commit/push, clean worktree, and remote parity are
  current.

## Hard Stops And Non-Goals

- Do not scan broad Drive roots, move/copy/delete the DOCX, rewrite unrelated
  archive rows, backfill the whole archive, or infer a generalized path alias.
- Do not start a browser, provider request, history-materialization job,
  snapshot refresh, retry, completion, scheduler, or guard action.
- Do not hide same-scope filesystem errors by weakening all archive hydration;
  this slice fixes the demonstrated ordering boundary.

## Definition Of Done

Filtered archive reads no longer touch unrelated paths, the moved transcript's
three durable runtime references point to the verified file, the installed
recovery read completes provider-free, and every operator pause remains intact.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0194 STOPPED_FAIL_CLOSED -> operator `ok do both` ->
  Plan 0195 READY.
- `progress_classification`: blocker_reduction
- `evidence`: clean synchronized `9ff757ab`; CodeGraph confirms refresh-before-
  filter ordering; File Searcher live Everything plus direct stat/hash confirms
  the moved 20,016-byte DOCX; exact old-path references are limited to three
  runtime files.
- `evidence`: pre-mutation SHA-256 values are archive index
  `fa800de3c4f24751ba3c24c806c04288381d62118394c1fa2fe9d85d46cde012`,
  bundle `8f3ac7bac45f642d49755b348e5625800c200886c22ed69ce72f49d174cb1319`,
  and record `4b2dc7c236e0d7fee8abc0be60e0852153c40b2ab8b23b1022f4f2287d241785`.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 2/6; source/test/red-green/build/install/
  restart/runtime-metadata/provider/live/control actions 0 at plan opening.
- `remaining_criteria`: all six acceptance items.
- `next_action_or_stop_reason`: wire and push this authority packet, then add
  the single deterministic red regression before implementation.
