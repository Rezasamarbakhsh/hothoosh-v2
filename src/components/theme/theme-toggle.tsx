'use client';

import { useTheme } from './theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';

type ThemePreference = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  function cycleTheme() {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const currentIdx = order.indexOf(preference);
    const next = order[(currentIdx + 1) % order.length];
    setPreference(next);
  }

  const labelMap: Record<ThemePreference, string> = {
    light: 'حالت روشن',
    dark: 'حالت تاریک',
    system: 'پیش‌فرض سیستم',
  };

  const iconMap: Record<ThemePreference, React.ReactNode> = {
    light: <Sun className='h-[18px] w-[18px]' />,
    dark: <Moon className='h-[18px] w-[18px]' />,
    system: <Monitor className='h-[18px] w-[18px]' />,
  };

  return (
    <button
      type='button'
      onClick={cycleTheme}
      aria-label={labelMap[preference]}
      className='flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] ease-[var(--ease-out)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]'
    >
      {iconMap[preference]}
    </button>
  );
}
