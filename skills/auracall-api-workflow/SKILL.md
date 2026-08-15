---
name: auracall-api-workflow
description: Use AuraCall as an OpenAI-compatible local service for configured agents, single responses, chat completions, response batches, attachments, and run polling.
---

# AuraCall API Workflow

Use this skill when another agent or app needs to call AuraCall as a local LLM
service. Treat `agent:<agent_id>` as the model name and prefer scoped API keys.

## Inputs To Locate

- `OPENAI_BASE_URL`, usually `http://auracall.localhost/v1`
- `OPENAI_API_KEY`, preferably scoped to the intended agent or team
- model id, usually `agent:<agent_id>`
- optional `AURACALL_STATUS_URL` and `AURACALL_BATCH_URL` from the handoff env
- optional local attachment paths
- optional batch limits:
  - `maxConcurrentRuns`
  - `maxBrowserInteractionsPerMinute`

## Golden Path

1. Check service posture:
   - use `AURACALL_STATUS_URL` from the generated handoff env, or MCP
     `api_status` when available
   - only when no handoff URL exists, derive `/status` from the API origin
2. Discover models:
   - `GET /v1/models`
   - confirm the intended `agent:<agent_id>` appears.
3. For one prompt:
   - call `POST /v1/responses` or streaming/non-streaming
     `POST /v1/chat/completions`.
   - with MCP, call `response_create` and retain its returned id
4. For many independent prompts:
   - call `POST /v1/response-batches` or MCP `response_batch_create` once
   - poll `GET /v1/response-batches/{batch_id}` or MCP
     `response_batch_status`
   - to stop unfinished work, call
     `POST /v1/response-batches/{batch_id}/cancel` or MCP
     `response_batch_cancel` once, then inspect every returned child outcome
   - read child output through `GET /v1/responses/{response_id}` or MCP
     `run_status`
5. Never resubmit a create request just to check status.

Batch cancellation is durable and idempotent. It cancels queued children and
active children owned by the local AuraCall runner, preserves completed and
failed children, and reports `not-owned` for an active foreign lease rather
than taking it over. Treat `fullySettled = false` or any `not_found`,
`not_owned`, or `errors` count as an operator-attention result.

Non-streaming chat completions wait for a bounded synchronous window. A
retryable `503` with `error.type = "auracall_execution_pending"` includes the
durable `response_id` and `response_poll_path`; poll that response instead of
submitting the chat request again. With `stream: true`, consume OpenAI-compatible
SSE until `[DONE]`. The `X-AuraCall-Response-Id` header identifies the durable
run. Pending or failed execution appears as a structured SSE `error` with that
id and poll path; an OpenAI SDK surfaces it as an API error. Client stream
cancellation stops delivery but does not cancel the AuraCall run.

## Response Request Shape

```json
{
  "model": "agent:<agent_id>",
  "input": "Prompt text",
  "attachments": [
    {
      "id": "packet-1",
      "fileName": "packet.md",
      "mimeType": "text/markdown",
      "uri": "file:///absolute/path/packet.md"
    }
  ],
  "metadata": {
    "workflow": "example"
  }
}
```

## Batch Request Shape

```json
{
  "metadata": {
    "workflow": "example-batch"
  },
  "limits": {
    "maxConcurrentRuns": 1,
    "maxBrowserInteractionsPerMinute": 8
  },
  "requests": [
    {
      "model": "agent:<agent_id>",
      "input": "First job"
    },
    {
      "model": "agent:<agent_id>",
      "input": "Second job"
    }
  ]
}
```

## Polling Rules

- Keep ids returned by create calls.
- Poll status/readback endpoints by id.
- Do not navigate provider conversation URLs from the client.
- Do not call create endpoints again unless intentionally retrying a failed
  job.
- If browser/provider health looks wrong, use AuraCall status and diagnostics
  surfaces instead of probing provider pages yourself.

## Attachments

- Use local absolute paths or `file://` URIs for uploadable files.
- Include `fileName` and `mimeType` when known.
- HTTP(S) attachment URIs are metadata only until AuraCall gains remote
  materialization.

## Verification

Use the URLs written into the generated handoff env as authority. Do not
reconstruct the status or batch URL when `AURACALL_STATUS_URL` or
`AURACALL_BATCH_URL` is present.

For provider-free repository validation, run:

```bash
pnpm run smoke:scoped-client-handoff
```

This fixture-backed smoke proves redacted handoff creation, client-env writing,
service reload simulation, model discovery, one response, one attachment-bearing
batch, and polling without browser/provider access.

Before a real large batch, and only after the configured browser/provider and
cost effects are authorized, run the downstream client check:

```bash
pnpm run smoke:scoped-client-env -- <client.env>
```

It reads the generated env, validates `/v1/models`, submits one real
`/v1/responses` request, and polls durable readback. Treat it as effectful: its
target client environment may invoke a browser or billable provider.
