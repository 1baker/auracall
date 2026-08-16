# TeamRun Data Model Reconciliation | 0341-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reconcile Plan 0003's early TeamRun entity sketches with the shipped logical
bundle and runtime persistence model, then close the parent seam only if its
ownership, relationship, serialization, and inspectability criteria are proved.

## Current State

- The shipped logical bundle contains `TeamRun`, steps, handoffs, shared state,
  and explicit local-action requests, all backed by types and Zod schemas.
- A task-aware `TeamRun` links one `taskRunSpecId`; the runtime projection keeps
  team/assignment identity while adding operational run, queue, lease, runner,
  retry, and recovery state outside the logical team config.
- The execution store persists and compare-and-swap updates complete runtime
  bundles; the review ledger and inspection surfaces project bounded durable
  evidence from them.
- Plan 0003 still presents pre-implementation field sketches, retired absolute
  links, duplicate definition-of-done sections, and historical non-goals as if
  they described current repository state.

## Scope

- Map every logical entity, relationship, ownership rule, artifact/handoff
  rule, and serialization goal to current source and tests.
- Mark early TypeScript shapes as historical and summarize current deviations.
- Repair portable links and consolidate current acceptance/evidence authority.
- Close Plan 0003 only if no logical data-model gap remains.

## Non-Goals

- Do not change entity types, schemas, runtime projection, persistence, review,
  inspection, or execution behavior.
- Do not merge runner/lease/queue metadata into reusable team config or the
  logical TeamRun vocabulary.
- Do not enable implicit parallel execution.
- Do not close Plan 0004 without its own service-execution audit.

## Acceptance Criteria

- [x] TeamRun, step, handoff, shared-state, artifact, history, failure, and
      local-action entities are typed, schema-validated, and serializable.
- [x] Task-aware logical runs preserve team and task-spec identity without
      treating runner, lease, queue, or retry state as team-owned config.
- [x] Step dependencies, explicit handoffs, artifact refs, structured outputs,
      and append-only history remain durable across runtime projection.
- [x] Complete runtime bundles persist with revision checks and support bounded
      inspection/review reconstruction.
- [x] Current docs distinguish historical sketches from live source, remove
      retired absolute paths, and consolidate terminal criteria.
- [x] Focused model/schema/runtime/store/review tests, typecheck, governance/
      link tests, plan audit, diff hygiene, and CodeGraph status pass.

## Definition Of Done

Plan 0003 and this reconciliation close when all logical execution entities and
ownership boundaries map to current executable evidence and only separately
owned service behavior remains.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; this is one documentation-only authority audit
- expected_write_surface: Plans 0003 and 0341, roadmap, runbook, journal, and
  testing docs if the focused command is not discoverable
- required_inputs: current team/runtime types, schemas, model projection,
  execution store, review ledger, and provider-free tests
- validation: focused model/schema/runtime/store/review tests, typecheck,
  governance/link tests, plan audit, diff hygiene, and CodeGraph status
- terminal_condition: every logical-model criterion is proved and both plans
  close, or Plan 0003 stays open with the exact entity/ownership gap recorded

## Execution Notes

- CodeGraph plus direct source reads mapped all logical entities, task/team
  identity, dependency and handoff relationships, runtime projection, complete-
  bundle persistence, and review reconstruction. No data-model gap was found.
- The early TypeScript blocks remain searchable history but now disclose exact
  current deviations. Retired absolute links are replaced with portable plan
  references, and duplicate completion language is separated into historical
  and current acceptance sections.
- Six focused provider-free files pass 34 tests. Typecheck, eleven governance/
  link tests, the 342-plan audit, portable-path scan, diff hygiene, and current
  CodeGraph status pass.
- Plan 0003 and Plan 0341 close accepted without runtime behavior changes.
