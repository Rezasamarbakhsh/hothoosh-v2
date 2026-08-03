'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, FileText, Palette, Send, Paperclip, Sparkles, Bot, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { MOCK_AGENTS } from '@/features/chat/types/chat.types';
import { useChatUIStore } from '@/features/chat/stores/chat-ui.store';
import { useRouter } from 'next/navigation';

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
  const [value, setValue] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const activeAgentId = useChatUIStore((s) => s.activeAgentId);
  const setActiveAgentId = useChatUIStore((s) => s.actions.setActiveAgentId);
  const activeAgent = MOCK_AGENTS.find((a) => a.id === activeAgentId);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push('/chat/new-session-' + Date.now());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const canSend = value.trim().length > 0;

  return (
    <div className='flex h-full flex-col'>
      {/* Centered content area */}
      <div className='flex flex-1 flex-col items-center justify-center px-4'>
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

      {/* Bottom input — same as ChatSessionClient */}
      <div className='w-full px-6 pb-5 pt-2'>
        <div className='mx-auto max-w-3xl'>
          {/* Agent selector */}
          <div className='mb-2 flex justify-start'>
            <Popover open={agentOpen} onOpenChange={setAgentOpen}>
              <PopoverTrigger asChild>
                <button
                  className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] transition-colors duration-100 hover:border-[var(--color-border-strong)]'
                  style={{ fontSize: 'var(--text-caption-sm)' }}
                >
                  {activeAgentId === 'auto' ? (
                    <Sparkles className='h-3.5 w-3.5' />
                  ) : (
                    <Bot className='h-3.5 w-3.5' />
                  )}
                  <span>{activeAgent?.name ?? 'تشخیص خودکار'}</span>
                  <ChevronDown className='h-3 w-3' />
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-72 p-0' align='start' side='top' sideOffset={8}>
                <Command>
                  <CommandInput placeholder='جستجوی دستیار...' />
                  <CommandList className='max-h-64'>
                    <CommandEmpty>دستیاری یافت نشد</CommandEmpty>
                    {MOCK_AGENTS.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        onSelect={() => {
                          setActiveAgentId(agent.id);
                          setAgentOpen(false);
                        }}
                        className='flex items-center gap-3 px-3 py-2.5'
                      >
                        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]'>
                          {agent.id === 'auto' ? (
                            <Sparkles className='h-4 w-4 text-[var(--color-text-muted)]' />
                          ) : (
                            <Bot className='h-4 w-4 text-[var(--color-text-muted)]' />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='font-[var(--font-weight-medium)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
                            {agent.name}
                          </p>
                          {agent.description && (
                            <p className='text-[var(--color-text-muted)] truncate' style={{ fontSize: 'var(--text-caption-xs)' }}>
                              {agent.description}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit}>
            <div
              className={'flex items-end gap-2 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-[var(--shadow-md)] ' +
                'transition-colors duration-150 focus-within:border-[var(--color-primary-500)]'}
            >
              <button
                type='button'
                className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-secondary)]'
                aria-label='پیوست فایل'
              >
                <Paperclip className='h-5 w-5' />
              </button>

              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder='پیام خود را بنویسید...'
                rows={1}
                dir='auto'
                className={
                  'max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-[var(--color-text-primary)] ' +
                  'placeholder:text-[var(--color-text-muted)] outline-none'
                }
                style={{
                  fontSize: 'var(--text-body-md)',
                  lineHeight: 'var(--leading-body-md)',
                }}
                aria-label='متن پیام'
              />

              <button
                type='submit'
                disabled={!canSend}
                className={
                  'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ' +
                  (canSend
                    ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-600)] shadow-sm'
                    : 'text-[var(--color-text-disabled)] cursor-not-allowed')
                }
                aria-label='ارسال پیام'
              >
                <Send className='h-4 w-4' />
              </button>
            </div>
          </form>

          <p
            className='mt-2 text-center text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            Enter برای ارسال · Shift+Enter برای خط جدید
          </p>
        </div>
      </div>
    </div>
  );
}
