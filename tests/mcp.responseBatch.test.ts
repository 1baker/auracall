import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	createResponseBatchCancelToolHandler,
	createResponseBatchCreateToolHandler,
	createResponseBatchRetryToolHandler,
	createResponseBatchStatusToolHandler,
	registerResponseBatchTools,
} from "../src/mcp/tools/responseBatch.js";
import type {
	ResponseBatchCancellationResult,
	ResponseBatchRetryResult,
	ResponseBatchStatus,
} from "../src/runtime/responseBatchService.js";

const runningBatch = {
	id: "batch_mcp_1",
	object: "response_batch_status",
	status: "running",
	createdAt: "2026-05-12T14:00:00.000Z",
	updatedAt: "2026-05-12T14:00:00.000Z",
	metadata: { course: "ChE 4470" },
	limits: { maxConcurrentRuns: 2, maxBrowserInteractionsPerMinute: 8 },
	dispatch: null,
	counts: {
		total: 2,
		in_progress: 2,
		completed: 0,
		failed: 0,
		cancelled: 0,
		missing: 0,
	},
	jobs: [
		{
			index: 0,
			responseId: "resp_student_1",
			model: "agent:pro-extended-chatgpt-soylei",
			agent: "pro-extended-chatgpt-soylei",
			service: "chatgpt",
			runtimeProfile: "wsl-chrome-3",
			createdAt: "2026-05-12T14:00:00.000Z",
			status: "in_progress",
			completedAt: null,
			failure: null,
		},
		{
			index: 1,
			responseId: "resp_student_2",
			model: "agent:pro-extended-chatgpt-soylei",
			agent: "pro-extended-chatgpt-soylei",
			service: "chatgpt",
			runtimeProfile: "wsl-chrome-3",
			createdAt: "2026-05-12T14:00:00.000Z",
			status: "in_progress",
			completedAt: null,
			failure: null,
		},
	],
} satisfies ResponseBatchStatus;

