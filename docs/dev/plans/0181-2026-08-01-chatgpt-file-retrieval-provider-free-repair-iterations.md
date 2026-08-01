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
- [ ] R2 red/green regression and validation complete.
- [ ] R3 red/green regression and validation complete.
- [ ] R4 red/green regression and validation complete.
- [ ] R5 red/green regression and validation complete.
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
