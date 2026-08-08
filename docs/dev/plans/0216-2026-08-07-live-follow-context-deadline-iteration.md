# Live-Follow Context Deadline Iteration | 0216-2026-08-07

State: CLOSED
Lane: P01
Plan version: 1
Outcome: PROVIDER_FREE_REPAIR_COMPLETE_CANARY_PREPARED
Goal execution state: COMPLETE
Gate state: LIVE_EFFECT_WITHHELD

## Stable Goal Objective

Restore ChatGPT live-follow conversation-context materialization so a bounded
completion pass can read multiple selected conversations without exhausting the
outer 120-second context deadline. Preserve complete conversation content,
identity authorization, provider guards, CAPTCHA/challenge hard stops, durable
receipts, and fail-closed completion semantics. Iterate provider-free for no
more than ten goal turns, including this authority turn, then prepare but do
not execute one fresh `wsl-chrome-3` canary gate.

## Current State

- Plan 0215 installed the Plan 0214 paged-message repair with exact
  source/runtime adapter hash parity at
  `11f31a2e804a1ca7ff8856d053a61ab37d017500feb8a6e2fe2913306264b978`
  and restarted only the AuraCall API. PID 17440 remains active/running with
  zero crash restarts.
- Its sole `wsl-chrome-3` control advanced the existing completion from pass 41
  to pass 42 and created only child
  `hmj_a581131e7e844eb492f63612c4a33069`. Provider-session identity matched,
  but terminal conversations/materialized/skipped/failed were `6/0/3/4`.
- The retained per-conversation read receipts narrow that result:
  - one conversation succeeded in 16490 ms at `lastStage=complete`;
  - one timed out in 116407 ms at `lastStage=cdp:Runtime.evaluate`;
  - three timed out in 116422, 116371, and 116387 ms at
    `lastStage=provider:chatgpt.skipSameRouteNavigation`;
  - all five reads used `attemptCount=1` and the unchanged 120000-ms outer
    ceiling.
- `LlmService.getConversationContext` already writes a durable
  `ConversationContextReadReceipt`, but the history-materialization job result
  and snapshot-refresh rows reduce these failures to the generic outer timeout
  and do not carry that receipt.
- `readChatgptConversationPayloadWithClient` begins with an awaited
  `Runtime.evaluate` whose injected authenticated `fetch()` has no DevTools
  protocol timeout, transport timeout, or browser-side abort deadline. This is
  the strongest current candidate for the first timed-out row, not yet a
  proven cause.
- `bindChatgptAbortCleanup` starts connection cleanup with `void`, while
  `closeChatgptTabConnection` preserves retained provider-session connections.
  A timed-out conversation may therefore return before target/session cleanup
  is settled. This is a second candidate for the three later timeouts, not yet
  a proven cause.
- Runtime remains stopped: default paused/pass 7, replacement
  `wsl-chrome-2` paused/pass 2, `wsl-chrome-4` paused/pass 34,
  `wsl-chrome-3` blocked/pass 42 with no force ceiling, scheduler
  operator-paused, and active history jobs zero.

## Authority And Scope

- The operator authorizes this plan artifact and an iterative provider-free
  repair campaign bounded by ten goal turns total. This authority covers
  source, focused tests, adjacent provider-free tests, documentation, local
  builds, plan revisions within the recorded bounds, commits, and pushes.
- Each repair iteration must begin with an evidence-backed hypothesis and a red
  deterministic reproducer. Only the smallest source seam proved by that
  reproducer may change; each green checkpoint must preserve the stable goal.
- The plan may promote existing context-read receipts into full
  history-materialization/snapshot evidence; add explicit stage boundaries;
  bound a previously unbounded provider read; make abort cleanup awaitable and
  invalidate poisoned retained connections; and add provider-free sequential
  conversation tests when evidence supports those changes.
- The outer context deadline must remain 120000 ms. The plan may not obtain a
  green result by widening it, truncating message bodies, skipping artifact
  readers, swallowing failed rows, treating timeout as success, weakening
  identity/guard checks, or silently falling back to stale cache.
- No install, service restart, provider/browser call, completion control,
  scheduler control, prompt, `Answer now`, click, navigation, guard bypass,
  direct runtime JSON edit, Gemini/Grok change, account-library apply, or live
  materialization is authorized.
