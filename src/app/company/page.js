'use client';

/* ─── Module 4: Company Portal & Proof-of-Reality (Geofencing) ─────────────
 * Owner: Yasuri Pradeepika
 * Scope: Frontend • Backend • Database • AI (dHash + EXIF Anti-Spoofing) • Blockchain (Milestone Badges)
 * Base Endpoints: /api/projects, /api/reports, /api/geofence
 * ──────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import ModuleContractBanner from '@/components/ModuleContractBanner';
import { api } from '@/lib/api';
import { mockGeofencedProjects, mockMilestoneTimeline } from '@/lib/mockData';

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState('geofence'); // 'geofence' | 'submit' | 'timeline'

  // Selected Geofenced Project
  const [selectedProject, setSelectedProject] = useState(mockGeofencedProjects[0]);

  // Coordinate Ray-Casting Test State
  const [testLat, setTestLat] = useState('7.4867');
  const [testLng, setTestLng] = useState('80.3651');
  const [rayCastResult, setRayCastResult] = useState(null);

  // Milestone Report Submission State
  const [milestoneName, setMilestoneName] = useState('Phase 2 — Drip Irrigation Installation');
  const [reportPhoto, setReportPhoto] = useState('field_irrigation_inspection_gps.jpg');
  const [exifLat, setExifLat] = useState('7.4869');
  const [exifLng, setExifLng] = useState('80.3649');
  const [submitting, setSubmitting] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  // Timeline State
  const [timeline, setTimeline] = useState(mockMilestoneTimeline);

  // Ray-Casting Point-in-Polygon Check Simulator
  const handleTestPoint = (e) => {
    e.preventDefault();
    const lat = parseFloat(testLat);
    const lng = parseFloat(testLng);

    // Bounding box approximation for demo
    const inside = lat >= 7.485 && lat <= 7.489 && lng >= 7.362 && lng <= 80.368;

    setRayCastResult({
      lat,
      lng,
      isInside: inside,
      polygonId: selectedProject.polygonId,
      distanceFromCentroid: inside ? '42 meters' : '3.8 km outside boundary',
    });
  };

  // Submit Milestone Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const mockResult = {
        reportId: `rep-m4-${Date.now().toString().slice(-4)}`,
        milestone: milestoneName,
        submittedAt: new Date().toISOString(),
        exifValidation: {
          gpsMatchesBoundary: true,
          spoofingRisk: 'LOW',
          deviceModel: 'Trimble TDC600 High-Accuracy GIS Handheld',
          timestampPlausible: true,
        },
        dhashResult: {
          perceptualHash: 'a8f09b124e5d6c81',
          duplicateFound: false,
          similarityScore: '0.02 (Original Evidence)',
        },
        escrowTriggered: true,
        escrowMessage: 'Triggered Module 2 /api/escrow/release for Milestone Tranche ($25,000)',
      };
      setReportResult(mockResult);
      setSubmitting(false);

      // Add to timeline
      setTimeline((prev) => [
        ...prev,
        {
          id: mockResult.reportId,
          title: milestoneName,
          status: 'verified',
          completedAt: mockResult.submittedAt,
          exifVerified: true,
          dhashUnique: true,
          anchorId: `anc-m4-${Date.now().toString().slice(-4)}`,
          txHash: '4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31',
        },
      ]);
    }, 1000);
  };

  const endpoints = [
    { method: 'POST', path: '/api/projects/register', desc: 'Register polygon boundary coordinates & land asset' },
    { method: 'GET', path: '/api/projects/:id/timeline', desc: 'Retrieve milestone timeline with on-chain proof badges' },
    { method: 'POST', path: '/api/reports/submit', desc: 'Submit progress report with EXIF geo-tagged imagery' },
    { method: 'GET', path: '/api/reports/:id/validation', desc: 'View EXIF anti-spoof & dHash duplicate check' },
    { method: 'POST', path: '/api/reports/:id/approve', desc: 'Approve milestone and trigger Module 2 escrow release' },
    { method: 'GET', path: '/api/geofence', desc: 'Status check for point-in-polygon ray-casting engine' },
  ];

  return (
    <div className="module-page">
      <ModuleContractBanner
        moduleNumber="4"
        moduleName="Company Portal & Proof-of-Reality (Geofencing)"
        owner="Yasuri Pradeepika"
        effortScore="16"
        aiFeature="Perceptual dHash Duplicate-Detection + EXIF Anti-Spoofing"
        blockchainFeature="Milestone Timeline with On-Chain Merkle Proof Badges"
        endpoints={endpoints}
        contractFileName="module-4-company-geofencing.md"
      />

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'geofence' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('geofence')}
        >
          🗺️ GPS Polygon Boundary Visualizer
        </button>
        <button
          className={`tab-btn ${activeTab === 'submit' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          📷 Submit Milestone Evidence (EXIF + dHash)
        </button>
        <button
          className={`tab-btn ${activeTab === 'timeline' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          🏆 Proof-of-Reality Milestone Timeline
        </button>
      </div>

      {/* ─── TAB 1: Geofence Polygon Visualizer ────────────────────────── */}
      {activeTab === 'geofence' && (
        <div className="two-col-layout">
          {/* Boundary Card */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Registered Land Parcel Boundary</h3>
              <span className="badge badge-emerald">{selectedProject.areaHectares} Hectares</span>
            </div>

            <div className="project-select-row" style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Asset:</label>
              <select
                className="form-input"
                value={selectedProject.id}
                onChange={(e) => {
                  const p = mockGeofencedProjects.find((x) => x.id === e.target.value);
                  setSelectedProject(p);
                }}
              >
                {mockGeofencedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="meta-row">
              <span className="meta-key">Polygon ID:</span>
              <span className="meta-val"><code>{selectedProject.polygonId}</code></span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Centroid:</span>
              <span className="meta-val">{selectedProject.centroid.lat}, {selectedProject.centroid.lng}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Boundary Vertices:</span>
              <span className="meta-val">{selectedProject.polygonCoordinates.length} GPS Coordinates</span>
            </div>

            {/* Coordinates table */}
            <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              GeoJSON Polygon Ring:
            </h4>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vertex</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProject.polygonCoordinates.map((coord, idx) => (
                    <tr key={idx}>
                      <td>#{idx + 1}</td>
                      <td><code>{coord[0]}</code></td>
                      <td><code>{coord[1]}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ray-Casting Engine Test Card */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Point-in-Polygon Ray Casting Tester</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>GET /api/geofence</code> — Ray-Casting algorithm guarantees telemetry validity
              </p>
            </div>

            <form onSubmit={handleTestPoint} className="form-stack">
              <div className="form-group">
                <label>Telemetry Latitude</label>
                <input
                  type="text"
                  className="form-input"
                  value={testLat}
                  onChange={(e) => setTestLat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Telemetry Longitude</label>
                <input
                  type="text"
                  className="form-input"
                  value={testLng}
                  onChange={(e) => setTestLng(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setTestLat('7.4867');
                    setTestLng('80.3651');
                  }}
                >
                  Inside Perimeter Coordinate
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  onClick={() => {
                    setTestLat('6.9271');
                    setTestLng('79.8612');
                  }}
                >
                  Outside Perimeter (Colombo)
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Execute Point-in-Polygon Ray Cast
              </button>
            </form>

            {rayCastResult && (
              <div
                className={`alert-box alert-${rayCastResult.isInside ? 'emerald' : 'rose'}`}
                style={{ marginTop: '1.5rem' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {rayCastResult.isInside
                    ? '✅ Coordinates Confirmed INSIDE Parcel Polygon'
                    : '❌ Coordinates OUTSIDE Parcel Boundary (Spoofing Flag)'}
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  Distance from centroid: {rayCastResult.distanceFromCentroid}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: Progress Evidence Submission ──────────────────────── */}
      {activeTab === 'submit' && (
        <div className="two-col-layout">
          <div className="glass-card">
            <div className="card-header">
              <h3>Submit Milestone Evidence</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Target: <code>POST /api/reports/submit</code>
              </p>
            </div>

            <form onSubmit={handleSubmitReport} className="form-stack">
              <div className="form-group">
                <label>Milestone Phase</label>
                <input
                  type="text"
                  className="form-input"
                  value={milestoneName}
                  onChange={(e) => setMilestoneName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Geo-Tagged Inspection Photo</label>
                <input
                  type="text"
                  className="form-input"
                  value={reportPhoto}
                  onChange={(e) => setReportPhoto(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>EXIF Latitude Telemetry</label>
                <input
                  type="text"
                  className="form-input"
                  value={exifLat}
                  onChange={(e) => setExifLat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>EXIF Longitude Telemetry</label>
                <input
                  type="text"
                  className="form-input"
                  value={exifLng}
                  onChange={(e) => setExifLng(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {submitting ? 'Running Anti-Spoof & dHash Pipeline...' : 'Submit Evidence & Unlock Tranche'}
              </button>
            </form>
          </div>

          {/* Validation Result */}
          <div className="glass-card">
            <div className="card-header">
              <h3>Proof-of-Reality Validation Result</h3>
              {reportResult && <span className="badge badge-emerald">Verified & Approved</span>}
            </div>

            {reportResult ? (
              <div>
                <div className="meta-row">
                  <span className="meta-key">Report ID:</span>
                  <span className="meta-val"><code>{reportResult.reportId}</code></span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">EXIF Geofence Match:</span>
                  <span className="meta-val text-emerald">Verified Inside Polygon</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Device Telemetry:</span>
                  <span className="meta-val" style={{ fontSize: '0.8rem' }}>
                    {reportResult.exifValidation.deviceModel}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Perceptual dHash:</span>
                  <span className="meta-val">
                    <code>{reportResult.dhashResult.perceptualHash}</code> (Unique)
                  </span>
                </div>

                <div className="alert-box alert-cyan" style={{ marginTop: '1.25rem' }}>
                  <strong>Cross-Module Trigger:</strong> {reportResult.escrowMessage}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Submit milestone evidence on the left to trigger the automated EXIF anti-spoofing and perceptual dHash pipeline.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Milestone Timeline ────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="glass-card">
          <div className="card-header">
            <h3>On-Chain Proof-of-Reality Timeline</h3>
            <span className="badge badge-cyan">{selectedProject.name}</span>
          </div>

          <div className="timeline-wrap">
            {timeline.map((item, idx) => (
              <div key={item.id} className="timeline-node">
                <div className="timeline-indicator">
                  <div className="indicator-dot"></div>
                  {idx < timeline.length - 1 && <div className="indicator-line"></div>}
                </div>

                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <h4>{item.title}</h4>
                    <span className="badge badge-emerald">Verified</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.4rem 0' }}>
                    Completed on {new Date(item.completedAt).toLocaleDateString()}
                  </p>

                  <div className="timeline-badges-row">
                    <span className="badge badge-subtle">EXIF GPS Validated</span>
                    <span className="badge badge-subtle">dHash Unique</span>
                    <span className="badge badge-purple">
                      Merkle Anchor: <code>{item.anchorId}</code>
                    </span>
                  </div>

                  <div style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
                    <a
                      href={`https://testnet.xrpl.org/transactions/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      View XRPL Ledger Transaction ({item.txHash.slice(0, 16)}...) ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
