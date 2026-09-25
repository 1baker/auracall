# Current Premium Model Intent | 0366-2026-09-25

State: CLOSED
Lane: P01

## Objective

Make the stable `chatgpt:premium` selector choose the newest versioned Pro
model that the retained ChatGPT workbench actually offers, while keeping
explicit version selectors strict and preserving the browser's real selected
label in response evidence.

## Current State

- Guard `document-22bab5d7-readiness-forward-r1` stopped before file transfer
  or prompt submission because the workbench exposed `5.6Pro` while
  `chatgpt:premium` required `6 Pro`.
- The attachment transport repair is published and installed; this successor
  plan owns only the model-intent mismatch and one fresh forward review.
- Retained Chrome PID `1829010`, start token `3619174`, is externally owned and
  must not be launched, replaced, or closed by this slice.

## Scope

- Resolve `chatgpt:premium` to a semantic current-Pro picker target.
- Accept only a versioned Pro row or pill for that target, preferring the newer
  visible version when more than one is offered.
- Continue mapping explicit GPT-6 and GPT-5.6 Pro selectors to their exact
  versioned targets.
- Add provider-free resolver and DOM-selection regressions.
- Validate, publish to personal GitHub, install once, and run one fresh
  learning-traced file review through the retained browser.

## Non-goals

- Do not weaken browser, account, project, attachment, sent-turn, or selected-
  state identity checks.
- Do not treat an unversioned root `Pro` row as sufficient evidence of a
  current-Pro selection unless it is the leaf of a deliberately opened
  versioned Pro submenu.
- Do not retry or rewrite the failed Plan 0365 guard.
- Do not launch, replace, close, or otherwise take lifecycle ownership of the
  retained browser.

## Execution Bounds

- One source repair and one bounded provider-free rework pass if validation
  exposes a defect.
- One user-runtime installation from a published commit.
- One fresh browser guard submission. Preserve any terminal failure without
  replay under a new identity in this slice.

## Acceptance Criteria

- [x] `chatgpt:premium` carries current-versioned-Pro intent while explicit
      GPT-6 and GPT-5.6 Pro selectors remain strict.
- [x] Provider-free tests cover current-Pro pills, competing versioned rows,
      versioned submenus, and rejection of an unscoped bare `Pro` row.
- [x] Focused tests, no-emit typecheck, production build, touched-file lint,
      diff hygiene, plan audit, and CodeGraph sync pass or disclose exact
      pre-existing findings.
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published commit while the retained
      browser keeps its original process identity.
- [ ] One fresh `--require-learning-trace` review preserves its immutable
      original prompt, exact generation prompt, true author, reviewed files,
      browser verdict and score, exact Codex final-answer link when present,
      and ModelLabs learning-sync result.

## Definition Of Done

Close only after source, publication, installation, browser-preservation, and
the one bounded forward-review result are recorded honestly. A provider or UI
failure may close the execution slice only as a documented blocker, not as a
passing end-to-end result.

## Source Verification

- Six focused suites pass 190 tests. The current-Pro cases accept exact
  `5.6Pro` and `6Pro` pills, prefer `6 Pro` when both known rows are visible,
  enter a versioned submenu before accepting its generic `Pro` leaf, and
  reject an unscoped bare `Pro` option.
- No-emit TypeScript and the production build pass. Touched-file Biome lint
  reports zero errors and 14 existing warnings; diff hygiene passes.
- The full suite passes 3,536 tests, skips 55, and reports four failures. Two
  timing-sensitive failures pass immediately in isolated one-worker reruns.
  The other two are the same raw-route manifest finding at
  `src/http/responsesServer.ts:4337` recorded before this slice.
- The plan audit retains that raw-route finding plus Plan 0357's pre-existing
  noncanonical and missing `State:` findings. CodeGraph sync is current at
  975 files, 18,553 nodes, and 72,448 edges.

## Publication And Installation

- Personal commit `8c118aaaee06678106903f45ef05a38b7da73b83` was pushed
  through isolated `1baker` routing, re-fetched, and verified clean at zero
  ahead and zero behind.
- The previous user runtime is preserved at
  `/home/bak3r/.auracall/backups/user-runtime-pre-8c118aaa-20260925T154130Z`.
- The published checkout was installed once. The installed and checkout hashes
  match for `modelSelector.js`, `modelSelection.js`, `runOptions.js`, and
  `resolver.js`.
- Only `auracall-api.service` restarted, at PID `1288310`. Retained Chrome kept
  PID `1829010` and process start token `3619174` across installation and the
  API restart.

## Forward Review

- A fresh no-launch Agent Browser plan selected profile and session
  `chatgpt-stealth-linux-20260924`, required reuse of browser
  `session:chatgpt-stealth-linux-20260924`, prohibited a duplicate process,
  and required no manual action.
- Guard `document-8c118aaa-premium-forward-r1`, response
  `resp_idem_62e36aa8f44e1edfcacb90a0ee69adfb`, preserved round 1, author
  `codex`, no parent, original-prompt SHA-256
  `fbbeb677688fa4fb16735502c326954ab7bfd7312101fd6665762125ff5343eb`,
  generation-prompt SHA-256
  `ee4823fddb5ad5b6669c96f0e161e466263cd4d6d1db4cb385fd042a13853a9b`,
  and learning-trace digest
  `074c884091924370601663ec4676ca8476eb0ff82d59b121f5d6ec35741f541b`.
  Its private handoff preserves review goal, candidate Markdown, guide,
  prompt, DOCX, and PDF with exact digests.
- The fresh run failed before Agent Browser created a task tab, file transfer,
  model selection, or prompt submission. AuraCall received HTTP 502 from
  `/api/service/request`: the retained session's browser daemon connection was
  refused. The failure is preserved without retry.
- There is no browser verdict, score, review artifact, review chat, exact Codex
  final-answer link, or ModelLabs learning sync. Retained Chrome still reports
  ready with PID `1829010` and start token `3619174`; repair of the missing
  daemon route must preserve that browser and belongs to a separate bounded
  operation.
