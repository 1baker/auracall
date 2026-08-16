# TaskRunSpec Completion Reconciliation | 0340-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reconcile Plan 0002's historical sectioned design sketch with the shipped
flattened `TaskRunSpec` contract and close the parent design seam only if its
ownership, transport, persistence, and runtime-policy criteria are proved.

## Current State

- Plan 0002 correctly separates reusable team defaults, one concrete
  assignment, and durable execution facts.
- The live schema is the flattened `TaskRunSpec` in `src/teams/types.ts` and
  `src/teams/schema.ts`; closed Plan 0024 selected it as the public full-spec
  compatibility contract, and closed Plan 0025 shipped validated HTTP/MCP
  prebuilt-spec acceptance.
- Plan 0002 still presents its older sectioned sketch and example prominently,
  contains retired absolute workspace links, and remains `OPEN` without a
  current acceptance/evidence matrix.
- Plan 0002 is not present in the curated active-plan index, so no index row
  needs removal if it closes.

## Scope

- Map assignment ownership and every live field family to current type/schema,
  builder, store, planner, runtime bridge, and public-surface evidence.
- Mark the sectioned shape as historical and make the flattened schema the
  unambiguous current authority.
- Replace retired absolute links/paths in the current canonical plan.
- Add explicit acceptance criteria and reconcile roadmap/runbook/journal state.

## Non-Goals

- Do not change the `TaskRunSpec` type, schema, defaults, persistence, or wire
  behavior.
- Do not add a sectioned compatibility envelope or schema version field.
- Do not change scheduler, runner, provider, browser, or team-run behavior.
- Do not close adjacent Plans 0003 or 0004 without their own criterion audits.

## Acceptance Criteria

- [x] One flattened serializable schema remains authoritative for storage and
      execution helpers, with optional public prebuilt HTTP/MCP input.
- [x] Assignment identity, objective, criteria, inputs, constraints, outputs,
      overrides, policies, and provenance remain distinct from reusable team
      config and produced run facts.
- [x] Schema validation and durable compare-and-swap storage are executable.
- [x] Planning/runtime enforcement covers member filtering, runtime/browser and
      service constraints, turn/time/provider budgets, required outputs, human
      escalation, structured context, and input artifacts.
- [x] Current docs label the sectioned design as historical, use portable paths,
      and link closed Plans 0024/0025 as compatibility/implementation authority.
- [x] Focused TaskRunSpec and HTTP tests, typecheck, governance/link tests, plan
      audit, diff hygiene, and CodeGraph status pass.

## Definition Of Done

Plan 0002 and this reconciliation close when the current flattened assignment
contract is singular and portable in documentation, every ownership boundary
maps to executable evidence, and no runtime change is required.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; this is one documentation-only authority audit
- expected_write_surface: Plans 0002 and 0340, roadmap, runbook, journal, and
  testing docs if a focused command is not discoverable
- required_inputs: live TaskRunSpec type/schema/builder/store/planner/runtime
  source, closed Plans 0024/0025, and focused provider-free tests
- validation: focused core and HTTP tests, typecheck, governance/link tests,
  plan audit, diff hygiene, and CodeGraph status
- terminal_condition: all parent boundaries are proved and both plans close,
  or Plan 0002 stays open with the exact unimplemented criterion recorded

## Execution Notes

- CodeGraph plus direct source reads mapped the flattened type/schema, compact
  builder, defaults, revisioned store, task-aware planner, runtime bridge, and
  public compact/prebuilt inputs. No assignment-boundary gap was found.
- The historical sectioned sketch remains for design archaeology but is now
  explicitly non-wire/non-storage. Retired absolute plan and cwd paths are
  replaced with portable references.
- Seven provider-free core files pass 72 tests. Four filtered HTTP assertions
  prove compact creation, invalid-body rejection, prebuilt flattened input, and
  mixed-input rejection. Typecheck, eleven governance/link tests, the 341-plan
  audit, diff hygiene, and CodeGraph status pass.
- Plan 0002 and Plan 0340 close accepted without runtime behavior changes.
