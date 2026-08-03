import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_KB_DETAILS, KB_STATUS_LABELS } from '@/features/knowledge/types/knowledge.types';
import { KBDetail } from '@/features/knowledge/components/kb-detail';

type PageProps = {
  params: Promise<{ kbId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kbId } = await params;
  const kb = MOCK_KB_DETAILS[kbId];
  if (!kb) return { title: 'پایگاه دانش یافت نشد — هات‌هوش' };
  return {
    title: `${kb.name} (${KB_STATUS_LABELS[kb.processingStatus]}) — هات‌هوش`,
  };
}

export const dynamic = 'force-dynamic';

export default async function KBDetailPage({ params }: PageProps) {
  const { kbId } = await params;
  const kb = MOCK_KB_DETAILS[kbId];

  if (!kb) {
    notFound();
  }

  return <KBDetail kb={kb} />;
}
