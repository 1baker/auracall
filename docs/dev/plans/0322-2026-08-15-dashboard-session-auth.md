# Dashboard Session Authorization | 0322-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Give non-loopback operator dashboards first-class authenticated access without
persisting long-lived API keys in browser storage, while preserving the trusted
loopback workflow established by Plan 0321.

## Current State

- Loopback-bound dashboards receive trusted-local operator authority only when
  the TCP peer is loopback and the browser context is same-origin.
- Every non-loopback dashboard request requires a bearer API key, but the
  current React and debug dashboards have no safe browser authentication flow.
- The historical dashboard key prompt stored the long-lived key in
  `sessionStorage`; it was intentionally removed and must not be restored.
- API auth and the static route manifest already provide one server-owned
  request boundary suitable for a bounded session exchange.
- `POST /status` performs operator mutations but currently falls outside the
  `/v1/*` authentication boundary used by the dashboards.

## Scope

- Add one manifest-backed `/v1/dashboard/session` contract for session status,
  login, and logout.
- Exchange a valid unscoped operator API key for a random, short-lived,
  server-memory session whose browser token exists only in an `HttpOnly`,
  `Secure`, `SameSite=Strict`, host-only cookie.
- Apply absolute expiry, server-side revocation, constant-shape non-secret
  status responses, and same-origin checks for session mutation and all unsafe
  session-authorized requests.
- Protect manifest-owned `POST /status` with the same API/session boundary
  while keeping `GET /status` observable.
- Keep bearer clients and trusted-local dashboard authorization unchanged.
- Add a no-storage login/logout gate to the React operator dashboard and the
  built-in debug dashboard; never write the API key or session token to Web
  Storage, URLs, logs, or response bodies.
- Document TLS, unscoped-key, expiry, restart, and reverse-proxy behavior.

## Non-Goals

- Do not persist dashboard sessions across API restarts or share them across
  processes.
- Do not add password, OAuth, refresh-token, user-account, or multi-tenant
  identity systems.
- Do not accept scoped execution keys as operator-dashboard credentials.
- Do not trust `Forwarded` or `X-Forwarded-*` headers as authentication or
  transport authority.
- Do not weaken `Secure`, `HttpOnly`, `SameSite=Strict`, origin, loopback, API
  scope, bind, or `--listen-public` controls.
- Do not run providers, browsers, service restarts, public ingress, or key
  mutation in this provider-free slice.

## Acceptance Criteria

- [x] A valid unscoped operator key can establish a 15-minute in-memory
      dashboard session without appearing in browser storage or the response.
- [x] The session cookie is host-only, `HttpOnly`, `Secure`,
      `SameSite=Strict`, uses `Path=/`, and has a bounded `Max-Age`.
- [x] Valid session cookies authorize protected `/v1/*` requests; expired,
      unknown, revoked, malformed, and scoped-key attempts fail closed.
- [x] Unsafe cookie-authorized requests require a same-origin browser origin;
      cross-origin and missing-origin mutation attempts fail closed.
- [x] `POST /status` requires bearer, trusted-local, or secure-session
      authority when API auth is enabled; `GET /status` remains observable.
- [x] Login is available only from a same-origin dashboard context over HTTPS;
      loopback HTTP continues through trusted-local authority without a key.
- [x] React and debug dashboards provide login/logout without Web Storage,
      URL, log, or response-body secret persistence.
- [x] Bearer clients, `/status` observability, trusted-local authorization, and
      API-key scope enforcement retain their existing behavior.
- [x] Route-manifest contracts, focused backend/UI tests, provider-disabled
      tests, typecheck, zero-warning lint, builds, plan audit, CodeGraph sync,
      and diff hygiene pass.

## Definition Of Done

The plan closes when both built-in operator dashboards can securely exchange an
unscoped API key for a bounded server-owned cookie session on HTTPS ingress,
session use and revocation are fail-closed and tested, long-lived browser secret
storage remains absent, existing bearer/local authorization stays compatible,
and broad provider-free validation passes.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; auth storage, request authorization, endpoint routing,
  and UI gating are serialized because they share one security boundary
- expected_write_surface: route manifest, HTTP auth/session module and server,
  React/debug dashboard UI, focused tests, and current operator/planning docs
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or one exact security/runtime
  blocker is recorded with the session endpoint left fail-closed

## Execution Evidence

- Added a digest-keyed in-memory session store with 256-bit random tokens,
  absolute 15-minute expiry, explicit revocation, restart invalidation, and
  exact-one cookie parsing. Only the token digest is retained server-side.
- The manifest-backed session endpoint returns non-secret status, accepts only
  unscoped bearer keys from same-origin HTTPS dashboard contexts, and emits a
  host-only `__Host-auracall-dashboard` cookie with `Path=/`, `Max-Age=900`,
  `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Session cookies authorize protected reads. Every unsafe cookie-authorized
  request requires same-origin `Origin`; missing and cross-origin mutations
  fail closed. Logout applies the same transport check and revokes server state.
- Exact manifest-owned `POST /status` now shares the bearer, trusted-local, and
  session boundary while `GET /status` remains observable. The local provider
  guard CLI retries with configured API auth, preserving authenticated use.
- React and built-in debug dashboards clear the submitted key immediately,
  never place credentials in Web Storage, URLs, logs, or response bodies, poll
  absolute expiry, and expose explicit logout. The generated debug script is
  syntax-checked in its regression test.
- Seven focused files passed 243 tests. The complete provider-disabled suite
  passed 2,946 tests with 65 expected skips and zero failures across 348 test
  files. Typecheck, zero-warning lint across 846 files, production build,
  323-plan audit with zero errors, current CodeGraph sync, and diff hygiene
  passed.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all dashboard session authorization criteria accepted
- progress_classification: blocker_reduction
- evidence: fail-closed session exchange plus focused and full-suite validation
- material_blockers: none
- next_action_or_stop_reason: publish the secure dashboard session baseline
