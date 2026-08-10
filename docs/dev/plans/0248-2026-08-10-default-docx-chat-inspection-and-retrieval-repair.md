# Default DOCX Chat Inspection And Retrieval Repair | 0248-2026-08-10

State: OPEN
Lane: P01
Plan version: 1
Goal execution state: ACTIVE
Gate state: AUTHORIZED_PRE_DIRECT_CHAT_INSPECTION

## Stable Objective

Inspect the exact default ChatGPT chats implicated by Plan 0247's two new
retryable materialization failures, identify what their asset surfaces do
differently from the proven external-image path, reproduce that distinction at
the real provider-free extraction seam, then repair and test the explanatory
code gap. Prepare but do not consume any installed canary or scheduler action.

## Current State

- Plan 0247 closed fail-closed after default pass 8 child
  `hmj_d33cb7db5d274995ace8a1f26c8a5787` matched all four provider-session
  identity dimensions but finished materialized/skipped/failed `0/5/2` across
  five conversations. The two failures are retryable and produced no manifest,
  checksum, archive item, or retained file.
- Default completion is blocked/pass 8 with force/next null;
  `wsl-chrome-2` is paused/pass 2, `wsl-chrome-3` is idle-waiting/pass 56, and
  `wsl-chrome-4` is paused/pass 34. Active history jobs are zero. API PID 85854
  is healthy. Scheduler state/posture is paused/paused with zero active request
  or drain reservation and idle background drain.
- The default managed browser profile has no live process. The existing
  `wsl-chrome-2` retained browser remains out of scope and must not be touched.
- Current default cache evidence identifies two newest routeable asset-bearing
  chats, `6a6ffa3e-37f8-83ea-9a0f-833adb3b78c9` and
  `6a6fb365-db60-83ea-803e-42007bbc1c61`. Each carries one generated DOCX
  surface for `auracall-m5-20260802T185953Z.docx`; the provider artifact
  pointers use sandbox `/workspace/scratch/...` paths and the cache also
  contains DOM-download aliases. This is a leading direct-inspection target,
  not yet proof that both terminal failure rows came from these chats.
- The immediately preceding successful pass-56 canary materialized six
  external images through loaded-resource CDP fallback. A DOCX sandbox/DOM
  download surface therefore represents a plausibly new retrieval mechanism.

## Authority And Non-Goals

- The operator explicitly directed: inspect the chat directly, determine what
  differs, inspect the code for explanatory gaps, then repair and test.
- Authorized browser effects: one exact default managed browser launch and root
  navigation; one named agent-browser attachment to its actual live port; at
  most two exact conversation-route navigations; bounded read-only URL/title,
  DOM snapshot, and metadata-only evaluation of download controls, attributes,
  message/turn ownership, and challenge state; one exact browser/session close.
- Authorized provider-free work: reproduce the observed surface in a focused
  test/harness, inspect CodeGraph flow and source, implement the narrow repair,
  update tests/docs, run validation, commit, and push.
- Excluded: clicking or downloading an asset; prompt/composer input; ChatGPT
  `Answer now`; reload; raw network or header output; response-body capture;
  completion/materialization/scheduler/guard/config control; install; API
  restart; live canary; Gemini/Grok; direct runtime JSON mutation; retry.
- Critical-path owner: primary agent. `subagent_status=not_spawned`; browser
  evidence must precede the code hypothesis and all work is serialized.

## Execution Graph

1. Audit, commit, and push this gate. Re-read Git, API, scheduler, all four
   completion states, jobs, guards, and exact managed browser ownership.
2. Launch the exact default ChatGPT managed browser once with AuraCall
   browser-tools, bind the actual PID/profile/port, then attach one named
   agent-browser session. Require authenticated ChatGPT, correct origin, and no
   CAPTCHA/challenge/verification/`Answer now` surface.
3. Navigate serially to the two exact conversation routes. For each, retain
   only bounded metadata describing visible download controls and backing
   element attributes/protocol families; do not print chat text, URLs with
   credentials, headers, cookies, raw payloads, or download bytes.
4. Close the named session and exact launched browser. Re-prove scheduler
   paused, completions unchanged, jobs zero, and no default browser process.
5. Build one fast deterministic provider-free command that reproduces the
   exact observed failure. Require it to fail on current source before forming
   final code hypotheses.
6. Use CodeGraph context/explore for the real materialization flow. Rank 3-5
   falsifiable hypotheses from direct evidence, test them one variable at a
   time, and localize the explanatory gap.
7. Add the regression first, apply the narrow repair at the owning layer, and
   make the original provider-free loop green without weakening explicit
   terminal, identity, pacing, timeout, or safety behavior.
8. Run focused adapter/history/MCP tests, typecheck, scoped lint/build, and the
   warranted broader provider-free suite with managed-browser bracketing.
   Update durable docs, close the plan, audit, commit, and push.
