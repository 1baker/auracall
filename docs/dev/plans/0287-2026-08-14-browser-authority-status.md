# Browser Authority Status | 0287-2026-08-14

State: CLOSED
Lane: P01

## Stable Objective

Make every durable ChatGPT/Grok browser run report which browser authority was
selected—agent-browser, pre-authority compatibility fallback, or explicit
broker-off—through existing response and generic run-status surfaces without
performing browser work during readback.

## Current State

- Plan 0286 makes default `auto` genuinely broker-preferred and logs a safe
  pre-authority fallback, but operators must inspect process logs to learn the
  selected route.
- Runtime evidence already persists bounded browser details and existing
  response readback summarizes that evidence.
- Generic `run status` currently drops the runtime diagnostics summary, and its
  human formatter has no browser-authority line.

## Architecture Boundary

- Authority is execution evidence, not a live status probe. Status readback
  must remain provider/browser-free.
- Persist only bounded mode/decision labels; do not expose access-plan payloads,
  credentials, prompts, or raw service-tab handles in status summaries.
- Authority summary must scan durable evidence independently of the newest
  provider heartbeat so later DOM observations cannot erase the routing fact.

## Scope

- Persist `browserAuthority` and `agentBrowserBridgeMode` on broker, safe auto
  fallback, and explicit-off runtime hints.
- Project a bounded `browserAuthoritySummary` in response runtime diagnostics.
- Preserve runtime diagnostics in generic response run status.
- Render browser authority and bridge mode in human `auracall run status`.
- Cover field allowlisting, older-heartbeat recovery, generic JSON parity, and
  human formatting provider-free.

## Non-Goals

- Adding a new endpoint or performing an agent-browser health request during
  status readback.
- Changing bridge routing, fallback, or recovery behavior.
- Adding authority reporting to Gemini or non-browser transports.
- Submitting a live provider prompt.

## Acceptance Criteria

- [x] Broker, compatibility-fallback, and explicit-off decisions emit bounded
  durable authority evidence.
- [x] Response diagnostics recover the latest authority evidence even when a
  newer provider heartbeat omits authority fields.
- [x] Generic `run status --json` preserves the diagnostics summary.
- [x] Human run status renders authority plus bridge mode when available and
  remains unchanged when absent.
- [x] Focused tests, typecheck, lint, production build, diff
  hygiene, and plan audit pass.
- [x] Installed provider-free readback proves an existing broker-backed run
  exposes authority without browser mutation.

## Definition Of Done

An operator can inspect one existing durable run and immediately distinguish
broker authority, safe compatibility fallback, and explicit off from persisted
status evidence alone.

## Installed Acceptance

- Source and installed SHA-256 hashes matched for `runtime/apiModel.js`,
  `runStatus.js`, and `cli/runStatusCommand.js`.
- Installed JSON readback of existing response
  `resp_5ff8161469f64a61bf12107c2616ad15` projected
  `browserAuthority: agent-browser` from legacy broker provenance; human output
  printed `Browser authority: agent-browser`.
- Readback added no navigation, prompt, or provider job. Only explicit
  `service_jobs`/`service_browsers` inventory reads appeared; retained browser
  PID `184301` and valid target `3FB398F218E264183A2AD81750AB9791`
  remained unchanged.
- The installed API is active/running on `127.0.0.1:18095` with zero restarts.

Complete.
