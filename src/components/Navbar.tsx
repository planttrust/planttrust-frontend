'use client';

/* ─── PlanTrust Global Navbar (TypeScript + Tailwind) ─────────────────────
 * Shared navigation bar across all 5 modules with:
 * - Live Backend Health Status indicator (checks unified backend on port 3000)
 * - Module owner badges and route navigation
 * - User session management (Role switcher, JWT inspection, Login/Logout)
 * ──────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api, authStorage } from '@/lib/api';
import type { User, UserRole } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'mock' | 'checking'>('checking');
  const [user, setUser] = useState<User | null>(() => (typeof window !== 'undefined' ? authStorage.getUser() : null));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await api.health();
        if (isMounted) {
          if (res?.status === 'ok') {
            setBackendStatus('online');
          } else if (res?.status === 'mock_online') {
            setBackendStatus('mock');
          } else {
            setBackendStatus('online');
          }
        }
      } catch {
        if (isMounted) setBackendStatus('offline');
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    authStorage.clear();
    setUser(null);
  };

  const setDemoRole = (role: UserRole, name: string, email: string) => {
    const demoUser: User = { id: `demo-${role}-${Date.now().toString().slice(-4)}`, name, email, role };
    authStorage.setToken(`demo-jwt-token-${role}`);
    authStorage.setUser(demoUser);
    setUser(demoUser);
  };

  const navLinks = [
    { href: '/', label: 'Overview', tag: null },
    { href: '/auth', label: 'Identity & Auth', tag: 'M1' },
    { href: '/marketplace', label: 'Marketplace', tag: 'M2' },
    { href: '/chatbot', label: 'AI Explainability', tag: 'M3' },
    { href: '/company', label: 'Company Portal', tag: 'M4' },
    { href: '/dashboard', label: 'Audit Trail', tag: 'M5' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <span className="navbar-title">PlanTrust</span>
            <span className="badge badge-cyan" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>XRPL Testnet</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.tag && <span className="nav-tag">{link.tag}</span>}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Backend Status & User Auth */}
        <div className="navbar-actions">
          {/* Backend Status Indicator */}
          <div
            className={`status-indicator status-${backendStatus}`}
            title={`Backend Status: ${backendStatus} (Port 3000)`}
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {backendStatus === 'online' && 'API :3000 Online'}
              {backendStatus === 'mock' && 'Mock Mode'}
              {backendStatus === 'offline' && 'API Offline'}
              {backendStatus === 'checking' && 'Connecting...'}
            </span>
          </div>

          {/* User Auth Info / Role Switcher */}
          {user ? (
            <div className="user-pill">
              <span className={`badge ${user.role === 'admin' ? 'badge-rose' : user.role === 'company' ? 'badge-purple' : 'badge-emerald'}`} style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                {user.role}
              </span>
              <span className="user-name" title={user.email}>{user.name}</span>
              <button
                onClick={handleLogout}
                className="btn-icon"
                title="Log out"
                aria-label="Log out"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="auth-quick-actions">
              <Link href="/auth" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                Sign In
              </Link>
              {/* Quick Dev Role Switcher */}
              <div className="role-switcher-dropdown">
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', opacity: 0.8 }}
                  title="Switch Mock Role for Testing"
                  onClick={() => setDemoRole('investor', 'Aiden Silva (Investor)', 'aiden@planttrust.org')}
                >
                  ⚡ Fast-Demo
                </button>
              </div>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.tag && <span className="nav-tag">{link.tag}</span>}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
