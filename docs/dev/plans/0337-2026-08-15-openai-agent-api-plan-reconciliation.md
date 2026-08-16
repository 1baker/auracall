# OpenAI Agent API Plan Reconciliation | 0337-2026-08-15

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Audit closed parent Plan 0064 against current executable evidence and reconcile
its stale follow-on and active-index language without reopening accepted
OpenAI-compatible agent API behavior.

## Current State

- Plan 0064 is `CLOSED`, reports `Remaining: none`, and records exact-SHA
  cross-platform acceptance for its final streaming criterion.
- Its `Next Work` still asks for response-batch cancellation, retry, and
  priority even though Plans 0334, 0335, and 0336 have closed those controls
  with their own local and exact-SHA evidence.
- Searchable archive work remains explicitly owned by open Plan 0066 rather
  than by Plan 0064.
- Generic AuraCall skills remain repo-local; promotion to an external shared
  skill source is a separate distribution decision, not an unfulfilled Plan
  0064 acceptance criterion.
- `docs/dev/plan-index.md` still lists closed Plan 0064 under its informational
  active-plan heading.

## Scope

- Map every Plan 0064 acceptance criterion to current source/test/documentation
  authority and durable acceptance evidence.
- Reclassify each Plan 0064 `Next Work` item as delivered or separately owned.
- Remove Plan 0064 from the informational active-plan list while preserving the
  closed plan as durable history.
- Record the reconciliation in roadmap, runbook, journal, and the parent plan.

## Non-Goals

- Do not change runtime, HTTP, MCP, browser-adapter, or scheduler behavior.
- Do not rerun provider live tests when accepted provider-free and exact-SHA
  evidence already proves the closed contract.
- Do not close or expand Plan 0066.
- Do not publish repo-local skills to an external/shared skill repository.
- Do not turn this bounded correction into a complete historical plan-index
  migration.

## Acceptance Criteria

- [x] Every Plan 0064 acceptance criterion has a current authoritative evidence
      mapping, and no mapping relies only on the plan's own closure claim.
- [x] Plans 0334, 0335, and 0336 are recorded as the delivered cancellation,
      retry, and priority follow-ons with their exact accepted SHAs/CI runs.
- [x] Searchable archive work points to open Plan 0066, and shared-skill
      promotion is labeled separately owned and non-blocking for Plan 0064.
- [x] The informational active-plan index no longer classifies closed Plan 0064
      as active.
- [x] Plan 0064, roadmap, runbook, journal, and fixes guidance agree on the
      reconciled ownership and terminal state.
- [x] Focused contract tests, plan audit, plan-state and current-doc portability
      tests, diff hygiene, and CodeGraph status pass. Biome intentionally
      ignores Markdown and is not a documentation gate.

## Definition Of Done

The plan closes when a maintainer can inspect Plan 0064 and identify direct
current evidence for every accepted contract, see each later follow-on's actual
owner and state, and no longer encounter Plan 0064 in the informational active
plan list.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; evidence mapping precedes authority edits
- expected_write_surface: Plan 0064, Plan 0337, roadmap, plan index, runbook,
  journal, and fixes log
- required_inputs: current source/test/docs, Plans 0064/0066/0333-0336,
  exact-SHA acceptance receipts, plan-audit rules
- validation: focused OpenAI agent API/selector/config/auth/SDK/batch contracts,
  plan audit, plan-state/current-doc tests, diff hygiene, CodeGraph
- terminal_condition: all criteria are evidenced and authorities reconcile, or
  a missing Plan 0064 contract reopens implementation work with the exact gap

## Execution Notes

- Current source and tests revealed that Plan 0064's ChatGPT examples lagged
  the accepted GPT-5.6 selector migration. The parent now records stable
  auto/instant/thinking/pro aliases against Terra, Luna, and Sol effort tiers,
  plus the GPT-5.5 escape hatch.
- All twelve parent criteria map to current HTTP, configured-executor,
  config-model, selector, MCP, setup-service, specialized-skill, and scoped
  handoff-smoke evidence. A clean filtered HTTP receipt passed 14 contracts;
  the other seven focused files passed 103 tests.
- The initial broad eight-file run passed 331 tests and exposed one unrelated
  order-sensitive account-mirror fixture assertion. That exact assertion
  passed immediately in isolation and no Plan 0064 assertion failed.
- `pnpm run smoke:scoped-client-handoff` passed isolated project setup,
  redacted handoff, generated-env loading, model discovery, direct response
  polling, and a two-child scoped batch.
- The plan audit reports 338 candidates and zero validation errors; plan-state
  plus current-doc portability pass 7 tests; diff hygiene and current CodeGraph
  status pass. Biome processed zero Markdown files by repository configuration,
  so it is recorded as unavailable rather than misreported as a passing gate.
- Plan 0064 remains closed. Plans 0334-0336 are delivered follow-ons, open Plan
  0066 owns archive completion, and external shared-skill promotion remains a
  separate non-blocking distribution choice. Plan 0337 closes accepted.
