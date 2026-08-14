# ChatGPT Composer Apps Reinspection | 0167-2026-07-24

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Reinspect the current authenticated ChatGPT composer and app-management
surfaces, then update Aura-Call so it can discover installed apps and attach a
selected app to a prompt request using the current provider interaction model.

## Current State

- The installed app/composer repair uses the current plus-menu interaction,
  verifies the selected `ecosystemMention` pill, and derives installed truth
  from the authoritative plugin/link surfaces rather than broad body tokens.
- Installed CLI, API, and MCP discovery plus guarded selection proof passed.
- Plan 0169 subsequently repaired the startup/status memory fan-out that was
  this plan's sole remaining operational gate. Its accepted installed closeout
  verified the scheduler and all four ChatGPT completions active,
  provider-serialized, guard-clear, and inside memory thresholds.
- Later live-follow pauses and repairs have their own plans; they do not reopen
  this completed composer/apps scope.

## Scope

- Inventory the current composer controls, menus, dialogs, selected-app
  representation, and deselection path from the authenticated live DOM.
- Inspect the current ChatGPT surface that distinguishes installed/connected
  apps from discoverable marketplace apps.
- Determine how app selection is associated with the next prompt request,
  including visible composer state and bounded request evidence.
- Replace stale `Add files and more -> More` assumptions with the narrowest
  current provider-specific interaction model while retaining compatible
  fallbacks where live evidence supports them.
- Add authoritative installed-app discovery to the existing workbench
  capability report instead of treating broad body-text matches as installed.
- Preserve file upload on the attachment path and keep built-in tools distinct
  from external apps.
- Update CLI/API/MCP/operator documentation for app discovery and invocation.
- Install the repaired runtime and perform a guarded live selection/submission
  proof before restoring routine live follow.

## Non-Goals

- Do not install, connect, authorize, or remove a ChatGPT app.
- Do not invoke a destructive or write-capable action in an external app.
- Do not redesign provider-neutral workbench capability schemas beyond what
  installed-app truth requires.
- Do not automate CAPTCHA, human verification, consent, or OAuth.
- Do not relax account-mirror pacing or rate-limit guards.

## Execution Bounds

- One primary agent owns the critical path. Delegation is `not_spawned`
  because the applicable runtime policy forbids subagents and the composer,
  manifest, and authenticated-browser surfaces share one integration boundary.
- At most two live census attempts per distinct surface before evidence is
  consolidated or the plan is reframed.
- At most one non-destructive prompt submission per app-selection strategy.
- One implementation/review cycle followed by one bounded remediation cycle.
- Pause the scheduler and all four ChatGPT completion loops before live
  composer inspection; restore them only after the guard and service readbacks
  are clean.

## Work Units

1. Baseline current source, manifest, tests, installed runtime, and live
   workbench reports.
2. Pause background ChatGPT provider work and capture the root composer,
   app-selection surface, and installed-app management surface.
3. Write red tests for the observed selection and discovery contracts.
4. Implement the provider-specific interaction/discovery repair and update
   provider-neutral reporting only where required.
5. Run focused and broad validation, install, and perform one guarded live
   proof.
6. Restore routine live follow, audit every criterion, and close the plan.

## Acceptance Criteria

- [x] Live evidence identifies the current composer trigger, app picker/menu
  hierarchy, app rows, and selected-app representation.
- [x] Live evidence identifies an authoritative installed/connected-app
  surface and distinguishes it from marketplace/discoverable apps.
- [x] Live evidence proves how a selected app is attached to the next prompt
  request and how stale selection is removed or replaced.
- [x] Aura-Call can select an installed app using current UI semantics without
  conflating built-in tools, file attachment, or app installation.
- [x] Workbench capability discovery reports installed ChatGPT apps from the
  authoritative surface with source/status metadata; broad token heuristics
  are not presented as installed truth.
- [x] CLI, local API, and MCP readbacks preserve parity for installed-app
  discovery.
- [x] Red/green tests cover current selection, installed discovery,
  uninstalled/not-visible behavior, stale selection, and compatible fallback.
- [x] Focused tests, TypeScript, production build, lint, plan audit, and diff
  checks pass.
- [x] Installed-runtime readback and one guarded non-destructive live proof
  show the selected app attached to a prompt with no new rate-limit warning.
- [x] Scheduler and all four ChatGPT completion loops are restored to healthy
  serialized operation after the proof.

## Execution Evidence

- Current composer: `Chat` and `Work` are segmented modes and
  `#composer-plus-btn` opens the current app/tool popover directly. Visible
  rows vary by current provider state; a row requiring `Connect` is not
  selectable.
