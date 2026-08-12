# ChatGPT Chat LitScout Read Canary | 0275-2026-08-11

State: CLOSED
Lane: P01
Plan version: 2
Gate state: LIVE_CANARY_EXHAUSTED

## Current State

Plan 0274 captured the current Chat Pro menu and repaired its compact
`EffortPro` submenu trigger provider-free. The focused selector passes 9/9 and
the adjacent Chat/Work suite passes 311/311; source commit `7bca2532` is pushed.
The one install established built/runtime `thinkingTime.js` parity at
`1be745a4...63f8` and handed the API to healthy PID 31954 with zero crash
restarts. The sole canary completed in explicit Chat and returned Session 57's
authoritative `exact_action_recovery_required` state, but current tool evidence
showed `list_resources` plus `auth_session`, not the required separate
`research_continue` call. The `auth_session` call returned a
`litscout.research_continue.v1` payload, which is inconsistent with the current
LitScout source contract where those are distinct tools. The terminal exact-
tool criterion therefore failed closed.

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

- [x] One install produces exact source/runtime selector parity and one healthy
      installer-owned service handoff with zero crash restarts.
- [x] One explicit-Chat `chatgpt:sol-high` canary submits exactly once and
      returns a terminal response without `Answer now` or retry.
- [ ] Current ChatGPT evidence proves LitScout `auth_session` and
      `research_continue` were called and generic search/browse were not.
- [x] LitScout Session 57 and the canonical database remain unmutated by the
      canary.
- [x] Scheduler/completion/materialization controls remain untouched and exact
      canary cleanup completes without affecting another owner.
- [x] Plan/runbook/journal/roadmap, commits, and origin agree with the terminal
      accepted or failed-safe outcome.

## Definition Of Done

The installed normal Chat/Sol path traverses the current selector and one
bounded turn proves exact LitScout read-tool use without any LitScout mutation.
Any failure closes this one-canary gate fail-safe and leaves further work to a
new decision.

## Terminal Evidence

- Canary `litscout-chat-read-canary-v3` submitted once in explicit Chat at
  conversation `6a7bf786-06c0-83ea-8da9-ba1634d2b78b` and completed without a
  prompt retry. It returned account `ecochran76@gmail.com`, Session 57, state
  `exact_action_recovery_required`, recommendation `recover_uncertain_action`,
  and the retained missing-controller-receipt blocker.
- The current ChatGPT tool list contained `list_resources` and `auth_session`.
  It contained neither generic `search`/browse nor a distinct
  `research_continue` call. The `auth_session` response itself was the complete
  `litscout.research_continue.v1` projection.
- Provider-free CodeGraph readback keeps `auth_session` and
  `research_continue` as separate LitScout MCP tools; `auth_session` returns
  `AuthSessionResponse`, while `research_continue` returns
  `ResearchContinueResponse`. Treat the observed live label/payload mismatch
  as unresolved connector routing or cached-tool metadata, not as Experiment 6
  authorization.
- Before/after `research continue` JSON was byte-identical. Session 57 remained
  at 93 memberships, six receipts, one exact-action attempt, and one exact-
  action execution. The raw SQLite container hash changed during concurrent
  hosted reads, so it is not used as mutation proof; the authoritative logical
  projection and governed row counts are unchanged.
- Exact canary PID 32054/port 45015 and the named evidence attachment were
  closed. The API stayed healthy at PID 31954 with zero restarts; unrelated
  `wsl-chrome-4`/45017 remained untouched. No scheduler, completion, or
  materialization control ran.

## Closeout

Plan 0275 is exhausted and closes failed-safe. It proves AuraCall can enter
Chat, select Sol/High, invoke the LitScout connector, and receive the correct
read-only Session 57 projection. It does not prove the exact current LitScout
tool catalog is routed correctly. A successor must refresh or reconcile the
ChatGPT connector tool metadata and prove distinct `auth_session` plus
`research_continue` calls before Experiment 6 relies on this route.
