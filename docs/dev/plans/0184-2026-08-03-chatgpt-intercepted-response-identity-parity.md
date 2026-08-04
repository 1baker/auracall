# ChatGPT Intercepted Response Identity Parity | 0184-2026-08-03

State: OPEN
Lane: P01
Plan version: 1
Governing goal: finish the bounded ChatGPT live-follow repair and testing
campaign without resetting exhausted live attempts.
Supports: Plan 0180 M5; succeeds closed Plan 0183.

## Stable Objective

Make terminal numeric collision-suffix identity semantics consistent across
the intercepted-response and native-download filename gates while preserving
provider-file, extension, complete-stem, ambiguity, and cross-asset rejection.
Validate and install the repair provider-free. Do not run another prompt,
materialization job, completion, canary, scheduler resume, or retained-
completion resume because the goal-wide live-failure ceiling is already 2/2.

## Current State

- Plan 0183 proved native exact/collision/extension/stem classification through
  built and installed public adapter exports, validated 2,712 tests, and
  installed commit `5bf02331` under post-mtime API PID `56881`.
- Its sole live job `hmj_8e07857be43c464bb280024812fdab54`
  terminated 1 materialized / 1 failed at attempt 1. Catalog
  `auracall-m5-source-20260802T185953Z(7).txt` versus captured response
  `auracall-m5-source-20260802T185953Z.txt` failed before the native fallback;
  the manifest contains no `nativeIdentity.*` decision.
- `validateChatgptCapturedFileIdentity` accepts an exact provider-file URL or
  exact `normalizeFileKey` filename equality. It does not use the native
  classifier's symmetric terminal numeric collision-suffix rule.
- Scheduler and five completions are paused, queued/running work is 0/0,
  active history jobs are zero, default `activeCompletionId` is null, and all
  ChatGPT guards are clear. Plan 0180 M5 remains open.

## Authority And Ownership

- Authority is the persistent operator goal and Plan 0183 terminal receipt.
  This successor may perform provider-free code/test/documentation work,
  commit/push, one install/restart, and installed readback only.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; governing
  runtime policy prohibits delegation without explicit user authorization.
- Owned write surface: `src/browser/providers/chatgptAdapter.ts`,
  `tests/browser/chatgptAdapter.test.ts`, this plan, Plan 0180, `ROADMAP.md`,
  `RUNBOOK.md`, journal/fixes log, and the Plan 0180 handoff note.
- No browser/provider interaction, prompt, upload, materialization job,
  completion start/control, scheduler control, guard clear, CAPTCHA handling,
  `Answer now` click, cleanup, or unrelated provider work is authorized.

## Local Goal Bounds

- `max_code_repair_attempts: 1`; one shared filename-decision repair only.
- `max_red_green_cycles: 3`; intercepted collision acceptance, strict captured
  mismatch rejection, and existing native parity, each through the public
  adapter boundary.
- `max_review_rework_cycles: 1`; one consolidated self-review and at most one
  remediation pass.
- `max_install_or_restart_attempts: 1`; install once after all validation is
  green and require post-mtime loaded-process proof.
- `max_fresh_prompt_submissions: 0`, `max_direct_materialization_jobs: 0`,
  `max_live_follow_completion_starts: 0`, and
  `max_live_follow_owned_materialization_jobs: 0`.
- `max_goal_live_failures_total: 2`; already consumed 2/2. This successor has
  no live edge and cannot reset, reinterpret, or extend that ceiling.
- `max_hardening_checkpoints: 2`; two consecutive no-progress checkpoints
  close this plan without install.
