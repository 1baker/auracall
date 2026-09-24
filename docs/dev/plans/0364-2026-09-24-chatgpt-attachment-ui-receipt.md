# ChatGPT Attachment UI Receipt | 0364-2026-09-24

State: CLOSED
Lane: P01

## Objective

Persist the browser's actual attachment submission observations so downstream
learning does not mistake request or transport intent for confirmed UI delivery.

## Current State

- Configured responses persist requested attachments and prompt transport paths.
- The ChatGPT runner checks upload completion and sent-user-turn attachment UI,
  but previously discarded those observations from the durable response.
- The first real attachment response completed and returned the synthetic code
  from the file, but its durable `attachmentUiReceipt` was null. The retained
  browser took the remote/native submission path, which lacked the local path's
  receipt construction. A source repair and installed retest now pass; the
  second response has the typed receipt in its durable record.

## Scope

- Record exact attempted paths, upload completion, sent-turn attachment UI, and
  submitted user ID on the ChatGPT browser result.
- Preserve the original request receipt when a later artifact-correction turn
  replaces the final browser result.
- Persist the receipt in both configured response output shapes.
- Add provider-free tests and documentation, then validate installed behavior
  against one consented retained-browser attachment run when safe.

## Non-goals

- Do not infer that the provider read identical file bytes from UI visibility.
- Do not change browser ownership, upload retry, or model selection.
- Do not retroactively mark old response records as UI-confirmed.

## Acceptance Criteria

- [x] UI receipt distinguishes confirmed, upload-timeout, and input-only cases.
- [x] Configured output retains the original receipt across correction turns.
- [x] Typecheck, 46 focused tests, production build, new browser-file lint,
      and CodeGraph sync pass. Existing configured-executor lint and planning
      audit findings remain separate pre-existing debt.
- [x] Installed runtime parity and healthy API restart preserve the retained
      ChatGPT browser process and ready state.
- [x] One exact retained-browser attachment run confirms the typed receipt in
      durable response readback. The first run, `resp_idem_392300561796477ed218da9fb0ac14dd`,
      completed without that receipt and is not acceptance evidence. The
      installed retest, `resp_idem_8ca8cb8ea4245a1a11d15ab59af0b2a7`,
      has the expected durable receipt and completed assistant output.

## Forward Validation Finding

- No-launch Agent Browser access-plan selected the existing authenticated
  `session:chatgpt-stealth-linux-20260924` browser; no duplicate lane was
  requested. AuraCall response `resp_idem_392300561796477ed218da9fb0ac14dd`
  completed with the synthetic attachment-only code. Durable step output had
  an attachment transport path but `browserRun.attachmentUiReceipt: null`.
- The remote/native browser path uploaded and awaited completion but neither
  checked the sent user turn nor built the receipt. The local browser path did.
  The source fix now checks sent-turn attachment UI after remote submission,
  carries the receipt through normal and fallback submissions, and returns it
  with the browser result. A failed sent-turn check fails closed.
- Typecheck, 48 focused browser/executor tests, production build, and touched
  browser-file lint passed for this source repair. Installed browser-index
  digest matched the build. The API restarted healthy with no selected runs;
  the retained browser stayed ready at PID 1829010. The second response's
  durable `browserRun.attachmentUiReceipt` records the exact test path,
  `uploadCompletion: confirmed`, `sentUserTurnAttachments: confirmed`, and a
  nonempty `submittedUserId`. Historical records stay unchanged. This proves
  browser UI submission evidence, not provider-consumed byte identity.

## Closure

The installed remote/native path now produces the typed UI receipt on a real
retained-browser attachment run. Downstream ModelLabs promotion still requires
separate graded, bound forward episodes and is outside this plan.

## Definition Of Done

Close only when the installed record shows the expected typed receipt for a
real attachment submission and its limits are documented for consumers.

## Source Verification

- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec vitest run tests/browser/attachmentUiReceipt.test.ts tests/runtime.configuredExecutor.test.ts`: 46 passed.
- `pnpm run build`: passed.
- `pnpm exec biome lint` on new browser module, runner, types, and new test: passed.
- `codegraph sync`: six changed files indexed.
- Full touched-file lint remains red on two existing control-character regex
  errors in `src/runtime/configuredExecutor.ts`; the test file and executor
  also retain pre-existing non-null assertion warnings.
- `pnpm run plans:audit` retains three unrelated pre-existing findings: the
  responsesServer route regex and Plan 0357's missing canonical state header.

## Installed Verification

- Rebuilt the committed source, reran the 46 focused tests, and installed only
  the user-scoped package after a dry-run and a recoverable copy of the exact
  previous runtime at `~/.auracall/user-runtime.pre-ui-receipt-20260924`.
- Installed and built receipt module, browser runner, and configured executor
  digests match. The installed receipt module returned the expected schema and
  confirmation fields in a provider-free import probe.
- Restarted only `auracall-api.service` after `/status` showed zero selected
  runs and idle background drain. The new API PID is 2331068 and `/status`
  reports healthy version 0.1.1 with an active runner.
- Agent Browser's retained `session:chatgpt-stealth-linux-20260924` stayed
  `ready` at PID 1829010 across that restart. No browser prompt was submitted,
  so live receipt behavior and provider-consumed bytes remain unproven.
