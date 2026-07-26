# ChatGPT Developer App Keyboard Recreation | 0174-2026-07-25

State: CLOSED
Lane: P03
Plan version: 1

## Goal

Use the current ChatGPT Radix-radio keyboard contract to recreate exactly one
private development app named `Corel33t` after the old identity was safely
deleted.

## Current State

- The old plugin/app IDs remain absent:
  `plugin_asdk_app_6a5d3be168248191b76ed22889b57366` /
  `asdk_app_6a5d3be168248191b76ed22889b57366`.
- Plans 0172 and 0173 each stopped their create attempt before submission; no
  replacement app or OAuth flow exists.
- Live non-submitting evidence proves the exact
  `button[role="radio"][aria-label="Server URL"]` changes from
  `aria-checked=false` to `true` when focused and activated with Space.
- The frozen recreation input remains:
  - account: `eric.cochran@soylei.com`
  - AuraCall runtime profile: `wsl-chrome-3`
  - name: `Corel33t`
  - server URL: `https://litscout.ecochran.dyndns.org/mcp`
  - description: `LitScout`
  - authentication: `oauth`
  - connection: `server-url`

## Scope

- Replace pointer activation of the exact connection radio with focus plus
  trusted CDP Space keydown/keyup.
- Preserve exact account, Developer-mode, complete-inventory, frozen-input,
  zero-same-name, blocking-surface, and `--yes` gates.
- Add provider-free regression coverage for the CDP keyboard sequence.
- Validate, independently review, commit, install byte-identically, and make
  one exact create submission.
- Read back the new identity and current app surface, or stop at the exact
  OAuth/human gate.

## Non-Goals

- No delete, uninstall, refresh, duplicate create, connector prompt, or
  unrelated app mutation.
- No OAuth credentials, MFA, CAPTCHA, consent, or human-verification
  automation.
- No provider-guard bypass or account-mirror work.

## Acceptance Criteria

- [x] Provider-free tests lock focus plus trusted CDP Space activation.
- [x] Focused/adjacent tests, typecheck, build, plan audit, and diff pass.
- [x] Fresh independent review returns `ACCEPT`.
- [x] Committed source installs byte-identically and passes startup.
- [x] One create submission produces exactly one new private development app
      named `Corel33t`, or stops truthfully at a human/provider gate.
- [x] Fresh inventory records the new plugin/app IDs and proves the old IDs
      remain absent.
- [x] No connector prompt or unrelated app mutation occurs.

## Hard Bounds And Stop Conditions

- Maximum implementation attempts: 1.
- Maximum review/rework cycles: 1.
- Maximum live create submissions: 1.
- Stop before submission if account, Developer mode, inventory completeness,
  frozen inputs, or zero-`Corel33t` baseline differs.
- Stop on OAuth credentials, MFA, CAPTCHA, consent, human verification,
  provider guard, or rate limit.
- Do not delete or create a second same-name app.

## Definition Of Done

Plan 0174 closes when the committed keyboard-semantic runtime either recreates
exactly one `Corel33t` and records its new identity/app surface, or stops at a
named human/provider gate with no duplicate or unrelated mutation.

Terminal outcome: accepted commit `b116b902` installed byte-identically and
passed startup. One create submission produced exactly one private development
app:

- plugin ID: `plugin_asdk_app_6a658c7c4c8c81918f6ddd378d5ebf16`
- app ID: `asdk_app_6a658c7c4c8c81918f6ddd378d5ebf16`
- name/description: `Corel33t` / `LitScout`
- state: enabled, private, development-scoped

Fresh complete inventory proves both old IDs remain absent. ChatGPT stopped on
the visible `Add Corel33t to ChatGPT` / `Sign in with Corel33t` OAuth gate.
No OAuth consent, connector prompt, delete, duplicate, or unrelated app
mutation was automated.
