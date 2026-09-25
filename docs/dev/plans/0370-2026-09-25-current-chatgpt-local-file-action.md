# Current ChatGPT Local-File Action | 0370-2026-09-25

State: CLOSED
Lane: P01

## Objective

Restore exact, fail-closed recognition of ChatGPT's current local-file
attachment action so AuraCall can upload the reviewed Markdown, DOCX, and PDF
packet through the retained browser without weakening file-input or sent-turn
evidence.

## Current State

- Plan 0369 proved the retained route and current Pro `Latest` model selection.
- Its sole fresh learning-traced guard then stopped before the first completed
  upload or prompt submission with `local-file-action-not-found`.
- The prior installed contract required one exact `Add photos & files` row
  whose description is `Upload from computer`, plus one unrestricted,
  multi-file `#upload-files` input.
- The retained Chrome process is externally owned and must not be launched,
  replaced, or closed by this slice.
- A fresh no-launch access plan selected the one retained
  `chatgpt-stealth-linux-20260924` browser and required reuse. One disposable
  task tab showed the current `.composer-home-top-menu`, exact
  `Add photos & files` and `Add library files` buttons, and one unrestricted
  multi-file input labeled `Attach files`; its generated ID was not stable.
  The task tab was released and retained Chrome kept PID `1829010` and its
  original start time.

## Scope

- Use a fresh no-launch access plan and one disposable task-owned tab to inspect
  the current ChatGPT attachment menu without uploading or submitting a prompt.
- Bind the local-file decision to the exact current menu structure and chooser
  input observed live; preserve ambiguity and restriction failures.
- Add provider-free regressions for the observed surface and rejection cases.
- Validate, publish to personal GitHub, install once without taking retained-
  browser lifecycle ownership, and run one new learning-traced document guard.

## Non-goals

- Do not fuzzy-match arbitrary upload-looking menu rows.
- Do not weaken file-input multiplicity, accepted-type, attachment receipt,
  sent-user-turn, model, account, project, or browser-authority checks.
- Do not replay Plan 0369's terminal response or guard identity.
- Do not launch, replace, or close the retained browser or modify Agent Browser
  source.

## Execution Bounds

- One read-only live attachment-surface diagnostic and exact task-tab release.
- One source repair and one provider-free rework pass if validation exposes a
  defect.
- One published user-runtime installation.
- One fresh no-launch authority check and one new `--require-learning-trace`
  guard. Preserve a terminal failure without another guard in this slice.

## Acceptance Criteria

- [x] The current live local-file action and its exact chooser input are
      recognized without admitting unrelated or ambiguous attachment surfaces.
- [x] Focused tests, typecheck, production build, touched-file lint, diff
      hygiene, plan audit, and CodeGraph sync pass or disclose exact existing
      findings.
- [x] Personal GitHub publication is committed, pushed through isolated
      `1baker` routing, re-fetched, clean, and zero ahead/behind.
- [x] The installed runtime matches the published commit while retained Chrome
      keeps its original process identity.
- [x] One fresh round-one learning trace preserves the immutable original
      prompt, exact generation prompt, true author, no parent guard, reviewed
      Markdown/DOCX/PDF packet, and records the browser verdict, score, exact
      Codex final-answer link, and ModelLabs learning-sync result when present.

## Definition Of Done

Close only after source behavior, publication, installed parity, retained-
browser preservation, and the single bounded forward-review result are recorded
in the roadmap, runbook, journal, and fixes log. A provider or UI failure may
close the bounded slice only as an exact blocker, never as a passing end-to-end
result.

## Source Verification

- The attachment resolver now distinguishes the legacy described popover from
  the current home menu. The current path requires the exact local-file button
  and a unique unrestricted multi-file chooser whose accessible label is
  exactly `Attach files`; it does not trust the generated input ID.
- Provider-free regressions cover the exact observed current surface, selector
  propagation into remote transfer, wrong labels, duplicate matching inputs,
  restricted inputs, and the preserved legacy surface.
- Eight widened browser/runtime suites pass 161 tests. The first focused set
  passes 31 tests. Typecheck, production build, touched-file Biome lint, diff
  hygiene, and CodeGraph sync pass.
- The full suite passes 3,540 tests with 55 skips. Its two deterministic
  failures repeat the existing raw-route-manifest finding at
  `src/http/responsesServer.ts:4337`; one timing-sensitive CLI integration test
  failed under full-suite load and then passed all 7 tests in isolation.
- Plan audit repeats exactly three existing findings: the same raw route and
  Plan 0357's noncanonical and missing status headers.

## Publication And Installation

- Source checkpoint `f9c98db3` was pushed through the isolated personal
  `1baker` route after staged diff hygiene and high-confidence secret scans
  passed.
- The combined user-runtime install restarted only `auracall-api.service`,
  from PID `1669463` to healthy PID `1893824`.
- Checkout and installed SHA-256 values match for
  `chatgptComposerTool.js`, `attachments.js`, and `remoteFileTransfer.js`.
- Retained Chrome preserved PID `1829010`, start token `3619174`, and start
  time `Thu Sep 24 16:06:54 2026` across publication and installation.

## Forward Review

- The immediate no-launch plan selected profile/session
  `chatgpt-stealth-linux-20260924`, browser
  `session:chatgpt-stealth-linux-20260924`, `attached_existing`, one compatible
  live browser, and `tab_new`; duplicate process launch remained disabled.
- Guard `document-f9c98db3-current-file-action-r1`, response
  `resp_idem_d63c23c347b628336b4ca3fffaf1e990`, preserved round 1, true author
  `codex`, no parent, original-prompt SHA-256
  `fbbeb677688fa4fb16735502c326954ab7bfd7312101fd6665762125ff5343eb`,
  generation-prompt SHA-256
  `ee4823fddb5ad5b6669c96f0e161e466263cd4d6d1db4cb385fd042a13853a9b`,
  Markdown, DOCX, PDF, and learning-trace digest
  `4c2f8660fd0a92b5ca5ac8e47d41b823691c78653fa356e7370580d17c772f77`.
- The run failed before model selection, attachment upload, or prompt
  submission because AuraCall could not find the live Chat-mode control. It
  therefore does not establish live acceptance of the repaired attachment
  path. There is no provider answer, verdict, score, review record/chat,
  canonical conversation URL, Codex final-answer link, attachment receipt, or
  ModelLabs learning sync.
- The terminal guard was not replayed. Its runner lease released as failed,
  Agent Browser reports exact target
  `33708E9ED7CA817D92BE2B8B4F08D3B6` closed, and retained Chrome remains
  unchanged.
