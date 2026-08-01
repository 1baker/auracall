# ChatGPT File Retrieval Provider-Free Repair Iterations | 0181-2026-08-01

State: OPEN
Lane: P01
Plan version: 1

## Stable Objective

Execute up to five additional provider-free repair iterations against concrete
ChatGPT user-uploaded-file retrieval failures. Every iteration must establish a
deterministic red regression, audit the structural root cause, implement one
bounded solution, and validate the repaired behavior before the next iteration.

## Current State

- Plan 0180 remains open at its exact-file live acceptance gate. Scheduler and
  continuous live follow remain disabled; five retained completions are paused.
- Commit `bd69437f` accepts bounded alternate signed-URL JSON shapes, but the
  exact exam-writing transcript remains `retrieval_failed` with unknown
  availability.
- This successor packet owns provider-free retrieval hardening only. It does not
  authorize a browser, provider request, exact-file canary, scheduler resume,
  completion resume, login, or account change.

## Bounded Execution Model

Owner: primary agent. No delegation is used because repo policy requires direct
CodeGraph exploration for this structural browser-adapter lane and the operator
did not request subagents.

Hard bounds:

- maximum repair iterations: 5;
- maximum implementation attempts per iteration: 2;
- maximum review/rework cycles per iteration: 1;
- checkpoint interval: after every validated iteration;
- live/provider attempts: 0;
- stop early if the next candidate lacks a red-capable provider-free seam or is
  only speculative hardening without a demonstrated failure.

## Ranked Work Units

### R1 | Preserve Bounded JSON Shape Evidence

Failure: `json_missing_download_url` persists status/content type and a narrow
provider error, but discards the sanitized JSON container/key shape. Operators
cannot distinguish an unsupported response shape from a payload with no URL.

Prediction: a fixture containing an unrecognized nested URL key produces the
same diagnostics as an error-only object before repair; after repair, bounded
key/type evidence distinguishes them without persisting URL values or secrets.

### R2 | Classify Structured Unavailability Without String Reparse

Failure: classification extracts status from serialized error text and uses an
order-sensitive regex requiring `file|asset` before the unavailable phrase.
Explicit evidence such as `Not found: file was deleted` can remain
`retrieval_failed`.

Prediction: a structured 404/410 or explicit provider error classifies
`provider_unavailable` independent of key order and phrasing after repair.

### R3 | Retain The Strongest Capture Failure

Failure: each failed capture overwrites `captureError`. A later generic direct
fallback can erase an earlier provider-confirmed unavailable response.

Prediction: selecting an explicit unavailable candidate followed by a generic
missing-URL candidate returns the unavailable candidate after repair.

### R4 | Keep Capture Deadline Effective With Hung Intercepts

Failure: the polling loop awaits `Promise.allSettled(capturePromises)`. One
never-settling intercepted response can prevent the loop from checking its
20-second deadline.

Prediction: a never-settling capture promise returns control at the bounded
poll deadline after repair instead of hanging the test.

### R5 | Bound Download Fetch And Body Reads

Failure: direct fetch, signed follow-up fetch, and response body reads have no
local timeout. Any stalled promise can hold the browser operation indefinitely.

Prediction: a never-settling provider promise rejects with a distinguished
bounded timeout, while a prompt promise still resolves unchanged.

## Acceptance Criteria

- [x] R1 red/green regression and validation complete.
- [x] R2 red/green regression and validation complete.
- [x] R3 red/green regression and validation complete.
- [x] R4 red/green regression and validation complete.
- [x] R5 red/green regression and validation complete.
- [ ] Focused, adjacent, and broad provider-free validation pass.
- [ ] Each landed repair is documented and committed with its root cause.
- [ ] Final commits are pushed and installed with source/runtime parity.
- [ ] Runtime readback proves scheduler/completion pauses and zero active
  materialization work without provider access.

## Hard Stops

- Stop before any browser or provider request.
- Stop rather than weakening requested-asset identity validation.
- Stop rather than persisting signed URLs, response bodies, tokens, cookies, or
  other secrets in diagnostics.
- Stop an iteration after two failed implementation attempts or one failed
  rework cycle and record the exact remaining blocker.
- Stop the campaign if two consecutive checkpoints are only hardening and do
  not reduce a verified blocker.

## Definition Of Done

The plan closes when every executed iteration has red/green evidence and the
five acceptance boxes are either proved or explicitly stopped for lack of a
real provider-free failure seam, broad validation and installed paused parity
pass, and no live/provider authority has been consumed.

