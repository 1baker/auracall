# ChatGPT Developer App Lifecycle | 0168-2026-07-24

State: CLOSED
Lane: P01

## Goal

Add a guarded Aura-Call operator surface for the authenticated ChatGPT
developer-app lifecycle: inventory, create/connect, refresh, bounded test
invocation, and uninstall/recreate.

## Current State

Plan 0167 repaired installed-app discovery and composer invocation but
explicitly excluded app installation, connection, OAuth, and removal.
Aura-Call can currently report installed/link state and attach an installed app
to a prompt, but it has no first-class lifecycle command.

Live read-only inspection of the SoyLei `wsl-chrome-3` managed browser profile
confirmed that `eric.cochran@soylei.com` has Developer mode enabled and the
development app `Corel33t` installed. The current UX exposes:

- `Create app`, with server URL or tunnel connection and OAuth, no-auth, or
  mixed authentication;
- app `Manage`, `Refresh`, `Try in chat`, and destructive `Uninstall`
  controls;
- connected-app metadata including app/version ids, endpoint, authentication,
  review state, and permission posture.

## Scope

- Add one explicit `apps` CLI namespace for ChatGPT developer apps.
- Inventory developer mode, installed app identity, development status,
  endpoint/auth metadata, permission posture, and available lifecycle actions.
- Create an app from an MCP endpoint with explicit name, connection mode, and
  authentication choice.
- Detect and report OAuth continuation as an explicit human/runtime gate rather
  than silently claiming connection.
- Refresh a uniquely resolved installed development app.
- Reuse the current composer-app selection path for a bounded test; submission
  requires an explicit mutation flag and confirmation.
- Uninstall only an exact app id or an unambiguous exact app name, with an
  explicit confirmation flag.
- Preserve current browser-operation serialization and rate-limit hard stops.
- Update CLI/operator docs, journal, fixes log, roadmap, and runbook.

## Non-Goals

- Do not automate CAPTCHA, MFA, provider credential entry, or OAuth consent.
- Do not change app permissions implicitly.
- Do not uninstall or recreate the active Corel33t app during implementation
  validation.
- Do not publish a developer app to a Business/Enterprise workspace.
- Do not add custom-app support to ChatGPT agent mode.
- Do not relax live-follow or browser-interaction rate limits.

## Architecture

- Keep volatile ChatGPT DOM and app-lifecycle semantics in a dedicated
  provider-specific browser module.
- Keep CLI parsing, exact-target validation, confirmation gates, and formatted
  output in a dedicated CLI module.
- Reuse `BrowserAutomationClient`, the managed browser profile, and the
  file-backed browser-operation dispatcher; do not create a parallel browser
  runtime.
- Reuse installed/link discovery and composer app selection rather than adding
  a second inventory or invocation authority.

## Execution Graph

| Unit | Dependency | Outcome | Write surface | Terminal condition |
| --- | --- | --- | --- | --- |
| W1 | none | plan and live/source contract | plan, roadmap, runbook, journal | acceptance criteria and gates recorded |
| W2 | W1 | provider lifecycle module | `src/browser/providers/` | fixture-backed inventory and action semantics pass |
| W3 | W2 | guarded CLI lifecycle | `src/cli/`, `bin/auracall.ts` | command tests prove exact targeting and confirmation |
| W4 | W2, W3 | docs and validation | docs, tests | focused/type/build/lint/plan audits pass |
| W5 | W4 | installed read-only proof | installed runtime and SoyLei profile | Corel33t inventory/test-selection proof without destructive mutation |

Critical path: W1 -> W2 -> W3 -> W4 -> W5. No parallel agent lane is
opened because the active runtime policy forbids subagents and the current
worktree already has overlapping uncommitted ChatGPT adapter/CLI changes.

## Execution Bounds

- Maximum two implementation attempts per failed invariant.
- One implementation/review cycle plus one bounded remediation cycle.
- Maximum one live read-only inventory and one select-only test proof on
  Corel33t.
- No live create, refresh, OAuth continuation, submitted app action, or
  uninstall without a separately explicit exact-target authorization.
- Stop immediately on a new ChatGPT rate-limit warning, CAPTCHA, human
  verification, or ambiguous account/app identity.
- Checkpoint after provider tests, after CLI tests, and before any installed
  runtime proof.

## Acceptance Criteria

