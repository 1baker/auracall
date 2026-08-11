# WSL Chrome 3 Payload-Route Class One-Canary Gate | 0264-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: PREPARED_AWAITING_APPROVAL
Goal execution state: PAUSED_AT_LIVE_EFFECT_GATE

## Current State

Plan 0262 consumed its one live attempt and reproduced generic post-payload
route loss. Plan 0263 is provider-free green and now binds the same failure to
one closed payload-shape plus route class. The new build is not installed.
API PID 85444 is healthy, scheduler is paused/paused, the target remains pass
56, active work and exact browser ownership are zero.

## Stable Objective

After separate approval and fresh drift-free admission, install the Plan 0263
diagnostic once and run one exact zero-retry context canary for conversation
`6a40724d-8688-83ea-ab36-7458e921ed19` on `wsl-chrome-3`. Accept current
context, exact terminal unavailability, or one exact closed payload-route
failure stage as a classified diagnostic. Clean up exactly and stop.

## Authority And Non-Goals

- Proposed effects: one combined user-runtime install/API restart, one source
  parity read, one managed-browser launch, one context attempt, one sanitized
  receipt read, and one exact owned cleanup.
- The child remains `--target chatgpt --refresh --retry-attempts 0 --timeout-ms
  120000 --json-only` under a 150000 ms command deadline.
- No materialization, completion/scheduler control, prompt, model selection,
  click, download/upload, retry, guard/config change, direct runtime edit,
  other route, or wider profile.
- No command below is authorized by this plan's existence.

## Acceptance Criteria

- [x] Provider-free payload-route localization and exact harness acceptance of
  only the closed matrix are green.
- [ ] Separate explicit approval and fresh zero-owner admission.
- [ ] One install/restart establishes exact source/installed parity and healthy
  API with `NRestarts=0`.
- [ ] Exactly one attempt yields context, exact terminal unavailability, or a
  stage matching the closed payload-shape/route-class matrix.
- [ ] Exact owned cleanup returns browser/job counts and port 45015 to zero.
- [ ] Target remains pass 56 and scheduler remains paused/paused.
- [ ] Every excluded effect remains zero.

## Frozen Future Command Packet | Withheld

1. Require clean/synchronized Git, healthy API, scheduler paused/paused, target
   idle-waiting/pass 56 with null error/next/force, zero queued/running
   completions and active history jobs, and zero exact owners/port listeners.
2. Run `pnpm run install:user-runtime-service` exactly once and no separate API
   restart. Require API active/running with `NRestarts=0` and exact hash parity.
3. Run exactly once:

   ```text
   pnpm tsx scripts/chatgpt-context-canary.ts --profile wsl-chrome-3 --conversation-id 6a40724d-8688-83ea-ab36-7458e921ed19 --timeout-ms 120000 --command-timeout-ms 150000 --auracall-bin /home/ecochran76/.local/bin/auracall
   ```

4. Inspect port 45015 with the exact profile-scoped browser-tools command and
   run one force cleanup only when it attributes the listener to this canary.
5. Re-read API, hashes, scheduler, target, work counts, owners, and port. Stop
   without retry under every outcome.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`;
  `max_browser_closes: 1`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_model_selections: 0`; `max_prompt_submissions: 0`;
  `max_downloads: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Preparation Checkpoint | Classified Canary Withheld

- `checkpoint_id`: `P0264-C01`.
- `state_transition`: P0263_CLOSED_PROVIDER_FREE_VALIDATED ->
  P0264_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: classified_canary_prepared.
- `runtime_evidence`: API PID 85444 is active/running with `NRestarts=0`;
  scheduler paused/paused; target idle-waiting/pass 56; active work and exact
  browser owners zero. Built/installed hashes intentionally differ.
- `authority_classification`: preparation only; no install, restart,
  browser/provider call, context read, materialization, or control is active.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop at the live-effect gate and require
  separate approval plus a complete fresh admission.

## Definition Of Done

One separately approved zero-retry canary produces a causally classified
outcome and exact cleanup, while pass 56 and scheduler pause remain unchanged.
The plan never materializes or resumes wider execution.
