import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { spawn } from 'node:child_process';
import { renderMarkdownAnsi } from '../../src/cli/markdownRenderer.js';
import { ptyRuntime } from '../util/pty.js';
const TOKENIZER_STUB = path.join(process.cwd(), 'tests', 'fixtures', 'tokenizer-stub.cjs');
import { build } from 'esbuild';
const NODE_BIN = process.execPath;

/**
 * Spawn a tiny TS script inside a pseudo-TTY so runOracle believes it is on a rich terminal.
 * The script streams the provided chunks through runOracle with a stub client.
 */
async function runPtyStreaming({
  chunks,
  delays = [],
  renderPlain = false,
  resizeAfterMs,
  interruptAfterText,
}: {
  chunks: string[];
  delays?: number[];
  renderPlain?: boolean;
  resizeAfterMs?: number;
  interruptAfterText?: string;
}): Promise<{ output: string; exitCode: number | null; signal: string | null }> {
  // Build a tiny self-contained CJS bundle so the child needs no loader flags.
  const bundlePath = path.join(os.tmpdir(), `auracall-pty-${Date.now()}.cjs`);
  const entry = `
    import { runOracle } from '${path.posix.join(process.cwd(), 'src/oracle/run.ts').replace(/\\/g, '/')}';
    void (async () => {
      const chunks = JSON.parse(process.env.CHUNKS);
      const delays = JSON.parse(process.env.DELAYS || '[]');
      const renderPlain = process.env.RENDER_PLAIN === '1';
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const full = chunks.join('');
      const finalResponse = { id: 'resp', status: 'completed', usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 }, output: [{ type: 'text', text: full }] };
      const stream = {
        async *[Symbol.asyncIterator]() {
          for (let i = 0; i < chunks.length; i += 1) {
            if (delays[i]) await wait(Number(delays[i]));
            yield { type: 'chunk', delta: chunks[i] };
          }
        },
        finalResponse: async () => finalResponse,
      };
      const clientFactory = () => ({ responses: { stream: async () => stream, create: async () => finalResponse, retrieve: async () => finalResponse } });
      await runOracle({ prompt: 'p', model: 'gpt-5.1', search: false, renderPlain }, { clientFactory, write: () => true, log: (m) => console.log(m ?? ''), wait });
    })().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  `;
  await build({
    stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'pty-entry.ts' },
    outfile: bundlePath,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    alias: {
      'gpt-tokenizer/model/gpt-5': TOKENIZER_STUB,
      'gpt-tokenizer/model/gpt-5-pro': TOKENIZER_STUB,
      '@anthropic-ai/tokenizer': TOKENIZER_STUB,
    },
    sourcemap: false,
    write: true,
  });

  const env = {
    ...process.env,
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    CHUNKS: JSON.stringify(chunks),
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    DELAYS: JSON.stringify(delays),
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    RENDER_PLAIN: renderPlain ? '1' : '0',
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? 'sk-test',
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    NODE_PATH: `${process.cwd()}/node_modules`,
    // Force color so we can assert ANSI when tty is present.
    // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
    FORCE_COLOR: '1',
  } satisfies Record<string, string | undefined>;

  const ps = ptyRuntime.spawn(NODE_BIN, [bundlePath], {
    cols: 100,
    rows: 40,
    env,
  });

  let output = '';
  let interruptSent = false;
  ps.onData((d: string) => {
    output += d;
    if (!interruptSent && interruptAfterText && output.includes(interruptAfterText)) {
      interruptSent = true;
      setTimeout(() => ps.write('\u0003'), 50);
    }
  });

  if (resizeAfterMs != null) {
    setTimeout(() => ps.resize(60, 20), resizeAfterMs);
  }
  const { exitCode, signal } = await new Promise<{ exitCode: number | null; signal: number | null }>((resolve) => {
    ps.onExit((event) => resolve({
      exitCode: event.exitCode,
      signal: event.signal ?? null,
    }));
  });
  try {
    await fs.promises.unlink(bundlePath);
  } catch {}
  return { output, exitCode, signal: signal == null ? null : signal.toString() };
}

