# Console Gemini Handoff Adapter Parity | 0294-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make the Handoffs console expose the `gemini-browser` adapter added by Plan
0293 and prove that Recover Live sends the selected closed-world adapter value
to the HTTP API.

## Current State

- CLI, HTTP, and the Handoffs console now share the closed-world operator
  contract `packet`, `chatgpt-browser`, and `gemini-browser`.
- The console renders its selector from one typed option list with Packet as
  the default.
- One request-body helper trims the optional packet root and sends the selected
  adapter only on `recover-live`.
- Source tests and the built console asset contain the Gemini option and
  recovery request wiring; no provider or browser work ran.

## Scope

- Define the console adapter choices in one typed module.
- Render all three choices from that shared list.
- Centralize recovery request-body construction so only `recover-live` sends
  `targetAdapter`.
- Add provider-free tests for options, default, and request serialization.
- Update operator testing and planning records.

## Non-Goals

- Do not run a browser or provider request.
- Do not change HTTP adapter semantics or handoff approval gates.
- Do not install or restart the runtime.
- Do not claim Plan 0114 live cross-service proof.

## Acceptance Criteria

- [x] The console selector exposes Packet, ChatGPT browser, and Gemini browser.
- [x] Packet remains the default.
- [x] Recover Live serializes the exact selected adapter; other actions omit it.
- [x] Provider-free tests, typecheck, console/production build, lint, plan
  audit, and diff checks pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- One primary agent owns the console/helper/test boundary.
- No browser, provider, service, configuration, or installed-runtime mutation.

## Definition Of Done

The plan closes when the source and built console offer the three-value adapter
contract, focused tests cover request serialization, and all provider-free
validation passes.

## Execution Evidence

- `ux/console/src/handoffAdapters.ts` is the typed source of truth for options,
  default selection, and action-body serialization.
- `ux/console/src/App.jsx` renders the shared list and delegates request-body
  construction to the helper.
- Focused tests passed 2/2; typecheck, production build, full lint at the
  unchanged warning baseline, plan audit, and diff hygiene passed.
- The built console JavaScript contains `gemini-browser`, `Gemini browser`, and
  the Recover Live `targetAdapter` serialization contract.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all console parity criteria accepted
- progress_classification: blocker_reduction
- evidence: source helper/UI tests plus production built-asset readback
- material_blockers: none inside this packet; Plan 0114 still owns live proof
- next_action_or_stop_reason: publish the console parity repair and continue
  provider-free cleanup while live target mutation remains unapproved
