# Issue 6 developer-app shared-lifecycle implementation

Work item: `ecochran76/auracall#6` · Lane: P16 · Plan 0323 revision 8.
Base: `dc0b909fb3d6d3354e5c2fee9f4ac6525cc94157`.
Branch: `fix/issue-6-developer-app-response` (local only; not published/integrated).
Source commit: `52b3ed19515fe716abc85d2c00b71ee4430cfb59`.
The subsequent docs-only closeout updates this exact checkpoint; both remain
local and unpublished.

## Authority and ownership

- The primary delegated sole implementation ownership to
  `/root/aggregate_status_audit` under current user authority. That authorization
  supersedes historical no-subagent constraints for this bounded recovery.
  Primary retains independent review, finding disposition and integration.
- Worker validation below is delegated evidence, not an independently executed
  primary validation claim. Primary supplied Sol/Terra review findings on lock
  ownership, conservative effects, inherited configuration, remote identity and
  attributable process provenance; these were implemented and tested.
- CodeGraph was used for structural discovery; current repo source and the
  issue-6 audit, not mixed-branch watcher patches, were authoritative. The
  browser skill kept provider-specific approval handling in the existing P45
  helper and required separating source proof from installed/live acceptance.
- No browser/provider/install/scheduler/runtime/GitHub/push/PR/merge authority.
  No other worktree was edited. Model/reasoning of the inherited worker is not
  exposed by its runtime; no invented model-use or cost claim is made.

## Implemented contract

`ChatgptDeveloperAppBrowserAdapter.submitTest` now invokes
`submitChatgptDeveloperApp` -> high-level `runBrowserMode` once. It never calls
low-level provider `runPrompt` for terminal completion. Existing local/remote
response waiting and `createChatgptToolApprovalHandler` remain shared; P45
Plan0352/ASA-R4 historical claims are not proof of this formerly broken seam.

- Per-run fresh-root Chat/current-model semantics override inherited
  Work/composerTool/project/conversation settings without persisting changes.
  The internal high-level mention contract refuses incompatible explicit
  tools, attachments, fallback submissions, Work and existing targets.
- Exact ecosystemMention selection is applied before prompt staging and
  checked again in `submitPrompt.beforeSend`. Selection failure stays
  `pre_effect`; after successful revalidation, entering Send is conservatively
  `unknown` even if the CDP acknowledgement is lost. Commit proof upgrades to
  `effect_observed`; structured error evidence cannot downgrade that state.
- Outcomes and text/JSON expose answerText, conversationId, terminal/current
  URL, effectState and retrySafe. Unknown/observed effects are never retry-safe;
  neither success nor failure automatically resubmits. Manual approval returns
  terminal failed/nonzero, not an unproved retained browser handoff.
- Apps CLI passes its existing operation-lock ownership through the bridge;
  both high-level paths honor it. Direct-library calls retain normal lock
  acquisition. Provider-session authority is rebuilt from canonical config
  and selected managed-profile context, then bound to observed process/target
  identity inside the shared lifecycle, not fabricated in the adapter.
- Remote terminal identity refreshes after commit and before success/failure
  return. Managed-process fallback is restricted to loopback and canonical
  Windows-loopback hosts. An arbitrary remote host cannot be authorized by a
  local PID file; missing attributable process evidence fails before Send.

## Provider-free validation

The final affected packet is the exact command below (no broad HTTP suite):

```sh
pnpm exec vitest run tests/browser/chatgptDeveloperAppLifecycle.test.ts tests/browser/chatgptDeveloperApps.test.ts tests/browser/chatgptEcosystemMention.test.ts tests/browser/llmServicePromptStructure.test.ts tests/cli/chatgptDeveloperAppsCommand.test.ts tests/browser/chatgptToolApproval.test.ts tests/browser/promptComposer.test.ts tests/browser/promptComposerExpressions.test.ts tests/browser/chatgptPromptAdapter.test.ts tests/browser/providerSessionAuthority.test.ts
```

- First widened packet: 131/131 across 10 files, 5.46 seconds. Final widened
  replay: 132/132 across 10 files, 5.47 seconds, including Windows-loopback
  and pre-acknowledgement boundary checks.
