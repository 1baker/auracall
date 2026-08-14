# Gemini Browser Handoff Adapter | 0293-2026-08-14

State: CLOSED
Lane: P01
Plan version: 1

## Goal

Add a Gemini browser target adapter to the existing approval-gated handoff
recovery seam so Plan 0114 has a concrete cross-service execution path without
weakening packet ownership, approval, identity, or provider guard controls.

## Current State

- Gemini browser handoff recovery is installed behind the existing provider-
  native adapter, approval, digest, upload, submit, readback, and packet-ledger
  contracts.
- CLI and HTTP now expose the closed-world selector set `packet`,
  `chatgpt-browser`, and `gemini-browser`; browser adapters require resolved
  AuraCall config and provider mismatch fails into durable failed upload rows.
- Provider-free fixtures prove approved compact context, selected attachments,
  conversation targeting, model selection, CLI selection, and HTTP/CLI
  missing-config rejection.
- Plan 0114 remains open because no live Gemini target mutation ran in this
  slice; its cross-service live exit criterion is still a separate gate.

## Scope

- Add a Gemini browser adapter behind `HandoffTargetAdapter`.
- Reuse the provider-native staged-upload contract and submit the approved
  primer, compact context, and selected packet files through `GeminiService`.
- Add explicit `gemini-browser` selection to CLI and HTTP recovery surfaces.
- Preserve provider mismatch, missing config, approval, digest, and upload
  failure gates.
- Add provider-free adapter, CLI selection, HTTP validation, and help/docs
  coverage.

## Non-Goals

- Do not run a Gemini browser or submit a live provider prompt in this slice.
- Do not claim Plan 0114's cross-service live exit criterion complete.
- Do not add provider-neutral heuristics to the handoff state machine.
- Do not change packet-default recovery behavior or make browser recovery
  implicit.
- Do not bypass CAPTCHA, sign-in, identity, rate-limit, or human gates.

## Work Units

1. Add red provider-free tests for Gemini adapter submission and explicit
   CLI/HTTP selection.
2. Implement the narrow Gemini adapter and closed-world selector wiring.
3. Update operator docs and planning authorities.
4. Run focused tests, typecheck, build, lint, plan audit, and diff hygiene.

## Acceptance Criteria

- [x] The Gemini adapter rejects non-Gemini targets.
- [x] Approved staged files and compact context flow through
  `GeminiService.runPrompt` with `completionMode=prompt_submitted`.
- [x] CLI and HTTP accept explicit `gemini-browser` selection and reject
  browser-adapter execution without resolved config.
- [x] Packet recovery remains the default and ChatGPT selection is unchanged.
- [x] User-facing CLI/help and README text describe the three adapter choices
  without implying live proof.
- [x] Focused tests, typecheck, production build, lint, plan audit, and diff
  checks pass without browser/provider work.

## Execution Bounds

- One implementation attempt and one bounded remediation pass.
- Provider-free fixtures only; no browser launch, prompt, upload, service
  restart, installed-runtime mutation, or provider request.
- One primary agent owns the adapter, selector, and documentation boundary.

## Definition Of Done

The plan closes when the Gemini browser adapter is available through the same
explicit approval-gated CLI/HTTP recovery contract as ChatGPT, provider-free
validation passes, and Plan 0114 remains open with live cross-service proof as
its next separately authorized gate.

## Execution Evidence

- Adapter: `src/handoff/geminiBrowserAdapter.ts` owns Gemini-specific staged
  attachment ids, prompt composition, conversation targeting, model selection,
  and readback normalization behind `HandoffTargetAdapter`.
- Operator contract: CLI help, CLI resolution, HTTP schema/resolution, README,
  and testing docs expose explicit `gemini-browser` selection while preserving
  `packet` as the default.
- Provider-free verification: 52/52 focused browser-adapter/CLI/HTTP tests,
  TypeScript, production build, full lint at the unchanged 208-warning
  baseline, the 294-plan audit with zero errors, and diff hygiene passed.
- Live effects: no browser launch, provider prompt/upload, installed-runtime
  mutation, service restart, or configuration write ran.

## Closeout

- state_transition: OPEN -> CLOSED
- acceptance_state: all bounded provider-free adapter criteria accepted;
  parent Plan 0114 live cross-service criterion remains open
- progress_classification: blocker_reduction
- evidence: explicit Gemini adapter plus closed-world CLI/HTTP selection and
  provider-free regression receipts
- material_blockers: live Gemini cross-service proof requires a separately
  authorized target mutation
- next_action_or_stop_reason: publish the provider-free slice; do not infer or
  run live provider proof from repository cleanup authority
