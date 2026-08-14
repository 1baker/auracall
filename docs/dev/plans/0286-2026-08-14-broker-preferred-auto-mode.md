# Broker-Preferred Auto Mode | 0286-2026-08-14

State: CLOSED
Lane: P01

## Stable Objective

Make AuraCall's default browser mode prefer agent-browser whenever its service
control plane is available, without breaking compatibility on hosts where the
broker is not installed and without allowing a post-authority fallback to
launch a second browser or replay provider work.

## Current State

- `AURACALL_AGENT_BROWSER_BRIDGE` defaults to `auto`, but `auto` currently
  bypasses agent-browser completely and enters AuraCall's legacy browser path.
- Installed required mode and restart recovery are accepted, including exact
  retained-target reuse, broker detach, and fail-closed recovery.
- The missing usability step is to make the default actually broker-preferred
  while preserving an explicit compatibility boundary.
- Provider-free validation and installed no-prompt acceptance now pass. With
  the bridge variable unset, the installed module resolved `auto`, attached to
  the existing `chatgpt-pro` target, and verified detach without changing the
  browser inventory.

## Architecture Boundary

- `off` always selects AuraCall's compatibility browser path.
- `auto` may fall back only when no healthy agent-browser service route accepts
  the request and no access plan has established broker authority.
- Once an access plan resolves, `auto` is fail-closed: tab acquisition, launch,
  exact-target validation, or CDP attach failure must not downgrade to local
  Chrome.
- `required` remains fail-closed for every broker discovery or execution
  failure.

## Scope

- Execute broker acquisition for both `auto` and `required` ChatGPT/Grok runs.
- Return `null` from `auto` only for pre-authority broker unavailability.
- Preserve a distinct, actionable post-authority error for `auto` failures.
- Cover successful auto acquisition, pre-authority fallback, post-authority
  fail-close, and explicit `off` behavior.
- Update user-facing default-mode documentation and durable governance records.

## Non-Goals

- Removing AuraCall's compatibility browser implementation.
- Changing Gemini routing.
- Making RDP/Guacamole a prerequisite for broker reuse.
- Submitting a provider prompt during provider-free validation.

## Acceptance Criteria

- [x] Default `auto` mode acquires and uses an available broker-owned exact tab.
- [x] `auto` returns compatibility control only before broker authority exists.
- [x] `auto` fails closed after a broker access plan resolves.
- [x] `required` and `off` retain their existing contracts.
- [x] Focused tests, typecheck, lint, production build, diff hygiene, and plan
  audit pass.
- [x] Installed no-prompt acceptance proves default `auto` attaches to and
  detaches from the retained ChatGPT target without opening another browser.

## Installed Acceptance

- Built and installed bridge hashes match at
  `bc07cf9926fc94bf8d6d6743127bfbbe28c408cac9d66428fe2d0ffff8da2411`;
  top-level browser-runner hashes match at
  `8e8f28827f6e0c982816caeb8241a3b692297fc51384339f9cc63dffe90ad1ad`.
- A one-shot installed probe preserved the configured ChatGPT broker profile
  and URL but explicitly unset `AURACALL_AGENT_BROWSER_BRIDGE`. Resolution
  returned `auto` and attached to browser
  `session:auracall-chatgpt-broker-v7`, PID 184301, profile `chatgpt-pro`, and
  target `3FB398F218E264183A2AD81750AB9791`.
- The probe returned detach state `detached`; agent-browser recorded successful
  `cdp_attach` and `cdp_detach` jobs. The complete ready-browser id/PID/target
  set was unchanged before and after the probe, so no browser or tab was added.
- The reinstalled AuraCall API service is active/running on 127.0.0.1:18095
  with zero restarts.

## Definition Of Done

Complete. With no bridge environment override, a healthy agent-browser installation is
AuraCall's first browser authority. Compatibility fallback remains available
only when the broker never accepts authority, and every post-plan failure is
fail-closed.
