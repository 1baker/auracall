# Completed retained-browser proof and regression evidence

This packet answers every blocker from review
`resp_idem_c8f4bdb64914a1f1deea3e9fb2075a79`.

## Completed live result

- Response ID: `resp_idem_c8f4bdb64914a1f1deea3e9fb2075a79`
- Terminal status: `completed`
- Exact returned nonce:
  `codex-pro-guard-a37836d0aa3a89e5a0a5094ea89b7b79`
- Canonical project conversation:
  `https://chatgpt.com/g/g-p-6a7e016622e48191a60c4bc34366b537-codex-chatgpt-workshop/c/6ab29696-f420-83ea-925a-2809114cd178`
- Browser ID/session: `session:auracall-destination-smoke` /
  `auracall-destination-smoke`
- Target ID: `D355BEE501F4918E86DB4FFDBCBD41C5`
- Browser host/process: `attached_existing` / `2696783`
- Durable record SHA-256:
  `bf2679b3ec3fe6bfd5a7c254bca63d35a3966aa1190910d2588fa807758ed1e4`

The response record repeatedly binds that same target, canonical URL, host and
process ID. After completion, Agent Browser marked only the temporary proof tab
closed and retained the original target `A7B97C577F5A83BEBC46D1AC0CA7EA62`.
The sole retained browser remains healthy with top-level `pid: null`, verified
proof PID 2696783, and identical live/proof CDP endpoints. No second browser
record or process appeared.

## Revision and install binding

- Base commit: `f8884720`.
- Current bridge source SHA-256:
  `5a782852a84302d66ba90c774be9270cc66feb75f961ae156655bdb6822a0558`.
- Relevant working diff SHA-256:
  `cce4d08e3c157f9b7908e1d34205b69139130e078c7f7fda6cb96bc0cc0b5a08`.
- Built and installed bridge SHA-256, identical on both sides:
  `8f87755953147248fade44203326fae9a47e24d43ff60b5734c2aeaf8e45f604`.
- Guard script SHA-256:
  `5b0f0678b31b9dde392f049bcae7a48725821da792299281b27941d3c23b2970`.
- AuraCall is active with zero crash restarts. A separate active Codex session
  performed the shared-checkout install; this run detected exact installed
  parity and intentionally did not issue a duplicate restart.

## Regression results

- 130 focused AuraCall tests passed across retained acquisition, bridge,
  response binding and recovery observation.
- The dedicated retained-proof suite proves three negative boundaries:
  contradictory build proof cannot request a tab; an unknown two-stream set is
  rejected before access planning; process-ID drift at final inventory is
  rejected before tab creation.
- Existing bridge tests cover explicit host drift, wrong profile/target,
  ambiguous candidates, stale exact targets, exact-handle convergence, and
  fail-closed cleanup.
- 18 Pro-guard tests passed. They prove generic pre-submit failure preservation,
  typed new-project eligibility, project-conversation eligibility, non-project
  ineligibility, full identity binding and no prompt submission during recovery.
- TypeScript typecheck, production build and skill package validation passed.
- Re-polling the original failed run returned its original
  `runner_execution_failed` code/message and made no recovery call.

## Acceptance interpretation

The first reviewer correctly withheld approval because its own future response
could not be evidence inside its prompt. That response has now completed and is
the concrete transport proof supplied here. This follow-up must judge the
completed record plus the negative tests, not require its own response as a
third prospective proof.
