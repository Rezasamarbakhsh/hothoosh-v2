export default function KBDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
        <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
        <div className="h-4 w-36 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
      </div>

      {/* Header skeleton */}
      <div className="glass-panel-elevated rounded-xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-7 w-40 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
            </div>
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[var(--color-surface-subtle)]" />
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]" />
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-default)]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
        ))}
      </div>

      {/* Documents tab skeleton */}
      <div className="space-y-4">
        <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border-default)]">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
          </div>
        </div>
        <div className="glass-panel-solid rounded-xl divide-y divide-[var(--color-border-default)]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
                <div className="h-4 w-36 animate-pulse rounded bg-[var(--color-surface-subtle)]" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
