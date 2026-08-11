# ChatGPT Route-Bound Payload Reacquisition Provider-Free Repair | 0265-2026-08-11

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_VALIDATED
Goal execution state: PAUSED_AT_FUTURE_LIVE_GATE

## Current State

Plan 0264's sole classified canary proved the payload is missing after the
fallback and the tab is on ChatGPT home. CodeGraph shows the payload fallback
arms an exact conversation API listener but calls `reloadAndSettle`, whose
requested route is whatever page is current. The fallback is therefore not
bound to the admitted conversation route.

## Stable Objective

Provider-free, reproduce the home-route loss through the exported conversation
payload reader, then make the single governed fallback mutation target the
exact admitted ChatGPT conversation route. Preserve exact API response capture,
terminal 404/410 classification, bounded body reads, listener cleanup, and the
zero-retry contract.

## Authority And Non-Goals

- Source, tests, build output, plans, roadmap, runbook, journal, fixes log, and
  testing docs only.
- Keep `readChatgptConversationPayloadWithClient` as the caller/test interface;
  hide route binding inside the existing browser navigation module.
- One behavioral tracer test at a time: direct fetch fails, current route is
  home, exact route mutation emits the recoverable API response.
- No install, API restart, browser launch/attachment, provider call, context
  canary, materialization, completion/scheduler control, prompt, model
  selection, click, download/upload, guard/config mutation, or direct runtime
  edit.

## Acceptance Criteria

- [x] The exact provider-free tracer fails before implementation because the
  route-unbound reload cannot recover from ChatGPT home.
- [x] The existing payload-reader interface performs one governed exact-route
  mutation and returns the captured mapping without a second fallback.
- [x] Exact fallback 404/410 remains terminal; hanging/rejected commands and
  response bodies remain bounded; listeners and mutation audit settle once.
- [x] Focused adapter and browser-service tests, adjacent context/canary tests,
  typecheck, build, scoped formatting/lint, diff hygiene, and plan audit pass.
- [x] Runtime readback remains pass 56, scheduler paused/paused, active work and
  exact browser ownership zero, and every excluded effect remains zero.

## Local Goal Bounds

- `max_provider_free_reds: 2`; `max_repair_cycles: 1`;
  `max_installs: 0`; `max_api_restarts: 0`; `max_browser_launches: 0`;
  `max_provider_calls: 0`; `max_context_reads: 0`; `max_context_retries: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_subagents: 0`.

## Activation Checkpoint | Exact Route-Binding Red Ready

- `checkpoint_id`: `P0265-C01`.
- `state_transition`: P0264_CLOSED_ACCEPTED_CLASSIFIED_DIAGNOSTIC ->
  P0265_ACTIVE_PROVIDER_FREE.
- `progress_classification`: outcome_progress.
- `evidence`: exact live stage is payload-missing/home-route. CodeGraph binds
  the route-unqualified fallback to `reloadAndSettle` after the exact API
  listeners are armed.
- `authority_classification`: provider-free source/tests/docs only; all runtime
  and external effects excluded.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: add one public-seam red, require exact failure,
  then implement only the route-bound fallback needed to make it green.

## Definition Of Done

Provider-free tests prove that a fallback beginning on ChatGPT home still
reacquires the exact conversation payload through one governed route-bound
mutation, without weakening terminal, timeout, cleanup, or retry controls. A
later live gate is separate and remains withheld.

## Terminal Checkpoint | Route-Bound Reacquisition Green

- `checkpoint_id`: `P0265-C02`.
- `state_transition`: P0265_ACTIVE_PROVIDER_FREE ->
  P0265_CLOSED_PROVIDER_FREE_VALIDATED.
- `progress_classification`: causal_repair_validated.
- `red_evidence`: the sole public-seam tracer failed 1/1 because the fallback
  reloaded ChatGPT home and returned null instead of the exact mapping.
- `repair_evidence`: `navigateAndSettle` now accepts optional forced navigation
  and caller-owned completion evidence. The ChatGPT adapter uses that existing
  governed primitive to navigate once to the admitted conversation route after
  arming exact Network listeners; the exported payload-reader interface is
  unchanged.
- `validation_evidence`: 255/255 focused and adjacent tests pass; 144 wider
  navigation/provider/CLI tests pass with one intentional skip; typecheck and
  production build pass. The frozen canary dry-run reports provider calls zero
  and browser launches zero. Scoped Biome has zero errors and only 24 existing
  CDP-domain naming warnings; diff checks pass.
- `runtime_evidence`: API PID 21763 remains active/running with `NRestarts=0`;
  scheduler is paused/paused; the target remains
  idle-waiting/backfill-history/pass 56 with null error/next/force; active
  history jobs are zero; browser-tools returns `[]`; port 45015 is unbound.
  Built adapter SHA-256 is
  `3068a77bb72666335cf9f46beea73eb2a47f4fbf91d7340136dbf36dd8008c8f`;
  installed remains
  `2acb20a98796e9c69deff9bae8ded21e2acd5fdf80fd57c025cd92e45630bd3b`.
- `authority_classification`: one provider-free red and one repair cycle were
  consumed. Install/restart, browser/provider/context, materialization,
  completion/scheduler control, prompt/model/click/download, runtime edit, and
  subagent effects remained zero.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: Plan 0266 is prepared for separate approval of
  one combined install/restart and one zero-retry canary; do not start it from
  this provider-free closure.
