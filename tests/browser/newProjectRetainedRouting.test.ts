import { expect, it, vi } from 'vitest';
import { acquireAgentBrowserBrokerTab } from '../../src/browser/service/agentBrowserBridge.js';

it.each(['valid', 'unisolated', 'stale', 'no-match', 'missing-hint', 'conflict', 'launch', 'cold-launch', 'legacy', 'ambiguous', 'changed-posture', 'explicit-conflict', 'missing-posture'] as const)(
  'binds project-root tab requests to current planned retained authority: %s', async kind => {
    const url = kind === 'legacy' ? 'https://chatgpt.com/c/legacy'
      : 'https://chatgpt.com/g/g-p-11111111111111111111111111111111/project';
    const handle = { valid: true, browserId: 'session:retained', sessionName: 'retained', profileId: 'chatgpt-pro',
      targetId: 'old-target', url: 'https://chatgpt.com/c/existing' };
    const requests: Record<string, unknown>[] = [];
    let inventoryReads = 0;
    const planQueries: URLSearchParams[] = [];
		const fetch = vi.fn(async (resource: unknown, init?: RequestInit) => {
      const route = String(resource);
      if (route.endsWith('/api/service/browsers')) {
        inventoryReads++;
        const stale = kind === 'stale' && inventoryReads > 1;
        return new Response(JSON.stringify({ success: true, data: { browsers: kind === 'no-match' || kind === 'cold-launch' ? [] : [{
          id: handle.browserId, profileId: handle.profileId, health: stale ? 'missing' : 'ready', pid: 123,
          host: 'remote_headed', tabHandles: [handle],
				displayIsolation: kind === 'unisolated' ? null : kind === 'changed-posture' && inventoryReads > 1 ? 'private_virtual_display' : 'shared_display',
          viewStreams: kind === 'missing-posture' ? [] : [{ provider: 'rdp_gateway', controlInput: 'manual_attached_desktop' }],
        }, ...(kind === 'ambiguous' ? [{ id: 'session:other', profileId: handle.profileId, health: 'ready', pid: 999, host: 'remote_headed' }] : [])] } }));
      }
      if (route.includes('/api/service/access-plan?')) {
        const query = new URL(route).searchParams;
        planQueries.push(query);
		const postureMatches = query.get('displayIsolation') === (kind === 'unisolated' ? null : 'shared_display')
          && query.get('viewStreamProvider') === 'rdp_gateway' && query.get('controlInputProvider') === 'manual_attached_desktop';
        return new Response(JSON.stringify({ success: true, data: {
        selectedProfile: { id: 'chatgpt-pro' }, decision: {
          profileReuse: { recommendedAction: kind === 'launch' || kind === 'cold-launch' ? 'launch_new_browser' : (postureMatches || kind === 'legacy') ? 'reuse_existing_browser' : 'wait_for_profile_lease',
            reusableBrowserId: kind === 'cold-launch' ? null : handle.browserId, reusableSessionName: kind === 'missing-hint' || kind === 'cold-launch' ? null : handle.sessionName },
          serviceRequest: { available: true, request: { action: 'tab_new', url, runtimeProfile: 'chatgpt-pro',
            params: { browserHost: 'remote_headed', displayIsolation: query.get('displayIsolation'), viewStreamProvider: query.get('viewStreamProvider'),
              controlInputProvider: query.get('controlInputProvider') }, ...(kind === 'conflict' ? { browserId: 'other' } : {}) } },
        },
      } }));
      }
      requests.push(JSON.parse(String(init?.body)));
      // Stop at dispatch: this fixture never creates a tab or browser.
      return new Response(JSON.stringify({ success: false, error: 'TEST_DISPATCH_BOUNDARY' }));
    });
    await expect(acquireAgentBrowserBrokerTab({ targetServiceId: 'chatgpt', mode: 'required', profileId: 'chatgpt-pro',
      browserHost: 'remote_headed', url, ...(kind === 'cold-launch' ? { targetId: 'stale-configured-target' } : {}),
      ...(kind === 'explicit-conflict' ? { displayIsolation: 'private_virtual_display' } : {}) }, { fetch: fetch as never, listStreamFiles: async () => ['/tmp/retained.stream'],
      readStreamFile: async () => '47777\n' })).rejects.toThrow();
    if (kind === 'valid') {
      expect(requests).toEqual([expect.objectContaining({ action: 'tab_new', url, browserId: handle.browserId, sessionName: 'retained' })]);
      expect(inventoryReads).toBeGreaterThanOrEqual(2);
      expect(Object.fromEntries(planQueries[0]!)).toMatchObject({ browserHost: 'remote_headed', displayIsolation: 'shared_display',
        viewStreamProvider: 'rdp_gateway', controlInputProvider: 'manual_attached_desktop' });
		} else if (kind === 'legacy') {
			expect(requests).toHaveLength(1);
			expect(requests[0]).not.toHaveProperty('browserId');
		} else if (kind === 'unisolated') {
			expect(requests).toEqual([expect.objectContaining({ action: 'tab_new', url, browserId: handle.browserId, sessionName: 'retained' })]);
			expect(planQueries[0]!.has('displayIsolation')).toBe(false);
		} else if (kind === 'cold-launch') {
			expect(requests).toEqual([expect.objectContaining({ action: 'tab_new', url, runtimeProfile: 'chatgpt-pro' })]);
			expect(requests[0]).not.toHaveProperty('browserId');
			expect(requests[0]).not.toHaveProperty('sessionName');
    } else expect(requests).toEqual([]);
    expect(requests.every(request => !('allowDuplicateProfileLane' in request))).toBe(true);
  },
);

