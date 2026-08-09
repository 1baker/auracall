import { execFile } from "node:child_process";

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_DISCOVERY_TIMEOUT_MS = 5_000;
const DEFAULT_MAX_OUTPUT_BYTES = 8 * 1024 * 1024;

export type AgentBrowserNetworkMetadataOutcome =
	| "completed"
	| "command_failed"
	| "invalid_json"
	| "invalid_shape"
	| "timeout"
	| "output_limit"
	| "child_failed"
	| "request_not_found"
	| "ambiguous_request";

export interface AgentBrowserNetworkBodyMetadata {
	retrieval: "present" | "absent" | "base64_summary";
	characterLength: number | null;
	parseState: "json" | "not_json" | "not_available" | "absent";
	mappingCount: number | null;
}

export interface AgentBrowserNetworkMetadata {
	outcome: AgentBrowserNetworkMetadataOutcome;
	candidateCount: number | null;
	requestIdMatches: boolean | null;
	expectedUrlMatches: boolean | null;
	status: number | null;
	elapsedMs: number;
	body: AgentBrowserNetworkBodyMetadata;
}

export interface AgentBrowserNetworkMetadataOptions {
	expectedRequestId: string;
	expectedUrl: string;
	elapsedMs: number;
}

export interface AgentBrowserNetworkCommandOptions {
	session: string;
	cdpPort: number;
	requestId?: string;
	expectedUrl: string;
	discoveryTimeoutMs?: number;
	timeoutMs?: number;
	maxOutputBytes?: number;
	executable?: string;
}

export interface CapturedProcessOptions {
	timeoutMs: number;
	maxOutputBytes: number;
	signal: AbortSignal;
}

export interface CapturedProcessResult {
	stdout: string;
	stderr: string;
}

export type CapturedProcessRunner = (
	executable: string,
	args: string[],
	options: CapturedProcessOptions,
) => Promise<CapturedProcessResult>;

export interface AgentBrowserNetworkCommandDependencies {
	processRunner?: CapturedProcessRunner;
	now?: () => number;
}

const absentBody = (): AgentBrowserNetworkBodyMetadata => ({
	retrieval: "absent",
	characterLength: null,
	parseState: "absent",
	mappingCount: null,
});

