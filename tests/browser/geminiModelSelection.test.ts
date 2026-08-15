// biome-ignore-all lint/style/useNamingConvention: CDP domain names are protocol-defined.
import { describe, expect, it, vi } from "vitest";
import {
	selectGeminiModel,
	stageGeminiPromptAttachments,
} from "../../src/browser/actions/geminiModelSelection.js";

function registry() {
	return {
		version: 1,
		services: {
			gemini: {
				models: [
					{ id: "gemini-flash-lite", label: "Gemini Flash-Lite", aliases: ["flash-lite"] },
					{ id: "gemini-flash", label: "Gemini Flash", aliases: ["flash"] },
					{ id: "gemini-pro", label: "Gemini Pro", aliases: ["pro"] },
				],
			},
		},
	} as never;
}

describe("Gemini model selection", () => {
	it("clicks and verifies the exact registered picker row", async () => {
		const dispatchMouseEvent = vi.fn(async () => undefined);
		const pressButtonImpl = vi.fn(async () => ({ ok: true }));
		const waitForPredicateImpl = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, value: { available: ["Gemini Pro"] } })
			.mockResolvedValueOnce({ ok: true, value: { selected: true } });
		const logger = vi.fn();
		const client = {
			Runtime: {
				evaluate: vi.fn(async () => ({
					result: { value: { ok: true, label: "Gemini Pro", x: 12, y: 24 } },
				})),
			},
			Input: { dispatchMouseEvent },
		};

		await selectGeminiModel(client as never, "Gemini Pro", logger, {
			ensureServicesRegistryImpl: async () => registry(),
			pressButtonImpl: pressButtonImpl as never,
			waitForPredicateImpl: waitForPredicateImpl as never,
		});

		expect(dispatchMouseEvent).toHaveBeenCalledTimes(3);
		expect(pressButtonImpl).toHaveBeenCalledTimes(1);
		expect(logger).toHaveBeenCalledWith("Selected Gemini model: Gemini Pro");
	});

	it("fails closed when the exact picker row is unavailable", async () => {
		const client = {
			Runtime: {
				evaluate: vi.fn(async () => ({
					result: { value: { ok: false, available: ["Gemini Flash", "Gemini Flash-Lite"] } },
				})),
			},
			Input: { dispatchMouseEvent: vi.fn() },
		};

		await expect(
			selectGeminiModel(client as never, "Gemini Pro", undefined, {
				ensureServicesRegistryImpl: async () => registry(),
				pressButtonImpl: vi.fn(async () => ({ ok: true })) as never,
				waitForPredicateImpl: vi.fn(async () => ({ ok: true })) as never,
			}),
		).rejects.toThrow(
			'Unable to select exact Gemini model "Gemini Pro". Available: Gemini Flash, Gemini Flash-Lite.',
		);
		expect(client.Input.dispatchMouseEvent).not.toHaveBeenCalled();
	});

	it("refuses prompt insertion when the clicked selection cannot be verified", async () => {
		const pressButtonImpl = vi.fn(async () => ({ ok: true }));
		const waitForPredicateImpl = vi
			.fn()
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: false })
			.mockResolvedValueOnce({ ok: false });
		const client = {
			Runtime: {
				evaluate: vi.fn(async () => ({
					result: { value: { ok: true, label: "Gemini Pro", x: 12, y: 24 } },
				})),
			},
			Input: { dispatchMouseEvent: vi.fn(async () => undefined) },
		};

		await expect(
			selectGeminiModel(client as never, "Gemini Pro", undefined, {
				ensureServicesRegistryImpl: async () => registry(),
				pressButtonImpl: pressButtonImpl as never,
				waitForPredicateImpl: waitForPredicateImpl as never,
			}),
		).rejects.toThrow("refusing prompt insertion");
		expect(pressButtonImpl).toHaveBeenCalledTimes(2);
	});

	it("rejects unregistered model labels before opening the picker", async () => {
		const pressButtonImpl = vi.fn();
		await expect(
			selectGeminiModel({} as never, "Gemini Ultra", undefined, {
				ensureServicesRegistryImpl: async () => registry(),
				pressButtonImpl: pressButtonImpl as never,
			}),
		).rejects.toThrow('Unsupported Gemini model "Gemini Ultra"');
		expect(pressButtonImpl).not.toHaveBeenCalled();
	});
});

describe("Gemini prompt attachments", () => {
	it("stages exact local files and verifies their prompt previews", async () => {
		let chooserHandler: ((payload: { backendNodeId?: number }) => void) | undefined;
		const setInterceptFileChooserDialog = vi.fn(async () => undefined);
		const setFileInputFiles = vi.fn(async () => undefined);
		const pressButtonWithTrustedPointerImpl = vi
			.fn()
			.mockResolvedValueOnce({ ok: true })
			.mockImplementationOnce(async () => {
				chooserHandler?.({ backendNodeId: 42 });
				return { ok: true };
			});
		const client = {
			Page: {
				enable: vi.fn(async () => undefined),
				setInterceptFileChooserDialog,
				fileChooserOpened: vi.fn((handler) => {
					chooserHandler = handler;
				}),
			},
			DOM: { enable: vi.fn(async () => undefined), setFileInputFiles },
			Runtime: {},
			Input: {},
		};

		await stageGeminiPromptAttachments(
			client as never,
			[{ path: "/tmp/a.txt" }, { path: "/tmp/b.pdf" }] as never,
			{
				pressButtonWithTrustedPointerImpl: pressButtonWithTrustedPointerImpl as never,
				waitForPredicateImpl: vi.fn(async () => ({ ok: true })) as never,
				chooserTimeoutMs: 20,
			},
		);

		expect(setFileInputFiles).toHaveBeenCalledWith({
			backendNodeId: 42,
			files: ["/tmp/a.txt", "/tmp/b.pdf"],
		});
		expect(setInterceptFileChooserDialog).toHaveBeenNthCalledWith(1, { enabled: true });
		expect(setInterceptFileChooserDialog).toHaveBeenLastCalledWith({ enabled: false });
	});

	it("fails closed and releases interception when previews never appear", async () => {
		let chooserHandler: ((payload: { backendNodeId?: number }) => void) | undefined;
		const setInterceptFileChooserDialog = vi.fn(async () => undefined);
		const pressButtonWithTrustedPointerImpl = vi
			.fn()
			.mockResolvedValueOnce({ ok: true })
			.mockImplementationOnce(async () => {
				chooserHandler?.({ backendNodeId: 7 });
				return { ok: true };
			});
		const waitForPredicateImpl = vi
			.fn()
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: false });
		const client = {
			Page: {
				enable: vi.fn(async () => undefined),
				setInterceptFileChooserDialog,
				fileChooserOpened: vi.fn((handler) => {
					chooserHandler = handler;
				}),
			},
			DOM: {
				enable: vi.fn(async () => undefined),
				setFileInputFiles: vi.fn(async () => undefined),
			},
			Runtime: {},
			Input: {},
		};

		await expect(
			stageGeminiPromptAttachments(client as never, [{ path: "/tmp/missing.txt" }] as never, {
				pressButtonWithTrustedPointerImpl: pressButtonWithTrustedPointerImpl as never,
				waitForPredicateImpl: waitForPredicateImpl as never,
				chooserTimeoutMs: 20,
			}),
		).rejects.toThrow("Gemini prompt attachments did not become visible before submission");
		expect(setInterceptFileChooserDialog).toHaveBeenLastCalledWith({ enabled: false });
	});
});
