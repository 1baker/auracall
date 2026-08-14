# Broker-Authoritative Restart Recovery | 0285-2026-08-14

State: OPEN
Lane: P01

## Stable Objective

Keep an in-flight durable ChatGPT response recoverable across an AuraCall
service restart without replaying the prompt, rediscovering Chrome, launching a
second browser, or bypassing agent-browser's service-tab authority.

## Current State

- Plan 0284 proved ordinary broker-owned execution and clean detach on the
  installed runtime.
- A deliberate AuraCall restart during a later in-flight response recovered the
  durable step but entered the legacy Chrome discovery/new-Chrome reattach path.
- Provider-free implementation now carries broker route, browser process,
  browser profile, session, and exact `serviceTabHandle` through every durable
  runtime heartbeat. Recovered execution re-authorizes that exact retained
  handle through agent-browser before AuraCall resumes provider response
  polling.
- Focused tests, typecheck, lint, build, diff hygiene, and the plan-library
  audit pass. Installed stop/restart recovery remains the closing gate.

## Architecture Boundary

- agent-browser remains the sole authority for browser/profile/session/tab
  lifecycle and policy-gated CDP attachment.
- AuraCall persists the broker provenance needed to resume provider-specific
  response completion and extraction.
- Broker-tagged recovery fails closed if provenance is incomplete or the exact
  retained target is absent. It must never downgrade to legacy Chrome
  discovery.

## Scope

- Persist broker provenance on runtime hints and passive response evidence.
- Re-resolve the live agent-browser service route after restart.
- Validate the saved browser, browser profile, session, and target identity
  against one live valid service-tab handle.
- Request a fresh policy-gated `cdp_attach`, resume the existing provider turn,
  and verify `cdp_detach` after completion.
- Prove installed stop/restart recovery on one durable response id.

## Non-Goals

- Replaying a submitted prompt or opening a replacement conversation.
- Launching or rediscovering Chrome for broker-tagged runs.
- Making Guacamole/RDP a prerequisite for restart recovery.
- Publishing the branch without an explicitly selected GitHub destination.

## Acceptance Criteria

- [x] Durable browser evidence retains broker route, browser/process, browser
  profile, session, and exact service-tab-handle provenance.
- [x] Recovery reattaches only through the saved broker identity and a current
  agent-browser service route.
- [x] Missing or ambiguous retained targets fail closed without prompt replay or
  local Chrome launch.
- [x] Focused recovery/bridge coverage, typecheck, lint, production build, diff
  hygiene, and plan audit pass provider-free.
- [ ] One installed durable response survives an AuraCall service stop/restart,
  completes on the same response id and retained target, and releases its lease
  without creating a duplicate browser or prompt.

## Definition Of Done

The installed runtime proves that stopping and restarting AuraCall during one
in-flight ChatGPT response resumes the original broker-owned provider turn and
returns its result through the same durable response id. Agent-browser retains
one healthy browser lane, and logs contain no legacy Chrome discovery or prompt
replay.
