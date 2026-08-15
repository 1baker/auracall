# Current Command Path Portability | 0313-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Remove the retired checkout root from current command and contract examples so
operators can execute them from any AuraCall checkout, then enforce that
portability in the current-documentation audit.

## Current State

- Four current documents now contain portable repository-root examples in
  place of all 17 retired checkout references.
- README, manual-test, and testing commands preserve absolute local-action
  roots and structured cwd values.
- The response-shape contract uses an explicit generic absolute-path placeholder.
- Plan 0312 rejects absolute checkout Markdown links but does not inspect
  ordinary command or JSON content.

## Scope

- Use the current repository root in executable shell examples.
- Use an explicit generic absolute-path placeholder in the pure JSON contract.
- Extend the current-doc audit to reject the retired checkout root anywhere in
  current documentation.
- Add focused regression coverage and governing evidence.

## Non-Goals

- Do not rewrite append-only plans, notes, journals, or fixes history.
- Do not execute the live provider-backed smoke commands.
- Do not change local-action runtime semantics.

## Acceptance Criteria

- [x] Current documentation contains zero retired-checkout references.
- [x] Shell examples preserve an absolute allowed-root and structured cwd.
- [x] The current-doc audit deterministically rejects retired path content.
- [x] Focused tests, typecheck, zero-warning lint, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when current command documentation is checkout-portable and
the governance audit prevents the retired root from reappearing outside
historical evidence.

## Execution Evidence

- Current-doc scan reports zero retired checkout-root references.
- Seven executable tooling examples pass `bash -n`; no live command ran.
- Seven focused governance tests, typecheck, zero-warning lint across 833 files,
  plan audit with zero errors, and diff hygiene passed.
- Append-only plans, notes, journal, and fixes history remain excluded from the
  steady-state rule and were not rewritten.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all current command portability criteria accepted
- progress_classification: outcome_progress
- evidence: zero retired current-doc paths plus shell syntax proof
- material_blockers: none
- next_action_or_stop_reason: publish the portable command baseline
