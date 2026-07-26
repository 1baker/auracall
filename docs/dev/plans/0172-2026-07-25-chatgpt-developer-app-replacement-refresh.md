# ChatGPT Developer App Replacement Refresh | 0172-2026-07-25

State: CLOSED
Lane: P03
Plan version: 1

## Goal

Correct AuraCall's ChatGPT developer-app `refresh` contract so it replaces one
exact private development app by deleting it, proving the old identity is
absent, and recreating it from operator-supplied connection settings when the
provider exposes no usable in-place Refresh control.

## Current State

- Installed readback from managed profile `wsl-chrome-3` identifies account
  `eric.cochran@soylei.com`, Developer mode enabled, and exactly one private
  development app named `Corel33t`.
- The exact current identity is
  `plugin_asdk_app_6a5d3be168248191b76ed22889b57366` /
  `asdk_app_6a5d3be168248191b76ed22889b57366`.
- Read-only management-surface inspection proved ChatGPT exposes both
  `Uninstall` and `Delete`. Selecting `Delete` to inspect the expected
  confirmation performed the deletion immediately without a second
  confirmation surface.
- Fresh installed-runtime inventory proves the old `Corel33t` plugin/app
  identity and normalized name are absent; no other app was selected.
- That exact deletion consumes this plan's sole live delete allowance. Live
  execution may only recreate and verify the frozen target; it must not run a
  second delete/recreate cycle.
- Accepted implementation commit `2d186920` was installed byte-identically and
  passed its startup smoke. The sole create attempt stopped before submission:
  ChatGPT now defaults the connection radio to `Tunnel`, AuraCall's synthetic
  selection did not change it to `Server URL`, and the URL input therefore
  never mounted.
- No replacement app or OAuth flow was created. This plan's live create
  allowance is exhausted; bounded successor Plan 0173 owns the corrected
  recreation-only retry and does not authorize another delete.
- The installed app inventory does not disclose its MCP endpoint, so replacement
  must require an explicit validated server URL before uninstall.
- The approved replacement target is:
  - name: `Corel33t`
  - server URL: `https://litscout.ecochran.dyndns.org/mcp`
  - auth: `oauth`
  - connection: `server-url`
  - description fallback: `LitScout`

## Scope

- Change `apps refresh <exact-app>` from an in-place button click to a guarded
  replacement lifecycle.
- Require and validate the complete recreation input before any browser
  mutation.
- Preserve exact account matching, exact app resolution, `--yes`, Developer
  mode, managed-profile ownership, browser-operation dispatcher, and provider
  blocking-surface gates.
- Delete exactly the resolved app from its Developer mode management surface,
  refresh inventory, and refuse recreation
  unless the old plugin/app identity and name are absent.
- Use browser-trusted pointer activation for both the exact app action-menu
  trigger and the exact `Delete` item; synthetic DOM pointer dispatch did not
  open this current provider menu reliably.
- Recreate the same app name from the explicit server URL, auth, connection,
  and optional description.
- Treat a new ChatGPT app/plugin ID as expected replacement identity; record
  both old and new IDs.
- Install only committed, provider-free validated source into the user runtime.
- Consume at most one live deletion and one recreation of the frozen
  `Corel33t` target. The deletion is already consumed.

## Non-Goals

- Do not delete, uninstall, reconnect, or modify any other ChatGPT app.
- Do not submit a ChatGPT prompt or resume LitScout connector evidence turns.
- Do not automate OAuth credentials, MFA, CAPTCHA, or provider verification.
- Do not bypass a provider guard or widen AuraCall's account-mirror work.
- Do not preserve the old app ID; provider recreation owns the replacement ID.
- Do not retain the obsolete exact-Refresh-button algorithm as an automatic
  fallback.

## Implementation

- Extend refresh CLI input with required `--server-url` and explicit
  recreation options matching `apps create`.
- Normalize and validate the replacement input before calling delete.
- Require an explicitly complete installed-app inventory before mutation; a
  missing or timed-out provider response is not evidence of an empty list.
