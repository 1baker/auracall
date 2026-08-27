# AuraCall Control-Plane Reliability And Agent-Browser Authority | 0348-2026-08-25

State: CLOSED
Lane: P01
Plan version: 2

## Goal

Make AuraCall a dependable provider-orchestration layer whose idle API is
cheap, whose foreground responses are never starved by historical scans, and
whose ChatGPT browser work is performed only through agent-browser-owned
profiles, sessions, tabs, and service-tab handles.

## Current State

- Installed ChatGPT Pro execution consumes agent-browser's exact access plan
  and service-tab handle without taking over browser lifecycle authority.
- Status and archive projections are bounded, cached, and coalesced. Installed
  CPU fell from 50.3 percent to 5.78 percent under the real poller, while RSS
  fell from 959,460 KB to about 415,496 KB.
- A live cleanup smoke returned the exact expected output, closed only its
  temporary target, and preserved retained target B19B0776124C411964507FAA316ACD46
  and Chromium PID 3246087.
- The left-first bilateral software-engineering workflow completed all eight
  lobe packets, one bridge transit, both Pro reviews, and final release.
- The executable AuraCall Pro guard passed with score 96, zero blockers, and
  zero required checks.

## Scope

- Make routine status readback bounded and non-mutating.
- Remove redundant run-record reads from list and local-claim projections.
- Add coalesced, explicitly fresh or cached status projection semantics where
  full recomputation remains necessary.
- Keep foreground response dispatch targeted and independent of archive or
  status scans.
- Harden the agent-browser adapter boundary around access plan, exact
  service-tab handle, bounded queued actions, diagnostics, detach, and release.
- Verify the installed user service under the real status poller and retained
  ChatGPT Pro browser.
- Run one bilateral software-engineering packet and the AuraCall Pro guard
  after Codex has assembled adequate evidence.

## Non-Goals

- Do not make AuraCall a browser/profile/process owner.
- Do not rewrite agent-browser routing or retained service state from AuraCall.
- Do not delete historical runs to hide scan cost.
- Do not redesign unrelated account-mirror, console Search, or provider
  features unless current evidence proves they are on the critical path.
- Do not publish, release, push, or clean the dirty branch in this plan.

## Acceptance Criteria

- [x] Repeated default `/status` requests do not parse every historical run.
- [x] Local-claim summaries remain correct and expose freshness/provenance when
      served from a bounded projection.
- [x] Targeted response creation acquires a lease without waiting behind
      status, archive, or recovery scans.
- [x] Installed idle CPU, read volume, and RSS materially fall under the real
      polling workload, with before/after measurements preserved.
- [x] AuraCall consumes an agent-browser broker-selected retained lane and
      never launches, closes, replaces, or rediscovers Chrome independently.
- [x] Original prompt and hemisphere packets reach ChatGPT Pro as inline
      Markdown only after four-lobe Codex adequacy review.
- [x] Focused tests, typecheck, lint, broader affected tests, installed-runtime
      smoke, retained-browser identity proof, CodeGraph sync, and diff hygiene
      pass.
- [x] AuraCall Pro guard returns a sufficient/pass verdict or one concrete
      accepted blocker is recorded.

The final cleanup boundary passes Biome, typecheck, and focused tests.
Repository-wide strict Clippy and broader Biome are qualified by unrelated
pre-existing warnings and whole-file style drift in already-dirty files.

## Definition Of Done

Plan 0348 closes when the installed API is measurably quiet under real polling,
foreground ChatGPT Pro execution remains terminal and prompt-correct, and the
same agent-browser-owned PID, profile, target, and exact conversation remain
authoritative before and after the live proof.

## Execution Boundary

- critical_path_owner: primary agent
- parallel_tracks: none; profiling, design, mutation, install, and live proof
  share one dirty worktree and one retained browser authority
- expected_write_surface: runtime store/control/claims/service-host/status
  projection, focused tests, agent-browser adapter boundary, and governing docs
- validation: profiler and `/proc` measurements, targeted and affected tests,
  installed API status/load smoke, one retained-browser Pro run, bilateral
  packet release, Pro guard, CodeGraph, and diff hygiene
- terminal_condition: all criteria have current evidence, or the plan remains
  open with the exact failed criterion and reproducer
