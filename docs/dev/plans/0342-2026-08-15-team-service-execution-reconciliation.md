# Team Service Execution Reconciliation | 0342-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reconcile Plan 0004 with the shipped bounded team execution, service-host,
runner, control, inspection, recovery, and public write surfaces, then close the
parent only if its conservative ownership and execution criteria are proved.

## Current State

- `TaskRunSpec -> TeamRun -> TeamRuntimeBridge -> runtimeRun` is implemented
  with sequential fail-fast defaults and explicit step dependencies/handoffs.
- `ExecutionServiceHost` owns route-neutral runner lifecycle, serialized drain,
  startup recovery execution, local claim, scheduler control, operator control,
  cancellation, resume, targeted drain, lease repair, and local actions.
- HTTP owns transport/listener/timer/status concerns while CLI, HTTP, and MCP
  team-run writes share the bounded service/runtime path.
- Runner topology and scheduler authority are inspectable; bounded local claim
  is explicit, while fleet scheduling, worker loops, implicit parallelism, and
  non-local assignment remain deferred.
- Every successor named by Plan 0004 from 0019/0023 through 0026-0038 is closed,
  but the parent still presents future/first-slice and CLI-only language.

## Scope

- Map conservative execution, explicit handoff/shared state, host/runner
  ownership, controls, persistence, inspection/readback, recovery, and public
  team-run writes to current source and provider-free tests.
- Reconcile historical future-tense, first-slice, and CLI-only statements while
  preserving explicit multi-runner/parallel non-goals.
- Add current acceptance/evidence authority and close Plan 0004 only if no
  route-neutral service-execution gap remains.

## Non-Goals

- Do not change service-host, runner, scheduler, HTTP, CLI, MCP, browser, or
  provider behavior.
- Do not add fleet scheduling, worker loops, implicit parallelism, or non-local
  assignment.
- Do not reopen maintenance-only response-shape/readback hardening without a
  reproduced mismatch.
- Do not broaden this slice into deployment or topology redesign.

## Acceptance Criteria

- [x] One task/team binding projects to a sequential fail-fast logical run and
      durable runtime execution with explicit dependencies and handoffs.
- [x] Service-host versus HTTP transport/timer/status ownership remains explicit
      and route-neutral mutations stay host-owned.
- [x] Runner lifecycle, serialized drain, recovery, local claim, bounded
      scheduler/operator controls, lease repair, and local actions are tested.
- [x] CLI, HTTP, and MCP public team-run paths share the bounded execution chain
      and preserve compact/prebuilt assignment validation.
- [x] Inspection, recovery, and response readback preserve team-only identity,
      current claimant authority, artifacts, handoffs, outputs, and controls.
- [x] Fleet scheduling, worker pools, non-local assignment, and implicit
      parallel execution remain explicitly outside the shipped boundary.
- [x] Focused service/runtime/CLI/MCP/HTTP tests, typecheck, governance/link
      tests, plan audit, diff hygiene, and CodeGraph status pass.

## Definition Of Done

Plan 0004 and this reconciliation close when current executable evidence proves
the complete bounded service-execution contract and only explicitly deferred
fleet/parallel product work remains.

## Focused HTTP Proof

```bash
pnpm exec vitest run tests/http.responsesServer.test.ts -t "compacts stale runner topology entries on /status|reports live background drain state through /status|claims a scheduler-authorized local run through POST /status|creates a bounded team run over HTTP|returns team-run create before execution when background drain is enabled|returns read-only scheduler authority on runtime inspection without mutating leases|resolves a requested team-run local action through POST /status|resumes and drains one paused team run through the same POST /status controls|recovers a persisted runnable team run when startup recovery source is team-run"
```

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; this is one documentation-only authority audit
- expected_write_surface: Plans 0004 and 0342, roadmap, runbook, journal, and
  testing docs if focused commands are not discoverable
- required_inputs: service host, runner, runtime bridge, control, inspection,
  recovery/readback, public team-run source/tests, and closed successor plans
- validation: focused provider-free service/runtime/CLI/MCP/HTTP tests,
  typecheck, governance/link tests, plan audit, diff hygiene, CodeGraph status
- terminal_condition: all bounded execution/ownership criteria are proved and
  both plans close, or Plan 0004 stays open with the exact gap recorded

## Execution Notes

- CodeGraph plus source reads mapped the task/team/runtime chain, service-host
  ownership, HTTP-owned transport/timer/status boundary, runners, controls,
  topology, inspection, recovery, and public execution surfaces. No bounded
  service-execution gap was found.
- All named successor Plans 0019, 0023, and 0026-0038 are closed. Fleet
  scheduling, background worker pools, non-local assignment, and implicit
  parallelism remain separately scoped rather than hidden parent-plan work.
- Ten provider-free core files pass 183 tests. Nine filtered HTTP assertions
  prove topology, background drain, local claim, team creation, scheduler
  read-only authority, operator controls, and team-run recovery. Typecheck,
  eleven governance/link tests, the 343-plan audit, diff hygiene, and CodeGraph
  status pass.
- Plan 0004 and Plan 0342 close accepted without runtime behavior changes.
