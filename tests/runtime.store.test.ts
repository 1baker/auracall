import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setAuracallHomeDirOverrideForTest } from "../src/auracallHome.js";
import { createExecutionRunRecordBundleFromTeamRun } from "../src/runtime/model.js";
import {
	createExecutionRunRecordStore,
	ensureExecutionRunStorage,
	getExecutionRunBundlePath,
	getExecutionRunRecordPath,
	getExecutionRunsDir,
	listExecutionRunRecordBundles,
	mapWithConcurrencyForTest,
	readExecutionRunRecordBundle,
	readExecutionRunStoredRecord,
	writeExecutionRunRecordBundle,
	writeExecutionRunStoredRecord,
} from "../src/runtime/store.js";
import { createTeamRunBundle } from "../src/teams/model.js";

describe("runtime execution store", () => {
	const cleanup: string[] = [];

	afterEach(async () => {
		vi.restoreAllMocks();
		setAuracallHomeDirOverrideForTest(null);
		await Promise.all(
			cleanup.splice(0).map((entry) => fs.rm(entry, { recursive: true, force: true })),
		);
	});

	it("bounds concurrent runtime-record reads while preserving result order", async () => {
		let inFlight = 0;
		let maxInFlight = 0;
		const values = Array.from({ length: 24 }, (_, index) => index);

		const results = await mapWithConcurrencyForTest(values, 4, async (value) => {
			inFlight += 1;
			maxInFlight = Math.max(maxInFlight, inFlight);
			await new Promise((resolve) => setTimeout(resolve, value % 3));
			inFlight -= 1;
			return value * 2;
		});

		expect(results).toEqual(values.map((value) => value * 2));
		expect(maxInFlight).toBeLessThanOrEqual(4);
	});

	it("persists and reloads execution run bundles under the AuraCall home dir", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-runtime-store-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		await ensureExecutionRunStorage();
		expect(getExecutionRunsDir()).toBe(path.join(homeDir, "runtime", "runs"));

		const bundle = createExecutionRunRecordBundleFromTeamRun(
			createTeamRunBundle({
				runId: "team_run_1",
				teamId: "ops",
				createdAt: "2026-04-07T00:00:00.000Z",
				trigger: "service",
				steps: [
					{
						id: "team_run_1:step:1",
						agentId: "analyst",
						runtimeProfileId: "default",
						browserProfileId: "default",
						service: "gemini",
						kind: "analysis",
						status: "ready",
						order: 1,
						input: {
							prompt: "Investigate the regression.",
							handoffIds: [],
							artifacts: [],
							structuredData: {},
							notes: [],
						},
					},
				],
			}),
		);

		const bundlePath = await writeExecutionRunRecordBundle(bundle);
		expect(bundlePath).toBe(getExecutionRunBundlePath("team_run_1"));

		const loaded = await readExecutionRunRecordBundle("team_run_1");
		expect(loaded).not.toBeNull();
		expect(loaded?.run.id).toBe("team_run_1");
		expect(loaded?.steps).toHaveLength(1);

		const stored = await readExecutionRunStoredRecord("team_run_1");
		expect(stored?.runId).toBe("team_run_1");
		expect(stored?.revision).toBe(1);
		expect(stored?.bundle.run.id).toBe("team_run_1");
		expect(getExecutionRunRecordPath("team_run_1")).toContain("record.json");
	});

	it("retries a transient partial JSON runtime record read", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-runtime-store-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const bundle = createExecutionRunRecordBundleFromTeamRun(
			createTeamRunBundle({
				runId: "team_run_partial_read",
				teamId: "ops",
				createdAt: "2026-04-07T00:00:00.000Z",
				trigger: "service",
				steps: [
					{
						id: "team_run_partial_read:step:1",
						agentId: "analyst",
						runtimeProfileId: "default",
						browserProfileId: "default",
						service: "chatgpt",
						kind: "analysis",
						status: "ready",
						order: 1,
						input: {
							prompt: "Retry partial record.",
							handoffIds: [],
							artifacts: [],
							structuredData: {},
							notes: [],
						},
					},
				],
			}),
		);

		await writeExecutionRunStoredRecord(bundle);
		const recordPath = getExecutionRunRecordPath("team_run_partial_read");
		const validRecord = await fs.readFile(recordPath, "utf8");
		await fs.writeFile(recordPath, "{", "utf8");
		const repair = new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				fs.writeFile(recordPath, validRecord, "utf8").then(resolve, reject);
			}, 5);
		});

		const recovered = await readExecutionRunStoredRecord("team_run_partial_read");
		await repair;

		expect(recovered?.runId).toBe("team_run_partial_read");
		expect(recovered?.revision).toBe(1);
	});

	it("lists persisted bundles in reverse chronological order with filters", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-runtime-store-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const directStore = createExecutionRunRecordStore();
		await directStore.ensureStorage();

		const older = createExecutionRunRecordBundleFromTeamRun(
			createTeamRunBundle({
				runId: "team_run_older",
				teamId: "ops",
				createdAt: "2026-04-07T00:00:00.000Z",
				trigger: "service",
				steps: [
					{
						id: "team_run_older:step:1",
						agentId: "analyst",
						runtimeProfileId: "default",
						browserProfileId: "default",
						service: "chatgpt",
						kind: "analysis",
						status: "ready",
						order: 1,
						input: {
							prompt: "Older bundle",
							handoffIds: [],
							artifacts: [],
							structuredData: {},
							notes: [],
						},
					},
				],
			}),
		);

		const newerBase = createExecutionRunRecordBundleFromTeamRun(
			createTeamRunBundle({
				runId: "team_run_newer",
				teamId: "ops",
				createdAt: "2026-04-07T01:00:00.000Z",
				trigger: "service",
				steps: [
					{
						id: "team_run_newer:step:1",
						agentId: "reviewer",
						runtimeProfileId: "default",
						browserProfileId: "default",
						service: "gemini",
						kind: "review",
						status: "ready",
						order: 1,
						input: {
							prompt: "Newer bundle",
							handoffIds: [],
							artifacts: [],
							structuredData: {},
							notes: [],
						},
					},
				],
			}),
		);

		const newer = {
			...newerBase,
			run: {
				...newerBase.run,
				status: "running" as const,
			},
		};

		await directStore.writeBundle(older);
		await directStore.writeBundle(newer);

		const listed = await listExecutionRunRecordBundles();
		expect(listed.map((entry) => entry.run.id)).toEqual(["team_run_newer", "team_run_older"]);

		const filtered = await listExecutionRunRecordBundles({ status: "running", limit: 1 });
		expect(filtered.map((entry) => entry.run.id)).toEqual(["team_run_newer"]);

		const readFile = vi.spyOn(fs, "readFile");
		const cached = await directStore.listRecords();
		expect(cached.map((entry) => entry.runId)).toEqual(["team_run_newer", "team_run_older"]);
		expect(readFile).not.toHaveBeenCalled();

		await writeExecutionRunStoredRecord({
			...newer,
			run: {
				...newer.run,
				status: "succeeded",
				updatedAt: "2026-04-07T02:00:00.000Z",
			},
		});
		readFile.mockClear();
		const refreshed = await directStore.listRecords({ status: "succeeded" });
		expect(refreshed.map((entry) => entry.runId)).toEqual(["team_run_newer"]);
		expect(readFile).toHaveBeenCalledTimes(1);
	});

	it("supports compare-and-swap style record writes through revision checks", async () => {
		const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-runtime-store-"));
		cleanup.push(homeDir);
		setAuracallHomeDirOverrideForTest(homeDir);

		const base = createExecutionRunRecordBundleFromTeamRun(
			createTeamRunBundle({
				runId: "team_run_cas",
				teamId: "ops",
				createdAt: "2026-04-07T00:00:00.000Z",
				trigger: "service",
				steps: [
					{
						id: "team_run_cas:step:1",
						agentId: "analyst",
						runtimeProfileId: "default",
						browserProfileId: "default",
						service: "chatgpt",
						kind: "analysis",
						status: "ready",
						order: 1,
						input: {
							prompt: "CAS bundle",
							handoffIds: [],
							artifacts: [],
							structuredData: {},
							notes: [],
						},
					},
				],
			}),
		);

		const firstWrite = await writeExecutionRunStoredRecord(base);
		expect(firstWrite.revision).toBe(1);

		const nextBundle = {
			...base,
			run: {
				...base.run,
				status: "running" as const,
				updatedAt: "2026-04-07T00:01:00.000Z",
			},
		};

		const secondWrite = await writeExecutionRunStoredRecord(nextBundle, { expectedRevision: 1 });
		expect(secondWrite.revision).toBe(2);
		expect(secondWrite.bundle.run.status).toBe("running");

		await expect(
			writeExecutionRunStoredRecord(nextBundle, { expectedRevision: 1 }),
		).rejects.toThrow(/revision mismatch/);
	});
});
