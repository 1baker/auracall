import type { ResolvedUserConfig } from "../../config.js";
import type { BrowserAutomationClient } from "../client.js";
import {
	navigateAndSettle,
	openAndSelectMenuItem,
	pressButton,
	pressButtonWithTrustedPointer,
	reloadAndSettle,
	setInputValue,
	waitForPredicate,
} from "../service/ui.js";
import type { ChromeClient } from "../types.js";
import {
	classifyChatgptBlockingSurfaceProbe,
	normalizeChatgptInstalledAppProbes,
	normalizeChatgptLinkedAppProbes,
} from "./chatgptAdapter.js";
import type { ProviderUserIdentity } from "./types.js";

export interface ChatgptDeveloperAppStateInput {
	identity: ProviderUserIdentity | null;
	developerMode: boolean;
	featureSignature: string | null | undefined;
	observedAt: string;
}

export interface ChatgptDeveloperAppBrowserState {
	account: {
		email: string | null;
		plan: string | null;
	};
	developerMode: boolean;
	inventoryComplete: boolean;
	apps: ChatgptDeveloperAppBrowserEntry[];
	observedAt: string;
}

export interface ChatgptDeveloperAppBrowserEntry {
	pluginId: string;
	appIds: string[];
	name: string;
	status: string | null;
	enabled: boolean | null;
	authStatus: string | null;
	reviewStatus: string | null;
	authorization: string | null;
	endpoint: string | null;
	versionId: string | null;
	scope: string | null;
	discoverability: string | null;
	creatorName: string | null;
	description: string | null;
}

export type ChatgptDeveloperAppBrowserTarget = Pick<
	ChatgptDeveloperAppBrowserEntry,
	"pluginId" | "appIds" | "name"
> &
	Partial<Omit<ChatgptDeveloperAppBrowserEntry, "pluginId" | "appIds" | "name">>;

export interface ChatgptDeveloperAppBrowserMutationOutcome {
	status: "completed" | "awaiting-human";
	message: string;
	currentUrl?: string | null;
	app?: ChatgptDeveloperAppBrowserTarget | null;
}

export interface ChatgptDeveloperAppBrowserCreateInput {
	name: string;
	serverUrl: string;
	description?: string | null;
	auth: "oauth" | "none" | "mixed";
	connection: "server-url" | "tunnel";
}

export interface ChatgptDeveloperAppBrowserClient {
	readonly userConfig: ResolvedUserConfig;
	getUserIdentity(): Promise<ProviderUserIdentity | null>;
	connectDevTools(): Promise<{ client: ChromeClient; port: number }>;
	runPrompt(input: {
		prompt: string;
		completionMode: "prompt_submitted";
		timeoutMs?: number | null;
	}): Promise<{
		conversationId?: string | null;
		url?: string | null;
	}>;
}

export type ChatgptDeveloperAppBrowserClientFactory = (
	userConfig: ResolvedUserConfig,
) => Promise<ChatgptDeveloperAppBrowserClient>;

export class ChatgptDeveloperAppBrowserAdapter {
	private cdpClient: ChromeClient | null = null;

	constructor(
		private readonly browser: ChatgptDeveloperAppBrowserClient,
		private readonly createBrowser: ChatgptDeveloperAppBrowserClientFactory,
	) {}

	async readState(): Promise<ChatgptDeveloperAppBrowserState> {
		debugDeveloperApps("reading ChatGPT identity");
		const identity = await this.browser.getUserIdentity();
		debugDeveloperApps("connecting to the managed browser for app inventory");
		const client = await this.ensureClient();
		const originalUrl = await readCurrentUrl(client);
		try {
			debugDeveloperApps("reading installed and linked app signals");
			const featureSignature = await captureChatgptDeveloperAppFeatureSignature(client);
			debugDeveloperApps("reading Developer mode");
			const developerMode = await readChatgptDeveloperMode(client);
			debugDeveloperApps("developer-app inventory complete");
			return deriveChatgptDeveloperAppState({
				identity,
				developerMode,
				featureSignature,
				observedAt: new Date().toISOString(),
			});
		} finally {
			if (originalUrl?.startsWith("https://chatgpt.com/")) {
				await navigateChatgpt(client, originalUrl).catch(() => undefined);
			}
		}
	}

