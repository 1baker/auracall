import { createHash, randomUUID } from "node:crypto";
import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { ExecutionRequestSchema } from "./apiSchema.js";
import type {
	ExecutionRequest,
	ExecutionResponse,
	ExecutionResponseStatus,
	ExecutionRuntimeDiagnosticsSummary,
} from "./apiTypes.js";
import { refreshRunArchiveIndexBestEffort } from "./archiveIndexRefresh.js";
import type { ExecutionRuntimeControlContract } from "./contract.js";
import {
	normalizeResponseBatchDispatchRequest,
	type ResponseBatchDispatchJobAssignment,
	type ResponseBatchDispatchRecord,
	type ResponseBatchDispatchRequest,
	ResponseBatchDispatchRequestSchema,
	type ResponseBatchDispatchResolution,
} from "./responseBatchDispatchPool.js";
import type { ExecutionResponsesService } from "./responsesService.js";
import type { ExecutionServiceHostCancelActionResult } from "./serviceHost.js";
import type { ExecutionRunStoredRecord } from "./store.js";
import { getRuntimeDir } from "./store.js";

const RESPONSE_BATCHES_DIRNAME = "response-batches";
const RECORD_FILENAME = "record.json";

// biome-ignore lint/style/useNamingConvention: exported schema names follow the runtime API schema convention.
export const ResponseBatchCreateRequestSchema = z.object({
	id: z.string().trim().min(1).optional(),
	team: z.string().trim().min(1).optional(),
	dispatch: ResponseBatchDispatchRequestSchema.optional(),
	dispatchResolution: z
		.object({
			requests: z.array(ExecutionRequestSchema),
			dispatch: z.object({
				team: z.string().trim().min(1),
				mode: z.literal("next_available"),
				projectSync: z.literal("none"),
				memberCount: z.number().int().nonnegative(),
				projectName: z.string().nullable().optional(),
				warnings: z.array(z.string()),
			}),
			assignments: z.array(
				z.object({
					team: z.string().trim().min(1),
					mode: z.literal("next_available"),
					memberAgent: z.string().trim().min(1),
					memberIndex: z.number().int().min(0),
				}),
			),
		})
		.optional(),
	requests: z.array(ExecutionRequestSchema).min(1),
	metadata: z.record(z.string(), z.unknown()).optional(),
	limits: z
		.object({
			maxConcurrentRuns: z.number().int().positive().optional(),
			maxBrowserInteractionsPerMinute: z.number().int().positive().optional(),
		})
		.optional(),
});

export type ResponseBatchCreateRequest = z.infer<typeof ResponseBatchCreateRequestSchema>;

// biome-ignore lint/style/useNamingConvention: exported schema names follow the runtime API schema convention.
export const ResponseBatchRetryRequestSchema = z
	.object({
		idempotencyKey: z.string().trim().min(1).max(200),
		responseIds: z.array(z.string().trim().min(1)).min(1).optional(),
		note: z.string().trim().min(1).nullable().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		if (value.responseIds && new Set(value.responseIds).size !== value.responseIds.length) {
			context.addIssue({
				code: "custom",
				path: ["responseIds"],
				message: "responseIds must not contain duplicates",
			});
		}
	});

export type ResponseBatchRetryRequest = z.infer<typeof ResponseBatchRetryRequestSchema>;

export interface ResponseBatchRetryLineage {
	sourceBatchId: string;
	idempotencyKeyHash: string;
	requestFingerprint: string;
	requestedAt: string;
	note: string | null;
	sourceResponseIds: string[];
}

export interface ResponseBatchJobRecord {
	index: number;
	responseId: string;
	model: string;
	agent: string | null;
	team?: string | null;
	service: string | null;
	runtimeProfile: string | null;
	dispatch?: ResponseBatchDispatchJobAssignment | null;
	retryOf?: {
		batchId: string;
		responseId: string;
		index: number;
	} | null;
	createdAt: string;
}

export interface ResponseBatchRecord {
	id: string;
	object: "response_batch";
	createdAt: string;
	updatedAt: string;
	metadata: Record<string, unknown>;
	limits: {
		maxConcurrentRuns: number | null;
		maxBrowserInteractionsPerMinute: number | null;
	};
	dispatch?: ResponseBatchDispatchRecord | null;
	retry?: ResponseBatchRetryLineage | null;
	jobs: ResponseBatchJobRecord[];
}

