# ChatGPT Advanced/Effort Selector Mainline Refresh | 0262-2026-08-11

State: OPEN
Lane: P02
Plan version: 1
Gate state: PROVIDER_FREE_GREEN_INSTALL_SERIALIZED
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
  main worktree. This plan uses a separate worktree and does not touch those
  files or the installed runtime until that lane reaches a clean checkpoint.

## Authority And Effect Boundary

- Owned branch/worktree:
  `fix/chatgpt-advanced-effort-selector-main-refresh` at
  `/home/ecochran76/workspace.local/auracall-plan0261-selector-refresh`.
- Allowed writes: model/thinking selector implementation, focused tests, this
  plan, `ROADMAP.md`, `RUNBOOK.md`, `docs/dev/dev-journal.md`, and
  `docs/dev-fixes-log.md`.
- Allowed later effect after clean mainline reconciliation: one exact
  user-runtime install and its installer-required API restart, followed by
  source/install parity and zero-browser-owner verification.
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
4. After Plan 0261 reaches a clean pushed checkpoint, reconcile this commit
   onto the then-current mainline, revalidate, and install once.
5. Leave `wsl-chrome-3` stopped. LitScout must refreeze its effect receipt
   against the exact installed hashes before the one Experiment 5 submission.

## Acceptance Criteria

- [x] Both selector paths evaluate visible text and aria labels independently.
- [x] Exact compact `Advanced`, `ModelGPT-5.6 Sol`, and `EffortLight` shapes
  have deterministic provider-free coverage.
- [x] Focused 26/26 and adjacent 101/101 selector/config tests pass; typecheck
  passes.
- [x] Build, scoped lint, plan audit, and diff hygiene pass.
- [ ] The repair commit is pushed and reconciled onto the clean current
  mainline without overwriting Plan 0261 work.
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

The exact current-mainline selector repair is committed, pushed, installed
with parity after cross-lane reconciliation, and `wsl-chrome-3` remains absent.
The Experiment 5 submission itself remains owned by the LitScout campaign and
requires a corrected frozen receipt against those installed bytes.