- `checkpoint_interval: 1 slices`; checkpoint after plan creation, each
  red/green unit, validation, install, and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY_PROVIDER_FREE` -> `INTERCEPTED_RED_PROVED` only when the exact live
   `(7)`/unsuffixed captured-response scenario fails through the public adapter.
2. `INTERCEPTED_RED_PROVED` -> `SHARED_IDENTITY_GREEN` after both response and
   native filename gates use one strict classifier and emit branch-specific
   sanitized decisions.
3. `SHARED_IDENTITY_GREEN` -> `VALIDATED` after positive, negative, adjacent,
   broad, type/build/lint/audit, CodeGraph, diff, and review gates pass.
4. `VALIDATED` -> `INSTALLED` after commit/push, the sole install/restart, exact
   source/runtime parity, post-mtime healthy PID, and paused zero-work readback.
5. `INSTALLED` -> `CLOSED_PROVIDER_FREE_COMPLETE`; Plan 0180 M5 and final live
   proof remain separately blocked on new explicit live authority.
6. Any missing red, semantic weakening, validation mismatch, or install mismatch
   -> `FAILED_TERMINAL`; no retry edge exists beyond the stated rework cycle.

## Work Units

### W1 | Exact Intercepted-Response Red

- Through `downloadChatgptConversationFilesWithClientForTest`, return successful
  captured bytes with `Content-Disposition` filename
  `auracall-m5-source-20260802T185953Z.txt` for catalog target
  `auracall-m5-source-20260802T185953Z(7).txt` and a non-authoritative URL.
- Require the current code to fail `captured_asset_identity_mismatch`, publish
  no bytes, and expose no native-decision counter.

### W2 | Shared Strict Filename Decision

- Reuse one classifier for intercepted-response and native-download filename
  evidence. Preserve exact provider-file URL authority ahead of filename
  fallback.
- Record sanitized versioned intercepted decisions without filenames, URLs,
  response bodies, or page text. Accept only exact or symmetric terminal
  numeric collision-suffix matches with equal extensions and complete
  remaining stems.

### W3 | Cross-Boundary Negative Contract

- Require unrelated complete stem and wrong extension to fail before bytes are
  published on the intercepted path. Preserve exact provider-file URL success,
  native exact/collision success, and native extension/stem rejection.

### W4 | Provider-Free Validation And Review

- Run exact red/green, complete ChatGPT adapter, adjacent history/MCP, typecheck,
  production build, full provider-free suite, scoped lint, plan/goal audits,
  CodeGraph status, diff hygiene, and one bounded self-review.

### W5 | Commit, Install, And Loaded-Process Proof

- Commit and push before install. Install once, then prove source/installed
  adapter hash parity, API process start later than installed adapter mtime,
  active/running with zero restarts, scheduler/five-completion pause,
  queued/running 0/0, active jobs zero, null default completion, and clear
  ChatGPT guards.

## Acceptance Criteria

- [x] Exact live intercepted-response `(7)`/unsuffixed scenario is red before
  production repair.
- [x] One strict classifier governs both filename gates and preserves exact
  provider-file URL authority.
- [x] Intercepted and native positive/negative public-boundary cases pass with
  sanitized branch telemetry and no cross-asset weakening.
- [x] Targeted, adjacent, broad, type/build/lint/audit, CodeGraph, diff, and
  review gates pass.
- [ ] Repair is committed, pushed, installed, and loaded by a post-mtime healthy
  process with paused zero-work parity.
- [ ] Plan 0180 M5 remains open and no live budget is reset or consumed.

## Hard Stops And Non-Goals

- Stop if the exact captured-response red cannot be reproduced or if sharing
  the classifier weakens provider-file, extension, complete-stem, ambiguity, or
  cross-asset rejection.
- Stop on validation/install mismatch after the single repair/rework budget.
- Do not run a fresh ChatGPT turn, direct job, completion, canary, scheduler or
  retained-completion control, guard clear, or browser inspection.
- Do not add fuzzy, substring, approximate-size, or cross-artifact identity.

## Definition Of Done

This plan closes provider-free complete only when intercepted and native
filename gates share one strict validated classifier, the repair is pushed and
installed with current runtime evidence, and the exhausted live boundary is
preserved. It does not close Plan 0180 M5 or prove two-asset materialization.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: Plan 0183 terminal intercepted-response finding ->
  bounded provider-free successor ready for exact red.
- `progress_classification`: blocker_reduction
- `evidence`: Plan 0183 file manifest, absent `nativeIdentity.*` telemetry,
  exact source at `validateChatgptCapturedFileIdentity`, and CodeGraph one
  coupled adapter path.
- `subagent_status`: `not_spawned`; delegation is prohibited and the path is
  serialized.
- `budget_consumption`: code repair 0/1; red/green cycles 0/3; review rework
  0/1; install/restart 0/1; prompts/jobs/completions 0/0; goal live failures
  2/2.
- `remaining_criteria`: W1-W5 and all six acceptance items.
- `next_action_or_stop_reason`: add the exact public-boundary intercepted red;
  stop if current code does not reproduce the terminal manifest behavior.

## Checkpoint 2

- `plan_version`: 1
- `state_transition`: ready provider-free -> exact intercepted-response red ->
  shared strict identity classifier green.
- `progress_classification`: acceptance_movement
- `evidence`: the public adapter test for catalog
  `auracall-m5-source-20260802T185953Z(7).txt` versus successful captured
  response `auracall-m5-source-20260802T185953Z.txt` failed exactly as
  `captured_asset_identity_mismatch` with no bytes before production repair and
  passed afterward with exact bytes plus sanitized
  `capturedIdentity.collisionSuffixMatch.v1`. Captured stem/extension negatives,
  exact filename, exact provider-file URL, and existing native exact/collision/
  stem/extension cases pass together 9/9.
- `subagent_status`: `not_spawned`; delegation remains prohibited and the
  adapter path is serialized.
- `budget_consumption`: code repair 1/1; red/green cycles 3/3; review rework
  0/1; install/restart 0/1; prompts/jobs/completions 0/0; goal live failures
  2/2.
- `remaining_criteria`: W4-W5 and three remaining acceptance items.
- `next_action_or_stop_reason`: run complete provider-free validation and one
  bounded self-review; stop before install on any unresolved semantic finding.

## Checkpoint 3

- `plan_version`: 1
- `state_transition`: shared identity green -> provider-free validated after
  one bounded vocabulary rework.
- `progress_classification`: acceptance_movement
- `evidence`: the complete ChatGPT adapter suite passes 134/134; adjacent
  history/MCP suites pass 76/76; the full provider-free suite passes 304 files
  and 2,714 tests with 21 files and 65 opt-in tests skipped. Typecheck,
  production build, scoped Biome lint, plan audit, goal-only audit, CodeGraph
  status, and diff hygiene pass. Scoped lint reports only the established CDP
  `Runtime` naming warning. Self-review preserved provider-file URL precedence,
  extension equality, complete remaining-stem equality, ambiguity rejection,
  and cross-asset rejection; its one rework renamed the shared contract from a
  native-specific name to `classifyChatgptFileNameIdentity`, after which the
  adapter, typecheck, build, and lint gates passed again.
- `subagent_status`: `not_spawned`; the required review was performed on the
  single coupled slice.
- `budget_consumption`: code repair 1/1; red/green cycles 3/3; review rework
  1/1; install/restart 0/1; prompts/jobs/completions 0/0; goal live failures
  2/2.
- `remaining_criteria`: commit/push/install parity and two remaining acceptance
  items.
- `next_action_or_stop_reason`: commit and push the validated repair, then
  spend the sole install/restart attempt and require exact post-mtime paused
  zero-work parity; no live action follows.
