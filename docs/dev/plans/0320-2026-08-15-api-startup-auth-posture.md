# API Startup Authentication Posture | 0320-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make `auracall api serve` startup diagnostics report the exact non-secret API
authentication posture enforced by the running server, including loopback and
explicit non-loopback binds, without exposing key material.

## Current State

- Request authorization and `/status.auth` derive from `readApiAuthPolicy`, but
  startup logging always says the server is unauthenticated.
- The non-loopback bind refusal also calls the development server
  unauthenticated even when config or environment keys enable authentication.
- The server instance exposes only its port, so the startup wrapper cannot
  consume the exact already-resolved auth summary without resolving policy a
  second time.
- Current endpoint documentation correctly says auth can protect `/v1/*`,
  `/status` remains observable, and public binding needs trusted ingress.

## Scope

- Add a non-secret API auth runtime summary derived once from the resolved
  policy used by request authorization.
- Expose that summary on the server instance and reuse it for `/status.auth`.
- Format startup posture from the running server's summary for authenticated,
  required-without-keys, and unauthenticated states on loopback/non-loopback.
- Remove the unconditional unauthenticated claim from pre-bind refusal text.
- Add focused formatter, server-summary, and `api serve` logging coverage.
- Update operator docs and governance history for the corrected startup
  contract.

## Non-Goals

- Do not change which routes require authentication or the same-origin
  operator-dashboard exception.
- Do not change key loading, scope enforcement, config resolution, bind
  defaults, or `--listen-public` authorization.
- Do not log key ids, secrets, scope values, or environment contents.
- Do not run live providers, browsers, service restarts, or public ingress.

## Acceptance Criteria

- [x] Startup logging states whether API auth is disabled, enabled with a
      non-secret key count/scoped-key indicator, or required with no keys.
- [x] Startup posture uses the exact auth summary already resolved by the
      running server rather than a second policy read.
- [x] Loopback and non-loopback messages preserve the observable `/status` and
      trusted-ingress boundaries without falsely claiming unauthenticated API
      routes.
- [x] The server instance and `/status.auth` expose the same non-secret summary.
- [x] No key id, secret, or scope value is emitted in startup diagnostics.
- [x] Focused tests, full provider-disabled tests, typecheck, zero-warning lint,
      build, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when startup diagnostics and `/status` share the running
server's resolved non-secret auth posture, all binding states are truthful and
tested, operator documentation is current, and broad validation passes without
live effects.

## Execution Evidence

- Added an immutable `ApiAuthRuntimeStatus` containing only required state,
  scheme, loaded-key count, and scoped-key presence. The server resolves it once
  beside request authorization, exposes it on the running instance, and reuses
  it for `/status.auth` and startup logging.
- `serveResponsesHttp` now passes one injected/runtime environment through
  config resolution and server policy resolution, preventing ambient auth
  state from diverging between the wrapper and request enforcement.
- Startup formatting covers disabled auth, enabled auth with singular/plural
  counts, scoped-key presence, and required-without-keys for loopback and
  non-loopback bindings. It retains `/status` observability and trusted-ingress
  warnings while never receiving key ids, secrets, or scope values.
- Two focused files passed 233 tests. The complete isolated provider-disabled
  suite passed 2,936 tests with 65 expected skips and zero failures across all
  840 suites. Typecheck, zero-warning lint across 843 files, production build,
  321-plan audit with zero errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all API startup authentication posture criteria accepted
- progress_classification: outcome_progress
- evidence: shared runtime summary plus focused and full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the corrected startup posture baseline
