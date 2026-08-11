# WSL Chrome 3 Route-Bound Payload One-Canary Gate | 0266-2026-08-11

State: OPEN
Lane: P01
Plan version: 2
Gate state: ACTIVE_EXACT_ONE_CANARY
Goal execution state: ACTIVE_BOUNDED_EXECUTION

## Current State

Plan 0265's provider-free red proved the ChatGPT payload fallback reloaded home
instead of reacquiring the admitted conversation route. The repair is green and
built but intentionally not installed. API PID 21763 is healthy, scheduler is
paused/paused, the target is idle-waiting at pass 56, active history jobs and
exact browser ownership are zero, and port 45015 is unbound. Built and installed
adapter hashes intentionally differ.

## Stable Objective

After separate approval and a fresh drift-free admission, install the
route-bound payload repair once and run one exact zero-retry context canary for
conversation `6a40724d-8688-83ea-ab36-7458e921ed19` on `wsl-chrome-3`. Accept
only current context or exact terminal 404/410 unavailability, clean up the
exact canary-owned browser, and stop.

## Authority And Non-Goals

- Proposed effects: one combined user-runtime install/API restart, one managed
  browser launch, one context attempt, one sanitized receipt read, and at most
  one exact ownership-checked browser cleanup.
- No materialization, completion/scheduler control, prompt, model selection,
  click, download/upload, retry, guard/config change, direct runtime edit,
  other conversation, or wider profile.
- A repeated payload-missing/home-route stage is a failed acceptance result,
  not retry authority.
- No command below is authorized by this plan's existence.

## Acceptance Criteria

- [x] Provider-free route-bound reacquisition tests, adjacent regressions,
  typecheck, build, dry-run, docs, and audit are green.
- [x] Separate explicit approval and fresh zero-owner admission.
- [ ] One install/restart establishes exact source/installed adapter parity and
  healthy API with `NRestarts=0`.
- [ ] Exactly one attempt yields current context or exact terminal 404/410
  unavailability, without the prior payload-missing/home-route stage.
- [ ] Exact owned cleanup returns browser ownership, active history jobs, and
  port 45015 to zero.
- [ ] Target remains pass 56 and scheduler remains paused/paused; every
  excluded effect remains zero.

## Frozen Future Command Packet | Withheld

1. Require clean/synchronized Git, healthy API, scheduler paused/paused, target
   idle-waiting/pass 56 with null error/next/force, zero queued/running work,
   browser-tools `[]`, and no port-45015 listener.
2. Run `pnpm run install:user-runtime-service` exactly once and no separate API
   restart. Require API active/running with `NRestarts=0` and exact adapter hash
   parity.
3. Run exactly once:

   ```text
   pnpm tsx scripts/chatgpt-context-canary.ts --profile wsl-chrome-3 --conversation-id 6a40724d-8688-83ea-ab36-7458e921ed19 --timeout-ms 120000 --command-timeout-ms 150000 --auracall-bin /home/ecochran76/.local/bin/auracall
   ```

4. Inspect with `pnpm tsx scripts/browser-tools.ts --auracall-profile
   wsl-chrome-3 --browser-target chatgpt inspect --ports 45015 --json`. Run one
   `kill --ports 45015 --force` only when that inspection attributes the
   listener to this canary's exact managed browser profile. Different ownership
   stops without a kill.
5. Re-read API, hashes, scheduler, target, queued/running work, active history
   jobs, browser ownership, and port. Stop without retry under every outcome.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`;
  `max_browser_closes: 1`; `max_materialization_starts: 0`;
  `max_completion_controls: 0`; `max_scheduler_controls: 0`;
  `max_model_selections: 0`; `max_prompt_submissions: 0`;
  `max_downloads: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Preparation Checkpoint | Repaired Canary Withheld

- `checkpoint_id`: `P0266-C01`.
- `state_transition`: P0265_CLOSED_PROVIDER_FREE_VALIDATED ->
  P0266_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: repaired_canary_prepared.
- `runtime_evidence`: API PID 21763 is active/running with `NRestarts=0`;
  scheduler paused/paused; target idle-waiting/backfill-history/pass 56; active
  history jobs zero; browser-tools `[]`; port 45015 unbound. Built hash is
  `3068a77b...`; installed is `2acb20a9...`.
- `authority_classification`: preparation only; no install, restart,
  browser/provider call, context read, materialization, or control is active.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop at the live-effect gate and require
  separate approval plus a complete fresh admission.

## Activation Checkpoint | Exact Packet Admitted

- `checkpoint_id`: `P0266-C02`.
- `state_transition`: P0266_PREPARED_AWAITING_APPROVAL ->
  P0266_ACTIVE_EXACT_ONE_CANARY.
- `progress_classification`: blocker_reduction.
- `runtime_evidence`: the operator's explicit `ok go` activates the frozen
  packet. At `2026-08-11T11:14:25-05:00`, Git is clean and synchronized at
  `2718e1c5`; API PID 21763 is active/running with `NRestarts=0`; scheduler is
  paused/paused; target `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`
  is idle-waiting/backfill-history/pass 56 with null error/next and
  `materializationForce=false`; queued/running completion count and active
  history-job count are zero; browser-tools returns `[]`; port 45015 is
  unbound; no matching agent-browser resource owner exists. Built and installed
  adapter hashes remain intentionally different at `3068a77b...` and
  `2acb20a9...` before the sole install.
- `authority_classification`: exactly the frozen install, canary, inspection,
  and ownership-checked cleanup packet is active. Every stated non-goal remains
  excluded.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit and push this activation, repeat the
  stopped-state admission, then spend the sole install and canary without
  retry.

## Definition Of Done

One separately approved zero-retry canary validates the route-bound repair or
fails closed, exact cleanup completes, and pass 56 plus scheduler pause remain
unchanged. This plan never materializes or resumes wider execution.
