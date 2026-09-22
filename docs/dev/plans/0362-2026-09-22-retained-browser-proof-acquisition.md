# Plan 0362 | Retained browser proof acquisition

State: CLOSED
Lane: P01
Date: 2026-09-22

## Current State

Agent Browser reports the retained ChatGPT profile as healthy with one exact
service tab, but attached-existing browser inventory intentionally leaves the
legacy top-level `pid` empty and carries the live process identity in verified
browser-build proof. The same browser can expose both CDP screencast and remote
desktop view streams. AuraCall's new-project path currently treats both valid
shapes as ambiguous or absent, then rejects the access plan as an unsafe cold
start. The Pro guard subsequently attempts recovery for every failed response,
masking pre-submit acquisition failures with an unrelated recovery error.

## Scope

- Accept only a process identity that passes the existing build-proof checks.
- Select an explicit requested stream, a sole stream, or the standard
  `cdp_screencast` plus `cdp_input` pair when simultaneous streams are present.
- Revalidate the same browser, process, session, display and stream immediately
  before opening the new project tab.
- Make the Pro guard attempt recovery only for response shapes that AuraCall can
  legally observe; preserve other terminal failures and their original summary.
- Install once, restart only AuraCall, and issue one fresh nonce-bound end-to-end
  review through the already retained browser.

## Non-goals

- Weakening recovery validation or replaying a failed prompt.
- Launching, replacing or closing the retained browser/profile.
- Changing Cloudflare, Authelia or ingress configuration.
- Cleaning or overwriting unrelated dirty work.

## Acceptance Criteria

- A retained browser with `pid: null` and matching verified build proof is
  eligible; incomplete or contradictory proof still fails closed.
- Simultaneous CDP and RDP streams do not make acquisition ambiguous, while an
  unknown multi-stream posture still fails closed.
- A pre-submit failed response is returned as the original terminal failure and
  does not call the recovery endpoint.
- Focused tests, TypeScript checking, production build, installed-runtime parity,
  API health and one fresh ChatGPT response all pass.

## Execution Receipt C01

- state_transition: ready -> functionally_verified -> closed
- acceptance_state: installed browser path and guard failure classification pass;
  core repair is published in personal commit `aecf12f9`; independent artifact
  audit remains recorded at 82 because its evidence packet predated that commit
- progress_classification: outcome_progress
- evidence: 140 focused AuraCall tests, 18 guard tests, typecheck/build, exact
  built-installed bridge hash parity, original failed-run readback without a
  recovery call, and completed responses
  `resp_idem_c8f4bdb64914a1f1deea3e9fb2075a79` and
  `resp_idem_1b8f6e9511c8b8763dd6c4eb1e473ee9` through the retained browser
- material_blockers: none for the scoped repair; unrelated MCP work remains
  intentionally uncommitted in the shared checkout
- next_action_or_stop_reason: retain the completed evidence and do not issue a
  third provider review solely to replace the historical score
