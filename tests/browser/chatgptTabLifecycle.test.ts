import { beforeEach, describe, expect, test, vi } from "vitest";

const chatgptTabLifecycleMocks = vi.hoisted(() => ({
	cdpClose: vi.fn(async () => undefined),
}));

vi.mock("chrome-remote-interface", () => {
	const defaultExport = {};
	Object.defineProperty(defaultExport, "Close", {
		enumerable: true,
		value: chatgptTabLifecycleMocks.cdpClose,
	});
	return { default: defaultExport };
});

import { shouldAttachResolvedServiceTabForTest } from "../../src/browser/llmService/llmService.js";
import {
	bindChatgptAbortCleanupForTest,
	closeChatgptTabConnectionForTest,
	runWithChatgptAbortBoundConnectionForTest,
	shouldDisposeChatgptTabConnectionForTest,
	shouldForceNewChatgptTabConnectionForTest,
} from "../../src/browser/providers/chatgptAdapter.js";

function createConnection(input: {
	shouldClose?: boolean;
	targetId?: string;
	clientClose?: () => Promise<void>;
}) {
	return {
		client: {
			close: vi.fn(input.clientClose ?? (async () => undefined)),
		},
		shouldClose: input.shouldClose ?? true,
		targetId: input.targetId ?? "target-1",
		host: "127.0.0.1",
		port: 45011,
	};
}

function asClosableConnection(connection: ReturnType<typeof createConnection>) {
	return connection as unknown as Parameters<typeof closeChatgptTabConnectionForTest>[0];
}

describe("ChatGPT tab lifecycle", () => {
	beforeEach(() => {
		chatgptTabLifecycleMocks.cdpClose.mockClear();
	});

	test("disposes newly opened tabs only when account-mirror asks for disposable reads", async () => {
		const connection = createConnection({});

		expect(
			shouldDisposeChatgptTabConnectionForTest(connection, {
				tabLifecycle: "dispose-new",
			}),
		).toBe(true);

		await closeChatgptTabConnectionForTest(asClosableConnection(connection), {
			tabLifecycle: "dispose-new",
		});

		expect(connection.client.close).toHaveBeenCalledTimes(1);
		expect(chatgptTabLifecycleMocks.cdpClose).toHaveBeenCalledWith({
			host: "127.0.0.1",
			port: 45011,
			id: "target-1",
		});
	});

	test("closes a disposable inventory tab as soon as its provider call is aborted", async () => {
		const connection = createConnection({});
		const controller = new AbortController();
		const unbind = bindChatgptAbortCleanupForTest(
			asClosableConnection(connection) as Parameters<typeof bindChatgptAbortCleanupForTest>[0],
			{
				tabLifecycle: "dispose-new",
				abortSignal: controller.signal,
			},
		);

		controller.abort(new Error("provider deadline exceeded"));
		await vi.waitFor(() => {
			expect(connection.client.close).toHaveBeenCalledTimes(1);
			expect(chatgptTabLifecycleMocks.cdpClose).toHaveBeenCalledTimes(1);
		});
		unbind();

		expect(chatgptTabLifecycleMocks.cdpClose).toHaveBeenCalledWith({
			host: "127.0.0.1",
			port: 45011,
			id: "target-1",
		});
	});

	test("does not read identity after its disposable connection was aborted", async () => {
		const connection = createConnection({});
		const controller = new AbortController();
		const readIdentity = vi.fn(async () => ({ email: "operator@example.com" }));
		controller.abort(new Error("identity deadline exceeded"));

		await expect(
			runWithChatgptAbortBoundConnectionForTest(
				asClosableConnection(connection) as Parameters<
					typeof runWithChatgptAbortBoundConnectionForTest
				>[0],
				{
					tabLifecycle: "dispose-new",
					abortSignal: controller.signal,
				},
				readIdentity,
			),
		).rejects.toThrow("identity deadline exceeded");

		expect(readIdentity).not.toHaveBeenCalled();
		expect(connection.client.close).toHaveBeenCalledTimes(1);
		expect(chatgptTabLifecycleMocks.cdpClose).toHaveBeenCalledWith({
			host: "127.0.0.1",
			port: 45011,
			id: "target-1",
		});
	});

	test("retains submitted or explicitly preserved tabs", async () => {
		const submittedTab = createConnection({});
		const preservedTab = createConnection({});

		expect(
			shouldDisposeChatgptTabConnectionForTest(submittedTab, {
				tabLifecycle: "dispose-new",
				tabTargetId: "submitted-target",
			}),
		).toBe(false);
		expect(
			shouldDisposeChatgptTabConnectionForTest(preservedTab, {
				tabLifecycle: "dispose-new",
				preserveActiveTab: true,
			}),
		).toBe(false);

		await closeChatgptTabConnectionForTest(asClosableConnection(submittedTab), {
			tabLifecycle: "dispose-new",
			tabTargetId: "submitted-target",
		});
		await closeChatgptTabConnectionForTest(asClosableConnection(preservedTab), {
			tabLifecycle: "dispose-new",
			preserveActiveTab: true,
		});

		expect(chatgptTabLifecycleMocks.cdpClose).not.toHaveBeenCalled();
	});

	test("retains reused targets and default provider calls", async () => {
		const reused = createConnection({ shouldClose: false });
		const defaultCall = createConnection({});

		expect(
			shouldDisposeChatgptTabConnectionForTest(reused, {
				tabLifecycle: "dispose-new",
			}),
		).toBe(false);
		expect(shouldDisposeChatgptTabConnectionForTest(defaultCall)).toBe(false);

		await closeChatgptTabConnectionForTest(asClosableConnection(reused), {
			tabLifecycle: "dispose-new",
		});
		await closeChatgptTabConnectionForTest(asClosableConnection(defaultCall));

		expect(chatgptTabLifecycleMocks.cdpClose).not.toHaveBeenCalled();
	});

	test("forces disposable inventory reads onto a new tab instead of a resolved service tab", () => {
		expect(
			shouldAttachResolvedServiceTabForTest({
				tabLifecycle: "dispose-new",
			}),
		).toBe(false);
		expect(
			shouldForceNewChatgptTabConnectionForTest({
				tabLifecycle: "dispose-new",
			}),
		).toBe(true);
	});

	test("keeps explicit submitted tabs eligible for attachment", () => {
		expect(
			shouldAttachResolvedServiceTabForTest({
				tabLifecycle: "dispose-new",
				tabTargetId: "submitted-target",
			}),
		).toBe(true);
		expect(
			shouldForceNewChatgptTabConnectionForTest({
				tabLifecycle: "dispose-new",
				tabTargetId: "submitted-target",
			}),
		).toBe(false);
		expect(
			shouldForceNewChatgptTabConnectionForTest({
				tabLifecycle: "dispose-new",
				preserveActiveTab: true,
			}),
		).toBe(false);
	});
});
