# ChatGPT Fallback-Body Installed Pass-49 Canary | 0227-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_ONE_CANARY_PREPARED
Goal execution state: ACTIVE_TURN_1_OF_10

## Stable Goal Objective

Install the pushed Plan 0226 fallback response-body deadline once, restart only
the AuraCall API once, and execute exactly one fresh `wsl-chrome-3` canary at
pass `48 -> 49`. Do not resume the scheduler or any wider completion. If the
canary is unsuccessful, prepare and run one fresh exact-profile agent-browser
session that emulates the production `404 -> network events -> reload ->
getResponseBody` sequence before another source change or canary.

## Current State

- Provider-free Plan 0226 deterministically reproduced the defect: after the
  direct 404 and exact fallback events, a never-settling
  `Network.getResponseBody` left the reader pending beyond 10001 ms.
- The repair keeps the outer fallback deadline and independently bounds the
  response-body request at 9000 ms. Its exact test resolves null at 9001 ms;
  the full adapter suite passes 150/150 and the integrated gate passes 306/306.
- Rebuilt source adapter SHA-256 is
  `14668c680a393fd89495c97005486471d3535f9084de0c630e4d0887d8dc6045`;
  installed runtime intentionally remains
  `919e2529f2c2e59ad7d29d0b48377eac82ddf7aa8c04009012082d6d9509f4b9`.
- API PID 95638 is active/running with `NRestarts=0`; scheduler is paused;
  active history jobs are zero; wider ChatGPT completions are paused at
  `7/2/34`; target completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446` is blocked at
  pass 48 with force ceiling null; exact managed-browser processes are zero.

## Authority And Scope

- The standing operator goal authorizes this one install, one API restart, one
  exact target `run-one-pass`, and read-only monitoring through terminal proof.
- The canary must create exactly one fresh child and may advance only pass
  `48 -> 49`. A retry, pass 50, scheduler control, or wider completion control
  is excluded.
- Read-only monitoring may inspect service health, scheduler posture, target
  completion, the fresh child and promoted receipts, active jobs, provider
  guards, and wider completion pass counts.
- An unsuccessful canary does not authorize another repair or canary. It
  requires a separately committed exact-profile agent-browser packet under the
  same standing goal, using the failed canary's concrete conversation evidence.
- No manual browser mutation, prompt/composer action, `Answer now`, guard
  bypass, direct runtime JSON edit, second install, or second restart belongs
  to this packet.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Execution Packet

1. Require a clean, synchronized, pushed authority commit; exact source/prior
   installed hashes above; healthy API; scheduler paused; active jobs zero;
   wider passes `7/2/34`; target blocked/pass 48/force null; and clear ChatGPT
   provider guards.
2. Run `pnpm run install:user-runtime` exactly once. Require installed
   `dist/src/browser/providers/chatgptAdapter.js` SHA-256 to equal the rebuilt
   source hash.
3. Restart `auracall-api.service` exactly once. Require active/running with
   `NRestarts=0`, unchanged stopped controls, and no active job.
4. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
5. Require parent pass `48 -> 49`, exactly one fresh child, and no pass 50.
   Monitor the full child metrics and each promoted conversation-context
   receipt until child and parent settle.
6. Classify the canary against Clean Canary Proof below. Re-read service,
   scheduler, jobs, wider completions, target force ceiling, and guards.
7. On clean proof, close successfully. On any unsuccessful terminal outcome,
   stop canary/control work and prepare one exact-profile agent-browser
   discrepancy plan before any further source/live attempt.

## Clean Canary Proof

- Exactly one fresh child reaches terminal state without retry or reuse.
- Provider identity matches all bound dimensions and provider-guard exclusions
  remain zero.
- No conversation-context timeout or other retryable failure remains; parent
  settles without `account_mirror_materialization_failed` and force null.
- Legitimate skips are allowed, but no selected item remains failed.
- Scheduler remains paused, wider passes remain `7/2/34`, active jobs return
  to zero, and API remains healthy.

## Acceptance Criteria

- [ ] Plan is audited, committed, and pushed before effects.
- [ ] Exactly one install and one restart produce source/runtime hash parity and
  a healthy stopped-control preflight.
- [ ] Exactly one fresh child is bound to pass `48 -> 49`; no pass 50 occurs.
- [ ] Terminal metrics, identity/guard evidence, and promoted receipts are
  recorded and classified against Clean Canary Proof.
- [ ] Scheduler and wider completions never resume; excluded effects remain
  zero.
- [ ] A failed/blocked/otherwise unsuccessful outcome transitions to one fresh
  exact-profile deterministic agent-browser plan before further repair/canary.
- [ ] Final runtime readback, docs, plan audit, commit, and push are complete.

## Local Goal Bounds

- `max_canary_attempts: 1`; `max_installs: 1`; `max_service_restarts: 1`;
  `max_target_completion_controls: 1`; `max_scheduler_controls: 0`;
  `max_wider_completion_controls: 0`; `max_manual_browser_navigations: 0`;
  `max_browser_tools_mutations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`;
  `max_review_rework_cycles: 1`; `checkpoint_interval: 1 canary`.

## Hard Stops

- Stop on CAPTCHA, human verification, auth/identity mismatch, provider guard,
  provider cooldown requiring bypass, API crash/restart, scheduler movement,
  wider completion movement, more than one fresh child, active-job overlap,
  or any need to weaken an existing deadline/guard.
- Stop after the one canary regardless of outcome. Do not retry or issue pass
  50.
- An unsuccessful canary requires the exact-profile agent-browser discrepancy
  session before another source change, install, restart, or canary.
- No result in this packet authorizes scheduler or wider completion resume.

## Checkpoint 1 | One-Canary Gate Prepared

- `checkpoint_id`: `P0227-C01`.
- `state_transition`: P0226_COMPLETE_PROVIDER_FREE_REPAIR_CANARY_PREPARED ->
  P0227_AUTHORIZED_ONE_CANARY_PREPARED.
- `progress_classification`: outcome_progress.
- `authority_classification`: standing operator authority for the bounded
  repair/canary continuation and mandatory post-failure direct inspection.
- `evidence`: exact red/green, integrated provider-free validation, exact
  source/installed hash mismatch, and stopped runtime readbacks above.
- `effect_accounting`: installs 0/1, restarts 0/1, canaries 0/1, target
  controls 0/1; scheduler, wider completion, manual browser, prompt,
  `Answer now`, guard-bypass, runtime-edit, and subagent effects zero.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: one installed outcome is required to distinguish
  a sufficient repair from a remaining live browser/CDP discrepancy.
- `next_action_or_stop_reason`: audit, commit, and push, then consume the sole
  install/restart/canary packet. If unsuccessful, prepare the mandatory fresh
  exact-profile agent-browser emulation before any further repair or canary.
