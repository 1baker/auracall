# ChatGPT First Runtime Evaluate Provider-Free Diagnosis | 0259-2026-08-11

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_REPAIR_VALIDATED
Goal execution state: PREPARED_SUCCESSOR_GATE

## Stable Goal Objective

Reproduce Plan 0258's first `Runtime.evaluate` failure with deterministic fake
CDP, identify the exact failing evaluation class and exception without
retaining provider content, repair the smallest proven defect, and validate the
conversation-context path provider-free. Do not install, restart, launch or
attach a browser, call ChatGPT, materialize history, control a completion, or
resume the scheduler.

## Current State

- Plan 0258's launch repair advanced the sole canary from
  `preflight:browserChromeLaunch` and `attemptCount=0` into provider attempt 1.
- The unique terminal receipt then reported `lastStage=cdp:Runtime.evaluate`,
  `pendingOperation=null`, `errorCode=Error`, and no context after 39036 ms.
- That receipt identifies the last CDP method but not the evaluation purpose,
  expression class, exception details, or call site. The canary intentionally
  discarded raw child stderr.
- API PID 64951 is active/running with zero restarts; scheduler is
  paused/paused; the target is idle-waiting/pass 56; exact managed browser
  owners, port 45015 listeners, and active history jobs are zero.

## Execution Packet

1. Build one fast deterministic fake-CDP loop that reproduces the live receipt
   collapse: a first evaluation failure must currently surface only the broad
   `cdp:Runtime.evaluate` stage and generic error code.
2. Minimize the fixture to the exact context-read call chain, then rank three
   to five falsifiable hypotheses before changing production code.
3. Add closed-world evaluation-purpose telemetry and safe error
   classification only where the fixture proves it distinguishes the failing
   call. Never retain expressions, provider payloads, DOM text, URLs, headers,
   cookies, identities, or raw exception messages.
4. If evidence proves a behavioral defect, add the regression test first,
   repair the smallest correct seam, and re-run the original red loop. If the
   defect is only missing diagnostics, stop after provider-free diagnostic
   acceptance and prepare a separate one-canary gate.
5. Validate focused context/adapter/receipt tests, the relevant wider browser
   suite, typecheck, build, lint for touched files, plan audit, and diff check.

## Acceptance Criteria

- [x] One deterministic, seconds-scale command reproduces the exact diagnostic
  collapse without a browser or provider.
- [x] The failing evaluation purpose and safe exception class are deterministic
  and covered at the real context-read seam.
- [x] Any proven behavioral defect is repaired with red-before-green evidence;
  otherwise the slice records diagnostics-only acceptance explicitly.
- [x] Focused and wider provider-free validation pass with zero browser,
  provider, runtime-install, scheduler, completion, or materialization effects.
- [x] A fresh installed/live canary, if still necessary, is withheld behind a
  separate successor gate.

## Local Goal Bounds

