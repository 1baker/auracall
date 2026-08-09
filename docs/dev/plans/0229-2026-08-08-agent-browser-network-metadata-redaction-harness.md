# Agent-Browser Network Metadata Redaction Harness | 0229-2026-08-08

State: OPEN
Lane: P01
Plan version: 1
Gate state: AUTHORIZED_PROVIDER_FREE_REDACTING_PROBE_HARNESS
Goal execution state: ACTIVE_TURN_2_OF_10

## Stable Goal Objective

Build and validate a provider-free AuraCall diagnostic harness that can run one
bounded agent-browser network-detail command, capture its raw result without
forwarding child stdout or stderr, and emit only an allowlisted metadata result.
The harness must prove synthetic credentials, cookies, identities, query
secrets, and response content cannot reach stdout, stderr, thrown errors, or a
written artifact. Prepare—but do not execute—the separately gated post-rotation
response-body discrepancy continuation.

## Current State

- Plan 0228 proved the direct conversation request remains a quick JSON 404
  (177 ms) and the reload emits exactly one 200 response for the exact
  conversation API URL. Absence of the reload response and direct-path drift
  are rejected.
- The raw agent-browser network-list JSON included sensitive authentication
  headers. Execution stopped before response-detail/body retrieval; response-
  body transport versus callback/session ownership remains unresolved.
- The exact browser is closed. The affected `wsl-chrome-3` ChatGPT session must
  be revoked or rotated before profile reuse.
- Source and `origin/main` are synchronized at `a67ec57d`. API PID 32737 is
  active/running with zero restarts; target completion is blocked/pass 49 with
  force ceiling null; scheduler and wider completions remain paused; active
  history jobs and exact-profile browser processes are zero.

## Authority And Effect Boundary

- This provider-free harness is ordinary implementation under the continuing
  goal and Plan 0228's recorded prerequisite. It may add one narrow script or
  reusable helper, deterministic tests, and aligned documentation.
- The child command boundary must capture stdout/stderr internally, impose a
  positive timeout and byte cap, parse JSON only after terminal settlement, and
  never interpolate raw output into errors or logs.
- Output is closed-world and allowlisted: request-id match, expected-URL match,
  response status, elapsed/retrieval outcome, body byte/character length,
  JSON parse state, and mapping count. Raw URL, headers, cookies, bodies,
  identity fields, and arbitrary child messages are forbidden.
- Synthetic fixtures must include authorization, cookie, identity, query-token,
  body-content, stderr, malformed-JSON, timeout, and oversize cases. Secret
  sentinel strings must be absent from every public result and error.
- Live browser launch/attach, provider access, credential rotation, source
  installation, API restart, materialization, completion control, scheduler
  control, and any canary are excluded.
- A successor may only prepare the exact post-rotation probe. It may not execute
  until credential rotation is externally confirmed and its live-effect packet
  is committed and pushed.

## Ranked Hypotheses

1. `H1_direct_json_serializes_headers`: agent-browser direct network JSON
   includes complete request/response headers by design. A wrapper that prints
   raw success output will reproduce the credential leak.
2. `H2_error_echo_leaks_capture`: success-path reduction alone is insufficient;
   child failure handling that appends stdout/stderr will leak the same secrets.
3. `H3_non_header_fields_leak`: deleting headers alone is insufficient because
   query strings, identities, and response bodies can carry secrets.
4. `H4_deadline_or_size_bypass`: a timeout or maximum-buffer failure can surface
   raw child diagnostics unless those terminal outcomes are normalized without
   captured text.
5. `H5_service_capture_can_replace_wrapper`: installed agent-browser 0.28.0 may
   safely adopt the AuraCall BYOP browser and use its redacted service network
   capture. This is acceptable only if no-launch/current contract proof shows
   exact-profile reuse without duplicate launch and can derive body metadata
   without returning content; otherwise retain the local diagnostic wrapper.

## Execution Packet

