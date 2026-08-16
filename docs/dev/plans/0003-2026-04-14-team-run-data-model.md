# Team Run Data Model Plan | 0003-2026-04-14

State: CLOSED
Lane: P01
Plan version: 2

## Current State

- `src/teams/types.ts` and `src/teams/schema.ts` define and validate the logical
  `TeamRun`, step, handoff, shared-state, local-action, artifact, failure, and
  history vocabulary.
- `TeamRunBundle` groups one logical run, ordered steps, explicit handoffs,
  local-action requests, and shared state. Task-aware runs retain one
  `taskRunSpecId` and selected `teamId`.
- `createExecutionRunBundleFromTeamRun` projects the logical bundle into the
  runtime model without making queue, lease, runner, retry, or recovery state a
  reusable team concern.
- The runtime store persists complete execution bundles with revision checks;
  inspection and the review ledger reconstruct bounded durable evidence.
- The TypeScript blocks below are historical v1 sketches. Current source is
  authoritative where fields evolved, including `requestedBy`, step input/
  output envelopes, shared-state status/outputs/history, and local actions.
- Plan 0341 proved this implemented boundary and closes the parent design seam
  without changing runtime behavior.

# Team Run Data Model Plan

## Purpose

Define the stable logical data model for team execution independently from
assignment intent and runner/service operations.

This plan exists so later service/runners work can share one stable vocabulary
for:

- `teamRun`
- `step`
- `handoff`
- `sharedState`

It should be read together with:

- [0006-2026-04-14-team-config-boundary.md](0006-2026-04-14-team-config-boundary.md)
- [0004-2026-04-14-team-service-execution.md](0004-2026-04-14-team-service-execution.md)
- [0002-2026-04-14-task-run-spec.md](0002-2026-04-14-task-run-spec.md)

## Design goals

The first data model should optimize for:

- debuggability
- replayability
- explicit ownership
- serializability
- compatibility with future parallel execution

It should not optimize first for:

- minimal schema size
- speculative throughput
- hidden in-memory coordination

## Core entities

The original concrete vocabulary named four top-level entities:

1. `teamRun`
2. `step`
3. `handoff`
4. `sharedState`

The shipped bundle preserves those four and adds `localActionRequests` as an
explicit fifth execution entity rather than hiding host work in step prose.

Important dependency:

- this execution vocabulary assumes a separate assignment layer now captured in
  [0002-2026-04-14-task-run-spec.md](0002-2026-04-14-task-run-spec.md)
- `teamRun` should remain the durable execution record, not the reusable team
  definition and not the concrete assignment object

Current concrete dependency:

- the first code-facing `teamRun` slice should reference exactly one `taskRunSpecId`
- later readers should be able to recover:
  - which reusable team template was selected
  - which concrete assignment was bound to it
  without reconstructing assignment intent from execution history
- with the v1 `taskRunSpec` contract now explicit, `teamRun` should not duplicate:
  - `objective`
  - `successCriteria`
  - `requestedOutputs`
  - assignment-level `inputArtifacts`
  except as planned or derived execution material on specific steps
- `0024-2026-04-21-taskrunspec-public-contract-reconciliation.md` chose the
  live flattened `TaskRunSpec` schema as the first public full-spec
  compatibility target
- sectioned public envelopes remain deferred until a later versioned
  normalizer is justified

## `teamRun`

`teamRun` is the durable execution record for one attempt to execute exactly one
`taskRunSpec` against exactly one selected `team`.

### Historical v1 sketch

The current `TeamRun` type adds `entryPrompt` and `initialInputs`, projects
`requestedBy` to `string | null`, and permits a nullable compatibility
`taskRunSpecId`; task-aware constructors always populate that identity.

```ts
type TeamRun = {
  id: string;
  taskRunSpecId: string;
  teamId: string;
  status: 'planned' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  trigger: 'cli' | 'service' | 'api' | 'mcp' | 'scheduled' | 'internal';
  requestedBy?: {
    kind: 'user' | 'service' | 'schedule' | 'internal';
    id?: string | null;
    label?: string | null;
  } | null;
  policy: {
    executionMode: 'sequential';
    failPolicy: 'fail-fast';
    parallelismMode: 'disabled';
    handoffRequirement: 'explicit';
  };
  sharedStateId: string;
  stepIds: string[];
};
```

### `teamRun` rules

- one `teamRun` references exactly one `taskRunSpecId`
- `teamRun` owns execution identity and lifecycle only
- `teamRun` must not duplicate assignment intent from `taskRunSpec`, including:
  - `objective`
  - `successCriteria`
  - `requestedOutputs`
  - assignment-scoped `inputArtifacts`
- `teamRun` also must not carry runner-owned fields such as:
  - `runnerId`
  - `leaseOwner`
  - queue position
  - retry counters