- `max_feedback_loop_runs: 6`; `max_hypothesis_probe_rounds: 1`;
  `max_fix_iterations: 1`; `max_review_rework_cycles: 1`;
  `max_installs: 0`; `max_api_restarts: 0`; `max_browser_launches: 0`;
  `max_browser_attachments: 0`; `max_provider_calls: 0`;
  `max_context_canaries: 0`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_guard_actions: 0`; `max_direct_runtime_edits: 0`;
  `max_subagents: 0`.

## Activation Checkpoint | Provider-Free Successor Authorized

- `checkpoint_id`: `P0259-C01`.
- `state_transition`: P0258_CLOSED_FAILED_CDP_RUNTIME_EVALUATE ->
  P0259_ACTIVE_PROVIDER_FREE.
- `progress_classification`: blocker_reduction.
- `evidence`: Plan 0258 proved native Chrome launch is no longer the active
  blocker and localized the next boundary to an unclassified first
  `Runtime.evaluate` failure.
- `subagent_status`: not_spawned; direct CodeGraph exploration is required by
  repo policy and the packet is serialized.
- `next_action_or_stop_reason`: construct and run the deterministic red-capable
  fake-CDP loop before forming a source hypothesis.
- `authority_classification`: provider-free repo implementation and validation
  only; every runtime/browser/provider effect remains excluded.
- `review_disposition_summary`: no broad discovery pass is opened. This packet
  is closed-world against the accepted Plan 0258 failure boundary.

## Definition Of Done

Provider-free evidence names and tests the exact first-evaluation failure class,
the smallest proven repair is green, all excluded effects remain zero, and any
remaining live acceptance is isolated in a fresh unapproved successor gate.

## Terminal Checkpoint | Safe Failure Class And Readiness Contract Green

- `checkpoint_id`: `P0259-C02`.
- `state_transition`: P0259_ACTIVE_PROVIDER_FREE ->
  P0259_CLOSED_PROVIDER_FREE_REPAIR_VALIDATED.
- `progress_classification`: blocker_reduction.
- `exact_reproducer`: `pnpm vitest run tests/browser/chatgptAdapter.test.ts -t
  'interrupts a stalled post-payload readiness evaluation'` failed twice in
  about two seconds because the real adapter seam retained only broad method
  telemetry and no completed evaluation-failure marker.
- `ranked_hypothesis_disposition`: hypothesis 1 is confirmed: the receipt
  reflected the most recent CDP counter, not a unique failing call. Hypothesis
  2 remains safely observable as a distinct initial-payload failure marker.
  Hypothesis 3 is covered by destroyed/missing-context classifiers. Hypothesis
  4 is not supported by the provider-free red; no recovery marker replaced the
  initiating post-payload timeout in the fixture.
- `repair`: the initial payload evaluation, post-payload readiness evaluation,
  and direct retry now emit completed allowlisted failure classes without raw
  messages or expressions. Post-payload readiness explicitly records its CDP
  method, records success/failure, and fails closed when `ready.ok` is false
  instead of continuing into message extraction.
- `privacy_contract`: retained classes are limited to `evaluation_timeout`,
  `execution_context_destroyed`, `execution_context_missing`,
  `transport_closed`, `protocol_error`, `generic_error`, and
  `predicate_unsatisfied`; tests prove raw provider detail is absent from the
  class and terminal receipt.
- `red_green_evidence`: the original loop failed twice, the expanded classifier
  packet failed once before implementation, then 8/8 exact tests passed. Three
  focused files pass 186/186 and the five-file adjacent packet passes 358/358.
- `validation`: TypeScript typecheck and production build pass; scoped Biome
  passes with no fixes; plan audit reports 260 plans and zero errors; diff
  hygiene passes. The full suite was intentionally not run because its known
  browser reattach e2e can launch the configured profile and would violate this
  packet's zero-browser bound.
- `runtime_readback`: no install or API restart was initiated by this packet.
  Current API PID 82312 is active/running with `NRestarts=0`; scheduler remains
  paused/paused; the target remains idle-waiting/pass 56 with null
  error/next/force; exact managed Chrome owners, port 45015 listeners, and
  active history jobs are zero.
- `effect_audit`: installs 0/0; API restarts 0/0; browser launches 0/0;
  browser attachments 0/0; provider calls 0/0; context canaries 0/0;
  materialization starts 0/0; completion controls 0/0; scheduler controls 0/0;
  guard actions 0/0; direct runtime edits 0/0; subagents 0/0.
- `next_action_or_stop_reason`: stop before install/restart or live work. Plan
  0260 is a separate explicit one-canary approval gate.
- `authority_classification`: Plan 0259 is terminal; no live-effect authority
  carries into Plan 0260.
- `review_disposition_summary`: one closed-world repair iteration completed;
  historical Plan 0258 stderr cannot be reconstructed, so no exact historical
  exception is claimed.
