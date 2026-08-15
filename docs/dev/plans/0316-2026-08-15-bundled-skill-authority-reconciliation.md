# Bundled Skill Authority Reconciliation | 0316-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make the repository's bundled Codex skills install and invoke AuraCall through
the current user-runtime and CLI contracts, with deterministic protection
against a return to the retired Oracle package surface.

## Current State

- The repository publishes `auracall` and `auracall-mcp`, and public npm
  distribution remains deferred.
- `skills/oracle`, `skills/oracle-chatgpt`, and `skills/oracle-gemini` still use
  Oracle names; the main skill tells users to run `npx -y @steipete/oracle`.
- The README installs only `skills/oracle`, preserving the retired user-facing
  identity and omitting the other four bundled skill packages.
- All three skill folders pass the structural skill validator, so the defect is
  authority drift rather than malformed frontmatter.
- Current setup/login guidance prefers AuraCall's managed-profile `wizard` and
  `setup` flows; the provider skills still lead with legacy flat config edits.

## Scope

- Replace the three bundled `oracle*` skill packages with `auracall*` packages.
- Reconcile commands, models, setup/login guidance, session storage, and safety
  language with current AuraCall CLI help and documentation.
- Update README installation guidance for the complete five-skill bundle.
- Add a deterministic bundled-skill contract and integrate it with plan audit.
- Validate each skill with the canonical skill validator plus focused repository
  tests and standard repository gates.

## Non-Goals

- Do not rename internal `src/oracle` modules or compatibility environment
  variables.
- Do not rename or rebuild `vendor/oracle-notifier`.
- Do not publish AuraCall to npm or create a release.
- Do not run provider, browser, login, setup, or other effectful live smokes.
- Do not add skill aliases for the retired Oracle names.

## Acceptance Criteria

- [x] Bundled skill directories and frontmatter use AuraCall names exclusively.
- [x] Every bundled command and installation example targets the current
      `auracall` user runtime rather than npm or Oracle.
- [x] ChatGPT and Gemini guidance uses current managed-profile setup and current
      browser model selectors.
- [x] README installs the complete five-skill bundle.
- [x] Deterministic tests and plan audit reject stale names, commands, missing
      skill packages, and README drift.
- [x] Skill validation, focused tests, typecheck, zero-warning lint, plan audit,
      and diff hygiene pass.

## Definition Of Done

The plan closes when users can copy any bundled skill under its AuraCall name,
follow only current runtime guidance, and repository validation prevents the
same Oracle skill drift from returning.

## Execution Evidence

- Replaced the three Oracle-named skill packages with `auracall`,
  `auracall-chatgpt`, and `auracall-gemini`; retained and included the existing
  `auracall-agent-setup` and `auracall-api-workflow` packages.
- Reconciled setup, model, session, safety, and installation guidance with
  current CLI help without running browsers, providers, login, or setup.
- All five skill folders passed the canonical skill validator. Seven focused
  governance tests, typecheck, zero-warning lint across 837 files, production
  build, 317-plan audit with zero validation errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all bundled skill authority criteria accepted
- progress_classification: outcome_progress
- evidence: canonical skill validation plus deterministic bundle and repository gates
- material_blockers: none
- next_action_or_stop_reason: publish the reconciled bundled skill baseline
