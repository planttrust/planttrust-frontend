import type { Metadata } from 'next';
import { AssistantHome } from '@/modules/m3-mcp-ai/components/AssistantHome';

export const metadata: Metadata = { title: 'Assistant' };

export default function AssistantPage() {
  return <AssistantHome />;
}
