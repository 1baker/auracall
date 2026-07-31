# Provider-Session Authority Unification | 0179-2026-07-31

State: OPEN
Lane: P01
Plan version: 3

## Stable Objective

Eliminate identity drift caused by conflating AuraCall runtime selection,
managed Chrome storage/process ownership, and the account currently signed in
to a provider. Every browser-backed provider operation must obtain the same
canonical provider-session proof through one deep module, and collectors,
materializers, prompts, and diagnostics must agree on that proof.

This is a replacement plan, not another matcher exception. It closes only when
the old distributed identity construction/comparison paths are removed and a
bounded installed-runtime proof demonstrates collector/materializer parity.

## Current State And Proven Failure

- Scheduler remains paused. Five unrelated completions are paused; default
  ChatGPT completion
  `acctmirror_completion_7c207690-de8a-40a4-82b8-61edd830a25c` is safely
  blocked at pass 37 with no provider guard.
- Plan 0178's collector accepted the current provider account and completed
  four detail reads. Minutes later, job
  `hmj_6323dddba5f34adc9f6871b404920456` rejected all six transfers as
  `chatgpt_account_session_drift` against the same detected email.
- Runtime/browser selection resolves through browser-profile and managed-profile
  modules. Provider identity is separately reconstructed through service-account
  config, LLM list options, collector state, and materialization target options.
- `LlmService.buildListOptions` fills both `expectedUserIdentity` and
  `expectedServiceAccountId`; callers can independently override either.
  Materialization also derives its own expected identity from
  `boundIdentityKey`, creating multiple truth paths.
- ChatGPT auth-session evidence exposes provider account fields such as email,
  plan type, structure, and derived account level. Current errors collapse the
  comparison to `expected <binding>, found <email>`, hiding which dimension was
  absent, normalized, equivalent, or conflicting.

## Canonical Vocabulary And Non-Interchangeability

| Term | Authority | May prove provider login? |
|---|---|---|
| AuraCall runtime profile | top-level AuraCall config selected by `--profile` / `auracallProfile` | No; selects configuration only |
| browser profile | browser-service runtime/account-family configuration | No; selects browser behavior and storage |
| source browser profile | native Chromium profile used only for bootstrap/cookie sourcing | Never |
| managed browser profile | AuraCall-owned Chromium data directory/process registration | Never; provenance only |
| configured provider account | expected logical account binding from provider service config | Expected identity only |
| observed provider account session | account evidence read from the provider application/auth session | Yes, subject to evidence quality |
| provider-session proof | canonical comparison of configured account and observed provider session, bound to browser-session provenance | Sole authorization result |

No field named only `profile`, `identity`, or `account` may cross the new seam
when its meaning is ambiguous. A managed browser profile may contain a provider
session, but its directory name, Chrome profile name, process, or port is never
evidence that a particular provider account is signed in.

## Architecture Decision

Create one deep provider-session authority module at the provider seam, owned
under `src/browser/providers/`. Its small interface will hide config lookup,
provider-specific normalization, evidence comparison, diagnostics, and proof
lifetime rules.

Conceptual interface (names may tighten during M1, semantics may not):

```ts
interface ProviderSessionAuthority {
  resolveExpectation(context: ProviderSessionContext): ProviderAccountExpectation;
  verify(input: {
    context: ProviderSessionContext;
    expectation: ProviderAccountExpectation;
    observation: ObservedProviderAccount;
  }): ProviderSessionProof;
}
```

`ProviderSessionContext` carries AuraCall runtime profile, browser profile,
managed browser profile/process/target provenance, and provider ID as distinct
fields. `ProviderAccountExpectation` is derived once from config.
`ObservedProviderAccount` is produced only by the provider adapter.
`ProviderSessionProof` returns a stable verdict plus dimension-level evidence;
it is the value consumed by collector/materializer authorization.

The proof lifetime is tied to a concrete provider browser session fingerprint.
Callers may reuse it while the same provider-work lease and browser session are
intact. Reattach, process replacement, target replacement, or provider account
change requires reverification through the same module—not a caller-local
comparison.

## Required Invariants

1. Browser selection and provider-login authorization remain separate facts.
2. Only the configured provider account supplies expected account identity.
   Browser/profile names, paths, ports, and cookie-source names never do.
3. Only provider adapter evidence supplies the observed provider account.
4. Primary account keys (email, provider account ID, organization ID where
   configured) remain fail-closed.
5. Qualifier evidence has three states: `match`, `unknown`, or `conflict`.
   Missing evidence is not conflict. Conflict requires authoritative comparable
   values on both sides.
6. Provider vocabulary equivalence is normalized once in the provider adapter
   or authority implementation. Cross-dimension inference such as
   `plan=team`, `structure=workspace`, and derived `accountLevel=Business` must
   be explicit, tested, and diagnostic; callers may not improvise synonyms.
