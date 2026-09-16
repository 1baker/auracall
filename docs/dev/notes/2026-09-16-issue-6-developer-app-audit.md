# Issue 6 Developer-App Terminal-Response Audit

Work item: `ecochran76/auracall#6`
Lane: P16 / Plan 0323
Canonical main: `95ddf093d1263df1816e6b8b9be331746e4d7eb5`

## Finding

Exact ecosystem-mention selection and P45 approval recognition are integrated,
but developer-app terminal response is not provider-free accepted. The current
developer-app adapter requests `completionMode: "assistant_response"`; the real
ChatGPT low-level adapter rejects every mode except `prompt_submitted` before
browser interaction. The developer-app unit test mocks `runPrompt`, so it does
not cross that boundary. The adapter also discards response text, and the
command outcome/formatters cannot return answer text, conversation identity,
terminal URL, or effect state.

Five focused suites passed 76/76. That result proves the existing units remain
green; it does not prove operability across the real lifecycle seam. No browser,
provider, install, scheduler, GitHub, or runtime mutation occurred during the
audit.

## Bounded Successor

Route developer-app submission through the shared high-level local/remote
`runBrowserMode` lifecycle. Preserve exact `ecosystemMention` and its mutual
exclusion with generic `composerTool`; reuse the P45 approval handler; expose
answer text, conversation identity, terminal URL, and effect state; and prove
one submit with no automatic retry across terminal success and failure.

Keep developer-mode refresh reread and broad mutation-deadline hardening in
separate follow-ups. Historical generic composer-tool and provider-local
watcher patches are superseded and must not be replayed. Live DSR5 remains a
separate explicit-authority gate after provider-free integration.
