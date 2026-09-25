# Current ChatGPT Model-Picker Trigger Scope | 0372-2026-09-25

State: CLOSED
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
- Personal commit `ab00b5bb` is published to isolated personal `1baker`,
  re-fetched at zero ahead/behind, and installed. Checkout and installed hashes
  match for both compiled `chatgpt.js`
  (`be23198538c872d14d823f7509f62b89eaa86470b89685bc65465eeb418f0367`)
  and `auracall.services.json`
  (`862b95121605c42b9ddc5f5b11284cb77421280c25cb06c8111fc3d4f4be21c4`).
  The AuraCall API restarted healthy as PID `2114101`.
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
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [ ] One fresh round-one learning trace preserves the immutable original
      prompt, exact generation prompt, true author, no parent guard, reviewed
      Markdown/DOCX/PDF packet, and records the browser verdict, score, exact
      Codex final-answer link, and ModelLabs learning-sync result when present.

## Terminal Result

- Exactly one fresh guard ran:
  `document-ab00b5bb-current-model-trigger-r1`, response
  `resp_idem_1d77b287e7e09c3096df86e89439e006`. Round 1 records author `codex`,
  no parent, learning-trace digest
  `c6821c2d71cf8ec4aa250f5bbc62e62a557b4759611c90c61800da1a3544b698`,
  the immutable origin/generation prompt digests, reviewed Markdown, DOCX, and
  PDF.
- The installed selector opened the correct current model menu. Available
  options were `Instant`, checked `Latest`, `GPT-5.6 Sol`, and
  `GPT-5.5 Leaving on October 14`; the old conversation-actions menu did not
  appear. This accepts the model-trigger repair.
- The run then failed before upload or prompt submission because semantic
  `Current Pro` did not match the current flattened menu. No reviewer answer,
  verdict, score, review record, conversation URL, attachment receipt, exact
  Codex final-answer link, or ModelLabs learning sync exists. The runtime lease
  released, no exact project-root task tab remains live, and the guard was not
  replayed.
- Retained Chrome preserved PID/start token `1829010`/`3619174`; only the
  installed AuraCall API restarted.

The unchecked review-output criterion is the next independent compatibility
blocker, not an implicit pass. Any follow-up belongs to a new bounded slice.

## Definition Of Done

Close only after source behavior, publication, installed parity, retained-
browser preservation, and the single bounded forward-review result are
recorded in the roadmap, runbook, journal, and fixes log. A later provider or
UI failure may close this bounded slice only as an exact blocker, never as a
passing end-to-end result.
