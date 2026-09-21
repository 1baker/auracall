import { describe, expect, test, vi } from "vitest";

const connectionMocks = vi.hoisted(() => {
	const cdp = Object.assign(vi.fn(), {
		// biome-ignore lint/style/useNamingConvention: chrome-remote-interface static API uses PascalCase.
		List: vi.fn(),
	});
	return {
		cdp,
		disposeEndpoint: vi.fn(async () => undefined),
	};
});

vi.mock("chrome-remote-interface", () => ({
	default: connectionMocks.cdp,
}));

vi.mock("../../packages/browser-service/src/windowsLoopbackRelay.js", async (importOriginal) => {
	const actual =
		await importOriginal<
			typeof import("../../packages/browser-service/src/windowsLoopbackRelay.js")
		>();
	return {
		...actual,
		resolveChromeEndpoint: vi.fn(async (_host: string | undefined, port: number) => ({
			host: "127.0.0.1",
			port,
			dispose: connectionMocks.disposeEndpoint,
		})),
	};
});

import { connectToChromeTarget } from "../../packages/browser-service/src/chromeLifecycle.js";
import type { BrokerCdpConnection, BrokerCdpTransport } from "../../packages/browser-service/src/brokerCdpClient.js";

test.each([false, true])('broker run abort seals delivery and preserves sticky cleanup (detach failure: %s)', async (detachFails) => {
  connectionMocks.cdp.mockClear();
  connectionMocks.cdp.List.mockClear();
  const controller = new AbortController();
  let finishCommand: (() => void) | undefined;
  let finishEvents: (() => void) | undefined;
  let commandSignal: AbortSignal | undefined;
  let eventSignal: AbortSignal | undefined;
  const command = vi.fn<BrokerCdpTransport['command']>((request, signal) => new Promise((resolve) => {
    commandSignal = signal;
    finishCommand = () => resolve({ ...request, result: {} });
  }));
  const events = vi.fn<BrokerCdpTransport['events']>((request, signal) => new Promise((resolve) => {
    eventSignal = signal;
    finishEvents = () => resolve({ ...request, cursor: 1, overflow: false,
      events: [{ sequence: 1, method: 'Page.loadEventFired', params: {} }] });
  }));
  const detach = vi.fn<BrokerCdpTransport['detach']>(async (request, signal) => {
    expect(signal.aborted).toBe(false);
    if (detachFails) throw new Error('fixture cleanup failed');
    return { ...request, detached: true, browserPreserved: true };
  });
  const brokerConnection: BrokerCdpConnection = {
    binding: { attachmentId: 'a', browserId: 'b', profileId: 'p', sessionName: 's', targetId: 't', generation: 'g' },
    transport: { command, events, detach },
  };
  const client = await connectToChromeTarget({ brokerConnection, abortSignal: controller.signal });
  const listener = vi.fn();
  const disconnected = vi.fn();
  client.Page.loadEventFired(listener);
  client.on('disconnect', disconnected);
  const pending = client.Runtime.enable();
  const rejected = expect(pending).rejects.toThrow('outcome_unknown_no_replay');
  await vi.waitFor(() => expect(command).toHaveBeenCalledOnce());
  controller.abort();
  try {
    expect(commandSignal?.aborted).toBe(true);
    expect(eventSignal?.aborted).toBe(true);
    await rejected;
    finishCommand?.();
    finishEvents?.();
    await expect(client.Runtime.enable()).rejects.toThrow('connection_not_open');
    expect(listener).not.toHaveBeenCalled();
    expect(disconnected).toHaveBeenCalledOnce();
    expect(command).toHaveBeenCalledOnce();
    expect(events).toHaveBeenCalledOnce();
  } finally {
    // The enclosing owner still awaits cleanup, independent of the cancelled run.
    const closed = await Promise.allSettled([client.close(), client.close()]);
    await rejected;
    expect(closed.map((result) => result.status)).toEqual(detachFails
      ? ['rejected', 'rejected'] : ['fulfilled', 'fulfilled']);
    if (detachFails) await expect(client.close()).rejects.toThrow('fixture cleanup failed');
    else await client.close();
    expect(detach).toHaveBeenCalledOnce();
    expect(detach.mock.calls[0]?.[0].binding).toEqual(brokerConnection.binding);
    expect(connectionMocks.cdp).not.toHaveBeenCalled();
    expect(connectionMocks.cdp.List).not.toHaveBeenCalled();
  }
});

test('explicit broker transport never discovers or connects to a raw endpoint', async () => {
  connectionMocks.cdp.mockClear();
  connectionMocks.cdp.List.mockClear();
  connectionMocks.disposeEndpoint.mockClear();
  const brokerConnection: BrokerCdpConnection = {
    binding: { attachmentId: 'a', browserId: 'b', profileId: 'p', sessionName: 's', targetId: 't', generation: 'g' },
    transport: {
      command: async (request) => ({ ...request, result: {} }),
      events: () => new Promise(() => {}),
      detach: async (request) => ({ ...request, detached: true, browserPreserved: true }),
    },
  };
  const client = await connectToChromeTarget({ host: 'invalid.example', target: 't', brokerConnection });
  await client.Runtime.enable();
  await client.close();
  await expect(connectToChromeTarget({ target: 'wrong', brokerConnection })).rejects.toThrow('broker_connection_target_mismatch');
  expect(connectionMocks.cdp).not.toHaveBeenCalled();
  expect(connectionMocks.cdp.List).not.toHaveBeenCalled();
  expect(connectionMocks.disposeEndpoint).not.toHaveBeenCalled();
});

describe("DevTools CDP connection liveness", () => {
	test("times out a stalled CDP handshake and closes a client that resolves late", async () => {
		connectionMocks.disposeEndpoint.mockClear();
		let resolveConnection: ((client: unknown) => void) | undefined;
		const close = vi.fn(async () => undefined);
		connectionMocks.cdp.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveConnection = resolve;
			}),
		);

		const pending = connectToChromeTarget({ port: 45015, timeoutMs: 25 });

		await expect(
			Promise.race([
				pending,
				new Promise<never>((_resolve, reject) =>
					setTimeout(() => reject(new Error("test guard elapsed")), 100),
				),
			]),
		).rejects.toThrow(
			"DevTools attachment stage browserDevToolsCdpConnection timed out after 25ms.",
		);

		resolveConnection?.({ close, on: vi.fn() });
		await vi.waitFor(() => expect(close).toHaveBeenCalledOnce());
		expect(connectionMocks.disposeEndpoint).toHaveBeenCalledOnce();
	});

	test("honors caller abort during the CDP handshake and disposes the endpoint", async () => {
		connectionMocks.disposeEndpoint.mockClear();
		connectionMocks.cdp.mockReturnValueOnce(new Promise(() => undefined));
		const abortController = new AbortController();

		const pending = connectToChromeTarget({
			port: 45015,
			abortSignal: abortController.signal,
			timeoutMs: 1_000,
		});
		abortController.abort(new Error("list deadline reached"));

		await expect(
			Promise.race([
				pending,
				new Promise<never>((_resolve, reject) =>
					setTimeout(() => reject(new Error("test guard elapsed")), 100),
				),
			]),
		).rejects.toThrow("list deadline reached");
		expect(connectionMocks.disposeEndpoint).toHaveBeenCalledOnce();
	});
});
