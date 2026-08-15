import { describe, expect, it } from 'vitest';
import {
  assertDashboardSessionReadinessProjection,
  createDashboardSessionReadinessSmokeCases,
} from '../../scripts/smoke-dashboard-session-readiness.js';

describe('dashboard-session readiness smoke contract', () => {
  it('defines one ready and one scoped-only external-routing case', () => {
    const cases = createDashboardSessionReadinessSmokeCases();

    expect(cases.map((entry) => ({
      name: entry.name,
      scoped: entry.expected.scoped,
      operatorKeyCount: entry.expected.operatorKeyCount,
      dashboardSessionReady: entry.expected.dashboardSessionReady,
    }))).toEqual([
      {
        name: 'ready',
        scoped: false,
        operatorKeyCount: 1,
        dashboardSessionReady: true,
      },
      {
        name: 'scoped-only',
        scoped: true,
        operatorKeyCount: 0,
        dashboardSessionReady: false,
      },
    ]);
  });

  it('accepts exact readiness and rejects credential metadata', () => {
    const ready = createDashboardSessionReadinessSmokeCases()[0];
    if (!ready) throw new Error('Ready smoke case is missing.');
    const auth = {
      required: true,
      keyCount: 1,
      scoped: false,
      operatorKeyCount: 1,
      trustedLocalOperatorDashboard: false,
      trustedLocalOperatorDashboardReason: 'external_routing',
      dashboardSessionRequired: true,
      dashboardSessionReady: true,
    };

    expect(() => assertDashboardSessionReadinessProjection(auth, ready, 'test')).not.toThrow();
    expect(() => assertDashboardSessionReadinessProjection(
      { ...auth, secrets: ['forbidden'] },
      ready,
      'test',
    )).toThrow('test auth exposed forbidden field secrets.');
  });
});
