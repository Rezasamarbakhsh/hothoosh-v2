export default function MemoryLoading() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Page header skeleton */}
      <div className='flex items-center justify-between'>
        <div>
          <div className='h-7 w-20 animate-pulse rounded-md bg-[var(--color-surface-subtle)]' />
          <div className='mt-2 h-4 w-72 animate-pulse rounded-md bg-[var(--color-surface-subtle)]' />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='glass-panel-elevated rounded-xl p-4'>
            <div className='h-3 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
            <div className='mt-2 h-7 w-10 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className='h-10 w-full animate-pulse rounded-lg bg-[var(--color-surface-subtle)]' />

      {/* Filter pills skeleton */}
      <div className='flex gap-1.5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='h-7 w-20 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='glass-panel-elevated flex flex-col rounded-xl p-5'>
            <div className='flex items-start gap-2.5'>
              <div className='h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[var(--color-surface-subtle)]' />
              <div className='min-w-0 flex-1'>
                <div className='h-5 w-32 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
                <div className='mt-2 flex gap-1.5'>
                  <div className='h-5 w-14 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
                  <div className='h-5 w-14 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
                </div>
              </div>
            </div>
            <div className='mt-3 h-4 w-full animate-pulse rounded bg-[var(--color-surface-subtle)]' />
            <div className='mt-3 h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
            <div className='mt-4 border-t border-[var(--color-border-default)] pt-4'>
              <div className='flex gap-3'>
                <div className='h-4 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
                <div className='h-4 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
                <div className='h-4 w-16 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