- After removing the false client `runPrompt` declaration and fake stubs,
  the four-file adapter/lifecycle/CLI/structure replay passed 64/64 in 1.73
  seconds; typecheck, rebuild and zero-finding scoped lint passed again.
- Lifecycle fixture uses the real adapter, bridge, runBrowserMode, canonical
  account authority and P45 handler. CDP transport and UI primitives are mocked.
  The remote connector is mocked to succeed; real launch/connect operations
  fail closed. The local failure fixture explicitly supplies a mocked reused
  Chrome and local target connection, while real launch remains forbidden.
  Managed-profile bootstrap and state writes are also mocked. `readChromePid=1234` and
  `isChromeAlive=true` are mocked, and proof asserts PID 1234 plus the exact
  fixture target. Arbitrary-host rejection is tested with the live local PID
  mock explicitly restored, so absence cannot accidentally explain the refusal.
- Initial fixture failures exposed genuine missing remote process provenance;
  fixture refinement also corrected an async mock and invalid typed configs.
  These were repaired, not masked with retries. The historical low-level
  prompt-only structure guard remains green. Full suite/live/HTTP tests were
  deliberately excluded because their process effects are not in scope.
- `pnpm -s typecheck`: passed. `pnpm -s build`: passed (both UX bundles).
  Scoped `biome lint` on 11 source/test files: zero findings. `git diff --check`:
  passed. Active-only and goal-only planning audits: `ok=true`, no problems;
  `pnpm -s plans:audit`: 353 candidates, zero validation errors.
- The bounded active-lane audit against the local topic ref intentionally
  remains fail-closed: `P16: local branch has no configured remote custody`
  and `P16: catalog checkpoint does not match the local branch tip`. The
  catalog pins the validated source SHA; its docs-only closeout is ahead, and
  publication is prohibited for this worker. Primary must reconcile the final
  published tip into the canonical catalog; no clean custody claim is made.
- Fresh `/proc` process/cwd censuses bracketed hermetic validation and found
  zero issue-worktree-owned Chrome/Chromium/Firefox/Brave processes. No unexpected
  process side effects were observed or cleaned in this issue-6 recovery.

## Remaining gates

Provider-free acceptance is not publication, current installed parity or live
acceptance. Primary must review the local commit and reconcile the proposed
catalog/checkpoint with canonical main before any separately authorized
publication/integration. Plan 0323 remains OPEN for current installed DAS-R3
and explicit live DAS-R5. No historical experiment retry or allowance was
consumed or renewed. Arbitrary remote Chrome without attributable process
provenance remains unsupported. The mutation-deadline and refresh-inventory
follow-ups stay separate. GitHub issue 6 was not changed by this worker.

## Closed-world local terminal-identity repair

Primary accepted Sol's final local-path finding: a committed Send followed by
an immediate ordinary/manual-approval failure could return before the next
background URL hint, leaving root URL and null conversation identity. The real
local lifecycle fixture reproduced both cases RED with exactly one Send and
`effect_observed`. Awaiting the existing `emitRuntimeHint` before terminal
failure branching repairs the stale result; the prior socket-error refresh is
moved to the common boundary rather than duplicated. The fixture publishes the
`/c/fixture-conversation` URL only when response waiting fails, so earlier
account or pre-submit hints cannot satisfy the assertion accidentally.

Follow-up validation:

```sh
pnpm exec vitest run tests/browser/chatgptDeveloperAppLifecycle.test.ts tests/browser/llmServicePromptStructure.test.ts tests/browser/chatgptDeveloperApps.test.ts tests/cli/chatgptDeveloperAppsCommand.test.ts
pnpm -s typecheck
pnpm exec biome lint src/browser/index.ts tests/browser/chatgptDeveloperAppLifecycle.test.ts
git diff --check
```

Result: 66/66 tests across four files in 1.69 seconds; typecheck passed; scoped
lint zero findings; diff hygiene passed. Fresh pre/post `/proc` process/cwd
censuses found zero worktree-owned browser processes. No live/browser action,
publication or runtime installation accompanied this remediation.
