# Issue 6 installed LitScout acceptance | 2026-09-23

- Source and installed runtime: canonical merge
  `64a446cf94946950bc5e5610eb6811d503e3af34`; 525 `dist` files; matching
  aggregate SHA-256
  `817c1f7f6ca586528245cdc75bee5187fca989177bd058abd538cc965921bd01`.
- Explicit AuraCall runtime profile: `wsl-chrome-3`; expected and observed
  account: `eric.cochran@soylei.com`, Pro personal account.
- App: private LitScout
  `plugin_asdk_app_6aab43983cb48191bdbd222e1e86d736`, enabled and
  authenticated.
- Live bound: one Send, zero retries, manual approval policy. Conversation
  `https://chatgpt.com/c/6ab3fbd8-4aa0-83ea-8ea8-af3e1bc0a25a` returned a
  terminal readiness assessment after authenticating and listing five
  accessible projects. Passive DOM readback found exact terminal marker
  `AURACALL_DAS_R5_OK`, with neither `Answer now` nor an approval control.
- Cleanup: attributable canary Chrome PID `25130` terminated after terminal
  readback. One scheduler resume was accepted at
  `2026-09-23T16:23:58.334Z`; it selected normal `wsl-chrome-3` work with no
  foreground request, drain reservation, selected API run, or blocked API run.
  The pass completed at `2026-09-23T16:29:41.213Z` with
  `action=refresh-completed`, scheduler `state=scheduled`, operator posture
  `healthy`, and no backpressure.

Disposition: DAS-R5 is accepted. The earlier default-profile inventory and
pre-effect identity conflict remain retained as correction evidence, but they
do not limit this installed explicit-profile receipt. Issue 6 may close.
