# Plan 0360 dirty-checkout disposition

This manifest closes the file-level review of the 70 paths preserved in
`runtime/auracall-snapshot-20260919-Ry3eWI/changed-files.tar.gz` (SHA-256
`6e9568f8b83f445e8afefbf687ae92b3bb3c6f72c74ad30f76b9fbe06c9ab248`).
Each archived path appears exactly once below. “Selective” means only the
proved behavior was adapted; it does not import unrelated recovery behavior
from the original dirty file.

## Selectively integrated and verified (17)

- `src/runtime/serviceHost.ts` — scheduler reservation replacement; byte-identical to the preserved source.
- `tests/runtime.serviceHost.test.ts` — scheduler regressions; byte-identical to the preserved source.
- `src/runtime/configuredExecutor.ts` — required-document-set contract only; recovery additions remain deferred.
- `tests/runtime.requiredDocumentSet.test.ts` — required-document-set regressions; byte-identical to the preserved source.
- `tests/runtime.configuredExecutor.test.ts` — adapted contract and current fixture coverage; recovery-only assertions were not imported wholesale.
- `src/browser/providers/chatgptArtifactControls.ts` — exact response-owned artifact controls.
- `src/browser/providers/chatgptAdapter.ts` — exact artifact download binding plus the independently owned Plan 0361 pre-Send guard.
- `tests/browser/chatgptArtifactControlsExact.test.ts` — exact-control regression; byte-identical to the preserved source.
- `tests/browser/chatgptArtifactDownloadBinding.test.ts` — adapted fresh-download and byte-binding regressions.
- `src/browser/actions/assistantResponse.ts` — exact assistant identity and visible-streaming checks.
- `src/browser/index.ts` — exact submitted-user ordering plus the independently owned Plan 0361 pre-Send guard.
- `src/browser/reattachCore.ts` — preservation of verified assistant message identity.
- `tests/browser/browserModeExports.test.ts` — adapted identity/export coverage.
- `tests/browser/pageActions.test.ts` — adapted completion and submitted-turn coverage.
- `tests/browser/reattach.test.ts` — reattach identity regressions; byte-identical to the preserved source.
- `src/runtime/runner.ts` — single-shot finalization and exact post-release return, found during comprehensive validation.
- `tests/runtime.runner.test.ts` — deterministic cancellation/finalization coverage.

## Represented by stronger staged behavior (2)

- `src/browser/actions/chatgptComposerMode.ts` — the older outer retry is superseded by the staged internal root/project hydration wait and fail-closed control check.
- `tests/browser/chatgptComposerMode.test.ts` — the staged hydration tests cover the accepted invariant without importing the older test wholesale.

## Reconciled as historical documentation, not copied over current docs (12)

- `README.md`
- `ROADMAP.md`
- `RUNBOOK.md`
- `docs/dev-fixes-log.md`
- `docs/dev/browser-service-tools.md`
- `docs/dev/dev-journal.md`
- `docs/dev/plans/0354-2026-09-08-required-inline-browser-transport.md`
- `docs/testing.md`
- `docs/wsl-chatgpt-runbook.md`
- `docs/dev/plans/0357-2026-09-11-drain-admission-starvation.md`
- `docs/dev/plans/0358-2026-09-11-required-document-set.md`
- `docs/dev/plans/0359-2026-09-11-conversation-capacity-recovery.md`

Plans 0357 and 0359 remain open evidence for separate recovery/authority work.
Plan 0358 is closed and its proved code contract is carried above. Current
integration documentation records those outcomes without replacing newer
upstream history with the dirty checkout's older narrative.

## Preserved but deferred from this integration (39)

- `packages/browser-service/src/chromeLifecycle.ts`
- `src/browser/service/agentBrowserBridge.ts`
- `src/browser/types.ts`
- `src/http/responsesServer.ts`
- `src/runtime/apiSchema.ts`
- `src/runtime/apiTypes.ts`
- `src/runtime/control.ts`
- `tests/browser-service/devToolsConnection.test.ts`
- `tests/browser/agentBrowserBridge.test.ts`
- `tests/http.responsesServer.test.ts`
- `packages/browser-service/src/brokerCdpClient.ts`
- `packages/browser-service/src/nativeBrokerTransport.ts`
- `src/browser/providers/chatgptConversationCapacity.ts`
- `src/browser/providers/chatgptNewConversation.ts`
- `src/browser/service/configuredNativeBrokerAuthority.ts`
- `src/browser/service/recoveryResponseBinding.ts`
- `src/runtime/responseRecoveryObservation.ts`
- `tests/browser-service/brokerCdpClient.test.ts`
- `tests/browser-service/nativeBrokerTransport.test.ts`
- `tests/browser/brokerAttachmentAdmission.test.ts`
- `tests/browser/chatgptConversationCapacity.test.ts`
- `tests/browser/chatgptNewConversation.test.ts`
- `tests/browser/configuredNativeBrokerAuthority.test.ts`
- `tests/browser/nativeBrokerAcquisition.test.ts`
- `tests/browser/nativeBrokerProviderRouting.test.ts`
- `tests/browser/newProjectRetainedRouting.test.ts`
- `tests/browser/recoveryProviderSession.test.ts`
- `tests/browser/recoveryRenderedUserBinding.test.ts`
- `tests/browser/recoveryResponseBinding.test.ts`
- `tests/browser/recoveryResponseStreaming.test.ts`
- `tests/browser/sameTargetRecoveryBinding.test.ts`
- `tests/fixtures/native-broker-cross-process.mjs`
- `tests/runtime.cleanupPublication.test.ts`
- `tests/runtime.nativeBrokerRouting.test.ts`
- `tests/runtime.newProjectConversation.test.ts`
- `tests/runtime.recoveredProofPropagation.test.ts`
- `tests/runtime.recoveryConversationCapacity.test.ts`
- `tests/runtime.recoveryNoCorrection.test.ts`
- `tests/runtime.responseRecoveryObservation.test.ts`

These paths form the still-open native broker, configured authority,
failed-response recovery, conversation-capacity, and explicit-new-conversation
packets. Source fixtures and partial transport work do not establish installed
custody or safe retained-browser operation, so Plan 0360 neither enables nor
silently discards them. The private archive is their recovery source.

The immediately preceding `GvOez6` archive remains preserved as historical
evidence. Before closeout, the configured-native-authority source advanced by
676 bytes in the original checkout; the new `Ry3eWI` archive captures that
change and compares cleanly. Its deferred disposition is unchanged.

## Concurrent prompt-control ownership

Plan 0361 is an accepted, independently owned dependency rather than an
unresolved overlap. Agent ModelLabs/Homelab controls the prompt policy: every
AuraCall ChatGPT submission must verify the actual Power slider at value 4
immediately before Send and fail closed otherwise. Plan 0360 owns integration
and release reconciliation around that invariant. The Plan 0361 additions in
`src/browser/actions/thinkingTime.ts` and
`src/browser/providers/chatgptSkills.ts` are outside this 70-path archive; its
edits in `src/browser/index.ts` and `src/browser/providers/chatgptAdapter.ts`
compose with, rather than replace, the selectively carried behavior above.

Live proof remains separate: the installed narrow prompt guard has source and
installed parity, but one retained-browser Send and post-Send slider readback
are still pending a safe Agent Browser access plan.
