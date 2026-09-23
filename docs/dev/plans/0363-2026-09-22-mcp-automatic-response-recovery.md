# Plan 0363 | MCP automatic response recovery

State: CLOSED
Lane: P01
Date: 2026-09-22

## Current State

AuraCall already provides a strict observation-only recovery operation for a
new ChatGPT project response whose prompt may have been submitted before a
browser transport loss. The Pro-guard helper invokes it automatically, but the
general MCP `run_status` tool returns only the original failed status. Codex can
therefore miss a completed Pro answer until a separate manual recovery call is
made.

## Scope

- Detect only the typed, non-retryable after-submit new-project failure.
- Invoke AuraCall's existing strict recovery observer from MCP status polling.
- Return the recovered answer and `completed_recovered` effective status while
  preserving the original failed audit record.
- Preserve the observer's exact prompt, project, account, process, target,
  message-identity, digest, idle-runtime, and no-replay checks.

## Non-goals

- Retrying or resubmitting a prompt.
- Reclassifying the immutable original run as successful.
- Recovering ordinary provider, configuration, or pre-submit failures.
- Launching, replacing, or closing the retained browser.

## Acceptance Criteria

- Eligible MCP polling returns the recovered assistant text automatically.
- The result proves no prompt was submitted and the original run was not
  modified.
- Ineligible or unverified recovery remains a normal failed status.
- Focused MCP and recovery tests, TypeScript checking, strict lint, production
  build, installed-runtime parity, and a fresh nonce-bound browser run pass.

## Execution Receipt C01

- state_transition: ready -> active
- progress_classification: implementation_verified_locally
- evidence: focused MCP and recovery suites pass 57 tests; TypeScript checking,
  strict lint for changed files, and diff hygiene pass.
- material_blockers: installed-runtime publication and fresh live proof remain.
- next_action_or_stop_reason: build, publish without replacing the retained
  browser, and verify one fresh browser-backed response returns to Codex.

## Execution Receipt C02

- state_transition: active -> closed
- progress_classification: verified_completion
- evidence: the production build and installed runtime contain matching MCP
  recovery code. The exact installed handler recovered the original SABER
  response as `completed_recovered`, returned it as a non-error result, and
  produced the same answer digest as the strict browser observation.
- no_replay_proof: `prompt_submitted` is false and `original_run_modified` is
  false; the original durable status remains failed for auditability.
- retained_browser: Chrome PID 2696783 and its original start time survived
  build, publication, API restart, two Pro reviews, and recovery observation.
- verification: 57 focused recovery/MCP tests, all 82 MCP tests, TypeScript,
  strict changed-file lint, diff hygiene, and production build passed. The
  broad suite passed 3493 tests with 55 skipped and retained three unrelated
  failures: two existing route-manifest policy checks and one asynchronous CLI
  timing case.
- material_blockers: none for automatic MCP response recovery.
- next_action_or_stop_reason: stop; future MCP polling now performs the same
  bounded no-replay recovery automatically for this typed failure class.
