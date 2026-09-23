# Issue 6 Live Preflight Hard Stop | 2026-09-23

## Correction

The initial installed inventory omitted `--profile wsl-chrome-3` and therefore
read the configured default AuraCall runtime profile, browser profile `default`,
and Gmail Team account. Its LitScout-absent conclusion is invalid for DAS-R5.

## Current installed gates

- Source/installed version: `0.1.1`
- Repo/installed `dist`: 525 files; `diff -qr` exit 0
- Aggregate SHA-256 for both trees:
  `30f58843ff76c95db59eddc54c591bd7adb1be3394a01658907897765d6910d8`
- Scheduler healthy; completions zero queued/running; API PID `7701`, zero restarts

## Correct explicit-profile evidence

`auracall --profile wsl-chrome-3 apps list --json` observed:

- AuraCall runtime profile and browser profile: `wsl-chrome-3`
- account: `eric.cochran@soylei.com`, plan `pro`
- Developer mode: enabled
- inventory complete: true
- LitScout: enabled, auth active, private/development
- plugin ID: `plugin_asdk_app_6aab43983cb48191bdbd222e1e86d736`

## One zero-retry submit outcome

The explicit-profile submit preserved the expected `wsl-chrome-3` authorization
but the shared lifecycle attached to default-profile PID `11884`. Its live auth
session was Gmail Team/workspace, so the authorization gate returned
`provider_session_dimension_conflict`. The receipt had null conversation,
`effectState=pre_effect`, and `retrySafe=true`; no Send occurred and no retry ran.

Default-profile PID `11884` and explicit-profile PID `25307` were attributable
to this acceptance sequence. Both were terminated, and fresh default and
`wsl-chrome-3` managed-profile censuses returned zero.

## Provider-free repair

The shared submit configuration previously copied the selected launch policy
but omitted its `auracallProfileName`. A focused regression is RED without the
field and GREEN when the resolved AuraCall runtime profile is carried into
`runBrowserMode`. The affected 10-file packet passes 135/135 tests; typecheck,
production build, lint-only scoped Biome, diff hygiene, and plan audit pass.
Integration, installed adoption, and a separately authorized new DAS-R5 attempt
remain open.
