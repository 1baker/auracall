import { describe, expect, it } from "vitest";
import {
	type ChatgptDeveloperAppAdapter,
	executeChatgptDeveloperAppOperation,
} from "../../src/cli/chatgptDeveloperAppsCommand.js";

function createAdapter(
	overrides: Partial<ChatgptDeveloperAppAdapter> = {},
): ChatgptDeveloperAppAdapter {
	return {
		readState: async () => ({
			account: {
				email: "eric.cochran@soylei.com",
				plan: "Pro",
			},
			developerMode: true,
			apps: [
				{
					pluginId: "plugin_asdk_app_corel33t",
					appIds: ["asdk_app_corel33t"],
					name: "Corel33t",
					status: "ENABLED",
					enabled: true,
					authStatus: "ACTIVE",
					reviewStatus: "development",
				},
			],
			observedAt: "2026-07-24T12:00:00.000Z",
		}),
		create: async () => {
			throw new Error("unexpected create");
		},
		refresh: async () => {
			throw new Error("unexpected refresh");
		},
		selectForTest: async () => {
			throw new Error("unexpected select");
		},
		submitTest: async () => {
			throw new Error("unexpected submit");
		},
		uninstall: async () => {
			throw new Error("unexpected uninstall");
		},
		...overrides,
	};
}

