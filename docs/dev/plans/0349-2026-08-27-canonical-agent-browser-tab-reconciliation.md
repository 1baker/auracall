# Canonical Agent Browser Tab Reconciliation | 0349-2026-08-27

State: CLOSED
Lane: P01

## Objective

Ensure every Agent Browser-backed AuraCall run receives and retains one exact,
canonical service-tab handle without moving browser lifecycle ownership into
AuraCall or closing browser state that may belong to another run or operator.

The immutable initiating request is bound by the external bilateral controller
under thought `auracall-duplicate-tab-reconcile-20260827`.

## Current State

- AuraCall requests an Agent Browser access plan, executes the returned
  `tab_new` request, verifies the returned handle against broker inventory, and
  attaches only through that handle.
- Cleanup detaches and releases the exact acquired handle while preserving the
  browser process and retained session route.
- Agent Browser already exposes generic handle refresh and duplicate-target
  evidence, but its broad same-origin replacement policy is not safe to invoke
  automatically for ChatGPT because another conversation or active run may use
  the same origin.
- The live retained browser currently contains multiple ChatGPT and Workshop
  targets. Their presence is evidence for canonical selection and observability
  tests, not permission to close them.
- The active Agent Browser checkout contains unrelated dirty lifecycle work;
  this slice must not edit or overwrite that worktree.

## Scope

- Tighten AuraCall's broker-handle acquisition and validation at the existing
  Agent Browser bridge seam.
- Preserve the broker-provided exact target and record bounded reconciliation
  evidence suitable for runtime diagnostics.
- Add provider-free regressions for multiple compatible/exact retained targets,
  wrong returned URL or session identity, exact cleanup, and restart recovery.
- Update the user-facing broker contract, developer journal, durable fixes log,
  and validation receipts.
- Perform one bounded retained-browser live canary only after both bilateral
  packets are complete and Codex-approved.

## Non-goals

- Do not infer safe deletion from URL or origin alone.
- Do not close an existing ChatGPT conversation, root tab, browser process,
  browser profile, authenticated session, or foreign service handle.
- Do not add a second browser lifecycle authority to AuraCall.
- Do not edit the dirty Agent Browser checkout in place.
- Do not broaden Gemini or unrelated provider behavior.

## Execution Graph

1. Collect independent left and right evidence packets in parallel.
2. Join on a Codex-approved safety design and classify any LitScout gaps.
3. Implement the narrow AuraCall bridge and regression slice.
4. Run provider-free tests, typecheck, lint, build, and CodeGraph sync.
5. Run one initiating Pro synthesis and one reviewing Pro pass with exactly one
   bridge transit.
6. Run a bounded live canary that proves exact target authority and preserved
   browser PID, profile lease, session route, and unrelated tabs.
7. Close the plan, commit the coherent slice, and publish to personal `1baker`.

## Acceptance Criteria

- [x] Multiple retained same-origin or exact-URL tabs cannot make AuraCall
      attach to an unverified target.
- [x] The acquired handle matches the requested URL, broker browser, selected
      browser profile, broker session, and exact target identity.
- [x] Reconciliation is selection-only unless Agent Browser explicitly returns
      an exact temporary handle that AuraCall itself must release.
- [x] Cleanup failure cannot erase a successfully completed provider result.
- [x] Focused provider-free bridge tests pass, including multiple-target,
      mismatch, cleanup, and restart cases.
- [x] Typecheck, focused lint, build, CodeGraph sync, and relevant broader tests
      pass.
- [x] Bilateral Pro synthesis/review accepts the implementation with exactly
      one synthesis transit.
- [x] Live validation proves unchanged browser PID, profile lease, broker
      session, authentication posture, and unrelated retained targets.
- [x] Documentation and durable engineering notes match the shipped behavior.

## Validation Receipts

- Provider-free verification: 23 bridge assertions and 24 configured-executor
  assertions pass; TypeScript checking and focused Biome checking pass.
- Route regression: a dashboard-produced access plan is executed through the
  exact selected `auracall-chatgpt-bridge-v3` session stream.
- Bilateral review: initiating response
  `resp_54cb21d5e8104cdb9bab083f83930272` and reviewing response
  `resp_804d1f77a207452c8d0dbb01d4344404` were sufficient with one synthesis
  transit. Two earlier infrastructure attempts failed before provider output
  and before any synthesis transit.
- Live preservation: Agent Browser remained ready on PID 3246087 with profile
  `auracall-chatgpt-live` and session `auracall-chatgpt-bridge-v3`; all 13
  pre-existing valid targets remained after both temporary Pro targets were
  released.
- Scope preservation: the dirty Agent Browser checkout was inspected but not
  edited, and no historical ChatGPT, root, or other-conversation tab was closed.

## Definition Of Done

This plan closes only when the canonical-handle contract is implemented and
validated end to end, the live retained browser is preserved, the external
bilateral review is sufficient, and the coherent commit is published through
the personal `1baker` route.
