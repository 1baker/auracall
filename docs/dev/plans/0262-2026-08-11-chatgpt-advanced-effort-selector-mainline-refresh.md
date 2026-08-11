# ChatGPT Advanced/Effort Selector Mainline Refresh | 0262-2026-08-11

State: OPEN
Lane: P02
Plan version: 1
Gate state: PUSHED_FEATURE_INSTALL_ACTIVE
Goal execution state: ACTIVE_BOUNDED_EXECUTION

## Stable Goal Objective

Restore the already validated compact `Advanced` and sibling `Effort`
navigation repair on the current AuraCall mainline so LitScout Declaration
Campaign Experiment 5 can make its single governed submission without
repeating the known pre-submission thinking-menu failure.

## Current State

- The earlier repair commit `b27b0c99` passed focused selector validation and
  was installed before the operator allowed the Experiment 5 retry.
- AuraCall main subsequently advanced through a separate context-read lane and
  the current installed source no longer contains that selector repair.
- The known live DOM shape can expose visible `Advanced` with accessible
  `Show advanced options`, plus whitespace-free `ModelGPT-5.6 Sol` and
  `EffortLight` rows. Current main concatenates visible text and aria labels,
  so the semantic control can be present while the starts-with predicate fails.
- Plan 0261 currently owns separate provider-free ChatGPT adapter files in the
  main worktree and explicitly excludes install, restart, and browser effects.
  This plan uses a separate pushed worktree, does not touch those files, and
  may install its exact committed build without merging or rewriting main.

## Authority And Effect Boundary

- Owned branch/worktree:
  `fix/chatgpt-advanced-effort-selector-main-refresh` at
  `/home/ecochran76/workspace.local/auracall-plan0261-selector-refresh`.
- Allowed writes: model/thinking selector implementation, focused tests, this
  plan, `ROADMAP.md`, `RUNBOOK.md`, `docs/dev/dev-journal.md`, and
  `docs/dev-fixes-log.md`.
- Allowed effect after exact feature-branch origin parity and zero browser
  ownership: one user-runtime install and its installer-required API restart,
  followed by source/install parity and zero-browser-owner verification.
- Excluded here: browser launch/attach/navigation, model selection, prompt or
  attachment submission, provider call, retry, scheduler/completion control,
  materialization, profile cleanup, and LitScout database mutation.

## Execution Packet

1. Port only the four-file selector/test delta from `b27b0c99` onto current
   mainline, preserving newer unrelated browser and adapter behavior.
2. Run the focused and adjacent selector/config packet, typecheck, build,
   scoped lint, plan audit, and diff hygiene with exact profile/port checks.
3. Commit and push this branch without touching the dirty Plan 0261 main
   worktree.
4. Install the exact pushed feature build once while Plan 0261 remains
   provider-free, then prove API health, source/install parity, and zero exact
   browser ownership. Mainline reconciliation is a later repository follow-up.
5. Leave `wsl-chrome-3` stopped. LitScout must refreeze its effect receipt
   against the exact installed hashes before the one Experiment 5 submission.

## Acceptance Criteria

- [x] Both selector paths evaluate visible text and aria labels independently.
- [x] Exact compact `Advanced`, `ModelGPT-5.6 Sol`, and `EffortLight` shapes
  have deterministic provider-free coverage.
- [x] Focused 26/26 and adjacent 101/101 selector/config tests pass; typecheck
  passes.
- [x] Build, scoped lint, plan audit, and diff hygiene pass.
- [x] The repair commit is pushed without overwriting Plan 0261 work.
- [ ] Mainline reconciliation remains a non-blocking repository follow-up after
  Plan 0261 reaches a clean checkpoint.
- [ ] One installed build has exact source parity while the named profile and
  port remain absent.
- [x] Browser, provider, prompt, attachment, scheduler, completion,
  materialization, and LitScout mutation effects remain zero during repair.

## Local Goal Bounds

- `max_source_repairs: 1`
- `max_installs: 1`
- `max_api_restarts: 1 if required by the installer`
- `max_browser_launches: 0`
- `max_browser_attaches: 0`
- `max_chatgpt_submissions: 0`
- `max_provider_calls: 0`
- `max_litscout_db_mutations: 0`
- `max_subagents: 0`

## Definition Of Done

The selector repair is committed, pushed, and installed from its isolated
feature branch with exact parity while `wsl-chrome-3` remains absent. The
Experiment 5 submission itself remains owned by the LitScout campaign and
requires a corrected frozen receipt against those installed bytes. Mainline
reconciliation may follow without blocking that governed experiment.
