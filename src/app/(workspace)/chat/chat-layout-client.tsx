'use client';

import { useState, useRef, useCallback, useMemo, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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
import { MOCK_AGENTS, MOCK_MESSAGES } from '@/features/chat/types/chat.types';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  { icon: BarChart3, title: '\u062a\u062d\u0644\u06cc\u0644 \u0628\u0627\u0632\u0627\u0631 \u062e\u0634\u06a9\u0628\u0627\u0631', desc: '\u0628\u0631\u0631\u0633\u06cc \u0648\u0636\u0639\u06cc\u062a \u0641\u0631\u0648\u0634 \u0648 \u0631\u0642\u0627\u0628\u062a', sessionId: 'session-1' },
  { icon: TrendingUp, title: '\u0627\u0633\u062a\u0631\u0627\u062a\u0698\u06cc \u0628\u0627\u0632\u0627\u0631\u06cc\u0627\u0628\u06cc \u067e\u0631\u0648\u0634\u0627\u062a', desc: '\u0637\u0631\u0627\u062d\u06cc \u0646\u0642\u0634\u0647 \u0631\u0627\u0647 \u0628\u0627\u0632\u0627\u0631\u06cc\u0627\u0628\u06cc', sessionId: 'session-4' },
  { icon: FileText, title: '\u06af\u0632\u0627\u0631\u0634 \u0641\u0631\u0648\u0634 \u0628\u0631\u0646\u062c \u06a9\u0648\u0631\u0648\u0634', desc: '\u062a\u062d\u0644\u06cc\u0644 \u0639\u0645\u0644\u06a9\u0631\u062f \u0641\u0631\u0648\u0634', sessionId: 'session-2' },
  { icon: Palette, title: '\u0628\u0631\u0646\u062f\u0633\u0627\u0632\u06cc \u0637\u0644\u0627\u06cc \u0646\u0627\u0628', desc: '\u0637\u0631\u0627\u062d\u06cc \u0647\u0648\u06cc\u062a \u0628\u0635\u0631\u06cc', sessionId: 'session-3' },
];

function getTimeGroup(dateStr: string): string {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d < 1) return '\u0627\u0645\u0631\u0648\u0632';
  if (d < 2) return '\u062f\u06cc\u0631\u0648\u0632';
  if (d < 7) return '\u0647\u0641\u062a\u0647 \u06af\u0630\u0634\u062a\u0647';
  return '\u0628\u0627\u0644\u0627\u062a\u0631';
}
const GROUP_ORDER = ['\u0627\u0645\u0631\u0648\u0632', '\u062f\u06cc\u0631\u0648\u0632', '\u0647\u0641\u062a\u0647 \u06af\u0630\u0634\u062a\u0647', '\u0628\u0627\u0644\u0627\u062a\u0631'];

