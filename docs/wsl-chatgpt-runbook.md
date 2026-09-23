# WSL Runbook: Oracle ChatGPT Browser (WSL Chrome)

Goal: Run ChatGPT browser automation from WSL using a Linux Chrome install, avoiding Windows/WSL interop issues.

Terminology for this runbook:
- browser profile: a browser/account family such as `default` or `wsl-chrome-2`
- source browser profile: the native Chromium profile used for bootstrap/cookie sourcing, usually `Default`
- managed browser profile: Aura-Call's persistent automation profile under `~/.auracall/browser-profiles/<auracallProfile>/<service>`
- AuraCall runtime profile: the top-level `profiles.<name>` entry selected by `--profile`

## Key behavior

- For a required multi-file response, set `metadata.outputContract.artifactFileNames`
  to the exact local filenames, for example `['proposal.docx', 'proposal.pdf']`.
  The configured executor requires every named file to be materialized; a link,
  unrelated PDF, duplicate path, or only one document cannot satisfy the set.
  The list accepts 1–32 nonempty local filenames, not directory paths or control
  characters. If the legacy `artifactFileName` is also present, it remains
  required. Incomplete sets fail rather than invoking the legacy single-file
  correction prompt. Existing single-file requests retain their wire instructions.
  This verifies package presence, not document accuracy, sponsor compliance, or
  permission to submit a proposal. Plan 0358 is installed and a bounded live
  DOCX/PDF explicit-set round trip passed; broader proposal acceptance is separate.

- WSL Chrome is the most reliable path; Windows Chrome/Brave from WSL often fails due to DevTools binding and profile locks.
- AuraCall uses the resolver-derived Windows host for WSL-to-Windows DevTools
  routing, but normalizes any resolver-derived `127.x` nameserver to
  `127.0.0.1` because it is local to the WSL network namespace. An explicit
  `AURACALL_BROWSER_REMOTE_DEBUG_HOST` remains authoritative and is not
  rewritten.
- AuraCall now defaults browser `DISPLAY` to `:0.0` on WSL unless you set `browser.display`, `AURACALL_BROWSER_DISPLAY`, or explicitly target Windows-hosted Chrome.
- Aura-Call uses a managed persistent profile under
  `~/.auracall/browser-profiles/<auracallProfile>/<service>`. Sign in once in
  that managed browser profile. Copying a source browser profile is opt-in via
  setup/bootstrap controls or `--browser-cookie-sync`, because provider token
  rotation in the managed profile can invalidate the source browser session.
- Aura-Call uses `--password-store=basic` and `--use-mock-keychain` for WSL
  Chrome managed-browser launches, including visible auth-mode launches, so
  managed browser profiles do not block behind a Linux desktop keyring prompt.
- Chrome-launcher bookkeeping uses Linux temporary directories named
  `/tmp/auracall-chrome-launcher-*` (or the active `os.tmpdir()` equivalent).
  It must never create `undefined:/.../lighthouse.*` inside the directory where
  AuraCall was invoked.

## Recommended setup
0) Quick bootstrap (installs Node 22 + Chrome + repo deps):

```bash
./scripts/bootstrap-wsl.sh
```

1) Install Chrome in WSL (one-time):

```bash
sudo apt-get install -y google-chrome-stable
```

2) Configure Oracle defaults (`~/.auracall/config.json`):

```json5
{
  browser: {
    chromePath: "/usr/bin/google-chrome",
    chromeCookiePath: "/home/you/.config/google-chrome/Default/Cookies",
    chromeProfile: "Default",
    interactiveLogin: true,
    managedProfileRoot: "/home/you/.auracall/browser-profiles"
  },

  // Optional named secondary WSL browser profile
  browserFamilies: {
    "wsl-chrome-2": {
      chromePath: "/usr/bin/google-chrome",
      chromeProfile: "Default",
      chromeCookiePath: "/home/you/.config/google-chrome/Default/Cookies",
      bootstrapCookiePath: "/home/you/.config/google-chrome/Default/Cookies",
      display: ":0.0",
      managedProfileRoot: "/home/you/.auracall/browser-profiles",
      wslChromePreference: "wsl"
    }
  }
}
```

