# Plan 0357 | Drain admission starvation

Status: OPEN
Lane: P01

## Durable reconciliation live result

Superseding update at 15:29 UTC: the installed preview-panel fix successfully
materialized both original documents, with exact independently reviewed hashes
and an unchanged failed API record. The download gate is now live proven.
Next acceptance is normal-runner document completion and the full joined
research/writer workflow; do not reset the old one-attempt recovery marker or
substitute this function-level proof for end-to-end success.

Update at 15:24 UTC: provider-proof repair is installed and live verified on
the exact retained original-response target. A bounded installed materializer
probe left the failed record byte-identical and found both expected controls,
but materialized zero files: both reported `ChatGPT exact artifact control
produced no verified browser download.` Retained-browser status still passed.
Do not add a second durable recovery attempt until this transfer path is proven.

149 runtime tests and full build passed; the installed local control operation
requeued the original request at revision 44. Normal runner recovery selected
the exact answer, then failed document materialization because no successful
provider-session proof was carried by the recovery path. The API remains failed,
not completed. Do not reset the one-attempt marker or inject manually recovered
files. Next: obtain provider-session verification on the exact recovered target
and define a narrow materialization-recovery operation that preserves history.

## Durable failed-recovery reconciliation

Add a bounded local control operation for a single-step ChatGPT run that failed
inside restart recovery. Require the exact stored revision, no active lease,
the prior restart-recovery event and one attempt maximum. Preserve the failure
in an appended event, requeue only that step, and mark it recovery-only so a
missing saved observation can never fall back to prompt submission. The normal
runner must capture and materialize output before marking completion. Do not
import manually downloaded files as fabricated runner output or alter history.

## Installed restored-target proof

107 focused tests and full build passed. Concurrent streaming edits were
reviewed and accepted by the primary. Installed recovery identified the exact
original user/assistant pair on the restored Workshop target, with cleanup and
without replay. Snapshot extraction now preserves assistant artifact buttons.
The existing failed API record was not changed. Plan remains OPEN pending
durable reconciliation and full document/API acceptance; function-level proof
is not a substitute for the complete autonomous handshake.

## Restored-target binding, source continuation

Extend the existing broker reattach path without changing lifecycle ownership.
When the old target is absent, inspect one unambiguous ready target with the
same browser ID, profile, session and original URL. Require the full original
wire prompt to match one user message, with exactly one following identified
assistant before the next user turn. Reject active generation and ambiguous
or missing identities. Read through the broker queue before attachment.

The executor consumes the bound answer directly rather than choosing a newer
unrelated response. Raw text capture does not guarantee Markdown formatting
preservation. Source tests do not prove installed recovery; the original failed
run remains unchanged. Before installation, reconcile concurrent edits observed
in recoveryResponseBinding.ts and the new recoveryResponseStreaming.test.ts.
Live acceptance must verify the original artifacts and a truthful API result
while retaining the failure history. Never turn recovery into prompt replay.

## Installed validation, 2026-09-11

Primary reran 81 service-host tests and two focused configured-executor recovery
tests successfully. Build passed. Only dist/src/runtime/serviceHost.js differed
from the previous installation; installed dist now matches the build.
Service-host SHA256:
515e5aa8ce7f40db0358b78115314d0c70cd6e0a0a9a9eed77353168a9eb22f1.
Rollback: /home/bak3r/.auracall/runtime-backup-20260911-2CYkzX.

At 14:50:14 UTC the installed runner recovered and claimed the original smoke
resp_dde12ed7885d4ada94e7861ad3d041b9. At 14:50:15 it failed explicitly:
the saved pre-restart broker target was absent and replay was refused. Lease
released as failed. Queue starvation is fixed in the live installation, but
full acceptance remains incomplete. The manually recovered files do not
authorize rewriting the failed API record as completed.

Next: bind the saved request to its exact user message and assistant response
on the restored broker-owned conversation. Require content and message identity,
not URL-only replacement. Preserve failure history and never replay the prompt.

## Current State

