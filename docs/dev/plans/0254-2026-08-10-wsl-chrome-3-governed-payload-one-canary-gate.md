# WSL Chrome 3 Governed Payload One-Canary Gate | 0254-2026-08-10

State: OPEN
Lane: P01
Plan version: 1
Gate state: AWAITING_EXPLICIT_ONE_CANARY_APPROVAL
Goal execution state: PAUSED_AT_EFFECT_GATE

## Stable Goal Objective

Install the provider-free Plan 0253 repair only after explicit approval, prove
source/installed parity and healthy API restart, then run exactly one fresh
`wsl-chrome-3` ChatGPT conversation-context canary against one previously
failing route. Do not start materialization, control a completion, resume the
scheduler, or widen to another route/profile in this plan.

## Current State

- Plan 0253 moves the page-refresh governor ahead of the ten-second fallback
  body window, disposes both per-read Network subscriptions, settles the
  governed reload audit from exact response evidence even when the reload
  acknowledgement remains pending, and joins retained-session abort cleanup.
- Provider-free focused and integrated validation must be green, the planning
  audit must accept Plan 0253, Git must be clean/synced, and the exact
  `default/chatgpt` and `wsl-chrome-3/chatgpt` managed browser owners must both
  be absent before this gate can be approved or executed.
- The scheduler remains paused and the default completion remains blocked at
  pass 9. Those are preserved stop states, not effects admitted here.

## Authority And Effect Boundary

- This document prepares but does not grant the live effect authority. An
  explicit operator approval naming this one-canary gate is required.
- After approval, permit one user-runtime install, one API restart, one exact
  source/installed adapter hash comparison, one `wsl-chrome-3/chatgpt` managed
  browser launch, one context read, and one exact owned-browser cleanup.
- The sole target is previously failing conversation
  `6a40724d-8688-83ea-ab36-7458e921ed19`. The canary may perform the adapter's
  normal same-route readiness and one governed exact-payload fallback, but may
  not retry the context read or advance to another conversation.
- Provider prompts, clicks, downloads, uploads, artifact retrieval,
  materialization, completion controls, scheduler controls, guard/config
  changes, profile seeding, direct runtime-state edits, and other provider or
  browser profiles remain excluded.

## Execution Packet After Approval

1. Re-read Git, service, scheduler, completion, active-job, provider-guard, and
   exact-browser admission. Stop on drift or any live owner.
2. Install the current committed source into the user runtime, restart only the
   AuraCall API, and require healthy active/running state with zero unexpected
   restarts plus exact installed/source ChatGPT adapter parity.
3. Launch the existing managed `wsl-chrome-3/chatgpt` browser profile once.
   Stop immediately on login, CAPTCHA, challenge, identity mismatch, or an
   `Answer now` surface; never click `Answer now`.
4. Run one fresh bounded `readConversationContext` for the sole target with
   cache fallback disabled. Retain only timing, terminal receipt stage/outcome,
   message/file/artifact counts, mutation start/complete balance, and cleanup
   evidence; do not retain conversation content.
5. Close only the exact canary-owned browser, require active jobs and exact
   browser owners to return to zero, and prove scheduler/completion state did
   not move.

## Acceptance And Hard Stops

- Acceptance requires one successful current context result, one successful
  receipt with no pending operation, nonzero message count, balanced reload
  mutation audit when fallback is used, no late mutation after owner cleanup,
  and exact browser/job cleanup.
- Any timeout, null payload, rejected/late reload, listener residue, auth or
  challenge surface, identity mismatch, install/hash mismatch, unhealthy API,
  unexpected restart, or state drift stops the plan without retry.
- Passing this canary does not authorize scheduler resume, materialization, or
  a default completion pass. Each remains a later separately bounded gate.

## Acceptance Criteria

- [ ] Explicit operator approval names this single canary gate.
- [ ] Git and runtime admission are clean, stopped, and drift-free.
- [ ] Installed/source ChatGPT adapter hashes match after one healthy restart.
- [ ] The sole context read succeeds with no pending operation or late mutation.
- [ ] Exact browser/job cleanup returns to zero.
- [ ] Materialization, completion, scheduler, guard, and wider-profile effects
  remain zero.

## Local Goal Bounds

- `max_installs: 1`; `max_api_restarts: 1`; `max_browser_launches: 1`;
  `max_context_reads: 1`; `max_context_retries: 0`; `max_browser_closes: 1`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_guard_actions: 0`;
  `max_direct_runtime_edits: 0`; `max_subagents: 0`.

## Definition Of Done

The installed runtime exactly matches the committed repair, the single fresh
`wsl-chrome-3` context read succeeds and fully cleans up, and scheduler,
materialization, and completion effects remain zero. Otherwise the plan closes
at the first hard stop with no retry.
