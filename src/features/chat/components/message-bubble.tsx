import React from 'react';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  createdAt?: string;
  agentName?: string;
  isStreaming?: boolean;
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderContent(text: string): React.ReactNode[] {
  return text.split('\n').map((line, lineIdx) => {
    const inlineParts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = inlineParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className='font-[var(--font-weight-semibold)]'>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {rendered}
      </React.Fragment>
    );
  });
}

export function MessageBubble({
  role,
  content,
  createdAt,
  agentName,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className='my-3 flex justify-center'>
        <p
          className='rounded-full bg-[var(--color-surface-raised)] px-4 py-1.5 text-[var(--color-text-muted)]'
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          {content}
        </p>
      </div>
    );
  }

  /* User message: right-aligned bubble */
  if (isUser) {
    return (
      <div className='flex justify-end'>
        <div className='max-w-2xl'>
          <div className='flex items-end gap-2'>
            <div
              className='rounded-2xl rounded-tr-sm bg-[var(--color-primary-500)] px-4 py-3 text-[var(--color-text-inverse)]'
              style={{
                fontSize: 'var(--text-body-md)',
                lineHeight: 'var(--leading-body-lg)',
              }}
            >
              {renderContent(content)}
            </div>
            <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]'>
              <User className='h-3.5 w-3.5' />
            </div>
          </div>
          {createdAt && (
            <p
              className='mt-1 text-end text-[var(--color-text-muted)]'
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {formatTime(createdAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* Assistant message: clean text, no bubble, icon on the start side */
  return (
    <div className='flex items-start gap-3'>
      <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)]'>
        <Bot className='h-4 w-4 text-[var(--color-text-muted)]' />
      </div>
      <div className='min-w-0 flex-1 max-w-2xl'>
        {agentName && (
          <p
            className='mb-1 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]'
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {agentName}
          </p>
        )}
        <div
          className='text-[var(--color-text-primary)]'
          style={{
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--leading-body-lg)',
          }}
        >
          {isStreaming && !content ? <StreamingDots /> : renderContent(content)}
        </div>
        {createdAt && (
          <p
            className='mt-1 text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            {formatTime(createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className='inline-flex items-center gap-1' aria-label='در حال تولید پاسخ'>
      <span className='h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]' />
      <span className='h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]' />
      <span className='h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]' />
    </span>
  );
}
