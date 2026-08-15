# OpenAI-Compatible Chat Completions Streaming | 0333-2026-08-15

State: OPEN
Lane: P01
Plan version: 1

## Goal

Complete Plan 0064's remaining `/v1/chat/completions` compatibility gap with
OpenAI SDK-compatible Server-Sent Events over AuraCall's existing durable
response runtime.

## Current State

- Non-streaming chat completions authorize, create, drain, and read one durable
  response through the same configured-agent runtime as `/v1/responses`.
- `stream: true` is rejected before response creation.
- The runtime exposes authoritative assistant output when its stored run
  settles; it does not expose provider token deltas through this HTTP seam.
- The installed OpenAI Node SDK consumes JSON `chat.completion.chunk` SSE data,
  throws when an SSE object contains `error`, and terminates on `data: [DONE]`.

## Scope

- Accept `stream: true` plus the OpenAI-compatible
  `stream_options.include_usage` option.
- Authorize and create exactly one durable response through the existing
  configured-agent path.
- Start SSE with a stable completion id/model/timestamp and an assistant-role
  delta, then drain the same stored run within the existing bounded wait.
- Project settled assistant text, a terminal `finish_reason`, optional usage,
  and `data: [DONE]` as valid chat-completion chunks.
- Emit structured SSE errors carrying the durable response id and poll path
  when execution remains pending or reaches a non-completed terminal state.
- Keep the durable run alive if the HTTP client disconnects; client transport
  cancellation must not cancel or duplicate provider execution.
- Add raw-wire and installed OpenAI Node SDK integration coverage without
  browser or provider effects.
- Update endpoint, workflow, testing, roadmap, runbook, journal, and durable
  fixes documentation.

## Non-Goals

- Do not claim provider token-level or browser DOM incremental streaming; the
  first compatible adapter emits authoritative output after durable settlement.
- Do not add a new endpoint, WebSocket transport, provider call, browser launch,
  installed-runtime mutation, credential read, or cancellation API.
- Do not change non-streaming response shapes, configured-agent authorization,
  response persistence, polling, selector semantics, or provider adapters.
- Do not implement tool-call delta synthesis beyond the existing text result
  contract.

## Acceptance Criteria

- [x] `stream: true` returns `text/event-stream` with a stable id, timestamp,
      model, assistant-role chunk, content chunk, stop chunk, and `[DONE]`.
- [x] `stream_options.include_usage=true` adds one final empty-choice usage
      chunk; false or absent does not.
- [x] The official installed OpenAI Node SDK can consume the stream with
      `for await` and reconstruct the expected assistant text.
- [x] Streaming uses the same catalog hydration, scoped authorization, durable
      response creation, single host drain, and stored response readback as the
      non-streaming path.
- [x] Pending and failed execution become structured SSE errors with durable
      response recovery metadata, and no successful terminal chunk is emitted.
- [x] A disconnected client does not cancel, duplicate, or corrupt the durable
      response run; later `/v1/responses/{response_id}` readback remains valid.
- [x] Existing non-streaming, auth, route-manifest, readiness, and complete
      provider-disabled tests remain green.
- [ ] Typecheck, zero-warning lint, build, plan audit, CodeGraph sync, diff
      hygiene, and exact-SHA Ubuntu/macOS/Windows CI pass.

## Definition Of Done

The plan closes when normal OpenAI clients can consume AuraCall streaming chat
completions through standards-compatible SSE while AuraCall retains one durable
stored run as execution authority, bounded pending/error recovery stays
machine-readable, and cross-platform CI accepts the exact implementation SHA.

## Execution Boundary

- critical_path_owner: root
- parallel_tracks: none; request parsing, response ownership, drain settlement,
  and SSE lifecycle share one tightly coupled HTTP path, and delegation is not
  authorized for this turn
- expected_write_surface: response server and tests, OpenAI client smoke,
  endpoint/workflow/testing docs, Plan 0064, roadmap, runbook, journal, and fixes
  log
- max_work_unit_attempts: 2 per failing contract before splitting or reframing
- max_review_rework_cycles: 1
- terminal_condition: raw SSE, official SDK consumption, recovery semantics,
  complete local gates, and exact-SHA CI pass, or an executable SDK/runtime
  contract disproves compatibility and the exact blocker is recorded

## Execution Notes

- The handler now shares request normalization, catalog hydration, scoped
  authorization, durable create, and one host drain before branching into JSON
  or SSE result projection.
- SSE sends a stable assistant-role chunk immediately after response creation,
  then settled content, stop, optional usage, and `[DONE]`. The durable id is
  also available in `X-AuraCall-Response-Id` before settlement.
- Pending and failed runs emit an SSE object with `error`, response id/status,
  and poll path. The installed OpenAI Node SDK consumes successful streams and
  converts error objects to API errors through its native parser.
- Raw-wire, SDK, auth, failure, timeout, and disconnect tests pass. The complete
  227-test HTTP adapter file, specialized/bundled skill contracts, typecheck,
  strict source/script/test lint, and scoped-key SDK smoke also pass without
  browser or provider effects.
- Production build, full zero-warning lint over 851 files, 334-plan audit, diff
  hygiene, and the complete provider-disabled suite pass. The suite reports 331
  files / 3,006 tests passed with 19 files / 55 intended live skips. Pre/post
  listener and process inventory is unchanged and contains no AuraCall-managed
  browser profile. Exact-SHA CI remains the closing gate.
