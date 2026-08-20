# React Operator UX Redesign

State: CANCELLED
Date: 2026-05-16
Lane: P01
Plan version: 2

## Original Goal

Replace the inline diagnostic dashboard with a separately built React/Vite
operator shell, then grow health, runs, chats, search, archive, configuration,
and controlled workflow pages on that product surface.

## Terminal State

- The original `ux/operator` app builds into `dist/operator-ux` and is served
  at `/dashboard`; `/ops/browser` remains the lower-level debug dashboard.
- The shell delivered top navigation, context menu, collapsible/resizable
  panes, local layout persistence, a central viewport, and an inspector.
- Health, Runs, Chats, and Search gained substantial API-backed readback.
- `/v1/search` now provides normalized cursor pages, facets, archive/account-
  mirror rows, materialization state, and stable links. The legacy Search UI
  added virtualization, persisted columns/sort/views, row actions, artifact
  previews, run/evidence panels, and narrow-layout behavior.
- The product direction later rejected this frontend as the durable baseline.
  Plans 0077-0080 established the separate `ux/console` app at `/console` and
  closed the first greenfield Agents, Providers/Projects, Overview/Health, and
  Runs milestones.
- Continuing Plan 0067 would extend the frozen legacy app and contradict the
  explicit greenfield boundary. The plan is cancelled as superseded rather
  than called complete.
- [Plan 0346](0346-2026-08-20-operator-ux-authority-reconciliation.md)
  records the authority audit. [Plan 0347](0347-2026-08-20-greenfield-console-search-workbench.md)
  owns the still-required product Search/archive workflow on `/console`.

## Preserved Contracts

- `/dashboard` remains a supported legacy/operator compatibility surface until
  an explicit cutover plan retires or redirects it.
- `/ops/browser` remains diagnostic rather than product UX.
- `ux/operator` and its Search behavior may provide API and usability evidence,
  but must not become the component/layout base for new product pages.
- Stable backend contracts, especially `/v1/search`, archive routes, asset
  routes, and same-origin operator authorization, may be reused by `/console`.
- Existing narrow operational fixes may still land on legacy pages when needed;
  new product workflows belong in `ux/console`.

## Superseded Work

- Semantic/vector ranking belongs to the searchable archive/backend lane before
  the console exposes it as a ranking mode.
- Shared/server-backed saved views require explicit ownership and visibility
  semantics in a separate API plan.
- API Access, Diagnostics consolidation, and release-quality gates remain
  independent product milestones rather than appendices to this legacy plan.
- Live evidence-row dogfooding remains a validation input for the greenfield
  Search workbench when representative cache evidence is available.

## Historical Acceptance Disposition

- The independent React/Vite build, shell, `/dashboard` serving path,
  `/ops/browser` preservation, status/recovery reads, Search API access, and
  local layout persistence shipped.
- The plan later accumulated continuing Search and product-workflow criteria
  after the frontend was frozen. Those criteria are not declared complete here.
- A current provider-free build and 14 focused route/search/session assertions
  pass. The current headless visual smoke could not launch because no Linux
  Chromium executable is installed; the available Windows Chrome executable
  cannot be launched by Puppeteer from this WSL process.
- Because product authority moved to `/console` and current visual proof is
  incomplete, `CANCELLED` is the truthful terminal state.

## Definition Of Done

Plan 0067 terminates when the shipped legacy contracts are preserved, the
frozen product boundary is explicit, the plan leaves active indexes, and every
still-required product outcome has a current owner. Plans 0346 and 0347 satisfy
that handoff without extending the legacy frontend.
