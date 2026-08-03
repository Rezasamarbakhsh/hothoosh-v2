'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  type AgentDetail as AgentDetailType,
  type AgentKnowledgeBinding,
  type AgentToolBinding,
  type AgentMemoryBinding,
  AGENT_TYPE_LABELS,
  AGENT_STATUS_LABELS,
  AGENT_TYPE_COLORS,
  AGENT_STATUS_COLORS,
} from '../types/agent.types';

interface AgentDetailProps {
  agent: AgentDetailType;
}

type TabId = 'config' | 'knowledge' | 'tools' | 'memory' | 'test';

const TABS: { id: TabId; label: string }[] = [
  { id: 'config', label: 'پیکربندی' },
  { id: 'knowledge', label: 'پایگاه دانش' },
  { id: 'tools', label: 'ابزارها' },
  { id: 'memory', label: 'حافظه' },
  { id: 'test', label: 'تست کنسول' },
];

// --- Type icon helper ---
function getTypeIcon(type: AgentDetailType['agentType']): string {
  const icons: Record<string, string> = {
    chat: '\u{1F4AC}',
    rag: '\u{1F4DA}',
    tool_use: '\u{1F527}',
    autonomous: '\u{1F916}',
    workflow: '\u{1F504}',
  };
  return icons[type] || '\u{1F916}';
}

// --- Test Console (chat-like panel) ---
interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

