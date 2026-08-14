# Broker-Authoritative Restart Recovery | 0285-2026-08-14

State: CLOSED
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
  audit pass. Installed response `resp_5ff8161469f64a61bf12107c2616ad15`
  survived a forced API-process restart and completed on the same retained
  target with exact output `RESTART_RECOVERY_PASS`.

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
- [x] One installed durable response survives an AuraCall service stop/restart,
  completes on the same response id and retained target, and releases its lease
  without creating a duplicate browser or prompt.

## Installed Acceptance

- The installed bridge and configured-executor hashes matched the built source.
- Response `resp_5ff8161469f64a61bf12107c2616ad15` submitted once on target
  `3FB398F218E264183A2AD81750AB9791`. After the AuraCall API main process was
  killed and restarted, recovery logged a broker reattach for that exact target
  and did not log legacy Chrome discovery, relay startup, or browser launch.
- The same response id completed with exact output `RESTART_RECOVERY_PASS`,
  runtime state `terminal`, and lease state `released`.
- Agent-browser retained one ready `chatgpt-pro` browser process and one valid
  ChatGPT tab. Its job history records successful `cdp_attach` for
  `chatgpt-restart-recovery` followed by successful `cdp_detach`.
- Installation also exposed two service reproducibility defects. Generated user
  wrappers now pin the installer's Node 22 executable, and the generated API
  unit now pins port 18095 instead of selecting a random port inconsistent with
  its dotenv URLs and log name.

## Definition Of Done

Complete. The installed runtime proves that stopping and restarting AuraCall during one
in-flight ChatGPT response resumes the original broker-owned provider turn and
returns its result through the same durable response id. Agent-browser retains
one healthy browser lane, and logs contain no legacy Chrome discovery or prompt
replay.