## Checkpoint 1 | R1

- `plan_version`: 1
- `state_transition`: ready -> active
- `progress_classification`: blocker_reduction
- `evidence`: deterministic regression proved an unrecognized nested URL shape
  and an error-only object previously collapsed to the same opaque failure.
  `summarizeChatgptDownloadJsonShape` now emits only bounded key names and value
  kinds through one child level; it never emits values. The exact helper body is
  embedded in the browser capture expression and its result propagates through
  direct, intercepted, and terminal failure diagnostics.
- `validation`: focused red failed as expected; repaired focused cases pass 2/2
  and the full ChatGPT adapter suite passes 120/120.
- `subagent_status`: not used; direct CodeGraph exploration was required and the
  operator did not request delegation.
- `next_action_or_stop_reason`: R2 is ready; replace serialized-string
  availability inference with a structured provider-free classifier.

## Checkpoint 2 | R2

- `plan_version`: 1
- `state_transition`: active -> active
- `progress_classification`: blocker_reduction
- `evidence`: regression proved a structured 403 with provider detail `Not
  found: requested file was deleted` was not classifiable through the prior
  order-sensitive serialized-message regex. Download failures now carry their
  structured diagnostics on the Error object; the classifier consumes numeric
  status and bounded nested provider evidence directly, with serialized text
  retained only as a compatibility fallback. A plain 403 access denial remains
  `retrieval_failed`.
- `validation`: focused red failed as expected; repaired classifier cases pass
  2/2 and the full ChatGPT adapter suite passes 121/121.
- `subagent_status`: not used.
- `next_action_or_stop_reason`: R3 is ready; prevent later generic fallback
  evidence from erasing a stronger provider-confirmed failure.

## Checkpoint 3 | R3

- `plan_version`: 1
- `state_transition`: active -> active
- `progress_classification`: blocker_reduction
- `evidence`: regression proved a later HTTP 200 generic missing-URL fallback
  replaced an earlier 403 response carrying explicit file-unavailable evidence.
  The browser capture path now selects failures by semantic strength:
  provider-confirmed unavailable, retryable transport/provider status,
  structured provider error, response shape, numeric status, then generic text.
  Equal-strength evidence preserves the earlier matched-surface receipt.
- `validation`: focused red failed as expected. One allowed rework updated an
  existing generated-expression assertion from the obsolete assignment to the
  ranked selector. The full ChatGPT adapter suite passes 122/122.
- `subagent_status`: not used.
- `next_action_or_stop_reason`: R4 is ready; keep the capture polling deadline
  effective when one intercepted response never settles.

## Checkpoint 4 | R4

- `plan_version`: 1
- `state_transition`: active -> active
- `progress_classification`: blocker_reduction
- `evidence`: a never-settling intercepted response previously made
  `Promise.allSettled(capturePromises)` unreachable from the loop deadline.
  The exact helper embedded in the browser expression now races current capture
  settlement against the smaller of the remaining deadline and poll interval,
  then clears its timer on early settlement. The capture loop no longer directly
  awaits all intercepted promises.
- `validation`: focused red failed as expected; repaired focused cases pass 2/2
  and the full ChatGPT adapter suite passes 123/123.
- `subagent_status`: not used.
- `next_action_or_stop_reason`: R5 is ready; bound direct fetch, signed follow
  fetch, and response-body promises with a distinguished local timeout.

## Checkpoint 5 | R5

- `plan_version`: 1
- `state_transition`: active -> awaiting-review
- `progress_classification`: blocker_reduction
- `evidence`: direct, anchor, and signed-follow fetches plus initial and signed-
  follow body reads previously had no local promise deadline. The shared helper
  now rejects a stalled stage as
  `chatgpt_download_timeout:<stage>:<milliseconds>`, clears its timer on prompt
  settlement, and invokes an abort callback for timed-out fetches. The exact
  helper body is embedded in the browser capture expression; each fetch/body
  stage is named and bounded at 10 seconds.
- `validation`: focused red failed as expected. One allowed rework updated an
  existing anchor-fetch expression assertion to the new bounded helper. Focused
  timeout/expression cases pass 2/2 and the full ChatGPT adapter suite passes
  124/124.
- `subagent_status`: not used.
- `next_action_or_stop_reason`: all five repair iterations are implemented.
  Run adjacent and broad provider-free validation, update durable operator docs,
  commit/push, install with source parity, and verify the paused runtime posture.
