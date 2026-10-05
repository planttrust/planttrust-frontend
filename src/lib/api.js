/* ─── API Client ─────────────────────────────────────────────────────────
 * Central utility for calling backend APIs.
 * Each module's pages import from here instead of hardcoding URLs.
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const res = await api.module1.post('/auth/login', { email, password });
 * ──────────────────────────────────────────────────────────────────────── */

const API_URLS = {
  module1: process.env.NEXT_PUBLIC_MODULE1_URL || 'http://localhost:3001',
  module2: process.env.NEXT_PUBLIC_MODULE2_URL || 'http://localhost:3002',
  module3: process.env.NEXT_PUBLIC_MODULE3_URL || 'http://localhost:3003',
  module4: process.env.NEXT_PUBLIC_MODULE4_URL || 'http://localhost:3004',
  module5: process.env.NEXT_PUBLIC_MODULE5_URL || 'http://localhost:3005',
};

// TODO: Implement actual fetch wrapper with JWT token attachment
// Each team member will use this to call their module's backend

export default API_URLS;
