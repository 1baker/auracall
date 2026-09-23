# Final materialization handoff acceptance | 0358-2026-09-23

State: CLOSED
Lane: P51
Branch: ops/issue-29-final-live-acceptance
Target: main
Integration: merge
Work item: ecochran76/auracall#29

## Objective

Install the exact canonical issue 29 repair and run one zero-retry
`wsl-chrome-3` completion pass to prove the child reuses its already-starting
managed browser after DevTools attribution becomes available.

## Authority And Bounds

- Authority: operator explicitly authorized live acceptance and then directed
  execution to continue.
- One supported user-runtime install and one API restart from exact canonical
  `main` commit `cab98b15447b7e2f25cfb2962b6085b79b157127`.
- Keep the account-mirror scheduler paused throughout.
- Run one exact `run_one_pass` control against completion
  `acctmirror_completion_c4accb96-e1c9-4dee-8643-3bd6934569cd` and issue no
  retry.
- Do not touch Gemini, click `Answer now`, clear provider guards, or resume the
  scheduler.

## Preflight Gates

- Source and installed runtime must be attributable and byte-parity recorded.
- API must be healthy with zero restart loop evidence.
- The exact completion must be terminal blocked/paused with no force ceiling;
  active materialization jobs and managed-profile owners must be zero.
- Installed identity proof must match the configured ChatGPT Pro personal
  account with no CAPTCHA or human-verification surface.

## Acceptance Criteria

- Exactly one completion pass advances and exactly one child job is created.
- Parent cleanup proves its owner released before child work.
- Child snapshot refreshes pass the PID-before-port window without a second
  Chrome launch or `browserManagedProfileOwnerProbe` terminal failure.
- The child settles terminal successful or truthfully partial according to its
  existing contract; no retry or extra control occurs.
- Final readback proves zero active jobs, zero managed browser owner/listener,
  healthy API, and scheduler still paused.

## Hard Stops

Stop without retry on identity mismatch, CAPTCHA/human verification, unknown
browser ownership, autonomous scheduler work, more than one pass advance,
second-Chrome evidence, or any uncertain provider effect.

## Result

Accepted. The one control advanced pass 27 to 28 and child
`hmj_e944834c227446b5ae07b7f5b2545fbb` succeeded on one attempt after crossing
the former PID-before-port failure boundary. It attempted six conversations,
materialized one asset, skipped eleven, and failed zero. Final readback proved
zero active jobs and managed browser owners, healthy API PID `7701` with zero
crash restarts, a null force ceiling, and the scheduler still paused. The full
receipt is `docs/dev/notes/2026-09-23-issue-29-final-live-acceptance.md`.
