import { describe, expect, test, vi } from 'vitest';
import { createBrokerCdpClient, type BrokerCdpBinding, type BrokerCdpEventBatch, type BrokerCdpTransport } from '../../packages/browser-service/src/brokerCdpClient.js';

const binding: BrokerCdpBinding = {
  attachmentId: 'attachment', browserId: 'browser', profileId: 'profile',
  sessionName: 'session', targetId: 'target', generation: 'generation',
};

function fixture(commandTimeoutMs = 2000, pollTimeoutMs = 2000) {
  const reads: Array<(batch: Partial<BrokerCdpEventBatch>) => void> = [];
  const command = vi.fn<BrokerCdpTransport['command']>(async (request) => ({ ...request, result: {} }));
  const events = vi.fn<BrokerCdpTransport['events']>((request) => new Promise((resolve) => {
    reads.push((batch) => resolve({ binding, requestId: request.requestId, cursor: request.cursor, overflow: false, events: [], ...batch }));
  }));
  const detach = vi.fn<BrokerCdpTransport['detach']>(async (request) => ({ ...request, detached: true, browserPreserved: true }));
  const transport = { command, events, detach };
  const client = createBrokerCdpClient({ binding, transport, commandTimeoutMs, pollTimeoutMs, detachTimeoutMs: 50 });
  const publish = async (batch: Partial<BrokerCdpEventBatch>) => {
    await vi.waitFor(() => expect(reads.length).toBeGreaterThan(0));
    reads.shift()?.(batch);
  };
  return { client, transport, publish };
}

