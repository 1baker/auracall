# Current Pro `Latest` Flat Menu | 0373-2026-09-25

State: OPEN
Lane: P01

## Objective

Let semantic `chatgpt:premium` recognize ChatGPT's exact `Latest` radio in the
current flat model menu opened by the exact `Select ChatGPT model` composer
control, without weakening explicit GPT-6 or GPT-5.6 Pro selection.

## Current State

- Plan 0372 published and installed the exact current model-picker trigger and
  rejected the competing conversation-actions trigger.
- Its sole fresh traced guard opened the correct current model menu. The live
  rows were `Instant`, checked `Latest`, `GPT-5.6 Sol`, and
  `GPT-5.5 Leaving on October 14`.
- The run failed before attachment upload or prompt submission because the
  earlier `Current Pro` compatibility rule accepts `Latest` only inside the
  older nested `Select model` view. The current exact composer trigger opens a
  flat model menu instead.
- The terminal guard is preserved and must not be replayed. It produced no
  reviewer answer, verdict, score, review record, conversation URL, exact
  Codex final-answer link, attachment receipt, or ModelLabs learning sync.
- Retained Chrome is externally owned at PID `1829010`, start token `3619174`,
  and must not be launched, replaced, or closed.

## Scope

- Carry exact trigger provenance into model-menu interpretation.
- Accept an exact `Latest` `menuitemradio` for `Current Pro` only when the
  exact current trigger opened one containing menu with at least one distinct,
  recognized model sibling.
- Preserve the existing older nested `Select model` contract.
- Add provider-free positive and negative regressions for the flat menu and
  explicit-version isolation.
- Update the narrow operator documentation, validate, publish through personal
  `1baker`, install once while preserving retained Chrome, and run exactly one
  fresh round-one learning-traced document guard.

## Non-goals

- Do not accept `Latest` from an unrelated menu, checked state alone, an effort
  menu, or a fallback picker trigger.
- Do not change Work-mode selection, attachment, project, account, review, or
  retained-browser lifecycle contracts.
- Do not replay Plan 0372's response or guard identity.
- Do not launch, replace, close, or clean the retained browser/profile.

## Execution Bounds

- One source repair and one provider-free rework pass if focused validation
  exposes a defect.
- One published user-runtime installation.
- One fresh no-launch authority check and one new round-one
  `--require-learning-trace` guard. Preserve its terminal result without a
  second guard in this slice.

## Acceptance Criteria

- [x] `Current Pro` accepts the exact `Latest` radio in the proved current flat
      model menu and still accepts the older proved nested model view.
- [x] Unscoped `Latest`, a lone `Latest` row, fallback triggers, unrelated
      menus, and explicit GPT-6/GPT-5.6 selectors remain fail-closed.
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

## Verification

- The selector and adjacent browser/config suites pass 172 tests with one
  intentional skip, including exact-trigger flat-menu acceptance, compatibility-
  trigger rejection, lone-`Latest` rejection, older nested-view compatibility,
  and explicit-version isolation.
- `pnpm run check`, `pnpm run build`, error-level touched-file Biome lint,
  `git diff --check`, and CodeGraph sync pass.
- The full suite passes 3,547 tests with 55 skips. Its two deterministic
  failures repeat the existing raw-route manifest debt. Two unrelated
  timing-sensitive tests fail under full-suite load and pass in isolated
  reruns: 31/31 runtime-runner tests and 7/7 CLI integration tests.
- Plan audit repeats three existing repository findings: the raw response-route
  regex and Plan 0357's noncanonical and missing state header.

## Definition Of Done

Close only after source behavior, publication, installed parity, retained-
browser preservation, and the single bounded forward-review result are
recorded in the roadmap, runbook, journal, and fixes log. A later provider or
UI failure may close this bounded slice only as an exact blocker, never as a
passing end-to-end result.
