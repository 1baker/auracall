# ChatGPT Live-Follow Collision-Suffix Repair And Bounded Proof | 0182-2026-08-03

State: CLOSED
Lane: P01
Plan version: 2
Governing goal: repair and test the remaining ChatGPT live-follow materialization
path without turn-by-turn authorization or unbounded retries.
Supports: Plan 0180 M5.

## Stable Objective

Repair the provider-added terminal numeric collision-suffix identity mismatch,
prove one fresh uploaded TXT plus generated DOCX materializes with zero failures,
then run exactly one bounded `chatgpt/default` live-follow canary. Keep the
global scheduler and unrelated completions paused throughout, and terminate the
campaign at the first failed live gate rather than cycling.

## Current State

- The campaign reached its configured terminal live stop. Repair commit
  `ea1efb75` passed provider-free validation, was pushed and installed on the
  first attempt, and is byte-identical at adapter SHA-256
  `ab54d533a4827761bac05ad76554cbb8f2ac0332e61d19135c981f67d171b219`.
- Session `m5-chatgpt-collision-suffix-proof` spent the sole prompt budget with
  exactly the canonical 505-byte fixture and completed fresh conversation
  `6a715be8-2834-83ea-82a1-eb1d54e93f85`. Sole job
  `hmj_25347a95316e4517bd91ac6620c3127b` ran once with `maxItems=2`, matched all
  four provider-session dimensions, and terminated `failed`, metrics 1
  materialized / 1 failed.
- The 37,087-byte DOCX materialized at SHA-256
  `8a3a123dcabe81d2e480d6850aabd151b5cd562530e0b0047240430e5ed48608` and
  passes OOXML integrity, exact control/provenance/list content, and one-page
  visual QA. The TXT again failed `captured_asset_identity_mismatch` for catalog
  `...(6).txt` versus native `....txt`, despite installed code containing the
  symmetric helper and the exact public regression passing provider-free.
- W5 did not run. The prompt, direct-job, and live-failure budgets are consumed;
  no retry or replacement is permitted by this plan. API PID `91706` remains
  active/running with zero restarts; scheduler and five completions are paused,
  queued/running work is 0/0, active history jobs are zero, default
  `activeCompletionId` is null, and all ChatGPT guards are clear.
- Plan 0180 M1-M4 and M6 are installed and provider-free green. Renderer-yield
  repair `9381182b` is installed byte-identically under API PID `94356` at
  adapter SHA-256
  `d31e46a7945972c15431389d330de82b0c0d3af4b68222fc8080f78d7613789b`.
- The latest no-retry proof used fresh conversation
  `6a714cfe-6068-83ea-a196-aec283440fa9` and sole job
  `hmj_f9d3b3ef5dc649b6aadd53b286f1d944`. The generated DOCX materialized and
  passed structural, content, and rendered visual QA. The source preview native
  download occurred, but catalog identity
  `auracall-m5-source-20260802T185953Z(5).txt` did not match captured response
  `auracall-m5-source-20260802T185953Z.txt`; no source bytes were persisted.
- Structural inspection isolates asymmetric normalization in
  `browserDownloadedFileNameMatchesTarget`: it removes the terminal numeric
  collision suffix from the captured filename only. Existing cross-asset
  response validation remains strict and must not be weakened.
- `main` matches `origin/main`; the worktree is clean. Scheduler and five
  completions are paused, `activeCompletionId=null`, and queued/running jobs are
  0/0.

## Authority And Ownership

- Critical-path owner: primary agent.
- Integration model: direct to `main` in coherent validated commits.
- Delegation: `not_spawned`; the governing runtime instruction prohibits
  subagents unless the user explicitly requests delegation, and the code/test/
  install/live stages are serialized on one narrow write surface.
- Expected code write surface:
  `src/browser/providers/chatgptAdapter.ts` and
  `tests/browser/chatgptAdapter.test.ts`.
- Expected documentation write surface: this plan, Plan 0180, `ROADMAP.md`,
  `RUNBOOK.md`, `docs/dev/dev-journal.md`, `docs/dev-fixes-log.md`, and the Plan
  0180 handoff when live evidence changes.

## Local Goal Bounds And Retry Budgets

- `max_work_unit_attempts: 2` for each provider-free red/green unit.
- `max_review_rework_cycles: 1` after the first complete validation pass.
- `max_hardening_checkpoints: 2` without outcome progress or blocker reduction.
- `checkpoint_interval: 1 slices` and before install, each live stage, and
  closeout.
