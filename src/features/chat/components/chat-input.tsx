'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type FormEvent } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-4"
    >
      <div
        className={
          'mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] px-3 py-2 ' +
          'transition-colors duration-150 focus-within:border-[var(--color-primary-500)]'
        }
      >
        {/* Attachment button placeholder */}
        <button
          type="button"
          className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-secondary)]"
          aria-label="پیوست فایل"
          tabIndex={0}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
            />
          </svg>
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
          dir="auto"
          className={
            'max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent text-[var(--color-text-primary)] ' +
            'placeholder:text-[var(--color-text-muted)] outline-none'
          }
          style={{
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--leading-body-md)',
          }}
          aria-label="متن پیام"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className={
            'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ' +
            (canSend
              ? 'bg-[var(--color-primary-500)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-600)]'
              : 'text-[var(--color-text-disabled)] cursor-not-allowed')
          }
          aria-label="ارسال پیام"
        >
          {isStreaming ? (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Keyboard hint */}
      <p
        className="mt-2 text-center text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-xs)' }}
      >
        Enter برای ارسال · Shift+Enter برای خط جدید
      </p>
    </form>
  );
}
