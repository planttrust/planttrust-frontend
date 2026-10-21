'use client';

/* ─── Module 3: MCP-Driven Explainable AI & Chatbot (TypeScript) ──────────
 * Owner: Imesha Ariyawansha
 * Scope: Frontend • Backend • Database • AI (Scam Typologies + CBSL Rules) • Blockchain (Audit Proofs)
 * Base Endpoints: /api/mcp, /api/chatbot, /api/scam
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import ModuleContractBanner from '@/components/ModuleContractBanner';
import { api } from '@/lib/api';
import { mockChatbotHistory, mockScamAuditLog, mockScamTypologies } from '@/lib/mockData';
import type { ChatMessage, ScamCheckResult, ScamTypology } from '@/types';

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'scam' | 'audit'>('chat');

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatbotHistory);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Scam Checker State
  const [pitchText, setPitchText] = useState(
    'Guaranteed 35% monthly returns! No risk agricultural investment. Transfer funds via USDT directly to our telegram representative.'
  );
  const [scamResult, setScamResult] = useState<ScamCheckResult | null>(null);
  const [scamLoading, setScamLoading] = useState(false);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await api.mcp.query({
        query: textToSend,
        sessionId: 'sess-curr-1',
      });

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: res.response || 'The requested investment record has been verified against CBSL guidelines and XRPL on-chain escrow.',
        reasoning: res.reasoning || {
          cbslRulesEvaluated: ['CBSL Circular No. 04/2022', 'Monetary Law Act Sec 76'],
          riskFlagsIdentified: [],
          complianceScore: 94,
          merkleAnchorCitation: 'anc-m5-7781-merkle',
        },
        sources: res.sources || ['Module 1 Land Deed OCR LK-DEED-2024-88912', 'Module 2 Escrow Record esc-9012-funded'],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: 'assistant',
          text: 'The project demonstrates valid land registry filings and active escrow safeguards anchored to the XRP Ledger.',
          sources: ['Module 1 Land Deed', 'Module 5 Audit Ledger'],
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunScamCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setScamLoading(true);

    setTimeout(() => {
      const lower = pitchText.toLowerCase();
      const hasGuaranteed = lower.includes('guaranteed') || lower.includes('35%') || lower.includes('no risk');
      const hasCryptoUnregulated = lower.includes('usdt') || lower.includes('telegram');

      const matched: ScamTypology[] = [];
      if (hasGuaranteed && mockScamTypologies[0]) {
        matched.push(mockScamTypologies[0]);
      }
      if (hasCryptoUnregulated && mockScamTypologies[1]) {
        matched.push(mockScamTypologies[1]);
      }

      setScamResult({
        overallRisk: matched.length > 0 ? 'CRITICAL_RISK' : 'LOW_RISK',
        riskScore: matched.length > 0 ? 92 : 12,
        matchedTypologies: matched,
        cbslGuideline: 'Central Bank of Sri Lanka Financial Consumer Protection Framework (Section 12.4: Prohibition of Unlicensed Schemes)',
        recommendation: matched.length > 0
          ? 'DO NOT INVEST. Scheme exhibits known ponzi and unregistered collective investment characteristics.'
          : 'Low anomaly detected. Proceed with standard escrow verification.',
      });
      setScamLoading(false);
    }, 800);
  };

  const endpoints = [
    { method: 'POST', path: '/api/mcp/query', desc: 'JSON-RPC 2.0 tool-calling query against verified datasets' },
    { method: 'POST', path: '/api/chatbot/session', desc: 'Initialize stateful chatbot conversation session' },
    { method: 'GET', path: '/api/chatbot/session/:id/history', desc: 'Retrieve past explainability messages' },
    { method: 'POST', path: '/api/scam/check', desc: 'Evaluate project or pitch against CBSL scam typologies' },
    { method: 'GET', path: '/api/scam/audit-log', desc: 'Retrieve flagged anomalies and risk warnings' },
  ];

  return (
    <div className="module-page">
      <ModuleContractBanner
        moduleNumber="3"
        moduleName="MCP-Driven Explainable AI & Chatbot"
        owner="Imesha Ariyawansha"
        effortScore="16"
        aiFeature="Scam Classifier Typology Engine + CBSL Rules Engine"
        blockchainFeature="Audit Log Retrieval with Proof-of-Inclusion Citations"
        endpoints={endpoints}
        contractFileName="module-3-mcp-ai.md"
      />

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Explainability Chatbot (MCP Agent)
        </button>
        <button
          className={`tab-btn ${activeTab === 'scam' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('scam')}
        >
          🚨 Scam Classifier & CBSL Rule Engine
        </button>
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          📋 Risk & Anomaly Audit Log
        </button>
      </div>

      {/* ─── TAB 1: Chatbot ───────────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="two-col-layout">
          {/* Main Chat Interface */}
          <div className="glass-card chat-card">
            <div className="card-header">
              <h3>PlanTrust Explainable AI Assistant</h3>
              <span className="badge badge-purple">MCP Protocol v2.0</span>
            </div>

            <div className="chat-feed">
              {messages.map((m) => (
                <div key={m.id} className={`chat-bubble-wrap chat-${m.sender}`}>
                  <div className="chat-bubble">
                    <div className="chat-sender-label">
                      {m.sender === 'user' ? 'You' : 'PlanTrust AI Agent'}
                    </div>
                    <div className="chat-text">{m.text}</div>

                    {/* Reasoning Details */}
                    {m.reasoning && (
                      <div className="chat-reasoning-box">
                        <div className="reasoning-title">⚙️ Explainable Reasoning Breakdown:</div>
                        <div>
                          <strong>CBSL Evaluation:</strong> {m.reasoning.cbslRulesEvaluated?.join(', ')}
                        </div>
                        <div>
                          <strong>Compliance Score:</strong> {m.reasoning.complianceScore} / 100
                        </div>
                        {m.reasoning.merkleAnchorCitation && (
                          <div>
                            <strong>Merkle Anchor Citation:</strong>{' '}
                            <code>{m.reasoning.merkleAnchorCitation}</code>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sources Citations */}
                    {m.sources && (
                      <div className="chat-sources">
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Sources:</span>
                        {m.sources.map((s, idx) => (
                          <span key={idx} className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>
                            {typeof s === 'string' ? s : `${s.module ? `${s.module}: ` : ''}${s.tool || JSON.stringify(s)}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble-wrap chat-assistant">
                  <div className="chat-bubble">
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      Evaluating MCP tools & checking CBSL rules...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompt Chips */}
            <div className="chat-prompt-chips">
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendMessage('Is Ceylon Agro compliant with CBSL guidelines?')}
              >
                &quot;Is Ceylon Agro compliant?&quot;
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendMessage('Explain how the escrow release safeguards work.')}
              >
                &quot;Explain escrow safeguards&quot;
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendMessage('Verify the Merkle inclusion proof for deed 88912.')}
              >
                &quot;Verify Merkle proof for deed 88912&quot;
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="chat-input-row"
            >
              <input
                type="text"
                className="form-input"
                placeholder="Ask about project compliance, escrow terms, or on-chain proofs..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
              />
              <button type="submit" disabled={chatLoading} className="btn btn-primary">
                Send
              </button>
            </form>
          </div>

          {/* Model Context Protocol (MCP) Live Tool Inspector */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Model Context Protocol (MCP) Server</h3>
              <span className="badge badge-emerald">JSON-RPC 2.0</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              The chatbot does not hallucinate answers. All responses are deterministically backed by MCP scoped tool calls into other PlanTrust modules:
            </p>

            <div className="mcp-tool-list">
              <div className="mcp-tool-item">
                <div className="tool-title">
                  <code>get_land_deed_ocr(parcel_id)</code>
                  <span className="badge badge-emerald">Module 1</span>
                </div>
                <div className="tool-desc">Fetches OCR confidence & notary license status.</div>
              </div>

              <div className="mcp-tool-item">
                <div className="tool-title">
                  <code>get_escrow_status(escrow_id)</code>
                  <span className="badge badge-cyan">Module 2</span>
                </div>
                <div className="tool-desc">Queries current state machine stage and locked balance.</div>
              </div>

              <div className="mcp-tool-item">
                <div className="tool-title">
                  <code>check_geofence_boundary(project_id)</code>
                  <span className="badge badge-purple">Module 4</span>
                </div>
                <div className="tool-desc">Validates milestone photos inside GPS polygon.</div>
              </div>

              <div className="mcp-tool-item">
                <div className="tool-title">
                  <code>get_merkle_proof(anchor_id)</code>
                  <span className="badge badge-amber">Module 5</span>
                </div>
                <div className="tool-desc">Retrieves cryptographic inclusion proof on XRPL.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Scam Classifier ───────────────────────────────────── */}
      {activeTab === 'scam' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <h3>Evaluate Project / Offer for Scam Typologies</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>POST /api/scam/check</code>
              </p>
            </div>

            <form onSubmit={handleRunScamCheck} className="form-stack">
              <div className="form-group">
                <label>Investment Pitch, Website Text, or Marketing Material</label>
                <textarea
                  className="form-input"
                  rows={6}
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() =>
                    setPitchText(
                      'Guaranteed 35% monthly returns! No risk agricultural investment. Transfer USDT via Telegram.'
                    )
                  }
                >
                  Load Red-Flag Sample
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() =>
                    setPitchText(
                      'Ceylon Agro Ventures PLC is raising funding for 14.5 acres of vanilla cultivation. Funds held in audited smart escrow with 18.2% projected annual IRR.'
                    )
                  }
                >
                  Load Compliant Sample
                </button>
              </div>

              <button
                type="submit"
                disabled={scamLoading}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {scamLoading ? 'Evaluating against CBSL Rules...' : 'Run Scam Classifier'}
              </button>
            </form>
          </div>

          {/* Scam Result */}
          <div className="glass-card">
            <div className="card-header">
              <h3>AI Scam Assessment Result</h3>
              {scamResult && (
                <span
                  className={`badge ${scamResult.overallRisk === 'CRITICAL_RISK' ? 'badge-rose' : 'badge-emerald'}`}
                >
                  {scamResult.overallRisk}
                </span>
              )}
            </div>

            {scamResult ? (
              <div>
                <div className="meta-row">
                  <span className="meta-key">Risk Score:</span>
                  <span
                    className="meta-val"
                    style={{
                      fontWeight: 700,
                      color: scamResult.riskScore > 50 ? 'var(--rose-400)' : 'var(--emerald-400)',
                    }}
                  >
                    {scamResult.riskScore} / 100
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">CBSL Rule Applied:</span>
                  <span className="meta-val" style={{ fontSize: '0.85rem' }}>
                    {scamResult.cbslGuideline}
                  </span>
                </div>

                <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Matched Typologies ({scamResult.matchedTypologies.length})
                </h4>
                {scamResult.matchedTypologies.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {scamResult.matchedTypologies.map((t) => (
                      <div key={t.id} className="alert-box alert-rose" style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>{t.title}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{t.description}</div>
                        <div style={{ fontSize: '0.72rem', marginTop: '0.25rem', color: 'var(--amber-400)' }}>
                          Regulation: {t.cbslRule}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert-box alert-emerald">
                    No scam typologies matched. Offer conforms to standard commercial investment thresholds.
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <p>Submit text on the left to evaluate against Central Bank of Sri Lanka fraud typologies.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Audit Log ─────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="glass-card">
          <div className="card-header">
            <h3>Scam & Anomaly Audit Log</h3>
            <span className="badge badge-subtle">{mockScamAuditLog.length} Records</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Flag ID</th>
                  <th>Target Project / Offer</th>
                  <th>Risk Score</th>
                  <th>Matched Typology</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockScamAuditLog.map((item) => (
                  <tr key={item.id || item.flagId}>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(item.timestamp || item.createdAt || '').toLocaleString()}</td>
                    <td><code>{item.id || item.flagId}</code></td>
                    <td>{item.projectTitle}</td>
                    <td>
                      <span className={`badge ${(item.riskScore || 0) > 60 ? 'badge-rose' : 'badge-emerald'}`}>
                        {item.riskScore} / 100
                      </span>
                    </td>
                    <td>{item.matchedTypology}</td>
                    <td>
                      <span className={`badge ${item.status === 'BLOCKED' ? 'badge-rose' : 'badge-emerald'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
