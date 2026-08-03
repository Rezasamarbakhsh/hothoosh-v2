'use client';

export default function ChatSessionError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-error-50)]">
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
        خطا در بارگذاری گفتگو
      </h2>
      <p
        className="text-[var(--color-text-secondary)]"
        style={{ fontSize: 'var(--text-body-sm)' }}
      >
        این گفتگو یافت نشد یا خطایی رخ داده است.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-primary-500)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
        style={{ fontSize: 'var(--text-body-sm)' }}
      >
        تلاش مجدد
      </button>
    </div>
  );
}
