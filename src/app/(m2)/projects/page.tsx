import type { Metadata } from 'next';
import { MarketplaceHome } from '@/modules/m2-marketplace/components/MarketplaceHome';

export const metadata: Metadata = { title: 'Explore projects' };

export default function ProjectsPage() {
  return <MarketplaceHome />;
}
