# WSL Chrome 3 Governed Payload One-Canary Gate | 0254-2026-08-10

State: CLOSED
Lane: P01
Plan version: 5
Gate state: FAILED_CANARY_PREFLIGHT
Goal execution state: STOPPED_NO_RETRY

## Stable Goal Objective

Install the provider-free Plan 0253 repair only after explicit approval, prove
source/installed parity and healthy API restart, then run exactly one fresh
`wsl-chrome-3` ChatGPT conversation-context canary against one previously
failing route. Do not start materialization, control a completion, resume the
scheduler, or widen to another route/profile in this plan.

## Current State

- Plan 0253 moves the page-refresh governor ahead of the ten-second fallback
  body window, disposes both per-read Network subscriptions, settles the
  governed reload audit from exact response evidence even when the reload
  acknowledgement remains pending, and joins retained-session abort cleanup.
- Provider-free focused and integrated validation must be green, the planning
  audit must accept Plan 0253, Git must be clean/synced, and the exact
  `default/chatgpt` and `wsl-chrome-3/chatgpt` managed browser owners must both
  be absent before this gate can be approved or executed.
- The scheduler remains paused and the default completion remains blocked at
  pass 9. Those are preserved stop states, not effects admitted here.
- The provider-free preparation baseline was clean and synced at `c05e593b`.
  Source built-adapter SHA-256
  is `756d54dea8ac39535f2bb63444d3d2c160706a7383eaf9119487dbfc32a3361b`;
  the still-running installed adapter is intentionally older at
  `223f3f84a913f11074878569920873565c823a6f46a69ff973ce03566e393522`,
  proving the approved install is still required.
- API PID 27774 is active/running with `NRestarts=0`. Scheduler state and
  operator posture are paused with no foreground request or drain reservation.
  The default completion is blocked/pass 9; `wsl-chrome-3` is
  idle-waiting/pass 56 and active history-materialization jobs are zero.
- Agent-browser attached read-only to the previously external exact browser.
  It contained one authenticated ChatGPT home tab with a composer and no
  login, CAPTCHA, `Answer now`, or rate-limit surface. Active jobs and
  completion children remained zero, proving it was an idle orphan rather than
  provider work. Agent-browser detached without lifecycle mutation; the exact
  repo cleanup helper then terminated only PID 12504/port 45015 and its process
  group while preserving the managed profile directory. Fresh executable-
  scoped admission now reports zero exact default and `wsl-chrome-3` owners.

## Authority And Effect Boundary

- The operator explicitly authorized continued repair work, previously
  authorized the bounded successor canary, and required direct agent-browser
  inspection first. That inspection is now complete and the unchanged
  one-canary packet is activated.
- After approval, permit one user-runtime install, one API restart, one exact
  source/installed adapter hash comparison, one `wsl-chrome-3/chatgpt` managed
  browser launch, one context read, and one exact owned-browser cleanup.