- Critical-path owner: primary agent. Delegation was not requested;
  `subagent_status=not_spawned` and `max_subagents=0`.

## Accepted Finding Ledger

1. `P0216-F01` — blocking: full history-materialization evidence omits the
   already-retained context-read receipt, preventing exact stage adjudication.
   Disposition: repair provider-free first.
2. `P0216-F02` — needs_evidence: the authenticated conversation-payload
   `Runtime.evaluate` can await an unbounded injected `fetch()` and may own the
   first timeout. Disposition: write a hanging-evaluate reproducer before
   changing it.
3. `P0216-F03` — needs_evidence: abort cleanup is fire-and-forget and retained
   provider-session connections can bypass target disposal, potentially
   allowing a timed-out read to poison later reads. Disposition: reproduce one
   timeout followed by a second conversation before changing lifecycle rules.
4. `P0216-F04` — needs_evidence: if F02 and F03 are disproved, one of the later
   sequential payload, deep-research, visible-file, download, image, or canvas
   reads remains unbounded or mislabelled. Disposition: use promoted receipts
   and explicit stage boundaries; do not guess.
5. `P0216-F05` — rejected from the active blocker set: provider identity,
   provider guard, CAPTCHA/challenge, message ordering, and message truncation.
   Plan 0215 matched identity, exposed no guard/challenge, and the Plan 0214
   provider-free contract already proves ordered complete paged messages.

## Iteration Controller

1. At the start of each remaining goal turn, read the latest checkpoint,
   current worktree, failing test, and stopped runtime posture. Select only one
   accepted blocking or needs-evidence finding as the turn's critical path.
2. Require a deterministic red test against current source. A source change
   without a red reproducer is `no_progress`, not a repair iteration.
3. Implement only the source change required to turn that reproducer green.
   Run focused tests immediately; do not stack a second hypothesis on a red or
   ambiguous result.
4. Run adjacent provider-free validation before committing. Record the exact
   state transition, evidence, finding disposition, and remaining criterion in
   this plan and canonical logs.
5. Continue automatically only when the checkpoint is `outcome_progress` or
   `blocker_reduction`. Stop after two consecutive `no_progress` turns, any
   regression, an unowned dirty-worktree conflict, or the ten-turn ceiling.
6. When all provider-free criteria are green, perform one closed-world audit
   against F01-F04 and critical regressions. Prepare a separate exact live
   effect plan; do not execute it here.

## Execution Packets

### Packet A | Evidence Promotion

- Add a provider-free regression proving each snapshot-refresh result and full
  history-materialization job can retain a bounded context-read receipt with
  outcome, elapsed time, attempt count, last stage, completion time, and error
  code, without exposing account identity or raw conversation content.
- Wire the existing cache receipt through the history-materialization boundary
  or add an equivalent caller-owned receipt return seam. Compact monitoring
  projections may remain bounded, but full detail must be sufficient for exact
  failure adjudication.

### Packet B | Sequential Timeout Reproducer

- Build a fake-CDP/provider-session test that models the pass-42 shape: one
  successful context read, one hanging payload evaluation, then another
  selected conversation.
- Prove whether the payload evaluation respects a protocol deadline, whether
  the outer abort waits for connection/target cleanup, whether a retained
  session is evicted after abort, and whether the next conversation begins only
  after the prior unit is quiescent.
- The test must be provider-free and must not use wall-clock waits near the live
  120-second ceiling.

### Packet C | Evidence-Selected Repair Iterations

- If F02 is reproduced, bound the payload evaluation at all three layers that
  own it: browser-side fetch abort, DevTools `Runtime.evaluate.timeout`, and a
  transport-side wait. Preserve authenticated fetch semantics and the existing
  bounded reload fallback.
- If F03 is reproduced, make abort cleanup awaitable, evict or invalidate the
  aborted retained provider session, and prove the next selected conversation
  cannot inherit its CDP work or target.
- If F04 becomes blocking, add explicit before/after stage actions around the
  remaining sequential readers and repair only the newly proven unbounded
  stage. Do not widen this packet to unrelated browser heuristics.

