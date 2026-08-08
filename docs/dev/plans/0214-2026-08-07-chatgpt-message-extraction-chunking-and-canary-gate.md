# ChatGPT Message Extraction Chunking And Canary Gate | 0214-2026-08-07

State: CLOSED
Lane: P01
Plan version: 1
Outcome: CANARY_PREPARED_AWAITING_INSTALL_GATE
Goal execution state: AWAITING_RUNTIME_GATE
Gate state: PREPARED_NOT_AUTHORIZED

## Stable Goal Objective

Make ChatGPT conversation-message extraction chunked or interruptible without
weakening full-content, identity, guard, CAPTCHA, or context-deadline semantics;
validate the repair provider-free; then freeze one fresh `wsl-chrome-3` canary
for a later explicit effect gate. Do not install, restart, run the canary,
resume another completion, or resume the scheduler in this plan.

## Current State

- Plan 0213 removed repeated visible-file scanning and proved that repaired
  stage no longer owns the large-conversation timeout.
- Its sole post-repair pass advanced `wsl-chrome-3` from pass 40 to 41. Child
  `hmj_2a91562f15de476baf6f6217cc9c927b` matched provider identity and yielded
  materialized/skipped/failed `2/4/1`, then the same conversation timed out at
  `provider:chatgpt.readConversationMessages` after 117259 ms.
- The message reader currently executes one `Runtime.evaluate`, calls
  `innerText` on every visible message node, and returns all complete message
  bodies by value. It has no per-page timeout or interrupt point.
- Default, replacement `wsl-chrome-2`, and `wsl-chrome-4` are paused;
  `wsl-chrome-3` is blocked at pass 41 with no force ceiling; scheduler is
  paused; active history jobs are zero; API PID 14919 is healthy.

## Authority And Scope

- The operator explicitly authorizes one bounded successor plan, one
  provider-free red/green adapter repair, focused and adjacent validation, one
  source/docs commit and push, and preparation of one exact future
  `wsl-chrome-3` canary gate.
- The repair may extract message nodes in deterministic pages, use
  non-layout-sensitive text reads, add a per-page timeout boundary, and expose
  one test seam. It must preserve complete ordered message bodies, roles,
  message IDs, payload/artifact association, retry semantics, and the outer
  120-second context ceiling.
- No install, service restart, provider/browser call, completion control,
  scheduler control, prompt, `Answer now`, click, navigation, guard bypass,
  direct runtime JSON edit, Gemini/Grok change, or account-library apply is in
  scope.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned`.

## Ranked Hypotheses

1. The single full-conversation `innerText` evaluation plus by-value
   serialization owns the timeout. A paged `textContent` reader with a deadline
   per page removes that uninterruptible unit.
2. One exceptionally large message dominates even when total message count is
   moderate. Removing layout work is therefore required in addition to paging.
3. Earlier payload/recovery work is misattributed to the message stage. Direct
   provider-free helper evidence should reject this if the current forbidden
   expression shape is independently reproducible.

## Execution Packets

1. Add a provider-free fake-CDP regression that requires deterministic paging,
   full ordered aggregation, message-ID preservation, no `innerText`, and a
   timeout wrapper for each page; run it red against current source.
2. Extract the nested message reader into one bounded helper. Read at most a
   fixed number of message nodes per CDP call using `textContent`, aggregate in
   order, and stop only on an explicit complete page or a fixed safety bound.
3. Run the focused adapter suite, adjacent context/materialization/completion
   suites, typecheck, zero-warning touched lint, build, plan audit, and diff
   check. Record exact evidence in this plan, roadmap, runbook, journal, and fix
   log; commit and push the green provider-free slice.
4. Freeze but do not execute one future canary: existing completion
   `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`, action
   `run-one-pass`, expected pass `41 -> 42`, one resulting child only. A later
   effect packet must first install/restart once with source/runtime parity and
   reconfirm scheduler paused plus zero active jobs.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_repair_iterations: 1`;
  `max_authority_commits: 1`; `max_source_commits: 1`;
  `max_closeout_commits: 0`;
  `max_provider_free_test_runs: 8`; `max_installs: 0`;
  `max_service_restarts: 0`; `max_provider_calls: 0`;
  `max_completion_control_actions: 0`; `max_scheduler_control_actions: 0`;
  `max_browser_clicks: 0`; `max_browser_navigations: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Acceptance Criteria

- [x] A deterministic regression is red before repair and proves the final
  reader pages message nodes, avoids `innerText`, preserves ordered full text
  and message IDs, and applies a timeout to every page.
- [x] Focused and adjacent tests, typecheck, touched lint, build, plan audit,
  and diff check pass provider-free.
- [x] Source/docs are committed and pushed with no install, restart, browser,
  provider, completion, or scheduler effect.
- [x] The exact pass-42 `wsl-chrome-3` canary request, preconditions, expected
  receipt, and hard stops are frozen for a later explicit effect gate.
- [x] Default, replacement `wsl-chrome-2`, `wsl-chrome-4`, and scheduler remain
  paused; `wsl-chrome-3` remains blocked at pass 41; active jobs remain zero.

## Fresh Canary Gate

State: PREPARED_AWAITING_SEPARATE_INSTALL_EFFECT_GATE

- exact completion:
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`
- exact future control:
  `auracall api mirror-completion-control acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446 run-one-pass --json`
