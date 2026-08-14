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
