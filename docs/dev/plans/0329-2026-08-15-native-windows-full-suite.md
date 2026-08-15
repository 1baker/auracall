# Native Windows Complete-Suite Portability | 0329-2026-08-15

State: OPEN
Lane: P01
Plan version: 1

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

- [ ] One current-SHA native-Windows complete-suite run provides the exact
      post-0328 failure inventory before broad repair.
- [ ] Remaining persisted semantic directory keys work on Windows with public
      identities and compatible legacy state preserved.
- [ ] Portable tests assert native paths with platform-aware construction and
      portable serialized paths with slash-stable expectations.
- [ ] Host-specific fixtures are skipped only where their production contract
      cannot exist on that host, with the reason visible beside the gate.
- [ ] CI and its drift guard require `pnpm run test` on Ubuntu, macOS, and
      Windows, plus the real readiness smoke on every configured OS.
- [ ] Focused regressions, the complete isolated provider-disabled suite,
      typecheck, zero-warning lint, build, plan audit, CodeGraph sync, and diff
      hygiene pass locally.
- [ ] Current-SHA CI passes all four configured jobs, including the complete
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
