import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { setAuracallHomeDirOverrideForTest } from '../src/auracallHome.js';
import { createExecutionRunnerRecord } from '../src/runtime/model.js';
import {
  createExecutionRunnerRecordStore,
  decodeExecutionRunnerDirectoryName,
  deleteExecutionRunnerRecord,
  encodeExecutionRunnerDirectoryName,
  ensureExecutionRunnerStorage,
  getExecutionRunnerDir,
  getExecutionRunnerPath,
  getExecutionRunnerRecordPath,
  getExecutionRunnersDir,
  listExecutionRunnerRecords,
  readExecutionRunnerRecord,
  readExecutionRunnerStoredRecord,
  writeExecutionRunnerStoredRecord,
} from '../src/runtime/runnersStore.js';

describe('runtime runner store', () => {
  const cleanup: string[] = [];

  afterEach(async () => {
    setAuracallHomeDirOverrideForTest(null);
    await Promise.all(cleanup.splice(0).map((entry) => fs.rm(entry, { recursive: true, force: true })));
  });

  it('persists and reloads runner records under the AuraCall home dir', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-store-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    await ensureExecutionRunnerStorage();
    expect(getExecutionRunnersDir()).toBe(path.join(homeDir, 'runtime', 'runners'));

    const runner = createExecutionRunnerRecord({
      id: 'runner:wsl-local-1',
      hostId: 'host:wsl-dev-1',
      startedAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
      browserProfileIds: ['wsl-chrome-2'],
      serviceAccountIds: ['acct_chatgpt_default'],
      browserCapable: true,
      eligibilityNote: 'WSL browser-bearing runner',
    });

    const stored = await writeExecutionRunnerStoredRecord(runner);
    expect(stored.revision).toBe(1);
    expect(path.basename(getExecutionRunnerDir(runner.id))).toMatch(/^v1_[A-Za-z0-9_-]+$/u);
    expect(path.basename(getExecutionRunnerDir(runner.id))).not.toContain(':');
    expect(getExecutionRunnerPath(runner.id)).toContain('runner.json');
    expect(getExecutionRunnerRecordPath(runner.id)).toContain('record.json');

    const loaded = await readExecutionRunnerRecord(runner.id);
    expect(loaded?.id).toBe(runner.id);
    expect(loaded?.hostId).toBe('host:wsl-dev-1');

    const reloadedRecord = await readExecutionRunnerStoredRecord(runner.id);
    expect(reloadedRecord?.runnerId).toBe(runner.id);
    expect(reloadedRecord?.revision).toBe(1);
  });

  it('round-trips Unicode runner ids through one canonical filesystem-safe encoding', () => {
    const runnerId = 'runner:http-responses:127.0.0.1:60379:é';
    const encoded = encodeExecutionRunnerDirectoryName(runnerId);

    expect(encoded).toMatch(/^v1_[A-Za-z0-9_-]+$/u);
    expect(decodeExecutionRunnerDirectoryName(encoded)).toBe(runnerId);
    expect(decodeExecutionRunnerDirectoryName('runner:legacy')).toBeNull();
    expect(decodeExecutionRunnerDirectoryName('v1_')).toBeNull();
    expect(decodeExecutionRunnerDirectoryName('v1_not%base64url')).toBeNull();
    expect(decodeExecutionRunnerDirectoryName('v1_wA')).toBeNull();
  });

  it('reads and migrates a safe legacy raw-id directory after an encoded write succeeds', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-legacy-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const runner = createExecutionRunnerRecord({
      id: 'runner-legacy',
      hostId: 'host:legacy',
      startedAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
    });
    const legacyDir = path.join(getExecutionRunnersDir(), runner.id);
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'runner.json'), `${JSON.stringify(runner)}\n`, 'utf8');

    expect((await readExecutionRunnerStoredRecord(runner.id))?.revision).toBe(0);
    expect((await listExecutionRunnerRecords()).map((entry) => entry.id)).toEqual([runner.id]);

    const migrated = await writeExecutionRunnerStoredRecord(runner, { expectedRevision: 0 });
    expect(migrated.revision).toBe(1);
    await expect(fs.access(getExecutionRunnerRecordPath(runner.id))).resolves.toBeUndefined();
    await expect(fs.access(legacyDir)).rejects.toMatchObject({ code: 'ENOENT' });

    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'runner.json'), `${JSON.stringify(runner)}\n`, 'utf8');
    await deleteExecutionRunnerRecord(runner.id);
    await expect(fs.access(getExecutionRunnerDir(runner.id))).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(fs.access(legacyDir)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('deduplicates encoded and legacy records using the newest runner heartbeat', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-duplicate-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const older = createExecutionRunnerRecord({
      id: 'runner-duplicate',
      hostId: 'host:encoded',
      startedAt: '2026-04-11T10:00:00.000Z',
      lastHeartbeatAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
    });
    await writeExecutionRunnerStoredRecord(older);

    const newer = createExecutionRunnerRecord({
      ...older,
      hostId: 'host:legacy-newer',
      startedAt: older.startedAt,
      lastHeartbeatAt: '2026-04-11T10:00:30.000Z',
      expiresAt: '2026-04-11T10:01:30.000Z',
    });
    const legacyDir = path.join(getExecutionRunnersDir(), newer.id);
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'record.json'), `${JSON.stringify({
      runnerId: newer.id,
      revision: 4,
      persistedAt: newer.lastHeartbeatAt,
      runner: newer,
    })}\n`, 'utf8');

    const listed = await listExecutionRunnerRecords();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.hostId).toBe('host:legacy-newer');
    expect((await readExecutionRunnerStoredRecord(newer.id))?.revision).toBe(4);
  });

  it('lists persisted runner records in reverse heartbeat order with filters', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-store-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const store = createExecutionRunnerRecordStore();
    await store.ensureStorage();

    await store.writeRunner(
      createExecutionRunnerRecord({
        id: 'runner:older',
        hostId: 'host:wsl-dev-1',
        startedAt: '2026-04-11T10:00:00.000Z',
        lastHeartbeatAt: '2026-04-11T10:00:00.000Z',
        expiresAt: '2026-04-11T10:01:00.000Z',
        serviceIds: ['chatgpt'],
        runtimeProfileIds: ['default'],
      }),
    );
    await store.writeRunner(
      createExecutionRunnerRecord({
        id: 'runner:newer',
        hostId: 'host:linux-2',
        status: 'stale',
        startedAt: '2026-04-11T10:00:00.000Z',
        lastHeartbeatAt: '2026-04-11T10:02:00.000Z',
        expiresAt: '2026-04-11T10:02:30.000Z',
        serviceIds: ['gemini'],
        runtimeProfileIds: ['batch'],
      }),
    );

    const listed = await listExecutionRunnerRecords();
    expect(listed.map((entry) => entry.id)).toEqual(['runner:newer', 'runner:older']);

    const filtered = await listExecutionRunnerRecords({ status: 'stale', hostId: 'host:linux-2', serviceId: 'gemini' });
    expect(filtered.map((entry) => entry.id)).toEqual(['runner:newer']);
  });

  it('supports compare-and-swap writes through revision checks', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-store-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const runner = createExecutionRunnerRecord({
      id: 'runner:cas',
      hostId: 'host:wsl-dev-1',
      startedAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
    });

    const firstWrite = await writeExecutionRunnerStoredRecord(runner);
    expect(firstWrite.revision).toBe(1);

    const nextRunner = createExecutionRunnerRecord({
      ...runner,
      startedAt: runner.startedAt,
      lastHeartbeatAt: '2026-04-11T10:00:30.000Z',
      expiresAt: '2026-04-11T10:01:30.000Z',
    });

    const secondWrite = await writeExecutionRunnerStoredRecord(nextRunner, { expectedRevision: 1 });
    expect(secondWrite.revision).toBe(2);
    expect(secondWrite.runner.lastHeartbeatAt).toBe('2026-04-11T10:00:30.000Z');

    await expect(writeExecutionRunnerStoredRecord(nextRunner, { expectedRevision: 1 })).rejects.toThrow(
      /revision mismatch/,
    );
  });

  it('recovers from a corrupt stored record by falling back to the runner snapshot', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-store-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const runner = createExecutionRunnerRecord({
      id: 'runner:corrupt-record',
      hostId: 'host:wsl-dev-1',
      startedAt: '2026-04-11T10:00:00.000Z',
      lastHeartbeatAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
    });

    await writeExecutionRunnerStoredRecord(runner);
    await fs.appendFile(getExecutionRunnerRecordPath(runner.id), 'trailing-bytes', 'utf8');

    const recovered = await readExecutionRunnerStoredRecord(runner.id);
    expect(recovered?.revision).toBe(0);
    expect(recovered?.runner.id).toBe(runner.id);

    const nextRunner = createExecutionRunnerRecord({
      ...runner,
      startedAt: runner.startedAt,
      lastHeartbeatAt: '2026-04-11T10:00:30.000Z',
      expiresAt: '2026-04-11T10:01:30.000Z',
    });
    const repaired = await writeExecutionRunnerStoredRecord(nextRunner, { expectedRevision: 0 });
    expect(repaired.revision).toBe(1);
    expect(JSON.parse(await fs.readFile(getExecutionRunnerRecordPath(runner.id), 'utf8')).runner.id).toBe(runner.id);
  });

  it('does not leave temp files behind for runner writes', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auracall-runtime-runners-store-'));
    cleanup.push(homeDir);
    setAuracallHomeDirOverrideForTest(homeDir);

    const runner = createExecutionRunnerRecord({
      id: 'runner:atomic-write',
      hostId: 'host:wsl-dev-1',
      startedAt: '2026-04-11T10:00:00.000Z',
      expiresAt: '2026-04-11T10:01:00.000Z',
      serviceIds: ['chatgpt'],
      runtimeProfileIds: ['default'],
    });

    await writeExecutionRunnerStoredRecord(runner);

    const files = await fs.readdir(path.dirname(getExecutionRunnerRecordPath(runner.id)));
    expect(files.sort()).toEqual(['record.json', 'runner.json']);
  });
});
