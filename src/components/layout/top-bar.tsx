'use client';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  return (
    <header className='flex h-12 shrink-0 items-center justify-between gap-4 px-4'>
      {/* Mobile hamburger */}
      <button
        type='button'
        onClick={onMobileMenuToggle}
        aria-label='منوی موبایل'
        className='flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] lg:hidden'
      >
        <svg width='20' height='20' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {/* Search trigger */}
      <div className='hidden flex-1 items-center gap-2 lg:flex'>
        <button
          type='button'
          aria-label='جستجوی سریع'
          className='flex h-9 flex-1 max-w-md items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 text-[var(--color-text-muted)] transition-colors duration-[var(--duration-150)] hover:border-[var(--color-border-strong)]'
        >
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
            <path
              d='M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z'
              fill='currentColor'
            />
          </svg>
          <span style={{ fontSize: 'var(--text-body-sm)' }}>جستجو...</span>
          <kbd
            className='me-auto rounded border border-[var(--color-border-default)] bg-[var(--color-surface-solid)] px-1.5 py-0.5'
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Spacer on mobile */}
      <div className='lg:hidden' />
    </header>
  );
}