3) First-time login for primary WSL account (keep the window open so you can sign in):

```bash
AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 \
oracle --profile default --target chatgpt login --browser-keep-browser
```

4) Optional: configure a second WSL browser profile for another account (for example, Pro testing):

```json5
{
  auracallProfile: "default",
  browserFamilies: {
    "wsl-chrome-2": {
      chromePath: "/usr/bin/google-chrome",
      chromeProfile: "Default",
      chromeCookiePath: "/home/you/.config/google-chrome/Default/Cookies",
      bootstrapCookiePath: "/home/you/.config/google-chrome/Default/Cookies",
      display: ":0.0",
      managedProfileRoot: "/home/you/.auracall/browser-profiles",
      wslChromePreference: "wsl"
    }
  },
  profiles: {
    default: {
      services: {
        chatgpt: {
          identity: { email: "ecochran76@gmail.com" }
        }
      }
    },
    "wsl-chrome-2": {
      engine: "browser",
      browserFamily: "wsl-chrome-2",
      defaultService: "chatgpt",
      services: {
        chatgpt: {
          identity: { email: "consult@polymerconsultingroup.com" }
        }
      }
    }
  }
}
```

Aura-Call derives the managed browser profile directory automatically as
`~/.auracall/browser-profiles/<auracallProfile>/<service>` unless you set
`manualLoginProfileDir` explicitly.

To run that same AuraCall-owned directory inside an agent-browser hidden
RDP/Guacamole route, configure its named browser profile with
`browserFamily: "chrome"`, `browserBuild: "stock_chrome"`, and
`agentBrowserRdp: { enabled: true, runtimeProfile: "<matching-agent-browser-runtime>" }`.
Do not move or copy the managed browser profile. AuraCall passes the exact path
to agent-browser and attaches through the returned CDP endpoint only after the
remote view and executable-build proofs pass. Keep this option disabled until
`agent-browser install doctor --json`, remote-view readiness, the named runtime
profile, and the route pool are healthy.

Seed the second account once:

```bash
AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 \
oracle --profile wsl-chrome-2 --target chatgpt login --browser-keep-browser
```

5) Run ChatGPT automation:

Primary account:

```bash
AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 \
oracle --engine browser -p "Say hello from WSL primary"
```

Secondary account:

```bash
AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 \
oracle --profile wsl-chrome-2 --engine browser -p "Say hello from second profile"
```

Chat is the default composer mode for every AuraCall ChatGPT browser run. Work
must be explicit, and its model is selected through a separate nested slider
menu rather than the Chat model picker:

```bash
oracle --profile wsl-chrome-3 --engine browser \
  --browser-chatgpt-mode work \
  --browser-work-model "GPT-5.6 Terra" \
  -p "Reply exactly: AURACALL_WORK_MODE_OK"
```

If the mode menu or the Work slider's `advanced options -> Model` submenu is
not present, AuraCall fails closed. It does not reuse Chat picker selectors.

The current Chat composer combines model and effort selection in one
intelligence picker. AuraCall scopes the trigger to the active composer; an
older assistant turn's `Switch model` action is a retry menu and is never used
for composer model selection. The horizontal Power positions are Instant,
Medium, High, Extra High, and Pro. Existing AuraCall effort levels map to the
first four positions respectively and verify the selected slider value.

On the current Chat workbench, `Add files and more` opens one searchable
popover containing both file sources and tools. Use `--browser-composer-tool`
only for tool/app rows through durable IDs such as
`chatgpt.commerce.shopping`, `chatgpt.search.web_search`, or
`chatgpt.research.deep_research`; legacy labels remain aliases. Use
`--file` for local paths. AuraCall prefers `Add photos & files / Upload from
computer`; if that text drifts, it accepts the unrestricted `#upload-files`
input only when the same active composer contains the prompt and the exact
`Add files and more` trigger. It never substitutes `Add from library / Browse
and search your files`, which is ChatGPT's provider-library drawer. Missing or
ambiguous binding still fails closed.

