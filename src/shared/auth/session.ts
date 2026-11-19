/** The same four roles as the backend (planttrust-backend src/shared/auth.ts). */
export type Role = 'investor' | 'company' | 'admin' | 'regulator';

/** What GET /api/users/me returns for the logged-in user. */
export interface SessionUser {
  id: string;
  role: Role;
  name: string;
}
