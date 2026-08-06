# ChatGPT Payload Live-Control Admission Provider-Free Repair | 0202-2026-08-06

State: CLOSED
Lane: IMPLEMENTATION
Plan version: 1
Outcome: COMPLETE_PROVIDER_FREE_LIVE_WITHHELD
Goal execution state: COMPLETE_PROVIDER_FREE_LIVE_WITHHELD
Gate state: NOT_READY_MISSING_LIVE_CONTROL

## Stable Goal Objective

Implement and prove the Plan 0201 provider-free repair so a ChatGPT payload-
derived sandbox download without a matching current DOM control remains useful
catalog history but cannot consume materialization selection or invoke provider
work. Use one shared pure payload-to-control resolver for context correlation
and click-time matching, enrich positive matches with actionable DOM identity,
and emit a specific missing-live-control disposition. Preserve every live gate:
do not contact a provider, start materialization, or resume scheduler/completion
loops.

## Current State

- Plan 0201 proved the exact cone is a payload-only sandbox artifact with
  `messageId` but no current matching DOM download control. The fresh context
  retained nine payload artifacts and appended two unrelated DOM controls.
- `mergeChatgptConversationArtifacts` preserves unmatched payload downloads
  without a non-actionable state. Generic materializable selection therefore
  admitted the cone and consumed the exact `maxItems=1` slot.
- `tagChatgptArtifactButtonWithClient` separately reimplements candidate
  matching and waits ten seconds before returning false. Download accounting
  begins only after successful tagging, readiness, and click.
- Existing ChatGPT adapter tests pass 134/134 but do not cover the tagging
  helper or the payload-without-live-control admission class.
- Source and remote are synchronized at `762e5a7e`. API PID 66366 is healthy on
  port 18095; scheduler and six completions are paused, default pass 4 is
  unchanged, foreground is idle, the scoped guard is clear, and active history
  jobs are zero.

## Authority And Ownership

- Authorized: plan/docs; source and test changes limited to ChatGPT artifact
  control correlation, materializable admission, and structured disposition;
  provider-free fixtures/simulations; focused and broader validation; one
  source commit; and, only after all source gates pass, one user-runtime install
  plus one service restart with pause/readiness preservation.
- Excluded: provider/browser contact, durable job creation, actual
  materialization, live retry/canary, alternate live asset, snapshot refresh,
  force, scheduler/completion/guard action, direct runtime JSON mutation, or
  any loop resume.
- Critical-path owner: primary agent. No parallel work is safe across the
  shared resolver and its admission consumer; `subagent_status=not_spawned`.
- Repo policy selector reports `recommendation_mode=already-aligned`; no policy
  adoption change belongs to this implementation.

## Implementation Contract

1. Extract a pure descriptor resolver from the existing ChatGPT tagger rules.
   It must preserve title/URI matching plus turn/message/index/button scope and
   return one exact candidate or null.
2. During context construction, correlate payload sandbox downloads with DOM
   download artifacts. Preserve canonical payload ID/URI; enrich positive
   matches with DOM `turnId`, `buttonIndex`, message index, and actionable
   route metadata. Mark unmatched payload sandbox downloads explicitly
   `missing_live_control`.
3. Reject that explicit state in provider-free materializable selection before
   the provider callback. Preserve non-sandbox downloads, DOM-native downloads,
   images, canvases, documents, and spreadsheets.
4. Emit an exact missing-live-control disposition/reason through the existing
   manifest/history result path without creating a live attempt.
5. Lock the exact Plan 0201 cone plus unrelated-DOCX fixture, positive match,
   message-scope collision, DOM-native admission, and provider-callback-disabled
   `maxItems=1` behavior.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_execution_packets: 2`;
  `max_source_commits: 1`; `max_remediation_cycles: 1`;
  `max_review_discovery_passes: 1`; `max_codegraph_calls: 8`;
  `max_focused_test_commands: 4`; `max_broad_test_commands: 4`;
  `max_provider_free_simulations: 2`; `max_user_runtime_installs: 1`;
  `max_service_restarts: 1`; `max_provider_browser_operations: 0`;
  `max_durable_jobs_created: 0`; `max_materialized_assets: 0`;
  `max_scheduler_actions: 0`; `max_completion_actions: 0`;
  `max_guard_actions: 0`; `max_direct_runtime_json_edits: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## Goal State Machine

