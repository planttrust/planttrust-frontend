# PlanTrust — Frontend

The Next.js frontend for [PlanTrust](https://github.com/planttrust/planttrust-backend), an institutional blockchain-based land investment platform built on the XRPL Testnet.

---

## Architecture Overview

PlanTrust uses a modern **two-repository architecture**:
- **Backend (`planttrust-backend`):** A unified modular monolith (Express.js, PostgreSQL 16, Redis 7, XRPL.js) running on **port 3000**.
- **Frontend (`planttrust-frontend`):** A shared Next.js application built with App Router, custom design tokens, and modular pages corresponding to the five system modules.

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
├── contracts/               # Synced API contracts (*.md) for all 5 modules
│   ├── module-1-user-management.md
│   ├── module-2-marketplace.md
│   ├── module-3-mcp-ai.md
│   ├── module-4-company-geofencing.md
│   ├── module-5-blockchain-audit.md
│   └── README.md
├── src/
│   ├── app/
│   │   ├── auth/            # M1: Login, registration, OCR upload, certificate lookup
│   │   ├── marketplace/     # M2: Project discovery, escrow state machine, P2P transfers
│   │   ├── chatbot/         # M3: MCP explainability chat, CBSL scam classifier
│   │   ├── company/         # M4: Polygon geofence visualizer, milestone progress reports
│   │   ├── dashboard/       # M5: Immutable audit trail, trust index breakdown, proof verifier
│   │   ├── layout.js        # Root layout with global navigation & footer
│   │   ├── page.js          # Interactive landing page & live backend health inspector
│   │   └── globals.css      # Core design system tokens, responsive grid, glassmorphism
│   ├── components/
│   │   ├── Navbar.js        # Shared navbar with live :3000 health indicator & role switcher
│   │   ├── Footer.js        # Platform footer with team module matrix & developer links
│   │   └── ModuleContractBanner.js # Developer HUD displaying routes & live endpoint tester
│   └── lib/
│       ├── api.js           # Central API client for unified backend (:3000) with mock fallback
│       └── mockData.js      # Contract-adherent mock datasets for offline development
├── .env.example             # Template environment variables
├── .env.local               # Local development overrides (git-ignored)
├── Dockerfile               # Production container definition
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (Node 24 recommended, see `.nvmrc`)
- The backend services running (see [`planttrust-backend`](https://github.com/planttrust/planttrust-backend))

### 1. Local Development

```bash
# Clone and enter the frontend directory
cd planttrust-frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or Next.js fallback port if 3000 is occupied by backend) to view the application.

> **Port Note:** In local standalone development without Docker, if the unified backend is running on `http://localhost:3000`, Next.js will automatically select `http://localhost:3001` or another available port.

### 2. Running with Docker Compose (Recommended)

When developing with the full stack, run Docker Compose from the parent directory or the backend repository:

```bash
# Start backend, database (PostgreSQL 16), Redis 7, and frontend container
docker-compose up -d

# View live logs
docker-compose logs -f
```

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Postgres:** `localhost:5432`
- **Redis:** `localhost:6379`

---

## Environment Variables

Configure your local environment in `.env.local`:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Unified PlanTrust Backend API | `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_MOCKS` | Enable mock fallback if backend is offline (`true`/`false`) | `false` |
| `NEXT_PUBLIC_MODULE1_URL` | Optional override for Module 1 | Defaults to `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_MODULE2_URL` | Optional override for Module 2 | Defaults to `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_MODULE3_URL` | Optional override for Module 3 | Defaults to `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_MODULE4_URL` | Optional override for Module 4 | Defaults to `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_MODULE5_URL` | Optional override for Module 5 | Defaults to `NEXT_PUBLIC_API_URL` |

---

## Using the API Client

All pages should import the central API client rather than invoking `fetch` directly:

```javascript
import { api, authStorage } from '@/lib/api';

// ─── Module 1 (Auth & Users)
const authRes = await api.auth.login({ email, password });
const docRes = await api.documents.upload(formData);
const cert = await api.certificates.verify(certificateId);

// ─── Module 2 (Marketplace & Escrow)
const listings = await api.listings.getAll();
const escrow = await api.escrow.fund({ projectId, amount });
const transfer = await api.transfers.p2p({ escrowId, amount, buyerAddress });

// ─── Module 3 (Explainable AI & Chatbot)
const answer = await api.mcp.query({ query: "Is this scheme compliant?" });
const scamScore = await api.scam.check({ pitchText });

// ─── Module 4 (Company Portal & Geofencing)
const project = await api.projects.register(geoJsonBoundary);
const report = await api.reports.submit(geoTaggedFormData);

// ─── Module 5 (Blockchain & Regulatory)
const auditTrail = await api.audit.status();
const trustIndex = await api.trustIndex.get(projectId);
const proof = await api.audit.verify(anchorId);
```

### Automatic Auth & Fallback Features:
1. **JWT Injection:** Any token stored via `authStorage.setToken(token)` is automatically attached as an `Authorization: Bearer <token>` header on subsequent requests.
2. **Offline Mock Fallback:** If the backend endpoint is unreachable or returns a scaffolded status, the client gracefully falls back to structured contract mock data from `src/lib/mockData.js`.

---

## Branching & Contribution Model

- `main` — Production release, demo-ready
- `develop` — Shared team integration baseline
- `feature/<module>/<ticket-name>` — Module-specific feature branches (e.g., `feature/m1/ocr-confidence`, `feature/m2/escrow-state-machine`)

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint syntax check |
