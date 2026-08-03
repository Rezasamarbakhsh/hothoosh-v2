'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MOCK_SESSIONS,
  type ChatSession,
} from '@/features/chat/types/chat.types';

interface ConversationListProps {
  activeId?: string;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'همین الان';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHour < 24) return `${diffHour} ساعت پیش`;
  if (diffDay < 7) return `${diffDay} روز پیش`;
  return date.toLocaleDateString('fa-IR');
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

export function ConversationList({ activeId }: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = MOCK_SESSIONS.filter((s) => {
    if (s.status === 'deleted') return false;
    if (!search) return true;
    return (
      s.title?.includes(search) ||
      s.agentName.includes(search) ||
      s.lastMessagePreview?.includes(search)
    );
  });

  const activeSessions = filtered.filter((s) => s.status === 'active');
  const archivedSessions = filtered.filter((s) => s.status === 'archived');

  return (
    <aside className="flex h-full flex-col border-e border-[var(--color-border-default)] bg-[var(--color-surface-base)]">
      {/* Header */}
      <div className="p-3">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-500)] px-4 py-2.5 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          گفتگوی جدید
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg
            className="absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در گفتگوها..."
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] py-2 pe-3 ps-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors duration-150 focus:border-[var(--color-primary-500)]"
            style={{ fontSize: 'var(--text-body-sm)' }}
          />
        </div>
      </div>

      {/* Session list */}
      <nav
        className="flex-1 overflow-y-auto px-2"
        aria-label="لیست گفتگوها"
      >
        {activeSessions.length === 0 && archivedSessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p
              className="text-[var(--color-text-muted)]"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              گفتگویی یافت نشد
            </p>
          </div>
        )}

        {activeSessions.length > 0 && (
          <ConversationGroup
            label="فعال"
            sessions={activeSessions}
            activeId={activeId}
          />
        )}

        {archivedSessions.length > 0 && (
          <ConversationGroup
            label="بایگانی‌شده"
            sessions={archivedSessions}
            activeId={activeId}
          />
        )}
      </nav>
    </aside>
  );
}

function ConversationGroup({
  label,
  sessions,
  activeId,
}: {
  label: string;
  sessions: ChatSession[];
  activeId?: string;
}) {
  return (
    <div className="mb-2">
      <h3
        className="px-2 py-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-sm)' }}
      >
        {label}
      </h3>
      <ul className="space-y-0.5" role="list">
        {sessions.map((session) => (
          <li key={session.id}>
            <Link
              href={`/chat/${session.id}`}
              className={`block rounded-lg px-3 py-2.5 transition-colors duration-100 ` +
                (session.id === activeId
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]')}
              aria-current={session.id === activeId ? 'page' : undefined}
            >
              <p
                className="truncate font-[var(--font-weight-medium)]"
                style={{ fontSize: 'var(--text-body-sm)' }}
              >
                {session.title || 'گفتگوی بدون عنوان'}
              </p>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p
                  className="truncate text-[var(--color-text-muted)]"
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {truncate(session.lastMessagePreview ?? '', 40)}
                </p>
                {session.lastMessageAt && (
                  <span
                    className="shrink-0 text-[var(--color-text-muted)]"
                    style={{ fontSize: 'var(--text-caption-xs)' }}
                  >
                    {formatRelativeDate(session.lastMessageAt)}
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-[var(--color-text-muted)]"
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {session.agentName} · {session.messageCount} پیام
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
