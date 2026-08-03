export default function KnowledgeLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel-solid rounded-lg p-3">
            <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
            <div className="mt-2 h-6 w-10 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />

      {/* Grid skeleton — 3 columns (Frontend-Arch §4.3) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel-elevated rounded-xl p-5">
            <div className="flex items-start gap-2">
              <div className="h-5 w-28 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-subtle)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
            </div>
            <div className="mt-4 border-t border-[var(--color-border-default)] pt-3">
              <div className="h-4 w-40 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
