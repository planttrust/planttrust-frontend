/* ─── PlanTrust API Client ────────────────────────────────────────────────
 * Central client for communicating with the unified PlanTrust backend.
 *
 * Architecture:
 *   Backend is a Unified Modular Monolith running on port 3000 (Express).
 *   All module routes are mounted under:
 *     - Module 1: /api/auth, /api/documents, /api/certificates
 *     - Module 2: /api/listings, /api/escrow, /api/transfers
 *     - Module 3: /api/mcp, /api/chatbot, /api/scam
 *     - Module 4: /api/projects, /api/reports, /api/geofence
 *     - Module 5: /api/audit, /api/trust-index, /api/verify
 *     - System:   /health
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const data = await api.auth.login({ email, password });
 *   const listings = await api.listings.getAll();
 * ──────────────────────────────────────────────────────────────────────── */

import * as mocks from './mockData';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const MODULE_BASE_URLS = {
  module1: process.env.NEXT_PUBLIC_MODULE1_URL || API_BASE_URL,
  module2: process.env.NEXT_PUBLIC_MODULE2_URL || API_BASE_URL,
  module3: process.env.NEXT_PUBLIC_MODULE3_URL || API_BASE_URL,
  module4: process.env.NEXT_PUBLIC_MODULE4_URL || API_BASE_URL,
  module5: process.env.NEXT_PUBLIC_MODULE5_URL || API_BASE_URL,
};

const IS_MOCK_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';

// ─── Token & Session Management ─────────────────────────────────────────

export const authStorage = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('planttrust_token') || localStorage.getItem('token');
  },
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_token', token);
    localStorage.setItem('token', token); // backward compat
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('planttrust_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('planttrust_user', JSON.stringify(user));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('planttrust_token');
    localStorage.removeItem('token');
    localStorage.removeItem('planttrust_user');
  },
  isAuthenticated: () => {
    return Boolean(authStorage.getToken());
  },
};

// ─── Core HTTP Request Utility ──────────────────────────────────────────

async function request(endpoint, options = {}) {
  const { baseUrl = API_BASE_URL, isFormData = false, ...fetchOptions } = options;
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = { ...fetchOptions.headers };

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
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // If backend is unreachable or explicitly in mock mode, provide structured contract mocks
    if (IS_MOCK_ENABLED || error.name === 'TypeError' || error.message?.includes('fetch')) {
      const mockResult = getMockFallback(endpoint, fetchOptions.method || 'GET', fetchOptions.body);
      if (mockResult !== null) {
        return mockResult;
      }
    }
    throw error;
  }
}

// ─── Mock Fallback Dispatcher ───────────────────────────────────────────

function getMockFallback(endpoint, method) {
  // Check endpoints
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
      sources: mocks.mockChatbotHistory[1].sources,
      reasoning: mocks.mockChatbotHistory[1].reasoning,
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
  if (endpoint.includes('/api/audit/verify/')) {
    return {
      anchorId: endpoint.split('/').pop(),
      dataHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '7a2b9184c910482b91a429e849201a84928194d8129481928491025f1a8c92b4',
      merkleProof: ['hash_left_01', 'hash_right_02'],
      txHash: '4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
      verified: true,
      explorerUrl: 'https://testnet.xrpl.org/transactions/4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
    };
  }
  if (endpoint.includes('/api/trust-index') || endpoint.includes('/api/audit/trust-index')) {
    return mocks.mockTrustIndex;
  }
  if (endpoint.includes('/api/audit')) {
    return { auditTrail: mocks.mockAuditTrail };
  }
  return null;
}

// ─── Module-Specific API Namespaces ─────────────────────────────────────

