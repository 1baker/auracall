# Current ChatGPT Model-Picker Trigger Scope | 0372-2026-09-25

State: OPEN
Lane: P01

## Objective

Bind Chat model selection to ChatGPT's current model-picker control so a
conversation-actions trigger cannot be mistaken for the model picker, while
preserving exact current-Pro selection and fail-closed diagnostics.

## Current State

- Plan 0371 published and installed exact recognition of the current default
  project composer.
- Its sole fresh traced guard proved that Chat-mode decision, then failed
  before upload or prompt submission because model selection opened the
  conversation-actions menu and reported `Share`, `Rename`, `Pin chat`,
  `Archive`, `Delete`, `Move to project`, and `Remove from project` as model
  options.
- A fresh no-launch plan selected the exact retained session with duplicate
  process launch forbidden. Its one task-owned diagnostic tab proved the real
  composer control is `button[aria-label="Select ChatGPT model"]`, inside the
  composer form, with `aria-haspopup="menu"`. The competing project buttons
  are outside the form and carry labels such as
  `Actions for Review ModelLabs Evidence`.
- The old case-sensitive generic `aria-label*="Model"` selectors therefore
  missed the true lowercase-`model` label while accepting project action
  buttons containing `ModelLabs` or `Model`. One exact bounded click opened
  the expected model menu (`Instant`, `Power`, `Latest`, `GPT-5.6 Sol`, and
  `GPT-5.5 Leaving on October 14`) without upload or prompt submission.
- The exact diagnostic tab was released and physically closed while retaining
  Chrome PID/start token `1829010`/`3619174`.
- The exact-selector repair and provider-free regressions pass 55 focused
  tests and 299 widened adjacent tests with one intentional skip. Typecheck,
  production build, error-level touched-file lint, and diff hygiene pass.
  Plan audit repeats only three existing findings: the raw response-route
  regex and Plan 0357's noncanonical/missing state header.
- The full suite passes 3,544 tests with 55 skips. Its two raw-route contract
  failures are the existing route-manifest debt; two unrelated timing-sensitive
  background-completion cases both pass in a bounded single-worker rerun.
- Retained Chrome is externally owned at PID `1829010`, start token `3619174`,
  and must not be launched, replaced, or closed.

## Scope

- Use a fresh no-launch access plan and one disposable task-owned retained tab
  to inspect only bounded attributes and ancestry of the model-picker and
  conversation-actions controls.
- Tighten Chat model-picker trigger qualification at the provider-owned action
  boundary and add provider-free positive and negative regression coverage.
- Validate, publish through personal `1baker`, install once while preserving
  retained Chrome, then run exactly one fresh round-one learning-traced
  document guard.

## Non-goals

- Do not broaden fuzzy menu or option matching.
- Do not change Work-mode selection, attachment, account, project, review, or
  retained-browser lifecycle contracts.
- Do not upload or submit during the diagnostic.
- Do not replay Plan 0371's terminal response or guard identity.
- Do not launch, replace, close, or clean the retained browser/profile.

## Execution Bounds

- One no-launch authority check, one disposable diagnostic tab, and release of
  only that exact tab.
- One source repair and one provider-free rework pass if focused validation
  exposes a defect.
- One published user-runtime installation.
- One fresh no-launch authority check and one new round-one
  `--require-learning-trace` guard. Preserve its terminal result without a
  second guard in this slice.

## Acceptance Criteria

- [x] The live current model-picker trigger is distinguished from the current
      conversation-actions trigger by exact bounded evidence.
- [x] Provider-free tests accept the true trigger and reject the conversation
      trigger/menu without weakening exact current-Pro selection.
- [x] Focused tests, typecheck, production build, touched-file lint, diff
      hygiene, plan audit, and CodeGraph sync pass or disclose exact existing
      findings.
- [ ] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [ ] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [ ] One fresh round-one learning trace preserves the immutable original
      prompt, exact generation prompt, true author, no parent guard, reviewed
      Markdown/DOCX/PDF packet, and records the browser verdict, score, exact
      Codex final-answer link, and ModelLabs learning-sync result when present.

## Definition Of Done

Close only after source behavior, publication, installed parity, retained-
browser preservation, and the single bounded forward-review result are
recorded in the roadmap, runbook, journal, and fixes log. A later provider or
UI failure may close this bounded slice only as an exact blocker, never as a
passing end-to-end result.
