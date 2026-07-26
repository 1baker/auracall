import { describe, expect, it, vi } from "vitest";
import { normalizeChatgptInstalledAppProbesForTest } from "../../src/browser/providers/chatgptAdapter.js";
import {
	CHATGPT_DEVELOPER_APP_SERVER_URL_SELECTOR,
	chatgptDeveloperAppSelectionMatchesForTest,
	deriveChatgptDeveloperAppState,
	isCompleteChatgptInstalledAppsPayloadForTest,
	markExactChatgptDeveloperAppDeleteMenuForTest,
	waitForChatgptDeveloperAppSettingsForDeleteForTest,
} from "../../src/browser/providers/chatgptDeveloperApps.js";

describe("deriveChatgptDeveloperAppState", () => {
	it("targets the current named server URL input rather than a volatile input type", () => {
		expect(CHATGPT_DEVELOPER_APP_SERVER_URL_SELECTOR).toBe(
			'[role="dialog"] input[name="custom-connector-url"]',
		);
	});

	it("maps private user-owned installed metadata and active OAuth link state", () => {
		const state = deriveChatgptDeveloperAppState({
			identity: {
				email: "eric.cochran@soylei.com",
				accountPlanType: "Pro",
			},
			developerMode: true,
			observedAt: "2026-07-24T12:00:00.000Z",
			featureSignature: JSON.stringify({
				inventory_complete: true,
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
			inventoryComplete: true,
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

	it("does not treat a missing installed-app response as a complete empty inventory", () => {
		const state = deriveChatgptDeveloperAppState({
			identity: {
				email: "eric.cochran@soylei.com",
			},
			developerMode: true,
			observedAt: "2026-07-25T12:00:00.000Z",
			featureSignature: JSON.stringify({
				inventory_complete: false,
				installed_apps: [],
				linked_apps: [],
			}),
		});

		expect(state.inventoryComplete).toBe(false);
		expect(state.apps).toEqual([]);
	});

	it("requires the installed-app plugins array before treating a 2xx payload as complete", () => {
		expect(isCompleteChatgptInstalledAppsPayloadForTest(null)).toBe(false);
		expect(isCompleteChatgptInstalledAppsPayloadForTest([])).toBe(false);
		expect(isCompleteChatgptInstalledAppsPayloadForTest({})).toBe(false);
		expect(
			isCompleteChatgptInstalledAppsPayloadForTest({
				error: "temporarily unavailable",
			}),
		).toBe(false);
		expect(isCompleteChatgptInstalledAppsPayloadForTest({ plugins: [] })).toBe(true);
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

	it("binds replacement deletion readiness to the exact app management route and heading", async () => {
		const evaluate = vi.fn(async (_options: { expression: string }) => ({
			result: {
				value: {
					appName: "Corel33t",
					hash: "#settings/Plugins/plugin_asdk_app_corel33t",
					dialogCount: 1,
					actionButtonCount: 1,
				},
			},
		}));

		const result = await waitForChatgptDeveloperAppSettingsForDeleteForTest(
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
		expect(expression).toContain('"#settings/Plugins/plugin_asdk_app_corel33t"');
		expect(expression).toContain("dialogs.length !== 1");
		expect(expression).toContain("actionButtons.length !== 1");
		expect(expression).toContain("data-auracall-delete-dialog");
		expect(expression).toContain("data-auracall-delete-trigger");
	});

	it("requires one visible menu with one exact Delete item before marking the trusted target", async () => {
		const evaluate = vi.fn(async (_options: { expression: string }) => ({
			result: {
				value: {
					menuCount: 1,
					deleteItemCount: 1,
				},
			},
		}));

		const result = await markExactChatgptDeveloperAppDeleteMenuForTest(
			// biome-ignore lint/style/useNamingConvention: CDP protocol domains use canonical capitalized names.
			{ Runtime: { evaluate } as never },
			"fixed-delete-marker",
		);

		expect(result.ok).toBe(true);
		const expression = evaluate.mock.calls[0]?.[0]?.expression as string;
		expect(expression).toContain("candidates.length !== 1");
		expect(expression).toContain("deleteItems.length !== 1");
		expect(expression).toContain("data-auracall-delete-menu");
		expect(expression).toContain("data-auracall-delete-item");
		expect(expression).toContain('"fixed-delete-marker"');
	});
});
