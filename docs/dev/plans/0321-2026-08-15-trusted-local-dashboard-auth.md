# Trusted Local Dashboard Authorization | 0321-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Replace the built-in dashboard's spoofable header-only API-key bypass with an
explicit trusted-local authorization boundary while preserving the current
no-key workflow for loopback-bound dashboards and trusted local ingress.

## Current State

- API auth grants an operator-superuser context whenever client-controlled
  `Host` plus `Origin` or dashboard `Referer` values appear same-origin.
- A non-loopback client can forge those headers and access protected `/v1/*`
  routes without a configured key.
- The no-key dashboard behavior is intentional and used through the local
  `auracall.localhost` ingress, so removing it without a replacement would
  break the current operator console and embedded dashboards.
- `/status.auth` and startup logging do not disclose that this operator
  exception exists.

## Scope

- Require the server to be loopback-bound and the TCP peer to be loopback
  before same-origin dashboard context can receive local operator authority.
- Keep `Host` plus `Origin`/dashboard `Referer` checks as browser-context
  constraints, never as the trust root.
- Require API-key authorization on every non-loopback bind even when clients
  forge same-origin dashboard headers.
- Advertise the trusted-local dashboard exception in the non-secret auth status
  and startup posture.
- Add regressions for loopback dashboard access, cross-origin rejection,
  non-loopback header forgery, valid-key access, IPv4-mapped loopback peers, and
  malformed/missing peer addresses where practical.
- Correct current operator documentation to distinguish trusted-local dashboard
  authority from API-key authorization.

## Non-Goals

- Do not add a browser-entered key field, session cookie, new auth endpoint, or
  persistent frontend secret storage.
- Do not trust `Forwarded` or `X-Forwarded-For` as client transport authority.
- Do not change bearer/key parsing, scope enforcement, `/status` observability,
  bind defaults, or `--listen-public` authorization.
- Do not run live providers, browsers, service restarts, public ingress, or key
  mutations.

## Acceptance Criteria

- [x] Client-controlled same-origin headers alone cannot bypass auth on a
      non-loopback-bound server.
- [x] Trusted-local dashboard authority requires both a loopback bind and a
      loopback TCP peer in addition to existing browser-context checks.
- [x] The current loopback/`auracall.localhost` dashboard workflow remains
      compatible without browser-stored API keys.
- [x] Valid API keys continue to authorize protected routes on every bind.
- [x] `/status.auth` and startup logging disclose whether trusted-local
      dashboard authority is active without exposing secrets.
- [x] Current docs distinguish direct/non-loopback key requirements from the
      trusted-local dashboard exception and local-ingress responsibility.
- [x] Focused tests, full provider-disabled tests, typecheck, zero-warning lint,
      build, plan audit, and diff hygiene pass.

## Definition Of Done

The plan closes when dashboard superuser authority is rooted in verified local
transport rather than forgeable headers, non-loopback bypass attempts fail,
the local dashboard remains usable, operator posture is explicit, and broad
validation passes without live effects.

## Execution Evidence

- `ApiAuthRuntimeStatus.trustedLocalOperatorDashboard` is true only when auth is
  required and the server is loopback-bound. `/status.auth` and startup logging
  expose that non-secret decision explicitly.
- Dashboard operator authorization now joins three independent conditions:
  resolved trusted-local eligibility, an actual loopback TCP peer, and existing
  same-origin `Origin` or dashboard `Referer` context. `Forwarded` and
  `X-Forwarded-For` never participate.
- Loopback classification uses Node network parsing plus explicit IPv4 `127/8`
  and IPv6 `::1` authority, including IPv4-mapped IPv6 forms. Missing,
  malformed, private-LAN, documentation-range, and mapped non-loopback peers
  fail closed.
- Existing server integration proves trusted loopback dashboard `Origin` and
  `Referer` access still succeeds, while absent, cross-origin, and same-origin
  non-dashboard contexts receive 401; valid bearer access remains green.
- Two focused files passed 234 tests. The complete isolated provider-disabled
  suite passed 2,937 tests with 65 expected skips and zero failures across all
  840 suites. One unrelated lease-heartbeat timing assertion failed on the
  first loaded run, passed in isolation, and did not recur in the bounded full
  rerun. Typecheck, zero-warning lint across 843 files, production build,
  322-plan audit with zero errors, and diff hygiene passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all trusted-local dashboard authorization criteria accepted
- progress_classification: blocker_reduction
- evidence: transport-backed authorization predicates plus focused and full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the trusted-local authorization baseline
