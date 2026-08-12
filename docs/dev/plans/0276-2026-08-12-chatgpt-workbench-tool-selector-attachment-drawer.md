# ChatGPT Workbench Tool Selector And Attachment Drawer | 0276-2026-08-12

State: CLOSED
Lane: P01
Plan version: 2
Gate state: PROVIDER_FREE_ACCEPTED

## Current State

ChatGPT composer-tool selection already recognizes the current searchable
`.popover` surface and can activate installed apps through its search field.
The normal attachment path still carries the older generic contract: click a
composer `+` trigger and immediately inventory any mounted file inputs. It has
no explicit representation of ChatGPT's current attachment drawer, while its
focused tests do not exercise the current searchable tool selector or drawer
transition.

## Stable Objective

Represent ChatGPT's current Chat workbench tool selector and attachment drawer
as distinct provider-owned surfaces, route `--browser-composer-tool` through
the tool selector and `--file` through the attachment drawer, and preserve the
existing fail-closed separation between tool selection and file upload.

## Authority And Bounds

- The operator's request authorizes one bounded, non-submitting inspection of
  the configured ChatGPT Chat workbench and the source/docs/test changes needed
  to support the observed selector and attachment drawer.
- The inspection may reuse one attributable retained browser or launch one
  no-prompt identity smoke for the exact configured AuraCall runtime profile,
  open the composer tool selector once, record bounded labels/roles/attributes,
  dismiss it, reopen it once, activate only the exact `Add from library` row
  to reveal the non-uploading attachment drawer, record bounded
  labels/roles/attributes and file-input state, then dismiss it.
- No tool row, `Add photos & files` row, library file/result, or drawer action
  may be selected during inspection. No file chooser, file input, upload,
  prompt, model/effort change, connector, or `Answer now` action is authorized.
- Provider-free implementation is limited to ChatGPT adapter/action code,
  focused tests, browser-service helpers only if the observed mechanic is
  genuinely reusable, and required plan/roadmap/runbook/journal/fixes/operator
  documentation.
- Maximum implementation cycles: one live-evidence-backed provider-free
  red/green cycle plus one deterministic correction if adjacent validation
  reveals a regression.
- Critical-path owner: root. Parallel tracks and subagents: none.

## Non-Goals And Hard Stops

- Do not submit a prompt, attach or upload a file, invoke a connector, select a
  composer tool, activate `Add photos & files`, select a library file/result,
  enter Work, change the Chat model/effort, or click `Answer now`.
- Do not install/restart the AuraCall runtime or run a sending/upload canary in
  this plan. Installed proof requires a separately bounded successor.
- Do not pause, resume, trigger, or mutate scheduler, completion, account-
  mirror, live-follow, or materialization controls.
- Stop on CAPTCHA/human verification, identity mismatch, active conflicting
  browser ownership, unknown process ownership, ambiguous selector/drawer
  state, or a UI action whose effect cannot be bounded before interaction.
- Cleanup may close only the exact browser/session launched or attached for
  this inspection; unrelated retained and scheduler-owned browsers are out of
  scope.

## TDD Packet

1. Capture the exact current closed trigger, open tool-selector structure, and
   open attachment-drawer structure without selecting a tool or file source.
2. Add live-shaped provider-free fixtures that fail against the missing
   drawer/selector contract.
3. Implement the smallest provider-owned surface resolver and route attachment
   upload through the exact drawer file-source transition before file-input
   inventory.
4. Run focused attachment/composer-tool tests, adjacent Chat/Work tests,
   typecheck, touched lint, build, diff hygiene, CodeGraph readback, and active
   planning audit.

## Acceptance Criteria

- [x] Exact current DOM evidence distinguishes the tool selector from the file
      attachment drawer without selecting a tool, file source, or file.
- [x] Provider-free fixtures reproduce the current searchable selector and
      attachment drawer through public test seams.
- [x] `--browser-composer-tool` selects only tool rows and rejects file-source
      requests; `--file` verifies the exact current local-file and library
      rows before inventorying only the resulting generic file input.
- [x] Missing or ambiguous current surfaces fail closed with bounded
      diagnostics rather than clicking broad `add`/`file` matches.
- [x] Focused and adjacent tests, typecheck, touched lint, build, diff hygiene,
      CodeGraph readback, and planning audits pass.
- [x] Inspection cleanup completes and no prompt, tool/file selection, upload,
      install/restart, or scheduler/completion/materialization control occurs.

## Closeout

- Exact authenticated Chat workbench inspection found one visible `.popover`
  opened by `#composer-plus-btn`. Its focusable `.__menu-item[tabindex]` rows
  mix `Add photos & files / Upload from computer`, `Add from library / Browse
  and search your files`, first-party tools, and connected apps.
- The provider-library row opens a separate visible `[role="dialog"]` with the
  `Add from library` heading, one searchbox, and Close/List/Grid controls. No
  result, local-file action, chooser, input, upload, prompt, or tool was used.
- The mounted inputs were one unrestricted multi-file `#upload-files` plus
  image-only `#upload-photos` and `#upload-camera`. AuraCall now requires the
  two exact file-source rows and the single unrestricted generic input before
  either local or remote transfer.
- Focused and adjacent validation passed 179 tests with one pre-existing skip;
  typecheck, zero-warning touched lint, production build, diff hygiene,
  CodeGraph readback, and active/goal planning audits passed.
- The exact inspection browser PID/port tree was removed, the target port was
  closed, and the unrelated retained browser process was preserved. Installed
  upload/send proof remains outside this closed provider-free plan.

## Definition Of Done

AuraCall has executable provider-free coverage for ChatGPT's current Chat
workbench tool selector and attachment drawer, the implementation keeps their
semantics separate and fail-closed, repository validation is green, and any
installed upload/send proof remains explicitly outside this plan.
