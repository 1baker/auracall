# CI Node Runtime Contract | 0327-2026-08-15

State: CLOSED
Lane: P01
Plan version: 12

## Goal

Make GitHub Actions validate AuraCall on its declared minimum Node runtime and
the current active LTS line, with a deterministic guard against future
workflow/package drift.

## Current State

- `package.json` declares Node `>=22` in both `engines` and `devEngines`.
- README installation guidance also requires Node 22+.
- The guarded workflow now selects Node 22 on Ubuntu, macOS, and Windows 2022,
  plus Node 24 on Ubuntu, and uses current setup actions.
- The first compatible-substrate dispatch passed both Ubuntu lanes. macOS
  exposed WSL fixtures that relied on the Linux host kernel while the Windows
  lane crossed the previously failing native install boundary and then exposed
  broad POSIX-path assumptions in the historical full suite.

## Scope

- Keep `package.json` as the minimum-runtime authority.
- Test Node 22 across Ubuntu, macOS, and the supported Windows 2022 runner whose
  Visual Studio 2022 toolchain can build the existing PTY test dependency.
- Add one Ubuntu lane for Node 24, the current active LTS line.
- Add a reusable contract checker that rejects package declaration mismatch,
  CI versions below the minimum, omission of the minimum, omission of a newer
  supported line, or bypass of the workflow matrix.
- Normalize checkout line endings before workflow inspection so the checker is
  deterministic on LF and CRLF filesystems.
- Run the contract checker directly in CI and through the normal test suite.
- Run WSL-specific fixtures only on Linux, where `process.platform` can satisfy
  AuraCall's real WSL detection contract, while retaining the portable suite on
  macOS.
- Remove two stale platform-only PTY guard fixtures whose detached CLI path can
  reach provider transport. Keep the browser compatibility guard covered at
  the deterministic run-options seam.
- Keep native Windows as a bounded install, runtime-contract, lint, and real
  readiness-contract lane. Run the full suite and real cross-process readiness
  smoke on Ubuntu and macOS until native Windows path/key and process-tree
  portability have their own migration plan.
- Retain a manual dispatch entrypoint so fork CI can be reproduced even when a
  push event is not enqueued.
- Use the Node 24-compatible pnpm setup action rather than a deprecated Node 20
  action runtime.
- Document the developer command and durable lesson.

## Non-Goals

- Do not raise the package minimum beyond Node 22.
- Do not test EOL Node 20 or non-LTS Node 26 in routine CI.
- Do not change package dependencies, runtime behavior, release automation, or
  user installation state.
- Do not migrate the legacy PTY test dependency or claim compatibility with
  Visual Studio 2026 in this bounded runtime-contract slice.
- Do not claim that the historical full suite or colon-delimited persisted keys
  support native Windows filesystems.
- Do not add another version file whose values can drift from `package.json`.

## Acceptance Criteria

- [x] CI tests Node 22 on Ubuntu and macOS with the full suite and real smoke,
      verifies Node 22 install/runtime/lint/focused-contract acceptance on
      Windows 2022, and tests Node 24 on Ubuntu.
- [x] Every configured CI Node major is at least the `engines.node` minimum,
      and the minimum major remains explicitly exercised.
- [x] `engines.node` and the Node `devEngines.runtime` entry must declare the
      same canonical minimum.
- [x] A deterministic checker rejects a single-version matrix, a below-minimum
      matrix, a missing minimum, package declaration disagreement, and a
      `setup-node` step that bypasses `matrix.node`.
- [x] CI runs the checker immediately after dependency installation, and the
      normal test suite covers both accepted and rejected fixtures.
- [x] The workflow can be dispatched manually and the checker rejects removal
      of that reproducible acceptance path.
- [x] The checker rejects drift from the Windows 2022 native toolchain or the
      Node 24-compatible pnpm setup action.
- [x] WSL-only fixtures are explicitly Linux-scoped, and obsolete PTY guard
      fixtures cannot start provider work from the test suite.
