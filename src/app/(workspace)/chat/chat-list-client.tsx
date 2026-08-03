'use client';

import Link from 'next/link';
import {
  MOCK_SESSIONS,
  MOCK_AGENTS,
} from '@/features/chat/types/chat.types';

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

export default function ChatListClient() {
  const activeSessions = MOCK_SESSIONS.filter((s) => s.status === 'active');
  const archivedSessions = MOCK_SESSIONS.filter((s) => s.status === 'archived');

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header with new chat action */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[var(--color-text-primary)]"
            style={{
              fontSize: 'var(--text-heading-xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--leading-heading-xl)',
            }}
          >
            گفتگوهای من
          </h1>
          <p
            className="mt-1 text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            {MOCK_SESSIONS.filter((s) => s.status === 'active').length} گفتگوی فعال
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary-500)] px-4 py-2.5 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
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

      {/* Active sessions */}
      <section>
        <SessionGroup
          label="فعال"
          sessions={activeSessions}
          formatDate={formatRelativeDate}
        />
      </section>

      {/* Archived sessions */}
      {archivedSessions.length > 0 && (
        <section>
          <SessionGroup
            label="بایگانی‌شده"
            sessions={archivedSessions}
            formatDate={formatRelativeDate}
          />
        </section>
      )}
    </div>
  );
}

function SessionGroup({
  label,
  sessions,
  formatDate,
}: {
  label: string;
  sessions: typeof MOCK_SESSIONS;
  formatDate: (d: string) => string;
}) {
  if (sessions.length === 0) return null;

  return (
    <>
      <h2
        className="font-[var(--font-weight-medium)] text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-sm)' }}
      >
        {label}
      </h2>
      <div className="space-y-2">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/chat/${session.id}`}
            className="glass-panel-elevated block rounded-xl p-4 transition-colors duration-100 hover:border-[var(--color-primary-200)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]"
                  style={{ fontSize: 'var(--text-body-md)' }}
                >
                  {session.title || 'گفتگوی بدون عنوان'}
                </h3>
                {session.lastMessagePreview && (
                  <p
                    className="mt-1 truncate text-[var(--color-text-secondary)]"
                    style={{ fontSize: 'var(--text-body-sm)' }}
                  >
                    {session.lastMessagePreview}
                  </p>
                )}
                <p
                  className="mt-2 text-[var(--color-text-muted)]"
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {session.agentName} · {session.messageCount} پیام
                </p>
              </div>
              {session.lastMessageAt && (
                <span
                  className="shrink-0 text-[var(--color-text-muted)]"
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {formatDate(session.lastMessageAt)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