export const api = {
  // Base HTTP Verbs
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData, options) =>
    request(endpoint, { ...options, method: 'POST', body: formData, isFormData: true }),

  // System & Health
  health: () => request('/health'),

  // ─── Module 1: User Management & Corporate Registry (Nimsara Karunarathna)
  auth: {
    status: () => request('/api/auth', { baseUrl: MODULE_BASE_URLS.module1 }),
    login: async (credentials) => {
      const res = await request('/api/auth/login', {
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
    register: async (userData) => {
      const res = await request('/api/auth/register', {
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
    status: () => request('/api/documents', { baseUrl: MODULE_BASE_URLS.module1 }),
    upload: (formData) =>
      request('/api/documents/upload', {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: formData,
        isFormData: true,
      }),
    getReview: (documentId) =>
      request(`/api/documents/${documentId}/review`, { baseUrl: MODULE_BASE_URLS.module1 }),
    decision: (documentId, decisionData) =>
      request(`/api/documents/${documentId}/decision`, {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: JSON.stringify(decisionData),
      }),
  },
  certificates: {
    status: () => request('/api/certificates', { baseUrl: MODULE_BASE_URLS.module1 }),
    issue: (companyId) =>
      request('/api/certificates/issue', {
        baseUrl: MODULE_BASE_URLS.module1,
        method: 'POST',
        body: JSON.stringify({ companyId }),
      }),
    verify: (certificateId) =>
      request(`/api/certificates/${certificateId}/verify`, { baseUrl: MODULE_BASE_URLS.module1 }),
  },

  // ─── Module 2: Investor Marketplace & Escrow (Thilina Dasun)
  listings: {
    status: () => request('/api/listings', { baseUrl: MODULE_BASE_URLS.module2 }),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/api/listings${query ? `?${query}` : ''}`, {
        baseUrl: MODULE_BASE_URLS.module2,
      });
    },
  },
  escrow: {
    status: () => request('/api/escrow', { baseUrl: MODULE_BASE_URLS.module2 }),
    fund: (payload) =>
      request('/api/escrow/fund', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    release: (payload) =>
      request('/api/escrow/release', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getHistory: (escrowId) =>
      request(`/api/escrow/${escrowId}/history`, {
        baseUrl: MODULE_BASE_URLS.module2,
      }),
  },
  transfers: {
    status: () => request('/api/transfers', { baseUrl: MODULE_BASE_URLS.module2 }),
    p2p: (payload) =>
      request('/api/transfers/p2p', {
        baseUrl: MODULE_BASE_URLS.module2,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // ─── Module 3: MCP-Driven AI & Chatbot (Imesha Ariyawansha)
  mcp: {
    status: () => request('/api/mcp', { baseUrl: MODULE_BASE_URLS.module3 }),
    query: (payload) =>
      request('/api/mcp/query', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  chatbot: {
    status: () => request('/api/chatbot', { baseUrl: MODULE_BASE_URLS.module3 }),
    createSession: (payload = {}) =>
      request('/api/chatbot/session', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getHistory: (sessionId) =>
      request(`/api/chatbot/session/${sessionId}/history`, {
        baseUrl: MODULE_BASE_URLS.module3,
      }),
  },
  scam: {
    status: () => request('/api/scam', { baseUrl: MODULE_BASE_URLS.module3 }),
    check: (payload) =>
      request('/api/scam/check', {
        baseUrl: MODULE_BASE_URLS.module3,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getAuditLog: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/api/scam/audit-log${query ? `?${query}` : ''}`, {
        baseUrl: MODULE_BASE_URLS.module3,
      });
    },
  },

  // ─── Module 4: Company Portal & Geofencing (Yasuri Pradeepika)
  projects: {
    status: () => request('/api/projects', { baseUrl: MODULE_BASE_URLS.module4 }),
    register: (payload) =>
      request('/api/projects/register', {
        baseUrl: MODULE_BASE_URLS.module4,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getTimeline: (projectId) =>
      request(`/api/projects/${projectId}/timeline`, {
        baseUrl: MODULE_BASE_URLS.module4,
      }),
  },
  reports: {
    status: () => request('/api/reports', { baseUrl: MODULE_BASE_URLS.module4 }),
    submit: (formData) =>
      request('/api/reports/submit', {
        baseUrl: MODULE_BASE_URLS.module4,
        method: 'POST',
        body: formData,
        isFormData: true,
      }),
    getValidation: (reportId) =>
      request(`/api/reports/${reportId}/validation`, {
        baseUrl: MODULE_BASE_URLS.module4,
      }),
    approve: (reportId, payload) =>
      request(`/api/reports/${reportId}/approve`, {
        baseUrl: MODULE_BASE_URLS.module4,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  geofence: {
    status: () => request('/api/geofence', { baseUrl: MODULE_BASE_URLS.module4 }),
  },

  // ─── Module 5: Blockchain Auditing & Dashboard (Mirath Nimsara)
  audit: {
    status: () => request('/api/audit', { baseUrl: MODULE_BASE_URLS.module5 }),
    anchor: (payload) =>
      request('/api/audit/anchor', {
        baseUrl: MODULE_BASE_URLS.module5,
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    verify: (anchorId) =>
      request(`/api/audit/verify/${anchorId}`, {
        baseUrl: MODULE_BASE_URLS.module5,
      }),
  },
  trustIndex: {
    status: () => request('/api/trust-index', { baseUrl: MODULE_BASE_URLS.module5 }),
    get: (id) =>
      request(`/api/trust-index/${id}`, {
        baseUrl: MODULE_BASE_URLS.module5,
      }),
  },
  verify: {
    status: () => request('/api/verify', { baseUrl: MODULE_BASE_URLS.module5 }),
  },

  // ─── Backward Compatibility Aliases (api.module1.post, etc.) ───────────
  module1: {
    get: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module1, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module1, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module1, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module1, method: 'DELETE' }),
  },
  module2: {
    get: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module2, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module2, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module2, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module2, method: 'DELETE' }),
  },
  module3: {
    get: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module3, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module3, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module3, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module3, method: 'DELETE' }),
  },
  module4: {
    get: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module4, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module4, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module4, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module4, method: 'DELETE' }),
  },
  module5: {
    get: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module5, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module5, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module5, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, baseUrl: MODULE_BASE_URLS.module5, method: 'DELETE' }),
  },
};

export default api;
