'use client';

import { useState, useRef, useCallback, useMemo, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Plus, Search, MessageSquare, Trash2, Sparkles, Bot,
  Send, Paperclip, ChevronDown, PanelLeftClose, PanelLeft,
  BarChart3, TrendingUp, FileText, Palette,
} from 'lucide-react';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '@/components/ui/popover';
import {
  Command, CommandInput, CommandList, CommandItem, CommandEmpty,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatUIStore } from '@/features/chat/stores/chat-ui.store';
import { MOCK_AGENTS, MOCK_MESSAGES, MOCK_SESSIONS } from '@/features/chat/types/chat.types';
import { cn } from '@/lib/utils';

/* - Suggestion cards for empty state - */
const SUGGESTIONS = [
  { icon: BarChart3, title: 'تحلیل بازار خشکبار', desc: 'بررسی وضعیت فروش و رقابت', sessionId: 'session-1' },
  { icon: TrendingUp, title: 'استراتژی بازاریابی پروشات', desc: 'طراحی نقشه راه بازاریابی', sessionId: 'session-4' },
  { icon: FileText, title: 'گزارش فروش برنج کوروش', desc: 'تحلیل عملکرد فروش', sessionId: 'session-2' },
  { icon: Palette, title: 'برندسازی طلای ناب', desc: 'طراحی هویت بصری', sessionId: 'session-3' },
];

/* - Time helpers - */
function getTimeGroup(dateStr: string): string {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d < 1) return 'امروز';
  if (d < 2) return 'دیروز';
  if (d < 7) return 'هفته گذشته';
  return 'بالاتر';
}
const GROUP_ORDER = ['امروز', 'دیروز', 'هفته گذشته', 'بالاتر'];

