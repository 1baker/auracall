# ChatGPT Post-Payload Route-Loss Provider-Free Localization | 0263-2026-08-11

State: CLOSED
Lane: P01
Plan version: 2
Gate state: CLOSED_PROVIDER_FREE_VALIDATED
Goal execution state: PAUSED_AT_FUTURE_LIVE_GATE

## Current State

Plan 0262's sole installed zero-retry canary reproduced the prior failure:
attempt 1 ended at sanitized stage
`provider:chatgpt.postPayloadReadiness.failed.predicate_unsatisfied.v1`, and
owned inspection found ChatGPT home instead of the requested conversation.
The installed fallback-404/410 repair did not emit its terminal stage. Current
telemetry cannot distinguish a missing payload, a payload with no mapping, or
a mapped payload followed by route loss.

## Stable Objective

Provider-free, reproduce the ambiguity at the real adapter seam and add a
closed, sanitized failure-stage classifier that binds post-payload readiness
failure to payload shape and safe route class. Preserve behavior and all
existing direct-404/fallback-200 recovery semantics. Prepare, but do not run,
one possible future canary gate.

## Scope

- Add pure closed classifiers for payload shape and current route class.
- On post-payload predicate failure only, read `location.href`, reduce it to a
  safe allowlisted route class, and emit one combined sanitized stage.
- Cover mapped, non-mapping, missing-payload, home-route, expected-route,
  other-ChatGPT-route, non-ChatGPT, and unreadable-location cases.
- Keep the existing generic predicate-unsatisfied stage if route
  classification itself cannot execute safely.
- Update operator and planning docs with provider-free evidence.

## Non-Goals And Effect Boundary

- No behavior change to payload acceptance, navigation, readiness, retries, or
  terminal-unavailable classification.
- No install, API restart, browser launch/attachment, provider call, live
  context read, materialization, completion/scheduler control, prompt, model
  selection, download/upload, guard/config change, direct runtime edit, or
  wider profile.
- No raw URL, provider body, error text, conversation content, or auth data may
  enter the stage name or receipt.
- No subagents.

## Acceptance Criteria

- [x] A deterministic real-adapter test proves the current generic stage
  cannot distinguish at least two payload-shape/route-loss combinations.
- [x] Pure classifiers return only closed payload-shape and route-class values.
- [x] Post-payload failure emits one exact combined sanitized stage.
- [x] Existing terminal fallback and recoverable fallback tests remain green.
- [x] Focused and adjacent tests, typecheck, build, scoped formatting/lint,
  diff hygiene, and plan audit pass.
- [x] Live/runtime effects remain zero.

## Definition Of Done

The next receipt can distinguish whether route loss followed a mapped,
non-mapping, or absent payload without retaining provider content. Plan 0263
closes provider-free and any future installed canary remains separately gated.

## Opening Checkpoint | One Missing Causal Dimension

- `checkpoint_id`: `P0263-C01`.
- `state_transition`: P0262_CLOSED_ONE_CANARY_NOT_ACCEPTED ->
  P0263_ACTIVE_PROVIDER_FREE_LOCALIZATION.
- `progress_classification`: provider_free_successor_opened.
- `red_evidence`: Plan 0262's receipt identifies post-payload readiness and
  owned inspection identifies the home route, but no retained field identifies
  whether the preceding payload was mapped, non-mapping, or absent.
- `structural_evidence`: CodeGraph shows the adapter unconditionally performs
  post-payload readiness after the payload read and currently records only a
  generic predicate-unsatisfied stage. The local `payload` value already
  distinguishes the three safe shapes without inspecting content.
- `authority_classification`: provider-free source/tests/docs only.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: add the exact red, implement closed
  classifiers/stage composition, validate, and stop before installation or a
  browser canary.

## Terminal Checkpoint | Payload Shape And Route Bound Safely

- `checkpoint_id`: `P0263-C02`.
- `state_transition`: P0263_ACTIVE_PROVIDER_FREE_LOCALIZATION ->
  P0263_CLOSED_PROVIDER_FREE_VALIDATED.
- `progress_classification`: provider_free_causal_dimension_added.
- `red_evidence`: two exact real-adapter fixtures—mapped payload with expected
  conversation route and mapped payload followed by ChatGPT home—both retained
  only the same generic predicate-unsatisfied stage. The focused command failed
  2/2 before implementation.
- `repair_evidence`: pure classifiers reduce payload to `mapping`,
  `non_mapping`, or `missing`, and location to `expected_conversation`, `home`,
  `other_chatgpt`, `non_chatgpt`, or `unknown`. A failed readiness predicate
  performs one independently bounded location read and records only the
  combined closed stage. No URL, payload body, error text, auth data, or
  conversation content is retained.
- `behavior_evidence`: payload acceptance, navigation, fallback recovery,
  404/410 terminal handling, retries, and readiness decisions are unchanged.
- `validation`: 198/198 focused and adjacent tests pass, including four exact
  adapter localization/terminal tests and two canary matrix tests. Typecheck,
  production build, scoped Biome,
  frozen canary dry-run, diff hygiene, and the 263-plan audit pass with zero
  errors.
- `build_evidence`: new built adapter SHA-256 is
  `2acb20a98796e9c69deff9bae8ded21e2acd5fdf80fd57c025cd92e45630bd3b`;
  installed remains the Plan 0262 build at
  `1f3941267e762d72b1caf12d41fce6fbd4f70e12cd6300b6c55e6e6d180beb4a`.
- `effect_audit`: installation, restart, browser launch/attachment, provider
  call, live context read, materialization, completion/scheduler controls,
  prompts, model selection, downloads, guards, config changes, and direct
  runtime edits were all zero.
- `authority_classification`: provider-free packet complete. Plan 0264 is
  prepared but not authorized for one newly installed zero-retry canary.
- `subagent_status`: not_spawned.
- `next_action_or_stop_reason`: stop before Plan 0264 installation or browser
  work pending a separate explicit approval.