- `max_install_attempts: 2`; the second is allowed only for a provider-free
  local build/install/parity defect. Any unexpected provider work during
  install is a terminal stop.
- `max_fresh_prompt_submissions: 1` across the direct two-asset proof.
- `max_direct_materialization_jobs: 1`; require `attemptCount=1` and never
  create a replacement job in this campaign.
- `max_live_follow_completion_starts: 1`, with `maxPasses=1`.
- `max_live_follow_owned_materialization_jobs: 1`; no manual retry or
  replacement if the owned job fails.
- `max_live_stage_failures: 1`; any direct-proof or canary failure terminates
  further live work for this plan.
- `max_total_live_stages: 2`: direct two-asset proof, then bounded live-follow
  canary only after direct proof success.
- No scheduler resume, continuous live-follow resume, provider-guard clearing,
  CAPTCHA handling, account switching, or `Answer now` click is in budget.

Required checkpoint fields: `plan_version`, `state_transition`,
`progress_classification`, `evidence`, `subagent_status`,
`budget_consumption`, `remaining_criteria`, and `next_action_or_stop_reason`.

## Execution State Machine

1. `ready`: paused zero-work preflight and exact current receipt confirmed.
2. `provider_free_active`: one red/green tracer repairs symmetric terminal
   numeric collision-suffix normalization.
3. `install_ready`: targeted and broad validation, review, commit, and push are
   green.
4. `direct_proof_active`: install parity passes; consume one fresh prompt and
   one two-item materialization job.
5. `live_follow_canary_active`: entered only when direct proof materializes both
   exact assets with zero failures; start one default completion with
   `maxPasses=1` while scheduler and unrelated completions remain paused.
6. `complete`: direct proof and bounded canary both satisfy acceptance and
   restored zero-work posture is verified.
7. `failed_terminal`: any live hard stop, exhausted budget, failed asset,
   identity mismatch, second pass, or unexpected related work ends live
   execution without a retry edge.

## Work Units

### W1 | Provider-Free Identity Tracer

- Add one public adapter regression reproducing catalog target `(5)` and native
  response without the suffix.
- Require the same bytes to materialize only when the entire normalized stem
  and extension match.
- Preserve rejection for unrelated filenames, partial stems, extension drift,
  and multiple native downloads.
- Terminal condition: exact test red before repair and green after minimal
  repair, within two red/green attempts.

### W2 | Adjacent And Broad Validation

- Run the focused collision test, complete ChatGPT adapter suite, adjacent
  history-materialization/MCP suites, typecheck, production build, full
  provider-free suite, scoped lint, plan audit, and diff hygiene.
- Perform one independent self-review pass against cross-asset identity and
  retry-budget acceptance. Allow at most one rework cycle.
- Terminal condition: green validation or one consolidated terminal finding.

### W3 | Commit, Install, And Paused Parity

- Commit and push the validated code/test repair before installation.
- Install the committed runtime and verify exact source/installed adapter hash,
  healthy new API PID, scheduler pause, five paused completions,
  `activeCompletionId=null`, clear provider guards, and queued/running jobs 0/0.
- Terminal condition: installed parity or exhausted two-attempt provider-free
  install budget.

### W4 | One Fresh Two-Asset Proof

- Create one fresh root ChatGPT conversation from exactly the canonical
  505-byte fixture and one prompt requesting the DOCX control.
- Create one materialization job with `maxItems=2`, `attemptCount=1`, exact
  conversation identity, and four-dimension provider-session match.
- Validate source bytes against fixture SHA-256 and validate DOCX filename,
  OOXML, exact requested content, checksum, and rendered visual output.
- Terminal condition: both exact assets materialized with zero failures, or
  `failed_terminal` with no retry.

### W5 | One Default Live-Follow Canary

- Enter only after W4 success.
- Start exactly one `chatgpt/default` completion with `maxPasses=1`; do not
  resume the scheduler or another completion.
- Require collector and owned materializer settlement, matching provider-
  session identity, zero failed materializations, zero duplicate same-route
  physical mutations, no guard/rate-limit/CAPTCHA/verification signal, no
  second pass, and restored zero-work posture.
- Terminal condition: Plan 0180 M5 acceptance is proved, or `failed_terminal`
  without retry.

## Acceptance Criteria

- [x] Provider-free regression reproduces the exact suffixed-catalog versus
  unsuffixed-native-response mismatch.
- [x] Symmetric terminal numeric collision-suffix normalization accepts only a
  complete stem/extension match and keeps cross-asset failures closed.
