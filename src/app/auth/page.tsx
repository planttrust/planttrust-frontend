'use client';

/* ─── Module 1: User Management & Corporate Registry (TypeScript) ─────────
 * Owner: Nimsara Karunarathna
 * Scope: Frontend • Backend • Database • AI (OCR) • Blockchain (Certificates)
 * Base Endpoints: /api/auth, /api/documents, /api/certificates
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import ModuleContractBanner from '@/components/ModuleContractBanner';
import { api, authStorage } from '@/lib/api';
import { mockCertificates } from '@/lib/mockData';
import type { User, UserRole, DocumentType, DocumentUploadResponse, DigitalTrustCertificate } from '@/types';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'auth' | 'documents' | 'certificates'>('auth');

  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('aiden.investor@planttrust.org');
  const [password, setPassword] = useState('SecurePass123!');
  const [name, setName] = useState('Aiden Silva');
  const [role, setRole] = useState<UserRole>('investor');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [currentUser, setCurrentUser] = useState<User | null>(() => (typeof window !== 'undefined' ? authStorage.getUser() : null));
  const [authLoading, setAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Document Upload State
  const [docType, setDocType] = useState<DocumentType>('land_deed');
  const [fileName, setFileName] = useState('');
  const [ocrResult, setOcrResult] = useState<DocumentUploadResponse | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Certificate Verification State
  const [searchCertId, setSearchCertId] = useState('PT-CERT-2026-0089');
  const [foundCert, setFoundCert] = useState<DigitalTrustCertificate | null>(mockCertificates[0]);
  const [certSearching, setCertSearching] = useState(false);

  // Handle Login / Register
  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthFeedback(null);

    try {
      if (isLogin) {
        const res = await api.auth.login({ email, password });
        setCurrentUser(res.user || authStorage.getUser());
        setAuthFeedback({ type: 'success', text: `Logged in as ${res.user?.name || email} (${res.user?.role || 'user'})` });
      } else {
        const res = await api.auth.register({ email, password, name, role, phone });
        setCurrentUser(res.user || authStorage.getUser());
        setAuthFeedback({ type: 'success', text: `Account created for ${name}! JWT token issued.` });
      }
    } catch (err: any) {
      setAuthFeedback({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setAuthFeedback({ type: 'info', text: 'You have been logged out.' });
  };

  // Handle OCR Document Upload Simulation
  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      alert('Please enter or select a document file');
      return;
    }
    setOcrLoading(true);
    setTimeout(() => {
      const isDeed = docType === 'land_deed';
      const confidence = isDeed ? 0.94 : 0.78;
      const status = confidence >= 0.85 ? 'verified' : 'flagged_for_hitl';
      setOcrResult({
        documentId: `doc-${Date.now()}`,
        fileName,
        docType,
        confidence,
        status,
        extractedData: isDeed
          ? {
              deedNumber: 'LK-DEED-2024-88912',
              notaryName: 'K. M. Wickramasinghe',
              landExtent: '14.5 Acres (Kurunegala District)',
              surveyDate: '2023-11-18',
              boundariesVerified: true,
            }
          : {
              registrationNumber: 'PV-108291',
              companyName: 'Ceylon Agro Ventures PLC',
              incorporationDate: '2021-04-12',
              directorCount: 4,
            },
      });
      setOcrLoading(false);
    }, 1000);
  };

  // Handle Certificate Lookup
  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    setCertSearching(true);
    setTimeout(() => {
      const query = searchCertId.trim().toLowerCase();
      const match = mockCertificates.find(
        (c) =>
          c.certificateId.toLowerCase().includes(query) ||
          c.certificateNumber.toLowerCase().includes(query) ||
          c.companyName.toLowerCase().includes(query)
      );
      setFoundCert(match || null);
      setCertSearching(false);
    }, 400);
  };

  const endpoints = [
    { method: 'POST', path: '/api/auth/register', desc: 'Register user with role (investor/company/admin)' },
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate credentials & issue JWT token' },
    { method: 'GET', path: '/api/auth', desc: 'Health & status check for Auth module' },
    { method: 'POST', path: '/api/documents/upload', desc: 'Upload land deeds / company registration docs' },
    { method: 'GET', path: '/api/documents', desc: 'Status check for documents pipeline' },
    { method: 'GET', path: '/api/certificates', desc: 'Status check for certificates service' },
    { method: 'GET', path: '/api/certificates/verify', desc: 'Public lookup for anchored Digital Trust Certificates' },
  ];

  return (
    <div className="module-page">
      {/* HUD Banner */}
      <ModuleContractBanner
        moduleNumber="1"
        moduleName="User Management & Corporate Registry"
        owner="Nimsara Karunarathna"
        effortScore="16"
        aiFeature="Document OCR + Vision LLM Fallback + Confidence Scoring"
        blockchainFeature="Digital Trust Certificate Issuance & XRPL Anchoring"
        endpoints={endpoints}
        contractFileName="module-1-user-management.md"
      />

      {/* Navigation Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'auth' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          🔐 Auth & Roles (PostgreSQL :3000)
        </button>
        <button
          className={`tab-btn ${activeTab === 'documents' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📄 AI Document OCR & HITL Queue
        </button>
        <button
          className={`tab-btn ${activeTab === 'certificates' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          🏅 Digital Trust Certificates (XRPL)
        </button>
      </div>

      {/* ─── TAB 1: Authentication & User Management ─────────────────── */}
      {activeTab === 'auth' && (
        <div className="two-col-layout">
          {/* Form Card */}
          <div className="glass-card">
            <div className="card-header">
              <h3>{isLogin ? 'Sign In to PlanTrust' : 'Register New Account'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Directly connects to unified backend <code>POST /api/auth/{isLogin ? 'login' : 'register'}</code>
              </p>
            </div>

            {authFeedback && (
              <div className={`alert-box alert-${authFeedback.type === 'error' ? 'rose' : 'emerald'}`}>
                {authFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubmitAuth} className="form-stack">
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label>Full Name / Corporate Entity Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Role</label>
                    <select
                      className="form-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value="investor">Investor (Fund projects & secondary market)</option>
                      <option value="company">Company (Register land projects & milestones)</option>
                      <option value="admin">Admin / Auditor (HITL review & compliance)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password (min 8 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {authLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create PlanTrust Account'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Register here →" : 'Already registered? Sign in here →'}
                </button>
              </div>
            </form>
          </div>

          {/* Current Session / Token Card */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Active Session & Token Inspector</h3>
              <span className={`badge ${currentUser ? 'badge-emerald' : 'badge-subtle'}`}>
                {currentUser ? 'Session Active' : 'No Active Session'}
              </span>
            </div>

            {currentUser ? (
              <div className="session-details">
                <div className="meta-row">
                  <span className="meta-key">User ID:</span>
                  <span className="meta-val"><code>{currentUser.id}</code></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Name:</span>
                  <span className="meta-val">{currentUser.name}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Email:</span>
                  <span className="meta-val">{currentUser.email}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Role:</span>
                  <span className="meta-val">
                    <span className={`badge ${currentUser.role === 'admin' ? 'badge-rose' : currentUser.role === 'company' ? 'badge-purple' : 'badge-emerald'}`} style={{ textTransform: 'capitalize' }}>
                      {currentUser.role}
                    </span>
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">JWT Token:</span>
                  <span className="meta-val" style={{ wordBreak: 'break-all', fontSize: '0.75rem', color: 'var(--emerald-400)' }}>
                    {authStorage.getToken()?.slice(0, 32)}...
                  </span>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ flex: 1 }}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No user currently logged in. Sign in or use demo presets below:</p>
                <div className="demo-presets" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setEmail('aiden.investor@planttrust.org');
                      setPassword('SecurePass123!');
                      setIsLogin(true);
                    }}
                  >
                    Load Investor Preset (Aiden Silva)
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setEmail('projects@ceylonagro.lk');
                      setPassword('SecurePass123!');
                      setIsLogin(true);
                    }}
                  >
                    Load Company Preset (Ceylon Agro)
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setEmail('compliance@planttrust.org');
                      setPassword('SecurePass123!');
                      setIsLogin(true);
                    }}
                  >
                    Load Admin Auditor Preset
                  </button>
                </div>
              </div>
            )}

            <div className="info-box" style={{ marginTop: '1.5rem' }}>
              <strong>Architectural Note:</strong> When the backend server on <code>port 3000</code> is running, this issues a cryptographic JWT signed with <code>JWT_SECRET</code> and persists the user record in PostgreSQL 16 (<code>users</code> table).
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Document Upload & AI OCR ─────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <h3>Upload Deed or Corporate Filing</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>POST /api/documents/upload</code> (OCR + Vision AI Extraction)
              </p>
            </div>

            <form onSubmit={handleUploadDoc} className="form-stack">
              <div className="form-group">
                <label>Document Classification</label>
                <select
                  className="form-input"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                >
                  <option value="land_deed">Land Title Deed / Ownership Grant</option>
                  <option value="company_registration">Certificate of Incorporation (Form 1)</option>
                  <option value="survey_plan">Cadastral Survey Plan & Coordinates</option>
                  <option value="tax_clearance">Inland Revenue Tax Clearance Certificate</option>
                </select>
              </div>

              <div className="form-group">
                <label>Document File</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kurunegala_Land_Deed_Scan_2024.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => setFileName('Kurunegala_Land_Deed_88912.pdf')}
                  >
                    Sample Deed PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => setFileName('Ceylon_Agro_Reg_PV108291.pdf')}
                  >
                    Sample Registration PDF
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={ocrLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {ocrLoading ? 'Scanning with Vision AI...' : 'Upload & Trigger AI OCR'}
              </button>
            </form>

            <div className="info-box" style={{ marginTop: '1.5rem' }}>
              <strong>AI Logic:</strong> Extractions with confidence &ge; 0.85 are automatically certified. Extractions &lt; 0.85 are queued for Admin Human-in-the-Loop (HITL) review.
            </div>
          </div>

          {/* OCR Result Card */}
          <div className="glass-card">
            <div className="card-header">
              <h3>AI Extraction & OCR Result</h3>
              {ocrResult && (
                <span className={`badge ${ocrResult.status === 'verified' ? 'badge-emerald' : 'badge-amber'}`}>
                  {ocrResult.status === 'verified' ? 'Auto-Certified' : 'HITL Review Queued'}
                </span>
              )}
            </div>

            {ocrResult ? (
              <div className="ocr-details">
                <div className="meta-row">
                  <span className="meta-key">Document ID:</span>
                  <span className="meta-val"><code>{ocrResult.documentId}</code></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">File:</span>
                  <span className="meta-val">{ocrResult.fileName}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">OCR Confidence:</span>
                  <span className="meta-val" style={{ fontWeight: 700, color: ocrResult.confidence >= 0.85 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                    {(ocrResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Extracted Metadata:
                </h4>
                <pre className="code-block">
                  {JSON.stringify(ocrResult.extractedData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="empty-state">
                <p>No document processed yet. Select a sample file on the left and trigger OCR extraction.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Digital Trust Certificates ──────────────────────── */}
      {activeTab === 'certificates' && (
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>Public Digital Trust Certificate Verification</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>GET /api/certificates/:id/verify</code> — Cryptographic lookup anchored to XRPL
              </p>
            </div>

            <form onSubmit={handleVerifyCert} className="search-bar-row">
              <input
                type="text"
                className="form-input"
                placeholder="Enter Certificate ID, Certificate Number, or Company Name..."
                value={searchCertId}
                onChange={(e) => setSearchCertId(e.target.value)}
              />
              <button type="submit" disabled={certSearching} className="btn btn-primary">
                {certSearching ? 'Searching...' : 'Verify on XRPL'}
              </button>
            </form>
          </div>

          {/* Certificate Card */}
          {foundCert ? (
            <div className="cert-card">
              <div className="cert-header">
                <div>
                  <span className="badge badge-emerald">Verified On-Chain</span>
                  <h3 className="cert-title">{foundCert.certificateNumber}</h3>
                  <div className="cert-company">{foundCert.companyName}</div>
                </div>
                <div className="cert-qr-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foundCert.qrCodeUrl}
                    alt="QR Verification Code"
                    width="100"
                    height="100"
                    style={{ borderRadius: '6px', background: '#ffffff', padding: '4px' }}
                  />
                </div>
              </div>

              <div className="cert-body">
                <div className="meta-row">
                  <span className="meta-key">Status:</span>
                  <span className="meta-val"><span className="badge badge-emerald">Active</span></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Issued At:</span>
                  <span className="meta-val">{new Date(foundCert.issuedAt).toUTCString()}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Merkle Anchor ID:</span>
                  <span className="meta-val"><code>{foundCert.anchorId}</code></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">SHA-256 Data Hash:</span>
                  <span className="meta-val" style={{ wordBreak: 'break-all', fontSize: '0.78rem' }}>
                    <code>{foundCert.dataHash}</code>
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">XRPL Transaction Hash:</span>
                  <span className="meta-val" style={{ wordBreak: 'break-all', fontSize: '0.78rem' }}>
                    <a
                      href={foundCert.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      {foundCert.txHash} ↗
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card empty-state">
              <p>No certificate found matching &quot;{searchCertId}&quot;. Try searching &quot;PT-CERT-2026-0089&quot; or &quot;Ceylon&quot;.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