describe('runOracle streaming via PTY', () => {
  it('renders once in rich TTY (ANSI present, no duplicate body)', async () => {
    const { output, exitCode } = await runPtyStreaming({
      chunks: ['# Title\n', '- item\n'],
      delays: [0, 5],
    });
    expect(exitCode).toBe(0);
    expect(output).toContain('Title');
    expect(output.match(/Title/g)?.length).toBe(1);
    expect(output).toContain('\u001b['); // ANSI color should be applied in TTY
  });

  it('streams source markdown unchanged when render-plain is requested', async () => {
    const { output, exitCode } = await runPtyStreaming({
      chunks: ['`code`', ' plain'],
      renderPlain: true,
    });
    expect(exitCode).toBe(0);
    expect(output).toContain('`code` plain');
  });

  it('survives terminal resize mid-stream', async () => {
    const { output, exitCode } = await runPtyStreaming({
      chunks: ['One ', 'two ', 'three'],
      delays: [0, 10, 10],
      resizeAfterMs: 5,
    });
    expect(exitCode).toBe(0);
    expect(output).toContain('One two three');
  });

  it('handles Ctrl+C interrupt while streaming', async () => {
    const { output } = await runPtyStreaming({
      chunks: ['long running ', 'stream that ', 'should be interrupted'],
      delays: [0, 2_000, 2_000],
      interruptAfterText: 'Answer:',
    });
    expect(output).toContain('Answer:');
    expect(output).not.toContain('should be interrupted');
  });

  it('prints once in non-TTY mode (no ANSI)', async () => {
    const scriptPath = path.join(os.tmpdir(), `auracall-nontty-${Date.now()}.cjs`);
    const chunks = ['# Head\n', 'body'];
    const script = `
      import { runOracle } from '${path.posix.join(process.cwd(), 'src/oracle/run.ts').replace(/\\/g, '/')}';
      void (async () => {
        const chunks = ${JSON.stringify(chunks)};
        const finalResponse = { id: 'resp', status: 'completed', usage: {}, output: [{ type: 'text', text: chunks.join('') }] };
        const stream = { async *[Symbol.asyncIterator]() { for (const c of chunks) { yield { type: 'chunk', delta: c }; } }, finalResponse: async () => finalResponse };
        const clientFactory = () => ({ responses: { stream: async () => stream, create: async () => finalResponse, retrieve: async () => finalResponse } });
        await runOracle({ prompt: 'p', model: 'gpt-5.1', search: false }, { clientFactory, write: () => true, log: () => {} });
      })().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
    `;
    await build({
      stdin: { contents: script, resolveDir: process.cwd(), sourcefile: 'nontty.ts' },
      outfile: scriptPath,
      bundle: true,
      format: 'cjs',
      platform: 'node',
      target: 'node18',
      alias: {
        'gpt-tokenizer/model/gpt-5': TOKENIZER_STUB,
        'gpt-tokenizer/model/gpt-5-pro': TOKENIZER_STUB,
        '@anthropic-ai/tokenizer': TOKENIZER_STUB,
      },
      sourcemap: false,
      write: true,
    });
    const proc = spawn(NODE_BIN, [scriptPath], {
      env: {
        ...process.env,
        // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
        FORCE_COLOR: '0',
        // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? 'sk-test',
        // biome-ignore lint/style/useNamingConvention: env keys intentionally uppercase
        NODE_PATH: `${process.cwd()}/node_modules`,
      },
    });
    let stdout = '';
    proc.stdout.on('data', (d) => {
      stdout += String(d);
    });
    let stderr = '';
    proc.stderr.on('data', (d) => {
      stderr += String(d);
    });
    const code: number = await new Promise((resolve) => proc.on('close', resolve));
    fs.unlinkSync(scriptPath);
    expect({ code, stderr }).toEqual({ code: 0, stderr: '' });
    expect(stdout).toContain('# Head');
    expect(stdout.match(/# Head/g)?.length).toBe(1);
    expect(stdout).not.toContain('\u001b[');
  });
});

describe('chunk-boundary fuzzing', () => {
  it('final render matches full render across random chunk splits', () => {
    const base = '# Title\n- item 1\n- item 2\n\n```\ncode\n```\n';
    const expected = renderMarkdownAnsi(base);
    for (let i = 0; i < 20; i += 1) {
      const chunks: string[] = [];
      let cursor = 0;
      while (cursor < base.length) {
        const next = Math.min(base.length, cursor + randomInt(1, 6));
        chunks.push(base.slice(cursor, next));
        cursor = next;
      }
      const combined = chunks.join('');
      expect(combined).toBe(base);
      const rendered = renderMarkdownAnsi(combined);
      expect(rendered).toBe(expected);
    }
  });
});
