# Trusted Local Dashboard Configuration | 0323-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Prevent a loopback reverse proxy from accidentally turning remote dashboard
traffic into trusted-local operator authority, while preserving the direct
loopback development workflow when no external route is configured.

## Current State

- Trusted-local dashboard authority requires API auth, loopback server binding,
  a loopback TCP peer, and same-origin browser context.
- A reverse proxy on the same host still appears as a loopback TCP peer, so an
  externally routed dashboard can satisfy every current trusted-local check.
- AuraCall already knows about explicit external dashboard configuration through
  `api.publicDashboardUrl` and `api.routing.external*`, but that evidence does
  not currently constrain trusted-local authority.
- There is no operator configuration switch to disable the local exception on a
  loopback-only deployment that has an out-of-band proxy.

## Scope

- Add `api.auth.trustedLocalOperatorDashboard` as an explicit boolean switch.
- Preserve the existing direct loopback default when the switch is omitted and
  no external dashboard routing is configured.
- Resolve trusted-local authority off when the switch is false.
- Resolve trusted-local authority off whenever `api.publicDashboardUrl`,
  `api.routing.externalBaseUrl`, or `api.routing.externalHostname` is configured,
  even if the switch is omitted or true.
- Expose a non-secret resolved reason in `/status.auth` and startup posture so
  operators can distinguish enabled, config-disabled, externally routed,
  non-loopback, and auth-disabled states.
- Keep secure dashboard sessions and valid bearer credentials as the supported
  authority paths after trusted-local access is disabled.
- Update config schema, focused regressions, and current operator documentation.

## Non-Goals

- Do not trust forwarded client-address or transport headers.
- Do not infer external exposure from DNS, sockets, process discovery, or live
  ingress inspection.
- Do not let an explicit `true` override known external routing.
- Do not change API-key scopes, dashboard session lifetime, cookie properties,
  bind controls, `/status` observability, or route ownership.
- Do not mutate the user's active config, restart services, change ingress, run
  browsers/providers, or perform live key operations in this provider-free slice.

## Acceptance Criteria

- [x] The config schema accepts `api.auth.trustedLocalOperatorDashboard` only as
      a boolean.
- [x] `false` disables trusted-local dashboard authority on an otherwise eligible
      loopback server.
- [x] Public dashboard URL, external base URL, and external hostname configuration
      each force trusted-local authority off, including when the switch is true.
- [x] Omitted/true configuration retains the direct loopback default only when no
      external routing evidence is configured.
- [x] `/status.auth` and startup posture expose the resolved non-secret reason.
- [x] Disabled trusted-local requests receive 401, while bearer and secure-session
      authorization remain compatible.
- [x] Current configuration and API documentation explain the fail-closed
      precedence and out-of-band proxy requirement.
- [x] Focused config/auth/session tests, provider-disabled tests, typecheck,
      zero-warning lint, builds, plan audit, CodeGraph sync, and diff hygiene pass.

## Definition Of Done

The plan closes when trusted-local dashboard authority is explicitly controllable,
known external routing always disables it, direct loopback behavior remains
compatible in the absence of external evidence, the resolved posture is visible,
and broad provider-free validation passes.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; schema, policy resolution, status projection, and tests
  share one security contract and remain serialized
- expected_write_surface: API config schema, HTTP auth posture, focused tests,
  and current operator/planning documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or the authority path remains
  fail-closed with one exact blocker recorded

## Execution Evidence

- `ApiServerConfigSchema` accepts only a boolean
  `api.auth.trustedLocalOperatorDashboard`; invalid string, numeric, and null
  values fail schema validation.
- Runtime policy defaults the switch on for backward-compatible direct
  loopback use, but resolves it off for explicit false, non-loopback binding,
  disabled API auth, or any configured public dashboard URL, external base URL,
  or external hostname. External routing outranks an explicit true.
- `/status.auth.trustedLocalOperatorDashboardReason` and startup posture report
  `enabled`, `auth_disabled`, `config_disabled`, `external_routing`, or
  `non_loopback_bind` without exposing key metadata.
- Real server requests prove same-origin dashboard headers receive 401 after
  config/external disablement, while the same server continues to accept a
  valid bearer key and an HTTPS-exchanged secure dashboard session.
- Nine focused files passed 268 tests. The complete provider-disabled suite ran
  in an isolated temporary AuraCall home and passed 2,948 tests with 65
  expected skips and zero failures across 348 test files. Typecheck,
  zero-warning lint across 846 files, production build, 324-plan audit with zero
  errors, current CodeGraph sync, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all trusted-local dashboard configuration criteria accepted
- progress_classification: blocker_reduction
- evidence: fail-closed external-routing precedence plus full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the configurable authority baseline
