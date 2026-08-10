# ChatGPT Structured-Exception Image Fallback Repair | 0245-2026-08-09

State: CLOSED
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Goal execution state: COMPLETE
Gate state: PROVIDER_FREE_GREEN_CANARY_GATE_PREPARED

## Stable Objective

Reproduce and repair the pass-55 object-shaped rejected-promise result that
bypassed the loaded-resource fallback, validate the exact branch provider-free,
and prepare one fresh installed `wsl-chrome-3` canary gate without installing,
restarting, launching a browser, controlling a completion, or resuming the
scheduler in this packet.

## Current State

- Plan 0244 proved the pass-54 URL is an exact CORS failure: the DOM image loads
  and `Page.getResourceContent` returns 71,346 bytes while page fetch rejects.
- Its first repair falls back only when `Runtime.evaluate.result.value` is not a
  record. Pass 55 returned six generic image-fetch failures and recorded no
  fallback telemetry, proving the live rejected-promise result passed that
  record test and bypassed the repair.
- Runtime is stopped at target blocked/pass 55, wider passes `7/2/34`, active
  jobs/browser zero, API PID 93478 healthy, scheduler paused/idle, guards clear.

## Authority And Non-Goals

- Authorized: one provider-free regression revision that models an
  object-shaped by-value result plus `exceptionDetails`; one narrow source
  repair; targeted/adjacent tests, typecheck, build, lint, audit, and docs; and
  preparation of a fresh successor canary gate.
- Excluded: install, API restart, browser/provider access, materialization,
  completion control, pass 56, retry, scheduler/wider/guard/config control,
  direct runtime JSON edits, prompt/click/`Answer now`, and subagents.
- Critical-path owner: primary agent; `subagent_status=not_spawned`.

## Ranked Hypotheses And Predictions

1. `H1_structured_exception_value`: CDP serializes the rejected fetch promise as
   `exceptionDetails` plus record-shaped `result.value` (commonly `{}`).
   Prediction: that fixture reproduces the generic failure and no fallback.
2. `H2_structured_nonstatus_value`: another non-status record shape reaches the
   same branch without `exceptionDetails`. Prediction: absence of explicit
   `ok/status/base64` needs classification distinct from a provider HTTP result.
3. `H3_installed_code_not_loaded`: the API used a different adapter despite
   file parity. Prediction: current PID/module identity would contradict the
   matching installed hash and new process provenance; retained evidence does
   not currently support this.

## Execution Packet

1. Revise only the exact provider-free fixture from missing value to an empty
   record plus exception details; require red against installed-equivalent
   source before production edits.
2. Make fallback eligibility explicit for CDP exception results while preserving
   structured `{ok:false,status}` as terminal and successful base64 behavior.
3. Pass focused and adjacent suites, typecheck, build, scoped lint, plan audit,
   and diff hygiene; record the new built adapter hash.
4. Close this packet and prepare a separate one-install/one-pass-56 canary gate
   for explicit effect approval. Do not execute it here.

## Local Goal Bounds

- `provider_free_reds: 1`; `implementation_slices: 1`;
  `review_rework_cycles: 0`; `installs: 0`; `api_restarts: 0`;
  `browser_launches: 0`; `provider_callbacks: 0`; `completion_controls: 0`;
  `scheduler_actions: 0`; `other_completion_actions: 0`; `pass_56_actions: 0`;
  `retries: 0`; `subagents: 0`.

## Hard Stops

- Stop on failure to reproduce the structured-exception branch, loss of
  explicit-status semantics, adjacent regression, or any need for runtime or
  provider evidence beyond retained pass-55 receipts.
- Do not install or execute a fresh canary. That requires a separately frozen
  successor effect packet because Plan 0244 consumed its sole canary.

## Acceptance Criteria

- [x] One object-shaped exception fixture is red before source changes and
  green after the repair.
- [x] Explicit 404, successful fetch, timeout, and missing-value fallback cases
  remain green with correct transfer/CDP telemetry.
- [x] Adapter/adjacent tests, typecheck, build, scoped lint, plan audit, and diff
  hygiene pass with a durable built hash.
- [x] Plan 0245 closes provider-free and one fresh installed pass-56 canary gate
  is prepared but not executed.

## Opening Checkpoint | Structured Exception Red Required

- `checkpoint_id`: `P0245-C01`.
- `state_transition`: P0244_CLOSED_PASS_55_STRUCTURED_EXCEPTION_FALLBACK_MISS ->
  P0245_ACTIVE_PROVIDER_FREE_RED.
- `progress_classification`: blocker_reduction.
- `evidence`: pass-55 fallback telemetry absent across six generic failures
  despite installed adapter parity and exact external CORS/resource-content
  proof; stopped runtime readback above.
- `next_action_or_stop_reason`: commit this successor authority, then revise the
  provider-free fixture to the exact structured-exception shape and require red.
- `authority_classification`: ordinary provider-free continuation; all runtime
  and provider effects require a fresh successor approval gate.

## Closing Checkpoint | Protocol Exception Eligibility Green

- `checkpoint_id`: `P0245-C02`.
- `state_transition`: P0245_ACTIVE_PROVIDER_FREE_RED ->
  P0245_COMPLETE_PROVIDER_FREE_CANARY_GATE_PREPARED.
- `progress_classification`: blocker_reduction.
- `red_evidence`: changing the external-image fixture from an absent value to
  `result.value={}` plus `exceptionDetails` reproduced the exact generic error
  at the pre-fallback branch; one test failed and 154 were skipped.
- `repair`: loaded-resource fallback eligibility now uses the CDP protocol's
  `exceptionDetails` signal as well as a missing value. A structured
  `{ok:false,status:404}` without exception details remains terminal and never
  enters the fallback.
- `verification`: focused binary-fetch gate `5/5`; adapter `156/156`;
  integrated adapter/history/MCP `237/237`; typecheck; scoped Biome
  zero-warning; full build; diff check. Built adapter SHA-256 is
  `ff3fe974478c6f28b975c82444a122c60759bc9404d4518337e1396c90d8baf6`;
  installed adapter intentionally remains `4b2dca82...c4725`.
- `effect_accounting`: one provider-free red and one implementation slice;
  installs/restarts/browser/provider/completion/scheduler/pass-56 actions all
  zero.
- `next_action_or_stop_reason`: stop provider-free complete. Plan 0246 is a
  prepared, unapproved one-install/one-pass-56 effect gate.

