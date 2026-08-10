# ChatGPT External Image Artifact Fetch Repair | 0244-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Goal execution state: ACTIVE
Gate state: PROVIDER_FREE_GREEN_INSTALL_READY

## Stable Objective

Repair the pass-54 external DOM-image artifact binary failure with a
provider-free red/green proof, validate the installed repair through one
externally attached agent-browser diagnostic on the exact AuraCall-managed
`wsl-chrome-3` browser, and only then run one fresh pass-55 canary. Keep the
global scheduler and every wider completion paused throughout.

## Current State

- Plan 0243 stopped at pass 54 after sole child
  `hmj_a2cbb3ac5369477b9cfb3efb21e8d47f` returned four verified files and one
  failed external image artifact. The failed artifact is
  `image-dom:ecc7328a-cad6-4299-a721-a39dc21e9063:0` for conversation
  `6a4852f5-5cb4-83ea-9aca-57fe9e8cc6a0`; its external CDN URL produced the
  exact adapter error `ChatGPT artifact binary fetch failed`.
- Provider identity matched and no authentication, challenge, guard, timeout,
  or pending-operation signal accompanied the failure. The target completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446` is blocked at
  pass 54 with force/next null. Wider completions remain paused at passes
  `7/2/34`; scheduler and active work remain stopped.
- The source path locates the failure in `fetchChatgptBinaryWithClient`: it
  executes credentialed page-context `fetch()` and converts a missing/non-ok
  by-value result into the generic error. DOM image discovery itself had
  already succeeded.

## Authority And Non-Goals

- Authorized implementation effects: provider-free tests and source repair;
  one build/install and one API restart after provider-free green; one exact
  AuraCall-owned `wsl-chrome-3` browser launch and close; one agent-browser CDP
  attachment and detach; one bounded metadata-only diagnostic of the exact
  image URL; and, only after the diagnostic gate passes, one exact pass-55
  `run-one-pass` control with one child/attempt and the persisted six-item
  ceiling.
- The external diagnostic may inspect URL/title/challenge state and compare a
  page-context fetch outcome with a CDP resource-content outcome. It must not
  print or retain cookies, credentials, request/response headers, raw page
  content, or unrelated network traffic. No click, input, prompt, reload,
  conversation navigation, or `Answer now` action is allowed.
- Excluded: scheduler control; any other completion; pass 56; retry or
  substitute materialization; force/config/account-library/guard mutation;
  direct runtime JSON edits; duplicate browser-profile process; and any wider
  automatic completion.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; the user
  did not request delegation and the browser/completion boundary is serialized.

## Execution Graph

1. Add a tight provider-free regression that reproduces the missing by-value
   result for the exact external-image shape and fails against current source.
2. Rank falsifiable causes, test one variable at a time, and implement only the
   narrowest transport fallback that preserves existing authenticated fetch
   behavior and bounded telemetry.
3. Pass targeted tests, adjacent adapter tests, typecheck, build, scoped lint,
   plan audit, and diff hygiene; then install once, restart once, and prove
   source/installed bundle parity plus stopped runtime invariants.
4. Launch the exact AuraCall-managed browser once. Bind its actual live CDP
   port, attach agent-browser once, prove authenticated/non-challenged state,
   and execute one metadata-only diagnostic for the exact external image URL.
5. Detach agent-browser and close only the owned browser. If and only if the
   diagnostic proves the repaired transport obtains nonempty image bytes while
   the scheduler/wider boundaries remain frozen, invoke pass 55 once.
6. Monitor the sole child and parent absorption; independently verify identity,
   materialized files/checksums/archive ownership, stopped browser/jobs, and
   no pass 56. Close docs, audit, commit, and push.

## Local Goal Bounds

- `provider_free_reds: 1`; `implementation_slices: 1`; `installs: 1`;
  `api_restarts: 1`; `browser_launches: 1`; `agent_browser_attaches: 1`;
  `metadata_diagnostics: 1`; `browser_closes: 1`;
  `completion_controls: 1`; `pass_advances: 1`; `fresh_children: 1`;
  `child_attempts: 1`; `per_pass_max_items: 6`.
- `scheduler_actions: 0`; `other_completion_actions: 0`;
  `pass_56_actions: 0`; `retries: 0`; `force_mutations: 0`;
  `config_mutations: 0`; `guard_actions: 0`; `direct_runtime_json_edits: 0`;
  `conversation_navigations: 0`; `reloads: 0`; `browser_clicks: 0`;
  `prompt_submissions: 0`; `answer_now_actions: 0`;
  `duplicate_profile_processes: 0`; `subagents: 0`.

## Hard Stops

- Stop before live diagnosis on provider-free regression failure, source/build/
  installed mismatch, unhealthy API, non-paused scheduler, active work,
  completion drift, provider guard, or exact browser ownership ambiguity.
- Stop the diagnostic on wrong origin, login loss, CAPTCHA/challenge/human
  verification, `Answer now`, profile mismatch, raw-header/content exposure,
  or any need for a second launch/attach/probe.
- Do not run pass 55 unless the diagnostic obtains nonempty image bytes through
  the repaired seam, the exact browser is closed, and all stopped boundaries
  are freshly reconfirmed.
- Stop after the single pass-55 control regardless of outcome. Any failure,
  timeout, auth/challenge signal, identity mismatch, fanout, missing receipt,
  or pass movement beyond 55 ends the packet without retry or wider resume.

## Acceptance Criteria

- [ ] One exact provider-free regression is red before the repair and green
  after it; existing successful and timeout behavior remains green.
- [ ] Targeted/adjacent validation, typecheck, build, lint, audit, and diff
  hygiene pass; one install/restart yields exact source/installed parity.
- [ ] One external agent-browser attachment to the exact AuraCall-owned browser
  proves healthy auth/challenge state and nonempty exact-image bytes without
  raw content/header retention or duplicate-profile activity.
- [ ] Exactly one pass-55 canary runs only after the diagnostic gate, creates no
  more than one child/attempt, does not reach pass 56, and has complete identity
  and asset/stopped-state receipts.
- [ ] Scheduler remains paused/idle, wider passes remain `7/2/34`, excluded
  effects remain zero, and final plan/journal/fix/runbook evidence is audited,
  committed, and pushed.

## Opening Checkpoint | Provider-Free Red Gate

- `checkpoint_id`: `P0244-C01`.
- `state_transition`: P0243_CLOSED_PASS_54_C5_PARTIAL_YIELD ->
  P0244_ACTIVE_PROVIDER_FREE_RED.
- `progress_classification`: blocker_reduction.
- `evidence`: clean synchronized Git at `946310f3`; exact pass-54 artifact and
  generic fetch failure retained above; CodeGraph places the fault after DOM
  image discovery at the credentialed page-context binary fetch.
- `owned_changes`: this plan, journal, and runbook opening authority only.
- `subagent_status`: not_spawned; one serialized critical path.
- `next_action_or_stop_reason`: produce the exact provider-free red, then show
  and test ranked hypotheses before editing production source.
- `authority_classification`: explicit operator direction to repair with
  provider-free evidence, external agent-browser diagnosis, and one canary;
  scheduler and wider completion authority remain zero.

## Provider-Free Checkpoint | Loaded-Resource Fallback Green

- `checkpoint_id`: `P0244-C02`.
- `state_transition`: P0244_ACTIVE_PROVIDER_FREE_RED ->
  P0244_PROVIDER_FREE_GREEN_INSTALL_READY.
- `progress_classification`: blocker_reduction.
- `red_evidence`: the exact external-image fixture returned a rejected-promise
  `Runtime.evaluate` result while exposing the same image through
  `Page.getResourceContent`; current source failed at line 9718 with `ChatGPT
  artifact binary fetch failed`. One test failed and 153 were skipped.
- `hypothesis_disposition`: H1 cross-origin page-fetch rejection remains the
  leading live hypothesis and is repaired provider-free; H2 explicit non-2xx
  stays terminal and does not enter fallback; H3 resource-not-loaded and H4
  unrelated page exception remain live-diagnostic alternatives.
- `implementation`: when and only when page fetch has no structured value, the
  adapter reads the already-loaded resource through `Page.getResourceTree` and
  `Page.getResourceContent`, with bounded waits, one transfer receipt, and
  MIME inference. Explicit status responses retain existing failure semantics.
- `verification`: adapter `155/155`; integrated adapter/history/MCP gate
  `236/236`; typecheck; scoped Biome zero-warning; full build; diff check.
  Built adapter SHA-256 is `4b2dca82be9c5a6325b1a2749cdcb3218d1211e5f0a232bbfe20cb00d39c4725`.
- `effect_accounting`: provider-free reds 1/1; implementation slices 1/1;
  installs/restarts/browser launches/attaches/diagnostics/completion controls
  all 0; excluded effects zero.
- `next_action_or_stop_reason`: audit, commit, and push the provider-free
  repair; then freshly verify stopped runtime, install/restart once, and prove
  built/installed adapter parity before any browser launch.