- [x] Targeted, adjacent, and broad provider-free validation pass.
- [x] Repair is committed, pushed, installed, and byte-identical to source with
  all paused/zero-work guards intact.
- [ ] One fresh direct proof materializes the exact TXT and DOCX with zero
  failed entries and validates both artifacts.
- [ ] One `maxPasses=1` default live-follow canary satisfies Plan 0180 M5 with
  no retry, duplicate route mutation, safety signal, or unrelated work.
- [x] Final scheduler/completion/job posture is paused and zero-work; continuous
  re-enablement remains separately gated.

## Non-Goals

- No global scheduler or continuous live-follow re-enablement.
- No retry loop, adaptive live retry, or replacement proof conversation/job.
- No weakening of provider-session identity, exact-asset selection, response
  filename matching, extension matching, or ambiguous-download rejection.
- No cleanup or deletion of historical chats, downloaded artifacts, receipts,
  or failed jobs.
- No provider login, account switch, CAPTCHA handling, or guard override.

## Hard Stops

- Stop before live work if the provider-free regression does not fail for the
  exact live mismatch or the repair broadens unrelated filename acceptance.
- Stop if targeted/broad validation or install parity remains red after its
  configured attempt/rework budget.
- Stop live work immediately on provider guard, rate limit, CAPTCHA,
  verification, identity conflict, ambiguous asset, failed materialization,
  second pass, duplicate same-route mutation, or unexpected scheduler/
  completion activity.
- A failed direct proof prevents the live-follow canary. A failed canary ends
  the campaign. Neither transition has a retry edge.

## Definition Of Done

This plan closes only when current evidence proves every acceptance criterion:
the filename repair is provider-free green and installed, one fresh two-asset
proof materializes both exact assets, one bounded default live-follow pass
satisfies Plan 0180 M5, and the final scheduler/completion/job posture returns
to paused zero-work. Test counts or a successful DOCX alone are insufficient.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: one-turn live proof loop -> bounded multi-stage campaign
  with terminal retry budgets.
- `progress_classification`: blocker_reduction
- `evidence`: latest job `hmj_f9d3b3ef5dc649b6aadd53b286f1d944`
  proves native source capture occurred and isolated asymmetric terminal suffix
  normalization; CodeGraph and direct source inspection bind the mismatch to
  `browserDownloadedFileNameMatchesTarget`.
- `subagent_status`: `not_spawned`; subagents are prohibited without explicit
  user delegation and the work is one serialized code/install/live path.
- `budget_consumption`: provider-free attempts 0/2; review rework 0/1; install
  0/2; prompt submissions 0/1; direct jobs 0/1; live-follow starts 0/1; owned
  canary jobs 0/1; live failures 0/1; live stages 0/2.
- `remaining_criteria`: W1-W5 and all acceptance checks.
- `next_action_or_stop_reason`: run W1 exact red tracer, then implement only the
  symmetric terminal collision-suffix normalization required to turn it green.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: provider-free filename mismatch -> focused regression
  green after symmetric terminal numeric collision-suffix normalization.
- `progress_classification`: blocker_reduction
- `evidence`: the exact public adapter regression failed twice before repair
  with `captured_asset_identity_mismatch` for requested
  `auracall-m5-source-20260802T185953Z(5).txt` versus native response
  `auracall-m5-source-20260802T185953Z.txt`; after the three-line production
  repair it passes 1/1. Extension equality and complete normalized-stem
  equality remain mandatory.
- `subagent_status`: `not_spawned`; the governing runtime prohibition remains
  active and this is still one serialized critical path.
- `budget_consumption`: provider-free W1 attempts 2/2; review rework 0/1;
  install 0/2; prompt submissions 0/1; direct jobs 0/1; live-follow starts
  0/1; owned canary jobs 0/1; live failures 0/1; live stages 0/2.
- `remaining_criteria`: W2-W5 plus cross-asset self-review and final paused
  zero-work verification.
- `next_action_or_stop_reason`: run W2 targeted, adjacent, and broad
  provider-free validation; stop before installation if any consolidated
  validation finding remains after the single permitted rework cycle.

## Checkpoint 3

- `plan_version`: 1
- `state_transition`: focused repair green -> provider-free validation and
  bounded self-review complete.
- `progress_classification`: blocker_reduction
- `evidence`: ChatGPT adapter 129/129; adjacent history-materialization/MCP
  76/76; typecheck and production build pass; full provider-free suite 304
  files/2,709 tests with 21 files/65 tests skipped; plan audit reports 182
  candidates and zero errors; `git diff --check` passes. Scoped Biome lint
  passes with only the established CDP `Runtime` naming warning. Self-review
  confirms extension equality, complete normalized-stem equality, unchanged
  intercepted-response identity, and upstream ambiguous-download rejection.
