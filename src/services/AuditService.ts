import { BaseApiClient } from './BaseApiClient';
import { TrustIndexEntity } from '@/domain/TrustIndex';
import type { AuditEvent, MerkleProofResult, TrustIndex } from '@/types';

export class AuditService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE5_URL);
  }

  public async getAuditStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/audit');
  }

  public async getTrustIndexStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/trust-index');
  }

  public async getVerifyStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/verify');
  }

  public async anchor(payload: any): Promise<any> {
    return this.request('/api/audit/anchor', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async verify(anchorId: string): Promise<MerkleProofResult> {
    return this.request<MerkleProofResult>(`/api/audit/verify/${anchorId}`);
  }

  public async getTrustIndex(projectId: string): Promise<TrustIndexEntity> {
    const res = await this.request<TrustIndex>(`/api/trust-index/${projectId}`);
    return TrustIndexEntity.fromJSON(res);
  }

  public async getAuditTrail(): Promise<{ auditTrail: AuditEvent[] }> {
    return this.request<{ auditTrail: AuditEvent[] }>('/api/audit');
  }
}

const auditService = new AuditService();
export default auditService;
