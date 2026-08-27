# AuraCall reliability proof

## Outcome

AuraCall remains the request-orchestration and persistence layer. Agent-browser
is the sole authority for browser profile selection, reuse or launch, leases,
processes, tabs, and CDP attachment. The dual-hemisphere workflow is a software
architecture metaphor for agentic engineering, not a biological claim.

## Repaired defects

- AuraCall no longer runs agent-browser lifecycle commands or independently
  launches Chrome. It consumes the broker access plan, verifies the returned
  exact service-tab handle, and attaches only that handle.
- Agent-browser now permits reuse of a managed attached browser when a browser
  host came only from a service default.
- Runtime attach refreshes profile metadata on a reused CDP daemon, and profile
  validation recognizes managed attached-runtime metadata.
- AuraCall runtime profiles and agent-browser profiles are validated as
  separate identifiers before hemisphere submission.
- Successful provider output survives detach or release cleanup failure. The
  cleanup error is reported independently instead of erasing the answer.
- Temporary `tab_new` acquisitions are detached and released through
  agent-browser. Cleanup rediscovers the current service route when a long Pro
  response outlives the route originally used for acquisition.
- Status and archive hot paths use single-pass projections, coalescing, a
  bounded local-claim cache with provenance, and mtime/size-aware record,
  archive, and checksum caches.
- The old prose-only Pro guard now has a deterministic create-once, poll-many
  executable, private run state, exact-conversation pinning, runtime-authority
  validation, strict JSON parsing, and fixed pass criteria.

## Performance

| Measurement | Before | Installed final sample |
| --- | ---: | ---: |
| CPU, one core | 50.3% | 5.78% |
| RSS | 959,460 KB | 411,496 to 415,496 KB |
| Characters read | 1,158,866,362 in 15 s | 153,786,508 in 50 s |

The measured CPU reduction is 88.5 percent under the real Algorithm
Observatory poller.

## Verification

- AuraCall: 370 affected tests passed after the final cleanup-route change;
  TypeScript compilation and diff hygiene passed. The earlier broader focused
  performance gate passed 380 tests.
- The final cleanup boundary and its test pass Biome. Broader Biome remains
  qualified by pre-existing whole-file style and import drift in already-dirty
  files that were preserved rather than mechanically rewritten.
- Agent-browser: 1,883 isolated Rust tests passed, 57 ignored, zero failed.
  Focused profile mismatch tests and formatting passed. Strict all-target
  Clippy remains blocked by unrelated existing warnings in untouched tests.
- Installed agent-browser SHA-256:
  `6e39d817972aa4cbbf338223ebf1a75ca239d518b0199e8b1ccd52ff75f500b5`.
- Publication preserved ChatGPT PID 3246087, CDP 43545, target
  B19B0776124C411964507FAA316ACD46 and NYSE PID 1762940, CDP 40531, target
  EC562DE50CD4C7CC9438665FCD7422BB.
- The left Pro run succeeded after 52 persisted revisions. The right Pro run
  succeeded after 61 revisions. Both sides were sufficient, the bridge crossed
  exactly once left-to-right, and a candidate thought was generated.
- After the bilateral run, the temporary working tab was released through
  agent-browser and the original B19B target was again the sole pinned
  Workshop target.
- Final automatic-cleanup smoke response
  `resp_e3a082437ae24a30a2439164759ccf89` returned exactly
  `CLEANUP_SMOKE_OK`. Temporary target
  `777B76856201F5D9A14EF0C2E38E5CE1` is closed, retained target
  `B19B0776124C411964507FAA316ACD46` remains ready, and Chromium PID 3246087
  is unchanged.
- AuraCall Pro guard response `resp_10daf60e30094f2c9c9ce9893915bc6c`
  passed with score 96, high confidence, zero blockers, and zero required
  checks.
- Bilateral thought `022de6d0ef88` is released with eight lobe packets, both
  Pro sufficiency decisions, exactly one left-to-right bridge transit, and
  status `done`.

## Residual unrelated state

The dirty branch contains unrelated existing console/search and provider work
that was preserved. A separately known stale workstation lane and unrelated
all-target Clippy warnings are not evidence of failure in the verified
ChatGPT/AuraCall lane. No commit or GitHub publication was performed.
