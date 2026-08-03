import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_MEMORY_DETAILS, MOCK_MEMORY_PACKS } from '@/features/memory/types/memory.types';
import { MemoryPackDetail } from '@/features/memory/components/memory-pack-detail';

interface PageProps {
  params: Promise<{ packId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { packId } = await params;
  const pack = MOCK_MEMORY_PACKS.find((p) => p.id === packId);
  if (!pack) return { title: 'بسته حافظه یافت نشد — هات‌هوش' };
  return {
    title: `${pack.name} — حافظه — هات‌هوش`,
    description: pack.description ?? undefined,
  };
}

export default async function MemoryPackPage({ params }: PageProps) {
  const { packId } = await params;
  const detail = MOCK_MEMORY_DETAILS[packId];
  if (!detail) notFound();
  return <MemoryPackDetail detail={detail} />;
}
