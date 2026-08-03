'use client';

import { useState, useCallback } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: number;
}

const WORKSPACE_NAV: NavItem[] = [
  { id: 'chat', label: 'گفتگو', icon: '💬' },
  { id: 'agents', label: 'عوامل هوشمند', icon: '🤖' },
  { id: 'knowledge', label: 'پایگاه دانش', icon: '📚' },
  { id: 'memory', label: 'حافظه', icon: '🧠' },
  { id: 'settings', label: 'تنظیمات', icon: '⚙️' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeId: string;
  onNavigate: (id: string) => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  activeId,
  onNavigate,
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleNav = useCallback(
    (id: string) => {
      onNavigate(id);
    },
    [onNavigate],
  );

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
            style={
              { transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }
              // SAFETY: inline style for dynamic rotation based on state
            }
            aria-hidden="true"
          >
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              fill="currentColor"
            />
          </svg>
        </button>
        {!collapsed && (
          <span
            className="text-[var(--text-heading-sm)] font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight-xs)]"
            style={{ fontSize: 'var(--text-heading-sm)' }}
          >
            هت‌هوش
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-1" role="list">
          {WORKSPACE_NAV.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNav(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] ' +
                    (isActive
                      ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]'
                      : 'hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]')
                  }
                >
                  {/* Active indicator — border-inline-start for RTL (UI-System §9.2) */}
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
                  {/* Tooltip for collapsed state */}
                  {collapsed && hoveredItem === item.id && (
                    <span
                      className="pointer-events-none absolute start-full ms-2 whitespace-nowrap rounded-md bg-[var(--color-text-primary)] px-2 py-1 text-[var(--color-text-inverse)]"
                      style={{ fontSize: 'var(--text-caption-sm)' }}
                      role="tooltip"
                    >
                      {item.label}
                    </span>
                  )}
                  {/* Badge */}
                  {!collapsed && item.badge && item.badge > 0 && (
                    <span
                      className="me-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 font-[var(--font-weight-medium)]"
                      style={{ fontSize: 'var(--text-caption-xs)' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
