import { describe, expect, test, vi } from 'vitest';
import {
  ensureChatgptComposerTool,
  isNonPersistentComposerToolForTest,
  prepareChatgptWorkbenchLocalAttachment,
  resolveChatgptWorkbenchAttachmentSurfaceForTest,
  resolveComposerToolCandidatesForTest,
  resolveComposerToolLocationForTest,
  resolveCurrentComposerToolSelectionForTest,
} from '../../src/browser/actions/chatgptComposerTool.js';

describe('chatgpt composer tool selection', () => {
  test('normalizes aliases to the current visible tool labels', () => {
    expect(resolveComposerToolCandidatesForTest('web-search')).toEqual(['web search']);
    expect(resolveComposerToolCandidatesForTest('search')).toEqual(['search', 'web search']);
    expect(resolveComposerToolCandidatesForTest('research')).toEqual(['research', 'deep research']);
    expect(resolveComposerToolCandidatesForTest('image')).toEqual(['image', 'create image']);
    expect(resolveComposerToolCandidatesForTest('knowledge')).toEqual(['knowledge', 'company knowledge']);
    expect(resolveComposerToolCandidatesForTest('study')).toEqual(['study', 'study and learn']);
    expect(resolveComposerToolCandidatesForTest('agent')).toEqual(['agent', 'agent mode']);
    expect(resolveComposerToolCandidatesForTest('quickbooks')).toEqual(['quickbooks', 'intuit quickbooks']);
    expect(resolveComposerToolCandidatesForTest('quiz')).toEqual(['quiz', 'quizzes']);
    expect(resolveComposerToolCandidatesForTest('gh')).toEqual(['gh', 'github']);
    expect(resolveComposerToolCandidatesForTest('google-drive')).toEqual(['google drive']);
  });

  test('keeps manifest-owned known labels available for current-selection detection', () => {
    expect(
      resolveCurrentComposerToolSelectionForTest(null, [], [{ label: 'canvas', selected: true }]),
    ).toEqual({ label: 'canvas', source: 'more-menu' });
  });

  test('classifies Deep Research as a non-persistent staged tool', () => {
    expect(isNonPersistentComposerToolForTest('deep-research')).toBe(true);
    expect(isNonPersistentComposerToolForTest('research')).toBe(true);
    expect(isNonPersistentComposerToolForTest('web-search')).toBe(false);
    expect(isNonPersistentComposerToolForTest('canvas')).toBe(false);
  });

  test('classifies tools as top-level or More submenu choices', () => {
    expect(
      resolveComposerToolLocationForTest('web-search', ['company knowledge', 'create image', 'deep research', 'web search', 'more']),
    ).toEqual({ location: 'top', label: 'web search' });
    expect(
      resolveComposerToolLocationForTest(
        'canvas',
        ['company knowledge', 'create image', 'deep research', 'web search', 'more'],
        ['study and learn', 'agent mode', 'canvas', 'github'],
      ),
    ).toEqual({ location: 'more', label: 'canvas' });
    expect(resolveComposerToolLocationForTest('calendar', ['company knowledge', 'create image', 'more'], ['github'])).toEqual({
      location: 'missing',
    });
  });

  test('does not treat current workbench file-source rows as composer tools', () => {
    const currentRows = [
      'add photos & files',
      'add from library',
      'create image',
      'web search',
    ];
    expect(resolveComposerToolLocationForTest('photos', currentRows)).toEqual({ location: 'missing' });
    expect(resolveComposerToolLocationForTest('library', currentRows)).toEqual({ location: 'missing' });
    expect(resolveComposerToolLocationForTest('image', currentRows)).toEqual({
      location: 'top',
      label: 'create image',
    });
  });

  test('routes local files and the provider library drawer away from composer-tool selection', async () => {
    const client = {} as Parameters<typeof ensureChatgptComposerTool>[0];
    const logger = () => undefined;
    await expect(ensureChatgptComposerTool(client, 'files', logger)).rejects.toThrow(/Use --file/);
    await expect(ensureChatgptComposerTool(client, 'library', logger)).rejects.toThrow(/separate interactive provider drawer/);
  });

  test('recognizes the current workbench attachment rows and unrestricted local upload input', () => {
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'legacy-popover',
        rows: [
          { label: 'Add photos & files', description: 'Upload from computer' },
          { label: 'Add from library', description: 'Browse and search your files' },
          { label: 'Web search', description: 'Find real-time news and info' },
        ],
        inputs: [
          { id: 'upload-files', ariaLabel: null, accept: null, multiple: true },
          { id: 'upload-photos', ariaLabel: null, accept: 'image/*', multiple: true },
        ],
      }),
    ).toEqual({
      status: 'ready',
      inputSelector: '#upload-files',
      localFileLabel: 'Add photos & files',
      libraryLabel: 'Add from library',
    });
  });

  test('recognizes the current home-menu action and exact unrestricted Attach files chooser', () => {
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'composer-home-top-menu',
        rows: [
          { label: 'Add photos & files', description: '' },
          { label: 'Add library files', description: '' },
          { label: 'Create image', description: 'Visualize anything' },
        ],
        inputs: [
          { id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true },
          { id: '_r_55_', ariaLabel: 'Attach photos', accept: 'image/*', multiple: true },
          { id: '_r_56_', ariaLabel: 'Attach photos or videos', accept: 'image/*,video/*', multiple: true },
        ],
      }),
    ).toEqual({
      status: 'ready',
      inputSelector: 'input[type="file"][aria-label="Attach files"]',
      localFileLabel: 'Add photos & files',
      libraryLabel: 'Add library files',
    });
  });

  test('reads the current open workbench surface before returning the exact local input', async () => {
    const evaluate = vi.fn().mockImplementation(async ({ expression }: { expression?: string }) => {
      const source = String(expression ?? '');
      if (source.includes('data-auracall-chatgpt-composer-menu')) {
        return {
          result: {
            value: {
              selector: '[data-auracall-chatgpt-composer-menu="true"]',
              sourceSelector: '.composer-home-top-menu',
              signature: 'current-workbench',
              rect: { x: 0, y: 0, width: 400, height: 600 },
              distanceToAnchor: null,
              items: [],
              itemLabels: [],
            },
          },
        };
      }
      if (source.includes('const rows = root')) {
        return {
          result: {
            value: {
              surface: 'composer-home-top-menu',
              rows: [
                { label: 'Add photos & files', description: '' },
                { label: 'Add library files', description: '' },
              ],
              inputs: [{ id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true }],
            },
          },
        };
      }
      return { result: { value: true } };
    });
    const surface = await prepareChatgptWorkbenchLocalAttachment({
      runtime: { evaluate } as unknown as Parameters<
        typeof prepareChatgptWorkbenchLocalAttachment
      >[0]['runtime'],
      input: {} as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['input'],
      page: {} as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['page'],
    });
    expect(surface).toMatchObject({
      status: 'ready',
      inputSelector: 'input[type="file"][aria-label="Attach files"]',
    });
    expect(evaluate).toHaveBeenCalledWith(expect.objectContaining({ returnByValue: true }));
  });

  test('brings a retained tab forward and uses a trusted-pointer attachment trigger', async () => {
    const events: string[] = [];
    let popoverReads = 0;
    const evaluate = vi.fn().mockImplementation(async ({ expression }: { expression?: string }) => {
      const source = String(expression ?? '');
      if (source.includes('data-auracall-chatgpt-composer-menu')) {
        popoverReads += 1;
        return {
          result: {
            value:
              popoverReads === 1
                ? null
                : {
                    selector: '[data-auracall-chatgpt-composer-menu="true"]',
                    sourceSelector: '.composer-home-top-menu',
                    signature: 'current-workbench',
                    rect: { x: 0, y: 0, width: 400, height: 600 },
                    distanceToAnchor: null,
                    items: [],
                    itemLabels: [],
                  },
          },
        };
      }
      if (source.includes('const stateKey =') && source.includes('candidate.scrollIntoView')) {
        events.push('trusted-target');
        return {
          result: {
            value: {
              ok: true,
              center: { x: 24.4, y: 24.4 },
              matchedLabel: 'add files and more',
              rootSelectorUsed: 'document',
            },
          },
        };
      }
      if (source.includes('const finish =') && source.includes('performance.now() + 2500')) {
        return { result: { value: { trusted: true, ready: true } } };
      }
      if (source.includes('const rows = root')) {
        return {
          result: {
            value: {
              surface: 'composer-home-top-menu',
              rows: [
                { label: 'Add photos & files', description: '' },
                { label: 'Add library files', description: '' },
              ],
              inputs: [{ id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true }],
            },
          },
        };
      }
      return { result: { value: false } };
    });
    const input = {
      dispatchKeyEvent: vi.fn().mockResolvedValue(undefined),
      dispatchMouseEvent: vi.fn().mockResolvedValue(undefined),
    };
    const page = {
      bringToFront: vi.fn().mockImplementation(async () => {
        events.push('front');
      }),
    };

    const surface = await prepareChatgptWorkbenchLocalAttachment({
      runtime: { evaluate } as unknown as Parameters<
        typeof prepareChatgptWorkbenchLocalAttachment
      >[0]['runtime'],
      input: input as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['input'],
      page: page as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['page'],
    });

    expect(surface).toMatchObject({
      status: 'ready',
      inputSelector: 'input[type="file"][aria-label="Attach files"]',
    });
    expect(events).toEqual(['front', 'trusted-target']);
    expect(input.dispatchMouseEvent).toHaveBeenCalledTimes(3);
    expect(input.dispatchMouseEvent).toHaveBeenNthCalledWith(2, {
      type: 'mousePressed',
      x: 24,
      y: 24,
      button: 'left',
      clickCount: 1,
    });
  });

  test('re-resolves the exact attachment opener once after project-shell hydration replaces it', async () => {
    let popoverReads = 0;
    let readinessReads = 0;
    const evaluate = vi.fn().mockImplementation(async ({ expression }: { expression?: string }) => {
      const source = String(expression ?? '');
      if (source.includes('data-auracall-chatgpt-composer-menu')) {
        popoverReads += 1;
        return {
          result: {
            value:
              popoverReads < 3
                ? null
                : {
                    selector: '[data-auracall-chatgpt-composer-menu="true"]',
                    sourceSelector: '.composer-home-top-menu',
                    signature: 'hydrated-workbench',
                    rect: { x: 0, y: 0, width: 400, height: 600 },
                    distanceToAnchor: null,
                    items: [],
                    itemLabels: [],
                  },
          },
        };
      }
      if (source.includes('const stateKey =') && source.includes('candidate.scrollIntoView')) {
        return { result: { value: { ok: true, center: { x: 24, y: 24 } } } };
      }
      if (source.includes('const finish =') && source.includes('performance.now() + 2500')) {
        readinessReads += 1;
        return {
          result: {
            value:
              readinessReads === 1
                ? { trusted: true, ready: false }
                : { trusted: true, ready: true },
          },
        };
      }
      if (source.includes('const rows = root')) {
        return {
          result: {
            value: {
              surface: 'composer-home-top-menu',
              rows: [
                { label: 'Add photos & files', description: '' },
                { label: 'Add library files', description: '' },
              ],
              inputs: [{ id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true }],
            },
          },
        };
      }
      return { result: { value: false } };
    });
    const input = {
      dispatchKeyEvent: vi.fn().mockResolvedValue(undefined),
      dispatchMouseEvent: vi.fn().mockResolvedValue(undefined),
    };
    const page = { bringToFront: vi.fn().mockResolvedValue(undefined) };

    await expect(
      prepareChatgptWorkbenchLocalAttachment({
        runtime: { evaluate } as unknown as Parameters<
          typeof prepareChatgptWorkbenchLocalAttachment
        >[0]['runtime'],
        input: input as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['input'],
        page: page as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['page'],
      }),
    ).resolves.toMatchObject({
      status: 'ready',
      inputSelector: 'input[type="file"][aria-label="Attach files"]',
    });

    expect(page.bringToFront).toHaveBeenCalledTimes(2);
    expect(input.dispatchMouseEvent).toHaveBeenCalledTimes(6);
    expect(readinessReads).toBe(2);
  });

  test('fails closed after two exact trusted-pointer opener attempts', async () => {
    let targetReads = 0;
    const evaluate = vi.fn().mockImplementation(async ({ expression }: { expression?: string }) => {
      const source = String(expression ?? '');
      if (source.includes('data-auracall-chatgpt-composer-menu')) {
        return { result: { value: null } };
      }
      if (source.includes('const stateKey =') && source.includes('candidate.scrollIntoView')) {
        targetReads += 1;
        return { result: { value: { ok: false, reason: 'target-not-found' } } };
      }
      return { result: { value: false } };
    });

    await expect(
      prepareChatgptWorkbenchLocalAttachment({
        runtime: { evaluate } as unknown as Parameters<
          typeof prepareChatgptWorkbenchLocalAttachment
        >[0]['runtime'],
        input: {
          dispatchKeyEvent: vi.fn().mockResolvedValue(undefined),
          dispatchMouseEvent: vi.fn().mockResolvedValue(undefined),
        } as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['input'],
        page: { bringToFront: vi.fn().mockResolvedValue(undefined) } as unknown as Parameters<
          typeof prepareChatgptWorkbenchLocalAttachment
        >[0]['page'],
      }),
    ).resolves.toEqual({ status: 'menu-not-found' });

    expect(targetReads).toBe(2);
  });

  test('keeps the page readiness deadline separate from broker transport latency', async () => {
    vi.useFakeTimers();
    let popoverReads = 0;
    let targetCall: Record<string, unknown> | undefined;
    let readinessCall: Record<string, unknown> | undefined;
    let markReadinessStarted: (() => void) | undefined;
    const readinessStarted = new Promise<void>((resolve) => {
      markReadinessStarted = resolve;
    });
    const evaluate = vi.fn().mockImplementation(async (params: Record<string, unknown>) => {
      const source = String(params.expression ?? '');
      if (source.includes('data-auracall-chatgpt-composer-menu')) {
        popoverReads += 1;
        return {
          result: {
            value:
              popoverReads === 1
                ? null
                : {
                    selector: '[data-auracall-chatgpt-composer-menu="true"]',
                    sourceSelector: '.composer-home-top-menu',
                    signature: 'current-workbench',
                    rect: { x: 0, y: 0, width: 400, height: 600 },
                    distanceToAnchor: null,
                    items: [],
                    itemLabels: [],
                  },
          },
        };
      }
      if (source.includes('const stateKey =') && source.includes('candidate.scrollIntoView')) {
        targetCall = params;
        return {
          result: {
            value: {
              ok: true,
              center: { x: 24, y: 24 },
              matchedLabel: 'add files and more',
              rootSelectorUsed: 'document',
            },
          },
        };
      }
      if (source.includes('const finish =') && source.includes('performance.now() + 2500')) {
        readinessCall = params;
        markReadinessStarted?.();
        return new Promise((resolve) => {
          setTimeout(() => resolve({ result: { value: { trusted: true, ready: true } } }), 2_600);
        });
      }
      if (source.includes('const rows = root')) {
        return {
          result: {
            value: {
              surface: 'composer-home-top-menu',
              rows: [{ label: 'Add photos & files', description: '' }],
              inputs: [{ id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true }],
            },
          },
        };
      }
      return { result: { value: false } };
    });
    const input = {
      dispatchKeyEvent: vi.fn().mockResolvedValue(undefined),
      dispatchMouseEvent: vi.fn().mockResolvedValue(undefined),
    };

    try {
      const pending = prepareChatgptWorkbenchLocalAttachment({
        runtime: { evaluate } as unknown as Parameters<
          typeof prepareChatgptWorkbenchLocalAttachment
        >[0]['runtime'],
        input: input as unknown as Parameters<typeof prepareChatgptWorkbenchLocalAttachment>[0]['input'],
        page: { bringToFront: vi.fn().mockResolvedValue(undefined) } as unknown as Parameters<
          typeof prepareChatgptWorkbenchLocalAttachment
        >[0]['page'],
      });
      await readinessStarted;
      await vi.advanceTimersByTimeAsync(2_600);
      await expect(pending).resolves.toMatchObject({
        status: 'ready',
        inputSelector: 'input[type="file"][aria-label="Attach files"]',
      });

      expect(targetCall).toMatchObject({ returnByValue: true });
      expect(targetCall).not.toHaveProperty('timeout');
      expect(targetCall).toMatchObject({ awaitPromise: true });
      expect(String(targetCall?.expression)).toContain('performance.now() + 15000');
      expect(String(targetCall?.expression)).toContain('button[aria-label=\\"Add files and more\\"]');
      expect(readinessCall).toMatchObject({ returnByValue: true, awaitPromise: true });
      expect(readinessCall).not.toHaveProperty('timeout');
    } finally {
      vi.useRealTimers();
    }
  });

  test('accepts an optional provider library row but fails closed on generic input drift', () => {
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'legacy-popover',
        rows: [{ label: 'Add photos & files', description: 'Upload from computer' }],
        inputs: [{ id: 'upload-files', ariaLabel: null, accept: null, multiple: true }],
      }),
    ).toEqual({
      status: 'ready',
      inputSelector: '#upload-files',
      localFileLabel: 'Add photos & files',
      libraryLabel: null,
    });
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'legacy-popover',
        rows: [
          { label: 'Add photos & files', description: 'Upload from computer' },
          { label: 'Add from library', description: 'Browse and search your files' },
        ],
        inputs: [{ id: 'upload-files', ariaLabel: null, accept: 'image/*', multiple: true }],
      }),
    ).toEqual({ status: 'file-input-restricted' });

    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'composer-home-top-menu',
        rows: [{ label: 'Add photos & files', description: '' }],
        inputs: [{ id: '_r_54_', ariaLabel: 'Upload files', accept: null, multiple: true }],
      }),
    ).toEqual({ status: 'file-input-not-found' });
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'composer-home-top-menu',
        rows: [{ label: 'Add photos & files', description: '' }],
        inputs: [
          { id: '_r_54_', ariaLabel: 'Attach files', accept: null, multiple: true },
          { id: '_r_99_', ariaLabel: 'Attach files', accept: null, multiple: true },
        ],
      }),
    ).toEqual({ status: 'file-input-ambiguous' });
    expect(
      resolveChatgptWorkbenchAttachmentSurfaceForTest({
        surface: 'composer-home-top-menu',
        rows: [{ label: 'Add photos & files', description: '' }],
        inputs: [{ id: '_r_54_', ariaLabel: 'Attach files', accept: 'text/plain', multiple: true }],
      }),
    ).toEqual({ status: 'file-input-restricted' });
  });

  test('prefers visible composer chip when reading current tool state', () => {
    expect(
      resolveCurrentComposerToolSelectionForTest('Canvas', [{ label: 'web search', selected: true }], []),
    ).toEqual({ label: 'Canvas', source: 'chip' });
  });

  test('accepts a dynamically installed app from its explicit composer pill', () => {
    expect(
      resolveCurrentComposerToolSelectionForTest('Custom CRM', [], []),
    ).toEqual({ label: 'Custom CRM', source: 'chip' });
  });

  test('reads current tool state from selected top-level or More menu rows when chip is absent', () => {
    expect(
      resolveCurrentComposerToolSelectionForTest(null, [
        { label: 'company knowledge', selected: true },
        { label: 'web search', selected: true },
      ], []),
    ).toEqual({ label: 'web search', source: 'top-menu' });

    expect(
      resolveCurrentComposerToolSelectionForTest(null, [{ label: 'more', selected: false }], [
        { label: 'google drive', selected: false },
        { label: 'canvas', selected: true },
      ]),
    ).toEqual({ label: 'canvas', source: 'more-menu' });
  });
});
