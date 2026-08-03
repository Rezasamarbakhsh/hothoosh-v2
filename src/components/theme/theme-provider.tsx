'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (theme: ThemePreference) => void;
}

const STORAGE_KEY = 'hothoosh-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === 'system') return getSystemTheme();
  return pref;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolved);
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? 'dark';
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(
    subscribeToStorage,
    readStoredPreference,
    () => 'dark' as ThemePreference,
  );

  const resolved = resolveTheme(preference);

  /* Apply theme to DOM whenever it changes */
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  /* Listen for system theme changes when preference is 'system' */
  useEffect(() => {
    if (preference !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyTheme(getSystemTheme());
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [preference]);

  const setPreference = useCallback((theme: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>');
  }
  return ctx;
}
