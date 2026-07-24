# ChatGPT Project Resolution Cache Authority Failure

Date: 2026-07-05

## Summary

AuraCall failed a company-bot Lei humor backup before browser submission because
the local ChatGPT project cache did not contain a project named `Lei`.

That is the wrong failure mode. If the selected tenant/account has a ChatGPT
project named `Lei`, AuraCall should resolve it regardless of cache state. A
project cache is an optimization and a starting point, not the authority for
project existence.

## Observed Failure

The caller was the SoyLei Lei humor backup path from `company-bot`.

The effective AuraCall command shape was:

```bash
auracall \
  --agent pro-extended-chatgpt-soylei \
  --engine browser \
  --browser-target chatgpt \
  --project-name Lei \
  --model gpt-5.2-pro \
  --browser-attachments always \
  --slug soylei-lei-humor-backup-2026-07-05 \
  --timeout auto \
  --write-output /home/ecochran76/workspace.local/company-bot/generated/soylei/humor/daily/2026-07-05/lei-humor-auracall-backup-post.md \
  --prompt <backup prompt> \
  --file <Lei lore and daily packet files> \
  --wait
```

AuraCall exited nonzero before materializing the post:

```text
FATAL ERROR: Error: No cached project named "Lei". Run "auracall projects" to refresh.
```

`auracall projects` returned an empty list for the selected local runtime at the
time of diagnosis.

## Correct Behavior

When a command names a ChatGPT project with `--project-name`, project resolution
should use this authority order:

1. Select the configured AuraCall runtime profile and browser/account for the
   requested agent.
2. Use the cache only if it contains a fresh unambiguous match for the project
   name under that same tenant/account.
3. On cache miss, stale cache, or empty cache, perform a bounded live project
   discovery in the selected ChatGPT account before failing.
4. If the live account contains an unambiguous project named `Lei`, update the
   cache and proceed into that project.
5. If live discovery cannot complete, fail with a browser/account/readiness
   diagnostic, not a cache-authority diagnostic.
6. If live discovery completes and the project is truly absent, then fail with a
   clear `project_not_found` diagnostic that includes the selected account,
   browser profile, cache age/state, and the visible project candidates.

The local cache must never be the final authority for a tenant-visible ChatGPT
project. Cache absence means "unknown until live discovery proves otherwise,"
not "project does not exist."

## Why This Matters

`company-bot` had already built the deterministic Lei humor packet and packaged
the exact lore/event files. The backup failure happened after source ingestion
and before submission, so a cache-only project lookup converted a recoverable
browser discovery step into a hard production failure.

For tenant workflows, this is especially brittle because project state can drift
outside AuraCall:

- a human can create, rename, or restore a ChatGPT project in the browser;
- a different managed browser profile can have fresher project state;
- account-mirror collection can be delayed or paused;
- a cache can be empty after runtime migration, profile reset, or failed
  collector startup.

None of those should make `--project-name Lei` unrecoverable if the selected
tenant account can still see the project live.

## Acceptance Criteria

- A project-bound ChatGPT run with an empty local project cache performs bounded
  live project discovery before returning `project_not_found`.
- If live discovery finds exactly one project named `Lei`, the run navigates to
  that project, refreshes the cache, and continues to upload/submit.
- If live discovery is blocked by account readiness, rate limits, or browser
  guard state, the command exits with a structured readiness error that includes
  the selected AuraCall runtime profile, managed browser profile, account
  identity if known, and recovery guidance.
- `auracall projects --target chatgpt` should distinguish `cache_empty`,
  `live_refresh_failed`, and `live_refresh_completed_empty`.
- Regression coverage proves that cache miss plus live project hit succeeds,
  and cache miss plus live project miss fails only after live discovery.

## Suggested Test Shape

Add a ChatGPT project-resolution unit or adapter test with:

- cached projects: `[]`
- live project discovery result: one project named `Lei`
- expected result: resolved project id from the live result, cache updated, no
  fatal `No cached project named "Lei"` error

Add the mirror case:

- cached projects: `[]`
- live project discovery result: completed empty
- expected result: structured `project_not_found` with cache state and selected
  account/profile context