describe('bound broker CDP client', () => {
  test('an already cancelled run cannot start a broker client or event read', () => {
    const controller = new AbortController();
    controller.abort(new Error('run already cancelled'));
    const transport: BrokerCdpTransport = {
      command: vi.fn(), events: vi.fn(), detach: vi.fn(),
    };
    expect(() => createBrokerCdpClient({ binding, transport }, { abortSignal: controller.signal }))
      .toThrow('run already cancelled');
    expect(transport.command).not.toHaveBeenCalled();
    expect(transport.events).not.toHaveBeenCalled();
    expect(transport.detach).not.toHaveBeenCalled();
  });

  test('close removes the run cancellation listener and remains verified after later abort', async () => {
    const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    const transport: BrokerCdpTransport = {
      command: vi.fn(), events: () => new Promise(() => {}),
      detach: vi.fn(async (request) => ({ ...request, detached: true, browserPreserved: true })),
    };
    const client = createBrokerCdpClient({ binding, transport }, { abortSignal: controller.signal });
    const disconnected = vi.fn();
    client.on('disconnect', disconnected);
    await client.close();
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
    controller.abort();
    await client.close();
    expect(disconnected).toHaveBeenCalledOnce();
    expect(transport.detach).toHaveBeenCalledOnce();
  });

  test('binds each command and detaches once without closing the retained browser', async () => {
    const { client, transport } = fixture();
    await expect(client.Runtime.enable()).resolves.toEqual({});
    expect(transport.command.mock.calls[0]?.[0]).toMatchObject({ binding, method: 'Runtime.enable' });
    expect(transport.command.mock.calls[0]?.[0].requestId).toEqual(expect.any(String));
    await Promise.all([client.close(), client.close()]);
    await client.close();
    expect(transport.detach).toHaveBeenCalledOnce();
    expect(transport.detach.mock.calls[0]?.[0].binding).toEqual(binding);
  });

  test('delivers dialog events independently of a pending evaluation', async () => {
    const { client, transport, publish } = fixture();
    let finish: (() => void) | undefined;
    transport.command.mockImplementationOnce((request) => new Promise((resolve) => {
      finish = () => resolve({ ...request, result: {} });
    }));
    const pending = client.Runtime.evaluate({ expression: 'alert(1)' });
    const dismissed = vi.fn();
    client.Page.on('javascriptDialogOpening', () => {
      void client.Page.handleJavaScriptDialog({ accept: false }).then(dismissed);
    });
    await publish({ cursor: 1, events: [{ sequence: 1, method: 'Page.javascriptDialogOpening', params: {} }] });
    await vi.waitFor(() => expect(dismissed).toHaveBeenCalledOnce());
    finish?.();
    await pending;
    expect(transport.command).toHaveBeenCalledTimes(2);
    await client.close();
  });

  test.each(['attachmentId', 'browserId', 'profileId', 'sessionName', 'targetId', 'generation'] as const)(
    'seals a mismatched %s reply without replay', async (key) => {
      const { client, transport } = fixture();
      transport.command.mockImplementationOnce(async (request) => ({ ...request, binding: { ...binding, [key]: 'wrong' }, result: {} }));
      await expect(client.Runtime.enable()).rejects.toThrow('outcome_unknown_no_replay');
      await expect(client.Runtime.enable()).rejects.toThrow('connection_not_open');
      expect(transport.command).toHaveBeenCalledOnce();
      await client.close();
    },
  );

  test('times out once and discards a late command result', async () => {
    const { client, transport } = fixture(25);
    let finish: (() => void) | undefined;
    transport.command.mockImplementationOnce((request) => new Promise((resolve) => {
      finish = () => resolve({ ...request, result: {} });
    }));
    await expect(client.Runtime.enable()).rejects.toThrow('outcome_unknown_no_replay');
    finish?.();
    await expect(client.Runtime.enable()).rejects.toThrow('connection_not_open');
    expect(transport.command).toHaveBeenCalledOnce();
    await client.close();
  });

  test.each(['overflow', 'gap', 'identity', 'unsupported'])(
    'rejects an entire invalid event batch: %s', async (kind) => {
      const { client, publish } = fixture();
      const listener = vi.fn();
      const disconnected = vi.fn();
      client.on('disconnect', disconnected);
      client.Network.responseReceived(listener);
      await publish({
        binding: kind === 'identity' ? { ...binding, targetId: 'wrong' } : binding,
        overflow: kind === 'overflow', cursor: 2,
        events: [
          { sequence: 1, method: 'Network.responseReceived', params: {} },
          { sequence: kind === 'gap' ? 3 : 2, method: kind === 'unsupported' ? 'Target.targetCreated' : 'Network.loadingFinished', params: {} },
        ],
      });
      await vi.waitFor(() => expect(disconnected).toHaveBeenCalledOnce());
      expect(listener).not.toHaveBeenCalled();
      await client.close();
    },
  );

  test('reports the exact validated event-pump failure to disconnect listeners', async () => {
    const { client, publish } = fixture();
    const disconnected = vi.fn();
    client.on('disconnect', disconnected);
    await publish({ overflow: true });
    await vi.waitFor(() => expect(disconnected).toHaveBeenCalledOnce());
    expect(disconnected.mock.calls[0]?.[0]).toMatchObject({ message: 'broker_cdp_event_batch_invalid' });
    await client.close();
  });

  test('assigns new identities to empty polls and rejects an earlier poll reply without replay', async () => {
    const { client, transport, publish } = fixture();
    const listener = vi.fn();
    const disconnected = vi.fn();
    client.Network.responseReceived(listener);
    client.on('disconnect', disconnected);
    await publish({});
    await vi.waitFor(() => expect(transport.events).toHaveBeenCalledTimes(2));
    const first = transport.events.mock.calls[0]?.[0];
    const second = transport.events.mock.calls[1]?.[0];
    expect(first?.requestId).toEqual(expect.any(String));
    expect(second?.requestId).not.toBe(first?.requestId);
    expect(first?.cursor).toBe(0);
    expect(second?.cursor).toBe(0);
    await publish({ requestId: first?.requestId, cursor: 1,
      events: [{ sequence: 1, method: 'Network.responseReceived', params: {} }] });
    await vi.waitFor(() => expect(disconnected).toHaveBeenCalledOnce());
    expect(listener).not.toHaveBeenCalled();
    expect(transport.events).toHaveBeenCalledTimes(2);
    await expect(client.Runtime.enable()).rejects.toThrow('connection_not_open');
    expect(transport.command).not.toHaveBeenCalled();
    await Promise.all([client.close(), client.close()]);
    expect(transport.detach).toHaveBeenCalledOnce();
    expect(transport.detach.mock.calls[0]?.[0].binding).toEqual(binding);
  });

  test('rejects a legacy event response with no request identity before notifying listeners', async () => {
    const { client, transport, publish } = fixture();
    const listener = vi.fn();
    const disconnected = vi.fn();
    client.Network.responseReceived(listener);
    client.on('disconnect', disconnected);
    await publish({ requestId: undefined, cursor: 1,
      events: [{ sequence: 1, method: 'Network.responseReceived', params: {} }] });
    await vi.waitFor(() => expect(disconnected).toHaveBeenCalledOnce());
    expect(listener).not.toHaveBeenCalled();
    expect(transport.events).toHaveBeenCalledOnce();
    await client.close();
    expect(transport.detach).toHaveBeenCalledOnce();
  });

  test('does not replay timed-out event reads or deliver their late response', async () => {
    const { client, transport, publish } = fixture(2000, 25);
    const listener = vi.fn();
    const disconnected = vi.fn();
    client.Network.responseReceived(listener);
    client.on('disconnect', disconnected);
    await vi.waitFor(() => expect(disconnected).toHaveBeenCalledOnce());
    expect(transport.events.mock.calls[0]?.[1].aborted).toBe(true);
    await publish({ cursor: 1,
      events: [{ sequence: 1, method: 'Network.responseReceived', params: {} }] });
    await client.close();
    expect(listener).not.toHaveBeenCalled();
    expect(transport.events).toHaveBeenCalledOnce();
    expect(transport.detach).toHaveBeenCalledOnce();
  });

  test('keeps failed detach sticky', async () => {
    const { client, transport } = fixture();
    transport.detach.mockImplementationOnce(async (request) => ({ ...request, detached: true, browserPreserved: false }));
    await expect(client.close()).rejects.toThrow('detach_unverified');
    await expect(client.close()).rejects.toThrow('detach_unverified');
    expect(transport.detach).toHaveBeenCalledOnce();
  });

  test('does not retry detach when its acknowledgement never arrives', async () => {
    const { client, transport } = fixture();
    transport.detach.mockImplementationOnce(() => new Promise(() => {}));
    await expect(client.close()).rejects.toThrow('broker_operation_interrupted');
    await expect(client.close()).rejects.toThrow('broker_operation_interrupted');
    expect(transport.detach).toHaveBeenCalledOnce();
  });

  test('supports network callback unsubscribe and page listener removal', async () => {
    const { client, publish } = fixture();
    const network = vi.fn();
    const page = vi.fn();
    const unsubscribe = client.Network.responseReceived(network);
    client.Page.on('javascriptDialogOpening', page);
    unsubscribe();
    const pageEvents = client.Page as unknown as { off(event: string, callback: () => void): void };
    pageEvents.off('javascriptDialogOpening', page);
    await publish({ cursor: 2, events: [
      { sequence: 1, method: 'Network.responseReceived', params: {} },
      { sequence: 2, method: 'Page.javascriptDialogOpening', params: {} },
    ] });
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(network).not.toHaveBeenCalled();
    expect(page).not.toHaveBeenCalled();
    await client.close();
  });

  test('rejects raw lifecycle commands and caller target overrides before dispatch', async () => {
    const { client, transport } = fixture();
    await expect(client.send('Browser.close')).rejects.toThrow('method_unsupported');
    const invalidParams = { expression: '1', targetId: 'other' };
    await expect(client.send('Runtime.evaluate', invalidParams)).rejects.toThrow('params_invalid');
    expect(transport.command).not.toHaveBeenCalled();
    await client.close();
  });
});
