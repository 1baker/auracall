# Plan 0362: Detached browser session recovery

State: OPEN
Lane: P45
Branch: codex/auracall-upstream-reconcile-20260914
Target: main
Integration: merge

## Stable Objective

Allow an explicitly detached AuraCall browser CLI run to survive loss or timeout
of its invoking shell, preserve one exact session and submitted turn, and resume
or inspect that session without another Send.

## Current State

- AuraCall already persists browser sessions, runtime identity, accumulated
  assistant evidence, and exact read-only reattachment state.
- Durable `/v1/responses/{response_id}` and MCP `run_status` polling already
  survive client disconnects and API-process restarts.
- The root CLI accepted hidden `--no-wait`, but Commander represented it as
  `wait: false` while AuraCall checked only `noWait: true`; browser detach policy
  then rejected every browser run. Both seams are now repaired in source.
- The first provider-free detached integration probe exposed a second defect:
  the child launcher discarded Node loader arguments, so a source-mode runner
  returned a session id but left it pending. The launcher now preserves the
  active loader arguments, and the same-session probe reaches `completed`.
- Plan 0361 proved one Send and post-send Power-slider value 4. Its observer was
  externally terminated while the retained browser continued generating; no
  duplicate Send occurred.

## Scope

- Honor explicit `--no-wait` for local browser runs by launching the existing
  detached session runner.
- Keep default browser CLI behavior inline and keep remote-browser runs inline.
- Expose `--no-wait` in primary CLI help with exact reattach guidance.
- Preserve existing session metadata, broker-owned target authority, duplicate
  prompt protection, and `auracall session <id>` read-only recovery.
- Add focused tests for default inline, explicit detach, environment disable,
  and API compatibility behavior.
- Update browser/operator documentation and durable engineering notes.

## Non-goals

- Adding another response store, polling endpoint, browser ownership path, or
  prompt replay mechanism.
- Changing default browser waiting behavior.
- Detaching remote-host browser execution.
- Sending a second provider prompt to prove polling.

## Acceptance Criteria

- `DBR-R1`: a local browser run with explicit `--no-wait` is eligible for the
  existing detached session runner, while default browser runs stay inline.
- `DBR-R2`: `AURACALL_NO_DETACH=1` still fails closed and prevents detach.
- `DBR-R3`: Pro API detach behavior remains compatible, and explicit
  `--no-wait` has one consistent local meaning.
- `DBR-R4`: help and browser workflow docs tell unattended callers to retain
  the returned session id and reattach rather than resend.
- `DBR-R5`: focused tests, affected tests, typecheck, scoped lint, build, plan
  audit, CodeGraph refresh, and diff hygiene pass.
- `DBR-R6`: one bounded installed retained-browser canary proves command return,
  continued same-session execution, interruption-safe reattachment, terminal
  readback, and zero duplicate Send; if provider completion is slow, a durable
  running receipt is retained and no retry is sent.

## Execution Graph

1. Freeze the current explicit browser `--no-wait` rejection as a failing unit
   test.
2. Repair detach policy without changing default browser or remote-host
   behavior.
3. Validate source behavior and documentation.
4. Install the exact validated runtime, then run one retained-browser canary
   through Agent Browser's existing authority.
5. Reconcile the same session to terminal state or preserve an exact running
   receipt without resubmission, then close or accurately leave this plan open.

## Validation Status

- The canonical installer source now owns the detach repair and the
  `chatgpt:premium` mapping to the `6 Pro` picker plus `gpt-6-astra`. Its focused
  validation passes 143 tests, typecheck, production build, and diff hygiene.
- The installed source/build files compare byte-for-byte. An installed
  provider-free `--no-wait` run returned its durable session id and that exact
  session independently reached `completed` with the expected mock receipt.
- The one permitted retained-browser canary returned in 4.068 seconds and its
  detached child continued under PID 1, but the same session ended in `error`.
  The nested browser/detach failure was collapsed into one aggregate message;
  Agent Browser inspection found no canary marker and therefore no Send.
- The exact temporary target acquired for the canary was released after the
  failure. Physical tab close succeeded while the retained browser process,
  profile route, and two pre-existing conversation tabs remained intact.
- `DBR-R6` remains open. The attempted exact root handle resolved read-only
  control to an older conversation URL, so target binding and nested error
  preservation must be repaired and proven provider-free before any separately
  authorized future live canary. The one-prompt allowance for this pass is
  exhausted and no retry is permitted.
- The repair is now committed-pending in the clean integration checkout:
  AuraCall reads `location.href` through the exact attached target both before
  and after navigation, rejects a missing or mismatched broker URL before prompt
  composition, and records distinct action/detach failure summaries in a typed
  browser error. Provider-free tests cover the stale-conversation and dual-error
  cases. Installation and a new live canary remain separate gates.
- Fresh-canary admission was attempted only through Agent Browser's no-launch
  access plan after installation of `c3b63d9c`. It refused the canary before
  tab creation or provider submission: the selected `auracall-chatgpt-live`
  external BYOP profile has no compatible live browser, while the sole ready
  retained ChatGPT browser is governed as `chatgpt-pro`. Do not collapse those
  identities or launch a duplicate profile lane. Reconcile the exact profile
  binding first; the fresh-prompt allowance was not consumed.

## Bounds

- One implementation attempt and one evidence-driven repair cycle.
- One live prompt maximum; never resend the canary.
- No browser launch, replacement, takeover, or profile-lane duplication outside
  Agent Browser's no-launch access plan.

## Definition Of Done

The explicit local browser `--no-wait` path returns a durable session identity,
the detached runner owns continued execution, the same session can be inspected
or reattached after caller exit, and validation proves no prompt replay.
