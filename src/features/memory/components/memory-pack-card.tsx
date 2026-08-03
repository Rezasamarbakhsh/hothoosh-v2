'use client';

import Link from 'next/link';
import {
  type MemoryPack,
  MEMORY_TYPE_LABELS,
  MEMORY_STATUS_LABELS,
  MEMORY_SCOPE_LABELS,
  MEMORY_TYPE_COLORS,
  MEMORY_STATUS_COLORS,
  MEMORY_TYPE_ICONS,
} from '../types/memory.types';

interface MemoryPackCardProps {
  pack: MemoryPack;
}

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'همین الان';
  if (diffMin < 60) return `${formatNumber(diffMin)} دقیقه پیش`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${formatNumber(diffHr)} ساعت پیش`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${formatNumber(diffDay)} روز پیش`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${formatNumber(diffMonth)} ماه پیش`;
}

export function MemoryPackCard({ pack }: MemoryPackCardProps) {
  return (
    <Link
      href={`/memory/${pack.id}`}
      className={
        'group glass-panel-elevated flex flex-col rounded-xl p-5 transition-all duration-[var(--duration-200)] ' +
        'hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5'
      }
    >
      {/* Header: Type icon + Name + Badges */}
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2.5'>
            {/* Type icon */}
            <span
              className={'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' + MEMORY_TYPE_COLORS[pack.memoryType]}
              aria-hidden='true'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                <path d={MEMORY_TYPE_ICONS[pack.memoryType].d} />
              </svg>
            </span>
            <h3
              className='truncate font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
              style={{ fontSize: 'var(--text-body-md)' }}
            >
              {pack.name}
            </h3>
          </div>

          {/* Badges row */}
          <div className='mt-2 flex flex-wrap items-center gap-1.5'>
            <span
              className={'inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' + MEMORY_TYPE_COLORS[pack.memoryType]}
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {MEMORY_TYPE_LABELS[pack.memoryType]}
            </span>
            <span
              className={'inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' + MEMORY_STATUS_COLORS[pack.status]}
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {MEMORY_STATUS_LABELS[pack.status]}
            </span>
            <span
              className={'inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' + 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]'}
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {MEMORY_SCOPE_LABELS[pack.scope]}
            </span>
          </div>
        </div>

        {/* Auto-inject indicator */}
        {pack.autoInject && pack.status === 'active' && (
          <span className='shrink-0' title='تزریق خودکار فعال'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='var(--color-success-500)' aria-hidden='true'>
              <path d='M8 1a7 7 0 110 14A7 7 0 018 1zm3.03 5.03a.75.75 0 00-1.06-1.06L7 7.94 5.53 6.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z' />
            </svg>
          </span>
        )}
      </div>

      {/* Description */}
      {pack.description && (
        <p
          className='mt-3 line-clamp-2 text-[var(--color-text-secondary)]'
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          {pack.description}
        </p>
      )}

      {/* Stats footer */}
      <div className='mt-auto pt-4 mt-4 border-t border-[var(--color-border-default)]'>
        <div className='flex flex-wrap items-center gap-3'>
          <StatItem icon='token' value={`${formatNumber(pack.tokenCount)} توکن`} />
          <span className='text-[var(--color-border-default)]' aria-hidden='true'>|</span>
          <StatItem icon='version' value={`${formatNumber(pack.versionCount)} نسخه`} />
          <span className='text-[var(--color-border-default)]' aria-hidden='true'>|</span>
          <StatItem icon='inject' value={`${formatNumber(pack.totalInjections)} تزریق`} />
        </div>

        {/* Bottom row: agents + last injected */}
        <div className='mt-2 flex items-center justify-between gap-2'>
          {pack.boundAgentCount > 0 ? (
            <div className='flex items-center gap-1.5'>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='var(--color-accent)' aria-hidden='true'>
                <path d='M8 1a7 7 0 110 14A7 7 0 018 1zm-1 4.5h2v4H7v-4zm0 5.5h2v1.5H7V11z' />
              </svg>
              <span className='text-[var(--color-accent)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
                متصل به {formatNumber(pack.boundAgentCount)} دستیار هوشمند
              </span>
            </div>
          ) : (
            <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              بدون اتصال
            </span>
          )}
          {pack.lastInjectedAt && (
            <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              آخرین: {relativeTime(pack.lastInjectedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function StatItem({ icon, value }: { icon: string; value: string }) {
  return (
    <span className='flex items-center gap-1.5 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
      {icon === 'token' && (
        <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
          <path d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a5 5 0 110 10A5 5 0 018 3zm-.25 2.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z' />
        </svg>
      )}
      {icon === 'version' && (
        <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
          <path d='M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9zM3.5 3.5v9h9v-9h-9z' />
        </svg>
      )}
      {icon === 'inject' && (
        <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
          <path d='M8 1.5l.75 1.5H13l-2.5 3 1.5 5H4l1.5-5L3 3h4.25L8 1.5z' />
        </svg>
      )}
      {value}
    </span>
  );
}
