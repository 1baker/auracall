# WSL Chrome 3 Abort Repair One-Canary Gate | 0256-2026-08-10

State: OPEN
Lane: P01
Plan version: 1
Gate state: PREPARED_AWAITING_LIVE_EFFECT_APPROVAL
Goal execution state: PAUSED_AT_APPROVAL_GATE

## Stable Goal Objective

After explicit approval and fresh clean admission, install the provider-free
Plan 0255 repair once and run exactly one fresh zero-retry `wsl-chrome-3`
conversation-context canary. Prove the preflight launch no longer outlives its
deadline and retain the sanitized terminal receipt. Do not materialize assets,
control a completion, resume the scheduler, or widen to another route/profile.

## Current State

- Plan 0254's sole canary made zero provider attempts and timed out in
  `preflight:buildListOptions`; direct agent-browser inspection had already
  proved the authenticated provider surface healthy.
- Plan 0255 passes the same context abort signal through managed-browser target
  and native WSL Chrome launch, joins launcher cleanup before abort rejection,
  and correctly unwraps the cache receipt envelope.
- Provider-free validation passes 19 focused tests, 109 broader browser/context
  tests, 2777 full-suite tests, typecheck, build, lint, diff checks, and plan
  audit. The source repair is not installed.
- Final admission reports API PID 64314 active/running with `NRestarts=0`,
  scheduler paused/paused, active history materialization jobs zero,
  `wsl-chrome-3` idle-waiting/pass 56, and zero exact default or
  `wsl-chrome-3` Chrome owners.

## Authority And Effect Boundary

- Preparation is provider-free and complete. A later explicit approval must
  cover one install, one API restart, one exact source/installed parity check,
  one managed-browser launch, one context read, and one exact owned cleanup.
- The sole route is conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`; the exact child command retains
  `--refresh --retry-attempts 0 --timeout-ms 120000 --json-only`.
- Prompts, clicks, downloads, uploads, `Answer now`, materialization,
  completion controls, scheduler controls, guard/config changes, direct
  runtime-state edits, wider profiles, and a second attempt remain excluded.

## Execution Packet After Approval

1. Re-read Git, service, scheduler, completion, active-job, exact-browser, and
   provider-guard admission. Stop on drift or any exact browser owner.
2. Install current committed source once, restart only the AuraCall API, and
   require active/running health, `NRestarts=0`, and exact source/installed
   adapter plus browser-service parity.
3. Run the redaction-safe context harness once. Stop on login, CAPTCHA,
   challenge, identity mismatch, `Answer now`, timeout, or any ambiguous
   receipt. Never retry.
4. Close only the canary-owned browser and prove exact owners/jobs return to
   zero while scheduler and both tracked completions remain unchanged.

## Acceptance Criteria

- [ ] Explicit approval and fresh drift-free admission are recorded.
- [ ] Installed/source repair parity follows one healthy API restart.
- [ ] The sole canary returns current nonempty context and one sanitized
  successful receipt with no pending operation.
- [ ] Exact browser/job cleanup returns to zero.
- [ ] `wsl-chrome-3` remains pass 56, default remains blocked/pass 9, and
  scheduler remains paused/paused.
- [ ] Materialization, completion, scheduler, guard, retry, and wider-profile
  effects remain zero.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`;
  `max_browser_closes: 1`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_guard_actions: 0`; `max_direct_runtime_edits: 0`;
  `max_subagents: 0`.

## Preparation Checkpoint | Repair Validated And Gate Frozen

- `checkpoint_id`: `P0256-C01`.
- `state_transition`: P0256_OPEN -> P0256_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: canary_prepared.
- `evidence`: Plan 0255's provider-free closeout and fresh read-only runtime
  admission are green; exact browser owners and active history jobs are zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before install or provider/browser work
  until this exact one-canary live-effect packet is explicitly approved.
- `authority_classification`: preparation only; all listed live/runtime/control
  effects remain excluded before approval.
- `review_disposition_summary`: another Plan 0254 attempt is rejected. One new
  successor canary is prepared because it validates a newly installed
  cancellation contract under a fresh, separately bounded gate.

## Definition Of Done

The installed repair passes one fresh zero-retry canary and exact cleanup while
all scheduler, completion, materialization, guard, retry, and wider effects
remain zero. Any failure closes this plan immediately without another attempt.
