# Installed History Materialization Fairness Canary | 0325-2026-09-01

State: CLOSED
Lane: P18
Operational state: CANARY_COMPLETED_WITH_FAILED_MATERIALIZATION_HANDOFF
Branch: ops/plan0325-installed-fairness-canary
Target: main
Integration: direct
Revision: 4 | 2026-09-22

## Stable Objective

Adopt integrated Plan 0324 into the installed user runtime and prove one
bounded zero-retry `wsl-chrome-3` live-follow pass advances materialization
work without resuming continuous live follow.

## Current State

- Plan 0324 is integrated on `main` at merge receipt `87fec070` and its full
  provider-free integration gate passes.
- Installed AuraCall remains source-divergent from Plan 0324. API service PID
  `98408` is active with zero restarts.
- ChatGPT AuraCall runtime profiles `default` and `wsl-chrome-3` remain
  operator-paused with zero active history-materialization jobs and clear
  target provider guards.
- The operator directed AuraCall to leave Gemini disabled. The distinct Gemini
  AuraCall runtime profile `auracall-gemini-pro` has no completion and remains
  blocked from scheduling by its retained `manual_clear_required` /
  `google-sorry` provider guard. The legacy Gemini completion remains paused
  and startup-resume-blocked. P18 will not clear, inspect, or automate either
  Gemini browser profile.
- The fresh pre-install gate found external BYOP Chrome PID `1933` using the
  exact `wsl-chrome-3` managed browser profile and showing the ChatGPT home
  page. Agent Browser reports no active lease or registered browser for that
  process, AuraCall reports no operation lock or active materialization job,
  and no current run metadata attributes the PID. The process remained live
  through five bounded polls, so it is treated as unrelated foreground work.
- No install, restart, or canary allowance has been consumed. P18 resumes only
  after PID `1933` exits and a fresh ownership gate remains clean.

## Execution Graph

1. Re-read the in-scope ChatGPT provider guards, active completions/jobs, exact managed-browser
   processes, API ownership, and scheduler/background-drain posture.
2. Confirm Gemini remains disabled: `auracall-gemini-pro` has no completion and
   retains its blocking guard, while the legacy Gemini completion remains
   paused and startup-resume-blocked.
3. From a clean ChatGPT gate, run one supported user-runtime install and API-service
   restart, then prove installed source checksums match `main` and the service
   is healthy without a restart loop.
4. Run one `run_one_pass` action for the existing `wsl-chrome-3` completion,
   with no retry. Verify terminal job receipts use concrete transfer budget,
   rotate beyond prior retryable fronts, and leave continuous live follow
   paused.
5. Re-read exact process ownership, completion status, asset/backlog metrics,
   and service restart count; record the durable acceptance receipt.

## Acceptance Criteria

- `IHMF-R1`: installed history-materialization and completion-service source is
  byte-identical to the integrated `main` build.
- `IHMF-R2`: exactly one supported install/restart occurs from clean ownership,
  and the API returns healthy with no restart loop.
- `IHMF-R3`: one and only one `wsl-chrome-3` bounded pass runs without retry;
  its durable job evidence shows fair candidate advancement and concrete-only
  transfer-budget accounting.
- `IHMF-R4`: `default` and `wsl-chrome-3` continuous live follow remain paused,
  no human-verification surface is automated, and exact owned browser cleanup
  is proven after the canary.

## Bounds

- Do not clear or bypass a provider guard automatically. Do not launch, attach
  to, inspect, navigate, or otherwise automate any Gemini browser profile.
- Do not resume continuous live follow for either exact ChatGPT target.
- At most one supported runtime install/service restart and one
  `wsl-chrome-3` run-one-pass action; zero automatic retries.
- Stop on any active in-scope pass/job, unknown ownership, exact ChatGPT
  managed-browser presence before adoption, ChatGPT CAPTCHA/human verification,
  ChatGPT identity mismatch or provider guard, or service restart loop. A
  retained guard on the explicitly disabled and excluded Gemini target remains
  a required non-interaction boundary rather than authority to touch Gemini.
- Do not delete or rewrite archive, catalog, job, or account-mirror evidence.

## Definition Of Done

All four criteria have current installed and durable runtime evidence, the
bounded canary is terminal, continuous live follow remains paused, and the
installed source and service identities are recorded.

## Exact Authority Boundary

The operator explicitly directed AuraCall to leave Gemini disabled. The
existing Google unusual-traffic guard must remain untouched. Installed adoption
and the bounded canary are authorized only for the ChatGPT `wsl-chrome-3`
surface after a fresh clean ownership gate.

## Exact Unblocker

External foreground Chrome PID `1933` must exit normally. Do not terminate or
reuse it for P18. After process absence is proven, repeat the complete
ChatGPT/Gemini-disabled ownership gate before consuming either effect allowance.

## Git Custody | 2026-09-06

Plan 0337 moved this unfinished operational plan to a published paused branch
so its checkpoint can remain stable while main advances. The operational
hard stop and all unused live allowances remain unchanged and unexecuted.

## Closeout | 2026-09-22

The historical ownership blocker was gone, current source and installed
runtime were byte-identical, and fresh no-launch identity proof established the
exact Pro account plus an attributable managed browser. The single authorized
`run-one-pass` action advanced completion
`acctmirror_completion_603fbcf2-cae9-401c-b1d1-3be109c391e4` from pass 36 to
37 and created exactly one child job,
`hmj_a616ec85279841f6a0c6199e9871185b`.

The child selected six distinct candidates from 206 eligible conversations.
Every attempt recorded `assetsAttempted: 0`, so failed snapshot refreshes did
not spend the concrete asset budget. The child then failed closed because
Chrome PID `37909` transiently owned the managed profile without an
attributable responsive DevTools endpoint. AuraCall correctly refused to
launch a second Chrome. No retry ran; the provider-work lease released, both
observed Chrome owners exited, no active materialization job remained, and the
API stayed healthy with zero restarts.

P18 is closed because its one-shot canary allowance was consumed and produced
an attributable terminal receipt. `IHMF-R1`, `IHMF-R2`, and the fairness and
budget-accounting portion of `IHMF-R3` passed. Materialization success and the
paused-status portion of `IHMF-R4` did not pass: the completion is fail-closed
as `blocked`, not running, after the failed child. Issue 29 owns the newly
isolated browser-lifecycle handoff repair. This canary must not be retried.
