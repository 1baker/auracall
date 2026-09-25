# Current Chat-Mode Default Composer | 0371-2026-09-25

State: OPEN
Lane: P01

## Objective

Restore exact, fail-closed recognition of ChatGPT's current default Chat
composer when no explicit Chat/Work switcher is present, without admitting an
unrelated textbox or weakening explicit Work-mode selection.

## Current State

- Plan 0370 published and installed the current local-file chooser repair.
- Its one fresh traced guard opened the retained project task tab, then failed
  before model selection, attachment upload, or prompt submission because
  AuraCall could not find the expected Chat-mode control.
- AuraCall currently treats a switcher-free composer as default Chat only when
  its visible prompt label is exactly `Chat with ChatGPT`.
- A fresh no-launch plan selected the sole retained browser with duplicate
  process launch forbidden. Its one disposable read-only task tab showed no
  mode radios and one empty project composer: `role="textbox"`,
  `contenteditable="true"`, accessible label
  `New chat in Codex + ChatGPT Workshop`, and a containing form.
- Releasing that exact task tab physically closed it while preserving retained
  Chrome PID/start token `1829010`/`3619174`.
- The focused/adjacent provider-free run passed 118 tests; typecheck,
  production build, touched-file lint, diff hygiene, and CodeGraph sync pass.
  The plan audit repeats only the three existing findings (one raw route and
  Plan 0357's two header findings).
- Under current host load the all-at-once suite passed 3,526 tests with 55
  skips and 20 failures. The two route-contract failures are the known raw
  route debt. Every other implicated file passed in a bounded single-worker
  rerun (76 tests), except the known detached-CLI timing case, which then
  passed all 7 tests alone.
- Retained Chrome remains externally owned at PID `1829010`, start token
  `3619174`, and must not be launched, replaced, or closed by this slice.

## Scope

- Use a fresh no-launch access plan and one disposable task-owned tab for a
  read-only inspection of the current composer and mode-control structure.
- Bind default Chat only to the exact current prompt/composer structure while
  retaining strict, explicit Work-mode behavior.
- Add provider-free acceptance and rejection coverage.
- Validate, publish through personal `1baker`, install once while preserving
  retained Chrome, and run exactly one fresh learning-traced document guard.

## Non-goals

- Do not infer Chat mode from an arbitrary textbox or page readiness alone.
- Do not weaken explicit Work mode, model selection, attachment receipt,
  sent-turn, account, project, or browser-authority checks.
- Do not replay Plan 0370's terminal guard or response.
- Do not launch, replace, or close retained Chrome or modify Agent Browser.

## Execution Bounds

- One read-only live composer diagnostic and release of only its exact task tab.
- One source repair and one provider-free rework pass if validation exposes a
  defect.
- One published user-runtime installation.
- One fresh no-launch authority check and one new round-one
  `--require-learning-trace` guard. Preserve a terminal result without another
  guard in this slice.

## Acceptance Criteria

- [x] The current default Chat composer is recognized only from exact observed
      structure, and unrelated textboxes remain rejected.
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
browser preservation, and the single bounded forward-review result are recorded
in the roadmap, runbook, journal, and fixes log. A provider or later UI failure
may close the bounded slice only as an exact blocker, never as a passing
end-to-end result.
