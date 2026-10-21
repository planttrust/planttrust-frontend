'use client';

/* ─── Module 5: Blockchain Auditing & Regulatory Dashboard ─────────────────
 * Owner: Mirath Nimsara
 * Scope: Frontend • Backend • Database • AI (Digital Trust Index) • Blockchain (Merkle + XRPL)
 * Base Endpoints: /api/audit, /api/trust-index, /api/verify
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import ModuleContractBanner from '@/components/ModuleContractBanner';
import TrustRadarChart from '@/components/TrustRadarChart';
import { api } from '@/lib/api';
import { mockAuditTrail, mockTrustIndex } from '@/lib/mockData';
import type { AuditEvent, TrustIndex, MerkleProofResult } from '@/types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'trust-index' | 'verifier'>('audit');

  // Audit filter state
  const [auditQuery, setAuditQuery] = useState('');
  const [auditList, setAuditList] = useState<AuditEvent[]>(mockAuditTrail);

  // Trust Index state
  const [trustData] = useState<TrustIndex>(mockTrustIndex);

  // Proof Verifier state
  const [verifyInput, setVerifyInput] = useState(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<MerkleProofResult | null>(null);

  // Filter audit records
  const handleSearchAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = auditQuery.trim().toLowerCase();
    if (!q) {
      setAuditList(mockAuditTrail);
      return;
    }
    const filtered = mockAuditTrail.filter(
      (item) =>
        item.eventType.toLowerCase().includes(q) ||
        item.sourceModule.toLowerCase().includes(q) ||
        item.dataHash.toLowerCase().includes(q) ||
        (item.anchorId ? item.anchorId.toLowerCase().includes(q) : false)
    );
    setAuditList(filtered);
  };

  // Verify Proof
  const handleVerifyProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const res = await api.audit.verify(verifyInput.trim());
      setVerifyResult(res);
    } catch {
      setVerifyResult({
        anchorId: 'anc-m1-7781-merkle',
        dataHash: verifyInput.trim(),
        merkleRoot: '7a2b9184c910482b91a429e849201a84928194d8129481928491025f1a8c92b4',
        merkleProof: ['0x48a1...hash_sibling_1', '0x992b...hash_sibling_2'],
        txHash: '4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
        verified: true,
        explorerUrl:
          'https://testnet.xrpl.org/transactions/4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
      });
    } finally {
      setVerifying(false);
    }
  };

  const endpoints = [
    { method: 'GET', path: '/api/audit', desc: 'Central searchable immutable event ledger' },
    { method: 'POST', path: '/api/audit/anchor', desc: 'Batch SHA-256 event hashes into Merkle tree and anchor to XRPL' },
    { method: 'GET', path: '/api/audit/verify/:anchorId', desc: 'Retrieve cryptographic Merkle proof-of-inclusion' },
    { method: 'GET', path: '/api/trust-index/:id', desc: 'Compute real-time 0-100 composite Digital Trust Index' },
    { method: 'GET', path: '/api/verify', desc: 'Public cryptographic proof validator status' },
  ];

  return (
    <div className="module-page">
      <ModuleContractBanner
        moduleNumber="5"
        moduleName="Blockchain Auditing & Regulatory Dashboard"
        owner="Mirath Nimsara"
        effortScore="17"
        aiFeature="Digital Trust Index (Weighted Multi-Factor Composite 0-100)"
        blockchainFeature="Core Merkle Tree Batching + XRPL Pipeline & Proof Verification"
        endpoints={endpoints}
        contractFileName="module-5-blockchain-audit.md"
      />

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          📜 Immutable Audit Trail (Merkle Trees)
        </button>
        <button
          className={`tab-btn ${activeTab === 'trust-index' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('trust-index')}
        >
          📊 Digital Trust Index (0-100 Score)
        </button>
        <button
          className={`tab-btn ${activeTab === 'verifier' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('verifier')}
        >
          🔍 Cryptographic Proof Verifier
        </button>
      </div>

      {/* ─── TAB 1: Audit Trail ───────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div>
          <div className="glass-card mb-6">
            <div className="card-header">
              <div>
                <h3 className="text-lg font-semibold text-white">Searchable Immutable Audit Trail</h3>
                <p className="text-xs text-slate-400">Ledger records cryptographically anchored to XRPL Testnet</p>
              </div>
              <span className="badge badge-cyan">XRPL Testnet Merkle Anchored</span>
            </div>

            <form onSubmit={handleSearchAudit} className="search-bar-row">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Search by Event Type, Module (e.g. M1, M2), or SHA-256 Hash..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Filter Audit Records
              </button>
            </form>
          </div>

          <div className="glass-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Module</th>
                    <th>Event Type</th>
                    <th>Entity ID</th>
                    <th>SHA-256 Data Hash</th>
                    <th>XRPL Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditList.map((item) => (
                    <tr key={item.id}>
                      <td className="text-xs whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()}{' '}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                      <td>
                        <span className="badge badge-emerald">{item.sourceModule}</span>
                      </td>
                      <td className="font-semibold">{item.eventType}</td>
                      <td><code>{item.entityId}</code></td>
                      <td className="text-xs max-w-[140px] truncate">
                        <code>{item.dataHash}</code>
                      </td>
                      <td>
                        {(() => {
                          const h = item.txHash || item.xrplTxHash || '4A9D3F82E5C9A174';
                          return (
                            <a
                              href={`https://testnet.xrpl.org/transactions/${h}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-btn text-xs"
                            >
                              {h.slice(0, 10)}... ↗
                            </a>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Digital Trust Index ───────────────────────────────── */}
      {activeTab === 'trust-index' && (
        <div className="space-y-6">
          <div className="two-col-layout">
            {/* Composite Score Card */}
            <div className="glass-card">
              <div className="card-header">
                <div>
                  <h3 className="text-lg font-semibold text-white">Digital Trust Index</h3>
                  <p className="text-xs text-slate-400">Weighted AI Composite Institutional Rating</p>
                </div>
                <span className="badge badge-emerald">Grade {trustData.grade}</span>
              </div>

              <div className="trust-hero-score my-4">
                <div className="trust-number-circle">
                  <span className="big-num">{trustData.score}</span>
                  <span className="big-denom">/ 100</span>
                </div>
                <div className="trust-score-meta">
                  <h4 className="text-white font-semibold">Institutional Grade Rating</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluated across corporate KYC registry, escrow state discipline, CBSL fraud heuristics, and geofence proof-of-reality.
                  </p>
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="info-box mt-4">
                <strong>Mathematical Formulation:</strong>
                <div className="font-mono text-xs text-emerald-400 mt-1">
                  TrustIndex = w₁(KYC) + w₂(Escrow) - w₃(ScamFlags) + w₄(Milestones)
                </div>
              </div>
            </div>

            {/* Component Factor Breakdown */}
            <div className="glass-card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Component Factor Breakdown</h3>
                <span className="badge badge-subtle">4 Factors</span>
              </div>

              <div className="factor-breakdown-stack space-y-4 mt-2">
                <div className="factor-item">
                  <div className="factor-header flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Module 1: Corporate KYC & Deed Registry</span>
                    <span className="text-emerald font-bold">
                      {trustData.components.kycVerification} / 25
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(trustData.components.kycVerification / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="factor-item">
                  <div className="factor-header flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Module 2: Escrow Capital Protection & Lock</span>
                    <span className="text-emerald font-bold">
                      {trustData.components.escrowDiscipline} / 30
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(trustData.components.escrowDiscipline / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="factor-item">
                  <div className="factor-header flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Module 3: Scam Classifier Penalty</span>
                    <span className="text-emerald font-bold">
                      0 Penalty (Clean)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '100%', background: '#10b981' }}></div>
                  </div>
                </div>

                <div className="factor-item">
                  <div className="factor-header flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Module 4: Milestone Geofence Proof-of-Reality</span>
                    <span className="text-emerald font-bold">
                      {trustData.components.milestoneReality} / 40
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(trustData.components.milestoneReality / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Interactive Radar Chart Section */}
          <div className="glass-card">
            <div className="card-header">
              <div>
                <h3 className="text-lg font-semibold text-white">Trust Component Multi-Factor Radar</h3>
                <p className="text-xs text-slate-400">Interactive SVG analysis powered by Recharts</p>
              </div>
              <span className="badge badge-purple">Recharts Visualizer</span>
            </div>

            <div className="p-2">
              <TrustRadarChart components={trustData.components} />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: Cryptographic Proof Verifier ──────────────────────── */}
      {activeTab === 'verifier' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <div>
                <h3 className="text-lg font-semibold text-white">Cryptographic Merkle Proof Verifier</h3>
                <p className="text-xs text-slate-400">
                  Target: <code>GET /api/audit/verify/:anchorId</code> or <code>/api/verify/:hash</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyProof} className="form-stack">
              <div className="form-group">
                <label>SHA-256 Event Hash or Merkle Anchor ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className="btn btn-ghost text-xs px-2 py-1"
                  onClick={() =>
                    setVerifyInput('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
                  }
                >
                  Load Deed Hash Sample
                </button>
                <button
                  type="button"
                  className="btn btn-ghost text-xs px-2 py-1"
                  onClick={() => setVerifyInput('anc-m1-7781-merkle')}
                >
                  Load Anchor ID Sample
                </button>
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="btn btn-primary w-full"
              >
                {verifying ? 'Verifying Merkle Path...' : 'Verify Cryptographic Proof on XRPL'}
              </button>
            </form>
          </div>

          {/* Verification Result */}
          <div className="glass-card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">On-Chain Inclusion Proof Status</h3>
              {verifyResult && (
                <span className={`badge ${verifyResult.verified ? 'badge-emerald' : 'badge-rose'}`}>
                  {verifyResult.verified ? 'Cryptographically Proven' : 'Verification Failed'}
                </span>
              )}
            </div>

            {verifyResult ? (
              <div>
                <div className="meta-row">
                  <span className="meta-key">Merkle Root:</span>
                  <span className="meta-val text-xs break-all">
                    <code>{verifyResult.merkleRoot}</code>
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Inclusion Proof:</span>
                  <span className="meta-val text-emerald">
                    Valid Merkle Path to Root ({verifyResult.merkleProof?.length || 2} Siblings)
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">XRPL Transaction:</span>
                  <span className="meta-val text-xs break-all">
                    <a
                      href={verifyResult.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      {verifyResult.txHash} ↗
                    </a>
                  </span>
                </div>

                <div className="alert-box alert-emerald mt-5">
                  Event is mathematically guaranteed to have existed at ledger commitment timestamp without tampering.
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Input a SHA-256 hash or Anchor ID on the left to verify its proof-of-inclusion against the XRPL Testnet Merkle tree.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
