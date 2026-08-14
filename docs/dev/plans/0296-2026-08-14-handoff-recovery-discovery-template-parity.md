# Handoff Recovery Discovery Template Parity | 0296-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make machine-readable `/status` discovery advertise the full Recover Live
request contract, including the closed-world target-adapter enum.

## Current State

- CLI, HTTP, console, README, the endpoint reference, and `/status` discovery
  now expose Packet, ChatGPT browser, and Gemini browser recovery choices.
- The machine-readable template includes optional `outputDir` and the exact
  closed-world `targetAdapter` enum.

## Scope

- Add the exact adapter enum to the discovery template.
- Strengthen the existing HTTP handoff test to assert the full template.
- Update planning and durable fix records.

## Non-Goals

- Do not change request parsing or recovery execution.
- Do not run browser/provider work or mutate installed runtime.

## Acceptance Criteria

- [x] `/status` advertises optional `outputDir` and all three adapter values.
- [x] Focused HTTP tests, typecheck, build, lint, plan audit, and diff hygiene
  pass.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free HTTP fixture only.

## Definition Of Done

The plan closes when exact discovery-template coverage passes and the endpoint
contract is consistent across human and machine-readable surfaces.

## Execution Evidence

- `src/http/responsesServer.ts` now advertises the exact Recover Live body in
  `routes.handoffRecoverLiveTemplate`.
- `tests/http.handoffOperator.test.ts` asserts the complete template rather
  than merely checking for a handoff path substring.
- Focused tests passed 2/2; typecheck, production build, full lint at the
  unchanged warning baseline, plan audit, and diff hygiene passed.
- No browser, provider, service, config, or installed-runtime mutation ran.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all discovery parity criteria accepted
- progress_classification: hardening
- evidence: exact provider-free `/status` route-template assertion
- material_blockers: none
- next_action_or_stop_reason: publish the machine-readable contract repair
