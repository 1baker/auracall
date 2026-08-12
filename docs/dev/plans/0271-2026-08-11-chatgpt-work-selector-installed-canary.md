# ChatGPT Work Selector Installed Canary | 0271-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: LIVE_INSPECTION_READY

## Current State

Plan 0270 closed with provider-free proof that Chat is the default composer
mode and Work is explicit. The source has a dedicated Work model-selection
module, but its DOM contract has not been checked against the current ChatGPT
Work surface and the committed source has not been installed into the user
runtime. Current readback is clean: the API is active, the scheduler is
`scheduled/healthy`, no history-materialization jobs are queued or running,
and no `wsl-chrome-3` process or port is active.

## Stable Objective

Confirm the current Work-mode and Work-model DOM, repair only the dedicated
Work selector if current evidence requires it, install the validated source,
and prove one explicit Work run while preserving Chat as the default.

## Authority And Bounds

- Authorized source: the ChatGPT composer-mode and dedicated Work-model
  adapters, their provider-free tests, configuration documentation, and
  required operational records.
- Authorized browser inspection: one named agent-browser attachment to an
  exact compatible ChatGPT browser; read the mode radios, switch once to Work,
  and open the Work model control only as needed to capture its bounded DOM.
- Authorized runtime effects after provider-free acceptance: at most one
  user-runtime install, its one installer-owned API restart, and one fresh
  `wsl-chrome-3` AuraCall Work canary with one short prompt.
- The canary may select exactly one model label observed on the Work surface.
  It must use `--browser-chatgpt-mode work` and
  `--browser-work-model`; it may not use the Chat model picker.
- Browser inspection and canary cleanup must be limited to targets and
  processes attributable to this packet. Retained or scheduler-owned browser
  processes are not cleanup candidates.
- Maximum repair cycles: one provider-free red/green cycle. Maximum live
  canaries: one. A failed canary stops the packet for diagnosis; it does not
  authorize a retry.

## Non-Goals And Hard Stops

- Do not pause, resume, run, or otherwise mutate scheduler, completion, or
  history-materialization controls.
- Do not click ChatGPT `Answer now`, start Deep Research, upload files, or
  materialize conversation artifacts.
- Do not fall back from Work to the Chat model picker or broaden Chat picker
  selectors to include the Work surface.
- Stop before installation if current DOM cannot identify a distinct Work
  model control. Stop before the canary if scheduler diagnostics cease to be
  healthy or another job owns `wsl-chrome-3`.

## Acceptance Criteria

- [x] Current browser evidence identifies selected Chat/Work state and the
      separate Work model control without exposing authentication material.
- [x] A provider-free fixture reproduces the observed Work selector contract;
      any required repair passes focused tests and preserves fail-closed
      separation from the Chat picker.
- [x] Targeted tests, typecheck, lint, build, diff hygiene, CodeGraph readback,
      and active planning audit pass.
- [ ] Source and installed runtime hashes match after exactly one install and
      installer-owned API restart.
- [ ] One `wsl-chrome-3` canary explicitly enters Work, selects the observed
      Work model through the dedicated path, and returns the exact requested
      response.
- [ ] Scheduler posture remains healthy and no scheduler/completion/
      materialization control mutation occurs.
- [ ] Docs, journal, fixes log, runbook, commits, and remote branch agree with
      the installed outcome.

## Definition Of Done

Chat remains AuraCall's default, Work remains opt-in, the live Work model
surface is represented by its own tested adapter, and one bounded installed
canary proves the end-to-end Work path without altering background control
posture.