export interface ResponseBatchJobStatus extends ResponseBatchJobRecord {
	status: ExecutionResponseStatus | "missing";
	completedAt: string | null;
	failure: unknown | null;
	diagnostics?: ExecutionRuntimeDiagnosticsSummary | null;
	runtimeState?: ExecutionRuntimeDiagnosticsSummary["runtimeState"] | null;
}

export interface ResponseBatchStatus {
	id: string;
	object: "response_batch_status";
	status: "queued" | "running" | "completed" | "failed" | "cancelled" | "mixed_terminal";
	createdAt: string;
	updatedAt: string;
	metadata: Record<string, unknown>;
	limits: ResponseBatchRecord["limits"];
	dispatch: ResponseBatchDispatchRecord | null;
	retry?: ResponseBatchRetryLineage | null;
	counts: {
		total: number;
		in_progress: number;
		completed: number;
		failed: number;
		cancelled: number;
		missing: number;
	};
	jobs: ResponseBatchJobStatus[];
}

export type ResponseBatchCancellationOutcome =
	| ExecutionServiceHostCancelActionResult["status"]
	| "error";

export interface ResponseBatchCancellationJobResult extends ResponseBatchJobRecord {
	outcome: ResponseBatchCancellationOutcome;
	cancelled: boolean;
	reason: string;
}

export interface ResponseBatchCancellationResult {
	id: string;
	object: "response_batch_cancellation";
	requestedAt: string;
	note: string;
	fullySettled: boolean;
	counts: {
		total: number;
		cancelled: number;
		not_active: number;
		not_found: number;
		not_owned: number;
		errors: number;
	};
	jobs: ResponseBatchCancellationJobResult[];
	batch: ResponseBatchStatus;
}

export type ResponseBatchRetryOutcome = "created" | "reused" | "error";

export interface ResponseBatchRetryJobResult {
	index: number;
	sourceResponseId: string;
	responseId: string;
	outcome: ResponseBatchRetryOutcome;
	reason: string;
}

export interface ResponseBatchRetryResult {
	id: string;
	object: "response_batch_retry";
	requestedAt: string;
	accepted: boolean;
	reused: boolean;
	fullyMaterialized: boolean;
	idempotencyKeyHash: string;
	requestFingerprint: string | null;
	error: {
		code: "no_eligible_children" | "invalid_selection" | "idempotency_conflict";
		message: string;
	} | null;
	counts: {
		selected: number;
		created: number;
		reused: number;
		errors: number;
	};
	jobs: ResponseBatchRetryJobResult[];
	batch: ResponseBatchStatus | null;
}

export interface ResponseBatchStoreCreateResult {
	record: ResponseBatchRecord;
	created: boolean;
}

export interface ResponseBatchStore {
	readBatch(id: string): Promise<ResponseBatchRecord | null>;
	writeBatch(record: ResponseBatchRecord): Promise<ResponseBatchRecord>;
	createBatch?(record: ResponseBatchRecord): Promise<ResponseBatchStoreCreateResult>;
	listBatches?(options?: { limit?: number | null }): Promise<ResponseBatchRecord[]>;
}

export interface ResponseBatchService {
	createBatch(input: ResponseBatchCreateRequest): Promise<ResponseBatchStatus>;
	readBatchStatus(id: string): Promise<ResponseBatchStatus | null>;
	cancelBatch?(id: string, note?: string | null): Promise<ResponseBatchCancellationResult | null>;
	retryBatch?(
		id: string,
		input: ResponseBatchRetryRequest,
	): Promise<ResponseBatchRetryResult | null>;
}

export interface ResponseBatchServiceDeps {
	responsesService: Pick<
		ExecutionResponsesService,
		"createResponse" | "readResponse" | "cancelResponse" | "retryResponse"
	>;
	resolveDispatchPool?: (input: {
		dispatch: ResponseBatchDispatchRequest;
		requests: ExecutionRequest[];
	}) => Promise<ResponseBatchDispatchResolution>;
	now?: () => Date;
	generateBatchId?: () => string;
	store?: ResponseBatchStore;
	refreshArchiveIndex?: boolean;
}

export interface ResponseBatchExecutionGateDeps {
	control: ExecutionRuntimeControlContract;
	now?: () => Date;
}

