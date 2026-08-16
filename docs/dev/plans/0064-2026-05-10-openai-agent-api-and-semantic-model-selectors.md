# OpenAI Agent API and Semantic Model Selectors

State: CLOSED
Date: 2026-05-10
Plan version: 2

## Context

AuraCall's local OpenAI-compatible API is moving from low-level provider hints
toward configured agent entrypoints. A basic client should be able to send one
prompt to a configured AuraCall agent and receive a normal response-like result.

Provider model names drift quickly. ChatGPT, Grok, and Gemini all expose
semantic workbench modes such as auto, instant, and thinking; ChatGPT also has
standard/extended depth and normal/pro thinking modes. Agent config should
prefer semantic intent and keep exact provider-version pins as escape hatches.

## Current Slice

- `model: "agent:<agent_id>"` routes a `/v1/responses` request to a configured
  AuraCall agent by setting `auracall.agent`.
- Agents may declare:
  - `runtimeProfile`
  - `service`
  - raw `model`
  - semantic `modelSelector`
  - optional project/conversation identity
  - agent-local knowledge references
  - pre/post prompt fields
- Agent raw `model` and `projectId` now participate in browser-backed
  configured execution.
- Config projection reports only configured agent fields, avoiding null/false
  noise.
- Agents and teams can be created, updated, listed, and deleted through the
  local API and MCP config tools.
- `/v1/models` now publishes:
  - static provider model ids
  - configured AuraCall agents as `agent:<agent_id>`
  - semantic provider selectors with execution-readiness metadata
- Optional local API-key authorization now protects `/v1/*` routes and can
  scope `/v1/responses` calls by agent, team, service, and runtime profile.
  Keys can live in config or in the user-scoped service dotenv file at
  `~/.auracall/api.env`.
- `/v1/chat/completions` requests now adapt OpenAI-style chat messages into the
  existing `/v1/responses` runtime path. Non-streaming calls drain one
  host-owned run and return a standard `chat.completion`; streaming calls emit
  OpenAI-compatible SSE over the same durable response.
- `docs/agent-workflows.md` defines the general agent/app workflow pattern:
  privileged setup, scoped execution, durable observation, response batches,
  and skill split. The ChE grading smoke is one fixture-backed proof of that
  pattern, not a special-purpose API lane.
- API requests, chat completions, response batches, and team runs should
  produce archive-ready runtime evidence. Searchable retrieval of uploaded
  files, generated artifacts, provider conversation ids, and caller-supplied
  post-processing evidence belongs to Plan 0066 rather than to
  provider-specific model-selector work.
- `POST /v1/agent-setup-packages`/MCP `agent_setup_package_create` and the
  redacted `POST /v1/agent-setup-handoffs`/MCP
  `agent_setup_handoff_create` now compose project ensure, registry agent
  binding, scoped API-key issuance, and client env handoff into one privileged
  setup call.
- Repo-local skills now cover the two generic agent roles:
  `auracall-api-workflow` for scoped execution clients and
  `auracall-agent-setup` for privileged setup clients.

## Current State

Implemented:

- config schema and projection carry configured single-agent routing intent
- direct `/v1/responses` agent routing shorthand is accepted
- raw agent `model` and `projectId` are honored by browser-backed configured
  execution
- ChatGPT semantic selectors resolve into current browser controls:
  - `chatgpt:auto` / `chatgpt:terra` -> `GPT-5.6 Terra`
  - `chatgpt:instant` / `chatgpt:luna` -> `GPT-5.6 Luna`
  - `chatgpt:thinking-standard`, `chatgpt:sol`, `chatgpt:sol-medium`, and
    legacy `chatgpt:pro-standard` -> `GPT-5.6 Sol` + `standard`
  - `chatgpt:thinking-extended`, `chatgpt:sol-high`, and legacy
    `chatgpt:pro-extended` -> `GPT-5.6 Sol` + `extended`
  - `chatgpt:sol-extra-high` / `chatgpt:sol-pro` -> `GPT-5.6 Sol` + `heavy`
  - `chatgpt:gpt-5.5` -> `GPT-5.5`
- Grok semantic selectors resolve into current browser controls:
  - `grok:auto` -> `Auto`
  - `grok:instant` -> `Fast`
  - `grok:thinking` -> `Expert`
  - missing menus or exact options fail before prompt submission
