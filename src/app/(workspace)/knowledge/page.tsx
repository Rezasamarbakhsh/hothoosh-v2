import type { Metadata } from 'next';
import { MOCK_KNOWLEDGE_BASES } from '@/features/knowledge/types/knowledge.types';
import { KBList } from '@/features/knowledge/components/kb-list';

export const metadata: Metadata = {
  title: 'پایگاه دانش — هات‌هوش',
};

export default function KnowledgePage() {
  const knowledgeBases = MOCK_KNOWLEDGE_BASES;
  return <KBList knowledgeBases={knowledgeBases} />;
}
