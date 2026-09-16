# Issue 9 Provider-Free Recovery Receipt

Work item: `ecochran76/auracall#9`
Lane: P08 / Plan 0315
Branch: `fix/issue-9-aggregate-status`
Canonical base: `b35077504ae92972cf22c4957e7c30036c43dbce`
Historical patch: `025453473c5957fb72abb7ed787cb6d1266951e6`

## Result

Recovered only the candidate source/test patch, preserving current-main
artifact-recovery-planner readiness and backlog wiring. Runtime control lists
persisted records once; local claims reuse the snapshot and one local runner
read. Bundle-only directories remain excluded. Status overlaps independent
projections while retaining claim-sweep-before-topology ordering.

Archive availability opens read-only, checks metadata, and reads at most one
byte without loading/hashing payloads. It closes the handle in a finally block,
propagates EISDIR, and preserves EACCES/EPERM/ENODEV/ESTALE/EIO unavailable
evidence. Indexed checksums remain available; ordinary archive reads still
refresh checksums. A bounded probe establishes availability, not full-file
integrity or absence of a later read error.

## Validation

All commands ran in the isolated recovery worktree. Tests used a disposable
`AURACALL_HOME_DIR`; the repository test setup also gives each worker a
disposable default home. No installed-runtime or provider command was invoked
explicitly. Post-test process evidence nevertheless found an unexpected managed
browser; this invalidates a zero-browser-effect claim (see below).

- Initial status selection: 67 passed, 253 skipped across six selected files.
- First full affected run: 325 passed, one failed. The historical HTTP
  identity-keyed hydration fixture reproduced its expected-zero/actual-one
  remaining-artifact failure. Preserve this result as failure evidence.
- Fixture repair: disable unrelated startup resume/reconciliation for the
  status-only test; seed two remote artifacts, hydrate one local artifact,
  assert one remains and the registry's original inventory is unchanged.
  Production inventory arithmetic is unchanged. Three combined hydration cases
  cover optional archive availability preference and legacy batch fallback.
- `pnpm vitest run tests/runtime.store.test.ts tests/runtime.control.test.ts tests/runtime.claims.test.ts tests/runtime.serviceHost.test.ts tests/runtime.archiveService.test.ts tests/http.responsesServer.test.ts --maxWorkers=2`:
  327/327 passed, six files, 24.17 seconds, no skips or retries.
- After stronger HTTP preference/registry assertions,
  `pnpm vitest run tests/http.responsesServer.test.ts --maxWorkers=1`:
  218/218 passed, 24.63 seconds. This is a change-driven rerun after the
  documented fixture repair, not an unexplained retry of the original failure.
- `pnpm run typecheck` passed. `pnpm run build` passed, including both user
  interfaces and vendor/config packaging.
- Scoped source `pnpm exec biome lint` passed with zero warnings. Including
  the three runtime test files exits zero with 13 existing non-null-assertion
  warnings in `tests/runtime.serviceHost.test.ts`; no new warning was added.
- Explicit local CodeGraph initialization and sync succeeded: 926 indexed
  files; status reported up to date.
- Active planning audit passed with seven existing accepted baseline findings;
  goal audit passed. The canonical-main lane audit with the exact recovery
  branch selector passed before publication. The proposed branch-local catalog
  still requires primary-owned publication and checkpoint reconciliation.
- `git diff --check` passed. This is focused/affected provider-free validation,
  not the full repository suite or installed acceptance.

## Delegation And Remaining Gates

The primary reused the `aggregate_status_audit` worker for one bounded
implementation packet; no nested delegation occurred. Current user-authorized
parallelism supersedes the plan's historical no-subagent restriction for this
recovery. The audit recommended Sol/high for economical implementation, but the
parallel thread limit prevented opening another worker. The primary therefore
reused the already-contextualized Astra/high audit worker and retained forge,
integration, runtime, and acceptance authority. The worker owns this validation
receipt; primary reconciliation remains explicit.

The worker may commit locally but may not publish, mutate GitHub, merge,
install, control the scheduler, or invoke browsers/providers. The primary must
publish and verify the branch/checkpoint, inspect the published patch, integrate
through the governed PR flow, and separately refresh runtime guards before
installed acceptance. Historical manual-clear guards do not prove current
guard state. No scheduler pause/resume or install/restart allowance was used.

## Post-Test Browser Isolation Finding

After commit `e14b49d021174b62f52d0d9834c7d3619e6537e4`, a fresh `/proc` cwd
census found Chrome root PID `14066` with this recovery worktree as its cwd.
Its command line names managed browser directory
`/home/ecochran76/.auracall/browser-profiles/wsl-chrome-2/chatgpt`, source browser
profile `Profile 1`, debugging port `45013`, and `about:blank`. `ps` reports
startup at `2026-09-16 09:44:25` local time, PPID `51939`; crashpad processes
`14075`/`14078` and Chrome descendants `14084`/`14118`/`14120` were observed.

This is an isolation failure despite the disposable test home. The exact
launching test and any provider navigation are not established by the process
readback. No attach, inspection through CDP, termination, or cleanup was
performed. The primary was notified immediately. Preserve the worktree while
these processes own it; runtime isolation/cleanup requires primary disposition
before any claim of ASL-R6 zero browser effect or installed acceptance.

Primary cleanup receipt: the primary independently verified the six exact
attributable Chrome/crashpad PIDs, their cwd, managed browser directory, and
port, then sent TERM only to `14066`, `14075`, `14078`, `14084`, `14118`, and
`14120`. The primary reports all exited and a fresh profile-path process scan
matched only its own census command. This worker accepts that delegated cleanup
evidence as reported; it did not repeat the cleanup or launch further tests.
Record the event as a test-induced browser side effect cleaned by the primary,
not as zero browser effect. The historical ASL-R6 invariant remains unproved.

Issue 9 and Plan 0315 remain open until the exact installed source and three
consecutive default status reads under five seconds, narrow endpoint parity,
runtime ownership, and remaining ASL-R6 obligations have current receipts.

Publication receipt: the primary pushed remote branch
`fix/issue-9-aggregate-status` at
`61ca2ef80ff509db93144686e04a9fd952ebca2b` and opened issue-linked PR 17.
After catalog reconciliation, the verified PR head is
`868e9493265ebdf1c6c33a2c3775d8902c4b6d34`. This publication does not
satisfy installed acceptance or close issue 9.