	async create(
		input: ChatgptDeveloperAppBrowserCreateInput,
	): Promise<ChatgptDeveloperAppBrowserMutationOutcome> {
		const client = await this.ensureClient();
		await navigateChatgpt(client, "https://chatgpt.com/plugins");
		await assertNoChatgptBlockingSurface(client, "create developer app");
		const opened = await pressButton(client.Runtime, {
			selector: 'button[aria-label="Create app"]',
			interactionStrategies: ["pointer"],
			requireVisible: true,
			postSelector: '[role="dialog"]',
			timeoutMs: 8_000,
		});
		if (!opened.ok) {
			throw new Error(
				`Unable to open ChatGPT Create app: ${opened.reason ?? "control not found"}.`,
			);
		}
		await setRequiredInput(client, 'input[aria-label="Name"]', input.name, "app name");
		if (input.description) {
			await setRequiredInput(
				client,
				'input[aria-label="Description (optional)"]',
				input.description,
				"app description",
			);
		}
		const connectionLabel = input.connection === "tunnel" ? "Tunnel" : "Server URL";
		const connectionSelected = await pressButton(client.Runtime, {
			rootSelectors: ['[role="dialog"]'],
			match: { exact: [connectionLabel.toLowerCase()] },
			interactionStrategies: ["pointer"],
			requireVisible: true,
			timeoutMs: 3_000,
		});
		if (!connectionSelected.ok) {
			throw new Error(`Unable to select ChatGPT app connection mode ${connectionLabel}.`);
		}
		await setRequiredInput(
			client,
			'[role="dialog"] input[placeholder*="https://"], [role="dialog"] input[type="url"]',
			input.serverUrl,
			"MCP server URL",
		);
		await selectNativeOptionByText(
			client,
			'[role="dialog"] select',
			input.auth === "none" ? "No Auth" : input.auth === "mixed" ? "Mixed" : "OAuth",
		);
		const acknowledged = await pressButton(client.Runtime, {
			selector: '[role="dialog"] input[type="checkbox"]',
			interactionStrategies: ["pointer"],
			requireVisible: true,
			timeoutMs: 5_000,
		});
		if (!acknowledged.ok) {
			throw new Error("Unable to acknowledge the ChatGPT custom MCP server risk warning.");
		}
		const createReady = await waitForPredicate(
			client.Runtime,
			`(() => {
        const buttons = Array.from(document.querySelectorAll('[role="dialog"] button'));
        const button = buttons.find((candidate) => String(candidate.textContent || '').trim() === 'Create');
        return Boolean(button && !button.disabled);
      })()`,
			{ timeoutMs: 15_000, description: "enabled ChatGPT Create app button" },
		);
		if (!createReady.ok) {
			throw new Error("ChatGPT Create app did not become enabled after form validation.");
		}
		const submitted = await pressButton(client.Runtime, {
			rootSelectors: ['[role="dialog"]'],
			match: { exact: ["create"] },
			interactionStrategies: ["pointer"],
			requireVisible: true,
			timeoutMs: 5_000,
		});
		if (!submitted.ok) {
			throw new Error(
				`Unable to submit ChatGPT Create app: ${submitted.reason ?? "button unavailable"}.`,
			);
		}
		await wait(750);
		await assertNoChatgptBlockingSurface(client, "create developer app");
		const currentUrl = await readCurrentUrl(client);
		if (input.auth === "oauth") {
			return {
				status: "awaiting-human",
				message:
					"App creation was submitted. Complete any OAuth sign-in, MFA, or consent shown in the managed browser, then rerun apps list.",
				currentUrl,
			};
		}
		return {
			status: "completed",
			message: `${input.name} creation submitted.`,
			currentUrl,
		};
	}

	async selectForTest(
		app: ChatgptDeveloperAppBrowserTarget,
	): Promise<ChatgptDeveloperAppBrowserMutationOutcome> {
		const client = await this.ensureClient();
		await navigateChatgpt(client, "https://chatgpt.com/");
		await assertNoChatgptBlockingSurface(client, `select ${app.name}`);
		await clearDeveloperAppComposer(client);
		try {
			await selectDeveloperAppMention(client, app.name);
			const selected = await readSelectedEcosystemMention(client);
			if (!selected || !chatgptDeveloperAppSelectionMatchesForTest(selected.pluginId, app)) {
				throw new Error(`ChatGPT selected ${selected?.label ?? "no app"} instead of ${app.name}.`);
			}
			return {
				status: "completed",
				message: `${app.name} selected without prompt submission; the blank composer was cleared afterward.`,
				currentUrl: await readCurrentUrl(client),
				app,
			};
		} finally {
			await clearDeveloperAppComposer(client);
		}
	}

