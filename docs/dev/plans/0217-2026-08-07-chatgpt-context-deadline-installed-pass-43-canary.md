# ChatGPT Context Deadline Installed Pass-43 Canary | 0217-2026-08-07

State: OPEN
Lane: P01
Plan version: 1
Outcome: EXACT_CANARY_GATE_PREPARED
Goal execution state: NOT_AUTHORIZED
Gate state: LIVE_EFFECT_WITHHELD

## Stable Goal Objective

After separate explicit approval, install the pushed Plan 0216 context-deadline
repair exactly once, restart only the AuraCall API exactly once, prove installed
hash and stopped-runtime parity, then run and settle one fresh `wsl-chrome-3`
pass-43 canary. Do not resume any other completion or the scheduler.

## Current State

- Plan 0216 provider-free commits `32382bcf` and `741d11b9` promote bounded
  context receipts, add browser/protocol/transport payload deadlines, and make
  retained-session abort cleanup evicting and awaitable.
- The integrated provider-free gate passes `303/303`, plus typecheck,
  zero-warning touched Biome, production build, plan audit with zero validation
  errors, and diff check.
- Built source adapter SHA-256 is
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`.
  Installed runtime intentionally remains the Plan 0214 hash
  `11f31a2e804a1ca7ff8856d053a61ab37d017500feb8a6e2fe2913306264b978`.
- API PID 17440 is active/running with zero restarts. Default is paused/pass 7,
  replacement `wsl-chrome-2` paused/pass 2, `wsl-chrome-4` paused/pass 34,
  `wsl-chrome-3` blocked/pass 42 with no force ceiling, scheduler paused, and
  active history jobs zero.

## Authority And Scope

- This artifact prepares but does not authorize the live effect. A later
  explicit operator approval is required before any install, restart,
  provider/browser call, completion control, or materialization start.
- If approved without revision, the effect envelope is exactly one user-runtime
  install, one AuraCall API restart, one source/installed adapter parity check,
  and one `run-one-pass` control on completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`.
- Read-only monitoring may cover only the exact parent, its one fresh child,
  service health, scheduler posture, active jobs, and the three other intended
  ChatGPT completions.
- No second install, second restart, retry, second canary, other completion
  control, scheduler control, prompt, `Answer now`, click, navigation, guard
  bypass, direct runtime JSON edit, Gemini/Grok change, or account-library apply
  belongs to this gate.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Frozen Effect Packet After Separate Approval

1. Require clean pushed source at or after `741d11b9`, rebuilt adapter hash
   `1ccee21f...a7ed667`, API PID 17440 active with zero restarts, scheduler
   paused, active jobs zero, and target states/pass counts unchanged at
   7/2/34/42.
2. Run `pnpm run install:user-runtime` exactly once. Require installed
   `dist/src/browser/providers/chatgptAdapter.js` SHA-256 to equal the rebuilt
   source hash before any restart.
3. Restart `auracall-api.service` exactly once. Wait for active/running with no
   crash restart; reconfirm scheduler paused, active jobs zero, and all four
   target states unchanged.
4. Issue exactly:
   `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`.
5. Require parent pass `42 -> 43`, exactly one fresh child, and no pass 44.
   Monitor the full child result and promoted context-read receipts until both
   child and parent are terminal.
6. Reconfirm default paused/pass 7, `wsl-chrome-2` paused/pass 2,
   `wsl-chrome-4` paused/pass 34, scheduler paused, and active jobs zero. Stop;
   do not resume wider completion or scheduler work.

## Clean Canary Proof

- The one fresh child matches all provider-session identity dimensions.
- Every selected conversation context is terminal without timeout; full job
  evidence retains the bounded per-conversation receipt and reaches an exact
  completion stage.
- Child failed count is zero; no selected materialization entry fails; parent
  force ceiling clears and parent settles without
  `account_mirror_materialization_failed`.
- No provider guard, CAPTCHA/challenge, auth conflict, prompt/composer mutation,
  second child, pass 44, or other completion movement occurs.
- API is healthy, active jobs return zero, and scheduler remains paused.

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

- [ ] Separate explicit operator approval activates this exact effect packet.
- [ ] One install and one restart produce source/installed adapter hash parity
  and a healthy API while the stopped scheduler/target posture stays frozen.
- [ ] The exact pass-43 canary creates exactly one fresh child and both settle
  with clean-canary proof; no pass 44 occurs.
- [ ] Default, replacement `wsl-chrome-2`, and `wsl-chrome-4` remain unchanged;
  scheduler stays paused and active jobs return zero.
- [ ] Exact receipts are recorded, audited, committed, and pushed without any
  wider completion or scheduler resume.

## Hard Stops

- Stop before all live effects until the operator explicitly approves this
  exact plan.
- Once approved, stop on dirty/unpushed source, hash mismatch, unhealthy
  service, unexpected target/scheduler movement, more than one child, pass 44,
  any context timeout or failed item, identity mismatch, provider guard,
  CAPTCHA/challenge, auth conflict, or prompt/composer mutation.
- A failed canary closes this plan fail-closed. No retry, repair, second
  install/restart, other completion control, or scheduler control is implied.
- A clean canary proves only `wsl-chrome-3` repaired-lane readiness. Wider
  completion or scheduler resume requires another explicit gate.

## Checkpoint 1 | Exact Pass-43 Gate Prepared And Withheld

- `checkpoint_id`: `P0217-C01`
- `state_transition`: P0216_PROVIDER_FREE_REPAIR_GREEN ->
  PASS43_EFFECT_GATE_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: readiness_gain.
- `source_authority`: pushed repair commit `741d11b9`; built adapter SHA-256
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`.
- `runtime_readback`: API PID 17440 active/running, zero restarts; scheduler
  paused; active history jobs zero; target states/pass counts 7/2/34/42.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  completion controls 0, materialization starts 0, scheduler controls 0.
- `next_action_or_stop_reason`: stop at the approval boundary. Execute nothing
  until the operator separately authorizes Plan 0217.
