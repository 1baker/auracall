# Plan 0361: ChatGPT Pro intelligence send gate

State: OPEN

Current status: PARTIAL — source and provider-free behavior are verified, but
current installed-runtime readback does not contain the guard. Installation and
live retained-browser proof are both pending.

## Goal

Before every AuraCall ChatGPT browser Send, select and verify value 4 (`Pro`) on
the composer Power slider. Keep requested model selection independent. If the
slider cannot be found, set, or verified, fail closed before Send.

## Scope

- Apply the gate at every ChatGPT `submitPrompt` call site, including Skill runs.
- Run the gate after composer hydration and immediately before the send action.
- Reject generic `Pro` model labels as intelligence proof; require the slider.
- Preserve a byte-addressed installed-runtime rollback and record the patch.

## Verification

- Focused browser tests, typecheck, targeted lint, build, and diff hygiene.
- Installed-module import and digest checks.
- One retained-browser prompt proving `Required prompt intelligence: Pro`, a
  successful Send, and slider value 4 after submission.

## Current installed blocker

A post-reconciliation readback found zero installed
`ensureRequiredChatgptProIntelligence` symbols. The installed `thinkingTime.js`
and `index.js` hashes match the saved rollback bytes, so the earlier narrow
installation claim is no longer current. The full integration build differs
substantially from that older installed runtime and must not be copied over it
as a three-file patch. Prepare and verify an exact-baseline surgical patch or a
separately authorized full installation before any live Send.

## Current live blocker

The no-launch preflight passes for `chatgpt-pro`, but its copied stealth-browser
request paired a Windows executable with the Linux profile path and exited
before DevTools. No ChatGPT prompt was sent. Agent Browser subsequently retained
a stock-browser owner for the same profile under `dashboard-service-backend`;
the refreshed access plan therefore says to wait for that exclusive lease and
does not authorize a duplicate lane or takeover.

## Non-goals

- Forcing a ChatGPT model family named Pro.
- Changing the caller's requested model strategy.
- Installing unrelated changes from the shared dirty integration worktree.