- [x] The checker rejects removal of either the Ubuntu/macOS full-suite lane or
      the focused Windows runtime-contract lane.
- [x] The checker keeps the real cross-process readiness smoke on Ubuntu and
      macOS, while Windows runs its deterministic readiness contract fixture.
- [x] The checker accepts semantically identical LF and CRLF workflow text.
- [x] Focused tests, checker execution, provider-disabled tests, typecheck,
      zero-warning lint, build, plan audit, CodeGraph sync, and diff hygiene
      pass.

## Definition Of Done

The plan closes when CI and package metadata share one enforced Node 22+
minimum while the supported matrix also exercises the current active LTS line.

## Execution Notes

- Dispatch `31886180876` proved the Node 22/24 Ubuntu lanes and crossed frozen
  install, runtime-contract, and lint checks on macOS 22 and Windows 2022/22.
- Its macOS suite found 23 host-dependent failures: 21 WSL simulations treated
  `WSL_DISTRO_NAME` as sufficient even though production intentionally requires
  a Linux host, and two PTY guards still asserted that Grok browser mode was
  unsupported.
- Plan version 4 classifies every WSL-dependent fixture with a Linux host gate.
  Production platform detection and cross-platform CI coverage remain unchanged.
- The Windows job then reported native-path failures across fixtures and runtime
  keys, including colon-delimited identifiers that cannot form Windows
  directory names. Plan version 5 keeps Windows acceptance bounded to frozen
  install, checker, lint, focused contract tests, and the real readiness smoke;
  the complete suite remains required on Ubuntu and macOS.
- Dispatch `31886852824` confirmed all WSL classifications on macOS, reducing
  that lane from 23 failures to the two stale PTY expectations. Plan version 6
  showed that changing the rejected model was insufficient because the PTY CLI
  path detached before the guard. Plan version 7 removes those obsolete tests;
  `tests/runOptions.test.ts` retains deterministic compatibility coverage.
- The same dispatch completed the native Windows frozen install and prepare
  build, then found that exact LF substrings in the checker rejected the CRLF
  checkout. Plan version 8 normalizes line endings and guards that behavior.
- Dispatch `31887239152` passed both Ubuntu lanes and the repaired macOS lane;
  Windows passed install, checker, and lint but its mutation fixtures still
  applied LF-only replacements to CRLF source text. Plan version 9 normalizes
  the shared test fixture before accepted/rejected mutations.
- Dispatch `31887469597` passed all four lanes through Windows focused tests,
  then the Windows real-process readiness smoke failed to release its process
  tree and remained stuck for more than four minutes. Plan version 10 keeps the
  real smoke authoritative on Ubuntu/macOS and exercises its deterministic
  readiness projection contract on native Windows.
- Dispatch `31887893017` passed macOS, Ubuntu 24, and the bounded Windows lane.
  Ubuntu 22 alone hit an existing fixed-delay race in the background-drain
  resume fixture: the run remained `in_progress` after an assumed 100 ms.
  Plan version 11 replaces that assumption with a bounded 25 ms status poll.
- Dispatch `31888163009` passed all four required jobs at implementation SHA
  `0235724aa0da4782443ffcdca27176863365b960`: Windows 2022/Node 22 job
  `95020370446`, Ubuntu/Node 22 job `95020370461`, macOS/Node 22 job
  `95020370483`, and Ubuntu/Node 24 job `95020370514`. The Unix lanes passed the
  full suite and real readiness smoke, Windows passed frozen install, runtime
  checker, zero-warning lint, and focused contracts, and Ubuntu 22 passed the
  production build. Local checker, focused tests, provider-disabled suite,
  typecheck, lint, build, plan audit, current CodeGraph sync, and diff hygiene
  also passed. Plan 0327 closes accepted without active configuration, service,
  browser, provider, credential, or installation effects.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; workflow, package metadata, checker, and plan state
  form one small serialized contract
- expected_write_surface: CI workflow, one checker, one focused test, package
  script, and current testing/planning documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or the exact runtime/tooling
  incompatibility is recorded without weakening the declared minimum
