# MCP Launch Contract Reconciliation | 0315-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make every current MCP launch and client-registration example agree with the
actual AuraCall user-runtime and repository binaries, then enforce that
contract across current docs, package metadata, and the tracked mcporter config.

## Current State

- `package.json` exposes `auracall-mcp` and the user-runtime installer writes
  its wrapper under `~/.local/bin`.
- Public npm distribution is explicitly deferred, but README and MCP docs still
  advertise `npx auracall auracall-mcp`, which selects the `auracall` binary and
  passes `auracall-mcp` as an argument rather than launching the MCP binary.
- The MCP smoke guide names a nonexistent `oracle` mcporter entry, the retired
  `@steipete/oracle` package, an `oracle` Claude server id, and a personal MCP
  config path.
- `config/mcporter.json` has valid `auracall-local` wiring, but its installed
  `auracall` entry uses the invalid npx form and an unrelated `iterm` entry
  embeds a personal absolute path.

## Scope

- Document the installed `auracall-mcp` wrapper and repository-local
  `pnpm mcp` / `auracall-local` paths as the only current launch contracts.
- Use `auracall` consistently as the MCP client registration id.
- Repair the tracked `auracall` mcporter entry and remove the unrelated
  machine-specific iTerm entry.
- Reject deprecated Oracle package/registration examples and invalid AuraCall
  npx launch forms in current documentation.
- Validate the canonical package bin and both tracked AuraCall mcporter entries.

## Non-Goals

- Do not rename internal `src/oracle` modules or compatibility environment
  variables.
- Do not rename or rebuild `vendor/oracle-notifier`.
- Do not publish AuraCall to npm or create a release.
- Do not run provider, browser, Claude, or other effectful live smokes.
- Do not change MCP protocol handlers or tool schemas.

## Acceptance Criteria

- [x] Current MCP docs contain no deprecated Oracle package/registration form
      or invalid `npx auracall auracall-mcp` launch.
- [x] README, MCP reference, smoke guide, package bin, and mcporter config agree
      on installed and repository-local launch paths.
- [x] The tracked mcporter config contains no concrete user-home path.
- [x] Deterministic tests and plan audit reject launch/config regressions.
- [x] MCP protocol smoke, build, typecheck, zero-warning lint, plan audit, and
      diff hygiene pass.

## Definition Of Done

The plan closes when current MCP onboarding and smoke instructions launch the
actual AuraCall MCP binary, the tracked config is portable, and deterministic
gates prevent the same Oracle/npx drift from returning.

## Execution Evidence

- Reconciled nine stale documentation launch/registration surfaces and two
  tracked mcporter defects without changing intentional compatibility/vendor
  names.
- The built local and installed `auracall-mcp` entries both listed successfully
  through mcporter; the local `sessions` call exited successfully without
  provider work.
- Four stdio protocol suites passed five tests; twelve focused governance tests,
  production build, typecheck, zero-warning lint across 835 files, plan audit
  across 316 candidates, diff hygiene, six shell syntax checks, and three JSON
  example parses passed.
- AuraCall npm publication/one-off launch, providers, browsers, Claude, and
  releases were not invoked; npx was used only for the provider-free mcporter
  verifier.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all MCP launch contract criteria accepted
- progress_classification: outcome_progress
- evidence: local and installed mcporter proof plus deterministic launch/config gates
- material_blockers: none
- next_action_or_stop_reason: publish the reconciled MCP launch baseline
