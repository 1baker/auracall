# Structured-Exception Installed Pass-56 Canary | 0246-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Goal execution state: ACTIVE
Gate state: AUTHORIZED_PRE_INSTALL

## Stable Objective

Install the provider-free structured-exception eligibility repair, prove exact
source/installed parity, and run one fresh `wsl-chrome-3` pass-56 canary while
the scheduler and all wider completions remain paused.

## Current State

- Source is provider-free green at adapter hash
  `ff3fe974478c6f28b975c82444a122c60759bc9404d4518337e1396c90d8baf6`;
  installed runtime remains the pass-55 hash `4b2dca82...c4725`.
- Target is blocked/pass 55 with force/next null after sole child
  `hmj_4abf109417184cfc8866c0563e89c567` failed six external images. Active
  jobs and exact browser are zero; API PID 93478 is healthy; scheduler is
  paused/idle; wider passes are `7/2/34`; guards are clear.
- The operator explicitly refilled the attempt budget and activated this
  unchanged packet. The pre-install audit/commit/push gate remains mandatory.

## Frozen Effect Packet

1. Re-read clean/pushed Git, built hash, installed mismatch, API health,
   scheduler pause/idle, target blocked/pass 55 with null force/next, wider
   passes `7/2/34`, clear guards, active jobs zero, and exact browser absence.
2. Run one `install:user-runtime-service`; require one healthy API restart and
   exact adapter parity at `ff3fe974...d8baf6` with stopped state unchanged.
3. Invoke exactly once:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --port 18095 --timeout-ms 15000 --json`.
4. Require only pass 56, one child/attempt, `maxItems=6`, force false, matching
   identity, and honored provider-work pacing. Monitor to terminal and parent
   absorption without retry.
5. Verify each materialized file/checksum/archive receipt if present, exact
   artifact telemetry, browser/job cleanup, API health, scheduler pause, wider
   passes, guards, and no pass 57. Close docs/audit/commit/push.

## Local Goal Bounds

- `installs: 1`; `api_restarts: 1`; `completion_controls: 1`;
  `pass_advances: 1`; `fresh_children: 1`; `child_attempts: 1`;
  `per_pass_max_items: 6`; `browser_launches: 1`.
- `scheduler_actions: 0`; `other_completion_actions: 0`;
  `pass_57_actions: 0`; `retries: 0`; `force_mutations: 0`;
  `config_mutations: 0`; `guard_actions: 0`; `direct_runtime_json_edits: 0`;
  `prompt_submissions: 0`; `browser_clicks: 0`; `answer_now_actions: 0`;
  `duplicate_profile_processes: 0`; `subagents: 0`.

## Hard Stops

- Stop before install/control on any Git/hash/API/scheduler/target/wider/guard/
  active-job/browser drift or ownership ambiguity.
- Stop after the sole control regardless of outcome. Any timeout, failed item,
  auth/challenge/identity signal, fanout, missing receipt, pass 57, or cleanup
  failure ends the packet without retry, substitution, or wider resume.

## Acceptance Criteria

- [x] Operator explicitly activates this unchanged effect packet.
- [ ] One install/restart yields exact adapter parity and healthy frozen state.
- [ ] One control advances only pass 55 to 56 with one child/attempt and no
  retry or pass 57.
- [ ] Terminal child and parent absorption have complete identity, artifact,
  file/archive, browser/job, scheduler/wider/guard receipts.
- [ ] Plan/docs/audit/commit/push close the packet; scheduler and wider
  completions remain paused.

## Prepared Gate | Awaiting Explicit Approval

- `checkpoint_id`: `P0246-C01`.
- `state_transition`: P0245_COMPLETE_PROVIDER_FREE_CANARY_GATE_PREPARED ->
  P0246_PLANNED_AWAITING_EFFECT_APPROVAL.
- `progress_classification`: authority_preparation.
- `evidence`: exact pass-55 failure branch reproduced and repaired
  provider-free; built/installed hash mismatch intentionally retained; stopped
  runtime boundary above.
- `next_action_or_stop_reason`: do not install or run pass 56 until explicit
  operator approval activates this exact packet.
- `authority_classification`: fresh effect approval required because Plan 0244
  consumed its one install and one canary.

## Activation Checkpoint | Fresh Budget Authorized

- `checkpoint_id`: `P0246-C02`.
- `state_transition`: P0246_PLANNED_AWAITING_EFFECT_APPROVAL ->
  P0246_ACTIVE_AUTHORIZED_PRE_INSTALL.
- `progress_classification`: authority_activation.
- `evidence`: operator instruction, "Okay refill your attempt budget and
  continue"; clean/synced Git at `b36f66a7`; provider-free source hash
  `ff3fe974...d8baf6`; deliberately stale installed hash
  `4b2dca82...c4725`; most recent stopped-state readback remained target
  blocked/pass 55, active jobs and exact browser zero, scheduler paused/idle,
  wider passes `7/2/34`, and guards clear.
- `next_action_or_stop_reason`: audit/commit/push this activation, then perform
  a fresh admission readback before the sole install/restart.
- `authority_classification`: one renewed execution window for the unchanged
  frozen packet; no scheduler, wider-completion, pass-57, retry, prompt, click,
  or `Answer now` authority.