export function createResponseBatchService(deps: ResponseBatchServiceDeps): ResponseBatchService {
	const now = deps.now ?? (() => new Date());
	const generateBatchId = deps.generateBatchId ?? (() => `batch_${randomUUID().replace(/-/g, "")}`);
	const store = deps.store ?? createResponseBatchStore();
	const refreshArchiveIndex = deps.refreshArchiveIndex ?? true;

	return {
		async createBatch(input) {
			const payload = ResponseBatchCreateRequestSchema.parse(input);
			const id = payload.id ?? generateBatchId();
			const createdAt = now().toISOString();
			const dispatchRequest = normalizeResponseBatchDispatchRequest(payload);
			const dispatchResolution = await resolveDispatchResolution({
				dispatch: dispatchRequest,
				payloadResolution: payload.dispatchResolution,
				requests: payload.requests,
				resolver: deps.resolveDispatchPool,
			});
			const requests = dispatchResolution?.requests ?? payload.requests;
			const limits = {
				maxConcurrentRuns: payload.limits?.maxConcurrentRuns ?? null,
				maxBrowserInteractionsPerMinute: payload.limits?.maxBrowserInteractionsPerMinute ?? null,
			};
			const jobs: ResponseBatchJobRecord[] = [];
			for (const [index, request] of requests.entries()) {
				const assignment = dispatchResolution?.assignments[index] ?? null;
				const response = await deps.responsesService.createResponse(
					withBatchMetadata(
						request,
						id,
						index,
						limits,
						dispatchResolution?.dispatch ?? null,
						assignment,
					),
				);
				jobs.push({
					index,
					responseId: response.id,
					model: request.model,
					agent: request.auracall?.agent ?? null,
					team: request.auracall?.team ?? assignment?.team ?? null,
					service: request.auracall?.service ?? null,
					runtimeProfile: request.auracall?.runtimeProfile ?? null,
					dispatch: assignment,
					createdAt,
				});
			}
			const record: ResponseBatchRecord = {
				id,
				object: "response_batch",
				createdAt,
				updatedAt: createdAt,
				metadata: payload.metadata ?? {},
				limits,
				dispatch: dispatchResolution?.dispatch ?? null,
				jobs,
			};
			await store.writeBatch(record);
			if (refreshArchiveIndex) {
				await refreshRunArchiveIndexBestEffort({ batchId: id });
			}
			return summarizeBatchStatus(record, deps.responsesService);
		},

		async readBatchStatus(id) {
			const record = await store.readBatch(id);
			if (!record) return null;
			return summarizeBatchStatus(record, deps.responsesService);
		},

		async cancelBatch(id, note = null) {
			const record = await store.readBatch(id);
			if (!record) return null;
			if (!deps.responsesService.cancelResponse) {
				throw new Error("Response batch cancellation is not configured for this runtime surface.");
			}
			const requestedAt = now().toISOString();
			const cancellationNote = note?.trim() || `response batch ${id} cancelled`;
			const jobs: ResponseBatchCancellationJobResult[] = [];
			for (const job of record.jobs) {
				try {
					const result = await deps.responsesService.cancelResponse(
						job.responseId,
						cancellationNote,
					);
					jobs.push({
						...job,
						outcome: result.status,
						cancelled: result.cancelled,
						reason: result.reason,
					});
				} catch (error) {
					jobs.push({
						...job,
						outcome: "error",
						cancelled: false,
						reason: error instanceof Error ? error.message : String(error),
					});
				}
			}
			const batch = await summarizeBatchStatus(record, deps.responsesService);
			const counts = summarizeCancellationOutcomes(jobs);
			return {
				id,
				object: "response_batch_cancellation",
				requestedAt,
				note: cancellationNote,
				fullySettled:
					counts.not_found === 0 &&
					counts.not_owned === 0 &&
					counts.errors === 0 &&
					batch.counts.in_progress === 0,
				counts,
				jobs,
				batch,
			};
		},

		async retryBatch(id, input) {
			const sourceRecord = await store.readBatch(id);
			if (!sourceRecord) return null;
			const payload = ResponseBatchRetryRequestSchema.parse(input);
			const requestedAt = now().toISOString();
			const idempotencyKeyHash = hashRetryValue(payload.idempotencyKey);
			const sourceStatus = await summarizeBatchStatus(sourceRecord, deps.responsesService);
			const selection = selectRetryableBatchJobs(sourceStatus, payload.responseIds);
			if (selection.error) {
				return createRejectedRetryResult(id, requestedAt, idempotencyKeyHash, selection.error);
			}
			if (!deps.responsesService.retryResponse || !store.createBatch) {
				throw new Error("Response batch retry is not configured for this runtime surface.");
			}

			const requestFingerprint = hashRetryValue(
				JSON.stringify(selection.jobs.map((job) => job.responseId)),
			);
			const retryBatchId = `batch_retry_${hashRetryValue(`${id}\0${idempotencyKeyHash}`).slice(0, 24)}`;
			const lineage: ResponseBatchRetryLineage = {
				sourceBatchId: id,
				idempotencyKeyHash,
				requestFingerprint,
				requestedAt,
				note: payload.note ?? null,
				sourceResponseIds: selection.jobs.map((job) => job.responseId),
			};
			const plannedRecord: ResponseBatchRecord = {
				id: retryBatchId,
				object: "response_batch",
				createdAt: requestedAt,
				updatedAt: requestedAt,
				metadata: {
					...sourceRecord.metadata,
					auracallRetry: lineage,
				},
				limits: sourceRecord.limits,
				dispatch: sourceRecord.dispatch ?? null,
				retry: lineage,
				jobs: selection.jobs.map((job, index) => ({
					index,
					responseId: createRetryResponseId(id, idempotencyKeyHash, job.responseId),
					model: job.model,
					agent: job.agent,
					team: job.team ?? null,
					service: job.service,
					runtimeProfile: job.runtimeProfile,
					dispatch: job.dispatch ?? null,
					retryOf: { batchId: id, responseId: job.responseId, index: job.index },
					createdAt: requestedAt,
				})),
			};
			const created = await store.createBatch(plannedRecord);
			if (!matchesRetryRequest(created.record, lineage)) {
				return createRetryConflictResult(
					id,
					created.record.id,
					requestedAt,
					idempotencyKeyHash,
					requestFingerprint,
				);
			}

			const jobs: ResponseBatchRetryJobResult[] = [];
			for (const plannedJob of created.record.jobs) {
				const retryOf = plannedJob.retryOf;
				if (!retryOf) {
					jobs.push({
						index: plannedJob.index,
						sourceResponseId: "",
						responseId: plannedJob.responseId,
						outcome: "error",
						reason: "retry batch job is missing source lineage",
					});
					continue;
				}
				try {
					const result = await deps.responsesService.retryResponse({
						sourceResponseId: retryOf.responseId,
						responseId: plannedJob.responseId,
						metadata: createRetryBatchMetadata(created.record, plannedJob),
						lineage: {
							sourceBatchId: id,
							sourceResponseId: retryOf.responseId,
							retryBatchId: created.record.id,
							idempotencyKeyHash,
							requestFingerprint,
							requestedAt: created.record.createdAt,
						},
					});
					jobs.push({
						index: plannedJob.index,
						sourceResponseId: retryOf.responseId,
						responseId: result.response.id,
						outcome: result.reused ? "reused" : "created",
						reason: result.reused
							? "existing retry response reused"
							: "fresh retry response created",
					});
				} catch (error) {
					jobs.push({
						index: plannedJob.index,
						sourceResponseId: retryOf.responseId,
						responseId: plannedJob.responseId,
						outcome: "error",
						reason: error instanceof Error ? error.message : String(error),
					});
				}
			}
			if (refreshArchiveIndex) {
				await refreshRunArchiveIndexBestEffort({ batchId: created.record.id });
			}
			const batch = await summarizeBatchStatus(created.record, deps.responsesService);
			const counts = summarizeRetryOutcomes(jobs);
			return {
				id: created.record.id,
				object: "response_batch_retry",
				requestedAt: created.record.createdAt,
				accepted: true,
				reused: !created.created,
				fullyMaterialized: counts.errors === 0 && batch.counts.missing === 0,
				idempotencyKeyHash,
				requestFingerprint,
				error: null,
				counts,
				jobs,
				batch,
			};
		},
	};
}

