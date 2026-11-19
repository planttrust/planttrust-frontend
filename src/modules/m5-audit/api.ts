import { apiRequest, withMockFallback } from '@/shared/api/client';
import { mockDashboard } from './mocks';
import type { DashboardSummary, ModuleHealth } from './types';

const BASE = '/api/audit';

export function getHealth() {
  return apiRequest<ModuleHealth>(`${BASE}/health`);
}

export function getDashboard() {
  return withMockFallback(() => apiRequest<DashboardSummary>(`${BASE}/dashboard`), mockDashboard);
}
