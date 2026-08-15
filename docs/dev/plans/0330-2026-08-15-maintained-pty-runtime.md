# Maintained Cross-Platform PTY Runtime | 0330-2026-08-15

State: OPEN
Lane: P01
Plan version: 4

## Goal

Replace AuraCall's patched legacy PTY test dependency with a maintained,
typed, prebuilt runtime and make real interactive PTY behavior a required
cross-platform CI contract on supported Node versions.

## Current State

- CI passes on Ubuntu, macOS, and native Windows, but Windows is pinned to the
  2022 image because the 2020-era `@cdktf/node-pty-prebuilt-multiarch@0.10.2`
  fallback cannot build with the newer Visual Studio substrate.
- AuraCall carries a local patch for that dependency's install script and
  Windows C++ sources, plus ambient `any` declarations and dual-package
  fallback imports.
- The shared TUI PTY helper disables Linux unconditionally, the streaming PTY
  suite is opt-in, and no CI step proves spawn/data/resize/interrupt/exit
  behavior after native installation.
- The maintained Homebridge fork's current stable package declares Node 20-26
  support, ships TypeScript declarations, and publishes a prebuild-aware
  installer, but AuraCall has not yet verified it on its exact CI matrix.

## Scope

- Replace the legacy CDKTF PTY package with the maintained Homebridge package
  and remove the local dependency patch and obsolete ambient declarations.
- Use the package's typed API through one shared test helper rather than
  duplicate dynamic imports and explicit `any` boundaries.
- Restore portable TUI and streaming PTY cases on Linux where the maintained
  runtime supports them.
- Add a required provider-free PTY CI step that proves real spawn, streamed
  data, resize, interrupt, and clean exit behavior.
- Move the Windows CI lane back to `windows-latest` only after the maintained
  prebuild/install and interactive contract pass there; update the executable
  CI drift guard in the same slice.

## Non-Goals

- Do not change TUI product behavior, prompts, rendering semantics, provider
  selection, browser control, or live-provider workflows.
- Do not adopt an alpha or beta PTY release, add Electron support, or expand
  the supported Node major matrix.
- Do not claim source-build compatibility on toolchains where CI consumes a
  matching prebuilt binary.
- Do not mutate installed AuraCall runtime state, browser profiles,
  credentials, services, or provider accounts.

## Acceptance Criteria

- [ ] `package.json` and the lockfile contain the maintained PTY package only;
      the legacy package, local patch, fallback imports, and ambient module
      declarations are gone.
- [ ] One typed shared helper owns PTY loading and portable availability, with
      no unconditional Linux exclusion.
- [ ] Focused PTY tests prove spawn/data, resize, interrupt, TUI interaction,
      and exit behavior without provider traffic.
- [ ] CI and its deterministic checker require the focused PTY contract on
      every configured operating system and use `windows-latest` successfully.
- [ ] Typecheck, zero-warning lint, focused PTY tests, complete provider-
      disabled suite, build, plan audit, CodeGraph sync, and diff hygiene pass.
- [ ] Current-SHA CI passes Ubuntu 22, Ubuntu 24, macOS 22, and current Windows
      with the maintained PTY contract and existing readiness smoke green.

## Definition Of Done

The plan closes when AuraCall no longer carries or patches the legacy PTY
package, portable interactive tests run through one typed helper, and a
current-SHA CI dispatch proves the maintained runtime on every configured host.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; dependency, helper, and CI changes share one lockfile
  and contract surface, and repo policy does not authorize subagent delegation
  for this turn
- expected_write_surface: package and lockfile, PTY helper/tests, CI workflow
  and checker, testing guidance, roadmap/runbook/journal/fix documentation
- max_work_unit_attempts: 2 per failing platform contract before splitting
- max_review_rework_cycles: 1
- terminal_condition: current-SHA cross-platform CI passes or the maintained
  package is disproved with exact platform/runtime evidence and the slice is
  reframed without retaining a misleading partial migration

## Execution Notes

- Replaced the patched CDKTF package with exactly pinned Homebridge PTY
  `0.14.1`. Frozen dependency state now uses the package's built-in types and
  prebuild-aware installer; the 127-line local patch and ambient declaration
  are deleted.
- The shared helper owns one static typed import and no longer disables Linux.
  The streaming fixture uses self-contained CJS children, separates the
  bookkeeping sink from stdout, and drives Ctrl+C only after observing the
  first streamed chunk, avoiding startup-timing assertions.
- `pnpm run test:pty` passes 9 provider-free interactive cases locally. The
  complete suite passes 330 files and 2,975 tests with 19 files and 55 intended
  live/host-specific tests skipped. Typecheck, zero-warning lint across 849
  files, build, plan audit, and diff hygiene pass.
- CI now targets `windows-latest` and requires the focused PTY command on every
  configured host before the complete suite. The deterministic checker guards
  the exact maintained dependency/build allowlist, removal of the legacy
  package/patch, the focused script and step, and the current Windows runner.
  Current-SHA cross-platform CI remains the closing gate.
- Diagnostic dispatch `31899873879` at `1e48d02f` proved frozen prebuilt
  installation on every host and passed all 9 PTY cases on Ubuntu and current
  Windows. The six streaming cases also passed on macOS, but its TUI fixture
  retained a child after receiving six arrow-key escapes in one write. The run
  was cancelled after capturing that boundary rather than left consuming a
  runner.
- The TUI driver now writes complete arrow-key sequences separately at bounded
  intervals and owns a default 15-second kill guard with an explicit
  `timedOut` result. Tests reject watchdog exits, so this bounds native failures
  without weakening the clean-exit contract. The repaired three-case TUI suite
  passes locally; current-SHA CI must be repeated.
- Dispatch `31900300650` at `73fe475c` passed the full contract on macOS,
  Ubuntu 24, and current Windows; Ubuntu 22 failed an unrelated one-millisecond
  rate-limit timing assertion after its PTY contract passed. A failed-job rerun
  remained unallocated, so a fresh exact-SHA dispatch replaced it.
- Fresh dispatch `31900808921` passed install, CI drift checks, lint, and all 9
  PTY cases on every host. Both Ubuntu jobs completed successfully. Windows
  then exposed two unrelated filesystem/SQLite-heavy tests exceeding Vitest's
  five-second default under matrix load and one temp-tree cleanup without
  Windows retry semantics. Those tests now retain their assertions with a
  bounded 15-second allowance and retry only recursive cleanup; repaired
  focused tests pass locally. A new current-SHA matrix remains the closing gate.
