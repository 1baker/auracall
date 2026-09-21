import {
	resolveChatgptConversationUrl,
	resolveChatgptProjectUrl,
} from "../browser/providers/chatgptAdapter.js";
import type { ChatgptDestinationMode } from "./apiTypes.js";

type MutableRecord = Record<string, unknown>;

export type ResolvedChatgptDestination = {
	mode: ChatgptDestinationMode | "legacy";
	projectId: string | null;
	conversationId: string | null;
	newConversationProjectId: string | null;
	targetUrl: string | null;
};

function asNonEmptyString(value: unknown): string | null {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asDestinationMode(value: unknown): ChatgptDestinationMode | null {
	return value === "existing_conversation" ||
		value === "new_project_conversation" ||
		value === "normal_new"
		? value
		: null;
}

function isChatgptProjectId(value: string | null): value is string {
	return value !== null && /^g-p-[a-f0-9]{32}$/.test(value);
}

/** Resolves destination authority only; prompt content is intentionally not an input. */
export function resolveChatgptDestination(input: {
	request: MutableRecord | null;
	agent: MutableRecord | null;
	runtimeService: MutableRecord | null;
	globalService: MutableRecord | null;
}): ResolvedChatgptDestination {
	const requestMode = asDestinationMode(input.request?.chatgptDestination);
	const requestConversationUrl = asNonEmptyString(input.request?.chatgptConversationUrl);
	const requestNewProjectId = asNonEmptyString(input.request?.chatgptNewConversationProjectId);
	const agentMode = asDestinationMode(input.agent?.chatgptDestination);
	const projectId =
		requestNewProjectId ??
		asNonEmptyString(input.agent?.projectId) ??
		asNonEmptyString(input.runtimeService?.projectId) ??
		asNonEmptyString(input.globalService?.projectId) ??
		null;
	const configuredConversationId = asNonEmptyString(input.agent?.conversationId);

	const mode =
		requestMode ?? (requestNewProjectId ? "new_project_conversation" : null) ?? agentMode;

	if (mode === "normal_new") {
		if (requestConversationUrl || requestNewProjectId)
			throw new Error(
				"Normal new ChatGPT destination cannot include a project or conversation target.",
			);
		return {
			mode,
			projectId: null,
			conversationId: null,
			newConversationProjectId: null,
			targetUrl: "https://chatgpt.com/",
		};
	}
	if (mode === "new_project_conversation") {
		if (!isChatgptProjectId(projectId) || requestConversationUrl)
			throw new Error(
				"New ChatGPT project destination requires one exact project id and no conversation URL.",
			);
		return {
			mode,
			projectId,
			conversationId: null,
			newConversationProjectId: projectId,
			targetUrl: resolveChatgptProjectUrl(projectId),
		};
	}
	if (mode === "existing_conversation") {
		const targetUrl =
			requestConversationUrl ??
			(configuredConversationId
				? resolveChatgptConversationUrl(configuredConversationId, projectId)
				: null);
		if (!targetUrl)
			throw new Error(
				"Existing ChatGPT destination requires one exact conversation URL or configured conversation id.",
			);
		// An explicit URL is its own authority; it must not inherit an unrelated
		// ambient project binding from the selected runtime profile.
		return {
			mode,
			projectId: requestConversationUrl ? null : projectId,
			conversationId: configuredConversationId,
			newConversationProjectId: null,
			targetUrl,
		};
	}
	return {
		mode: "legacy",
		projectId,
		conversationId: null,
		newConversationProjectId: null,
		targetUrl:
			requestConversationUrl ??
			(projectId
				? resolveChatgptProjectUrl(projectId)
				: (asNonEmptyString(input.runtimeService?.url) ??
					asNonEmptyString(input.globalService?.url))),
	};
}
