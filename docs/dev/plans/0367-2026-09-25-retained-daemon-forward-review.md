# Retained Daemon Forward Review | 0367-2026-09-25

State: CLOSED
Lane: P01

## Objective

Restore the Agent Browser control route to the existing retained ChatGPT
browser without launching, replacing, or closing that browser, then run one
fresh learning-traced document review through AuraCall.

## Current State

- Plan 0366 published and installed current-Premium model intent, but its one
  fresh guard failed before task-tab creation because the retained session
  daemon connection was refused.
- Retained Chrome still has PID `1829010` and process start token `3619174`.
- A fresh no-launch Agent Browser access plan selects browser
  `session:chatgpt-stealth-linux-20260924`, session
  `chatgpt-stealth-linux-20260924`, and duplicate-process prohibition.
- The exact retained session daemon now listens on loopback port `45281` and
  returns a successful service-status response. No browser lifecycle action was
  required.

## Scope

- Verify exact retained browser and session-daemon identity before submission.
- Preserve the original prompt, exact candidate-generation prompt, true author,
  reviewed Markdown, DOCX, and PDF under the required learning trace.
- Submit one fresh guard ID through `chatgpt:premium` and poll only that saved
  response to a terminal result.
- Record the browser verdict, score, review artifact and chat, exact Codex
  final-answer link when present, and ModelLabs learning-sync result.

## Non-goals

- Do not replay or rewrite the failed Plan 0366 guard.
- Do not launch, replace, close, or take lifecycle ownership of retained Chrome.
- Do not edit or publish the dirty Agent Browser checkout as part of this
  AuraCall verification slice.
- Do not start another provider review after this guard reaches a terminal
  result.

## Execution Bounds

- One retained-route verification pass.
- One fresh learning-traced guard submission and poll-many readback.
- No provider retry under a second guard identity in this plan.

## Acceptance Criteria

- [x] No-launch planning selects the exact retained browser and forbids a
      duplicate process.
- [x] The retained Chrome PID, process start token, CDP endpoint, and session
      daemon are live before submission.
- [x] One fresh guard preserves all required prompt and file provenance.
- [x] The guard reaches a terminal browser result with honest verdict and score
      reporting, or an exact non-replayed blocker is preserved.
- [x] ModelLabs learning-sync status and any exact Codex final-answer link are
      recorded.
- [x] Retained Chrome identity is unchanged after the guard, and task-owned tab
      cleanup is reconciled separately from any completed provider result.

## Terminal Result

Guard `document-8c118aaa-daemon-rebound-r1`, response
`resp_idem_eeb1b6db2aaf43f2ddba448db4ea4f76`, preserved the immutable origin
and generation prompts, author `codex`, Markdown handoff, DOCX, PDF, and both
document digests. Its first saved poll reached terminal `failed` before a task
tab was created. Agent Browser rejected the `tab_new` request because the
session route exposed `browserCapabilityLaunch.applied: false`; auto-launch
could not apply the required `stealthcdp_chromium` proof and correctly refused
to launch or fall back.

There is no browser verdict, score, review artifact/chat, Codex final-answer
link, or ModelLabs learning sync. The failed service job owns no tab or browser
lease, so there was no task tab to close. Post-run inspection preserved Chrome
PID `1829010`, start token `3619174`, CDP port `39415`, and daemon PID `1307873`,
start token `10815149`, port `45281`. No browser lifecycle action was taken.
The guard was not replayed.

## Definition Of Done

Close after the one fresh guard is terminal, retained browser preservation is
rechecked, the result is recorded in the roadmap, runbook, journal, and fixes
log, and the validated documentation checkpoint is published to personal
GitHub. A terminal external failure closes the bounded slice as blocked rather
than being retried or reported as a pass.
