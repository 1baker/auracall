#!/usr/bin/env tsx
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { setAuracallHomeDirOverrideForTest } from "../src/auracallHome.js";
import { createResponsesHttpServer } from "../src/http/responsesServer.js";

async function main(): Promise<void> {
	const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-console-search-ux-smoke-"));
	setAuracallHomeDirOverrideForTest(homeDir);
	const server = await createResponsesHttpServer(
		{
			host: "127.0.0.1",
			port: 0,
			accountMirrorSchedulerIntervalMs: 0,
			recoverRunsOnStart: false,
		},
		{
			searchProjectionService: { search: async () => searchFixture() as never },
		},
	);
	let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
	try {
		if (process.env.AURACALL_CONSOLE_UX_SMOKE_SERVER_ONLY === "1") {
			console.log(`CONSOLE_SEARCH_SMOKE_URL=http://127.0.0.1:${server.port}/console?view=search`);
			await waitForShutdownSignal();
			return;
		}
		browser = await puppeteer.launch({
			executablePath: await resolveChromeExecutable(),
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();
		const pageErrors: string[] = [];
		page.on("pageerror", (error: unknown) => {
			pageErrors.push(error instanceof Error ? error.message : String(error));
		});
		await page.setViewport({ width: 1440, height: 980, deviceScaleFactor: 1 });
		const url = `http://127.0.0.1:${server.port}/console?view=search&searchProvider=chatgpt&project=Transcripts&assets=available`;
		await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
		await page.waitForSelector(".search-viewport", { timeout: 15_000 });
		await assertSearchSurface(page, "desktop", true);

		await page.focus(".search-viewport");
		await page.keyboard.press("ArrowDown");
		await page.waitForFunction(
			() =>
				document
					.querySelector(".search-result-row[aria-selected=true]")
					?.textContent?.includes("Mirrored research conversation"),
			{ timeout: 5_000 },
		);
		const selectedRows = await page.$$eval(
			".search-result-row[aria-selected=true]",
			(rows) => rows.length,
		);
		if (selectedRows !== 1)
			throw new Error(`keyboard selection expected one selected row, got ${selectedRows}.`);

		await page.setViewport({ width: 390, height: 860, deviceScaleFactor: 1 });
		await page.reload({ waitUntil: "networkidle2", timeout: 30_000 });
		await page.waitForSelector(".search-viewport", { timeout: 15_000 });
		await assertSearchSurface(page, "mobile", false);
		const horizontalOverflow = await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
		);
		if (horizontalOverflow)
			throw new Error("mobile console Search has page-level horizontal overflow.");
		if (pageErrors.length) throw new Error(`console Search page errors: ${pageErrors.join("; ")}`);

		console.log(
			JSON.stringify(
				{
					ok: true,
					port: server.port,
					checks: {
						desktopDenseTable: "ok",
						knownValueFacets: "ok",
						stableRowUrl: "ok",
						keyboardSelection: "ok",
						productInspector: "ok",
						mobileLayout: "ok",
						mobileHorizontalOverflow: false,
					},
				},
				null,
				2,
			),
		);
	} finally {
		await browser?.close().catch(() => undefined);
		await server.close();
		setAuracallHomeDirOverrideForTest(null);
		await fs.rm(homeDir, { recursive: true, force: true }).catch(() => undefined);
	}
}

async function waitForShutdownSignal(): Promise<void> {
	await new Promise<void>((resolve) => {
		process.once("SIGINT", resolve);
		process.once("SIGTERM", resolve);
	});
}

async function assertSearchSurface(
	page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
	label: string,
	expectContextColumn: boolean,
): Promise<void> {
	const state = await page.evaluate(() => ({
		heading: document.querySelector("h1")?.textContent,
		rowCount: document.querySelectorAll(".search-result-row").length,
		facetCount: document.querySelectorAll(".search-facet select").length,
		hasContextColumn: [...document.querySelectorAll(".search-table-head [role=columnheader]")].some(
			(element) =>
				element.textContent?.includes("Tenant / project") &&
				getComputedStyle(element).display !== "none",
		),
		hasInspectorSummary: document
			.querySelector(".search-inspector")
			?.textContent?.includes("Cached polymer readout"),
		hasProviderAction: Boolean(document.querySelector('.search-inspector a[href^="https://"]')),
		hasAssetAction: Boolean(document.querySelector(".search-inspector a[download]")),
	}));
	if (state.heading !== "Search" || state.rowCount !== 2 || state.facetCount !== 6) {
		throw new Error(`${label} console Search surface drifted: ${JSON.stringify(state)}.`);
	}
	if (state.hasContextColumn !== expectContextColumn) {
		throw new Error(
			`${label} console Search responsive columns drifted: ${JSON.stringify(state)}.`,
		);
	}
	if (!state.hasInspectorSummary || !state.hasProviderAction || !state.hasAssetAction) {
		throw new Error(`${label} console Search inspector actions drifted: ${JSON.stringify(state)}.`);
	}
}

function searchFixture(): Record<string, unknown> {
	const rows = [
		{
			id: "archive:generated_artifact:resp_1:polymer_readout.json",
			object: "search_result_row",
			source: "run_archive",
			sourceKind: "generated_artifact",
			kind: "artifact",
			title: "Cached polymer readout",
			summary: "Verified cached evidence from the latest run.",
			provider: "chatgpt",
			runtimeProfileId: "wsl-chrome-3",
			browserProfileId: "wsl-chrome-3",
			tenant: "research@example.com",
			projectId: "Transcripts",
			status: "succeeded",
			runtimeState: "terminal",
			sortTime: "2026-08-20T14:00:00.000Z",
			updatedAt: "2026-08-20T14:00:00.000Z",
			itemId: "generated_artifact:resp_1:polymer_readout.json",
			counts: { messages: null, files: 0, artifacts: 1 },
			links: {
				provider: "https://chatgpt.com/c/resp_1",
				archiveItem: "/v1/archive/items/b64/c21va2U",
				asset: "/v1/archive/items/b64/c21va2U/asset",
			},
			metadata: { responseId: "resp_1", fileAvailable: true, materializationStatus: "succeeded" },
		},
		{
			id: "catalog:conversations:gemini:default:conv_1",
			object: "search_result_row",
			source: "account_mirror",
			sourceKind: "conversations",
			kind: "conversation",
			title: "Mirrored research conversation",
			summary: "Transcript and attachments are indexed.",
			provider: "gemini",
			runtimeProfileId: "default",
			browserProfileId: "default",
			tenant: "research@example.com",
			projectId: "Research",
			status: "cached",
			runtimeState: null,
			sortTime: "2026-08-20T13:00:00.000Z",
			updatedAt: "2026-08-20T13:00:00.000Z",
			itemId: "conv_1",
			counts: { messages: 8, files: 2, artifacts: 0 },
			links: { provider: "https://gemini.google.com/app/conv_1" },
			metadata: {},
		},
	];
	return {
		object: "search_results",
		generatedAt: "2026-08-20T14:00:00.000Z",
		query: {},
		rows,
		nextCursor: null,
		metrics: { total: rows.length, returned: rows.length },
		facets: {
			providers: [
				{ value: "chatgpt", count: 1 },
				{ value: "gemini", count: 1 },
			],
			tenants: [{ value: "research@example.com", count: 2 }],
			projects: [
				{ value: "Transcripts", count: 1 },
				{ value: "Research", count: 1 },
			],
			runtimeProfiles: [
				{ value: "wsl-chrome-3", count: 1 },
				{ value: "default", count: 1 },
			],
			kinds: [
				{ value: "artifact", count: 1 },
				{ value: "conversation", count: 1 },
			],
			statuses: [
				{ value: "succeeded", count: 1 },
				{ value: "cached", count: 1 },
			],
			assetAvailability: [
				{ value: "available", count: 1 },
				{ value: "pending", count: 1 },
			],
			materialization: [{ value: "succeeded", count: 1 }],
		},
	};
}

async function resolveChromeExecutable(): Promise<string> {
	const candidates = [
		process.env.AURACALL_CONSOLE_UX_SMOKE_CHROME_PATH,
		process.env.PUPPETEER_EXECUTABLE_PATH,
		"/snap/bin/chromium",
		"/usr/bin/chromium",
		"/usr/bin/chromium-browser",
		"/usr/bin/google-chrome",
		"/usr/bin/google-chrome-stable",
	].filter(Boolean) as string[];
	for (const candidate of candidates) {
		try {
			await fs.access(candidate);
			return candidate;
		} catch {
			// Try the next known local browser path.
		}
	}
	throw new Error(
		"No Chromium executable found for console Search UX smoke. Set AURACALL_CONSOLE_UX_SMOKE_CHROME_PATH.",
	);
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
