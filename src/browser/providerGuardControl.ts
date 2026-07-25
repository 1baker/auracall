import {
	readChatgptRateLimitGuardState,
	writeChatgptRateLimitGuardState,
} from "./chatgptRateLimitGuard.js";
import {
	type SimpleProviderGuardProvider,
	readSimpleProviderGuardState,
	writeSimpleProviderGuardState,
} from "./simpleProviderGuard.js";

export type BrowserProviderGuardProvider = "chatgpt" | SimpleProviderGuardProvider;

export async function clearPersistedBrowserProviderGuard(input: {
	provider: BrowserProviderGuardProvider;
	runtimeProfileId: string;
	cooldownMs: number;
	now?: () => Date;
}): Promise<void> {
	const nowMs = (input.now?.() ?? new Date()).getTime();
	const cooldownMs = Math.max(0, Math.trunc(input.cooldownMs));
	const cooldownUntil = cooldownMs > 0 ? nowMs + cooldownMs : undefined;

	if (input.provider === "chatgpt") {
		const current = await readChatgptRateLimitGuardState({
			profileName: input.runtimeProfileId,
		});
		if (!current && cooldownUntil === undefined) {
			return;
		}
		const next = {
			...(current ?? {
				provider: "chatgpt" as const,
				profile: input.runtimeProfileId,
				updatedAt: nowMs,
			}),
			updatedAt: nowMs,
		};
		delete next.cooldownUntil;
		delete next.cooldownDetectedAt;
		delete next.cooldownReason;
		delete next.cooldownAction;
		if (cooldownUntil !== undefined) {
			next.cooldownUntil = cooldownUntil;
			next.cooldownDetectedAt = nowMs;
			next.cooldownReason =
				"Operator cleared provider guard; quiet cooldown before automation resumes.";
			next.cooldownAction = "operator-clear";
		}
		await writeChatgptRateLimitGuardState(next, {
			profileName: input.runtimeProfileId,
		});
		return;
	}

	const current = await readSimpleProviderGuardState({
		provider: input.provider,
		profileName: input.runtimeProfileId,
	});
	if (!current && cooldownUntil === undefined) {
		return;
	}
	const next = {
		...(current ?? {
			provider: input.provider,
			profile: input.runtimeProfileId,
			updatedAt: nowMs,
		}),
		updatedAt: nowMs,
	};
	delete next.cooldownUntil;
	delete next.cooldownDetectedAt;
	delete next.cooldownReason;
	delete next.cooldownAction;
	if (cooldownUntil !== undefined) {
		next.cooldownUntil = cooldownUntil;
		next.cooldownDetectedAt = nowMs;
		next.cooldownReason =
			"Operator cleared provider guard; quiet cooldown before automation resumes.";
		next.cooldownAction = "operator-clear";
	}
	await writeSimpleProviderGuardState(next, {
		provider: input.provider,
		profileName: input.runtimeProfileId,
	});
}
