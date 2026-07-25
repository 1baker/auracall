import { describe, expect, it, vi } from "vitest";
import { normalizeChatgptInstalledAppProbesForTest } from "../../src/browser/providers/chatgptAdapter.js";
import {
	chatgptDeveloperAppSelectionMatchesForTest,
	deriveChatgptDeveloperAppState,
	waitForChatgptDeveloperAppRefreshControlForTest,
} from "../../src/browser/providers/chatgptDeveloperApps.js";

describe("deriveChatgptDeveloperAppState", () => {
	it("maps private user-owned installed metadata and active OAuth link state", () => {
		const state = deriveChatgptDeveloperAppState({
			identity: {
				email: "eric.cochran@soylei.com",
				accountPlanType: "Pro",
			},
			developerMode: true,
			observedAt: "2026-07-24T12:00:00.000Z",
			featureSignature: JSON.stringify({
				installed_apps: [
					{
						plugin_id: "plugin_asdk_app_corel33t",
						canonical_app_id: "asdk_app_corel33t",
						provider_name: "dev-corel33t",
						name: "Corel33t",
						app_ids: ["asdk_app_corel33t"],
						status: "ENABLED",
						enabled: true,
						scope: "USER",
						discoverability: "PRIVATE",
						creator_name: "Eric Cochran",
						release_version: "1.0.0",
						description: "LitScout",
						authentication_policy: "ON_INSTALL",
					},
				],
				linked_apps: [
					{
						connector_id: "asdk_app_corel33t",
						name: "Corel33t",
						auth_status: "ACTIVE",
						connector_status: "ENABLED",
					},
				],
			}),
		});

		expect(state).toEqual({
			account: {
				email: "eric.cochran@soylei.com",
				plan: "Pro",
			},
			developerMode: true,
			observedAt: "2026-07-24T12:00:00.000Z",
			apps: [
				{
					pluginId: "plugin_asdk_app_corel33t",
					appIds: ["asdk_app_corel33t"],
					name: "Corel33t",
					status: "ENABLED",
					enabled: true,
					authStatus: "ACTIVE",
					reviewStatus: "development",
					authorization: "ON_INSTALL",
					endpoint: null,
					versionId: "1.0.0",
					scope: "USER",
					discoverability: "PRIVATE",
					creatorName: "Eric Cochran",
					description: "LitScout",
				},
			],
		});
	});

	it("preserves provider metadata needed to distinguish a private development app", () => {
		const apps = normalizeChatgptInstalledAppProbesForTest([
			{
				id: "plugin_asdk_app_corel33t",
				name: "dev-corel33t",
				canonical_app_id: "asdk_app_corel33t",
				scope: "USER",
				discoverability: "PRIVATE",
				creator_name: "Eric Cochran",
				status: "ENABLED",
				enabled: true,
				installation_policy: undefined,
				authentication_policy: "ON_INSTALL",
				release: {
					version: "1.0.0",
					display_name: "Corel33t",
					description: "LitScout",
					app_ids: ["asdk_app_corel33t"],
				},
			},
		]);

		expect(apps).toEqual([
			{
				plugin_id: "plugin_asdk_app_corel33t",
				canonical_app_id: "asdk_app_corel33t",
				provider_name: "dev-corel33t",
				name: "Corel33t",
				app_ids: ["asdk_app_corel33t"],
				status: "ENABLED",
				enabled: true,
				authentication_policy: "ON_INSTALL",
				scope: "USER",
				discoverability: "PRIVATE",
				creator_name: "Eric Cochran",
				release_version: "1.0.0",
				description: "LitScout",
			},
		]);
	});

	it("matches a selected ecosystem mention against canonical app IDs as well as plugin IDs", () => {
		expect(
			chatgptDeveloperAppSelectionMatchesForTest("plugin:asdk_app_corel33t", {
				pluginId: "plugin_asdk_app_corel33t",
				appIds: ["asdk_app_corel33t"],
				name: "Corel33t",
			}),
		).toBe(true);
	});

	it("requires one exact app dialog and enabled Refresh control on the exact plugin route", async () => {
		const evaluate = vi.fn(async (_options: { expression: string }) => ({
			result: {
				value: {
					appName: "Corel33t",
					hash: "#settings/Plugins/plugin_asdk_app_corel33t",
					dialogCount: 1,
					refreshCount: 1,
				},
			},
		}));

		const result = await waitForChatgptDeveloperAppRefreshControlForTest(
			// biome-ignore lint/style/useNamingConvention: CDP protocol domains use canonical capitalized names.
			{ Runtime: { evaluate } as never },
			{
				pluginId: "plugin_asdk_app_corel33t",
				appIds: ["asdk_app_corel33t"],
				name: "Corel33t",
			},
		);

		expect(result.ok).toBe(true);
		const expression = evaluate.mock.calls[0]?.[0]?.expression as string;
		expect(expression).toContain('"Corel33t"');
		expect(expression).toContain(
			'"#settings/Plugins/plugin_asdk_app_corel33t"',
		);
		expect(expression).toContain("dialogs.length !== 1");
		expect(expression).toContain("refreshButtons.length !== 1");
		expect(expression).toContain("button.disabled");
	});
});
