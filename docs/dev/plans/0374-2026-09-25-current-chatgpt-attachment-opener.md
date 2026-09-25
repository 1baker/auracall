# Current ChatGPT Attachment Opener | 0374-2026-09-25

State: CLOSED
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
- Personal commit `c43e7839` replaced the stale coordinate-only path with the
  shared trusted-pointer helper and was published, installed, and exercised by
  the plan's sole fresh guard.
- Guard `document-c43e7839-current-attachment-trusted-r1`, response
  `resp_idem_86dfc972a4858ec4e8e12a8d2504905c`, preserved round 1, author
  `codex`, no parent, immutable original and exact generation prompts, the
  reviewed Markdown/DOCX/PDF packet, and learning-trace digest
  `5a0b7e9978170ef48b88e80ce1409d55f4cb6dede88bb526ff2f5feaebe4f8f9`.
  It failed before upload or prompt submission because the helper's first
  target evaluation inherited only 145 ms of remaining broker command budget.
  There is no browser verdict, score, review record/chat, conversation URL,
  exact Codex final-answer link, attachment receipt, or ModelLabs learning
  sync. The exact task tab was physically closed and the guard was not rerun.
- The allowed provider-free rework in personal commit `630d1247` keeps the
  exact visibility and hit-test checks, native CDP mouse input, trusted click
  receipt, and strict menu/action/input resolver, but performs target setup and
  page-local readiness through direct evaluations without inner transport
  timeouts. It removes the synthetic fallback. The commit is published and
  installed with compiled SHA-256
  `8daf3d5d01dba12c31062d300583170b8b405c3ac654199e7a5a49e792874017`.
- AuraCall API is healthy as PID `2470517`; retained Chrome stayed at PID/start
  token `1829010`/`3619174`. The terminal live result remains a failed guard,
  so successful end-to-end attachment and review acceptance is not claimed.
- Strict touched-file lint, typecheck, the production build, 36 focused and
  adjacent attachment tests, CodeGraph sync/status, and diff hygiene pass. The
  final full suite passes 3,547 tests with 55 skips and repeats the two existing
  raw-route contract failures; two load-sensitive failures pass 1/1 and 7/7 in
  isolation. Plan audit repeats only the three existing findings.

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
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [x] One fresh round-one learning trace preserves the immutable original
      prompt, exact generation prompt, true author, no parent guard, reviewed
      Markdown/DOCX/PDF packet, browser verdict and score when present, exact
      Codex final-answer link when present, and ModelLabs learning-sync result.

## Definition Of Done

Closed with the source behavior, publication, installed parity, retained-
browser preservation, and single bounded forward-review result recorded in the
roadmap, runbook, journal, and fixes log. The sole guard is an exact pre-upload
failure, not a passing end-to-end result. A future independent guard identity
is required to prove the installed rework live.
