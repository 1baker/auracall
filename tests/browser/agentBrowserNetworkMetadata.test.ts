import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
	type CapturedProcessRunner,
	reduceAgentBrowserNetworkDetail,
	runAgentBrowserNetworkMetadata,
} from "../../src/browser/diagnostics/agentBrowserNetworkMetadata.js";

const expectNoSentinels = (value: unknown, sentinels: string[]): void => {
	const publicText = JSON.stringify(value);
	for (const sentinel of sentinels) {
		expect(publicText).not.toContain(sentinel);
	}
};

const withFakeAgentBrowser = async <T>(
	source: string,
	callback: (executable: string) => Promise<T>,
): Promise<T> => {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-agent-browser-metadata-"));
	const executable = path.join(directory, "agent-browser-fixture");
	try {
		await fs.writeFile(executable, `#!/usr/bin/env node\n${source}\n`, { mode: 0o700 });
		return await callback(executable);
	} finally {
		await fs.rm(directory, { recursive: true, force: true });
	}
};

afterEach(() => {
	vi.useRealTimers();
});

describe("agent-browser network metadata reduction", () => {
	test("does not expose secret-bearing direct request detail fields", () => {
		const sentinels = {
			authorization: "SYNTHETIC_AUTHORIZATION_SENTINEL_0229",
			cookie: "SYNTHETIC_COOKIE_SENTINEL_0229",
			identity: "SYNTHETIC_IDENTITY_SENTINEL_0229",
			query: "SYNTHETIC_QUERY_SENTINEL_0229",
			body: "SYNTHETIC_BODY_SENTINEL_0229",
		};
		const requestId = "synthetic-request-0229";
		const expectedUrl = `https://chatgpt.example.test/backend-api/conversation/synthetic?token=${sentinels.query}`;
		const responseBody = JSON.stringify({
			mapping: { first: {}, second: {} },
			message: sentinels.body,
		});
		const rawOutput = JSON.stringify({
			id: "agent-browser-command-0229",
			success: true,
			data: {
				requestId,
				url: expectedUrl,
				method: "GET",
				status: 200,
				headers: {
					authorization: sentinels.authorization,
					cookie: sentinels.cookie,
				},
				responseHeaders: {
					"set-cookie": sentinels.cookie,
				},
				identity: sentinels.identity,
				responseBody,
			},
		});

		const result = reduceAgentBrowserNetworkDetail(rawOutput, {
			expectedRequestId: requestId,
			expectedUrl,
			elapsedMs: 321,
		});

		expect(result).toEqual({
			outcome: "completed",
			candidateCount: null,
			requestIdMatches: true,
			expectedUrlMatches: true,
			status: 200,
			elapsedMs: 321,
			body: {
				retrieval: "present",
				characterLength: responseBody.length,
				parseState: "json",
				mappingCount: 2,
			},
		});
		expectNoSentinels(result, Object.values(sentinels));
	});

	test("normalizes malformed and command-failure envelopes without echoing them", () => {
		const secret = "SYNTHETIC_ENVELOPE_ERROR_SENTINEL_0229";
		const options = {
			expectedRequestId: "request-1",
			expectedUrl: "https://example.test/expected",
			elapsedMs: 12,
		};

		const malformed = reduceAgentBrowserNetworkDetail(`not-json-${secret}`, options);
		const failed = reduceAgentBrowserNetworkDetail(
			JSON.stringify({
				success: false,
				error: secret,
				data: { stderr: secret },
			}),
			options,
		);

		expect(malformed.outcome).toBe("invalid_json");
		expect(failed.outcome).toBe("command_failed");
		expectNoSentinels([malformed, failed], [secret]);
	});

	test("reports non-JSON and base64-summary bodies without returning content", () => {
		const bodySecret = "SYNTHETIC_NON_JSON_BODY_SENTINEL_0229";
		const common = {
			requestId: "request-1",
			url: "https://example.test/expected",
			status: 200,
		};
		const nonJson = reduceAgentBrowserNetworkDetail(
			JSON.stringify({
				success: true,
				data: { ...common, responseBody: bodySecret },
			}),
			{
				expectedRequestId: common.requestId,
				expectedUrl: common.url,
				elapsedMs: 8,
			},
		);
		const base64 = reduceAgentBrowserNetworkDetail(
			JSON.stringify({
				success: true,
				data: { ...common, responseBody: "[base64, 4321 chars]" },
			}),
			{
				expectedRequestId: common.requestId,
				expectedUrl: common.url,
				elapsedMs: 9,
			},
		);

		expect(nonJson.body).toEqual({
			retrieval: "present",
			characterLength: bodySecret.length,
			parseState: "not_json",
			mappingCount: null,
		});
		expect(base64.body).toEqual({
			retrieval: "base64_summary",
			characterLength: 4321,
			parseState: "not_available",
			mappingCount: null,
		});
		expectNoSentinels([nonJson, base64], [bodySecret]);
	});

	test("runs the exact direct-detail command and ignores secret-bearing stderr", async () => {
		const stderrSecret = "SYNTHETIC_STDERR_SENTINEL_0229";
		const runner = vi.fn<CapturedProcessRunner>(async () => ({
			stdout: JSON.stringify({
				success: true,
				data: {
					requestId: "request-1",
					url: "https://example.test/expected",
					status: 204,
				},
			}),
			stderr: stderrSecret,
		}));

		const result = await runAgentBrowserNetworkMetadata(
			{
				session: "synthetic-session",
				cdpPort: 45044,
				requestId: "request-1",
				expectedUrl: "https://example.test/expected",
				timeoutMs: 50,
				maxOutputBytes: 4096,
			},
			{ processRunner: runner, now: () => 100 },
		);

		expect(runner).toHaveBeenCalledWith(
			"agent-browser",
			[
				"--session",
				"synthetic-session",
				"--cdp",
				"45044",
				"--json",
				"network",
				"request",
				"request-1",
			],
			expect.objectContaining({ timeoutMs: 50, maxOutputBytes: 4096 }),
		);
		expect(result).toMatchObject({
			outcome: "completed",
			requestIdMatches: true,
			expectedUrlMatches: true,
			status: 204,
			body: { retrieval: "absent" },
		});
		expectNoSentinels(result, [stderrSecret]);
	});

	test("discovers one exact 2xx request internally before reading detail", async () => {
		const sentinels = [
			"SYNTHETIC_DISCOVERY_HEADER_SENTINEL_0229",
			"SYNTHETIC_DISCOVERY_QUERY_SENTINEL_0229",
			"SYNTHETIC_DISCOVERY_BODY_SENTINEL_0229",
		];
		const expectedUrl = "https://example.test/backend-api/conversation/exact";
		const runner = vi
			.fn<CapturedProcessRunner>()
			.mockResolvedValueOnce({
				stdout: JSON.stringify({
					success: true,
					data: {
						requests: [
							{
								requestId: "selected-request-id",
								url: expectedUrl,
								status: 200,
								headers: { authorization: sentinels[0] },
							},
							{
								requestId: "unrelated-request-id",
								url: `${expectedUrl}?token=${sentinels[1]}`,
								status: 200,
							},
						],
					},
				}),
				stderr: sentinels[0],
			})
			.mockResolvedValueOnce({
				stdout: JSON.stringify({
					success: true,
					data: {
						requestId: "selected-request-id",
						url: expectedUrl,
						status: 200,
						responseBody: JSON.stringify({
							mapping: { first: {}, second: {}, third: {} },
							content: sentinels[2],
						}),
					},
				}),
				stderr: sentinels[0],
			});

		const result = await runAgentBrowserNetworkMetadata(
			{
				session: "synthetic-session",
				cdpPort: 45044,
				expectedUrl,
				discoveryTimeoutMs: 25,
				timeoutMs: 50,
				maxOutputBytes: 4096,
			},
			{ processRunner: runner, now: () => 100 },
		);

		expect(runner).toHaveBeenNthCalledWith(
			1,
			"agent-browser",
			[
				"--session",
				"synthetic-session",
				"--cdp",
				"45044",
				"--json",
				"network",
				"requests",
				"--filter",
				expectedUrl,
			],
			expect.objectContaining({ timeoutMs: 25, maxOutputBytes: 4096 }),
		);
		expect(runner).toHaveBeenNthCalledWith(
			2,
			"agent-browser",
			[
				"--session",
				"synthetic-session",
				"--cdp",
				"45044",
				"--json",
				"network",
				"request",
				"selected-request-id",
			],
			expect.objectContaining({ timeoutMs: 50, maxOutputBytes: 4096 }),
		);
		expect(result).toMatchObject({
			outcome: "completed",
			candidateCount: 1,
			requestIdMatches: true,
			expectedUrlMatches: true,
			status: 200,
			body: { retrieval: "present", parseState: "json", mappingCount: 3 },
		});
		expect(JSON.stringify(result)).not.toContain("selected-request-id");
		expectNoSentinels(result, sentinels);
	});

	test("fails closed on zero or ambiguous exact request candidates", async () => {
		const expectedUrl = "https://example.test/backend-api/conversation/exact";
		const makeRunner =
			(requests: unknown[]): CapturedProcessRunner =>
			async () => ({
				stdout: JSON.stringify({ success: true, data: { requests } }),
				stderr: "SYNTHETIC_SELECTION_STDERR_SENTINEL_0229",
			});
		const baseOptions = {
			session: "synthetic-session",
			cdpPort: 45044,
			expectedUrl,
			discoveryTimeoutMs: 25,
			timeoutMs: 50,
		};
		const missing = await runAgentBrowserNetworkMetadata(baseOptions, {
			processRunner: makeRunner([]),
			now: () => 100,
		});
		const ambiguous = await runAgentBrowserNetworkMetadata(baseOptions, {
			processRunner: makeRunner([
				{ requestId: "secret-request-a", url: expectedUrl, status: 200 },
				{ requestId: "secret-request-b", url: expectedUrl, status: 204 },
			]),
			now: () => 100,
		});

		expect(missing).toMatchObject({ outcome: "request_not_found", candidateCount: 0 });
		expect(ambiguous).toMatchObject({ outcome: "ambiguous_request", candidateCount: 2 });
		expectNoSentinels(
			[missing, ambiguous],
			["SYNTHETIC_SELECTION_STDERR_SENTINEL_0229", "secret-request-a", "secret-request-b"],
		);
	});

	test("settles an unresponsive child at the independent outer deadline", async () => {
		vi.useFakeTimers();
		const runner: CapturedProcessRunner = async () => new Promise(() => undefined);
		const resultPromise = runAgentBrowserNetworkMetadata(
			{
				session: "synthetic-session",
				cdpPort: 45044,
				requestId: "request-1",
				expectedUrl: "https://example.test/expected",
				timeoutMs: 25,
			},
			{ processRunner: runner },
		);

		await vi.advanceTimersByTimeAsync(25);
		const result = await resultPromise;

		expect(result).toMatchObject({
			outcome: "timeout",
			elapsedMs: 25,
			requestIdMatches: null,
			expectedUrlMatches: null,
			body: { retrieval: "absent" },
		});
	});

	test("normalizes output-limit and child failures without captured output", async () => {
		const sentinels = [
			"SYNTHETIC_OVERSIZE_STDOUT_SENTINEL_0229",
			"SYNTHETIC_CHILD_STDERR_SENTINEL_0229",
			"SYNTHETIC_CHILD_MESSAGE_SENTINEL_0229",
		];
		const runWith = (runner: CapturedProcessRunner) =>
			runAgentBrowserNetworkMetadata(
				{
					session: "synthetic-session",
					cdpPort: 45044,
					requestId: "request-1",
					expectedUrl: "https://example.test/expected",
					timeoutMs: 50,
					maxOutputBytes: 1024,
				},
				{ processRunner: runner, now: () => 100 },
			);

		const oversizeError = Object.assign(new Error(sentinels[2]), {
			code: "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
			stdout: sentinels[0],
			stderr: sentinels[1],
		});
		const childError = Object.assign(new Error(sentinels[2]), {
			code: 7,
			stdout: sentinels[0],
			stderr: sentinels[1],
		});
		const oversize = await runWith(async () => Promise.reject(oversizeError));
		const failed = await runWith(async () => Promise.reject(childError));

		expect(oversize.outcome).toBe("output_limit");
		expect(failed.outcome).toBe("child_failed");
		expectNoSentinels([oversize, failed], sentinels);
	});

	test("captures and reduces a real secret-bearing child process without forwarding stderr", async () => {
		const sentinels = [
			"SYNTHETIC_REAL_CHILD_HEADER_SENTINEL_0229",
			"SYNTHETIC_REAL_CHILD_BODY_SENTINEL_0229",
			"SYNTHETIC_REAL_CHILD_STDERR_SENTINEL_0229",
		];
		const payload = JSON.stringify({
			success: true,
			data: {
				requestId: "request-1",
				url: "https://example.test/expected",
				status: 200,
				headers: { authorization: sentinels[0] },
				responseBody: JSON.stringify({ mapping: { only: {} }, content: sentinels[1] }),
			},
		});
		const result = await withFakeAgentBrowser(
			`process.stderr.write(${JSON.stringify(sentinels[2])}); process.stdout.write(${JSON.stringify(payload)});`,
			(executable) =>
				runAgentBrowserNetworkMetadata({
					session: "synthetic-session",
					cdpPort: 45044,
					requestId: "request-1",
					expectedUrl: "https://example.test/expected",
					executable,
					timeoutMs: 1_000,
					maxOutputBytes: 16_384,
				}),
		);

		expect(result).toMatchObject({
			outcome: "completed",
			requestIdMatches: true,
			expectedUrlMatches: true,
			status: 200,
			body: {
				retrieval: "present",
				parseState: "json",
				mappingCount: 1,
			},
		});
		expectNoSentinels(result, sentinels);
	});

	test("enforces timeout and output caps through the real child process boundary", async () => {
		const timeout = await withFakeAgentBrowser(
			"setInterval(() => undefined, 1000);",
			(executable) =>
				runAgentBrowserNetworkMetadata({
					session: "synthetic-session",
					cdpPort: 45044,
					requestId: "request-1",
					expectedUrl: "https://example.test/expected",
					executable,
					timeoutMs: 50,
					maxOutputBytes: 1024,
				}),
		);
		const outputLimit = await withFakeAgentBrowser(
			`process.stdout.write('SYNTHETIC_REAL_OVERSIZE_SENTINEL_0229'.repeat(512));`,
			(executable) =>
				runAgentBrowserNetworkMetadata({
					session: "synthetic-session",
					cdpPort: 45044,
					requestId: "request-1",
					expectedUrl: "https://example.test/expected",
					executable,
					timeoutMs: 1_000,
					maxOutputBytes: 128,
				}),
		);

		expect(timeout.outcome).toBe("timeout");
		expect(outputLimit.outcome).toBe("output_limit");
		expectNoSentinels(outputLimit, ["SYNTHETIC_REAL_OVERSIZE_SENTINEL_0229"]);
	});
});
