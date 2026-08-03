export default function ChatLoading() {
  return (
    <div className="flex h-full">
      <div className="w-72 animate-pulse border-e border-[var(--color-border-default)] bg-[var(--color-surface-solid)]">
        <div className="px-3 py-3">
          <div className="h-9 w-28 rounded-lg bg-[var(--color-surface-elevated)]" />
        </div>
        <div className="px-3 pb-2">
          <div className="h-9 w-full rounded-lg bg-[var(--color-surface-elevated)]" />
        </div>
        <div className="space-y-1 px-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-elevated)]" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-12 items-center border-b border-[var(--color-border-default)] px-4">
          <div className="h-5 w-24 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--color-surface-elevated)]" />
          <div className="mt-3 h-6 w-72 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
        </div>
      </div>
    </div>
  );
}
