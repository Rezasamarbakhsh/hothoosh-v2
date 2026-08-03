'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '@/features/chat/components/message-bubble';
import { ChatInput } from '@/features/chat/components/chat-input';
import { ConversationList } from '@/features/chat/components/conversation-list';
import { useChatUIStore } from '@/features/chat/stores/chat-ui.store';
import {
  MOCK_SESSIONS,
  MOCK_MESSAGES,
  MOCK_AGENTS,
  type ChatMessage,
} from '@/features/chat/types/chat.types';

interface Props {
  chatId: string;
}

export default function ChatSessionClient({ chatId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const isStreaming = useChatUIStore((s) => s.isStreaming);
  const setStreaming = useChatUIStore((s) => s.actions.setStreaming);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = MOCK_SESSIONS[0];
  const agent = MOCK_AGENTS[0];

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text: string) {
    const userMsg: ChatMessage = {
      id: `msg-local-${Date.now()}`,
      sessionId: chatId,
      parentMessageId: null,
      branchIndex: 0,
      role: 'user',
      content: text,
      tokenCount: null,
      modelId: null,
      inputTokens: null,
      outputTokens: null,
      latencyMs: null,
      toolCalls: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStreaming(true);

    /* Simulate AI response */
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-local-ai-${Date.now()}`,
        sessionId: chatId,
        parentMessageId: userMsg.id,
        branchIndex: 0,
        role: 'assistant',
        content: 'این یک پاسخ شبیه‌سازی‌شده است. پیاده‌سازی واقعی پس از اتصال به سرور انجام خواهد شد.',
        tokenCount: 42,
        modelId: 'model-1',
        inputTokens: 120,
        outputTokens: 42,
        latencyMs: 800,
        toolCalls: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreaming(false);
    }, 1500);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation list — desktop only */}
      <div className="hidden w-72 shrink-0 lg:block">
        <ConversationList activeId={chatId} />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex items-center gap-3 border-b border-[var(--color-border-default)] px-4 py-3">
          {/* Mobile back button */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors duration-100 hover:bg-[var(--color-surface-raised)] lg:hidden"
            aria-label="بازگشت به لیست"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          {/* Agent info */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-raised)]"
          >
            <svg
              className="h-4 w-4 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p
              className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {agent.name}
            </p>
            <p
              className="truncate text-[var(--color-text-muted)]"
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {session.title ?? 'گفتگوی جدید'}
            </p>
          </div>
        </header>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          aria-live="polite"
          aria-label="پیام‌های گفتگو"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
                agentName={agent.name}
                isStreaming={
                  isStreaming && msg === messages[messages.length - 1]
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <ChatInput
          onSend={handleSend}
          disabled={false}
          isStreaming={isStreaming}
          placeholder={"پیام خود را بنویسید..."}
        />
      </div>
    </div>
  );
}
