# Agent-Browser Layered Network Deadlines | 0231-2026-08-09

State: OPEN
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_REPRODUCTION_READY
Goal execution state: ACTIVE_REPAIR_DISCOVERY_COMMAND_BOUNDARY

## Stable Goal Objective

Resolve Plan 0230's discovery-command timeout provider-free. Give
agent-browser command acquisition/transport and daemon-worker network work
separate positive deadlines, make the terminal stage observable without
exposing captured network material, and prepare one fresh `wsl-chrome-3`
canary gate. Do not launch a browser, install or restart runtime code, start
materialization, control a completion, or resume the scheduler in this plan.

## Current State

- Plan 0230's sole helper invocation timed out at 5004 ms before request
  selection; response detail and `Network.getResponseBody` were never reached.
- Routine commands in the same retained agent-browser session consumed about
  8.7-10.5 seconds of process wall time while the helper's entire discovery
  child was capped at 5 seconds.
- The installed agent-browser exposes `--job-timeout-ms` as a daemon-worker
  deadline that starts after serialized queue dispatch and cancels the running
  operation before a longer caller process deadline. This is the existing seam
  for separating request-list/detail execution from client acquisition and
  transport.
- The current AuraCall helper supplies only one whole-child deadline per
  command and reduces every timeout to the same public shape.
- API PID 32737 and all materialization/completion/scheduler boundaries remain
  stopped at the Plan 0230 closeout state. No live state needs to change for
  this packet.

## Authority And Effect Boundary

- Add one minimal provider-free child-process regression that reproduces the
  acquisition-delay/short-worker-budget ordering and first fails on current
  behavior.
- Change only the safe agent-browser network metadata helper, its CLI wrapper,
  focused tests, and required docs.
- Pass an explicit daemon-worker deadline for request discovery and response
  detail. Keep a separately positive caller acquisition/transport allowance
  and retain the independent child abort, output cap, and redaction boundary.
- Public output may add only bounded stage/timing labels. It must never include
  request IDs, URLs, headers, cookies, bodies, stderr, child errors, account
  identity, or query material.
- Prepare a successor one-canary approval artifact after provider-free
  validation. That artifact is not live authority and must retain all existing
  identity, challenge, `Answer now`, cleanup, scheduler, completion, and
  materialization hard stops.
- Browser/provider execution, install/restart, completion controls,
  materialization starts, scheduler controls, and wider resume are excluded.

## Ranked Falsifiable Hypotheses

1. `H1_conflated_deadline`: current discovery fails whenever child acquisition
   latency exceeds `discoveryTimeoutMs`, even when request discovery itself
   would complete within that budget.
2. `H2_stage_ambiguity`: current public output cannot distinguish a caller
   command-envelope timeout from a daemon-worker request-discovery or
   response-detail timeout.
3. `H3_timeout_increase_only`: increasing the outer timeout can make the
   fixture green but cannot independently terminate a stuck daemon-worker
   operation, so it is insufficient acceptance evidence.

## Execution Packet

1. Freeze this plan and a provider-free fake executable whose acquisition
   delay exceeds the worker budget but whose worker result is immediate.
2. Record the current-source red at the real child-process seam.
3. Add a positive acquisition/transport allowance plus explicit
   `--job-timeout-ms` for discovery and detail; classify caller-envelope versus
   daemon-worker timeout stages without forwarding captured output.
4. Prove success, acquisition timeout, discovery-worker timeout,
   detail-worker timeout, non-exiting child, output cap, malformed envelopes,
   selection failure, and secret redaction.
5. Run typecheck/build/scoped formatting and the planning audits. Update the
   journal, fixes log, and operator-facing browser-service tooling docs.
6. Close and commit this plan, then prepare one fresh `wsl-chrome-3` canary
   plan in a non-authorizing state. Stop before install, restart, browser,
   provider, materialization, completion, or scheduler effects.

## Acceptance Criteria

- [ ] A current-source provider-free regression reproduces H1 at the real
  child-process boundary before production code changes.
- [ ] Discovery and detail commands each receive their own daemon-worker
  deadline shorter than a separately positive caller command envelope.
- [ ] Public metadata distinguishes acquisition/transport-envelope timeout,
  request-discovery worker timeout, and response-detail worker timeout.
- [ ] The safe reducer retains its closed-world redaction and output cap across
  successful and failing child exits.
- [ ] Focused tests, typecheck, production build, scoped formatting, marker
  scan, plan audit, and diff hygiene pass.
- [ ] Required plan/journal/fixes/operator docs are current and one successor
  canary plan is prepared without live authority.
- [ ] No excluded runtime or provider effect occurs.

## Local Goal Bounds

- `max_provider_free_red_cycles: 1`; `max_implementation_cycles: 1`;
  `max_closed_world_rework_cycles: 1`; `max_canary_plans_prepared: 1`;
  `max_browser_launches: 0`; `max_agent_browser_live_attaches: 0`;
  `max_provider_calls: 0`; `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_wider_resumes: 0`; `max_subagents: 0`.

## Hard Stops

- Stop if the red does not reproduce at the child-process boundary; revise the
  hypothesis before source repair.
- Stop if independent worker timeout control would require changing or
  publishing agent-browser itself; this packet may consume only its installed
  public CLI contract.
- Stop if captured stdout/stderr, request IDs, URLs, headers, cookies, bodies,
  identities, child errors, or query material can reach public output or repo
  artifacts.
- Stop before any browser/provider action, runtime install/restart,
  materialization/completion control, scheduler control, or wider resume.

## Checkpoint 1 | Layered Deadline Repair Opens Provider-Free

- `checkpoint_id`: `P0231-C01`.
- `state_transition`: P0230_CLOSED_D8_DISCOVERY_COMMAND_TIMEOUT ->
  P0231_OPEN_PROVIDER_FREE_LAYERED_DEADLINE_REPAIR.
- `progress_classification`: blocker_reduction.
- `authority_classification`: standing goal authority covers provider-free
  reproduction, implementation, validation, docs, commit, and push only.
- `evidence`: exact Plan 0230 timeout shape; same-session command wall times;
  installed agent-browser `--job-timeout-ms` worker/queue contract; clean and
  synchronized AuraCall worktree at `b1eb43b3`.
- `subagent_status`: not_spawned; repo policy requires direct CodeGraph-backed
  exploration and this packet fixes one narrow seam.
- `review_disposition_summary`: H1-H3 accepted for one red/green cycle; a
  timeout increase without a worker deadline is rejected as insufficient.
- `next_action_or_stop_reason`: add and run the one provider-free red test.
