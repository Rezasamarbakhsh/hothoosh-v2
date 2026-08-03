import type { Metadata } from 'next';
import { MOCK_MEMORY_PACKS } from '@/features/memory/types/memory.types';
import { MemoryPackGallery } from '@/features/memory/components/memory-pack-gallery';

export const metadata: Metadata = {
  title: 'حافظه — هات‌هوش',
  description: 'مدیریت بسته‌های حافظه و بافت زمینه‌ای عوامل هوشمند',
};

export default function MemoryPage() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Page header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1
            className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]'
            style={{ fontSize: 'var(--text-heading-xl)' }}
          >
            حافظه
          </h1>
          <p className='mt-1 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
            بسته‌های حافظه پایدار که در جلسات گفتگو به عوامل تزریق می‌شوند
          </p>
        </div>
      </div>

      <MemoryPackGallery packs={MOCK_MEMORY_PACKS} />
    </div>
  );
}