export default function ChatLayoutClient() {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

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

  const messages = useMemo(() => {
    if (!activeSessionId) return [];
    if (activeSessionId.startsWith('new-')) return [];
    if (activeSessionId === 'session-1') return MOCK_MESSAGES;
    return [];
  }, [activeSessionId]);

  const grouped = useMemo(() => {
    const filtered = sessions.filter((s) => {
      if (!search) return true;
      return s.title?.includes(search) || s.agentName.includes(search);
    });
    const g: Record<string, typeof sessions> = {};
    for (const s of filtered) {
      const key = s.lastMessageAt ? getTimeGroup(s.lastMessageAt) : '\u0628\u0627\u0644\u0627\u062a\u0631';
      (g[key] ??= []).push(s);
    }
    return g;
  }, [sessions, search]);

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
    actions.createSession(text.slice(0, 40));
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
      <aside
        className={cn(
          'flex flex-col border-e border-[var(--color-border-default)] bg-[var(--color-surface-solid)] transition-all duration-200',
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden',
        )}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            <Plus className="h-4 w-4" />
            <span>\u06af\u0641\u062a\u06af\u0648\u06cc \u062c\u062f\u06cc\u062f</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
            aria-label="close"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="\u062c\u0633\u062a\u062c\u0648..."
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] py-2 pe-3 ps-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary-500)]"
              style={{ fontSize: 'var(--text-caption-sm)' }}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-4 pb-4" aria-label="conversations">
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
                              {session.title || '\u0628\u062f\u0648\u0646 \u0639\u0646\u0648\u0627\u0646'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--color-text-muted)] opacity-0 transition-all group-hover:flex group-hover:opacity-100 hover:bg-[var(--color-error-500)]/10 hover:text-[var(--color-error-500)]"
                            aria-label="delete"
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
                \u06af\u0641\u062a\u06af\u0648\u06cc \u06cc\u0627\u0641\u062a \u0646\u0634\u062f
              </p>
            )}
          </nav>
        </ScrollArea>

        <div className="border-t border-[var(--color-border-default)] px-3 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>\u062f\u0633\u062a\u06cc\u0627\u0631 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636</span>
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
                {agent.id === 'auto' ? '\u062e\u0648\u062f\u06a9\u0627\u0631' : agent.name.replace('PTA ', '')}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-12 items-center gap-2 border-b border-[var(--color-border-default)] px-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
              aria-label="open sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <span className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            {activeSession?.title ?? '\u0647\u0627\u062a\u200c\u0647\u0648\u0634'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeSessionId && messages.length > 0 ? (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-[var(--font-weight-semibold)]',
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary-500)]/15 text-[var(--color-primary-400)]'
                      : 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]',
                  )}>
                    {msg.role === 'user' ? '\u0634' : 'AI'}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      msg.role === 'user'
                        ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-text-primary)]'
                        : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]',
                    )}
                    style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--leading-body-md)' }}
                  >
                    {msg.content.split('\n').map((line, i) => {
                      if (!line) return <br key={i} />;
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
                  <span>\u062f\u0631 \u062d\u0627\u0644 \u067e\u0627\u0633\u062e\u200c\u062f\u0647\u06cc...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4">
              <h1 className="font-[var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-tight" style={{ fontSize: 'var(--text-heading-2xl)' }}>
                \u0647\u0627\u062a\u200c\u0647\u0648\u0634
              </h1>
              <p className="mt-3 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-lg)' }}>
                \u0686\u06af\u0648\u0646\u0647 \u0645\u06cc\u200c\u062a\u0648\u0627\u0646\u0645 \u06a9\u0645\u06a9\u062a\u0627\u0646 \u06a9\u0646\u0645\u061f
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

        <div className="w-full px-6 pb-5 pt-2">
          <div className="mx-auto max-w-3xl">
            <Popover open={agentOpen} onOpenChange={setAgentOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="mb-2 flex items-center gap-1.5 rounded-full px-3 py-1 border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary-500)] hover:text-[var(--color-text-secondary)]"
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {activeAgentId === 'auto' ? <Sparkles className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  <span>{activeAgent?.name ?? '\u062a\u0634\u062e\u06cc\u0635 \u062e\u0648\u062f\u06a9\u0627\u0631'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start" side="top" sideOffset={8}>
                <Command>
                  <CommandInput placeholder="\u062c\u0633\u062a\u062c\u0648\u06cc \u062f\u0633\u062a\u06cc\u0627\u0631..." />
                  <CommandList className="max-h-64">
                    <CommandEmpty>\u062f\u0633\u062a\u06cc\u0627\u0631\u06cc \u06cc\u0627\u0641\u062a \u0646\u0634\u062f</CommandEmpty>
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

            <div className="relative rounded-2xl p-[2px] ai-border">
              <form onSubmit={handleSubmit}>
                <div className="flex items-end gap-2 rounded-[14px] border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] px-4 py-3">
                  <button
                    type="button"
                    className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)]"
                    aria-label="attach"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); adjustHeight(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="\u067e\u06cc\u0627\u0645 \u062e\u0648\u062f \u0631\u0627 \u0628\u0646\u0648\u06cc\u0633\u06cc\u062f..."
                    rows={1}
                    dir="auto"
                    className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
                    style={{ fontSize: 'var(--text-body-md)', lineHeight: 'var(--leading-body-md)' }}
                    aria-label="message"
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
                    aria-label="send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-2 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
              Enter \u0628\u0631\u0627\u06cc \u0627\u0631\u0633\u0627\u0644 · Shift+Enter \u0628\u0631\u0627\u06cc \u062e\u0637 \u062c\u062f\u06cc\u062f
            </p>
          </div>
        </div>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeletingId(null)}>
          <div className="mx-4 w-full max-w-sm rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-solid)] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>\u062d\u0630\u0641 \u06af\u0641\u062a\u06af\u0648</h3>
            <p className="mt-2 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>\u0622\u06cc\u0627 \u0627\u0632 \u062d\u0630\u0641 \u0627\u06cc\u0646 \u06af\u0641\u062a\u06af\u0648 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062a\u06cc\u062f\u061f</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-subtle)]"
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                \u0627\u0646\u0635\u0631\u0627\u0641
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-[var(--color-error-500)] px-4 py-2 font-[var(--font-weight-medium)] text-white transition-colors hover:bg-[var(--color-error-600)]"
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                \u062d\u0630\u0641
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
