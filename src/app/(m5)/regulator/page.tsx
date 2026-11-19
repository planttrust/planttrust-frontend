import type { Metadata } from 'next';
import { RegulatorHome } from '@/modules/m5-audit/components/RegulatorHome';

export const metadata: Metadata = { title: 'Trust & audit overview' };

export default function RegulatorPage() {
  return <RegulatorHome />;
}
