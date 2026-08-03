'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AgentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Agents page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--color-danger-500)]" aria-hidden="true">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14v10m0 6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="mt-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-md)' }}>
        خطا در بارگذاری عوامل هوشمند
      </h2>
      <p className="mt-2 max-w-md text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
        در بارگذاری لیست عوامل هوشمند مشکلی پیش آمده است. لطفا دوباره تلاش کنید.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={
            'rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] ' +
            'transition-opacity duration-[var(--duration-150)] hover:opacity-90'
          }
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          تلاش مجدد
        </button>
        <Link
          href="/agents"
          className={
            'rounded-lg bg-[var(--color-surface-subtle)] px-4 py-2 font-[var(--font-weight-medium)] ' +
            'text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]'
          }
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          بازگشت به لیست عوامل
        </Link>
      </div>
    </div>
  );
}