	async submitTest(
		app: ChatgptDeveloperAppBrowserTarget,
		prompt: string,
	): Promise<ChatgptDeveloperAppBrowserMutationOutcome> {
		const testConfig: ResolvedUserConfig = {
			...this.browser.userConfig,
			browser: {
				...(this.browser.userConfig.browser ?? {}),
				composerTool: app.name,
			},
		};
		const testBrowser = await this.createBrowser(testConfig);
		const result = await testBrowser.runPrompt({
			prompt,
			completionMode: "prompt_submitted",
			timeoutMs: 120_000,
		});
		return {
			status: "completed",
			message: `${app.name} test prompt submitted${result.conversationId ? ` in conversation ${result.conversationId}` : ""}.`,
			currentUrl: result.url ?? null,
			app,
		};
	}

	async delete(
		app: ChatgptDeveloperAppBrowserTarget,
	): Promise<ChatgptDeveloperAppBrowserMutationOutcome> {
		const client = await this.ensureClient();
		await navigateChatgpt(
			client,
			`https://chatgpt.com/plugins#settings/Plugins/${encodeURIComponent(app.pluginId)}`,
		);
		await assertNoChatgptBlockingSurface(client, `delete ${app.name}`);
		const targetMarker = `auracall-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const ready = await waitForChatgptDeveloperAppSettingsForDelete(client, app, targetMarker);
		if (!ready.ok) {
			throw new Error(
				`ChatGPT developer app ${app.name} did not expose its exact Developer mode management surface.`,
			);
		}
		const opened = await pressButtonWithTrustedPointer(client, {
			selector: `button[data-auracall-delete-trigger="${targetMarker}"]`,
			requireVisible: true,
			postSelector: '[role="menu"]',
			timeoutMs: 8_000,
		});
		if (!opened.ok) {
			throw new Error(`Unable to open the exact Developer mode actions for ${app.name}.`);
		}
		const exactMenuReady = await markExactChatgptDeveloperAppDeleteMenu(client, targetMarker);
		if (!exactMenuReady.ok) {
			throw new Error(`Unable to isolate one exact Delete menu item for ${app.name}.`);
		}
		const selected = await pressButtonWithTrustedPointer(client, {
			selector: `[data-auracall-delete-item="${targetMarker}"]`,
			requireVisible: true,
			timeoutMs: 8_000,
		});
		if (!selected.ok) {
			throw new Error(
				`Unable to select the exact Delete action for ${app.name}: ${selected.reason ?? "trusted pointer activation failed"}.`,
			);
		}
		await wait(750);
		await assertNoChatgptBlockingSurface(client, `complete delete ${app.name}`);
		return {
			status: "completed",
			message: `${app.name} Delete action selected.`,
			currentUrl: await readCurrentUrl(client),
			app,
		};
	}

	async uninstall(
		app: ChatgptDeveloperAppBrowserTarget,
	): Promise<ChatgptDeveloperAppBrowserMutationOutcome> {
		const client = await this.ensureClient();
		await navigateChatgpt(
			client,
			`https://chatgpt.com/plugins/${encodeURIComponent(app.pluginId)}`,
		);
		await assertNoChatgptBlockingSurface(client, `uninstall ${app.name}`);
		const selected = await openAndSelectMenuItem(client.Runtime, {
			trigger: {
				selector: 'button[aria-label="Plugin actions"]',
				interactionStrategies: ["pointer"],
				requireVisible: true,
			},
			itemMatch: { exact: ["uninstall"] },
			menuSelector: '[role="menu"]',
			timeoutMs: 8_000,
		});
		if (!selected) {
			throw new Error(`Unable to open the uninstall confirmation for ${app.name}.`);
		}
		const confirmed = await pressButton(client.Runtime, {
			rootSelectors: ['[role="dialog"]'],
			match: { exact: ["uninstall"] },
			interactionStrategies: ["pointer"],
			requireVisible: true,
			timeoutMs: 8_000,
		});
		if (!confirmed.ok) {
			throw new Error(`Unable to confirm uninstall for ${app.name}.`);
		}
		return {
			status: "completed",
			message: `${app.name} uninstall confirmed.`,
			currentUrl: await readCurrentUrl(client),
			app,
		};
	}

	async close(): Promise<void> {
		const client = this.cdpClient;
		this.cdpClient = null;
		debugDeveloperApps("closing developer-app browser client");
		await client?.close().catch(() => undefined);
		debugDeveloperApps("developer-app browser client closed");
	}

	private async ensureClient(): Promise<ChromeClient> {
		if (this.cdpClient) return this.cdpClient;
		const connected = await this.browser.connectDevTools();
		this.cdpClient = connected.client;
		await this.cdpClient.Runtime.enable();
		await this.cdpClient.Page.enable();
		return this.cdpClient;
	}
}

