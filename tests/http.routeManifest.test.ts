import { describe, expect, it } from "vitest";
import {
	createHttpEndpointBannerEntries,
	createStaticHttpStatusRoutes,
	extractHttpRoutePath,
	formatHttpEndpointBanner,
	HTTP_ROUTE_MANIFEST,
	matchesHttpRoute,
	matchHttpRoutePath,
} from "../src/http/routeManifest.js";

describe("HTTP route manifest", () => {
	it("projects every advertised static status route without changing its template", () => {
		const routes = createStaticHttpStatusRoutes();
		expect(Object.keys(routes)).toEqual(Object.keys(HTTP_ROUTE_MANIFEST));
		for (const [key, definition] of Object.entries(HTTP_ROUTE_MANIFEST)) {
			expect(routes[key as keyof typeof routes]).toBe(definition.statusTemplate);
		}
		expect(routes.responseBatchesCreate).toBe("/v1/response-batches");
		expect(routes.responseBatchesCancelTemplate).toBe(
			"POST /v1/response-batches/{batch_id}/cancel",
		);
		expect(routes.projectEnsure).toBe("POST /v1/projects/ensure");
		expect(routes.configAgentTemplate).toBe("PUT/DELETE /v1/config/agents/{agent_id}");
		expect(routes.accountMirrorCatalogItemAssetTemplate).toContain("/{item_id}/asset");
	});

	it("formats one method-qualified banner entry per unique manifest path", () => {
		const banner = formatHttpEndpointBanner();
		expect(banner).toContain("POST /v1/response-batches");
		expect(banner).toContain("GET /v1/response-batches/{batch_id}");
		expect(banner).toContain("POST /v1/response-batches/{batch_id}/cancel");
		expect(banner).toContain("GET/POST /status");
		expect(banner).toContain(
			"GET/PATCH/DELETE /v1/account-mirrors/preview-sessions/{preview_session_id}",
		);
		expect(banner).not.toContain("diagnostics=browser-state");
		const entries = createHttpEndpointBannerEntries();
		expect(new Set(entries).size).toBe(entries.length);
		expect(banner.match(/, /gu)?.length ?? 0).toBe(entries.length - 1);
		expect(entries).toContain("GET/POST /v1/archive/materializations");
		expect(entries).toContain("PUT/DELETE /v1/config/agents/{agent_id}");
		expect(entries).toContain("GET/POST /v1/account-mirrors/development-policy");
	});

	it("extracts paths from plain, query, bracketed-query, and request-body templates", () => {
		expect(extractHttpRoutePath("/v1/models")).toBe("/v1/models");
		expect(extractHttpRoutePath("/v1/search[?q={query}]")).toBe("/v1/search");
		expect(extractHttpRoutePath("/v1/models?provider={provider}")).toBe("/v1/models");
		expect(extractHttpRoutePath('POST /v1/handoffs/{id}/resume {"outputDir":"optional"}')).toBe(
			"/v1/handoffs/{id}/resume",
		);
	});

	it("matches exact methods and extracts decoded template parameters", () => {
		expect(matchesHttpRoute("models", "GET", "/v1/models")).toBe(true);
		expect(matchesHttpRoute("models", "POST", "/v1/models")).toBe(false);
		expect(matchesHttpRoute("models", "GET", "/v1/models/extra")).toBe(false);
		expect(matchHttpRoutePath("configAgentTemplate", "/v1/config/agents/research%20agent")).toEqual(
			{ agent_id: "research agent" },
		);
		expect(
			matchesHttpRoute(
				"accountMirrorDevelopmentRunTemplate",
				"PUT",
				"/v1/account-mirrors/development-runs/run_1",
			),
		).toBe(false);
	});

	it("matches every manifest path only for its declared methods", () => {
		const allMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
		for (const [key, definition] of Object.entries(HTTP_ROUTE_MANIFEST)) {
			const pathname = extractHttpRoutePath(definition.statusTemplate).replace(
				/\{[a-z][a-z0-9_]*\}/gu,
				"sample",
			);
			for (const method of allMethods) {
				expect(
					matchesHttpRoute(key as keyof typeof HTTP_ROUTE_MANIFEST, method, pathname),
					`${method} ${pathname} through ${key}`,
				).toBe(definition.methods.includes(method));
			}
		}
	});
});