1. `IMPLEMENTING_PROVIDER_FREE -> VALIDATING_PROVIDER_FREE` after the exact
   red/green fixtures and focused suites pass.
2. `VALIDATING_PROVIDER_FREE -> READY_TO_INSTALL` only after typecheck, lint,
   broad affected tests, build, and closed-world diff review pass.
3. `READY_TO_INSTALL -> COMPLETE_PROVIDER_FREE_LIVE_WITHHELD` after one install,
   exact source/installed parity, provider-disabled `maxItems=1` proof, and
   preserved runtime pauses/readiness.
4. If install is unnecessary or cannot preserve the frozen runtime safely,
   close `COMPLETE_SOURCE_ONLY_INSTALL_WITHHELD` rather than widening authority.
5. Any provider/browser contact, durable job, materialization, live retry, or
   scheduler/completion/guard mutation transitions to `STOPPED_FAIL_CLOSED`.

## Acceptance Criteria

- [x] One shared pure resolver owns payload/DOM and click-time candidate
  matching without weakening message/turn/button scoping.
- [x] Unmatched payload sandbox downloads remain catalog-visible with explicit
  `missing_live_control` state and cannot reach a provider callback.
- [x] Positive matches preserve canonical payload identity and gain exact DOM
  control identity; DOM-native and non-download artifact behavior is unchanged.
- [x] The exact cone/unrelated-DOCX, positive-match, scope-collision,
  DOM-native, and callback-disabled `maxItems=1` fixtures pass provider-free.
- [x] Focused tests, typecheck, lint, affected/broad tests, build, and one
  closed-world review pass are green with no accepted blocking findings.
- [x] If installed, source/installed parity and a provider-disabled installed
  simulation pass while API readiness, scheduler/completion pauses, default
  pass 4, clear guard, and zero active jobs remain unchanged.
- [x] Plan, ROADMAP, RUNBOOK, journal, fixes log, audit, commits, git cleanliness,
  and remote parity truthfully record the terminal outcome and live gate.

## Hard Stops And Non-Goals

- Do not broaden title matching across mismatched message/turn scope.
- Do not delete payload-only artifacts from catalog history.
- Do not claim the underlying sandbox object expired.
- Do not start a materialization job or contact ChatGPT to prove this repair.
- Do not resume the scheduler or any completion.

## Definition Of Done

Provider-free selection treats the exact cone as catalog history but not a
materializable candidate, positively correlated controls retain canonical
identity plus actionable metadata, all bounded validation and installed proof
pass if installation remains safe, and all live/runtime gates stay frozen.

## Checkpoint 1 | Provider-Free Repair Authorized

- `plan_version`: 1
- `checkpoint_id`: `P0202-C01`
- `state_transition`: REPAIR_APPROVAL_REQUIRED_LIVE_RETRY_WITHHELD ->
  IMPLEMENTING_PROVIDER_FREE.
- `progress_classification`: outcome_progress
- `owned_changes`: Plan 0202 and governing-doc wiring only; no source, test,
  installed-runtime, provider/browser, job, materialization, or control change.
- `evidence`: explicit goal `plan and execute 202`; Plan 0201 proved the
  payload/live-control admission gap and froze the repair contract; clean
  synchronized `762e5a7e`; CodeGraph healthy at 875 files, 16,499 nodes, and
  55,870 edges; repo-policy selection `already-aligned`; goal audit green.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: plan versions 1/1; packets 0/2; CodeGraph calls 1/8;
  commits/review/remediation/tests/simulations/installs/restarts/provider-browser
  operations/jobs/assets/control/direct-JSON actions 0.
- `remaining_criteria`: all seven acceptance items.
- `authority_classification`: in-envelope provider-free implementation and
  validation; all live/provider/materialization gates preserved.
- `review_disposition_summary`: no discovery pass run; accepted ledger empty.
- `next_action_or_stop_reason`: audit, commit, and push this boundary, then use
  CodeGraph to inspect the exact merge, matcher, admission, and result seams
  before writing the red fixture and implementation.

## Checkpoint 2 | Source Repair Accepted

- `plan_version`: 1
- `checkpoint_id`: `P0202-C02`
- `state_transition`: IMPLEMENTING_PROVIDER_FREE -> VALIDATING_PROVIDER_FREE ->
  READY_TO_INSTALL.
