# Native Windows Runner Persistence | 0328-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Make execution-runner persistence filesystem-safe on native Windows without
changing public runner identifiers or stranding existing POSIX state, then
restore the real dashboard-session readiness smoke to the Windows CI lane.

## Current State

- Execution runner ids intentionally carry semantic colon-delimited identity,
  such as `runner:http-responses:127.0.0.1:<port>`.
- `src/runtime/runnersStore.ts` currently uses the public runner id verbatim as
  its directory name. Native Windows rejects those paths before the server can
  finish startup.
- Dispatch `31887469597` reached the real Windows readiness smoke, reported the
  invalid runner directory, and then waited on cleanup of the already-started
  MCP child until the run was cancelled.
- Plan 0327 therefore keeps Windows on a focused deterministic readiness
  contract while Ubuntu and macOS run the real cross-process smoke.

## Scope

- Add one tagged, reversible, filesystem-safe runner-directory encoding.
- Keep public runner ids and persisted JSON records unchanged.
- Write new records only to encoded directories.
- Read, list, and delete both encoded records and safe legacy raw-id
  directories, deduplicating the same runner if both forms exist.
- Remove a legacy directory only after a successful encoded write migrates its
  record.
- Cover colon-delimited ids, round-trip decoding, invalid/foreign encoded
  names, legacy compatibility, migration, listing, and deletion.
- Restore the real dashboard-session readiness smoke on native Windows and
  update the CI drift guard to require it on every configured OS.
- Preserve provider-free, isolated smoke cleanup and existing Unix behavior.

## Non-Goals

- Do not change runner id schemas, API payloads, scheduler semantics, or record
  contents.
- Do not normalize the remaining POSIX-only test expectations in the complete
  native Windows suite in this slice.
- Do not upgrade or replace the legacy PTY dependency in this slice.
- Do not change active config, services, browsers, providers, credentials, or
  installed user runtime state.

## Acceptance Criteria

- [x] Encoded runner directory names contain only a tagged base64url-safe
      alphabet and decode exactly to the original Unicode runner id.
- [x] New writes, reads, lists, and deletes work for colon-delimited runner ids
      without using the raw id as the primary path.
- [x] Existing safe raw-id directories remain readable/listable/deletable and
      migrate only after a successful encoded write.
- [x] Duplicate encoded and legacy records produce one logical runner ordered
      by the authoritative heartbeat.
- [x] Focused runner-store/control/service tests, typecheck, zero-warning lint,
      provider-disabled tests, build, plan audit, CodeGraph sync, and diff
      hygiene pass.
- [x] CI requires and passes the real dashboard-session readiness smoke on
      Ubuntu, macOS, and Windows at the current implementation SHA.

## Definition Of Done

The plan closes when native Windows can persist its semantic runner ids and the
same real HTTP/CLI/MCP readiness smoke passes on every configured CI operating
system without weakening the public identity contract or POSIX compatibility.

## Execution Notes

- Version 1 encodes every new runner directory as tagged canonical base64url
  while leaving the id inside both JSON files unchanged. Reads compare encoded
  and safe legacy candidates; list deduplicates by newest heartbeat,
  persistence time, then revision; successful writes remove the legacy form;
  delete covers both.
- Four focused files passed 24 tests. Typecheck, touched-file zero-warning lint,
  the CI runtime checker, and the real local HTTP/CLI/MCP readiness smoke also
  passed. The isolated provider-disabled suite passed 329 files and 2,964 tests
  with 20 files and 63 tests skipped; the production build, 849-file
  zero-warning lint, plan audit, CodeGraph sync, and diff hygiene also passed.
- Current-SHA dispatch
  [31896808359](https://github.com/1baker/auracall/actions/runs/31896808359)
  passed at `e69c4e24ba5f0c16ad0d8f3604bac1893ca7eacb`. Ubuntu 22 job
  `95041265046`, macOS 22 job `95041265049`, Ubuntu 24 job `95041265051`,
  and Windows 2022/Node 22 job `95041265055` all completed successfully.
  Windows independently passed frozen install, the runtime checker,
  zero-warning lint, all 24 focused tests, the real HTTP/CLI/MCP readiness
  smoke, and cleanup. This closes the plan without broadening its scope.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; persistence compatibility, smoke restoration, and CI
  guard changes form one serialized migration
- expected_write_surface: runner store and tests, CI workflow/checker tests,
  testing guidance, and current planning/execution documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or the exact remaining
  native process-cleanup failure is recorded without weakening runner identity