The installed document smoke remains recoverable-stranded. Two older runnable
requests require unavailable runtime profiles. A capped execution plan reserves
its slot before admission and never replaces a rejected candidate.

Source remediation now replaces rejected reservations using only unvisited
candidates and remaining capacity. Affinity and gate fixtures failed before
the patch. Closed-world review found a cap-two visited-row regression; primary
fixed it and added immediate/deferred fixtures. All 124 service-host,
configured-executor and projection tests pass, as do targeted Biome and diff
checks. Installed recovery and artifact verification remain open.

## Installed checkpoint | 2026-09-11 14:52 UTC

Another active workflow installed the scheduler-only dist delta at 14:50 UTC.
Primary verified installed and local serviceHost.js SHA256
515e5aa8ce7f40db0358b78115314d0c70cd6e0a0a9a9eed77353168a9eb22f1.
The previous runtime, wrappers and service unit survive in
/home/bak3r/.auracall/runtime-backup-20260911-2CYkzX; recursive dist comparison
shows only serviceHost.js changed. API PID 128671 runs the installed package.

The original request now has a terminal failure at 14:50:15.557Z: recovery
found zero matching retained targets and refused prompt replay. Queue
starvation no longer holds this request; browser-target continuity still does.
Do not poll it as active or overwrite its failed receipt with local files.

Primary independently verified the recovered DOCX/PDF against the persisted
original prompt: complete source equality, exact marker, readable one-page
PDF, one DOCX table, and expected content hashes. These recovered files do not
prove successful API completion. The API still accepts zero artifacts.
Plan remains OPEN for original-response reconciliation without replay.

## Recovery snapshot completion regression | 2026-09-11

Concurrent conversation-binding implementation introduced a completion check
that missed the visible data-streaming-response-status layout already handled
by the normal assistant reader. Primary added an isolated DOM-expression
regression: visible streaming without a Stop button incorrectly returned
generating=false before remediation. Snapshot now recognizes visible streaming
status and Stop aria-label controls; hidden stale status does not block recovery.
All 106 binding, streaming, reattach, bridge and configured-executor tests pass.
This is source verification, not an installed recovery or API completion claim.

## Recovered evidence checkpoint | 2026-09-11 14:56 UTC

Attached local recovered-document verification through the existing
POST /v1/archive/evidence endpoint, without changing the original response:
evidence:evidence_acdoc_20260911_a_local_verification. Read-after-write search
by responseId and marker ACDOC-20260911-A returned exactly one warning-status
record. The original API response remains failed with zero accepted artifacts.
The evidence contains original prompt/source digests, both local file digests,
format/content checks and explicit non-completion limitations. It does not
assert independently rechecked live assistant-message ownership.

Read-only agent stranded_recovery_audit ruled out the proposed runtime-evidence
scoring explanation: the selected 14:29:31.735Z lease heartbeat has complete
broker/browser/profile/session/handle identity, identical across all four
events. No richer earlier binding was dropped. Do not patch evidence scoring
to address this failure. The remaining transition is from an expired physical
target to a currently broker-authorized conversation, with exact original
request/assistant verification before accepting artifacts. Never substitute a
conversation-wide last answer or overwrite the original failed receipt.

## Scope and acceptance

- Preserve execution limits, priority ordering, runner affinity and execution gates.
- Replace an unconsumed reservation after admission rejection so eligible work
  can run during the same bounded drain.
- Reproduce affinity and execution-gate starvation in provider-free tests;
  preserve blocked records without executing them.
- Verify installed recovery of the original response without submitting again,
  and recover current-marker DOCX/PDF before claiming live completion.

## Non-goals

No browser lifecycle changes, new prompts, scientific-validation bypass,
unrelated dirty-file integration, or historical response acceptance.

## Execution

Primary owns serviceHost.ts and its focused tests. Read-only independent agent
stranded_recovery_audit confirmed installed admission ordering and the existing
no-replay configured-executor branch. Its URL-only submission-evidence caveat
requires exact marker and assistant-message checks during live recovery.

Definition of done: regression coverage passes and the installed original
document request produces identity-verified matching files. Source tests alone
leave this plan OPEN.
