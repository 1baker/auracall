# Dashboard Session Readiness | 0324-2026-08-15

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Make secure dashboard login readiness explicit so external-routing hardening
cannot silently leave operators with no usable unscoped credential path.

## Current State

- Trusted-local dashboard authority now resolves off for known external routing
  and explicit config disablement.
- Secure dashboard login accepts only an unscoped operator API key.
- `/status.auth` reports total key count and whether any scoped keys exist, but
  cannot distinguish scoped-only key sets from an available operator key.
- Startup can therefore report authentication enabled while every dashboard
  login attempt is guaranteed to fail.
- Both dashboard login gates still prompt for a key even when the server knows
  no loaded key can establish a session.

## Scope

- Project the non-secret count of loaded unscoped operator keys.
- Project whether a dashboard session is required and whether session login is
  ready from the exact resolved auth policy.
- Warn at startup when a session is required but no unscoped operator key is
  loaded; report ready posture when the required credential path exists.
- Include non-secret login readiness in the dashboard-session status response.
- Make both React and built-in debug dashboard gates show a configuration
  explanation and disable credential submission when login is not ready.
- Preserve valid bearer, trusted-local, scoped execution-key, and secure-session
  behavior without exposing key ids, secrets, or scope contents.
- Update focused regressions and current operator documentation.

## Non-Goals

- Do not create, rotate, persist, reveal, or infer API keys.
- Do not make scoped execution keys valid operator credentials.
- Do not change session lifetime, cookie attributes, origin checks, external
  routing precedence, bind controls, or `/status` observability.
- Do not add a new endpoint or config field.
- Do not mutate active configuration, restart services, change ingress, or run
  browsers/providers in this provider-free slice.

## Acceptance Criteria

- [x] `/status.auth` exposes total unscoped operator-key count,
      `dashboardSessionRequired`, and `dashboardSessionReady` without secret or
      key-identity metadata.
- [x] Session readiness is false when auth is disabled or no unscoped key is
      loaded, and true when at least one unscoped key can establish a session.
- [x] Session-required posture is true only when API auth is required and
      trusted-local dashboard authority is unavailable.
- [x] Startup warns when sessions are required but unavailable and reports
      readiness when the required unscoped-key path exists.
- [x] Dashboard-session status includes non-secret `loginReady` consistently
      across unauthenticated, trusted-local, auth-disabled, session, and logout
      responses.
- [x] React and debug dashboards disable login and explain the missing unscoped
      operator key instead of soliciting a credential that cannot work.
- [x] Existing valid bearer, trusted-local, scoped-key rejection, session
      establishment, expiry, and logout behavior remain compatible.
- [x] Focused auth/session/UI tests, provider-disabled tests, typecheck,
      zero-warning lint, builds, plan audit, CodeGraph sync, and diff hygiene pass.

## Definition Of Done

The plan closes when operators can determine before submission whether secure
dashboard login is required and possible, locked-out configurations produce an
actionable warning in server and browser surfaces, no key metadata is exposed,
and broad provider-free validation passes.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; auth projection, session response shape, and both UI
  gates share one readiness contract and remain serialized
- expected_write_surface: HTTP auth/session posture, React/debug dashboard gates,
  focused tests, and current operator/planning documentation
- max_work_unit_attempts: 2
- max_review_rework_cycles: 1
- terminal_condition: all acceptance criteria pass or readiness remains
  fail-closed with one exact blocker recorded

## Execution Evidence

- `/status.auth` now projects `operatorKeyCount`,
  `dashboardSessionRequired`, and `dashboardSessionReady` from the resolved
  auth policy without key identity or scope contents.
- Dashboard-session GET, successful login, and logout responses project
  `loginReady`; scoped-only external routing reports false and continues to
  reject scoped login credentials.
- Startup, React, and debug-dashboard surfaces explain required-but-unready
  posture and prevent a credential submission that cannot succeed.
- The focused server/session/UI/status/doc suite passed 257 tests across eight
  files. The isolated provider-disabled suite passed 2,949 tests with 65
  expected skips across 348 files.
- Typecheck, zero-warning lint across 846 files, production build, the 325-plan
  audit, current CodeGraph sync and affected-test analysis, and diff hygiene
  passed.

## Closeout

Plan 0324 closes accepted. Secure dashboard readiness is now observable before
credential submission, and scoped-only or empty key sets fail closed with an
actionable operator explanation. No active config, service, ingress, browser,
provider, or key state was changed.