Third-party tools can pause after prompt submission and ask for `Allow once`
or `Always allow`. AuraCall defaults to `manual`, which detects the pause and
returns an actionable error without clicking. For unattended runs, select the
operator preference explicitly:

```bash
# Approve only the current tool call.
oracle --profile wsl-chrome-3 --engine browser \
  --browser-chatgpt-tool-approval allow-once \
  -p "Use the selected tool, then summarize the result"

# Persist ChatGPT approval for that third-party tool.
oracle --profile wsl-chrome-3 --engine browser \
  --browser-chatgpt-tool-approval always-allow \
  -p "Use the selected tool, then summarize the result"
```

The detector requires one visible surface containing exactly one of each
approval action. Before its one trusted pointer sequence, it briefly settles,
re-probes the same exact surface/action, and uses the fresh button center. A
changed or ambiguous surface receives no click; one that independently
disappears needs no action. AuraCall verifies a clicked surface disappears and
will not click the same surface twice. It never clicks `Answer now`.

Current live proof: the 2026-08-15 `wsl-chrome-3` LitScout canary selected
`allow-once`, logged exact `Allow once`, verified disappearance, and completed
with the expected token. A deliberately nonexistent cancellation target kept
LitScout project, job, cancellation, operator-action, and canonical-write
effects at zero. The durable receipt is
`docs/dev/notes/2026-08-15-plan0288-litscout-allow-once-live-proof.json`.

## Troubleshooting
- **Chrome opens but the URL never changes**: Oracle is connecting to the wrong DevTools host.
  - Fix: set `AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1` for the run.
- **WSL Chrome fails with `Missing X server` / blank `DISPLAY`**:
  - AuraCall now defaults to `:0.0` on WSL.
  - Override only if your X server uses another display or you intentionally want Windows-hosted Chrome.
- **Chrome stalls behind a keyring prompt**:
  - Current Aura-Call WSL Chrome managed-browser launches include
    `--password-store=basic` and `--use-mock-keychain`.
  - If an older Chrome process is already running without those flags, close
    that managed browser profile's Chrome process and rerun so Aura-Call can
    relaunch it with the keyring bypass flags.
  - For visible auth recovery, use `auracall --profile <name> login --target chatgpt`;
    auth-mode opens on `DISPLAY=:0.0` by default.
- **A managed browser profile already has a Chrome owner**:
  - AuraCall reattaches when that exact managed browser profile's responsive
    DevTools endpoint is attributable.
  - If Chrome owns the directory but no responsive endpoint can be attributed,
    AuraCall fails closed instead of launching a second Chrome on a dynamic
    port. Inspect or close only the exact owned process before retrying.
