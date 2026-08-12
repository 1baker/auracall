# ChatGPT Chat/Work Docs And Skill Update | 0272-2026-08-11

State: OPEN
Lane: P01
Plan version: 1
Gate state: DOCS_SKILL_UPDATE_IN_PROGRESS

## Current State

Plans 0270 and 0271 established and installed the ChatGPT composer-mode
boundary: Chat is the default, Work is explicit, and Work model selection uses
its own nested selector. The README and WSL runbook describe the CLI flags, but
the repo has no reusable skill for future ChatGPT browser-mode work and the
manual validation guide does not test the boundary directly.

## Stable Objective

Make the verified Chat/Work contract durable in one focused repo-local skill
and the operator documentation that owns provider-free and manual browser
validation, then leave `main` clean, committed, and synchronized with origin.

## Authority And Bounds

- Authorized: one repo-local skill, its generated interface metadata, operator
  docs, plan/journal/fixes/runbook records, validation, structured commits, and
  push.
- The skill may reference current source paths, provider-free tests, CLI flags,
  and the two verified ChatGPT mode-control variants.
- Maximum implementation cycles: two docs/skill edit-and-validation cycles.
- One closed-world review pass is limited to the changed docs and skill files.
- No source-code behavior change is authorized unless validation disproves the
  documented contract; that would require a successor implementation plan.

## Non-Goals And Hard Stops

- Do not launch, attach, inspect, navigate, or mutate a browser.
- Do not install the user runtime, restart services, submit a provider prompt,
  or run a live canary.
- Do not pause, resume, or otherwise mutate scheduler, completion, or
  materialization controls.
- Do not merge Chat and Work model-selection guidance or imply that the Chat
  picker can select a Work model.

## Acceptance Criteria

- [ ] A discoverable repo-local skill tells agents when and how to preserve the
      Chat/Work boundary, including provider-free validation and live-effect
      gates.
- [ ] Skill interface metadata matches its trigger and default prompt, and the
      skill passes the deterministic skill validator.
- [ ] User/operator docs provide runnable Chat-default and explicit-Work
      examples plus a direct manual regression check for selector separation.
- [ ] Documentation matches the current implementation and links resolve.
- [ ] Planning audits, docs inventory, diff hygiene, and closed-world review
      pass.
- [ ] Journal, fixes log, runbook, commits, and origin agree with the outcome.

## Definition Of Done

Another agent can select the repo-local skill and correctly distinguish Chat
from Work without relying on prior conversation history. The durable docs and
skill validate, Plan 0272 is closed, and `main` is clean and synchronized.