- `subagent_status`: `not_spawned`; the governing runtime prohibition remains
  active, so the required review is the plan's single independent self-review.
- `budget_consumption`: provider-free W1 attempts 2/2; review rework 0/1;
  install 0/2; prompt submissions 0/1; direct jobs 0/1; live-follow starts
  0/1; owned canary jobs 0/1; live failures 0/1; live stages 0/2.
- `remaining_criteria`: W3-W5 plus final paused zero-work verification.
- `next_action_or_stop_reason`: commit and push the validated repair, then run
  one install and require exact installed parity before any live stage.

## Checkpoint 4

- `plan_version`: 1
- `state_transition`: provider-free validation complete -> pushed repair
  installed with paused zero-work parity.
- `progress_classification`: blocker_reduction
- `evidence`: commit `ea1efb75` is pushed to `origin/main`; install attempt 1
  completed; API service is active/running at PID `91706` with `NRestarts=0`;
  source and installed `chatgptAdapter.js` share SHA-256
  `ab54d533a4827761bac05ad76554cbb8f2ac0332e61d19135c981f67d171b219`.
  Scheduler state/posture are paused, foreground work is inactive, completion
  metrics are queued 0/running 0/paused 5, all five retained completion records
  read `paused`, active history-materialization jobs are 0, default target
  `activeCompletionId` is null, and all four ChatGPT guards are clear.
- `subagent_status`: `not_spawned`; the governing runtime prohibition remains
  active and installed parity is direct runtime evidence.
- `budget_consumption`: provider-free W1 attempts 2/2; review rework 0/1;
  install 1/2; prompt submissions 0/1; direct jobs 0/1; live-follow starts
  0/1; owned canary jobs 0/1; live failures 0/1; live stages 0/2.
- `remaining_criteria`: W4, W5, and final paused zero-work verification.
- `next_action_or_stop_reason`: enter W4 once with the canonical fixture, one
  fresh ChatGPT root conversation, one prompt, and one two-item materialization
  job; any terminal failure prevents W5 and ends live execution without retry.

## Checkpoint 5 | Terminal Stop

- `plan_version`: 2
- `state_transition`: installed parity -> one fresh W4 turn and one direct job
  -> repeated native collision-suffix identity rejection -> campaign closed at
  configured hard stop; W5 not entered.
- `progress_classification`: terminal_blocked
- `evidence`: session `m5-chatgpt-collision-suffix-proof` completed fresh
  conversation `6a715be8-2834-83ea-82a1-eb1d54e93f85`; sole job
  `hmj_25347a95316e4517bd91ac6620c3127b` has `attemptCount=1`, exact
  four-dimension provider-session match, and terminal metrics 1 materialized /
  1 failed. Artifact manifest proves the DOCX materialized; file manifest
  proves `captured_asset_identity_mismatch` for requested
  `auracall-m5-source-20260802T185953Z(6).txt` versus native response
  `auracall-m5-source-20260802T185953Z.txt`.
- `artifact_validation`: DOCX is 37,087 bytes at SHA-256
  `8a3a123dcabe81d2e480d6850aabd151b5cd562530e0b0047240430e5ed48608`;
  ZIP/OOXML, exact control ID, exactly-one-upload statement, verbatim three-item
  list, and rendered one-page visual inspection pass. No TXT bytes were
  published, so W4 acceptance fails.
- `runtime_contradiction`: source and installed adapter hashes match and the
  installed JavaScript contains symmetric suffix normalization, while the live
  native branch still rejected the exact ASCII `(6)`/unsuffixed pair. The next
  safe gate is provider-free branch instrumentation or an installed-module
  reproduction that records extensions and normalized stems at the decision;
  it is not another live retry.
- `subagent_status`: `not_spawned`; governing runtime policy prohibited
  delegation and the work stayed on one serialized path.
- `budget_consumption`: provider-free W1 attempts 2/2; review rework 0/1;
  install 1/2; prompt submissions 1/1; direct jobs 1/1; live-follow starts
  0/1; owned canary jobs 0/1; live failures 1/1; live stages 1/2.
- `remaining_criteria`: W4 exact TXT materialization and W5 default live-follow
  proof remain unmet; Plan 0180 M5 remains open.
- `next_action_or_stop_reason`: terminal stop. Do not retry, replace the chat or
  job, start W5, resume scheduler/completions, or clear guards under this plan.
