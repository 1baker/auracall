// biome-ignore-all lint/style/noNonNullAssertion: fixture setup establishes the exact artifact fields asserted below.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, expect, test, vi } from "vitest";
import {
	buildChatgptArtifactViewerActionExpression,
	fileRefFromChatgptDownloadedArtifactForTest,
	waitForSingleChatgptDownloadedFileForTest,
} from "../../src/browser/providers/chatgptAdapter.js";

test("viewer download excludes background dialogs and requires exact filename", () => {
	class Element {
		click = vi.fn();
		innerText = "";
		constructor(
			public name: string,
			public hidden = false,
			public control = false,
		) {}
		closest() {
			return this.hidden ? this : null;
		}
		getBoundingClientRect() {
			return { width: 100, height: 100 };
		}
		getAttribute(key: string) {
			return key === "aria-label" && this.control ? "Download" : this.name;
		}
		querySelector() {
			return this;
		}
		querySelectorAll() {
			return [this.button];
		}
		button: Element | undefined;
	}
	const old = new Element("final-thought.docx", true);
	old.button = new Element("Download", false, true);
	const current = new Element("final-thought.docx");
	current.button = new Element("Download", false, true);
	const evaluate = (title: string, dialogs: Element[]) =>
		new Function(
			"document",
			"HTMLElement",
			"getComputedStyle",
			`return ${buildChatgptArtifactViewerActionExpression("download", title)}`,
		)({ querySelectorAll: () => dialogs }, Element, () => ({ visibility: "visible" }));
	expect(evaluate("final-thought.docx", [old, current]).ok).toBe(true);
	expect(old.button.click).not.toHaveBeenCalled();
	expect(current.button.click).toHaveBeenCalledOnce();
	expect(evaluate("final-thought.pdf", [old, current]).ok).toBe(false);
	expect(evaluate("final-thought.docx", [current, current]).ok).toBe(false);
});

test("downloads from an exact-name preview panel without a dialog role", () => {
	class Element {
		click = vi.fn();
		innerText = "";
		disabled = false;
		closest() { return null; }
		getBoundingClientRect() { return { width: 100, height: 100 }; }
		getAttribute(key: string): string | null { return key === "aria-label" ? null : "final-thought.docx"; }
		querySelector() { return this; }
		querySelectorAll() { return [button]; }
	}
	const panel = new Element();
	const button = new Element();
	button.getAttribute = key => key === "aria-label" ? "Download" : null;
	const evaluate = (title: string) => new Function("document", "HTMLElement", "getComputedStyle",
		`return ${buildChatgptArtifactViewerActionExpression("download", title)}`)(
		{ querySelectorAll: (selector: string) => selector.includes('artifact-preview-surface-shell') ? [panel] : [] },
		Element, () => ({ visibility: "visible" }));
	expect(evaluate("final-thought.pdf").ok).toBe(false);
	expect(button.click).not.toHaveBeenCalled();
	expect(evaluate("final-thought.docx").ok).toBe(true);
	expect(button.click).toHaveBeenCalledOnce();
});

const directories: string[] = [];

test.each(["docx", "pdf"])("canonicalizes a proven timestamp %s while preserving bytes and original", async extension => {
	const original = await downloaded(`final-thought(20260911-210348).${extension}`);
	const result = await fileRefFromChatgptDownloadedArtifactForTest({ ...artifact, title: `final-thought.${extension}` }, original, {});
	expect(result.name).toBe(`final-thought.${extension}`);
	expect(await fs.readFile(result.localPath!)).toEqual(await fs.readFile(original));
	expect(result.metadata).toMatchObject({ filenameCanonicalization: "exact-response-control-timestamp-suffix", originalDownloadedPath: original, boundMessageId: "current" });
});

test.each([
	{ name: "final-thought(20260911-210348).docx", override: { messageId: undefined } },
	{ name: "final-thought(20260911-210348).docx", override: { uri: "chatgpt://download-button/other/0" } },
	{ name: "final-thought(20260911-210348).docx", override: { id: "download-dom:other:0" } },
	{ name: "other(20260911-210348).docx", override: {} },
	{ name: "Final-thought(20260911-210348).docx", override: {} },
	{ name: "final-thought(20260911-210348).pdf", override: {} },
	{ name: "final-thought(20260911-210348).DOCX", override: {} },
	{ name: "final-thought(20260230-210348).docx", override: {} },
	{ name: "final-thought(20260229-210348).docx", override: {} },
	{ name: "final-thought(20261311-210348).docx", override: {} },
	{ name: "final-thought(20260911-240348).docx", override: {} },
	{ name: "final-thought(20260911-216048).docx", override: {} },
	{ name: "final-thought(20260911-210360).docx", override: {} },
	{ name: "final-thought(0)(20260911-210348).docx", override: {} },
	{ name: "final-thought(20260911-210348)(1).docx", override: {} },
])("rejects unproven or invalid timestamp $name $override", async ({ name, override }) => {
	await expect(fileRefFromChatgptDownloadedArtifactForTest({ ...artifact, ...override }, await downloaded(name), {})).rejects.toThrow();
});
afterEach(async () => {
	vi.restoreAllMocks();
	for (const directory of directories.splice(0)) await fs.rm(directory, { recursive: true });
});

