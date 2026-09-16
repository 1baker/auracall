# Issue 20 policy-target integrity receipt

Work item: `ecochran76/auracall#20` · Lane: P47 · Plan 0354.
Base: `f8c174ba92a5053f97dc31b12397b04e32542e45`.
Source commit: `3fdbbabb611cb03fb8d9b7e91512a86fc702f550`.
Published ref: `refs/remotes/origin/fix/issue-20-policy-target-integrity`.

## Reproduced defect

`AGENTS.md` required `docs/dev/policies/0030-model-selection-and-calibration.md`,
but `docs/dev/policies/` skipped from 0029 to 0031. The installed selector
bundle v0.1.26 contained the module and `check_policy_upgrades.py` reported it
already adopted, so entrypoint text produced a false-green adoption result.

## Repair

- Restored policy 0030 byte-for-byte from the adopted module body after its
  selector metadata header.
- Added a deterministic parser for backtick-delimited
  `docs/dev/policies/*.md` targets in `AGENTS.md`.
- Integrated missing-target errors into the ordinary plan-library audit.
- Added focused tests for deduplication, stable ordering, missing-target
  reporting, and the all-present case.

## Provider-free validation

- `tests/policyEntryAudit.test.ts`: 2/2 passed.
- `pnpm -s plans:audit`: 354 candidates, zero validation errors.
- `pnpm -s typecheck`: passed.
- Scoped Biome lint on the audit and test files: zero findings.
- Goal-only and active-only planning audits: `ok=true`; the seven documented
  active-plan baseline findings remain accepted and unchanged.
- Active-lane catalog-only audit: `ok=true`, no problems.
- Selector upgrade check: installed and current bundle v0.1.26 agree; no
  upgrade, retirement, or newly available module action remains.
- `git diff --check`: passed.

The isolated worktree initially lacked `node_modules`; validation was rerun
with the repository's existing pinned dependency tree through a temporary
worktree-local symlink. No dependency install, runtime install, browser,
provider, or live-system action occurred.
