/** Copied from planttrust-backend contracts/m1-users.md. Keep the two in sync. */
import type { Role, SessionUser } from '@/shared/auth/session';

export interface UserSummary {
  id: string;
  role: Role;
  name: string;
  verified: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Extract<Role, 'investor' | 'company'>;
}

export type LoginResult = SessionUser;

export interface ModuleHealth {
  module: string;
  status: string;
}
