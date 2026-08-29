# Durable Browser Run Cancellation | 0351-2026-08-29

State: CLOSED
Lane: P01

## Objective

Make operator cancellation of a durable configured browser run stop the
in-flight provider executor promptly instead of only marking stored state
cancelled while browser work continues to completion.

## Current State

- Response `resp_affda6f3fdbe485b880f380dc61810f6` was cancelled after about
  396 seconds and its lease was released.
- The retained ChatGPT execution continued after that cancellation and logged
  remote completion at 526.7 seconds, so its late output was discarded.
- Stored-step execution checks cancellation only after the provider promise
  settles; `ExecuteStoredRunStepContext` carries no cancellation signal.
- Browser run options already define an abort signal, but configured execution
  does not supply it and ChatGPT response polling does not consume it.

## Scope

- Project durable stored-run cancellation into an abort signal for the active
  step executor.
- Propagate that signal through configured browser execution and ChatGPT
  response polling.
- Preserve terminal cancelled state, lease release semantics, and retained
  Agent Browser ownership.
- Add provider-free regressions for cancellation propagation and prompt exit.

## Non-goals

- Do not retract a prompt already submitted to a provider.
- Do not close, replace, or relaunch the retained Agent Browser lane.
- Do not change upload bundling, Graphiti approval gates, or provider timeout
  defaults.
- Do not add a second cancellation control plane.

## Execution

1. Add a durable cancellation watcher to stored-step execution and pass its
   signal through the configured executor.
2. Make ChatGPT assistant-response polling fail promptly on that signal.
3. Run focused tests, typecheck, lint, build, plan audit, and CodeGraph sync.
4. Install the user runtime and run one bounded retained-browser cancellation
   canary without approving Graphiti extraction.

## Acceptance Criteria

- [x] Cancelling a running durable step aborts its executor within one bounded
      cancellation-observation interval.
- [x] Configured browser execution receives the same abort signal.
- [x] ChatGPT assistant-response polling exits on cancellation without waiting
      for the full provider timeout.
- [x] Existing late-completion protection, terminal cancellation, and lease
      release behavior remain green.
- [x] Focused tests, typecheck, lint, build, plan audit, and CodeGraph sync pass.
- [x] Installed retained-browser canary proves prompt cancellation while the
      Agent Browser session, profile, PID, and pre-existing targets remain
      intact; the temporary canary target is released after cleanup.

## Closure Evidence

- Provider-free coverage passes for durable cancellation observation, exact
  signal propagation into configured execution, immediate ChatGPT response
  polling exit, and the existing late-completion guard.
- Installed response `resp_b801ecd4df1d44829b83a9728f446f08`
  reached a running step, attached through
  `session:auracall-chatgpt-bridge-v3`, submitted the 139-character canary
  prompt, and entered assistant-response polling.
- Operator cancellation made the run and step terminal, released the runner
  lease with reason `cancelled`, and logged remote completion in about 1.2
  seconds instead of continuing for the provider timeout. The earlier failure
  continued for about 131 seconds after durable cancellation.
- Agent Browser released temporary target `2DC121752AA76B1057754873575488B5`
  about four seconds after cancellation. Chrome PID `294633`, runtime profile
  `auracall-chatgpt-live`, and the three pre-existing page targets remained
  alive and unchanged.
- Before the canary, the same live Chrome was reattached to the retained Agent
  Browser session after current service inventory had lost that external BYOP
  registration. The no-launch access plan then reported exactly one compatible
  live browser and `reuse_existing_browser`; no duplicate Chrome was launched.

## Definition Of Done

This plan closes when durable cancellation is propagated end to end, installed
behavior exits promptly in a bounded canary, and retained browser authority is
unchanged.
