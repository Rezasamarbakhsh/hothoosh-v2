'use client';

import { useTheme } from './theme-provider';

type ThemePreference = 'light' | 'dark' | 'system';

const themes: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'light', label: 'روشن', icon: '☀️' },
  { value: 'dark', label: 'تاریک', icon: '🌙' },
  { value: 'system', label: 'سیستم', icon: '🖥️' },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  function cycleTheme() {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const currentIdx = order.indexOf(preference);
    const next = order[(currentIdx + 1) % order.length];
    setPreference(next);
  }

  const current = themes.find((t) => t.value === preference);

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`${current?.label}: ${preference}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] ease-[var(--ease-out)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
    >
      <span className="text-base" role="img" aria-hidden="true">
        {current?.icon}
      </span>
    </button>
  );
}
