import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { setAuracallHomeDirOverrideForTest } from "../../src/auracallHome.js";
import type { CacheStore } from "../../src/browser/llmService/cache/store.js";
import { JsonCacheStore } from "../../src/browser/llmService/cache/store.js";
import {
	LlmService,
	stripProjectInstructionsPrefixFromConversationContext,
} from "../../src/browser/llmService/llmService.js";
import type {
	LlmServiceAdapter,
	PromptInput,
	PromptResult,
} from "../../src/browser/llmService/types.js";
import type { ProviderCacheContext } from "../../src/browser/providers/cache.js";
import type { ConversationContext } from "../../src/browser/providers/domain.js";
import type { BrowserProviderListOptions } from "../../src/browser/providers/types.js";
import type { ResolvedUserConfig } from "../../src/config.js";

class TestContextLlmService extends LlmService {
	constructor(
		provider: LlmServiceAdapter,
		cacheStore: CacheStore,
		private readonly fixedCacheContext: ProviderCacheContext,
	) {
		super({ browser: { cache: {} } } as ResolvedUserConfig, provider, {} as never, { cacheStore });
	}

	override async buildListOptions(
		overrides: BrowserProviderListOptions = {},
	): Promise<BrowserProviderListOptions> {
		return { ...overrides };
	}

	override async resolveCacheContext(): Promise<ProviderCacheContext> {
		return this.fixedCacheContext;
	}

	async listProjects(): Promise<[]> {
		return [];
	}

	async listConversations(): Promise<[]> {
		return [];
	}

	async runPrompt(_input: PromptInput): Promise<PromptResult> {
		throw new Error("not implemented");
	}

	async renameConversation(): Promise<void> {}

	async deleteConversation(): Promise<void> {}

	async getUserIdentity() {
		return null;
	}
}

class InventoryContextLlmService extends LlmService {
	identityReads = 0;

	constructor(provider: LlmServiceAdapter, cacheStore: CacheStore) {
		super(
			{ browser: { cache: { identityKey: "inventory@example.com" } } } as ResolvedUserConfig,
			provider,
			{} as never,
			{ cacheStore },
		);
	}

	override async buildListOptions(
		overrides: BrowserProviderListOptions = {},
	): Promise<BrowserProviderListOptions> {
		return { ...overrides };
	}

	async listProjects(): Promise<[]> {
		return [];
	}

	async listConversations(): Promise<[]> {
		return [];
	}

	async runPrompt(_input: PromptInput): Promise<PromptResult> {
		throw new Error("not implemented");
	}

	async renameConversation(): Promise<void> {}

	async deleteConversation(): Promise<void> {}

	async getUserIdentity() {
		this.identityReads += 1;
		return { email: "detected@example.com", source: "browser-session" };
	}
}

