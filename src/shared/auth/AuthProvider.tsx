'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { ApiError, apiRequest } from '@/shared/api/client';
import type { SessionUser } from './session';

type AuthStatus = 'loading' | 'signed-in' | 'signed-out';

interface AuthValue {
  user: SessionUser | null;
  status: AuthStatus;
  /** Asks the backend who is logged in. M1's login form calls this after a successful login. */
  refresh(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/** The logged-in user, or null when signed out. */
async function fetchCurrentUser(): Promise<SessionUser | null> {
  try {
    return await apiRequest<SessionUser>('/api/users/me');
  } catch (err) {
    // 401 = not logged in; 404 = /me isn't built yet (M1, Sprint 1). Anything else is a real problem.
    if (!(err instanceof ApiError && (err.status === 401 || err.status === 404))) {
      console.error(err);
    }
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const applyUser = useCallback((me: SessionUser | null) => {
    setUser(me);
    setStatus(me ? 'signed-in' : 'signed-out');
  }, []);

  const refresh = useCallback(async () => {
    applyUser(await fetchCurrentUser());
  }, [applyUser]);

  const signOut = useCallback(async () => {
    await apiRequest('/api/users/logout', { method: 'POST' }).catch(() => undefined);
    applyUser(null);
  }, [applyUser]);

  // Check once when the site loads. The state is set when the answer arrives, and ignored if
  // the provider has unmounted by then.
  useEffect(() => {
    let active = true;
    void fetchCurrentUser().then((me) => {
      if (active) applyUser(me);
    });
    return () => {
      active = false;
    };
  }, [applyUser]);

  return (
    <AuthContext.Provider value={{ user, status, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
