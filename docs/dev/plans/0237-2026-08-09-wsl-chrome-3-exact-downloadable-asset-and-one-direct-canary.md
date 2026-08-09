# WSL Chrome 3 Exact Downloadable Asset And One Direct Canary | 0237-2026-08-09

State: OPEN
Lane: LIVE_FOLLOW_RECOVERY
Plan version: 1
Goal execution state: PROVIDER_FREE_SELECTION_REQUIRED
Gate state: LIVE_CANARY_WITHHELD_PENDING_EXACT_ASSET

## Stable Objective

Resolve the exact next `chatgpt/wsl-chrome-3` conversation and downloadable
asset from current cached and persisted evidence, simulate the real selection
path with `maxItems=1` and every provider-capable callback disabled, then run at
most one direct retained-profile canary only if the exact asset passes a fresh
closed-world admission gate. Keep the scheduler and every completion control
untouched; do not start or resume wider materialization.

## Current State

- Plan 0236 is closed at pushed commit `d0db4b88`. Its sole pass-51 child
  `hmj_655aa727754b4083adc84e7707693177` settled once as a zero-failure skip:
  four conversations, 102 eligible/four selected candidates, zero
  materialized, seven skipped, and zero failed. That is settlement proof, not
  downloadable-asset proof.
- Current API PID 8247 is active/running with `NRestarts=0`. The scheduler is
  paused/idle with active request count and drain reservations zero. Active
  history-materialization jobs are zero.
- The retained `wsl-chrome-3` completion
  `acctmirror_completion_fb93ed6c-c57b-40cd-b5dc-ba6322f75446` is
  `idle_waiting`, pass 51, `forceRunUntilPassCount=null`, `error=null`, and
  `nextAttemptAt=null`. This packet will not control it.
- Wider ChatGPT completions remain operator-paused at passes `7/2/34` for
  `default` / `wsl-chrome-2` / `wsl-chrome-4`. The global scheduler remains
  paused, so the exact idle-waiting target cannot progress automatically.
- Current provider-free recovery reports one eligible `wsl-chrome-3` target
  with 158 retrievable missing-local assets: 132 artifacts and 26 files.
- No exact `wsl-chrome-3` managed browser process is present. The prior
  source/installed ChatGPT adapter parity hash is
  `076d74e4e7f708f07cfbb58c6a0fe093388010ab096d61a1b9e0e8aad91161ec`;
  relevant bundle parity must be reread before a live job.

## Authority And Ownership

- The operator's `ok go` authorizes this exact bounded successor: provider-free
  resolution and simulation, one fresh exact-asset gate, and at most one direct
  `wsl-chrome-3` history-materialization canary after every gate is satisfied.
- Authorized live effect: one durable direct history-materialization job, one
  job attempt, one exact retained managed browser profile lane, and at most one
  provider materialization/download action for the frozen asset.
- Excluded: installs, API restarts, scheduler control, completion control,
  guard control, provider snapshot refresh, alternate assets after freeze,
  retries, prompts, browser clicks, `Answer now`, direct runtime-state edits,
  second jobs, wider materialization, and unattended continuation.
- Critical-path owner: primary agent. Delegation was not requested and
  `subagent_status=not_spawned`.
- Expected repo writes: this plan and current journal/fixes evidence. Expected
  runtime writes before the live gate: zero. Expected runtime writes after the
  gate: only the one direct job and any exact materialized output it produces.

## Provider-Free Selection Contract

1. Seed an in-memory `HistoryMaterializationJobStore` from every persisted job;
   the durable store must remain byte-identical across simulation.
2. Reuse the pass-51 request identity and scope but set
   `maxItems=1`, `refreshSnapshot=false`, `force=false`,
   `providerWorkNotBefore=null`, and remove the inherited interaction policy.
