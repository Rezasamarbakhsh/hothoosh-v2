'use client';

import Link from 'next/link';
import {
  type KnowledgeBase,
  KB_TYPE_LABELS,
  KB_STATUS_LABELS,
  KB_TYPE_COLORS,
  KB_STATUS_COLORS,
} from '../types/knowledge.types';

interface KBCardProps {
  kb: KnowledgeBase;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const units = ['بایت', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

function getStatusIcon(status: KnowledgeBase['processingStatus']): React.ReactNode {
  switch (status) {
    case 'ready':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.03 5.03a.75.75 0 00-1.06-1.06L7 7.94 5.53 6.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z" />
        </svg>
      );
    case 'processing':
      return (
        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-warning-500)]" aria-hidden="true" />
      );
    case 'failed':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm2.53 4.47l-1.06-1.06L8 5.94 6.53 4.47 5.47 5.53 6.94 7l-1.47 1.47 1.06 1.06L8 8.06l1.47 1.47 1.06-1.06L9.06 7l1.47-1.53z" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-text-muted)]" aria-hidden="true">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" />
        </svg>
      );
  }
}

export function KBCard({ kb }: KBCardProps) {
  return (
    <Link
      href={`/knowledge/${kb.id}`}
      className={
        'group glass-panel-elevated flex flex-col rounded-xl p-5 transition-all duration-[var(--duration-200)] ' +
        'hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5'
      }
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="truncate font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
              style={{ fontSize: 'var(--text-body-md)' }}
            >
              {kb.name}
            </h3>
            <span
              className={
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
                KB_STATUS_COLORS[kb.processingStatus]
              }
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {getStatusIcon(kb.processingStatus)}
              {KB_STATUS_LABELS[kb.processingStatus]}
            </span>
          </div>
          <span
            className={
              'mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
              KB_TYPE_COLORS[kb.kbType]
            }
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            {KB_TYPE_LABELS[kb.kbType]}
          </span>
        </div>
      </div>

      {/* Description */}
      {kb.description && (
        <p
          className="mt-3 line-clamp-2 text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          {kb.description}
        </p>
      )}

      {/* Stats footer */}
      <div className="mt-auto pt-4 border-t border-[var(--color-border-default)] mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatItem icon="doc" value={`${kb.documentCount} سند`} />
          <span className="text-[var(--color-border-default)]" aria-hidden="true">|</span>
          <StatItem icon="chunk" value={`${kb.chunkCount.toLocaleString('fa-IR')} قطعه`} />
          {kb.totalSizeBytes > 0 && (
            <>
              <span className="text-[var(--color-border-default)]" aria-hidden="true">|</span>
              <StatItem icon="size" value={formatBytes(kb.totalSizeBytes)} />
            </>
          )}
        </div>
        {kb.boundAgentCount > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-accent)]" aria-hidden="true">
              <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm-1 4.5h2v4H7v-4zm0 5.5h2v1.5H7V11z" />
            </svg>
            <span className="text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              متصل به {kb.boundAgentCount} دستیار هوشمند
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function StatItem({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
      {icon === 'doc' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M4 1.5A1.5 1.5 0 015.5 0h5A1.5 1.5 0 0112 1.5v13a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 014 14.5v-13zM5.5 1.5v13h5v-13h-5z" />
        </svg>
      )}
      {icon === 'chunk' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 2h5v5H2V2zm0 7h5v5H2V9zm7-7h5v5H9V2zm0 7h5v5H9V9z" />
        </svg>
      )}
      {icon === 'size' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v8a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H4z" />
        </svg>
      )}
      {value}
    </span>
  );
}
