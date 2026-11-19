import type { Metadata } from 'next';
import { UsersHome } from '@/modules/m1-users/components/UsersHome';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return <UsersHome />;
}
