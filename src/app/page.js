'use client';

/* ─── PlanTrust Platform Landing Page & Developer Hub ─────────────────────
 * Entry point for the frontend, connecting all 5 modules and providing
 * live backend health inspection, quick access to module workspaces, and
 * architecture verification.
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function Home() {
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadHealth() {
      const start = performance.now();
      try {
        const res = await api.health();
        const elapsed = Math.round(performance.now() - start);
        if (!ignore) {
          setLatency(elapsed);
          setHealthData(res);
          setHealthLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setHealthData({ status: 'offline', error: err.message });
          setLatency(null);
          setHealthLoading(false);
        }
      }
    }
    loadHealth();
    return () => {
      ignore = true;
    };
  }, []);

  const modules = [
    {
      num: 1,
      title: 'User Management & Corporate Registry',
      owner: 'Nimsara Karunarathna',
      route: '/auth',
      endpoints: ['/api/auth', '/api/documents', '/api/certificates'],
      aiFeature: 'OCR Document Extraction + Vision LLM Fallback',
      chainFeature: 'Digital Trust Certificate Anchoring',
      color: 'emerald',
      desc: 'Manages investor and company onboarding, multi-document deed uploads, confidence scoring, and Human-in-the-Loop review.',
    },
    {
      num: 2,
      title: 'Investor Marketplace & Escrow Lifecycle',
      owner: 'Thilina Dasun',
      route: '/marketplace',
      endpoints: ['/api/listings', '/api/escrow', '/api/transfers'],
      aiFeature: 'Investment-Pattern Anomaly Detector',
      chainFeature: 'XRPL NFT Minting for Investor Stakes',
      color: 'cyan',
      desc: 'Project discovery, 5-stage escrow state machine (CREATED → FUNDED → LOCKED → RELEASED/REFUNDED), and atomic P2P secondary trading.',
    },
    {
      num: 3,
      title: 'MCP-Driven Explainable AI & Chatbot',
      owner: 'Imesha Ariyawansha',
      route: '/chatbot',
      endpoints: ['/api/mcp', '/api/chatbot', '/api/scam'],
      aiFeature: 'Scam Typology Classifier + CBSL Rule Engine',
      chainFeature: 'On-Chain Audit Log Proof-of-Inclusion Queries',
      color: 'purple',
      desc: 'JSON-RPC 2.0 Model Context Protocol server exposing verified tools to AI agents, fraud typology detection, and natural language audit explanations.',
    },
    {
      num: 4,
      title: 'Company Portal & Proof-of-Reality (Geofencing)',
      owner: 'Yasuri Pradeepika',
      route: '/company',
      endpoints: ['/api/projects', '/api/reports', '/api/geofence'],
      aiFeature: 'dHash Duplicate-Detection + Anti-Spoofing',
      chainFeature: 'Milestone Timeline with On-Chain Proof Badges',
      color: 'blue',
      desc: 'Polygon land boundary registration, point-in-polygon ray casting, EXIF anti-spoofing, and milestone progress report verification.',
    },
    {
      num: 5,
      title: 'Blockchain Auditing & Regulatory Dashboard',
      owner: 'Mirath Nimsara',
      route: '/dashboard',
      endpoints: ['/api/audit', '/api/trust-index', '/api/verify'],
      aiFeature: 'Digital Trust Index (Weighted Composite 0-100)',
      chainFeature: 'Core Merkle Tree Batching + XRPL Pipeline',
      color: 'amber',
      desc: 'Central cryptographic audit trail, SHA-256 event hashing, automatic Merkle tree batching committed to the XRPL Testnet, and public proof verifier.',
    },
  ];

  return (
    <div className="home-container">
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-badge-wrap">
          <span className="badge badge-cyan">PlanTrust Core Platform</span>
          <span className="badge badge-emerald">XRPL Testnet Integration</span>
          <span className="badge badge-purple">5 Modules Unified</span>
        </div>
        <h1 className="hero-title">
          Blockchain-Anchored Land Investment Platform
        </h1>
        <p className="hero-subtitle">
          Secure, transparent agricultural and commercial land investments backed by smart escrow,
          polygon geofencing, explainable AI fraud detection, and cryptographic XRPL Merkle proofs.
        </p>

        <div className="hero-cta-group">
          <Link href="/marketplace" className="btn btn-primary">
            Explore Marketplace (M2) →
          </Link>
          <Link href="/auth" className="btn btn-outline">
            Identity & Registration (M1)
          </Link>
          <Link href="/dashboard" className="btn btn-ghost">
            View Audit Ledger (M5)
          </Link>
        </div>

        {/* System Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-val">5 / 5</div>
            <div className="stat-label">Modules Ready</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">:3000</div>
            <div className="stat-label">Unified API Port</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">XRPL</div>
            <div className="stat-label">Ledger Anchoring</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">100%</div>
            <div className="stat-label">5-Layer Architecture</div>
          </div>
        </div>
      </section>

      {/* ─── Live Backend Health Inspector ────────────────────────────── */}
      <section className="health-inspector-card">
        <div className="health-inspector-header">
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`status-dot ${healthData?.status === 'ok' ? 'status-dot-emerald' : healthData?.status === 'mock_online' ? 'status-dot-cyan' : 'status-dot-rose'}`}></span>
              Live Backend Health Inspector
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Monitoring unified backend server at <code>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}</code>
            </p>
          </div>
          <button
            onClick={async () => {
              setHealthLoading(true);
              const start = performance.now();
              try {
                const res = await api.health();
                const elapsed = Math.round(performance.now() - start);
                setLatency(elapsed);
                setHealthData(res);
              } catch (err) {
                setHealthData({ status: 'offline', error: err.message });
                setLatency(null);
              } finally {
                setHealthLoading(false);
              }
            }}
            disabled={healthLoading}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
          >
            {healthLoading ? 'Checking...' : '🔄 Ping Backend'}
          </button>
        </div>

        <div className="health-details-grid">
          <div className="health-detail-item">
            <span className="detail-label">Service Status</span>
            <span className={`detail-val ${healthData?.status === 'ok' ? 'text-emerald' : healthData?.status === 'mock_online' ? 'text-cyan' : 'text-rose'}`}>
              {healthLoading ? 'Pinging...' : healthData?.status === 'ok' ? 'Online (Unified Monolith)' : healthData?.status === 'mock_online' ? 'Client Mock Fallback Active' : 'Offline / Unreachable'}
            </span>
          </div>

          <div className="health-detail-item">
            <span className="detail-label">Network Latency</span>
            <span className="detail-val">
              {latency ? `${latency} ms` : healthLoading ? '...' : 'N/A'}
            </span>
          </div>

          <div className="health-detail-item">
            <span className="detail-label">Server Timestamp</span>
            <span className="detail-val" style={{ fontSize: '0.82rem' }}>
              {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'N/A'}
            </span>
          </div>

          <div className="health-detail-item">
            <span className="detail-label">Architecture</span>
            <span className="detail-val">Express + PG 16 + Redis 7</span>
          </div>
        </div>

        {healthData?.status !== 'ok' && healthData?.status !== 'mock_online' && (
          <div className="alert-box alert-amber" style={{ marginTop: '1rem' }}>
            <strong>Backend Offline Notice:</strong> The unified backend is currently not responding on <code>http://localhost:3000</code>.
            The frontend will automatically use contract-adherent mock data so you can test and build UI immediately.
            To start the backend, run <code>npm run dev</code> inside <code>planttrust-backend</code> or <code>docker-compose up</code>.
          </div>
        )}
      </section>

      {/* ─── Module Engineering Workspaces ────────────────────────────── */}
      <section className="section-wrap">
        <div className="section-header">
          <div>
            <span className="badge badge-emerald">Team Engineering Hub</span>
            <h2>Module Implementation Workspaces</h2>
            <p>
              Each team member owns one of the five modules across all five technical layers:
              Frontend, Backend, Database, AI Vision/Rules, and XRPL Blockchain.
            </p>
          </div>
        </div>

        <div className="modules-grid">
          {modules.map((m) => (
            <div key={m.num} className="module-card">
              <div className="module-card-top">
                <span className={`badge badge-${m.color}`}>Module {m.num}</span>
                <span className="module-card-owner">{m.owner}</span>
              </div>

              <h3 className="module-card-title">{m.title}</h3>
              <p className="module-card-desc">{m.desc}</p>

              <div className="module-card-meta">
                <div className="meta-row">
                  <span className="meta-key">AI Layer:</span>
                  <span className="meta-val">{m.aiFeature}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Blockchain:</span>
                  <span className="meta-val">{m.chainFeature}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">API Routes:</span>
                  <span className="meta-val">
                    <code>{m.endpoints.join(', ')}</code>
                  </span>
                </div>
              </div>

              <div className="module-card-footer">
                <Link href={m.route} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                  Open Module {m.num} Workspace →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Cross-Module Lifecycle Flow ──────────────────────────────── */}
      <section className="section-wrap">
        <div className="section-header">
          <span className="badge badge-purple">System Execution Pipeline</span>
          <h2>End-to-End Investment Lifecycle</h2>
          <p>How the 5 modules collaborate to ensure institutional trust and auditability.</p>
        </div>

        <div className="pipeline-flow">
          <div className="pipeline-step">
            <div className="step-num">1</div>
            <h4>Company Onboarding</h4>
            <p>M1 verifies land deeds via OCR + Vision AI; issues Digital Trust Certificate.</p>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-step">
            <div className="step-num">2</div>
            <h4>Geofence Registration</h4>
            <p>M4 anchors GPS polygon coordinates for the project&apos;s physical perimeter.</p>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-step">
            <div className="step-num">3</div>
            <h4>Escrow Funding</h4>
            <p>M2 investors fund project in escrow state machine; XRPL NFT minted.</p>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-step">
            <div className="step-num">4</div>
            <h4>Proof-of-Reality Milestone</h4>
            <p>M4 verifies geo-tagged photos + dHash; triggers M2 escrow release.</p>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-step">
            <div className="step-num">5</div>
            <h4>AI Audit & Merkle Proof</h4>
            <p>M3 checks scam risk; M5 anchors SHA-256 event hash to XRPL Testnet.</p>
          </div>
        </div>
      </section>

      {/* ─── Developer Quick Start ────────────────────────────────────── */}
      <section className="section-wrap dev-quickstart">
        <div className="section-header">
          <span className="badge badge-cyan">Developer Quickstart</span>
          <h2>Local Development Guide</h2>
        </div>

        <div className="quickstart-grid">
          <div className="quickstart-card">
            <h4>1. Unified Backend (Port 3000)</h4>
            <p>Ensure the unified backend is running:</p>
            <pre className="code-block">
{`# In planttrust-backend:
npm install
npm run dev
# Server running at http://localhost:3000`}
            </pre>
          </div>

          <div className="quickstart-card">
            <h4>2. Frontend (Port 3001 or 3000)</h4>
            <p>Run the Next.js frontend dev server:</p>
            <pre className="code-block">
{`# In planttrust-frontend:
npm install
npm run dev
# App running at http://localhost:3000`}
            </pre>
          </div>

          <div className="quickstart-card">
            <h4>3. Docker Compose (All-in-One)</h4>
            <p>Spins up PostgreSQL, Redis, Backend, and Frontend:</p>
            <pre className="code-block">
{`# In parent directory or planttrust-backend:
docker-compose up -d
# Frontend on :3001, Backend on :3000`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
