import { expect, it, vi } from "vitest";
import { reattachAgentBrowserBrokerTab } from "../../src/browser/service/agentBrowserBridge.js";

it.each([
	true,
	false,
])("binds the original response even when the retained target is unchanged (%s)", async (matching) => {
	const handle = {
		browserId: "session:recovery",
		profileId: "chatgpt-pro",
		sessionName: "recovery",
		targetId: "unchanged-target",
		url: "https://chatgpt.com/c/recovery",
		valid: true,
	};
	const actions: string[] = [];
	const fetch = vi.fn(async (url: unknown, init?: RequestInit) => {
		let data: unknown;
		if (String(url).endsWith("/api/service/browsers")) {
			data = {
				browsers: [
					{
						id: handle.browserId,
						profileId: handle.profileId,
						health: "ready",
						pid: 123,
						tabHandles: [handle],
					},
				],
			};
		} else {
			const request = JSON.parse(String(init?.body));
			actions.push(request.action);
			expect(request.serviceTabHandle).toEqual(handle);
			data =
				request.action === "evaluate"
					? {
							result: {
								url: handle.url,
								generating: false,
								messages: [
									{
										role: "user",
										id: "original-user",
										text: matching ? "Original prompt" : "Wrong prompt",
									},
									{ role: "assistant", id: "original-answer", text: "Original answer" },
									{ role: "user", id: "later-user", text: "Unrelated later prompt" },
									{ role: "assistant", id: "later-answer", text: "Do not return this answer" },
								],
							},
						}
					: { browserWebSocketUrl: "ws://127.0.0.1:49505/devtools/browser/recovery" };
		}
		return new Response(JSON.stringify({ success: true, data }), { status: 200 });
	});
	const result = reattachAgentBrowserBrokerTab(
		{
			...handle,
			serviceTabHandle: handle,
			recoveryPrompt: "Original prompt",
		},
		{
			fetch: fetch as never,
			listStreamFiles: async () => ["/runtime/recovery.stream"],
			readStreamFile: async () => "47777\n",
		},
	);
	if (matching) {
		expect(await result).toMatchObject({
			recoveredResponse: {
				userMessageId: "original-user",
				answerMessageId: "original-answer",
				answerText: "Original answer",
			},
		});
		expect(actions).toEqual(["evaluate", "cdp_attach"]);
	} else {
		await expect(result).rejects.toThrow("not uniquely bound");
		expect(actions).toEqual(["evaluate"]);
	}
});
