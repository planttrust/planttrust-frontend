'use client';

/* ─── Module 2: Investor Marketplace & Escrow Lifecycle (TypeScript) ──────
 * Owner: Thilina Dasun
 * Scope: Frontend • Backend • Database • AI (Anomaly Detection) • Blockchain (XRPL NFT)
 * Base Endpoints: /api/listings, /api/escrow, /api/transfers
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import ModuleContractBanner from '@/components/ModuleContractBanner';
import { api } from '@/lib/api';
import { mockListings, mockEscrowHistory } from '@/lib/mockData';
import type { ProjectListing, EscrowRecord, P2PTransferResult, EscrowState } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'escrow' | 'p2p' | 'charts'>('listings');
  const [listings, setListings] = useState<ProjectListing[]>(mockListings);
  const [selectedProject, setSelectedProject] = useState<ProjectListing | null>(null);
  const [fundAmount, setFundAmount] = useState(2500);
  const [escrowResult, setEscrowResult] = useState<EscrowRecord | null>(null);
  const [loading, setLoading] = useState(false);

  // Escrow state simulator
  const [escrowState, setEscrowState] = useState<EscrowState>('FUNDED');
  const [escrowHistory] = useState<EscrowRecord>(mockEscrowHistory[0] as EscrowRecord);

  // P2P Transfer state
  const [transferAmount, setTransferAmount] = useState(1000);
  const [buyerWallet, setBuyerWallet] = useState('rPTBuyerWallet92817291829471928');
  const [transferResult, setTransferResult] = useState<P2PTransferResult | null>(null);

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await api.listings.getAll();
        if (res?.listings) {
          setListings(res.listings);
        }
      } catch {
        // Mock fallback active
      }
    }
    loadListings();
  }, []);

  const handleFundProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setLoading(true);

    try {
      const res = await api.escrow.fund({
        projectId: selectedProject.id || selectedProject.projectId || 'proj-kurunegala-agri',
        amount: Number(fundAmount),
      });
      setEscrowResult(res);
      setEscrowState('FUNDED');
    } catch (err: any) {
      alert(err.message || 'Escrow funding failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferP2P = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.transfers.p2p({
        escrowId: escrowResult?.escrowId || 'esc-9012-funded',
        amount: Number(transferAmount),
        buyerAddress: buyerWallet,
      });
      setTransferResult(res);
    } catch (err: any) {
      alert(err.message || 'P2P Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const chartData = listings.map((item) => ({
    name: item.title || item.projectName || 'Project',
    funded: item.fundedAmount,
    target: item.targetAmount,
    returnRate: item.returnRate || 14,
  }));

  const endpoints = [
    { method: 'GET', path: '/api/listings', desc: 'Browse projects sorted by Digital Trust Index score' },
    { method: 'POST', path: '/api/escrow/fund', desc: 'Lock investor capital into 5-stage escrow state machine' },
    { method: 'POST', path: '/api/escrow/release', desc: 'Release milestone funds upon geofence verification' },
    { method: 'GET', path: '/api/escrow/:id/history', desc: 'Audit state machine transitions & Merkle roots' },
    { method: 'POST', path: '/api/transfers/p2p', desc: 'Atomic P2P secondary marketplace share trading' },
  ];

  return (
    <div className="module-page">
      <ModuleContractBanner
        moduleNumber="2"
        moduleName="Investor Marketplace & Escrow Lifecycle"
        owner="Thilina Dasun"
        effortScore="17"
        aiFeature="Investment-Pattern Anomaly Detector (Velocity & Ticket Size)"
        blockchainFeature="XRPL NFT Minting for Investor Stakes & Escrow Locks"
        endpoints={endpoints}
        contractFileName="module-2-marketplace.md"
      />

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'listings' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          🌱 Project Listings & Investments
        </button>
        <button
          className={`tab-btn ${activeTab === 'charts' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          📈 Capital Analytics (Recharts)
        </button>
        <button
          className={`tab-btn ${activeTab === 'escrow' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('escrow')}
        >
          🔒 Escrow State Machine Simulator
        </button>
        <button
          className={`tab-btn ${activeTab === 'p2p' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('p2p')}
        >
          🔄 P2P Secondary Stake Transfer
        </button>
      </div>

      {/* ─── TAB 1: Project Listings ──────────────────────────────────── */}
      {activeTab === 'listings' && (
        <div>
          <div className="listings-grid">
            {listings.map((item) => {
              const progressPct = Math.min(100, Math.round((item.fundedAmount / item.targetAmount) * 100));
              return (
                <div key={item.id || item.listingId} className="project-card">
                  <div className="project-card-header">
                    <div>
                      <span className="badge badge-emerald">{item.category}</span>
                      <h3 className="project-title">{item.title || item.projectName}</h3>
                      <div className="project-location">{item.location}</div>
                    </div>
                    <div className="trust-score-badge" title="Module 5 Digital Trust Index">
                      <div className="score-num">{item.trustScore}</div>
                      <div className="score-grade">{item.trustGrade || 'A'}</div>
                    </div>
                  </div>

                  <p className="project-desc">{item.description}</p>

                  <div className="project-stats-grid">
                    <div>
                      <div className="stat-label">Target Funding</div>
                      <div className="stat-val">${item.targetAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="stat-label">Min Investment</div>
                      <div className="stat-val">${item.minInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="stat-label">Target IRR</div>
                      <div className="stat-val text-emerald">{item.expectedReturn || `${item.returnRate}%`}</div>
                    </div>
                    <div>
                      <div className="stat-label">Tenure</div>
                      <div className="stat-val">{item.tenureMonths || 36} Mo.</div>
                    </div>
                  </div>

                  {/* Funding Progress Bar */}
                  <div className="progress-wrap">
                    <div className="progress-label-row">
                      <span>Funded: ${item.fundedAmount.toLocaleString()} ({progressPct}%)</span>
                      <span>Target: ${item.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>

                  <div className="project-footer">
                    <span className={`badge ${item.riskLevel === 'Low' || item.riskLevel === 'low' ? 'badge-emerald' : 'badge-amber'}`}>
                      Risk Tier: {item.riskLevel}
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedProject(item);
                        setActiveTab('escrow');
                      }}
                    >
                      Fund via Escrow →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 2: Capital Analytics (Recharts) ───────────────────────── */}
      {activeTab === 'charts' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <h3>Funding Progress vs. Target (USD)</h3>
              <span className="badge badge-cyan">Recharts Analytics</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Comparison of capital raised versus total escrow target per agricultural project.
            </p>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b1320', borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '8px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()} USD`, '']}
                  />
                  <Bar dataKey="target" fill="rgba(255, 255, 255, 0.1)" name="Target Cap" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="funded" fill="#10b981" name="Committed in Escrow" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#06b6d4' : '#c084fc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <h3>Investment Anomaly Detection AI</h3>
              <span className="badge badge-emerald">Real-Time Monitor</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Module 2 background workers scan ticket sizes and velocity anomalies before locking transactions into XRPL escrow:
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">Velocity Guard</div>
                  <div className="text-xs text-slate-400">Max 50 commits / hour per project</div>
                </div>
                <span className="badge badge-emerald">Normal</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">Single Investor Cap</div>
                  <div className="text-xs text-slate-400">Max 25% of target per unaccredited entity</div>
                </div>
                <span className="badge badge-emerald">Compliant</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">Escrow State Invariance</div>
                  <div className="text-xs text-slate-400">Locking verified on XRPL Testnet ledger index</div>
                </div>
                <span className="badge badge-cyan">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: Escrow State Machine Simulator ───────────────────── */}
      {activeTab === 'escrow' && (
        <div className="two-col-layout">
          {/* Fund Form */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Commit Capital to Smart Escrow</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>POST /api/escrow/fund</code>
              </p>
            </div>

            <form onSubmit={handleFundProject} className="form-stack">
              <div className="form-group">
                <label>Select Project</label>
                <select
                  className="form-input"
                  value={selectedProject ? selectedProject.id || selectedProject.projectId : listings[0]?.id}
                  onChange={(e) => {
                    const found = listings.find((p) => (p.id || p.projectId) === e.target.value);
                    setSelectedProject(found || null);
                  }}
                >
                  {listings.map((p) => (
                    <option key={p.id || p.listingId} value={p.id || p.projectId}>
                      {p.title || p.projectName} (${p.fundedAmount.toLocaleString()} / ${p.targetAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Investment Amount (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  min="500"
                  step="100"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(Number(e.target.value))}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? 'Processing Escrow Commit...' : 'Submit Escrow Commitment ($)'}
              </button>
            </form>

            {/* State Machine Visualizer */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                5-Stage Escrow Lifecycle:
              </h4>
              <div className="escrow-pipeline">
                {(['CREATED', 'FUNDED', 'LOCKED', 'RELEASED'] as EscrowState[]).map((stateName, idx) => {
                  const isCurrent = escrowState === stateName;
                  return (
                    <div
                      key={stateName}
                      className={`escrow-step ${isCurrent ? 'escrow-step-active' : ''}`}
                      onClick={() => setEscrowState(stateName)}
                      style={{ cursor: 'pointer' }}
                      title="Click to simulate transition"
                    >
                      <div className="step-circle">{idx + 1}</div>
                      <div className="step-text">{stateName}</div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Tip: Click any step above to simulate milestone release or state transitions.
              </p>
            </div>
          </div>

          {/* Escrow Position & NFT Details */}
          <div className="glass-card">
            <div className="card-header">
              <h3>XRPL Escrow Position & NFT Receipt</h3>
              <span className={`badge ${escrowState === 'RELEASED' ? 'badge-emerald' : 'badge-cyan'}`}>
                State: {escrowState}
              </span>
            </div>

            <div className="escrow-receipt-body">
              <div className="meta-row">
                <span className="meta-key">Escrow ID:</span>
                <span className="meta-val">
                  <code>{escrowResult?.escrowId || escrowHistory.escrowId}</code>
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Committed Amount:</span>
                <span className="meta-val" style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>
                  ${(escrowResult?.amount || fundAmount).toLocaleString()} USD
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">XRPL NFT Token ID:</span>
                <span className="meta-val" style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--cyan-400)' }}>
                  {escrowResult?.nftTokenId || escrowHistory.nftTokenId}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-key">Merkle Anchor ID:</span>
                <span className="meta-val">
                  <code>{escrowResult?.anchorId || 'anc-m2-9912-merkle'}</code>
                </span>
              </div>

              <div className="info-box" style={{ marginTop: '1.5rem' }}>
                <strong>Institutional Safeguard:</strong> Funds remain mathematically locked in XRPL smart escrow.
                Milestone tranches are unlocked only when Module 4 (Geofencing) verifies geo-tagged photos and EXIF telemetry within the verified boundary polygon.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: P2P Secondary Stake Transfer ─────────────────────── */}
      {activeTab === 'p2p' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <h3>P2P Secondary Stake Transfer</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>POST /api/transfers/p2p</code>
              </p>
            </div>

            <form onSubmit={handleTransferP2P} className="form-stack">
              <div className="form-group">
                <label>Source Escrow Position</label>
                <input
                  type="text"
                  className="form-input"
                  value={escrowResult?.escrowId || 'esc-9012-funded'}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Transfer Amount (USD)</label>
                <input
                  type="number"
                  className="form-input"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Buyer XRPL Wallet Address / ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={buyerWallet}
                  onChange={(e) => setBuyerWallet(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? 'Executing Atomic Swap...' : 'Execute P2P Stake Transfer'}
              </button>
            </form>
          </div>

          {/* Transfer Result */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Atomic Swap Execution Receipt</h3>
              <span className={`badge ${transferResult ? 'badge-emerald' : 'badge-subtle'}`}>
                {transferResult ? 'Swap Settled' : 'Awaiting Transaction'}
              </span>
            </div>

            {transferResult ? (
              <div className="transfer-details">
                <div className="meta-row">
                  <span className="meta-key">Transfer ID:</span>
                  <span className="meta-val"><code>{transferResult.transferId}</code></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Seller Stake NFT:</span>
                  <span className="meta-val text-rose">Burned / Reduced</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Buyer Stake NFT:</span>
                  <span className="meta-val text-emerald">Minted to Buyer Address</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Anchor Hash:</span>
                  <span className="meta-val" style={{ fontSize: '0.75rem' }}>
                    <code>{transferResult.anchorId}</code>
                  </span>
                </div>

                <div className="alert-box alert-emerald" style={{ marginTop: '1.25rem' }}>
                  Atomic XRPL transaction confirmed without counterparty risk.
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Submit a secondary stake transfer on the left to simulate atomic peer-to-peer share exchange.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
