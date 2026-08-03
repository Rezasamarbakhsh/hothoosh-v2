import React from 'react';

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
          <strong key={i} className="font-[var(--font-weight-semibold)]">
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
      <div className="my-3 flex justify-center">
        <p
          className="rounded-full bg-[var(--color-surface-raised)] px-4 py-1.5 text-[var(--color-text-muted)]"
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          {content}
        </p>
      </div>
    );
  }

  return (
    <div className={"flex gap-3 " + (isUser ? "flex-row-reverse" : "")}>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: isUser
            ? 'var(--color-primary-100)'
            : 'var(--color-surface-raised)',
        }}
      >
        {isUser ? (
          <svg className="h-4 w-4 text-[var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        )}
      </div>

      <div className={"max-w-[75%] " + (isUser ? "items-end" : "items-start")}>
        {!isUser && agentName && (
          <p
            className="mb-1 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {agentName}
          </p>
        )}

        <div
          className={
            "rounded-2xl px-4 py-3 " +
            (isUser
              ? "rounded-tr-sm bg-[var(--color-primary-500)] text-[var(--color-text-inverse)]"
              : "rounded-tl-sm bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]")
          }
          style={{
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--leading-body-lg)',
          }}
        >
          {isStreaming && !content ? <StreamingDots /> : renderContent(content)}
        </div>

        {createdAt && (
          <p
            className={"mt-1 text-[var(--color-text-muted)] " + (isUser ? "text-end" : "")}
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
    <span className="inline-flex items-center gap-1" aria-label="در حال تولید پاسخ">
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
