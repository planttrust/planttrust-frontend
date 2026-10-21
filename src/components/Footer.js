/* ─── PlanTrust Global Footer ─────────────────────────────────────────────
 * Shared footer highlighting team ownership, architecture, and developer resources.
 * ──────────────────────────────────────────────────────────────────────── */

import Link from 'next/link';

export default function Footer() {
  const teamModules = [
    { module: 'Module 1', name: 'Nimsara Karunarathna', role: 'User Management & Corporate Registry', route: '/auth', ai: 'OCR + Vision Fallback', chain: 'Trust Certificates' },
    { module: 'Module 2', name: 'Thilina Dasun', role: 'Investor Marketplace & Escrow Lifecycle', route: '/marketplace', ai: 'Anomaly Detector', chain: 'XRPL NFT Minting' },
    { module: 'Module 3', name: 'Imesha Ariyawansha', role: 'MCP-Driven Explainable AI & Chatbot', route: '/chatbot', ai: 'Scam & CBSL Rule Engine', chain: 'Proof-of-Inclusion' },
    { module: 'Module 4', name: 'Yasuri Pradeepika', role: 'Company Portal & Proof-of-Reality', route: '/company', ai: 'dHash + EXIF Anti-Spoof', chain: 'Milestone Badges' },
    { module: 'Module 5', name: 'Mirath Nimsara', role: 'Blockchain Auditing & Regulatory Dashboard', route: '/dashboard', ai: 'Digital Trust Index', chain: 'Merkle XRPL Anchoring' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col footer-col-wide">
            <div className="footer-brand">
              <div className="navbar-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <span className="navbar-title">PlanTrust</span>
            </div>
            <p className="footer-desc">
              Next-generation blockchain land investment platform built on the XRP Ledger (XRPL) Testnet.
              Featuring state-machine escrow, GPS polygon geofencing, explainable AI scam detection, and
              cryptographic Merkle tree anchoring.
            </p>
            <div className="footer-meta">
              <span className="badge badge-emerald">Unified Monolith API :3000</span>
              <span className="badge badge-cyan">XRPL Testnet wss</span>
              <span className="badge badge-purple">PostgreSQL 16 + Redis 7</span>
            </div>
          </div>

          {/* Module Ownership Quick Access */}
          <div className="footer-col footer-col-wide">
            <h4 className="footer-heading">Module Engineering Leads</h4>
            <div className="footer-team-grid">
              {teamModules.map((tm) => (
                <Link key={tm.module} href={tm.route} className="footer-team-item">
                  <span className="footer-team-badge">{tm.module}</span>
                  <div>
                    <div className="footer-team-name">{tm.name}</div>
                    <div className="footer-team-role">{tm.role}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Developer Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Developer Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/planttrust/planttrust-backend" target="_blank" rel="noopener noreferrer">
                  Backend Repository ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/planttrust/planttrust-frontend" target="_blank" rel="noopener noreferrer">
                  Frontend Repository ↗
                </a>
              </li>
              <li>
                <a href="https://testnet.xrpl.org" target="_blank" rel="noopener noreferrer">
                  XRPL Testnet Explorer ↗
                </a>
              </li>
              <li>
                <Link href="/auth">API Authentication Spec</Link>
              </li>
              <li>
                <Link href="/dashboard">Merkle Audit Ledger</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PlanTrust Platform. All rights reserved.</p>
          <p className="footer-bottom-muted">
            All 5 layers integrated: Frontend • Backend • Database • AI Vision & Heuristics • XRPL Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
}
