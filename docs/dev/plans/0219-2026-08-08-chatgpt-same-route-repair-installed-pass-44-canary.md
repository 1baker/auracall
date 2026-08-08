# ChatGPT Same-Route Repair Installed Pass-44 Canary | 0219-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: EXACT_PASS44_EFFECT_AUTHORIZED
Goal execution state: ACTIVE_FROZEN_EFFECT_PACKET

## Stable Goal Objective

After separate explicit operator approval, install the pushed Plan 0218
same-route handoff repair exactly once, restart only the AuraCall API exactly
once, prove installed/source adapter parity and unchanged stopped controls, then
run and settle one fresh `wsl-chrome-3` pass-44 canary. Do not resume another
completion or the scheduler.

## Current State

- Pushed source commit `835f0dfb` removes the redundant conversation-ready
  evaluation after `navigateAndSettle` has already proved the same route,
  document readiness, and ready surface or thrown.
- The exact fake-CDP test was red in 37 ms with a fifth unsettled
  `Runtime.evaluate` and is green with exactly four evaluations plus the
  `chatgpt.skipSameRouteNavigation` marker.
- Integrated provider-free validation passes `304/304`, plus typecheck,
  zero-warning touched Biome, production build, plan audit with zero validation
  errors, and diff check.
- Built source adapter SHA-256 is
  `688442b51b7769b80df67e860bd96b53e1ff350fbd4bca4f51750b94d77ef0b7`.
  Installed runtime intentionally remains the Plan 0216/0217 hash
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`.
- API PID 81696 is active/running with `NRestarts=0`; scheduler state/posture
  paused; active history jobs `0`; default, `wsl-chrome-2`, and `wsl-chrome-4`
  paused at passes `7/2/34`; and target `wsl-chrome-3` blocked/pass `43` with
  force ceiling null and `account_mirror_materialization_failed`.

## Authority And Scope

- This artifact prepares but does not authorize a live effect. A later
  explicit operator approval is required before any install, restart,
  provider/browser call, completion control, or materialization start.
- If separately approved without revision, the effect envelope is exactly one
  user-runtime install, one AuraCall API restart, one adapter parity check, and
  one `run-one-pass` control on completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`.
- Read-only monitoring may cover only that parent, its one fresh child, service
  health, scheduler posture, active jobs, and the three wider intended ChatGPT
  completions.
- No second install/restart, retry, second canary, pass 45, other completion
  control, scheduler control, prompt, `Answer now`, click, manual navigation,
  guard bypass, runtime JSON edit, Gemini/Grok change, or account-library apply
  belongs to this gate.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Frozen Effect Packet After Separate Approval

1. Require clean pushed source at or after `835f0dfb`, rebuilt adapter hash
   `688442b5...ef0b7`, installed prior hash `1ccee21f...a7ed667`, API PID 81696
   active/running with zero restarts, scheduler paused, active jobs zero, and
   target states/pass counts unchanged at `7/2/34/43`.
2. Run `pnpm run install:user-runtime` exactly once. Require installed
   `dist/src/browser/providers/chatgptAdapter.js` SHA-256 to equal the rebuilt
   source hash before any restart.
3. Restart `auracall-api.service` exactly once. Wait for active/running with no
   crash restart; reconfirm scheduler paused, active jobs zero, and all four
   intended targets unchanged.
4. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
5. Require parent pass `43 -> 44`, exactly one fresh child, and no pass 45.
   Monitor the full child result and promoted per-conversation receipts until
   both child and parent are terminal.
6. Reconfirm default paused/pass 7, `wsl-chrome-2` paused/pass 2,
   `wsl-chrome-4` paused/pass 34, scheduler paused, and active jobs zero. Stop;
   do not resume wider completion or scheduler work.

## Clean Canary Proof

- The fresh child matches every provider-session identity dimension and has no
  provider-guard exclusion, CAPTCHA/challenge, or auth conflict.
- Every selected conversation context settles on its sole attempt, retains a
  terminal promoted receipt, and does not time out after
  `provider:chatgpt.skipSameRouteNavigation` or at another inner stage.
- Child failed count is zero; no selected materialization entry fails; parent
  force ceiling clears and parent settles without
  `account_mirror_materialization_failed`.
