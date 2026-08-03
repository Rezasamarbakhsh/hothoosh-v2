'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type FormEvent } from 'react';
import { Send, Paperclip, ChevronDown, Sparkles, Bot } from 'lucide-react';
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
import {
  MOCK_AGENTS,
} from '@/features/chat/types/chat.types';
import { useChatUIStore } from '@/features/chat/stores/chat-ui.store';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  isStreaming = false,
  placeholder = 'پیام خود را بنویسید...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [agentOpen, setAgentOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeAgentId = useChatUIStore((s) => s.activeAgentId);
  const setActiveAgentId = useChatUIStore((s) => s.actions.setActiveAgentId);

  const activeAgent = MOCK_AGENTS.find((a) => a.id === activeAgentId);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxH = 200;
    el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const canSend = value.trim().length > 0 && !disabled && !isStreaming;

  return (
    <div className='w-full px-6 pb-5 pt-2'>
      <div className='mx-auto max-w-3xl'>
        {/* Agent selector above input */}
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
            <PopoverContent
              className='w-72 p-0'
              align='start'
              side='top'
              sideOffset={8}
            >
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

        {/* Input area */}
        <form onSubmit={handleSubmit}>
          <div
            className={'flex items-end gap-2 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-[var(--shadow-md)] ' +
              'transition-colors duration-150 focus-within:border-[var(--color-primary-500)]'}
          >
            {/* Attachment button */}
            <button
              type='button'
              className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-secondary)]'
              aria-label='پیوست فایل'
            >
              <Paperclip className='h-5 w-5' />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
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

            {/* Send button */}
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
              {isStreaming ? (
                <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24' aria-hidden='true'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                </svg>
              ) : (
                <Send className='h-4 w-4' />
              )}
            </button>
          </div>
        </form>

        {/* Hint */}
        <p
          className='mt-2 text-center text-[var(--color-text-muted)]'
          style={{ fontSize: 'var(--text-caption-xs)' }}
        >
          Enter برای ارسال · Shift+Enter برای خط جدید
        </p>
      </div>
    </div>
  );
}
