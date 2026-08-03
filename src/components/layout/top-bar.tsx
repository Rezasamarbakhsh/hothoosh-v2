'use client';

import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '../theme/theme-toggle';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const { data: session } = useSession();
  const userName = (session?.user as Record<string, unknown> | undefined)?.name as string | undefined;
  const userRole = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined;
  const initial = userName ? userName.charAt(0) : '?';
  const roleLabel = userRole === 'admin' ? 'مدیر' : 'کاربر';

  return (
    <header className="glass-panel-solid flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border-default)] px-4">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        aria-label="منوی موبایل"
        className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Search trigger (placeholder) */}
      <div className="hidden flex-1 items-center gap-2 lg:flex">
        <button
          type="button"
          aria-label="جستجوی سریع"
          className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 text-[var(--color-text-muted)] transition-colors duration-[var(--duration-150)] hover:border-[var(--color-border-strong)]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z"
              fill="currentColor"
            />
          </svg>
          <span style={{ fontSize: 'var(--text-body-sm)' }}>جستجو...</span>
          <kbd
            className="me-auto rounded border border-[var(--color-border-default)] bg-[var(--color-surface-solid)] px-1.5 py-0.5"
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* End actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* User info + logout */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span
              className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)] leading-tight"
              style={{ fontSize: 'var(--text-caption-sm)' }}
            >
              {userName || 'کاربر'}
            </span>
            <span
              className="text-[var(--color-text-muted)] leading-tight"
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {roleLabel}
            </span>
          </div>
          <button
            type="button"
            aria-label="خروج از حساب"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] font-[var(--font-weight-semibold)] text-[var(--color-primary-600)] transition-opacity duration-[var(--duration-150)] hover:opacity-80"
            style={{ fontSize: 'var(--text-body-sm)' }}
            title={userName ? `${userName} — کلیک برای خروج` : 'پروفایل کاربر'}
          >
            {initial}
          </button>
        </div>
      </div>
    </header>
  );
}
