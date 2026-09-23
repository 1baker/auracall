# Mixed Historical Branch Decomposition | 0353-2026-09-16

State: CLOSED
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
- After the 2026-09-22 remote refresh, the branch is 246 commits behind
  canonical `main` and retains 24 commits not
  reachable from `main`, including two historical merge commits.
- On 2026-09-22, fresh classification showed the only cwd owners were the
  active Codex/tooling stack rather than an independent product or development
  workload. The redundant clean `main` integration worktree was removed, and
  the primary repository path was switched to canonical `main`.
- Equal local and remote refs for the mixed branch were retained temporarily at
  the exact checkpoint after worktree retirement. On 2026-09-22, the operator
  explicitly approved their final deletion after confirming that issues 7 and
  10 are independent work items rather than custody dependencies.
- Patch comparison shows the final two GitHub-policy commits are already
  equivalent to canonical work integrated through PR 12. The remaining commits
  require issue-scoped recovery or explicit historical disposition.
- Issue 9's provider-free source recovery merged through PR 17, and issue 6's
  provider-free shared-lifecycle recovery merged through PR 21. Their installed
  and live acceptance gates remain owned by those issues rather than P46.
- Issue 7 and issue 10 remain open and retain their separately gated product
  and live-effect outcomes.
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
- Do not rebase, force-push, delete, or directly integrate the retained mixed
  refs while their remaining child outcomes are open.
- Do not treat patch equivalence as installed or provider acceptance.
- Do not combine recovery for issues 6, 7, and 9 into one implementation lane.
- Do not run a browser/provider canary from this decomposition plan.

## Acceptance Criteria

- every one of the 24 unique commits has an issue or explicit non-cherry-pick
  disposition;
- all recovered code moves through fresh branches from canonical `main`;
- patch-equivalent or superseded policy commits are not replayed;
- historical merge commits remain provenance only;
- the mixed worktree is retired using fresh cleanliness, remote, ignored-file,
  and process classification gates;
- final retained-ref cleanup waits until every child issue records integration,
  supersession, or an explicit drop.

## Closeout

All 24 unique commits have durable dispositions, no mixed-branch PR was opened,
and the worktree is retired. Delete the equal local and remote mixed refs after
this closeout merges to canonical main. Issues 6, 7, 9, and 10 remain the sole
authorities for their own remaining acceptance outcomes.