- [x] `auracall apps --target chatgpt list` reports current developer mode and
  exact installed development-app metadata without mutation.
- [x] `apps create` validates endpoint/name/auth input and requires explicit
  confirmation before interacting with the creation form.
- [x] OAuth continuation is returned as a structured gate with the current URL
  and next required operator action.
- [x] `apps refresh` resolves one exact app and requires confirmation.
- [x] `apps test` can perform select-only verification and requires a separate
  confirmed flag before prompt submission.
- [x] `apps uninstall` requires exact app identity plus confirmation and fails
  closed on ambiguity.
- [x] Lifecycle operations use the managed browser-operation dispatcher and
  preserve ChatGPT blocking/rate-limit stops.
- [x] Tests cover inventory normalization, exact/ambiguous resolution,
  confirmation gates, create form mapping, refresh, test selection, OAuth
  gate, uninstall confirmation, and missing controls.
- [x] README/configuration/testing docs explain the lifecycle and human gates.
- [x] TypeScript, focused tests, production build, scoped lint, plan audit, and
  diff checks pass.
- [x] Installed CLI and live SoyLei read-only proof agree that Corel33t remains
  installed, connected, and development-scoped after validation.

## Checkpoint Record

- Plan version: 0168-v1
- State transition: ready -> active
- Progress classification: outcome_progress
- Evidence: live SoyLei DOM plus Plan 0167 installed-app implementation
- Delegation: `not_spawned`; runtime policy forbids subagents and overlapping
  ChatGPT worktree surfaces make independent writes unsafe
- Next action: implement fixture-backed provider lifecycle inventory and exact
  target resolution

## 2026-07-24 Implementation Checkpoint

- Source implementation:
  - dedicated provider adapter plus `auracall apps` CLI namespace;
  - exact account and app identity checks;
  - explicit confirmation for create, refresh, submitted test, and uninstall;
  - structured OAuth `awaiting-human` state;
  - browser dispatcher lease plus current rate-limit/blocking-surface stops.
- Provider-free evidence:
  - 13 focused tests pass across browser normalization/identity and CLI
    lifecycle contracts;
  - create mapping, endpoint validation, exact/ambiguous targeting,
    confirmation, OAuth continuation, refresh, select-only test, submitted-test
    confirmation, and uninstall dispatch are covered;
  - the 49-test shared browser-service UI suite also passes, covering the
    visible-selector and missing-control fail-closed primitives used by the
    lifecycle adapter.
- Validation evidence:
  - `pnpm run check`;
  - `pnpm run build`;
  - scoped `biome lint`;
  - `pnpm run plans:audit` with zero validation errors;
  - `git diff --check`.
- Live source proof:
  - account `eric.cochran@soylei.com`, plan `pro`;
  - Developer mode `true`;
  - Corel33t plugin
    `plugin_asdk_app_6a5d3be168248191b76ed22889b57366`;
  - scope `USER`, discoverability `PRIVATE`, status/enabled
    `ENABLED`/`true`, review state `development`, version `1.0.0`, linked auth
    `ACTIVE`;
  - select-only mention matched the canonical app ID, no prompt was submitted,
    and final CDP readback was empty text plus zero selection pills.
- No destructive proof was run. Corel33t was not refreshed, submitted through,
  uninstalled, or recreated, and no rate-limit warning appeared.
- Packaged/installed proof:
  - the built package tarball shasum was
    `2adcf28e6504ecf80e929edb38a8594698d43ce3`;
  - it first passed from isolated validation prefix
    `~/.auracall/validation-runtimes/plan-0168`;
  - the same build was installed to `~/.auracall/user-runtime` at
    `2026-07-24T20:45:42.043Z` without restarting the API service;
  - the default installed wrapper exposes all lifecycle commands and its live
    `apps list` repeated the exact SoyLei/Corel33t state above.
- Git integration remains a separate repository-hygiene gate: the shared
  worktree still contains predecessor-plan changes and should be reconciled
  before commit/push. That does not affect the installed package or live
  lifecycle proof.

## Definition Of Done

The plan closes when Aura-Call exposes the complete guarded developer-app
lifecycle through one documented CLI namespace, provider-free tests prove each
mutation gate and DOM contract, installed runtime validation passes, and a
read-only SoyLei/Corel33t proof shows no unintended app, permission, OAuth, or
rate-limit state change.
