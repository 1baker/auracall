# Greenfield Console Search Workbench | 0347-2026-08-20

State: OPEN
Lane: P01
Plan version: 1

## Goal

Build the durable Search and archive workflow in `ux/console` so operators can
discover cached conversations, runs, artifacts, uploads, and evidence without
returning to the frozen `/dashboard` product surface.

## Current State

Implemented foundation:

- `/v1/search` returns normalized, cursor-paged account-mirror and run-archive
  rows with facets, metrics, materialization state, and stable links.
- Archive item, asset, lookup, materialization, run, response, batch, and
  provider-conversation routes already support inspection and handoff.
- The legacy `/dashboard?nav=search` proves useful patterns including bounded
  virtualization, known-value facets, persisted table preferences/local views,
  URL-selected rows, asset previews, and run/evidence inspectors.
- `ux/console` is the product authority and already owns Agents,
  Providers/Projects, Overview/Health, Runs, and Handoffs workflows.

Remaining:

- `/console` has no Search route or workbench.
- Search behavior must be implemented in the console's product language and
  component structure without inheriting the legacy app as its code baseline.
- Fresh desktop and narrow-width visual acceptance is required for the new
  route; the current environment needs an executable Chromium path or another
  repo-approved browser-render route.

## Scope

### Slice 1 | Read-Only Product Search

- Add `Search` to `/console` navigation and route state at
  `?view=search&row=<base64url-row-id>`.
- Consume `/v1/search` through a narrow console API/client boundary.
- Default to newest-first all-tenant results without form submission.
- Render a dense, bounded/virtualized table with stable row heights and
  keyboard selection.
- Provide known-value provider, tenant, kind, status, project, and asset facets.
- Preserve query, facets, sort, and selected row in URL/local state where
  appropriate.
- Drive a product-language inspector with transcript/summary, artifact/file,
  run lineage, evidence, and stable route links before raw JSON.
- Keep the first slice read-only: inspect, copy link, open provider route, and
  download an already-cached asset only.

### Slice 2 | Operator Preferences And Freshness

- Persist column widths/order/visibility and local named views.
- Append cursor pages without unbounded DOM growth.
- Refresh rows without stealing focus or scroll position; expose queued new
  results when interaction makes immediate reorder unsafe.
- Surface freshness/materialization state without launching recovery work.

### Slice 3 | Explicit Queue Controls

- Add materialization or reconciliation controls only through separately
  validated queued APIs with explicit state gates, confirmation, status
  readback, and cancellation semantics.
- Keep provider browser effects out of the initial product Search slice.

## Non-Goals

- Do not extend, embed, or component-copy `ux/operator`.
- Do not retire or redirect `/dashboard` in this plan.
- Do not implement semantic/vector ranking before backend authority exists.
- Do not create shared saved views before ownership, tenant visibility, and
  export/import semantics are defined.
- Do not add broad job launch, retry, or provider-browser controls to Search.
- Do not expose local paths, raw payloads, or technical ids as primary content.

## Acceptance Criteria

- [ ] `/console?view=search` loads newest-first unified results without a form
      submission or browser-entered bearer secret.
- [ ] Cursor paging and virtualization keep DOM and request sizes bounded.
- [ ] Known-value facets cannot silently submit unsupported strings.
- [ ] Selecting a row updates the URL and product inspector without leaving or
      resetting the table.
- [ ] Direct URLs restore query/facets/sort/selection state where applicable.
- [ ] Keyboard navigation, accessible labels/focus, reduced motion, stable row
      layout, empty/loading/error states, and raw-detail disclosure pass.
- [ ] Fresh desktop and 375-390px render checks show no page-level overflow or
      hidden primary actions and no browser-console errors.
- [ ] The initial workbench performs no provider-browser work and no job
      mutation.
- [ ] `pnpm run console:build`, focused source/API/route tests, typecheck, lint,
      build integration, plan audit, diff hygiene, and CodeGraph pass.

## Definition Of Done

Plan 0347 closes when Search is a product-grade `/console` workflow with
bounded unified readback, restorable selection/filter state, human-first
inspection, fresh visual/accessibility evidence, and any mutation controls
split behind independently proven state gates.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none until the first read-only contract and component seams
  are established
- expected_write_surface: `ux/console`, focused console helpers/tests, narrow
  HTTP/search client tests, and governing docs
- validation: console build, search projection/API/route tests, provider-free
  browser render at desktop/mobile widths, typecheck, lint, integration build,
  plan audit, diff hygiene, and CodeGraph
- terminal_condition: all criteria pass with current render evidence, or the
  plan remains open with the exact missing behavior/gate
