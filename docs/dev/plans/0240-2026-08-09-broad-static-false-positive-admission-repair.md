# Broad Truncated Catalog Family Admission Repair | 0240-2026-08-09

State: CLOSED
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 2
Outcome: COMPLETE_PROVIDER_FREE_REPAIR
Goal execution state: COMPLETE_PROVIDER_FREE
Gate state: READY_FOR_SEPARATE_INSTALLED_EXACT_CANARY

## Stable Objective

Prevent broad history reconciliation from treating an empty asset-family set
caused by a media-inclusive truncated catalog read as nonterminal evidence, then
prove `maxItems=1` advances provider-free to the next actually actionable
conversation before any new install or canary.

## Current State

- Plan 0239 closed at pushed commit `82d1eea4`. The exact-terminal repair is
  installed with source/runtime bundle SHA-256 parity at
  `625739bca9473885de39eadf3b104664ca009ddbd5200987c64237f941744455`.
- One broad in-memory simulation seeded 1,884 retained jobs and selected
  conversation `6a5e4bf8-972c-83ea-ad2f-3ad57f2a153f`. Its four download rows
  are terminal, while its remaining four rows are catalog-classified favicon
  false positives. Four exact simulations therefore skipped before provider
  work and no canary was admissible.
- Exact seam instrumentation disproved the opening static-filter hypothesis.
  The existing ChatGPT catalog-family helper correctly removes favicon rows.
  The actual selected conversation reaches broad admission with
  `assetFamilySignatures=[]`: because selected kinds include media,
  `maxItems=1` chooses catalog `limit=50`, which retains the conversation
  summary but truncates away its global artifact manifests. Summary counts keep
  the conversation eligible, while the empty family set bypasses terminal-family
  exclusion and consumes provider work.
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

1. Add a red limit-sensitive regression with a terminal download family, a
   static false-positive image, and a later actionable conversation under broad
   artifact/file/media `maxItems=1`.
2. Ensure any reconciliation requesting artifacts or files uses the existing
   500-row family-evidence floor even when media is also selected; preserve the
   50-row floor for media-only reconciliation.
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
  `max_source_files: 1`; `max_provider_free_replays: 1`;
  `max_provider_free_exact_simulations: 8`.
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

- The regression cannot reproduce a summary surviving while its asset-family
  manifests are truncated, or the repair widens provider/browser work rather
  than only the provider-free catalog evidence window.
- Existing terminal-family, exact-ID, selected-conversation, force, or media
  semantics regress.
- Provider-free replay does not reach exactly one disabled seam on a later
  actionable conversation, mutates the durable job index, or cannot freeze an
  exact nonterminal item inside current catalog evidence.
- Any browser/provider/runtime effect appears during focused validation.

## Acceptance Criteria

- [x] A focused red/green regression proves artifact/file/media broad
  `maxItems=1` cannot admit an empty family set caused by the 50-row media
  catalog window and advances to a later actionable conversation.
- [x] The narrow repair preserves the existing 50-row media-only floor, uses
  the existing 500-row artifact/file family-evidence floor when those kinds are
  present, and preserves eligibility, force, selected-ID, media, and terminal
  semantics.
- [x] Focused history tests, typecheck, scoped lint, build, and diff hygiene pass.
- [x] Retained-data provider-free replay invokes zero provider implementations,
  reaches one disabled seam for a different actionable conversation, resolves
  one exact nonterminal item, and leaves the durable job index byte-identical.
- [x] Plan/journal/fix evidence, audit, commit, and push are complete with no
  install, restart, live job, browser, scheduler, completion, or wider effect.

## Opening Checkpoint | Truncated Family Admission Repair Ready

- `checkpoint_id`: `P0240-C01-v2`.
- `state_transition`: P0239_CLOSED_NOT_READY_NO_NONTERMINAL_EXACT_CANDIDATE ->
  P0240_ACTIVE_TRUNCATED_CATALOG_FAMILY_ADMISSION_REPAIR.
- `progress_classification`: blocker_reduction.
- `evidence`: Plan 0239 showed four terminal downloads plus four classified
  favicon false positives. Exact provider-free instrumentation then captured
  `assetFamilySignatures=[]` for the selected conversation. Source inspection
  binds that emptiness to media-inclusive `catalogLimit=50`, while a direct
  500-row catalog read contains all eight rows and the existing helper filters
  the four static items correctly.
- `owned_changes`: this plan and journal checkpoint before one regression/source
  slice. Runtime and provider effects remain excluded.
- `subagent_status`: not_spawned; no independent safe lane and no delegation
  request.
- `next_action_or_stop_reason`: audit, commit, and push the bounded repair
  packet, then make the focused test fail before changing source.
- `authority_classification`: ordinary bounded successor under the standing
  goal; no live or control authority is consumed.
- `review_disposition_summary`: accepted blocking finding is summary/family
  truncation disagreement under the media-inclusive 50-row catalog window. The
  opening static-filter hypothesis, authentication, browser health, and exact
  terminal admission are rejected as causes by current evidence.

## Definition Of Done

Broad artifact/file/media `maxItems=1` selection cannot spend provider work on
a conversation whose family evidence disappeared only because of the media
catalog limit, retained provider-free replay freezes a later nonterminal exact
asset, and the repair is validated and pushed without runtime effects.

## Final Checkpoint | Full Family Evidence Advances To Exact File

- `checkpoint_id`: `P0240-C02`.
- `state_transition`: P0240_ACTIVE_TRUNCATED_CATALOG_FAMILY_ADMISSION_REPAIR ->
  P0240_CLOSED_PROVIDER_FREE_EXACT_FILE_READY.
- `progress_classification`: blocker_reduction.
- `evidence`: the focused regression failed on catalog `limit=50`, then passed
  after artifact/file/media reconciliation preserved `limit=500`; the companion
  media-only test remained at `limit=50`. All 76 history-materialization tests,
  typecheck, scoped Biome, production build, and diff hygiene passed. One
  retained-data replay seeded 1,884 jobs and moved broad selection to
  conversation `6a526cdb-580c-83ea-ab97-ab95a85f6975`; one exact replay froze
  file catalog item
  `6a526cdb-580c-83ea-ab97-ab95a85f6975:c836da7e-c513-419a-8c13-a8ab62a0873d:0:Fence Guidelines.pdf`
  with provider file ID `file_00000000c980722f8f18eeb8a63d72a7`.
  Broad and exact each reached one disabled `materializeConversation` seam,
  unexpected/provider implementations stayed zero, and durable job-index
  SHA-256 stayed `641836ac...b41087`.
- `owned_changes`: one catalog-limit condition, two focused regressions, and
  governing docs. Install/restart, durable jobs, browser/provider work,
  downloads, scheduler/completion/guard controls, retries, force, snapshot
  refresh, prompts, and wider materialization remained zero.
- `subagent_status`: not_spawned; no delegation request and one serialized
  selector/replay critical path.
- `next_action_or_stop_reason`: close, audit, commit, and push. A separate
  installed successor may install this repair once and run at most one exact
  `wsl-chrome-3` canary for the frozen file after rechecking the full gate.
- `authority_classification`: provider-free implementation and validation under
  the standing goal; no live or control boundary was consumed.
- `review_disposition_summary`: the truncated-family blocker is fixed and the
  original static-filter hypothesis remains rejected. The frozen exact file is
  currently nonterminal under cache/archive/job admission and ready only for a
  separately pushed installed gate.
