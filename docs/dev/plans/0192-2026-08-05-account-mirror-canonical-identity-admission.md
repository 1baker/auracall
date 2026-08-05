# Account Mirror Canonical Identity Admission | 0192-2026-08-05

State: CLOSED
Lane: COMPLETE
Plan version: 1
Governing objective: plan and execute the semantic successor to Plan 0191 so
equivalent plain and composite account identities admit the same cached tenant
without weakening fail-closed identity isolation.

## Stable Objective

Replace history reconciliation's raw bound-identity string equality with the
repo's provider-aware account-mirror identity semantics. Prove equivalent
ChatGPT plain/composite identities match, conflicting or missing identities do
not, and the current cached 31-conversation catalog advances beyond the false
identity-mismatch gate without provider work.

## Current State

- Plan 0191 proved all 31 current ChatGPT/default catalog conversations are
  excluded before asset selection because the request uses a plain account
  identity while the catalog entry uses a composite
  `service-account:chatgpt:` identity.
- `src/accountMirror/tenantBinding.ts` already owns provider-aware comparison:
  it normalizes case/whitespace, strips the composite service-account prefix and
  qualifiers, distinguishes Grok email/handle identity classes, and detects
  genuine mismatch.
- History reconciliation bypasses that module and compares the two raw strings.
  Negating `accountMirrorIdentityKeysMismatch` would be unsafe because missing
  or incomparable identities are not classified as mismatches.

## Authority And Ownership

- The active operator goal `plan and execute` authorizes this provider-free
  semantic repair, tests, docs, build, audit, commit, and push.
- It does not by itself authorize install/restart, browser/provider work, a new
  materialization job, completion/scheduler/guard control, force, retry, or
  unattended live-follow. Those remain separate runtime gates.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; repo
  instructions require direct CodeGraph exploration and no delegation was
  requested.
- Durable state lives in this stable repo through this plan, `ROADMAP.md`,
  `RUNBOOK.md`, and `docs/dev/dev-journal.md`; no bundle is required.

## Contract

- Add one positive provider-aware identity match predicate at the existing
  tenant-binding module interface.
- A match requires both comparison identities to be present, comparable for
  the provider, and canonically equal after supported composite-key extraction.
- Equivalent ChatGPT plain/composite forms match case-insensitively.
- Conflicting identities, missing identities, malformed identities, and
  incomparable Grok email/handle forms do not match.
- Broad reconciliation uses the predicate only when an explicit request bound
  identity is present. Its `identityMismatch` funnel reason continues to count
  every rejected catalog row.
- No routeability, manifest, freshness, terminal-family, ordering, budget, or
  provider behavior changes in this packet.

## Local Goal Bounds

- `max_codegraph_calls: 8`; four discovery calls consumed before plan opening.
- `max_red_green_cycles: 2`; one public reconciliation tracer and at most one
  tenant-binding invariant case.
- `max_source_files: 2`; tenant-binding interface plus history reconciliation.
- `max_test_files: 2`; existing tenant-binding and history-materialization
  suites only.
- `max_review_rework_cycles: 1`; `max_builds: 1`;
  `max_install_restarts: 0`; `max_live_jobs: 0`;
  `max_provider_interactions: 0`; `max_completion_actions: 0`;
  `max_scheduler_actions: 0`; `max_guard_actions: 0`; `max_retries: 0`.
- `max_duration_minutes: 60`; checkpoint after plan, red, green/current-cache
  readback, and closeout.
- Required checkpoint fields: `plan_version`, `state_transition`,
  `progress_classification`, `evidence`, `subagent_status`,
  `budget_consumption`, `remaining_criteria`, and
  `next_action_or_stop_reason`.

## State Machine

1. `READY` -> `RED` when the public reconciliation result still classifies an
   equivalent plain/composite identity as mismatch.
2. `RED` -> `PROVIDER_FREE_GREEN` when equivalent identities admit the catalog
   entry and conflicting/missing/incomparable identities remain excluded.
