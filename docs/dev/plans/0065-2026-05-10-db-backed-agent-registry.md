# DB-Backed Agent Registry

State: CLOSED
Date: 2026-05-10
Lane: P01
Plan version: 2

## Goal

Make a user-scoped database the normal mutable store for operational agents
and teams while retaining config-defined bootstrap entries, deterministic
merged discovery, scoped execution, and reviewable export/import.

## Closed State

- `createAgentRegistryStore(...)` owns enabled, revisioned agent/team records
  under `~/.auracall/registry/agents.sqlite`, with a schema-validating JSON
  fallback when `node:sqlite` is unavailable.
- `createEffectiveAgentCatalog(...)` merges config and registry records,
  filters disabled records, attaches source/revision metadata, and reports
  deterministic config-wins duplicate conflicts.
- API/MCP config mutations write registry records by default; config-defined
  overlay ids remain pinned and return explicit blocked results.
- `/v1/config/agents`, `/v1/config/teams`, `/v1/models`, CLI, MCP, stored-step
  execution, and team-run surfaces consume the effective merged projection.
- HTTP execution authorization resolves registry-backed agents and teams,
  including team-derived member access and service/runtime-profile scopes.
- Dedicated HTTP, MCP, CLI, and dashboard agent diagnostics expose duplicate,
  disabled-record, config-model, and scoped-key health without secrets.
- Versioned selected/all snapshot export and import are available through CLI,
  MCP, HTTP, and the dashboard; imports retain config-overlay blocking.
- Agent setup and API workflow clients use deterministic agent ids and scoped
  keys without rewriting large collections into `~/.auracall/config.json`.
- [Plan 0345](0345-2026-08-20-db-backed-agent-registry-reconciliation.md)
  independently proves the completed contract and closes this umbrella.

## Architecture Contract

- User runtime state belongs under `~/.auracall`; it is not portable repo state
  or a committed hot mutable store.
- `~/.auracall/config.json` remains bootstrap/source config for runtime and
  browser profiles, API service settings, and optional pinned/core agents.
- Config entries win duplicate ids. The conflict is visible, and registry
  mutation of that id is blocked rather than hidden behind the config overlay.
- Registry payloads are schema-validated at write and read boundaries.
- Reviewable snapshots are transfer/backup artifacts, not alternate live
  registry authority.

## Acceptance Criteria

- [x] Large agent/team collections can be created through API/MCP without
      rewriting `~/.auracall/config.json`.
- [x] Existing config-defined agents still resolve and execute.
- [x] `/v1/models` and `/v1/config/agents` expose the effective merged set.
- [x] Mutations retain revision and audit metadata.
- [x] Duplicate config/registry ids resolve deterministically and stay visible.
- [x] API-key scoping works against registry-backed agents and teams.
- [x] Operators can export selected agents/teams to reviewable snapshots
      without treating exports as the hot mutable store.
- [x] Workflow clients use deterministic agent ids and scoped keys without
      config-file collection rewrites.
- [x] Focused core/interface and HTTP tests, typecheck, governance/link tests,
      plan audit, portable-path scan, diff hygiene, and CodeGraph status pass.

## Deferred Enhancements

- Explicit `/v1/agents/{id}/revisions` browsing and rollback can build on the
  stored revision ledger in a separately selected plan.
- Advice for moving suitable pinned config entries into the registry is an
  operator migration enhancement, not a prerequisite for deterministic
  conflict visibility or safe registry mutations.
- Full dashboard record editing remains separate from the shipped diagnostics
  and snapshot controls.

## Historical Decisions Retained

- The migration landed read model first, then compatibility writes, execution
  and authorization integration, diagnostics, and export/import.
- The old checklist phrase “update config doctor” was superseded by the
  dedicated secret-free agent-diagnostics contract across CLI, MCP, HTTP, and
  dashboard surfaces.
- Config-defined agents were not removed during registry dogfooding.

## Definition Of Done

Plan 0065 is complete when the registry is the default mutable agent/team
store, config overlays remain compatible and visible, discovery/execution/auth
use one effective catalog, and selected records can be exported and imported
as reviewable snapshots. Plan 0345 proves those conditions without changing
runtime behavior.
