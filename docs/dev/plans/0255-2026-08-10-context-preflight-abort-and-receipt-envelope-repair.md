# Context Preflight Abort And Receipt Envelope Repair | 0255-2026-08-10

State: CLOSED
Lane: P01
Plan version: 2
Gate state: PASSED_PROVIDER_FREE
Goal execution state: COMPLETED_PROVIDER_FREE

## Stable Goal Objective

Make conversation-context managed-browser launch cancellation-aware and
joined, preserve the exact abort signal through every browser-target layer,
and make the redaction-safe canary read the existing cache envelope correctly.
Validate the repair provider-free. Do not install, restart, launch or attach a
browser, call a provider, retry Plan 0254, materialize assets, control a
completion, or resume the scheduler.

## Current Causal Evidence

- Plan 0254's sole receipt records `attemptCount=0` and
  `lastStage=preflight:buildListOptions`; the failure preceded all provider
  callbacks and extraction.
- `LlmService.getConversationContext` gives its abort signal to the outer
  preflight wait, but `buildListOptions`, `BrowserService.resolveServiceTarget`,
  core target resolution, manual-login launch, and Chrome launch do not carry
  that signal. A pending launcher can therefore outlive the context deadline.
- The canary found exactly one changed receipt but reported it missing because
  receipts are stored as cache envelopes whose receipt is under `items`.
  Sanitization currently inspects the envelope root instead.
- Three provider-free red tests reproduce these independent contracts: cache
  envelope rejection, dropped signal forwarding, and the missing
  cleanup-joined abortable-launch primitive.

## Implementation Packet

1. Unwrap `items` before projecting the canary's allowlisted receipt contract,
   while retaining root-receipt compatibility and content redaction.
2. Thread one optional `AbortSignal` from conversation-context preflight through
   AuraCall and browser-service target resolution, manual-login session launch,
   and Chrome launch.
3. Add a reusable abortable launch wrapper that races launch with cancellation,
   invokes cleanup at most once, waits for cleanup to settle, and then rejects
   with the caller's abort reason.
4. Use the wrapper for the custom-host Chrome launcher exercised by the Linux
   WSL managed-browser path. Add narrow preflight telemetry around exact target
   resolution if it does not widen behavior.
5. Run focused red/green tests, typecheck, build, relevant browser/context
   integration tests, formatting checks, and the planning audit. Commit and
   push only after provider-free acceptance is green.

## Acceptance Criteria

- [x] Envelope-wrapped receipts select and sanitize exactly one changed target
  receipt without exposing envelope identity or private fields.
- [x] The same caller-owned abort signal reaches managed-browser launch.
- [x] Aborting a pending launch completes exact cleanup before the public
  promise rejects and never invokes cleanup more than once.
- [x] Existing port selection, ownership, manual-login, context retry, and
  browser-service tests remain green.
- [x] Typecheck, build, lint/diff checks, and plan audit pass.
- [x] Provider, browser, install, restart, materialization, completion,
  scheduler, guard, and direct-runtime effects remain zero.

## Local Goal Bounds

- `max_provider_calls: 0`; `max_browser_launches: 0`;
  `max_agent_browser_attachments: 0`; `max_installs: 0`;
  `max_api_restarts: 0`; `max_context_retries: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Opening Checkpoint | Deterministic Reds Accepted

- `checkpoint_id`: `P0255-C01`.
- `state_transition`: P0255_OPEN -> P0255_ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: causal_confirmation.
- `evidence`: three focused tests fail on the exact absent contracts: the
  canary rejects an `items`-wrapped receipt, core target resolution omits the
  caller signal from manual-login launch, and the abortable joined-launch
  helper is absent. Plan 0254 independently records provider attempts zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: implement the smallest cross-layer signal and
  receipt repairs, then validate without any runtime or provider effect.
- `authority_classification`: standing bounded provider-free repair authority;
  every live/runtime/control effect remains excluded.
- `review_disposition_summary`: direct agent-browser evidence and the receipt
  reject provider/auth/extraction as this canary's mechanism; preflight launch
  cancellation and receipt reporting are accepted as the repair scope.

## Definition Of Done

All provider-free acceptance criteria pass, the implementation and operational
record are committed and pushed, and live/runtime/control effects stay zero.
Any later install or canary requires a separate bounded gate.

## Closeout Checkpoint | Provider-Free Repair Accepted

- `checkpoint_id`: `P0255-C02`.
- `state_transition`: P0255_ACTIVE_PROVIDER_FREE_REPAIR ->
  P0255_CLOSED_PASSED_PROVIDER_FREE.
- `progress_classification`: blocker_removed.
- `evidence`: the context-owned abort signal now reaches service target,
  manual-login, and native WSL Chrome launch. A pending launch races the signal,
  invokes launcher cleanup exactly once, waits for cleanup, and rejects with
  the caller reason; completed launches are not cleaned and pre-aborted calls
  never start launch. The canary sanitizer unwraps `items` before projecting
  its allowlisted receipt. Focused tests pass 19/19, the broader browser and
  context surface passes 109/109, the full provider-free suite passes 306 test
  files with 2777 passed and 65 skipped tests, and typecheck, build, lint,
  whitespace, and the 255-plan audit pass. Lint retains the existing 206
  warnings. Final readback reports API PID 64314 active/running with
  `NRestarts=0`, scheduler paused/paused, active history jobs zero,
  `wsl-chrome-3` idle-waiting/pass 56, and zero exact default or
  `wsl-chrome-3` Chrome owners.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0256 prepares one fresh installed
  `wsl-chrome-3` zero-retry canary. It remains a separate live-effect gate.
- `authority_classification`: provider-free repair completed; provider,
  browser, install, restart, materialization, completion, scheduler, guard,
  and direct-runtime effects were zero.
- `review_disposition_summary`: the verified repair closes the preflight
  cancellation leak and receipt visibility defect without changing provider
  extraction semantics.
