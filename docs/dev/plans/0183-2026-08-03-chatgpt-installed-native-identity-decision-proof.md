# ChatGPT Installed Native Identity Decision Proof | 0183-2026-08-03

State: OPEN
Lane: P01
Plan version: 1
Governing goal: repair and test the remaining ChatGPT live-follow materialization
path without turn-by-turn authorization or unbounded retries.
Supports: Plan 0180 M5; succeeds closed Plan 0182.

## Stable Objective

Reconcile the contradiction between a green source-level collision-suffix
regression and an installed live rejection of the same ASCII filename pair.
Prove the decision through the installed public adapter boundary, make the
native identity branch durably observable without weakening it, then spend at
most one final fresh direct proof. Enter one `maxPasses=1` default live-follow
canary only if both exact assets materialize with zero failures.

## Current State

- Plan 0182 repair `ea1efb75` is pushed, provider-free green, and installed
  byte-identically at adapter SHA-256
  `ab54d533a4827761bac05ad76554cbb8f2ac0332e61d19135c981f67d171b219`.
  The installed JavaScript visibly contains symmetric terminal numeric
  collision-suffix normalization.
- Fresh conversation `6a715be8-2834-83ea-82a1-eb1d54e93f85` and sole job
  `hmj_25347a95316e4517bd91ac6620c3127b` nevertheless rejected catalog
  `auracall-m5-source-20260802T185953Z(6).txt` versus native response
  `auracall-m5-source-20260802T185953Z.txt`. The exact strings are ASCII in the
  durable manifest. Job attempt 1 ended 1 materialized / 1 failed.
- The generated DOCX is valid; no TXT bytes were published. Plan 0180 M5 and
  continuous re-enablement remain open. Scheduler and five completions are
  paused, queued/running work is 0/0, active history jobs are zero, default
  `activeCompletionId` is null, and all ChatGPT guards are clear.
- CodeGraph reports one native matcher caller and one public adapter test seam.
  No provider interaction is needed to exercise the installed JavaScript
  module with a fake browser-download boundary.

## Authority And Ownership

- Authority is the persistent operator goal plus the terminal Plan 0182
  receipt. This successor may perform provider-free diagnostics, one bounded
  code/validation/install slice, one final fresh direct proof, and—only after
  that proof is fully green—one bounded default live-follow canary.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; governing
  runtime policy prohibits delegation without explicit user authorization and
  the work has one coupled adapter/test/install/live path.
- Owned write surface:
  `src/browser/providers/chatgptAdapter.ts`,
  `tests/browser/chatgptAdapter.test.ts`, this plan, Plan 0180, `ROADMAP.md`,
  `RUNBOOK.md`, journal/fixes log, and the Plan 0180 handoff note.
- No scheduler resume, continuous completion resume, account switch, provider
  guard clearing, CAPTCHA/verification handling, `Answer now` click, deletion,
  cleanup, or unrelated provider work is authorized.

## Local Goal Bounds

- `max_installed_boundary_probe_executions: 2`; one source/built module and one
  installed module, using the same exact public adapter scenario.
- `max_code_repair_attempts: 1`; only an evidence-backed native decision change
  or observability repair is permitted.
- `max_review_rework_cycles: 1`; one consolidated self-review finding set and
  one remediation pass.
- `max_install_or_restart_attempts: 1`; install once after green validation and
  require a new healthy PID loaded after installed-file mtime.
- `max_fresh_prompt_submissions: 1` and
  `max_direct_materialization_jobs: 1`; no retry or replacement.
- `max_live_follow_completion_starts: 1`, `max_passes: 1`, and
  `max_live_follow_owned_materialization_jobs: 1`; reachable only after the
  direct proof passes.
- `max_goal_live_failures_total: 2`; Plan 0182 consumed 1/2, so this plan has
  one remaining live failure. Any failure closes the successor terminally.
- `max_live_stages: 2`; direct proof then conditional canary.
- `max_hardening_checkpoints: 2`; two consecutive hardening/no-progress
  checkpoints without acceptance movement close the plan.
