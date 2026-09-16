# Mixed Historical Branch Decomposition | 0353-2026-09-16

State: OPEN
Lane: P46
Branch: fix/chatgpt-developer-mode-refresh-reread
Target: main
Integration: decompose-no-direct-merge
Work item: ecochran76/auracall#5

## Stable Objective

Recover or explicitly retire every commit unique to the occupied mixed branch
without proposing that branch as a pull request or rewriting its published
history.

## Current State

- The local branch equals its remote at `0531931410a1f362f1138cd5b66758b51d6347db`.
- The branch is 216 commits behind canonical `main` and retains 24 commits not
  reachable from `main`, including two historical merge commits.
- Its worktree is clean but actively owned by multiple processes, so it must
  not be removed, renamed, switched, rebased, or otherwise repurposed.
- Patch comparison shows the final two GitHub-policy commits are already
  equivalent to canonical work integrated through PR 12. The remaining commits
  require issue-scoped recovery or explicit historical disposition.
- The exact commit ledger is
  `docs/dev/notes/2026-09-16-issue-5-mixed-branch-disposition.md`.

## Child Outcomes

- issue 9 owns the aggregate-status implementation and its historical adoption
  blockers;
- issue 6 owns current developer-app submission and terminal-response work;
- issue 7 owns Deep Research submission, provenance, reconciliation, and exit
  defects;
- issue 5 owns policy-history disposition, merge-topology preservation, branch
  retirement, and final custody reconciliation.

## Hard Stops

- Do not merge or open a pull request from the mixed branch.
- Do not rebase, force-push, switch, remove, or clean its process-owned
  worktree.
- Do not treat patch equivalence as installed or provider acceptance.
- Do not combine recovery for issues 6, 7, and 9 into one implementation lane.
- Do not run a browser/provider canary from this decomposition plan.

## Acceptance Criteria

- every one of the 24 unique commits has an issue or explicit non-cherry-pick
  disposition;
- all recovered code moves through fresh branches from canonical `main`;
- patch-equivalent or superseded policy commits are not replayed;
- historical merge commits remain provenance only;
- the mixed worktree is retired only after its process owners release it and
  every child issue records integration, supersession, or an explicit drop;
- final branch/worktree cleanup uses fresh cleanliness, remote, ancestry or
  replay-receipt, ignored-file, and process-cwd gates.

## Next Action

Issue 9 should recover the aggregate-status slice first because its earliest
commits establish the branch base. Issues 6 and 7 can then recover only their
owned ChatGPT surfaces from fresh current-main branches.
