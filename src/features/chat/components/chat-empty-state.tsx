'use client';

import Link from 'next/link';
import { BarChart3, TrendingUp, FileText, Palette } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: BarChart3,
    title: 'تحلیل بازار خشکبار',
    description: 'بررسی وضعیت فروش و رقابت در بازار خشکبار',
    href: '/chat/session-1',
  },
  {
    icon: TrendingUp,
    title: 'استراتژی بازاریابی پروشات',
    description: 'طراحی نقشه راه بازاریابی دیجیتال',
    href: '/chat/session-4',
  },
  {
    icon: FileText,
    title: 'گزارش فروش برنج کوروش',
    description: 'تحلیل عملکرد فروش و پیشنهادات بهبود',
    href: '/chat/session-2',
  },
  {
    icon: Palette,
    title: 'برندسازی طلای ناب',
    description: 'طراحی هویت بصری و استراتژی برند',
    href: '/chat/session-3',
  },
];

export function ChatEmptyState() {
  return (
    <div className='flex h-full flex-col items-center justify-center px-4'>
      {/* Logo */}
      <h1
        className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-tight'
        style={{
          fontSize: 'var(--text-heading-2xl)',
          lineHeight: 'var(--leading-heading-2xl)',
        }}
      >
        هات‌هوش
      </h1>

      {/* Subtitle */}
      <p
        className='mt-3 text-[var(--color-text-secondary)]'
        style={{ fontSize: 'var(--text-body-lg)' }}
      >
        چگونه می‌توانم کمکتان کنم؟
      </p>

      {/* Suggestion cards 2x2 grid */}
      <div className='mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2'>
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className='flex items-start gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] p-4 transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-data)]'
            >
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-subtle)]'>
                <Icon className='h-4.5 w-4.5 text-[var(--color-text-secondary)]' />
              </div>
              <div className='min-w-0'>
                <p
                  className='font-[var(--font-weight-medium)] text-[var(--color-text-primary)]'
                  style={{ fontSize: 'var(--text-body-sm)' }}
                >
                  {item.title}
                </p>
                <p
                  className='mt-0.5 text-[var(--color-text-muted)]'
                  style={{ fontSize: 'var(--text-caption-sm)' }}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
