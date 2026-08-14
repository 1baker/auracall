# Handoff HTTP Endpoint Reference Parity | 0295-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Bring the canonical local HTTP endpoint reference into parity with the
installed handoff operator routes.

## Current State

- `docs/openai-endpoints.md` identifies itself as the endpoint contract but
  omitted all five `/v1/handoffs/{handoff_id}/...` routes.
- README described the routes at a workflow level, while the server was the
  only authority for exact methods, request fields, auth boundary, and adapter
  values.
- The endpoint index and contract now document status, resume, repair, export,
  and recover-live with the exact GET/POST split and request-body rules.

## Scope

- Add the five handoff operator routes to the endpoint index.
- Document operator authentication, packet lookup, `outputDir`, closed-world
  `targetAdapter`, default adapter behavior, and fail-closed recovery gates.
- Update roadmap, runbook, journal, and durable fix guidance.

## Non-Goals

- Do not change HTTP behavior.
- Do not expose approval, upload, or submit routes that do not exist.
- Do not run browser/provider work or mutate installed runtime.

## Acceptance Criteria

- [x] Every server-recognized handoff operator route appears with the correct
  method and path.
- [x] Request fields and adapter values match the server schema.
- [x] The docs distinguish packet inspection/recovery from live provider proof.
- [x] Plan audit and diff hygiene pass.

## Execution Evidence

- Server authority: `matchHandoffOperatorRoute`,
  `HANDOFF_OPERATOR_REQUEST_SCHEMA`, and the request handler in
  `src/http/responsesServer.ts` were read directly.
- Documentation: `docs/openai-endpoints.md` now carries the five-route index
  and an operator-contract section.
- Validation: the plan-library audit reports zero errors and diff hygiene
  passes. This docs-only slice ran no browser, provider, service, config, or
  installed-runtime mutation.

## Closeout

- state_transition: PLANNED -> CLOSED
- acceptance_state: all endpoint-reference parity criteria accepted
- progress_classification: hardening
- evidence: direct server-to-document contract comparison
- material_blockers: none
- next_action_or_stop_reason: publish the corrected endpoint reference
