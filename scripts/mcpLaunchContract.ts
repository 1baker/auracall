type CurrentArtifact = { path: string; text: string };

type DeprecatedMcpPattern = {
  label: string;
  pattern: RegExp;
};

const DEPRECATED_MCP_PATTERNS: readonly DeprecatedMcpPattern[] = [
  {
    label: 'retired @steipete/oracle package launch',
    pattern: /@steipete\/oracle/gu,
  },
  {
    label: 'invalid AuraCall npx MCP launch',
    pattern: /\bnpx(?:\s+-y)?\s+auracall\s+auracall-mcp\b/gu,
  },
  {
    label: 'retired Oracle Claude MCP registration',
    pattern: /\bclaude\s+mcp\s+add[^\n]*\soracle\s+--\s+auracall-mcp\b/gu,
  },
  {
    label: 'retired Oracle MCP config path',
    pattern: /\.mcp\/oracle\.json\b/gu,
  },
  {
    label: 'retired Oracle Cursor MCP source',
    pattern: /\bpick\s+[“"']oracle[”"']\s+in\s+Cursor/giu,
  },
  {
    label: 'retired Oracle Cursor install link',
    pattern: /cursor\.com\/[^\s)]*[?&]name=oracle(?:[&#)]|$)/giu,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRecord(text: string, label: string, errors: string[]): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed)) {
      errors.push(`${label}: expected a JSON object`);
      return null;
    }
    return parsed;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    errors.push(`${label}: invalid JSON (${detail})`);
    return null;
  }
}

function hasPattern(text: string, pattern: RegExp): boolean {
  pattern.lastIndex = 0;
  return pattern.test(text);
}

export function collectDeprecatedMcpLaunchErrors(
  artifacts: ReadonlyArray<CurrentArtifact>,
): string[] {
  return artifacts.flatMap((artifact) =>
    DEPRECATED_MCP_PATTERNS.filter(({ pattern }) => hasPattern(artifact.text, pattern)).map(
      ({ label }) => `${artifact.path}: ${label}`,
    ),
  );
}

export function collectPackageMcpBinErrors(packageText: string): string[] {
  const errors: string[] = [];
  const packageJson = parseRecord(packageText, 'package.json', errors);
  if (!packageJson) {
    return errors;
  }
  if (packageJson.name !== 'auracall') {
    errors.push('package.json: package name must be auracall');
  }
  const bin = packageJson.bin;
  if (!isRecord(bin) || bin['auracall-mcp'] !== 'dist/bin/auracall-mcp.js') {
    errors.push('package.json: auracall-mcp bin must target dist/bin/auracall-mcp.js');
  }
  return errors;
}

function collectServerEntryErrors(
  servers: Record<string, unknown>,
  serverId: string,
  expectedCommand: string,
  expectedArgs: readonly string[],
): string[] {
  const prefix = `config/mcporter.json: mcpServers.${serverId}`;
  const entry = servers[serverId];
  if (!isRecord(entry)) {
    return [`${prefix} must be an object`];
  }
  const errors: string[] = [];
  if (entry.command !== expectedCommand) {
    errors.push(`${prefix}.command must be ${expectedCommand}`);
  }
  if (
    !Array.isArray(entry.args) ||
    entry.args.length !== expectedArgs.length ||
    entry.args.some((arg, index) => arg !== expectedArgs[index])
  ) {
    errors.push(`${prefix}.args must be ${JSON.stringify(expectedArgs)}`);
  }
  return errors;
}

export function collectMcporterMcpConfigErrors(configText: string): string[] {
  const errors: string[] = [];
  const config = parseRecord(configText, 'config/mcporter.json', errors);
  if (!config) {
    return errors;
  }
  const servers = config.mcpServers;
  if (!isRecord(servers)) {
    errors.push('config/mcporter.json: mcpServers must be an object');
    return errors;
  }
  errors.push(...collectServerEntryErrors(servers, 'auracall', 'auracall-mcp', []));
  errors.push(
    ...collectServerEntryErrors(servers, 'auracall-local', 'node', [
      '../dist/bin/auracall-mcp.js',
    ]),
  );
  return errors;
}
