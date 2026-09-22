# Retained-browser proof acquisition repair

## Failure reproduced

The live `chatgpt-pro` inventory contained exactly one healthy retained browser
and one ready target. Its top-level `pid` was null because Agent Browser had
attached to an existing process, while matching build proof carried browser PID
2696783. The browser simultaneously exposed `cdp_screencast/cdp_input` and an
RDP/manual-control stream. AuraCall therefore discarded the retained browser
and rejected the access plan as an unsafe cold start before prompt submission.

The Pro-review wrapper then attempted response recovery for that generic
pre-submit failure. AuraCall correctly rejected recovery, but the wrapper
surfaced the recovery 409 instead of the original acquisition failure.

## Repair

- New-project acquisition uses the existing verified process-identity helper;
  invalid or contradictory build proof remains ineligible.
- Stream selection accepts an explicit requested pair, a sole pair, or the
  unique standard `cdp_screencast/cdp_input` pair. Unknown ambiguous sets still
  fail closed.
- Immediate pre-request inventory validation binds the same browser, process,
  profile, session, host, display isolation and stream pair.
- The Pro guard attempts recovery only for a project conversation or a typed
  `chatgpt_new_conversation_outcome_unknown` new-project failure. Other failures
  preserve their original code and message.

## Verification before this review

- 100 focused AuraCall tests passed.
- 17 Pro-guard tests passed.
- TypeScript typecheck and production build passed.
- The installed bridge hash equals the just-built bridge hash.
- AuraCall is active with zero crash restarts.
- The retained browser is still healthy with the same verified PID 2696783 and
  exact original target; no duplicate browser was launched.
- Re-polling the earlier pre-submit failure now returns its original
  `runner_execution_failed` summary without calling recovery.

This review request itself is the final live browser-driving proof. A completed,
nonce-matched verdict with a canonical project conversation URL demonstrates
that AuraCall opened a tab in the retained browser, submitted this prompt, read
the assistant answer, and returned it through the Responses API.
