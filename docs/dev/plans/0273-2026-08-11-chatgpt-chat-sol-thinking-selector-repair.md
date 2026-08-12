# ChatGPT Chat Sol Thinking Selector Repair | 0273-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_REPAIR_ACTIVE

## Current State

Plans 0270 and 0271 established Chat as the default and Work as explicit. A
fresh read-only LitScout connector canary used explicit Chat mode and
`chatgpt:sol-high`, serialized behind the scheduler-owned browser lease, then
failed before prompt submission with `Unable to find the Thinking time
dropdown menu.` Current ChatGPT presents an integrated `Pro - Standard` model
surface with a `Configure...` entry rather than the older direct thinking-time
menu. No prompt, connector call, LitScout action, or database effect occurred.

## Stable Objective

Represent ChatGPT's current integrated Chat Pro/thinking selector through the
existing Chat-only adapter, preserve fail-closed verification, install the
validated repair once, and prove exactly one read-only LitScout connector
canary in Chat mode.

## Authority And Bounds

- Authorized source: `src/browser/actions/thinkingTime.ts`, its focused test,
  plan/roadmap/runbook/journal/fixes records, and directly affected docs only.
- Provider-free fixture work may reproduce the observed `Pro - Standard` plus
  `Configure...` interaction and the nested effort choices.
- Maximum implementation cycles: one provider-free red/green cycle plus one
  bounded correction if deterministic validation reveals a regression.
- After provider-free acceptance, authorized live effects are at most one
  user-runtime install with its installer-owned API restart and one fresh
  `wsl-chrome-3` AuraCall Chat canary. The canary is zero-retry and may call
  only LitScout `auth_session` followed by `research_continue` for Session 57.
- The canary may return only account identifier, session ID, controller state,
  recommended action, and blocker. It may not mutate LitScout state.
- Browser and process cleanup is limited to the exact canary-owned target.
  Scheduler-owned and retained unrelated browser processes are not cleanup
  candidates.
- Critical-path owner: root. Parallel tracks and subagents: none; the selector,
  installed runtime, and sole canary are intentionally serialized.

## Non-Goals And Hard Stops

- Do not enter Work mode or change the dedicated Work selector.
- Do not use generic ChatGPT search/browse, upload files, click `Answer now`,
  start Deep Research, create sessions, approve plans, execute actions, enrich,
  analyze, retry LitScout work, or write Graphiti memory.
- Do not pause, resume, trigger, or otherwise mutate scheduler, completion, or
  history-materialization controls.
- Stop on CAPTCHA, identity mismatch, unknown browser ownership, selector
  ambiguity, unexpected provider tool use, prompt-submission uncertainty, or
  any canary failure. A failure does not authorize a second canary.

## TDD Packet

1. Add one executable provider-free DOM fixture that opens the current
   integrated Chat model surface, enters `Configure...`, selects the requested
   thinking level, and verifies the resulting state. Confirm it fails against
   the current adapter.
2. Make the smallest change in `thinkingTime.ts` that identifies the exact
   interactive Configure control and nested effort surface without broad
   ancestor matches.
3. Run the focused selector and Chat/Work suites, typecheck, lint, build, diff
   hygiene, CodeGraph readback, and planning audits.
4. If provider-free acceptance is complete, install once and run the sole
   read-only LitScout Chat canary, then verify exact connector tool use and
   exact cleanup.

## Acceptance Criteria

- [x] One provider-free red reproduces the current integrated
      `Pro - Standard` / `Configure...` surface through the public selector
      expression.
- [x] The minimal repair selects and verifies the requested Chat thinking
      level without broad ancestor clicks or any Work-path change.
- [x] Focused and adjacent Chat/Work tests, typecheck, lint, build, diff
      hygiene, CodeGraph readback, and planning audits pass.
- [ ] Source and installed runtime hashes match after no more than one install
      and its installer-owned API restart.
- [ ] One zero-retry `wsl-chrome-3` Chat canary submits once, uses LitScout
      `auth_session` and `research_continue` rather than generic search, and
      returns Session 57's current read-only controller state.
- [ ] The canary performs no LitScout mutation, generic search/browse, Work
      selection, scheduler/completion/materialization control, or retry.
- [ ] Exact canary cleanup completes and journal/fixes/runbook/plan/remote
      state agree with the outcome.

## Definition Of Done

AuraCall's installed Chat/Sol path can traverse ChatGPT's current integrated
thinking selector and one bounded read-only canary proves that ChatGPT invokes
the LitScout connector's exact read methods. Plan 0273 then closes with a clean,
committed, pushed repository and no broader runtime or LitScout effect.

## Provider-Free Evidence

- The exact executable DOM fixture failed before the repair with
  `{ status: 'menu-not-found' }`: the broad menu item containing the complete
  model-menu text was selected before the exact `Configure...` item.
- `findConfigureNode` now accepts only normalized labels equal to `configure`
  or beginning with `configure `, so a broad ancestor whose text merely
  contains that word cannot consume the one-shot Configure transition.
- The focused selector test passes 8/8. The adjacent Chat model, adapter,
  composer-mode, config, CLI, runtime, and schema suite passes 310/310 across
  nine files. Typecheck, zero-warning touched-file Biome, production build,
  diff hygiene, both planning audits, and current CodeGraph readback pass.
- No provider prompt, connector call, LitScout action, runtime install,
  service restart, or scheduler/completion/materialization control occurred in
  the provider-free repair. The stale exact `exp6-diagnose` agent-browser
  session was closed without touching scheduler-owned or retained browsers.
