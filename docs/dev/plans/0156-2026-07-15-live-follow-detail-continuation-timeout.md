# Live-Follow Detail Continuation Timeout | 0156-2026-07-15

State: CLOSED
Lane: P01

## Goal

Repair the `chatgpt/wsl-chrome-3` live-follow continuation path so pending
detail inventory resumes without replaying full discovery or falling back to
the 120-second outer collector deadline.

## Current State

- Post-reboot unattended passes proved the 300-second ChatGPT provider-call
  envelope and advanced the detail frontier from 24 to 23 conversations.
- The next two attempts failed with
  `account_mirror_collector_timeout`; the latest `full_sweep` spent roughly 70
  seconds on identity, project index, and root rail before reaching detail
  inventory, then hit the 120-second outer collector deadline.
- The phase decision correctly reports `detail-inventory`, but the routine
  scheduler sent that phase through the configured `full_sweep` request with
  no `collectorTimeoutMs`; `refreshService` therefore applied its generic
  120-second default.
- Completion-service requests already carried the 900-second ChatGPT envelope,
  while the failing refresh had no completion lifecycle event and was
  scheduler owned. Installed restart proof then exposed the companion issue:
  resumed completion requests kept `full_sweep` for a selected detail phase and
  replayed discovery even though their deadline was wide enough.
- Provider guard is clear; this is continuation ownership and deadline
  propagation, not provider throttling.

## Scope

- Add deterministic scheduler- and completion-service regression tests for a
  full-sweep target whose next live-follow phase is pending detail inventory.
- Make that continuation request use `steady_follow`,
  `requestedPhase=detail-inventory`, and the ChatGPT wide collector envelope.
- Preserve the configured full-sweep policy for future discovery cycles while
  allowing the phase ledger to own continuation work.
- Install and prove the blocked target resumes and advances after the required
  identity preflight without replaying project/root discovery.

## Non-Goals

- Do not raise interaction frequency, weaken provider guards, or bypass
  CAPTCHA/sign-in stops.
- Do not globally convert configured full sweeps to steady follow.
- Do not mix unrelated model/selector work from the dirty worktree into this
  slice.

## Acceptance Criteria

- [x] A red-then-green regression test proves pending detail continuation from
  a configured full-sweep operation sends `steady_follow`,
  `requestedPhase=detail-inventory`, and the wide ChatGPT collector timeout.
- [x] Existing full-sweep first-pass behavior remains unchanged.
- [x] Focused tests, TypeScript, build, scoped Biome, diff check, and plan audit
  pass.
- [x] Installed runtime advances the detail frontier with zero consecutive
  failures and a clear provider guard.
- [x] Post-proof materialization and managed-browser cleanup reach terminal
  readback.

## Result

- Scheduler- and completion-owned detail continuation now share one request
  policy: configured `full_sweep` remains durable state, while a selected
  `detail-inventory` phase executes as `steady_follow` with the provider-wide
  collector timeout.
- Installed final-build proof completed the required identity preflight and
  moved directly to detail inventory without project/root replay.
- One installed cycle scanned 4 conversations, reduced remaining detail
  surfaces from 22 to 18, advanced pass count from 1 to 2, and kept consecutive
  failures at 0 with no provider guard.
- Materialization job `hmj_45d14dac265441c699260fec02c16ac7`
  succeeded with 4 conversations attempted, 2 assets materialized, and 0
  failures; final browser health was idle, CDP port 45015 was closed, and the
  service returned to 11 tasks.

## Validation

- `pnpm vitest run tests/accountMirror/schedulerService.test.ts tests/accountMirror/completionService.test.ts --maxWorkers 1` (`66/66`)
- `pnpm exec tsc --noEmit --pretty false`
- `pnpm run build`
- scoped Biome check on the implementation and regression files
- `pnpm run plans:audit -- --keep 156` (`Validation errors: 0`)
- `git diff --check`
- installed service, completion, materialization, `/status`, socket, and
  systemd resource readbacks

## Definition Of Done

The plan closes when phase-ledger continuation, rather than the original
full-sweep policy, owns pending detail work and the installed target proves
forward progress without discovery replay.
