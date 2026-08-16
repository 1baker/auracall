# Team Config Boundary Plan | 0006-2026-04-14

State: CLOSED
Lane: P01
Plan version: 2

## Current State

- `TeamConfigSchema` now models reusable workflow or dispatch-pool team
  definitions with members, roles, coordination instructions, dispatch intent,
  project intent, and metadata.
- Team resolution remains compositional through
  `team -> agent -> runtimeProfile -> browserProfile`; team selection does not
  become an implicit top-level runtime selector.
- `TaskRunSpec` carries a concrete assignment and run-specific policy, while
  persisted team-run records carry the durable attempt, steps, handoffs, shared
  state, events, and execution linkage.
- The runtime bridge and `ExecutionServiceHost` now execute that intent through
  explicit CLI, HTTP, and MCP team-run entrypoints. Scheduling, leases, retries,
  runner ownership, and parallelism remain execution-layer concerns.
- Explicit role `order` drives deterministic planned sequencing;
  `handoffToRole` remains validated advisory metadata and does not rewrite
  dependency edges.
- Plan 0339 audited this boundary against current executable evidence. The
  historical design seam closes without implying adjacent Plans 0002, 0003, or
  0004 are also reconciled.

# Team Config Boundary Plan

## Purpose

Define the stable ownership and layering contract for Aura-Call teams without
letting team config absorb assignment, browser/account, or runner concerns.

This document answers four questions:

- what a team owns
- what a team inherits through its member agents
- what a team must not own directly
- how the future service/runners layer relates to teams

## Position in the stack

The intended layering remains:

1. browser profile
2. AuraCall runtime profile
3. agent
4. team
5. task / run spec
6. service/runners orchestration

A team coordinates multiple agents. It does not redefine browser/account
identity, and it does not absorb runner/service concerns owned by the execution
layer.

## Canonical role of a team

The safest canonical definition is:

- a team is a reusable orchestration template for a class of work

That means a team is richer than a plain collection of agents, but still more
general than one concrete assignment.

A team should be able to capture durable collaboration structure such as:

- member roles
- team-level coordination instructions
- pre-prompt shaping rules
- handoff and response-shape expectations
- escalation and human-input rules
- automation-policy defaults such as turn budgets or stop conditions

Important distinction:

- a team is not the concrete problem instance
- a team is not the full execution record
- a team should stay reusable across many assignments in the same problem class

Examples of the intended shape:

- a `Vibe code` team may define:
  - an orchestrator role
  - an engineer role
  - a structured work-product contract
  - allowed local host-action requests
  - stop/escalate behavior for unattended multi-turn work
- a `Proposal Writer` team may define:
  - an orchestrator role
  - specialist roles such as budgeter, narrative writer, and red-team reviewer
  - reusable delegation and review policy for proposal work

These examples are templates for repeatable collaboration, not one-off runs.

## Team vs task vs run

To avoid overloading `team`, AuraCall should separate three concepts:

1. `team`
   - reusable orchestration template
   - defines who collaborates and how collaboration should work
2. `task` / `run spec`
   - concrete assignment given to a team
   - defines the actual bundle, goal, constraints, and requested outcome
3. `run`
   - durable execution record for one attempt
   - records turns, artifacts, handoffs, local actions, and stop/failure state

Why this split is safer:

- it keeps teams reusable
- it keeps task-specific detail out of long-lived team definitions
- it prevents the first CLI/API execution surface from treating team membership
  alone as the full workflow definition

## Team inheritance contract

A team should inherit member execution context through its agents:

- each member agent references one AuraCall runtime profile
- each runtime profile references one browser profile
- service defaults and project defaults continue to come from the resolved
  runtime profile unless a higher layer later defines a safe override policy

This keeps team membership compositional:

- `team -> agent -> runtimeProfile -> browserProfile`

## Team-owned concerns

A team may own concerns like:

- member roles
- ordered or named membership
- shared metadata
- coordination instructions
- pre-prompt policy
- routing/delegation policy
- selection policy for which member should handle a task
- divide-and-conquer decomposition policy for complex work
- multi-turn automation policy across member agents
- explicit data handoff contracts between member agents
- shared intermediate-result routing rules
- allowed host/local-action request policy
- response-shape contracts for member outputs
- default stop/escalation rules
- execution policy hints that describe desired coordination behavior

These are orchestration concerns, not browser/account concerns.

## Team non-goals

A team should not directly own or redefine:

- browser profile selection
- source browser profile selection
- managed browser profile path/root
- cookie/bootstrap paths
- debug-port policy
- raw account identity
- service identity rewiring
- runtime profile bypass
- tab/window lifecycle policy