- The sole target is previously failing conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`. The canary may perform the adapter's
  normal same-route readiness and one governed exact-payload fallback, but may
  not retry the context read or advance to another conversation.
- Provider prompts, clicks, downloads, uploads, artifact retrieval,
  materialization, completion controls, scheduler controls, guard/config
  changes, profile seeding, direct runtime-state edits, and other provider or
  browser profiles remain excluded.

## Execution Packet After Approval

1. Re-read Git, service, scheduler, completion, active-job, provider-guard, and
   exact-browser admission. Stop on drift or any live owner.
2. Install the current committed source into the user runtime, restart only the
   AuraCall API, and require healthy active/running state with zero unexpected
   restarts plus exact installed/source ChatGPT adapter parity.
3. Run the redaction-safe canary harness once. Its child command is exactly
   `auracall --profile wsl-chrome-3 conversations context get
   6a40724d-8688-83ea-ab36-7458e921ed19 --target chatgpt --refresh
   --retry-attempts 0 --timeout-ms 120000 --json-only`. The explicit
   CLI-sourced `--refresh`
   makes `allowCacheFallback=false`; the result cannot be satisfied from a
   cached context. The harness must retain only counts and the sanitized
   receipt contract, never message/file/artifact content or raw child output.
   This command owns the sole managed-browser launch and context read. Stop
   immediately on login, CAPTCHA, challenge, identity mismatch, or an
   `Answer now` surface; never click `Answer now`.
4. Close only the exact canary-owned browser, require active jobs and exact
   browser owners to return to zero, and prove scheduler/completion state did
   not move.

## Acceptance And Hard Stops

- Acceptance requires one successful current context result, one successful
  receipt with no pending operation, nonzero message count, balanced reload
  mutation audit when fallback is used, no late mutation after owner cleanup,
  and exact browser/job cleanup.
- Any timeout, null payload, rejected/late reload, listener residue, auth or
  challenge surface, identity mismatch, install/hash mismatch, unhealthy API,
  unexpected restart, or state drift stops the plan without retry.
- Passing this canary does not authorize scheduler resume, materialization, or
  a default completion pass. Each remains a later separately bounded gate.

## Acceptance Criteria

- [x] Operator authority covers this single canary gate after direct
  agent-browser inspection.
- [x] Git and runtime admission are clean, stopped, and drift-free; exact
  `wsl-chrome-3/chatgpt` browser owners are zero.
- [x] Installed/source ChatGPT adapter hashes match after one healthy restart.
- [ ] The sole context read succeeds with no pending operation or late mutation.
- [x] Exact browser/job cleanup returns to zero.
- [x] Materialization, completion, scheduler, guard, and wider-profile effects
  remain zero.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`; `max_browser_closes: 1`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`;
  `max_pre_canary_stale_browser_closes: 1`;
  `max_provider_free_harness_source_files: 3`;
  `max_provider_free_harness_test_files: 2`.

## Provider-Free Preparation Packet

- Add one narrow script that builds the exact command above, supports a
  no-launch dry run, captures bounded child output privately, emits only
  conversation/message/file/artifact counts, and identifies exactly one
  newly written receipt for the target without exposing its cache path.
- Cover command construction, explicit `--refresh`, content redaction,
  sanitized receipt projection, ambiguous-receipt rejection, and dry-run
  behavior provider-free. This packet cannot install, restart, launch or attach
  a browser, call a provider, or mutate scheduler/completion/materialization
  state.
- Add an explicit non-negative context retry ceiling through the service and
  CLI so this canary can request zero retries without changing the default
  retry policy for ordinary callers.

## Preparation Checkpoint | Exact Canary Contract Identified

- `checkpoint_id`: `P0254-C01`.
- `state_transition`: P0254_OPEN_GENERIC_CANARY_GATE ->
  P0254_ACTIVE_PROVIDER_FREE_HARNESS_PREPARATION.
- `progress_classification`: blocker_reduction.
- `evidence`: CodeGraph traced the existing context CLI to
  `LlmService.getConversationContext`; explicit `--refresh` is the existing
  public control that passes `allowCacheFallback=false`. Current source/install
  hashes and stopped runtime state are independently read back above.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: implement and validate the redaction-safe
  provider-free harness, then return to the unchanged explicit live-effect
  approval gate.
- `authority_classification`: standing provider-free implementation authority;
  install, restart, browser/provider, materialization, completion, scheduler,
  guard, and direct-runtime effects remain excluded.
- `review_disposition_summary`: existing generic acceptance script is rejected
  for this gate because it performs broad CRUD and retries; the exact context
  CLI is accepted when wrapped with single-attempt and redaction controls.

## Preparation Checkpoint | Harness Validated, Admission Drift Found

- `checkpoint_id`: `P0254-C02`.
- `state_transition`: P0254_ACTIVE_PROVIDER_FREE_HARNESS_PREPARATION ->
  P0254_AWAITING_EXPLICIT_ONE_CANARY_APPROVAL_AND_CLEAR_ADMISSION.
- `progress_classification`: blocker_reduction.
- `evidence`: the exact dry run reports provider calls zero, browser launches
  zero, `--refresh`, and `--retry-attempts 0`; 18 focused tests, typecheck,
  build, and diff checks pass; the isolated full suite passes 801/801 suites
  with 2775 passed, 65 pending, and zero failed tests. The agent-browser skill
  kept inspection no-launch. Corrected executable-scoped process admission
  found the external exact managed-browser owner described above; API readback
  still reports active jobs zero, `wsl-chrome-3` idle-waiting/pass 56, and the
  scheduler paused/paused.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: commit and push the provider-free preparation,
  then stop. The live packet requires both explicit gate approval and fresh
  zero-owner admission; this plan does not authorize attaching to or closing
  the external browser.
- `authority_classification`: provider-free preparation accepted; install,
  restart, browser/provider, materialization, completion, scheduler, guard,
  and direct-runtime effects remain excluded.
- `review_disposition_summary`: the retry-safe, redaction-safe harness is
  accepted for later execution; current live admission is rejected while PID
  12504 owns the exact managed browser directory.

## Activation Checkpoint | Direct Inspection And Clean Admission

- `checkpoint_id`: `P0254-C03`.
- `state_transition`:
  P0254_AWAITING_EXPLICIT_ONE_CANARY_APPROVAL_AND_CLEAR_ADMISSION ->
  P0254_APPROVED_READY_FOR_INSTALL.
- `progress_classification`: blocker_removed.
- `evidence`: agent-browser read-only inspection found one ChatGPT home tab,
  an available composer, and no login, CAPTCHA, `Answer now`, or rate-limit
  signal. With active jobs and completion children zero, exact PID/port cleanup
  removed the orphan. Fresh process admission reports zero exact owners. Git is
  clean/synchronized at `97a0c5c7`; API PID 27774 is active/running with
  `NRestarts=0`; scheduler is paused/paused; default remains blocked/pass 9;
  `wsl-chrome-3` remains idle-waiting/pass 56. Source adapter hash
  `756d54de...3361b` differs from installed `223f3f84...93522`, so exactly one
  install remains necessary.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: perform the sole user-runtime install and API
  restart, prove adapter parity and stopped-state preservation, then run the
  exact zero-retry redaction-safe canary once.
- `authority_classification`: activated bounded runtime/provider packet; no
  materialization, completion, scheduler, guard, prompt, click, download,
  upload, or wider-profile authority.
- `review_disposition_summary`: provider/auth unavailability is rejected by
  direct current inspection; clean admission and the repaired harness are
  accepted for one live context canary.

## Definition Of Done

The installed runtime exactly matches the committed repair, the single fresh
`wsl-chrome-3` context read succeeds and fully cleans up, and scheduler,
materialization, and completion effects remain zero. Otherwise the plan closes
at the first hard stop with no retry.

## Terminal Checkpoint | Canary Stopped In Browser Preflight

- `checkpoint_id`: `P0254-C04`.
- `state_transition`: P0254_APPROVED_READY_FOR_INSTALL ->
  P0254_CLOSED_FAILED_CANARY_PREFLIGHT.
- `progress_classification`: causal_localization.
- `evidence`: the sole install/restart produced exact source/installed adapter
  SHA-256 parity at
  `756d54dea8ac39535f2bb63444d3d2c160706a7383eaf9119487dbfc32a3361b`.
  The sole zero-retry canary then exited after 120649 ms with no parsed output.
  Its unique current receipt records `outcome=timed_out`, `attemptCount=0`,
  `lastStage=preflight:buildListOptions`, and
  `errorCode=conversation_context_timeout`. It therefore never entered a
  ChatGPT provider attempt. Direct agent-browser inspection immediately before
  activation had already proved the account/browser surface healthy. Exact
  browser owners and active jobs returned to zero after the failed canary.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0255 owns a provider-free repair for the
  dropped cancellation signal and cache-envelope receipt parser. Plan 0254 is
  closed at its zero-retry hard stop; it does not authorize another canary.
- `authority_classification`: the one install/restart and one live context read
  were exhausted; materialization, completion, scheduler, guard, prompt,
  click, download, upload, retry, and wider-profile effects remained zero.
- `review_disposition_summary`: the earlier provider payload diagnosis is not
  implicated by this canary. The observed failure is a managed-browser target
  preflight whose launch path does not receive the context abort signal.
