# HTTP Route Manifest Authority | 0318-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Replace the duplicated static HTTP route catalog in the server startup banner,
`/status.routes`, and specialized-skill governance with one typed executable
manifest while preserving request handling and dynamic service-discovery URLs.

## Current State

- `src/http/responsesServer.ts` repeats static route templates in the status
  response type, the status-response builder, and one long startup log literal.
- The startup literal is already incomplete: response-batch and several newer
  advertised routes exist in `/status.routes` but do not appear in the banner.
- The specialized-skill audit searches the server monolith for route strings
  without checking a reusable route contract.
- Dashboard paths and local/external base URLs are runtime-derived and should
  remain outside a static manifest.

## Scope

- Add a typed static HTTP route manifest containing status keys, methods, and
  the existing operator-facing route templates.
- Derive the static `/status.routes` projection and startup endpoint banner
  from the manifest.
- Keep dynamic dashboard paths, base URLs, and adapter-specific recovery
  details computed at status-build time.
- Bind specialized-skill route requirements to manifest entries while
  retaining matcher-source checks as proof that advertised routes execute.
- Add focused tests for projection, formatting, required-route governance, and
  server status compatibility.

## Non-Goals

- Do not rewrite or reorder HTTP request dispatch.
- Do not add, remove, rename, or change authorization for endpoints.
- Do not change binding, browser, provider, setup, persistence, or service
  discovery behavior.
- Do not run provider/browser/live-service effects or publish a release.

## Acceptance Criteria

- [x] One typed manifest owns every static route currently advertised by
      `/status.routes`, including method metadata.
- [x] `/status.routes` preserves its existing static values and dynamic values.
- [x] The startup banner is generated from the manifest and includes response
      batches plus every other advertised static route.
- [x] Specialized-skill governance rejects missing manifest routes and missing
      executable matcher authorities independently.
- [x] Focused tests, typecheck, zero-warning lint, build, plan audit, and diff
      hygiene pass.

## Definition Of Done

The plan closes when static route metadata has one executable owner, both
runtime projections consume it, governance proves required manifest and handler
authority, and repository validation passes without live side effects.

## Execution Evidence

- Added a 71-entry typed static manifest and derived 65 unique method-qualified
  banner paths plus the static `/status.routes` projection from it.
- An AST comparison against the prior server source proved exact preservation
  of all 70 literal status templates; the adapter-parameterized recovery
  template remains resolved with the current adapter contract at status-build
  time. Dynamic service-discovery routes and base URLs remain runtime values.
- Specialized-skill governance now checks executable manifest declarations and
  server matcher authority independently.
- Three focused files passed 223 tests. The complete provider-disabled suite
  passed 2,929 tests with 65 expected skips across 345 files. Typecheck,
  zero-warning lint across 841 files, production build, 319-plan audit with zero
  errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all HTTP route manifest authority criteria accepted
- progress_classification: outcome_progress
- evidence: exact prior-template comparison plus focused and full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the route manifest authority baseline
