import { BaseApiClient, RequestOptions } from './BaseApiClient';
import { UserEntity } from '@/domain/User';
import type { AuthResponse, User } from '@/types';

export class AuthService extends BaseApiClient {
  constructor(baseUrl?: string) {
    super(baseUrl || process.env.NEXT_PUBLIC_MODULE1_URL);
  }

  public async getStatus(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth');
  }

  public async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res?.token) {
      this.setToken(res.token);
      if (res.user) this.setUser(res.user);
    }
    return res;
  }

  public async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res?.token) {
      this.setToken(res.token);
      if (res.user) this.setUser(res.user);
    }
    return res;
  }

  public logout(): void {
    this.clearSession();
  }

  public getCurrentUser(): UserEntity | null {
    const rawUser = this.getUser();
    return rawUser ? UserEntity.fromJSON(rawUser) : null;
  }

  public getStoredToken(): string | null {
    return this.getToken();
  }
}

const authService = new AuthService();
export default authService;
