'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import {
  type MemoryPackDetail as MemoryPackDetailType,
  MEMORY_TYPE_LABELS,
  MEMORY_STATUS_LABELS,
  MEMORY_SCOPE_LABELS,
  MEMORY_TYPE_COLORS,
  MEMORY_STATUS_COLORS,
  MEMORY_SCOPE_COLORS,
  MEMORY_TYPE_ICONS,
} from '../types/memory.types';

// Agent type labels (local copy for detail view)
const AGENT_TYPE_LABELS_LOCAL: Record<string, string> = {
  chat: 'گفتگو',
  rag: 'RAG',
  tool_use: 'ابزار',
  autonomous: 'مستقل',
  workflow: 'جریان کاری',
};

type TabId = 'config' | 'versions' | 'bindings' | 'usage';

const TABS: { id: TabId; label: string }[] = [
  { id: 'config', label: 'پیکربندی' },
  { id: 'versions', label: 'نسخه‌ها' },
  { id: 'bindings', label: 'اتصالات' },
  { id: 'usage', label: 'آمار استفاده' },
];

interface MemoryPackDetailProps {
  detail: MemoryPackDetailType;
}

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function MemoryPackDetail({ detail }: MemoryPackDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('config');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const typeLabel = AGENT_TYPE_LABELS_LOCAL;

  return (
    <div className='flex flex-col gap-6'>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-[var(--color-text-inverse)] shadow-lg transition-opacity duration-300 ${toast.type === 'success' ? 'bg-[var(--color-success-600)]' : 'bg-[var(--color-error-500)]'}`}>
          {toast.message}
        </div>
      )}
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2' aria-label='مسیر ناوبری'>
        <Link
          href='/memory'
          className='text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          حافظه
        </Link>
        <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor' className='text-[var(--color-text-muted)] rotate-180' aria-hidden='true'>
          <path d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' />
        </svg>
        <span className='text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
          {detail.name}
        </span>
      </nav>

      {/* Header */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-start gap-3'>
            <span
              className={'mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ' + MEMORY_TYPE_COLORS[detail.memoryType]}
              aria-hidden='true'
            >
              <svg width='20' height='20' viewBox='0 0 16 16' fill='currentColor'>
                <path d={MEMORY_TYPE_ICONS[detail.memoryType].d} />
              </svg>
            </span>
            <div>
              <h1
                className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]'
                style={{ fontSize: 'var(--text-heading-lg)' }}
              >
                {detail.name}
              </h1>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' + MEMORY_TYPE_COLORS[detail.memoryType]} style={{ fontSize: 'var(--text-caption-xs)' }}>
                  {MEMORY_TYPE_LABELS[detail.memoryType]}
                </span>
                <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' + MEMORY_STATUS_COLORS[detail.status]} style={{ fontSize: 'var(--text-caption-xs)' }}>
                  {MEMORY_STATUS_LABELS[detail.status]}
                </span>
                <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' + MEMORY_SCOPE_COLORS[detail.scope]} style={{ fontSize: 'var(--text-caption-xs)' }}>
                  {MEMORY_SCOPE_LABELS[detail.scope]}
                </span>
                {detail.autoInject && (
                  <span className='inline-flex items-center gap-1 rounded-full bg-[var(--color-success-100)] px-2.5 py-0.5 font-[var(--font-weight-medium)] text-[var(--color-success-600)]' style={{ fontSize: 'var(--text-caption-xs)' }}>
                    <svg width='10' height='10' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
                      <path d='M8 1a7 7 0 110 14A7 7 0 018 1zm3.03 5.03a.75.75 0 00-1.06-1.06L7 7.94 5.53 6.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z' />
                    </svg>
                    تزریق خودکار
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <button type='button' onClick={() => showToast('ویرایش بسته حافظه', 'info')} className='inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-subtle)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150' style={{ fontSize: 'var(--text-body-sm)' }}>
              <Pencil className='h-4 w-4' />
              ویرایش
            </button>
            <button type='button' onClick={() => showToast('بسته حافظه حذف شد')} className='inline-flex items-center gap-2 rounded-lg border border-[var(--color-error-500)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-error-500)] hover:bg-[var(--color-error-500)]/10 transition-colors duration-150' style={{ fontSize: 'var(--text-body-sm)' }}>
              <Trash2 className='h-4 w-4' />
              حذف
            </button>
          </div>
        </div>
        {detail.description && (
          <p className='mt-4 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
            {detail.description}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className='border-b border-[var(--color-border-default)]' role='tablist'>
        <div className='flex gap-0'>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type='button'
              role='tab'
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={'relative px-4 py-3 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
                (activeTab === tab.id
                  ? 'text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')}
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className='absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-accent)]' aria-hidden='true' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div>
        {activeTab === 'config' && <ConfigTab detail={detail} />}
        {activeTab === 'versions' && <VersionsTab detail={detail} />}
        {activeTab === 'bindings' && <BindingsTab detail={detail} agentTypeLabels={typeLabel} />}
        {activeTab === 'usage' && <UsageTab detail={detail} />}
      </div>
    </div>
  );
}

/* --- Config Tab --- */
function ConfigTab({ detail }: { detail: MemoryPackDetailType }) {
  return (
    <div className='flex flex-col gap-6'>
      {/* Info grid */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          اطلاعات پایه
        </h2>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3'>
          <InfoField label='نوع' value={MEMORY_TYPE_LABELS[detail.memoryType]} />
          <InfoField label='وضعیت' value={MEMORY_STATUS_LABELS[detail.status]} />
          <InfoField label='حوزه' value={MEMORY_SCOPE_LABELS[detail.scope]} />
          <InfoField label='نسخه فعلی' value={formatNumber(detail.currentVersion)} />
          <InfoField label='تعداد توکن' value={formatNumber(detail.tokenCount)} />
          <InfoField label='تزریق خودکار' value={detail.autoInject ? 'فعال' : 'غیرفعال'} />
          <InfoField label='ایجاد شده' value={formatDate(detail.createdAt)} />
          <InfoField label='بروزرسانی' value={formatDate(detail.updatedAt)} />
          {detail.lastInjectedAt && (
            <InfoField label='آخرین تزریق' value={formatDate(detail.lastInjectedAt)} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          محتوای حافظه
        </h2>
        <div
          className='rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-relaxed)' }}
          dir='rtl'
        >
          {detail.content}
        </div>
      </div>

      {/* Relevance score bar */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          امتیاز ارتباط
        </h2>
        <div className='flex items-center gap-3'>
          <div className='flex-1 h-2.5 rounded-full bg-[var(--color-surface-subtle)]'>
            <div
              className='h-2.5 rounded-full transition-all duration-500'
              style={{
                width: `${(detail.relevanceScore * 100).toFixed(0)}%`,
                backgroundColor: detail.relevanceScore > 0.8
                  ? 'var(--color-success-500)'
                  : detail.relevanceScore > 0.5
                    ? 'var(--color-warning-500)'
                    : 'var(--color-text-muted)',
              }}
            />
          </div>
          <span
            className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            {(detail.relevanceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* --- Versions Tab --- */
function VersionsTab({ detail }: { detail: MemoryPackDetailType }) {
  if (detail.versions.length === 0) {
    return <EmptyState message='هیچ نسخه‌ای ثبت نشده است.' />;
  }

  return (
    <div className='flex flex-col gap-3'>
      {detail.versions
        .sort((a, b) => b.versionNumber - a.versionNumber)
        .map((version, idx, arr) => {
          const isLatest = idx === 0;
          const prevVersion = arr[idx + 1];
          return (
            <div
              key={version.id}
              className={'glass-panel-elevated rounded-xl p-5 transition-all duration-[var(--duration-200)] ' + (isLatest ? 'ring-1 ring-[var(--color-accent)]' : '')}
            >
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <span
                    className={'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-[var(--font-weight-bold)] ' +
                      (isLatest
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]')}
                    style={{ fontSize: 'var(--text-caption-sm)' }}
                  >
                    {formatNumber(version.versionNumber)}
                  </span>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
                        نسخه {formatNumber(version.versionNumber)}
                      </span>
                      {isLatest && (
                        <span className='inline-flex rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-white font-[var(--font-weight-medium)]' style={{ fontSize: 'var(--text-caption-xs)' }}>
                          فعلی
                        </span>
                      )}
                    </div>
                    {version.summary && (
                      <p className='mt-0.5 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
                        {version.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-3 text-[var(--color-text-muted)] shrink-0' style={{ fontSize: 'var(--text-caption-sm)' }}>
                  <span>{formatNumber(version.tokenCount)} توکن</span>
                  <span>|</span>
                  <span>{version.createdBy}</span>
                  <span>|</span>
                  <span>{formatDate(version.createdAt)}</span>
                </div>
              </div>
              {/* Content preview */}
              <div
                className='mt-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] p-3 text-[var(--color-text-secondary)]'
                style={{ fontSize: 'var(--text-caption-sm)', lineHeight: 'var(--line-height-relaxed)' }}
                dir='rtl'
              >
                {version.content}
              </div>
              {/* Diff indicator */}
              {prevVersion && (
                <div className='mt-2 flex items-center gap-2 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-xs)' }}>
                  <svg width='12' height='12' viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
                    <path d='M8 3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 3.5zM8 10a1 1 0 100 2 1 1 0 000-2z' />
                  </svg>
                  <span>
                    +{formatNumber(version.tokenCount - prevVersion.tokenCount)} توکن نسبت به نسخه {formatNumber(prevVersion.versionNumber)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

/* --- Bindings Tab --- */
function BindingsTab({ detail, agentTypeLabels }: { detail: MemoryPackDetailType; agentTypeLabels: Record<string, string> }) {
  if (detail.boundAgents.length === 0) {
    return (
      <EmptyState message='این بسته حافظه به هیچ دستیار هوشمندی متصل نیست.' />
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {detail.boundAgents.map((agent) => (
        <Link
          key={agent.id}
          href={`/agents/${agent.id}`}
          className='glass-panel-elevated flex items-center justify-between rounded-xl p-4 transition-all duration-[var(--duration-200)] hover:shadow-[var(--shadow-md)]'
        >
          <div className='flex items-center gap-3'>
            <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' aria-hidden='true'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                <path d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a5 5 0 110 10A5 5 0 018 3zM6.5 7a1 1 0 100 2 1 1 0 000-2zm3 0a1 1 0 100 2 1 1 0 000-2zM5 10.5c0-.28.22-.5.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z' />
              </svg>
            </span>
            <div>
              <span className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
                {agent.name}
              </span>
              <p className='mt-0.5 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
                {agentTypeLabels[agent.agentType] ?? agent.agentType}
              </p>
            </div>
          </div>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' className='text-[var(--color-text-muted)] rotate-180' aria-hidden='true'>
            <path d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' />
          </svg>
        </Link>
      ))}
    </div>
  );
}

/* --- Usage Tab --- */
function UsageTab({ detail }: { detail: MemoryPackDetailType }) {
  return (
    <div className='flex flex-col gap-6'>
      {/* Injection stats */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          آمار تزریق
        </h2>
        <div className='grid grid-cols-3 gap-6'>
          <div>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              کل تزریق‌ها
            </p>
            <p className='mt-1 font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-xl)' }}>
              {formatNumber(detail.totalInjections)}
            </p>
          </div>
          <div>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              دستیاران متصل
            </p>
            <p className='mt-1 font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-xl)' }}>
              {formatNumber(detail.boundAgentCount)}
            </p>
          </div>
          <div>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              امتیاز ارتباط
            </p>
            <p className='mt-1 font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-xl)' }}>
              {(detail.relevanceScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Token usage visual */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          مصرف توکن
        </h2>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <div className='flex justify-between text-[var(--color-text-muted)] mb-1.5' style={{ fontSize: 'var(--text-caption-sm)' }}>
              <span>{formatNumber(detail.tokenCount)} توکن از {formatNumber(8192)}</span>
              <span>{((detail.tokenCount / 8192) * 100).toFixed(1)}%</span>
            </div>
            <div className='h-3 rounded-full bg-[var(--color-surface-subtle)]'>
              <div
                className='h-3 rounded-full transition-all duration-500'
                style={{
                  width: `${Math.min((detail.tokenCount / 8192) * 100, 100)}%`,
                  backgroundColor: (detail.tokenCount / 8192) > 0.8
                    ? 'var(--color-danger-500)'
                    : (detail.tokenCount / 8192) > 0.5
                      ? 'var(--color-warning-500)'
                      : 'var(--color-success-500)',
                }}
              />
            </div>
            <p className='mt-1.5 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-xs)' }}>
              حد نظارتی بافت توکن برای تزریق خودکار: ۸٬۱۹۲
            </p>
          </div>
        </div>
      </div>

      {/* Version timeline summary */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <h2
          className='mb-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          تاریخچه نسخه‌ها
        </h2>
        <div className='flex items-center gap-2'>
          <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            {formatNumber(detail.versionCount)} نسخه
          </span>
          <span className='text-[var(--color-border-default)]'>|</span>
          <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            انتشار ابتدایی: {formatDate(detail.createdAt)}
          </span>
          <span className='text-[var(--color-border-default)]'>|</span>
          <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            آخرین بروزرسانی: {formatDate(detail.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* --- Shared helpers --- */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</p>
      <p className='mt-0.5 font-[var(--font-weight-medium)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-default)] py-16'>
      <svg width='40' height='40' viewBox='0 0 16 16' fill='currentColor' className='text-[var(--color-text-muted)]' aria-hidden='true'>
        <path d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a5 5 0 110 10A5 5 0 018 3zM6.5 7a1 1 0 100 2 1 1 0 000-2zm3 0a1 1 0 100 2 1 1 0 000-2zM5 10.5c0-.28.22-.5.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z' />
      </svg>
      <p className='mt-3 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-body-sm)' }}>
        {message}
      </p>
    </div>
  );
}
