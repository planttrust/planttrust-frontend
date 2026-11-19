import { apiRequest, withMockFallback } from '@/shared/api/client';
import { mockListings } from './mocks';
import type { Listing, ModuleHealth } from './types';

const BASE = '/api/marketplace';

export function getHealth() {
  return apiRequest<ModuleHealth>(`${BASE}/health`);
}

export function listListings() {
  return withMockFallback(() => apiRequest<Listing[]>(`${BASE}/listings`), mockListings);
}
