import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  collectDeprecatedMcpLaunchErrors,
  collectMcporterMcpConfigErrors,
  collectPackageMcpBinErrors,
} from '../scripts/mcpLaunchContract.js';

describe('current MCP launch contract', () => {
  it('reports deprecated package, npx, Claude, config, and Cursor launch forms', () => {
    expect(
      collectDeprecatedMcpLaunchErrors([
        {
          path: 'README.md',
          text: [
            'npx -y auracall auracall-mcp',
            'pick “oracle” in Cursor',
            'https://cursor.com/install/mcp?name=oracle&config=legacy',
          ].join('\n'),
        },
        {
          path: 'docs/testing/mcp-smoke.md',
          text: [
            'npx -y @steipete/oracle auracall-mcp',
            'claude mcp add --transport stdio oracle -- auracall-mcp',
            '--mcp-config ~/.mcp/oracle.json',
          ].join('\n'),
        },
        {
          path: 'docs/mcp.md',
          text: 'auracall-mcp and claude mcp add --transport stdio auracall -- auracall-mcp',
        },
      ]),
    ).toEqual([
      'README.md: invalid AuraCall npx MCP launch',
      'README.md: retired Oracle Cursor MCP source',
      'README.md: retired Oracle Cursor install link',
      'docs/testing/mcp-smoke.md: retired @steipete/oracle package launch',
      'docs/testing/mcp-smoke.md: retired Oracle Claude MCP registration',
      'docs/testing/mcp-smoke.md: retired Oracle MCP config path',
    ]);
  });

  it('accepts the repository package and mcporter authority', () => {
    expect(collectPackageMcpBinErrors(readFileSync(resolve('package.json'), 'utf8'))).toEqual([]);
    expect(
      collectMcporterMcpConfigErrors(readFileSync(resolve('config/mcporter.json'), 'utf8')),
    ).toEqual([]);
  });

  it('rejects drift in both canonical mcporter entries', () => {
    expect(
      collectMcporterMcpConfigErrors(
        JSON.stringify({
          mcpServers: {
            auracall: { command: 'npx', args: ['auracall', 'auracall-mcp'] },
            'auracall-local': { command: 'node', args: ['dist/other.js'] },
          },
        }),
      ),
    ).toEqual([
      'config/mcporter.json: mcpServers.auracall.command must be auracall-mcp',
      'config/mcporter.json: mcpServers.auracall.args must be []',
      'config/mcporter.json: mcpServers.auracall-local.args must be ["../dist/bin/auracall-mcp.js"]',
    ]);
  });
});
