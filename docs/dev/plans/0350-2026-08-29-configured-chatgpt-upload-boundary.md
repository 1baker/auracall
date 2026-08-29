# Configured ChatGPT Upload Boundary | 0350-2026-08-29

State: CLOSED
Lane: P01

## Objective

Prevent configured browser-backed ChatGPT runs from deadlocking the composer
when a consequential request supplies more than ten reviewed text files plus a
large inline fallback.

## Current State

- Direct CLI browser runs already bundle text input sets above ten files.
- Configured API/MCP runs bypass that policy and upload every artifact plus a
  generated large-request attachment separately.
- A preserved live workflow transferred 21 files successfully, but ChatGPT
  never returned the composer to an attachment-ready state.
- The retained browser, authenticated session, and canonical Agent Browser tab
  remain healthy and must not be replaced.

## Scope

- Apply deterministic text bundling at the configured browser prompt transport
  boundary after large-prompt spillover is known.
- Preserve original paths, byte counts, complete contents, and SHA-256 digests
  in one directly readable Markdown attachment.
- Keep small attachment sets and non-text or oversized sets unchanged.
- Add provider-free regression coverage, user documentation, runtime install
  proof, and one retry of the preserved consequential workflow.

## Non-goals

- Do not change Agent Browser lifecycle, profile, session, or tab authority.
- Do not weaken attachment-completion or sent-turn verification.
- Do not compress binary/media inputs into an opaque archive.
- Do not launch a second browser lane or submit unreviewed evidence.

## Execution

1. Implement and test configured text bundling with digest provenance.
2. Run focused tests, typecheck, lint, build, plan audit, and CodeGraph sync.
3. Install and restart only the AuraCall user runtime/API service.
4. Retry the preserved document request and verify artifacts, relevance, and
   retained-browser authority.

## Acceptance Criteria

- [x] Eleven or more eligible text attachments become one readable Markdown
      upload with a complete manifest and source contents.
- [x] A large generated `auracall-request.txt` is included in the same bundle
      and the composer prompt accurately describes that nesting.
- [x] Existing small-set and unsupported-file behavior remains unchanged.
- [x] Focused tests, typecheck, lint, build, plan audit, and CodeGraph sync pass.
- [x] Installed runtime source parity and healthy API restart are proven.
- [x] The preserved workflow reaches document creation and release auditing
      without changing the retained Agent Browser lane.

## Definition Of Done

This plan closes when the configured upload boundary is installed and proven
against the preserved workflow, required documents are materialized and
verified, and the retained browser authority is unchanged.

## Closure Evidence

- Thirty-four focused attachment/configured-executor assertions, typecheck,
  focused zero-warning lint, production build, plan audit, CodeGraph sync, and
  diff hygiene passed.
- Built and installed configured-executor runtime files share SHA-256
  `f5cf4c6c9b57662c620c96a39110d45b327b7e68eeae37ac6e431cf00510bb88`;
  the restarted AuraCall API reported healthy version `0.1.1`.
- Live response `resp_cd4d525168a34f75a52ff9a6d6033153` bundled 21 text
  inputs into one 307,937-byte Markdown upload with SHA-256
  `8114f51cf6e582a2fdba805844850a4ecb79869260caa4c4d1347cc5f655730a`,
  regained composer readiness, submitted, and completed.
- The workflow materialized a 2,189-word DOCX and equivalent six-page PDF.
  Independent response `resp_252c9e4417a045099df0d2745c23cbc4` passed every
  relevance gate; the digest-bound Codex review passed and release reached
  `done=true`.
- Agent Browser retained session `auracall-chatgpt-bridge-v3`, profile
  `auracall-chatgpt-live`, and PID `294633`; AuraCall did not launch, replace,
  or close the retained lane.
