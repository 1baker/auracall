# Three-Topic Agent Browser End-to-End Proof | 0353-2026-08-31

State: CLOSED
Lane: P01

## Objective

Repair the reproduced Agent Browser broker handoff failure, then prove the
prompt-to-ChatGPT workflow three times with materially different topics and
release an accuracy-graded DOCX/PDF evidence report.

## Current State

- Two live attempts failed before prompt submission because AuraCall performed
  a single immediate inventory read after `tab_new`; the returned target had
  not yet converged into the authoritative Agent Browser inventory.
- The outer Codex Research evaluator mislabeled that deterministic broker
  failure as `identity-unverified` because the error contained the generic word
  `verification`.
- The retained Agent Browser process, profile, and unrelated tabs remain
  preserved. No provider challenge, credential, or identity gate was observed.

## Scope

- Add a bounded inventory-convergence wait for the exact returned handle.
- Preserve fail-closed URL, profile, host, browser, session, and target checks.
- Release only a task-created tab when post-acquisition verification fails.
- Classify broker consistency failures as internal and non-human.
- Install and verify source/runtime parity without replacing the retained
  browser lane.
- Complete three live prompts on substantially different topics, validate each
  result against reviewed evidence, and create matching DOCX/PDF proof.
- Run an independent ChatGPT Pro relevance and accuracy grade before release.

## Non-goals

- Do not bypass Cloudflare, CAPTCHA, login, MFA, or other human gates.
- Do not weaken exact target or browser-host authority.
- Do not submit unreviewed material or bypass Graphiti digest approval.
- Do not close or replace unrelated retained tabs or browser processes.

## Acceptance Criteria

- [x] Delayed exact-handle inventory convergence is covered by a provider-free
      regression.
- [x] A nonconverging task-created handle is released exactly once and never
      attached.
- [x] Broker consistency failures are classified `requires_human=false` while
      provider challenges remain human-gated.
- [x] Source checks, focused tests, lint, build, plan audit, and installed
      runtime parity pass.
- [x] Three live end-to-end runs complete on materially different topics with
      distinct response IDs and verified output.
- [x] Accuracy/relevance evidence is recorded against reviewed sources.
- [x] Matching DOCX and PDF reports are materialized, structurally verified,
      digest-bound, independently graded, and published together for review.

## Definition Of Done

The plan closes only when all three distinct live runs reach durable terminal
success through the retained Agent Browser lane, the report accurately binds
their evidence, and the independent final grade passes without a blocking
finding.

## Closure Evidence

- Fifty-four focused TypeScript assertions, the full check, zero-warning
  source/test lint, production build, zero-error plan audit, CodeGraph sync,
  and two Python evaluator regressions passed.
- The built and installed bridge share SHA-256
  `6db0312f8b45e5a7fa442bd7a61d0ef42c44cf212bc3703c28384a7b6a10126e`;
  the restarted API is healthy.
- Polymer response `resp_a36db7ce53ac44de9259d619c52a5e56`, astronomy
  response `resp_17f9529d33724ee0baa2c6f7909c57f9`, and graph response
  `resp_989b641f2f984fbf950c16f67d5f27da` completed with distinct tokens,
  correct deterministic results, released leases, and no surviving task tab.
- Bilateral thought `agent-browser-e2e-0353-20260831` completed both ordered Pro
  passes with one bridge transit. Browser response
  `resp_cbd3e56d3d084102a4ed95ec390823ef` materialized a 2,418-word DOCX and
  seven-page PDF with 0.9872 token overlap.
- Independent audit `resp_a6b9dc7977244495ae520b6c1ec6ba57` passed every
  relevance and accuracy gate with no unsupported claims, omissions, or
  blockers. Codex then verified extracted content, rendered pages 1, 4, and 7,
  structure, page substance, and exact artifact digests before release.