describe("executeChatgptDeveloperAppOperation", () => {
	it("lists the account-bound developer-app state without mutation", async () => {
		const result = await executeChatgptDeveloperAppOperation(
			{
				action: "list",
			},
			createAdapter(),
		);

		expect(result).toEqual({
			action: "list",
			status: "observed",
			state: {
				account: {
					email: "eric.cochran@soylei.com",
					plan: "Pro",
				},
				developerMode: true,
				apps: [
					{
						pluginId: "plugin_asdk_app_corel33t",
						appIds: ["asdk_app_corel33t"],
						name: "Corel33t",
						status: "ENABLED",
						enabled: true,
						authStatus: "ACTIVE",
						reviewStatus: "development",
					},
				],
				observedAt: "2026-07-24T12:00:00.000Z",
			},
		});
	});

	it("rejects app creation before any browser mutation without explicit confirmation", async () => {
		let createCalled = false;
		const adapter = createAdapter({
			create: async () => {
				createCalled = true;
				throw new Error("should not mutate");
			},
		});

		await expect(
			executeChatgptDeveloperAppOperation(
				{
					action: "create",
					name: "LitScout Dev",
					serverUrl: "https://litscout.example.test/mcp",
					auth: "oauth",
					connection: "server-url",
					confirmed: false,
					expectedAccount: "eric.cochran@soylei.com",
				},
				adapter,
			),
		).rejects.toThrow("requires --yes");
		expect(createCalled).toBe(false);
	});

	it("fails closed when the live ChatGPT account does not match the expected account", async () => {
		await expect(
			executeChatgptDeveloperAppOperation(
				{
					action: "refresh",
					app: "Corel33t",
					confirmed: true,
					expectedAccount: "other@example.com",
				},
				createAdapter(),
			),
		).rejects.toThrow(
			"Expected ChatGPT account other@example.com, but the managed browser is eric.cochran@soylei.com",
		);
	});

	it("refreshes one exact app after confirmation and account verification", async () => {
		const refreshed: string[] = [];
		const result = await executeChatgptDeveloperAppOperation(
			{
				action: "refresh",
				app: "plugin_asdk_app_corel33t",
				confirmed: true,
				expectedAccount: "ERIC.COCHRAN@SOYLEI.COM",
			},
			createAdapter({
				refresh: async (app) => {
					refreshed.push(app.pluginId);
					return {
						status: "completed",
						message: "Corel33t refreshed.",
						app,
					};
				},
			}),
		);

		expect(refreshed).toEqual(["plugin_asdk_app_corel33t"]);
		expect(result).toMatchObject({
			action: "refresh",
			status: "completed",
			outcome: {
				message: "Corel33t refreshed.",
			},
		});
	});

	it("fails closed when an app name is ambiguous", async () => {
		const base = await createAdapter().readState();
		const adapter = createAdapter({
			readState: async () => ({
				...base,
				apps: [
					...base.apps,
					{
						...base.apps[0],
						pluginId: "plugin_asdk_app_corel33t_second",
						appIds: ["asdk_app_corel33t_second"],
					},
				],
			}),
		});

		await expect(
			executeChatgptDeveloperAppOperation(
				{
					action: "uninstall",
					app: "Corel33t",
					confirmed: true,
					expectedAccount: "eric.cochran@soylei.com",
				},
				adapter,
			),
		).rejects.toThrow("ambiguous; use an exact plugin id or app id");
	});

	it("returns an OAuth human gate from confirmed app creation", async () => {
		let receivedCreateInput: unknown = null;
		const result = await executeChatgptDeveloperAppOperation(
			{
				action: "create",
				name: "LitScout Dev",
				description: "LitScout developer app",
				serverUrl: "https://litscout.example.test/mcp",
				auth: "oauth",
				connection: "server-url",
				confirmed: true,
				expectedAccount: "eric.cochran@soylei.com",
			},
			createAdapter({
				create: async (input) => {
					receivedCreateInput = input;
					return {
						status: "awaiting-human",
						message: `Complete OAuth for ${input.name}.`,
						currentUrl: "https://litscout.example.test/oauth/authorize",
					};
				},
			}),
		);

		expect(result).toMatchObject({
			action: "create",
			status: "awaiting-human",
			outcome: {
				currentUrl: "https://litscout.example.test/oauth/authorize",
			},
		});
		expect(receivedCreateInput).toEqual({
			name: "LitScout Dev",
			description: "LitScout developer app",
			serverUrl: "https://litscout.example.test/mcp",
			auth: "oauth",
			connection: "server-url",
		});
	});

	it("select-tests an exact app without submitting a prompt or requiring mutation confirmation", async () => {
		const result = await executeChatgptDeveloperAppOperation(
			{
				action: "test",
				app: "Corel33t",
				submit: false,
				confirmed: false,
				expectedAccount: "eric.cochran@soylei.com",
			},
			createAdapter({
				selectForTest: async (app) => ({
					status: "completed",
					message: `${app.name} selected without prompt submission.`,
					app,
				}),
			}),
		);

		expect(result).toMatchObject({
			action: "test",
			status: "completed",
			outcome: {
				message: "Corel33t selected without prompt submission.",
			},
		});
	});

	it("requires a second explicit confirmation before a test prompt is submitted", async () => {
		await expect(
			executeChatgptDeveloperAppOperation(
				{
					action: "test",
					app: "Corel33t",
					submit: true,
					prompt: "Run a read-only auth smoke.",
					confirmed: false,
					expectedAccount: "eric.cochran@soylei.com",
				},
				createAdapter(),
			),
		).rejects.toThrow("requires --yes");
	});

	it("uninstalls only the exact resolved app after confirmation", async () => {
		const uninstalled: string[] = [];
		const result = await executeChatgptDeveloperAppOperation(
			{
				action: "uninstall",
				app: "asdk_app_corel33t",
				confirmed: true,
				expectedAccount: "eric.cochran@soylei.com",
			},
			createAdapter({
				uninstall: async (app) => {
					uninstalled.push(app.pluginId);
					return {
						status: "completed",
						message: `${app.name} uninstall confirmed.`,
						app,
					};
				},
			}),
		);

		expect(uninstalled).toEqual(["plugin_asdk_app_corel33t"]);
		expect(result.status).toBe("completed");
	});

	it("rejects non-HTTPS remote MCP endpoints before opening the create form", async () => {
		await expect(
			executeChatgptDeveloperAppOperation(
				{
					action: "create",
					name: "LitScout Dev",
					serverUrl: "http://litscout.example.test/mcp",
					auth: "oauth",
					connection: "server-url",
					confirmed: true,
					expectedAccount: "eric.cochran@soylei.com",
				},
				createAdapter(),
			),
		).rejects.toThrow("must use HTTPS");
	});
});
