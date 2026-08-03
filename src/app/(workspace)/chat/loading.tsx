export default function ChatLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Skeleton header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-[var(--color-surface-raised)]" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-[var(--color-surface-raised)]" />
      </div>

      {/* Skeleton cards */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="glass-panel-elevated rounded-xl p-4"
        >
          <div className="space-y-3">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--color-surface-raised)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-raised)]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-raised)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
