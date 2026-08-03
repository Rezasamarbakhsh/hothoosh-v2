export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-raised)]"
      >
        <svg
          className="h-8 w-8 text-[var(--color-text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
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
        یک گفتگو انتخاب کنید
      </h2>
      <p
        className="max-w-sm text-center text-[var(--color-text-secondary)]"
        style={{ fontSize: 'var(--text-body-sm)' }}
      >
        از لیست سمت راست یک گفتگوی قبلی را انتخاب کنید یا گفتگوی جدید شروع
        کنید.
      </p>
    </div>
  );
}
