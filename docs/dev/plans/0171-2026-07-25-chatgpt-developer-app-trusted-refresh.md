# ChatGPT Developer App Trusted Refresh | Plan 0171

State: OPEN
Lane: P03

## Scope

- repair the existing `apps refresh` operation for an exact ChatGPT developer
  app when the provider settings control is outside the current viewport
- use browser-trusted CDP pointer input and verify that the exact matched
  control received a trusted click
- require the exact plugin route, exact app heading, exactly one app dialog,
  and exactly one enabled Refresh control before mutation
- preserve existing account confirmation, `--yes`, managed-profile ownership,
  and browser-operation dispatcher gates
- install the validated checkout into the user-scoped runtime and consume only
  the separately approved exact refresh attempt

## Current State

- provider-free implementation and targeted validation are complete
- the existing `Corel33t` app remains installed, enabled, OAuth-active,
  private, user-scoped, and in development
- read-only agent-browser inspection of the existing
  `eric.cochran@soylei.com` managed Chrome session proved:
  - one exact `Corel33t` settings dialog
  - one enabled exact Refresh button
  - the button was more than 7,000 pixels below the viewport before scrolling
  - no Refresh click was issued during diagnosis
- the live corrected refresh remains the sole open acceptance gate

## Non-Goals

- do not create, duplicate, uninstall, reconnect, or change permissions for a
  ChatGPT app
- do not automate OAuth, MFA, consent, CAPTCHA, or verification
- do not submit a prompt as part of refresh validation
- do not generalize every existing synthetic interaction strategy in this
  slice
- do not restart the AuraCall API service merely to validate the standalone
  CLI operation

## Implementation

- add `pressButtonWithTrustedPointer(...)` to browser-service:
  - poll for the scoped label/selector match
  - scroll the exact control into the viewport
  - require a successful `elementFromPoint(...)` hit test
  - dispatch CDP `mouseMoved`, `mousePressed`, and `mouseReleased`
  - fail closed unless the exact control observes `event.isTrusted === true`
  - retain optional post-selector verification
- update ChatGPT developer-app refresh to:
  - wait for the exact plugin route
  - require one dialog with the exact app heading
  - require one enabled exact Refresh control
  - use the trusted-pointer helper
  - report bounded DOM diagnostics on readiness failure
  - recheck provider blocking surfaces after activation

## Validation

- `pnpm vitest run tests/browser-service/ui.test.ts
  tests/browser/chatgptDeveloperApps.test.ts
  tests/cli/chatgptDeveloperAppsCommand.test.ts`
- `pnpm run check`
- `pnpm run build`
- `git diff --check`
- source-built read-only `apps list` against `wsl-chrome-3`
- installed-runtime exact refresh against `Corel33t`, only under the existing
  explicit operator approval

## Acceptance Criteria

- provider-free tests prove scroll/hit-test/trusted-event semantics and
  fail-closed behavior
- the exact-app readiness predicate is locked by regression coverage
- the installed runtime is attributable to a committed source state
- exactly one corrected live refresh attempt reports trusted activation
- post-refresh ChatGPT app readback shows the current LitScout tool catalog
- no prompt, duplicate app, uninstall, reconnect, permission change, or
  human-gate automation occurs

## Definition Of Done

- the source-built and installed-runtime gates pass
- the single approved live refresh is consumed
- the existing exact app remains installed and connected
- current app-catalog readback is recorded
- roadmap, runbook, journal, fixes log, and operator testing guidance match the
  shipped behavior

