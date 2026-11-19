/** Copied from planttrust-backend contracts/m5-audit.md. Keep the two in sync. */
export interface AnchorReceipt {
  anchorId: string;
  hash: string;
  status: 'pending' | 'anchored';
  txHash: string | null;
}

export interface TrustIndex {
  companyId: string;
  score: number;
  components: Record<string, number>;
  updatedAt: string;
}

export interface DashboardSummary {
  anchoredEvents: number;
  pendingAnchors: number;
  companies: TrustIndex[];
}

export interface ModuleHealth {
  module: string;
  status: string;
}
