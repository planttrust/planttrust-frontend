/* ─── Home Page ──────────────────────────────────────────────────────────
 * Landing page for PlanTrust.
 *
 * TODO: Replace with actual landing page design.
 * ──────────────────────────────────────────────────────────────────────── */

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>PlanTrust</h1>
      <p>Blockchain-Based Land Investment Platform</p>

      {/* TODO: Replace with actual landing page. These are just nav links for development. */}
      <nav>
        <ul>
          <li><Link href="/auth">Module 1 — Auth / User Management</Link></li>
          <li><Link href="/marketplace">Module 2 — Investor Marketplace</Link></li>
          <li><Link href="/chatbot">Module 3 — AI Chatbot</Link></li>
          <li><Link href="/company">Module 4 — Company Portal</Link></li>
          <li><Link href="/dashboard">Module 5 — Regulatory Dashboard</Link></li>
        </ul>
      </nav>
    </div>
  );
}
