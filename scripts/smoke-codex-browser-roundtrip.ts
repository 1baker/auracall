#!/usr/bin/env tsx
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const smokeSchema = "auracall.codex-browser-roundtrip-smoke.v1";
const terminalStatuses = new Set(["completed", "failed", "cancelled"]);

interface SmokeOptions {
	envPath: string;
	model: string;
	timeoutMs: number;
	pollIntervalMs: number;
	tabConvergenceMs: number;
}

interface ResponsePayload {
	id?: string;
	status?: string;
	error?: unknown;
	output?: Array<{
		type?: string;
		role?: string;
		content?: Array<{ type?: string; text?: string }>;
	}>;
	metadata?: {
		requestMetadata?: Record<string, unknown>;
		executionSummary?: {
			completedAt?: string | null;
			failureSummary?: {
				code?: string;
				message?: string;
			};
			runtimeDiagnosticsSummary?: {
				browserAuthoritySummary?: Record<string, unknown>;
				lastProviderEvidence?: {
					details?: Record<string, unknown>;
				};
			};
		};
	};
}

interface AccessPlanPayload {
	success?: boolean;
	error?: unknown;
	data?: {
		decision?: {
			profileId?: string;
			profileReuse?: {
				recommendedAction?: string;
				reusableBrowserId?: string;
				reusableSessionName?: string;
				sharedAcquisition?: {
					duplicateProcessAllowed?: boolean;
				};
			};
		};
	};
}

interface ServiceTab {
	browserId?: string;
	targetId?: string;
	url?: string;
	title?: string;
}

interface ServiceTabsPayload {
	success?: boolean;
	data?: {
		tabs?: ServiceTab[];
	};
}

interface ServiceBrowser {
	id?: string;
	profileId?: string;
	browserBuild?: string;
	health?: string;
	host?: string;
	activeSessionIds?: string[];
	browserBuildProof?: {
		applied?: boolean;
		profileId?: string;
		browserPid?: number;
		processStartTicks?: number;
		cdpEndpoint?: string;
		executablePath?: string;
	};
}

interface ServiceBrowsersPayload {
	success?: boolean;
	data?: {
		browsers?: ServiceBrowser[];
	};
}

