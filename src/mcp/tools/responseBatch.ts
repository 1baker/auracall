import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ExecutionResponseStatusSchema } from "../../runtime/apiSchema.js";
import {
	createResponseBatchService,
	type ResponseBatchCancellationResult,
	ResponseBatchCreateRequestSchema,
	ResponseBatchRetryRequestSchema,
	type ResponseBatchRetryResult,
	type ResponseBatchService,
} from "../../runtime/responseBatchService.js";
import { createExecutionResponsesService } from "../../runtime/responsesService.js";

const { dispatchResolution: _dispatchResolution, ...responseBatchCreateInputShape } =
	ResponseBatchCreateRequestSchema.shape satisfies z.ZodRawShape;

const responseBatchStatusInputShape = {
	id: z.string().min(1),
} satisfies z.ZodRawShape;

const responseBatchCancelInputShape = {
	id: z.string().min(1),
	note: z.string().trim().min(1).nullable().optional(),
} satisfies z.ZodRawShape;

const responseBatchRetryInputShape = {
	id: z.string().min(1),
	...ResponseBatchRetryRequestSchema.shape,
} satisfies z.ZodRawShape;

const responseBatchRetryLineageSchema = z.object({
	sourceBatchId: z.string(),
	idempotencyKeyHash: z.string(),
	requestFingerprint: z.string(),
	requestedAt: z.string(),
	note: z.string().nullable(),
	sourceResponseIds: z.array(z.string()),
});

const responseBatchRuntimeStateSchema = z
	.enum(["queued", "running", "recovering", "finalizing", "stranded", "terminal"])
	.nullable()
	.optional();

const responseBatchRuntimeDiagnosticsSummarySchema = z
	.object({
		runtimeState: responseBatchRuntimeStateSchema,
		leaseState: z.enum(["none", "active", "released", "expired", "mixed"]).nullable().optional(),
		lastLeaseEvent: z
			.object({
				type: z.enum(["lease-acquired", "lease-released"]).nullable().optional(),
				createdAt: z.string().nullable().optional(),
				leaseId: z.string().nullable().optional(),
				ownerId: z.string().nullable().optional(),
				note: z.string().nullable().optional(),
				releaseReason: z.string().nullable().optional(),
			})
			.nullable()
			.optional(),
		browserTaskState: z.string().nullable().optional(),
		lastProviderEvidence: z
			.object({
				observedAt: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				source: z.string().nullable().optional(),
				evidenceRef: z.string().nullable().optional(),
				confidence: z.string().nullable().optional(),
				details: z.record(z.string(), z.unknown()).nullable().optional(),
			})
			.nullable()
			.optional(),
		terminalTransitionSource: z
			.enum(["step-succeeded", "step-failed", "run-cancelled", "requested-output-policy"])
			.nullable()
			.optional(),
	})
	.nullable()
	.optional();

const responseBatchJobOutputSchema = z.object({
	index: z.number().int().min(0),
	responseId: z.string(),
	model: z.string(),
	agent: z.string().nullable(),
	team: z.string().nullable().optional(),
	service: z.string().nullable(),
	runtimeProfile: z.string().nullable(),
	dispatch: z.record(z.string(), z.unknown()).nullable().optional(),
	retry: responseBatchRetryLineageSchema.nullable().optional(),
	createdAt: z.string(),
	status: z.union([ExecutionResponseStatusSchema, z.literal("missing")]),
	completedAt: z.string().nullable(),
	failure: z.unknown().nullable(),
	diagnostics: responseBatchRuntimeDiagnosticsSummarySchema,
	runtimeState: responseBatchRuntimeStateSchema,
});

const responseBatchOutputShape = {
	id: z.string(),
	object: z.literal("response_batch_status"),
	status: z.enum(["queued", "running", "completed", "failed", "cancelled", "mixed_terminal"]),
	priority: z.object({
		requested: z.enum(["low", "normal", "high", "urgent"]),
		effective: z.enum(["low", "normal", "high", "urgent"]),
		ageBoost: z.number().int().min(0).max(3),
		agingIntervalMinutes: z.literal(15),
	}),
	dispatch: z.record(z.string(), z.unknown()).nullable().optional(),
	counts: z.record(z.string(), z.number()),
	jobs: z.array(responseBatchJobOutputSchema),
} satisfies z.ZodRawShape;

