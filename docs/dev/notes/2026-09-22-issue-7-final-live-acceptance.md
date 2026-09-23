# Issue 7 Final Live Acceptance | 2026-09-22

Work item: `ecochran76/auracall#7`
Branch: `ops/issue-7-final-live-acceptance`
Target: `main`
Disposition: `ACCEPTED`

## Outcome

The remaining installed-live gate for truthful ChatGPT Deep Research
submission and completion passed on the patched canonical source. One fresh
request selected the requested premium model, committed exactly one attached
prompt, auto-started the provider plan, reached a terminal report, and
materialized every supported report variant through one artifact-fetch command.

## Source And Installed Gate

- Canonical source checkpoint before the operations packet:
  `564924386f9e5becf7ca5e579e65b690978719cc`.
- `pnpm install --frozen-lockfile` restored the lockfile-selected dependency
  graph after the pre-install build exposed local `node_modules` drift.
- The focused provider-free gate passed with 174 tests passed and one skipped
  across eight files.
- `pnpm run build` passed.
- `pnpm run install:user-runtime-service` completed. Source and installed
  `dist` inventories each contained 525 files with aggregate SHA-256
  `a9b3351a4f098434adca66ba0287ed25e88ea1bf5d5798bd94654bcc1094d51d`.
- The installed launcher reported `0.1.1`. `auracall-api.service` was active
  with PID `12008` and zero restarts after installation.

## Identity And Ownership Gate

The installed `profile identity-smoke` for AuraCall runtime profile
`wsl-chrome-3` proved:

- exact configured ChatGPT identity match for the Pro personal account;
- browser profile `wsl-chrome-3` and source browser profile `Default`;
- managed browser profile
  `~/.auracall/browser-profiles/wsl-chrome-3/chatgpt`;
- responsive owned Chrome PID `19080` on DevTools port `38221`;
- no CAPTCHA, human-verification, identity, or ownership ambiguity.

## Single-Send Receipt

- Requested semantic model: `chatgpt:premium`.
- Requested provider label: `6 Pro`; observed provider label: `6Pro`.
- Chat mode remained selected and thinking-time selection was omitted.
- Composer tool: `chatgpt.research.deep_research`; observed tool:
  `Deep research`.
- Plan action: `start`; observed stage: `auto-started`; start method: `auto`.
- Attachment mode: upload; the single `LICENSE` attachment was verified on the
  committed user turn.
- Send count: one. Retry count: zero. `Answer now` was not clicked.
- Conversation ID: `6ab32fa8-7de0-83ea-b590-e66a3503358b`.
- Session slug: `issue-seven-deep-research-acceptance`.
- Read-only context reconciliation proved the exact user turn and provider file
  ID after the initial command exited with the truthful started-state response.
- Passive iframe inspection then proved `Research completed in 2m`, the full
  cited terminal report, an Export control, and the exact terminal marker
  `ISSUE7_DEEP_RESEARCH_ACCEPTED_20260922`.

## Artifact-Fetch Receipt

One installed command fetched artifacts for the accepted conversation and
exited zero in 27 seconds:

- `artifactCount = 3`;
- `materializedCount = 3`;
- Markdown: 11,557 bytes, completed;
- DOCX: 16,707 bytes, completed and admitted as a fresh DOCX export;
- PDF: 61,787 bytes, completed and admitted as a fresh PDF export.

The durable local manifest is
`~/.auracall/cache/providers/chatgpt/eric.cochran@soylei.com/conversation-attachments/6ab32fa8-7de0-83ea-b590-e66a3503358b/artifact-fetch-manifest.json`.

## Disposition

Issue 7's remaining live acceptance gap is closed. The source repairs were
already integrated; this packet adds acceptance evidence only and does not
change product code, retry policy, browser controls, or provider semantics.
The unrelated malformed copyright line observed in the attached repository
`LICENSE` is not part of issue 7 and was not changed here.
