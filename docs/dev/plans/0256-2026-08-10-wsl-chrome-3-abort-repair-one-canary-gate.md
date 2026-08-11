# WSL Chrome 3 Abort Repair One-Canary Gate | 0256-2026-08-10

State: OPEN
Lane: P01
Plan version: 6
Gate state: PROVIDER_FREE_SELECTOR_REPAIR_VALIDATED_WAITING_ZERO_OWNER
Goal execution state: ACTIVE_BOUNDED_EXECUTION

## Stable Goal Objective

After explicit approval and fresh clean admission, inspect ChatGPT's current
model selector once with agent-browser, update AuraCall's semantic selector
mapping provider-free, install the combined repair once, and run exactly one
fresh zero-retry `wsl-chrome-3` conversation-context canary. Prove the
preflight launch no longer outlives its deadline and retain the sanitized
terminal receipt. Do not materialize assets, control a completion, resume the
scheduler, submit a prompt, or widen to another route/profile.

## Current State

- Plan 0254's sole canary made zero provider attempts and timed out in
  `preflight:buildListOptions`; direct agent-browser inspection had already
  proved the authenticated provider surface healthy.
- Plan 0255 passes the same context abort signal through managed-browser target
  and native WSL Chrome launch, joins launcher cleanup before abort rejection,
  and correctly unwraps the cache receipt envelope.
- Provider-free validation passes 20 focused tests, 127 broader browser/context
  tests, 2781 full-suite tests, typecheck, build, lint, diff checks, plan audit,
  and goal-policy audit. Target discovery, port resolution, Chrome launch,
  DevTools readiness, and login-tab opening are now receipt-visible. The source
  repair is not installed.
- Final admission reports API PID 64314 active/running with `NRestarts=0`,
  scheduler paused/paused, active history materialization jobs zero,
  `wsl-chrome-3` idle-waiting/pass 56, and zero exact default or
  `wsl-chrome-3` Chrome owners.
- The operator explicitly approved this gate and added a fresh agent-browser
  inspection of ChatGPT's updated model selector before AuraCall's mapping is
  changed. One shared exact-profile browser lifecycle owns both inspection and
  the later context canary; no duplicate profile process is permitted.
- Fresh launch admission found pre-existing exact-profile Chrome PID 89142 on
  port 45015, started at 17:36:57, with two LitScout project tabs. It is not
  correlated to an active AuraCall materialization job or an agent-browser
  owner. Treat it as externally owned: no launch, navigation, or close is
  admitted. Agent-browser may attach read-only and open the existing model menu
  once, then must detach.
- Two bounded named agent-browser attachments inspected the already-open picker
  without navigation or selection. The current compact menu exposes `Power`,
  `Show advanced options`, and fast mode. Its advanced surface exposes nested
  `Model`, `Effort`, and `Speed` controls. The model submenu contains GPT-5.6
  Sol, Terra, Luna, and legacy GPT-5.5; the effort submenu contains Light,
  Medium, High, and Extra High. Both sessions detached with leave-open
  semantics and exact root PID 89142 remained unchanged.
- Provider-free repair now maps `auto` to Terra, `instant` to Luna,
  Sol/Thinking/legacy-Pro effort aliases to Sol, and `gpt-5.5` to the legacy
  row. The bundled raw browser-model registry maps older base/Instant/
  Thinking/Pro labels onto Terra/Luna/Sol as well. Model selection traverses
  compact -> advanced -> model semantically and
  rejects cross-family GPT-5.6 matches. Effort selection traverses the same
  advanced surface. Focused validation passes 168 tests; a clean standalone
  full-suite rerun passes 2794 tests with 65 skipped. Typecheck, build, lint,
  and plan audit pass.

## Authority And Effect Boundary

- Approval covers one exact managed-browser launch, two agent-browser attaches,
  bounded advanced/model/effort submenu inspection without choosing a model,
  the provider-free selector
  mapping/test update, one install, one API restart, one exact
  source/installed parity check, one context read, and one exact owned cleanup.
