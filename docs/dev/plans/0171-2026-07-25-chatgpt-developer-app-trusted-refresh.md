# ChatGPT Developer App Trusted Refresh | Plan 0171

State: CLOSED
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
- tolerate ChatGPT's late-mounted model picker, search dynamically filtered
  installed apps through the current composer popover, and refuse submission
  unless the requested prompt is present beside the selected app pill
- install the validated checkout into the user-scoped runtime and consume only
  the separately approved exact refresh attempt

## Current State

- provider-free implementation and targeted validation are complete across
  refresh, model-picker readiness, installed-app search, and app-pill prompt
  preservation
- the existing `Corel33t` app remains installed, enabled, private,
  user-scoped, and in development; the bounded LitScout proof cleanup has
  disconnected its nonce OAuth binding
- read-only agent-browser inspection of the existing
  `eric.cochran@soylei.com` managed Chrome session proved:
  - one exact `Corel33t` settings dialog
  - one enabled exact Refresh button
  - the button was more than 7,000 pixels below the viewport before scrolling
  - no Refresh click was issued during diagnosis
- installed commit `37edc8c0` consumed the single corrected refresh with a
  trusted click; fresh ChatGPT readback showed the current exact 16 LitScout
  actions
- nonce OAuth reconnect succeeded without app recreation or permission change
- first submitted app test exposed a second live defect: the selected app pill
  made the composer look non-empty after prompt insertion failed, so AuraCall
  sent one blank office-action turn
- commit `6a98516f` now excludes app-pill text from prompt verification, appends
  at the editable tail without replacing the pill, and fails closed before
  Send unless the full prompt is observed
- the validated `fix/chatgpt-app-refresh` commit stack is integrated into main;
  combined validation passes 178 focused tests, typecheck, production build,
  lint at the unchanged 203-warning baseline, plan audit, and diff checks
- the earlier LitScout P3D cleanup left the literature test unsubmitted behind
  the persisted provider guard; that state was historical, not authority for an
  AuraCall-owned retry
- LitScout subsequently accepted H4 and consumed bounded successor R1:
  office-action and literature-review turns were submitted exactly once each
  through the existing `Corel33t` app, with no retry
- the literature turn selected the expected app and reported seven LitScout
  actions, including `project_continue`; LitScout recorded that scenario
  `PASS`, proving the repaired composer dispatched a real prompt rather than an
  app-pill-only blank turn
- the redacted owning-workflow receipt is
  `litscout:docs/dev/validation/0267-m6-p3d-r1-connector-proof.json`, committed
  at `cbed19fb`, with SHA-256
  `bd735aad2beab09071aa5769442fb23a9b55c848e454ea128119e5414582c3be`
- R1 cleanup disconnected the exact app without delete or uninstall, revoked
  only the nonce connector state, and left no further connector turn
  authorized; Plan 0171 is closed without another provider action

## Non-Goals

- do not create, duplicate, uninstall, reconnect, or change permissions for a
  ChatGPT app
- do not automate OAuth, MFA, consent, CAPTCHA, or verification
- do not submit a prompt as part of refresh validation
- do not retry the consumed blank office-action scenario
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
- poll for the late-mounted ChatGPT model picker instead of failing on the
  first empty render
- search the open composer popover for an exact installed app and clear only
  the temporary search text
- verify the requested prompt independently of inline app-pill text before
  dispatch

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
- source-grounded verification of LitScout's redacted H4/R1 connector receipt,
  including exact app/account/runtime identity, two ordered submissions, zero
  retries, literature `PASS`, protected-effect stops, and exact cleanup

## Acceptance Criteria

- provider-free tests prove scroll/hit-test/trusted-event semantics and
  fail-closed behavior
- the exact-app readiness predicate is locked by regression coverage
- the installed runtime is attributable to a committed source state
- exactly one corrected live refresh attempt reports trusted activation
- post-refresh ChatGPT app readback shows the current LitScout tool catalog
- an app-selected prompt cannot dispatch as a chip-only blank turn
- no prompt, duplicate app, uninstall, reconnect, permission change, or
  human-gate automation occurs during refresh itself

## Definition Of Done

- the source-built and installed-runtime gates pass
- the single approved live refresh is consumed successfully
- the existing exact app remains installed; its connector binding may be
  disconnected by the owning workflow's exact cleanup
- current app-catalog readback is recorded
- a separately authorized live app submission proves prompt preservation, or
  the provider/prompt guard stops fail-closed before browser dispatch
- roadmap, runbook, journal, fixes log, and operator testing guidance match the
  shipped behavior
