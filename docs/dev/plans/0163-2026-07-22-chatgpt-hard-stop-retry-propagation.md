# ChatGPT Hard-Stop Retry Propagation | 0163-2026-07-22

State: CLOSED
Lane: P01

## Goal

Ensure a ChatGPT account-mirror rate-limit hard-stop terminates the owning
conversation-context operation after its first adapter observation, without a
generic LLM-service retry, recovery navigation, or second guard detection.

## Current State

- Plan 0162 added readiness interrupt polling inside the ChatGPT adapter.
- Installed successor proof reached pass 5, then one context operation lasted
  237 seconds and produced guard detections at 10:00:45 and 10:02:34 CDT.
- The adapter hard-stop carries `blockingSurface.kind=rate-limit`, but
  `LlmService.withRetry` still treats the message as retryable and can rerun the
  whole provider context operation.
- Completion and scheduler are paused; cooldown is active through 16:02:34 CDT.
- Delegation receipt: `not_spawned`; the test and fix share one small,
  safety-critical retry boundary in the dirty worktree.

## Scope

- Add a deterministic regression at `LlmService.getConversationContext`.
- Prevent generic retry of distinguished provider blocking-surface hard-stops.
- Preserve normal transient retry behavior for ordinary connection failures.
- Install and verify provider-free with completion/scheduler paused.

## Non-Goals

- No live provider retry or guard clearance.
- No broad redesign of collector tolerated-read semantics.
- No scheduler or materialization pacing changes.

## Acceptance Criteria

- [x] An account-mirror context provider error carrying a rate-limit blocking
  surface invokes the provider exactly once and propagates that error.
- [x] Ordinary retryable transient errors retain their existing retry behavior.
- [x] The regression fails before the repair and passes afterward.
- [x] Targeted adjacent tests, typecheck, build, lint, diff check, and plan audit
  pass.
- [x] Installed runtime remains healthy with completion/scheduler paused and no
  managed browser/CDP listener.

## Definition Of Done

The plan closes when distinguished blocking-surface errors cannot cross the
generic LLM retry boundary twice, validation passes, and the installed runtime
is quiescent under the persisted provider cooldown.

## Result

- A deterministic regression failed with two provider invocations for one
  account-mirror context read carrying `blockingSurface.kind=rate-limit`.
- `LlmService.withRetry` now accepts a call-site retry predicate evaluated
  against the original provider error before guard wrapping. Account-mirror
  context reads reject retry only for the distinguished rate-limit surface;
  ordinary transient failures retain the existing retry path.
- The focused regression and transient control pass, along with 185 adjacent
  adapter, guard, collector, and context tests. TypeScript, production build,
  scoped Biome, full lint with 203 existing warnings, and diff checks pass.
- The installed API is active as PID `4037776` at 11 tasks and about 1.1 GiB
  current memory. Scheduler and successor completion remain paused at pass 5,
  the existing cooldown remains intact, and no managed ChatGPT browser or CDP
  45015 listener exists. Installed verification made no provider request.