export async function runCodexBrowserRoundtripSmoke(
	options: SmokeOptions,
): Promise<Record<string, unknown>> {
	const startedAt = Date.now();
	const env = await readEnvValues(options.envPath);
	const baseUrl = normalizeLocalV1BaseUrl(env.AURACALL_BASE_URL);
	const apiKey = env.AURACALL_API_KEY;
	const runtimeProfile = env.AURACALL_AGENT_BROWSER_PROFILE_CHATGPT || "chatgpt-pro";
	if (!apiKey) throw new Error(`${options.envPath} is missing AURACALL_API_KEY.`);
	const retainedBefore = requireRetainedBrowser(runtimeProfile);
	const accessPlanProfile = retainedBefore.profileId as string;
	const retainedBrowserId = retainedBefore.id as string;
	const retainedSessionName = retainedBefore.activeSessionIds?.[0] as string;
	if (accessPlanProfile !== runtimeProfile) {
		throw new Error(
			`Retained browser profile projection mismatch: service=${accessPlanProfile}, physical=${runtimeProfile}. Repair Agent Browser custody before submitting a smoke response.`,
		);
	}

	const accessPlan = runAgentBrowserJson<AccessPlanPayload>([
		"service",
		"access-plan",
		"--service-name",
		"AuraCall",
		"--agent-name",
		"Codex",
		"--task-name",
		"codex-browser-roundtrip-smoke",
		"--target-service-id",
		"chatgpt",
		"--url",
		"https://chatgpt.com/",
		"--runtime-profile",
		runtimeProfile,
		"--browser-build",
		"stock_chrome",
		"--browser-host",
		"attached_existing",
		"--json",
	]);
	const reuse = accessPlan.data?.decision?.profileReuse;
	if (accessPlan.success !== true)
		throw new Error(`Agent Browser access plan failed: ${safeJson(accessPlan.error)}`);
	if (reuse?.recommendedAction !== "reuse_existing_browser") {
		throw new Error(
			`Agent Browser did not require retained-browser reuse: ${reuse?.recommendedAction ?? "missing"}.`,
		);
	}
	if (!reuse.reusableBrowserId || !reuse.reusableSessionName) {
		throw new Error("Agent Browser reuse plan omitted browser or session identity.");
	}
	if (
		reuse.reusableBrowserId !== retainedBrowserId ||
		reuse.reusableSessionName !== retainedSessionName
	) {
		throw new Error("Agent Browser reuse plan selected a different retained browser identity.");
	}
	if (reuse.sharedAcquisition?.duplicateProcessAllowed !== false) {
		throw new Error(
			"Agent Browser reuse plan did not explicitly forbid a duplicate browser process.",
		);
	}
	if (accessPlan.data?.decision?.profileId !== runtimeProfile) {
		throw new Error(
			`Agent Browser selected ${accessPlan.data?.decision?.profileId ?? "no profile"}, expected ${runtimeProfile}.`,
		);
	}

	const models = await fetchJson<{ data?: Array<{ id?: string }> }>(`${baseUrl}/models`, apiKey);
	if (!models.data?.some((entry) => entry.id === options.model)) {
		throw new Error(`/v1/models did not expose ${options.model}.`);
	}

	const nonce = `CODEX_BROWSER_ROUNDTRIP_${randomBytes(12).toString("hex")}`;
	const created = await fetchJson<ResponsePayload>(`${baseUrl}/responses`, apiKey, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			model: options.model,
			input: `Return exactly this token and nothing else: ${nonce}`,
			metadata: {
				purpose: "codex-browser-roundtrip-smoke",
				schemaVersion: smokeSchema,
				expectedNonce: nonce,
			},
		}),
	});
	if (!created.id) throw new Error("/v1/responses did not return a response id.");
	const responseId = created.id;
	const completed = await pollResponse(
		baseUrl,
		apiKey,
		responseId,
		options.timeoutMs,
		options.pollIntervalMs,
	);
	if (completed.id !== responseId)
		throw new Error(
			`Response identity changed from ${responseId} to ${completed.id ?? "missing"}.`,
		);
	if (completed.status !== "completed") {
		const failure = completed.metadata?.executionSummary?.failureSummary;
		const detail =
			failure?.message ??
			(typeof completed.error === "string" ? completed.error : safeJson(completed.error));
		throw new Error(
			`Response ${responseId} finished with ${completed.status ?? "unknown"}${failure?.code ? ` (${failure.code})` : ""}: ${detail}`,
		);
	}
	const requestMetadata = completed.metadata?.requestMetadata;
	if (requestMetadata?.expectedNonce !== nonce || requestMetadata.schemaVersion !== smokeSchema) {
		throw new Error(`Response ${responseId} did not preserve its nonce-bound request metadata.`);
	}
	const outputText = extractAssistantText(completed).replace(/[\r\n]+$/u, "");
	if (outputText !== nonce) {
		throw new Error(
			`Response ${responseId} exact output mismatch; expected nonce length ${nonce.length}, got ${outputText.length}.`,
		);
	}

	const diagnostics = completed.metadata?.executionSummary?.runtimeDiagnosticsSummary;
	const authority = diagnostics?.browserAuthoritySummary;
	if (authority?.browserAuthority !== "agent-browser" || authority.bridgeMode !== "required") {
		throw new Error(`Response ${responseId} lacked required Agent Browser authority evidence.`);
	}
	const browserEvidence = diagnostics?.lastProviderEvidence?.details;
	if (
		browserEvidence?.browserAuthority !== "agent-browser" ||
		browserEvidence.agentBrowserBridgeMode !== "required" ||
		browserEvidence.runtimeProfileId !== runtimeProfile
	) {
		throw new Error(
			`Response ${responseId} browser evidence did not match the retained runtime profile.`,
		);
	}
	const targetId =
		typeof browserEvidence.chromeTargetId === "string" ? browserEvidence.chromeTargetId : "";
	if (!targetId) throw new Error(`Response ${responseId} omitted its browser target identity.`);

	const tab = await waitForConversationTab(
		targetId,
		retainedBrowserId,
		options.tabConvergenceMs,
		Math.min(options.pollIntervalMs, 1_000),
	);
	const retainedAfter = requireRetainedBrowser(runtimeProfile);
	assertRetainedBrowserIdentityStable(retainedBefore, retainedAfter);
	return {
		success: true,
		schemaVersion: smokeSchema,
		responseId,
		status: completed.status,
		exactNonceMatch: true,
		model: options.model,
		runtimeProfile,
		browserAuthority: "agent-browser",
		bridgeMode: "required",
		retainedBrowser: {
			browserId: retainedBrowserId,
			sessionName: retainedSessionName,
			serviceProfileId: runtimeProfile,
			physicalProfileId: runtimeProfile,
			browserPid: retainedAfter.browserBuildProof?.browserPid,
			processStartTicks: retainedAfter.browserBuildProof?.processStartTicks,
			duplicateProcessAllowed: false,
		},
		target: {
			targetId,
			url: tab.url,
			title: tab.title ?? null,
		},
		completedAt: completed.metadata?.executionSummary?.completedAt ?? null,
		elapsedMs: Date.now() - startedAt,
	};
}

