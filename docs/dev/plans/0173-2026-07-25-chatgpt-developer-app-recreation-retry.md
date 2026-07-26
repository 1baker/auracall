# ChatGPT Developer App Recreation Retry | 0173-2026-07-25

State: CLOSED
Lane: P03
Plan version: 1

## Goal

Correct the current ChatGPT New Plugin connection-mode drift and consume one
recreation-only retry for the already-deleted `Corel33t` app.

## Current State

- Plan 0172 safely deleted old identity
  `plugin_asdk_app_6a5d3be168248191b76ed22889b57366` /
  `asdk_app_6a5d3be168248191b76ed22889b57366`.
- Schema-complete installed inventory proves no `Corel33t` exists.
- The first guarded create stopped before submission because ChatGPT defaults
  to `Tunnel`; synthetic radio activation did not select `Server URL`, so
  `input[name="custom-connector-url"]` was not mounted.
- No app, OAuth flow, connector prompt, or unrelated mutation resulted.
- The exact approved recreation remains:
  - account: `eric.cochran@soylei.com`
  - profile: `wsl-chrome-3`
  - name: `Corel33t`
  - server URL: `https://litscout.ecochran.dyndns.org/mcp`
  - description: `LitScout`
  - auth: `oauth`
  - connection: `server-url`

## Scope

- Use trusted CDP pointer activation for Create app, the exact Server URL
  radio, the risk checkbox, and Create submission.
- Require `aria-checked=true` on the Server URL radio before locating the
  exact named URL input.
- Bind the URL field to
  `[role="dialog"] input[name="custom-connector-url"]`.
- Validate provider-free, independently review, commit, install, and consume
  one recreation-only attempt.
- Read back the new app identity and current tool catalog after submission or
  stop at the exact OAuth/human gate.

## Non-Goals

- No second delete, uninstall, refresh, duplicate create, connector prompt, or
  unrelated app mutation.
- No OAuth credentials, MFA, CAPTCHA, or human-verification automation.
- No provider-guard bypass or account-mirror work.

## Acceptance Criteria

- [x] Provider-free tests lock the exact current URL selector and adjacent
      trusted-pointer behavior.
- [x] Focused/adjacent tests, typecheck, build, plan audit, and diff check pass.
- [x] Fresh independent review returns `ACCEPT`.
- [x] Committed source installs byte-identically and passes startup.
- [ ] One create submission produces exactly one new private development app
      named `Corel33t`, or stops truthfully at a human/provider gate.
- [ ] Fresh inventory records the new plugin/app IDs and proves the old IDs
      remain absent.
- [x] No connector prompt or unrelated app mutation occurs.

## Hard Bounds And Stop Conditions

- Maximum implementation attempts: 1.
- Maximum review/rework cycles: 1.
- Maximum live create attempts: 1.
- Stop before submission if account, Developer mode, inventory completeness,
  frozen inputs, or zero-`Corel33t` baseline differs.
- Stop on OAuth credentials, MFA, CAPTCHA, human verification, provider guard,
  or rate limit.
- Do not delete or create a second same-name app.

## Definition Of Done

Plan 0173 closes when the corrected committed runtime either recreates exactly
one `Corel33t` and records its new identity/catalog, or stops at a named
human/provider gate with no duplicate or unrelated mutation.

Terminal outcome: commit `52217fcc` installed byte-identically and passed
startup. Its one live create attempt stopped before submission because trusted
CDP mouse input did not change the current Radix connection radio. A
non-submitting diagnostic then proved focus plus Space selects `Server URL`.
No app, OAuth flow, connector prompt, delete, or unrelated mutation occurred.
Successor Plan 0174 owns the keyboard-semantic repair and one final exact
create submission.
