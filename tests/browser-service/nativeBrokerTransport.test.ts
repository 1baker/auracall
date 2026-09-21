import { mkdtemp, rm } from 'node:fs/promises';
import { createServer, type Socket } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createNativeBrokerTransport } from '../../packages/browser-service/src/nativeBrokerTransport.js';
import { createBrokerCdpClient } from '../../packages/browser-service/src/brokerCdpClient.js';

const binding = { attachmentId: 'a', browserId: 'b', profileId: 'p', sessionName: 's', targetId: 't', generation: 'g' };
const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); });

type Packet = { id: string; brokerRequest: { operation: string; requestId: string; method?: string; cursor?: number } };
function success(packet: Packet, socket: Socket) {
  const request = packet.brokerRequest;
  const data = request.operation === 'detach'
    ? { binding, requestId: request.requestId, detached: true, browserPreserved: true }
    : request.operation === 'events'
      ? { binding, requestId: request.requestId, cursor: request.cursor, overflow: false, events: [] }
    : { binding, requestId: request.requestId, result: {} };
  socket.end(`${JSON.stringify({ id: packet.id, success: true, data })}\n`);
}
async function fixture(handle: (packet: Packet, socket: Socket) => void = success) {
  const root = await mkdtemp(join(tmpdir(), 'broker-ipc-'));
  const socketPath = join(root, 'daemon.sock');
  const packets: Packet[] = [];
  const sockets = new Set<Socket>();
  const server = createServer((socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => {});
    let pending = '';
    socket.on('data', (chunk) => {
      pending += chunk.toString();
      if (!pending.endsWith('\n')) return;
      const packet = JSON.parse(pending);
      packets.push(packet);
      handle(packet, socket);
    });
  });
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(socketPath, resolve); });
  cleanups.push(async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(root, { recursive: true, force: true });
  });
  const taskContext = vi.fn(async () => ({ taskAuthority: { fixture: true }, taskStepId: 'approved-step' }));
  const options = { socketPath, authToken: 'fixture-secret', binding, taskContext, timeoutMs: 2000 };
  return { packets, options, transport: createNativeBrokerTransport(options), sockets };
}

