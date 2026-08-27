import { describe, expect, it } from "vitest";
import {
	buildConsoleSearchLocation,
	buildSearchRequestUrl,
	calculateVirtualWindow,
	clearUnknownSearchFacets,
	decodeSearchRowId,
	EMPTY_SEARCH_STATE,
	encodeSearchRowId,
	mergeSearchRows,
	readConsoleSearchRoute,
	SEARCH_PAGE_LIMIT,
} from "../ux/console/src/search.js";

describe("greenfield console Search contract", () => {
	it("round-trips bounded URL state and opaque row ids", () => {
		const state = {
			...EMPTY_SEARCH_STATE,
			query: "polymer readout",
			provider: "chatgpt",
			tenant: "research@example.com",
			project: "Transcripts",
			kind: "artifact",
			status: "succeeded",
			assetAvailability: "available",
		};
		const rowId = "archive:generated_artifact:resp/1:Δ.json";
		const location = buildConsoleSearchLocation("/console", state, rowId);

		expect(location).toContain("view=search");
		expect(location).toContain("searchProvider=chatgpt");
		expect(location).not.toContain(rowId);
		expect(readConsoleSearchRoute(new URL(location, "http://localhost").search)).toEqual({
			state,
			rowId,
		});
		expect(decodeSearchRowId(encodeSearchRowId(rowId))).toBe(rowId);
		expect(decodeSearchRowId("not+base64")).toBe("");
	});

	it("builds a GET-only bounded search request including the project facet", () => {
		const url = new URL(
			buildSearchRequestUrl(
				{
					...EMPTY_SEARCH_STATE,
					query: "readout",
					provider: "chatgpt",
					project: "Transcripts",
					assetAvailability: "available",
				},
				"cursor-2",
			),
			"http://localhost",
		);

		expect(url.pathname).toBe("/v1/search");
		expect(Object.fromEntries(url.searchParams)).toMatchObject({
			q: "readout",
			provider: "chatgpt",
			project: "Transcripts",
			assetAvailability: "available",
			cursor: "cursor-2",
			limit: String(SEARCH_PAGE_LIMIT),
		});
	});

	it("deduplicates cursor pages and bounds the rendered virtual window", () => {
		expect(
			mergeSearchRows([{ id: "a", title: "old" }], [{ id: "a", title: "new" }, { id: "b" }]),
		).toEqual([{ id: "a", title: "new" }, { id: "b" }]);
		expect(calculateVirtualWindow(1_000, 680, 520, 2)).toEqual({
			start: 8,
			end: 20,
			top: 544,
			bottom: 66_640,
		});
	});

	it("clears URL facet values that the projection does not recognize", () => {
		expect(
			clearUnknownSearchFacets(
				{
					...EMPTY_SEARCH_STATE,
					provider: "made-up-provider",
					project: "Transcripts",
					assetAvailability: "available",
				},
				{
					providers: [{ value: "chatgpt" }],
					projects: [{ value: "Transcripts" }],
					assetAvailability: [{ value: "available" }],
				},
			),
		).toMatchObject({
			provider: "",
			project: "Transcripts",
			assetAvailability: "available",
		});
	});
});