## `step`

`step` is one planned or executed unit of work inside one `teamRun`. Each step
resolves to exactly one agent execution identity.

### Historical v1 sketch

The current step type uses typed `TeamRunStepInput` and `TeamRunStepOutput`
envelopes with artifact refs, structured data, notes, and handoff ids; it also
permits nullable unresolved runtime/browser/service identities for blocked
planning evidence.

```ts
type TeamRunStep = {
  id: string;
  teamRunId: string;
  agentId: string;
  runtimeProfileId: string;
  browserProfileId?: string | null;
  service: string;
  kind: 'prompt' | 'analysis' | 'handoff' | 'review' | 'synthesis';
  status: 'planned' | 'ready' | 'running' | 'succeeded' | 'failed' | 'blocked' | 'skipped' | 'cancelled';
  order: number;
  dependsOnStepIds: string[];
  input: {
    prompt?: string | null;
    structuredContext?: Record<string, unknown> | null;
    inputArtifacts?: TaskRunInputArtifact[] | null;
    handoffIds?: string[] | null;
  } | null;
  output: {
    summary?: string | null;
    structuredOutputs?: Record<string, unknown> | null;
    artifactIds?: string[] | null;
  } | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failure?: {
    code: string;
    message: string;
  } | null;
};
```

### `step` rules

- `step` may carry assignment-derived working material, but not replace the root `taskRunSpec`
- persist `agentId`, `runtimeProfileId`, and `browserProfileId` at planning or execution-start time
- step-local input/output is runtime working state, not the canonical assignment definition

## `handoff`

`handoff` is the durable transfer payload from one step to another inside one
`teamRun`.

### Historical v1 sketch

The current handoff type retains this relationship while normalizing artifacts,
structured data, and notes into required serializable collections.

```ts
type TeamRunHandoff = {
  id: string;
  teamRunId: string;
  fromStepId: string;
  toStepId: string;
  fromAgentId: string;
  toAgentId: string;
  status: 'prepared' | 'delivered' | 'consumed' | 'failed';
  summary: string;
  artifacts?: TaskRunInputArtifact[] | null;
  structuredData?: Record<string, unknown> | null;
  notes?: string[] | null;
  createdAt: string;
};
```

### `handoff` rules

- handoffs must be serializable and survive runner boundaries
- handoffs must reference durable artifacts or structured payloads, not live browser state
- inter-agent transfers should prefer explicit handoffs over hidden step-output coupling

## Artifact and handoff transport rules

The first logical execution model should use one artifact reference contract
everywhere instead of inventing separate envelopes per surface.

The same bounded artifact shape should be reused for:

- step input artifacts
- step output artifacts
- handoff artifacts
- shared-state artifact inventory
- local host action inputs/outputs when the host participates in the same run

Important rule:

- local host execution is another producer/consumer in the run graph, not a
  second artifact system

Minimum durable artifact-ref responsibilities:

- stable `id`
- durable locator:
  - `path`
  - `uri`
- bounded classification:
  - `kind`
  - `title`
- transport safety across:
  - agent-to-agent handoff
  - agent-to-host handoff
  - host-to-agent handoff

Default transport rules:

- pass artifact refs by id/path/uri, not embedded file payloads, by default
- use `structuredData` only for bounded machine-readable payloads that should
  survive serialization without a separate artifact object
- normalize provider- and host-produced artifact refs at runtime ingress before
  storing or projecting them
  - invalid artifact-ref entries should be ignored rather than persisted,
    counted as produced artifacts, or allowed to fail unrelated local-action
    resolution
- normalize persisted handoff transfer payloads before later steps or readback
  surfaces consume them
  - invalid `requestedOutputs` / `inputArtifacts` entries should be ignored
    rather than counted or injected into prompts
- do not require open browser tabs, in-memory handles, or host-local hidden
  state to understand a handoff
- do not create a host-only artifact mirror or a second handoff model for
  local actions

## `sharedState`

`sharedState` is the append-only run-scoped coordination record for one
`teamRun`.

### Historical v1 sketch

The current shared-state type uses `active | succeeded | failed | cancelled`,
stores structured outputs as ordered key/value entries, and gives every history
event its own id, team-run identity, timestamp, and bounded payload.

```ts
type TeamRunSharedState = {
  id: string;
  teamRunId: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  artifacts: Array<{
    id: string;
    kind: string;
    uri?: string | null;
    title?: string | null;
  }>;
  structuredOutputs: Record<string, unknown>;
  notes: string[];
  history: Array<{
    type:
      | 'step-planned'
      | 'step-started'
      | 'step-succeeded'
      | 'step-failed'
      | 'handoff-created'
      | 'handoff-consumed'
      | 'artifact-added'
      | 'note-added';
    at: string;
    stepId?: string | null;
    handoffId?: string | null;
    note?: string | null;
    data?: Record<string, unknown> | null;
  }>;
  lastUpdatedAt: string;
};
```

