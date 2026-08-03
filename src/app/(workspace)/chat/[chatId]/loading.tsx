export default function ChatSessionLoading() {
  return (
    <div className="flex h-full">
      {/* Conversation list skeleton — desktop */}
      <div className="hidden w-72 shrink-0 border-e border-[var(--color-border-default)] lg:block">
        <div className="space-y-3 p-3">
          <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--color-surface-raised)]" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--color-surface-raised)]" />
        </div>
        <div className="space-y-2 px-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-2.5"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface-raised)]" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[var(--color-surface-raised)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Main area skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--color-border-default)] px-4 py-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--color-surface-raised)]" />
          <div className="space-y-1">
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-raised)]" />
            <div className="h-3 w-40 animate-pulse rounded bg-[var(--color-surface-raised)]" />
          </div>
        </div>

        <div className="flex-1 px-4 py-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--color-surface-raised)]" />
                <div className="space-y-2" style={{ width: `${60 + Math.random() * 30}%` }}>
                  <div className="h-4 w-full animate-pulse rounded-xl bg-[var(--color-surface-raised)]" />
                  <div className="h-4 w-4/5 animate-pulse rounded-xl bg-[var(--color-surface-raised)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
