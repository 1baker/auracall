# Brokered Attachment Readiness Budget | 0365-2026-09-25

State: OPEN
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
- [ ] Personal GitHub publication is committed, pushed through the isolated
      `1baker` route, re-fetched, clean, and zero ahead/behind.
- [ ] The user runtime matches the published commit while retained Chrome keeps
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
