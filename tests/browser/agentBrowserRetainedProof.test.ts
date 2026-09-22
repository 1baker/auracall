import { describe, expect, it, vi } from "vitest";
import { acquireAgentBrowserBrokerTab } from "../../src/browser/service/agentBrowserBridge.js";

const projectUrl = "https://chatgpt.com/g/g-p-11111111111111111111111111111111/project";
const cdpEndpoint = "ws://127.0.0.1:45521/devtools/browser/proof-runtime";
const handle = { browserId: "session:retained", profileId: "chatgpt-pro", sessionName: "retained",
	targetId: "existing", url: "https://chatgpt.com/c/existing", valid: true };

function jsonResponse(body: unknown): Response {
	return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
}

function retainedBrowser(overrides: Record<string, unknown> = {}) {
	return { browserBuild: "stock_chrome", browserBuildProof: { applied: true, browserBuild: "stock_chrome",
		browserPid: 2696783, cdpEndpoint, profileId: "chatgpt-pro" }, cdpEndpoint, health: "ready",
		host: "attached_existing", id: handle.browserId, pid: null, profileId: handle.profileId,
		tabHandles: [handle], viewStreams: [{ provider: "cdp_screencast", controlInput: "cdp_input" }],
		...overrides };
}

const dependencies = (fetch: typeof globalThis.fetch) => ({ fetch,
	listStreamFiles: async () => ["/runtime/retained.stream"], readStreamFile: async () => "40619\n" });

describe("retained browser proof acquisition", () => {
	it("rejects contradictory process proof before requesting a tab", async () => {
		const requests: Array<Record<string, unknown>> = [];
		const browser = retainedBrowser({ browserBuildProof: { applied: true, browserBuild: "stock_chrome",
			browserPid: 2696783, cdpEndpoint: "ws://127.0.0.1:45521/devtools/browser/other",
			profileId: "chatgpt-pro" } });
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			if (String(url).endsWith("/api/service/browsers")) return jsonResponse({ success: true, data: { browsers: [browser] } });
			if (String(url).includes("/api/service/access-plan?")) return jsonResponse({ success: true, data: {
				selectedProfile: { id: "chatgpt-pro" }, decision: { profileReuse: {
					recommendedAction: "reuse_existing_browser", reusableBrowserId: handle.browserId,
					reusableSessionName: handle.sessionName }, serviceRequest: { available: true,
					request: { action: "tab_new", browserId: handle.browserId, sessionName: handle.sessionName,
						url: projectUrl } } } } });
			requests.push(JSON.parse(String(init?.body)));
			return jsonResponse({ success: true });
		});
		await expect(acquireAgentBrowserBrokerTab({ mode: "required", profileId: "chatgpt-pro",
			targetServiceId: "chatgpt", url: projectUrl }, dependencies(fetch as never)))
			.rejects.toThrow("cold start requires one unambiguous access-plan browser launch");
		expect(requests).toEqual([]);
	});

	it("rejects an unknown ambiguous stream set before access planning", async () => {
		const fetch = vi.fn(async (url: string | URL | Request) => {
			if (String(url).endsWith("/api/service/browsers")) return jsonResponse({ success: true, data: { browsers: [
				retainedBrowser({ viewStreams: [{ provider: "rdp_gateway", controlInput: "manual_attached_desktop" },
					{ provider: "novnc", controlInput: "vnc_input" }] }),
			] } });
			throw new Error("access planning must not run for ambiguous retained streams");
		});
		await expect(acquireAgentBrowserBrokerTab({ mode: "required", profileId: "chatgpt-pro",
			targetServiceId: "chatgpt", url: projectUrl }, dependencies(fetch as never)))
			.rejects.toThrow("retained session or display posture is missing or ambiguous");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("rejects process identity drift during the final retained-browser check", async () => {
		let inventoryReads = 0;
		const requests: Array<Record<string, unknown>> = [];
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			if (String(url).endsWith("/api/service/browsers")) {
				inventoryReads += 1;
				const proofPid = inventoryReads === 1 ? 2696783 : 2696784;
				return jsonResponse({ success: true, data: { browsers: [retainedBrowser({ browserBuildProof: {
					applied: true, browserBuild: "stock_chrome", browserPid: proofPid, cdpEndpoint,
					profileId: "chatgpt-pro" } })] } });
			}
			if (String(url).includes("/api/service/access-plan?")) return jsonResponse({ success: true, data: {
				selectedProfile: { id: "chatgpt-pro" }, decision: { profileReuse: {
					recommendedAction: "reuse_existing_browser", reusableBrowserId: handle.browserId,
					reusableSessionName: handle.sessionName }, serviceRequest: { available: true, request: {
					action: "tab_new", browserId: handle.browserId, sessionName: handle.sessionName, url: projectUrl,
					params: { browserHost: "attached_existing", viewStreamProvider: "cdp_screencast",
						controlInputProvider: "cdp_input" } } } } } });
			requests.push(JSON.parse(String(init?.body)));
			return jsonResponse({ success: true });
		});
		await expect(acquireAgentBrowserBrokerTab({ mode: "required", profileId: "chatgpt-pro",
			targetServiceId: "chatgpt", url: projectUrl }, dependencies(fetch as never)))
			.rejects.toThrow("retained browser authority is stale or ambiguous");
		expect(requests).toEqual([]);
	});
});