1. Audit, commit, and push this authority packet before source edits.
2. Inspect the current agent-browser 0.28.0 public contract and the exact direct
   network JSON envelope provider-free. Reject service capture if it cannot
   satisfy exact external-browser reuse plus content-free body metadata.
3. Add the smallest real-seam deterministic test first. It must fail on the
   absence of the harness or on raw-output propagation using synthetic secrets.
4. Implement one timeout/size-bounded child boundary and one pure closed-world
   metadata reducer. Do not add provider-specific selectors or a second browser
   ownership path.
5. Prove success, child failure, malformed JSON, timeout, oversize, and nested
   secret fixtures. Scan captured test output and touched files for all sentinel
   values.
6. Run focused tests twice, proportional impacted tests, typecheck, build,
   scoped lint/format, debug-marker scan, plan audit, and diff hygiene.
7. Record the durable result, close Plan 0229, and prepare a fresh Plan 0230
   post-rotation response-detail gate with all live effects still unconsumed.
8. Commit and push the validated provider-free slice. Stop without browser,
   provider, install/restart, materialization, completion, scheduler, or canary
   effects.

## Acceptance Criteria

- [ ] Authority artifact is audited, committed, and pushed before source edits.
- [ ] One deterministic red-capable command reproduces the exact raw-output
  leakage class using synthetic secret-bearing network JSON.
- [ ] Public success and every terminal failure expose only the allowlisted
  metadata/error vocabulary and no child output.
- [ ] Headers, cookies, raw URL/query, identities, response content, stdout, and
  stderr sentinel values are absent from all public results and errors.
- [ ] Timeout and size limits are independently tested at the child boundary.
- [ ] Focused tests pass twice and proportional typecheck/build/lint/audit/diff
  validation is green.
- [ ] Plan 0230 is prepared but no credential, browser, provider, runtime, or
  scheduler effect occurs.
- [ ] Final docs, checkpoint, commit, and push are complete.

## Local Goal Bounds

- `max_source_seams: 2`; `max_new_scripts: 1`; `max_new_test_files: 1`;
  `max_red_green_cycles: 2`; `max_focused_test_runs: 4`;
  `max_service_contract_reads: 3`; `max_live_browser_launches: 0`;
  `max_agent_browser_attaches: 0`; `max_provider_requests: 0`;
  `max_installs: 0`; `max_api_restarts: 0`;
  `max_materialization_starts: 0`; `max_completion_controls: 0`;
  `max_scheduler_controls: 0`; `max_canaries: 0`; `max_subagents: 0`.

## Hard Stops

- Stop on any raw synthetic or real credential/content value reaching public
  output, errors, repo artifacts, or test reports.
- Stop on dirty-worktree overlap, installed/source drift requiring runtime
  repair, or a need to change agent-browser itself.
- Stop on any need to reuse the affected managed browser before credential
  rotation, or to launch/attach a browser, access a provider, install/restart,
  materialize, control a completion/scheduler, or run another canary.
- This plan does not authorize credential rotation or the Plan 0230 live probe.

## Checkpoint 1 | Provider-Free Redaction Harness Authorized

- `checkpoint_id`: `P0229-C01`.
- `state_transition`: P0228_HARD_STOP_SENSITIVE_HEADER_EXPOSURE_BODY_UNTESTED ->
  P0229_AUTHORIZED_PROVIDER_FREE_REDACTING_PROBE_HARNESS.
- `progress_classification`: blocker_reduction.
- `authority_classification`: continuing goal implementation inside the
  existing provider-free safety prerequisite; live effects withheld.
- `evidence`: Plan 0228 direct-404 and exact reload-200 milestones, sensitive-
  output stop, exact browser cleanup, current clean/synchronized source, API
  health, blocked/pass-49 target, paused scheduler/completions, and zero jobs.
- `subagent_status`: not_spawned; `max_subagents=0`.
- `review_disposition_summary`: H1-H4 admitted to the closed-world synthetic
  test ledger; H5 requires current no-launch contract proof before adoption.
- `next_action_or_stop_reason`: audit, commit, and push this packet, then create
  and run the secret-bearing red-capable test before implementation.