- `checkpoint_interval: 1 slices`; checkpoint after every work unit and before
  install, live work, or closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY_PROVIDER_FREE` -> `INSTALLED_BOUNDARY_PROVED` only when the exact
   `(6)`/unsuffixed scenario has a terminal result through the built and
   installed public adapter exports.
2. `INSTALLED_BOUNDARY_PROVED` -> `DECISION_OBSERVABLE` after one tracer makes
   collision-match versus extension/stem mismatch visible in sanitized scrape
   telemetry while preserving fail-closed asset identity.
3. `DECISION_OBSERVABLE` -> `VALIDATED` after targeted, adjacent, broad,
   type/build/lint/audit, and bounded self-review gates pass.
4. `VALIDATED` -> `INSTALLED` after commit/push, one install/restart, exact hash
   parity, post-mtime PID proof, and paused zero-work readback.
5. `INSTALLED` -> `DIRECT_PROOF_PASSED` only if one fresh prompt and one direct
   job materialize the exact TXT and DOCX with zero failures.
6. `DIRECT_PROOF_PASSED` -> `CANARY_PASSED` only if one default
   `maxPasses=1` completion and its owned job settle cleanly without duplicate
   mutation, guard, rate limit, verification, or second pass.
7. Any provider-free unresolved contradiction, validation/install mismatch, or
   live failure -> `FAILED_TERMINAL`; no retry edge exists.

## Work Units

### W1 | Installed Public-Boundary Tracer

- Invoke `downloadChatgptConversationFilesWithClientForTest` from the built and
  installed JavaScript modules with one fake native browser download named
  `auracall-m5-source-20260802T185953Z.txt` and catalog target
  `auracall-m5-source-20260802T185953Z(6).txt`.
- Require exact bytes to publish or capture the exact divergent result. Do not
  edit production code before this receipt.

### W2 | Sanitized Native Decision Contract

- Add one public tracer requiring scrape telemetry to classify the native
  filename decision as exact match, collision-suffix match, extension mismatch,
  or complete-stem mismatch.
- Preserve strict extension equality, complete remaining-stem equality,
  ambiguous-download rejection, and the separate exact intercepted-response
  validator. Do not expose URLs, page text, raw provider payloads, or unbounded
  filenames beyond the already-authorized manifest identity.

### W3 | Provider-Free Validation And Review

- Run exact red/green, full ChatGPT adapter, adjacent history/MCP, typecheck,
  production build, full provider-free suite, scoped lint, plan/goal audits,
  CodeGraph sync/status, diff hygiene, and one bounded self-review.

### W4 | Commit, Install, And Loaded-Process Proof

- Commit/push before install. Install once, then prove source/installed adapter
  hash parity, API process start later than installed adapter mtime, healthy PID
  with zero restarts, scheduler/five-completion pause, queued/running 0/0,
  active jobs zero, null default completion, and clear ChatGPT guards.

### W5 | One Final Direct Proof

- Use exactly the canonical 505-byte fixture, one fresh unique slug, one prompt,
  one fresh root ChatGPT conversation, and one `maxItems=2` job at
  `attemptCount=1` with exact four-dimension provider-session match.
- Require the source bytes to match fixture SHA-256 and the DOCX to pass exact
  filename family, OOXML, control/provenance/list, checksum, and rendered QA.

### W6 | Conditional Default Live-Follow Canary

- Enter only after W5 fully passes. Start exactly one `chatgpt/default`
  live-follow completion with `maxPasses=1`; do not resume the scheduler or any
  retained completion.
- Require collector and owned materializer settlement, zero failed assets,
  zero duplicate same-route physical mutations, no guard/rate-limit/CAPTCHA/
  verification signal, no second pass, and restored paused zero-work posture.

## Acceptance Criteria

- [x] Built and installed public adapter boundaries agree on the exact native
  collision-suffix scenario.
- [x] Sanitized telemetry proves which native identity decision executed and
  strict cross-asset/extension/complete-stem rejection remains green.
- [x] Targeted, adjacent, broad, type/build/lint/audit, and review gates pass.
- [ ] Repair is committed, pushed, installed, and loaded by a post-mtime healthy
  process with paused zero-work parity.
- [ ] One final direct proof materializes exact TXT and DOCX with zero failures.
- [ ] One conditional `maxPasses=1` default canary satisfies Plan 0180 M5.
- [ ] Final scheduler/completion/job posture is paused and zero-work; continuous
  re-enablement remains separately gated.

## Hard Stops And Non-Goals

- Stop if built and installed public adapter results differ after two probes,
  or if no evidence-backed one-attempt repair is available.
- Stop on any validation/install mismatch or on the first remaining live
  failure. A failed direct proof prevents W6; a failed canary ends the plan.
- No adaptive retry, replacement chat/job, repeated restart, filename
  substring/fuzzy acceptance, provider-session weakening, scheduler resume,
  continuous live-follow reenablement, or historical cleanup.

## Definition Of Done

This plan closes complete only when every acceptance item has current evidence:
installed-boundary parity, observable strict native identity, validated and
loaded repair, exact two-asset direct proof, exact one-pass default canary, and
final paused zero-work posture. Otherwise it closes terminally at the first
configured stop and Plan 0180 M5 remains open.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: Plan 0182 terminal contradiction -> bounded successor
  ready for provider-free installed-boundary proof.
- `progress_classification`: blocker_reduction
- `evidence`: exact ASCII failure manifest, byte-identical installed adapter,
  healthy post-install API process, and CodeGraph one-caller/public-test seam.
- `subagent_status`: `not_spawned`; delegation is prohibited and the critical
  path is serialized.
- `budget_consumption`: installed probes 0/2; code repair 0/1; review rework
  0/1; install/restart 0/1; prompts 0/1; direct jobs 0/1; completion starts 0/1;
  owned canary jobs 0/1; goal live failures 1/2; live stages 0/2.
- `remaining_criteria`: W1-W6 and all seven acceptance items.
- `next_action_or_stop_reason`: run W1 through the built and installed public
  exports before changing production code; stop if results diverge without a
  bounded explanation.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: ready provider-free -> built and installed public adapter
  boundaries agree on exact `(6)`/unsuffixed materialization.
- `progress_classification`: blocker_reduction
- `evidence`: two isolated executions of
  `downloadChatgptConversationFilesWithClientForTest`, one from the current
  built module and one from the installed module, each returned `materialized`,
  published 28 bytes, and matched the supplied bytes exactly for catalog
  `auracall-m5-source-20260802T185953Z(6).txt` versus native
  `auracall-m5-source-20260802T185953Z.txt`.
- `subagent_status`: `not_spawned`; delegation remains prohibited and no
  independent lane exists.
- `budget_consumption`: installed probes 2/2; code repair 0/1; review rework
  0/1; install/restart 0/1; prompts 0/1; direct jobs 0/1; completion starts 0/1;
  owned canary jobs 0/1; goal live failures 1/2; live stages 0/2.
- `remaining_criteria`: W2-W6 and six remaining acceptance items.
- `next_action_or_stop_reason`: add one sanitized native-decision telemetry
  tracer and one production classification contract; preserve all exact
  identity rejection boundaries and stop if the single repair cannot validate.

## Checkpoint 3

- `plan_version`: 1
- `state_transition`: installed boundary proved -> native decision observable
  -> provider-free validated.
- `progress_classification`: acceptance_movement
- `evidence`: one red/green contract added four versioned sanitized decisions:
  `exactMatch`, `collisionSuffixMatch`, `extensionMismatch`, and
  `stemMismatch`. The public-boundary cases pass 4/4, the complete ChatGPT
  adapter suite passes 132/132, adjacent history/MCP suites pass 76/76, and the
  full provider-free suite passes 304 files and 2,712 tests with 21 files and
  65 opt-in tests skipped. Typecheck, production build, scoped Biome lint,
  plan audit, goal-only audit, and diff hygiene pass; scoped lint reports only
  the established CDP Runtime naming warning. Bounded self-review found no
  weakening of extension, complete-stem, ambiguity, or intercepted-response
  identity gates and required no rework.
- `subagent_status`: `not_spawned`; delegation remains prohibited and the
  validation path was serialized.
- `budget_consumption`: installed probes 2/2; code repair 1/1; review rework
  0/1; install/restart 0/1; prompts 0/1; direct jobs 0/1; completion starts 0/1;
  owned canary jobs 0/1; goal live failures 1/2; live stages 0/2.
- `remaining_criteria`: W4-W6 and four remaining acceptance items.
- `next_action_or_stop_reason`: commit and push the validated slice, then spend
  the sole install/restart attempt and require exact installed hash, post-mtime
  healthy PID, and paused zero-work parity before any provider action.
