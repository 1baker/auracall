# Plan 0361: ChatGPT Pro intelligence send gate

State: CLOSED

Current status: VERIFIED — source behavior, the exact-baseline installed patch,
retained-browser Send, and independent post-send slider value 4 readback all
pass.

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

## Installed verification

The guard was reapplied as an exact-baseline surgical patch rather than copying
the substantially different full integration build. Installed-module imports
pass, both current ChatGPT `submitPrompt` callers supply the final `beforeSend`
gate, and the shared submit routine awaits that gate immediately before its
click-or-Enter send action. The installed manifest records the three patched
digests and exact rollback bytes in
`/home/bak3r/.auracall/pro-intelligence-rollback-20260919-JN3u3d/`.

## Live verification

Agent Browser retained the exact `chatgpt-pro` stock-Chrome owner under
`dashboard-service-backend` with complete build proof. AuraCall reattached that
exact target without launching Chrome or another tab. The live run logged
`Thinking time: Pro (already selected)` and
`Required prompt intelligence: Pro` before `Clicked send button`; the exact
marker appeared as the next user turn and ChatGPT began its response. An
independent post-send inspection opened the same composer's visible Power
picker and read `aria-valuemin=0`, `aria-valuemax=4`, and
`aria-valuenow=4`. The menu was then dismissed with Escape without changing the
selection.

## Non-goals

- Forcing a ChatGPT model family named Pro.
- Changing the caller's requested model strategy.
- Installing unrelated changes from the shared dirty integration worktree.
