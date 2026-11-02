import { BaseApiClient } from './BaseApiClient';
import { ScamAnalysisEntity } from '@/domain/ScamAnalysis';
import type { ScamAuditRecord, ScamCheckResult } from '@/types';

export class ChatbotService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE3_URL);
  }

  public async getMcpStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/mcp');
  }

  public async getChatbotStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/chatbot');
  }

  public async getScamStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/scam');
  }

  public async queryMcp(payload: { query: string; sessionId?: string }) {
    return this.request<{ sessionId: string; response: string; reasoning?: any; sources?: any[]; confidence?: number }>(
      '/api/mcp/query',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  public async createSession(payload: Record<string, any> = {}): Promise<{ sessionId: string }> {
    return this.request<{ sessionId: string }>('/api/chatbot/session', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async checkScam(payload: { pitchText?: string; projectId?: string }): Promise<ScamAnalysisEntity> {
    const res = await this.request<ScamCheckResult>('/api/scam/check', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return ScamAnalysisEntity.fromJSON(res);
  }

  public async getScamAuditLog(): Promise<{ flags: ScamAuditRecord[] }> {
    return this.request<{ flags: ScamAuditRecord[] }>('/api/scam/audit-log');
  }
}

const chatbotService = new ChatbotService();
export default chatbotService;
