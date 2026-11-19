import { apiRequest } from '@/shared/api/client';
import type { LoginResult, ModuleHealth, RegisterInput } from './types';

const BASE = '/api/users';

export function getHealth() {
  return apiRequest<ModuleHealth>(`${BASE}/health`);
}

/**
 * The backend checks the password and sets the httpOnly login cookie. After this succeeds,
 * call refresh() from useAuth() so the whole app knows who is logged in.
 */
export function login(email: string, password: string) {
  return apiRequest<LoginResult>(`${BASE}/login`, { method: 'POST', body: { email, password } });
}

export function register(input: RegisterInput) {
  return apiRequest<LoginResult>(`${BASE}/register`, { method: 'POST', body: input });
}