it('creates a fresh project conversation while preserving existing conversations in that project and elsewhere', async () => {
  const url = 'https://chatgpt.com/g/g-p-11111111111111111111111111111111/project';
  const oldHandle = { valid: true, browserId: 'session:retained', sessionName: 'retained', profileId: 'chatgpt-pro',
    targetId: 'old-project-target', url: 'https://chatgpt.com/g/g-p-11111111111111111111111111111111-workshop/c/11111111-1111-1111-1111-111111111111' };
  const otherHandle = { ...oldHandle, targetId: 'other-project-target',
    url: 'https://chatgpt.com/g/g-p-22222222222222222222222222222222-other/c/22222222-2222-2222-2222-222222222222' };
  const newHandle = { ...oldHandle, targetId: 'new-project-target', url };
  const requests: Record<string, unknown>[] = [];
  let opened = false;
  const browser = () => ({ id: oldHandle.browserId, profileId: oldHandle.profileId, health: 'ready', pid: 123,
    host: 'remote_headed', tabHandles: opened ? [oldHandle, otherHandle, newHandle] : [oldHandle, otherHandle], displayIsolation: 'shared_display',
    viewStreams: [{ provider: 'rdp_gateway', controlInput: 'manual_attached_desktop' }] });
  const fetch = vi.fn(async (resource: unknown, init?: RequestInit) => {
    const route = String(resource);
    if (route.endsWith('/api/service/browsers')) {
      return Response.json({ success: true, data: { browsers: [browser()] } });
    }
    if (route.includes('/api/service/access-plan?')) {
      return Response.json({ success: true, data: { selectedProfile: { id: 'chatgpt-pro' }, decision: {
        profileReuse: { recommendedAction: 'reuse_existing_browser', reusableBrowserId: oldHandle.browserId,
          reusableSessionName: oldHandle.sessionName },
        serviceRequest: { available: true, request: { action: 'tab_new', url, runtimeProfile: 'chatgpt-pro',
          params: { browserHost: 'remote_headed', displayIsolation: 'shared_display', viewStreamProvider: 'rdp_gateway',
            controlInputProvider: 'manual_attached_desktop' } } },
      } } });
    }
    const request = JSON.parse(String(init?.body)) as Record<string, unknown>;
    requests.push(request);
    if (request.action === 'tab_new') {
      opened = true;
      return Response.json({ success: true, data: { serviceTabHandle: newHandle,
        sharedAcquisition: { mode: 'tab_new', action: 'opened_new_tab', tabOpened: true } } });
    }
    if (request.action === 'view_focus') return Response.json({ success: false, error: 'TEST_FOCUS_BOUNDARY' });
    if (request.action === 'tab_handle_release') return Response.json({ success: true, data: { released: true } });
    throw new Error(`unexpected request ${String(request.action)}`);
  });
  await expect(acquireAgentBrowserBrokerTab({ targetServiceId: 'chatgpt', mode: 'required', profileId: 'chatgpt-pro',
    browserHost: 'remote_headed', url }, { fetch: fetch as never, listStreamFiles: async () => ['/tmp/retained.stream'],
    readStreamFile: async () => '47777\n' })).rejects.toThrow('TEST_FOCUS_BOUNDARY');
  expect(requests.slice(0, 2)).toEqual([
    expect.objectContaining({ action: 'tab_new', browserId: oldHandle.browserId, sessionName: oldHandle.sessionName }),
    expect.objectContaining({ action: 'view_focus', browserId: oldHandle.browserId, sessionName: oldHandle.sessionName,
      targetId: newHandle.targetId, serviceTabHandle: newHandle, maximize: false, allowBringToFrontFailure: true }),
  ]);
  expect(requests.at(-1)).toMatchObject({ action: 'tab_handle_release', serviceTabHandle: newHandle });
  expect(oldHandle.valid).toBe(true);
  expect(otherHandle.valid).toBe(true);
  expect(requests.some(request => request.action === 'navigate' || request.action === 'close')).toBe(false);
});
