# Issue 5 Mixed-Branch Commit Disposition

Source branch: `fix/chatgpt-developer-mode-refresh-reread`

Published checkpoint: `0531931410a1f362f1138cd5b66758b51d6347db`

Latest reconciliation comparison: `origin/main` at
`4982466cc62e29cba600d3ff7c65374fdb9bed89` on 2026-09-22

This ledger is a routing artifact, not implementation or integration proof.
The source worktree was retired on 2026-09-22 after its apparent owners were
classified as the active Codex/tooling stack rather than an independent
workload. Equal local and remote branch refs remain retained.

| Commit | Subject | Disposition |
| --- | --- | --- |
| `025453473` | fix: reduce aggregate status latency | Recovered from current `main` under issue 9 and merged through PR 17; installed five-second acceptance remains separately owned by issue 9. |
| `249ba6d2a` | docs: record aggregate status adoption blocker | Issue 9 historical evidence; reconcile stale runtime claims before reuse. |
| `063236c86` | chore: roll out agent policies v0.1.21 | Issue 5 historical policy rollout; do not cherry-pick wholesale. Current canonical policy wins. |
| `d461cb565` | chore: roll out agent policies v0.1.22 | Issue 5 historical policy rollout; do not cherry-pick wholesale. Current canonical policy wins. |
| `35c614aea` | Merge origin/main into aggregate-status lane | Preserve as topology only; never cherry-pick. |
| `79b1d2dde` | docs(plan0315): refresh provider-guard blocker | Issue 9 historical evidence; replace process/runtime assertions with fresh readback. |
| `18ce58652` | Merge Plan 0324 fairness into Plan 0315 | Preserve as topology only; P18 remains separately owned by issue 10. |
| `2a1cd3e15` | docs: record remaining browser edit review findings | Split references between issues 6, 7, and 9; do not replay as one mixed document change. |
| `9860b9d49` | chore: roll out agent policies v0.1.24 | Issue 5 historical policy rollout; selectively compare only if a current policy test proves a gap. |
| `3b59cd2c2` | fix(chatgpt): confirm developer mode before refresh | Compared and dispositioned under issue 6; current source recovery merged through PR 21 without replaying this historical commit wholesale. |
| `8ab34fa79` | docs: record installed developer mode guard repair | Issue 6 evidence; installed claims require current artifact/readback proof. |
| `ecda2cea6` | fix(chatgpt): bound developer app mutations | Compared and dispositioned under issue 6; current shared-lifecycle recovery merged through PR 21, while installed/live proof remains separate. |
| `f95cfddd3` | docs(chatgpt): record installed deadline repair | Issue 6 evidence; do not infer current installed parity. |
| `772fa72d5` | docs(chatgpt): record reconciled LitScout replacement | Issue 6 evidence; preserve the no-retry/provider-effect boundary. |
| `11b4698c1` | docs(chatgpt): record 6 Pro pre-send stop | Shared evidence for issues 6 and 7; no direct replay until each child owns its relevant claims. |
| `933bed25e` | fix(chatgpt): preserve current model for app tests | Dispositioned by issue 6's current-main recovery and PR 21; no direct replay. |
| `619c1b2c8` | fix(chatgpt): recognize ecosystem app selections | Dispositioned by issue 6's exact app-identity coverage and PR 21; no direct replay. |
| `7f19f2785` | fix(chatgpt): preserve searched app mention | Dispositioned by issue 6's exact mention revalidation and PR 21; no direct replay. |
| `39fb9a418` | docs(chatgpt): record product recovery outcome | Split evidence between issues 6 and 7; do not replay mixed acceptance claims. |
| `44ea69b4d` | docs(chatgpt): hand off deep research recovery defects | Issue 7 governing historical evidence; current source/tests must establish each defect before repair. |
| `3f36deb6e` | chore: roll out agent policies v0.1.26 | Issue 5 selective comparison only; broad transplant was rejected because current embedded policy code evolved independently. |
| `9f28208b5` | chore(policy): govern GitHub issue operations | Superseded by the adapted canonical policy integration through PR 12. |
| `08211b537` | chore(policy): normalize policy file endings | Patch-equivalent to canonical PR 12; no replay. |
| `053193141` | chore(github): configure governed issue operations | Patch-equivalent to canonical PR 12; no replay. |

## Retirement Gate

The operator approved deletion of the equal local and remote source refs on
2026-09-22 after confirming that this ledger is the durable disposition record
and that issues 7 and 10 are independent work items, not branch-custody gates.

As of 2026-09-22, issues 6 and 9 have source-integration receipts, while their
remaining installed/live gates stay issue-owned. Issues 7 and 10 remain open.
The worktree-retirement gate is complete, and retained-ref deletion is approved
after the final closeout reaches canonical main.
