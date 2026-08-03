'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--color-background)]">
      {/* Skip to content — Accessibility (UI-System §12.6) */}
      <a href="#main-content" className="skip-link">
        رفتن به محتوای اصلی
      </a>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full w-64">
            <Sidebar
              collapsed={false}
              onToggle={handleMobileMenu}
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMobileMenuToggle={handleMobileMenu} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
