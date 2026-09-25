# Current Pro Latest Leaf | 0369-2026-09-25

State: CLOSED
Lane: P01

## Objective

Make `chatgpt:premium` follow ChatGPT's current Pro model when the thinking-
effort picker exposes an exact `Select model` view whose current model is named
`Latest`, without allowing a generic checked row, effort label, or unrelated
menu to satisfy Pro intent.

## Current State

- Plan 0368 proved retained `tab_new`, focus, task authority, and CDP attach on
  Chrome PID `1829010`, start token `3619174`, and CDP port `39415`.
- Its fresh traced guard then stopped before upload or prompt submission because
  `Current Pro` reported `High`, a checked `Late t` row, `GPT-5.6 Sol`, and
  `GPT-5.5 Leaving on October 14` but no versioned Pro label. A provider-free
  negative regression later proved the live row was `Latest`; AuraCall's
  embedded diagnostic whitespace regex had lost its escape and removed `s`.
- A fresh disposable-tab inspection proved the live structure: the composer
  pill is `High`; its `Thinking effort` menu contains the exact `Select model`
  row; the expanded model-selection view contains checked `Latest`, unchecked
  `GPT-5.6 Sol`, and unchecked `GPT-5.5` rows. The inspection submitted no
  prompt and its exact task tab was closed afterward.
- The retained browser is externally owned and must not be launched, replaced,
  or closed by this slice.

## Scope

- Derive the current-Pro decision from an exact expanded `Select model` parent,
  the active model-selection view, and its exact `Latest` radio leaf.
- Reject `Latest` outside that proven model-selection scope, and reject unrelated
  checked rows or effort controls by themselves.
- Correct the diagnostic whitespace escape so option labels remain exact.
- Add a provider-free fake-DOM regression for the exact observed parent/leaf
  transition and failure cases.
- Validate, publish to personal GitHub, install once without taking retained-
  browser lifecycle ownership, and run one new learning-traced document guard.

## Non-goals

- Do not infer model identity from `aria-checked` alone.
- Do not fuzzy-match the corrupted `Late t` diagnostic string.
- Do not weaken account, project, selected-state, attachment, sent-turn, or
  response identity checks.
- Do not replay Plan 0368's terminal response or guard identity.
- Do not modify or publish the dirty Agent Browser checkout.

## Execution Bounds

- One source repair and one provider-free rework pass if validation finds a
  defect.
- One user-runtime installation from a published commit.
- One fresh no-launch authority check and one new learning-traced guard. A
  terminal failure is preserved without another guard in this slice.

## Acceptance Criteria

- [x] `Current Pro` accepts `Latest` only after AuraCall opened or observed the
      expanded exact `Select model` parent and active model-selection view.
- [x] Explicit GPT-6 and GPT-5.6 Pro selectors remain strict, and unrelated
      checked/model/effort rows remain rejected.
- [x] Focused tests, typecheck, production build, touched-file lint, diff
      hygiene, plan audit, and CodeGraph sync pass or disclose exact existing
      findings.
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [x] One fresh `--require-learning-trace` review preserves the immutable
      original prompt, exact generation prompt, true author, and reviewed
      files, and records the browser verdict, score, exact Codex final-answer
      link, and ModelLabs learning-sync result exactly when present.

## Verification

- Eight focused browser/config/runtime suites pass `222` tests with one
  intentional skip; the selector suite passes `29/29`, including exact scoped
  `Latest` acceptance and unscoped checked-`Latest` rejection.
- `pnpm run check`, `pnpm run build`, and `git diff --check` pass.
- Touched-file Biome lint has zero errors and eight existing test-fixture
  naming warnings.
- CodeGraph is up to date at `975` files, `18,574` nodes, and `72,485` edges;
  its existing v1.5 full-reindex advisory remains non-blocking.
- Plan audit repeats three existing repository findings: the raw route regex in
  `src/http/responsesServer.ts:4337` and the two canonical-header findings in
  Plan 0357.

## Terminal Result

Personal commit `e4c3ba93` was pushed through the isolated `1baker` route. The
combined user-runtime install restarted only AuraCall API as healthy PID
`1669463`. Built and installed `modelSelection.js` match at SHA-256
`eba61a70f514056b6c2da2f93f93b4e7ecaecd96cc994a2ee98c066a686f7541`.
Retained Chrome stayed PID `1829010`, start token `3619174`.

The immediate no-launch access plan selected profile and session
`chatgpt-stealth-linux-20260924`, `attached_existing`, `tab_new`, and one
compatible live browser with duplicate launch disabled. Guard
`document-e4c3ba93-latest-model-r1`, response
`resp_idem_7edfd2a31c24037336ffdcd1f9f241a9`, preserved the immutable original
prompt, exact generation prompt, author `codex`, candidate Markdown, DOCX, PDF,
all source/reference hashes, and learning-trace digest
`3c545e0cd2426561d03f138681aa0f80e53fea6d5d2543a9603063f69fc27911`.

The installed live route selected `Latest`, proving the repaired model-menu
decision. It then stopped before completing the first attachment upload or
submitting the prompt with `local-file-action-not-found`: the workbench did not
expose the required exact `Add photos & files` row plus one unrestricted
`#upload-files` input. There is no provider answer, verdict, score, review
record/chat, canonical conversation URL, exact Codex final-answer link,
attachment receipt, or ModelLabs learning sync. The guard was not replayed and
no second guard was created. Its runner lease released as failed, the task
target is absent, retained tab count returned to ten, and Chrome remained
unchanged.

## Definition Of Done

Close only after the source decision, publication, installed parity, retained-
browser preservation, and one bounded forward-review result are recorded in the
roadmap, runbook, journal, and fixes log. A provider or UI failure may close the
slice only as an exact blocker, never as a passing end-to-end result.
