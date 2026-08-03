export default function ChatError({ reset }: { reset: () => void }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-md)' }}>خطایی رخ داد</p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-[var(--color-primary-500)] px-4 py-2 text-[var(--color-text-inverse)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
