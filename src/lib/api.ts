/* ─── PlanTrust TypeScript API Client & OOP Architecture Bridge ─────────────
 * Central typed client adhering to Object-Oriented Programming (OOP) and SOLID
 * design principles. Bridges UI components to Domain Entities and OOP Services.
 * ──────────────────────────────────────────────────────────────────────── */

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

import { BaseApiClient, RequestOptions } from '@/services/BaseApiClient';
import authService, { AuthService } from '@/services/AuthService';
import marketplaceService, { MarketplaceService } from '@/services/MarketplaceService';
import chatbotService, { ChatbotService } from '@/services/ChatbotService';
import geofenceService, { GeofenceService } from '@/services/GeofenceService';
import auditService, { AuditService } from '@/services/AuditService';
import documentService, { DocumentService } from '@/services/DocumentService';

// Re-export OOP Services and Domain Entities
export * from '@/domain';
export * from '@/services';
export {
  authService,
  marketplaceService,
  chatbotService,
  geofenceService,
  auditService,
  documentService,
};

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = new BaseApiClient(API_BASE_URL);

// ─── Token & Session Storage (OOP Wrapper) ──────────────────────────────

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
    authService.clearSession();
  },
  isAuthenticated: (): boolean => {
    return authService.isAuthenticated();
  },
};

// ─── Unified API Facade ─────────────────────────────────────────────────

export const api = {
  // Base HTTP Verbs delegated to BaseApiClient
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient.request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient.request<T>(endpoint, { ...options, method: 'DELETE' }),
  upload: <T = any>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    apiClient.request<T>(endpoint, { ...options, method: 'POST', body: formData, isFormData: true }),

  // Health
  health: () => apiClient.request<HealthResponse>('/health'),

  // Module 1 (Nimsara Karunarathna) - Delegated to AuthService & DocumentService
  auth: {
    status: () => authService.getStatus(),
    login: (credentials: { email: string; password: string }) => authService.login(credentials),
    register: (userData: { email: string; password: string; name: string; role?: string; phone?: string }) =>
      authService.register(userData),
    logout: () => authService.logout(),
  },
  documents: {
    status: () => documentService.getDocumentsStatus(),
    upload: (formData: FormData) => documentService.uploadDocument(formData),
  },
  certificates: {
    status: () => documentService.getCertificatesStatus(),
    verify: (certificateId: string) => documentService.verifyCertificate(certificateId),
  },

  // Module 2 (Thilina Dasun) - Delegated to MarketplaceService
  listings: {
    status: () => marketplaceService.getListingsStatus(),
    getAll: async (params: Record<string, string> = {}) => {
      const res = await marketplaceService.getAllListings(params);
      return { listings: res.listings.map((l) => l.toJSON()), total: res.total };
    },
  },
  escrow: {
    status: () => marketplaceService.getEscrowStatus(),
    fund: async (payload: { projectId: string; amount: number }) => {
      const record = await marketplaceService.fundEscrow(payload);
      return record.toJSON();
    },
    release: (payload: { escrowId: string }) => marketplaceService.releaseEscrow(payload),
    getHistory: async (escrowId: string) => {
      const record = await marketplaceService.getEscrowHistory(escrowId);
      return record.toJSON();
    },
  },
  transfers: {
    status: () => marketplaceService.getTransfersStatus(),
    p2p: (payload: { escrowId: string; amount: number; buyerAddress: string }) =>
      marketplaceService.transferP2P(payload),
  },

  // Module 3 (Imesha Ariyawansha) - Delegated to ChatbotService
  mcp: {
    status: () => chatbotService.getMcpStatus(),
    query: (payload: { query: string; sessionId?: string }) => chatbotService.queryMcp(payload),
  },
  chatbot: {
    status: () => chatbotService.getChatbotStatus(),
    createSession: (payload: Record<string, any> = {}) => chatbotService.createSession(payload),
  },
  scam: {
    status: () => chatbotService.getScamStatus(),
    check: async (payload: { pitchText?: string; projectId?: string }) => {
      const analysis = await chatbotService.checkScam(payload);
      return analysis.toJSON();
    },
    getAuditLog: () => chatbotService.getScamAuditLog(),
  },

  // Module 4 (Yasuri Pradeepika) - Delegated to GeofenceService
  projects: {
    status: () => geofenceService.getProjectsStatus(),
    register: (payload: any) => geofenceService.registerProject(payload),
    getTimeline: (projectId: string) => geofenceService.getTimeline(projectId),
  },
  reports: {
    status: () => geofenceService.getReportsStatus(),
    submit: (formData: FormData) => geofenceService.submitReport(formData),
  },
  geofence: {
    status: () => geofenceService.getGeofenceStatus(),
  },

  // Module 5 (Mirath Nimsara) - Delegated to AuditService
  audit: {
    status: () => auditService.getAuditStatus(),
    anchor: (payload: any) => auditService.anchor(payload),
    verify: (anchorId: string) => auditService.verify(anchorId),
  },
  trustIndex: {
    status: () => auditService.getTrustIndexStatus(),
    get: async (id: string) => {
      const ti = await auditService.getTrustIndex(id);
      return ti.toJSON();
    },
  },
  verify: {
    status: () => auditService.getVerifyStatus(),
  },

  // Backward-compatibility module aliases
  module1: {
    get: (ep: string, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE1_URL, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE1_URL, method: 'POST', body: JSON.stringify(body) }),
  },
  module2: {
    get: (ep: string, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE2_URL, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE2_URL, method: 'POST', body: JSON.stringify(body) }),
  },
  module3: {
    get: (ep: string, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE3_URL, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE3_URL, method: 'POST', body: JSON.stringify(body) }),
  },
  module4: {
    get: (ep: string, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE4_URL, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE4_URL, method: 'POST', body: JSON.stringify(body) }),
  },
  module5: {
    get: (ep: string, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE5_URL, method: 'GET' }),
    post: (ep: string, body?: any, opt?: RequestOptions) =>
      apiClient.request(ep, { ...opt, baseUrl: process.env.NEXT_PUBLIC_MODULE5_URL, method: 'POST', body: JSON.stringify(body) }),
  },
};

export default api;