- Sequence the operation as:
  1. read account/app state and resolve one exact target;
  2. validate Developer mode and complete recreation input;
  3. select Delete for the exact target;
  4. read fresh inventory and prove the old target is absent by plugin ID, app
     ID, and normalized name;
  5. recreate the app once;
  6. return an aggregate replacement outcome, preserving any OAuth human gate.
- Fail before delete if another installed app already shares the replacement
  name.
- If fresh post-delete inventory is incomplete or recreation throws, return
  `recreate-pending` with the exact validated `apps create` recovery input.
- After create submission, attempt fresh inventory readback and return the new
  identity when exactly one same-name app with a non-old identity is visible.
- Remove the provider adapter's in-place Refresh-control dependency and its
  obsolete test-only readiness export.
- Update operator documentation and durable fix guidance to describe
  replacement semantics and recovery if recreation stops at a human gate.

## Validation

- Red and green provider-free contract tests for:
  - complete input validation before delete;
  - exact delete followed by fresh inventory and one create;
  - trusted-pointer menu trigger and Delete activation;
  - refusal to create while any old identity/name remains;
  - no create after delete failure;
  - incomplete inventory never counts as absence;
  - same-name sibling refusal before delete;
  - structured `recreate-pending` recovery after a verified delete;
  - OAuth `awaiting-human` propagation;
  - account mismatch and confirmation fail closed before mutation.
- `pnpm vitest run tests/browser/chatgptDeveloperApps.test.ts
  tests/cli/chatgptDeveloperAppsCommand.test.ts`
- `pnpm run check`
- `pnpm run build`
- focused Biome check for touched TypeScript/tests
- `pnpm run plans:audit`
- `git diff --check`
- installed-runtime startup smoke and read-only app inventory
- the already-consumed exact deletion plus one approved recreation, then fresh
  readback of:
  - expected ChatGPT account and Developer mode;
  - exactly one `Corel33t`;
  - old identity absent and new identity recorded;
  - current LitScout action catalog after OAuth/connection completion.

## Acceptance Criteria

- [x] `apps refresh` cannot delete until all replacement inputs validate.
- [x] Only one exact target can be selected, and ambiguous names fail closed.
- [x] Delete uses trusted browser pointer activation on the exact management
      dialog/menu, not synthetic DOM events.
- [x] Recreation cannot begin until fresh inventory proves the old identity and
      normalized name are absent.
- [x] A missing/timed-out installed-app payload is reported incomplete and
      cannot authorize delete, absence, or recreation.
- [x] A replacement OAuth/consent gate returns `awaiting-human` without
      pretending completion.
- [x] A post-delete read/create failure returns the validated recovery input,
      and post-create readback records a new identity when available.
- [x] Provider-free tests, typecheck, build, focused lint, plan audit, and diff
      check pass.
- [x] Independent review reports `ACCEPT`, or one bounded rework cycle resolves
      its material findings.
- [x] Installed runtime is attributable to committed source and passes startup.
- [ ] The one approved live replacement leaves exactly one `Corel33t` on the
      expected account, with the old identity absent and the current LitScout
      app surface available.
- [x] No ChatGPT prompt is submitted and no unrelated app is mutated.

## Hard Bounds And Stop Conditions

- Maximum implementation attempts: 2.
- Maximum independent review/rework cycles: 1.
- Maximum live delete attempts: 1, already consumed.
- Maximum live create attempts: 1.
- Stop before deletion if exact account, app identity, name, or recreation
  inputs differ from this plan.
- Stop after delete if fresh inventory still exposes the old identity/name;
  do not create a duplicate.
- Stop and hand control to the operator on OAuth credentials, MFA, CAPTCHA,
  human verification, or unexpected provider consent.
- Stop immediately on a provider rate-limit or persisted browser guard.
- No connector prompt is authorized by this plan.

## Definition Of Done

Plan 0172 closes only when the replacement contract is provider-free green,
independently accepted, committed, installed, and the single approved live
`Corel33t` replacement is either verified end to end or stopped truthfully at
an explicit human/provider gate with no duplicate or unrelated mutation.

Terminal outcome: the safe replacement contract shipped, the exact deletion
was proved, and the first recreation stopped pre-submit on provider form drift.
Plan 0173 is the only active live authority for the corrected recreation; Plan
0172 authorizes no further browser mutation.