const terminalResult = (
	outcome: Exclude<AgentBrowserNetworkMetadataOutcome, "completed">,
	elapsedMs: number,
): AgentBrowserNetworkMetadata => ({
	outcome,
	candidateCount: null,
	requestIdMatches: null,
	expectedUrlMatches: null,
	status: null,
	elapsedMs,
	body: absentBody(),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const countMapping = (value: unknown): number | null => {
	if (!isRecord(value) || !isRecord(value.mapping)) {
		return null;
	}
	return Object.keys(value.mapping).length;
};

const reduceBody = (value: unknown): AgentBrowserNetworkBodyMetadata => {
	if (typeof value !== "string") {
		return absentBody();
	}

	const base64Summary = /^\[base64, (\d+) chars\]$/.exec(value);
	if (base64Summary) {
		return {
			retrieval: "base64_summary",
			characterLength: Number(base64Summary[1]),
			parseState: "not_available",
			mappingCount: null,
		};
	}

	try {
		const parsed = JSON.parse(value) as unknown;
		return {
			retrieval: "present",
			characterLength: value.length,
			parseState: "json",
			mappingCount: countMapping(parsed),
		};
	} catch {
		return {
			retrieval: "present",
			characterLength: value.length,
			parseState: "not_json",
			mappingCount: null,
		};
	}
};

export function reduceAgentBrowserNetworkDetail(
	rawOutput: string,
	options: AgentBrowserNetworkMetadataOptions,
): AgentBrowserNetworkMetadata {
	let envelope: unknown;
	try {
		envelope = JSON.parse(rawOutput) as unknown;
	} catch {
		return terminalResult("invalid_json", options.elapsedMs);
	}

	if (!isRecord(envelope)) {
		return terminalResult("invalid_shape", options.elapsedMs);
	}
	if (envelope.success === false) {
		return terminalResult("command_failed", options.elapsedMs);
	}

	const detail = isRecord(envelope.data) ? envelope.data : envelope;
	if (typeof detail.requestId !== "string" || typeof detail.url !== "string") {
		return terminalResult("invalid_shape", options.elapsedMs);
	}

	return {
		outcome: "completed",
		candidateCount: null,
		requestIdMatches: detail.requestId === options.expectedRequestId,
		expectedUrlMatches: detail.url === options.expectedUrl,
		status:
			typeof detail.status === "number" && Number.isFinite(detail.status) ? detail.status : null,
		elapsedMs: options.elapsedMs,
		body: reduceBody(detail.responseBody),
	};
}

const defaultProcessRunner: CapturedProcessRunner = (executable, args, options) =>
	new Promise((resolve, reject) => {
		execFile(
			executable,
			args,
			{
				encoding: "utf8",
				maxBuffer: options.maxOutputBytes,
				timeout: options.timeoutMs,
				killSignal: "SIGKILL",
				signal: options.signal,
			},
			(error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				resolve({ stdout, stderr });
			},
		);
	});

const classifyProcessFailure = (error: unknown): "output_limit" | "timeout" | "child_failed" => {
	if (isRecord(error)) {
		if (error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
			return "output_limit";
		}
		if (error.code === "ABORT_ERR" || error.code === "ETIMEDOUT" || error.killed === true) {
			return "timeout";
		}
	}
	return "child_failed";
};

const requirePositiveInteger = (value: number, label: string): number => {
	if (!Number.isInteger(value) || value <= 0) {
		throw new Error(`Invalid ${label}.`);
	}
	return value;
};

type CapturedCommandSettlement =
	| { outcome: "completed"; stdout: string; elapsedMs: number }
	| {
			outcome: "timeout" | "output_limit" | "child_failed";
			elapsedMs: number;
	  };

const runCapturedCommand = async (
	executable: string,
	args: string[],
	timeoutMs: number,
	maxOutputBytes: number,
	processRunner: CapturedProcessRunner,
	now: () => number,
): Promise<CapturedCommandSettlement> => {
	const startedAt = now();
	const controller = new AbortController();
	const timedOut = Symbol("agent-browser-network-timeout");
	let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
	const timeoutPromise = new Promise<typeof timedOut>((resolve) => {
		timeoutHandle = setTimeout(() => {
			controller.abort();
			resolve(timedOut);
		}, timeoutMs);
	});
	const commandPromise = processRunner(executable, args, {
		timeoutMs,
		maxOutputBytes,
		signal: controller.signal,
	}).then(
		(result) => ({ ok: true as const, result }),
		(error: unknown) => ({ ok: false as const, error }),
	);

	try {
		const settled = await Promise.race([commandPromise, timeoutPromise]);
		const elapsedMs = Math.max(0, now() - startedAt);
		if (settled === timedOut) {
			return { outcome: "timeout", elapsedMs };
		}
		if (!settled.ok) {
			return { outcome: classifyProcessFailure(settled.error), elapsedMs };
		}
		return { outcome: "completed", stdout: settled.result.stdout, elapsedMs };
	} finally {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
		}
	}
};

type RequestSelection =
	| { outcome: "selected"; requestId: string; candidateCount: 1 }
	| {
			outcome:
				| "command_failed"
				| "invalid_json"
				| "invalid_shape"
				| "request_not_found"
				| "ambiguous_request";
			candidateCount: number | null;
	  };

const selectExactRequest = (rawOutput: string, expectedUrl: string): RequestSelection => {
	let envelope: unknown;
	try {
		envelope = JSON.parse(rawOutput) as unknown;
	} catch {
		return { outcome: "invalid_json", candidateCount: null };
	}
	if (!isRecord(envelope)) {
		return { outcome: "invalid_shape", candidateCount: null };
	}
	if (envelope.success === false) {
		return { outcome: "command_failed", candidateCount: null };
	}
	const data = isRecord(envelope.data) ? envelope.data : envelope;
	if (!Array.isArray(data.requests)) {
		return { outcome: "invalid_shape", candidateCount: null };
	}

	const candidates = data.requests.filter(
		(candidate): candidate is Record<string, unknown> =>
			isRecord(candidate) &&
			typeof candidate.requestId === "string" &&
			candidate.url === expectedUrl &&
			typeof candidate.status === "number" &&
			candidate.status >= 200 &&
			candidate.status < 300,
	);
	if (candidates.length === 0) {
		return { outcome: "request_not_found", candidateCount: 0 };
	}
	if (candidates.length !== 1) {
		return { outcome: "ambiguous_request", candidateCount: candidates.length };
	}
	return {
		outcome: "selected",
		requestId: candidates[0].requestId as string,
		candidateCount: 1,
	};
};

export async function runAgentBrowserNetworkMetadata(
	options: AgentBrowserNetworkCommandOptions,
	dependencies: AgentBrowserNetworkCommandDependencies = {},
): Promise<AgentBrowserNetworkMetadata> {
	const timeoutMs = requirePositiveInteger(options.timeoutMs ?? DEFAULT_TIMEOUT_MS, "timeout");
	const discoveryTimeoutMs = requirePositiveInteger(
		options.discoveryTimeoutMs ?? DEFAULT_DISCOVERY_TIMEOUT_MS,
		"discovery timeout",
	);
	const maxOutputBytes = requirePositiveInteger(
		options.maxOutputBytes ?? DEFAULT_MAX_OUTPUT_BYTES,
		"output limit",
	);
	requirePositiveInteger(options.cdpPort, "CDP port");
	if (!options.session || !options.expectedUrl) {
		throw new Error("Missing required network metadata option.");
	}

	const processRunner = dependencies.processRunner ?? defaultProcessRunner;
	const now = dependencies.now ?? Date.now;
	const startedAt = now();
	let candidateCount: number | null = null;
	let requestId = options.requestId;
	if (!requestId) {
		const discovery = await runCapturedCommand(
			options.executable ?? "agent-browser",
			[
				"--session",
				options.session,
				"--cdp",
				String(options.cdpPort),
				"--json",
				"network",
				"requests",
				"--filter",
				options.expectedUrl,
			],
			discoveryTimeoutMs,
			maxOutputBytes,
			processRunner,
			now,
		);
		if (discovery.outcome !== "completed") {
			return terminalResult(discovery.outcome, Math.max(0, now() - startedAt));
		}
		const selection = selectExactRequest(discovery.stdout, options.expectedUrl);
		candidateCount = selection.candidateCount;
		if (selection.outcome !== "selected") {
			return {
				...terminalResult(selection.outcome, Math.max(0, now() - startedAt)),
				candidateCount,
			};
		}
		requestId = selection.requestId;
	}

	const detail = await runCapturedCommand(
		options.executable ?? "agent-browser",
		[
			"--session",
			options.session,
			"--cdp",
			String(options.cdpPort),
			"--json",
			"network",
			"request",
			requestId,
		],
		timeoutMs,
		maxOutputBytes,
		processRunner,
		now,
	);
	const elapsedMs = Math.max(0, now() - startedAt);
	if (detail.outcome !== "completed") {
		return { ...terminalResult(detail.outcome, elapsedMs), candidateCount };
	}
	return {
		...reduceAgentBrowserNetworkDetail(detail.stdout, {
			expectedRequestId: requestId,
			expectedUrl: options.expectedUrl,
			elapsedMs,
		}),
		candidateCount,
	};
}