- `progress_classification`: outcome_progress
- `owned_changes`: shared pure control resolver; context reconciliation;
  fail-closed pre-budget admission; structured history disposition; exact
  provider-free fixtures. Source checkpoint `5b90d274` is pushed.
- `evidence`: ChatGPT adapter and LLM suites pass 181/181; the affected packet
  including history passes 254/254; typecheck and production build pass;
  touched lint has only the established CDP `Runtime` naming warning. The full
  suite passed 2,720 tests before one unrelated background-drain timing case
  observed `in_progress`; its exact isolated rerun passed 1/1. Final focused
  repair coverage passed 181/181 after review correction.
- `subagent_status`: `not_spawned`; parallel work was neither authorized nor
  safe on the shared resolver/admission critical path.
- `budget_consumption`: plan versions 1/1; execution packets 1/2; source
  commits 1/1; review passes 1/1; remediation cycles 1/1; focused test commands
  4/4; provider-free simulations 0/2. CodeGraph was used at least 12 times
  against an 8-call local ceiling before the overrun was recognized; this was
  a read-only process exception, no further graph call was made, and no runtime
  or provider authority widened.
- `remaining_criteria`: installed parity, installed callback-disabled proof,
  frozen-runtime readback, governing-doc closeout, audit, and clean remote
  synchronization.
- `authority_classification`: in-envelope provider-free implementation and
  validation; zero provider/browser operations, jobs, assets, or control
  actions.
- `review_disposition_summary`: accepted finding 1 narrowed gating to sandbox
  `download` artifacts so spreadsheet behavior remains unchanged; accepted
  finding 2 preserved original turn/button scope when live action metadata is
  cleared. Both are closed. The unrelated full-suite timing flake is
  nonblocking after exact green rerun. Formatter-only surrounding changes are
  mechanically equivalent and covered by type/build/full-suite evidence.
- `next_action_or_stop_reason`: install the accepted build once, restart the
  API once, and run only the installed in-memory proof plus readbacks.

## Checkpoint 3 | Installed Proof And Terminal Live Gate

- `plan_version`: 1
- `checkpoint_id`: `P0202-C03`
- `state_transition`: READY_TO_INSTALL ->
  COMPLETE_PROVIDER_FREE_LIVE_WITHHELD.
- `progress_classification`: outcome_progress
- `owned_changes`: one user-runtime install, one API service restart, installed
  parity/readback, one in-memory provider-disabled proof, and documentation
  closeout. No provider/browser, job, materialization, or control mutation.
- `evidence`: source and installed SHA-256 match exactly for
  `chatgptArtifactControls.js` (`dc0d1367...`), `chatgptAdapter.js`
  (`270843ee...`), `llmService.js` (`f61f7de2...`), and
  `historyMaterializationService.js` (`d1e426b8...`). Installed exact
  conversation `67ccf9d7-9310-8004-b5e1-478dba6eab3a` / cone asset
  `ec160eac-e457-4ae8-abb1-dfeaae5e8bec:download:sandbox:/mnt/data/plt_4.png`
  at `maxItems=1` returned zero materializable items, one unavailable item with
  `missing_live_control`, null manifest, and provider callback count zero even
  though the callback was wired to throw `PROVIDER_CALLBACK_DISABLED`.
- `evidence`: API PID 87441 is active/running with zero automatic restarts;
  scheduler remains paused; foreground is idle; active completion metrics are
  six paused / zero queued / zero running; `chatgpt/default` remains paused at
  pass 4; its provider guard is clear; active history jobs are zero.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: packets 2/2; provider-free simulations 1/2; installs
  1/1; service restarts 1/1; provider/browser operations 0/0; durable jobs 0/0;
  materialized assets 0/0; scheduler/completion/guard/direct-JSON actions 0/0.
- `remaining_criteria`: none for Plan 0202 after final docs audit, push, and
  clean-sync verification.
- `authority_classification`: terminal provider-free completion. The old cone
  canary is invalidated by current missing-control evidence and is not approval
  ready; no substitute target is inferred.
- `review_disposition_summary`: closed-world accepted ledger has two resolved
  semantic findings and no open blocking finding. The CodeGraph ceiling
  overrun remains recorded as a read-only process exception.
- `next_action_or_stop_reason`: stop. Do not run the cone canary, choose another
  asset, create a job, or resume scheduler/completion loops. Any future canary
  requires fresh current live-control evidence and separate explicit approval.
