import { BaseApiClient } from './BaseApiClient';
import { ProjectListingEntity } from '@/domain/ProjectListing';
import { EscrowRecordEntity } from '@/domain/EscrowRecord';
import type { EscrowRecord, P2PTransferResult, ProjectListing } from '@/types';

export class MarketplaceService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE2_URL);
  }

  public async getListingsStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/listings');
  }

  public async getEscrowStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/escrow');
  }

  public async getTransfersStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/transfers');
  }

  public async getAllListings(params: Record<string, string> = {}): Promise<{ listings: ProjectListingEntity[]; total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await this.request<{ listings: ProjectListing[]; total?: number }>(`/api/listings${query ? `?${query}` : ''}`);
    const rawListings = res?.listings || [];
    return {
      listings: rawListings.map((l) => ProjectListingEntity.fromJSON(l)),
      total: res?.total ?? rawListings.length,
    };
  }

  public async fundEscrow(payload: { projectId: string; amount: number }): Promise<EscrowRecordEntity> {
    const res = await this.request<EscrowRecord>('/api/escrow/fund', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return EscrowRecordEntity.fromJSON(res);
  }

  public async releaseEscrow(payload: { escrowId: string }): Promise<any> {
    return this.request('/api/escrow/release', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getEscrowHistory(escrowId: string): Promise<EscrowRecordEntity> {
    const res = await this.request<EscrowRecord>(`/api/escrow/${escrowId}/history`);
    return EscrowRecordEntity.fromJSON(res);
  }

  public async transferP2P(payload: { escrowId: string; amount: number; buyerAddress: string }): Promise<P2PTransferResult> {
    return this.request<P2PTransferResult>('/api/transfers/p2p', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

const marketplaceService = new MarketplaceService();
export default marketplaceService;