7. Collector and materializer operating on the same live-follow cycle must use
   the same expectation and authority semantics. A different browser session
   requires a new proof with the same expectation, not a new expectation.
8. Every rejection names the conflicting dimension, expected value, observed
   value, evidence source, and browser-session provenance without secrets.
9. Status and persisted job receipts distinguish provider-session conflict from
   browser selection/attachment failure.
10. No provider work proceeds when proof is missing, stale for the current
    browser session, or explicitly conflicting.

## Work Graph And Bounded Milestones

The critical path is serialized because all milestones converge on provider
identity types and LLM option construction. Intended active-agent concurrency
is one. Documentation/readback work may proceed independently only after the
M1 interface freezes.

### M1 | Contract And Failing Characterization

Owner: primary implementation lane.
Expected write surface: provider-session types/module skeleton and focused
tests only.

- Inventory every construction and comparison of `expectedUserIdentity`,
  `expectedServiceAccountId`, `boundIdentityKey`, detected provider identity,
  and browser/runtime profile identity.
- Freeze fixtures for:
  - same account across different managed browser profiles;
  - different provider accounts inside the same managed browser profile;
  - missing plan/structure evidence;
  - provider-equivalent plan/structure/account-level vocabulary;
  - explicit email, account ID, organization, plan, and structure conflicts;
  - browser/session replacement invalidating a prior proof.
- Add red interface tests showing collector/materializer disagreement and
  proving that browser-profile equality cannot authorize provider identity.
- Exit: one reviewed interface and one consolidated red finding set. One
  rework cycle maximum; otherwise split/reframe before implementation.

### M2 | Deep Authority Module

Owner: primary implementation lane.
Expected write surface: new authority module, provider-specific identity
normalization, focused tests.

- Implement expectation resolution, observation normalization, dimension
  comparison, session binding, and structured diagnostics behind the small
  interface.
- Keep provider-specific vocabulary in provider adapters/normalizers; keep the
  generic `match|unknown|conflict` state machine provider-neutral.
- Test only through the authority interface. Replace obsolete matcher tests
  once equivalent coverage exists; do not layer two permanent test contracts.
- Exit: all M1 cases green with no browser/provider calls.

### M3 | Caller Migration And Old-Path Removal

Owner: primary implementation lane.
Expected write surface: LLM-service option construction, ChatGPT collector,
history materialization, profile-identity smoke, status/receipt projections.

- Resolve one expectation per provider operation context and pass proof or
  authority input explicitly; callers stop synthesizing partial identities.
- Migrate collector, conversation/file/artifact materialization, account-library
  materialization, prompt/handoff paths, and identity smoke to the same seam.
- Remove caller overrides that can make `expectedUserIdentity` disagree with
  `expectedServiceAccountId`; retain no compatibility alias that preserves two
  authorities.
- Add a structural audit asserting identity construction/comparison remains
  localized to the authority module plus provider observation adapters.
- Exit: deleting the authority module would force the identity complexity back
  into all migrated callers; no alternate authorization path remains.

### M4 | Diagnostics, Persistence, And Operator Contract

Owner: primary implementation lane; docs may be a low-conflict sidecar only
after the interface is frozen.
Expected write surface: status/job schemas, README/testing/runbook/fixes log,
terminology policy if needed.

- Persist redacted provider-session proof summaries with completion and
  materialization receipts: verdict, dimension results, evidence source/time,
  session fingerprint, and invalidation reason.
- Make operator output say separately which AuraCall runtime profile, browser
  profile, managed browser profile, and provider account were selected/observed.
- Replace generic `expected <binding>, found <email>` with actionable
  dimension-level diagnostics.
- Update user-facing docs and terminology so Chrome sign-in and provider login
  cannot be described as the same state.
- Exit: one read-only status/receipt can explain a failure without DOM probing.

### M5 | Integration, Installation, And Separate Live Gate

Owner: primary implementation lane.
Expected write surface: validation receipts and plan closeout only.

- Run focused authority, adapter, collector, materializer, completion, HTTP,
  CLI/MCP, typecheck, build, lint, plan audit, and diff hygiene gates.
- Install only while scheduler and all provider completions remain paused or
  terminal-blocked; verify source/installed executable and module hashes plus a
  new service PID and unchanged paused posture.
- Provider-free acceptance and installed parity do not authorize live work.
  Require a separate explicit operator gate for exactly one default ChatGPT
  pass, with no scheduler resume and no retry.
- Live acceptance must show one provider-session proof identity used by both
  collector and materializer, at most one collection, a truthful terminal
  materialization result, no rate-limit/verification signal, and restored
  paused/blocked posture.

## Acceptance Criteria

- [x] Canonical terminology and typed identity/provenance models make runtime,
  browser, managed Chrome, configured provider account, and observed provider
  session impossible to substitute accidentally.
