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

async function fetchWithAuth(moduleName, endpoint, options = {}) {
  const baseUrl = API_URLS[moduleName];
  if (!baseUrl) {
    throw new Error(`Unknown module: ${moduleName}`);
  }

  const url = `${baseUrl}${endpoint}`;
  
  // Get token from localStorage (client-side only)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  module1: {
    get: (endpoint, options) => fetchWithAuth('module1', endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth('module1', endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => fetchWithAuth('module1', endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => fetchWithAuth('module1', endpoint, { ...options, method: 'DELETE' }),
  },
  module2: {
    get: (endpoint, options) => fetchWithAuth('module2', endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth('module2', endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => fetchWithAuth('module2', endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => fetchWithAuth('module2', endpoint, { ...options, method: 'DELETE' }),
  },
  module3: {
    get: (endpoint, options) => fetchWithAuth('module3', endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth('module3', endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => fetchWithAuth('module3', endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => fetchWithAuth('module3', endpoint, { ...options, method: 'DELETE' }),
  },
  module4: {
    get: (endpoint, options) => fetchWithAuth('module4', endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth('module4', endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => fetchWithAuth('module4', endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => fetchWithAuth('module4', endpoint, { ...options, method: 'DELETE' }),
  },
  module5: {
    get: (endpoint, options) => fetchWithAuth('module5', endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => fetchWithAuth('module5', endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => fetchWithAuth('module5', endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => fetchWithAuth('module5', endpoint, { ...options, method: 'DELETE' }),
  },
};

export default API_URLS;
