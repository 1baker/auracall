# Agent-Browser Broker Authority | 0284-2026-08-14

State: OPEN
Lane: P01

## Stable Objective

Make AuraCall useful as a durable provider bridge without duplicating the
browser infrastructure already owned by agent-browser. In required mode,
agent-browser owns profile selection, browser lifecycle, the retained target,
and its service tab handle; AuraCall owns provider-specific prompt workflow,
response capture, artifacts, and durable run semantics.

## Current State

- Current upstream Plan 0281 can delegate a remote-headed process to
  agent-browser, but AuraCall then rediscovers the browser through raw CDP.
- The installed RDP/Guacamole lane is blocked on its workstation payload and
  privileged helper, while the retained `chatgpt-pro` browser and exact
  ChatGPT target are healthy through the agent-browser service plane.
- The preserved pre-reconciliation branch proved a broker-first bridge against
  that retained target. This plan ports the smallest still-relevant contract
  onto current upstream rather than rebasing the obsolete 436-commit branch.

## Architecture Boundary

- agent-browser owns access planning, profile leases, browser/session
  lifecycle, service tab handles, policy-gated CDP attachment, and operator
  viewing infrastructure.
- AuraCall owns provider adapters, model/tool selection, prompt commitment,
  response completion detection, output shaping, artifacts, and durable runs.
- RDP/Guacamole is an optional operator-view capability. It is not a
  prerequisite for AuraCall to reuse a healthy broker-owned browser.
- Required bridge mode must never fall back to AuraCall's local Chrome launch
  or generic target discovery.

## Scope

- Resolve agent-browser's access plan before local Chrome acquisition.
- Reuse or request one exact broker-owned tab and retain its
  `serviceTabHandle`.
- Attach only to that target and carry broker identity in runtime metadata.
- Verify `cdp_detach` on every exit while preserving the browser and tab.
- Keep the existing Plan 0281 remote-view launcher as an optional configured
  lane for operators who need Guacamole/RDP visibility.

## Non-Goals

- Moving provider-specific DOM selectors or prompt logic into agent-browser.
- Requiring RDP/Guacamole before broker-owned provider execution can work.
- Replaying or submitting a live provider prompt during provider-free work.
- Publishing this branch without an explicitly selected GitHub destination.

## Acceptance Criteria

- [x] The broker bridge source and focused tests are ported onto current main.
- [x] Required ChatGPT and Grok paths acquire the broker before any local
  Chrome path and use its exact retained target id.
- [x] Runtime hints retain broker route, browser, profile, session, and tab
  handle identity.
- [x] Cleanup verifies broker detach and does not close the retained target.
- [x] Existing RDP launcher and focused browser tests remain green.
- [ ] The installed AuraCall runtime uses required mode and completes one
  bounded retained-target response without creating a duplicate browser or
  conversation.

## Definition Of Done

The plan closes when source and installed runtime prove that one AuraCall
request can use the exact broker-owned retained target, complete and read the
provider response, detach cleanly, and leave one healthy reusable browser/tab
lane, with no AuraCall-owned duplicate Chrome process.
