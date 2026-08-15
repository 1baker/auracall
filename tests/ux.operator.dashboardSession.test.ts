import fs from "node:fs/promises";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { createResponsesHttpServer } from "../src/http/responsesServer.js";

describe("operator dashboard session UX", () => {
	it("exchanges transient operator keys without browser storage in the React dashboard", async () => {
		const source = await fs.readFile("ux/operator/src/App.jsx", "utf8");

		expect(source).toContain('const DASHBOARD_SESSION_PATH = "/v1/dashboard/session";');
		expect(source).toContain('credentials: "same-origin"');
		expect(source).toContain('method: "POST"');
		expect(source).toContain("headers: { authorization: `Bearer $" + "{apiKey}` }");
		expect(source).toContain('method: "DELETE"');
		expect(source).toContain('window.location.protocol === "https:"');
		expect(source).toContain('setApiKey("");');
		expect(source).toContain("loginReady === false");
		expect(source).toContain("no unscoped operator API key is loaded");
		expect(source).toContain("disabled={loading || !secureContext || loginUnavailable}");
		expect(source).not.toContain("sessionStorage");
		expect(source).not.toMatch(/localStorage\.(?:getItem|setItem)\([^\n]*(?:api.?key|session)/iu);
	});

	it("gates the built-in debug dashboard with the same no-storage exchange", async () => {
		const server = await createResponsesHttpServer({ host: "127.0.0.1", port: 0 });
		try {
			const sessionResponse = await fetch(
				`http://127.0.0.1:${server.port}/v1/dashboard/session`,
			);
			await expect(sessionResponse.json()).resolves.toMatchObject({
				mode: "auth_disabled",
				loginReady: false,
			});
			const response = await fetch(`http://127.0.0.1:${server.port}/ops/browser`);
			expect(response.status).toBe(200);
			const html = await response.text();
			expect(html).toContain("/v1/dashboard/session");
			expect(html).toContain("Unscoped operator API key");
			expect(html).toContain("Start 15-minute secure session");
			expect(html).toContain("credentials: 'same-origin'");
			expect(html).toContain("headers: { authorization: 'Bearer ' + apiKey }");
			expect(html).toContain("window.location.protocol === 'https:'");
			expect(html).toContain("payload?.loginReady !== false");
			expect(html).toContain("no unscoped operator API key is loaded");
			expect(html).toContain("$('dashboardAuthForm').hidden = !loginReady");
			expect(html).not.toContain("sessionStorage");
			const inlineScript = html.match(/<script>([\s\S]*)<\/script>/u)?.[1];
			expect(inlineScript).toBeDefined();
			if (!inlineScript) throw new Error("Built-in dashboard inline script was not found.");
			expect(() => new Script(inlineScript)).not.toThrow();
		} finally {
			await server.close();
		}
	});
});
