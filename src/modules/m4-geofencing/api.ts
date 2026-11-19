import { apiRequest, withMockFallback } from '@/shared/api/client';
import { mockMyProjects } from './mocks';
import type { ModuleHealth, ProjectSummary } from './types';

const BASE = '/api/geofencing';

export function getHealth() {
  return apiRequest<ModuleHealth>(`${BASE}/health`);
}

export function listMyProjects() {
  return withMockFallback(
    () => apiRequest<ProjectSummary[]>(`${BASE}/projects/mine`),
    mockMyProjects,
  );
}
