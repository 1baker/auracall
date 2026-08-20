# Config Model Refactor Plan | 0007-2026-04-14

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Separate browser, AuraCall runtime, agent, and team configuration into explicit
composable layers while preserving compatibility with older config shapes.

## Closed State

- The target public stack is implemented and schema-accepted as:
  `browserProfiles -> runtimeProfiles -> agents -> teams`.
- `runtimeProfiles.<name>.browserProfile` is the explicit runtime-to-browser
  reference. Agent and team selection reuse the same runtime/browser resolver
  rather than reopening browser ownership above that layer.
- Target keys win deterministic dual-read precedence over bridge keys;
  `auracallProfiles` remains a last-resort legacy fallback only.
- Compatibility output remains available through bridge keys
  `browserFamilies`, `profiles`, and `profiles.<name>.browserFamily`.
- Browser-owned launch, source-profile, managed-profile, debug-port, and
  lifecycle settings resolve from the referenced browser profile ahead of
  runtime-profile residue.
- Service-owned settings resolve from service bindings ahead of transitional
  root-browser aliases. Managed-login fields remain explicit escape hatches.
- `config doctor` reports mixed/conflicting shapes, legacy residue, misplaced
  ownership, invalid agent/team references, and inert generic agent defaults.
- `config migrate` performs only conservative, non-conflicting ownership moves,
  prunes empty residue, and supports explicit target or compatibility output.
- Plan 0343 independently mapped the original acceptance bar to current source
  and 98 provider-free assertions. No unresolved base-layer behavior gap was
  found, so this umbrella closes and future work requires its own bounded plan.

## Layer Contract

### Browser profile

Owns browser/account-bearing state:

- executable, platform, display, and WSL behavior
- source profile and cookie/bootstrap paths
- managed profile root and derived managed-profile identity
- debug-port policy
- tab/window cleanup and browser lifecycle defaults

### AuraCall runtime profile

References one browser profile and owns workflow/service defaults:

- preferred service/provider and model behavior
- project/conversation defaults
- cache defaults
- service-specific identities, settings, and live-follow policy

A runtime profile must not redefine browser/account-bearing state except through
documented compatibility or advanced escape-hatch fields.

### Agent

References one runtime profile and may add typed workflow specialization. Its
generic `defaults` bag remains execution-inert; browser/runtime selection stays
anchored on `agents.<name>.runtimeProfile`.

The current live agent contract and any future typed agent-owned defaults remain
governed by [Plan 0009](0009-2026-04-14-agent-config-boundary.md).

### Team

Coordinates agents without absorbing browser, runtime, assignment, durable-run,
or runner ownership. The reusable team boundary is closed under
[Plan 0006](0006-2026-04-14-team-config-boundary.md); concrete assignments and
execution are governed by the closed TaskRunSpec, TeamRun, and service-execution
plans.

## Compatibility Contract

| Concern | Target authority | Compatibility surface |
| --- | --- | --- |
| Browser profiles | `browserProfiles` | `browserFamilies` |
| Runtime profiles | `runtimeProfiles` | `profiles`, then legacy `auracallProfiles` fallback |
| Runtime/browser reference | `browserProfile` | `browserFamily` |
| Default runtime selector | `defaultRuntimeProfile` | `auracallProfile` |
| Root service/project defaults | service bindings | transitional root `browser` aliases |
| Model/project defaults | root/service bindings | `llmDefaults` bridge |

Compatibility surfaces are supported maintenance inputs, not preferred new
authoring locations. A reproduced resolver, migration, or diagnostics mismatch
should open a focused repair; compatibility presence alone does not reopen this
completed architecture umbrella.

## Acceptance Criteria

- [x] Browser-profile selection is explicit and independent.
- [x] AuraCall runtime profiles reference browser profiles instead of
      duplicating browser ownership.
- [x] Existing bridge and legacy configs continue to load and migrate through
      deterministic compatibility rules.
- [x] Managed-browser profile and cache behavior follow the selected
      runtime/browser resolution deterministically.
- [x] Agents and teams reference runtime profiles cleanly without inheriting
      ambiguous browser semantics.
- [x] Target/bridge conflicts and ownership residue are inspectable and
      actionable through diagnostics.
- [x] Focused config-model, migration, resolver, and browser-profile tests,
      typecheck, governance/link checks, plan audit, diff hygiene, and
      CodeGraph status pass.

## Evidence

- `src/schema/types.ts` accepts target and bridge shapes.
- `src/config/model.ts` owns target-first reads, legacy fallback, shared
  runtime/agent/team resolution, projection, inspection, and doctor findings.
- `src/config/migrate.ts` owns target/bridge output and conservative cleanup.
- `src/schema/resolver.ts` applies target-first runtime selection and mirrors
  transitional CLI aliases only where service ownership is unambiguous.
- `src/browser/service/profileResolution.ts` resolves the selected runtime and
  browser profile through the shared config-model seam.
- `tests/configModel.test.ts`, `tests/configMigrate.test.ts`,
  `tests/schema/resolver.test.ts`, and `tests/browser/profileConfig.test.ts`
  pass 98 provider-free assertions.
- [Plan 0343](0343-2026-08-20-config-model-refactor-reconciliation.md) records
  the independent completion audit and terminal verification.

## Historical Decisions Retained

- Broad internal symbol renames were intentionally deferred; semantic ownership
  and public authority were established first.
- Bridge-key loading and compatibility output were retained deliberately rather
  than removed during the refactor.
- Root-browser service aliases and `llmDefaults` remain supported transitional
  inputs, but service bindings are the preferred authoring surface.
- `manualLogin` and `manualLoginProfileDir` remain bounded managed-profile
  escape hatches; inert/default-equivalent residue is diagnosed or removed
  conservatively.
- Generic agent defaults were not made implicitly executable. Typed agent
  behavior must be introduced through Plan 0009 or a successor, not through
  accidental record merging.
- Browser-family implementation refinements remain separately governed by
  [Plan 0008](0008-2026-04-14-browser-profile-family-refactor.md).

## Definition Of Done

Plan 0007 is complete when the four-layer target model is executable,
compatibility precedence and migration are deterministic, ownership drift is
diagnosable, agent/team composition uses the lower-layer resolver, and no
unowned base-layer gap remains. Plan 0343 proved that boundary and closes this
plan without runtime behavior changes.