describe("mcp response batch tools", () => {
	it("creates a response batch and returns pollable child response ids", async () => {
		const createBatch = vi.fn(async () => runningBatch);
		const handler = createResponseBatchCreateToolHandler({
			createBatch,
			readBatchStatus: vi.fn(),
		});

		const result = await handler({
			metadata: { course: "ChE 4470" },
			limits: { maxConcurrentRuns: 2, maxBrowserInteractionsPerMinute: 8 },
			requests: [
				{
					model: "agent:pro-extended-chatgpt-soylei",
					input: "Grade student 1.",
					auracall: {
						agent: "pro-extended-chatgpt-soylei",
						service: "chatgpt",
						runtimeProfile: "wsl-chrome-3",
					},
				},
				{
					model: "agent:pro-extended-chatgpt-soylei",
					input: "Grade student 2.",
					auracall: {
						agent: "pro-extended-chatgpt-soylei",
						service: "chatgpt",
						runtimeProfile: "wsl-chrome-3",
					},
				},
			],
		});

		expect(createBatch).toHaveBeenCalledWith({
			metadata: { course: "ChE 4470" },
			limits: { maxConcurrentRuns: 2, maxBrowserInteractionsPerMinute: 8 },
			requests: expect.any(Array),
		});
		expect(result).toMatchObject({
			isError: false,
			content: [{ type: "text", text: "Response batch batch_mcp_1 is running: 2 jobs." }],
			structuredContent: {
				id: "batch_mcp_1",
				status: "running",
				jobs: [{ responseId: "resp_student_1" }, { responseId: "resp_student_2" }],
			},
		});
	});

	it("reads response batch status without resubmitting prompts", async () => {
		const readBatchStatus = vi.fn(async () => ({
			...runningBatch,
			status: "completed" as const,
			counts: { ...runningBatch.counts, in_progress: 0, completed: 2 },
			jobs: runningBatch.jobs.map((job) => ({ ...job, status: "completed" as const })),
		}));
		const handler = createResponseBatchStatusToolHandler({
			createBatch: vi.fn(),
			readBatchStatus,
		});

		const result = await handler({ id: "batch_mcp_1" });

		expect(readBatchStatus).toHaveBeenCalledWith("batch_mcp_1");
		expect(result).toMatchObject({
			isError: false,
			content: [{ type: "text", text: "Response batch batch_mcp_1 is completed: 2/2 completed." }],
			structuredContent: {
				id: "batch_mcp_1",
				status: "completed",
			},
		});
	});

	it("cancels a response batch through the shared service result", async () => {
		const cancellation = {
			id: "batch_mcp_1",
			object: "response_batch_cancellation",
			requestedAt: "2026-08-15T22:30:00.000Z",
			note: "operator stopped batch",
			fullySettled: false,
			counts: {
				total: 2,
				cancelled: 1,
				not_active: 0,
				not_found: 0,
				not_owned: 1,
				errors: 0,
			},
			jobs: [
				{
					...runningBatch.jobs[0],
					outcome: "cancelled",
					cancelled: true,
					reason: "operator stopped batch",
				},
				{
					...runningBatch.jobs[1],
					outcome: "not-owned",
					cancelled: false,
					reason: "active lease is owned by another runner",
				},
			],
			batch: {
				...runningBatch,
				counts: { ...runningBatch.counts, in_progress: 1, cancelled: 1 },
				jobs: [{ ...runningBatch.jobs[0], status: "cancelled" as const }, runningBatch.jobs[1]],
			},
		} satisfies ResponseBatchCancellationResult;
		const cancelBatch = vi.fn(async () => cancellation);
		const handler = createResponseBatchCancelToolHandler({
			createBatch: vi.fn(),
			readBatchStatus: vi.fn(),
			cancelBatch,
		});

		const result = await handler({ id: "batch_mcp_1", note: "operator stopped batch" });

		expect(cancelBatch).toHaveBeenCalledWith("batch_mcp_1", "operator stopped batch");
		expect(result).toMatchObject({
			isError: true,
			content: [
				{
					type: "text",
					text: "Response batch batch_mcp_1 cancellation requires attention: 1/2 children cancelled.",
				},
			],
			structuredContent: {
				object: "response_batch_cancellation",
				fullySettled: false,
				counts: { cancelled: 1, not_owned: 1 },
			},
		});
	});

	it("retries a response batch through the shared idempotent service result", async () => {
		const retry = {
			id: "batch_retry_mcp_1",
			object: "response_batch_retry",
			requestedAt: "2026-08-15T23:00:00.000Z",
			accepted: true,
			reused: false,
			fullyMaterialized: true,
			idempotencyKeyHash: "abc123",
			requestFingerprint: "fingerprint123",
			error: null,
			counts: { selected: 1, created: 1, reused: 0, errors: 0 },
			jobs: [
				{
					index: 0,
					sourceResponseId: "resp_student_1",
					responseId: "resp_retry_student_1",
					outcome: "created",
					reason: "fresh retry response created",
				},
			],
			batch: {
				...runningBatch,
				id: "batch_retry_mcp_1",
				retry: {
					sourceBatchId: "batch_mcp_1",
					idempotencyKeyHash: "abc123",
					requestFingerprint: "fingerprint123",
					requestedAt: "2026-08-15T23:00:00.000Z",
					note: null,
					sourceResponseIds: ["resp_student_1"],
				},
			},
		} satisfies ResponseBatchRetryResult;
		const retryBatch = vi.fn(async () => retry);
		const handler = createResponseBatchRetryToolHandler({
			createBatch: vi.fn(),
			readBatchStatus: vi.fn(),
			retryBatch,
		});

		const result = await handler({
			id: "batch_mcp_1",
			idempotencyKey: "operator-attempt-1",
			responseIds: ["resp_student_1"],
		});

		expect(retryBatch).toHaveBeenCalledWith("batch_mcp_1", {
			idempotencyKey: "operator-attempt-1",
			responseIds: ["resp_student_1"],
		});
		expect(result).toMatchObject({
			isError: false,
			structuredContent: {
				object: "response_batch_retry",
				accepted: true,
				counts: { selected: 1, created: 1 },
			},
		});
	});

	it("declares finalizing runtime state in MCP output schemas", () => {
		const registeredTools = new Map<string, { outputSchema?: z.ZodRawShape }>();
		const server = {
			registerTool: vi.fn((name: string, config: { outputSchema?: z.ZodRawShape }) => {
				registeredTools.set(name, config);
			}),
		};
		registerResponseBatchTools(
			server as unknown as Parameters<typeof registerResponseBatchTools>[0],
			{
				service: {
					createBatch: vi.fn(),
					readBatchStatus: vi.fn(),
				},
			},
		);
		expect(registeredTools.has("response_batch_cancel")).toBe(true);
		expect(registeredTools.has("response_batch_retry")).toBe(true);
		const retryTool = registeredTools.get("response_batch_retry");
		if (!retryTool?.outputSchema) {
			throw new Error("expected response_batch_retry output schema");
		}
		expect(
			z.object(retryTool.outputSchema).parse({
				id: "batch_retry_mcp_1",
				object: "response_batch_retry",
				requestedAt: "2026-08-15T23:00:00.000Z",
				accepted: false,
				reused: false,
				fullyMaterialized: false,
				idempotencyKeyHash: "abc123",
				requestFingerprint: null,
				error: { code: "no_eligible_children", message: "nothing to retry" },
				counts: { selected: 0, created: 0, reused: 0, errors: 0 },
				jobs: [],
				batch: null,
			}),
		).toMatchObject({ object: "response_batch_retry", accepted: false });
		const cancelTool = registeredTools.get("response_batch_cancel");
		if (!cancelTool?.outputSchema) {
			throw new Error("expected response_batch_cancel output schema");
		}
		const cancellationSchema = z.object(cancelTool.outputSchema);
		expect(
			cancellationSchema.parse({
				id: "batch_mcp_1",
				object: "response_batch_cancellation",
				requestedAt: "2026-08-15T22:30:00.000Z",
				note: "operator stopped batch",
				fullySettled: false,
				counts: {
					total: 1,
					cancelled: 0,
					not_active: 0,
					not_found: 0,
					not_owned: 1,
					errors: 0,
				},
				jobs: [
					{
						...runningBatch.jobs[0],
						team: "grading-team",
						outcome: "not-owned",
						cancelled: false,
						reason: "active lease is owned by another runner",
					},
				],
				batch: {
					...runningBatch,
					counts: { ...runningBatch.counts, total: 1, in_progress: 1 },
					jobs: [{ ...runningBatch.jobs[0], team: "grading-team" }],
				},
			}),
		).toMatchObject({ object: "response_batch_cancellation", fullySettled: false });
		const tool = registeredTools.get("response_batch_status");
		if (!tool?.outputSchema) {
			throw new Error("expected response_batch_status output schema");
		}
		const [job] = runningBatch.jobs;
		if (!job) {
			throw new Error("expected response batch job fixture");
		}
		const schema = z.object(tool.outputSchema);
		const finalizingBatch = {
			...runningBatch,
			counts: {
				total: 1,
				in_progress: 1,
				completed: 0,
				failed: 0,
				cancelled: 0,
				missing: 0,
			},
			jobs: [
				{
					...job,
					runtimeState: "finalizing",
					diagnostics: {
						runtimeState: "finalizing",
						leaseState: "expired",
						browserTaskState: "response-complete",
						lastProviderEvidence: {
							observedAt: "2026-05-12T14:04:30.000Z",
							state: "response-complete",
							source: "browser-service",
							evidenceRef: "chatgpt-response-finished",
							confidence: "high",
							details: {
								service: "chatgpt",
								runtimeProfileId: "wsl-chrome-3",
							},
						},
						terminalTransitionSource: null,
					},
				},
			],
		};

		expect(schema.safeParse(finalizingBatch).success).toBe(true);
		expect(
			schema.safeParse({
				...finalizingBatch,
				jobs: [
					{
						...finalizingBatch.jobs[0],
						runtimeState: "done-ish",
					},
				],
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				...finalizingBatch,
				jobs: [
					{
						...finalizingBatch.jobs[0],
						diagnostics: {
							...finalizingBatch.jobs[0].diagnostics,
							runtimeState: "done-ish",
						},
					},
				],
			}).success,
		).toBe(false);
	});
});
