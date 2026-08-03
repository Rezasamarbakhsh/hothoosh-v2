export default function AgentDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
        <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
      </div>

      {/* Header skeleton */}
      <div className="glass-panel-elevated rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-[var(--color-surface-subtle)]" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-7 w-40 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
            </div>
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[var(--color-surface-subtle)]" />
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
          </div>
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-default)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
        ))}
      </div>

      {/* Config tab skeleton */}
      <div className="space-y-6">
        <div className="glass-panel-solid rounded-xl p-5 space-y-4">
          <div className="h-5 w-28 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
                <div className="mt-1.5 h-4 w-32 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel-solid rounded-xl p-5 space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
                <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
