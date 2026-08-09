# ChatGPT Download-Artifact Probe Settlement Provider-Free Repair | 0235-2026-08-09

State: OPEN
Lane: P01
Plan version: 1
Gate state: PROVIDER_FREE_AUTHORIZED_LIVE_WITHHELD
Goal execution state: ACTIVE_PROVIDER_FREE_REPAIR

## Stable Goal Objective

Reproduce the exact pass-50 `readVisibleDownloadArtifactProbes` stall at the
real adapter seam, then make that probe independently bounded and avoid
repeated full-conversation layout scans. Prove the repair provider-free and
prepare, but do not authorize or run, one fresh installed canary. Do not
install, restart, launch or attach a browser, call a provider, control a
completion or guard, start materialization, or resume the scheduler or wider
completions.

## Current State

- Plan 0234 consumed one installed pass-50 canary and closed
  `C4_other_terminal_failure`. The sole child
  `hmj_99a99200ff9a4218a018f5717e274a64` completed two conversation reads and
  timed out two later reads at
  `provider:chatgpt.readVisibleDownloadArtifactProbes` after `109086ms` and
  `109094ms`; no receipt repeated `readConversationPayload`.
- The exact probe records its stage and then awaits one raw
  `Runtime.evaluate({ awaitPromise: true })` without a protocol timeout,
  independent host deadline, abort boundary, or pending-operation telemetry.
  Its injected page function scans every conversation turn and visible
  artifact control up to 20 times, forcing layout through
  `getBoundingClientRect()` on each pass.
- The adjacent visible-file reader already establishes the intended repair
  pattern: after caller-owned surface readiness, collect the full DOM once and
  apply a 10-second host deadline. Plan 0213 proved that repeated ready-surface
  DOM scanning can monopolize a large ChatGPT renderer.
- A still-pending payload-fallback `Page.reload` may contribute to CDP session
  degradation, but current terminal receipts retain no reload-pending or
  per-stage timing evidence. This plan will not claim that deeper mechanism
  unless a deterministic provider-free probe distinguishes it.
- The operator authorized this provider-free successor with `ok go` after the
  Plan 0234 diagnosis. Live/runtime authority remains withheld.

## Execution Packet

1. Export only the exact download-artifact probe test seam. Add a fake-timer
   regression whose `Runtime.evaluate` never settles and prove the current
   function remains pending beyond its intended local budget.
2. Replace the injected 20-pass polling loop with one collection after the
   caller's existing readiness gate. Apply both a protocol execution timeout
   and an independent host deadline, and wrap the exact await in
   `withBrowserScrapePendingOperation` so a future outer receipt identifies the
   unsettled operation.
3. Require the exact red test to turn green and verify one evaluation, one
   `collect()` call in the injected expression, preserved probe normalization,
   bounded rejection, and pending-operation cleanup.
4. Run focused ChatGPT adapter/context tests, browser-service UI tests,
   typecheck, build, scoped Biome, diff hygiene, and the plan-library audit.
5. Close, commit, and push provider-free. A successor may prepare one fresh
   installed `wsl-chrome-3` canary only behind separate operator approval and
   current stopped-runtime readback.

## Ranked Falsifiable Hypotheses

1. The unbounded raw `Runtime.evaluate` is the immediate settlement defect. If
   it is independently bounded, a never-settling fake CDP call will reject at
   the local deadline instead of remaining pending until the outer context
   timeout.
2. Repeated ready-surface layout scans are unnecessary renderer load. If the
   caller readiness gate is authoritative, replacing 20 polls with one
   collection preserves normalized output while eliminating repeated
   `collect()` calls.
3. A still-pending fallback reload can poison later CDP work. If this is the
   live-only cause, hypotheses 1-2 will close provider-free while a later
   separately authorized canary may still fail; that outcome must open a new
   reload/session-fencing diagnosis rather than widening this repair.

## Acceptance Criteria

- [ ] One fast deterministic command goes red on the exact unresolved
  download-artifact `Runtime.evaluate` seam before source repair.
- [ ] The exact same command passes after one independently bounded,
  single-collection repair.
- [ ] The probe passes a protocol timeout, has an independent host deadline,
  honors pending-operation telemetry, and performs exactly one DOM collection.
- [ ] Existing output normalization and caller behavior remain covered.
- [ ] Focused and adjacent tests, typecheck, build, scoped Biome, diff hygiene,
  and plan audit pass.
- [ ] Provider/browser, install/restart, completion/materialization,
  scheduler/guard, direct runtime-state, prompt/click, and wider-resume effects
  remain zero.

## Local Goal Bounds

- `max_plan_versions: 1`; `max_source_commits: 1`; `max_closeout_commits: 1`;
  `max_repair_iterations: 1`; `max_test_seam_exports: 1`;
  `max_provider_calls: 0`; `max_browser_launches: 0`; `max_browser_attaches: 0`;
  `max_installs: 0`; `max_api_restarts: 0`; `max_completion_controls: 0`;
  `max_materialization_starts: 0`; `max_scheduler_controls: 0`;
  `max_guard_controls: 0`; `max_direct_runtime_json_edits: 0`;
  `max_prompt_submissions: 0`; `max_browser_clicks: 0`;
  `max_wider_resumes: 0`; `max_subagents: 0`.

## Hard Stops

- Stop if the regression does not reproduce the exact unsettled
  download-artifact evaluation at the real adapter seam.
- Stop if the repair needs browser/provider access, weakens identity/guard/
  challenge behavior, changes asset normalization, or expands beyond the
  exact probe and shared existing timeout/telemetry helpers.
- Stop provider-free after validation. No green test, commit, or plan closeout
  grants install, restart, live canary, scheduler resume, wider completion
  resume, or separate materialization authority.

## Checkpoint 1 | Exact Downstream Repair Opens Provider-Free

- `checkpoint_id`: `P0235-C01`.
- `state_transition`: P0234_CLOSED_C4_OTHER_TERMINAL_FAILURE ->
  P0235_OPEN_PROVIDER_FREE_REPAIR.
- `progress_classification`: blocker_reduction.
- `authority_classification`: source, focused tests, Plan 0235, journal, fix
  log, validation, commit, and push only. All runtime and provider effects are
  excluded.
- `evidence`: pass-50 child
  `hmj_99a99200ff9a4218a018f5717e274a64`; two timeout receipts at the exact
  downstream stage; raw unbounded `Runtime.evaluate`; 20 repeated full-DOM
  collections; adjacent Plan 0213 single-collection/10-second precedent;
  operator `ok go`.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `next_action_or_stop_reason`: audit, commit, and push this open boundary, then
  add and run the exact red regression before editing production source.
