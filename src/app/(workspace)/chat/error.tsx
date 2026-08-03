'use client';

import Link from 'next/link';

export default function ChatError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-error-500)]/10"
        >
          <svg
            className="h-8 w-8 text-[var(--color-error-500)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-md)',
            fontWeight: 'var(--font-weight-semibold)',
          }}
        >
          خطا در بارگذاری گفتگوها
        </h2>
        <p
          className="max-w-sm text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          در دریافت لیست گفتگوها مشکلی پیش آمده.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-[var(--color-primary-500)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            تلاش مجدد
          </button>
          <Link
            href="/chat"
            className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-raised)]"
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            بازگشت
          </Link>
        </div>
      </div>
    </div>
  );
}
