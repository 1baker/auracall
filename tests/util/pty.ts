import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import * as ptyRuntime from '@homebridge/node-pty-prebuilt-multiarch';

export { ptyRuntime };
export const ptyAvailable = typeof ptyRuntime.spawn === 'function';

export type PtyStep = {
  /** Substring or regex that must appear in the accumulated output to trigger this step. */
  match: string | RegExp;
  /** Text to write to the PTY once the match is seen (e.g., key sequences). */
  write?: string;
  /** Complete key sequences to write separately when a PTY coalesces burst input. */
  writes?: string[];
  /** Delay between entries in writes. */
  writeIntervalMs?: number;
};

export interface RunPtyResult {
  output: string;
  exitCode: number | null;
  signal: number | null;
  homeDir: string;
  timedOut: boolean;
}

/**
 * Spawn the compiled oracle CLI under a pseudo-TTY and drive it with scripted steps.
 * The caller is responsible for cleaning up the returned homeDir.
 */
export async function runOracleTuiWithPty({
  steps,
  env: envOverrides = {},
  cols = 100,
  rows = 40,
  homeDir,
  killAfterMs,
}: {
  steps: PtyStep[];
  env?: Record<string, string | undefined>;
  cols?: number;
  rows?: number;
  homeDir?: string;
  killAfterMs?: number;
}): Promise<RunPtyResult> {
  const home = homeDir ?? (await fs.mkdtemp(path.join(os.tmpdir(), 'oracle-tui-')));
  const entry = path.join(process.cwd(), 'dist/bin/auracall.js');
  const env = {
    ...process.env,
    // Uppercase env names are intentional for CLI behavior.
    // biome-ignore lint/style/useNamingConvention: env keys stay uppercase
    AURACALL_FORCE_TUI: '1',
    // biome-ignore lint/style/useNamingConvention: env keys stay uppercase
    AURACALL_HOME_DIR: home,
    // biome-ignore lint/style/useNamingConvention: env keys stay uppercase
    FORCE_COLOR: '1',
    // biome-ignore lint/style/useNamingConvention: env keys stay uppercase
    CI: '',
    ...envOverrides,
  } satisfies Record<string, string | undefined>;

  const ps = ptyRuntime.spawn(process.execPath, [entry], {
    name: 'xterm-color',
    cols,
    rows,
    cwd: process.cwd(),
    env,
  });

  let output = '';
  const pending = [...steps];
  const startedAt = Date.now();
  const writeTimers = new Set<ReturnType<typeof setTimeout>>();

  const writeSafely = (text: string): void => {
    try {
      ps.write(text);
    } catch {
      // Ignore write errors if PTY closes between match and write.
    }
  };

  const maybeFlushSteps = (): void => {
    while (pending.length > 0) {
      const step = pending[0];
      const matched =
        typeof step.match === 'string' ? output.includes(step.match) : step.match.test(output);
      const elapsed = Date.now() - startedAt;
      // Fall back to a time-based trigger so the PTY never hangs if the prompt text shifts.
      if (!matched && elapsed < 1_000) {
        break;
      }
      if (step.write) {
        writeSafely(step.write);
      }
      if (step.writes) {
        step.writes.forEach((text, index) => {
          const timer = setTimeout(() => {
            writeTimers.delete(timer);
            writeSafely(text);
          }, index * (step.writeIntervalMs ?? 50));
          writeTimers.add(timer);
        });
      }
      if (matched) {
        pending.shift();
      } else {
        // Keep the step so we retry on the next interval once more output arrives.
        break;
      }
    }
  };

  const flushInterval = setInterval(maybeFlushSteps, 200);

  let timedOut = false;
  const killTimer = setTimeout(() => {
    timedOut = true;
    try {
      ps.kill();
    } catch {
      // The process may have closed between the timer firing and kill.
    }
  }, killAfterMs ?? 15_000);

  ps.onData((data: string) => {
    output += data;
    maybeFlushSteps();
  });

  const exit = await new Promise<{ exitCode: number | null; signal: number | null }>((resolve) => {
    ps.onExit((event) => resolve({
      exitCode: event.exitCode,
      signal: event.signal ?? null,
    }));
  });

  clearTimeout(killTimer);
  for (const timer of writeTimers) {
    clearTimeout(timer);
  }
  clearInterval(flushInterval);

  return { output, ...exit, homeDir: home, timedOut };
}