### `sharedState` rules

- history is append-only
- summaries may be projected from history later, but raw history remains the postmortem source of truth
- `sharedState` is run-scoped coordination state, not assignment definition

## Example relationship

The intended MVP relationship graph is:

- one `taskRunSpec`
- one `teamRun`
- one `sharedState`
- many `steps`
- zero or more `handoffs`

Recommended foreign-key shape:

- `teamRun.taskRunSpecId -> taskRunSpec.id`
- `step.teamRunId -> teamRun.id`
- `handoff.teamRunId -> teamRun.id`
- `handoff.fromStepId -> step.id`
- `handoff.toStepId -> step.id`
- `sharedState.teamRunId -> teamRun.id`

## Original v1 non-goals and current ownership

This logical model still does not make the following team-owned fields:

- queue tables
- runner lease tables
- multi-runner topology
- implicit parallel planning from team membership alone

Persistence backends and service API endpoints now exist in separately owned
runtime/service layers. Their implementation does not move queue or runner
topology into the logical TeamRun contract.

## Historical definition of done

The original design seam considered itself complete when:

- the four core runtime entities are named, scoped, and concrete
- `teamRun` clearly references exactly one `taskRunSpecId`
- assignment intent stays on `taskRunSpec`
- runner-owned metadata stays out of the logical execution model
- roadmap/execution docs point to this plan before service implementation begins

## Identity and ownership rules

The data model should preserve ownership clearly.

Assignment-owned (`taskRunSpec`):

- objective
- success criteria
- requested outputs
- assignment-scoped input artifacts
- bounded run constraints and overrides

Execution-owned (`teamRun`, `step`, `handoff`, `sharedState`):

- execution identity and lifecycle
- planned and completed steps
- durable transfers
- produced artifacts and structured outputs
- append-only coordination history

Runner-owned (later metadata only):

- runner id
- lease state
- queue position
- retry counters
- concurrency decisions

Important rule:

- runner-owned fields should not be required to understand the logical team run
- assignment-owned fields should not be duplicated into `teamRun` just for convenience
- runner metadata may be attached later as operational metadata, not as part of the logical execution contract

Execution-envelope rule:

- local-action requests, host-produced artifacts, and agent-produced artifacts
  all belong to the same logical execution envelope
- downstream surfaces should not need a second host-specific artifact or
  handoff vocabulary before they can route, inspect, or replay the run

## Serialization guidance

The implementation uses shapes that serialize cleanly to:

- JSON
- NDJSON event streams
- SQLite/SQL tables

That means:

- avoid cyclic references
- prefer ids over embedded backreferences
- keep timestamps explicit
- keep event types enumerable

## MVP schema relationship

Safe MVP relationship graph:

- one `teamRun`
- one `sharedState`
- many `steps`
- zero or more `handoffs`

Recommended foreign-key shape:

- `step.teamRunId -> teamRun.id`
- `handoff.teamRunId -> teamRun.id`
- `handoff.fromStepId -> step.id`
- `handoff.toStepId -> step.id`
- `sharedState.teamRunId -> teamRun.id`

## Logical-model non-goals

This logical model does not own:

- queue tables
- runner lease tables
- persistence backend selection
- service API endpoint policy
- runner/lease/queue/retry ownership

## Acceptance Criteria

- [x] logical run, step, handoff, shared-state, local-action, artifact, failure,
      and history entities are typed and schema-validated
- [x] task-aware runs preserve exactly one task-spec/team binding while
      assignment intent remains in `TaskRunSpec`
- [x] ordered dependencies, explicit handoffs, artifact refs, structured
      outputs, and append-only history remain serializable
- [x] runtime projection preserves logical identity while runner/lease/queue/
      retry metadata stays operational
- [x] complete runtime bundles persist with revision checks and support bounded
      inspection/review reconstruction
- [x] current docs distinguish historical sketches from live source and use
      portable links
- [x] focused provider-free tests and governance gates pass

## Evidence Matrix

| Contract | Current authority | Executable evidence |
| --- | --- | --- |
| Logical entity vocabulary and defaults | team types and model constructors | `tests/teams.types.test.ts`, `tests/teams.model.test.ts` |
| Schema validation and bundle integrity | team schemas | `tests/teams.schema.test.ts` |
| Logical-to-runtime projection | runtime model | `tests/runtime.model.test.ts` |
| Durable complete-bundle persistence | runtime execution store | `tests/runtime.store.test.ts` |
| Bounded durable reconstruction | team review ledger | `tests/teams.reviewLedger.test.ts` |