### Packet D | Provider-Free Integration Gate

- Require focused ChatGPT adapter and tab-lifecycle tests, conversation-context
  tests, history-materialization tests, account-mirror completion tests,
  typecheck, zero-warning touched lint, production build, plan audit, and diff
  check.
- Add a sequential integration regression that proves a timed-out conversation
  cannot leave background CDP work or a retained poisoned target that blocks
  the next conversation.
- Preserve full ordered messages and IDs, visible-file/artifact extraction,
  outer timeout semantics, identity checks, guards, and failure propagation.

### Packet E | Fresh Canary Preparation Only

- Freeze a later exact effect packet for completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446`, one
  `run-one-pass`, expected parent pass `42 -> 43`, and exactly one fresh child.
- The later packet must separately authorize at most one install and one API
  restart, prove source/installed hash parity, and reconfirm the stopped
  runtime before the control.
- Clean proof requires matching identity, every selected conversation context
  terminal without timeout, child failed count zero, parent force ceiling
  cleared, active jobs zero, no pass 44, other intended completions unchanged,
  and scheduler paused.
- Any failed item, timeout, identity mismatch, provider guard, challenge,
  prompt/composer mutation, second child, pass 44, or wider movement stops that
  future packet fail-closed. Scheduler resume remains a later gate.

## Local Goal Bounds

- `max_goal_turns: 10`, inclusive of the Plan 0216 authority/evidence turn;
  `turns_consumed_at_checkpoint_1: 1`; `max_remaining_goal_turns: 9`.
- `max_plan_versions: 3`; `max_repair_iterations: 3`;
  `max_red_green_cycles_per_iteration: 2`;
  `max_consecutive_no_progress_turns: 2`;
  `max_provider_free_test_runs: 24`; `max_authority_commits: 1`;
  `max_source_commits: 4`; `max_closeout_commits: 1`;
  `review_discovery_passes: 1`; `review_verification_mode: closed_world`.
- `max_installs: 0`; `max_service_restarts: 0`; `max_provider_calls: 0`;
  `max_completion_control_actions: 0`; `max_scheduler_control_actions: 0`;
  `max_browser_clicks: 0`; `max_browser_navigations: 0`;
  `max_prompt_submissions: 0`; `max_answer_now_clicks: 0`;
  `max_guard_bypass_actions: 0`; `max_direct_runtime_json_edits: 0`;
  `max_subagents: 0`.

## Acceptance Criteria

- [x] Full provider-free history-materialization detail carries bounded
  per-conversation context-read receipts sufficient to distinguish exact
  terminal stages without private identity or raw-content leakage.
- [x] A deterministic red/green sequence reproduces the one-success,
  hanging-evaluate, next-conversation failure shape and proves cleanup is
  settled before the next selected conversation starts.
- [x] Every reproduced unbounded provider operation has an execution deadline
  and transport deadline; injected fetch work also has a browser-side abort.
- [x] An aborted context read cannot retain or reuse poisoned CDP work, and the
  next conversation can complete independently in the provider-free sequence.
- [x] Complete ordered message bodies/IDs, payload and artifact association,
  visible-file/artifact readers, outer timeout, identity, guard, and fail-closed
  semantics remain covered and green.
- [x] Focused and adjacent suites, typecheck, touched lint, production build,
  plan audit, and diff check pass; source/docs commits are pushed.
- [x] Default remains paused/pass 7, replacement `wsl-chrome-2` paused/pass 2,
  `wsl-chrome-4` paused/pass 34, `wsl-chrome-3` blocked/pass 42, scheduler
  paused, and active jobs zero throughout provider-free work.
- [x] One exact pass-43 canary gate is prepared for separate approval, with no
  install, restart, browser/provider action, completion control, materialization
  start, wider resume, or scheduler control executed by Plan 0216.

## Hard Stops

- Stop on the ten-turn ceiling, two consecutive no-progress turns, a repair
  without a red reproducer, loss of full-content semantics, timeout widening,
  swallowed failures, identity/guard weakening, unexpected runtime movement,
  or an unowned worktree conflict.
- Stop before any install, restart, browser/provider call, completion control,
  materialization start, account-library apply, or scheduler control. Those
  effects require a separate exact approval packet even if this provider-free
  plan becomes green.
- If the closed-world audit cannot prove all accepted blocking findings
  resolved, close Plan 0216 blocked with the exact remaining finding; do not
  spend remaining turns on speculative hardening.

## Checkpoint 1 | Iterative Provider-Free Authority Opened

- `plan_version`: 1
- `checkpoint_id`: `P0216-C01`
- `state_transition`: P0215_FAILED_CANARY_CONTEXT_TIMEOUTS ->
  ITERATIVE_PROVIDER_FREE_REPAIR_READY.
- `progress_classification`: blocker_reduction.
- `owned_changes`: Plan 0216 and canonical roadmap/runbook/journal/fix evidence
  only in this authority slice.
- `evidence`: pass-42 child `hmj_a581131e7e844eb492f63612c4a33069`
  failed `6/0/3/4`; retained context receipts show one 16490-ms success, one
  116407-ms timeout at `cdp:Runtime.evaluate`, and three ~116.4-second timeouts
  at `provider:chatgpt.skipSameRouteNavigation`, all attempt one. CodeGraph
  shows an unbounded payload evaluation and fire-and-forget retained-session
  abort cleanup as evidence-backed candidates.
- `subagent_status`: `not_spawned`.
- `remaining_criteria`: F01 evidence promotion, F02/F03 deterministic
  adjudication, evidence-selected repairs, provider-free integration gate,
  closed-world audit, and a prepared separate pass-43 effect gate.
- `authority_classification`: explicit provider-free iterative goal authority;
  all installed-runtime, provider, completion, materialization, and scheduler
  effects remain withheld.
- `review_disposition_summary`: F01 blocking; F02-F04 need evidence; F05
  rejected from the active blocker set. No prior repaired seam is presumed to
  have recurred from the outer timeout alone.
- `next_action_or_stop_reason`: commit and push this authority boundary, then
  begin Packet A with a red provider-free receipt-projection regression.

## Checkpoint 2 | Context-Read Receipts Reach Full Job Evidence

- `plan_version`: 1
- `checkpoint_id`: `P0216-C02`
- `goal_turn`: 2 of 10 maximum.
- `state_transition`: ITERATIVE_PROVIDER_FREE_REPAIR_READY ->
  RECEIPT_PROMOTION_PROVEN.
- `progress_classification`: blocker_reduction.
- `finding_disposition`: `P0216-F01` resolved provider-free. The existing
  bounded receipt now crosses a caller-owned observer seam into both successful
  and failed snapshot-refresh evidence, and the complete job retains it through
  `phases.snapshotRefresh` and `snapshotRefreshes`.
- `red_evidence`: the focused pre-repair run failed three exact assertions:
  successful and timed-out context reads emitted no caller receipt, and a
  failed refresh dropped an attached receipt from the complete job result.
- `green_evidence`: the same four success/timeout/job-success/job-failure
  assertions pass; the full adjacent context and history-materialization suites
  pass `85/85`; typecheck passes; touched Biome is zero-warning; diff check is
  clean.
- `bounded_evidence_contract`: object/version, provider, hashed account scope,
  conversation ID, outcome, deadline/elapsed time, attempt count, last stage,
  completion time, and error code only. Raw messages, files, artifacts, account
  identity, and error prose are not added to the receipt.
- `effect_readback`: no install, restart, provider/browser call, completion
  control, materialization start, or scheduler control occurred. The stopped
  runtime posture remains the controlling checkpoint.
- `remaining_criteria`: provider-free pass-42-shaped sequential reproducer;
  F02/F03 adjudication and evidence-selected repair; integration gate;
  closed-world audit; prepared separate pass-43 gate.
- `next_action_or_stop_reason`: begin Packet B with ranked falsifiable F02-F04
  hypotheses and a short-deadline fake-CDP/provider-session sequence.

## Checkpoint 3 | Payload Deadline And Abort Quiescence Proven

- `plan_version`: 1
- `checkpoint_id`: `P0216-C03`
- `goal_turn`: 2 of 10 maximum.
- `state_transition`: RECEIPT_PROMOTION_PROVEN ->
  PROVIDER_FREE_REPAIR_GATE_GREEN.
- `progress_classification`: blocker_reduction.
- `finding_dispositions`:
  - `P0216-F02` resolved. The red pass-42-shaped sequence proved the hanging
    authenticated payload evaluation had no browser, protocol, or transport
    deadline. It now uses a 9000-ms injected fetch abort and 10000-ms DevTools
    execution plus transport deadlines.
  - `P0216-F03` resolved. The red retained-session lifecycle test proved abort
    returned without invoking session eviction or awaiting cleanup. Abort now
    invalidates the retained session, closes it once, and the owning read waits
    for cleanup before the next unit can begin.
  - `P0216-F04` rejected from the active blocker set. The exact F02/F03 red
    sequence is green and the full adjacent gate exposes no distinct later
    unbounded reader; no speculative third repair was made.
- `red_evidence`: payload evaluation lacked `timeout`, `AbortController`, and
  transport settlement after the short fake deadline; retained-session abort
  invoked zero session closes and allowed the first read to settle before
  cleanup.
- `green_evidence`: adapter and tab-lifecycle suites pass `153/153`; the full
  provider-free integration gate across adapter, lifecycle, outer context,
  history materialization, and completion passes `303/303`; typecheck,
  zero-warning touched Biome, production build, plan audit with zero validation
  errors, and diff check pass.
- `runtime_readback`: API PID 17440 is active/running with `NRestarts=0`;
  scheduler state/posture are paused; active history jobs are zero; default is
  paused/pass 7, `wsl-chrome-2` paused/pass 2, `wsl-chrome-4` paused/pass 34,
  and `wsl-chrome-3` blocked/pass 42 with force ceiling null. No control or
  provider/browser operation occurred.
- `built_source_adapter_hash`:
  `1ccee21f39a8f1343eab9b56be2da10c064d5744e70bb539d8fb826c2a7ed667`;
  installed runtime intentionally remains
  `11f31a2e804a1ca7ff8856d053a61ab37d017500feb8a6e2fe2913306264b978`.
- `remaining_criteria`: push this source/docs checkpoint, perform the
  closed-world F01-F04 closeout audit, and prepare a separate exact pass-43
  effect gate without executing it.
- `next_action_or_stop_reason`: commit and push the proven provider-free repair,
  then close Plan 0216 only after the separate canary plan is frozen.

## Checkpoint 4 | Closed-World Closeout And Canary Handoff

- `plan_version`: 1
- `checkpoint_id`: `P0216-C04`
- `goal_turn`: 2 of 10 maximum.
- `state_transition`: PROVIDER_FREE_REPAIR_GATE_GREEN ->
  PROVIDER_FREE_REPAIR_COMPLETE_CANARY_PREPARED.
- `progress_classification`: goal_complete_provider_free.
- `closed_world_audit`: F01 resolved by full-job receipt promotion; F02 resolved
  by browser/protocol/transport payload deadlines; F03 resolved by retained
  session invalidation and awaited cleanup; F04 rejected because the exact
  sequence and adjacent gate reveal no later independent blocker; F05 remains
  protected by unchanged identity, guard, CAPTCHA, ordering, and full-content
  contracts.
- `verification`: integrated provider-free suites `303/303`; typecheck;
  zero-warning touched Biome; production build; plan audit validation errors
  zero; diff check clean. Source/docs commits `32382bcf` and `741d11b9` are
  pushed.
- `runtime_readback`: API PID 17440 active/running with zero restarts; scheduler
  paused; active jobs zero; default paused/pass 7, `wsl-chrome-2` paused/pass 2,
  `wsl-chrome-4` paused/pass 34, and `wsl-chrome-3` blocked/pass 42.
- `effect_accounting`: installs 0, restarts 0, provider/browser calls 0,
  completion controls 0, materialization starts 0, scheduler controls 0.
- `successor_gate`:
  [Plan 0217](0217-2026-08-07-chatgpt-context-deadline-installed-pass-43-canary.md)
  freezes one install, one API restart, exact source/installed hash parity, one
  pass `42 -> 43`, and one fresh child. It is prepared but not authorized.
- `next_action_or_stop_reason`: stop with all live effects withheld. Await
  separate explicit Plan 0217 approval; do not resume any scheduler or wider
  completion.
