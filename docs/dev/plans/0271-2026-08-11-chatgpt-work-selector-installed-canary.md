# ChatGPT Work Selector Installed Canary | 0271-2026-08-11

State: CLOSED
Lane: P01
Plan version: 1
Gate state: INSTALLED_CANARY_ACCEPTED

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
- [x] Source and installed runtime hashes match after exactly one install and
      installer-owned API restart.
- [x] One `wsl-chrome-3` canary explicitly enters Work, selects the observed
      Work model through the dedicated path, and returns the exact requested
      response.
- [x] Scheduler posture remains healthy and no scheduler/completion/
      materialization control mutation occurs.
- [x] Docs, journal, fixes log, runbook, commits, and remote branch agree with
      the installed outcome.

## Definition Of Done

Chat remains AuraCall's default, Work remains opt-in, the live Work model
surface is represented by its own tested adapter, and one bounded installed
canary proves the end-to-end Work path without altering background control
posture.

## Closeout Evidence

- Provider-free gate: six focused files, 111 tests passed; typecheck, whole-repo
  lint with zero errors and 208 pre-existing warnings, production build, diff
  hygiene, CodeGraph at 886 files/16,722 nodes/56,918 edges, and active plan
  audit passed.
- One combined user-runtime installation produced exact installed/source
  hashes `d8c2040e...7e17` for composer mode and
  `f54bf876...f9d6` for Work model selection. Its delayed service handoff
  restarted the API once from PID 3190 to healthy PID 40601 with zero crash
  restarts.
- The one canary used `wsl-chrome-3`, explicit Work, and explicit
  `GPT-5.6 Terra`. It waited behind scheduler-owned pass 57 without a control
  mutation, then acquired the existing browser-operation queue, verified the
  configured authenticated Pro identity, selected Work/Terra, dispatched one
  36-character prompt, and returned exactly `AURACALL_WORK_MODE_OK` in 27
  seconds with prompt retry count zero. The Work selector used its existing
  bounded DOM retry wrapper after two diagnostic snapshots before selection;
  it never invoked the Chat picker.
- Scheduler-owned pass 57 independently advanced to 58 and settled
  `idle_waiting` with no error. Active completion/materialization work returned
  zero. The exact canary Chrome root PID 41207 accepted `SIGTERM`; port 45015
  and the managed `wsl-chrome-3` process tree are absent. No scheduler,
  completion, or materialization control command ran.
