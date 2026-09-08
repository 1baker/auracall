# Required Inline Browser Transport | 0354-2026-09-08

State: OPEN
Lane: P01

## Objective

Correct accepted finding INLINE-01: a complete inline fallback requested by
the Codex document workflow is silently moved into an attachment above 60,000
characters. Preserve the full autonomous-handshake objective and existing
browser ownership; this slice does not claim full workflow completion.

## Current State

The source executor now supports explicit required-inline transport; the active
installed executor still applies unconditional prompt spillover. Runtime logs
confirm a 160804-byte request attachment and a 211-character composer prompt
for the in-flight document run. Source attachments uploaded and Send completed;
the same response is still being observed. Its frozen inputs remain unchanged.

## Scope and Non-goals

Add explicit per-request inline-required transport at the existing metadata
boundary, preserve automatic transport by default, and reject malformed modes.
Keep reviewed attachment bundling independent of the inline prompt. Update
focused tests and operator docs. Do not modify browser lifecycle, the existing
dirty browser-bridge file, user credentials, or the active provider request.
No API restart/install while that request is active. No public release or push
is part of this slice.

## Execution and Bounds

Primary owns runtime code, tests, integration, and live-job observation.
The `inline_transport_tests` agent owns read-only closed-world test review for
INLINE-01, with a ten-minute bound and no browser or provider operations.
At most two implementation attempts and one closed-world review/rework pass;
checkpoint at source validation and before runtime rollout. Deployment and a
new document submission are serialized after authoritative completion of the
existing request. A local source fix alone cannot close this plan.

## Acceptance Criteria

- [x] Explicit inline-required requests retain complete effective prompt text in the source executor.
- [x] Default automatic spillover and attachment bundling remain compatible.
- [x] Invalid transport metadata fails before a provider call.
- [x] Focused tests, typecheck, lint, and planning checks pass.
- [x] Codex document client requests the explicit policy on future submissions.
- [ ] Installed/runtime identity and actual composer transport are verified.
- [ ] A new authorized document run satisfies the inline fallback requirement
      without duplicate submission or retained-browser replacement.

## Definition of Done

Close only after source and installed behavior prove the required-inline
contract. DOCX/PDF acceptance, independent relevance audit, writer evidence
return, and semantic drift accuracy remain full-goal gates outside this slice.

## Source Validation Checkpoint

- Primary ran 72 configured-executor/response-service tests, `pnpm run check`,
  the complete `pnpm run lint` gate, `pnpm run plans:audit` (zero errors),
  CodeGraph sync, and `git diff --check` successfully.
- The companion Codex document/audit client now sends the explicit metadata;
  its 50 controller and 15 supervisor tests pass. No in-flight request changed.
- An exploratory `biome check` reported existing whole-file formatting/import
  differences; no broad formatting rewrite was applied. The repository's
  documented lint gate passes.
- Independent agent `/root/inline_transport_tests` completed read-only
  closed-world test review and remediation verification with no blocking
  regression. Primary accepted its source findings and independently ran the
  tests; the agent did not claim a live browser or independent test execution.
- State transition: source remediation to staged. Progress classification:
  blocker_reduction for INLINE-01. Exact remaining gates: runtime installation
  after the current response becomes terminal, actual composer delivery, and
  required document acceptance. No GitHub publication performed.
