import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ExecutionRunnerRecordSchema } from './schema.js';
import { getRuntimeDir } from './store.js';
import type { ExecutionRunnerRecord, ExecutionRunnerServiceId, ExecutionRunnerStatus } from './types.js';

const RUNNERS_DIRNAME = 'runners';
const RUNNER_FILENAME = 'runner.json';
const RECORD_FILENAME = 'record.json';
const RUNNER_DIRECTORY_PREFIX = 'v1_';
const runnerWriteQueues = new Map<string, Promise<unknown>>();

export interface ListExecutionRunnerRecordOptions {
  limit?: number;
  status?: ExecutionRunnerStatus;
  hostId?: string;
  serviceId?: ExecutionRunnerServiceId;
}

export interface ExecutionRunnerStoredRecord {
  runnerId: string;
  revision: number;
  persistedAt: string;
  runner: ExecutionRunnerRecord;
}

export interface WriteExecutionRunnerRecordOptions {
  expectedRevision?: number | null;
  persistedAt?: string;
}

export interface ExecutionRunnerRecordStore {
  ensureStorage(): Promise<void>;
  writeRunner(runner: ExecutionRunnerRecord, options?: WriteExecutionRunnerRecordOptions): Promise<ExecutionRunnerStoredRecord>;
  readRunner(runnerId: string): Promise<ExecutionRunnerRecord | null>;
  readRecord(runnerId: string): Promise<ExecutionRunnerStoredRecord | null>;
  listRunners(options?: ListExecutionRunnerRecordOptions): Promise<ExecutionRunnerRecord[]>;
  deleteRunner(runnerId: string): Promise<void>;
}

export function getExecutionRunnersDir(): string {
  return path.join(getRuntimeDir(), RUNNERS_DIRNAME);
}

export function getExecutionRunnerDir(runnerId: string): string {
  return path.join(getExecutionRunnersDir(), encodeExecutionRunnerDirectoryName(runnerId));
}

export function getExecutionRunnerPath(runnerId: string): string {
  return path.join(getExecutionRunnerDir(runnerId), RUNNER_FILENAME);
}

export function getExecutionRunnerRecordPath(runnerId: string): string {
  return path.join(getExecutionRunnerDir(runnerId), RECORD_FILENAME);
}

export async function ensureExecutionRunnerStorage(): Promise<void> {
  await fs.mkdir(getExecutionRunnersDir(), { recursive: true });
}

export function encodeExecutionRunnerDirectoryName(runnerId: string): string {
  return `${RUNNER_DIRECTORY_PREFIX}${Buffer.from(runnerId, 'utf8').toString('base64url')}`;
}

export function decodeExecutionRunnerDirectoryName(directoryName: string): string | null {
  if (!directoryName.startsWith(RUNNER_DIRECTORY_PREFIX)) return null;
  const encoded = directoryName.slice(RUNNER_DIRECTORY_PREFIX.length);
  if (!encoded || !/^[A-Za-z0-9_-]+$/u.test(encoded)) return null;
  const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
  return encodeExecutionRunnerDirectoryName(decoded) === directoryName ? decoded : null;
}

export async function readExecutionRunnerStoredRecord(runnerId: string): Promise<ExecutionRunnerStoredRecord | null> {
  const encoded = await readRunnerRecordFromDirectory(getExecutionRunnerDir(runnerId), runnerId);
  const legacyDir = getLegacyExecutionRunnerDir(runnerId);
  const legacy = legacyDir ? await readRunnerRecordFromDirectory(legacyDir, runnerId) : null;
  return selectPreferredStoredRecord(encoded, legacy);
}

export async function readExecutionRunnerRecord(runnerId: string): Promise<ExecutionRunnerRecord | null> {
  return (await readExecutionRunnerStoredRecord(runnerId))?.runner ?? null;
}

export async function writeExecutionRunnerStoredRecord(
  runner: ExecutionRunnerRecord,
  options: WriteExecutionRunnerRecordOptions = {},
): Promise<ExecutionRunnerStoredRecord> {
  return withRunnerWriteQueue(runner.id, () => writeExecutionRunnerStoredRecordNow(runner, options));
}

async function writeExecutionRunnerStoredRecordNow(
  runner: ExecutionRunnerRecord,
  options: WriteExecutionRunnerRecordOptions = {},
): Promise<ExecutionRunnerStoredRecord> {
  const parsedRunner = ExecutionRunnerRecordSchema.parse(runner);
  const existing = await readExecutionRunnerStoredRecord(parsedRunner.id);
  const expectedRevision = options.expectedRevision ?? undefined;
  if (typeof expectedRevision === 'number') {
    const currentRevision = existing?.revision ?? 0;
    if (currentRevision !== expectedRevision) {
      throw new Error(
        `Execution runner ${parsedRunner.id} revision mismatch: expected ${expectedRevision}, found ${currentRevision}`,
      );
    }
  }

  const nextRecord: ExecutionRunnerStoredRecord = {
    runnerId: parsedRunner.id,
    revision: (existing?.revision ?? 0) + 1,
    persistedAt: options.persistedAt ?? parsedRunner.lastHeartbeatAt,
    runner: parsedRunner,
  };

  const runnerDir = getExecutionRunnerDir(parsedRunner.id);
  await fs.mkdir(runnerDir, { recursive: true });
  await writeJsonFileAtomically(getExecutionRunnerRecordPath(parsedRunner.id), nextRecord);
  await writeJsonFileAtomically(getExecutionRunnerPath(parsedRunner.id), parsedRunner);
  const legacyDir = getLegacyExecutionRunnerDir(parsedRunner.id);
  if (legacyDir) {
    await fs.rm(legacyDir, { recursive: true, force: true });
  }
  return nextRecord;
}

