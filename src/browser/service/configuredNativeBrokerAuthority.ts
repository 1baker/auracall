import { constants } from 'node:fs';
import { open, lstat } from 'node:fs/promises';
import { createConnection } from 'node:net';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { AgentBrowserBridgeDependencies } from './agentBrowserBridge.js';

type RecordValue = Record<string, unknown>;
type NativeTaskContext = {
	taskAuthority: RecordValue;
	taskStepId: string;
	taskEvidenceBytes: number;
	taskName: string;
	serviceName: string;
	agentName: string;
};

const authorityTails = new Map<string, Promise<void>>();

function object(value: unknown): value is RecordValue {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function runtimeDirectory(): string {
	const configured = process.env.XDG_RUNTIME_DIR?.trim();
	if (configured) return join(configured, 'agent-browser');
	if (typeof process.getuid !== 'function') throw new Error('broker_native_runtime_directory_unavailable');
	return `/run/user/${process.getuid()}/agent-browser`;
}

async function readPrivateToken(path: string): Promise<string> {
	const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
	try {
		const stat = await handle.stat();
		if (!stat.isFile() || stat.size < 1 || stat.size > 4096
			|| (typeof process.getuid === 'function' && stat.uid !== process.getuid())
			|| (stat.mode & 0o077) !== 0) {
			throw new Error('broker_native_auth_token_file_invalid');
		}
		const token = (await handle.readFile('utf8')).trim();
		if (!token || token.length > 4096) throw new Error('broker_native_auth_token_invalid');
		return token;
	} finally {
		await handle.close();
	}
}

async function exchange(input: {
	socketPath: string;
	tokenPath: string;
	command: RecordValue;
	signal: AbortSignal;
}): Promise<RecordValue> {
	input.signal.throwIfAborted();
	const socketStat = await lstat(input.socketPath);
	if (!socketStat.isSocket()
		|| (typeof process.getuid === 'function' && socketStat.uid !== process.getuid())) {
		throw new Error('broker_native_socket_identity_invalid');
	}
	const token = await readPrivateToken(input.tokenPath);
	// biome-ignore lint/style/useNamingConvention: this wire key is defined by the native broker protocol.
	const payload = Buffer.from(`${JSON.stringify({ ...input.command, _agentBrowserAuthToken: token })}\n`);
	if (payload.length > 1_048_576) throw new Error('broker_native_authority_request_too_large');
	const signal = AbortSignal.any([input.signal, AbortSignal.timeout(15_000)]);
	return new Promise((resolve, reject) => {
		let settled = false;
		const socket = createConnection({ path: input.socketPath });
		const chunks: Buffer[] = [];
		let size = 0;
		const finish = (error?: Error, value?: RecordValue) => {
			if (settled) return;
			settled = true;
			signal.removeEventListener('abort', abort);
			socket.destroy();
			if (error) reject(error); else resolve(value ?? {});
		};
		const abort = () => finish(new Error('broker_native_authority_outcome_unknown'));
		signal.addEventListener('abort', abort, { once: true });
		socket.once('connect', () => socket.write(payload));
		socket.on('error', abort);
		socket.on('end', abort);
			socket.on('data', rawChunk => {
			const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
			size += chunk.length;
			if (size > 1_048_576) return abort();
			chunks.push(chunk);
			if (!chunk.includes(10)) return;
			try {
				const bytes = Buffer.concat(chunks);
				const newline = bytes.indexOf(10);
				if (newline !== bytes.length - 1) throw new Error('invalid framing');
				const response: unknown = JSON.parse(bytes.subarray(0, newline).toString('utf8'));
				if (!object(response)) throw new Error('broker_native_authority_response_invalid');
				if (response.success !== true) {
					const reason = typeof response.error === 'string' && response.error.length <= 512
						? response.error.replace(/[^A-Za-z0-9_.: -]/g, '_')
						: 'authority_command_failed';
					throw new Error(`broker_native_authority_rejected:${reason}`);
				}
				if (!object(response.data)) throw new Error('broker_native_authority_response_invalid');
				finish(undefined, response);
			} catch (error) {
				finish(error instanceof Error ? error : new Error('broker_native_authority_response_invalid'));
			}
		});
	});
}

function authorityAction(method: string, params: RecordValue): { action: string; ceiling: string } {
	if (method === 'Runtime.evaluate' && params.expression === 'location.href') return { action: 'url', ceiling: 'read_only' };
	if (method === 'Runtime.evaluate' && params.expression === 'document.title') return { action: 'title', ceiling: 'read_only' };
	if (method === 'Runtime.evaluate' || method === 'Runtime.callFunctionOn') return { action: 'evaluate', ceiling: 'script_execution' };
	if (method === 'Page.navigate') return { action: 'navigate', ceiling: 'navigation' };
	if (method === 'Page.reload') return { action: 'reload', ceiling: 'navigation' };
	if (['Runtime.enable', 'Runtime.disable', 'Runtime.getProperties', 'Runtime.releaseObject',
		'Runtime.releaseObjectGroup', 'Page.enable', 'Page.disable', 'Page.getFrameTree',
		'DOM.enable', 'DOM.disable', 'DOM.getDocument', 'DOM.querySelector', 'DOM.querySelectorAll',
		'DOM.describeNode', 'DOM.resolveNode', 'Network.enable', 'Network.disable',
		'Network.getResponseBody'].includes(method)) return { action: 'diagnostics', ceiling: 'read_only' };
	if (method === 'Page.captureScreenshot') return { action: 'screenshot', ceiling: 'read_only' };
	if (['Page.bringToFront', 'Page.handleJavaScriptDialog', 'Input.dispatchKeyEvent',
		'Input.dispatchMouseEvent'].includes(method)) return { action: 'ui_action', ceiling: 'external_mutation' };
	if (method === 'Input.insertText') return { action: 'type', ceiling: 'page_mutation' };
	if (method === 'DOM.setFileInputFiles') return { action: 'upload', ceiling: 'file_transfer' };
	throw new Error(`broker_native_method_not_admitted:${method}`);
}

export function createConfiguredNativeBrokerAuthority(input: {
	sessionName: string;
	runId: string;
	agentName: string;
}): NonNullable<AgentBrowserBridgeDependencies['nativeTransport']> {
	const root = runtimeDirectory();
	let activeSessionName = input.sessionName;
	let socketPath = '';
	let tokenPath = '';
	const bindSessionName = (sessionName: string) => {
		if (!/^[A-Za-z0-9_-]{1,128}$/.test(sessionName)) {
			throw new Error('broker_native_session_name_invalid');
		}
		activeSessionName = sessionName;
		socketPath = join(root, `${sessionName}.sock`);
		tokenPath = join(root, `${sessionName}.token`);
	};
	bindSessionName(input.sessionName);
	let handle: RecordValue | null = null;
	let exactUrl: string | null = null;
	let newProjectId: string | null = null;
	let boundConversationId: string | null = null;
	let handleRefreshRequired = false;
	const acceptProjectUrlTransition = (candidate: string, synchronized = false): boolean => {
		if (!newProjectId || !handle) return false;
		let url: URL;
		try { url = new URL(candidate); } catch { throw new Error('broker_native_project_transition_url_invalid'); }
		const landing = /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/project$/.exec(url.pathname);
		const conversation = /^\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/c\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.exec(url.pathname);
		if (url.origin !== 'https://chatgpt.com' || url.username || url.password || url.search || url.hash
			|| (landing?.[1] !== newProjectId && conversation?.[1] !== newProjectId)) {
			throw new Error('broker_native_project_transition_out_of_scope');
		}
		const conversationId = conversation ? url.pathname.split('/').at(-1) ?? null : null;
		if (boundConversationId && conversationId !== boundConversationId) {
			throw new Error('broker_native_conversation_identity_changed');
		}
		exactUrl = url.href;
		handle = { ...handle, url: exactUrl };
		handleRefreshRequired = !synchronized;
		if (conversationId) boundConversationId = conversationId;
		return true;
	};
	const withAuthorityLock = async <T>(operation: () => Promise<T>): Promise<T> => {
		const sessionName = activeSessionName;
		const previous = authorityTails.get(sessionName) ?? Promise.resolve();
		let release = () => {};
		const current = new Promise<void>(resolve => { release = resolve; });
		authorityTails.set(sessionName, current);
		await previous;
		try { return await operation(); } finally {
			release();
			if (authorityTails.get(sessionName) === current) authorityTails.delete(sessionName);
		}
	};
	const issueLocked = async (action: string, consequenceCeiling: string, signal: AbortSignal,
		requestLabels?: { serviceName: string; agentName: string; taskName: string },
		count = 1, evidenceBytes = 8_388_608, stepUrl?: string): Promise<NativeTaskContext[]> => {
		const labels = requestLabels ?? { taskName: `auracall-native-${input.runId}`.slice(0, 180), serviceName: 'AuraCall', agentName: input.agentName };
		// ChatGPT can canonicalize a bare project landing to its slugged form and
		// then create the conversation. Admit at most those two validated URL
		// transitions; every other rejection remains terminal.
		for (let attempt = 0; attempt < 3; attempt += 1) {
			if (!handle || !exactUrl) throw new Error('broker_native_exact_target_unavailable');
			if (handleRefreshRequired) {
				const refreshHandle = structuredClone(handle);
				const refreshUrl = exactUrl;
				const refreshTargetId = typeof refreshHandle.targetId === 'string' ? refreshHandle.targetId : null;
				if (!refreshTargetId) throw new Error('broker_native_exact_target_unavailable');
				const refreshed = await exchange({ socketPath, tokenPath, signal, command: {
					id: `auracall-refresh-${randomUUID()}`, action: 'tab_handle_refresh',
					...labels, serviceTabHandle: refreshHandle, repairPolicy: 'reject_only',
					desiredUrl: refreshUrl,
				} });
				const refreshedData = refreshed.data as RecordValue;
				const refreshedHandle = object(refreshedData.serviceTabHandle) ? refreshedData.serviceTabHandle : null;
				const refreshedTargetId = typeof refreshedData.targetId === 'string' ? refreshedData.targetId : null;
				const refreshedUrl = typeof refreshedData.url === 'string' ? refreshedData.url : null;
				if (refreshedData.ok !== true || refreshedData.refreshed !== true
					|| refreshedData.decision !== 'exact_handle_still_valid'
					|| refreshedTargetId !== refreshTargetId || refreshedHandle?.targetId !== refreshTargetId
					|| !refreshedUrl) throw new Error('broker_native_project_transition_refresh_invalid');
				if (refreshedUrl === exactUrl) {
					handle = { ...handle, url: refreshedUrl };
					handleRefreshRequired = false;
				} else {
					acceptProjectUrlTransition(refreshedUrl, true);
				}
			}
			const authorityHandle = structuredClone(handle);
			const authorityUrl = exactUrl;
			const targetId = typeof authorityHandle.targetId === 'string' ? authorityHandle.targetId : null;
			if (!targetId) throw new Error('broker_native_exact_target_unavailable');
			const staged = await exchange({ socketPath, tokenPath, signal, command: {
				id: `auracall-authority-${randomUUID()}`, action: 'task_authority_issue', ...labels,
				serviceTabHandle: authorityHandle,
				request: { ...labels, expectedTargetId: targetId, expectedUrl: authorityUrl,
					issuer: { kind: 'service', id: 'AuraCall' },
					approvalReference: `auracall-response:${input.runId}`,
					expiresInSeconds: 300,
					consequenceCeiling,
					steps: Array.from({ length: count }, () => ({ action, evidenceBytes,
						...(action === 'cdp_attach' || action === 'broker_attach' ? { url: authorityUrl } : {}),
						...(action === 'navigate' && stepUrl ? { url: stepUrl } : {}) })) },
			} });
			const stagedData = staged.data as RecordValue;
			const confirmationId = typeof stagedData.confirmationId === 'string' ? stagedData.confirmationId : null;
			if (!confirmationId || stagedData.confirmation_required !== true) {
				throw new Error('broker_native_authority_confirmation_missing');
			}
			const confirmed = await exchange({ socketPath, tokenPath, signal, command: {
				id: `auracall-confirm-${randomUUID()}`, action: 'confirm', confirmationId,
				serviceTabHandle: authorityHandle,
				expectedAction: 'task_authority_issue', decidedBy: { kind: 'service', id: 'AuraCall' },
			} });
			const outer = confirmed.data as RecordValue;
			const result = object(outer.result) ? outer.result : null;
			if (result && result.success !== true) {
				const reason = typeof result.error === 'string' && result.error.length <= 512
					? result.error.replace(/[^A-Za-z0-9_.: -]/g, '_')
					: 'confirmation_execution_failed';
				if (attempt < 2 && reason === 'Task authority confirmation failed closed: confirmation URL changed before decision') {
					for (let wait = 0; wait < 5 && exactUrl === authorityUrl; wait += 1) {
						await new Promise(resolve => setTimeout(resolve, 50));
						signal.throwIfAborted();
					}
					// ChatGPT may update the address through client-side history before
					// CDP publishes Page.frameNavigated. Refresh only this already-bound
					// physical target, then independently enforce the exact project URL.
					const refreshHandle = exactUrl !== authorityUrl && handle?.targetId === targetId
						? structuredClone(handle) : authorityHandle;
					const refreshUrl = exactUrl ?? authorityUrl;
					const refreshed = await exchange({ socketPath, tokenPath, signal, command: {
						id: `auracall-refresh-${randomUUID()}`, action: 'tab_handle_refresh',
						...labels, serviceTabHandle: refreshHandle, repairPolicy: 'reject_only',
						desiredUrl: refreshUrl,
					} });
					const refreshedData = refreshed.data as RecordValue;
					const refreshedHandle = object(refreshedData.serviceTabHandle) ? refreshedData.serviceTabHandle : null;
					const refreshedTargetId = typeof refreshedData.targetId === 'string' ? refreshedData.targetId : null;
					const refreshedUrl = typeof refreshedData.url === 'string' ? refreshedData.url : null;
					if (refreshedData.ok === true && refreshedData.refreshed === true
						&& refreshedData.decision === 'exact_handle_still_valid'
						&& refreshedTargetId === targetId && refreshedHandle?.targetId === targetId
						&& refreshedUrl && acceptProjectUrlTransition(refreshedUrl, true)) {
						let stableSamples = 0;
						for (let sample = 0; sample < 20 && stableSamples < 2; sample += 1) {
							await new Promise(resolve => setTimeout(resolve, 100));
							signal.throwIfAborted();
							if (!handle || !exactUrl || handle.targetId !== targetId) {
								throw new Error('broker_native_project_transition_settle_binding_changed');
							}
							const sampledUrl = exactUrl;
							const sampleHandle = structuredClone(handle);
							const sampled = await exchange({ socketPath, tokenPath, signal, command: {
								id: `auracall-settle-${randomUUID()}`, action: 'tab_handle_refresh',
								...labels, serviceTabHandle: sampleHandle, repairPolicy: 'reject_only',
								desiredUrl: sampledUrl,
							} });
							const sampledData = sampled.data as RecordValue;
							const sampledHandle = object(sampledData.serviceTabHandle) ? sampledData.serviceTabHandle : null;
							const sampledTargetId = typeof sampledData.targetId === 'string' ? sampledData.targetId : null;
							const observedUrl = typeof sampledData.url === 'string' ? sampledData.url : null;
							if (sampledData.ok !== true || sampledData.refreshed !== true
								|| sampledData.decision !== 'exact_handle_still_valid'
								|| sampledTargetId !== targetId || sampledHandle?.targetId !== targetId || !observedUrl) {
								throw new Error('broker_native_project_transition_settle_invalid');
							}
							if (observedUrl === sampledUrl) {
								handle = { ...handle, url: observedUrl };
								handleRefreshRequired = false;
								stableSamples += 1;
							} else {
								acceptProjectUrlTransition(observedUrl, true);
								stableSamples = 0;
							}
						}
						if (stableSamples < 2) throw new Error('broker_native_project_transition_settle_timeout');
						continue;
					}
				}
				throw new Error(`broker_native_authority_rejected:${reason}`);
			}
			const data = result && result.success === true && object(result.data) ? result.data : null;
			const envelope = data && object(data.envelope) ? data.envelope : null;
			const plan = data && object(data.approvedPlan) ? data.approvedPlan : null;
			const steps = plan && Array.isArray(plan.steps) ? plan.steps : [];
			if (!envelope || steps.length !== count || steps.some(step => !object(step) || typeof step.stepId !== 'string')) {
				throw new Error('broker_native_authority_receipt_invalid');
			}
			return steps.map(step => ({ ...labels, taskAuthority: envelope,
				taskStepId: (step as RecordValue).stepId as string, taskEvidenceBytes: evidenceBytes }));
		}
		throw new Error('broker_native_authority_transition_retry_exhausted');
	};
	const issue = async (action: string, consequenceCeiling: string, signal: AbortSignal,
		requestLabels?: { serviceName: string; agentName: string; taskName: string }, stepUrl?: string) =>
		withAuthorityLock(async () => {
			const first = (await issueLocked(action, consequenceCeiling, signal, requestLabels, 1, 8_388_608, stepUrl))[0];
			if (!first) throw new Error('broker_native_authority_receipt_missing');
			return first;
		});
	return {
		get socketPath() { return socketPath; },
		authToken: () => readPrivateToken(tokenPath),
		timeoutMs: 120_000,
		bindSessionName,
		attachTaskContext: async (attach, signal) => {
			const sessionName = typeof attach.serviceTabHandle.sessionName === 'string'
				? attach.serviceTabHandle.sessionName : null;
			if (!sessionName) throw new Error('broker_native_session_name_invalid');
			bindSessionName(sessionName);
			handle = structuredClone(attach.serviceTabHandle);
			exactUrl = attach.url;
			const landing = /^https:\/\/chatgpt\.com\/g\/(g-p-[a-f0-9]{32})(?:-[a-z0-9-]+)?\/project$/.exec(exactUrl);
			newProjectId = landing?.[1] ?? null;
			boundConversationId = null;
			// Agent Browser intentionally maps broker-form cdp_attach to the
			// read-only broker_attach authority action. Its step also carries the
			// exact requested URL because the outer cdp_attach command names it.
			return issue('broker_attach', 'read_only', signal, attach.labels);
		},
		bindObservedTargetUrl: candidate => {
			if (candidate === exactUrl) return;
			if (!acceptProjectUrlTransition(candidate)) {
				throw new Error('broker_native_observed_target_url_changed');
			}
		},
		currentTargetSnapshot: () => handle && exactUrl ? {
			...(boundConversationId ? { conversationId: boundConversationId } : {}),
			serviceTabHandle: structuredClone(handle),
			url: exactUrl,
		} : null,
		synchronizeTargetAfterMutation: signal => withAuthorityLock(async () => {
			const labels = { taskName: `auracall-native-${input.runId}`.slice(0, 180),
				serviceName: 'AuraCall', agentName: input.agentName };
			const targetId = typeof handle?.targetId === 'string' ? handle.targetId : null;
			if (!handle || !exactUrl || !targetId) throw new Error('broker_native_exact_target_unavailable');
			let stableCanonicalSamples = 0;
			let previousUrl: string | null = null;
			for (let sample = 0; sample < 40; sample += 1) {
				signal.throwIfAborted();
				const sampled = await exchange({ socketPath, tokenPath, signal, command: {
					id: `auracall-post-mutation-sync-${randomUUID()}`, action: 'tab_handle_refresh',
					...labels, serviceTabHandle: structuredClone(handle), repairPolicy: 'reject_only',
					desiredUrl: exactUrl,
				} });
				const data = sampled.data as RecordValue;
				const sampledHandle = object(data.serviceTabHandle) ? data.serviceTabHandle : null;
				const sampledTargetId = typeof data.targetId === 'string' ? data.targetId : null;
				const sampledUrl = typeof data.url === 'string' ? data.url : null;
				if (data.ok !== true || data.refreshed !== true || data.decision !== 'exact_handle_still_valid'
					|| sampledTargetId !== targetId || sampledHandle?.targetId !== targetId || !sampledUrl) {
					throw new Error('broker_native_post_mutation_sync_invalid');
				}
				if (sampledUrl !== exactUrl) acceptProjectUrlTransition(sampledUrl, true);
				else {
					handle = { ...handle, ...sampledHandle, url: sampledUrl };
					handleRefreshRequired = false;
				}
				const canonicalReady = !newProjectId || boundConversationId !== null;
				stableCanonicalSamples = canonicalReady && sampledUrl === previousUrl
					? stableCanonicalSamples + 1 : canonicalReady ? 1 : 0;
				previousUrl = sampledUrl;
				if (stableCanonicalSamples >= 2 && handle && exactUrl) return {
					...(boundConversationId ? { conversationId: boundConversationId } : {}),
					serviceTabHandle: structuredClone(handle), url: exactUrl,
				};
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			throw new Error('broker_native_post_mutation_sync_timeout');
		}),
		onBrokerEvent: event => {
			if (!newProjectId || !handle || event.method !== 'Page.frameNavigated' || !object(event.params)) return;
			const frame = object(event.params.frame) ? event.params.frame : null;
			if (!frame || frame.parentId != null || typeof frame.url !== 'string') return;
			if (frame.url === exactUrl) return;
			acceptProjectUrlTransition(frame.url);
		},
		taskContext: async (request, signal) => {
			if (request.binding.sessionName !== activeSessionName) throw new Error('broker_native_binding_session_changed');
			if (request.binding.targetId !== handle?.targetId) throw new Error('broker_native_binding_target_changed');
			if (!('method' in request) || !('params' in request)) throw new Error('broker_native_request_required');
			const mapped = authorityAction(request.method, request.params);
			const stepUrl = mapped.action === 'navigate' ? request.params.url : undefined;
			if (mapped.action === 'navigate' && (typeof stepUrl !== 'string' || !stepUrl.trim() || stepUrl.length > 8192)) {
				throw new Error('broker_native_navigation_url_invalid');
			}
			return issue(mapped.action, mapped.ceiling, signal, undefined, typeof stepUrl === 'string' ? stepUrl : undefined);
		},
	};
}
