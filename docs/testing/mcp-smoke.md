# MCP Smoke Tests (local auracall-mcp)

Use these steps to validate CLI + MCP end-to-end before releasing. Public npm
distribution remains deferred; use the installed user-runtime wrapper or the
repository-local `auracall-local` entry in `config/mcporter.json`.

## Checklist (run all four lanes)
1) CLI (API engine)
2) CLI (browser engine)
3) MCP via mcporter (API + browser)
4) Claude Code via MCP (API defaults)

Shared prereqs
- `pnpm build` (ensures `dist/bin/auracall-mcp.js` exists)
- `OPENAI_API_KEY` set in env
- `config/mcporter.json` contains `auracall` for the installed user-runtime
  wrapper and `auracall-local` for the built checkout.
- `mcporter` available on `PATH` (`command -v mcporter`)
- For browser runs: Chrome installed; macOS host (headful).
- macOS notifications: `vendor/oracle-notifier/OracleNotifier.app` ships with the package (preferred); falls back to toasted-notifier if missing/broken.

## CLI smokes
- API:
  ```bash
  pnpm run auracall -- --engine api --model gpt-5.2 --prompt "API smoke: say two words"
  ```
- Browser:
  ```bash
  pnpm run auracall -- --engine browser --model "GPT-5.2" --prompt "Browser smoke: say two words"
  ```

## MCP via mcporter
1) List tools/schema to confirm discovery (use the local entry):
   ```bash
   mcporter list auracall-local --schema --config config/mcporter.json
   ```

2) API consult (GPT-5.2):
   ```bash
   mcporter call auracall-local.consult \
     prompt:"Say hello from GPT-5.2" \
     model:"gpt-5.2" \
     engine:"api" \
     --config config/mcporter.json
   ```

3) Sessions list:
   ```bash
   mcporter call auracall-local.sessions hours:12 limit:3 --config config/mcporter.json
   ```

4) Session detail:
   ```bash
   mcporter call auracall-local.sessions id:"say-hello-from-gpt-5-2" detail:true --config config/mcporter.json
   ```

5) Browser smoke:
   ```bash
   mcporter call auracall-local.consult \
     prompt:"Browser smoke" \
     model:"GPT-5.2" \
     engine:"browser" \
     --config config/mcporter.json
   ```
   Uses a built-in browserConfig (ChatGPT URL + cookie sync) and the provided model label for the picker (heads-up: if the ChatGPT UI renames the model label, this may need an update).

## MCP `api_status` against local API

Use this to verify MCP operators can assert the local API scheduler posture
without shelling out to `auracall api status`.

1) Refresh the installed user runtime:
   ```bash
   pnpm run install:user-runtime
   ```

2) Run both local API posture smokes:
   ```bash
   pnpm run smoke:mcp-api-status
   ```

Expected output:
```text
disabled: posture=disabled state=disabled port=18081
enabled: posture=scheduled state=scheduled port=18082
```

The enabled smoke starts `auracall api serve` with
`--account-mirror-scheduler-interval-ms 600000` and expects `scheduled`, not
`ready`, because the scheduler arms its cadence timer immediately. The smoke
does not enable `--account-mirror-scheduler-execute`, does not launch browsers,
and stops each temporary API server before exiting.

## MCP `api_ops_browser_status` Against Fixture API

Use this to verify the installed MCP server exposes the ops-browser dashboard
contract preflight through the actual MCP protocol.

1) Refresh the installed user runtime:
   ```bash
   pnpm run install:user-runtime
   ```

2) Run the fixture ops-browser MCP smoke:
   ```bash
   pnpm run smoke:mcp-ops-browser
   ```

Expected output:
```text
ops-browser MCP smoke: pass port=<dynamic>
tool=api_ops_browser_status
listed=ok
dashboardControl=/status
liveFollow=paused
providerWork=none
```

The smoke starts an injected local API fixture, pauses a live-follow completion
through `/status`, connects to the installed `auracall-mcp` binary over stdio,
lists tools, and calls `api_ops_browser_status` with paused completion
expectations. It does not launch provider browsers.

For a release-ready lazy-live-follow gate, run
`pnpm run preflight:lazy-live-follow`. It includes this installed MCP smoke
after the no-browser completion-control, hydration, health parity, dashboard,
user-runtime install, and direct API log-tail checks.

## Claude Code smoke (tmux + cli)

Use this to verify Claude Code can reach the Aura-Call MCP server end-to-end.

Prereqs
- `pnpm build`
- `OPENAI_API_KEY` exported (for the API engine default)
- Aura-Call MCP registered with Claude (once per project):  
  `claude mcp add --transport stdio auracall -- auracall-mcp`

Steps
1) Start Claude in tmux:
   ```bash
   tmux new -s claude-smoke 'cd "$(git rev-parse --show-toplevel)" && claude --permission-mode bypassPermissions'
   ```
2) From another shell, use the helper to drive it:
   ```bash
   bun scripts/agent-send.ts --session claude-smoke --wait-ms 800 --entry double -- \
     'Call the auracall sessions MCP tool with {"limit":1,"detail":true} and show the result'
   ```
3) Validate the pane shows a successful `auracall sessions` tool call. If the
   tool is absent, inspect the project registration with `claude mcp get
   auracall`. When finished, `tmux kill-session -t claude-smoke`.

See `docs/mcp.md` for full tool/resource schemas and behavior.

Tip: The MCP consult tool pulls defaults from your `~/.auracall/config.json` (engine/model/search/prompt suffix/heartbeat/background/filesReport) when the call doesn’t override them.
