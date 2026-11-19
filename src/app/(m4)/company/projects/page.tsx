import type { Metadata } from 'next';
import { CompanyProjectsHome } from '@/modules/m4-geofencing/components/CompanyProjectsHome';

export const metadata: Metadata = { title: 'My projects' };

export default function CompanyProjectsPage() {
  return <CompanyProjectsHome />;
}
