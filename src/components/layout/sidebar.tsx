'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const WORKSPACE_NAV: NavItem[] = [
  { id: 'chat', label: 'گفتگو', icon: '•', href: '/chat' },
  { id: 'agents', label: 'عوامل هوشمند', icon: '•', href: '/agents' },
  { id: 'knowledge', label: 'پایگاه دانش', icon: '•', href: '/knowledge' },
  { id: 'memory', label: 'حافظه', icon: '•', href: '/memory' },
  { id: 'settings', label: 'تنظیمات', icon: '•', href: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function getActiveId(): string {
    if (pathname.startsWith('/agents')) return 'agents';
    if (pathname.startsWith('/knowledge')) return 'knowledge';
    if (pathname.startsWith('/memory')) return 'memory';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'chat';
  }

  const activeId = getActiveId();

  return (
    <aside
      className={
        'glass-panel-solid flex h-full flex-col transition-[width] duration-[var(--duration-300)] ease-[var(--ease-out)] ' +
        (collapsed ? 'w-16' : 'w-64')
      }
      aria-label="ناوبری اصلی"
    >
      {/* Logo area */}
      <div className="flex h-14 items-center gap-3 border-b border-[var(--color-border-default)] px-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'باز کردن نوار کناری' : 'بستن نوار کناری'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="transition-transform duration-[var(--duration-200)]"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          >
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              fill="currentColor"
            />
          </svg>
        </button>
        {!collapsed && (
          <Link href="/chat" className="truncate">
            <span
              className="text-[var(--text-heading-sm)] font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight-xs)] text-[var(--color-text-primary)]"
              style={{ fontSize: 'var(--text-heading-sm)' }}
            >
              هات‌هوش
            </span>
          </Link>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-1" role="list">
          {WORKSPACE_NAV.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] ' +
                    (isActive
                      ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]'
                      : 'hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]')
                  }
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute inset-y-0 start-0 w-[3px] rounded-e-full bg-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="shrink-0 text-base" aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span
                      className="truncate font-[var(--font-weight-medium)]"
                      style={{ fontSize: 'var(--text-body-md)' }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
