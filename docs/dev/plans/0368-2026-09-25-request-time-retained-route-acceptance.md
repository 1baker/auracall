# Request-Time Retained Route Acceptance | 0368-2026-09-25

State: CLOSED
Lane: P01

## Objective

Prove that AuraCall's installed request-time Agent Browser handoff reuses the
exact retained ChatGPT browser and session route, then complete one fresh
learning-traced document review without launching, replacing, or closing the
retained browser.

## Current State

- Plan 0367 failed before tab creation because its `tab_new` reached an
  auto-launch path whose stealth binding was not applied.
- AuraCall is configured for Agent Browser profile
  `chatgpt-stealth-linux-20260924`, not its separate AuraCall runtime profile.
- Fresh no-launch access plans from the live session and dashboard routes now
  select browser `session:chatgpt-stealth-linux-20260924`, session
  `chatgpt-stealth-linux-20260924`, and `reuse_existing_browser` with exact
  `browserId` and `sessionName` hints.
- Retained Chrome remains PID `1829010`, process start token `3619174`, and CDP
  port `39415`. No lifecycle action restored or replaced it.

## Scope

- Re-run the focused provider-free bridge tests covering fresh-project
  retained routing, attachment admission, native acquisition, and proof checks.
- Verify the installed bridge contains the source request-time binding logic.
- Submit one new document guard with immutable round-one learning provenance,
  the reviewed Markdown, DOCX, and PDF, then poll only its saved response.
- Record the terminal verdict, score, review artifact/chat, exact Codex
  final-answer link when present, and ModelLabs learning-sync result.

## Non-goals

- Do not replay Plan 0367's failed response or guard identity.
- Do not modify, install, commit, or publish the dirty Agent Browser checkout.
- Do not launch, replace, close, or take lifecycle ownership of retained Chrome.
- Do not submit a second provider review after this plan's guard becomes
  terminal.

## Execution Bounds

- One source/install parity and provider-free validation pass.
- One fresh no-launch authority check immediately before submission.
- One new learning-traced guard submission and poll-many readback.

## Acceptance Criteria

- [x] Focused bridge tests and source/install request-binding parity pass.
- [x] The immediate no-launch plan requires exact retained browser/session
      reuse and forbids a duplicate process.
- [x] One fresh guard preserves all required prompt and document provenance.
- [x] The guard reaches a terminal browser result or preserves one exact new
      blocker without replay.
- [x] Verdict, score, review artifact/chat, Codex final-answer link, and
      ModelLabs learning-sync status are reported exactly when present.
- [x] Retained Chrome identity is unchanged and task-owned cleanup is recorded
      separately from provider completion.

## Terminal Result

Five focused bridge suites passed `146/146`, TypeScript no-emit and the
production build passed, and the installed `agentBrowserBridge.js` exactly
matched the checkout digest
`4fe3b3d6786d16860ad3168dc273659d7c642c307360545f909190877b195316`.
The immediate no-launch plan selected the exact retained browser/session,
returned both route hints, and prohibited a duplicate process.

Guard `document-1baef1cc-retained-route-r1`, response
`resp_idem_815f7313b3224ec08eff25e557ab1e82`, preserved the immutable origin
prompt, exact generation prompt, author `codex`, candidate Markdown, DOCX, PDF,
and their digests. It waited behind an unrelated live runner lease, then the
retained route successfully completed `tab_new`, `view_focus`, task-authority
issue, and `cdp_attach`. This proves the Plan 0367 auto-launch blocker is no
longer present.

The run failed before attachment upload or prompt submission because the live
model menu did not expose an option matching `Current Pro`. Its visible rows
were `High`, a clipped `Late t` checked row, `GPT-5.6 Sol`, and
`GPT-5.5 Leaving on October 14`. AuraCall failed closed rather than guessing.
There is no provider answer, verdict, score, review record/chat, canonical
conversation URL, Codex final-answer link, attachment UI receipt, or ModelLabs
learning sync. The guard was not replayed and no second guard was created.

Agent Browser successfully released and closed the task-owned project tab.
Retained Chrome remains PID `1829010`, start token `3619174`, CDP port `39415`,
and its exact session route remains healthy. No browser lifecycle action was
taken.

## Definition Of Done

Close after the bounded guard is terminal, retained browser preservation is
rechecked, the result is recorded in the roadmap, runbook, journal, and fixes
log, and the coherent checkpoint is published to personal GitHub. A terminal
external failure closes this slice honestly rather than being retried or
reported as a pass.
