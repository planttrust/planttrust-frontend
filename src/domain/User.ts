import type { UserRole, User as IUser } from '@/types';

export class UserEntity implements IUser {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly email: string,
    public role: UserRole,
    public phone?: string | null,
    public readonly createdAt?: string
  ) {}

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public isCompany(): boolean {
    return this.role === 'company';
  }

  public isInvestor(): boolean {
    return this.role === 'investor';
  }

  public getInitials(): string {
    if (!this.name) return 'U';
    const parts = this.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  public getRoleBadgeVariant(): 'default' | 'success' | 'warning' | 'info' {
    switch (this.role) {
      case 'admin':
        return 'danger' as any;
      case 'company':
        return 'warning';
      case 'investor':
        return 'success';
      default:
        return 'info';
    }
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      createdAt: this.createdAt,
    };
  }

  public static fromJSON(json: any): UserEntity {
    return new UserEntity(
      json.id || '',
      json.name || json.fullName || 'Unknown User',
      json.email || '',
      json.role || 'user',
      json.phone || null,
      json.createdAt
    );
  }
}