3. Replace `materializeConversation`, snapshot refresh, evidence recording,
   media, account-library, list, and project-source callbacks with fail-closed
   callbacks. The broad simulation must stop at exactly one
   `PROVIDER_CALLBACK_DISABLED:materializeConversation` boundary and capture
   one exact conversation target.
4. Resolve the first current post-exclusion asset from that conversation using
   cached catalog ordering and the same terminal-family exclusions carried by
   the broad simulation. Do not skip a duplicate, terminal, ambiguous, or
   provider-unavailable asset ad hoc.
5. Run one exact catalog-item in-memory simulation with `catalogItemId`,
   `catalogKind`, matching asset kind, and `maxItems=1`. It must bind the same
   asset in `selectedCatalogAsset`, reach the disabled boundary exactly once,
   and invoke zero provider implementations.

## Fresh One-Canary Admission Gate

The live canary remains withheld until one exact frozen asset satisfies all of
these checks with current evidence:

1. Broad and exact simulations agree on provider, AuraCall runtime profile,
   browser profile, tenant, conversation, catalog kind, catalog item, and asset
   kind; both use only an in-memory store and disabled callbacks.
2. Cache-only catalog detail reports the asset eligible with no accepted local
   path/checksum. Exact archive asset lookup, archive search, retained-job
   evidence, and filesystem checks find no readable, duplicate, successful, or
   terminal result for the same family.
3. The exact source and installed history-materialization bundles match; git is
   clean and synchronized; API health is unchanged; scheduler remains
   paused/idle; active history jobs remain zero; wider ChatGPT passes remain
   paused at `7/2/34`; target pass remains 51 with null force/error; provider
   and routine guards remain null; and no exact browser process is active.
4. This exact frozen gate is audited, committed, and pushed before creation.

If any check fails or no exact downloadable asset can be frozen, close or block
provider-free with no live job.

## Frozen Live Packet After All Gates

1. Create exactly one direct history-materialization job with the frozen
   provider/runtime/browser/tenant/conversation/catalog identity,
   `maxItems=1`, `refreshSnapshot=false`, `force=false`, and provider-work
   timeout 300000 ms.
2. Monitor only that job, API health, scheduler posture, active-job count, the
   exact retained browser lane, target pass 51, and wider passes `7/2/34` until
   the job reaches its first terminal state.
3. Stop immediately on success, skip, failure, auth/challenge, identity drift,
   guard activation, unexpected fanout, target movement, scheduler movement,
   or API degradation. Close only an AuraCall-owned exact browser retained by
   this job, then prove exact process/port cleanup.

## Terminal Classification

1. `C1_useful_yield`: one readable local asset with exact identity, bytes,
   checksum, manifest/archive evidence, one attempt, and zero failed entries.
2. `C2_zero_failure_no_download`: terminal skipped with zero failures and no
   asset output; settlement is recorded without claiming materialization.
3. `C3_provider_or_asset_terminal`: structured provider-unavailable,
   missing-control, missing-download, identity-mismatch, or other terminal
   asset result; preserve the exact code and do not retry.
4. `C4_auth_or_challenge_stop`: login loss, wrong identity, CAPTCHA, challenge,
   verification, `Answer now`, provider guard, or profile/process mismatch.
5. `C5_other_terminal_failure`: timeout, pending operation, unexpected fanout,
   service fault, scheduler/completion movement, or any other ambiguity.

## Local Goal Bounds

- `max_codegraph_calls: 4`; `max_in_memory_simulations: 2`;
  `max_provider_callbacks_during_simulation: 0`;
  `max_durable_jobs_created: 1`; `max_job_attempts: 1`;
  `max_canary_items: 1`; `max_provider_materialization_callbacks: 1`;
  `max_download_actions: 1`; `max_browser_launches: 1`;
  `max_browser_closes: 1`; `max_retries: 0`; `max_installs: 0`;
  `max_api_restarts: 0`; `max_scheduler_controls: 0`;
  `max_completion_controls: 0`; `max_guard_controls: 0`;
  `max_snapshot_refreshes: 0`; `max_prompt_submissions: 0`;
  `max_browser_clicks: 0`; `max_answer_now_clicks: 0`;
  `max_direct_runtime_json_edits: 0`; `max_wider_resumes: 0`;
  `max_subagents: 0`.
