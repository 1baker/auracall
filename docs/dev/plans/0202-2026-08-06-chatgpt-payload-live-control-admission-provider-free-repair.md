# ChatGPT Payload Live-Control Admission Provider-Free Repair | 0202-2026-08-06

State: OPEN
Lane: IMPLEMENTATION
Plan version: 1
Outcome: PENDING_IMPLEMENTATION
Goal execution state: IMPLEMENTING_PROVIDER_FREE
Gate state: LIVE_CANARY_WITHHELD

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

- [ ] One shared pure resolver owns payload/DOM and click-time candidate
  matching without weakening message/turn/button scoping.
- [ ] Unmatched payload sandbox downloads remain catalog-visible with explicit
  `missing_live_control` state and cannot reach a provider callback.
- [ ] Positive matches preserve canonical payload identity and gain exact DOM
  control identity; DOM-native and non-download artifact behavior is unchanged.
- [ ] The exact cone/unrelated-DOCX, positive-match, scope-collision,
  DOM-native, and callback-disabled `maxItems=1` fixtures pass provider-free.
- [ ] Focused tests, typecheck, lint, affected/broad tests, build, and one
  closed-world review pass are green with no accepted blocking findings.
- [ ] If installed, source/installed parity and a provider-disabled installed
  simulation pass while API readiness, scheduler/completion pauses, default
  pass 4, clear guard, and zero active jobs remain unchanged.
- [ ] Plan, ROADMAP, RUNBOOK, journal, fixes log, audit, commits, git cleanliness,
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