3. `PROVIDER_FREE_GREEN` -> `CURRENT_CACHE_ADVANCED` when all 31 current rows
   move past false identity mismatch and the funnel names their next truthful
   dispositions with zero provider calls/writes.
4. `CURRENT_CACHE_ADVANCED` -> `COMPLETE` after docs, full validation, audit,
   commit/push, remote parity, and unchanged installed-runtime posture.

## Acceptance Criteria

- [x] Public-service red/green proof admits equivalent ChatGPT plain/composite
  identities and preserves candidate selection semantics.
- [x] Provider-aware identity tests reject conflicts, missing values, malformed
  composites, and incomparable Grok identity classes.
- [x] Current cached readback accounts for all 31 conversations with zero false
  identity mismatches and names the next candidate/exclusion breakdown.
- [x] Existing routeability, manifest, freshness, terminal-family, ordering,
  budget, and provider-guard tests remain green.
- [x] README/testing/fix log, roadmap/runbook/journal, full validation, audit,
  commit/push, remote parity, and paused-runtime preservation are current.

## Hard Stops And Non-Goals

- Do not use `!accountMirrorIdentityKeysMismatch` as a positive match.
- Do not admit an entry when either identity is missing or the provider identity
  classes are incomparable.
- Do not rewrite persisted identity keys, weaken terminal-family evidence, add
  aliases/endpoints, install, or run live/provider/control work.
- If canonical matching still leaves zero eligible conversations, report the
  new exclusive funnel result and stop instead of widening another gate.

## Definition Of Done

The source contract admits the current cached tenant through the canonical
identity seam, rejects unsafe identity cases, and truthfully exposes the next
candidate funnel without changing any later selection rule. This source-level
completion does not imply installed or live execution authority.

## Checkpoint 1 | Authorized Ready

- `plan_version`: 1
- `state_transition`: Plan 0191 COMPLETE -> active operator goal -> Plan 0192
  READY.
- `progress_classification`: blocker_reduction
- `evidence`: current cache reports 31/31 `identityMismatch`; CodeGraph shows
  provider-aware canonicalization already belongs to `tenantBinding.ts`, while
  history reconciliation uses raw equality.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 4/8; red/green 0/2; source 0/2; tests 0/2;
  build 0/1; forbidden runtime/live/control actions 0/0.
- `remaining_criteria`: all five acceptance items.
- `next_action_or_stop_reason`: wire and publish this plan, then add one failing
  public reconciliation regression before implementation.

## Checkpoint 2 | Complete

- `plan_version`: 1
- `state_transition`: READY -> RED -> PROVIDER_FREE_GREEN ->
  CURRENT_CACHE_ADVANCED -> COMPLETE.
- `progress_classification`: blocker_reduction
- `evidence`: the public tracer failed with zero materialization calls before
  the repair and passed afterward with three eligible / two selected unchanged;
  tenant-binding invariants reject unsafe identity cases. Current-cache
  readback accounts for 31 rows as zero identity mismatches, one eligible, and
  30 without selected asset evidence; both funnel equations pass with zero
  provider calls and zero runtime writes.
- `subagent_status`: `not_spawned`.
- `budget_consumption`: CodeGraph 5/8; red/green 2/2; source 2/2; tests 2/2;
  review/rework 1/1; build 1/1; install/restart 0/0; live jobs 0/0;
  provider/completion/scheduler/guard/retry actions 0/0.
- `validation`: focused tests 112/112; typecheck, scoped lint, diff hygiene, and
  production build green; full suite 304 files / 2,715 tests passed with 65
  opt-in/live skips; plan audit 192 candidates / 0 errors. Final read-only
  installed state remains API healthy at PID 3892, scheduler and six
  completions paused, queued/running mirrors 0/0, foreground work inactive,
  active materialization jobs 0, and scoped `chatgpt/default` guard clear.
- `remaining_criteria`: none inside the provider-free Plan 0192 contract.
- `next_action_or_stop_reason`: stop complete at the source boundary. Any
  install or bounded live proof requires separately reviewed authority.
