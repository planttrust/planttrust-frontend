/* ─── PlanTrust TypeScript API Client ─────────────────────────────────────
 * Central typed client for communicating with the unified PlanTrust backend (:3000).
 * Supports automatic token injection, multipart uploads, and mock fallbacks.
 * ──────────────────────────────────────────────────────────────────────── */

import * as mocks from './mockData';
import type {
  User,
  AuthResponse,
  DigitalTrustCertificate,
  ProjectListing,
  EscrowRecord,
  P2PTransferResult,
  ScamCheckResult,
  ScamAuditRecord,
  MilestoneReportResult,
  MilestoneTimelineItem,
  AuditEvent,
  TrustIndex,
  MerkleProofResult,
  HealthResponse,
} from '@/types';

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const MODULE_BASE_URLS: Record<string, string> = {
  module1: process.env.NEXT_PUBLIC_MODULE1_URL || API_BASE_URL,
  module2: process.env.NEXT_PUBLIC_MODULE2_URL || API_BASE_URL,
  module3: process.env.NEXT_PUBLIC_MODULE3_URL || API_BASE_URL,
  module4: process.env.NEXT_PUBLIC_MODULE4_URL || API_BASE_URL,
  module5: process.env.NEXT_PUBLIC_MODULE5_URL || API_BASE_URL,
};

const IS_MOCK_ENABLED: boolean = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

// ─── Token & Session Management ─────────────────────────────────────────

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('planttrust_token') || localStorage.getItem('token');
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_token', token);
    localStorage.setItem('token', token);
  },
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('planttrust_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_user', JSON.stringify(user));
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('planttrust_token');
    localStorage.removeItem('token');
    localStorage.removeItem('planttrust_user');
  },
  isAuthenticated: (): boolean => {
    return Boolean(authStorage.getToken());
  },
};

// ─── Core HTTP Request Utility ──────────────────────────────────────────

interface RequestOptions extends RequestInit {
  baseUrl?: string;
  isFormData?: boolean;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl = API_BASE_URL, isFormData = false, ...fetchOptions } = options;
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = { ...((fetchOptions.headers as Record<string, string>) || {}) };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = authStorage.getToken();
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
    if (IS_MOCK_ENABLED || error.name === 'TypeError' || error.message?.includes('fetch')) {
      const mockResult = getMockFallback(endpoint, fetchOptions.method || 'GET', fetchOptions.body);
      if (mockResult !== null) {
        return mockResult as T;
      }
    }
    throw error;
  }
}

// ─── Mock Fallback Dispatcher ───────────────────────────────────────────