- No prompt/composer mutation, second child, pass 45, other completion movement,
  or scheduler movement occurs. API stays healthy and active jobs return zero.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_authority_commits: 1`;
  `max_closeout_commits: 1`; `max_installs: 1`;
  `max_service_restarts: 1`; `max_canary_controls: 1`;
  `max_canary_attempts: 1`; `max_child_jobs: 1`;
  `max_other_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_source_changes: 0`; `max_browser_clicks: 0`;
  `max_browser_navigations: 0`; `max_prompt_submissions: 0`;
  `max_answer_now_clicks: 0`; `max_guard_bypass_actions: 0`;
  `max_direct_runtime_json_edits: 0`; `max_subagents: 0`.

## Acceptance Criteria

- [x] Separate explicit operator approval activates this exact effect packet.
- [ ] One install and one restart produce installed/source adapter parity and a
  healthy API while scheduler/target posture stays frozen.
- [ ] The exact pass-44 canary creates one fresh child and both settle with the
  clean-canary proof; no pass 45 occurs.
- [ ] Default, `wsl-chrome-2`, and `wsl-chrome-4` remain unchanged; scheduler
  stays paused and active jobs return zero.
- [ ] Exact receipts are audited, committed, and pushed without wider resume.

## Hard Stops

- Stop before all live effects until the operator explicitly approves this
  exact plan.
- Once approved, stop on dirty/unpushed source, hash mismatch, unhealthy
  service, unexpected target/scheduler movement, more than one child, pass 45,
  any context timeout or failed item, identity mismatch, provider guard,
  CAPTCHA/challenge, auth conflict, or prompt/composer mutation.
- A failed canary closes this plan fail-closed. No retry, repair, second
  install/restart, other completion control, or scheduler control is implied.
- A clean canary proves only `wsl-chrome-3` repaired-lane readiness. Wider
  completion or scheduler resume requires another explicit gate.

## Checkpoint 1 | Exact Pass-44 Gate Prepared And Withheld

- `checkpoint_id`: `P0219-C01`
- `state_transition`: P0218_PROVIDER_FREE_REPAIR_GREEN ->
  PASS44_EFFECT_GATE_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: readiness_gain.
- `source_authority`: pushed repair commit `835f0dfb`; built adapter SHA-256
  `688442b51b7769b80df67e860bd96b53e1ff350fbd4bca4f51750b94d77ef0b7`.
- `installed_runtime`: intentionally prior adapter SHA-256
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`.
- `runtime_readback`: API PID 81696 active/running, zero restarts; scheduler
  paused; active jobs zero; intended target states/pass counts `7/2/34/43`.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  completion controls 0, materialization starts 0, scheduler controls 0.
- `next_action_or_stop_reason`: stop at the approval boundary. Execute nothing
  until the operator separately authorizes Plan 0219.

## Checkpoint 2 | Exact Pass-44 Effect Authorized

- `checkpoint_id`: `P0219-C02`
- `state_transition`: PASS44_EFFECT_GATE_PREPARED_AWAITING_APPROVAL ->
  EXACT_PASS44_EFFECT_AUTHORIZED.
- `progress_classification`: authority_gain.
- `authority_classification`: the operator explicitly activated objective
  `execute plan 219`; authority is limited to the unchanged frozen one-install,
  one-restart, one-control packet and its read-only terminal monitoring.
- `source_authority`: clean synchronized `main` at pushed commit `d5844da1`,
  containing repair commit `835f0dfb`; rebuilt adapter SHA-256
  `688442b51b7769b80df67e860bd96b53e1ff350fbd4bca4f51750b94d77ef0b7`.
- `installed_runtime`: intentionally prior adapter SHA-256
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`.
- `runtime_readback`: API PID 81696 active/running with `NRestarts=0`;
  scheduler paused; active history jobs zero; intended targets remain
  paused/pass 7, paused/pass 2, paused/pass 34, and blocked/pass 43 with target
  force ceiling null.
- `effect_accounting`: installs 0/1, restarts 0/1, provider/browser calls 0,
  completion controls 0/1, fresh child jobs 0/1, scheduler controls 0.
- `subagent_status`: not spawned; delegation was not requested and Plan 0219
  permits none.
- `review_disposition_summary`: every frozen precondition matches; no hard stop
  fired. The provider-free evidence is accepted only as install readiness, not
  as live effectiveness proof.
- `next_action_or_stop_reason`: audit, commit, and push this authority
  checkpoint; then run the single install/parity/restart/preflight/control
  sequence, stopping on the first mismatch.