test("does not accept a completed file while an intended download is partial", async () => {
	const file = await downloaded("final-thought.docx");
	await fs.writeFile(path.join(path.dirname(file), "intended.crdownload"), "partial");
	expect(await waitForSingleChatgptDownloadedFileForTest(path.dirname(file), 300)).toBeNull();
});

test("rejects multiple completed downloads instead of picking alphabetically", async () => {
	const file = await downloaded("final-thought.docx");
	await fs.writeFile(path.join(path.dirname(file), "other.pdf"), "other");
	await expect(waitForSingleChatgptDownloadedFileForTest(path.dirname(file), 300)).rejects.toThrow(
		"multiple browser downloads",
	);
});

async function downloaded(name: string) {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), "artifact-binding-test-"));
	directories.push(directory);
	const file = path.join(directory, name);
	await fs.writeFile(file, "synthetic bytes");
	return file;
}

const artifact = {
	id: "download-dom:current:0",
	kind: "download" as const,
	title: "final-thought.docx",
	messageId: "current",
	uri: "chatgpt://download-button/current/0",
};

test("rejects a ZIP delivered to the DOCX control", async () => {
	await expect(
		fileRefFromChatgptDownloadedArtifactForTest(
			artifact,
			await downloaded("final-thought-artifacts.zip"),
			{},
		),
	).rejects.toThrow("filename does not match");
});

test("rejects another document with a different stem", async () => {
	await expect(
		fileRefFromChatgptDownloadedArtifactForTest(
			artifact,
			await downloaded("older-document.docx"),
			{},
		),
	).rejects.toThrow("filename does not match");
});

test("accepts the exact selected filename", async () => {
	const result = await fileRefFromChatgptDownloadedArtifactForTest(
		artifact,
		await downloaded("final-thought.docx"),
		{},
	);
	expect(result.name).toBe("final-thought.docx");
	expect(result.id).toBe(artifact.id);
});

test("accepts browser collision suffix without accepting another extension", async () => {
	const original = await downloaded("final-thought (1).docx");
	const result = await fileRefFromChatgptDownloadedArtifactForTest(
		artifact,
		original,
		{},
	);
	expect(result.name).toBe("final-thought.docx");
	expect(path.basename(result.localPath!)).toBe("final-thought.docx");
	expect(await fs.readFile(result.localPath!)).toEqual(await fs.readFile(original));
	expect(result.metadata).toMatchObject({ originalDownloadedPath: original,
		filenameCanonicalization: "exact-response-control-browser-collision", boundMessageId: "current", boundArtifactId: artifact.id });
});

test.each([
	{ override: { messageId: undefined }, name: "final-thought(5).docx" },
	{ override: { uri: "chatgpt://download-button/other/0" }, name: "final-thought(5).docx" },
	{ override: { id: "download-dom:other:0" }, name: "final-thought(5).docx" },
	{ override: { title: "final-thought(7).docx" }, name: "final-thought(5).docx" },
	{ override: { title: "../final-thought.docx" }, name: "final-thought(5).docx" },
	{ override: {}, name: "unrelated(5).docx" },
	{ override: {}, name: "final-thought(0).docx" },
])("rejects unbound or mismatched collision names: $name $override", async ({ override, name }) => {
	await expect(fileRefFromChatgptDownloadedArtifactForTest({ ...artifact, ...override }, await downloaded(name), {})).rejects.toThrow();
});

test("canonicalizes the no-space ZIP collision without changing original bytes or overwriting another file", async () => {
	const original = await downloaded("final-thought-artifacts(5).zip");
	const existing = path.join(path.dirname(original), "final-thought-artifacts.zip");
	await fs.writeFile(existing, "unrelated preexisting bytes");
	const result = await fileRefFromChatgptDownloadedArtifactForTest({ ...artifact, title: "final-thought-artifacts.zip" }, original, {});
	expect(path.basename(result.localPath!)).toBe("final-thought-artifacts.zip");
	expect(await fs.readFile(result.localPath!, "utf8")).toBe("synthetic bytes");
	expect(await fs.readFile(original, "utf8")).toBe("synthetic bytes");
	expect(await fs.readFile(existing, "utf8")).toBe("unrelated preexisting bytes");
});