export async function listExecutionRunnerRecords(
  options: ListExecutionRunnerRecordOptions = {},
): Promise<ExecutionRunnerRecord[]> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(getExecutionRunnersDir(), { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }

  const records = (
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const runnerId = decodeExecutionRunnerDirectoryName(entry.name) ?? entry.name;
          return readRunnerRecordFromDirectory(path.join(getExecutionRunnersDir(), entry.name), runnerId);
        }),
    )
  ).filter((record): record is ExecutionRunnerStoredRecord => record !== null);

  const recordsByRunnerId = new Map<string, ExecutionRunnerStoredRecord>();
  for (const record of records) {
    recordsByRunnerId.set(
      record.runnerId,
      selectPreferredStoredRecord(recordsByRunnerId.get(record.runnerId) ?? null, record) ?? record,
    );
  }
  const runners = [...recordsByRunnerId.values()].map((record) => record.runner);

  const filtered = runners.filter((runner) => {
    if (options.status && runner.status !== options.status) return false;
    if (options.hostId && runner.hostId !== options.hostId) return false;
    if (options.serviceId && !runner.serviceIds.includes(options.serviceId)) return false;
    return true;
  });

  filtered.sort((left, right) => right.lastHeartbeatAt.localeCompare(left.lastHeartbeatAt));

  if (typeof options.limit === 'number' && options.limit >= 0) {
    return filtered.slice(0, options.limit);
  }
  return filtered;
}

export async function deleteExecutionRunnerRecord(runnerId: string): Promise<void> {
  await fs.rm(getExecutionRunnerDir(runnerId), { recursive: true, force: true });
  const legacyDir = getLegacyExecutionRunnerDir(runnerId);
  if (legacyDir) {
    await fs.rm(legacyDir, { recursive: true, force: true });
  }
}

export function createExecutionRunnerRecordStore(): ExecutionRunnerRecordStore {
  return {
    ensureStorage: ensureExecutionRunnerStorage,
    writeRunner: writeExecutionRunnerStoredRecord,
    readRunner: readExecutionRunnerRecord,
    readRecord: readExecutionRunnerStoredRecord,
    listRunners: listExecutionRunnerRecords,
    deleteRunner: deleteExecutionRunnerRecord,
  };
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isInvalidJsonError(error: unknown): boolean {
  return error instanceof SyntaxError;
}

async function readRunnerRecordFromDirectory(
  runnerDir: string,
  expectedRunnerId: string,
): Promise<ExecutionRunnerStoredRecord | null> {
  const recordPath = path.join(runnerDir, RECORD_FILENAME);
  try {
    const raw = await fs.readFile(recordPath, 'utf8');
    const record = parseStoredRunnerRecord(JSON.parse(raw));
    return record.runnerId === expectedRunnerId && record.runner.id === expectedRunnerId ? record : null;
  } catch (error) {
    if (!isMissingFileError(error) && !isInvalidJsonError(error)) throw error;
  }

  const runnerPath = path.join(runnerDir, RUNNER_FILENAME);
  let runner: ExecutionRunnerRecord;
  try {
    const raw = await fs.readFile(runnerPath, 'utf8');
    runner = ExecutionRunnerRecordSchema.parse(JSON.parse(raw));
  } catch (error) {
    if (isMissingFileError(error) || isInvalidJsonError(error)) return null;
    throw error;
  }
  if (runner.id !== expectedRunnerId) return null;
  return {
    runnerId: runner.id,
    revision: 0,
    persistedAt: runner.lastHeartbeatAt,
    runner,
  };
}

function getLegacyExecutionRunnerDir(runnerId: string): string | null {
  if (!isSafeLegacyRunnerDirectoryName(runnerId)) return null;
  return path.join(getExecutionRunnersDir(), runnerId);
}

function isSafeLegacyRunnerDirectoryName(runnerId: string): boolean {
  if (!runnerId || runnerId === '.' || runnerId === '..' || /[\\/\0]/u.test(runnerId)) return false;
  if (process.platform !== 'win32') return true;
  if (/[<>:"|?*]/u.test(runnerId) || /[. ]$/u.test(runnerId)) return false;
  return !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(runnerId);
}

function selectPreferredStoredRecord(
  left: ExecutionRunnerStoredRecord | null,
  right: ExecutionRunnerStoredRecord | null,
): ExecutionRunnerStoredRecord | null {
  if (!left) return right;
  if (!right) return left;
  const heartbeatOrder = left.runner.lastHeartbeatAt.localeCompare(right.runner.lastHeartbeatAt);
  if (heartbeatOrder !== 0) return heartbeatOrder > 0 ? left : right;
  const persistedOrder = left.persistedAt.localeCompare(right.persistedAt);
  if (persistedOrder !== 0) return persistedOrder > 0 ? left : right;
  return left.revision >= right.revision ? left : right;
}

async function writeJsonFileAtomically(filePath: string, value: unknown): Promise<void> {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, filePath);
}

async function withRunnerWriteQueue<T>(runnerId: string, write: () => Promise<T>): Promise<T> {
  const previous = runnerWriteQueues.get(runnerId) ?? Promise.resolve();
  const next = previous.then(write, write);
  const settled = next.catch(() => undefined).finally(() => {
    if (runnerWriteQueues.get(runnerId) === settled) {
      runnerWriteQueues.delete(runnerId);
    }
  });
  runnerWriteQueues.set(runnerId, settled);
  return next;
}

function parseStoredRunnerRecord(value: unknown): ExecutionRunnerStoredRecord {
  const record = value as Partial<ExecutionRunnerStoredRecord>;
  return {
    runnerId: String(record.runnerId),
    revision: Number(record.revision),
    persistedAt: String(record.persistedAt),
    runner: ExecutionRunnerRecordSchema.parse(record.runner),
  };
}