export function createChatgptDeveloperAppBrowserAdapter(
	browser: BrowserAutomationClient,
	createBrowser: ChatgptDeveloperAppBrowserClientFactory,
): ChatgptDeveloperAppBrowserAdapter {
	return new ChatgptDeveloperAppBrowserAdapter(browser, createBrowser);
}

export function deriveChatgptDeveloperAppState(
	input: ChatgptDeveloperAppStateInput,
): ChatgptDeveloperAppBrowserState {
	const signature = parseRecord(input.featureSignature);
	const installed = Array.isArray(signature?.installed_apps) ? signature.installed_apps : [];
	const links = Array.isArray(signature?.linked_apps) ? signature.linked_apps.filter(isRecord) : [];
	const apps = installed
		.filter(isRecord)
		.map((record): ChatgptDeveloperAppBrowserEntry | null => {
			const pluginId = readString(record.plugin_id);
			const name = readString(record.name);
			if (!pluginId || !name) return null;
			const appIds = readStringArray(record.app_ids);
			const link = links.find(
				(candidate) =>
					appIds.some((appId) => appIdentityMatches(appId, readString(candidate.connector_id))) ||
					normalize(name) === normalize(readString(candidate.name)),
			);
			const scope = readString(record.scope);
			const discoverability = readString(record.discoverability);
			const providerName = readString(record.provider_name);
			const reviewStatus =
				scope === "USER" && discoverability === "PRIVATE" && providerName?.startsWith("dev-")
					? "development"
					: null;
			return {
				pluginId,
				appIds,
				name,
				status: readString(record.status),
				enabled: readBoolean(record.enabled),
				authStatus: readString(link?.auth_status),
				reviewStatus,
				authorization: readString(record.authentication_policy),
				endpoint: readString(record.endpoint),
				versionId: readString(record.release_version),
				scope,
				discoverability,
				creatorName: readString(record.creator_name),
				description: readString(record.description),
			};
		})
		.filter((app): app is ChatgptDeveloperAppBrowserEntry => app !== null)
		.sort((left, right) => left.name.localeCompare(right.name));
	return {
		account: {
			email: readString(input.identity?.email),
			plan: readString(input.identity?.accountPlanType ?? input.identity?.accountLevel),
		},
		developerMode: input.developerMode,
		inventoryComplete: signature?.inventory_complete === true,
		apps,
		observedAt: input.observedAt,
	};
}

