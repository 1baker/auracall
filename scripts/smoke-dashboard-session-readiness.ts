#!/usr/bin/env tsx
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createResponsesHttpServer } from '../src/http/responsesServer.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsxCli = path.join(repositoryRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const cliEntrypoint = path.join(repositoryRoot, 'bin', 'auracall.ts');
const mcpEntrypoint = path.join(repositoryRoot, 'bin', 'auracall-mcp.ts');
const commandTimeoutMs = 20_000;

export interface DashboardSessionReadinessSmokeCase {
  name: 'ready' | 'scoped-only';
  key: {
    id: string;
    secret: string;
    agents?: string[];
  };
  expected: {
    scoped: boolean;
    operatorKeyCount: number;
    dashboardSessionReady: boolean;
  };
}

interface CommandResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
}

interface ReadinessProjection {
  required: boolean;
  keyCount: number;
  scoped: boolean;
  operatorKeyCount: number;
  trustedLocalOperatorDashboard: boolean;
  trustedLocalOperatorDashboardReason: string;
  dashboardSessionRequired: boolean;
  dashboardSessionReady: boolean;
}

export function createDashboardSessionReadinessSmokeCases(): DashboardSessionReadinessSmokeCase[] {
  return [
    {
      name: 'ready',
      key: {
        id: 'smoke-operator',
        secret: 'synthetic-dashboard-readiness-operator-key',
      },
      expected: {
        scoped: false,
        operatorKeyCount: 1,
        dashboardSessionReady: true,
      },
    },
    {
      name: 'scoped-only',
      key: {
        id: 'smoke-scoped',
        secret: 'synthetic-dashboard-readiness-scoped-key',
        agents: ['smoke-agent'],
      },
      expected: {
        scoped: true,
        operatorKeyCount: 0,
        dashboardSessionReady: false,
      },
    },
  ];
}

export function assertDashboardSessionReadinessProjection(
  value: unknown,
  smokeCase: DashboardSessionReadinessSmokeCase,
  source: string,
): ReadinessProjection {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${source} auth must be an object.`);
  const auth = value as Record<string, unknown>;
  const projection = {
    required: auth.required,
    keyCount: auth.keyCount,
    scoped: auth.scoped,
    operatorKeyCount: auth.operatorKeyCount,
    trustedLocalOperatorDashboard: auth.trustedLocalOperatorDashboard,
    trustedLocalOperatorDashboardReason: auth.trustedLocalOperatorDashboardReason,
    dashboardSessionRequired: auth.dashboardSessionRequired,
    dashboardSessionReady: auth.dashboardSessionReady,
  };
  assert.deepEqual(projection, {
    required: true,
    keyCount: 1,
    scoped: smokeCase.expected.scoped,
    operatorKeyCount: smokeCase.expected.operatorKeyCount,
    trustedLocalOperatorDashboard: false,
    trustedLocalOperatorDashboardReason: 'external_routing',
    dashboardSessionRequired: true,
    dashboardSessionReady: smokeCase.expected.dashboardSessionReady,
  }, `${source} readiness projection mismatch for ${smokeCase.name}.`);
  for (const forbidden of ['keys', 'keyIds', 'secrets', 'scopes', 'sessionToken']) {
    assert.equal(forbidden in auth, false, `${source} auth exposed forbidden field ${forbidden}.`);
  }
  return projection as ReadinessProjection;
}

function createIsolatedEnvironment(auracallHome: string): Record<string, string> {
  const env = Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
  for (const key of [
    'AURACALL_API_AUTH_ENABLED',
    'AURACALL_API_KEY',
    'AURACALL_API_KEYS',
    'AURACALL_CHATGPT_TEAM_LIVE_TEST',
    'AURACALL_ENABLE_LIVE_PROVIDERS',
    'AURACALL_LIVE_TEST',
    'AURACALL_LIVE_TEST_FAST',
    'ANTHROPIC_API_KEY',
    'GEMINI_API_KEY',
    'OPENAI_API_KEY',
    'XAI_API_KEY',
  ]) {
    delete env[key];
  }
  env.AURACALL_HOME_DIR = auracallHome;
  env.AURACALL_DISABLE_KEYTAR = '1';
  return env;
}

async function runSourceEntrypoint(
  entrypoint: string,
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsxCli, entrypoint, ...args], {
      cwd: repositoryRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Timed out running ${path.basename(entrypoint)} ${args.join(' ')}.`));
    }, commandTimeoutMs);
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timeout);
      resolve({ code, signal, stdout, stderr });
    });
  });
}

