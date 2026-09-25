# ChatGPT Attachment Hydration Retry | 0375-2026-09-25

State: CLOSED
Lane: P01

## Objective

Repair the exact current ChatGPT attachment opener's one-attempt hydration race
after the installed Plan 0374 rework reached the live menu step but failed
before file upload or prompt submission.

## Current State

- Personal commit `630d1247` is published and installed. It preserves exact
  opener hit-testing and trusted native pointer input without the stale nested
  broker timeout.
- Fresh round-one guard `document-630d1247-attachment-budget-r1`, response
  `resp_idem_7c7cd55ce69126ead082c177fd0dadce`, preserved the immutable original
  prompt, exact generation prompt, true author, no parent, reviewed
  Markdown/DOCX/PDF packet, and required learning trace.
- The guard opened one exact retained-browser project tab and passed route,
  login, Chat-mode, Current Pro, and project-context checks. It then failed
  closed on the first attachment with `menu-not-found`, before upload or prompt
  submission. It produced no answer, verdict, score, review record, conversation
  URL, attachment receipt, exact Codex final-answer link, or ModelLabs learning
  sync.
- Service evidence shows the task tab changed from the generic `ChatGPT` title
  to the hydrated project title at `2026-09-25T22:33:50.561Z`, only about two
  seconds before the attachment failure and exact tab release.
- One no-launch, task-owned diagnostic tab then proved the same project still
  exposes the exact `Add files and more` opener, `.composer-home-top-menu`, exact
  `Add photos & files` and `Add library files` actions, and one unrestricted
  multiple `Attach files` input. The Agent Browser click opened that menu after
  hydration. The diagnostic tab and failed guard tab were both physically
  closed while retained Chrome PID/start token `1829010`/`3619174` was
  preserved.

## Scope

- Re-resolve and hit-test the same exact attachment opener once after the first
  page-local menu-readiness window misses.
- Preserve the trusted native pointer receipt and the strict menu, local-file
  action, and unrestricted single-input resolver on both attempts.
- Add provider-free positive and bounded fail-closed regressions.
- Update the narrow operator continuity records, validate, publish through
  personal `1baker`, and install once without replacing retained Chrome.

## Non-goals

- Do not add selector aliases, synthetic clicks, generic menus, or generic file
  inputs.
- Do not upload or submit during browser diagnosis.
- Do not replay the terminal guard or create a second provider submission in
  this slice.
- Do not change model selection, Chat/Work mode, review semantics, or retained-
  browser ownership.

## Execution Bounds

- One already-terminal round-one document guard.
- One completed read-only retained-browser diagnostic using one exact task tab.
- One source repair and one provider-free validation pass.
- One personal publication and one installed-runtime update.
- Zero additional provider submissions in this slice.

## Acceptance Criteria

- [x] A first menu-readiness miss triggers exactly one fresh resolution and
      trusted-pointer attempt against the same exact opener.
- [x] A second miss still returns `menu-not-found` without selector or input
      broadening.
- [x] Focused tests, typecheck, production build, touched-file lint, diff
      hygiene, plan audit, and CodeGraph sync pass or disclose exact existing
      findings.
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published build and retained Chrome
      keeps its original process identity.
- [x] The terminal guard and both task-tab cleanup receipts remain preserved;
      no successful end-to-end review is claimed without a later independent
      guard.

## Closeout Evidence

- Personal commit `cbb62748` implements the bounded retry and its positive and
  fail-closed regressions. It is published through isolated `1baker` routing.
- The four focused/adjacent suites pass 38 tests. Typecheck, production build,
  touched-file lint, diff hygiene, and CodeGraph sync/status pass.
- The full suite passes 3,550 tests with 55 skips. It repeats two existing raw-
  route contract failures; its additional load-sensitive CLI failure passes
  7/7 in isolation. Plan audit repeats only the existing raw-route finding and
  the two Plan 0357 header findings.
- The published build and installed module share SHA-256
  `213056873a0b62e53deb540e625c0c2a5ac1e32d0882ffb125f7aa9f7a77a1bf`.
  AuraCall API is healthy as PID `2576185`; retained Chrome kept PID/start token
  `1829010`/`3619174`.
- No second provider submission occurred. The failed guard record and both
  physical task-tab cleanup receipts remain the live boundary; a later new
  guard identity is required for successful end-to-end acceptance.

## Definition Of Done

Close after the bounded retry is validated, published, installed, and recorded
with exact failed-guard and cleanup evidence. A later new guard identity is
required to prove live file upload, prompt submission, reviewer output, and
ModelLabs learning sync.
