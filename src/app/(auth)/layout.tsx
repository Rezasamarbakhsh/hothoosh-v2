import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ورود — هات‌هوش',
  description: 'به هات‌هوش وارد شوید',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-background)] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1
            className="text-[var(--color-text-primary)]"
            style={{
              fontSize: 'var(--text-heading-xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--leading-heading-xl)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            هات‌هوش
          </h1>
          <p
            className="mt-2 text-[var(--color-text-secondary)]"
            style={{
              fontSize: 'var(--text-body-sm)',
              lineHeight: 'var(--leading-body-sm)',
            }}
          >
            فضای کاری هوش مصنوعی سازمانی
          </p>
        </div>

        {/* Auth card — Glass Morphism */}
        <div className="glass-panel-elevated rounded-xl p-6 sm:p-8">
          {children}
        </div>

        {/* Theme toggle at bottom */}
        <div className="mt-6 flex justify-center">
          <ThemeToggleLink />
        </div>
      </div>
    </div>
  );
}

/** Simple text link for theme toggle (no icon dependency in auth layout) */
function ThemeToggleLink() {
  return (
    <p
      className="text-[var(--color-text-muted)]"
      style={{ fontSize: 'var(--text-caption-sm)' }}
    >
      {/* Theme toggle will be added as a client component when auth is wired up */}
    </p>
  );
}
