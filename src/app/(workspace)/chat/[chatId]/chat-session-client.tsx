'use client';

import { useState, useRef, useEffect } from 'react';
import { PanelLeft } from 'lucide-react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface Props {
  chatId: string;
}

export default function ChatSessionClient({ chatId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const isStreaming = useChatUIStore((s) => s.isStreaming);
  const setStreaming = useChatUIStore((s) => s.actions.setStreaming);
  const isListOpen = useChatUIStore((s) => s.isListOpen);
  const setListOpen = useChatUIStore((s) => s.actions.setListOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = MOCK_SESSIONS.find((s) => s.id === chatId) ?? MOCK_SESSIONS[0];
  const agent = MOCK_AGENTS.find((a) => a.id === session.agentId) ?? MOCK_AGENTS[0];

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
    <div className='flex h-full overflow-hidden'>
      {/* Conversation list — desktop only */}
      <div className='hidden lg:block'>
        <ConversationList activeId={chatId} />
      </div>

      {/* Main chat area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Messages area */}
        <div
          className='flex-1 overflow-y-auto px-4 pt-4'
          aria-live='polite'
          aria-label='پیام‌های گفتگو'
        >
          <div className='mx-auto max-w-3xl space-y-6'>
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
          placeholder={'پیام خود را بنویسید...'}
        />
      </div>

      {/* Mobile sidebar toggle — floating button */}
      <button
        onClick={() => setListOpen(true)}
        className='fixed bottom-24 start-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] transition-colors duration-100 hover:bg-[var(--color-surface-data)] lg:hidden'
        aria-label='نمایش لیست گفتگوها'
      >
        <PanelLeft className='h-5 w-5' />
      </button>

      {/* Mobile sheet for conversation list */}
      <Sheet open={isListOpen} onOpenChange={setListOpen}>
        <SheetContent side='right' className='w-72 p-0 bg-[var(--color-background-subtle)]'>
          <SheetHeader className='sr-only'>
            <SheetTitle>لیست گفتگوها</SheetTitle>
          </SheetHeader>
          <ConversationList activeId={chatId} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
