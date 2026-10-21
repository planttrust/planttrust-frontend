/* ─── PlanTrust TypeScript Type Definitions ──────────────────────────────
 * Unified type contracts across all 5 modules:
 * M1: User Management & Corporate Registry
 * M2: Investor Marketplace & Escrow Lifecycle
 * M3: MCP-Driven Explainable AI & Chatbot
 * M4: Company Portal & Proof-of-Reality (Geofencing)
 * M5: Blockchain Auditing & Regulatory Dashboard
 * ──────────────────────────────────────────────────────────────────────── */

// ─── Module 1: User Management & Identity ───────────────────────────────

export type UserRole = 'investor' | 'company' | 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type DocumentType =
  | 'land_deed'
  | 'company_registration'
  | 'survey_plan'
  | 'tax_clearance';

export interface ExtractedDeedData {
  deedNumber?: string;
  notaryName?: string;
  landExtent?: string;
  surveyDate?: string;
  boundariesVerified?: boolean;
  registrationNumber?: string;
  companyName?: string;
  incorporationDate?: string;
  directorCount?: number;
  [key: string]: unknown;
}

export interface DocumentUploadResponse {
  documentId: string;
  fileName: string;
  docType: DocumentType;
  confidence: number;
  status: 'verified' | 'flagged_for_hitl';
  extractedData: ExtractedDeedData;
}

export interface DigitalTrustCertificate {
  certificateId: string;
  certificateNumber: string;
  companyId: string;
  companyName: string;
  status: 'active' | 'revoked';
  issuedAt: string;
  verified: boolean;
  anchorId: string;
  dataHash: string;
  txHash: string;
  explorerUrl: string;
  qrCodeUrl: string;
}

// ─── Module 2: Marketplace & Escrow ─────────────────────────────────────

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'low' | 'medium' | 'high';
export type ListingStatus = 'open' | 'fully_funded' | 'closed';

export interface ProjectListing {
  id?: string;
  listingId?: string;
  projectId?: string;
  companyId: string;
  companyName: string;
  title?: string;
  projectName?: string;
  category?: string;
  description: string;
  location?: string;
  targetAmount: number;
  fundedAmount: number;
  minInvestment: number;
  returnRate?: number;
  expectedReturn?: string;
  tenureMonths?: number;
  region?: string;
  trustScore: number;
  trustGrade?: string;
  riskLevel: RiskLevel;
  status: ListingStatus;
  nftTokenId?: string;
}

export type EscrowState =
  | 'NONE'
  | 'CREATED'
  | 'FUNDED'
  | 'LOCKED'
  | 'RELEASED'
  | 'REFUNDED';

export interface EscrowTransition {
  fromState: EscrowState;
  toState: EscrowState;
  triggeredBy: string;
  anchorId: string;
  timestamp: string;
}

export interface EscrowRecord {
  escrowId: string;
  projectId: string;
  investorId: string;
  amount: number;
  currentState: EscrowState;
  nftTokenId?: string;
  anchorId?: string;
  history?: EscrowTransition[];
  createdAt?: string;
}

export interface P2PTransferResult {
  transferId: string;
  escrowId: string;
  sellerId: string;
  buyerId: string;
  transferAmount: number;
  sellerNftBurned: boolean;
  buyerNftMinted: string;
  anchorId: string;
  transferredAt: string;
}

// ─── Module 3: MCP-Driven Explainable AI ────────────────────────────────

export interface ChatReasoning {
  cbslRulesEvaluated?: string[];
  complianceScore?: number;
  riskFlagsIdentified?: string[];
  merkleAnchorCitation?: string;
}

export interface ChatSourceItem {
  tool?: string;
  module?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  reasoning?: ChatReasoning;
  sources?: (string | ChatSourceItem)[];
  timestamp: string;
}

export interface ScamTypology {
  id: string;
  category: string;
  title: string;
  description: string;
  riskWeight: number;
  cbslRule: string;
}

export interface ScamCheckResult {
  overallRisk: 'LOW_RISK' | 'MEDIUM_RISK' | 'CRITICAL_RISK' | 'clear';
  riskScore: number;
  matchedTypologies: ScamTypology[];
  cbslGuideline?: string;
  recommendation?: string;
  reasoning?: string;
}

export interface ScamAuditRecord {
  id?: string;
  flagId?: string;
  projectId: string;
  projectTitle?: string;
  type?: string;
  severity?: 'low' | 'medium' | 'high';
  description?: string;
  matchedTypology?: string;
  riskScore?: number;
  anchorId?: string;
  txHash?: string;
  verified?: boolean;
  status?: string;
  createdAt?: string;
  timestamp?: string;
}

// ─── Module 4: Company Portal & Geofencing ──────────────────────────────

export type LatLngCoord = [number, number];

export interface GeofencedProject {
  id: string;
  name: string;
  location: string;
  areaHectares: number;
  polygonId: string;
  centroid: { lat: number; lng: number };
  polygonCoordinates: LatLngCoord[];
}

export interface ExifValidation {
  gpsMatchesBoundary: boolean;
  spoofingRisk: string;
  deviceModel: string;
  timestampPlausible: boolean;
}

export interface DHashValidation {
  perceptualHash: string;
  duplicateFound: boolean;
  similarityScore: string;
}

export interface MilestoneReportResult {
  reportId: string;
  milestone: string;
  submittedAt: string;
  exifValidation: ExifValidation;
  dhashResult: DHashValidation;
  escrowTriggered: boolean;
  escrowMessage: string;
}

export interface MilestoneTimelineItem {
  id: string;
  title?: string;
  milestone?: string;
  status: 'verified' | 'pending_validation' | 'approved' | 'rejected';
  completedAt?: string;
  approvedAt?: string;
  submittedAt?: string;
  exifVerified?: boolean;
  dhashUnique?: boolean;
  anchorId?: string;
  txHash?: string;
  explorerUrl?: string;
  evidenceCount?: number;
  geofencePassRate?: number;
}

// ─── Module 5: Blockchain Auditing & Dashboard ──────────────────────────

export interface AuditEvent {
  id: string;
  sourceModule: string;
  eventType: string;
  entityId: string;
  dataHash: string;
  merkleRoot: string;
  xrplTxHash: string;
  txHash?: string;
  anchorId?: string;
  xrplLedgerIndex?: number;
  status: 'CONFIRMED' | 'PENDING' | 'QUEUED';
  timestamp: string;
}

export interface TrustIndexComponents {
  kycVerification?: number;
  escrowDiscipline?: number;
  milestoneReality?: number;
  documentVerification?: number;
  escrowHealth?: number;
  complianceScore?: number;
  geofencePassRate?: number;
}

export interface TrustIndex {
  projectId?: string;
  companyId?: string;
  score?: number;
  trustScore?: number;
  grade?: string;
  components: TrustIndexComponents;
  lastUpdated: string;
}

export interface MerkleProofResult {
  anchorId: string;
  dataHash: string;
  merkleRoot: string;
  merkleProof: string[];
  txHash: string;
  verified: boolean;
  explorerUrl: string;
}

// ─── System Health ──────────────────────────────────────────────────────

export interface HealthResponse {
  status: 'ok' | 'mock_online' | 'offline' | string;
  service?: string;
  timestamp?: string;
  uptime?: number;
  error?: string;
}