export function createResponseBatchStore(): ResponseBatchStore {
	return {
		readBatch: readResponseBatchRecord,
		writeBatch: writeResponseBatchRecord,
		createBatch: createResponseBatchRecord,
		listBatches: listResponseBatchRecords,
	};
}

export function getResponseBatchesDir(): string {
	return path.join(getRuntimeDir(), RESPONSE_BATCHES_DIRNAME);
}

export function createResponseBatchExecutionGate(deps: ResponseBatchExecutionGateDeps) {
	const now = deps.now ?? (() => new Date());
	return async (
		record: ExecutionRunStoredRecord,
	): Promise<{ allowed: true } | { allowed: false; reason: string }> => {
		const batchMetadata = readResponseBatchRunMetadata(record);
		if (!batchMetadata) return { allowed: true };

		if (batchMetadata.limits.maxConcurrentRuns !== null) {
			const activeCount = await countActiveBatchRuns(
				deps.control,
				batchMetadata.batchId,
				record.runId,
			);
			if (activeCount >= batchMetadata.limits.maxConcurrentRuns) {
				return {
					allowed: false,
					reason: `response batch ${batchMetadata.batchId} concurrency limit reached: ${activeCount}/${batchMetadata.limits.maxConcurrentRuns}`,
				};
			}
		}

		if (batchMetadata.limits.maxBrowserInteractionsPerMinute !== null) {
			const startedCount = await countRecentlyStartedBatchRuns(deps.control, {
				batchId: batchMetadata.batchId,
				now: now(),
				windowMs: 60_000,
			});
			if (startedCount >= batchMetadata.limits.maxBrowserInteractionsPerMinute) {
				return {
					allowed: false,
					reason: `response batch ${batchMetadata.batchId} browser interaction rate limit reached: ${startedCount}/${batchMetadata.limits.maxBrowserInteractionsPerMinute} per minute`,
				};
			}
		}

		return { allowed: true };
	};
}