function requireRetainedBrowser(runtimeProfile: string): ServiceBrowser {
	const payload = runAgentBrowserJson<ServiceBrowsersPayload>(["service", "browsers", "--json"]);
	if (payload.success !== true) throw new Error("Agent Browser browser inventory read failed.");
	const matches = (payload.data?.browsers ?? []).filter((browser) => {
		const proof = browser.browserBuildProof;
		return (
			browser.health === "ready" &&
			browser.host === "attached_existing" &&
			browser.browserBuild === "stock_chrome" &&
			typeof browser.id === "string" &&
			typeof browser.profileId === "string" &&
			browser.activeSessionIds?.length === 1 &&
			proof?.applied === true &&
			proof.profileId === runtimeProfile &&
			Number.isInteger(proof.browserPid) &&
			Number.isInteger(proof.processStartTicks) &&
			typeof proof.cdpEndpoint === "string" &&
			typeof proof.executablePath === "string"
		);
	});
	if (matches.length !== 1) {
		throw new Error(
			`Expected one ready retained browser proven for ${runtimeProfile}, found ${matches.length}.`,
		);
	}
	return matches[0];
}

function assertRetainedBrowserIdentityStable(before: ServiceBrowser, after: ServiceBrowser): void {
	const beforeProof = before.browserBuildProof;
	const afterProof = after.browserBuildProof;
	if (
		before.id !== after.id ||
		before.activeSessionIds?.[0] !== after.activeSessionIds?.[0] ||
		beforeProof?.browserPid !== afterProof?.browserPid ||
		beforeProof?.processStartTicks !== afterProof?.processStartTicks ||
		beforeProof?.cdpEndpoint !== afterProof?.cdpEndpoint ||
		beforeProof?.executablePath !== afterProof?.executablePath
	) {
		throw new Error("Retained browser process identity changed during the roundtrip smoke.");
	}
}

async function pollResponse(
	baseUrl: string,
	apiKey: string,
	responseId: string,
	timeoutMs: number,
	pollIntervalMs: number,
): Promise<ResponsePayload> {
	const deadline = Date.now() + timeoutMs;
	let latest: ResponsePayload | null = null;
	while (Date.now() < deadline) {
		latest = await fetchJson<ResponsePayload>(
			`${baseUrl}/responses/${encodeURIComponent(responseId)}`,
			apiKey,
		);
		if (latest.status && terminalStatuses.has(latest.status)) return latest;
		await sleep(pollIntervalMs);
	}
	throw new Error(
		`Timed out waiting for response ${responseId}; latest status=${latest?.status ?? "missing"}.`,
	);
}

async function waitForConversationTab(
	targetId: string,
	browserId: string,
	timeoutMs: number,
	pollIntervalMs: number,
): Promise<ServiceTab> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const payload = runAgentBrowserJson<ServiceTabsPayload>(["service", "tabs", "--json"]);
		const tab = payload.data?.tabs?.find((entry) => entry.targetId === targetId);
		if (tab?.browserId === browserId && isChatgptConversationUrl(tab.url)) return tab;
		await sleep(pollIntervalMs);
	}
	throw new Error(
		`Agent Browser target ${targetId} did not converge to a retained ChatGPT conversation.`,
	);
}

