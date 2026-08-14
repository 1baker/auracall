# Plan 0290 | Agent-Browser Stream Discovery Recovery

State: CLOSED
Lane: P01
Plan version: 2
Date: 2026-08-14

## Current State

The exact `chatgpt-pro` browser lane is live again on one current daemon, one
Linux Chrome process, one valid service-tab handle, and the configured
conversation URL. AuraCall required-mode discovery still scans only the XDG
runtime stream directory, while the installed agent-browser publishes the
authoritative retained session under `~/.agent-browser`.

## Scope

- discover explicit socket, agent-browser home, and XDG runtime stream files;
- deduplicate equivalent directories deterministically;
- preserve existing dashboard-service stream priority and exact-target gates;
- add provider-free path resolution coverage;
- live-verify one attach and one verified detach against the retained target
  without prompt submission.

## Non-Goals

- no provider prompt or response creation;
- no browser-profile migration or duplicate browser launch;
- no compatibility browser fallback;
- no GitHub write or unrelated dirty-worktree reconciliation;
- allow one user-runtime install and API restart only after source gates pass,
  while retaining the broker-owned browser process and exact target.

## Acceptance Criteria

1. Broker discovery includes `AGENT_BROWSER_SOCKET_DIR`,
   `AGENT_BROWSER_HOME` or `~/.agent-browser`, and the XDG runtime directory.
2. Repeated paths collapse to one directory and stale or unreadable locations
   remain ignorable.
3. Existing access-plan, exact profile/session/target, and fail-closed rules
   remain unchanged.
4. Focused tests, typecheck, lint, build, planning audit, and diff checks pass.
5. Installed live proof performs exactly one `cdp_attach` and one verified
   `cdp_detach` on the restored handle, retains browser PID/target, and sends no
   prompt.

## Execution Receipt C01

- state_transition: OPEN -> OPEN
- progress_classification: implementation_started
- evidence: agent-browser stream `auracall-chatgpt-broker-v7.stream` is current
  under `~/.agent-browser`; `/run/user/1000/agent-browser` contains only a
  different default session. AuraCall's `streamDirectory()` names only the
  latter root, so its no-launch identity smoke reports no live managed browser
  despite the broker record being ready.
- material_blockers: none for provider-free repair and bounded attach/detach.
- next_action_or_stop_reason: widen discovery at the broker seam, validate, and
  exercise the exact restored handle once without provider work.

## Execution Receipt C02

- plan_version: 2
- state_transition: OPEN -> CLOSED
- progress_classification: verified_completion
- implementation: `agentBrowserBridge.ts` now resolves and scans the explicit
  socket root, agent-browser home, and XDG runtime root, deduplicates paths, and
  tolerates missing directories. The focused test covers configured, default,
  runtime, and duplicate path resolution.
- source_verification: `agentBrowserBridge.test.ts` passed 20/20; the widened
  bridge/configured-executor/responses-service/HTTP matrix passed 292/292;
  typecheck, targeted Biome lint, production build, plan audit with zero
  validation errors, and `git diff --check` passed.
- live_verification: exactly one successful `cdp_attach` job and one successful
  verified `cdp_detach` job reused profile `chatgpt-pro`, session
  `auracall-chatgpt-broker-v7`, browser PID `1046742`, and target
  `B0EC77F279E5434E33FEA97AB1742B1A`. The canonical conversation URL remained
  exact and no prompt or composer action ran.
- installed_verification: built and installed bridge files share SHA-256
  `7ee0d1e3177949ec6d18db493e87ac5d6b0d6a320d2ef6e0c664690a0e9ef235`.
  Restarting only the user API service changed PID `1059699` to `1079711` while
  retained browser PID, target, URL, and ready health remained unchanged.
- material_blockers: none.
- next_action_or_stop_reason: stop; all acceptance criteria are verified and
  further browser/provider activity would exceed the no-prompt effect budget.