Those remain owned below the team layer by:

- browser profiles
- AuraCall runtime profiles
- agents

## Current selection and execution rule

Generic runtime selection remains read-only and selection-oriented for teams:

That means:

- teams may be parsed
- teams may be projected and inspected
- teams may be validated
- teams may be resolved to their member runtime/browser contexts

That generic selection seam does not itself:

- execute a team
- imply parallel execution
- current internal step-builder defaults are the final product meaning of `team`

Team execution now exists through explicit bounded entrypoints that construct
or accept a `TaskRunSpec`, persist a distinct team run, and invoke the runtime
bridge/service host. Current public write paths include CLI, HTTP, and MCP; they
do not turn `--team` into an implicit runtime-profile selector.

Current role-planning policy:

- explicit role `order` currently drives planned step sequencing
- when explicit role order ties, current planning stays deterministic through a
  role-id tiebreak
- `handoffToRole` is currently advisory metadata carried into planned step and
  handoff payloads
- `handoffToRole` does not currently rewrite planned dependency edges or step
  order by itself

Changing that policy requires a deliberate behavior-facing orchestration slice.

## Current service/runners boundary

AuraCall now has a service host, durable runners, leases, queueing, recovery,
and bounded team execution. The original separation remains intact:

- teams are an input to the service/runners layer
- teams should describe orchestration intent:
  - which agents collaborate
  - how work may be divided
  - how intermediate results may pass between agents
  - what kind of multi-turn coordination is desired
- runner assignment and parallelism policy are modeled there, not hidden
  inside team membership alone
- team config describes desired coordination policy, while actual
  scheduling/execution belongs to the service/runners layer

Important rule:

- do not make team config imply runner topology by accident

Examples of concerns that belong to the service/runners layer, not the team
layer:

- worker pool sizing
- parallel fan-out limits
- queueing policy
- retry/backoff across members
- background service lifecycle
- long-lived runner ownership

Examples of concerns that belong to the team layer and are executed through
the service/runners layer:

- divide-and-conquer task plans across multiple agents
- staged multi-turn workflows where one agent's output becomes another's input
- explicit handoff points between specialist agents
- orchestration policies for sequential vs parallel collaboration

Important separation:

- team config should express coordination intent
- task / run-spec input should express the concrete assignment and run-specific
  constraints
- the service/runners layer should decide how to schedule and execute
  that intent

## Current public-surface policy

A generic `--team <name>` selection seam means:

- resolve the named team
- resolve its member agents
- resolve each member's runtime profile and browser profile
- surface that result in inspection/doctor/runtime planning paths

It does not by itself mean:

- execute each member
- choose a member automatically for work
- run members in parallel
- create implicit service/runners behavior
- treat declared member order as the permanent meaning of team workflow
- assume one member always maps to one prompt-shaped step in the public model

Explicit team-run surfaces are separate. They require a concrete assignment,
produce inspectable durable linkage, and execute only through the service-host
boundary.

## Definition of done for this design seam

This seam is complete when:

- [x] docs state clearly what teams own
- [x] docs state clearly what teams inherit
- [x] docs state clearly what teams must not own
- [x] docs explicitly separate team config from service/runners orchestration
- [x] current source and provider-free tests prove the team/task/run/service
      separation and deterministic role-planning policy
- [x] roadmap and active-plan authority match the reconciled terminal state

## Evidence Matrix

| Boundary | Current authority | Executable evidence |
| --- | --- | --- |
| Team-owned reusable coordination | `TeamConfigSchema`, `parseTeamRolePlanningConfigs` | `tests/configModel.test.ts`, `tests/teams.model.test.ts` |
| Inherited member execution context | `resolveTeamSelection`, `resolveTeamRuntimeSelections` | `tests/configModel.test.ts` |
| Concrete assignment outside team config | `TaskRunSpec`, `buildBoundedTeamTaskRunSpec` | `tests/teams.schema.test.ts`, `tests/cli/teamRunCommand.test.ts` |
| Durable attempt outside assignment config | team-run bundle/store and runtime linkage | `tests/teams.model.test.ts`, `tests/teams.store.test.ts` |
| Scheduling/execution outside team membership | `createTeamRuntimeBridge`, `ExecutionServiceHost` | `tests/teams.service.test.ts`, `tests/teams.runtimeBridge.test.ts` |
| Explicit public execution boundary | CLI team-run command, HTTP team-run route, and MCP `team_run` | `tests/cli/teamRunCommand.test.ts`, `tests/http.responsesServer.test.ts`, `tests/mcp/teamRun.test.ts` |
| Deterministic role order; advisory handoff | role-aware step planner | `tests/teams.model.test.ts` |
