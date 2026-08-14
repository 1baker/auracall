import { describe, expect, it } from 'vitest';
import {
  collectAbsoluteCheckoutMarkdownLinks,
  collectCurrentDocAbsoluteLinkErrors,
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
});
