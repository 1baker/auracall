import { describe, expect, it } from "vitest";

import {
	buildRuntimeRunsRecentUrl,
	matchesBrowserAuthorityFilter,
	readBrowserAuthorityPresentation,
	readBrowserAuthoritySummaryPresentation,
} from "../ux/console/src/runAuthority.ts";

function statusWithAuthority(browserAuthority: unknown, bridgeMode: unknown = null) {
	return {
		metadata: {
			runtimeDiagnosticsSummary: {
				browserAuthoritySummary: {
					browserAuthority,
					bridgeMode,
				},
			},
		},
	};
}

describe("operator console browser authority presentation", () => {
	it("turns compatibility fallback into a prominent warning", () => {
		expect(
			readBrowserAuthorityPresentation(statusWithAuthority("compatibility-fallback", "auto")),
		).toEqual({
			authority: "compatibility-fallback",
			mode: "auto",
			label: "Compatibility fallback",
			tone: "warning",
			warning: {
				title: "Compatibility browser fallback",
				detail:
					"Agent-browser authority was not established. This run used AuraCall's compatibility browser path (mode auto).",
			},
		});
	});

	it("shows broker authority without a warning", () => {
		expect(
			readBrowserAuthorityPresentation(statusWithAuthority("agent-browser", "required")),
		).toEqual({
			authority: "agent-browser",
			mode: "required",
			label: "Agent-browser broker",
			tone: "ready",
			warning: null,
		});
	});

	it("shows explicit off as an intentional non-warning state", () => {
		expect(readBrowserAuthorityPresentation(statusWithAuthority("explicit-off", "off"))).toEqual({
			authority: "explicit-off",
			mode: "off",
			label: "Compatibility path (explicit off)",
			tone: "draft",
			warning: null,
		});
	});

	it("ignores missing, malformed, and unknown authority summaries", () => {
		expect(readBrowserAuthorityPresentation(null)).toBeNull();
		expect(readBrowserAuthorityPresentation({ metadata: {} })).toBeNull();
		expect(
			readBrowserAuthorityPresentation(statusWithAuthority("future-route", "auto")),
		).toBeNull();
		expect(
			readBrowserAuthorityPresentation(statusWithAuthority("agent-browser", "future-mode")),
		).toEqual({
			authority: "agent-browser",
			mode: null,
			label: "Agent-browser broker",
			tone: "ready",
			warning: null,
		});
	});

	it("reads recent-run summaries without requiring a full status envelope", () => {
		expect(
			readBrowserAuthoritySummaryPresentation({
				browserAuthority: "compatibility-fallback",
				bridgeMode: "auto",
			}),
		).toMatchObject({
			authority: "compatibility-fallback",
			mode: "auto",
			tone: "warning",
		});
	});

	it("filters reported and unreported recent-run authority states", () => {
		const broker = readBrowserAuthoritySummaryPresentation({
			browserAuthority: "agent-browser",
			bridgeMode: "required",
		});
		expect(matchesBrowserAuthorityFilter(broker, "all")).toBe(true);
		expect(matchesBrowserAuthorityFilter(broker, "agent-browser")).toBe(true);
		expect(matchesBrowserAuthorityFilter(broker, "compatibility-fallback")).toBe(false);
		expect(matchesBrowserAuthorityFilter(null, "unreported")).toBe(true);
		expect(matchesBrowserAuthorityFilter(null, "explicit-off")).toBe(false);
	});

	it("builds bounded server-filter URLs for the Runs selector", () => {
		expect(buildRuntimeRunsRecentUrl("all")).toBe("/v1/runtime-runs/recent?limit=50");
		expect(buildRuntimeRunsRecentUrl("compatibility-fallback", 25)).toBe(
			"/v1/runtime-runs/recent?limit=25&browserAuthority=compatibility-fallback",
		);
		expect(buildRuntimeRunsRecentUrl("unreported")).toBe(
			"/v1/runtime-runs/recent?limit=50&browserAuthority=unreported",
		);
	});
});