- **AuraCall restarts during a required-mode broker response**:
  - The installed downloader recognizes both embedded artifact preview panels
    and full-screen dialogs. It closes the prior viewer, selects the exact
    response control and filename, and accepts only a fresh verified download.
    Installed original DOCX/PDF readback passed on 2026-09-11; this does not
    retroactively mark an interrupted API response as completed.
  - Broker recovery now obtains fresh configured-account verification on the
    exact retained target before attachment. Missing, conflicting, or truncated
    identity and missing browser PID fail closed. Successful identity verification
    does not establish successful artifact download. If exact controls yield no
    verified browser download, preserve the failed receipt and diagnose retrieval;
    never submit an artifact-correction prompt from a recovered response.
  - An already failed single-step direct ChatGPT recovery can be requeued once
    with local runtime control `reconcileFailedBrowserRecovery(control,
    { runId, expectedRevision, at })`. It requires the original recovery failure
    and event, rejects active leases and stale revisions, preserves failure
    history, and marks the step recovery-only. The normal runner must complete
    capture and materialization; this operation never marks a run successful.
  - Recovery preserves the captured assistant message ID through the returned
    browser result. Artifact capture uses that identity, never a conversation
    ID or target ID as a substitute. Missing response identity still prevents
    response-bound artifact materialization.
  - Keep polling the same durable response id. AuraCall recovers the submitted
    step by re-authorizing its saved agent-browser `serviceTabHandle`; it does
    not resubmit the prompt or launch another Chrome process.
  - If the old target is gone, recovery can inspect one restored target in the
    same broker browser, profile and session. It must match the full original
    request to one user message and one following identified assistant response.
    Active generation, duplicate requests, ambiguous targets and missing IDs
    fail closed. No prompt is replayed. This function-level path was verified
    live on 2026-09-11; reconciliation of an already failed API run is still pending.
  - Exact original-request/answer binding also applies when the physical target
    survives. A matching tab is not permission to return its latest answer.
    The same-target guard is regression-tested and present in the
    2026-09-11 15:28:26 UTC installation.
  - Artifact-correction prompts apply only to fresh execution. During recovery,
    missing downloads or provider-session proof must report the retrieval error,
    never submit a replacement file-generation prompt. The 2026-09-11 guard is
    regression-tested and present in the 15:11:57 UTC installed runtime;
    autonomous original-file recovery remains a separate live acceptance check.
  - Incomplete saved broker identity still fails closed. Inspect agent-browser
    service state instead of enabling raw CDP discovery.
  - Recovery must recheck the configured ChatGPT account using the retained
    target's current auth-session identity. Browser/profile selection alone is
    not provider-session proof. The proof is passed to artifact materialization;
    wrong, missing or truncated identity observations fail before attachment.
    This preflight repair is present in the 2026-09-11 15:20:22 UTC installation;
    live original-file materialization remains a separate acceptance check.
- **Default `auto` browser routing**:
  - A healthy agent-browser service is attempted first for ChatGPT and Grok.
    If no broker route accepts an access plan, AuraCall logs the pre-authority
    fallback and continues through its compatibility managed-browser path.
  - Once agent-browser returns an access plan, any later acquisition or attach
    failure is fail-closed. Do not switch to `off` merely to bypass that error;
    inspect the selected broker profile, session, and tab handle first.
- **Using Windows Chrome from WSL**:
  - Keep `manualLoginProfileDir` as a WSL path if you override it; Aura-Call converts it to the `\\wsl.localhost\...` path for Windows Chrome.
  - If DevTools can’t be reached, open the Windows firewall for the chosen port or pin a port with `AURACALL_BROWSER_PORT`.
- **Wrong profile opens / not logged in**:
  - Keep the login window open, sign in, then rerun. The profile is reused on subsequent runs.
- **Need a clean profile**:
  - Remove the relevant managed profile under `~/.auracall/browser-profiles/<auracallProfile>/<service>` and repeat the login step.

## Explicit new conversation compatibility

Before sending `auracall.chatgptNewConversationProjectId`, require the running
API's `GET /status` response to contain
`compatibility.supportsChatgptNewConversationProjectId: true`. Missing, false,
or non-boolean values mean the client must not send this mode: older schemas
may silently discard unknown request fields and use a configured conversation.
This flag reports protocol support, not browser readiness or live acceptance.
The mode requires an existing exact `g-p-` plus 32 lowercase hex project ID and
is mutually exclusive with `auracall.chatgptConversationUrl`. After completion,
use the verified returned conversation URL for normal broker reacquisition;
task-created tab handles may already have been released by normal cleanup.

## Optional helper aliases
Add to `~/.zshrc`:

```bash
alias oracle-wsl='AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 oracle'
alias oracle-login='AURACALL_BROWSER_REMOTE_DEBUG_HOST=127.0.0.1 oracle --target chatgpt login --browser-keep-browser'
```

## Chat mode preflight

On new-chat and project landing pages AuraCall waits for explicit Chat/Work controls before accepting the requested mode. A visible composer alone does not prove Chat. Missing controls stop the run before prompting; established conversation routes retain their mode-marker compatibility checks.
