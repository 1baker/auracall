# ChatGPT Same-Route Mutation And Staged Re-enablement | 0180-2026-08-01

State: OPEN
Lane: P01
Plan version: 1

## Stable Objective

Eliminate redundant same-route ChatGPT browser mutations that can bypass the
operator-visible live-follow interaction budget, then prove exactly one bounded
default-account collector/materializer pass before any continuous or scheduler
reenablement.

## Current State

- Plan 0179 closed provider-session authority and materialization-receipt drift.
  Its final default-account pass produced matching collector/materializer proof,
  3 materialized assets, 1 duplicate alias, 3 skips, and 0 failures.
- The installed API is active at PID `63017`; source and installed materializer
  hashes match the pushed repair.
- The account-mirror scheduler is operator-paused. Five completions remain
  paused, including the three retained ChatGPT completions. No completion is
  queued, running, or idle-waiting.
- All four configured ChatGPT targets have clear provider guards and zero recent
  rate-limit detections.
- The final bounded default pass nevertheless recorded nine completed
  same-route navigation mutations. Five targeted one conversation within about
  64 seconds while the scrape budget reported only five total active provider
  interactions.
- All four ChatGPT runtime profiles are configured at 8 browser interactions per
  minute with 120-second conversation-read, refresh, and renavigation cooldowns.
  The previously proven conservative posture was 6 per minute with the same
  action-specific cooldowns.

## Architecture Decision

Keep provider-specific route intent in the ChatGPT adapter, but enforce physical
same-route suppression and mutation accounting at the existing browser-service
navigation/governor seam. Do not add another scheduler, collector-local throttle,
or compatibility alias.

One public behavior must hold: requesting a conversation already loaded in the
attached browser target must not emit another physical navigation unless the
caller explicitly invokes a governed recovery action. Every recovery navigation
or reload must consume the same interaction-governor policy as the provider
action that caused it.

## Bounded Execution Packet

Owner: primary implementation lane.

Expected write surface:

- existing browser-service navigation/mutation interface;
- ChatGPT adapter wiring only if needed to carry governed recovery intent;
- focused browser/provider tests;
- live-follow pacing configuration;
- this plan, `docs/dev/dev-journal.md`, `docs/dev-fixes-log.md`, and affected
  operator documentation.

Terminal condition: provider-free validation and installed/source parity are
green with the scheduler and unrelated completions still paused, followed by at
most one separately gated default ChatGPT bounded pass.

## Milestones

### M1 | Deterministic Red Characterization

- Add one fast provider-free test through the existing navigation/provider
  interface that starts on the requested conversation route.
- Prove the current implementation emits a redundant physical navigation or
  permits a recovery mutation without governor accounting.
- Minimize the fixture until every remaining action is required to reproduce
  the defect.

### M2 | Deep-Seam Repair

- Make same-route navigation a successful no-op after canonical URL comparison.
- Keep query/hash semantics explicit; do not suppress a materially different
  route.
- Route intentional recovery reload/navigation through the existing interaction
  governor and mutation diagnostics.
- Preserve current behavior when the target is not already on the requested
  route or its route cannot be read reliably.

### M3 | Conservative Pacing And Provider-Free Validation

- Set all four configured ChatGPT live-follow targets to 6 browser interactions
  per minute while retaining the 120-second action-specific cooldowns and the
  current full-sweep/full-missing-assets policy.
- Run the focused red/green test, adjacent browser/provider/account-mirror tests,
  typecheck, clean build, lint, plan audit, and diff hygiene.
- Record the behavioral change and durable lesson in operator documentation.

### M4 | Install And Paused-Posture Proof

- Commit and push the green repair before installation.
- Install the committed runtime and prove source/installed parity plus a new API
  PID.
- Verify the scheduler remains paused, all unrelated completions remain paused,
  provider guards remain clear, and queued/running work remains zero.

### M5 | One Default Bounded Canary

- Start exactly one `chatgpt/default` completion with `maxPasses=1`.
- Do not resume the scheduler or another completion and do not retry.
- Require terminal collector/materializer provider-session parity, zero failed
  materializations, zero redundant same-route physical mutations, no provider
  guard/rate-limit/CAPTCHA/verification signal, and restored zero-work posture.

## Acceptance Criteria

- [x] A deterministic test fails on redundant same-route physical navigation.
- [x] The same test passes through the existing deep navigation/provider seam.
- [x] Every physical recovery navigation/reload is governed and represented in
  operator-visible interaction evidence.
- [ ] All four ChatGPT targets read back 6/min plus the existing 120-second
  action cooldowns without changing sweep/materialization policy.
- [x] Targeted and broad provider-free validation pass.
- [ ] The committed repair is pushed, installed, and hash-bound to the running
  API while scheduler/completion pauses remain intact.
- [ ] Exactly one default bounded pass satisfies the M5 terminal evidence with
  no retry or unrelated work.

## Non-Goals

- No global scheduler resume or multi-profile live campaign.
- No continuous live-follow start in this plan.
- No metadata-only mode or weakened materialization policy.
- No provider login, account switching, cookie copying, CAPTCHA handling, or
  provider-guard clearing.
- No weakening of provider-session identity/provenance authority.

## Hard Stops

- Stop before live work if the red regression cannot reproduce a real physical
  mutation through the correct interface.
- Stop if the fix requires a second independent throttle rather than deepening
  the existing governor/navigation seam.
- Stop if install or restart starts any unrelated provider work; restore the
  persisted pause before continuing.
- Stop immediately on any rate-limit, provider guard, CAPTCHA, verification,
  identity conflict, failed materialization, or second-pass signal.
- The live packet is one attempt. Failure consumes it; no retry without a new
  explicit operator authorization.

## Definition Of Done

The plan closes only when redundant same-route physical mutations are prevented
and governed by deterministic tests, conservative pacing is installed, paused
runtime parity is proved, and one exact default bounded pass completes with
truthful session/materialization receipts and no safety signal. Scheduler and
continuous live-follow reenablement remain separately gated afterward.

## Checkpoint 1

- `plan_version`: 1
- `progress_classification`: substantive
- `evidence`: deterministic provider-free tests reproduced unconditional
  same-route `Page.navigate` and an ungoverned ChatGPT payload reload. Both are
  green after deepening `navigateAndSettle`/`reloadAndSettle`, carrying provider
  options through conversation readiness, and wiring ChatGPT recovery mutations
  through the existing governor. Focused suites pass 166/166 and adjacent suites
  pass 285/285; TypeScript passes.
- `runtime_state`: installed API remains on the prior binary with scheduler and
  completion pauses intact. All four ChatGPT config targets are staged at 6/min
  with unchanged 120-second action cooldowns and retrieval policy.
- `validation`: full provider-free suite passes 303 test files and 2,680 tests,
  with 65 opt-in/TTY tests skipped. Clean build, TypeScript, lint with zero
  errors and 205 retained warning diagnostics, plan audit, and diff hygiene
  pass.
- `next_gate`: broad provider-free validation, commit/push, install/hash parity,
  paused-posture readback, then at most one exact default bounded pass.
