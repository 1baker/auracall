# Headless ChatGPT Broker Contract | 0352-2026-08-31

State: OPEN
Lane: P01

## Objective

Make configured prompt-to-ChatGPT browser workflows request, prove, and retain
an explicit headless Agent Browser posture instead of relying on an implicit
headed retained lane.

## Current State

- The typed request, durable storage, configured execution, broker query,
  plan/inventory validation, and runtime evidence contract are implemented.
- The Codex Research adapter now requests hidden `remote_headed` by default;
  it is visually unattended and preserves an explicit `local_headless`
  diagnostic override. Its provider-free contract evaluation proves both
  cases.
- Installed canary `resp_240868fe699a4878a75a70abfc7e2ff7` proved one
  Agent Browser-owned `local_headless` process, exact profile, exact target,
  and matching requested/actual host evidence without a duplicate process.
- ChatGPT then returned a Cloudflare `Just a moment` challenge before prompt
  submission. The protected-browser boundary forbids automated challenge
  bypass, so true-headless provider completion is not yet proven.
- Control canary `resp_044b85e755e4425e8b87a700d3f88766` uses the same
  profile and exact conversation through hidden `remote_headed` execution and
  passes the Cloudflare boundary.
- Independent Pro review scored the strict implementation 88/100 and blocked
  release only because the operational default still selected the known-bad
  true-headless provider posture.
- After changing the omitted-host default, installed run
  `resp_908b49b085b349ce8641a0a289ba659f` completed through the exact retained
  Workshop conversation with structured output. Durable evidence reports
  requested host `remote_headed`, actual host `remote_headed`, Agent Browser
  authority, PID `766283`, profile `chatgpt-pro`, and one exact target without
  compatibility fallback or duplicate submission.
- Follow-up Pro guard `auracall-hidden-headless-default-20260831` passed at
  98/100 with high confidence, no blockers, no nonblocking findings, and no
  remaining checks. It explicitly accepted the operational hidden-headed
  posture without treating it as technically true headless.

## Scope

- Add a typed `auracall.browserHost` request hint and preserve it through
  durable response storage and retry reconstruction.
- Carry the requested host into configured browser execution and the
  AuraCall-to-Agent Browser access-plan query.
- Treat an explicit browser-host request as requiring Agent Browser authority;
  do not fall back to AuraCall-owned Chrome.
- Validate the copied access-plan request and final browser inventory against
  the requested host before prompt submission.
- Record requested and actual Agent Browser host evidence in durable runtime
  hints and status.
- Make the Codex Research Graphiti adapter use hidden `remote_headed` as the
  operational unattended default while preserving explicit `local_headless`
  diagnostics.
- Preserve the existing authenticated profile and headed lane until a bounded
  live headless canary can replace it safely.

## Non-goals

- Do not weaken Graphiti digest-bound request approval.
- Do not automate credentials, MFA, CAPTCHA, or first-login seeding.
- Do not run a second Chrome process against the same profile directory.
- Do not close or replace the retained headed lane before provider-free checks,
  installed-runtime reconciliation, and an idle-lane preflight pass.
- Do not make every AuraCall browser workflow headless; the requirement is
  request-scoped.

## Execution

1. Add and test the durable Responses API browser-host contract.
2. Add broker query, plan, inventory, and runtime-evidence enforcement.
3. Update the Graphiti adapter and its provider-free contract evaluation.
4. Run focused tests, typecheck, lint, build, planning audit, and CodeGraph sync.
5. Reconcile installed Agent Browser and AuraCall runtime drift without losing
   the retained profile, then run one bounded approved headless canary.

## Acceptance Criteria

- [x] `auracall.browserHost` is schema-validated, persisted, and reconstructed
      without mutation.
- [x] `local_headless` reaches Agent Browser access-plan as `browserHost` plus
      the exact target identity.
- [x] An explicit host requirement disables compatibility fallback and rejects
      a mismatched plan or final browser inventory before prompt submission.
- [x] Runtime evidence reports requested and actual Agent Browser hosts.
- [x] The Graphiti adapter defaults live browser extraction to hidden
      `remote_headed` while retaining an explicit `local_headless` override.
- [x] Focused tests, typecheck, lint, build, planning audit, and CodeGraph sync
      pass.
- [x] An omitted-host installed canary completes through hidden
      `remote_headed`, with requested/planned/actual host agreement, one exact
      retained conversation, structured output, and no compatibility fallback.
- [x] Explicit `local_headless` remains fail-closed and its provider challenge
      is classified as incomplete `challenge-blocked`, never completed.
- [ ] An installed end-to-end canary completes through a browser inventory row
      whose host is `local_headless`, with no headed window and no duplicate
      profile process.
- [ ] The canary preserves Graphiti approval gates and returns locally validated
      structured output.

## Definition Of Done

The unattended operational workflow is release-ready only when the request
contract, broker enforcement, installed runtime, and one real ChatGPT response
all prove the same hidden `remote_headed` posture end to end. The plan remains
open separately for technically true `local_headless`: it may close only after
a real ChatGPT response completes without a headed browser or challenge bypass.
