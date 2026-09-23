// biome-ignore-all lint/suspicious/noExplicitAny: broker test doubles intentionally model untyped wire payloads.
import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import { BrowserAutomationError } from "../../src/oracle/errors.js";
import { createProviderSessionAuthorization } from "../../src/browser/providers/providerSessionAuthority.js";
import {
	acquireAgentBrowserBrokerTab,
	detachAgentBrowserBrokerTab,
	observeAgentBrowserProjectResponse,
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
	test("preserves both operation and detach failures in the terminal error", async () => {
		const bridge = { baseUrl: "http://127.0.0.1:47777", browserId: "session:retained",
			profileId: "chatgpt-pro", sessionName: "retained", detachRequired: true,
			serviceTabHandle: { targetId: "original-target", valid: true } };
		const fetch = vi.fn(async () => { throw new Error("detach endpoint unavailable"); });
		await expect(withAgentBrowserBrokerCleanup(bridge, async () => {
			throw new Error("target binding rejected");
		}, { fetch: fetch as typeof globalThis.fetch })).rejects.toMatchObject({
			name: "BrowserAutomationError",
			message: expect.stringContaining("target binding rejected"),
			details: {
				code: "agent_browser_operation_and_cleanup_failed",
				detachError: expect.stringContaining("detach endpoint unavailable"),
			},
		});
	});
	test.each([undefined, null, false, 0, ""])("does not publish success for a falsy operation rejection: %s", async (failure) => {
		const fetch = vi.fn(async () => jsonResponse({ success: true, data: { detached: true } }));
		const bridge = { baseUrl: "http://127.0.0.1:47777", browserId: "session:retained",
			profileId: "chatgpt-pro", sessionName: "retained", detachRequired: true,
			serviceTabHandle: { targetId: "original-target", valid: true } };
		await expect(withAgentBrowserBrokerCleanup(bridge, async () => { throw failure; },
			{ fetch: fetch as typeof globalThis.fetch })).rejects.toBe(failure);
		expect(fetch).toHaveBeenCalledOnce();
	});

	test.each(["unknown", "unknown-connection-loss", "unknown-detach-failed", "before", "retryable", "lookalike", "ordinary", "success"])(
		"cleanup preserves only typed after-submit uncertainty: %s", async (kind) => {
			const uncertain = kind.startsWith("unknown");
			const requests: string[] = [];
			const fetch = vi.fn(async (_url: unknown, init?: RequestInit) => {
				const action = JSON.parse(String(init?.body)).action;
				requests.push(action);
				if (kind === "unknown-detach-failed") throw new Error("detach unavailable");
				return jsonResponse({ success: true, data: { detached: true, released: true } });
			});
			const bridge = {
				baseUrl: "http://127.0.0.1:47777", browserId: "session:chatgpt",
				browserProcessId: 123, profileId: "chatgpt-pro", sessionName: "chatgpt",
				canonicalTargetId: "target-1", requestedUrl: "https://chatgpt.com/g/test/project",
				detachRequired: true, releaseRequired: true,
				serviceTabHandle: { targetId: "target-1", valid: true },
			};
			const details = { code: "chatgpt_new_conversation_outcome_unknown",
				phase: kind === "before" ? "before" : "after", retryable: kind === "retryable",
				...(kind === "unknown-connection-loss" ? { stage: "connection-lost" } : {}) };
			const error = kind === "lookalike" ? Object.assign(new Error("unknown"), { details })
				: kind === "ordinary" ? new Error("ordinary") : new BrowserAutomationError("unknown", details);
			const result = withAgentBrowserBrokerCleanup(bridge, async () => {
				if (kind !== "success") throw error;
				return "done";
			}, { fetch: fetch as never });
			if (kind === "success") await expect(result).resolves.toBe("done");
			else if (uncertain) await expect(result).rejects.toMatchObject({
				details: { ...details, retainedBrowserRecovery: {
					browserId: bridge.browserId, browserProcessId: 123,
					profileId: bridge.profileId, sessionName: bridge.sessionName,
					targetId: "target-1", serviceTabHandle: bridge.serviceTabHandle,
					conversationRouteVerified: false, tabReleaseSuppressed: true,
				}, ...(kind === "unknown-detach-failed" ? { cleanupFailed: true } : {}) },
			});
			else await expect(result).rejects.toBe(error);
			if (kind !== "unknown-detach-failed") await detachAgentBrowserBrokerTab(bridge, { fetch: fetch as never });
			expect(requests).toEqual(uncertain ? ["cdp_detach"] : ["cdp_detach", "tab_handle_release"]);
		});

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

	test("uses the configured exact target when two retained tabs share the conversation URL", async () => {
		const url = "https://chatgpt.com/c/existing";
		const selected = {
			browserId: "session:dashboard-service-backend",
			profileId: "chatgpt-pro",
			sessionName: "dashboard-service-backend",
			targetId: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
			url,
			valid: true,
		};
		const sibling = { ...selected, targetId: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" };
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [{
					browserBuild: "stock_chrome",
					health: "ready",
					id: selected.browserId,
					pid: 657110,
					profileId: selected.profileId,
					tabHandles: [sibling, selected],
				}] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({ success: true, data: {
					selectedProfile: { id: selected.profileId },
					decision: {
						launchPosture: { browserBuild: "stock_chrome" },
						profileReuse: { recommendedAction: "reuse_existing_browser" },
						serviceRequest: { available: true, request: { action: "tab_new", url } },
					},
				} });
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			expect(request.action).toBe("cdp_attach");
			return jsonResponse({ success: true, data: {
				browserWebSocketUrl: "ws://127.0.0.1:42233/devtools/browser/exact",
				detachRequired: true,
			} });
		});

		const result = await acquireAgentBrowserBrokerTab({
			mode: "required",
			profileId: selected.profileId,
			targetId: selected.targetId,
			targetServiceId: "chatgpt",
			url,
		}, {
			fetch: fetch as never,
			listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
			readStreamFile: async () => "47777\n",
		});

		expect(result?.serviceTabHandle).toEqual(selected);
		expect(result?.canonicalTargetId).toBe(selected.targetId);
		expect(requests.map((request) => request.action)).toEqual(["cdp_attach"]);
	});

	test("fails before tab creation when the configured exact target is unavailable", async () => {
		const url = "https://chatgpt.com/c/existing";
		const fetch = vi.fn(async (requestUrl: string | URL | Request) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [{
					browserBuild: "stock_chrome", health: "ready",
					id: "session:dashboard-service-backend", pid: 657110,
					profileId: "chatgpt-pro", tabHandles: [],
				}] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				return jsonResponse({ success: true, data: {
					selectedProfile: { id: "chatgpt-pro" },
					decision: {
						launchPosture: { browserBuild: "stock_chrome" },
						profileReuse: { recommendedAction: "reuse_existing_browser" },
						serviceRequest: { available: true, request: { action: "tab_new", url } },
					},
				} });
			}
			throw new Error("tab creation must not run for a configured exact target");
		});

		await expect(acquireAgentBrowserBrokerTab({
			mode: "required", profileId: "chatgpt-pro",
			targetId: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
			targetServiceId: "chatgpt", url,
		}, {
			fetch: fetch as never,
			listStreamFiles: async () => ["/runtime/dashboard-service-backend.stream"],
			readStreamFile: async () => "47777\n",
		})).rejects.toThrow("requires exactly one ready exact retained handle; found 0");
	});

	test("uses a unique explicit project conversation when the ambient configured target is stale", async () => {
		const url = "https://chatgpt.com/g/g-p-11111111111111111111111111111111-workshop/c/11111111-1111-1111-1111-111111111111";
		const handle = { browserId: "session:chatgpt-pro", profileId: "chatgpt-pro",
			sessionName: "chatgpt-pro", targetId: "CURRENT-CONVERSATION-TARGET", url, valid: true };
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) return jsonResponse({ success: true, data: { browsers: [{
				browserBuild: "stock_chrome", health: "ready", id: handle.browserId, pid: 2696783,
				profileId: handle.profileId, tabHandles: [handle],
			}] } });
			if (value.includes("/api/service/access-plan?")) return jsonResponse({ success: true, data: {
				selectedProfile: { id: handle.profileId }, decision: {
					launchPosture: { browserBuild: "stock_chrome" },
					profileReuse: { recommendedAction: "reuse_existing_browser" },
					serviceRequest: { available: true, request: { action: "tab_new", url } },
				},
			} });
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			return jsonResponse({ success: true, data: {
				browserWebSocketUrl: "ws://127.0.0.1:42233/devtools/browser/exact", detachRequired: true,
			} });
		});
		const result = await acquireAgentBrowserBrokerTab({ mode: "required", profileId: handle.profileId,
			targetId: "STALE-AMBIENT-TARGET", targetServiceId: "chatgpt", url }, {
			fetch: fetch as never, listStreamFiles: async () => ["/runtime/chatgpt-pro.stream"],
			readStreamFile: async () => "47777\n",
		});
		expect(result?.canonicalTargetId).toBe(handle.targetId);
		expect(result?.serviceTabHandle).toEqual(handle);
		expect(requests).toEqual([expect.objectContaining({ action: "cdp_attach", serviceTabHandle: handle })]);
	});

	test("opens an explicit project conversation through Agent Browser when its ambient target and live handle are gone", async () => {
		const url = "https://chatgpt.com/g/g-p-11111111111111111111111111111111-workshop/c/11111111-1111-1111-1111-111111111111";
		const handle = { browserId: "session:chatgpt-pro", profileId: "chatgpt-pro",
			sessionName: "chatgpt-pro", targetId: "REOPENED-CONVERSATION-TARGET", url, valid: true };
		const requests: Array<Record<string, unknown>> = [];
		let opened = false;
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) return jsonResponse({ success: true, data: { browsers: [{
				browserBuild: "stock_chrome", health: "ready", id: handle.browserId, pid: 2696783,
				profileId: handle.profileId, tabHandles: opened ? [handle] : [],
			}] } });
			if (value.includes("/api/service/access-plan?")) return jsonResponse({ success: true, data: {
				selectedProfile: { id: handle.profileId }, decision: {
					launchPosture: { browserBuild: "stock_chrome" },
					profileReuse: { recommendedAction: "reuse_existing_browser" },
					serviceRequest: { available: true, request: { action: "tab_new", url,
						browserId: handle.browserId, sessionName: handle.sessionName } },
				},
			} });
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				opened = true;
				return jsonResponse({ success: true, data: { serviceTabHandle: handle,
					sharedAcquisition: { mode: "tab_new", action: "opened_new_tab", tabOpened: true } } });
			}
			return jsonResponse({ success: true, data: {
				browserWebSocketUrl: "ws://127.0.0.1:42233/devtools/browser/exact", detachRequired: true,
			} });
		});
		const result = await acquireAgentBrowserBrokerTab({ mode: "required", profileId: handle.profileId,
			targetId: "STALE-AMBIENT-TARGET", targetServiceId: "chatgpt", url }, {
			fetch: fetch as never, listStreamFiles: async () => ["/runtime/chatgpt-pro.stream"],
			readStreamFile: async () => "47777\n",
		});
		expect(result?.canonicalTargetId).toBe(handle.targetId);
		expect(requests.map(request => request.action)).toEqual(["tab_new", "cdp_attach"]);
		expect(requests[0]).toMatchObject({ action: "tab_new", url, browserId: handle.browserId,
			sessionName: handle.sessionName });
	});

	test.each([true, false])("binds a restored target before attaching (matching=%s)", async (matching) => {
		const handle = { browserId: 'session:recovery', profileId: 'chatgpt-pro',
			sessionName: 'recovery', targetId: 'new-target', url: 'https://chatgpt.com/c/recovery', valid: true };
		const actions: string[] = [];
		const fetch = vi.fn(async (url: unknown, init?: RequestInit) => {
			if (String(url).endsWith('/api/service/browsers')) return jsonResponse({ success: true,
				data: { browsers: [{ id: handle.browserId, profileId: handle.profileId, health: 'ready',
					pid: 123, host: 'remote_headed', tabHandles: [handle] }] } });
			const request = JSON.parse(String(init?.body));
			actions.push(request.action);
			if (request.action === 'evaluate') return jsonResponse({ success: true, data: { result: {
				url: handle.url, generating: false, messages: [
					{ role: 'user', id: 'original-user', text: matching ? 'Full original prompt' : 'Different prompt' },
					{ role: 'assistant', id: 'original-answer', text: 'Original answer' },
				],
			} } });
			if (request.action === 'cdp_attach') return jsonResponse({ success: true,
				data: { browserWebSocketUrl: 'ws://127.0.0.1:49505/devtools/browser/recovery' } });
			throw new Error('Unexpected browser action');
		});
		const result = reattachAgentBrowserBrokerTab({
			browserId: handle.browserId, profileId: handle.profileId, sessionName: handle.sessionName,
			serviceTabHandle: { ...handle, targetId: 'lost-target' }, url: handle.url,
			recoveryPrompt: 'Full original prompt', browserHost: 'remote_headed',
		}, { fetch: fetch as never, listStreamFiles: async () => ['/runtime/default.stream'],
			readStreamFile: async () => '47777\n' });
		if (matching) {
			expect(await result).toMatchObject({ canonicalTargetId: 'new-target', recoveredResponse: {
				userMessageId: 'original-user', answerMessageId: 'original-answer', answerText: 'Original answer',
			} });
			expect(actions).toEqual(['evaluate', 'cdp_attach']);
		} else {
			await expect(result).rejects.toThrow('not uniquely bound');
			expect(actions).toEqual(['evaluate']);
		}
	});

	test("observes a new-project answer by reopening only its exact released conversation", async () => {
		const url = "https://chatgpt.com/g/g-p-11111111111111111111111111111111-workshop/c/11111111-1111-1111-1111-111111111111";
		const closed = { browserId: "session:chatgpt-pro", profileId: "chatgpt-pro",
			sessionName: "chatgpt-pro", targetId: "CLOSED-ORIGINAL-TARGET", url,
			valid: false, staleReason: "tab_closed" };
		const reopened = { ...closed, targetId: "READ-ONLY-OBSERVATION-TARGET", valid: true, staleReason: undefined };
		const actions: string[] = [];
		let opened = false;
		let responseSnapshots = 0;
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) return jsonResponse({ success: true, data: { browsers: [{
				browserBuild: "stock_chrome", health: "ready", host: "remote_headed", pid: 2696783,
				id: closed.browserId, profileId: closed.profileId, tabHandles: opened ? [closed, reopened] : [closed],
			}] } });
			if (value.includes("/api/service/access-plan?")) return jsonResponse({ success: true, data: {
				selectedProfile: { id: closed.profileId }, decision: {
					launchPosture: { browserBuild: "stock_chrome" },
					profileReuse: { recommendedAction: "reuse_existing_browser" },
					serviceRequest: { available: true, request: { action: "tab_new", url,
						browserId: closed.browserId, sessionName: closed.sessionName,
						params: { browserHost: "remote_headed" } } },
				},
			} });
			const request = JSON.parse(String(init?.body)) as Record<string, any>;
			actions.push(String(request.action));
			if (request.action === "tab_new") {
				opened = true;
				return jsonResponse({ success: true, data: { serviceTabHandle: reopened,
					sharedAcquisition: { mode: "tab_new", action: "opened_new_tab", tabOpened: true } } });
			}
			if (request.action === "cdp_attach") return jsonResponse({ success: true, data: {
				browserWebSocketUrl: "ws://127.0.0.1:42233/devtools/browser/recovery", detachRequired: true,
			} });
			if (request.action === "evaluate" && String(request.expression).includes("data-message-author-role")) {
				responseSnapshots += 1;
				if (responseSnapshots === 1) return jsonResponse({ success: true, data: { result: {
					url, generating: false, messages: [],
				} } });
				return jsonResponse({ success: true, data: { result: { url, generating: false, messages: [
					{ role: "user", id: "u1", text: "Full original prompt" },
					{ role: "assistant", id: "a1", text: "Recovered exact answer" },
				] } } });
			}
			if (request.action === "evaluate") return jsonResponse({ success: true, data: {
				result: { user: { email: "expected@example.com" } },
			} });
			if (request.action === "cdp_detach") return jsonResponse({ success: true, data: { detached: true } });
			if (request.action === "tab_handle_release") return jsonResponse({ success: true, data: { released: true } });
			throw new Error(`Unexpected browser action: ${String(request.action)}`);
		});
		const authorization = createProviderSessionAuthorization({ profiles: { default: { services: {
			chatgpt: { identity: { email: "expected@example.com" } },
		} } } }, { providerId: "chatgpt", auracallRuntimeProfile: "default",
			browserProfile: "chatgpt-pro", managedBrowserProfile: null });
		const result = await observeAgentBrowserProjectResponse({ observationOnly: true, projectId: "g-p-11111111111111111111111111111111",
			browserId: closed.browserId, profileId: closed.profileId, sessionName: closed.sessionName,
			serviceTabHandle: closed, url, recoveryPrompt: "Full original prompt",
			providerSessionAuthorization: authorization, expectedBrowserProcessId: 2696783,
			browserHost: "remote_headed" }, { fetch: fetch as never,
			listStreamFiles: async () => ["/runtime/chatgpt-pro.stream"], readStreamFile: async () => "47777\n" });
		expect(result).toMatchObject({ browserProcessId: 2696783,
			canonicalTargetId: reopened.targetId, recoveredResponse: {
				userMessageId: "u1", answerMessageId: "a1", answerText: "Recovered exact answer",
			} });
		expect(actions).toEqual(["tab_new", "cdp_attach", "evaluate", "evaluate", "evaluate", "cdp_detach", "tab_handle_release"]);
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

	test("reuses a proof-identified retained browser with simultaneous CDP and RDP streams for a new project conversation", async () => {
		const projectUrl = "https://chatgpt.com/g/g-p-11111111111111111111111111111111/project";
		const browserId = "session:auracall-chatgpt";
		const sessionName = "auracall-chatgpt";
		const cdpEndpoint = "ws://127.0.0.1:45521/devtools/browser/proof-runtime";
		const existingHandle = { browserId, profileId: "chatgpt-pro", sessionName,
			targetId: "existing-target", url: "https://chatgpt.com/c/existing", valid: true };
		const projectHandle = { ...existingHandle, targetId: "project-target", url: projectUrl };
		const requests: Array<Record<string, unknown>> = [];
		let opened = false;
		const browser = () => ({
			browserBuild: "stock_chrome", browserBuildProof: { applied: true, browserBuild: "stock_chrome",
				browserPid: 2696783, cdpEndpoint, profileId: "chatgpt-pro" },
			cdpEndpoint, health: "ready", host: "attached_existing", id: browserId, pid: null,
			profileId: "chatgpt-pro", tabHandles: opened ? [existingHandle, projectHandle] : [existingHandle],
			viewStreams: [
				{ provider: "cdp_screencast", controlInput: "cdp_input" },
				{ provider: "rdp_gateway", controlInput: "manual_attached_desktop" },
			],
		});
		const fetch = vi.fn(async (requestUrl: string | URL | Request, init?: RequestInit) => {
			const value = String(requestUrl);
			if (value.endsWith("/api/service/browsers")) {
				return jsonResponse({ success: true, data: { browsers: [browser()] } });
			}
			if (value.includes("/api/service/access-plan?")) {
				expect(value).toContain("browserHost=attached_existing");
				expect(value).toContain("viewStreamProvider=cdp_screencast");
				return jsonResponse({ success: true, data: { selectedProfile: { id: "chatgpt-pro" }, decision: {
					launchPosture: { browserBuild: "stock_chrome" },
					profileReuse: { recommendedAction: "reuse_existing_browser", reusableBrowserId: browserId,
						reusableSessionName: sessionName },
					serviceRequest: { available: true, request: { action: "tab_new", browserId, sessionName,
						url: projectUrl, params: { browserHost: "attached_existing", headless: false,
							viewStreamProvider: "cdp_screencast", controlInputProvider: "cdp_input" } } },
				} } });
			}
			const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
			requests.push(request);
			if (request.action === "tab_new") {
				opened = true;
				return jsonResponse({ success: true, data: { serviceTabHandle: projectHandle,
					sharedAcquisition: { mode: "tab_new", action: "opened_new_tab", tabOpened: true } } });
			}
			return jsonResponse({ success: true, data: {
				browserWebSocketUrl: "ws://127.0.0.1:45521/devtools/browser/proof-runtime", detachRequired: true,
			} });
		});

		const result = await acquireAgentBrowserBrokerTab({ mode: "required", profileId: "chatgpt-pro",
			targetServiceId: "chatgpt", url: projectUrl }, { fetch: fetch as never,
			listStreamFiles: async () => ["/runtime/auracall-chatgpt.stream"],
			readStreamFile: async () => "47777\n" });

		expect(result).toMatchObject({ browserId, browserProcessId: 2696783,
			canonicalTargetId: projectHandle.targetId, serviceTabHandle: projectHandle });
		expect(requests.map(request => request.action)).toEqual(["tab_new", "view_focus", "cdp_attach"]);
	});

	test("non-destructive no-live-browser fixture delegates launch to Agent Browser and persists returned identity before attach", async () => {
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
					data: { serviceTabHandle: handle,
						sharedAcquisition: { mode: "tab_new", action: "opened_new_tab", tabOpened: true } },
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
			acquisitionDecision: "opened_new_tab",
			browserProcessId: 41235,
			browserHost: "local_headless",
			browserId: handle.browserId,
			canonicalTargetId: handle.targetId,
			profileId: handle.profileId,
			serviceTabHandle: handle,
			sessionName: handle.sessionName,
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

	test.each([false, true])("withholds a completed result until detach is verified (observer throws: %s)", async (observerThrows) => {
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
		const onCleanupError = vi.fn<(error: unknown) => void>(() => {
			if (observerThrows) throw new Error("diagnostic observer failed");
		});
		const action = vi.fn(async () => "done");
		await expect(
			withAgentBrowserBrokerCleanup(bridge, action, {
				fetch: fetch as never,
				onCleanupError,
			}),
		).rejects.toMatchObject({
			name: "BrowserAutomationError",
			details: { code: "agent_browser_cleanup_unverified", phase: "after",
				retryable: false, providerOperationCompleted: true },
		});
		expect(onCleanupError).toHaveBeenCalledTimes(1);
		expect(String(onCleanupError.mock.calls[0]?.[0])).toContain("detach was not verified");
		await expect(
			detachAgentBrowserBrokerTab(bridge, { fetch: fetch as never }),
		).resolves.toBeUndefined();
		expect(fetch).toHaveBeenCalledTimes(2);
		expect(bridge.detachState).toBe("detached");
		expect(action).toHaveBeenCalledOnce();
	});
});
