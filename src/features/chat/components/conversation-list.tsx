'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  MOCK_SESSIONS,
  MOCK_AGENTS,
  type ChatSession,
} from '@/features/chat/types/chat.types';
import { useChatUIStore } from '@/features/chat/stores/chat-ui.store';

interface ConversationListProps {
  activeId?: string;
}

function getTimeGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffDay < 1) return 'امروز';
  if (diffDay < 2) return 'دیروز';
  if (diffDay < 7) return 'هفته گذشته';
  return 'ماه گذشته';
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return 'الان';
  if (diffMin < 60) return `${diffMin} دقیقه`;
  if (diffHour < 24) return `${diffHour} ساعت`;
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffDay < 7) return `${diffDay} روز`;
  return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
}

const TIME_GROUP_ORDER = ['امروز', 'دیروز', 'هفته گذشته', 'ماه گذشته'];

export function ConversationList({ activeId }: ConversationListProps) {
  const [search, setSearch] = useState('');
  const activeAgentId = useChatUIStore((s) => s.activeAgentId);
  const setActiveAgentId = useChatUIStore((s) => s.actions.setActiveAgentId);

  const filtered = useMemo(() => {
    const sessions = MOCK_SESSIONS.filter((s) => {
      if (s.status === 'deleted') return false;
      if (!search) return true;
      return (
        s.title?.includes(search) ||
        s.agentName.includes(search) ||
        s.lastMessagePreview?.includes(search)
      );
    });
    return sessions;
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, ChatSession[]> = {};
    for (const session of filtered) {
      if (!session.lastMessageAt) continue;
      const group = getTimeGroup(session.lastMessageAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(session);
    }
    return groups;
  }, [filtered]);

  const activeAgent = MOCK_AGENTS.find((a) => a.id === activeAgentId);

  return (
    <aside className='flex h-full w-72 shrink-0 flex-col bg-[var(--color-background-subtle)] border-e border-[var(--color-border-default)]'>
      {/* Top: Logo + New Chat */}
      <div className='flex items-center justify-between px-3 py-3'>
        <span
          className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          هات‌هوش
        </span>
        <Link
          href='/chat'
          className='flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'
          aria-label='گفتگوی جدید'
        >
          <Plus className='h-4 w-4' />
        </Link>
      </div>

      {/* Search */}
      <div className='px-3 pb-2'>
        <div className='relative'>
          <Search className='absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='جستجو...'
            className='w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] py-2 pe-3 ps-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors duration-150 focus:border-[var(--color-primary-500)]'
            style={{ fontSize: 'var(--text-caption-sm)' }}
          />
        </div>
      </div>

      {/* Session list grouped by time */}
      <ScrollArea className='flex-1 px-2'>
        <nav className='space-y-4 pb-4' aria-label='لیست گفتگوها'>
          {TIME_GROUP_ORDER.map((group) => {
            const sessions = grouped[group];
            if (!sessions || sessions.length === 0) return null;
            return (
              <div key={group}>
                <h3
                  className='px-2 py-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-muted)]'
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {group}
                </h3>
                <ul className='space-y-0.5' role='list'>
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <Link
                        href={`/chat/${session.id}`}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-100 ` +
                          (session.id === activeId
                            ? 'bg-[var(--color-primary-100)]/10 text-[var(--color-text-primary)]'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]')}
                        aria-current={session.id === activeId ? 'page' : undefined}
                      >
                        <MessageSquare className='h-4 w-4 shrink-0 text-[var(--color-text-muted)]' />
                        <div className='min-w-0 flex-1'>
                          <p
                            className='truncate font-[var(--font-weight-medium)]'
                            style={{ fontSize: 'var(--text-caption-sm)' }}
                          >
                            {session.title || 'بدون عنوان'}
                          </p>
                          <div className='mt-0.5 flex items-center gap-2'>
                            <span
                              className='text-[var(--color-text-muted)]'
                              style={{ fontSize: 'var(--text-caption-xs)' }}
                            >
                              {session.agentName}
                            </span>
                            <span className='text-[var(--color-text-disabled)]'>·</span>
                            <span
                              className='text-[var(--color-text-muted)]'
                              style={{ fontSize: 'var(--text-caption-xs)' }}
                            >
                              {session.lastMessageAt && formatRelativeTime(session.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className='flex flex-col items-center justify-center py-12'>
              <p
                className='text-[var(--color-text-muted)]'
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                گفتگویی یافت نشد
              </p>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Bottom: Active Agent Selector Pills */}
      <div className='border-t border-[var(--color-border-default)] px-3 py-3'>
        <div className='flex items-center gap-1.5 mb-2'>
          <Sparkles className='h-3.5 w-3.5 text-[var(--color-text-muted)]' />
          <span
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            دستیار پیش‌فرض
          </span>
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {MOCK_AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgentId(agent.id)}
              className={`rounded-full px-2.5 py-1 transition-colors duration-100 ` +
                (activeAgentId === agent.id
                  ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-secondary)]')}
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {agent.id === 'auto' ? 'خودکار' : agent.name.replace('PTA ', '')}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
