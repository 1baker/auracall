import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAuracallHomeDir } from "../src/auracallHome.js";

type CanaryCommandInput = {
	profile: string;
	conversationId: string;
	timeoutMs: number;
};

type ReceiptSnapshot = {
	path: string;
	sha256: string;
	payload: unknown;
};

type SanitizedReceipt = {
	object: string | null;
	version: number | null;
	provider: string | null;
	accountScopeHash: string | null;
	conversationId: string | null;
	outcome: string | null;
	timeoutMs: number | null;
	elapsedMs: number | null;
	attemptCount: number | null;
	lastStage: string | null;
	pendingOperation: string | null;
	completedAt: string | null;
	errorCode: string | null;
};

type ContextSummary = ReturnType<typeof summarizeChatgptContextPayload>;

export type ChatgptContextCanaryOutcome =
	| "context"
	| "terminal_unavailable"
	| "classified_post_payload_failure";

type ChatgptContextCanaryOutcomeInput = {
	childExitCode: number | null;
	timedOut: boolean;
	expectedConversationId: string;
	outputParseState: "parsed" | "not_parsed";
	contextSummary: ContextSummary | null;
	receiptSelection: "selected" | "missing_or_ambiguous";
	receipt: SanitizedReceipt | null;
};

type ParsedArgs = CanaryCommandInput & {
	auracallBin: string;
	commandTimeoutMs: number;
	dryRun: boolean;
};

const DEFAULT_CONTEXT_TIMEOUT_MS = 120_000;
const DEFAULT_COMMAND_TIMEOUT_PADDING_MS = 30_000;
const MAX_CHILD_OUTPUT_BYTES = 20 * 1024 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHATGPT_TERMINAL_UNAVAILABLE_STAGE =
	"provider:chatgpt.readConversationPayload.failed.conversation_unavailable.v1";
const CHATGPT_CLASSIFIED_POST_PAYLOAD_FAILURE_STAGE_PATTERN =
	/^provider:chatgpt\.postPayloadReadiness\.failed\.predicate_unsatisfied\.payload_(?:mapping|non_mapping|missing)\.route_(?:expected_conversation|home|other_chatgpt|non_chatgpt|unknown)\.v1$/;

