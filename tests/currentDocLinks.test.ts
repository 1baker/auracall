import { describe, expect, it } from 'vitest';
import {
  collectAbsoluteCheckoutMarkdownLinks,
  collectConcreteUserHomeRoots,
  collectCurrentDocAbsoluteLinkErrors,
  collectCurrentDocConcreteUserPathErrors,
  collectCurrentDocRetiredCheckoutErrors,
} from '../scripts/currentDocLinks.js';

describe('current documentation link portability audit', () => {
  it('collects unique machine-specific Markdown targets without flagging relative or web links', () => {
    const markdown = [
      '[source](/home/example/workspace/auracall/src/config.ts)',
      '[source duplicate](/home/example/workspace/auracall/src/config.ts)',
      '[Windows mount](/mnt/c/Users/example/auracall/README.md)',
      '[portable](../src/config.ts)',
      '[API route](/v1/responses)',
      '[web](https://example.com/docs)',
    ].join('\n');

    expect(collectAbsoluteCheckoutMarkdownLinks(markdown)).toEqual([
      '/home/example/workspace/auracall/src/config.ts',
      '/mnt/c/Users/example/auracall/README.md',
    ]);
  });

  it('reports absolute checkout links with their current document paths', () => {
    expect(
      collectCurrentDocAbsoluteLinkErrors([
        {
          path: 'docs/testing.md',
          text: '[plan](/Users/example/auracall/docs/dev/plans/example.md)',
        },
        { path: 'README.md', text: '[portable](docs/testing.md)' },
      ]),
    ).toEqual([
      'docs/testing.md: absolute checkout Markdown link /Users/example/auracall/docs/dev/plans/example.md',
    ]);
  });

  it('reports retired checkout content outside Markdown links', () => {
    expect(
      collectCurrentDocRetiredCheckoutErrors([
        {
          path: 'README.md',
          text: '--allow-local-cwd-root /home/ecochran76/workspace.local/auracall',
        },
        {
          path: 'docs/manual-tests.md',
          text: '--allow-local-cwd-root "$AURACALL_REPO_ROOT"',
        },
      ]),
    ).toEqual([
      'README.md: contains retired checkout path /home/ecochran76/workspace.local/auracall',
    ]);
  });

  it('collects named Unix, macOS, and Windows user roots while allowing generic examples', () => {
    const markdown = [
      '/home/alice/.auracall/config.json',
      '/Users/bob/Library/Application Support/AuraCall',
      '/mnt/c/Users/carol/AppData/Local/AuraCall',
      String.raw`C:\Users\dave\AppData\Local\AuraCall`,
      '/home/<you>/.auracall/config.json',
      '/Users/me/.auracall/config.json',
      String.raw`C:\Users\<you>\AppData\Local\AuraCall`,
      '/home/$USER/.auracall/config.json',
      `/home/\${USER}/.auracall/config.json`,
      String.raw`C:\Users\%USERNAME%\AppData\Local\AuraCall`,
      '/Users/Shared/AuraCall',
    ].join('\n');

    expect(collectConcreteUserHomeRoots(markdown)).toEqual([
      '/home/alice',
      '/Users/bob',
      '/Users/carol',
      String.raw`\Users\dave`,
    ]);
  });

  it('reports each unique concrete user root with its current document path', () => {
    expect(
      collectCurrentDocConcreteUserPathErrors([
        {
          path: 'docs/windows-work.md',
          text: '/mnt/c/Users/alice/profile and C:\\Users\\alice\\profile',
        },
        {
          path: 'docs/configuration.md',
          text: '/home/<you>/.auracall and /Users/me/.auracall',
        },
      ]),
    ).toEqual([
      'docs/windows-work.md: concrete user-home path /Users/alice',
      'docs/windows-work.md: concrete user-home path \\Users\\alice',
    ]);
  });
});
