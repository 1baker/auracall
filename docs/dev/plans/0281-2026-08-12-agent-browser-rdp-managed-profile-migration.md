# Agent-Browser RDP Managed-Profile Migration | 0281-2026-08-12

State: OPEN
Lane: P01

## Stable Objective

Move AuraCall browser processes off the ambient WSL desktop and into
agent-browser-owned remote-headed Guacamole/RDP routes while AuraCall retains
ownership of every managed browser profile directory and its authentication
state.

## Current State

- AuraCall currently launches Chrome directly from
  `src/browser/service/browserService.ts` through the shared browser-service
  manual-login launcher.
- Managed browser profiles are derived under
  `~/.auracall/browser-profiles/<browser-profile>/<service>` and remain the
  canonical profile storage authority.
- The current configured browser profiles include stock Google Chrome families
  and one `gemini-stealthcdp` Chromium family.
- agent-browser already supports:
  - external BYOP profile registration;
  - exact custom profile paths paired with runtime-profile identity;
  - remote-headed `rdp_gateway` route allocation;
  - Guacamole operator-visible proof;
  - strict runtime-profile browser-family validation;
  - `stock_chrome` and `stealthcdp_chromium` build selection.
- Current installed-runtime preflight is not activation-ready:
  `agent-browser install doctor --json` reports workspace-binary drift,
  duplicate-profile pressure, and a partial or drifted workstation payload.
  A no-launch RDP dry run also reports no available route-pool entry.

## Architecture Decision

- AuraCall owns profile bytes, profile naming, service binding, and browser
  operation semantics.
- agent-browser owns the headed browser process, remote display, RDP/Guacamole
  route, and durable operator handoff.
- AuraCall passes the exact managed browser profile directory to agent-browser;
  it does not copy or relocate the profile into `~/.agent-browser`.
- AuraCall attaches to the CDP endpoint published by the agent-browser-owned
  session after `operatorVisible.state=ready` and exact build proof succeed.
- A routed browser is persistent and reusable. AuraCall does not use native
  window hiding or headless mode for this lane.
- Compatibility is closed-world:
  - `browserFamily=chrome` requires `browserBuild=stock_chrome` and a Chrome
    executable;
  - `browserFamily=chromium` requires
    `browserBuild=stealthcdp_chromium` and a Chromium executable;
  - unknown, missing, or mixed families stop before invoking agent-browser;
  - `AGENT_BROWSER_ALLOW_PROFILE_BROWSER_MISMATCH` is never set by AuraCall.

## Scope

### Slice A | Provider-Free Contract And Launcher

- Add explicit browser-profile family/build fields and a bounded
  `agentBrowserRdp` launcher block.
- Resolve those fields through the existing typed browser-profile seam.
- Build deterministic no-shell agent-browser commands using the exact AuraCall
  managed profile path.
- Require exact family/build/executable agreement before any child process.
- Require remote-view opened state, operator-visible readiness, and matching
  browser-build proof before accepting the lane.
- Read the exact agent-browser browser record to recover the CDP endpoint, then
  return that endpoint through the existing BrowserService dependency seam.
- Cover Chrome and Chromium success paths plus every fail-closed boundary with
  provider-free tests.

### Slice B | Registration And Operator Migration

- Register each durable AuraCall service profile as agent-browser
  `external_byop`, with the exact AuraCall user-data directory, family, build,
  service identity, and reviewed compatibility evidence.
- Create or reconcile agent-browser runtime-profile identities with matching
  `browserFamily` values while keeping their launch path bound to the exact
  AuraCall directory.
- Add a no-launch inventory command or script that reports planned profile
  mappings and refuses duplicate or incompatible records.

### Slice C | Installed Activation

- Converge the installed agent-browser binary, workstation payload, remote-view
  doctor, and available route pool before launching any AuraCall browser.
- Activate one noncritical exact profile first.
- Require one process, exact profile path, exact build proof, responsive CDP,
  `operatorVisible.state=ready`, durable handoff URL, and clean duplicate-lane
  evidence.
- Activate remaining profiles serially only after the prior profile passes.
- Preserve the pre-migration profile directories and a reversible native-launch
  config until all lanes pass.

## Non-Goals

- Copying, converting, or deleting AuraCall managed browser profiles.
- Reusing a Chrome profile with Chromium or a Chromium profile with Chrome.
- Enabling the unsafe agent-browser family-mismatch override.
- Launching a live provider browser during the provider-free slice.
- Restarting agent-browser, AuraCall, Guacamole, RDP, or scheduler/completion
  services without a separate activation checkpoint.
- Changing Chat/Work, model-selection, provider adapter, scheduler, completion,
  or materialization semantics.

## Acceptance Criteria

- [x] Browser-profile configuration names family, build, and the agent-browser
  RDP launcher explicitly.
- [x] The resolved launch profile preserves those fields without ambiguous
  fallback.
- [x] Chrome and Chromium mappings produce the correct agent-browser commands
  with the exact AuraCall user-data directory.
- [x] Family/build/executable mismatch fails before agent-browser is invoked.
- [x] Remote-view, operator-visible, build-proof, and CDP-record mismatch fail
  closed.
- [x] Native AuraCall launch remains unchanged when the new launcher is absent.
- [x] Provider-free tests, typecheck, scoped lint, build, CodeGraph readback,
  diff hygiene, and planning audits pass.
- [ ] Installed activation proves exact ownership, visibility, reuse, and
  rollback for every migrated browser profile.

## Effect Boundary

Slice A may change repository source, tests, and docs and may run no-launch
agent-browser discovery or dry-run commands. It may not launch or attach to a
provider browser, mutate runtime profile/service records, install binaries,
restart services, or alter scheduler/completion/materialization controls.

## Definition Of Done

The plan closes only when every enabled AuraCall browser profile runs as one
agent-browser-owned remote-headed process on a healthy Guacamole/RDP route,
uses the exact original AuraCall managed browser profile directory, proves the
correct Chrome or Chromium build, remains CDP-usable by AuraCall, and has a
tested rollback to the native launcher without profile conversion.

## Checkpoint 1 | Provider-Free Migration Opened

- Current source and installed-runtime evidence support the integration seam
  without an agent-browser source change.
- The existing agent-browser runtime-profile guard is necessary but not
  sufficient because the retained AuraCall BYOP path must also be checked
  before invocation. AuraCall will add that first defense and keep the
  agent-browser guard as the second defense.
- Installed activation is withheld until binary/workstation drift,
  duplicate-profile pressure, and route-pool availability are reconciled.

## Checkpoint 2 | Slice A Provider-Free Contract Accepted

- AuraCall now resolves explicit `browserFamily`, `browserBuild`, and
  `agentBrowserRdp` fields through the named browser-profile and flattened
  launch seams. Enabling the lane normalizes it to persistent headed operation.
- `BrowserService` selects the agent-browser launcher only for enabled profiles;
  the existing native launcher remains the default.
- The launcher uses no shell, passes the exact AuraCall managed browser profile
  path, requires the closed-world family/build mapping before invocation, and
  requires opened/operator-visible/build/executable proof plus one exact CDP
  inventory record before attachment.
- Provider-free evidence: 73 focused configuration/launcher tests and 20
  existing BrowserService tests pass; typecheck, scoped zero-warning Biome
  lint, production build, CodeGraph readback, diff check, plan-library audit,
  active planning audit, and goal audit pass.
- No live config, profile bytes, agent-browser records, browser process,
  installed binary, route, service, scheduler, completion, or materialization
  state changed. Slices B and C remain blocked on the recorded installed-runtime
  and route-pool readiness defects.