- Gemini semantic selectors resolve through the maintained native adapter:
  - `gemini:auto` -> `Gemini Flash`
  - `gemini:instant` -> `Gemini Flash-Lite`
  - `gemini:thinking` -> `Gemini Pro`
  - attachments and desired model survive shared planned-prompt dispatch
  - missing menus, exact options, or selected-state proof fail before prompt
    insertion
- local agent/team management writes are available at:
  - `GET|PUT|DELETE /v1/config/agents`
  - `GET|PUT|DELETE /v1/config/teams`
  - MCP tools `config_entities_list`, `config_agent_upsert`,
    `config_agent_delete`, `config_team_upsert`, and `config_team_delete`
  - writes target the user-scoped registry by default; config-defined overlay
    ids remain pinned and return blocked mutation results
- `/v1/models` includes configured agents and semantic selector entries for
  client-side discovery. ChatGPT, Grok, and Gemini semantic selectors are
  marked `executionReady=true` after provider-free adapter coverage.
- `api.auth.required=true` with `api.auth.keys[]` enables bearer-key
  authorization for `/v1/*`. `/status` remains open for operator discovery and
  reports the active auth posture. Keys may carry `agents`, `teams`,
  `services`, and `runtimeProfiles` allow-lists for `/v1/responses`.
- `~/.auracall/api.env` is loaded by the installed user service and can define
  `AURACALL_API_KEY`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `AURACALL_MODEL`
  for local client agents without storing secrets in the repo.
- `/v1/chat/completions` is implemented for JSON and SSE calls. Both reuse the
  same execution authorization, agent shorthand, response drain, and stored-run
  readback as `/v1/responses`, and wait only for the one created run inside a
  bounded window. Non-streaming pending execution returns retryable `503`
  metadata. Streaming emits role, settled content, stop, optional usage, and
  `[DONE]`; pending or failed execution emits a structured SSE error with the
  persisted response id and poll path. Client disconnect does not cancel the
  durable run.
- `POST /v1/projects/ensure` and `POST /v1/response-batches` combine into the
  first documented deterministic setup plus stochastic execution workflow for
  external agents.
- `POST /v1/agent-setup-handoffs` and MCP `agent_setup_handoff_create` provide
  the preferred first-class handoff workflow for downstream clients: ensure
  provider project, bind agent, issue scoped key, write client env, and return
  only non-secret model/project/key-id/restart metadata.
- `POST /v1/agent-setup-packages` and MCP `agent_setup_package_create` remain
  available for privileged operators that explicitly need the full one-time
  secret-bearing setup response.

Remaining: none.

## Acceptance Criteria

- A client can call `/v1/responses` with `model: "agent:<agent_id>"` and the
  stored run routes through that configured agent.
- A client can call non-streaming `/v1/chat/completions` with `model:
  "agent:<agent_id>"` and receive a `chat.completion` projection from the same
  configured-agent runtime path.
- A client can call streaming `/v1/chat/completions` with `model:
  "agent:<agent_id>"`, consume valid `chat.completion.chunk` SSE through the
  official OpenAI SDK, and retain the durable response id for recovery.
- Agent config can express service, raw model, semantic selector, project,
  knowledge, and prompt intent without polluting output with unset fields.
- Provider-specific adapters resolve semantic selectors against current
  workbench UI modes before AuraCall treats them as execution-ready defaults.
  ChatGPT, Grok, and Gemini now implement this criterion.
- Agents and teams can be maintained by other local agents through the API/MCP
  control plane without hand-editing config files.
- Client apps can discover configured agent model ids and semantic selector
  readiness from `/v1/models`.
- Client apps can be required to present an API key, and scoped keys cannot
  create `/v1/responses` runs outside their configured agent/team/service/runtime
  allow-lists.
- Client apps can load the user-scoped dotenv file and call AuraCall with
  normal OpenAI-compatible `base_url`, `api_key`, and `model` settings.
- Client agents can follow a documented setup/execution split and can load
  repo-local skills that keep AuraCall endpoint choreography out of
  domain-specific workflow code.
- Privileged setup agents can create a project-bound agent setup handoff in one
  HTTP or MCP call and hand downstream clients only the generated scoped env
  path plus non-secret readiness metadata.
- Downstream clients can run a repo-provided env-only smoke that reads the
  generated scoped env, validates `/v1/models`, submits one `/v1/responses`
  request, and polls readback without operator privileges.

