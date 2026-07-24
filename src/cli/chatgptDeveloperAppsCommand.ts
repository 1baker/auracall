import { BrowserAutomationClient } from "../browser/client.js";
import { createChatgptDeveloperAppBrowserAdapter } from "../browser/providers/chatgptDeveloperApps.js";
import type { ResolvedUserConfig } from "../config.js";

export interface ChatgptDeveloperAppAccount {
	email: string | null;
	plan: string | null;
}

export interface ChatgptDeveloperApp {
	pluginId: string;
	appIds: string[];
	name: string;
	status?: string | null;
	enabled?: boolean | null;
	authStatus?: string | null;
	reviewStatus?: string | null;
	endpoint?: string | null;
	authorization?: string | null;
	versionId?: string | null;
	scope?: string | null;
	discoverability?: string | null;
	creatorName?: string | null;
	description?: string | null;
}

export interface ChatgptDeveloperAppState {
	account: ChatgptDeveloperAppAccount;
	developerMode: boolean;
	apps: ChatgptDeveloperApp[];
	observedAt: string;
}

export interface ChatgptDeveloperAppAdapter {
	readState(): Promise<ChatgptDeveloperAppState>;
	create(input: ChatgptDeveloperAppCreateInput): Promise<ChatgptDeveloperAppMutationOutcome>;
	refresh(app: ChatgptDeveloperApp): Promise<ChatgptDeveloperAppMutationOutcome>;
	selectForTest(app: ChatgptDeveloperApp): Promise<ChatgptDeveloperAppMutationOutcome>;
	submitTest(app: ChatgptDeveloperApp, prompt: string): Promise<ChatgptDeveloperAppMutationOutcome>;
	uninstall(app: ChatgptDeveloperApp): Promise<ChatgptDeveloperAppMutationOutcome>;
}

export type ChatgptDeveloperAppAuth = "oauth" | "none" | "mixed";

export interface ChatgptDeveloperAppCreateInput {
	name: string;
	serverUrl: string;
	description?: string | null;
	auth: ChatgptDeveloperAppAuth;
	connection: "server-url" | "tunnel";
}

export interface ChatgptDeveloperAppMutationOutcome {
	status: "completed" | "awaiting-human";
	message: string;
	currentUrl?: string | null;
	app?: ChatgptDeveloperApp | null;
}

export type ChatgptDeveloperAppOperationInput =
	| { action: "list" }
	| ({
			action: "create";
			confirmed: boolean;
			expectedAccount: string;
	  } & ChatgptDeveloperAppCreateInput)
	| {
			action: "refresh";
			app: string;
			confirmed: boolean;
			expectedAccount: string;
	  }
	| {
			action: "test";
			app: string;
			submit: boolean;
			prompt?: string | null;
			confirmed: boolean;
			expectedAccount: string;
	  }
	| {
			action: "uninstall";
			app: string;
			confirmed: boolean;
			expectedAccount: string;
	  };

export type ChatgptDeveloperAppOperationResult =
	| {
			action: "list";
			status: "observed";
			state: ChatgptDeveloperAppState;
	  }
	| {
			action: Exclude<ChatgptDeveloperAppOperationInput["action"], "list">;
			status: ChatgptDeveloperAppMutationOutcome["status"];
			state: ChatgptDeveloperAppState;
			outcome: ChatgptDeveloperAppMutationOutcome;
	  };

export async function executeChatgptDeveloperAppOperation(
	input: ChatgptDeveloperAppOperationInput,
	adapter: ChatgptDeveloperAppAdapter,
): Promise<ChatgptDeveloperAppOperationResult> {
	const state = await adapter.readState();
	if (input.action === "list") {
		return {
			action: "list",
			status: "observed",
			state,
		};
	}
	const requiresConfirmation = input.action !== "test" || input.submit;
	if (requiresConfirmation && !input.confirmed) {
		throw new Error(`ChatGPT developer-app ${input.action} requires --yes.`);
	}
	const expectedAccount = normalizeAccount(input.expectedAccount);
	const actualAccount = normalizeAccount(state.account.email);
	if (!actualAccount || actualAccount !== expectedAccount) {
		throw new Error(
			`Expected ChatGPT account ${input.expectedAccount}, but the managed browser is ${state.account.email ?? "unknown"}.`,
		);
	}
	if (input.action === "create") {
		if (!state.developerMode) {
			throw new Error("ChatGPT Developer mode must be enabled before creating an app.");
		}
		const createInput = normalizeCreateInput(input);
		const outcome = await adapter.create(createInput);
		return {
			action: "create",
			status: outcome.status,
			state,
			outcome,
		};
	}
	if (input.action === "refresh") {
		const app = resolveExactApp(state.apps, input.app);
		const outcome = await adapter.refresh(app);
		return {
			action: "refresh",
			status: outcome.status,
			state,
			outcome,
		};
	}
	if (input.action === "uninstall") {
		const app = resolveExactApp(state.apps, input.app);
		const outcome = await adapter.uninstall(app);
		return {
			action: "uninstall",
			status: outcome.status,
			state,
			outcome,
		};
	}
	if (input.action === "test") {
		const app = resolveExactApp(state.apps, input.app);
		const outcome = input.submit
			? await adapter.submitTest(app, normalizeTestPrompt(input.prompt))
			: await adapter.selectForTest(app);
		return {
			action: "test",
			status: outcome.status,
			state,
			outcome,
		};
	}
	throw new Error("Unsupported ChatGPT developer-app action.");
}

