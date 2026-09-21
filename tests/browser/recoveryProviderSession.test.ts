import { describe, expect, it, vi } from "vitest";
import { createProviderSessionAuthorization } from "../../src/browser/providers/providerSessionAuthority.js";
import { reattachAgentBrowserBrokerTab } from "../../src/browser/service/agentBrowserBridge.js";

describe("recovered browser provider-session proof", () => {
	it.each([
		"match",
		"mismatch",
		"missing",
		"truncated",
		"missing_pid",
	] as const)("%s identity", async (kind) => {
		const authorization = createProviderSessionAuthorization(
			{
				profiles: {
					default: {
						services: { chatgpt: { identity: { email: "expected@example.com" } } },
					},
				},
			},
			{
				providerId: "chatgpt",
				auracallRuntimeProfile: "default",
				browserProfile: "default",
				managedBrowserProfile: "/tmp/recovery-identity",
				browserProcessId: null,
				browserTargetId: null,
			},
		);
		const handle = {
			browserId: "session:retained",
			profileId: "chatgpt-pro",
			sessionName: "retained",
			targetId: "original-target",
			valid: true,
			url: "https://chatgpt.com/c/original-conversation",
		};
		const actions: string[] = [];
		const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
			let data: unknown;
			if (String(url).endsWith("/api/service/browsers")) {
				data = {
					browsers: [
						{
							id: handle.browserId,
							profileId: handle.profileId,
							health: "ready",
							pid: kind === "missing_pid" ? null : 12345,
							tabHandles: [handle],
						},
					],
				};
			} else {
				const body = JSON.parse(String(init?.body));
				actions.push(body.action);
				expect(body.serviceTabHandle).toEqual(handle);
				data =
					body.action === "evaluate"
						? {
								result:
									kind === "missing"
										? null
										: {
												user: {
													email: kind === "mismatch" ? "wrong@example.com" : "expected@example.com",
												},
											},
								resultTruncated: kind === "truncated",
							}
						: {
								browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/test",
								detachRequired: true,
							};
			}
			return new Response(JSON.stringify({ success: true, data }), { status: 200 });
		});
		const recovery = reattachAgentBrowserBrokerTab(
			{
				...handle,
				serviceTabHandle: handle,
				baseUrl: "http://127.0.0.1:47777",
				providerSessionAuthorization: authorization,
			},
			{
				fetch: fetch as never,
				listStreamFiles: async () => ["/runtime/retained.stream"],
				readStreamFile: async () => "47777\n",
			},
		);
		if (kind === "match") {
			await recovery;
			expect(authorization.proof).toMatchObject({
				verdict: "match",
				providerId: "chatgpt",
				provenance: { browserProcessId: 12345, browserTargetId: "original-target" },
			});
			expect(actions).toEqual(["evaluate", "cdp_attach"]);
		} else {
			await expect(recovery).rejects.toThrow();
			expect(actions).toEqual(kind === "missing_pid" ? [] : ["evaluate"]);
			expect(authorization.proof?.verdict).not.toBe("match");
		}
	});
});