- Selected representation: a successful source-built Google Drive selection
  produced an inline `data-inline-selection-pill` with
  `data-symbol="ecosystemMention"` and matching
  `plugin:connector_...` identifier. Reloading the blank composer cleared the
  unsent selection.
- Prompt association: one bounded benign GitHub prompt showed the same
  `plugin:connector_...` identifier in `metadata.system_hints` and an
  `ecosystemMention` entry in
  `serialization_metadata.custom_symbol_offsets`; top-level `plugin_ids` was
  null.
- Installed authority: `/backend-api/ps/plugins/installed` returned 15
  installed apps. `/backend-api/aip/connectors/links/list_accessible`
  separately exposed active, authentication-required, and
  reauthentication-required link states. The broad accessible connector
  catalog was rejected as installed truth.
- Validation: TypeScript, production build, `145/145` focused app tests,
  `79/79` focused runtime tests, and `9/9`
  CLI/HTTP/MCP capability parity tests passed. Scoped Biome lint reports no
  errors; only pre-existing warning-level diagnostics remain.
- Installed inventory: the installed CLI reported 17 app capability rows:
  15 installed apps plus the static app surface and one visible connect-only
  composer row. It classified 14 rows available, three account-gated, and none
  unknown or blocked.
- Installed selection: the installed runtime selected GitHub from a blank
  composer. The resulting `ecosystemMention` pill carried
  `plugin:connector_76869538009648d5b282a4bb21c3d157` in both `data-id` and
  `data-system-hint-type`; reloading restored a blank composer and removed the
  unsent pill. No prompt was submitted in this final selection check and no
  rate-limit detection was added.
- API memory repair: runtime-run startup/background recovery now requests only
  planned/running candidates, and stored-run listing reads records with bounded
  concurrency instead of one unbounded `Promise.all`. The installed service
  also has `NODE_OPTIONS=--max-old-space-size=1536`.

## Historical Operational Gate

The app-composer repair, installed-runtime deployment, installed inventory, and
installed selection proof are complete. The API is active on port `18095` with
the 1.5 GiB V8 heap guard and all four completions paused.

Routine live-follow restoration is still blocked. Resuming four persisted
completion operations together caused an initial V8 OOM under the former
768 MiB heap ceiling. After raising that ceiling, the same all-operation
restore drove the Node process to roughly 5.4 GiB RSS and the service cgroup to
roughly 6.3 GiB. Provider FIFO still selected only `wsl-chrome-2` for physical
browser work. The only guard-file change cleared stale bookkeeping and kept
`recentRateLimitDetectionAts` empty, so this was not a provider warning.

A single-profile `wsl-chrome-2` forced-pass observation stayed below the 3 GiB
stop threshold, peaked near 2.2 GiB, returned near 1.5 GiB, and produced no
rate-limit detection. It was paused at the two-minute diagnostic boundary
before completing the long collector pass. Do not restore all persisted
live-follow operations until startup/resume memory fan-out is repaired and
revalidated.

This gate was later fulfilled by closed Plan 0169. Its installed closeout
recorded all four ChatGPT completions and the scheduler active and guard-clear,
multiple FIFO handoffs and pass/backlog progress, service memory below the
accepted threshold, and more than 32 GiB host memory available.

## Stop Conditions

- Pause all ChatGPT work immediately on a new rate-limit observation.
- Stop browser probing on CAPTCHA, human verification, OAuth, consent, or an
  app install/connect requirement.
- Do not submit a prompt if the selected app, target account, or external
  action scope is ambiguous.
- Do not claim installed-app discovery from page-wide token matches.
- Stop and reconcile rather than overwrite overlapping predecessor work in the
  existing dirty worktree.

## Definition Of Done

The plan closes when current live DOM/request evidence explains ChatGPT's app
selection and installed-app surfaces, Aura-Call implements those semantics
through its existing composer/workbench architecture, installed CLI/API/MCP
readbacks agree, a guarded live proof succeeds, and routine serialized live
follow is restored.

## Closeout Reconciliation

- state_transition: OPEN -> CLOSED
- progress_classification: semantic_reconciliation
- evidence: all composer/apps criteria were already accepted in this plan;
  closed Plan 0169 supplies the missing installed scheduler/four-completion
  restoration evidence with FIFO serialization, guard-clear status, forward
  progress, and bounded memory.
- material_blockers: none
- next_action_or_stop_reason: close the stale predecessor state; later
  live-follow incidents remain owned by their later plans.
