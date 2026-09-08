# Response-bound artifact selection | 0355-2026-09-08

State: OPEN
Lane: P01

## Objective and Current State

Fix accepted provenance finding ARTIFACT-01 without narrowing the autonomous
Codex/writer handshake objective. Two completed writer responses expose the
same cached downloads. The configured executor materializes conversation-wide
artifacts without passing the captured assistant-message identity. Intentional
reuse versus stale capture remains unresolved; release is not approved.

## Scope

Primary owns propagation of verified assistant-message identity from the browser
result into configured artifact selection. Reuse the existing ConversationArtifact
messageId and excludeArtifact seam. Reject missing identity for response-scoped
ChatGPT materialization; never fall back to matching filenames, URLs, or turn indexes.
Add provider-free old/current same-name regressions and verify installed behavior
after the active audit finishes. Keep the broader conversation export API unchanged.

## Non-goals and Serialization

No cache deletion, browser launch/replacement, prompt replay, credentials changes,
or unrelated dirty bridge edits. Keep the current audit and supervisor alive.
No runtime restart while provider work is active. Local selection tests can proceed
independently; browser provenance inspection and deployment are serialized.

## Acceptance and Done

Source progress: browser results now retain identity only when the final text
matches the captured message and its ID differs from the baseline. The configured
materializer passes that ID to the existing exclusion hook, records provenance,
and suppresses automatic correction on missing identity. Ninety-two focused
executor, selection, materializer-boundary, and conversation-file tests pass.
Typecheck and the 356-plan audit pass. Installed runtime remains unchanged.

- [x] Browser result retains a message identity verified against returned text in source.
- [x] Configured ChatGPT artifact materialization selects only that message in source.
- [x] Missing identity fails closed, without automatic corrective POST.
- [x] Old and current same-name files, missing identity, and existing exports tested locally.
- [ ] Typecheck, focused tests, lint, planning audit, and installed parity verified.
- [ ] Live exact-message provenance verified before document release.

This slice does not prove live semantic question classification or the whole goal.