function getMockFallback(endpoint: string, method: string, _body?: any): any {
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

// ─── Module-Specific Typed Namespaces ───────────────────────────────────

export const api = {
  // Base HTTP Verbs
  get: <T = any>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T = any>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: formData, isFormData: true }),

  // Health
  health: () => request<HealthResponse>('/health'),

  // Module 1 (Nimsara Karunarathna)
  auth: {
    status: () => request<{ message: string }>('/api/auth', { baseUrl: MODULE_BASE_URLS.module1 }),
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
      const res = await request<AuthResponse>('/api/auth/login', {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res?.token) {
        authStorage.setToken(res.token);
        if (res.user) authStorage.setUser(res.user);
      }
      return res;
    },
    register: async (userData: { email: string; password: string; name: string; role?: string; phone?: string }): Promise<AuthResponse> => {
      const res = await request<AuthResponse>('/api/auth/register', {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res?.token) {
        authStorage.setToken(res.token);
        if (res.user) authStorage.setUser(res.user);
      }
      return res;
    },
    logout: () => {
      authStorage.clear();
    },
  },
  documents: {
    status: () => request<{ message: string }>('/api/documents', { baseUrl: MODULE_BASE_URLS.module1 }),
    upload: (formData: FormData) =>
      request('/api/documents/upload', {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: formData,
        isFormData: true,
      }),
  },
  certificates: {
    status: () => request<{ message: string }>('/api/certificates', { baseUrl: MODULE_BASE_URLS.module1 }),
    verify: (certificateId: string) =>
      request<DigitalTrustCertificate>(`/api/certificates/${certificateId}/verify`, { baseUrl: MODULE_BASE_URLS.module1 }),
  },

  // Module 2 (Thilina Dasun)
  listings: {
    status: () => request<{ message: string }>('/api/listings', { baseUrl: MODULE_BASE_URLS.module2 }),
    getAll: (params: Record<string, string> = {}) => {
      const query = new URLSearchParams(params).toString();
      return request<{ listings: ProjectListing[]; total?: number }>(`/api/listings${query ? `?${query}` : ''}`, {
        baseUrl: MODULE_BASE_URLS.module2,
      });
    },
  },
  escrow: {
    status: () => request<{ message: string }>('/api/escrow', { baseUrl: MODULE_BASE_URLS.module2 }),
    fund: (payload: { projectId: string; amount: number }) =>
      request<EscrowRecord>('/api/escrow/fund', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    release: (payload: { escrowId: string }) =>
      request('/api/escrow/release', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getHistory: (escrowId: string) =>
      request<EscrowRecord>(`/api/escrow/${escrowId}/history`, {
        baseUrl: MODULE_BASE_URLS.module2,
      }),
  },
  transfers: {
    status: () => request<{ message: string }>('/api/transfers', { baseUrl: MODULE_BASE_URLS.module2 }),
    p2p: (payload: { escrowId: string; amount: number; buyerAddress: string }) =>
      request<P2PTransferResult>('/api/transfers/p2p', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Module 3 (Imesha Ariyawansha)
  mcp: {
    status: () => request<{ message: string }>('/api/mcp', { baseUrl: MODULE_BASE_URLS.module3 }),
    query: (payload: { query: string; sessionId?: string }) =>
      request<{ sessionId: string; response: string; reasoning?: any; sources?: any[]; confidence?: number }>('/api/mcp/query', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  chatbot: {
    status: () => request<{ message: string }>('/api/chatbot', { baseUrl: MODULE_BASE_URLS.module3 }),
    createSession: (payload: Record<string, any> = {}) =>
      request<{ sessionId: string }>('/api/chatbot/session', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  scam: {
    status: () => request<{ message: string }>('/api/scam', { baseUrl: MODULE_BASE_URLS.module3 }),
    check: (payload: { pitchText?: string; projectId?: string }) =>
      request<ScamCheckResult>('/api/scam/check', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getAuditLog: () =>
      request<{ flags: ScamAuditRecord[] }>('/api/scam/audit-log', {
        baseUrl: MODULE_BASE_URLS.module3,
      }),
  },

  // Module 4 (Yasuri Pradeepika)
  projects: {
    status: () => request<{ message: string }>('/api/projects', { baseUrl: MODULE_BASE_URLS.module4 }),
    register: (payload: any) =>
      request('/api/projects/register', {
        baseUrl: MODULE_BASE_URLS.module4,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getTimeline: (projectId: string) =>
      request<{ projectId: string; milestones: MilestoneTimelineItem[] }>(`/api/projects/${projectId}/timeline`, {
        baseUrl: MODULE_BASE_URLS.module4,
      }),
  },
  reports: {
    status: () => request<{ message: string }>('/api/reports', { baseUrl: MODULE_BASE_URLS.module4 }),
    submit: (formData: FormData) =>
      request<MilestoneReportResult>('/api/reports/submit', {
        baseUrl: MODULE_BASE_URLS.module4,
        method: 'POST',
        body: formData,
        isFormData: true,
      }),
  },
  geofence: {
    status: () => request<{ message: string }>('/api/geofence', { baseUrl: MODULE_BASE_URLS.module4 }),
  },

  // Module 5 (Mirath Nimsara)
  audit: {
    status: () => request<{ message: string }>('/api/audit', { baseUrl: MODULE_BASE_URLS.module5 }),
    anchor: (payload: any) =>
      request('/api/audit/anchor', {
        baseUrl: MODULE_BASE_URLS.module5,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    verify: (anchorId: string) =>
      request<MerkleProofResult>(`/api/audit/verify/${anchorId}`, {
        baseUrl: MODULE_BASE_URLS.module5,
      }),
  },
  trustIndex: {
    status: () => request<{ message: string }>('/api/trust-index', { baseUrl: MODULE_BASE_URLS.module5 }),
    get: (id: string) =>
      request<TrustIndex>(`/api/trust-index/${id}`, {
        baseUrl: MODULE_BASE_URLS.module5,
      }),
  },
  verify: {
    status: () => request<{ message: string }>('/api/verify', { baseUrl: MODULE_BASE_URLS.module5 }),
  },

  // Backward-compatibility module aliases
  module1: {
    get: (ep: string, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module1, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module1, method: 'POST', body: JSON.stringify(body) }),
  },
  module2: {
    get: (ep: string, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module2, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module2, method: 'POST', body: JSON.stringify(body) }),
  },
  module3: {
    get: (ep: string, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module3, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module3, method: 'POST', body: JSON.stringify(body) }),
  },
  module4: {
    get: (ep: string, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module4, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module4, method: 'POST', body: JSON.stringify(body) }),
  },
  module5: {
    get: (ep: string, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module5, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) => request(ep, { ...opt, baseUrl: MODULE_BASE_URLS.module5, method: 'POST', body: JSON.stringify(body) }),
  },
};

export default api;
