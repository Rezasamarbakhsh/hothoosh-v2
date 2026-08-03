'use client';

import Link from 'next/link';

export default function MemoryError({ reset, error }: { reset: () => void; error: Error & { digest?: string } }) {
  const message = error?.message ?? 'خطای غیرمنتظره‌ای رخ داد';

  return (
    <div className='flex flex-col items-center justify-center py-24'>
      <div className='glass-panel-elevated rounded-xl p-8 text-center' style={{ maxWidth: 420 }}>
        <svg width='48' height='48' viewBox='0 0 16 16' fill='var(--color-danger-500)' className='mx-auto' aria-hidden='true'>
          <path d='M8 1a7 7 0 110 14A7 7 0 018 1zm2.53 4.47l-1.06-1.06L8 5.94 6.53 4.47 5.47 5.53 6.94 7l-1.47 1.47 1.06 1.06L8 8.06l1.47 1.47 1.06-1.06L9.06 7l1.47-1.53z' />
        </svg>
        <h1 className='mt-4 font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-lg)' }}>
          خطا در بارگذاری حافظه
        </h1>
        <p className='mt-2 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
          {message}
        </p>
        <div className='mt-6 flex items-center justify-center gap-3'>
          <button
            type='button'
            onClick={() => reset()}
            className='rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[var(--font-weight-medium)] text-white transition-opacity duration-[var(--duration-150)] hover:opacity-90'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            تلاش مجدد
          </button>
          <Link
            href='/memory'
            className='rounded-lg border border-[var(--color-border-default)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            بازگشت
          </Link>
        </div>
      </div>
    </div>
  );
}
