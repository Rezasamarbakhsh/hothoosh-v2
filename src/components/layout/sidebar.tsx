'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  MessageSquare,
  Bot,
  Database,
  Brain,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  adminOnly?: boolean;
}

const WORKSPACE_NAV: NavItem[] = [
  { id: 'chat', label: 'گفتگو', icon: <MessageSquare size={20} />, href: '/chat' },
  { id: 'agents', label: 'دستیاران هوشمند', icon: <Bot size={20} />, href: '/agents' },
  { id: 'knowledge', label: 'پایگاه دانش', icon: <Database size={20} />, href: '/knowledge' },
  { id: 'memory', label: 'حافظه', icon: <Brain size={20} />, href: '/memory' },
  { id: 'admin', label: 'پنل مدیریت', icon: <ShieldCheck size={20} />, href: '/admin', adminOnly: true },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const isAdmin = (session?.user as Record<string, unknown>)?.role === 'admin';
  const userName = (session?.user as Record<string, unknown>)?.name as string | undefined;
  const userRole = (session?.user as Record<string, unknown>)?.role as string | undefined;
  const initial = userName ? userName.charAt(0) : '?';
  const roleLabel = userRole === 'admin' ? 'مدیر' : 'کاربر';

  const visibleNav = WORKSPACE_NAV.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  function getActiveId(): string {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/agents')) return 'agents';
    if (pathname.startsWith('/knowledge')) return 'knowledge';
    if (pathname.startsWith('/memory')) return 'memory';
    return 'chat';
  }

  const activeId = getActiveId();

  return (
    <aside
      className={
        'flex h-full flex-col border-e border-[var(--color-border-default)] bg-[var(--color-surface-solid)] transition-[width] duration-[var(--duration-300)] ease-[var(--ease-out)] ' +
        (collapsed ? 'w-16' : 'w-64')
      }
      aria-label='ناوبری اصلی'
    >
      {/* Logo area */}
      <div className='flex h-14 items-center gap-3 px-3'>
        <button
          type='button'
          onClick={onToggle}
          aria-label={collapsed ? 'باز کردن نوار کناری' : 'بستن نوار کناری'}
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 20 20'
            fill='none'
            className='transition-transform duration-[var(--duration-200)]'
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden='true'
          >
            <path
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              fill='currentColor'
            />
          </svg>
        </button>
        {!collapsed && (
          <Link href='/chat' className='truncate'>
            <Image
              src='/hothoosh.png'
              alt='هات‌هوش'
              width={400}
              height={121}
              className='h-7 w-auto'
              priority
            />
          </Link>
        )}
        {collapsed && (
          <Link href='/chat' className='shrink-0'>
            <Image
              src='/hothoosh.png'
              alt='هات‌هوش'
              width={400}
              height={121}
              className='h-7 w-auto'
            />
          </Link>
        )}
      </div>

      {/* Nav items — vertically centered area */}
      <nav className='flex-1 overflow-y-auto px-2 py-2'>
        <ul className='flex flex-col gap-0.5' role='list'>
          {visibleNav.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[var(--color-text-secondary)] transition-all duration-[var(--duration-150)] ' +
                    (isActive
                      ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-400)]'
                      : 'hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]')
                  }
                >
                  <span className='shrink-0 h-5 w-5' aria-hidden='true'>{item.icon}</span>
                  {!collapsed && (
                    <span
                      className='truncate font-[var(--font-weight-medium)]'
                      style={{ fontSize: 'var(--text-body-sm)' }}
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

      {/* Bottom section: Theme toggle + Profile */}
      <div className='border-t border-[var(--color-border-default)] px-2 py-2'>
        {/* Theme toggle */}
        <button
          type='button'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[var(--color-text-muted)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-secondary)]'
          aria-label='تغییر تم'
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (
            <span style={{ fontSize: 'var(--text-caption-sm)' }}>
              {theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            </span>
          )}
        </button>

        {/* Profile row */}
        <Link
          href='/profile'
          className='flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)]'
        >
          {/* Avatar */}
          <div
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)]/15 font-[var(--font-weight-semibold)] text-[var(--color-primary-400)]'
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {initial}
          </div>

          {!collapsed && (
            <div className='min-w-0 flex-1'>
              <p
                className='truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]'
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                {userName || 'کاربر'}
              </p>
              <p
                className='text-[var(--color-text-muted)]'
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {roleLabel}
              </p>
            </div>
          )}

          {/* Logout button */}
            <button
              type='button'
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); signOut({ callbackUrl: '/login' }); }}
              className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-error-500)]/10 hover:text-[var(--color-error-500)]'
              aria-label='خروج از حساب'
              title='خروج'
            >
              <LogOut size={15} />
            </button>
        </Link>
      </div>
    </aside>
  );
}