- [x] One deep provider-session authority interface owns expectation lookup,
  normalization, comparison, proof lifetime, and diagnostics.
- [x] Collector and every materialization family use that interface; no caller
  independently compares or constructs competing expected identities.
- [x] Provider-free tests cover profile/account cross-products, missing versus
  conflicting qualifiers, provider vocabulary equivalence, and session
  invalidation.
- [x] Explicit primary-account and authoritative qualifier conflicts remain
  fail-closed.
- [x] Receipts/status identify the exact failing dimension and clearly separate
  browser selection failures from provider-session conflicts.
- [x] Structural audit, focused/adjacent tests, typecheck, build, lint, plan
  audit, and diff hygiene pass.
- [ ] Installed/source parity and paused runtime posture are proved before any
  live gate.
- [ ] A separately authorized one-pass proof demonstrates collector and
  materializer parity without a second pass or new provider guard.

## Non-Goals

- No automatic provider login, cookie copying, account switching, guard clear,
  CAPTCHA/verification handling, or credential automation.
- No renaming browser profiles to encode provider accounts.
- No weakening of explicit account conflicts to make the current live receipt
  pass.
- No scheduler resume, broad multi-profile live campaign, pacing relaxation,
  or backlog-clear claim.
- No new public endpoint unless existing status/job interfaces cannot carry the
  required proof diagnostics; any such need requires plan revision first.

## Hard Stops

- No provider/browser execution during M1-M4.
- Stop if the design still permits two independently derived account
  expectations or treats browser provenance as provider identity.
- Stop if tests require reaching past the authority interface to assert core
  comparison behavior; deepen or move the seam instead.
- Stop rather than map provider vocabulary speculatively. Equivalence requires
  captured schema evidence and explicit fixtures.
- No live validation until provider-free gates, commit/push, installation,
  source/runtime parity, and an explicit new operator authorization all pass.
- One live pass maximum and no retry under M5.

## Definition Of Done

The plan closes only when one canonical provider-session authority governs all
browser-backed provider work, competing identity paths are deleted, failures
are dimensionally diagnostic, installed parity is proven, and a separately
authorized bounded pass shows collector/materializer agreement. Until then,
live-follow remains stopped for the affected default ChatGPT target.

## Checkpoint 1

- `plan_version`: 1
- `state_transition`: requested -> architecture-planned
- `progress_classification`: substantive
- `evidence`: Plan 0178 proved collector identity success followed by six
  materialization-specific identity failures against the same detected email;
  CodeGraph shows expectation construction split across service-account config,
  `LlmService.buildListOptions`, collector state, and history-materialization
  target options.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: await implementation authorization; then execute
  M1 only, freezing the authority interface and red characterization before
  product-code migration. No provider work is authorized.

## Checkpoint 2

- `plan_version`: 2
- `state_transition`: architecture-planned -> provider-free-implemented
- `progress_classification`: substantive
- `evidence`: M1-M4 now converge on
  `src/browser/providers/providerSessionAuthority.ts`; the obsolete
  `identityPreflight` contract and caller-owned `expectedUserIdentity` /
  `expectedServiceAccountId` authorization paths are deleted. Collector,
  conversation/snapshot, account-library, project-source, and media
  materialization record redacted proof summaries. Focused regression is green
  at 155/155 tests, the full provider-free suite is green at 2673 passed and 65
  skipped, typecheck/build/lint are green with zero lint errors, the plan audit
  reports 179 keep / 0 errors, and `git diff --check` is clean. No provider or
  browser work occurred in M1-M4. Pre-install readback proves API PID `1032`,
  scheduler posture/state paused, five active completions paused, default
  ChatGPT blocked at pass 37 with null force marker/guard, and zero queued or
  running completion/history-materialization work.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: rerun the final provider-free packet after this
  checkpoint, commit and push, re-prove the paused/blocked runtime posture,
  install and verify source/runtime parity plus a new API PID, then stop for the
  separately explicit one-pass ChatGPT authorization required by M5.

## Checkpoint 3

- `plan_version`: 3
- `state_transition`: provider-free-implemented -> package-parity-repaired
- `progress_classification`: substantive
- `evidence`: commit `a1f96ded` is pushed and aligned, but the first install
  package manifest exposed deleted `identityPreflight.js` retained in `dist`.
  Closeout stopped without restarting the API. Production builds now clean the
  generated output tree before compilation, structural coverage enforces that
  prebuild lifecycle, and dry pack proves the canonical authority present with
  the obsolete module absent. Focused validation is green at 156/156 plus
  typecheck/build/lint and diff hygiene. API PID remains `1032`; containment
  has not changed and no provider/browser work occurred.
- `subagent_status`: not_spawned
- `next_action_or_stop_reason`: commit and push the build-output repair,
  recheck containment, reinstall, verify new PID and source/installed parity,
  then stop at the separate explicit one-pass authorization gate.
