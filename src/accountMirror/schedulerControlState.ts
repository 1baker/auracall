import fs from "node:fs/promises";
import path from "node:path";
import { getAuracallHomeDir } from "../auracallHome.js";

export interface AccountMirrorSchedulerControlState {
	object: "account_mirror_scheduler_control";
	version: 1;
	paused: boolean;
	updatedAt: string;
	lastAction: "pause" | "resume";
}

export function resolveAccountMirrorSchedulerControlPath(): string {
	return path.join(getAuracallHomeDir(), "cache", "account-mirror", "scheduler-control.json");
}

export async function readAccountMirrorSchedulerControlState(): Promise<AccountMirrorSchedulerControlState | null> {
	try {
		const parsed = JSON.parse(
			await fs.readFile(resolveAccountMirrorSchedulerControlPath(), "utf8"),
		) as Partial<AccountMirrorSchedulerControlState>;
		if (
			parsed.object !== "account_mirror_scheduler_control" ||
			parsed.version !== 1 ||
			typeof parsed.paused !== "boolean" ||
			typeof parsed.updatedAt !== "string" ||
			(parsed.lastAction !== "pause" && parsed.lastAction !== "resume")
		) {
			return null;
		}
		return parsed as AccountMirrorSchedulerControlState;
	} catch (error) {
		if ((error as { code?: string }).code === "ENOENT" || error instanceof SyntaxError) {
			return null;
		}
		throw error;
	}
}

export async function writeAccountMirrorSchedulerControlState(input: {
	paused: boolean;
	updatedAt: string;
}): Promise<AccountMirrorSchedulerControlState> {
	const state: AccountMirrorSchedulerControlState = {
		object: "account_mirror_scheduler_control",
		version: 1,
		paused: input.paused,
		updatedAt: input.updatedAt,
		lastAction: input.paused ? "pause" : "resume",
	};
	const statePath = resolveAccountMirrorSchedulerControlPath();
	await fs.mkdir(path.dirname(statePath), { recursive: true });
	const tempPath = `${statePath}.${process.pid}.${Date.now()}.tmp`;
	await fs.writeFile(tempPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
	await fs.rename(tempPath, statePath);
	return state;
}