function parseCliJson(result: CommandResult, label: string): Record<string, unknown> {
  assert.equal(result.signal, null, `${label} terminated with ${String(result.signal)}.`);
  assert.equal(result.code, 0, `${label} failed: ${result.stderr.trim()}`);
  try {
    return JSON.parse(result.stdout) as Record<string, unknown>;
  } catch (error) {
    throw new Error(`${label} did not emit JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function readMcpText(content: unknown): string {
  if (!Array.isArray(content)) return '';
  return content
    .filter((entry): entry is { type: 'text'; text: string } =>
      Boolean(entry)
      && typeof entry === 'object'
      && (entry as { type?: unknown }).type === 'text'
      && typeof (entry as { text?: unknown }).text === 'string')
    .map((entry) => entry.text)
    .join('\n');
}

async function callMcpApiStatus(
  client: Client,
  port: number,
  expectedDashboardSessionReady?: boolean,
) {
  return client.callTool({
    name: 'api_status',
    arguments: {
      port,
      ...(expectedDashboardSessionReady === undefined
        ? {}
        : { expectedDashboardSessionReady }),
    },
  }, undefined, { timeout: 10_000 });
}

async function runSmokeCase(
  smokeCase: DashboardSessionReadinessSmokeCase,
  env: NodeJS.ProcessEnv,
  mcpClient: Client,
): Promise<void> {
  const server = await createResponsesHttpServer(
    {
      host: '127.0.0.1',
      port: 0,
      recoverRunsOnStart: false,
      resumeAccountMirrorCompletionsOnStart: false,
      reconcileAccountMirrorLiveFollowOnStart: false,
    },
    {
      env,
      config: {
        api: {
          publicDashboardUrl: 'https://auracall-smoke.example.test/dashboard',
          auth: {
            required: true,
            keys: [smokeCase.key],
          },
        },
      },
    },
  );
  try {
    const statusResponse = await fetch(`http://127.0.0.1:${server.port}/status`);
    assert.equal(statusResponse.status, 200, `${smokeCase.name} /status must return 200.`);
    const statusPayload = await statusResponse.json() as { auth?: unknown };
    assertDashboardSessionReadinessProjection(
      statusPayload.auth,
      smokeCase,
      `${smokeCase.name} HTTP`,
    );

    const cliStatus = await runSourceEntrypoint(
      cliEntrypoint,
      ['api', 'status', '--port', String(server.port), '--json'],
      env,
    );
    const cliPayload = parseCliJson(cliStatus, `${smokeCase.name} CLI status`);
    assertDashboardSessionReadinessProjection(
      cliPayload.auth,
      smokeCase,
      `${smokeCase.name} CLI`,
    );

    const strictCli = await runSourceEntrypoint(
      cliEntrypoint,
      [
        'api',
        'status',
        '--port',
        String(server.port),
        '--expect-dashboard-session-ready',
        '--json',
      ],
      env,
    );
    if (smokeCase.expected.dashboardSessionReady) {
      const strictCliPayload = parseCliJson(strictCli, `${smokeCase.name} strict CLI status`);
      assertDashboardSessionReadinessProjection(
        strictCliPayload.auth,
        smokeCase,
        `${smokeCase.name} strict CLI`,
      );
    } else {
      assert.notEqual(strictCli.code, 0, 'Scoped-only strict CLI status must fail.');
      assert.match(
        strictCli.stderr,
        /Expected auth\.dashboardSessionReady to be true, got false\./u,
        'Scoped-only strict CLI status must report the readiness mismatch.',
      );
    }

    const mcpStatus = await callMcpApiStatus(mcpClient, server.port);
    assert.notEqual(mcpStatus.isError, true, `${smokeCase.name} MCP status must succeed.`);
    const mcpStructured = mcpStatus.structuredContent as { auth?: unknown } | undefined;
    assertDashboardSessionReadinessProjection(
      mcpStructured?.auth,
      smokeCase,
      `${smokeCase.name} MCP`,
    );
    assert.match(
      readMcpText(mcpStatus.content),
      new RegExp(
        `dashboard session required=true ready=${String(smokeCase.expected.dashboardSessionReady)} operatorKeys=${String(smokeCase.expected.operatorKeyCount)}`,
        'u',
      ),
      `${smokeCase.name} MCP text must include readiness.`,
    );

    const strictMcpStatus = await callMcpApiStatus(mcpClient, server.port, true);
    if (smokeCase.expected.dashboardSessionReady) {
      assert.notEqual(strictMcpStatus.isError, true, 'Ready strict MCP status must succeed.');
    } else {
      assert.equal(strictMcpStatus.isError, true, 'Scoped-only strict MCP status must fail.');
      assert.match(
        readMcpText(strictMcpStatus.content),
        /Expected auth\.dashboardSessionReady to be true, got false\./u,
        'Scoped-only strict MCP status must report the readiness mismatch.',
      );
    }

    console.log(
      `${smokeCase.name}: http=${String(smokeCase.expected.dashboardSessionReady)} cli=${String(strictCli.code)} mcp=${strictMcpStatus.isError === true ? 'error' : 'ok'} operatorKeys=${String(smokeCase.expected.operatorKeyCount)}`,
    );
  } finally {
    await server.close();
  }
}

export async function runDashboardSessionReadinessSmoke(): Promise<void> {
  const auracallHome = await mkdtemp(path.join(os.tmpdir(), 'auracall-dashboard-readiness-smoke-'));
  const previousAuracallHome = process.env.AURACALL_HOME_DIR;
  const env = createIsolatedEnvironment(auracallHome);
  process.env.AURACALL_HOME_DIR = auracallHome;
  const client = new Client({
    name: 'auracall-dashboard-session-readiness-smoke',
    version: '0.0.0',
  });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [tsxCli, mcpEntrypoint],
    cwd: repositoryRoot,
    env,
    stderr: 'pipe',
  });
  try {
    await client.connect(transport);
    const tools = await client.listTools(undefined, { timeout: 10_000 });
    assert.ok(tools.tools.some((tool) => tool.name === 'api_status'), 'MCP must list api_status.');
    for (const smokeCase of createDashboardSessionReadinessSmokeCases()) {
      await runSmokeCase(smokeCase, env, client);
    }
    console.log('dashboard-session-readiness smoke: PASS');
  } finally {
    await client.close().catch(() => {});
    transport.close?.();
    if (previousAuracallHome === undefined) {
      delete process.env.AURACALL_HOME_DIR;
    } else {
      process.env.AURACALL_HOME_DIR = previousAuracallHome;
    }
    await rm(auracallHome, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runDashboardSessionReadinessSmoke().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
