import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer, type Socket } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { createConfiguredNativeBrokerAuthority } from '../../src/browser/service/configuredNativeBrokerAuthority.js';

const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); });

describe('configured native broker authority', () => {
	test('issues and confirms exact single-use attach, command, and event authority', async () => {
		const previousRuntime = process.env.XDG_RUNTIME_DIR;
		const runtime = await mkdtemp(join(tmpdir(), 'auracall-native-authority-'));
		process.env.XDG_RUNTIME_DIR = runtime;
		const root = join(runtime, 'agent-browser');
		await mkdir(root, { mode: 0o700 });
		const tokenPath = join(root, 'chatgpt-pro.token');
		await writeFile(tokenPath, 'fixture-secret', { mode: 0o600 });
		await chmod(tokenPath, 0o600);
		const socketPath = join(root, 'chatgpt-pro.sock');
		const packets: Array<Record<string, unknown>> = [];
		const sockets = new Set<Socket>();
		let issuance = 0;
		let refreshCount = 0;
		const issuanceStepCounts: number[] = [];
		const server = createServer(socket => {
			sockets.add(socket);
			socket.on('close', () => sockets.delete(socket));
			let pending = '';
			socket.on('data', chunk => {
				pending += chunk.toString();
				if (!pending.endsWith('\n')) return;
				const packet = JSON.parse(pending) as Record<string, unknown>;
				packets.push(packet);
				const id = String(packet.id);
				if (packet.action === 'task_authority_issue') {
					issuance += 1;
					const request = packet.request as { steps?: unknown[] };
					issuanceStepCounts[issuance] = request.steps?.length ?? 0;
					socket.end(`${JSON.stringify({ id, success: true, data: {
						confirmation_required: true, confirmationId: `confirmation-${issuance}`,
					} })}\n`);
					return;
				}
				if (packet.action === 'confirm' && issuance === 2) {
					socket.end(`${JSON.stringify({ id, success: true, data: { result: { success: false,
						error: 'Task authority confirmation failed closed: confirmation URL changed before decision',
					} } })}\n`);
					return;
				}
				if (packet.action === 'tab_handle_refresh') {
					refreshCount += 1;
					const refreshedUrl = refreshCount === 1 ? canonicalLandingUrl : conversationUrl;
					socket.end(`${JSON.stringify({ id, success: true, data: {
						ok: true, refreshed: true, decision: 'exact_handle_still_valid',
						targetId: 'target-1', url: refreshedUrl,
						serviceTabHandle: { targetId: 'target-1', url: refreshedUrl },
					} })}\n`);
					return;
				}
				socket.end(`${JSON.stringify({ id, success: true, data: { result: { success: true, data: {
					envelope: { id: `authority-${issuance}` }, approvedPlan: { steps: Array.from(
						{ length: issuanceStepCounts[issuance] ?? 0 }, (_, index) => ({ stepId: `authority-${issuance}:step-${index}` }),
					) },
				} } } })}\n`);
			});
		});
		await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(socketPath, resolve); });
		cleanups.push(async () => {
			process.env.XDG_RUNTIME_DIR = previousRuntime;
			for (const socket of sockets) socket.destroy();
			await new Promise<void>(resolve => server.close(() => resolve()));
			await rm(runtime, { recursive: true, force: true });
		});
		const configured = createConfiguredNativeBrokerAuthority({
			sessionName: 'chatgpt-pro', runId: 'run-1', agentName: 'codex',
		});
		const projectId = 'g-p-11111111111111111111111111111111';
		const landingUrl = `https://chatgpt.com/g/${projectId}/project`;
		const canonicalLandingUrl = `https://chatgpt.com/g/${projectId}-workshop/project`;
		const conversationUrl = `https://chatgpt.com/g/${projectId}-workshop/c/11111111-1111-1111-1111-111111111111`;
		const handle = { targetId: 'target-1', browserId: 'session:chatgpt-pro',
			profileId: 'chatgpt-pro', sessionName: 'chatgpt-pro', valid: true,
			url: landingUrl };
		const signal = new AbortController().signal;
		await expect(configured.attachTaskContext({ serviceTabHandle: handle,
			url: landingUrl, labels: {
				serviceName: 'AuraCall', agentName: 'codex-backend', taskName: 'chatgpt-frontend-response',
		} }, signal)).resolves.toMatchObject({
			taskName: 'chatgpt-frontend-response', serviceName: 'AuraCall', agentName: 'codex-backend',
			taskAuthority: { id: 'authority-1' }, taskStepId: 'authority-1:step-0',
		});
		expect(() => configured.onBrokerEvent?.({ method: 'Page.frameNavigated', params: {
			frame: { id: 'main', url: landingUrl },
		} })).not.toThrow();
		expect(() => configured.onBrokerEvent?.({ method: 'Page.frameNavigated', params: {
			frame: { id: 'main', url: `https://chatgpt.com/g/g-p-${'2'.repeat(32)}/c/22222222-2222-2222-2222-222222222222` },
		} })).toThrow('out_of_scope');
		expect(() => configured.onBrokerEvent?.({ method: 'Page.frameNavigated', params: {
			frame: { id: 'main', url: canonicalLandingUrl },
		} })).not.toThrow();
		await expect(configured.taskContext({ operation: 'command', requestId: 'command-1',
			binding: { attachmentId: 'a', browserId: 'session:chatgpt-pro', profileId: 'chatgpt-pro',
				sessionName: 'chatgpt-pro', targetId: 'target-1', generation: 'g' },
				method: 'Runtime.evaluate', params: { expression: 'document.body.textContent' },
		}, signal)).resolves.toMatchObject({ serviceName: 'AuraCall', taskAuthority: { id: 'authority-3' } });
		await expect(configured.taskContext({ operation: 'command', requestId: 'command-2',
			binding: { attachmentId: 'a', browserId: 'session:chatgpt-pro', profileId: 'chatgpt-pro',
				sessionName: 'chatgpt-pro', targetId: 'target-1', generation: 'g' },
				method: 'Runtime.evaluate', params: { expression: 'location.href' },
		}, signal)).resolves.toMatchObject({ serviceName: 'AuraCall', taskAuthority: { id: 'authority-4' } });
		expect(configured.currentTargetSnapshot?.()).toMatchObject({
			conversationId: '11111111-1111-1111-1111-111111111111',
			url: conversationUrl,
			serviceTabHandle: { targetId: 'target-1', url: conversationUrl },
		});
		expect(() => configured.bindObservedTargetUrl?.(conversationUrl)).not.toThrow();
		expect(() => configured.onBrokerEvent?.({ method: 'Page.frameNavigated', params: {
			frame: { id: 'main', url: canonicalLandingUrl },
		} })).toThrow('conversation_identity_changed');
		expect(() => configured.onBrokerEvent?.({ method: 'Page.frameNavigated', params: {
			frame: { id: 'main', url: `https://chatgpt.com/g/${projectId}-workshop/c/22222222-2222-2222-2222-222222222222` },
		} })).toThrow('conversation_identity_changed');
		await expect(configured.taskContext({ operation: 'command', requestId: 'command-3',
			binding: { attachmentId: 'a', browserId: 'session:chatgpt-pro', profileId: 'chatgpt-pro',
				sessionName: 'chatgpt-pro', targetId: 'target-1', generation: 'g' },
			method: 'Page.navigate', params: { url: 'https://chatgpt.com/c/exact' },
		}, signal)).resolves.toMatchObject({ serviceName: 'AuraCall', taskAuthority: { id: 'authority-5' } });
		await expect(configured.taskContext({ operation: 'command', requestId: 'command-4',
			binding: { attachmentId: 'a', browserId: 'session:chatgpt-pro', profileId: 'chatgpt-pro',
				sessionName: 'chatgpt-pro', targetId: 'target-1', generation: 'g' },
			method: 'Page.reload', params: {},
		}, signal)).resolves.toMatchObject({ serviceName: 'AuraCall', taskAuthority: { id: 'authority-6' } });
		await expect(configured.synchronizeTargetAfterMutation?.(signal)).resolves.toMatchObject({
			conversationId: '11111111-1111-1111-1111-111111111111',
			url: conversationUrl,
			serviceTabHandle: { targetId: 'target-1', url: conversationUrl },
		});
		expect(packets).toHaveLength(18);
		expect(packets.every(packet => packet._agentBrowserAuthToken === 'fixture-secret')).toBe(true);
		expect(packets[0]).toMatchObject({ action: 'task_authority_issue', request: {
			taskName: 'chatgpt-frontend-response', serviceName: 'AuraCall', agentName: 'codex-backend',
			expectedTargetId: 'target-1', expectedUrl: landingUrl,
			consequenceCeiling: 'read_only',
			steps: [{ action: 'broker_attach', url: landingUrl }],
		} });
		expect(packets[2]).toMatchObject({ action: 'tab_handle_refresh',
			repairPolicy: 'reject_only', desiredUrl: canonicalLandingUrl,
			serviceTabHandle: { targetId: 'target-1', url: canonicalLandingUrl },
		});
		expect(packets[3]).toMatchObject({ action: 'task_authority_issue', request: {
			expectedTargetId: 'target-1', expectedUrl: canonicalLandingUrl,
			consequenceCeiling: 'script_execution',
			steps: [{ action: 'evaluate' }],
		} });
		expect(packets[5]).toMatchObject({ action: 'tab_handle_refresh',
			repairPolicy: 'reject_only', desiredUrl: canonicalLandingUrl,
			serviceTabHandle: { targetId: 'target-1', url: canonicalLandingUrl },
		});
		expect(packets[8]).toMatchObject({ action: 'task_authority_issue', request: {
			expectedTargetId: 'target-1', expectedUrl: conversationUrl,
			consequenceCeiling: 'script_execution',
			steps: [{ action: 'evaluate' }],
		} });
		expect((packets[8].request as Record<string, unknown>).steps).toEqual([
			{ action: 'evaluate', evidenceBytes: 8_388_608 },
		]);
		expect(packets[10]).toMatchObject({ action: 'task_authority_issue', request: {
			consequenceCeiling: 'read_only',
			steps: [{ action: 'url' }],
		} });
		expect(packets[12]).toMatchObject({ action: 'task_authority_issue', request: {
			consequenceCeiling: 'navigation',
			steps: [{ action: 'navigate', url: 'https://chatgpt.com/c/exact' }],
		} });
		expect(packets[14]).toMatchObject({ action: 'task_authority_issue', request: {
			consequenceCeiling: 'navigation',
			steps: [{ action: 'reload' }],
		} });
		expect(packets.slice(16)).toEqual(expect.arrayContaining([
			expect.objectContaining({ action: 'tab_handle_refresh', repairPolicy: 'reject_only',
				serviceTabHandle: expect.objectContaining({ targetId: 'target-1', url: conversationUrl }) }),
		]));
	});

	test('uses the retained handle session when configured fallback session is stale', async () => {
		const previousRuntime = process.env.XDG_RUNTIME_DIR;
		const runtime = await mkdtemp(join(tmpdir(), 'auracall-native-authority-session-'));
		process.env.XDG_RUNTIME_DIR = runtime;
		const root = join(runtime, 'agent-browser');
		await mkdir(root, { mode: 0o700 });
		const tokenPath = join(root, 'live-session.token');
		await writeFile(tokenPath, 'live-secret', { mode: 0o600 });
		await chmod(tokenPath, 0o600);
		const socketPath = join(root, 'live-session.sock');
		const packets: Array<Record<string, unknown>> = [];
		const sockets = new Set<Socket>();
		const server = createServer(socket => {
			sockets.add(socket);
			socket.on('close', () => sockets.delete(socket));
			let pending = '';
			socket.on('data', chunk => {
				pending += chunk.toString();
				if (!pending.endsWith('\n')) return;
				const packet = JSON.parse(pending) as Record<string, unknown>;
				packets.push(packet);
				const id = String(packet.id);
				if (packet.action === 'task_authority_issue') {
					socket.end(`${JSON.stringify({ id, success: true, data: {
						confirmation_required: true, confirmationId: 'confirmation-live',
					} })}\n`);
					return;
				}
				socket.end(`${JSON.stringify({ id, success: true, data: { result: { success: true, data: {
					envelope: { id: 'authority-live' }, approvedPlan: { steps: [{ stepId: 'authority-live:step-0' }] },
				} } } })}\n`);
			});
		});
		await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(socketPath, resolve); });
		cleanups.push(async () => {
			process.env.XDG_RUNTIME_DIR = previousRuntime;
			for (const socket of sockets) socket.destroy();
			await new Promise<void>(resolve => server.close(() => resolve()));
			await rm(runtime, { recursive: true, force: true });
		});
		const configured = createConfiguredNativeBrokerAuthority({
			sessionName: 'stale-session', runId: 'run-stale', agentName: 'codex',
		});
		expect(configured.socketPath).toBe(join(root, 'stale-session.sock'));
		const signal = new AbortController().signal;
		await expect(configured.attachTaskContext({
			serviceTabHandle: { targetId: 'target-live', browserId: 'session:live-session',
				profileId: 'chatgpt-pro', sessionName: 'live-session', valid: true,
				url: 'https://chatgpt.com/g/workshop/project' },
			url: 'https://chatgpt.com/g/workshop/project', labels: {
				serviceName: 'AuraCall', agentName: 'codex-backend', taskName: 'chatgpt-frontend-response',
			},
		}, signal)).resolves.toMatchObject({ taskAuthority: { id: 'authority-live' } });
		expect(configured.socketPath).toBe(socketPath);
		expect(packets).toHaveLength(2);
		expect(packets.every(packet => packet._agentBrowserAuthToken === 'live-secret')).toBe(true);
	});
});
