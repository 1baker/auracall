# Current ChatGPT Attachment Opener | 0374-2026-09-25

State: OPEN
Lane: P01

## Objective

Restore the exact current ChatGPT local-file attachment path after the live
retained-browser guard passed Chat mode and Current Pro selection but could not
open the attachment surface.

## Current State

- Plan 0373 is published, installed, and proved the current flat `Latest`
  model decision in the live retained route.
- Its sole learning-traced guard then failed before file transfer or prompt
  submission because `prepareChatgptWorkbenchLocalAttachment(...)` returned
  `menu-not-found`.
- Source currently expects the composer opener to expose the historical
  `Add files and more` contract and the opened surface to match either the
  legacy popover or `.composer-home-top-menu`.
- The terminal Plan 0373 response and guard are preserved and must not be
  replayed.
- Retained Chrome is externally owned at PID `1829010`, start token `3619174`,
  and must not be launched, replaced, or closed.
- The bounded no-launch diagnostic reused that retained browser and one task-
  owned tab. The live page still exposes the exact `Add files and more`
  opener, `.composer-home-top-menu`, exact `Add photos & files` action, and
  one unrestricted multiple `Attach files` input. The Agent Browser shared
  click opened the menu immediately; the inspection tab was then physically
  closed while the browser process was preserved.
- AuraCall now opens the composer surface through the shared trusted-pointer
  helper, which re-resolves, scrolls, hit-tests, clicks, and verifies trusted
  activation of the exact opener. The strict menu/action/input resolver is
  unchanged.
- Strict touched-file lint, typecheck, the production build, 36 focused and
  adjacent attachment tests, CodeGraph sync/status, and diff hygiene pass. The
  full suite passes 3,548 tests with 55 skips and repeats the two existing raw-
  route contract failures; its one load-sensitive detached-CLI failure passes
  all 7 tests in isolation. Plan audit repeats only the three existing
  findings.

## Scope

- Start with a fresh no-launch Agent Browser access plan and normal task
  authority checks.
- Use one disposable task-owned retained-browser tab to inspect only the
  current attachment opener, opened menu structure, and local-file chooser.
- Derive the narrow provider-owned contract from the live DOM while preserving
  the proved legacy and Plan 0370 current contracts.
- Add provider-free positive and negative regressions for the observed
  structure, ambiguity, and restricted or missing file inputs.
- Update the narrow operator documentation, validate, publish through personal
  `1baker`, install once while preserving retained Chrome, and run exactly one
  fresh round-one learning-traced document guard.

## Non-goals

- Do not upload a file or submit a prompt during the diagnostic inspection.
- Do not broaden matching to arbitrary composer buttons, visible menus, or file
  inputs.
- Do not change model selection, Chat/Work mode, account, review, or retained-
  browser lifecycle contracts.
- Do not replay any prior response or guard identity.
- Do not launch, replace, close, or clean the retained browser/profile.

## Execution Bounds

- One read-only live DOM inspection with one exact task tab.
- One source repair and one provider-free rework pass if focused validation
  exposes a defect.
- One published user-runtime installation.
- One fresh no-launch authority check and one new round-one
  `--require-learning-trace` guard. Preserve its terminal result without a
  second guard in this slice.

## Acceptance Criteria

- [x] The current attachment opener and one exact local-file chooser are bound
      to the observed ChatGPT structure without weakening prior contracts.
- [x] Wrong labels, unrelated menus, duplicate or restricted file inputs, and
      ambiguous structures remain fail-closed.
- [x] Focused tests, typecheck, production build, touched-file lint, diff
      hygiene, plan audit, and CodeGraph sync pass or disclose exact existing
      findings.
- [ ] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [ ] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [ ] One fresh round-one learning trace preserves the immutable original
      prompt, exact generation prompt, true author, no parent guard, reviewed
      Markdown/DOCX/PDF packet, browser verdict and score when present, exact
      Codex final-answer link when present, and ModelLabs learning-sync result.

## Definition Of Done

Close only after source behavior, publication, installed parity, retained-
browser preservation, and the single bounded forward-review result are
recorded in the roadmap, runbook, journal, and fixes log. A later independent
provider or UI failure may close this bounded slice only as an exact blocker,
never as a passing end-to-end result.
