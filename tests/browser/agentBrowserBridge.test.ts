import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import {
	acquireAgentBrowserBrokerTab,
	detachAgentBrowserBrokerTab,
	reattachAgentBrowserBrokerTab,
	resolveAgentBrowserBridgeMode,
	resolveAgentBrowserBrokerUrl,
	resolveAgentBrowserStreamDirectories,
	withAgentBrowserBrokerCleanup,
} from "../../src/browser/service/agentBrowserBridge.js";

function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		headers: { "content-type": "application/json" },
		status: 200,
	});
}

describe("agent-browser bridge", () => {
	test("defaults bridge selection to auto and preserves explicit overrides", () => {
		expect(resolveAgentBrowserBridgeMode(undefined)).toBe("auto");
		expect(resolveAgentBrowserBridgeMode("required")).toBe("required");
		expect(resolveAgentBrowserBridgeMode("off")).toBe("off");
	});

	test("discovers configured, agent-home, and runtime stream directories without duplicates", () => {
		const env = Object.fromEntries([
			["AGENT_BROWSER_SOCKET_DIR", "/srv/agent-browser-sockets"],
			["AGENT_BROWSER_HOME", "/var/lib/agent-browser"],
			["XDG_RUNTIME_DIR", "/run/custom-user"],
		]);
		expect(
			resolveAgentBrowserStreamDirectories({
				env,
				homeDir: "/home/operator",
				uid: 1234,
			}),
		).toEqual([
			path.resolve("/srv/agent-browser-sockets"),
			path.resolve("/var/lib/agent-browser"),
			path.resolve("/run/custom-user/agent-browser"),
		]);
		expect(
			resolveAgentBrowserStreamDirectories({
				env: Object.fromEntries([["AGENT_BROWSER_SOCKET_DIR", "/home/operator/.agent-browser"]]),
				homeDir: "/home/operator",
				uid: 1234,
			}),
		).toEqual([
			path.resolve("/home/operator/.agent-browser"),
			path.resolve("/run/user/1234/agent-browser"),
		]);
	});

	test("auto falls back only when no agent-browser service route is available", async () => {
		const logs: string[] = [];
		await expect(
			acquireAgentBrowserBrokerTab(
				{
					logger: (message) => logs.push(message),
					mode: "auto",
					targetServiceId: "chatgpt",
					url: "https://chatgpt.com/",
				},
				{ listStreamFiles: async () => [] },
			),
		).resolves.toBeNull();
		expect(logs).toContainEqual(expect.stringContaining("compatibility browser path"));
	});

	test("auto fails closed after an agent-browser access plan claims authority", async () => {
		const fetch = vi.fn(async (url: string | URL | Request) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [] } });
			}
			return jsonResponse({
				success: true,
				data: {
					selectedProfile: { id: "chatgpt-pro" },
					decision: {
						profileReuse: { recommendedAction: "unsupported_action" },
					},
				},
			});
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "auto",
					profileId: "chatgpt-pro",
					targetServiceId: "chatgpt",
					url: "https://chatgpt.com/",
				},
				{
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("auto mode claimed authority");
	});

	test("off never probes agent-browser", async () => {
		const fetch = vi.fn();
		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "off",
					targetServiceId: "chatgpt",
					url: "https://chatgpt.com/",
				},
				{ fetch: fetch as never },
			),
		).resolves.toBeNull();
		expect(fetch).not.toHaveBeenCalled();
	});

	test("rejects an explicit browser host when the broker is disabled", async () => {
		const fetch = vi.fn();
		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "off",
					browserHost: "local_headless",
					targetServiceId: "chatgpt",
					url: "https://chatgpt.com/",
				},
				{ fetch: fetch as never },
			),
		).rejects.toThrow("explicit agent-browser host requirement conflicts with bridge mode off");
		expect(fetch).not.toHaveBeenCalled();
	});

	test("reattaches an exact retained broker handle after the AuraCall process restarts", async () => {
		const handle = {
			browserId: "session:auracall-chatgpt-broker-v7",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt-broker-v7",
			targetId: "target-restart",
			url: "https://chatgpt.com/c/recovered-chat",
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		const siblingHandle = { ...handle, targetId: "target-restart-sibling" };
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
								tabHandles: [siblingHandle, handle],
							},
						],
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

		const result = await reattachAgentBrowserBrokerTab(
			{
				baseUrl: "http://127.0.0.1:47777",
				browserId: handle.browserId,
				profileId: handle.profileId,
				serviceTabHandle: handle,
				sessionName: handle.sessionName,
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "47777\n",
			},
		);

		expect(result).toMatchObject({
			acquisitionDecision: "retained_restart_reattach",
			acquisitionEvidence: "broker_inventory",
			baseUrl: "http://127.0.0.1:47777",
			browserId: handle.browserId,
			browserProcessId: 41234,
			canonicalTargetId: handle.targetId,
			chromeHost: "127.0.0.1",
			chromePort: 49505,
			exactUrlTargetCount: 2,
			serviceTabHandle: handle,
			tabReconciliation: "preserved_selection_only",
		});
		expect(requests).toHaveLength(1);
		expect(requests[0]).toMatchObject({
			action: "cdp_attach",
			taskName: "chatgpt-restart-recovery",
			serviceTabHandle: handle,
		});
	});

	test("fails restart recovery closed when the retained broker target is gone", async () => {
		await expect(
			reattachAgentBrowserBrokerTab(
				{
					browserId: "session:auracall-chatgpt",
					profileId: "chatgpt-pro",
					serviceTabHandle: { targetId: "closed-target" },
					sessionName: "auracall-chatgpt",
					url: "https://chatgpt.com/c/recovered-chat",
				},
				{
					fetch: vi.fn(async () =>
						jsonResponse({ success: true, data: { browsers: [] } }),
					) as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "47777\n",
				},
			),
		).rejects.toThrow("requires exactly one retained broker target; found 0");
	});

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

	test("selects the returned exact target and preserves other exact-URL and wrong-conversation tabs", async () => {
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
		const siblingExactHandle = {
			...exactHandle,
			targetId: "litscout-sibling-target",
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
								tabHandles: exactTabOpened
									? [wrongHandle, siblingExactHandle, exactHandle]
									: [wrongHandle, siblingExactHandle],
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
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: exactHandle,
						sharedAcquisition: {
							action: "opened_new_tab",
							mode: "tab_new",
							tabOpened: true,
						},
					},
				});
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
		expect(result).toMatchObject({
			acquisitionDecision: "opened_new_tab",
			acquisitionEvidence: "service_response",
			canonicalTargetId: exactHandle.targetId,
			exactUrlTargetCount: 2,
			requestedUrl,
			serviceTabHandle: exactHandle,
			tabReconciliation: "preserved_selection_only",
		});
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
	});

	test("waits for the exact returned handle to converge in broker inventory", async () => {
		const requestedUrl = "https://chatgpt.com/c/converging-target";
		const handle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "converging-target",
			url: requestedUrl,
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		let inventoryReads = 0;
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				inventoryReads += 1;
				return jsonResponse({
					success: true,
					data: {
						browsers:
							inventoryReads < 3
								? []
								: [
										{
											health: "ready",
											host: "remote_headed",
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
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: {
								available: true,
								request: { action: "tab_new", url: requestedUrl },
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: handle,
						sharedAcquisition: {
							action: "opened_new_tab",
							mode: "tab_new",
							tabOpened: true,
						},
					},
				});
			}
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/converged",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "required",
				profileId: handle.profileId,
				targetServiceId: "chatgpt",
				url: requestedUrl,
			},
			{
				fetch: fetch as never,
				inventoryMaxAttempts: 3,
				inventoryPollIntervalMs: 0,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
				sleep: async () => undefined,
			},
		);

		expect(result?.canonicalTargetId).toBe(handle.targetId);
		expect(inventoryReads).toBe(3);
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
	});

	test("releases a newly opened tab when exact inventory convergence never completes", async () => {
		const requestedUrl = "https://chatgpt.com/c/nonconverging-target";
		const handle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "nonconverging-target",
			url: requestedUrl,
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: {
								available: true,
								request: { action: "tab_new", url: requestedUrl },
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: handle,
						sharedAcquisition: {
							action: "opened_new_tab",
							mode: "tab_new",
							tabOpened: true,
						},
					},
				});
			}
			if (request.action === "tab_handle_release") {
				return jsonResponse({ success: true, data: { released: true } });
			}
			throw new Error("attach must not run before exact inventory convergence");
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "required",
					profileId: handle.profileId,
					targetServiceId: "chatgpt",
					url: requestedUrl,
				},
				{
					fetch: fetch as never,
					inventoryMaxAttempts: 3,
					inventoryPollIntervalMs: 0,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
					sleep: async () => undefined,
				},
			),
		).rejects.toThrow("bounded inventory convergence");
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "tab_handle_release"]);
	});

	test("fails closed before attach when the returned handle URL differs from the requested URL", async () => {
		const requestedUrl = "https://chatgpt.com/c/requested";
		const returnedHandle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "wrong-conversation-target",
			url: "https://chatgpt.com/c/wrong-conversation",
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [] } });
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
								request: { action: "tab_new", url: requestedUrl },
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			return jsonResponse({ success: true, data: { serviceTabHandle: returnedHandle } });
		});

		await expect(
			acquireAgentBrowserBrokerTab(
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
			),
		).rejects.toThrow("returned a non-canonical URL");
		expect(requests.map((request) => request.action)).toEqual(["tab_new"]);
	});

	test("fails closed before attach when service acquisition evidence contradicts tab creation", async () => {
		const url = "https://chatgpt.com/c/requested";
		const handle = {
			browserId: "session:auracall-chatgpt",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt",
			targetId: "requested-target",
			url,
			valid: true,
		};
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: { action: "tab_new", url },
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
					serviceTabHandle: handle,
					sharedAcquisition: {
						action: "reused_existing_tab",
						mode: "tab_new",
						tabOpened: false,
					},
				},
			});
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "required",
					profileId: handle.profileId,
					targetServiceId: "chatgpt",
					url,
				},
				{
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("contradictory acquisition evidence");
		expect(requests.map((request) => request.action)).toEqual(["tab_new"]);
	});

	test("auto acquires and policy-attaches a broker-owned tab before AuraCall browser launch", async () => {
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
									action: "tab_new",
									browserId: handle.browserId,
									sessionName: handle.sessionName,
									url: handle.url,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: handle,
						sharedAcquisition: {
							action: "opened_new_tab",
							mode: "tab_new",
							tabOpened: true,
						},
					},
				});
			}
			if (request.action === "cdp_attach") {
				return jsonResponse({
					success: true,
					data: {
						browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/example",
						detachRequired: true,
					},
				});
			}
			if (request.action === "tab_handle_release") {
				return jsonResponse({ success: true, data: { released: true } });
			}
			return jsonResponse({ success: true, data: { detached: true } });
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "auto",
				profileId: "chatgpt-pro",
				targetServiceId: "chatgpt",
				url: "https://chatgpt.com/c/existing",
			},
			{
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
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);

		expect(result).not.toBeNull();
		if (!result) throw new Error("expected broker result");
		await detachAgentBrowserBrokerTab(result, { fetch: fetch as never });
		expect(requests.at(-2)).toMatchObject({
			action: "cdp_detach",
			serviceTabHandle: { targetId: "target-1" },
		});
		expect(requests.at(-1)).toMatchObject({
			action: "tab_handle_release",
			serviceTabHandle: { targetId: "target-1" },
		});
	});

	test("requires and proves an explicit headless browser host before attach", async () => {
		const requestedUrl = "https://chatgpt.com/c/headless-contract";
		const handle = {
			browserId: "session:auracall-headless",
			profileId: "chatgpt-pro",
			sessionName: "auracall-headless",
			targetId: "headless-target",
			url: requestedUrl,
			valid: true,
		};
		let tabOpened = false;
		let plannedUrl = "";
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: tabOpened
							? [
									{
										health: "ready",
										host: "local_headless",
										pid: 41235,
										id: handle.browserId,
										profileId: handle.profileId,
										tabHandles: [handle],
									},
								]
							: [],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				plannedUrl = value;
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									url: requestedUrl,
									params: { browserHost: "local_headless" },
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			if (request.action === "tab_new") {
				tabOpened = true;
				return jsonResponse({
					success: true,
					data: { serviceTabHandle: handle, tabAcquisitionDecision: "opened_new_tab" },
				});
			}
			return jsonResponse({
				success: true,
				data: {
					browserWebSocketUrl: "ws://127.0.0.1:49506/devtools/browser/headless",
					detachRequired: true,
				},
			});
		});

		const result = await acquireAgentBrowserBrokerTab(
			{
				mode: "auto",
				browserHost: "local_headless",
				profileId: handle.profileId,
				targetServiceId: "chatgpt",
				url: requestedUrl,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(new URL(plannedUrl).searchParams.get("browserHost")).toBe("local_headless");
		expect(new URL(plannedUrl).searchParams.get("targetServiceId")).toBe("chatgpt");
		expect(result).toMatchObject({
			browserHost: "local_headless",
			browserId: handle.browserId,
			profileId: handle.profileId,
		});
	});

	test("rejects a planned tab request that changes the explicit browser host", async () => {
		let serviceRequestAttempted = false;
		const fetch = vi.fn(async (url: string | URL | Request) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [] } });
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
									url: "https://chatgpt.com/c/headless-contract",
									params: { browserHost: "remote_headed" },
								},
							},
						},
					},
				});
			}
			serviceRequestAttempted = true;
			return jsonResponse({ success: true, data: {} });
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "auto",
					browserHost: "local_headless",
					profileId: "chatgpt-pro",
					targetServiceId: "chatgpt",
					url: "https://chatgpt.com/c/headless-contract",
				},
				{
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("did not preserve requested browser host local_headless");
		expect(serviceRequestAttempted).toBe(false);
	});

	test("rejects final broker inventory that does not prove the explicit browser host", async () => {
		const requestedUrl = "https://chatgpt.com/c/headless-contract";
		const handle = {
			browserId: "session:auracall-headless",
			profileId: "chatgpt-pro",
			sessionName: "auracall-headless",
			targetId: "headless-target",
			url: requestedUrl,
			valid: true,
		};
		let tabOpened = false;
		let attachAttempted = false;
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({
					success: true,
					data: {
						browsers: tabOpened
							? [
									{
										health: "ready",
										host: "remote_headed",
										pid: 41235,
										id: handle.browserId,
										profileId: handle.profileId,
										tabHandles: [handle],
									},
								]
							: [],
					},
				});
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "launch_new_browser" },
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									url: requestedUrl,
									params: { browserHost: "local_headless" },
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			if (request.action === "tab_new") {
				tabOpened = true;
				return jsonResponse({
					success: true,
					data: { serviceTabHandle: handle, tabAcquisitionDecision: "opened_new_tab" },
				});
			}
			attachAttempted = true;
			return jsonResponse({ success: true, data: {} });
		});

		await expect(
			acquireAgentBrowserBrokerTab(
				{
					mode: "auto",
					browserHost: "local_headless",
					profileId: handle.profileId,
					targetServiceId: "chatgpt",
					url: requestedUrl,
				},
				{
					fetch: fetch as never,
					listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
					readStreamFile: async () => "46515\n",
				},
			),
		).rejects.toThrow("returned browser host remote_headed instead of requested local_headless");
		expect(attachAttempted).toBe(false);
	});

	test("preserves the exact broker tab when legacy acquisition evidence is absent", async () => {
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
									action: "tab_new",
									browserId: handle.browserId,
									sessionName: handle.sessionName,
									url: handle.url,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				return jsonResponse({ success: true, data: { serviceTabHandle: handle } });
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
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result).toMatchObject({
			acquisitionDecision: "planned_tab_new_legacy",
			acquisitionEvidence: "planned_request_legacy",
			releaseRequired: false,
			releaseState: "preserved",
			serviceTabHandle: handle,
		});
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
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
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									profileLeasePolicy: "wait",
									url: handle.url,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				return jsonResponse({ success: true, data: { serviceTabHandle: handle } });
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
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result?.serviceTabHandle).toEqual(handle);
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
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
									action: "tab_new",
									browserId: handle.browserId,
									sessionName: handle.sessionName,
									url,
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
			if (request.action === "tab_new") {
				return jsonResponse({ success: true, data: { serviceTabHandle: handle } });
			}
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

	test("executes a dashboard-planned request through the exact session stream", async () => {
		const url = "https://chatgpt.com/c/existing";
		const handle = {
			browserId: "session:auracall-chatgpt-bridge-v3",
			profileId: "chatgpt-pro",
			sessionName: "auracall-chatgpt-bridge-v3",
			targetId: "target-v3",
			url,
			valid: true,
		};
		const requests: Array<{ baseUrl: string; action: unknown }> = [];
		const browserInventory = {
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
		};
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) return jsonResponse(browserInventory);
			if (value.startsWith("http://127.0.0.1:45555/api/service/access-plan?")) {
				return jsonResponse({
					success: true,
					data: {
						selectedProfile: { id: handle.profileId },
						decision: {
							profileReuse: { recommendedAction: "reuse_existing_browser" },
							serviceRequest: {
								available: true,
								request: {
									action: "tab_new",
									browserId: handle.browserId,
									sessionName: handle.sessionName,
									url,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push({ baseUrl: new URL(value).origin, action: request.action });
			expect(value).toBe("http://127.0.0.1:47777/api/service/request");
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: handle,
						sharedAcquisition: {
							action: "opened_new_tab",
							mode: "tab_new",
							tabOpened: true,
						},
					},
				});
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
				profileId: handle.profileId,
				targetServiceId: "chatgpt",
				url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => [
					"/runtime/dashboard-service-backend.stream",
					`/runtime/${handle.sessionName}.stream`,
				],
				readStreamFile: async (filePath) =>
					filePath.includes("dashboard") ? "45555\n" : "47777\n",
			},
		);

		expect(result?.baseUrl).toBe("http://127.0.0.1:47777");
		expect(requests).toEqual([
			{ action: "tab_new", baseUrl: "http://127.0.0.1:47777" },
			{ action: "cdp_attach", baseUrl: "http://127.0.0.1:47777" },
		]);
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
		let acquired = false;
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			const value = String(url);
			if (value === "http://127.0.0.1:46515/api/service/browsers") {
				return jsonResponse({
					success: true,
					data: {
						browsers: acquired
							? [
									{
										health: "ready",
										pid: 41234,
										id: handle.browserId,
										profileId: "chatgpt-pro",
										tabHandles: [handle],
									},
								]
							: [
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
									url: handle.url,
								},
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				acquired = true;
				return jsonResponse({ success: true, data: { serviceTabHandle: handle } });
			}
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
				url: handle.url,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
				readStreamFile: async () => "46515\n",
			},
		);

		expect(result?.serviceTabHandle).toEqual(handle);
		expect(requests.map((request) => request.action)).toEqual(["tab_new", "cdp_attach"]);
		expect(requests[0]).toMatchObject({
			browserBuild: "stealthcdp_chromium",
			profile: "/mnt/c/profile",
			url: handle.url,
		});
	});

	test("fails closed when launch_new_browser returns a wrong-profile exact URL", async () => {
		const url = "https://chatgpt.com/c/existing";
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
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
							serviceRequest: {
								available: true,
								request: { action: "tab_new", url },
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: {
						serviceTabHandle: {
							browserId: "session:auracall-chatgpt-broker",
							profileId: "wrong-profile",
							sessionName: "auracall-chatgpt-broker",
							targetId: "wrong-target",
							url,
							valid: true,
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
		).rejects.toThrow("returned handle profile mismatch: expected chatgpt-pro, got wrong-profile");
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
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [browser("a"), browser("a")] } });
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
								request: { action: "tab_new", url },
							},
						},
					},
				});
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			if (request.action === "tab_new") {
				return jsonResponse({
					success: true,
					data: { serviceTabHandle: browser("a").tabHandles[0] },
				});
			}
			throw new Error("attach must not run after ambiguous handle verification");
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

	test("preserves a completed provider result after detach failure and allows reconciliation", async () => {
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
		const onCleanupError = vi.fn();
		await expect(
			withAgentBrowserBrokerCleanup(bridge, async () => "done", {
				fetch: fetch as never,
				onCleanupError,
			}),
		).resolves.toBe("done");
		expect(onCleanupError).toHaveBeenCalledTimes(1);
		expect(String(onCleanupError.mock.calls[0]?.[0])).toContain("detach was not verified");
		await expect(
			detachAgentBrowserBrokerTab(bridge, { fetch: fetch as never }),
		).resolves.toBeUndefined();
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(bridge.detachState).toBe("detached");
	});
});
