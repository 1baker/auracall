# ChatGPT Attachment UI Receipt | 0364-2026-09-24

State: OPEN
Lane: P01

## Objective

Persist the browser's actual attachment submission observations so downstream
learning does not mistake request or transport intent for confirmed UI delivery.

## Current State

- Configured responses persist requested attachments and prompt transport paths.
- The ChatGPT runner checks upload completion and sent-user-turn attachment UI,
  but previously discarded those observations from the durable response.
- Source now records a typed UI receipt; installed and live proof remain open.

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
- [ ] Installed runtime parity and one exact retained-browser run confirm durable
      readback without replacing the browser.

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