const responseBatchRetryOutputShape = {
	id: z.string(),
	object: z.literal("response_batch_retry"),
	requestedAt: z.string(),
	accepted: z.boolean(),
	reused: z.boolean(),
	fullyMaterialized: z.boolean(),
	idempotencyKeyHash: z.string(),
	requestFingerprint: z.string().nullable(),
	error: z
		.object({
			code: z.enum(["no_eligible_children", "invalid_selection", "idempotency_conflict"]),
			message: z.string(),
		})
		.nullable(),
	counts: z.object({
		selected: z.number().int().nonnegative(),
		created: z.number().int().nonnegative(),
		reused: z.number().int().nonnegative(),
		errors: z.number().int().nonnegative(),
	}),
	jobs: z.array(
		z.object({
			index: z.number().int().nonnegative(),
			sourceResponseId: z.string(),
			responseId: z.string(),
			outcome: z.enum(["created", "reused", "error"]),
			reason: z.string(),
		}),
	),
	batch: z.object(responseBatchOutputShape).nullable(),
} satisfies z.ZodRawShape;

const responseBatchCancellationOutputShape = {
	id: z.string(),
	object: z.literal("response_batch_cancellation"),
	requestedAt: z.string(),
	note: z.string(),
	fullySettled: z.boolean(),
	counts: z.object({
		total: z.number().int().nonnegative(),
		cancelled: z.number().int().nonnegative(),
		not_active: z.number().int().nonnegative(),
		not_found: z.number().int().nonnegative(),
		not_owned: z.number().int().nonnegative(),
		errors: z.number().int().nonnegative(),
	}),
	jobs: z.array(
		z.object({
			index: z.number().int().min(0),
			responseId: z.string(),
			model: z.string(),
			agent: z.string().nullable(),
			team: z.string().nullable().optional(),
			service: z.string().nullable(),
			runtimeProfile: z.string().nullable(),
			dispatch: z.record(z.string(), z.unknown()).nullable().optional(),
			createdAt: z.string(),
			outcome: z.enum(["cancelled", "not-active", "not-found", "not-owned", "error"]),
			cancelled: z.boolean(),
			reason: z.string(),
		}),
	),
	batch: z.object(responseBatchOutputShape),
} satisfies z.ZodRawShape;

export interface RegisterResponseBatchToolsDeps {
	service?: ResponseBatchService;
}

export function registerResponseBatchTools(
	server: McpServer,
	deps: RegisterResponseBatchToolsDeps = {},
): void {
	const service =
		deps.service ??
		createResponseBatchService({ responsesService: createExecutionResponsesService() });
	server.registerTool(
		"response_batch_create",
		{
			title: "Create AuraCall response batch",
			description:
				"Create a pollable batch of durable AuraCall response runs. Each child is a normal response run and can also be read with run_status.",
			inputSchema: responseBatchCreateInputShape,
			outputSchema: responseBatchOutputShape,
		},
		createResponseBatchCreateToolHandler(service),
	);
	server.registerTool(
		"response_batch_status",
		{
			title: "Read AuraCall response batch status",
			description:
				"Read aggregate status and child response ids for a response batch without resubmitting any prompts.",
			inputSchema: responseBatchStatusInputShape,
			outputSchema: responseBatchOutputShape,
		},
		createResponseBatchStatusToolHandler(service),
	);
	server.registerTool(
		"response_batch_cancel",
		{
			title: "Cancel AuraCall response batch",
			description:
				"Cancel queued and locally owned active child runs without replaying prompts or taking over foreign leases.",
			inputSchema: responseBatchCancelInputShape,
			outputSchema: responseBatchCancellationOutputShape,
		},
		createResponseBatchCancelToolHandler(service),
	);
	server.registerTool(
		"response_batch_retry",
		{
			title: "Retry AuraCall response batch",
			description:
				"Create an idempotent retry batch with fresh response ids for failed or cancelled children while preserving source lineage.",
			inputSchema: responseBatchRetryInputShape,
			outputSchema: responseBatchRetryOutputShape,
		},
		createResponseBatchRetryToolHandler(service),
	);
}

export function createResponseBatchCreateToolHandler(service: ResponseBatchService) {
	return async (input: unknown) => {
		const payload = ResponseBatchCreateRequestSchema.parse(input);
		const result = await service.createBatch(payload);
		return {
			isError: result.status === "failed",
			content: [
				{
					type: "text" as const,
					text: `Response batch ${result.id} is ${result.status}: ${result.counts.total} jobs.`,
				},
			],
			structuredContent: result as unknown as Record<string, unknown>,
		};
	};
}