9. Prepare one fresh installed default canary gate only if validation is green.
   Do not install, restart, run a canary, resume a completion, or touch the
   scheduler under this plan.

## Local Goal Bounds

- `max_work_unit_attempts: 2`; `max_review_rework_cycles: 1`;
  `max_hardening_checkpoints: 2`; `checkpoint_interval: 1 slices`.
- `browser_launches: 1`; `root_navigations: 1`;
  `agent_browser_attaches: 1`; `conversation_navigations: 2`;
  `bounded_dom_snapshots: 3`; `metadata_evaluations: 2`;
  `browser_closes: 1`; `provider_free_red_runs: 2`;
  `implementation_slices: 1`; `focused_validation_runs: 4`;
  `broad_validation_runs: 1`; `plan_commits: 3`.
- `asset_clicks: 0`; `downloads: 0`; `page_reloads: 0`;
  `raw_network_reads: 0`; `response_body_reads: 0`;
  `prompt_submissions: 0`; `answer_now_actions: 0`;
  `completion_controls: 0`; `materialization_jobs: 0`;
  `scheduler_controls: 0`; `guard_actions: 0`; `config_mutations: 0`;
  `installs: 0`; `service_restarts: 0`; `direct_runtime_json_edits: 0`;
  `other_provider_actions: 0`; `subagents: 0`.
- `authorization_gate: significant_departure_only`;
  `retry_budget_mode: renewable_execution_window`;
  `review_discovery_passes: 0`; `review_verification_mode: closed_world`.
- `checkpoint_record_fields: plan_version, checkpoint_id, state_transition,
  progress_classification, evidence, subagent_status, effect_accounting,
  next_action_or_stop_reason, authority_classification,
  review_disposition_summary`.

## Hard Stops

- Stop browser work on dirty/sync drift, API/scheduler/job/completion drift,
  unexpected default managed browser holder, wrong profile/PID/port/origin,
  login loss, CAPTCHA/challenge/verification, provider guard, `Answer now`, raw
  sensitive output risk, or need for click/download/reload/network/body access.
- Stop after one inspection of each exact chat. A missing or changed surface is
  evidence, not authority to navigate elsewhere, retry, or inspect more chats.
- Do not inspect source for a final explanation until the direct evidence is
  captured and a deterministic red-capable provider-free command exists.
- Do not install, restart, materialize, control a completion, run a live
  canary, or touch the scheduler. Those remain behind a fresh successor gate.

## Acceptance Criteria

- [ ] Opening gate is audited, committed, pushed, and freshly reread.
- [ ] Exactly two implicated chats are inspected once with bounded metadata and
  no download/click/reload/sensitive-output effect.
- [ ] The observed difference from the successful external-image mechanism is
  explicit and evidence-backed.
- [ ] One fast deterministic command reproduces the exact failure on current
  code and becomes green after the repair.
- [ ] CodeGraph-backed flow analysis identifies the explanatory gap and the
  repair stays at the narrow owning layer.
- [ ] Focused and broad provider-free validation pass with no managed-browser
  leakage or regression in identity, timeout, explicit-status, and external
  image behavior.
- [ ] Scheduler/completions remain stopped, excluded providers unchanged, and
  final docs/audits/Git readbacks agree.
- [ ] A fresh installed-canary successor is prepared but not activated.

## Opening Checkpoint | Direct Chat Inspection Authorized

- `checkpoint_id`: `P0248-C01`.
- `state_transition`: P0247_CLOSED_DEFAULT_PASS8_CHILD_FAILED ->
  P0248_ACTIVE_AUTHORIZED_PRE_DIRECT_CHAT_INSPECTION.
- `progress_classification`: blocker_reduction.
- `evidence`: Plan 0247 terminal child/outcome and current stopped runtime
  above; exact default cache readback for the two routeable DOCX-bearing chats;
  explicit operator direction to inspect, diagnose, repair, and test.
- `subagent_status`: not_spawned; serialized critical path.
- `effect_accounting`: all Plan 0248 effect counters zero.
- `next_action_or_stop_reason`: audit, commit, and push; freshly verify stopped
  runtime and exact profile absence; then launch and inspect only the two named
  chats without clicking or downloading.
- `authority_classification`: standing goal authority covers one bounded direct
  diagnostic and provider-free repair; installed/live recovery remains gated.
- `review_disposition_summary`: the DOCX sandbox/DOM path is the leading new
  mechanism, but code diagnosis is deliberately withheld until direct evidence
  and a deterministic red reproduction exist.

## Definition Of Done

The two exact chat surfaces are inspected directly, their new retrieval
mechanism is reproduced deterministically provider-free, the real explanatory
gap is repaired with regression coverage and broad validation, stopped runtime
boundaries remain intact, and one unactivated fresh canary successor records
the next exact gate.