export default function ChatLayoutClient() {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* - Store - */
  const sessions = useChatUIStore((s) => s.sessions);
  const activeSessionId = useChatUIStore((s) => s.activeSessionId);
  const activeAgentId = useChatUIStore((s) => s.activeAgentId);
  const isStreaming = useChatUIStore((s) => s.isStreaming);
  const actions = useChatUIStore((s) => s.actions);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );
  const activeAgent = MOCK_AGENTS.find((a) => a.id === activeAgentId);

  /* - Messages for active session - */
  const messages = useMemo(() => {
    if (!activeSessionId) return [];
    if (activeSessionId.startsWith('new-')) return [];
    if (activeSessionId === 'session-1') return MOCK_MESSAGES;
    return [];
  }, [activeSessionId]);

  /* - Grouped sessions - */
  const grouped = useMemo(() => {
    const filtered = sessions.filter((s) => {
      if (!search) return true;
      return s.title?.includes(search) || s.agentName.includes(search);
    });
    const g: Record<string, typeof sessions> = {};
    for (const s of filtered) {
      const key = s.lastMessageAt ? getTimeGroup(s.lastMessageAt) : 'بالاتر';
      (g[key] ??= []).push(s);
    }
    return g;
  }, [sessions, search]);

  /* - Handlers - */
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    const id = actions.createSession(text.slice(0, 40));
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleSelectSession(id: string) {
    actions.setActiveSessionId(id);
    router.push(`/chat/${id}`);
  }

  function handleNewChat() {
    actions.setActiveSessionId(null);
    router.push('/chat');
  }

  function handleDeleteSession(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
  }

  function confirmDelete() {
    if (deletingId) {
      actions.deleteSession(deletingId);
      if (activeSessionId === deletingId) handleNewChat();
      setDeletingId(null);
    }
  }

  const canSend = inputValue.trim().length > 0;

  return (
    <div className="flex h-full">

      {/* - Conversation sidebar - */
      <aside
        className={cn(
          'flex flex-col border-e border-[var(--color-border-default)] bg-[var(--color-surface-solid)] transition-all duration-200',
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            <Plus className="h-4 w-4" />
            <span>گفتگوی جدید</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            aria-label="بستن"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو..."
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] py-2 pe-3 ps-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary-500)]"
              style={{ fontSize: 'var(--text-caption-sm)' }}
            />
          </div>
        </div>

        {/* Session list */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-4 pb-4" aria-label="لیست گفتگوها">
            {GROUP_ORDER.map((group) => {
              const items = grouped[group];
              if (!items?.length) return null;
              return (
                <div key={group}>
                  <h3 className="px-2 py-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                    {group}
                  </h3>
                  <ul className="space-y-0.5" role="list">
                    {items.map((session) => (
                      <li key={session.id}>
                        <button
                          onClick={() => handleSelectSession(session.id)}
                          className={cn(
                            'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start transition-colors',
                            session.id === activeSessionId
                              ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-400)]'
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]',
                          )}
                        >
                          <MessageSquare className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                              {session.title || 'بدون عنوان'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--color-text-muted)] opacity-0 transition-all group-hover:flex group-hover:opacity-100 hover:bg-[var(--color-error-500)]/10 hover:text-[var(--color-error-500)]"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {sessions.length === 0 && (
              <p className="px-3 py-8 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                گفتگویی یافت نشد
              </p>
            )}
          </nav>
        </ScrollArea>

        {/* Bottom: Agent pills */}
        <div className="border-t border-[var(--color-border-default)] px-3 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>دستیار پیش‌فرض</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => actions.setActiveAgentId(agent.id)}
                className={cn(
                  'rounded-full px-2.5 py-1 transition-colors',
                  activeAgentId === agent.id
                    ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]',
                )}
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {agent.id === 'auto' ? 'خودکار' : agent.name.replace('PTA ', '')}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* - Main chat area - */
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-12 items-center justify-between border-b border-[var(--color-border-default)] px-4">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
                aria-label="باز کردن تاریخچه"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            <span className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
              {activeSession?.title ?? 'هات‌هوش'}
            </span>
          </div>

          {/* PTA selector */}
          <Popover open={agentOpen} onOpenChange={setAgentOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary-500)]"
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                {activeAgentId === 'auto' ? <Sparkles className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                <span>{activeAgent?.name ?? 'تشخیص خودکار'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end" side="bottom" sideOffset={8}>
              <Command>
                <CommandInput placeholder="جستجوی دستیار..." />
                <CommandList className="max-h-64">
                  <CommandEmpty>دستیاری یافت نشد</CommandEmpty>
                  {MOCK_AGENTS.map((agent) => (
                    <CommandItem
                      key={agent.id}
                      onSelect={() => { actions.setActiveAgentId(agent.id); setAgentOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
                        {agent.id === 'auto' ? <Sparkles className="h-4 w-4 text-[var(--color-text-muted)]" /> : <Bot className="h-4 w-4 text-[var(--color-text-muted)]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{agent.name}</p>
                        {agent.description && (
                          <p className="truncate text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>{agent.description}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Messages or Empty state */}
        <div className="flex-1 overflow-y-auto">
          {activeSessionId && messages.length > 0 ? (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  {/* Avatar */}
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-[var(--font-weight-semibold)]',
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary-500)]/15 text-[var(--color-primary-400)]'
                      : 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]',
                  )}>
                    {msg.role === 'user' ? 'ش' : 'AI'}
                  </div>
                  {/* Content */}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]',
                  )} style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--leading-body-md)' }}>
                    {msg.content.split('\n').map((line, i) => {
                      if (!line) return <br key={i} />;
                      // Simple markdown bold
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} className="font-[var(--font-weight-semibold)]">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-primary-400)]" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-primary-400)]" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-primary-400)]" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>در حال پاسخ‌دهی...</span>
                </div>
              )}
            </div>
          ) : (
            /* - Empty state - */
            <div className="flex h-full flex-col items-center justify-center px-4">
              <h1 className="font-[var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-tight" style={{ fontSize: 'var(--text-heading-2xl)' }}>
                هات‌هوش
              </h1>
              <p className="mt-3 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-lg)' }}>
                چگونه می‌توانم کمکتان کنم؟
              </p>
              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSelectSession(item.sessionId)}
                      className="flex items-start gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] p-4 text-start transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-data)]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-subtle)]">
                        <Icon className="h-4.5 w-4.5 text-[var(--color-text-secondary)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>{item.title}</p>
                        <p className="mt-0.5 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* - Bottom input with animated AI border - */}
        <div className="w-full px-6 pb-5 pt-2">
          <div className="mx-auto max-w-3xl">
            {/* Agent pill */}
            <div className="mb-2 flex justify-start">
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                {activeAgentId === 'auto' ? <Sparkles className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                <span>{activeAgent?.name ?? 'تشخیص خودکار'}</span>
              </span>
            </div>

            {/* Input with animated border */}
            <div className="relative rounded-2xl p-[2px] ai-border">
              <form onSubmit={handleSubmit}>
                <div className="flex items-end gap-2 rounded-[14px] border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] px-4 py-3">
                  <button
                    type="button"
                    className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
                    aria-label="پیوست فایل"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); adjustHeight(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="پیام خود را بنویسید..."
                    rows={1}
                    dir="auto"
                    className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
                    style={{ fontSize: 'var(--text-body-md)', lineHeight: 'var(--leading-body-md)' }}
                    aria-label="متن پیام"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className={cn(
                      'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
                      canSend
                        ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-600)] shadow-sm'
                        : 'text-[var(--color-text-disabled)] cursor-not-allowed',
                    )}
                    aria-label="ارسال"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-2 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
              Enter برای ارسال · Shift+Enter برای خط جدید
            </p>
          </div>
        </div>
      </div>

      {/* - Delete confirmation dialog - */
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeletingId(null)}>
          <div className="mx-4 w-full max-w-sm rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-solid)] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>حذف گفتگو</h3>
            <p className="mt-2 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>آیا از حذف این گفتگو مطمئن هستید؟</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-[var(--color-error-500)] px-4 py-2 font-[var(--font-weight-medium)] text-white transition-colors hover:bg-[var(--color-error-600)]"
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
