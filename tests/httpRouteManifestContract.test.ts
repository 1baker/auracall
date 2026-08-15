import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { collectHttpRouteManifestContractErrors } from "../scripts/httpRouteManifestContract.js";
import { HTTP_ROUTE_MANIFEST } from "../src/http/routeManifest.js";

const readServer = (): string => readFileSync(resolve("src/http/responsesServer.ts"), "utf8");

describe("HTTP route manifest handler contract", () => {
	it("accepts complete manifest references with no raw static API gates", () => {
		expect(
			collectHttpRouteManifestContractErrors({
				httpServerText: readServer(),
				httpRouteManifest: HTTP_ROUTE_MANIFEST,
			}),
		).toEqual([]);
	});

	it("rejects missing and unknown handler references independently", () => {
		const source = readServer();
		const missing = collectHttpRouteManifestContractErrors({
			httpServerText: source.replace('matchesHttpRoute("models"', 'matchesHttpRoute("status"'),
			httpRouteManifest: HTTP_ROUTE_MANIFEST,
		});
		expect(missing).toContain("src/http/responsesServer.ts: missing handler reference for models");

		const unknown = collectHttpRouteManifestContractErrors({
			httpServerText: source.replace(
				'matchesHttpRoute("models"',
				'matchesHttpRoute("notARealRoute"',
			),
			httpRouteManifest: HTTP_ROUTE_MANIFEST,
		});
		expect(
			unknown.some((error) => error.includes("unknown route manifest key notARealRoute")),
		).toBe(true);
	});

	it("rejects a raw static API path gate even when the manifest still declares it", () => {
		const errors = collectHttpRouteManifestContractErrors({
			httpServerText: readServer().replace(
				'if (matchesHttpRoute("models", req.method, url.pathname))',
				'if (req.method === "GET" && url.pathname === "/v1/models")',
			),
			httpRouteManifest: HTTP_ROUTE_MANIFEST,
		});
		expect(
			errors.some((error) => error.includes("raw API path equality bypasses route manifest")),
		).toBe(true);
	});
});