export function createResponseBatchStatusToolHandler(service: ResponseBatchService) {
	return async (input: unknown) => {
		const payload = z.object(responseBatchStatusInputShape).parse(input);
		const result = await service.readBatchStatus(payload.id);
		if (!result) {
			return {
				isError: true,
				content: [
					{
						type: "text" as const,
						text: `Response batch ${payload.id} was not found.`,
					},
				],
				structuredContent: {
					id: payload.id,
					object: "response_batch_status",
					status: "failed",
					priority: {
						requested: "normal",
						effective: "normal",
						ageBoost: 0,
						agingIntervalMinutes: 15,
					},
					counts: {
						total: 0,
						in_progress: 0,
						completed: 0,
						failed: 0,
						cancelled: 0,
						missing: 0,
					},
					jobs: [],
				},
			};
		}
		return {
			isError: result.status === "failed",
			content: [
				{
					type: "text" as const,
					text: `Response batch ${result.id} is ${result.status}: ${result.counts.completed}/${result.counts.total} completed.`,
				},
			],
			structuredContent: result as unknown as Record<string, unknown>,
		};
	};
}

export function createResponseBatchCancelToolHandler(service: ResponseBatchService) {
	return async (input: unknown) => {
		const payload = z.object(responseBatchCancelInputShape).parse(input);
		if (!service.cancelBatch) {
			return createMissingBatchCancellationResult(
				payload.id,
				"Response batch cancellation is not configured for this runtime.",
			);
		}
		const result = await service.cancelBatch(payload.id, payload.note ?? null);
		if (!result) {
			return createMissingBatchCancellationResult(
				payload.id,
				`Response batch ${payload.id} was not found.`,
			);
		}
		return {
			isError: !result.fullySettled,
			content: [
				{
					type: "text" as const,
					text: `Response batch ${result.id} cancellation ${
						result.fullySettled ? "settled" : "requires attention"
					}: ${result.counts.cancelled}/${result.counts.total} children cancelled.`,
				},
			],
			structuredContent: result as unknown as Record<string, unknown>,
		};
	};
}

export function createResponseBatchRetryToolHandler(service: ResponseBatchService) {
	return async (input: unknown) => {
		const { id, ...payload } = z.object(responseBatchRetryInputShape).parse(input);
		if (!service.retryBatch) {
			return createMissingBatchRetryResult(
				id,
				"Response batch retry is not configured for this runtime.",
			);
		}
		const result = await service.retryBatch(id, payload);
		if (!result) {
			return createMissingBatchRetryResult(id, `Response batch ${id} was not found.`);
		}
		return {
			isError: !result.accepted || !result.fullyMaterialized,
			content: [
				{
					type: "text" as const,
					text: result.accepted
						? `Response batch retry ${result.id} materialized ${result.counts.created + result.counts.reused}/${result.counts.selected} children.`
						: (result.error?.message ?? `Response batch ${id} could not be retried.`),
				},
			],
			structuredContent: result as unknown as Record<string, unknown>,
		};
	};
}

function createMissingBatchRetryResult(id: string, message: string) {
	const result = {
		id,
		object: "response_batch_retry",
		requestedAt: new Date(0).toISOString(),
		accepted: false,
		reused: false,
		fullyMaterialized: false,
		idempotencyKeyHash: "",
		requestFingerprint: null,
		error: { code: "invalid_selection", message },
		counts: { selected: 0, created: 0, reused: 0, errors: 1 },
		jobs: [],
		batch: null,
	} satisfies ResponseBatchRetryResult;
	return {
		isError: true,
		content: [{ type: "text" as const, text: message }],
		structuredContent: result as unknown as Record<string, unknown>,
	};
}

function createMissingBatchCancellationResult(id: string, message: string) {
	const result = {
		id,
		object: "response_batch_cancellation",
		requestedAt: new Date(0).toISOString(),
		note: message,
		fullySettled: false,
		counts: {
			total: 0,
			cancelled: 0,
			not_active: 0,
			not_found: 0,
			not_owned: 0,
			errors: 1,
		},
		jobs: [],
		batch: {
			id,
			object: "response_batch_status",
			status: "failed",
			priority: {
				requested: "normal",
				effective: "normal",
				ageBoost: 0,
				agingIntervalMinutes: 15,
			},
			createdAt: new Date(0).toISOString(),
			updatedAt: new Date(0).toISOString(),
			metadata: {},
			limits: { maxConcurrentRuns: null, maxBrowserInteractionsPerMinute: null },
			dispatch: null,
			retry: null,
			counts: {
				total: 0,
				in_progress: 0,
				completed: 0,
				failed: 0,
				cancelled: 0,
				missing: 0,
			},
			jobs: [],
		},
	} satisfies ResponseBatchCancellationResult;
	return {
		isError: true,
		content: [{ type: "text" as const, text: message }],
		structuredContent: result as unknown as Record<string, unknown>,
	};
}
