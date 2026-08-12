# ChatGPT Chat/Work Mode Boundary | 0270-2026-08-11

State: CLOSED
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_ACCEPTED_WITH_LIVE_FOLLOW_CLEANUP_INCIDENT

## Current State

AuraCall currently prepares the ChatGPT composer and immediately applies the
Chat model picker. It has no first-class representation of ChatGPT's `Chat`
and `Work` radio modes, so a browser left in Work can receive Chat-picker
automation and an ordinary run can inherit Work unintentionally.

The operator supplied the current selected Chat control: a visible
`button[role="radio"]` whose exact text is `Chat`, with
`aria-checked="true"` and `data-state="on"`. Agent-browser access planning
found no compatible retained ChatGPT browser, so this slice remains
provider-free and does not launch or mutate a live browser.

## Stable Objective

Make ChatGPT composer mode an explicit browser contract: default to Chat,
enter Work only when requested, and keep Chat and Work model-selection paths
separate so Work can never invoke Chat's picker.

## Authority And Non-Goals

- Authorized: source, tests, configuration/CLI contract, docs, validation,
  structured commits, and push.
- Provider-free DOM expressions may model the supplied Chat/Work radio markup.
- Excluded: browser launch/navigation/clicks, prompt submission, provider API
  calls, runtime installation/restart, scheduler/completion/materialization
  controls, and release/publish.
- Work's current model may be preserved. Selecting a named Work model must use
  a dedicated Work-model input/path; it may not reuse Chat `desiredModel` or
  Chat picker selectors.

## TDD Packet

1. Add failing config tests proving omitted mode resolves to `chat` and only
   explicit `work` selects Work.
2. Add failing provider-free action tests for the supplied Radix radio state,
   exact-label matching, successful mode verification, and missing Work mode.
3. Add a failing routing test proving Chat uses the existing Chat model picker,
   Work without a Work-model override preserves the current Work selector, and
   a named Work model routes only to a dedicated Work selector.
4. Implement the minimum type/config/action/orchestration changes, then update
   user and operator docs.

## Acceptance Criteria

- [x] Browser config defaults `chatgptMode` to `chat`.
- [x] Work mode is reachable only through an explicit request/config value.
- [x] The mode action recognizes exact visible `Chat`/`Work` radios and verifies
      `aria-checked` or `data-state` after switching.
- [x] Work mode never calls the Chat model selector or Chat thinking-time path.
- [x] A named Work model uses a distinct Work selector contract; absent that
      value, AuraCall preserves the current Work model.
- [x] Targeted tests, typecheck, lint, build, diff hygiene, CodeGraph readback,
      and planning audit pass.
- [x] Docs, journal, fixes log, commits, and remote branch are aligned.

## Definition Of Done

Provider-free evidence proves Chat is the default, Work is explicit, and the
two model-selection systems cannot be accidentally crossed. The validated
source slice is committed and pushed without installation or provider smoke.

## Closeout Evidence

- Provider-free mode/config/runtime suite: 7 files, 112 tests passed.
- TypeScript typecheck and production build passed.
- Touched-file Biome lint reported zero errors; its 22 warnings are existing
  `noExplicitAny` findings in `tests/schema/resolver.test.ts`.
- Work routing is structurally disjoint from the known Chat picker selectors,
  and Work suppresses Chat thinking-time and composer-tool automation.
- The focused feature validation launched no browser/provider work. During the
  broad unit suite, active live follow independently launched `wsl-chrome-3`
  and `wsl-chrome-2`; temporal coincidence was initially misclassified as test
  leakage and those two exact Chrome trees were terminated under existing
  cleanup authority. Scheduler readback remained running and autonomously
  relaunched `wsl-chrome-3`; no scheduler/completion control, install, or
  materialization request ran. The retained `wsl-chrome-4:45017` and API PID
  3190 were untouched. The cadence pass then completed at
  `2026-08-12T02:41:43.010Z` with `backpressure=none`, returned the scheduler
  to `scheduled/healthy`, and its `45015` browser exited normally.
