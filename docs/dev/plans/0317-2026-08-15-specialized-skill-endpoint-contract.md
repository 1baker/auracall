# Specialized Skill Endpoint Contract | 0317-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Make the bundled agent-setup and API-workflow skills agree with AuraCall's
current HTTP routes, MCP tools, handoff schemas, environment contract, and
provider-free smoke commands, then enforce that agreement deterministically.

## Current State

- `skills/auracall-agent-setup` recommends checking `mutationTarget` after the
  preferred redacted setup handoff, but that response intentionally omits the
  nested agent mutation record and exposes only non-secret readiness metadata.
- `skills/auracall-api-workflow` correctly names the non-streaming
  `/v1/chat/completions` path, while the canonical endpoint reference omits it
  from the route list and twice claims the adapter does not exist.
- HTTP response/batch routes, setup routes, MCP setup/diagnostic/response tools,
  and handoff environment variables exist, but no steady-state check binds the
  specialized skills to those authorities.
- `smoke:scoped-client-handoff` is a fixture-backed provider-free integration
  smoke. `smoke:scoped-client-env` uses a supplied client environment and can
  execute its configured browser/provider; the skill currently does not make
  that effect boundary explicit.
- Both skills remain structurally valid and under the skill length limit.

## Scope

- Reconcile setup-handoff verification with the actual redacted result schema.
- Name the exact MCP equivalents for model/config discovery, response creation,
  response/batch polling, setup, and diagnostics.
- Prefer generated handoff status/batch URLs over reconstructing them from the
  OpenAI base URL.
- Remove the domain-specific grading smoke from the general API workflow,
  identify `smoke:scoped-client-handoff` as the provider-free repository gate,
  and gate `smoke:scoped-client-env` as an effectful downstream smoke.
- Repair the contradictory current endpoint reference.
- Add deterministic specialized-skill checks against HTTP matcher, MCP tool,
  package-script, skill, and current documentation authority.

## Non-Goals

- Do not change HTTP handlers, MCP schemas, setup services, or API-key issuance.
- Do not run provider, browser, project creation, key issuance, service restart,
  or other effectful setup/execution smokes.
- Do not expand remote privileged setup beyond the existing trusted-local
  boundary.
- Do not publish a release or npm artifact.

## Acceptance Criteria

- [x] Preferred setup-handoff verification names only fields returned by the
      redacted schema; lower-level mutation verification is clearly separated.
- [x] API workflow names exact HTTP and MCP create/readback/polling equivalents.
- [x] Generated handoff URLs are authoritative; provider-free fixture proof and
      effectful downstream verification are explicitly distinguished.
- [x] The endpoint reference lists the non-streaming chat-completions adapter
      and contains no contradictory no-adapter/no-auth claims.
- [x] Deterministic tests and plan audit reject drift across executable route,
      MCP tool, package script, skill, and documentation authority.
- [x] Skill validation, focused runtime tests, typecheck, zero-warning lint,
      build, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when both specialized skills describe only executable current
contracts and deterministic repository validation prevents those claims from
drifting away from their HTTP, MCP, handoff, and smoke authorities.

## Execution Evidence

- Reconciled the preferred redacted handoff with its actual non-secret result
  schema and moved `mutationTarget` verification to the lower-level project
  ensure path that returns it.
- Mapped HTTP response/chat/batch work to exact MCP create/status tools, made
  generated status/batch URLs authoritative, and separated the fixture-backed
  handoff smoke from the effectful real-client smoke.
- Restored the implemented non-streaming chat-completions route and optional
  auth posture in the canonical endpoint reference.
- Two skill validators, 34 focused contract/schema tests across 11 files, four
  provider-free chat-completions runtime tests, the fixture-backed scoped-client
  handoff smoke, typecheck, zero-warning lint across 839 files, production
  build, 318-plan audit with zero errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all specialized skill endpoint criteria accepted
- progress_classification: outcome_progress
- evidence: executable HTTP/MCP/schema tests plus fixture-backed handoff smoke and deterministic governance
- material_blockers: none
- next_action_or_stop_reason: publish the specialized skill contract baseline
