import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SessionProvider } from '@/components/auth/session-provider';

const vazirmatn = localFont({
  src: '../../public/fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'هات‌هوش — فضای کاری هوش مصنوعی سازمانی',
  description:
    'هات‌هوش یک فضای کاری هوش مصنوعی سازمانی فارسی‌اول با قابلیت‌های گفتگو، پایگاه دانش و حافظه هوشمند.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/glass.css" />
      </head>
      <body className={`${vazirmatn.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
