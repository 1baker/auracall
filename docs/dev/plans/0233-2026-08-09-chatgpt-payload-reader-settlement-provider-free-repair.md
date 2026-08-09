# ChatGPT Payload-Reader Settlement Provider-Free Repair | 0233-2026-08-09

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_GREEN_LIVE_WITHHELD
Goal execution state: COMPLETE_PROVIDER_FREE_SETTLEMENT_REPAIR

## Stable Goal Objective

Build a tight provider-free reproducer for the installed ChatGPT failure in
which the authenticated direct conversation request returns parseable JSON 404,
the reload response body is retrievable and parseable, yet AuraCall's enclosing
`readConversationPayload` operation does not settle. Identify and repair the
exact callback-ordering, CDP target/session-ownership, or enclosing-reader
settlement defect without changing payload semantics. Prove the original
provider-free repro and its integration surface green. Do not launch or attach
a browser, call a provider, install or restart AuraCall, start materialization,
control a completion/scheduler/guard, or resume wider work.

## Current State

- Plan 0232 closed at pushed commit `fc2126a1` after one exact
  `wsl-chrome-3` canary. The direct metadata-only request returned parseable
  JSON 404 in 171 ms; after one clear and reload, the closed-world helper found
  one exact 200 response with a present 4098025-character parsed JSON body and
  mapping count 138 in 17968 ms.
- That C5 result rejects a live agent-browser response-detail/
  `Network.getResponseBody` stall for the exact route. Remaining diagnosis is
  AuraCall callback ordering, CDP target/session ownership, or the enclosing
  payload-reader settlement path.
- The prior exact session and browser are closed. API PID 32737 had zero
  restarts; target completion remained blocked/pass 49/force null; active
  history jobs were zero; wider ChatGPT completions remained paused at
  `7/2/34`; scheduler remained paused; provider guard was clear.
- The active user goal permits up to 10 turns to continue the repair. This plan
  uses that standing authority for provider-free source/test/docs work only;
  it does not infer installed or live authority.

## Required Feedback Loop

Before reading toward or applying a causal source fix, establish one command
that is all of:

- red-capable at the real `readConversationPayload` callback/session seam;
- deterministic and agent-runnable;
- fast enough for repeated provider-free use;
- specific to the exact symptom: direct 404, reload response body available,
  but the enclosing payload reader remains unsettled or times out.

The loop must run red at least once before implementation. If the existing test
architecture cannot express that complete pattern, create the narrowest
throwaway-free harness at the real adapter seam and treat the missing seam as
an architectural finding rather than substituting a shallow green test.

## Execution Packet

1. Use CodeGraph to locate the complete `readConversationPayload` flow and its
   current test seam while building the feedback loop; do not infer the path
   from grep or stale docs.
2. Run the loop red, reproduce the exact unsettled-reader symptom, and minimize
   until each remaining event/order/session input is load-bearing.
3. Publish 3-5 ranked falsifiable hypotheses with their predicted observations,
   then test one variable at a time. Any temporary instrumentation must use one
   unique `[DEBUG-*]` prefix and be removed before closeout.
4. Convert the minimized repro into the regression test, apply only the causal
   repair, and prove the test red-to-green.
5. Re-run the original loop plus the adjacent ChatGPT adapter/browser-service
   integration tests, typecheck, production build, scoped lint, plan audit, and
   diff/sensitive-marker hygiene.
6. Update the journal and durable fixes log, close/audit/commit/push the plan,
   and stop before any installed or live validation. A separately explicit
   effect gate is required for install/restart or another canary.

## Acceptance Criteria

- [x] One named provider-free command reproduces the exact unsettled-reader
  symptom red at the real callback/session seam.
- [x] The repro is minimized and 3-5 falsifiable hypotheses are ranked and
  tested against observed evidence.
- [x] A regression test proves the causal fix red-to-green without weakening
  payload, timeout, session-ownership, or fallback semantics.
- [x] The original repro and adjacent integration surface are green; typecheck,
  production build, scoped lint, plan audit, and diff hygiene pass.
- [x] All temporary debug instrumentation is removed and no raw payload,
  conversation content, credential, identity, header, cookie, or request body
  enters stdout, fixtures, or repo artifacts.