function parseRecord(value: string | null | undefined): Record<string, unknown> | null {
	if (!value) return null;
	try {
		const parsed = JSON.parse(value) as unknown;
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function appIdentityMatches(
	left: string | null | undefined,
	right: string | null | undefined,
): boolean {
	if (!left || !right) return false;
	return normalize(left) === normalize(right);
}

export function chatgptDeveloperAppSelectionMatchesForTest(
	selectedPluginId: string | null | undefined,
	app: ChatgptDeveloperAppBrowserTarget,
): boolean {
	const selected = normalizeAppIdentity(selectedPluginId);
	if (!selected) return false;
	return [app.pluginId, ...app.appIds].some(
		(candidate) => normalizeAppIdentity(candidate) === selected,
	);
}

function normalizeAppIdentity(value: string | null | undefined): string {
	return normalize(value)
		.replace(/^plugin:/, "")
		.replace(/^plugin_/, "");
}

function normalize(value: string | null | undefined): string {
	return String(value ?? "")
		.trim()
		.toLowerCase();
}

function readString(value: unknown): string | null {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readStringArray(value: unknown): string[] {
	return Array.isArray(value)
		? value.map(readString).filter((entry): entry is string => entry !== null)
		: [];
}

function readBoolean(value: unknown): boolean | null {
	return typeof value === "boolean" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

async function captureChatgptDeveloperAppFeatureSignature(client: ChromeClient): Promise<string> {
	const endpoints = {
		installed: "/backend-api/ps/plugins/installed",
		linked: "/backend-api/aip/connectors/links/list_accessible",
	} as const;
	await client.Network.enable();
	let resolveInstalled: () => void = () => undefined;
	const installedReady = new Promise<void>((resolve) => {
		resolveInstalled = resolve;
	});
	const payloadPromise = new Promise<{
		installed: unknown | null;
		linked: unknown | null;
	}>((resolve) => {
		const requestKinds = new Map<string, keyof typeof endpoints>();
		const payloads: { installed: unknown | null; linked: unknown | null } = {
			installed: null,
			linked: null,
		};
		let settled = false;
		const finish = () => {
			if (settled || !Object.values(payloads).every((payload) => payload !== null)) return;
			settled = true;
			clearTimeout(timer);
			resolve(payloads);
		};
		const timer = setTimeout(() => {
			if (settled) return;
			settled = true;
			resolve(payloads);
		}, 12_000);
		client.Network.responseReceived((params) => {
			if (settled || params.response.status < 200 || params.response.status >= 300) return;
			for (const [kind, endpoint] of Object.entries(endpoints) as Array<
				[keyof typeof endpoints, string]
			>) {
				if (params.response.url.includes(endpoint)) {
					requestKinds.set(params.requestId, kind);
					break;
				}
			}
		});
		client.Network.loadingFinished(async (params) => {
			if (settled) return;
			const kind = requestKinds.get(params.requestId);
			if (!kind) return;
			const response = await client.Network.getResponseBody({
				requestId: params.requestId,
			}).catch(() => null);
			if (!response?.body) return;
			try {
				const body = response.base64Encoded
					? Buffer.from(response.body, "base64").toString("utf8")
					: response.body;
				payloads[kind] = JSON.parse(body) as unknown;
				if (kind === "installed") resolveInstalled();
				finish();
			} catch {
				// Keep waiting for another successful response for this endpoint.
			}
		});
	});
	const currentUrl = await readCurrentUrl(client);
	if (currentUrl?.startsWith("https://chatgpt.com/plugins")) {
		const reloaded = await reloadAndSettle(client, {
			ignoreCache: true,
			timeoutMs: 10_000,
			mutationSource: "chatgpt-developer-apps:inventory-reload",
		});
		if (!reloaded.ok) {
			throw new Error(
				`ChatGPT developer-app inventory reload did not settle: ${reloaded.reason ?? "unknown"}.`,
			);
		}
		await wait(250);
	} else {
		await navigateChatgpt(client, "https://chatgpt.com/plugins");
	}
	await Promise.race([installedReady, wait(5_000)]);
	await navigateChatgpt(client, "https://chatgpt.com/");
	const payloads = await payloadPromise;
	const installedPayload = isRecord(payloads.installed) ? payloads.installed : {};
	const linkedPayload = isRecord(payloads.linked) ? payloads.linked : {};
	debugDeveloperApps(
		`installed payload keys=${Object.keys(installedPayload).join(",") || "none"}; linked payload keys=${Object.keys(linkedPayload).join(",") || "none"}`,
	);
	return JSON.stringify({
		inventory_complete: isCompleteChatgptInstalledAppsPayload(payloads.installed),
		installed_apps: normalizeChatgptInstalledAppProbes(installedPayload.plugins),
		linked_apps: normalizeChatgptLinkedAppProbes(linkedPayload.links),
	});
}

function isCompleteChatgptInstalledAppsPayload(value: unknown): boolean {
	return isRecord(value) && Array.isArray(value.plugins);
}

export const isCompleteChatgptInstalledAppsPayloadForTest = isCompleteChatgptInstalledAppsPayload;

async function readChatgptDeveloperMode(client: ChromeClient): Promise<boolean> {
	const originalUrl = await readCurrentUrl(client);
	try {
		await dismissEmptyNewAppDialog(client);
		await navigateChatgpt(client, "https://chatgpt.com/plugins#settings/Security");
		let ready = await waitForPredicate(
			client.Runtime,
			`Boolean(document.querySelector('button[role="switch"][aria-label="Developer mode"]'))`,
			{ timeoutMs: 8_000, description: "ChatGPT Developer mode switch" },
		);
		if (!ready.ok) {
			await navigateChatgpt(client, "https://chatgpt.com/plugins#settings/Plugins");
			await navigateChatgpt(client, "https://chatgpt.com/plugins#settings/Security");
			ready = await waitForPredicate(
				client.Runtime,
				`Boolean(document.querySelector('button[role="switch"][aria-label="Developer mode"]'))`,
				{ timeoutMs: 8_000, description: "ChatGPT Developer mode switch after settings reset" },
			);
		}
		if (!ready.ok) {
			const diagnostic = await readDeveloperModeDiagnostic(client);
			throw new Error(`ChatGPT Developer mode switch was not found (${diagnostic}).`);
		}
		const result = await client.Runtime.evaluate({
			expression: `document.querySelector('button[role="switch"][aria-label="Developer mode"]')?.getAttribute('aria-checked')`,
			returnByValue: true,
		});
		return result.result?.value === "true";
	} finally {
		if (originalUrl?.startsWith("https://chatgpt.com/")) {
			await navigateChatgpt(client, originalUrl).catch(() => undefined);
		}
	}
}

async function dismissEmptyNewAppDialog(client: ChromeClient): Promise<void> {
	const probe = await client.Runtime.evaluate({
		expression: `(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog || !String(dialog.textContent || '').includes('New App')) return false;
      const name = dialog.querySelector('input[aria-label="Name"]');
      const server = dialog.querySelector('input[type="url"], input[placeholder*="https://"]');
      return Boolean(name && server && !String(name.value || '').trim() && !String(server.value || '').trim());
    })()`,
		returnByValue: true,
	});
	if (probe.result?.value !== true) return;
	const closed = await pressButton(client.Runtime, {
		rootSelectors: ['[role="dialog"]'],
		selector: 'button[aria-label="Close"]',
		interactionStrategies: ["pointer"],
		requireVisible: true,
		postGoneSelector: '[role="dialog"] input[aria-label="Name"]',
		timeoutMs: 5_000,
	});
	if (!closed.ok) {
		throw new Error("An empty ChatGPT New App dialog blocked inventory and could not be closed.");
	}
}

async function readDeveloperModeDiagnostic(client: ChromeClient): Promise<string> {
	const result = await client.Runtime.evaluate({
		expression: `JSON.stringify({
      url: location.href,
      dialogs: Array.from(document.querySelectorAll('[role="dialog"]'))
        .map((dialog) => String(dialog.textContent || '').trim().slice(0, 160)),
      switches: Array.from(document.querySelectorAll('button[role="switch"]'))
        .map((button) => ({
          label: button.getAttribute('aria-label'),
          checked: button.getAttribute('aria-checked'),
        })),
    })`,
		returnByValue: true,
	});
	return readString(result.result?.value) ?? "no DOM diagnostic available";
}

async function waitForChatgptDeveloperAppSettingsForDelete(
	client: Pick<ChromeClient, "Runtime">,
	app: ChatgptDeveloperAppBrowserTarget,
	targetMarker = "auracall-delete-target",
): Promise<Awaited<ReturnType<typeof waitForPredicate>>> {
	return waitForPredicate(
		client.Runtime,
		`(() => {
      const normalize = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
      const expectedName = ${JSON.stringify(app.name)};
      const targetMarker = ${JSON.stringify(targetMarker)};
      const expectedHash = ${JSON.stringify(
				`#settings/Plugins/${encodeURIComponent(app.pluginId)}`,
			)};
      if (location.origin !== 'https://chatgpt.com' || location.pathname !== '/plugins' || location.hash !== expectedHash) {
        return null;
      }
      const dialogs = Array.from(document.querySelectorAll('[role="dialog"]')).filter((dialog) => {
        const heading = Array.from(dialog.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]'))
          .find((candidate) => normalize(candidate.textContent) === expectedName);
        return Boolean(heading);
      });
      if (dialogs.length !== 1) return null;
      const actionButtons = Array.from(dialogs[0].querySelectorAll('button')).filter((button) => {
        const label = normalize(button.getAttribute('aria-label'));
        const rect = button.getBoundingClientRect();
        return label === 'Plugin actions' && rect.width > 0 && rect.height > 0;
      });
      if (actionButtons.length !== 1) return null;
      const button = actionButtons[0];
      if (button.disabled || button.getAttribute('aria-disabled') === 'true') return null;
      dialogs[0].setAttribute('data-auracall-delete-dialog', targetMarker);
      button.setAttribute('data-auracall-delete-trigger', targetMarker);
      return {
        appName: expectedName,
        hash: location.hash,
        dialogCount: dialogs.length,
        actionButtonCount: actionButtons.length,
      };
    })()`,
		{
			timeoutMs: 15_000,
			pollMs: 200,
			description: `exact Developer mode management surface for ${app.name}`,
		},
	);
}

async function markExactChatgptDeveloperAppDeleteMenu(
	client: Pick<ChromeClient, "Runtime">,
	targetMarker: string,
): Promise<Awaited<ReturnType<typeof waitForPredicate>>> {
	return waitForPredicate(
		client.Runtime,
		`(() => {
      const normalize = (value) => String(value || '').replace(/\\s+/g, ' ').trim().toLowerCase();
      const targetMarker = ${JSON.stringify(targetMarker)};
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };
      const candidates = Array.from(document.querySelectorAll('[role="menu"]'))
        .filter(visible)
        .map((menu) => ({
          menu,
          deleteItems: Array.from(menu.querySelectorAll('[role="menuitem"],button,[role="button"]'))
            .filter((item) => visible(item) && normalize(item.getAttribute('aria-label') || item.textContent) === 'delete'),
        }))
        .filter((entry) => entry.deleteItems.length > 0);
      if (candidates.length !== 1 || candidates[0].deleteItems.length !== 1) return null;
      candidates[0].menu.setAttribute('data-auracall-delete-menu', targetMarker);
      candidates[0].deleteItems[0].setAttribute('data-auracall-delete-item', targetMarker);
      return {
        menuCount: candidates.length,
        deleteItemCount: candidates[0].deleteItems.length,
      };
    })()`,
		{
			timeoutMs: 5_000,
			pollMs: 100,
			description: "one exact ChatGPT developer-app Delete menu item",
		},
	);
}

export const waitForChatgptDeveloperAppSettingsForDeleteForTest =
	waitForChatgptDeveloperAppSettingsForDelete;
export const markExactChatgptDeveloperAppDeleteMenuForTest = markExactChatgptDeveloperAppDeleteMenu;

async function navigateChatgpt(client: ChromeClient, url: string): Promise<void> {
	const settled = await navigateAndSettle(client, {
		url,
		timeoutMs: 10_000,
		mutationSource: "chatgpt-developer-apps:navigate",
	});
	if (!settled.ok) {
		throw new Error(
			`ChatGPT developer-app navigation did not settle: ${settled.reason ?? settled.phase}.`,
		);
	}
	await wait(250);
}

async function setRequiredInput(
	client: ChromeClient,
	selector: string,
	value: string,
	label: string,
): Promise<void> {
	const set = await setInputValue(client.Runtime, {
		selector,
		value,
		requireVisible: true,
		timeoutMs: 8_000,
	});
	if (!set) {
		throw new Error(`Unable to set ChatGPT developer-app ${label}.`);
	}
}

async function selectNativeOptionByText(
	client: ChromeClient,
	selector: string,
	label: string,
): Promise<void> {
	const result = await client.Runtime.evaluate({
		expression: `(() => {
      const select = document.querySelector(${JSON.stringify(selector)});
      if (!(select instanceof HTMLSelectElement)) return false;
      const expected = ${JSON.stringify(label.toLowerCase())};
      const option = Array.from(select.options).find((candidate) =>
        String(candidate.textContent || '').trim().toLowerCase() === expected
      );
      if (!option) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
      if (setter) setter.call(select, option.value);
      else select.value = option.value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`,
		returnByValue: true,
	});
	if (result.result?.value !== true) {
		throw new Error(`Unable to select ChatGPT developer-app authentication ${label}.`);
	}
}

async function readSelectedEcosystemMention(
	client: ChromeClient,
): Promise<{ label: string | null; pluginId: string | null } | null> {
	const result = await client.Runtime.evaluate({
		expression: `(() => {
      const pill = document.querySelector('[data-inline-selection-pill][data-symbol="ecosystemMention"]');
      if (!pill) return null;
      return {
        label: String(pill.textContent || '').replace(/\\s+/g, ' ').trim() || null,
        pluginId: pill.getAttribute('data-system-hint-type') || pill.getAttribute('data-id') || null,
      };
    })()`,
		returnByValue: true,
	});
	return isRecord(result.result?.value)
		? {
				label: readString(result.result.value.label),
				pluginId: readString(result.result.value.pluginId),
			}
		: null;
}

async function selectDeveloperAppMention(client: ChromeClient, appName: string): Promise<void> {
	const focused = await pressButton(client.Runtime, {
		selector: '#prompt-textarea[contenteditable="true"]',
		interactionStrategies: ["pointer"],
		requireVisible: true,
		timeoutMs: 5_000,
	});
	if (!focused.ok) {
		throw new Error("Unable to focus the blank ChatGPT composer for app selection.");
	}
	await client.Runtime.evaluate({
		expression: `(() => {
      const editor = document.querySelector('#prompt-textarea[contenteditable="true"]');
      if (!editor) return false;
      editor.focus();
      const selection = document.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      return true;
    })()`,
		returnByValue: true,
	});
	await client.Input.insertText({ text: `@${appName}` });
	const selected = await pressButton(client.Runtime, {
		selector: ".popover .__menu-item[tabindex]",
		interactionStrategies: ["pointer"],
		requireVisible: true,
		postSelector: '[data-inline-selection-pill][data-symbol="ecosystemMention"]',
		timeoutMs: 8_000,
	});
	if (!selected.ok || !normalize(selected.matchedLabel).includes(normalize(appName))) {
		const diagnostic = await readMentionPickerDiagnostic(client);
		throw new Error(
			`Unable to select ChatGPT developer app ${appName} from the composer mention picker: ${selected.reason ?? "app option not found"} (${diagnostic}).`,
		);
	}
}

async function clearDeveloperAppComposer(client: ChromeClient): Promise<void> {
	const ready = await waitForPredicate(
		client.Runtime,
		`Boolean(document.querySelector('#prompt-textarea[contenteditable="true"]'))`,
		{ timeoutMs: 8_000, description: "ChatGPT developer-app test composer" },
	);
	if (!ready.ok) {
		throw new Error("Unable to clear the ChatGPT composer because its editor was not found.");
	}
	const focused = await client.Runtime.evaluate({
		expression: `(() => {
      const editor = document.querySelector('#prompt-textarea[contenteditable="true"]');
      if (!editor) return false;
      editor.focus();
      return true;
    })()`,
		returnByValue: true,
	});
	if (focused.result?.value !== true) {
		throw new Error("Unable to clear the ChatGPT composer because its editor was not found.");
	}
	await client.Input.dispatchKeyEvent({
		type: "keyDown",
		key: "Control",
		code: "ControlLeft",
		windowsVirtualKeyCode: 17,
		nativeVirtualKeyCode: 17,
		modifiers: 2,
	});
	await client.Input.dispatchKeyEvent({
		type: "keyDown",
		key: "a",
		code: "KeyA",
		windowsVirtualKeyCode: 65,
		nativeVirtualKeyCode: 65,
		modifiers: 2,
	});
	await client.Input.dispatchKeyEvent({
		type: "keyUp",
		key: "a",
		code: "KeyA",
		windowsVirtualKeyCode: 65,
		nativeVirtualKeyCode: 65,
		modifiers: 2,
	});
	await client.Input.dispatchKeyEvent({
		type: "keyUp",
		key: "Control",
		code: "ControlLeft",
		windowsVirtualKeyCode: 17,
		nativeVirtualKeyCode: 17,
	});
	await client.Input.dispatchKeyEvent({
		type: "keyDown",
		key: "Backspace",
		code: "Backspace",
		windowsVirtualKeyCode: 8,
		nativeVirtualKeyCode: 8,
	});
	await client.Input.dispatchKeyEvent({
		type: "keyUp",
		key: "Backspace",
		code: "Backspace",
		windowsVirtualKeyCode: 8,
		nativeVirtualKeyCode: 8,
	});
	await wait(250);
	const cleared = await client.Runtime.evaluate({
		expression: `!String(document.querySelector('#prompt-textarea')?.innerText || '').trim()`,
		returnByValue: true,
	});
	if (cleared.result?.value !== true) {
		throw new Error("ChatGPT composer text could not be cleared safely.");
	}
}

async function readMentionPickerDiagnostic(client: ChromeClient): Promise<string> {
	const result = await client.Runtime.evaluate({
		expression: `JSON.stringify({
      url: location.href,
      editorText: document.querySelector('#prompt-textarea')?.innerText || '',
      activeElement: document.activeElement?.id || document.activeElement?.tagName || null,
      popovers: Array.from(document.querySelectorAll('.popover,[role="listbox"],[role="menu"]'))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((node) => String(node.textContent || '').trim().slice(0, 240)),
    })`,
		returnByValue: true,
	});
	return readString(result.result?.value) ?? "no composer diagnostic available";
}

async function assertNoChatgptBlockingSurface(client: ChromeClient, action: string): Promise<void> {
	const result = await client.Runtime.evaluate({
		expression: `(() => {
      const visible = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };
      const buttons = Array.from(document.querySelectorAll('button,[role="button"]'))
        .filter(visible)
        .map((element) => String(element.textContent || element.getAttribute('aria-label') || '').trim())
        .filter(Boolean)
        .slice(0, 80);
      return {
        text: String(document.body?.innerText || '').slice(0, 12000),
        ariaLabel: '',
        buttonLabels: buttons,
      };
    })()`,
		returnByValue: true,
	});
	const probe = isRecord(result.result?.value) ? result.result.value : {};
	const match = classifyChatgptBlockingSurfaceProbe({
		text: readString(probe.text),
		ariaLabel: readString(probe.ariaLabel),
		buttonLabels: readStringArray(probe.buttonLabels),
	});
	if (match) {
		throw new Error(`Cannot ${action}: ${match.summary}`);
	}
}

async function readCurrentUrl(client: ChromeClient): Promise<string | null> {
	const result = await client.Runtime.evaluate({
		expression: "location.href",
		returnByValue: true,
	});
	return readString(result.result?.value);
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function debugDeveloperApps(message: string): void {
	if (process.env.AURACALL_DEBUG_DEVELOPER_APPS === "1") {
		process.stderr.write(`[developer-apps] ${message}\n`);
	}
}
