# Brokered Attachment Readiness Budget | 0365-2026-09-25

State: CLOSED
Lane: P01

## Objective

Prevent a healthy retained-browser attachment transfer from failing before the
file is injected merely because native-broker command latency exceeds the
ChatGPT workbench's short UI-hydration deadline.

## Current State

- Guard `document-b514afc9-runtime-regression-r1` failed on the first Markdown
  attachment with `Timed out waiting for predicate after 2500ms.`
- The failure happened after the exact retained target was acquired but before
  `File transferred`, prompt submission, provider conversation evidence, a
  verdict, or learning sync.
- `openComposerPopoverWithCdp` used one 2.5-second budget for both the in-page
  menu-ready predicate and the brokered `Runtime.evaluate` round trip. Native
  broker authority and transport may legitimately outlive that UI-only budget.

## Scope

- Keep the 2.5-second workbench-hydration deadline inside ChatGPT's page.
- Let the existing native transport own the outer CDP command bound.
- Add a provider-free regression for the separated deadline.
- Validate, publish, install once, and run one fresh learning-traced guard
  against the retained browser without replacing it.

## Non-goals

- Do not weaken attachment identity, upload-completion, sent-turn UI, model, or
  browser-authority checks.
- Do not replay or rewrite the failed guard.
- Do not launch, replace, close, or otherwise take lifecycle ownership of the
  retained Chrome process.
- Do not change prompts, grading policy, or ModelLabs promotion thresholds.

## Execution Bounds

- One source repair and one bounded rework pass if provider-free validation
  exposes a defect.
- One installed runtime replacement after the published commit is verified.
- One fresh browser guard submission. A terminal failure is preserved and not
  retried under another identity in this slice.

## Acceptance Criteria

- [x] Workbench readiness retains a 2.5-second page-side bound without a
      2.5-second outer broker-command timer.
- [x] Focused tests, no-emit typecheck, production build, touched-file lint,
      diff hygiene, plan audit, and CodeGraph sync pass or disclose exact
      pre-existing findings.
- [x] Personal GitHub publication is committed, pushed through the isolated
      `1baker` route, re-fetched, clean, and zero ahead/behind.
- [x] The user runtime matches the published commit while retained Chrome keeps
      the same process identity.
- [ ] One fresh `--require-learning-trace` review preserves its original
      prompt, exact generation prompt, true author, reviewed artifact, browser
      verdict and score, and ModelLabs learning-sync result.

## Definition Of Done

Close only when the fresh guard reaches a terminal result and all source,
publication, installation, browser-preservation, and learning-trace evidence is
recorded honestly. A provider or UI failure may close this bounded execution
slice only as a documented blocker; it is not a passing end-to-end result.

## Source Verification

- Five focused browser suites passed 87 tests, including a simulated 2.6-second
  broker delay that the old outer 2.5-second timer rejected.
- `pnpm exec tsc --noEmit`, `pnpm run build`, touched-file Biome lint,
  `git diff --check`, and CodeGraph sync/status passed.
- The full Vitest run passed 3,532 tests, skipped 55, and reported five
  failures. Three timing-sensitive failures passed immediately in isolation
  with one worker. The two remaining contract failures are the same raw-route
  manifest finding at `src/http/responsesServer.ts:4337` reported before this
  slice and do not touch the attachment path.
- Full strict lint retains four errors and 23 warnings outside the two touched
  code/test files. The plan audit retains that raw-route finding plus Plan
  0357's pre-existing noncanonical and missing `State:` findings.

## Publication And Installation

- Personal commit `22bab5d7164250d4909469ace9d80aa9f1e00d06` was pushed
  through the isolated `1baker` route, re-fetched, and verified clean at zero
  ahead and zero behind.
- The previous 278 MiB user runtime was preserved at
  `/home/bak3r/.auracall/backups/user-runtime-pre-22bab5d7-20260925T0947`.
- The published checkout was installed once. The installed and checkout
  `dist/src/browser/actions/chatgptComposerTool.js` SHA-256 values both equal
  `418690d651523714f1524481b98af6ae377684b77610657a7d6ad697a1b235f2`.
- Only `auracall-api.service` restarted, at PID `1107587`. Retained Chrome kept
  PID `1829010` and process start token `3619174` across installation and API
  restart.

## Forward Review

- A fresh no-launch Agent Browser access plan selected profile
  `chatgpt-stealth-linux-20260924`, browser
  `session:chatgpt-stealth-linux-20260924`, and the same-named session with
  `reuse_existing_browser`, no manual intervention, and no duplicate process.
- Guard `document-22bab5d7-readiness-forward-r1`, response
  `resp_idem_72b56634095ec131488eff0778cc7251`, recorded round 1, author
  `codex`, no parent guard, original-prompt SHA-256
  `fbbeb677688fa4fb16735502c326954ab7bfd7312101fd6665762125ff5343eb`,
  generation-prompt SHA-256
  `ee4823fddb5ad5b6669c96f0e161e466263cd4d6d1db4cb385fd042a13853a9b`,
  and learning-trace digest
  `0e25e60891e19a2180af25e0f2ac4e6f5d0f5efaaae7dc0f93b61af1d6479583`.
  Its private handoff preserves the review goal, candidate Markdown, guide,
  prompt, DOCX, and PDF with their exact digests.
- The run failed before file transfer or prompt submission because the current
  menu exposed `5.6Pro` while `chatgpt:premium` required `6 Pro`. The failure is
  preserved without retry. There is no browser verdict, score,
  `review-record.md`, exact Codex final-answer link, or ModelLabs learning sync.
  The installed attachment-deadline repair therefore remains source- and
  runtime-verified but did not receive live forward attachment-path proof in
  this bounded slice.
