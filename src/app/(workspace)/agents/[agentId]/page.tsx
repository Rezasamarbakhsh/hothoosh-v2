import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_AGENT_DETAILS, AGENT_STATUS_LABELS } from '@/features/agents/types/agent.types';
import { AgentDetail } from '@/features/agents/components/agent-detail';

type PageProps = {
  params: Promise<{ agentId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params;
  const agent = MOCK_AGENT_DETAILS[agentId];
  if (!agent) return { title: 'دستیار هوشمند یافت نشد — هات‌هوش' };
  return {
    title: `${agent.name} (${AGENT_STATUS_LABELS[agent.status]}) — هات‌هوش`,
  };
}

export const dynamic = 'force-dynamic';

export default async function AgentDetailPage({ params }: PageProps) {
  const { agentId } = await params;
  const agent = MOCK_AGENT_DETAILS[agentId];

  if (!agent) {
    notFound();
  }

  return <AgentDetail agent={agent} />;
}
