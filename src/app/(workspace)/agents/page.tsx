import type { Metadata } from 'next';
import { MOCK_AGENTS } from '@/features/agents/types/agent.types';
import { AgentGallery } from '@/features/agents/components/agent-gallery';

export const metadata: Metadata = {
  title: 'عوامل هوشمند — هات‌هوش',
};

export default function AgentsPage() {
  // In production: async fetch via TanStack Query, pass as props to Client Component
  // Per Frontend-Arch §5.3: Server Component wrapper + Client Component child
  const agents = MOCK_AGENTS;

  return <AgentGallery agents={agents} />;
}
