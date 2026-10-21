'use client';

/* ─── ModuleContractBanner (TypeScript + Tailwind) ────────────────────────
 * Developer HUD shown at the top of each module page.
 * Provides instant visibility into:
 * - Module owner & full-stack responsibilities
 * - Unified backend API endpoints (port 3000)
 * - Contract reference and live endpoint status tester
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { api } from '@/lib/api';

export interface EndpointSpec {
  method: string;
  path: string;
  desc: string;
}

interface ModuleContractBannerProps {
  moduleNumber: string | number;
  moduleName: string;
  owner: string;
  effortScore: string | number;
  aiFeature: string;
  blockchainFeature: string;
  endpoints?: EndpointSpec[];
  contractFileName: string;
}

interface TestResult {
  ok: boolean;
  status: string | number;
  latency: string;
  message: string;
}

export default function ModuleContractBanner({
  moduleNumber,
  moduleName,
  owner,
  effortScore,
  aiFeature,
  blockchainFeature,
  endpoints = [],
  contractFileName,
}: ModuleContractBannerProps) {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testing, setTesting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    const results: Record<string, TestResult> = {};
    for (const ep of endpoints) {
      const start = performance.now();
      try {
        const res = await api.get(ep.path);
        const duration = Math.round(performance.now() - start);
        results[ep.path] = {
          ok: true,
          status: 200,
          latency: `${duration}ms`,
          message: res?.message || 'OK',
        };
      } catch (err: any) {
        const duration = Math.round(performance.now() - start);
        results[ep.path] = {
          ok: false,
          status: err.status || 'ERR',
          latency: `${duration}ms`,
          message: err.message || 'Connection failed',
        };
      }
    }
    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="module-banner">
      <div className="module-banner-header">
        <div className="module-banner-title-group">
          <span className="badge badge-emerald">Module {moduleNumber}</span>
          <h2 className="module-banner-title">{moduleName}</h2>
          <span className="badge badge-purple">Owner: {owner}</span>
          <span className="badge badge-subtle">Effort: {effortScore}/20</span>
        </div>
        <div className="module-banner-actions">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            {expanded ? 'Hide Contract Specs' : 'View API Contracts & Live Test'}
          </button>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="module-summary-chips">
        <div className="chip">
          <span className="chip-label">AI Layer:</span>
          <span className="chip-val">{aiFeature}</span>
        </div>
        <div className="chip">
          <span className="chip-label">Blockchain Layer:</span>
          <span className="chip-val">{blockchainFeature}</span>
        </div>
        <div className="chip">
          <span className="chip-label">Backend Host:</span>
          <span className="chip-val">Unified Port :3000</span>
        </div>
      </div>

      {/* Expanded Contract Details & Endpoint Tester */}
      {expanded && (
        <div className="module-contract-panel">
          <div className="panel-section">
            <div className="panel-title-row">
              <h4>Module Endpoints ({endpoints.length})</h4>
              <button
                onClick={testEndpoints}
                disabled={testing}
                className="btn btn-primary"
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
              >
                {testing ? 'Pinging...' : '⚡ Ping Live Endpoints'}
              </button>
            </div>
            <div className="endpoints-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Route</th>
                    <th>Description</th>
                    <th>Status / Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep) => {
                    const test = testResults[ep.path];
                    return (
                      <tr key={ep.path}>
                        <td>
                          <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                            {ep.method}
                          </span>
                        </td>
                        <td>
                          <code>{ep.path}</code>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {ep.desc}
                        </td>
                        <td>
                          {test ? (
                            <span className={`badge ${test.ok ? 'badge-emerald' : 'badge-rose'}`}>
                              {test.ok ? `200 OK (${test.latency})` : `${test.status} (${test.latency})`}
                            </span>
                          ) : (
                            <span className="badge badge-subtle">Ready to test</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-footer-row">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              📄 Full Contract File: <code>contracts/{contractFileName}</code> (synced from backend)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--emerald-400)' }}>
              Mock Fallback Active when backend route is scaffolded or offline
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
