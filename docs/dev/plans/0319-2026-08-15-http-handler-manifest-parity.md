# HTTP Handler Manifest Parity | 0319-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make every static AuraCall API handler resolve its path and allowed methods
through the typed HTTP route manifest, advertise currently executable API
contracts missing from `/status.routes`, and reject drift in either direction.

## Current State

- Plan 0318 centralizes 71 advertised route contracts for status and startup
  projections, but request dispatch still compares independent raw path
  literals, prefixes, and regular expressions.
- Eight executable contracts are absent from the manifest: config agent/team
  list and item routes, account-mirror catalog-item assets, development-run
  create/item routes, and the development-policy route.
- Specialized-skill governance checks only eleven selected handlers and cannot
  prove full manifest-to-handler or handler-to-manifest parity.
- Dynamic dashboard and static-asset routing is service-discovery owned rather
  than part of the static JSON API contract.

## Scope

- Add the eight missing static API contracts to the manifest with exact method
  and path-template metadata.
- Add reusable manifest path matching and parameter extraction.
- Bind static API request gates and dynamic-id matcher helpers to manifest keys
  without reordering handler execution.
- Tighten development-run item handling to its intended GET readback and POST
  cancel methods instead of returning readback for arbitrary methods.
- Add a deterministic AST contract that rejects invalid/unused manifest keys
  and raw static API path gates that bypass manifest matching.
- Reuse the full route contract from plan governance and specialized-skill
  validation rather than maintaining another partial handler list.

## Non-Goals

- Do not replace the sequential request dispatcher with a new router.
- Do not move dynamic dashboard, console asset, or service-discovery routes into
  the static API manifest.
- Do not add provider, browser, persistence, setup, or authentication behavior.
- Do not run live providers/browsers or publish a release.

## Acceptance Criteria

- [x] Every intended static `/status` and `/v1` API route is represented in the
      manifest with its executable methods.
- [x] Static API dispatch and dynamic-id matchers derive path authority from
      manifest keys; no raw handler path gate remains.
- [x] `/status.routes` and the startup banner include all newly inventoried
      executable static contracts.
- [x] Deterministic validation rejects a missing handler reference, unknown
      manifest reference, or raw API handler gate independently.
- [x] Existing handler semantics remain green except the deliberate
      development-run unsupported-method tightening.
- [x] Focused tests, full provider-disabled tests, typecheck, zero-warning lint,
      build, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when the typed manifest is the executable path/method authority
for every static JSON API handler, both drift directions fail deterministically,
the eight inventory gaps are visible in status/startup diagnostics, and broad
validation passes without live effects.

## Execution Evidence

- Expanded the typed manifest to 81 route entries spanning 73 unique paths,
  including all eight previously executable inventory gaps. Shared-path GET and
  POST handlers now have independent keys where their implementations differ.
- Added exact manifest path matching with decoded segment parameters and
  explicit rest parameters for archive item ids. Every static handler gate and
  dynamic-id matcher now derives path authority from a manifest key without
  changing sequential dispatch order.
- Added a TypeScript AST contract that proves all 81 manifest keys have handler
  references and rejects unknown references plus raw `/status` or `/v1` path
  equality, prefix, and regular-expression gates. Specialized-skill governance
  reuses that complete contract instead of its former eleven-route subset.
- Four focused files passed 228 tests. The complete provider-disabled suite
  passed 2,934 tests with 65 expected skips and zero failures. Typecheck,
  zero-warning lint across 843 files, production build, 320-plan audit with zero
  errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all HTTP handler and manifest parity criteria accepted
- progress_classification: outcome_progress
- evidence: complete AST parity contract plus focused and full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the handler manifest parity baseline
