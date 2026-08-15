# CI Node Runtime Contract | 0327-2026-08-15

State: OPEN
Lane: P01
Plan version: 3

## Goal

Make GitHub Actions validate AuraCall on its declared minimum Node runtime and
the current active LTS line, with a deterministic guard against future
workflow/package drift.

## Current State

- `package.json` declares Node `>=22` in both `engines` and `devEngines`.
- README installation guidance also requires Node 22+.
- GitHub Actions explicitly installs Node 20 on Ubuntu, macOS, and Windows,
  even though Node 20 is now end-of-life and below the package contract.
- No repository test checks that package runtime declarations and CI agree.

## Scope

- Keep `package.json` as the minimum-runtime authority.
- Test Node 22 across Ubuntu, macOS, and the supported Windows 2022 runner whose
  Visual Studio 2022 toolchain can build the existing PTY test dependency.
- Add one Ubuntu lane for Node 24, the current active LTS line.
- Add a reusable contract checker that rejects package declaration mismatch,
  CI versions below the minimum, omission of the minimum, omission of a newer
  supported line, or bypass of the workflow matrix.
- Run the contract checker directly in CI and through the normal test suite.
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
- Do not add another version file whose values can drift from `package.json`.

## Acceptance Criteria

- [ ] CI tests Node 22 on Ubuntu, macOS, and Windows 2022 and Node 24 on Ubuntu.
- [ ] Every configured CI Node major is at least the `engines.node` minimum,
      and the minimum major remains explicitly exercised.
- [ ] `engines.node` and the Node `devEngines.runtime` entry must declare the
      same canonical minimum.
- [ ] A deterministic checker rejects a single-version matrix, a below-minimum
      matrix, a missing minimum, package declaration disagreement, and a
      `setup-node` step that bypasses `matrix.node`.
- [ ] CI runs the checker immediately after dependency installation, and the
      normal test suite covers both accepted and rejected fixtures.
- [ ] The workflow can be dispatched manually and the checker rejects removal
      of that reproducible acceptance path.
- [ ] The checker rejects drift from the Windows 2022 native toolchain or the
      Node 24-compatible pnpm setup action.
- [ ] Focused tests, checker execution, provider-disabled tests, typecheck,
      zero-warning lint, build, plan audit, CodeGraph sync, and diff hygiene
      pass.

## Definition Of Done

The plan closes when CI and package metadata share one enforced Node 22+
minimum while the supported matrix also exercises the current active LTS line.

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