export async function runChatgptDeveloperAppOperationForCli(
	userConfig: ResolvedUserConfig,
	input: ChatgptDeveloperAppOperationInput,
): Promise<ChatgptDeveloperAppOperationResult> {
	const browser = await BrowserAutomationClient.fromConfig(userConfig, {
		target: "chatgpt",
	});
	const adapter = createChatgptDeveloperAppBrowserAdapter(browser, (config) =>
		BrowserAutomationClient.fromConfig(config, { target: "chatgpt" }),
	);
	try {
		return await executeChatgptDeveloperAppOperation(input, adapter);
	} finally {
		await adapter.close();
	}
}

export function formatChatgptDeveloperAppOperationResult(
	result: ChatgptDeveloperAppOperationResult,
): string {
	const account = result.state.account.email ?? "unknown";
	const header = [
		`ChatGPT developer apps (${account})`,
		`Developer mode: ${result.state.developerMode ? "enabled" : "disabled"}`,
	];
	if (result.action !== "list") {
		return [
			...header,
			`Action: ${result.action}`,
			`Status: ${result.status}`,
			result.outcome.message,
			...(result.outcome.currentUrl ? [`Current URL: ${result.outcome.currentUrl}`] : []),
		].join("\n");
	}
	const rows = result.state.apps.map((app) =>
		[
			app.name,
			app.pluginId,
			app.reviewStatus ?? app.discoverability ?? "installed",
			app.authStatus ?? "auth unknown",
			app.status ?? "status unknown",
		].join(" | "),
	);
	return [
		...header,
		`Installed apps: ${result.state.apps.length}`,
		...(rows.length > 0 ? rows : ["(none)"]),
	].join("\n");
}

function normalizeAccount(value: string | null | undefined): string {
	return String(value ?? "")
		.trim()
		.toLowerCase();
}

function resolveExactApp(
	apps: readonly ChatgptDeveloperApp[],
	reference: string,
): ChatgptDeveloperApp {
	const normalized = normalizeAccount(reference);
	const matches = apps.filter((app) =>
		[app.pluginId, app.name, ...app.appIds].some(
			(candidate) => normalizeAccount(candidate) === normalized,
		),
	);
	if (matches.length === 0) {
		throw new Error(`ChatGPT developer app "${reference}" is not installed.`);
	}
	if (matches.length > 1) {
		throw new Error(
			`ChatGPT developer app "${reference}" is ambiguous; use an exact plugin id or app id.`,
		);
	}
	return matches[0];
}

function normalizeCreateInput(
	input: Extract<ChatgptDeveloperAppOperationInput, { action: "create" }>,
): ChatgptDeveloperAppCreateInput {
	const name = input.name.trim();
	if (!name) {
		throw new Error("ChatGPT developer-app create requires --name.");
	}
	let serverUrl: URL;
	try {
		serverUrl = new URL(input.serverUrl);
	} catch {
		throw new Error("ChatGPT developer-app create requires a valid --server-url.");
	}
	if (serverUrl.protocol !== "https:" && serverUrl.hostname !== "localhost") {
		throw new Error("ChatGPT developer-app server URL must use HTTPS unless it is localhost.");
	}
	if (input.auth !== "oauth" && input.auth !== "none" && input.auth !== "mixed") {
		throw new Error("ChatGPT developer-app auth must be oauth, none, or mixed.");
	}
	if (input.connection !== "server-url" && input.connection !== "tunnel") {
		throw new Error("ChatGPT developer-app connection must be server-url or tunnel.");
	}
	return {
		name,
		serverUrl: serverUrl.href,
		description: input.description?.trim() || null,
		auth: input.auth,
		connection: input.connection,
	};
}

function normalizeTestPrompt(value: string | null | undefined): string {
	const prompt = String(value ?? "").trim();
	if (!prompt) {
		throw new Error("ChatGPT developer-app submitted test requires --prompt.");
	}
	return prompt;
}
