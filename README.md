# PlanTrust — Frontend

The modern Next.js + TypeScript frontend for [PlanTrust](https://github.com/planttrust/planttrust-backend), an institutional blockchain-based land investment platform built on the XRPL Testnet.

---

## Technology Stack (Table 6.1 Alignment)

| Category | Technology | Usage & Specification |
|---|---|---|
| **Core Framework** | **Next.js 16 (App Router)** | Static prerendering, server & client component architecture, Turbopack |
| **Language** | **TypeScript 5 (Strict)** | Unified shared data models (`src/types/index.ts`) matching backend PostgreSQL schemas |
| **Styling** | **Tailwind CSS v3 + CSS Variables** | Dark-mode glassmorphism design system (`tailwind.config.ts`, `globals.css`) |
| **GIS & Geofencing** | **Leaflet (`react-leaflet` / OpenStreetMap)** | Module 4 polygon parcel boundary visualizer, telemetry pins, and ray-casting |
| **Analytics & Visuals** | **Recharts** | Module 2 investment velocity bar charts & Module 5 Digital Trust Index radar |
| **API Integration** | **Central Fetch Client (`src/lib/api.ts`)** | Native JWT injection, unified `:3000` routing, and offline mock fallback |

---

## Architecture Overview

PlanTrust uses a unified **two-repository architecture**:
- **Backend (`planttrust-backend`):** A unified modular monolith (Express.js, PostgreSQL 16, Redis 7, XRPL.js) running on **port 3000**.
- **Frontend (`planttrust-frontend`):** A Next.js 16 application with typed module routes corresponding to the five core system modules.

### Module Ownership & 5-Layer Engineering Scope

Each team member owns one module spanning all five layers (Frontend, Backend, Database, AI Vision/Rules, and XRPL Blockchain):

| Route | Module | Owner | Key AI Feature | Key Blockchain Feature |
|---|---|---|---|---|
| `/auth` | **M1 — User Management & Corporate Registry** | _Nimsara Karunarathna_ | OCR Document Extraction + Vision LLM Fallback | Digital Trust Certificate Anchoring |
| `/marketplace` | **M2 — Investor Marketplace & Escrow** | _Thilina Dasun_ | Investment-Pattern Anomaly Detector | XRPL NFT Minting for Investor Stakes |
| `/chatbot` | **M3 — MCP-Driven Explainable AI & Chatbot** | _Imesha Ariyawansha_ | Scam Typology Classifier + CBSL Rules Engine | Proof-of-Inclusion Audit Citations |
| `/company` | **M4 — Company Portal & Proof-of-Reality** | _Yasuri Pradeepika_ | Perceptual dHash Duplicate Detection + EXIF Anti-Spoof | Milestone Badges with On-Chain Proofs |
| `/dashboard` | **M5 — Blockchain Auditing & Regulatory Dashboard** | _Mirath Nimsara_ | Digital Trust Index (Weighted 0–100 Composite) | Merkle Tree Batching & XRPL Pipeline |

---

## Project Structure

```
planttrust-frontend/
├── contracts/                        # Synced API contracts (*.md) for all 5 modules
│   ├── module-1-user-management.md
│   ├── module-2-marketplace.md
│   ├── module-3-mcp-ai.md
│   ├── module-4-company-geofencing.md
│   ├── module-5-blockchain-audit.md
│   └── README.md
├── src/
│   ├── app/
│   │   ├── auth/page.tsx             # M1: KYC, OCR upload, corporate registry lookup
│   │   ├── marketplace/page.tsx      # M2: Marketplace, escrow lock, P2P transfers, Recharts
│   │   ├── chatbot/page.tsx          # M3: MCP explainability chat, CBSL scam classifier
│   │   ├── company/page.tsx          # M4: Polygon geofence visualizer (Leaflet), milestone reports
│   │   ├── dashboard/page.tsx        # M5: Immutable audit trail, trust radar (Recharts), verifier
│   │   ├── layout.tsx                # Root layout with fonts, leaflet CSS, global nav & footer
│   │   ├── page.tsx                  # Interactive landing page & live backend health inspector
│   │   └── globals.css               # Core Tailwind tokens & glassmorphism utilities
│   ├── components/
│   │   ├── Navbar.tsx                # Global navbar with live :3000 health indicator & role switcher
│   │   ├── Footer.tsx                # Platform footer with team module matrix & developer links
│   │   ├── ModuleContractBanner.tsx  # Developer HUD with endpoints and contract viewer
│   │   ├── GeofenceMap.tsx           # Interactive Leaflet map with polygon & point ray-casting
│   │   └── TrustRadarChart.tsx       # Recharts 4-factor radar chart component for Module 5
│   ├── lib/
│   │   ├── api.ts                    # Central typed API client for :3000 with mock fallback
│   │   └── mockData.ts               # Contract-adherent mock datasets for offline development
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces for all 5 modules
├── .env.example                      # Template environment variables
├── .env.local                        # Local development overrides (git-ignored)
├── Dockerfile                        # Production container definition
├── postcss.config.mjs                # PostCSS configuration with Tailwind CSS & Autoprefixer
├── tailwind.config.ts                # Tailwind CSS v3 theme tokens and color palette
├── tsconfig.json                     # Strict TypeScript compiler options
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (Node 22 or 24 recommended)
- Unified backend running on `http://localhost:3000` (optional; offline mock mode works out of the box)

### 1. Installation

Install all dependencies using `--legacy-peer-deps` (required for React 19 compatibility with mapping and chart libraries):

```bash
cd planttrust-frontend
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Default settings in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_MOCKS=false
```

### 3. Launch Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or port assigned if 3000 is occupied by backend) to view the application.

---

## Developer Guide for Team Members

Each team member has a dedicated route, typed data contracts, and pre-wired API hooks ready to extend.

### M1: Nimsara Karunarathna — `/auth`
- **File:** `src/app/auth/page.tsx`
- **Key Types:** `User`, `AuthResponse`, `KycDocument`, `DigitalTrustCertificate`
- **API Methods:** `api.auth.login`, `api.auth.register`, `api.documents.upload`, `api.certificates.verify`
- **Next Steps:** Wire live OCR upload file input to backend `/api/documents/upload`.

### M2: Thilina Dasun — `/marketplace`
- **File:** `src/app/marketplace/page.tsx`
- **Key Types:** `ProjectListing`, `EscrowDetails`, `P2PTransferResult`
- **Visuals:** Recharts funding velocity progress bar chart
- **API Methods:** `api.listings.getAll`, `api.escrow.fund`, `api.transfers.p2p`
- **Next Steps:** Wire live XRPL NFT minting and escrow tranche locking to backend `/api/escrow/fund`.

### M3: Imesha Ariyawansha — `/chatbot`
- **File:** `src/app/chatbot/page.tsx`
- **Key Types:** `ChatMessage`, `ChatReasoning`, `ScamAnalysisResult`, `ScamAuditRecord`
- **API Methods:** `api.mcp.query`, `api.scam.check`, `api.scam.auditTrail`
- **Next Steps:** Connect MCP stream endpoint `/api/mcp/chat` and evaluate CBSL rules engine.

### M4: Yasuri Pradeepika — `/company`
- **File:** `src/app/company/page.tsx`
- **Key Component:** `<GeofenceMap />` (`src/components/GeofenceMap.tsx`)
- **Key Types:** `GeofencedProject`, `MilestoneReportResult`, `MilestoneTimelineItem`
- **GIS:** Leaflet polygon visualizer with interactive point click-to-test
- **API Methods:** `api.projects.register`, `api.reports.submit`, `api.geofence.status`
- **Next Steps:** Connect live EXIF GPS parser and dHash duplicate detector to `/api/reports/submit`.

### M5: Mirath Nimsara — `/dashboard`
- **File:** `src/app/dashboard/page.tsx`
- **Key Component:** `<TrustRadarChart />` (`src/components/TrustRadarChart.tsx`)
- **Key Types:** `AuditEvent`, `TrustIndex`, `MerkleProofResult`
- **Analytics:** Recharts 4-factor radar chart and real-time Merkle proof verifier
- **API Methods:** `api.audit.status`, `api.trustIndex.get`, `api.audit.verify`
- **Next Steps:** Wire XRPL ledger transaction lookup to live Merkle proof verification endpoint `/api/audit/verify/:anchorId`.

---

## Central API Client & TypeScript Types

Import contracts and typed client anywhere in the codebase:

```typescript
import { api, authStorage } from '@/lib/api';
import type { ProjectListing, AuditEvent, TrustIndex } from '@/types';

// Example: Module 2 project query
const projects: ProjectListing[] = await api.listings.getAll();

// Example: Module 5 trust index query
const trust: TrustIndex = await api.trustIndex.get('proj-kurunegala-agri');
```

---

## Verification & Build Commands

All code is strictly verified and guaranteed to pass:

```bash
# Typecheck
npx tsc --noEmit

# Lint check (0 errors, 0 warnings)
npm run lint

# Production build & static route prerender
npm run build
```

---

## Branching & Contribution Workflow

- `main` — Production-ready, verified baseline.
- `develop` — Shared development integration branch.
- `feature/<module>/<ticket-name>` — Module-specific feature branches (e.g. `feature/m1/ocr-vision`, `feature/m4/exif-pipeline`).