function getResponseBatchRecordPath(id: string): string {
	return path.join(getResponseBatchesDir(), id, RECORD_FILENAME);
}

async function readResponseBatchRecord(id: string): Promise<ResponseBatchRecord | null> {
	try {
		const raw = await fs.readFile(getResponseBatchRecordPath(id), "utf8");
		return RESPONSE_BATCH_RECORD_SCHEMA.parse(JSON.parse(raw));
	} catch (error) {
		if (isErrnoException(error) && error.code === "ENOENT") return null;
		throw error;
	}
}

async function writeResponseBatchRecord(record: ResponseBatchRecord): Promise<ResponseBatchRecord> {
	const parsed = RESPONSE_BATCH_RECORD_SCHEMA.parse(record);
	const recordPath = getResponseBatchRecordPath(record.id);
	await fs.mkdir(path.dirname(recordPath), { recursive: true });
	const tempPath = `${recordPath}.${process.pid}.${Date.now()}.${randomUUID()}.tmp`;
	await fs.writeFile(tempPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
	await fs.rename(tempPath, recordPath);
	return parsed;
}

async function createResponseBatchRecord(
	record: ResponseBatchRecord,
): Promise<ResponseBatchStoreCreateResult> {
	const parsed = RESPONSE_BATCH_RECORD_SCHEMA.parse(record);
	const recordPath = getResponseBatchRecordPath(record.id);
	await fs.mkdir(path.dirname(recordPath), { recursive: true });
	const tempPath = `${recordPath}.${process.pid}.${Date.now()}.${randomUUID()}.tmp`;
	await fs.writeFile(tempPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
	try {
		await fs.link(tempPath, recordPath);
		return { record: parsed, created: true };
	} catch (error) {
		if (!isErrnoException(error) || error.code !== "EEXIST") throw error;
		const existing = await readResponseBatchRecord(record.id);
		if (!existing) {
			throw new Error(`Response batch ${record.id} existed but could not be read.`);
		}
		return { record: existing, created: false };
	} finally {
		await fs.unlink(tempPath).catch(() => undefined);
	}
}

export async function listResponseBatchRecords(
	options: { limit?: number | null } = {},
): Promise<ResponseBatchRecord[]> {
	let entries: Dirent[];
	try {
		entries = await fs.readdir(getResponseBatchesDir(), { withFileTypes: true });
	} catch (error) {
		if (isErrnoException(error) && error.code === "ENOENT") return [];
		throw error;
	}
	const records = (
		await Promise.all(
			entries
				.filter((entry) => entry.isDirectory())
				.map((entry) => readResponseBatchRecord(entry.name)),
		)
	).filter((record): record is ResponseBatchRecord => record !== null);
	records.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
	if (typeof options.limit === "number" && options.limit >= 0) {
		return records.slice(0, options.limit);
	}
	return records;
}

async function summarizeBatchStatus(
	record: ResponseBatchRecord,
	responsesService: Pick<ExecutionResponsesService, "readResponse">,
): Promise<ResponseBatchStatus> {
	const jobs: ResponseBatchJobStatus[] = [];
	for (const job of record.jobs) {
		const { response, readFailure } = await readBatchJobResponse(responsesService, job.responseId);
		const diagnostics = response?.metadata?.executionSummary?.runtimeDiagnosticsSummary ?? null;
		jobs.push({
			...job,
			status: response?.status ?? "missing",
			completedAt:
				(response?.metadata?.executionSummary?.completedAt as string | null | undefined) ?? null,
			failure: readFailure ?? response?.metadata?.executionSummary?.failureSummary ?? null,
			diagnostics,
			runtimeState: diagnostics?.runtimeState ?? null,
		});
	}
	const counts = {
		total: jobs.length,
		in_progress: jobs.filter((job) => job.status === "in_progress").length,
		completed: jobs.filter((job) => job.status === "completed").length,
		failed: jobs.filter((job) => job.status === "failed").length,
		cancelled: jobs.filter((job) => job.status === "cancelled").length,
		missing: jobs.filter((job) => job.status === "missing").length,
	};
	return {
		id: record.id,
		object: "response_batch_status",
		status: resolveBatchStatus(counts),
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
		metadata: record.metadata,
		limits: record.limits,
		dispatch: record.dispatch ?? null,
		retry: record.retry ?? null,
		counts,
		jobs,
	};
}

async function readBatchJobResponse(
	responsesService: Pick<ExecutionResponsesService, "readResponse">,
	responseId: string,
): Promise<{
	response: ExecutionResponse | null;
	readFailure: { code: "response_read_failed"; message: string } | null;
}> {
	try {
		return {
			response: await responsesService.readResponse(responseId),
			readFailure: null,
		};
	} catch (error) {
		return {
			response: null,
			readFailure: {
				code: "response_read_failed",
				message: error instanceof Error ? error.message : String(error),
			},
		};
	}
}

function resolveBatchStatus(counts: ResponseBatchStatus["counts"]): ResponseBatchStatus["status"] {
	if (counts.in_progress > 0) return "running";
	if (counts.missing > 0) return "failed";
	if (counts.failed > 0 && counts.completed + counts.cancelled + counts.failed === counts.total)
		return "failed";
	if (counts.cancelled > 0 && counts.completed + counts.cancelled === counts.total)
		return "cancelled";
	if (counts.completed === counts.total) return "completed";
	if (counts.failed > 0 || counts.cancelled > 0) return "mixed_terminal";
	return "queued";
}

function summarizeCancellationOutcomes(
	jobs: ResponseBatchCancellationJobResult[],
): ResponseBatchCancellationResult["counts"] {
	return {
		total: jobs.length,
		cancelled: jobs.filter((job) => job.outcome === "cancelled").length,
		not_active: jobs.filter((job) => job.outcome === "not-active").length,
		not_found: jobs.filter((job) => job.outcome === "not-found").length,
		not_owned: jobs.filter((job) => job.outcome === "not-owned").length,
		errors: jobs.filter((job) => job.outcome === "error").length,
	};
}

function selectRetryableBatchJobs(
	status: ResponseBatchStatus,
	responseIds: string[] | undefined,
): {
	jobs: ResponseBatchJobStatus[];
	error: ResponseBatchRetryResult["error"];
} {
	const requested = responseIds ? new Set(responseIds) : null;
	if (requested) {
		const known = new Set(status.jobs.map((job) => job.responseId));
		const unknown = responseIds?.filter((responseId) => !known.has(responseId)) ?? [];
		if (unknown.length > 0) {
			return {
				jobs: [],
				error: {
					code: "invalid_selection",
					message: `Response batch ${status.id} does not contain selected response ids: ${unknown.join(", ")}.`,
				},
			};
		}
	}
	const selected = requested
		? status.jobs.filter((job) => requested.has(job.responseId))
		: status.jobs.filter((job) => job.status === "failed" || job.status === "cancelled");
	const ineligible = requested
		? selected.filter((job) => job.status !== "failed" && job.status !== "cancelled")
		: [];
	if (requested && ineligible.length > 0) {
		return {
			jobs: [],
			error: {
				code: "invalid_selection",
				message: `Response batch ${status.id} selected non-retryable children: ${ineligible
					.map((job) => `${job.responseId} (${job.status})`)
					.join(", ")}.`,
			},
		};
	}
	if (selected.length === 0) {
		return {
			jobs: [],
			error: {
				code: "no_eligible_children",
				message: `Response batch ${status.id} has no failed or cancelled children to retry.`,
			},
		};
	}
	return { jobs: selected.sort((left, right) => left.index - right.index), error: null };
}

function createRejectedRetryResult(
	sourceBatchId: string,
	requestedAt: string,
	idempotencyKeyHash: string,
	error: NonNullable<ResponseBatchRetryResult["error"]>,
): ResponseBatchRetryResult {
	return {
		id: sourceBatchId,
		object: "response_batch_retry",
		requestedAt,
		accepted: false,
		reused: false,
		fullyMaterialized: false,
		idempotencyKeyHash,
		requestFingerprint: null,
		error,
		counts: { selected: 0, created: 0, reused: 0, errors: 0 },
		jobs: [],
		batch: null,
	};
}

function createRetryConflictResult(
	sourceBatchId: string,
	retryBatchId: string,
	requestedAt: string,
	idempotencyKeyHash: string,
	requestFingerprint: string,
): ResponseBatchRetryResult {
	return {
		...createRejectedRetryResult(sourceBatchId, requestedAt, idempotencyKeyHash, {
			code: "idempotency_conflict",
			message: `Idempotency key already identifies retry batch ${retryBatchId} with a different selected-child request.`,
		}),
		requestFingerprint,
	};
}

function matchesRetryRequest(
	record: ResponseBatchRecord,
	expected: ResponseBatchRetryLineage,
): boolean {
	return Boolean(
		record.retry &&
			record.retry.sourceBatchId === expected.sourceBatchId &&
			record.retry.idempotencyKeyHash === expected.idempotencyKeyHash &&
			record.retry.requestFingerprint === expected.requestFingerprint &&
			record.retry.sourceResponseIds.length === expected.sourceResponseIds.length &&
			record.retry.sourceResponseIds.every(
				(responseId, index) => responseId === expected.sourceResponseIds[index],
			),
	);
}

function createRetryResponseId(
	sourceBatchId: string,
	idempotencyKeyHash: string,
	sourceResponseId: string,
): string {
	return `resp_retry_${hashRetryValue(
		`${sourceBatchId}\0${idempotencyKeyHash}\0${sourceResponseId}`,
	).slice(0, 24)}`;
}

function createRetryBatchMetadata(
	record: ResponseBatchRecord,
	job: ResponseBatchJobRecord,
): Record<string, unknown> {
	return {
		batchId: record.id,
		batchIndex: job.index,
		batchLimits: record.limits,
		...(record.dispatch && job.dispatch
			? {
					batchDispatch: {
						team: record.dispatch.team,
						mode: record.dispatch.mode,
						projectSync: record.dispatch.projectSync,
						memberAgent: job.dispatch.memberAgent,
						memberIndex: job.dispatch.memberIndex,
					},
				}
			: {}),
	};
}

function summarizeRetryOutcomes(
	jobs: ResponseBatchRetryJobResult[],
): ResponseBatchRetryResult["counts"] {
	return {
		selected: jobs.length,
		created: jobs.filter((job) => job.outcome === "created").length,
		reused: jobs.filter((job) => job.outcome === "reused").length,
		errors: jobs.filter((job) => job.outcome === "error").length,
	};
}

function hashRetryValue(value: string): string {
	return createHash("sha256").update(value).digest("hex");
}

function withBatchMetadata(
	request: ExecutionRequest,
	batchId: string,
	batchIndex: number,
	limits: ResponseBatchRecord["limits"],
	dispatch: ResponseBatchDispatchRecord | null,
	assignment: ResponseBatchDispatchJobAssignment | null,
): ExecutionRequest {
	return {
		...request,
		metadata: {
			...(request.metadata ?? {}),
			batchId,
			batchIndex,
			batchLimits: limits,
			...(dispatch && assignment
				? {
						batchDispatch: {
							team: dispatch.team,
							mode: dispatch.mode,
							projectSync: dispatch.projectSync,
							memberAgent: assignment.memberAgent,
							memberIndex: assignment.memberIndex,
						},
					}
				: {}),
		},
	};
}

async function resolveDispatchResolution(input: {
	dispatch: ResponseBatchDispatchRequest | null;
	payloadResolution: ResponseBatchDispatchResolution | undefined;
	requests: ExecutionRequest[];
	resolver: ResponseBatchServiceDeps["resolveDispatchPool"];
}): Promise<ResponseBatchDispatchResolution | null> {
	if (!input.dispatch) return null;
	if (input.payloadResolution) {
		assertDispatchResolutionMatches(input.dispatch, input.payloadResolution);
		return input.payloadResolution;
	}
	if (!input.resolver) {
		throw new Error(
			`Response batch dispatch team "${input.dispatch.team}" requires a dispatch-pool resolver in this runtime surface.`,
		);
	}
	const resolution = await input.resolver({
		dispatch: input.dispatch,
		requests: input.requests,
	});
	assertDispatchResolutionMatches(input.dispatch, resolution);
	return resolution;
}

function assertDispatchResolutionMatches(
	dispatch: ResponseBatchDispatchRequest,
	resolution: ResponseBatchDispatchResolution,
): void {
	if (resolution.dispatch.team !== dispatch.team) {
		throw new Error(
			`Response batch dispatch resolution team "${resolution.dispatch.team}" does not match requested team "${dispatch.team}".`,
		);
	}
	if (resolution.requests.length !== resolution.assignments.length) {
		throw new Error(
			"Response batch dispatch resolution must provide one assignment per expanded request.",
		);
	}
}

function readResponseBatchRunMetadata(record: ExecutionRunStoredRecord): {
	batchId: string;
	limits: ResponseBatchRecord["limits"];
} | null {
	const metadata = readRecord(record.bundle.run.initialInputs.metadata);
	if (!metadata) return null;
	const batchId = typeof metadata.batchId === "string" ? metadata.batchId : null;
	if (!batchId) return null;
	const rawLimits = readRecord(metadata.batchLimits);
	return {
		batchId,
		limits: {
			maxConcurrentRuns: readNullablePositiveInteger(rawLimits?.maxConcurrentRuns),
			maxBrowserInteractionsPerMinute: readNullablePositiveInteger(
				rawLimits?.maxBrowserInteractionsPerMinute,
			),
		},
	};
}

async function countActiveBatchRuns(
	control: ExecutionRuntimeControlContract,
	batchId: string,
	excludingRunId: string,
): Promise<number> {
	const records = await control.listRuns({ sourceKind: "direct" });
	return records.filter((record) => {
		if (record.runId === excludingRunId) return false;
		if (readResponseBatchRunMetadata(record)?.batchId !== batchId) return false;
		if (["succeeded", "failed", "cancelled"].includes(record.bundle.run.status)) return false;
		return record.bundle.leases.some((lease) => lease.status === "active");
	}).length;
}

async function countRecentlyStartedBatchRuns(
	control: ExecutionRuntimeControlContract,
	input: {
		batchId: string;
		now: Date;
		windowMs: number;
	},
): Promise<number> {
	const cutoff = input.now.getTime() - input.windowMs;
	const records = await control.listRuns({ sourceKind: "direct" });
	const startedStepKeys = new Set<string>();
	return records.reduce((count, record) => {
		if (readResponseBatchRunMetadata(record)?.batchId !== input.batchId) return count;
		return (
			count +
			record.bundle.events.filter((event) => {
				if (event.type !== "step-started") return false;
				const createdAt = Date.parse(event.createdAt);
				if (!Number.isFinite(createdAt) || createdAt < cutoff) return false;
				const key = event.stepId ? `${record.runId}\0${event.stepId}` : record.runId;
				if (startedStepKeys.has(key)) return false;
				startedStepKeys.add(key);
				return true;
			}).length
		);
	}, 0);
}

function readRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function readNullablePositiveInteger(value: unknown): number | null {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

const RESPONSE_BATCH_JOB_RECORD_SCHEMA: z.ZodType<ResponseBatchJobRecord> = z.object({
	index: z.number().int().min(0),
	responseId: z.string(),
	model: z.string(),
	agent: z.string().nullable(),
	team: z.string().nullable().optional(),
	service: z.string().nullable(),
	runtimeProfile: z.string().nullable(),
	dispatch: z
		.object({
			team: z.string(),
			mode: z.literal("next_available"),
			memberAgent: z.string(),
			memberIndex: z.number().int().min(0),
		})
		.nullable()
		.optional(),
	retryOf: z
		.object({
			batchId: z.string(),
			responseId: z.string(),
			index: z.number().int().min(0),
		})
		.nullable()
		.optional(),
	createdAt: z.string(),
});

const RESPONSE_BATCH_RECORD_SCHEMA: z.ZodType<ResponseBatchRecord> = z.object({
	id: z.string(),
	object: z.literal("response_batch"),
	createdAt: z.string(),
	updatedAt: z.string(),
	metadata: z.record(z.string(), z.unknown()),
	limits: z.object({
		maxConcurrentRuns: z.number().int().positive().nullable(),
		maxBrowserInteractionsPerMinute: z.number().int().positive().nullable(),
	}),
	dispatch: z
		.object({
			team: z.string(),
			mode: z.literal("next_available"),
			projectSync: z.literal("none"),
			memberCount: z.number().int().nonnegative(),
			projectName: z.string().nullable().optional(),
			warnings: z.array(z.string()),
		})
		.nullable()
		.optional(),
	retry: z
		.object({
			sourceBatchId: z.string(),
			idempotencyKeyHash: z.string(),
			requestFingerprint: z.string(),
			requestedAt: z.string(),
			note: z.string().nullable(),
			sourceResponseIds: z.array(z.string()),
		})
		.nullable()
		.optional(),
	jobs: z.array(RESPONSE_BATCH_JOB_RECORD_SCHEMA),
});

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && "code" in error;
}
