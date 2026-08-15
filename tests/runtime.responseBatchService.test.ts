import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setAuracallHomeDirOverrideForTest } from "../src/auracallHome.js";
import { createEffectiveAgentCatalog } from "../src/config/agentRegistryCatalog.js";
import type { ExecutionRequest, ExecutionResponse } from "../src/runtime/apiTypes.js";
import { createExecutionRuntimeControl } from "../src/runtime/control.js";
import { createExecutionRunEvent } from "../src/runtime/model.js";
import { resolveResponseBatchDispatchPool } from "../src/runtime/responseBatchDispatchPool.js";
import {
	createResponseBatchExecutionGate,
	createResponseBatchService,
	createResponseBatchStore,
	listResponseBatchRecords,
	type ResponseBatchRecord,
} from "../src/runtime/responseBatchService.js";
import {
	createExecutionRequestFromRecord,
	createExecutionResponsesService,
} from "../src/runtime/responsesService.js";
import { createExecutionServiceHost } from "../src/runtime/serviceHost.js";

function createResponse(id: string, status: ExecutionResponse["status"]): ExecutionResponse {
	return {
		id,
		object: "response",
		status,
		model: "agent:pro-extended-chatgpt-soylei",
		output: [],
		metadata: {
			runId: id,
			executionSummary: {
				completedAt: status === "in_progress" ? null : "2026-05-12T14:05:00.000Z",
				failureSummary:
					status === "failed"
						? {
								code: "runner_execution_failed",
								message: "failed once",
							}
						: null,
			},
		},
	};
}

