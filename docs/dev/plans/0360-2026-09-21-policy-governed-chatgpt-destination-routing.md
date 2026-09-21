# Plan 0360 | Policy-governed ChatGPT destination routing

State: CLOSED
Lane: P01
Date: 2026-09-21

## Current State

AuraCall can already submit to an explicitly supplied ChatGPT conversation URL
or start a fresh conversation in an explicitly supplied project. Configured
agents can bind a runtime profile and project, but the stored-step executor
does not expose one typed choice between an existing conversation, a new
project conversation, and a normal unprojected conversation.

## Scope

Add a small, typed destination resolver at the configured-executor boundary.
It accepts policy-selected agent configuration and explicit request hints. It
does not inspect, classify, rewrite, store, or log prompt text. Agent Browser
continues to own retained-browser selection, lifecycle, and exact target
verification.

## Non-goals

- Prompt classification or prompt rewriting by AuraCall or ModelLabs.
- Browser tab-title/history heuristics.
- Browser launch, replacement, or lifecycle changes.
- Live provider submission, account changes, or runtime installation.

## Acceptance Criteria

- Explicit `normal_new` clears inherited project/conversation routing and
  targets a normal ChatGPT start page.
- Explicit `new_project_conversation` requires one exact ChatGPT project id
  and continues to use the existing fresh-project verification path.
- Explicit `existing_conversation` requires one exact conversation URL.
- A configured agent may declare one of those destination modes; malformed or
  conflicting inputs fail before browser acquisition.
- Legacy URL/project behavior remains unchanged when no destination mode is
  specified.
- Focused schema/executor tests, typecheck, build, plan audit, and diff hygiene
  pass. Live browser proof remains a separate gate.

## Execution Receipt C01

- state_transition: ready -> active
- acceptance_state: resolver and test coverage absent
- progress_classification: outcome_progress
- evidence: current executor only accepts request-scoped URL/new-project hints
  and otherwise inherits profile project routing.
- material_blockers: none
- next_action_or_stop_reason: implement the typed resolver without widening
  retained-browser authority.

## Execution Receipt C02

- state_transition: active -> complete
- acceptance_state: source and user-runtime installation verified; live browser
  submission remains intentionally outside this slice.
- progress_classification: verified_completion
- implementation: `chatgptDestination` is now a typed request/agent setting
  with explicit `normal_new`, `new_project_conversation`, and
  `existing_conversation` modes. The resolver consumes no prompt text. Explicit
  normal/new and existing routes clear inherited project bindings; legacy URL
  and project behavior is retained unchanged.
- verification: 62 focused tests across four suites, TypeScript no-emit check,
  production build, CodeGraph sync/current status, diff hygiene, and an
  installed-runtime import of the resolver passed. Three reviewed local agents
  resolve to Proposals, SABER, and normal ChatGPT routes respectively.
- material_blockers: repository plan audit retains three pre-existing findings
  in an unrelated HTTP route and Plan 0357; this plan added none.
- next_action_or_stop_reason: configure reviewed Proposal/SABER agent bindings
  with exact project ids, then perform one separately authorized retained-browser
  routing matrix smoke after source installation.
