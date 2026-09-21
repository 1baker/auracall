import { describe, expect, test, vi } from "vitest";
import {
	acquireAgentBrowserBrokerTab,
	AgentBrowserAttachmentCleanupError,
	reattachAgentBrowserBrokerTab,
} from "../../src/browser/service/agentBrowserBridge.js";

const handle = {
	browserId: "session:retained", profileId: "chatgpt-pro", sessionName: "retained",
	targetId: "exact-target", url: "https://chatgpt.com/c/exact-response", valid: true,
};

function fixture(endpoint: unknown, detachFails = false, abortAfterAttach = false, openedNew = false) {
	const requests: Array<Record<string, unknown>> = [];
	const controller = new AbortController();
	const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
		const reply = (data: unknown) => Response.json({ success: true, data });
		if (String(url).endsWith("/api/service/browsers")) {
			return reply({ browsers: [{ id: handle.browserId, pid: 41234, health: "ready",
				profileId: handle.profileId, tabHandles: [handle] }] });
		}
		if (String(url).includes("/api/service/access-plan?")) {
			return reply({ selectedProfile: { id: handle.profileId }, decision: {
				profileReuse: { recommendedAction: "reuse_existing_browser" },
				serviceRequest: { available: true, request: { action: "tab_new", url: handle.url,
					browserId: handle.browserId, sessionName: handle.sessionName } },
			} });
		}
		const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
		requests.push(request);
		if (request.action === "tab_new") {
			return reply({ serviceTabHandle: handle, ...(openedNew ? {
				sharedAcquisition: { action: "opened_new_tab", mode: "tab_new", tabOpened: true },
			} : {}) });
		}
		if (request.action === "cdp_attach") {
			if (abortAfterAttach) controller.abort(new Error("synthetic cancellation"));
			return reply({ browserWebSocketUrl: endpoint, detachRequired: true });
		}
		if (request.action === "cdp_detach") {
			expect(init?.signal?.aborted).toBe(false);
			return reply({ detached: !detachFails });
		}
		if (request.action === "tab_handle_release") return reply({ released: true });
		throw new Error(`Unexpected action ${String(request.action)}`);
	});
	const dependencies = { fetch: fetch as typeof globalThis.fetch,
		listStreamFiles: async () => ["/fixture/dashboard-service-backend.stream"],
		readStreamFile: async () => "47777" };
	return { requests, run: (lane: "initial" | "recovery") => lane === "initial"
		? acquireAgentBrowserBrokerTab({ mode: "required", targetServiceId: "chatgpt",
			profileId: handle.profileId, url: handle.url, abortSignal: controller.signal }, dependencies)
		: reattachAgentBrowserBrokerTab({ ...handle, serviceTabHandle: handle,
			baseUrl: "http://127.0.0.1:47777", abortSignal: controller.signal }, dependencies) };
}

describe.each(["initial", "recovery"] as const)("%s attachment admission", (lane) => {
	test.each([
		undefined,
		"not a URL synthetic-secret",
		"http://127.0.0.1:9222/devtools/browser/id",
		"wss://127.0.0.1:9222/devtools/browser/id",
		"ws://user:synthetic-secret@127.0.0.1:9222/devtools/browser/id",
		"ws://127.0.0.1:9222/devtools/browser/id?token=synthetic-secret",
		"ws://127.0.0.1:9222/broker/capability/synthetic-secret",
	])("reconciles an unsupported endpoint without replay (%s)", async (endpoint) => {
		const { requests, run } = fixture(endpoint);
		const error = await run(lane).catch((failure: unknown) => failure);
		expect(error).toBeInstanceOf(Error);
		expect(String(error)).not.toContain("synthetic-secret");
		expect(requests.filter((request) => request.action === "cdp_attach")).toHaveLength(1);
		expect(requests.filter((request) => request.action === "cdp_detach")).toHaveLength(1);
		expect(requests.at(-1)?.serviceTabHandle).toEqual(handle);
		expect(requests.every((request) => ["tab_new", "cdp_attach", "cdp_detach"].includes(String(request.action)))).toBe(true);
	});

	test("cleanup survives cancellation after attachment", async () => {
		const { requests, run } = fixture(undefined, false, true);
		await expect(run(lane)).rejects.toThrow("WebSocket URL");
		expect(requests.filter((request) => request.action === "cdp_detach")).toHaveLength(1);
	});

	test("propagates matching detach failure instead of reporting clean rejection", async () => {
		const { requests, run } = fixture(undefined, true);
		await expect(run(lane)).rejects.toThrow("endpoint validation and matching detach both failed");
		expect(requests.filter((request) => request.action === "cdp_attach")).toHaveLength(1);
		expect(requests.filter((request) => request.action === "cdp_detach")).toHaveLength(1);
	});
});

test.each([false, true])("new tab release waits for verified detach (failure=%s)", async (detachFails) => {
	const { requests, run } = fixture(undefined, detachFails, false, true);
	const error = await run("initial").catch((failure: unknown) => failure);
	expect(error).toBeInstanceOf(Error);
	if (detachFails) {
		expect(error).toBeInstanceOf(AgentBrowserAttachmentCleanupError);
		if (!(error instanceof AgentBrowserAttachmentCleanupError)) throw new Error("missing cleanup evidence");
		expect(error.bridge.serviceTabHandle).toEqual(handle);
		expect(error.errors).toHaveLength(2);
	}
	expect(requests.map((request) => request.action)).toEqual([
		"tab_new", "cdp_attach", "cdp_detach", ...(detachFails ? [] : ["tab_handle_release"]),
	]);
});
