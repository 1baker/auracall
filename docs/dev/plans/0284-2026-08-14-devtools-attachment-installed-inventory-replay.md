# DevTools Attachment Installed Inventory Replay | 0284-2026-08-14

State: OPEN
Disposition: INSTALLED REPLAY AUTHORIZED
Lane: P01

## Stable Objective

Install the pushed Plan 0283 DevTools attachment repair once, prove exact
source/installed parity, and run one instrumented read-only ChatGPT
developer-app inventory replay on AuraCall runtime profile `wsl-chrome-3`.

## Current State

- Plan 0283 is provider-free accepted at pushed HEAD `e4154c19`; its source
  candidate is `c8a54364`.
- AuraCall service PID 32268 remains active. Chrome PID 66297 owns the exact
  AuraCall managed browser profile and is the sole listener on port 45015.
- The prior replay succeeded through ChatGPT identity and stalled inside
  `connectDevTools()` before installed/linked inventory or Developer-mode
  inspection. The canonical LitScout DB hash is
  `0aab7426a26c969afa137f53262f4a5eb72421c91649553971c5d838c7756623`.
- The operator has now authorized install and replay. This packet consumes at
  most one user-runtime install and one read-only inventory invocation.

## Execution Contract

1. Capture Git, service, browser-owner/listener/registry, operation-lease, and
   canonical DB baselines.
2. Run `pnpm run install:user-runtime` exactly once. Do not reinstall the API
   service or restart it; the exact installed wrapper owns the replay.
3. Require installed/source parity for the changed browser-service, client,
   and developer-app modules before browser access.
4. Invoke exactly once:
   `AURACALL_DEBUG_DEVELOPER_APPS=1 timeout --signal=TERM --kill-after=5s 60s ~/.local/bin/auracall --profile wsl-chrome-3 apps --target chatgpt list --json`.
5. Stop after the first terminal result. Do not retry a timeout, failure,
   identity mismatch, blocking page, or selector drift.
6. Record exact stage output, result/exit, cleanup, lease, service/browser, DB,
   and effect counters in a durable receipt.

## Non-Goals And Hard Stops

- No prompt, connector call, app/OAuth mutation, canary, Experiment 6 action,
  scheduler/completion/materialization control, or LitScout canonical write.
- No browser launch, close, restart, duplicate managed browser process, direct
  CDP inspection, or navigation outside what the authorized read-only
  inventory itself performs.
- No second install, second replay, repair cycle, or speculative follow-on.

## Acceptance Criteria

- [ ] Preflight proves clean/upstream-exact Git, exact browser ownership, one
  listener/registry entry, active AuraCall service, no live inventory worker or
  operation lease, and the frozen canonical DB hash.
- [ ] Exactly one user-runtime install succeeds without an API service restart,
  and changed source/installed module hashes match.
- [ ] Exactly one instrumented installed inventory reaches a terminal result
  inside the outer deadline and reports its attachment stages.
- [ ] Terminal readback proves cleanup and preserves the service, exact managed
  browser owner/listener, canonical DB hash, and zero downstream effects.
- [ ] A durable receipt, roadmap/runbook/journal closeout, planning audits,
  diff hygiene, commit, and push bind the outcome to exact source and runtime.

## Effect Budget

- `max_user_runtime_installs: 1`
- `max_api_service_restarts: 0`
- `max_inventory_replays: 1`
- `max_prompt_submissions: 0`
- `max_connector_calls: 0`
- `max_app_or_oauth_mutations: 0`
- `max_browser_launches_or_closes: 0`
- `max_experiment_6_runs: 0`
- `max_canonical_writes: 0`
- `max_repair_cycles: 0`

## Definition Of Done

This plan closes after the installed source is proven current, the sole replay
has one terminal result, protected state is read back, and the exact outcome is
committed and pushed. A successful inventory does not authorize Experiment 6.