describe("response batch service", () => {
	const cleanup: string[] = [];

	afterEach(async () => {
		setAuracallHomeDirOverrideForTest(null);
		await Promise.all(
			cleanup.splice(0).map((entry) => fs.rm(entry, { recursive: true, force: true })),
		);
	});

	it("creates normal response runs with batch metadata and summarizes status", async () => {
		const createdRequests: ExecutionRequest[] = [];
		const responses = new Map<string, ExecutionResponse>();
		const stored = new Map<string, ResponseBatchRecord>();
		const service = createResponseBatchService({
			now: () => new Date("2026-05-12T14:00:00.000Z"),
			generateBatchId: () => "batch_runtime_1",
			store: {
				readBatch: vi.fn(async (id) => stored.get(id) ?? null),
				writeBatch: vi.fn(async (record) => {
					stored.set(record.id, record);
					return record;
				}),
			},
			responsesService: {
				createResponse: vi.fn(async (request) => {
					const id = `resp_runtime_${createdRequests.length + 1}`;
					createdRequests.push(request);
					const response = createResponse(id, "in_progress");
					responses.set(id, response);
					return response;
				}),
				readResponse: vi.fn(async (id) => responses.get(id) ?? null),
			},
		});

		const status = await service.createBatch({
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

		expect(createdRequests.map((request) => request.metadata)).toEqual([
			{
				batchId: "batch_runtime_1",
				batchIndex: 0,
				batchLimits: {
					maxConcurrentRuns: 2,
					maxBrowserInteractionsPerMinute: 8,
				},
			},
			{
				batchId: "batch_runtime_1",
				batchIndex: 1,
				batchLimits: {
					maxConcurrentRuns: 2,
					maxBrowserInteractionsPerMinute: 8,
				},
			},
		]);
		expect(status).toMatchObject({
			id: "batch_runtime_1",
			object: "response_batch_status",
			status: "running",
			counts: {
				total: 2,
				in_progress: 2,
			},
			limits: {
				maxConcurrentRuns: 2,
				maxBrowserInteractionsPerMinute: 8,
			},
			jobs: [
				{ index: 0, responseId: "resp_runtime_1", status: "in_progress" },
				{ index: 1, responseId: "resp_runtime_2", status: "in_progress" },
			],
		});

		responses.set("resp_runtime_1", createResponse("resp_runtime_1", "completed"));
		responses.set("resp_runtime_2", createResponse("resp_runtime_2", "failed"));
		await expect(service.readBatchStatus("batch_runtime_1")).resolves.toMatchObject({
			id: "batch_runtime_1",
			status: "failed",
			counts: {
				total: 2,
				completed: 1,
				failed: 1,
			},
			jobs: [
				{
					responseId: "resp_runtime_1",
					status: "completed",
					completedAt: "2026-05-12T14:05:00.000Z",
				},
				{
					responseId: "resp_runtime_2",
					status: "failed",
					failure: { code: "runner_execution_failed" },
				},
			],
		});
	});

	it("cancels queued and locally owned children while preserving terminal and foreign-owned runs", async () => {
		const homeDir = await fs.mkdtemp(
			path.join(os.tmpdir(), "auracall-runtime-response-batch-cancel-"),
		);
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const control = createExecutionRuntimeControl();
		const host = createExecutionServiceHost({
			control,
			ownerId: "host:batch-cancel",
			now: () => "2026-08-15T22:30:00.000Z",
			executeStoredRunStep: async () => ({
				output: {
					summary: "completed before cancellation",
					artifacts: [],
					structuredData: {},
					notes: [],
				},
			}),
		});
		const responseIds = [
			"resp_batch_cancel_queued",
			"resp_batch_cancel_completed",
			"resp_batch_cancel_local",
			"resp_batch_cancel_foreign",
		];
		const responsesService = createExecutionResponsesService({
			control,
			executionHost: host,
			drainAfterCreate: false,
			generateResponseId: () => responseIds.shift() ?? "resp_batch_cancel_extra",
			now: () => new Date("2026-08-15T22:30:00.000Z"),
		});
		const service = createResponseBatchService({
			responsesService,
			generateBatchId: () => "batch_cancel_1",
			now: () => new Date("2026-08-15T22:30:00.000Z"),
		});
		await service.createBatch({
			requests: [
				{
					model: "agent:researcher",
					input: "queued",
					auracall: { agent: "researcher", team: "ops" },
				},
				{
					model: "agent:researcher",
					input: "completed",
					auracall: { agent: "researcher", team: "ops" },
				},
				{
					model: "agent:researcher",
					input: "local",
					auracall: { agent: "researcher", team: "ops" },
				},
				{
					model: "agent:researcher",
					input: "foreign",
					auracall: { agent: "researcher", team: "ops" },
				},
			],
		});
		await host.drainRun("resp_batch_cancel_completed");
		await control.acquireLease({
			runId: "resp_batch_cancel_local",
			leaseId: "resp_batch_cancel_local:lease:runner",
			ownerId: "host:batch-cancel",
			acquiredAt: "2026-08-15T22:30:00.000Z",
			heartbeatAt: "2026-08-15T22:30:00.000Z",
			expiresAt: "2026-08-15T22:35:00.000Z",
		});
		await control.acquireLease({
			runId: "resp_batch_cancel_foreign",
			leaseId: "resp_batch_cancel_foreign:lease:runner",
			ownerId: "runner:other-host",
			acquiredAt: "2026-08-15T22:30:00.000Z",
			heartbeatAt: "2026-08-15T22:30:00.000Z",
			expiresAt: "2026-08-15T22:35:00.000Z",
		});

		const cancelBatch = service.cancelBatch;
		if (!cancelBatch) throw new Error("expected response batch cancellation");
		const result = await cancelBatch("batch_cancel_1", "operator stopped batch");

		expect(result).toMatchObject({
			id: "batch_cancel_1",
			object: "response_batch_cancellation",
			requestedAt: "2026-08-15T22:30:00.000Z",
			note: "operator stopped batch",
			fullySettled: false,
			counts: {
				total: 4,
				cancelled: 2,
				not_active: 1,
				not_found: 0,
				not_owned: 1,
				errors: 0,
			},
			jobs: [
				{
					responseId: "resp_batch_cancel_queued",
					team: "ops",
					outcome: "cancelled",
					cancelled: true,
				},
				{ responseId: "resp_batch_cancel_completed", outcome: "not-active", cancelled: false },
				{ responseId: "resp_batch_cancel_local", outcome: "cancelled", cancelled: true },
				{ responseId: "resp_batch_cancel_foreign", outcome: "not-owned", cancelled: false },
			],
			batch: {
				status: "running",
				counts: { total: 4, in_progress: 1, completed: 1, cancelled: 2 },
			},
		});
		await expect(responsesService.readResponse("resp_batch_cancel_queued")).resolves.toMatchObject({
			status: "cancelled",
		});
		await expect(
			responsesService.readResponse("resp_batch_cancel_completed"),
		).resolves.toMatchObject({
			status: "completed",
		});
		await expect(responsesService.readResponse("resp_batch_cancel_local")).resolves.toMatchObject({
			status: "cancelled",
		});
		await expect(responsesService.readResponse("resp_batch_cancel_foreign")).resolves.toMatchObject(
			{
				status: "in_progress",
			},
		);

		await expect(cancelBatch("batch_cancel_1", "repeat cancellation")).resolves.toMatchObject({
			fullySettled: false,
			counts: { cancelled: 2, not_active: 1, not_owned: 1, errors: 0 },
		});
	});

	it("returns unknown batches without attempting cancellation and captures unexpected child errors", async () => {
		const stored = new Map<string, ResponseBatchRecord>();
		stored.set("batch_cancel_error", {
			id: "batch_cancel_error",
			object: "response_batch",
			createdAt: "2026-08-15T22:30:00.000Z",
			updatedAt: "2026-08-15T22:30:00.000Z",
			metadata: {},
			limits: { maxConcurrentRuns: null, maxBrowserInteractionsPerMinute: null },
			jobs: [
				{
					index: 0,
					responseId: "resp_cancel_error",
					model: "agent:researcher",
					agent: "researcher",
					team: "ops",
					service: "chatgpt",
					runtimeProfile: "default",
					createdAt: "2026-08-15T22:30:00.000Z",
				},
			],
		});
		const cancelResponse = vi.fn(async () => {
			throw new Error("simulated persistence conflict");
		});
		const service = createResponseBatchService({
			store: {
				readBatch: vi.fn(async (id) => stored.get(id) ?? null),
				writeBatch: vi.fn(async (record) => record),
			},
			responsesService: {
				createResponse: vi.fn(),
				readResponse: vi.fn(async () => createResponse("resp_cancel_error", "in_progress")),
				cancelResponse,
			},
			now: () => new Date("2026-08-15T22:31:00.000Z"),
		});
		const cancelBatch = service.cancelBatch;
		if (!cancelBatch) throw new Error("expected response batch cancellation");

		await expect(cancelBatch("missing")).resolves.toBeNull();
		expect(cancelResponse).not.toHaveBeenCalled();
		await expect(cancelBatch("batch_cancel_error")).resolves.toMatchObject({
			fullySettled: false,
			counts: { total: 1, errors: 1 },
			jobs: [
				{
					responseId: "resp_cancel_error",
					outcome: "error",
					reason: "simulated persistence conflict",
				},
			],
		});
	});

	it("retries only failed and cancelled children with fresh ids, durable lineage, and idempotent reuse", async () => {
		const homeDir = await fs.mkdtemp(
			path.join(os.tmpdir(), "auracall-runtime-response-batch-retry-"),
		);
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const control = createExecutionRuntimeControl();
		const host = createExecutionServiceHost({
			control,
			ownerId: "host:batch-retry",
			now: () => "2026-08-15T23:00:00.000Z",
			executeStoredRunStep: async ({ record }) => {
				const request = createExecutionRequestFromRecord(record);
				if (request.input === "fail once") throw new Error("planned source failure");
				return {
					output: { summary: "completed", artifacts: [], structuredData: {}, notes: [] },
				};
			},
		});
		const sourceIds = ["resp_retry_completed", "resp_retry_failed", "resp_retry_cancelled"];
		const responsesService = createExecutionResponsesService({
			control,
			executionHost: host,
			drainAfterCreate: false,
			generateResponseId: () => sourceIds.shift() ?? "resp_retry_unexpected",
			now: () => new Date("2026-08-15T23:00:00.000Z"),
			refreshArchiveIndex: false,
		});
		const service = createResponseBatchService({
			responsesService,
			generateBatchId: () => "batch_retry_source",
			now: () => new Date("2026-08-15T23:01:00.000Z"),
			refreshArchiveIndex: false,
		});
		await service.createBatch({
			metadata: { campaign: "durable retry" },
			limits: { maxConcurrentRuns: 2, maxBrowserInteractionsPerMinute: 7 },
			requests: [
				{ model: "agent:researcher", input: "complete", instructions: "keep this" },
				{
					model: "agent:researcher",
					input: "fail once",
					instructions: "clone every field",
					tools: [{ type: "computer" }],
					attachments: [
						{ id: "att_retry_1", fileName: "evidence.txt", mimeType: "text/plain" },
					],
					metadata: { sourceMarker: "preserved" },
					auracall: {
						agent: "researcher",
						team: "ops",
						service: "chatgpt",
						runtimeProfile: "default",
					},
				},
				{ model: "agent:researcher", input: "cancel this" },
			],
		});
		await host.drainRun("resp_retry_completed");
		await host.drainRun("resp_retry_failed");
		await responsesService.cancelResponse?.("resp_retry_cancelled", "retry test cancellation");

		const retryBatch = service.retryBatch;
		if (!retryBatch) throw new Error("expected response batch retry");
		const first = await retryBatch("batch_retry_source", {
			idempotencyKey: "operator-attempt-1",
			note: "retry terminal failures",
		});
		expect(first).toMatchObject({
			object: "response_batch_retry",
			accepted: true,
			reused: false,
			fullyMaterialized: true,
			counts: { selected: 2, created: 2, reused: 0, errors: 0 },
			batch: {
				retry: { sourceBatchId: "batch_retry_source", note: "retry terminal failures" },
				limits: { maxConcurrentRuns: 2, maxBrowserInteractionsPerMinute: 7 },
				jobs: [
					{ retryOf: { responseId: "resp_retry_failed" } },
					{ retryOf: { responseId: "resp_retry_cancelled" } },
				],
			},
		});
		const retriedFailedId = first?.jobs[0]?.responseId;
		expect(retriedFailedId).toBeTruthy();
		expect(retriedFailedId).not.toBe("resp_retry_failed");
		const retriedRecord = await control.readRun(retriedFailedId ?? "");
		if (!retriedRecord) throw new Error("expected retried response record");
		const cloned = createExecutionRequestFromRecord(retriedRecord);
		expect(cloned).toMatchObject({
			model: "agent:researcher",
			input: "fail once",
			instructions: "clone every field",
			tools: [{ type: "computer" }],
			attachments: [{ id: "att_retry_1", fileName: "evidence.txt", mimeType: "text/plain" }],
			auracall: { agent: "researcher", team: "ops", service: "chatgpt" },
			metadata: {
				sourceMarker: "preserved",
				batchId: first?.id,
				auracallRetry: {
					sourceBatchId: "batch_retry_source",
					sourceResponseId: "resp_retry_failed",
					retryBatchId: first?.id,
				},
			},
		});
		await expect(responsesService.readResponse("resp_retry_failed")).resolves.toMatchObject({
			status: "failed",
		});
		await expect(responsesService.readResponse("resp_retry_cancelled")).resolves.toMatchObject({
			status: "cancelled",
		});

		await expect(
			retryBatch("batch_retry_source", { idempotencyKey: "operator-attempt-1" }),
		).resolves.toMatchObject({
			id: first?.id,
			accepted: true,
			reused: true,
			counts: { selected: 2, created: 0, reused: 2, errors: 0 },
		});
		await expect(
			retryBatch("batch_retry_source", {
				idempotencyKey: "operator-attempt-1",
				responseIds: ["resp_retry_failed"],
			}),
		).resolves.toMatchObject({
			accepted: false,
			error: { code: "idempotency_conflict" },
		});
		await expect(
			retryBatch("batch_retry_source", {
				idempotencyKey: "operator-attempt-2",
				responseIds: ["resp_retry_completed"],
			}),
		).resolves.toMatchObject({
			accepted: false,
			error: { code: "invalid_selection" },
		});
		expect((await listResponseBatchRecords()).map((record) => record.id)).toHaveLength(2);
	});

	it("resumes a partially materialized retry without duplicating successful children", async () => {
		const source: ResponseBatchRecord = {
			id: "batch_partial_source",
			object: "response_batch",
			createdAt: "2026-08-15T23:10:00.000Z",
			updatedAt: "2026-08-15T23:10:00.000Z",
			metadata: {},
			limits: { maxConcurrentRuns: null, maxBrowserInteractionsPerMinute: null },
			jobs: ["resp_partial_a", "resp_partial_b"].map((responseId, index) => ({
				index,
				responseId,
				model: "agent:researcher",
				agent: "researcher",
				team: null,
				service: "chatgpt",
				runtimeProfile: "default",
				createdAt: "2026-08-15T23:10:00.000Z",
			})),
		};
		const records = new Map([[source.id, source]]);
		const targetResponses = new Map<string, ExecutionResponse>();
		let failSecondOnce = true;
		const retryResponse = vi.fn(async (input: { sourceResponseId: string; responseId: string }) => {
			const existing = targetResponses.get(input.responseId);
			if (existing) return { response: existing, reused: true };
			if (input.sourceResponseId === "resp_partial_b" && failSecondOnce) {
				failSecondOnce = false;
				throw new Error("simulated crash between child creations");
			}
			const response = createResponse(input.responseId, "in_progress");
			targetResponses.set(input.responseId, response);
			return { response, reused: false };
		});
		const service = createResponseBatchService({
			refreshArchiveIndex: false,
			now: () => new Date("2026-08-15T23:11:00.000Z"),
			store: {
				readBatch: vi.fn(async (id) => records.get(id) ?? null),
				writeBatch: vi.fn(async (record) => {
					records.set(record.id, record);
					return record;
				}),
				createBatch: vi.fn(async (record) => {
					const existing = records.get(record.id);
					if (existing) return { record: existing, created: false };
					records.set(record.id, record);
					return { record, created: true };
				}),
			},
			responsesService: {
				createResponse: vi.fn(),
				readResponse: vi.fn(async (id) =>
					targetResponses.get(id) ??
					(id === "resp_partial_a" || id === "resp_partial_b" ? createResponse(id, "failed") : null),
				),
				retryResponse,
			},
		});
		const retryBatch = service.retryBatch;
		if (!retryBatch) throw new Error("expected response batch retry");

		await expect(
			retryBatch(source.id, { idempotencyKey: "partial-attempt" }),
		).resolves.toMatchObject({
			accepted: true,
			reused: false,
			fullyMaterialized: false,
			counts: { selected: 2, created: 1, reused: 0, errors: 1 },
		});
		await expect(
			retryBatch(source.id, { idempotencyKey: "partial-attempt" }),
		).resolves.toMatchObject({
			accepted: true,
			reused: true,
			fullyMaterialized: true,
			counts: { selected: 2, created: 1, reused: 1, errors: 0 },
		});
		expect(targetResponses).toHaveLength(2);
		expect(retryResponse).toHaveBeenCalledTimes(4);
	});

	it("atomically preserves the first retry batch record under concurrent creation", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-response-batch-atomic-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);
		const store = createResponseBatchStore();
		if (!store.createBatch) throw new Error("expected atomic response batch creation");
		const base: ResponseBatchRecord = {
			id: "batch_atomic_retry",
			object: "response_batch",
			createdAt: "2026-08-15T23:20:00.000Z",
			updatedAt: "2026-08-15T23:20:00.000Z",
			metadata: {},
			limits: { maxConcurrentRuns: null, maxBrowserInteractionsPerMinute: null },
			jobs: [],
		};
		const [left, right] = await Promise.all([
			store.createBatch({ ...base, metadata: { writer: "left" } }),
			store.createBatch({ ...base, metadata: { writer: "right" } }),
		]);
		expect([left.created, right.created].sort()).toEqual([false, true]);
		expect(left.record.metadata).toEqual(right.record.metadata);
		expect(await store.readBatch(base.id)).toMatchObject({ metadata: left.record.metadata });
	});

	it("surfaces child runtime diagnostics and keeps status readable after a child read failure", async () => {
		const stored = new Map<string, ResponseBatchRecord>();
		stored.set("batch_diagnostics_1", {
			id: "batch_diagnostics_1",
			object: "response_batch",
			createdAt: "2026-05-12T14:00:00.000Z",
			updatedAt: "2026-05-12T14:00:00.000Z",
			metadata: {},
			limits: {
				maxConcurrentRuns: 1,
				maxBrowserInteractionsPerMinute: 8,
			},
			dispatch: null,
			jobs: [
				{
					index: 0,
					responseId: "resp_diag_1",
					model: "agent:pro-extended-chatgpt-soylei",
					agent: "pro-extended-chatgpt-soylei",
					service: "chatgpt",
					runtimeProfile: "wsl-chrome-3",
					createdAt: "2026-05-12T14:00:00.000Z",
				},
				{
					index: 1,
					responseId: "resp_read_error_1",
					model: "agent:pro-extended-chatgpt-soylei",
					agent: "pro-extended-chatgpt-soylei",
					service: "chatgpt",
					runtimeProfile: "wsl-chrome-3",
					createdAt: "2026-05-12T14:00:00.000Z",
				},
			],
		});
		const diagnosticResponse: ExecutionResponse = {
			...createResponse("resp_diag_1", "in_progress"),
			metadata: {
				runId: "resp_diag_1",
				executionSummary: {
					completedAt: null,
					failureSummary: null,
					runtimeDiagnosticsSummary: {
						runtimeState: "recovering",
						leaseState: "released",
						browserTaskState: "thinking",
						lastLeaseEvent: {
							type: "lease-released",
							createdAt: "2026-05-12T14:01:00.000Z",
							leaseId: "resp_diag_1:lease:runner",
							ownerId: "runner:chatgpt",
							note: "lease released: cancelled",
							releaseReason: "cancelled",
						},
						lastProviderEvidence: {
							observedAt: "2026-05-12T14:00:45.000Z",
							state: "thinking",
							source: "browser-service",
							evidenceRef: "chatgpt-passive-dom-thinking",
							confidence: "medium",
							details: {
								service: "chatgpt",
								runtimeProfileId: "wsl-chrome-3",
								browserProfileId: "wsl-chrome-3",
							},
						},
						terminalTransitionSource: null,
					},
				},
			},
		};
		const service = createResponseBatchService({
			store: {
				readBatch: vi.fn(async (id) => stored.get(id) ?? null),
				writeBatch: vi.fn(async (record) => record),
			},
			responsesService: {
				createResponse: vi.fn(),
				readResponse: vi.fn(async (id) => {
					if (id === "resp_read_error_1") {
						throw new SyntaxError(
							"Expected double-quoted property name in JSON at position 1048544",
						);
					}
					return id === "resp_diag_1" ? diagnosticResponse : null;
				}),
			},
		});

		await expect(service.readBatchStatus("batch_diagnostics_1")).resolves.toMatchObject({
			id: "batch_diagnostics_1",
			status: "running",
			counts: {
				total: 2,
				in_progress: 1,
				missing: 1,
			},
			jobs: [
				{
					responseId: "resp_diag_1",
					status: "in_progress",
					runtimeState: "recovering",
					diagnostics: {
						runtimeState: "recovering",
						leaseState: "released",
						browserTaskState: "thinking",
						lastLeaseEvent: {
							releaseReason: "cancelled",
						},
					},
				},
				{
					responseId: "resp_read_error_1",
					status: "missing",
					failure: {
						code: "response_read_failed",
						message: "Expected double-quoted property name in JSON at position 1048544",
					},
				},
			],
		});
	});

	it("surfaces finalizing runtime state for response-complete browser jobs that have not terminalized yet", async () => {
		const stored = new Map<string, ResponseBatchRecord>();
		stored.set("batch_finalizing_1", {
			id: "batch_finalizing_1",
			object: "response_batch",
			createdAt: "2026-05-12T14:00:00.000Z",
			updatedAt: "2026-05-12T14:00:00.000Z",
			metadata: {},
			limits: {
				maxConcurrentRuns: 1,
				maxBrowserInteractionsPerMinute: 4,
			},
			dispatch: null,
			jobs: [
				{
					index: 0,
					responseId: "resp_finalizing_1",
					model: "agent:pro-extended-chatgpt-soylei",
					agent: "pro-extended-chatgpt-soylei",
					service: "chatgpt",
					runtimeProfile: "wsl-chrome-3",
					createdAt: "2026-05-12T14:00:00.000Z",
				},
			],
		});
		const finalizingResponse: ExecutionResponse = {
			...createResponse("resp_finalizing_1", "in_progress"),
			metadata: {
				runId: "resp_finalizing_1",
				executionSummary: {
					completedAt: null,
					failureSummary: null,
					runtimeDiagnosticsSummary: {
						runtimeState: "finalizing",
						leaseState: "expired",
						browserTaskState: "response-complete",
						lastLeaseEvent: {
							type: "lease-released",
							createdAt: "2026-05-12T14:06:00.000Z",
							leaseId: "resp_finalizing_1:lease:runner",
							ownerId: "runner:chatgpt",
							note: "lease expired",
							releaseReason: "lease expired",
						},
						lastProviderEvidence: {
							observedAt: "2026-05-12T14:05:45.000Z",
							state: "response-complete",
							source: "browser-service",
							evidenceRef: "chatgpt-response-finished",
							confidence: "high",
							details: {
								service: "chatgpt",
								runtimeProfileId: "wsl-chrome-3",
								browserProfileId: "wsl-chrome-3",
							},
						},
						terminalTransitionSource: null,
					},
				},
			},
		};
		const service = createResponseBatchService({
			store: {
				readBatch: vi.fn(async (id) => stored.get(id) ?? null),
				writeBatch: vi.fn(async (record) => record),
			},
			responsesService: {
				createResponse: vi.fn(),
				readResponse: vi.fn(async (id) => (id === "resp_finalizing_1" ? finalizingResponse : null)),
			},
		});

		await expect(service.readBatchStatus("batch_finalizing_1")).resolves.toMatchObject({
			id: "batch_finalizing_1",
			status: "running",
			counts: {
				total: 1,
				in_progress: 1,
			},
			jobs: [
				{
					responseId: "resp_finalizing_1",
					status: "in_progress",
					runtimeState: "finalizing",
					diagnostics: {
						runtimeState: "finalizing",
						leaseState: "expired",
						browserTaskState: "response-complete",
						lastProviderEvidence: {
							state: "response-complete",
							evidenceRef: "chatgpt-response-finished",
						},
					},
				},
			],
		});
	});

	it("records dispatch-pool assignment metadata on child response runs", async () => {
		const createdRequests: ExecutionRequest[] = [];
		const responses = new Map<string, ExecutionResponse>();
		const stored = new Map<string, ResponseBatchRecord>();
		const service = createResponseBatchService({
			now: () => new Date("2026-05-12T14:00:00.000Z"),
			generateBatchId: () => "batch_pool_1",
			store: {
				readBatch: vi.fn(async (id) => stored.get(id) ?? null),
				writeBatch: vi.fn(async (record) => {
					stored.set(record.id, record);
					return record;
				}),
			},
			resolveDispatchPool: vi.fn(async ({ requests }: { requests: ExecutionRequest[] }) => ({
				requests: requests.map((request: ExecutionRequest, index: number) => {
					const agentId = index === 0 ? "tenant-a" : "tenant-b";
					return {
						...request,
						model: `agent:${agentId}`,
						auracall: {
							...(request.auracall ?? {}),
							team: "chatgpt-pool",
							agent: agentId,
							service: "chatgpt",
							runtimeProfile: index === 0 ? "wsl-chrome-1" : "wsl-chrome-2",
						},
					};
				}),
				dispatch: {
					team: "chatgpt-pool",
					mode: "next_available" as const,
					projectSync: "none" as const,
					memberCount: 2,
					projectName: "Shared Project",
					warnings: ["projectSync=none"],
				},
				assignments: [
					{
						team: "chatgpt-pool",
						mode: "next_available" as const,
						memberAgent: "tenant-a",
						memberIndex: 0,
					},
					{
						team: "chatgpt-pool",
						mode: "next_available" as const,
						memberAgent: "tenant-b",
						memberIndex: 1,
					},
				],
			})),
			responsesService: {
				createResponse: vi.fn(async (request) => {
					const id = `resp_pool_${createdRequests.length + 1}`;
					createdRequests.push(request);
					const response = createResponse(id, "in_progress");
					responses.set(id, response);
					return response;
				}),
				readResponse: vi.fn(async (id) => responses.get(id) ?? null),
			},
		});

		const status = await service.createBatch({
			team: "chatgpt-pool",
			requests: [
				{ model: "gpt-5.1", input: "Grade student 1." },
				{ model: "gpt-5.1", input: "Grade student 2." },
			],
		});

		expect(createdRequests.map((request) => request.metadata)).toEqual([
			{
				batchId: "batch_pool_1",
				batchIndex: 0,
				batchLimits: {
					maxConcurrentRuns: null,
					maxBrowserInteractionsPerMinute: null,
				},
				batchDispatch: {
					team: "chatgpt-pool",
					mode: "next_available",
					projectSync: "none",
					memberAgent: "tenant-a",
					memberIndex: 0,
				},
			},
			{
				batchId: "batch_pool_1",
				batchIndex: 1,
				batchLimits: {
					maxConcurrentRuns: null,
					maxBrowserInteractionsPerMinute: null,
				},
				batchDispatch: {
					team: "chatgpt-pool",
					mode: "next_available",
					projectSync: "none",
					memberAgent: "tenant-b",
					memberIndex: 1,
				},
			},
		]);
		expect(status).toMatchObject({
			id: "batch_pool_1",
			dispatch: {
				team: "chatgpt-pool",
				mode: "next_available",
				projectSync: "none",
				memberCount: 2,
				warnings: ["projectSync=none"],
			},
			jobs: [
				{
					model: "agent:tenant-a",
					agent: "tenant-a",
					service: "chatgpt",
					runtimeProfile: "wsl-chrome-1",
					dispatch: { memberAgent: "tenant-a", memberIndex: 0 },
				},
				{
					model: "agent:tenant-b",
					agent: "tenant-b",
					service: "chatgpt",
					runtimeProfile: "wsl-chrome-2",
					dispatch: { memberAgent: "tenant-b", memberIndex: 1 },
				},
			],
		});
	});

	it("dispatches pool jobs using active runtime evidence before team order", async () => {
		const homeDir = await fs.mkdtemp(
			path.join(os.tmpdir(), "auracall-runtime-response-batch-pool-"),
		);
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const control = createExecutionRuntimeControl();
		const responsesService = createExecutionResponsesService({
			control,
			drainAfterCreate: false,
			generateResponseId: () => "resp_busy_tenant_a",
			now: () => new Date("2026-05-12T15:00:00.000Z"),
		});
		await responsesService.createResponse({
			model: "agent:tenant-a",
			input: "Existing active job.",
			auracall: { agent: "tenant-a", service: "chatgpt", runtimeProfile: "wsl-chrome-1" },
		});
		await control.acquireLease({
			runId: "resp_busy_tenant_a",
			leaseId: "resp_busy_tenant_a:lease:test",
			ownerId: "runner:test",
			acquiredAt: "2026-05-12T15:00:05.000Z",
			heartbeatAt: "2026-05-12T15:00:05.000Z",
			expiresAt: "2026-05-12T15:01:05.000Z",
		});

		const catalog = createEffectiveAgentCatalog({
			config: {
				browserProfiles: {
					"browser-a": {},
					"browser-b": {},
				},
				runtimeProfiles: {
					"wsl-chrome-1": { browserProfile: "browser-a", defaultService: "chatgpt" },
					"wsl-chrome-2": { browserProfile: "browser-b", defaultService: "chatgpt" },
				},
				agents: {
					"tenant-a": {
						runtimeProfile: "wsl-chrome-1",
						service: "chatgpt",
						modelSelector: "chatgpt:pro-extended",
					},
					"tenant-b": {
						runtimeProfile: "wsl-chrome-2",
						service: "chatgpt",
						modelSelector: "chatgpt:pro-extended",
					},
				},
				teams: {
					"chatgpt-pool": {
						type: "dispatch-pool",
						agents: ["tenant-a", "tenant-b"],
						project: { name: "Shared Project", sync: "none" },
					},
				},
			},
		});

		const resolution = await resolveResponseBatchDispatchPool({
			dispatch: { team: "chatgpt-pool", mode: "next_available", projectSync: "none" },
			catalog,
			control,
			requests: [
				{ model: "gpt-5.1", input: "New job 1." },
				{ model: "gpt-5.1", input: "New job 2." },
			],
		});

		expect(resolution.assignments.map((assignment) => assignment.memberAgent)).toEqual([
			"tenant-b",
			"tenant-a",
		]);
		expect(resolution.requests.map((request) => request.auracall?.runtimeProfile)).toEqual([
			"wsl-chrome-2",
			"wsl-chrome-1",
		]);
		expect(resolution.dispatch.warnings).toContain(
			'Dispatch-pool team "chatgpt-pool" is project-bound to "Shared Project" with projectSync=none; AuraCall does not reconcile project instructions, files, or settings between tenants.',
		);
	});

	it("builds an execution gate from persisted batch limits", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-runtime-response-batch-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const control = createExecutionRuntimeControl();
		const responsesService = createExecutionResponsesService({
			control,
			drainAfterCreate: false,
			generateResponseId: (() => {
				const ids = [
					"resp_batch_gate_1",
					"resp_batch_gate_2",
					"resp_batch_gate_3",
					"resp_batch_gate_4",
					"resp_batch_gate_5",
					"resp_batch_gate_6",
				];
				return () => ids.shift() ?? "resp_batch_gate_extra";
			})(),
			now: () => new Date("2026-05-12T15:00:00.000Z"),
		});
		const service = createResponseBatchService({
			responsesService,
			generateBatchId: (() => {
				const ids = ["batch_concurrency_gate", "batch_rate_gate", "batch_recovery_rate_gate"];
				return () => ids.shift() ?? "batch_extra";
			})(),
			now: () => new Date("2026-05-12T15:00:00.000Z"),
		});

		await service.createBatch({
			limits: { maxConcurrentRuns: 1 },
			requests: [
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 1." },
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 2." },
			],
		});
		await control.acquireLease({
			runId: "resp_batch_gate_1",
			leaseId: "resp_batch_gate_1:lease:test",
			ownerId: "runner:test",
			acquiredAt: "2026-05-12T15:00:05.000Z",
			heartbeatAt: "2026-05-12T15:00:05.000Z",
			expiresAt: "2026-05-12T15:01:05.000Z",
		});
		const activeFirstRecord = await control.readRun("resp_batch_gate_1");
		if (!activeFirstRecord) throw new Error("expected first concurrency batch run");
		await control.persistRun({
			runId: activeFirstRecord.runId,
			expectedRevision: activeFirstRecord.revision,
			bundle: {
				...activeFirstRecord.bundle,
				run: {
					...activeFirstRecord.bundle.run,
					status: "running",
				},
				steps: activeFirstRecord.bundle.steps.map((step) =>
					step.id === "resp_batch_gate_1:step:1"
						? { ...step, status: "running", startedAt: "2026-05-12T15:00:05.000Z" }
						: step,
				),
			},
		});
		const gate = createResponseBatchExecutionGate({
			control,
			now: () => new Date("2026-05-12T15:00:10.000Z"),
		});
		const secondConcurrencyRecord = await control.readRun("resp_batch_gate_2");
		if (!secondConcurrencyRecord) throw new Error("expected second concurrency batch run");
		await expect(gate(secondConcurrencyRecord)).resolves.toMatchObject({
			allowed: false,
			reason: expect.stringContaining("concurrency limit reached: 1/1"),
		});
		await control.expireLeases({
			runId: "resp_batch_gate_1",
			now: "2026-05-12T15:01:10.000Z",
		});
		const strandedFirstRecord = await control.readRun("resp_batch_gate_1");
		if (!strandedFirstRecord) throw new Error("expected stranded first concurrency batch run");
		expect(strandedFirstRecord.bundle.steps.some((step) => step.status === "running")).toBe(true);
		await expect(gate(secondConcurrencyRecord)).resolves.toEqual({ allowed: true });

		await service.createBatch({
			limits: { maxBrowserInteractionsPerMinute: 1 },
			requests: [
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 3." },
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 4." },
			],
		});
		const firstRateRecord = await control.readRun("resp_batch_gate_3");
		if (!firstRateRecord) throw new Error("expected first rate-limit batch run");
		await control.persistRun({
			runId: firstRateRecord.runId,
			expectedRevision: firstRateRecord.revision,
			bundle: {
				...firstRateRecord.bundle,
				events: [
					...firstRateRecord.bundle.events,
					createExecutionRunEvent({
						id: "resp_batch_gate_3:event:step-started",
						runId: firstRateRecord.runId,
						type: "step-started",
						createdAt: "2026-05-12T15:00:05.000Z",
						stepId: "resp_batch_gate_3:step:1",
					}),
				],
			},
		});
		const secondRateRecord = await control.readRun("resp_batch_gate_4");
		if (!secondRateRecord) throw new Error("expected second rate-limit batch run");
		await expect(gate(secondRateRecord)).resolves.toMatchObject({
			allowed: false,
			reason: expect.stringContaining("browser interaction rate limit reached: 1/1 per minute"),
		});

		await service.createBatch({
			limits: { maxBrowserInteractionsPerMinute: 2 },
			requests: [
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 5." },
				{ model: "agent:pro-extended-chatgpt-soylei", input: "Grade student 6." },
			],
		});
		const recoveredRateRecord = await control.readRun("resp_batch_gate_5");
		if (!recoveredRateRecord) throw new Error("expected recovered rate-limit batch run");
		await control.persistRun({
			runId: recoveredRateRecord.runId,
			expectedRevision: recoveredRateRecord.revision,
			bundle: {
				...recoveredRateRecord.bundle,
				events: [
					...recoveredRateRecord.bundle.events,
					createExecutionRunEvent({
						id: "resp_batch_gate_5:event:step-started:first",
						runId: recoveredRateRecord.runId,
						type: "step-started",
						createdAt: "2026-05-12T15:00:05.000Z",
						stepId: "resp_batch_gate_5:step:1",
					}),
					createExecutionRunEvent({
						id: "resp_batch_gate_5:event:step-started:recovered",
						runId: recoveredRateRecord.runId,
						type: "step-started",
						createdAt: "2026-05-12T15:00:06.000Z",
						stepId: "resp_batch_gate_5:step:1",
					}),
				],
			},
		});
		const secondRecoveredRateRecord = await control.readRun("resp_batch_gate_6");
		if (!secondRecoveredRateRecord)
			throw new Error("expected second recovered rate-limit batch run");
		await expect(gate(secondRecoveredRateRecord)).resolves.toEqual({ allowed: true });
	});
});