describe("project-scoped conversation context normalization", () => {
	afterEach(() => {
		setAuracallHomeDirOverrideForTest(null);
	});

	test("strips a prefixed project instructions block from the first assistant message", () => {
		const context: ConversationContext = {
			provider: "grok",
			conversationId: "conversation-123",
			messages: [
				{ role: "user", text: "Reply exactly with: Context Probe Answer" },
				{
					role: "assistant",
					text: "Context probe instructions\nLine two\nContext Probe Answer",
				},
			],
		};

		expect(
			stripProjectInstructionsPrefixFromConversationContext(
				context,
				"Context probe instructions\nLine two\n",
			),
		).toEqual({
			provider: "grok",
			conversationId: "conversation-123",
			messages: [
				{ role: "user", text: "Reply exactly with: Context Probe Answer" },
				{ role: "assistant", text: "Context Probe Answer" },
			],
		});
	});

	test("does not strip when the assistant message does not start with the project instructions", () => {
		const context: ConversationContext = {
			provider: "grok",
			conversationId: "conversation-123",
			messages: [
				{ role: "assistant", text: "Context Probe Answer\nContext probe instructions\nLine two" },
			],
		};

		expect(
			stripProjectInstructionsPrefixFromConversationContext(
				context,
				"Context probe instructions\nLine two\n",
			),
		).toEqual(context);
	});

	test("getConversationContext writes Gemini-style context into cache on the shared contract", async () => {
		const homeDir = await mkdtemp(path.join(os.tmpdir(), "auracall-llm-context-"));
		setAuracallHomeDirOverrideForTest(homeDir);
		const cacheContext: ProviderCacheContext = {
			provider: "gemini",
			userConfig: {} as ProviderCacheContext["userConfig"],
			listOptions: {},
			identityKey: "cache-test@example.com",
		};
		const store = new JsonCacheStore();
		const context: ConversationContext = {
			provider: "gemini",
			conversationId: "conversation-ctx",
			messages: [
				{
					role: "user",
					text: "Disposable Gemini context probe 2026-04-06: reply exactly ACK CONTEXT PROBE",
				},
				{ role: "assistant", text: "ACK CONTEXT PROBE" },
			],
			files: [
				{
					id: "gemini-conversation-file:conversation-ctx:0:probe.txt",
					name: "probe.txt",
					provider: "gemini",
					source: "conversation",
					mimeType: "text/plain",
				},
			],
			artifacts: [
				{
					id: "gemini-artifact:conversation-ctx:1:0",
					title: "Generated image 1",
					kind: "image",
					uri: "blob:https://gemini.google.com/fake-artifact",
					messageIndex: 1,
				},
				{
					id: "gemini-document:conversation-ctx",
					title: "Deep Research Brief",
					kind: "document",
					uri: "gemini://document/conversation-ctx",
					messageIndex: 1,
					metadata: {
						documentType: "deep-research",
					},
				},
			],
		};
		const provider = {
			id: "gemini",
			config: { id: "gemini", selectors: {} as never },
			readConversationContext: vi.fn(async () => context),
		};
		const service = new TestContextLlmService(provider as never, store, cacheContext);

		try {
			const result = await service.getConversationContext("conversation-ctx", { listOptions: {} });
			expect(result).toEqual(context);
			expect(provider.readConversationContext).toHaveBeenCalledWith(
				"conversation-ctx",
				undefined,
				{},
			);
			const cached = await store.readConversationContext(cacheContext, "conversation-ctx");
			expect(cached.items).toEqual(context);
		} finally {
			await rm(homeDir, { recursive: true, force: true });
		}
	});

	test("getConversationContext can require a live refresh instead of cached fallback", async () => {
		const homeDir = await mkdtemp(path.join(os.tmpdir(), "auracall-llm-context-no-fallback-"));
		setAuracallHomeDirOverrideForTest(homeDir);
		const cacheContext: ProviderCacheContext = {
			provider: "gemini",
			userConfig: {} as ProviderCacheContext["userConfig"],
			listOptions: {},
			identityKey: "cache-test@example.com",
		};
		const store = new JsonCacheStore();
		await store.writeConversationContext(cacheContext, "conversation-ctx", {
			provider: "gemini",
			conversationId: "conversation-ctx",
			messages: [{ role: "assistant", text: "stale cached context" }],
		});
		const provider = {
			id: "gemini",
			config: { id: "gemini", selectors: {} as never },
			readConversationContext: vi.fn(async () => {
				throw new Error("live Gemini context failed");
			}),
		};
		const service = new TestContextLlmService(provider as never, store, cacheContext);

		try {
			await expect(
				service.getConversationContext("conversation-ctx", {
					refresh: true,
					allowCacheFallback: false,
					listOptions: {},
				}),
			).rejects.toThrow("live Gemini context failed");

			await expect(
				service.getConversationContext("conversation-ctx", {
					refresh: true,
					listOptions: {},
				}),
			).resolves.toMatchObject({
				messages: [{ role: "assistant", text: "stale cached context" }],
			});
		} finally {
			await rm(homeDir, { recursive: true, force: true });
		}
	});

	test("account-mirror context reads reuse verified identity instead of opening cache identity probes", async () => {
		const homeDir = await mkdtemp(path.join(os.tmpdir(), "auracall-llm-context-inventory-"));
		setAuracallHomeDirOverrideForTest(homeDir);
		const store = new JsonCacheStore();
		const provider = {
			id: "chatgpt",
			config: { id: "chatgpt", selectors: {} as never },
			getFeatureSignature: vi.fn(async () => "feature-signature"),
			readConversationContext: vi.fn(async () => ({
				provider: "chatgpt" as const,
				conversationId: "conversation-inventory",
				messages: [{ role: "assistant" as const, text: "inventory context" }],
			})),
		};
		const service = new InventoryContextLlmService(provider as never, store);

		try {
			await service.getConversationContext("conversation-inventory", {
				refresh: true,
				listOptions: {
					accountMirrorInventory: true,
					skipFeatureSignature: true,
				},
			});

			expect(service.identityReads).toBe(0);
			expect(provider.getFeatureSignature).not.toHaveBeenCalled();
			expect(provider.readConversationContext).toHaveBeenCalledTimes(1);
		} finally {
			await rm(homeDir, { recursive: true, force: true });
		}
	});

	test("account-mirror context reads do not retry a distinguished rate-limit hard stop", async () => {
		const homeDir = await mkdtemp(path.join(os.tmpdir(), "auracall-llm-context-hard-stop-"));
		setAuracallHomeDirOverrideForTest(homeDir);
		const store = new JsonCacheStore();
		const hardStop = Object.assign(new Error("Too many requests."), {
			blockingSurface: {
				kind: "rate-limit" as const,
				summary: "ChatGPT rate limit warning",
			},
		});
		const provider = {
			id: "chatgpt",
			config: { id: "chatgpt", selectors: {} as never },
			readConversationContext: vi.fn(async () => {
				throw hardStop;
			}),
		};
		const service = new InventoryContextLlmService(provider as never, store);
		const timeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation((callback) => {
			callback();
			return 0 as unknown as ReturnType<typeof setTimeout>;
		});

		try {
			await expect(
				service.getConversationContext("conversation-hard-stop", {
					refresh: true,
					allowCacheFallback: false,
					listOptions: {
						accountMirrorInventory: true,
						skipFeatureSignature: true,
					},
				}),
			).rejects.toThrow("ChatGPT rate limit detected");

			expect(provider.readConversationContext).toHaveBeenCalledTimes(1);
		} finally {
			timeoutSpy.mockRestore();
			await rm(homeDir, { recursive: true, force: true });
		}
	});

	test("account-mirror context reads still retry an ordinary transient failure", async () => {
		const homeDir = await mkdtemp(path.join(os.tmpdir(), "auracall-llm-context-transient-"));
		setAuracallHomeDirOverrideForTest(homeDir);
		const store = new JsonCacheStore();
		const provider = {
			id: "chatgpt",
			config: { id: "chatgpt", selectors: {} as never },
			readConversationContext: vi
				.fn()
				.mockRejectedValueOnce(new Error("WebSocket connection closed"))
				.mockResolvedValueOnce({
					provider: "chatgpt" as const,
					conversationId: "conversation-transient",
					messages: [{ role: "assistant" as const, text: "recovered context" }],
				}),
		};
		const service = new InventoryContextLlmService(provider as never, store);
		const timeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation((callback) => {
			callback();
			return 0 as unknown as ReturnType<typeof setTimeout>;
		});

		try {
			await expect(
				service.getConversationContext("conversation-transient", {
					refresh: true,
					allowCacheFallback: false,
					listOptions: {
						accountMirrorInventory: true,
						skipFeatureSignature: true,
					},
				}),
			).resolves.toMatchObject({
				conversationId: "conversation-transient",
				messages: [{ text: "recovered context" }],
			});

			expect(provider.readConversationContext).toHaveBeenCalledTimes(2);
		} finally {
			timeoutSpy.mockRestore();
			await rm(homeDir, { recursive: true, force: true });
		}
	});
});