- expected parent transition: blocked pass 41 -> queued/running -> pass 42 with
  `forceRunUntilPassCount=42`, then idle-waiting or blocked with the force
  ceiling cleared.
- expected child: exactly one fresh history-materialization child with matching
  provider-session identity and failed count zero.
- preconditions: pushed green source, one separately authorized install and
  restart, exact installed hash parity, healthy API, scheduler still paused,
  default/replacement `wsl-chrome-2`/`wsl-chrome-4` still paused, and active
  history jobs zero.
- hard stops: any context timeout, failed materialization, identity mismatch,
  provider guard, CAPTCHA/challenge, prompt/composer mutation, uncontrolled
  fanout, or scheduler/other-completion movement.

## Checkpoint 1 | Authorized Provider-Free Successor

- `plan_version`: 1
- `checkpoint_id`: `P0214-C01`
- `state_transition`: P0213_STOPPED_POST_REPAIR_MESSAGE_READ_TIMEOUT ->
  ACTIVE_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction
- `owned_changes`: Plan 0214, ChatGPT message-read helper and test seam, focused
  regression, and canonical docs only.
- `evidence`: exact receipt stage
  `provider:chatgpt.readConversationMessages`; elapsed 117259/120000 ms;
  current source performs one whole-conversation `innerText` evaluation;
  identity matched and active jobs returned to zero.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: red/green repair, provider-free validation, commit/push,
  and frozen canary gate.
- `authority_classification`: explicit bounded successor authorization; all
  runtime/provider effects remain excluded.
- `review_disposition_summary`: accepted blocking finding is only unbounded
  message extraction. Identity, guard, provider availability, visible-file
  recurrence, transfer, and scheduler findings are rejected by current
  receipts.
- `next_action_or_stop_reason`: audit and push this authority boundary, then
  create the red provider-free regression before source repair.

## Checkpoint 2 | Provider-Free Repair Green And Canary Frozen

- `plan_version`: 1
- `checkpoint_id`: `P0214-C02`
- `state_transition`: ACTIVE_PROVIDER_FREE_REPAIR ->
  CANARY_PREPARED_AWAITING_INSTALL_GATE.
- `progress_classification`: blocker_reduction
- `owned_changes`: `chatgptAdapter.ts`, its focused regression, Plan 0214, and
  canonical roadmap/runbook/journal/fix evidence.
- `evidence`: the focused source contract failed before repair on the embedded
  all-message `innerText` expression. After repair, three focused message
  reader tests pass: fixed-size page aggregation preserves ten ordered complete
  bodies and IDs, every page carries DevTools and transport 10000-ms timeouts,
  and a hanging second page rejects at offset 8. Full adapter passes 144/144;
  adjacent context/materialization/completion passes 195/195; typecheck,
  zero-warning touched Biome, production build, plan audit, and diff check pass.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: none inside provider-free scope. Installation, restart,
  and the exact pass-42 canary require a separate effect gate.
- `authority_classification`: completed provider-free successor; no runtime or
  provider authority was inferred.
- `review_disposition_summary`: hypothesis 1 is accepted. The reader now pages
  eight nodes, uses `textContent`, preserves full ordered content, applies a
  protocol execution timeout plus transport timeout to every page, rejects
  non-advancing or over-256-page scans, and leaves the outer context deadline
  unchanged. Hypothesis 2 is covered by removing layout work per page;
  hypothesis 3 is rejected by the direct helper regression and exact stage
  receipt.
- `runtime_readback`: built source adapter SHA-256
  `f9ae3a5b3c475d31a0748e011c81ed20194053e8bf69e16342c925ff1e47e34b`;
  installed adapter intentionally remains Plan 0213 hash
  `71d09b49c0857ee5f9116c24dbc514f4c1d25a098c47999be4c37f29413caef6`.
  API PID 14919 is active with zero restarts. Default is paused/pass 7,
  replacement `wsl-chrome-2` paused/pass 2, `wsl-chrome-4` paused/pass 34,
  `wsl-chrome-3` blocked/pass 41 with no force ceiling, scheduler paused, and
  active history jobs zero.
- `next_action_or_stop_reason`: stop provider-free. The prepared canary is not
  executable until a separate effect packet authorizes one install/restart,
  proves installed hash parity, and revalidates every frozen precondition.