function asRecord(value: unknown): Record<string, unknown> | null {
	return value !== null && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function readString(value: unknown): string | null {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readNumber(value: unknown): number | null {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readArray(record: Record<string, unknown> | null, key: string): unknown[] {
	const value = record?.[key];
	return Array.isArray(value) ? value : [];
}

export function buildChatgptContextCanaryArgs(input: CanaryCommandInput): string[] {
	if (!input.profile.trim()) throw new Error("A non-empty AuraCall runtime profile is required.");
	if (!UUID_PATTERN.test(input.conversationId)) {
		throw new Error("The canary conversation id must be a UUID.");
	}
	if (!Number.isInteger(input.timeoutMs) || input.timeoutMs <= 0) {
		throw new Error("The context timeout must be a positive integer.");
	}
	return [
		"--profile",
		input.profile.trim(),
		"conversations",
		"context",
		"get",
		input.conversationId,
		"--target",
		"chatgpt",
		"--refresh",
		"--retry-attempts",
		"0",
		"--timeout-ms",
		String(input.timeoutMs),
		"--json-only",
	];
}

export function summarizeChatgptContextPayload(payload: unknown): {
	conversationId: string | null;
	messageCount: number;
	fileCount: number;
	artifactCount: number;
	sourceCount: number;
} {
	const root = asRecord(payload);
	const nested = asRecord(root?.context);
	return {
		conversationId: readString(root?.conversationId) ?? readString(nested?.conversationId),
		messageCount: readArray(root, "messages").length || readArray(nested, "messages").length,
		fileCount: readArray(root, "files").length || readArray(nested, "files").length,
		artifactCount: readArray(root, "artifacts").length || readArray(nested, "artifacts").length,
		sourceCount: readArray(root, "sources").length || readArray(nested, "sources").length,
	};
}

export function classifyChatgptContextCanaryOutcome(
	input: ChatgptContextCanaryOutcomeInput,
): ChatgptContextCanaryOutcome | null {
	const receipt = input.receipt;
	const commonReceiptAccepted =
		input.receiptSelection === "selected" &&
		receipt?.object === "conversation_context_read_receipt" &&
		receipt.provider === "chatgpt" &&
		receipt.conversationId === input.expectedConversationId &&
		receipt.attemptCount === 1 &&
		receipt.pendingOperation === null;
	if (!commonReceiptAccepted || input.timedOut) return null;
	if (
		input.childExitCode === 0 &&
		input.outputParseState === "parsed" &&
		input.contextSummary?.conversationId === input.expectedConversationId &&
		input.contextSummary.messageCount > 0 &&
		receipt.outcome === "succeeded"
	) {
		return "context";
	}
	if (
		input.childExitCode === 1 &&
		input.outputParseState === "not_parsed" &&
		input.contextSummary === null &&
		receipt.outcome === "failed" &&
		receipt.lastStage === CHATGPT_TERMINAL_UNAVAILABLE_STAGE
	) {
		return "terminal_unavailable";
	}
	if (
		input.childExitCode === 1 &&
		input.outputParseState === "not_parsed" &&
		input.contextSummary === null &&
		receipt.outcome === "failed" &&
		CHATGPT_CLASSIFIED_POST_PAYLOAD_FAILURE_STAGE_PATTERN.test(receipt.lastStage ?? "")
	) {
		return "classified_post_payload_failure";
	}
	return null;
}

function sanitizeReceipt(payload: unknown): SanitizedReceipt {
	const root = asRecord(payload);
	const record = asRecord(root?.items) ?? root;
	return {
		object: readString(record?.object),
		version: readNumber(record?.version),
		provider: readString(record?.provider),
		accountScopeHash: readString(record?.accountScopeHash),
		conversationId: readString(record?.conversationId),
		outcome: readString(record?.outcome),
		timeoutMs: readNumber(record?.timeoutMs),
		elapsedMs: readNumber(record?.elapsedMs),
		attemptCount: readNumber(record?.attemptCount),
		lastStage: readString(record?.lastStage),
		pendingOperation: readString(record?.pendingOperation),
		completedAt: readString(record?.completedAt),
		errorCode: readString(record?.errorCode),
	};
}

export function selectChangedConversationContextReceipt(
	before: ReadonlyMap<string, string>,
	after: readonly ReceiptSnapshot[],
	conversationId: string,
): SanitizedReceipt {
	const changed = after.filter((entry) => before.get(entry.path) !== entry.sha256);
	if (changed.length !== 1) {
		throw new Error(
			"Expected exactly one changed conversation-context receipt; found " +
				String(changed.length) +
				".",
		);
	}
	const receipt = sanitizeReceipt(changed[0]?.payload);
	if (receipt.conversationId !== conversationId) {
		throw new Error(
			"The changed conversation-context receipt belongs to a different conversation.",
		);
	}
	return receipt;
}

async function collectReceiptSnapshots(
	root: string,
	conversationId: string,
): Promise<ReceiptSnapshot[]> {
	const output: ReceiptSnapshot[] = [];
	const visit = async (directory: string): Promise<void> => {
		let entries: Dirent[];
		try {
			entries = await readdir(directory, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				await visit(entryPath);
				continue;
			}
			if (
				!entry.isFile() ||
				entry.name !== `${conversationId}.json` ||
				path.basename(directory) !== "context-read-receipts"
			) {
				continue;
			}
			try {
				const raw = await readFile(entryPath, "utf8");
				output.push({
					path: entryPath,
					sha256: createHash("sha256").update(raw).digest("hex"),
					payload: JSON.parse(raw) as unknown,
				});
			} catch {
				// A malformed receipt cannot satisfy the canary contract.
			}
		}
	};
	await visit(root);
	return output;
}

function parsePositiveInteger(value: string | undefined, label: string): number {
	const parsed = Number.parseInt(value ?? "", 10);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new Error(`${label} must be a positive integer.`);
	}
	return parsed;
}

function parseArgs(argv: string[]): ParsedArgs {
	let profile = "";
	let conversationId = "";
	let timeoutMs = DEFAULT_CONTEXT_TIMEOUT_MS;
	let commandTimeoutMs: number | null = null;
	let auracallBin = "auracall";
	let dryRun = false;
	for (let index = 2; index < argv.length; index += 1) {
		const token = argv[index];
		const next = argv[index + 1];
		if (token === "--profile" && next) {
			profile = next;
			index += 1;
		} else if (token === "--conversation-id" && next) {
			conversationId = next;
			index += 1;
		} else if (token === "--timeout-ms" && next) {
			timeoutMs = parsePositiveInteger(next, "timeout-ms");
			index += 1;
		} else if (token === "--command-timeout-ms" && next) {
			commandTimeoutMs = parsePositiveInteger(next, "command-timeout-ms");
			index += 1;
		} else if (token === "--auracall-bin" && next) {
			auracallBin = next;
			index += 1;
		} else if (token === "--dry-run") {
			dryRun = true;
		} else if (token === "--help" || token === "-h") {
			console.log(
				"Usage: pnpm tsx scripts/chatgpt-context-canary.ts --profile <name> --conversation-id <uuid> [--timeout-ms <ms>] [--command-timeout-ms <ms>] [--auracall-bin <path>] [--dry-run]",
			);
			process.exit(0);
		} else {
			throw new Error(`Unknown or incomplete argument: ${token ?? "<missing>"}.`);
		}
	}
	buildChatgptContextCanaryArgs({ profile, conversationId, timeoutMs });
	return {
		profile: profile.trim(),
		conversationId,
		timeoutMs,
		commandTimeoutMs: commandTimeoutMs ?? timeoutMs + DEFAULT_COMMAND_TIMEOUT_PADDING_MS,
		auracallBin,
		dryRun,
	};
}

function classifyChildFailure(output: string, timedOut: boolean): string | null {
	if (timedOut) return "command_timeout";
	if (/captcha|recaptcha|google\.com\/sorry/i.test(output)) return "human_verification_required";
	if (/answer now/i.test(output)) return "answer_now_hard_stop";
	if (/sign in|log in|login required/i.test(output)) return "login_required";
	if (/too many requests|rate limit/i.test(output)) return "rate_limited";
	return null;
}

async function main(): Promise<void> {
	const args = parseArgs(process.argv);
	const commandArgs = buildChatgptContextCanaryArgs(args);
	if (args.dryRun) {
		console.log(
			JSON.stringify(
				{
					object: "chatgpt_context_canary_dry_run",
					version: 1,
					providerCalls: 0,
					browserLaunches: 0,
					executable: args.auracallBin,
					args: commandArgs,
				},
				null,
				2,
			),
		);
		return;
	}

	const receiptRoot = path.join(getAuracallHomeDir(), "cache", "providers", "chatgpt");
	const before = await collectReceiptSnapshots(receiptRoot, args.conversationId);
	const beforeHashes = new Map(before.map((entry) => [entry.path, entry.sha256]));
	const startedAt = Date.now();
	const childEnv = { ...process.env };
	Reflect.set(childEnv, "ORACLE_NO_BANNER", "1");
	Reflect.set(childEnv, "NODE_NO_WARNINGS", "1");
	const child = spawnSync(args.auracallBin, commandArgs, {
		encoding: "utf8",
		timeout: args.commandTimeoutMs,
		maxBuffer: MAX_CHILD_OUTPUT_BYTES,
		env: childEnv,
	});
	const elapsedMs = Math.max(0, Date.now() - startedAt);
	const after = await collectReceiptSnapshots(receiptRoot, args.conversationId);
	let receipt: SanitizedReceipt | null = null;
	let receiptSelection: "selected" | "missing_or_ambiguous" = "selected";
	try {
		receipt = selectChangedConversationContextReceipt(beforeHashes, after, args.conversationId);
	} catch {
		receiptSelection = "missing_or_ambiguous";
	}

	const stdout = child.stdout ?? "";
	const stderr = child.stderr ?? "";
	const timedOut =
		asRecord(child.error)?.code === "ETIMEDOUT" ||
		(child.signal === "SIGTERM" && elapsedMs >= args.commandTimeoutMs);
	let contextSummary: ContextSummary | null = null;
	let outputParseState: "parsed" | "not_parsed" = "not_parsed";
	if (child.status === 0) {
		try {
			contextSummary = summarizeChatgptContextPayload(JSON.parse(stdout) as unknown);
			outputParseState = "parsed";
		} catch {
			outputParseState = "not_parsed";
		}
	}
	const acceptanceOutcome = classifyChatgptContextCanaryOutcome({
		childExitCode: child.status,
		timedOut,
		expectedConversationId: args.conversationId,
		outputParseState,
		contextSummary,
		receiptSelection,
		receipt,
	});
	const accepted = acceptanceOutcome !== null;
	const failureClass =
		acceptanceOutcome === "terminal_unavailable"
			? "terminal_unavailable"
			: (classifyChildFailure(`${stdout}\n${stderr}`, timedOut) ??
				(child.status === 0 ? null : "child_failed"));
	console.log(
		JSON.stringify(
			{
				object: "chatgpt_context_canary_result",
				version: 1,
				accepted,
				acceptanceOutcome,
				profile: args.profile,
				conversationId: args.conversationId,
				elapsedMs,
				child: {
					exitCode: child.status,
					signal: child.signal,
					timedOut,
					stdoutBytes: Buffer.byteLength(stdout),
					stderrBytes: Buffer.byteLength(stderr),
					failureClass,
					outputParseState,
				},
				context: contextSummary,
				receiptSelection,
				receipt,
			},
			null,
			2,
		),
	);
	if (!accepted) process.exitCode = 1;
}

const isMain =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
	void main().catch(() => {
		console.log(
			JSON.stringify({
				object: "chatgpt_context_canary_result",
				version: 1,
				accepted: false,
				failureClass: "harness_failed",
			}),
		);
		process.exitCode = 1;
	});
}
