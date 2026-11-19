import { apiRequest, withMockFallback } from '@/shared/api/client';
import { mockChatReply } from './mocks';
import type { ChatReply, ModuleHealth } from './types';

const BASE = '/api/mcp-ai';

export function getHealth() {
  return apiRequest<ModuleHealth>(`${BASE}/health`);
}

export function sendChatMessage(text: string) {
  return withMockFallback(
    () => apiRequest<ChatReply>(`${BASE}/chat`, { method: 'POST', body: { text } }),
    mockChatReply,
  );
}
