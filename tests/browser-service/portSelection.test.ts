import { describe, expect, test, vi } from "vitest";
import { pickAvailableDebugPort } from "../../packages/browser-service/src/portSelection.js";

describe("portSelection", () => {
	test("honors an available pinned port even when a range is configured", async () => {
		const logs: string[] = [];
		const probe = vi.fn(async (port: number) => port === 45001);
		const chosen = await pickAvailableDebugPort(
			45001,
			(message) => logs.push(message),
			[45010, 45012],
			{
				isPortAvailable: probe,
			},
		);
		expect(chosen).toBe(45001);
		expect(probe).toHaveBeenCalledTimes(1);
		expect(logs.length).toBe(0);
	});

	test("falls back when the requested range is fully occupied", async () => {
		const logs: string[] = [];
		const chosen = await pickAvailableDebugPort(
			45000,
			(message) => logs.push(message),
			[45000, 45000],
			{
				isPortAvailable: async () => false,
				findEphemeralPort: async () => 46000,
			},
		);
		expect(chosen).toBe(46000);
		expect(logs.some((line) => line.includes("DevTools ports"))).toBe(true);
	});

	test("chooses the first free port in the range", async () => {
		const logs: string[] = [];
		const chosen = await pickAvailableDebugPort(
			45000,
			(message) => logs.push(message),
			[45000, 45002],
			{
				isPortAvailable: async (port) => port === 45002,
			},
		);
		expect(chosen).toBe(45002);
		expect(logs.length).toBe(0);
	});

	test("prefers the pinned port when it is inside the range and available", async () => {
		const logs: string[] = [];
		const chosen = await pickAvailableDebugPort(
			45001,
			(message) => logs.push(message),
			[45000, 45002],
			{
				isPortAvailable: async (port) => port === 45001,
			},
		);
		expect(chosen).toBe(45001);
		expect(logs.length).toBe(0);
	});
});
