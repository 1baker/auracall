import { describe, expect, test, vi } from "vitest";
import {
	acquireAgentBrowserBrokerTab,
	detachAgentBrowserBrokerTab,
	resolveAgentBrowserBrokerUrl,
	withAgentBrowserBrokerCleanup,
} from "../../src/browser/service/agentBrowserBridge.js";

function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		headers: { "content-type": "application/json" },
		status: 200,
	});
}

describe("agent-browser bridge", () => {
	test("keeps an explicit canonical ChatGPT conversation URL authoritative over the installed broker default", () => {
		const previous = process.env.AURACALL_AGENT_BROWSER_URL_CHATGPT;
		process.env.AURACALL_AGENT_BROWSER_URL_CHATGPT =
			"https://chatgpt.com/g/g-p-workshop/c/workshop-chat";
		try {
			expect(resolveAgentBrowserBrokerUrl("chatgpt", "https://chatgpt.com/c/litscout-chat")).toBe(
				"https://chatgpt.com/c/litscout-chat",
			);
		} finally {
			if (previous === undefined) delete process.env.AURACALL_AGENT_BROWSER_URL_CHATGPT;
			else process.env.AURACALL_AGENT_BROWSER_URL_CHATGPT = previous;
		}
	});

	test("opens the exact conversation in a retained browser when only a wrong-conversation tab exists", async () => {
		const requestedUrl = "https://chatgpt.com/c/litscout-chat";
		const wrongHandle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "workshop-target",
			url: "https://chatgpt.com/g/g-p-workshop/c/workshop-chat",
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		const exactHandle = {
			browserId: wrongHandle.browserId,
			profileId: wrongHandle.profileId,
			sessionName: wrongHandle.sessionName,
			targetId: "litscout-target",
			url: requestedUrl,
			valid: true,
		};
		let exactTabOpened = false;
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: wrongHandle.browserId,
								profileId: wrongHandle.profileId,
								tabHandles: exactTabOpened ? [wrongHandle, exactHandle] : [wrongHandle],
							},
						],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									url: requestedUrl,
									browserId: wrongHandle.browserId,
									sessionName: wrongHandle.sessionName,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				exactTabOpened = true;
				return jsonResponse({ success: true, data: { serviceTabHandle: exactHandle } });
			}
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url: requestedUrl,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);
		expect(result?.serviceTabHandle).toEqual(exactHandle);
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
	});

	test("acquires and policy-attaches a broker-owned tab before AuraCall browser launch", async () => {
		const requests: Array<Record<string, unknown>> = [];
		const handle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "target-1",
			url: "https://chatgpt.com/c/existing",
			valid: true,
		};
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: handle.browserId,
								profileId: handle.profileId,
								tabHandles: [handle],
							},
						],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: {
									browserId: handle.browserId,
									sessionName: handle.sessionName,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "cdp_attach") {
				return jsonResponse({
					success: true,
					data: {
						browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
						detachRequired: true,
					},
				});
			}
			return jsonResponse({ success: true, data: { detached: true } });
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url: "https://chatgpt.com/c/existing",
			},
			{
				execFile: vi.fn() as never,
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result).toMatchObject({
			browserId: "session:auracall-chatgpt",
			browserProcessId: 41234,
			chromeHost: "127.0.0.1",
			chromePort: 49505,
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			serviceTabHandle: { targetId: "target-1", valid: true },
		});
		expect(requests.map((request) => request.action)).toEqual(["cdp_attach"]);

		expect(result).not.toBeNull();
		if (!result) throw new Error("expected broker result");
		await detachAgentBrowserBrokerTab(result, { fetch: fetch as never });
		expect(requests.at(-1)).toMatchObject({
			action: "cdp_detach",
			serviceTabHandle: { targetId: "target-1" },
		});
	});

	test("reuses an exact broker tab without submitting a duplicate tab request", async () => {
		const requests: Array<Record<string, unknown>> = [];
		const handle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "target-1",
			url: "https://chatgpt.com/c/existing",
			valid: true,
		};
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: handle.browserId,
								profileId: "chatgpt-pro",
								tabHandles: [handle],
							},
						],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: {
									browserId: handle.browserId,
									sessionName: handle.sessionName,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result?.serviceTabHandle).toEqual(handle);
		expect(requests.map((request) => request.action)).toEqual(["cdp_attach"]);
	});

	test("reuses the exact retained tab when access-plan reports its own active profile lease", async () => {
		const requests: Array<Record<string, unknown>> = [];
		const handle = {
			browserId: "session:auracall-chatgpt-broker-v7",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt-broker-v7",
			targetId: "target-v7",
			url: "https://chatgpt.com/c/existing",
			valid: true,
		};
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: handle.browserId,
								profileId: handle.profileId,
								tabHandles: [handle],
							},
						],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: {
								recommendedAction: "wait_for_profile_lease",
								activeLeaseSessionIds: ["auracall-chatgpt-broker-v7"],
							},
							serviceRequest: { available: true, request: { profileLeasePolicy: "wait" } },
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result?.serviceTabHandle).toEqual(handle);
		expect(requests.map((request) => request.action)).toEqual(["cdp_attach"]);
	});

	test("prefers the service route that owns the exact retained target over a stale daemon", async () => {
		const url = "https://chatgpt.com/c/existing";
		const handle = {
			browserId: "session:auracall-chatgpt-broker-v7",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt-broker-v7",
			targetId: "target-v7",
			url,
			valid: true,
		};
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value === "http://127.0.0.1:45555/api/service/browsers") {
				return jsonResponse({ success: true, data: { browsers: [] } });
			}
			if (value === "http://127.0.0.1:47777/api/service/browsers") {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: handle.browserId,
								profileId: handle.profileId,
								tabHandles: [handle],
							},
						],
					},
				});
			}
			if (value.startsWith("http://127.0.0.1:47777/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: {
									browserId: handle.browserId,
									sessionName: handle.sessionName,
								},
							},
						},
					},
				});
			}
			if (value.startsWith("http://127.0.0.1:45555/api/service/access-plan?")) {
				throw new Error("stale daemon access plan must not be selected");
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			expect(value).toBe("http://127.0.0.1:47777/api/service/request");
			expect(request.action).toBe("cdp_attach");
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url,
			},
			{
				execFile: vi.fn() as never,
				fetch: fetch as never,
				listStreamFiles: async () => [
					"/runtime/dashboard-service-backend-v5.stream",
					"/runtime/dashboard-service-backend-v7.stream",
				],
				readStreamFile: async (path) => (path.includes("v5") ? "45555\n" : "47777\n"),
			},
		);

		expect(result?.baseUrl).toBe("http://127.0.0.1:47777");
		expect(result?.serviceTabHandle).toEqual(handle);
	});

	test("asks agent-browser to launch a dedicated profile session when the access plan requires it", async () => {
		const handle = {
			browserId: "session:auracall-chatgpt-broker",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt-broker",
			targetId: "target-broker",
			url: "https://chatgpt.com/c/existing",
			valid: true,
		};
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value === "http://127.0.0.1:46515/api/service/browsers") {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: "session:stale-existing",
								profileId: "chatgpt-pro",
								tabHandles: [
									{
										...handle,
										browserId: "session:stale-existing",
										sessionName: "stale-existing",
										targetId: "stale-target",
									},
								],
							},
						],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									browserBuild: "stealthcdp_chromium",
									profile: "/mnt/c/profile",
								},
							},
						},
					},
				});
			}
			if (value === "http://127.0.0.1:47777/api/service/browsers") {
				return jsonResponse({
					success: true,
					data: {
						browsers: [
							{
								health: "ready",
								pid: 41234,
								id: handle.browserId,
								profileId: "chatgpt-pro",
								tabHandles: [handle],
							},
						],
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			expect(request.action).toBe("cdp_attach");
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
					detachRequired: true,
				},
			});
		});
		const execFile = vi.fn(async (_file: string, args: string[]) => {
			if (args.slice(-2).join(" ") === "stream enable")
				throw new Error("Streaming is already enabled");
			return {
				stdout: args.includes("stream") ? JSON.stringify({ data: { port: 47777 } }) : "{}",
				stderr: "",
			};
		});

		const previousExecutable = process.env.AURACALL_AGENT_BROWSER_EXECUTABLE_CHATGPT;
		const previousArgs = process.env.AURACALL_AGENT_BROWSER_ARGS_CHATGPT;
		process.env.AURACALL_AGENT_BROWSER_EXECUTABLE_CHATGPT = "/opt/chromium/chrome";
		process.env.AURACALL_AGENT_BROWSER_ARGS_CHATGPT = "--no-sandbox";
		let result: Awaited<ReturnType<typeof acquireAgentBrowserBrokerTab>>;
		try {
			result = await acquireAgentBrowserBrokerTab(
				{
					mode: "required",
					profileId: "chatgpt-pro",
					targetServiceId: "chatgpt",
					url: handle.url,
				},
				{
					execFile: execFile as never,
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			);
		} finally {
			if (previousExecutable === undefined)
				delete process.env.AURACALL_AGENT_BROWSER_EXECUTABLE_CHATGPT;
			else process.env.AURACALL_AGENT_BROWSER_EXECUTABLE_CHATGPT = previousExecutable;
			if (previousArgs === undefined) delete process.env.AURACALL_AGENT_BROWSER_ARGS_CHATGPT;
			else process.env.AURACALL_AGENT_BROWSER_ARGS_CHATGPT = previousArgs;
		}

		expect(result?.serviceTabHandle).toEqual(handle);
		expect(execFile).toHaveBeenNthCalledWith(
			1,
			"agent-browser",
			expect.arrayContaining([
				"--session",
				"auracall-chatgpt-broker",
				"--profile",
				"/mnt/c/profile",
				"--executable-path",
				"/opt/chromium/chrome",
				"--args",
				"--no-sandbox",
				"open",
				handle.url,
			]),
			expect.objectContaining({ timeout: 120_000 }),
		);
		expect(execFile).toHaveBeenNthCalledWith(
			3,
			"agent-browser",
			expect.arrayContaining(["stream", "status"]),
			expect.objectContaining({ timeout: 15_000 }),
		);
		expect(execFile).toHaveBeenLastCalledWith(
			"agent-browser",
			expect.arrayContaining(["service", "reconcile"]),
			expect.objectContaining({ timeout: 15_000 }),
		);
	});

	test("fails closed when launch_new_browser returns a wrong-profile exact URL", async () => {
		const url = "https://chatgpt.com/c/existing";
		const fetch = vi.fn(async (requestUrl: string | URL | Request) => {
			const value = String(requestUrl);
			if (value === "http://127.0.0.1:46515/api/service/browsers") {
				return jsonResponse({ success: true, data: { browsers: [] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: "chatgpt-pro" },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: { available: true, request: { action: "tab_new" } },
						},
					},
				});
			}
			return jsonResponse({
				success: true,
				data: {
					browsers: [
						{
							health: "ready",
							pid: 41234,
							id: "session:auracall-chatgpt-broker",
							profileId: "wrong-profile",
							tabHandles: [
								{
									browserId: "session:auracall-chatgpt-broker",
									profileId: "wrong-profile",
									sessionName: "auracall-chatgpt-broker",
									targetId: "wrong-target",
									url,
									valid: true,
								},
							],
						},
					],
				},
			});
		});
		const execFile = vi.fn(async (_file: string, args: string[]) => ({
			stdout: args.includes("stream") ? JSON.stringify({ data: { port: 47777 } }) : "{}",
			stderr: "",
		}));

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "required",
					profileId: "chatgpt-pro",
					targetServiceId: "chatgpt",
					url,
				},
				{
					execFile: execFile as never,
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("requires exactly one exact broker target; found 0");
	});

	test("fails closed when reuse_existing_browser has multiple exact targets", async () => {
		const url = "https://chatgpt.com/c/existing";
		const browser = (suffix: string) => ({
			health: "ready",
			pid: 41234,
			id: `session:chatgpt-${suffix}`,
			profileId: "chatgpt-pro",
			tabHandles: [
				{
					browserId: `session:chatgpt-${suffix}`,
					profileId: "chatgpt-pro",
					sessionName: `chatgpt-${suffix}`,
					targetId: `target-${suffix}`,
					url,
					valid: true,
				},
			],
		});
		const fetch = vi.fn(async (requestUrl: string | URL | Request) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [browser("a"), browser("b")] } });
			}
			return jsonResponse({
				success: true,
				data: {
					selectedProfile: { id: "chatgpt-pro" },
					decision: {
						profileReuse: { recommendedAction: "reuse_existing_browser" },
						serviceRequest: { available: true, request: {} },
					},
				},
			});
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "required",
					profileId: "chatgpt-pro",
					targetServiceId: "chatgpt",
					url,
				},
				{
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("requires exactly one exact broker target; found 2");
	});

	test.each([
		"operation admission rejected",
		"rate-limit preflight rejected",
		"execution aborted",
	])("detaches exactly once when %s", async (message) => {
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
			requests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
			return jsonResponse({ success: true, data: { detached: true } });
		});
		const bridge = {
			baseUrl: "http://127.0.0.1:47777",
			browserId: "session:chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "chatgpt",
			detachRequired: true,
			detachState: "attached" as const,
			serviceTabHandle: { targetId: "target-1", valid: true },
		};
		await expect(
			withAgentBrowserBrokerCleanup(
				bridge,
				async () => {
					throw new Error(message);
				},
				{ fetch: fetch as never },
			),
		).rejects.toThrow(message);
		await detachAgentBrowserBrokerTab(bridge, { fetch: fetch as never });
		expect(requests).toHaveLength(1);
		expect(requests[0]).toMatchObject({ action: "cdp_detach" });
	});

	test("propagates an unverified detach failure and allows one later reconciliation", async () => {
		const fetch = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ success: true, data: { detached: false } }))
			.mockResolvedValueOnce(jsonResponse({ success: true, data: { alreadyDetached: true } }));
		const bridge = {
			baseUrl: "http://127.0.0.1:47777",
			browserId: "session:chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "chatgpt",
			detachRequired: true,
			detachState: "attached" as const,
			serviceTabHandle: { targetId: "target-1", valid: true },
		};
		await expect(
			withAgentBrowserBrokerCleanup(bridge, async () => "done", {
				fetch: fetch as never,
			}),
		).rejects.toThrow("detach was not verified");
		await expect(
			detachAgentBrowserBrokerTab(bridge, { fetch: fetch as never }),
		).resolves.toBeUndefined();
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(bridge.detachState).toBe("detached");
	});
});