- [x] No browser/provider, installed-runtime, materialization,
  completion/scheduler/guard, direct runtime-state, or wider-resume effect
  occurs.
- [x] Plan 0233 is closed, committed, and pushed with a provider-free next gate
  that does not authorize live execution.

## Local Goal Bounds

- `max_goal_turns: 10`; `max_execution_packets: 1`;
  `max_red_cycles: 2`; `max_implementation_cycles: 2`;
  `max_review_rework_cycles: 1`; `max_hardening_checkpoints: 1`;
  `checkpoint_interval: 1 validated packet`;
  `max_browser_launches: 0`; `max_agent_browser_live_attaches: 0`;
  `max_provider_calls: 0`; `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_controls: 0`;
  `max_wider_resumes: 0`; `max_subagents: 0`.

## Hard Stops

- Stop source repair if no tight red-capable loop reproduces the exact symptom;
  do not replace it with a nearby unit test that cannot catch the bug.
- Stop if evidence points back to provider/browser state or requires a new
  browser, provider, installed-runtime, private-data, or runtime-control effect.
- Stop on any proposed change that weakens payload completeness, exact route or
  session ownership, timeout cleanup, provider guards, or stopped-runtime
  controls.
- Stop after two red or implementation cycles without blocker reduction; split
  or reframe rather than iterating indefinitely.

## Checkpoint 1 | Provider-Free Settlement Repair Opens

- `checkpoint_id`: `P0233-C01`.
- `state_transition`: P0232_CLOSED_C5_DETAIL_COMPLETED ->
  P0233_OPEN_PROVIDER_FREE_RED_REQUIRED.
- `progress_classification`: blocker_reduction.
- `authority_classification`: standing goal authority covers one provider-free
  reproducer, causal diagnosis, source/test/docs repair, validation, audit,
  commit, and push. Every installed, browser/provider, materialization,
  completion/scheduler/guard, and wider-resume effect remains excluded.
- `evidence`: Plan 0232 C5 exact live metadata; closed session/browser;
  synchronized clean `main` at `fc2126a1`; active goal allowing up to 10 repair
  turns.
- `subagent_status`: not_spawned; `max_subagents=0`; repo policy requires
  direct CodeGraph-backed exploration for this narrow critical path.
- `review_disposition_summary`: response-detail transport stall rejected;
  callback ordering, CDP target/session ownership, and enclosing-reader
  settlement accepted for one feedback-loop-first diagnosis.
- `next_action_or_stop_reason`: audit, commit, and push this provider-free
  authority, then build and run the exact red-capable loop before any source
  repair.

## Checkpoint 2 | Exact Reader Settlement Repair Closes

- `checkpoint_id`: `P0233-C02`.
- `state_transition`: P0233_OPEN_PROVIDER_FREE_RED_REQUIRED ->
  P0233_CLOSED_PROVIDER_FREE_GREEN_LIVE_WITHHELD.
- `progress_classification`: causal_repair_complete_provider_free.
- `root_cause`: the fallback reader awaited the CDP `Page.reload` command
  acknowledgement before consuming its independently resolved exact Network
  response body. A reload acknowledgement that remained pending therefore
  stranded valid parsed payload data and the enclosing operation.
- `repair`: keep the governed reload error-handled but concurrent; settle the
  reader from the exact response body, which is the payload completion signal.
  Shared `reloadAndSettle` behavior and payload semantics are unchanged.
- `red_evidence`: the named single-test command failed with
  `expected resolved, received pending` after the exact 200 callback and
  successful `getResponseBody`; the same command passed after the repair.
- `validation`: ChatGPT adapter 151/151; browser-service UI 54/54; TypeScript
  typecheck; production build; scoped Biome check; goal-only plan audit; clean
  diff hygiene.
- `effect_accounting`: browser launches 0; live attaches 0; provider calls 0;
  installs 0; API restarts 0; materialization starts 0; completion controls 0;
  scheduler controls 0; guard controls 0; wider resumes 0; subagents 0.
- `next_gate`: source is provider-free ready only. Any install/restart or fresh
  `wsl-chrome-3` canary requires a separately explicit effect gate and fresh
  stopped-runtime readback; no live execution is authorized by this closeout.
