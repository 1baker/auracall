# Live-Follow Settlement Cadence And Business Tenants | 0165-2026-07-23

State: CLOSED
Lane: P01

## Goal

Prevent the next account-mirror collector from starting until a full minimum
interval has elapsed after completion-owned materialization settles, and give
same-email ChatGPT Business workspaces an independent tenant/cache identity
from Personal accounts.

## Root Cause

- The completion loop hydrated a terminal materialization job and immediately
  fell through to provider refresh. A long materialization could therefore
  consume the collector's nominal interval and leave no quiet time before the
  next conversation read.
- Account Mirror reduced configured ChatGPT identity to email even though the
  shared configured-service identity already supported plan and workspace
  qualifiers. Business and Personal browser profiles using the same login email
  consequently addressed the same tenant cache.

## Scope

- Persist the terminal materialization provider-work settlement timestamp in
  the completion cursor.
- Gate the next live-follow collector at
  `providerWorkSettledAt + limits.minIntervalMs`.
- Preserve the gate across API restarts.
- Qualify ChatGPT Business/workspace identities while preserving the legacy
  email-only tenant key for Personal accounts.
- Keep provider email verification compatible with qualified configured tenant
  keys.
- Install and verify while scheduler/completions remain paused, then stage the
  four ChatGPT tenants for controlled resume.

## Acceptance Criteria

- [x] A red regression proves terminal materialization previously fell through
  without sleeping.
- [x] Live follow now waits the full collector interval from materialization
  settlement and persists that boundary.
- [x] Same-email Business and Personal targets produce distinct tenant keys.
- [x] Qualified Business keys remain comparable with provider-detected email.
- [x] Focused tests and TypeScript pass.
- [x] Production build, lint, plan audit, and diff checks pass.
- [x] Installed-runtime readback proves the repair and distinct target keys
  while provider work remains paused.
- [x] Guard-clear staged resume shows materialization progressing without a new
  rate-limit observation.

## Stop Conditions

- Stop all live-follow work on any new ChatGPT rate-limit observation.
- Do not clear a provider guard merely to satisfy this plan.
- Do not migrate or copy Personal cache data into the new Business tenant root.
- Do not use broad `/status` polling; use bounded target/control/job readbacks.

## Definition Of Done

The plan closes when offline validation and installed readback prove both
repairs, then a guarded staged resume shows continuing materialization with no
new warning. If a warning appears, pause immediately and leave the plan active
with the exact collector/materialization receipt.

## Live Evidence

- The installed runtime uses
  `service-account:chatgpt:ecochran76@gmail.com|plan=team|structure=workspace`
  for the default Business workspace and preserves
  `service-account:chatgpt:ecochran76@gmail.com` for the Personal target.
- Consulting materialized three assets without a warning. Its terminal job
  settled at `2026-07-24T00:24:49.275Z`, and the next collector moved to the
  exact five-minute boundary at `2026-07-24T00:29:49.275Z`.
- The fresh Business tenant completed a first inventory pass with 30
  conversations, 22 artifacts, and 24 files. Its provider-inaccessible
  selections ended `skipped`, the provider guard remained clear, and the next
  collector moved from the materialization settlement at
  `2026-07-24T00:46:44.484Z` to `2026-07-24T00:51:44.484Z`.
- Personal is the only active completion during the final watch. Its first
  materialization settled without a warning at
  `2026-07-24T00:58:28.247Z`, and its next collector moved to the exact
  five-minute boundary at `2026-07-24T01:03:28.247Z`. Business, Consulting,
  and SoyLei remain operator-paused and the routine scheduler remains paused,
  preventing cross-tenant browser overlap.
