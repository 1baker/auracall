# Broad Static False-Positive Admission Repair | 0240-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Outcome: ACTIVE_PROVIDER_FREE_REPAIR
Goal execution state: ACTIVE
Gate state: STATIC_FALSE_POSITIVE_REGRESSION_REQUIRED

## Stable Objective

Prevent broad history reconciliation from selecting a conversation when every
downloadable family is already terminal and its only residual catalog rows are
known static false positives, then prove `maxItems=1` advances provider-free to
the next actually actionable conversation before any new install or canary.

## Current State

- Plan 0239 closed at pushed commit `82d1eea4`. The exact-terminal repair is
  installed with source/runtime bundle SHA-256 parity at
  `625739bca9473885de39eadf3b104664ca009ddbd5200987c64237f941744455`.
- One broad in-memory simulation seeded 1,884 retained jobs and selected
  conversation `6a5e4bf8-972c-83ea-ad2f-3ad57f2a153f`. Its four download rows
  are terminal, while its remaining four rows are catalog-classified favicon
  false positives. Four exact simulations therefore skipped before provider
  work and no canary was admissible.
- Structural inspection shows broad reconciliation builds raw asset-family
  signatures before `classifyCatalogConversationMaterialization`, then removes
  only archive/job terminal families. Catalog item-level
  `materializationEligibility=static_image_false_positive` is not applied to
  that family set, allowing this conversation to reach
  `materializeConversation` and consume `maxItems=1`.
- API PID 90242 is healthy with zero restarts. Scheduler is paused/idle, active
  history jobs are zero, `wsl-chrome-3` remains idle-waiting at pass 51, wider
  ChatGPT completions remain paused at passes 7/2/34, and the exact browser and
  port 45015 are absent.

## Authority And Non-Goals

- The standing goal authorizes this bounded provider-free repair, regression,
  validation, and successor preparation without another micro-approval.
- Authorized writes: the narrow history-materialization selector, focused
  regressions, this plan, journal/fix evidence, and coherent commits/pushes.
- Excluded: install, API restart, durable history job, provider callback,
  browser launch, scheduler/completion/guard action, retry, force, snapshot
  refresh, prompt or `Answer now`, download, and wider materialization.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; delegation
  was not requested, and the selector, regression, and retained-state replay
  form one serialized code/evidence slice.

## Execution Graph

1. Add a red regression with a terminal download family, a static false-positive
   image, and a later actionable conversation under broad `maxItems=1`.
2. Filter catalog families by item-level materialization eligibility at the
   narrow history-reconciliation signature boundary; preserve provider-specific
   classification ownership in the catalog adapter.
3. Prove the first conversation does not reach provider work and the later
   actionable conversation does, while terminal exclusions and metrics remain
   truthful.
4. Run focused history tests, typecheck, scoped lint, build, and a retained-data
   provider-free replay with a byte-identical durable job index.
5. Close and push this repair. Any installed canary belongs to a distinct
   bounded successor after the replay freezes a nonterminal exact asset.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 slices`.
- `max_codegraph_calls: 2` (consumed 2/2); `max_regression_files: 1`;
  `max_source_files: 1`; `max_provider_free_replays: 1`.
- `installs: 0`; `service_restarts: 0`; `durable_history_jobs: 0`;
  `provider_callbacks: 0`; `browser_launches: 0`; `downloads: 0`;
  `scheduler_actions: 0`; `completion_actions: 0`; `guard_actions: 0`;
  `retries: 0`; `force_actions: 0`; `snapshot_refreshes: 0`;
  `prompt_or_answer_now_actions: 0`; `wider_materialization_actions: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `review_finding_fields: criterion, evidence, consequence, reproducer,
  confidence, suggested_disposition`.
- `review_disposition_values: blocking | nonblocking_backlog | rejected |
  needs_evidence`.
- `checkpoint_record_fields: plan_version, state_transition,
  progress_classification, evidence, subagent_status, next_action_or_stop_reason,
  authority_classification, review_disposition_summary`.

## Hard Stops

- The regression cannot reproduce the static-only conversation winning broad
  selection, or the repair requires provider-specific DOM heuristics inside the
  generic history service rather than consuming catalog eligibility metadata.
- Existing terminal-family, exact-ID, selected-conversation, force, or media
  semantics regress.
- Provider-free replay does not reach exactly one disabled seam on a later
  actionable conversation, mutates the durable job index, or cannot freeze an
  exact nonterminal item inside current catalog evidence.
- Any browser/provider/runtime effect appears during focused validation.

## Acceptance Criteria

- [ ] A focused red/green regression proves a terminal-plus-static-only
  conversation is excluded before provider work and broad `maxItems=1`
  advances to a later actionable conversation.
- [ ] The narrow repair reuses catalog materialization-eligibility metadata and
  preserves unclassified/actionable rows, force behavior, selected-ID behavior,
  media behavior, and terminal-family exclusions.
- [ ] Focused history tests, typecheck, scoped lint, build, and diff hygiene pass.
- [ ] Retained-data provider-free replay invokes zero provider implementations,
  reaches one disabled seam for a different actionable conversation, resolves
  one exact nonterminal item, and leaves the durable job index byte-identical.
- [ ] Plan/journal/fix evidence, audit, commit, and push are complete with no
  install, restart, live job, browser, scheduler, completion, or wider effect.

## Opening Checkpoint | Static False-Positive Admission Repair Ready

- `checkpoint_id`: `P0240-C01`.
- `state_transition`: P0239_CLOSED_NOT_READY_NO_NONTERMINAL_EXACT_CANDIDATE ->
  P0240_ACTIVE_STATIC_FALSE_POSITIVE_ADMISSION_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: exact Plan 0239 simulation showed four terminal downloads plus
  four catalog-classified favicon false positives; CodeGraph traced broad
  selection through raw `catalogEntriesConversationAssetFamilySignatures`,
  terminal-only filtering, and `materializeConversation`.
- `owned_changes`: this plan and journal checkpoint before one regression/source
  slice. Runtime and provider effects remain excluded.
- `subagent_status`: not_spawned; no independent safe lane and no delegation
  request.
- `next_action_or_stop_reason`: audit, commit, and push the bounded repair
  packet, then make the focused test fail before changing source.
- `authority_classification`: ordinary bounded successor under the standing
  goal; no live or control authority is consumed.
- `review_disposition_summary`: accepted blocking finding is static-only broad
  admission. Authentication, browser health, and exact terminal admission are
  rejected as causes by current evidence.

## Definition Of Done

Broad `maxItems=1` selection cannot spend provider work on a terminal-plus-static
conversation, retained provider-free replay freezes a later nonterminal exact
asset, and the repair is validated and pushed without runtime effects.
