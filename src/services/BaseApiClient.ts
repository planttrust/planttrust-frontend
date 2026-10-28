import * as mocks from '@/lib/mockData';
import type { User } from '@/types';

export interface RequestOptions extends RequestInit {
  baseUrl?: string;
  isFormData?: boolean;
}

export class BaseApiClient {
  protected readonly defaultBaseUrl: string;
  protected isMockEnabled: boolean;

  constructor(baseUrl?: string) {
    this.defaultBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';
  }

  protected getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('planttrust_token') || localStorage.getItem('token');
  }

  protected setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_token', token);
    localStorage.setItem('token', token);
  }

  protected removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('planttrust_token');
    localStorage.removeItem('token');
  }

  protected getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('planttrust_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  protected setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_user', JSON.stringify(user));
  }

  protected removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('planttrust_user');
  }

  public clearSession(): void {
    this.removeToken();
    this.removeUser();
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { baseUrl = this.defaultBaseUrl, isFormData = false, ...fetchOptions } = options;
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = { ...((fetchOptions.headers as Record<string, string>) || {}) };

    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.error || data.message || `HTTP ${response.status}: ${response.statusText}`;
        const err = new Error(errorMsg) as any;
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data as T;
    } catch (error: any) {
      if (this.isMockEnabled || error.name === 'TypeError' || error.message?.includes('fetch')) {
        const mockResult = this.getMockFallback(endpoint, fetchOptions.method || 'GET', fetchOptions.body);
        if (mockResult !== null) {
          return mockResult as T;
        }
      }
      throw error;
    }
  }

  protected getMockFallback(endpoint: string, method: string, _body?: any): any {
    if (endpoint.includes('/health')) {
      return { status: 'mock_online', service: 'planttrust-frontend-mock', timestamp: new Date().toISOString() };
    }
    if (endpoint.includes('/api/auth/login') && method === 'POST') {
      return { message: 'Logged in (mock mode)', token: 'mock-jwt-token-investor', user: mocks.mockUsers[0] };
    }
    if (endpoint.includes('/api/auth/register') && method === 'POST') {
      return { message: 'Registered (mock mode)', token: 'mock-jwt-token-investor', user: mocks.mockUsers[0] };
    }
    if (endpoint.includes('/api/certificates/') && endpoint.includes('/verify')) {
      const certId = endpoint.split('/')[3];
      return mocks.mockCertificates.find((c) => c.certificateId === certId) || mocks.mockCertificates[0];
    }
    if (endpoint.includes('/api/certificates')) {
      return { certificates: mocks.mockCertificates };
    }
    if (endpoint.includes('/api/listings')) {
      return { listings: mocks.mockListings, total: mocks.mockListings.length, page: 1, totalPages: 1 };
    }
    if (endpoint.includes('/api/escrow/fund') && method === 'POST') {
      return {
        escrowId: `esc-${Date.now()}`,
        investorId: mocks.mockUsers[0].id,
        projectId: 'proj-kurunegala-agri',
        amount: 5000,
        state: 'FUNDED',
        anchorId: `anc-m2-${Date.now()}`,
        nftTokenId: '00080000MOCKNFTTOKENID92819481928491024A9D3F',
        createdAt: new Date().toISOString(),
      };
    }
    if (endpoint.includes('/api/escrow/') && endpoint.includes('/history')) {
      return mocks.mockEscrowHistory[0];
    }
    if (endpoint.includes('/api/transfers/p2p') && method === 'POST') {
      return {
        transferId: `trf-${Date.now()}`,
        escrowId: 'esc-9012-funded',
        sellerId: mocks.mockUsers[0].id,
        buyerId: 'u-1002-buyer',
        transferAmount: 2500,
        sellerNftBurned: true,
        buyerNftMinted: '00080000MOCKBUYERNFTID',
        anchorId: `anc-m2-trf-${Date.now()}`,
        transferredAt: new Date().toISOString(),
      };
    }
    if (endpoint.includes('/api/mcp/query') && method === 'POST') {
      return {
        sessionId: `sess-${Date.now()}`,
        response: 'The project is verified and backed by XRPL on-chain escrow.',
        sources: mocks.mockChatbotHistory[1]?.sources,
        reasoning: mocks.mockChatbotHistory[1]?.reasoning,
        confidence: 0.95,
      };
    }
    if (endpoint.includes('/api/chatbot/session') && method === 'POST') {
      return { sessionId: `sess-${Date.now()}`, createdAt: new Date().toISOString() };
    }
    if (endpoint.includes('/api/chatbot/session/')) {
      return { sessionId: 'sess-default', messages: mocks.mockChatbotHistory };
    }
    if (endpoint.includes('/api/scam/check') && method === 'POST') {
      return {
        projectId: 'proj-kurunegala-agri',
        flags: [],
        overallRisk: 'clear',
        reasoning: 'Velocity within normal bounds. CBSL capital adequacy met.',
      };
    }
    if (endpoint.includes('/api/scam/audit-log')) {
      return { flags: mocks.mockScamAuditLog, total: mocks.mockScamAuditLog.length, page: 1 };
    }
    if (endpoint.includes('/api/projects/') && endpoint.includes('/timeline')) {
      return { projectId: 'proj-kurunegala-agri', projectName: 'Kurunegala Organic Vanilla', milestones: mocks.mockMilestoneTimeline };
    }
    if (endpoint.includes('/api/reports/submit') && method === 'POST') {
      return {
        reportId: `rep-${Date.now()}`,
        projectId: 'proj-kurunegala-agri',
        milestone: 'planting_complete',
        status: 'pending_validation',
        evidenceCount: 3,
        submittedAt: new Date().toISOString(),
      };
    }
    if (endpoint.includes('/api/audit/anchor') && method === 'POST') {
      return {
        anchorId: `anc-${Date.now()}`,
        batchId: `batch-${Date.now()}`,
        status: 'queued',
        txHash: '4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
        merkleProof: ['0x12a...', '0x34b...'],
      };
    }
    if (endpoint.includes('/api/audit/verify/') || endpoint.includes('/api/verify/')) {
      return {
        anchorId: endpoint.split('/').pop() || 'anc-sample',
        dataHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        merkleRoot: '7a2b9184c910482b91a429e849201a84928194d8129481928491025f1a8c92b4',
        merkleProof: ['hash_left_01', 'hash_right_02'],
        txHash: '4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
        verified: true,
        explorerUrl: 'https://testnet.xrpl.org/transactions/4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
      };
    }
    if (endpoint.includes('/api/trust-index')) {
      return mocks.mockTrustIndex;
    }
    if (endpoint.includes('/api/audit')) {
      return { auditTrail: mocks.mockAuditTrail };
    }
    return null;
  }
}
