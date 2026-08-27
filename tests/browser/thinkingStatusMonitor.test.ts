import { afterEach, describe, expect, it, vi } from "vitest";
import { startThinkingStatusMonitorForTest } from "../../src/browser/index.js";

describe("startThinkingStatusMonitor", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("drains an in-flight Runtime evaluation before response capture can continue", async () => {
		vi.useFakeTimers();
		const evaluation = { release: null as (() => void) | null };
		const evaluate = vi.fn(
			() =>
				new Promise<{ result: { value: null } }>((resolve) => {
					evaluation.release = () => resolve({ result: { value: null } });
				}),
		);
		const stop = startThinkingStatusMonitorForTest(
			{ evaluate } as never,
			(_message: string) => undefined,
		);

		await vi.advanceTimersByTimeAsync(1_500);
		expect(evaluate).toHaveBeenCalledTimes(1);
		let stopped = false;
		const stoppedPromise = stop().then(() => {
			stopped = true;
		});
		await Promise.resolve();
		expect(stopped).toBe(false);
		evaluation.release?.();
		await stoppedPromise;
		expect(stopped).toBe(true);
	});
});