- The sole route is conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`; the exact child command retains
  `--refresh --retry-attempts 0 --timeout-ms 120000 --json-only`.
- Model choice, prompts, other clicks, downloads, uploads, `Answer now`, materialization,
  completion controls, scheduler controls, guard/config changes, direct
  runtime-state edits, wider profiles, and a second attempt remain excluded.

## Execution Packet After Approval

1. Re-read Git, service, scheduler, completion, active-job, exact-browser, and
   provider-guard admission. Stop on unclassified drift or duplicate ownership.
2. Reuse the pre-existing exact `wsl-chrome-3/chatgpt` browser without launch,
   attach one named agent-browser session to port 45015, confirm the
   authenticated challenge-free surface, open the model selector once, and
   retain only sanitized option labels and stable DOM semantics. Do not select
   a model, navigate, submit a prompt, or close the browser.
3. Update AuraCall's semantic model-selector mapping plus deterministic tests,
   validate provider-free, audit, commit, and push while preserving the exact
   browser for later reuse.
4. Require the pre-existing browser to exit independently or obtain separate
   authority to close it. Then rerun exact zero-owner admission. Install current
   committed source once, restart only the AuraCall API, and
   require active/running health, `NRestarts=0`, and exact source/installed
   adapter plus browser-service parity.
5. Run the redaction-safe context harness once against the retained exact
   browser. Stop on login, CAPTCHA,
   challenge, identity mismatch, `Answer now`, timeout, or any ambiguous
   receipt. Never retry.
6. Detach agent-browser after inspection. After the later canary, close only a
   canary-owned browser and prove exact
   owners/jobs return to zero while scheduler and both tracked completions
   remain unchanged.

## Acceptance Criteria

- [x] Explicit approval is recorded; fresh drift-free admission remains
  required immediately before launch.
- [x] Fresh agent-browser inspection records the current model options without
  selecting a model, submitting a prompt, or exposing private page content.
- [x] AuraCall's semantic ChatGPT model mapping matches that live selector and
  passes deterministic provider-free selection tests.
- [x] Provider-free receipt tests distinguish browser target discovery, debug
  port resolution, Chrome launch, DevTools readiness, and login-tab opening.
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
  `max_agent_browser_attaches: 2`; `max_model_menu_opens: 1`;
  `max_advanced_menu_opens: 1`; `max_model_submenu_opens: 1`;
  `max_effort_submenu_opens: 1`;
  `max_model_selections: 0`; `max_prompt_submissions: 0`;
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

## Preparation Checkpoint | Stage Localization Gap Accepted

- `checkpoint_id`: `P0256-C02`.
- `state_transition`: P0256_PREPARED_AWAITING_APPROVAL ->
  P0256_ACTIVE_PROVIDER_FREE_STAGE_LOCALIZATION.
- `progress_classification`: blocker_reduction.
- `evidence`: fresh CodeGraph flow review confirms the abort signal reaches
  native Chrome launch, but `getConversationContext` initializes
  `lastStage=preflight:buildListOptions` and receives no stage updates from
  service target resolution, manual-login launch, DevTools readiness, or tab
  opening. Another timeout would therefore be safe but still causally
  ambiguous.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: add a narrow caller-owned preflight-stage
  observer through existing option objects, prove stage ordering and receipt
  projection provider-free, then return to the unchanged live-effect gate.
- `authority_classification`: standing provider-free goal authority; install,
  restart, browser/provider, materialization, completion, scheduler, guard,
  retry, and direct-runtime effects remain excluded.
- `review_disposition_summary`: cancellation coverage is accepted; broad
  `buildListOptions`-only receipt evidence is blocking for another one-shot
  canary because it cannot distinguish a repeated or new preflight mechanism.

## Preparation Checkpoint | Stage Localization Validated And Gate Refrozen

- `checkpoint_id`: `P0256-C03`.
- `state_transition`: P0256_ACTIVE_PROVIDER_FREE_STAGE_LOCALIZATION ->
  P0256_PREPARED_AWAITING_APPROVAL.
- `progress_classification`: canary_prepared.
- `evidence`: the caller-owned observer reports sanitized target-discovery,
  debug-port, manual-login/Chrome-launch, DevTools-readiness, login-tab, and
  target-classification stages. Provider-free validation passes 20 focused,
  127 broader, and 2781 full-suite tests with zero failures; typecheck, build,
  lint, plan audit, and goal-policy audit pass. Closing admission reports API
  PID 64314 active/running with zero restarts, scheduler paused/paused, no
  queued/running completion, zero active history-materialization jobs,
  `wsl-chrome-3` idle-waiting/pass 56, and zero exact Chrome owners.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before install or provider/browser work
  until this exact one-canary live-effect packet is explicitly approved.
- `authority_classification`: preparation complete; install, restart,
  browser/provider, materialization, completion, scheduler, guard, retry, and
  direct-runtime effects remain excluded before approval.
- `review_disposition_summary`: another canary can now distinguish a repeated
  native-launch stall from later readiness or tab-opening failure without
  widening the one-shot packet.

## Activation Checkpoint | Operator Approval And Selector Refresh

- `checkpoint_id`: `P0256-C04`.
- `state_transition`: P0256_PREPARED_AWAITING_APPROVAL ->
  P0256_APPROVED_ACTIVE_SELECTOR_INSPECTION.
- `progress_classification`: outcome_progress.
- `evidence`: the operator said `ok go` and explicitly required a fresh
  agent-browser inspection because ChatGPT's model selector changed again.
  Git remains clean/synchronized at `e45b397f`; the API is healthy, scheduler
  paused, target idle-waiting/pass 56, active materialization jobs zero, and
  exact browser owners zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: launch the exact managed browser once, inspect
  the opened model menu without selecting, then update and validate AuraCall's
  mapping before the approved install and single context canary.
- `authority_classification`: explicit one-browser inspection plus one
  install/restart and one context read; no model selection, prompt, download,
  materialization, completion/scheduler control, guard action, retry, or wider
  profile.
- `review_disposition_summary`: stale source selector labels are accepted as a
  live-evidence requirement; duplicate-profile launch and inference from old
  fixtures are rejected.

## Admission Checkpoint | Pre-Existing Exact Browser Preserved

- `checkpoint_id`: `P0256-C05`.
- `state_transition`: P0256_APPROVED_ACTIVE_SELECTOR_INSPECTION ->
  P0256_ACTIVE_REUSE_ONLY_SELECTOR_INSPECTION.
- `progress_classification`: blocker_reduction.
- `evidence`: fresh admission found exact Chrome root PID 89142/port 45015,
  started at 17:36:57 with two LitScout project tabs. Active AuraCall
  materialization jobs and queued/running completions are zero; agent-browser
  resource inventory does not claim this process. No duplicate launch ran.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: attach one named agent-browser session to the
  existing port, inspect only the model menu, detach, and complete the
  provider-free mapping repair. Do not install or run the canary until this
  pre-existing owner exits independently or separate close authority exists.
- `authority_classification`: reuse-only inspection; no launch, navigation,
  model selection, prompt, download, close, materialization,
  completion/scheduler control, guard action, retry, or wider profile.
- `review_disposition_summary`: silently treating the existing browser as
  canary-owned is rejected; bounded attachment preserves operator browser
  ownership while still collecting the explicitly requested selector evidence.

## Validation Checkpoint | Nested Selector Repair Green

- `checkpoint_id`: `P0256-C06`.
- `state_transition`: P0256_ACTIVE_REUSE_ONLY_SELECTOR_INSPECTION ->
  P0256_PROVIDER_FREE_SELECTOR_REPAIR_VALIDATED_WAITING_ZERO_OWNER.
- `progress_classification`: blocker_reduction.
- `evidence`: two named agent-browser attachments observed the compact,
  advanced, model, and effort menus with no navigation, model selection,
  prompt, or download. Leave-open detach preserved exact PID 89142. Provider-
  free tests prove current semantic mappings, compact-to-advanced-to-model
  navigation, cross-family rejection, checked-radio semantics, and advanced
  effort traversal; 168 focused tests and typecheck pass. An initial full-suite
  run had one unrelated lease-heartbeat timing failure, which passed on an
  immediate isolated rerun. After correcting one stale Sol classification
  assertion and avoiding concurrent build/test output mutation, a clean
  standalone full-suite rerun passes 307 files/2794 tests with 65 skipped;
  build, lint, and plan audit pass.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: finish documentation/audits, commit and push
  the provider-free repair, then wait for PID 89142 to exit independently or
  for separate close authority. Only after fresh zero-owner admission may the
  one install/restart and sole context canary run.
- `authority_classification`: provider-free repair is admitted and live
  inspection is complete; browser close, install/restart, canary,
  materialization, completion/scheduler control, guard action, retry, and
  wider profiles remain excluded while the external owner persists.
- `review_disposition_summary`: a flat-label-only repair is rejected because
  current model and effort choices do not exist until separate nested submenus
  are opened. Treating shared GPT-5.6 text as sufficient is also rejected;
  Sol, Terra, and Luna require family-exact matching.
- `closing_readback`: API PID 64314 remains active/running with `NRestarts=0`;
  scheduler state remains paused; active history-materialization jobs remain
  zero; `wsl-chrome-3` remains idle-waiting/pass 56 with error/next/force null;
  externally owned exact Chrome PID 89142 remains present. No install, restart,
  canary, materialization, completion control, or scheduler control has run.
