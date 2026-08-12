# ChatGPT Chat LitScout Read Canary | 0275-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: INSTALL_CANARY_READY

## Current State

Plan 0274 captured the current Chat Pro menu and repaired its compact
`EffortPro` submenu trigger provider-free. The focused selector passes 9/9 and
the adjacent Chat/Work suite passes 311/311; source commit `7bca2532` is pushed.
The user runtime still contains Plan 0273's earlier selector hash, so the new
repair is not installed. No managed `wsl-chrome-3` browser or browser-operation
lock remains after exact inspection cleanup.

## Stable Objective

Install the compact-effort repair once and prove one zero-retry Chat-mode turn
uses LitScout's exact read methods rather than generic ChatGPT search, without
mutating LitScout state.

## Authority And Bounds

- At most one combined `install:user-runtime-service` run, including its
  installer-owned API restart, followed by exact source/runtime hash parity and
  health readback.
- At most one `wsl-chrome-3`, `chatgpt:sol-high`, explicit-Chat canary with one
  prompt. It may call only LitScout `auth_session` and `research_continue` for
  Session 57 and return only account identifier, session ID, current state,
  recommended action, and blocker.
- The canary is zero-retry. It may wait behind normal scheduler ownership
  through the existing browser-operation queue; no scheduler control is
  authorized.
- Current ChatGPT tool-call evidence must prove the exact LitScout methods and
  absence of generic search/browse before acceptance.
- Cleanup is limited to the exact canary-owned process/port. Scheduler-launched
  or otherwise unattributed browser processes are not cleanup targets.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- Do not enter Work, click `Answer now`, start Deep Research, upload a file,
  use generic search/browse, or call any connector other than LitScout.
- Do not create a LitScout session, approve or execute actions, retry research,
  enrich, analyze, write memory, or otherwise mutate LitScout or its database.
- Do not pause, resume, trigger, or mutate scheduler, completion, or
  materialization controls.
- Stop on install/parity/health failure, CAPTCHA, identity mismatch, unknown
  ownership, selector failure, unexpected tool use, prompt-submission
  uncertainty, or any canary error. No second canary is authorized.

## Acceptance Criteria

- [ ] One install produces exact source/runtime selector parity and one healthy
      installer-owned service handoff with zero crash restarts.
- [ ] One explicit-Chat `chatgpt:sol-high` canary submits exactly once and
      returns a terminal response without `Answer now` or retry.
- [ ] Current ChatGPT evidence proves LitScout `auth_session` and
      `research_continue` were called and generic search/browse were not.
- [ ] LitScout Session 57 and the canonical database remain unmutated by the
      canary.
- [ ] Scheduler/completion/materialization controls remain untouched and exact
      canary cleanup completes without affecting another owner.
- [ ] Plan/runbook/journal/roadmap, commits, and origin agree with the terminal
      accepted or failed-safe outcome.

## Definition Of Done

The installed normal Chat/Sol path traverses the current selector and one
bounded turn proves exact LitScout read-tool use without any LitScout mutation.
Any failure closes this one-canary gate fail-safe and leaves further work to a
new decision.
