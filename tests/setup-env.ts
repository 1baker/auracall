import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll } from 'vitest';

// Ensure API keys are present during tests so runOracle doesn't fail early when CI
// runs without real credentials.
process.env.OPENAI_API_KEY ||= 'sk-test';
process.env.GEMINI_API_KEY ||= 'gm-test';
process.env.AURACALL_MIN_PROMPT_CHARS ||= '1';

// Every test worker gets a disposable default AuraCall home. Individual tests
// can still use setAuracallHomeDirOverrideForTest(), but clearing that override
// must never fall through to the operator's real ~/.auracall state.
const originalAuracallHomeDir = process.env.AURACALL_HOME_DIR;
const testAuracallHomeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auracall-vitest-'));
process.env.AURACALL_HOME_DIR = testAuracallHomeDir;

afterAll(() => {
  if (originalAuracallHomeDir === undefined) {
    delete process.env.AURACALL_HOME_DIR;
  } else {
    process.env.AURACALL_HOME_DIR = originalAuracallHomeDir;
  }
  fs.rmSync(testAuracallHomeDir, { recursive: true, force: true });
});