function TestConsole({ agentName }: { agentName: string }) {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: TestMessage = { id: `user-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const streamId = `asst-${Date.now()}`;
    setMessages((prev) => [...prev, { id: streamId, role: 'assistant', content: '', isStreaming: true }]);

    setTimeout(() => {
      const responses = [
        `این یک پاسخ آزمایشی از ${agentName} است. این دستیار هوشمند هنوز در حالت پیش‌نویس است و پاسخ‌های واقعی پس از راه‌اندازی ارائه خواهد شد.`,
        `سلام! من ${agentName} هستم. سیستم در حال آماده‌سازی است.`,
        `در حال پردازش درخواست شما هستم... (حالت آزمایشی)`,
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) =>
        prev.map((m) => (m.id === streamId ? { ...m, content: response, isStreaming: false } : m)),
      );
      setIsStreaming(false);
    }, 1500);
  }, [input, isStreaming, agentName]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-solid)]">
      {/* Console header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] px-4 py-3">
        <span
          className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning-500)]"
          aria-hidden="true"
        />
        <span className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          کنسول تست — {agentName}
        </span>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '300px' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-[var(--color-text-muted)]" aria-hidden="true">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M14 20h12M20 14v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
              پیامی ارسال کنید تا عملکرد دستیار هوشمند را آزمایش کنید
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              'flex ' +
              (msg.role === 'user' ? 'justify-end' : 'justify-start')
            }
          >
            <div
              className={
                'max-w-[85%] rounded-xl px-4 py-2.5 ' +
                (msg.role === 'user'
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]')
              }
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {msg.isStreaming ? (
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: '0ms' }} />
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: '150ms' }} />
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-[var(--color-border-default)] p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="پیام آزمایشی بنویسید..."
            rows={1}
            dir="auto"
            disabled={isStreaming}
            className={
              'flex-1 resize-none rounded-lg border border-[var(--color-border-default)] ' +
              'bg-[var(--color-surface-subtle)] px-3 py-2 text-[var(--color-text-primary)] ' +
              'placeholder:text-[var(--color-text-muted)] ' +
              'focus:border-[var(--color-accent)] focus:outline-none ' +
              'disabled:opacity-50'
            }
            style={{ fontSize: 'var(--text-body-sm)', maxHeight: '120px' }}
            aria-label="پیام آزمایشی"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className={
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--duration-150)] ' +
              (input.trim() && !isStreaming
                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:opacity-90'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')
            }
            aria-label="ارسال پیام آزمایشی"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 9h10m0 0L9 5m4 4L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Tab content components ---

function ConfigTab({ agent }: { agent: AgentDetailType }) {
  return (
    <div className="space-y-6">
      {/* Agent info */}
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          اطلاعات پایه
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="نام دستیار" value={agent.name} />
          <FieldRow label="نوع" value={AGENT_TYPE_LABELS[agent.agentType]} />
          <FieldRow label="وضعیت" value={AGENT_STATUS_LABELS[agent.status]} />
          <FieldRow label="مدل" value={agent.modelName} />
          <FieldRow label="حداکثر توکن خروجی" value={String(agent.maxTokens)} />
          {agent.rateLimitPerUser && (
            <FieldRow label="محدودیت درخواست (هر کاربر)" value={`${agent.rateLimitPerUser}/ساعت`} />
          )}
          {agent.rateLimitPerWorkspace && (
            <FieldRow label="محدودیت درخواست (فضای کار)" value={`${agent.rateLimitPerWorkspace}/ساعت`} />
          )}
        </div>
      </div>

      {/* Sampling parameters */}
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          پارامترهای نمونه‌برداری
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ParamSlider label="Temperature" value={agent.temperature} min={0} max={2} step={0.1} />
          <ParamSlider label="Top P" value={agent.topP} min={0} max={1} step={0.05} />
        </div>
      </div>

      {/* System Prompt */}
      <div className="glass-panel-solid rounded-xl p-5 space-y-3">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          پرامپت سیستم
        </h3>
        <div
          className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)', lineHeight: '1.8' }}
          dir="auto"
        >
          {agent.systemPrompt}
        </div>
      </div>
    </div>
  );
}

function KnowledgeTab({ bindings }: { bindings: AgentKnowledgeBinding[] }) {
  if (bindings.length === 0) {
    return (
      <EmptyTab
        icon="\u{1F4DA}"
        title="پایگاه دانشی متصل نیست"
        description="برای اتصال پایگاه دانش به این دستیار هوشمند، از بخش تنظیمات اقدام کنید."
      />
    );
  }
  return (
    <div className="space-y-3">
      {bindings.map((b, i) => (
        <div key={b.id} className="glass-panel-solid rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-success-100)] text-[var(--color-success-600)]"
              style={{ fontSize: 'var(--text-caption-sm)', fontWeight: 'var(--font-weight-semibold)' as any }}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
                {b.knowledgeBaseName}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                <span>آستانه: {b.relevanceThreshold}</span>
                <span aria-hidden="true">|</span>
                <span>حداکثر قطعه: {b.maxChunks}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsTab({ bindings }: { bindings: AgentToolBinding[] }) {
  if (bindings.length === 0) {
    return (
      <EmptyTab
        icon="\u{1F527}"
        title="ابزاری متصل نیست"
        description="برای اتصال ابزار به این دستیار هوشمند، از بخش تنظیمات اقدام کنید."
      />
    );
  }
  return (
    <div className="space-y-3">
      {bindings.map((b) => (
        <div key={b.id} className={
          'glass-panel-solid rounded-xl p-4 ' +
          (b.isEnabled ? '' : 'opacity-60')
        }>
          <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className={
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' +
              (b.isEnabled
                ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')
            } aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
                {b.toolName}
              </p>
              <p className="mt-0.5 truncate text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                {b.toolDescription}
              </p>
            </div>
          </div>
          <span className={
            'shrink-0 rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
            (b.isEnabled
              ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]'
              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')
          } style={{ fontSize: 'var(--text-caption-xs)' }}>
            {b.isEnabled ? 'فعال' : 'غیرفعال'}
          </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemoryTab({ bindings }: { bindings: AgentMemoryBinding[] }) {
  if (bindings.length === 0) {
    return (
      <EmptyTab
        icon="\u{1F9E0}"
        title="بسته حافظه‌ای متصل نیست"
        description="برای اتصال بسته حافظه به این دستیار هوشمند، از بخش تنظیمات اقدام کنید."
      />
    );
  }
  return (
    <div className="space-y-3">
      {bindings.map((b) => (
        <div key={b.id} className="glass-panel-solid rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-100)] text-[var(--color-accent-600)]"
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 110 14A7 7 0 018 1z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
                {b.memoryPackName}
              </p>
              <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                نوع: {b.memoryType}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Shared sub-components ---

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</dt>
      <dd className="mt-1 font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>{value}</dd>
    </div>
  );
}

function ParamSlider({ label, value, min, max, step }: { label: string; value: number; min: number; max: number; step: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <dt className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</dt>
        <span className="font-[var(--font-weight-semibold)] font-mono text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[var(--color-surface-subtle)]">
        <div className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-[var(--duration-300)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EmptyTab({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <p className="mt-3 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-md)' }}>{title}</p>
      <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>{description}</p>
    </div>
  );
}

// --- Main AgentDetail component ---

export function AgentDetail({ agent }: AgentDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('config');

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }} aria-label="مسیر ناوبری">
        <Link href="/agents" className="transition-colors hover:text-[var(--color-accent)]">دستیاران هوشمند</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-primary)]">{agent.name}</span>
      </nav>

      {/* Header */}
      <div className="glass-panel-elevated rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ' +
                (agent.status === 'active'
                  ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
                  : agent.status === 'deprecated'
                    ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                    : 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]')
              }
              aria-hidden="true"
            >
              {getTypeIcon(agent.agentType)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
                  style={{ fontSize: 'var(--text-heading-lg)' }}
                >
                  {agent.name}
                </h1>
                <span
                  className={
                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' +
                    AGENT_STATUS_COLORS[agent.status]
                  }
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {AGENT_STATUS_LABELS[agent.status]}
                </span>
                <span
                  className={
                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' +
                    AGENT_TYPE_COLORS[agent.agentType]
                  }
                  style={{ fontSize: 'var(--text-caption-xs)' }}
                >
                  {getTypeIcon(agent.agentType)} {AGENT_TYPE_LABELS[agent.agentType]}
                </span>
              </div>
              {agent.description && (
                <p className="mt-2 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
                  {agent.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                <span>{agent.modelName}</span>
                {agent.totalSessions > 0 && (
                  <>
                    <span aria-hidden="true">|</span>
                    <span>{agent.totalSessions.toLocaleString('fa-IR')} جلسه</span>
                    <span aria-hidden="true">|</span>
                    <span>{agent.totalMessages.toLocaleString('fa-IR')} پیام</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
                'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-solid)]'
              }
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              ویرایش
            </button>
            {agent.status === 'draft' && (
              <button
                type="button"
                className={
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-[var(--font-weight-medium)] transition-opacity duration-[var(--duration-150)] ' +
                  'bg-[var(--color-success-600)] text-white hover:opacity-90'
                }
                style={{ fontSize: 'var(--text-body-sm)' }}
              >
                فعال‌سازی
              </button>
            )}
            <button
              type="button"
              className={
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
                'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:opacity-90'
              }
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              شروع گفتگو
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-1 border-b border-[var(--color-border-default)] overflow-x-auto"
        role="tablist"
        aria-label="بخش‌های جزئیات دستیار هوشمند"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={
                'relative whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
                (isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')
              }
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel" id={`panel-${activeTab}`}>
        {activeTab === 'config' && <ConfigTab agent={agent} />}
        {activeTab === 'knowledge' && <KnowledgeTab bindings={agent.knowledgeBindings} />}
        {activeTab === 'tools' && <ToolsTab bindings={agent.toolBindings} />}
        {activeTab === 'memory' && <MemoryTab bindings={agent.memoryBindings} />}
        {activeTab === 'test' && <TestConsole agentName={agent.name} />}
      </div>
    </div>
  );
}