describe('send-once native broker socket', () => {
  test('sends authenticated command and approved task context, then independent cleanup', async () => {
    const { transport, packets, options } = await fixture();
    const signal = new AbortController().signal;
    await expect(transport.command({ binding, requestId: 'one', method: 'Runtime.enable', params: {} }, signal)).resolves.toMatchObject({ result: {} });
    expect(packets[0]).toMatchObject({ id: 'one', action: '__broker_transport',
      brokerRequest: { operation: 'command', taskContext: { taskStepId: 'approved-step' } } });
    expect(packets[0]).toHaveProperty('_agentBrowserAuthToken', 'fixture-secret');
    await expect(transport.command({ binding, requestId: 'one', method: 'Runtime.enable', params: {} }, signal)).rejects.toThrow('not_replayable');
    await transport.detach({ binding, requestId: 'cleanup' }, signal);
    expect(options.taskContext).toHaveBeenCalledOnce();
    expect(packets).toHaveLength(2);
    expect(packets[1]?.brokerRequest).not.toHaveProperty('taskContext');
  });

  test('event reads rely on the acquired attachment and do not mint task authority', async () => {
    const { transport, packets, options } = await fixture();
    const signal = new AbortController().signal;
    await expect(transport.events({ binding, requestId: 'events-one', cursor: 0 }, signal))
      .resolves.toMatchObject({ cursor: 0, overflow: false, events: [] });
    expect(options.taskContext).not.toHaveBeenCalled();
		expect(packets[0]?.brokerRequest).toMatchObject({ operation: 'events' });
		expect(packets[0]?.brokerRequest).not.toHaveProperty('taskContext');
  });

  test('publishes a fully validated navigation event to authority before provider listeners', async () => {
    let sent = false;
    const observed: string[] = [];
    const { transport } = await fixture((packet, socket) => {
      const request = packet.brokerRequest;
      if (request.operation === 'events' && !sent) {
        sent = true;
        socket.end(`${JSON.stringify({ id: packet.id, success: true, data: {
          binding, requestId: request.requestId, cursor: 1, overflow: false,
          events: [{ sequence: 1, method: 'Page.frameNavigated', params: {
            frame: { id: 'main', url: 'https://chatgpt.com/g/g-p-11111111111111111111111111111111/c/11111111-1111-1111-1111-111111111111' },
          } }],
        } })}\n`);
        return;
      }
      success(packet, socket);
    });
    const client = createBrokerCdpClient({ binding, transport, onEvent: event => {
      observed.push(`authority:${event.method}`);
    } });
    client.Page.on('frameNavigated', () => observed.push('provider:Page.frameNavigated'));
    await vi.waitFor(() => expect(observed).toEqual([
      'authority:Page.frameNavigated', 'provider:Page.frameNavigated',
    ]));
    await client.close();
  });

  test('passive event polling crosses the old lifetime ceiling while rejecting recent replay', async () => {
    const { transport, options } = await fixture();
    const signal = new AbortController().signal;
    for (let index = 0; index < 4_100; index += 1) {
      await transport.events({ binding, requestId: `events-${index}`, cursor: 0 }, signal);
    }
    expect(options.taskContext).not.toHaveBeenCalled();
    await expect(transport.events({ binding, requestId: 'events-4099', cursor: 0 }, signal))
      .rejects.toThrow('not_replayable');
    await expect(transport.events({ binding, requestId: 'events-next', cursor: 0 }, signal))
      .resolves.toMatchObject({ cursor: 0, overflow: false, events: [] });
  }, 20_000);

  test.each(['eof', 'wrong-outer', 'wrong-inner', 'wrong-target', 'denied', 'malformed', 'oversized'])(
    'fails closed on %s without reconnecting or exposing response secrets', async (failure) => {
      const { transport, packets } = await fixture((packet, socket) => {
        if (failure === 'eof') { socket.end(); return; }
        if (failure === 'malformed') { socket.end('secret malformed\n'); return; }
        if (failure === 'oversized') { socket.end(`${'x'.repeat(1_048_577)}\n`); return; }
        socket.end(`${JSON.stringify({ id: failure === 'wrong-outer' ? 'wrong' : packet.id,
          success: failure !== 'denied', error: 'fixture-secret', data: {
            binding: failure === 'wrong-target' ? { ...binding, targetId: 'other' } : binding,
            requestId: failure === 'wrong-inner' ? 'wrong' : packet.id, cursor: 0, overflow: false, events: [],
          } })}\n`);
      });
      await expect(transport.events({ binding, requestId: 'read', cursor: 0 }, new AbortController().signal))
        .rejects.toThrow(/^broker_native_outcome_unknown_no_replay$/);
      expect(packets).toHaveLength(1);
    },
  );

  test('abort during command authorization never opens a socket, even after late permission', async () => {
    const { options, packets } = await fixture();
    let release!: (context: Record<string, unknown>) => void;
    const transport = createNativeBrokerTransport({ ...options, taskContext: () => new Promise((resolve) => { release = resolve; }) });
    const controller = new AbortController();
    const pending = transport.command({ binding, requestId: 'read', method: 'Runtime.enable', params: {} }, controller.signal);
    controller.abort();
    await expect(pending).rejects.toThrow('no_replay');
    release({ taskAuthority: {}, taskStepId: 'late' });
    await new Promise((resolve) => setImmediate(resolve));
    expect(packets).toHaveLength(0);
  });

  test('missing approved command context sends nothing and does not obstruct detach', async () => {
    const { options, packets } = await fixture();
    const transport = createNativeBrokerTransport({ ...options, taskContext: async () => ({}) });
    const signal = new AbortController().signal;
    await expect(transport.command({ binding, requestId: 'read', method: 'Runtime.enable', params: {} }, signal)).rejects.toThrow('no_replay');
    await transport.detach({ binding, requestId: 'cleanup' }, signal);
    expect(packets).toHaveLength(1);
    expect(packets[0]?.brokerRequest.operation).toBe('detach');
  });

  test('preserves only a bounded native authority failure code for diagnosis', async () => {
    const { options, packets } = await fixture();
    const transport = createNativeBrokerTransport({ ...options, taskContext: async () => {
      throw new Error('broker_native_authority_rejected:target_url_mismatch');
    } });
    await expect(transport.command({ binding, requestId: 'diagnostic', method: 'Runtime.enable', params: {} },
      new AbortController().signal)).rejects.toMatchObject({
        message: 'broker_native_outcome_unknown_no_replay',
        cause: { message: 'broker_native_task_context_failed:broker_native_authority_rejected:target_url_mismatch' },
      });
    expect(packets).toHaveLength(0);
  });

  test('timeout after dispatch closes the socket, never resends, and still permits cleanup', async () => {
    const { options, packets, sockets } = await fixture((packet, socket) => {
      if (packet.brokerRequest.operation === 'detach') success(packet, socket);
    });
    const transport = createNativeBrokerTransport({ ...options, timeoutMs: 50 });
    const signal = new AbortController().signal;
    await expect(transport.command({ binding, requestId: 'sent', method: 'Runtime.enable', params: {} }, signal))
      .rejects.toThrow('no_replay');
    await vi.waitFor(() => expect(sockets.size).toBe(0));
    await expect(transport.command({ binding, requestId: 'sent', method: 'Runtime.enable', params: {} }, signal))
      .rejects.toThrow('not_replayable');
    await transport.detach({ binding, requestId: 'cleanup' }, signal);
    expect(packets).toHaveLength(2);
  });

  test('rejects another retained binding before requesting authority or connecting', async () => {
    const { transport, packets, options } = await fixture();
    await expect(transport.events({ binding: { ...binding, profileId: 'other' }, requestId: 'read', cursor: 0 },
      new AbortController().signal)).rejects.toThrow('request_invalid');
    expect(options.taskContext).not.toHaveBeenCalled();
    expect(packets).toHaveLength(0);
  });

  test('authority provider cannot change the snapshotted command', async () => {
    const { options, packets } = await fixture();
    const transport = createNativeBrokerTransport({ ...options, taskContext: async (request) => {
      Object.assign(request.binding, { targetId: 'mutated' });
      if (request.operation === 'command') request.params.expression = 'changed';
      return { taskAuthority: { fixture: true }, taskStepId: 'approved-step' };
    } });
    await transport.command({ binding, requestId: 'one', method: 'Runtime.evaluate', params: { expression: 'original' } },
      new AbortController().signal);
    expect(packets[0]?.brokerRequest).toMatchObject({ binding, params: { expression: 'original' } });
  });

  test('accepts one newline-framed reply fragmented across socket reads', async () => {
    const { transport } = await fixture((packet, socket) => {
      socket.write(`{"id":${JSON.stringify(packet.id)},"success":true,`);
      setImmediate(() => socket.end(`${JSON.stringify({ data: { binding, requestId: packet.id, result: {} } }).slice(1)}\n`));
    });
    await expect(transport.command({ binding, requestId: 'one', method: 'Runtime.enable', params: {} },
      new AbortController().signal)).resolves.toMatchObject({ result: {} });
  });

  test('events and dismissal use separate sockets while evaluation waits; facade detaches once', async () => {
    let finish: (() => void) | undefined;
    let sentDialog = false;
    const { transport, packets } = await fixture((packet, socket) => {
      const request = packet.brokerRequest;
      const reply = (data: Record<string, unknown>) => socket.end(`${JSON.stringify({ id: packet.id, success: true,
        data: { binding, requestId: request.requestId, ...data } })}\n`);
      if (request.operation === 'events') {
        if (!sentDialog && finish) {
          sentDialog = true;
          reply({ cursor: 1, overflow: false, events: [{ sequence: 1, method: 'Page.javascriptDialogOpening', params: {} }] });
        } else reply({ cursor: request.cursor, overflow: false, events: [] });
      } else if (request.method === 'Runtime.evaluate') finish = () => reply({ result: {} });
      else if (request.operation === 'detach') reply({ detached: true, browserPreserved: true });
      else reply({ result: {} });
    });
    const client = createBrokerCdpClient({ binding, transport });
    const dismissed = vi.fn();
    client.Page.on('javascriptDialogOpening', () => {
      void client.Page.handleJavaScriptDialog({ accept: false }).then(dismissed);
    });
    const evaluation = client.Runtime.evaluate({ expression: 'fixture dialog' });
    await vi.waitFor(() => expect(dismissed).toHaveBeenCalledOnce());
    finish?.();
    await evaluation;
    await Promise.all([client.close(), client.close()]);
    expect(packets.filter((packet) => packet.brokerRequest.operation === 'detach')).toHaveLength(1);
    expect(packets.filter((packet) => packet.brokerRequest.method === 'Runtime.evaluate')).toHaveLength(1);
  });
});
