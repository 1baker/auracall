// Explicit Rust-owned fixture only. Never discovers a daemon or browser.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createConnection, createServer } from 'node:net';
import { mkdtemp, open, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNativeBrokerTransport } from '../../dist/packages/browser-service/src/nativeBrokerTransport.js';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
assert.equal(input.fixture, 'native-broker-cross-process-v1');
const mode = process.argv[2];
if (!mode) {
  const root = await mkdtemp(join(tmpdir(), 'auracall-native-crash-'));
  const children = [];
  const start = (phase, payload) => {
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), phase], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    children.push(child);
    // Register before input delivery so even immediate exit cannot be missed.
    const terminal = once(child, 'exit');
    terminal.catch(() => {});
    child.stdin.on('error', () => {});
    child.stderr.resume(); // Never forward credentials or provider data from child errors.
    child.stdin.end(JSON.stringify(payload));
    return { child, terminal };
  };
  const timer = setTimeout(() => {
    for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }, 12000);
  try {
    const first = start('--commit-and-wait', input);
    let line = '';
    for await (const chunk of first.child.stdout) {
      line += chunk.toString();
      assert.ok(line.length <= 32768, 'bounded commit receipt');
      if (line.includes('\n')) break;
    }
    const committed = JSON.parse(line);
    assert.equal(committed.committed, true);
    assert.deepEqual(committed.binding, input.binding);
    const evidencePath = join(root, 'committed-binding.json');
    const evidence = await open(evidencePath, 'wx', 0o600);
    try {
      await evidence.writeFile(JSON.stringify({ binding: committed.binding }));
      await evidence.sync();
    } finally { await evidence.close(); }
    // Kill only the disposable child this fixture created, after durable receipt.
    assert.equal(first.child.kill('SIGKILL'), true);
    const [code, signal] = await first.terminal;
    assert.equal(code, null);
    assert.equal(signal, 'SIGKILL');
    const saved = JSON.parse(await readFile(evidencePath, 'utf8'));
    const recovery = start('--recover', { ...input, binding: saved.binding });
    assert.notEqual(first.child.pid, recovery.child.pid);
    let output = '';
    for await (const chunk of recovery.child.stdout) {
      output += chunk.toString();
      assert.ok(output.length <= 32768, 'bounded recovery receipt');
    }
    const [recoveryCode, recoverySignal] = await recovery.terminal;
    assert.equal(recoveryCode, 0);
    assert.equal(recoverySignal, null);
    const receipt = JSON.parse(output);
    assert.equal(receipt.verified, true);
    process.stdout.write(JSON.stringify({ ...receipt, clientCrashVerified: true, distinctRecoveryProcess: true }));
  } finally {
    clearTimeout(timer);
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        const terminal = once(child, 'exit');
        child.kill('SIGKILL');
        await terminal;
      }
    }
    await rm(root, { recursive: true, force: true });
  }
  process.exit(0);
}
assert.ok(mode === '--commit-and-wait' || mode === '--recover');
const { binding, issued } = input;
const signal = new AbortController().signal;
const options = {
  socketPath: input.socketPath, authToken: input.authToken, binding, timeoutMs: 5000,
  taskContext: async (request) => ({
    serviceName: 'fixture-service', taskName: 'cross-process', taskEvidenceBytes: 4096,
    taskAuthority: issued.envelope,
    taskStepId: issued.approvedPlan.steps[request.operation === 'command' ? 0 : 1].stepId,
  }),
};
const transport = createNativeBrokerTransport(options);
if (mode === '--commit-and-wait') {
  await transport.command({ binding, requestId: 'cross-enable', method: 'Runtime.enable', params: {} }, signal);
  process.stdout.write(`${JSON.stringify({ committed: true, binding })}\n`);
  // The parent must observe a live process and kill it after saving the receipt.
  setInterval(() => {}, 1000);
  await new Promise(() => {});
}
const batch = await transport.events({ binding, requestId: 'cross-events', cursor: 0 }, signal);
assert.equal(batch.cursor, 1);
assert.equal(batch.events.length, 1);
assert.equal(batch.events[0].method, 'Page.loadEventFired');
// This process was started after SIGKILL and has no local consumed-ID set.
const restarted = createNativeBrokerTransport(options);
await assert.rejects(restarted.events({ binding, requestId: 'cross-events', cursor: 1 }, signal), /no_replay/);
await assert.rejects(restarted.events({ binding, requestId: 'cross-exhausted', cursor: 1 }, signal), /no_replay/);
// Drop only the first detach reply after the actual worker has acknowledged it.
// The connector must report uncertainty; a fresh connector may confirm exact
// cleanup, but Rust must not send Target.detachFromTarget a second time.
const lossRoot = await mkdtemp(join(tmpdir(), 'auracall-detach-loss-'));
const lossPath = join(lossRoot, 'loss.sock');
const sockets = new Set();
let acknowledged;
const proxy = createServer(client => {
  const upstream = createConnection({ path: input.socketPath });
  for (const socket of [client, upstream]) {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => { client.destroy(); upstream.destroy(); });
  }
  client.pipe(upstream);
  let response = '';
  upstream.on('data', chunk => {
    response += chunk.toString();
    if (response.length > 32768) { client.destroy(); upstream.destroy(); return; }
    if (!response.endsWith('\n')) return;
    try { acknowledged = JSON.parse(response); } catch { /* Fail the receipt assertion below. */ }
    // Deliberately do not forward the receipt.
    client.end();
    upstream.destroy();
  });
  upstream.on('end', () => client.end());
});
try {
  proxy.listen(lossPath);
  await once(proxy, 'listening');
  const interrupted = createNativeBrokerTransport({ ...options, socketPath: lossPath });
  await assert.rejects(interrupted.detach({ binding, requestId: 'cross-detach-one' }, signal), /outcome_unknown_no_replay/);
  assert.equal(acknowledged?.success, true);
  assert.equal(acknowledged?.data?.detached, true);
  assert.equal(acknowledged?.data?.browserPreserved, true);
  assert.deepEqual(acknowledged?.data?.binding, binding);
  const reconciler = createNativeBrokerTransport(options);
  const detached = await reconciler.detach({ binding, requestId: 'cross-detach-two' }, signal);
  assert.equal(detached.detached, true);
  assert.equal(detached.browserPreserved, true);
} finally {
  for (const socket of sockets) socket.destroy();
  await new Promise(resolve => proxy.close(resolve));
  await rm(lossRoot, { recursive: true, force: true });
}
process.stdout.write(JSON.stringify({ verified: true, commandCount: 1, eventCount: 1,
  replayRejected: true, exhaustedRejected: true, lostDetachReplyReconciled: true }));
