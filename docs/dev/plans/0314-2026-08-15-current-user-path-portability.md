# Current User Path Portability | 0314-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove concrete workstation usernames from current documentation paths so the
examples remain usable and non-personal across operator environments, then
enforce that property in the current-documentation audit.

## Current State

- Five current documents contain concrete user-home path roots for historical
  operators while nearby examples already use portable placeholders.
- The affected roots name `ecochran76`, `ecoch`, or `steipete` under Unix,
  macOS, WSL-mounted Windows, or Windows path syntax.
- Plan 0313 rejects one retired checkout root but does not detect other
  concrete usernames in current operator paths.

## Scope

- Replace concrete user-home roots with explicit placeholders, home-relative
  paths, environment configuration, or repository-root discovery as appropriate.
- Preserve the factual and operational meaning of current docs.
- Add a syntax-neutral detector for concrete Unix, macOS, and Windows user-home
  path roots in current documentation.
- Add focused regression coverage and governing evidence.

## Non-Goals

- Do not rewrite append-only plans, notes, journals, or fixes history.
- Do not remove account names or email addresses when they are factual identity
  evidence rather than filesystem paths.
- Do not execute release, provider, browser, MCP, or other live smoke commands.
- Do not ban absolute paths that use clear generic placeholders.

## Acceptance Criteria

- [x] Current documentation contains zero concrete user-home path roots.
- [x] Portable replacements preserve the meaning of each affected example.
- [x] The current-doc audit rejects named Unix, macOS, and Windows user roots
      while accepting documented generic placeholders.
- [x] Focused tests, typecheck, zero-warning lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when current documentation no longer embeds an operator's
filesystem username and the governance audit prevents equivalent named roots
from returning without rejecting portable examples.

## Execution Evidence

- Fourteen affected documentation lines across five current files now use
  explicit placeholders, home-relative paths, environment configuration, or
  repository-root discovery.
- The current-doc audit reports zero validation errors across 315 canonical
  plan candidates.
- Nine focused governance tests, typecheck, warning-strict lint across 833
  files, scoped warning-strict lint, diff hygiene, and the portable tmux
  command's `bash -n` check passed.
- No release, provider, browser, MCP, or other live command ran.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all current user-path portability criteria accepted
- progress_classification: outcome_progress
- evidence: zero concrete current-doc user roots plus cross-platform detector coverage
- material_blockers: none
- next_action_or_stop_reason: publish the portable user-path baseline