## Completion Evidence Audit | 2026-08-15

- Configured-agent `/v1/responses` routing: current
  `tests/http.responsesServer.test.ts` proves configured agent discovery and
  catalog hydration before execution.
- Non-streaming and streaming chat completions: the same HTTP contract proves
  configured-agent `chat.completion` projection, valid chunks through the
  installed OpenAI Node SDK, durable response-id recovery, structured pending
  and terminal errors, and disconnect-safe execution.
- Agent configuration projection: `tests/configModel.test.ts` proves service,
  raw model, semantic selector, project, knowledge, and prompt fields while
  exact object assertions reject unset-field noise.
- Semantic selector execution: `tests/config/modelSelector.test.ts` proves the
  closed-world current mappings; `tests/runtime.configuredExecutor.test.ts`
  proves ChatGPT, Grok, and Gemini resolution before browser execution and
  rejects unsupported selectors before launch.
- Local configuration control plane: `tests/http.responsesServer.test.ts` and
  `tests/mcp.configEntities.test.ts` prove agent/team writes and reads through
  HTTP and MCP without hand-editing config files.
- Model discovery and authorization: the HTTP contract proves configured-agent
  and semantic-selector `/v1/models` entries, required bearer keys, execution
  allow-lists, registry-backed agent scopes, and user service-environment key
  loading.
- Setup/execution skill split: `tests/specializedSkillContract.test.ts` checks
  endpoint, MCP, package, repo-local skill, and documentation authority against
  `docs/agent-workflows.md` and the bundled setup/execution skills.
- Redacted setup handoff: HTTP, MCP, and
  `tests/projects.agentSetupPackageService.test.ts` prove one project-bound
  setup operation writes the scoped env while returning only non-secret path,
  model, project, key-id, and restart metadata.
- Env-only downstream execution: `pnpm run smoke:scoped-client-handoff` passed
  against an isolated provider-free server. It consumed only the generated
  client env, discovered the agent model, created and polled one direct
  response, then completed a two-child response batch with the scoped key.
- The focused current-state audit passed 331 of 332 assertions across eight
  files. The sole unrelated account-mirror backlog assertion passed on an
  immediate isolated rerun, classifying it as order-sensitive fixture
  interference rather than a Plan 0064 contract failure.

## Follow-On Status

- Delivered: response-batch cancellation, retry, and priority closed accepted
  in Plans 0334, 0335, and 0336 respectively.
- Separately owned: ensuring `/v1/responses`, `/v1/chat/completions`,
  `/v1/response-batches`, and
  `/v1/team-runs` write enough stable metadata for the searchable run
  cache/archive lane remains open under Plan 0066.
- Separately owned and non-blocking: promotion of the generic repo-local
  AuraCall skills into an external shared skill source remains a distribution
  decision. The bundled skills and their executable contract stay authoritative
  for this repository until such a destination is selected.

## Closure Evidence

- Plan 0333 proves OpenAI SDK-compatible streaming chat completions over the
  same authorized durable response authority as non-streaming calls, including
  usage, structured recovery errors, and disconnect-safe execution.
- Exact-SHA acceptance
  [31911079470](https://github.com/1baker/auracall/actions/runs/31911079470)
  passed at `9719bf8f65fb24fc4919ce09201aa29c77450c86` across Ubuntu 22/Node
  22, Ubuntu 24/Node 24, macOS/Node 22, and `windows-latest`/Node 22.
- All acceptance criteria above remain implemented and provider-free local
  validation passes. Plan 0064 therefore closes accepted.
- Response-batch cancellation exact-SHA acceptance
  [31912516695](https://github.com/1baker/auracall/actions/runs/31912516695)
  passed at `a2eb9307dbbdbf00400e6e26f95d391666987571` under Plan 0334.
- Response-batch retry exact-SHA acceptance
  [31913863421](https://github.com/1baker/auracall/actions/runs/31913863421)
  passed at `e8f6be8a6f10e3346d374b04bb516d3fc6f42d54` under Plan 0335.
- Response-batch priority exact-SHA acceptance
  [31915204142](https://github.com/1baker/auracall/actions/runs/31915204142)
  passed at `cb557d23a9a9aae02384d877c8bafe4e85061586` under Plan 0336.
