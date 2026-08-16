# Team Config Boundary Reconciliation | 0339-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reconcile Plan 0006 with the shipped team, assignment, durable-run, and
service-host boundaries, then close the old design seam if current executable
evidence satisfies every criterion.

## Current State

- Plan 0006 still correctly separates reusable team coordination from browser
  and account ownership.
- Its `Current CLI-era rule`, `Future service/runners boundary`, and near-term
  selection language predate the implemented `TaskRunSpec`, durable team-run,
  runtime bridge, service host, and public HTTP/MCP team-run surfaces.
- The curated active-plan index no longer lists terminal Plan 0006.
- Current schema, resolution, planning, persistence, execution, and inspection
  tests provide a bounded way to prove whether the design seam is complete.

## Scope

- Map each Plan 0006 ownership, inheritance, non-goal, and layer boundary to
  current source and provider-free tests.
- Replace historical future-tense claims with current implemented semantics
  while preserving the original architectural distinction.
- Reconcile the matching roadmap checkpoint and active-plan index entry.
- Close Plan 0006 and this audit only if all focused and governance gates pass.

## Non-Goals

- Do not change team execution, scheduling, browser, provider, API, CLI, or MCP
  behavior.
- Do not redesign role sequencing or make `handoffToRole` rewrite dependencies.
- Do not close adjacent Plans 0002, 0003, or 0004 without their own bounded
  criterion audits.
- Do not broaden this slice into a full P01 roadmap rewrite.

## Acceptance Criteria

- [x] Team config remains a reusable orchestration definition and resolves
      member execution context through agent, runtime-profile, and browser-
      profile layers.
- [x] Concrete assignment state remains in `TaskRunSpec`, while durable
      execution state remains in team/run records.
- [x] Scheduling, leases, retries, runner ownership, and execution remain
      service-host concerns rather than inferred team membership topology.
- [x] Explicit role order remains deterministic and `handoffToRole` remains
      advisory metadata.
- [x] Plan 0006 and the matching roadmap text describe current behavior, and a
      closed Plan 0006 is absent from the curated active-plan index.
- [x] Focused team tests, typecheck, plan-state tests, plan audit, diff hygiene,
      and CodeGraph status pass.

## Definition Of Done

The slice closes when every original Plan 0006 boundary maps to current source
and executable evidence, stale future-tense authority is reconciled, and the
canonical planning audit accepts Plan 0006 as terminal and absent from the
active index.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; this is one documentation-only authority audit
- expected_write_surface: Plans 0006 and 0339, plan index, roadmap, runbook,
  journal, and testing documentation if the focused command is not already
  discoverable
- required_inputs: current team schema/resolution/model/runtime-bridge/service
  source, focused provider-free tests, Plan 0006, and current P01 roadmap text
- validation: focused team tests, typecheck, plan-index/roadmap-state tests,
  plan audit, diff hygiene, and CodeGraph status
- terminal_condition: all boundary claims are proved and both plans close, or
  an unmapped criterion keeps Plan 0006 open with the exact gap recorded

## Execution Notes

- CodeGraph and direct source reads mapped team schema, member inheritance,
  role-aware planning, task-spec construction, durable run state, runtime
  bridge execution, and service-host ownership without finding a boundary gap.
- The reconciled Plan 0006 preserves the important nuance that generic team
  selection remains planning-only while explicit CLI, HTTP, and MCP team-run
  entrypoints execute a concrete `TaskRunSpec`.
- Eight focused provider-free core files pass 111 tests, and two filtered HTTP
  assertions prove compact and prebuilt-spec team-run creation. Typecheck,
  eleven governance/link tests, the 340-plan audit, diff hygiene, and CodeGraph
  status pass.
- Plan 0006 and Plan 0339 close accepted without runtime behavior changes.