- Required checkpoint fields: `plan_version`, `checkpoint_id`,
  `state_transition`, `progress_classification`, `owned_changes`, `evidence`,
  `subagent_status`, `budget_consumption`, `remaining_criteria`,
  `authority_classification`, `review_disposition_summary`, and
  `next_action_or_stop_reason`.

## Acceptance Criteria

- [ ] One broad and one exact provider-free simulation resolve one exact
  conversation and one exact current asset with callback count zero.
- [ ] Durable state is unchanged by simulation and exact closed-world readback
  truthfully admits or rejects the asset.
- [ ] If admitted, exactly one direct `maxItems=1` job reaches one C1-C5
  terminal classification without retry or substitute.
- [ ] Final API, job, exact-browser, target pass, scheduler, wider completion,
  guard, git, docs, and plan-audit readbacks agree.
- [ ] No install/restart, scheduler/completion/guard action, snapshot refresh,
  prompt/click, `Answer now`, direct runtime edit, second job, retry, or wider
  materialization occurs.

## Hard Stops And Non-Goals

- Do not create a durable job until the exact asset is frozen in a pushed plan
  checkpoint and every admission check is current.
- Do not treat aggregate recovery counts, a selected conversation, or Plan
  0236's clean skip as exact-asset evidence.
- Do not substitute another asset after the frozen selection, retry any
  terminal result, or turn a successful canary into authority for scheduler or
  completion progress.
- Stop on authentication loss, wrong identity, CAPTCHA, challenge,
  verification, `Answer now`, guard activation, process/profile mismatch,
  unexpected target movement, active-job pressure, or provider-free ambiguity.

## Checkpoint 1 | Exact Successor Window Opened

- `plan_version`: 1
- `checkpoint_id`: `P0237-C01`
- `state_transition`: P0236_CLOSED_C1_CLEAN_ARTIFACT_PROBE_SETTLEMENT ->
  P0237_OPEN_PROVIDER_FREE_SELECTION_REQUIRED.
- `progress_classification`: outcome_progress.
- `owned_changes`: Plan 0237 and journal wiring only. No provider/browser,
  runtime, install/restart, completion/scheduler/guard, or materialization
  effect.
- `evidence`: clean synchronized `d0db4b88`; API PID 8247 active/running with
  zero restarts; scheduler paused/idle; active history jobs zero;
  `wsl-chrome-3` idle-waiting/pass 51/force null/error null; wider ChatGPT
  passes paused at `7/2/34`; recovery candidate eligible with 158 retrievable
  missing-local assets; exact browser process absent.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `budget_consumption`: CodeGraph 3/4; simulations 0/2; durable jobs 0/1;
  provider callbacks 0; browser launches 0/1; all excluded effect counters 0.
- `remaining_criteria`: exact provider-free conversation/asset resolution,
  closed-world asset admission, pushed exact gate, one terminal canary, and
  final stopped-runtime closeout.
- `authority_classification`: the operator approved this exact bounded
  successor; no new provider, tenant, control surface, or safety weakening is
  introduced.
- `review_disposition_summary`: a direct exact job is more informative than a
  second completion pass only after current selection freezes a genuinely
  downloadable asset. Aggregate eligibility alone is rejected.
- `next_action_or_stop_reason`: audit, commit, and push this open boundary, then
  run exactly two provider-free in-memory simulations. Stop without a canary
  if exact selection or closed-world admission fails.

## Definition Of Done

The exact current `wsl-chrome-3` conversation and asset are resolved with
provider callbacks disabled; one direct canary either proves useful yield or
stops at one truthful terminal classification; the exact browser is cleaned;
and scheduler plus all completion controls remain untouched.
