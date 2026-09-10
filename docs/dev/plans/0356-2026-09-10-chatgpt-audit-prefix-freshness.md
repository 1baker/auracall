# ChatGPT audit prefix freshness | 0356-2026-09-10

State: OPEN
Lane: P01

## Current State

Distinct retained assistant messages with different full answers share the first
200 normalized characters of the audit JSON contract. The source freshness
predicate rejects this pattern even with distinct message IDs. The bounded
source fix and 23 export tests pass; installed-runtime verification remains open.
Fresh validation also passes full lint, typecheck, production build, diff hygiene,
and the 357-plan audit (zero validation errors). Biome check additionally flags
format/import organization debt in both touched files; the committed baseline
also fails that check. The repository's configured lint release gate passes.
The built pre-existing bridge change matches the installed bridge byte for byte,
so it does not represent a new runtime change in this upgrade.

## Scope and Acceptance

Primary owns src/browser/index.ts, its browser export regression tests, and
matching docs. Both local and remote fallback readers use the same predicate.
Distinct message IDs suppress only the prefix heuristic. Same message/turn IDs,
identical text, baseline suffix reuse, and identity-missing prefix matches remain
stale. Validate targeted tests and typecheck, then safely install and prove the
changed runtime behavior without replacing the retained browser.

## Non-goals and Bounds

Do not rewrite the failed historical audit, adopt an unverified DOM verdict,
reset attempts, replay uncertain submissions, or touch pre-existing bridge and
Plan 0354 edits. One implementation and closed-world verification slice; no new
test campaign. Close only after installed evidence and audit recovery are verified.
