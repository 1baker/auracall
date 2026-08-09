# Installed Exact Asset One-Canary Gate | 0239-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Outcome: ACTIVE_INSTALL_SELECTION_CANARY_GATE
Goal execution state: ACTIVE
Gate state: INSTALL_AND_PROVIDER_FREE_SELECTION_READY

## Stable Objective

Install the validated exact-terminal admission repair, prove source and
installed-runtime parity, resolve one genuinely non-terminal exact
`wsl-chrome-3` catalog asset with provider-capable callbacks disabled, and run
at most one direct `maxItems=1` canary before any scheduler or wider-completion
resume.

## Current State

- Plan 0238 closed at pushed commit `7b5e7354`; focused history-materialization
  validation passed 74/74 and the known readable DOCX now skips exact admission
  with zero provider-boundary calls.
- The source repair is not installed. The current API remains PID 8247,
  active/running with zero systemd restarts.
- The account-mirror scheduler remains operator-paused. Current completion
  metrics are active 6, queued 0, running 0, idle-waiting 1, and paused 5.
  `wsl-chrome-3` is the sole idle-waiting ChatGPT target at pass 51 with no
  next attempt or error; wider ChatGPT lanes remain paused at passes 7/2/34.
- Active `wsl-chrome-3` history-materialization jobs are zero. The exact
  managed browser profile and port 45015 are absent.
- The retained broad provider-free selector still reaches one disabled seam
  for conversation `6a5e4bf8-972c-83ea-ad2f-3ad57f2a153f`; the first exact
  cached DOCX is terminal, so a fresh bounded exact-candidate resolution is
  required before live work.

## Authority And Non-Goals

- The operator's standing `ok go` authority and explicit request to get the
  path running authorize this bounded successor under the unchanged objective.
- Authorized effects: one user-runtime/service install path, the resulting one
  API restart, provider-free in-memory selection, and—only after the exact gate
  passes—one direct durable history-materialization job on `wsl-chrome-3` with
  one provider attempt and ordinary exact-profile cleanup.
- Authorized repo writes: this plan, journal/fix evidence, bounded diagnostic
  harnesses when needed, and ordinary commits/pushes after green validation.
- Excluded: scheduler control, completion control including pass 52, provider
  guard control, retry, force, snapshot refresh, prompt submission, ChatGPT
  `Answer now`, a second durable job, a second browser launch, ad hoc candidate
  substitution after the gate freezes an ID, and wider materialization.
- Critical-path owner: primary agent. `subagent_status=not_spawned` because the
  install, retained-state selector, and live canary share one serialized runtime
  and have no independent safe lane.

## Execution Graph

1. Opening plan/audit/commit/push and stopped-runtime readback.
2. One `install:user-runtime-service` execution; prove service health and exact
   source/installed bundle parity.
3. In-memory broad `maxItems=1` selection plus bounded exact-candidate
   simulations with every provider-capable callback replaced by a throwing
   disabled seam.
4. Closed-world gate on one exact item: selector agreement, no readable local
   archive family, no terminal matching job family, no active duplicate, and
   exact browser absent.
5. If the gate passes, create one direct exact-catalog job with `maxItems=1`,
   `force=false`, and `refreshSnapshot=false`; monitor that job only to a
   terminal result.
6. Recheck exact browser cleanup, active-job zero, service health, scheduler
   pause, target pass 51, and unchanged wider completion posture. No control
   resume belongs to this plan.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 slices`.
- `max_codegraph_calls: 3`; `max_provider_free_broad_simulations: 1`;
  `max_provider_free_exact_simulations: 8`.
- `installs: 1`; `service_restarts: 1`; `durable_history_jobs: 1`;
  `job_attempts: 1`; `browser_launches: 1`; `browser_closes: 1`;
  `downloads: 1`; `provider_callbacks: canary_only`.
- `scheduler_actions: 0`; `completion_actions: 0`; `guard_actions: 0`;
  `retries: 0`; `force_actions: 0`; `snapshot_refreshes: 0`;
  `prompt_or_answer_now_actions: 0`; `wider_materialization_actions: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0` because the goal-level discovery pass is already
  consumed; `review_verification_mode: closed_world`.
- `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`.
- `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`.
- `checkpoint_record_fields: plan_version, state_transition,
  progress_classification, evidence, subagent_status, next_action_or_stop_reason,
  authority_classification, review_disposition_summary`.

## Hard Stops

- Install/source parity fails, API does not return healthy, or the scheduler,
  completion, active-job, or exact-browser opening boundary changes unexpectedly.
- Provider-free resolution cannot freeze one exact nonterminal asset inside the
  eight-candidate ceiling.
- The frozen item has readable bytes, terminal-family evidence, an active
  duplicate, ambiguous provider/runtime/identity ownership, or requires
  `force=true`/snapshot refresh to proceed.
- The live job reports auth conflict, identity mismatch, CAPTCHA/challenge,
  human verification, provider guard, `Answer now`, or any request for a prompt
  submission.
- The one job fails, times out, or skips without materializing the frozen asset.
  Record the terminal evidence and do not retry under this plan.

## Acceptance Criteria

- [ ] The source and installed runtime carry byte-equivalent
  `historyMaterializationService` output, and the restarted API is healthy.
- [ ] A provider-free broad `maxItems=1` simulation and bounded exact replay
  freeze one exact catalog asset that reaches only the disabled provider seam.
- [ ] Closed-world archive, job, filesystem, active-work, and exact-browser
  evidence proves the frozen item is nonterminal before live creation.
- [ ] Exactly one direct `wsl-chrome-3` job runs at `maxItems=1`, attempt count
  one, with `force=false` and no snapshot refresh.
- [ ] The canary terminal result contains one readable checksummed asset for the
  frozen exact item, with no auth/challenge/guard/pending-operation failure.
- [ ] Final service and exact-browser cleanup are healthy, active history work
  is zero, scheduler remains paused, `wsl-chrome-3` remains pass 51, and wider
  completion passes remain unchanged at 7/2/34.
- [ ] Plan/journal/fix evidence, validation, commit, and push are complete.

## Opening Checkpoint | Installed One-Canary Gate Ready

- `checkpoint_id`: `P0239-C01`.
- `state_transition`: P0238_CLOSED_PROVIDER_FREE_REPAIR_COMPLETE ->
  P0239_ACTIVE_INSTALLED_ONE_CANARY_GATE.
- `progress_classification`: blocker_reduction.
- `evidence`: clean/synced `main` at `7b5e7354`; CodeGraph index healthy at 879
  files and 16,610 nodes; API PID 8247 healthy; scheduler paused; queued/running
  completions zero; exact active jobs and exact browser zero.
- `owned_changes`: this plan and one journal checkpoint before installation.
- `subagent_status`: not_spawned; no independent safe lane across shared
  installed/runtime/browser state.
- `next_action_or_stop_reason`: audit, commit, and push this gate; re-read the
  stopped boundary; then execute the one install/service restart.
- `authority_classification`: ordinary bounded successor under the standing
  goal; scheduler and wider-completion resume remain explicitly excluded.
- `review_disposition_summary`: exact terminal admission is accepted as fixed;
  fresh nonterminal exact selection is the sole live admission gate.
