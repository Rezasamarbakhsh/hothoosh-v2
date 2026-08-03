export default function MemoryPackLoading() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Breadcrumb skeleton */}
      <div className='flex items-center gap-2'>
        <div className='h-4 w-12 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
        <div className='h-4 w-4 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
        <div className='h-4 w-24 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
      </div>

      {/* Header skeleton */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <div className='flex items-start gap-3'>
          <div className='h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[var(--color-surface-subtle)]' />
          <div className='flex-1'>
            <div className='h-7 w-40 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
            <div className='mt-2 flex gap-2'>
              <div className='h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
              <div className='h-5 w-14 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
              <div className='h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface-subtle)]' />
            </div>
          </div>
        </div>
        <div className='mt-4 h-4 w-full animate-pulse rounded bg-[var(--color-surface-subtle)]' />
      </div>

      {/* Tabs skeleton */}
      <div className='border-b border-[var(--color-border-default)]'>
        <div className='flex gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-10 w-20 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
          ))}
        </div>
      </div>

      {/* Config tab skeleton */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <div className='h-5 w-24 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
        <div className='mt-4 grid grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className='h-3 w-12 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
              <div className='mt-1.5 h-5 w-20 animate-pulse rounded bg-[var(--color-surface-subtle)]' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