function isChatgptConversationUrl(value: string | undefined): boolean {
	if (!value) return false;
	try {
		const url = new URL(value);
		return (
			url.protocol === "https:" &&
			url.hostname === "chatgpt.com" &&
			/(?:^|\/)c\/[A-Za-z0-9-]+(?:$|[/?#])/u.test(url.pathname)
		);
	} catch {
		return false;
	}
}

function extractAssistantText(response: ResponsePayload): string {
	const parts: string[] = [];
	for (const item of response.output ?? []) {
		if (item.type !== "message" || item.role !== "assistant") continue;
		for (const content of item.content ?? []) {
			if (content.type === "output_text" && typeof content.text === "string")
				parts.push(content.text);
		}
	}
	return parts.join("");
}

async function fetchJson<T>(url: string, apiKey: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set("authorization", `Bearer ${apiKey}`);
	const response = await fetch(url, { ...init, headers });
	const text = await response.text();
	const payload = text ? (JSON.parse(text) as T) : ({} as T);
	if (!response.ok)
		throw new Error(`${url} returned HTTP ${response.status}: ${safeJson(payload)}`);
	return payload;
}

function runAgentBrowserJson<T>(args: string[]): T {
	const result = spawnSync(process.env.AGENT_BROWSER_BIN || "agent-browser", args, {
		encoding: "utf8",
		maxBuffer: 16 * 1024 * 1024,
		timeout: 30_000,
	});
	if (result.status !== 0) {
		throw new Error(
			`Agent Browser ${args.slice(0, 2).join(" ")} failed with status ${result.status ?? "unknown"}: ${result.stderr.trim().slice(0, 512)}`,
		);
	}
	return JSON.parse(result.stdout) as T;
}

async function readEnvValues(envPath: string): Promise<Record<string, string>> {
	const raw = await fs.readFile(envPath, "utf8");
	const values: Record<string, string> = {};
	for (const line of raw.split(/\r?\n/u)) {
		const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/u.exec(line.trim());
		if (match) values[match[1]] = match[2];
	}
	return values;
}

function normalizeLocalV1BaseUrl(value: string | undefined): string {
	if (!value) throw new Error("AURACALL_BASE_URL is required.");
	const url = new URL(value);
	if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname)) {
		throw new Error("The Codex browser roundtrip smoke requires a loopback HTTP AuraCall API.");
	}
	url.pathname = url.pathname.replace(/\/$/u, "");
	if (!url.pathname.endsWith("/v1")) url.pathname = `${url.pathname}/v1`.replace(/\/+/gu, "/");
	return url.toString().replace(/\/$/u, "");
}

function parseArgs(argv: string[]): SmokeOptions {
	const options: SmokeOptions = {
		envPath: path.join(os.homedir(), ".auracall", "api.env"),
		model: "agent:normal-chatgpt",
		timeoutMs: 240_000,
		pollIntervalMs: 2_000,
		tabConvergenceMs: 15_000,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--") continue;
		if (arg === "--env-path") options.envPath = requireValue(argv, ++index, arg);
		else if (arg === "--model") options.model = requireValue(argv, ++index, arg);
		else if (arg === "--timeout-ms")
			options.timeoutMs = parsePositiveInteger(requireValue(argv, ++index, arg), arg);
		else if (arg === "--poll-interval-ms")
			options.pollIntervalMs = parsePositiveInteger(requireValue(argv, ++index, arg), arg);
		else if (arg === "--tab-convergence-ms")
			options.tabConvergenceMs = parsePositiveInteger(requireValue(argv, ++index, arg), arg);
		else throw new Error(`Unexpected argument: ${arg}`);
	}
	return options;
}

function requireValue(argv: string[], index: number, flag: string): string {
	const value = argv[index];
	if (!value) throw new Error(`${flag} requires a value.`);
	return value;
}

function parsePositiveInteger(value: string, flag: string): number {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed <= 0)
		throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}

function safeJson(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	runCodexBrowserRoundtripSmoke(parseArgs(process.argv.slice(2)))
		.then((result) => console.log(JSON.stringify(result, null, 2)))
		.catch((error) => {
			console.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
			process.exitCode = 1;
		});
}
