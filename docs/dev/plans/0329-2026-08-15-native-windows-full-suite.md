# Native Windows Complete-Suite Portability | 0329-2026-08-15

State: CLOSED
Lane: P01
Plan version: 4

## Goal

Make the complete provider-disabled test suite pass on native Windows and make
that parity a required CI contract, without weakening Unix coverage or
pretending POSIX-only behavior is portable.

## Current State

- Plan 0328 made execution-runner persistence filesystem-safe and restored the
  real HTTP/CLI/MCP readiness smoke on Windows.
- The last complete native-Windows suite dispatch predates that repair, so its
  many runner-store failures are now stale and a current-SHA diagnostic run is
  required.
- That run also exposed independent remaining classes: semantic account/cache
  keys used as Windows directory names, path-separator and drive-root fixture
  assumptions, CRLF-exact wrapper assertions, WSL/browser-process fixtures that
  model a different host, and one PTY fixture that detaches before its guard.
- CI currently substitutes 24 focused tests for the complete Windows suite.

## Scope

- Run the complete provider-disabled suite on Windows and preserve the exact
  current-SHA failure inventory as the repair baseline.
- Encode any remaining semantic persisted-directory keys that are invalid on
  Windows while preserving public ids, JSON payloads, safe legacy reads, and
  migration behavior.
- Make filesystem assertions use platform-aware path construction or portable
  serialized-path expectations according to the contract being tested.
- Gate genuinely Linux/WSL- or POSIX-process-specific fixtures narrowly while
  keeping portable product behavior active on Windows.
- Normalize checked-in text before assertions where checkout line endings are
  not part of the product contract.
- Replace the focused Windows CI lane with the complete provider-disabled
  suite and update its executable drift guard.
- Keep the real readiness smoke mandatory on every configured operating system.

## Non-Goals

- Do not replace or upgrade the legacy PTY dependency in this slice.
- Do not change public identity schemas, API payloads, provider behavior,
  scheduler semantics, browser ownership rules, or serialized portable paths.
- Do not weaken Ubuntu or macOS test coverage to obtain Windows parity.
- Do not mutate active config, services, browsers, providers, credentials, or
  installed user runtime state.

## Acceptance Criteria

- [x] One current-SHA native-Windows complete-suite run provides the exact
      post-0328 failure inventory before broad repair.
- [x] Remaining persisted semantic directory keys work on Windows with public
      identities and compatible legacy state preserved.
- [x] Portable tests assert native paths with platform-aware construction and
      portable serialized paths with slash-stable expectations.
- [x] Host-specific fixtures are skipped only where their production contract
      cannot exist on that host, with the reason visible beside the gate.
- [x] CI and its drift guard require `pnpm run test` on Ubuntu, macOS, and
      Windows, plus the real readiness smoke on every configured OS.
- [x] Focused regressions, the complete isolated provider-disabled suite,
      typecheck, zero-warning lint, build, plan audit, CodeGraph sync, and diff
      hygiene pass locally.
- [x] Current-SHA CI passes all four configured jobs, including the complete
      native-Windows suite and readiness smoke.

## Definition Of Done

The plan closes when CI no longer substitutes a focused Windows suite, the
complete provider-disabled suite passes on Windows at the current
implementation SHA, and every platform exception is tied to an actually
host-specific contract rather than a convenience skip.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; current failure discovery must precede repairs and the
  repo policy does not authorize subagent delegation for this turn
- expected_write_surface: persistence/path helpers and tests, platform-specific
  fixtures, CI workflow/checker, testing guidance, and current execution docs
- max_work_unit_attempts: 2 per failure class before splitting the class
- max_review_rework_cycles: 1
- terminal_condition: complete current-SHA Windows suite passes or every
  remaining failure is reduced to a separately bounded production dependency
  migration with exact evidence

## Execution Notes

- Dispatch `31897276458` at diagnostic checkpoint `d2a234b1` passed Ubuntu 22,
  macOS 22, and Ubuntu 24, then completed the native-Windows suite with 24
  failed files, 303 passed files, and 22 skipped files. The failures reduced to
  semantic cache directory names containing `:` or `|`, native path and CRLF
  assumptions, Windows replacement-rename behavior, `node.exe` allowlisting,
  and POSIX-only child-process or permission fixtures.
- Provider cache directories now retain already-portable legacy keys and use a
  tagged reversible base64url representation for unsafe or ambiguous keys.
  Reads fall back to safe legacy paths and successful writes migrate legacy
  state only after the canonical record lands. Public identities and JSON
  payloads remain unchanged.
- Media/cache record replacement handles Windows' refusal to rename over an
  existing destination, and concurrent media writes use UUID-qualified
  temporary paths. Shell-command allowlisting recognizes only the Windows
  `.exe` suffix; script wrappers remain outside that normalization.
- Native filesystem assertions now use platform-aware construction while
  serialized cache paths remain slash-stable. Checkout text is normalized for
  CRLF where line endings are not contractual. Only real POSIX shebang child
  execution and chmod-based unreadability fixtures are gated off Windows.
- Local pre-publication evidence is green: the 25-file regression set passed
  548 tests; the complete suite passed 329 files and 2,966 tests with 20 files
  and 63 live/host-specific tests skipped; typecheck and zero-warning lint
  passed across 849 files. Build, plan audit, CodeGraph sync, and current-SHA CI
  remain the final gates.
- First implementation dispatch `31898237221` at `7713a2cc` passed all three
  Unix jobs and reduced Windows from 24 failed files to one failed assertion:
  326 files and 2,927 tests passed, 22 files and 101 tests skipped, and only the
  burst media-record writer failed. UUID temp names prevented collisions, but
  concurrent Windows writers could still race between destination removal and
  rename. Record writes are now serialized per destination, including the
  revision read, while unrelated generation ids remain concurrent. The focused
  media suite passed five consecutive runs; current-SHA CI is being repeated.
- Acceptance dispatch `31898719395` passed at exact implementation SHA
  `9298c226cd392219d13601e5ceb3210d913ae010` on Ubuntu 22 job
  `95045905872`, Ubuntu 24 job `95045905864`, macOS 22 job `95045905863`,
  and Windows 2022/Node 22 job `95045905840`. Windows passed 327 files and
  2,928 tests, with 22 files and 101 intended live/host-specific skips, then
  passed the real readiness smoke (`http=true`, CLI exit 0, `mcp=ok`; scoped-
  only `http=false`, CLI exit 1, `mcp=error`) and cleanup. Plan 0329 is closed.
