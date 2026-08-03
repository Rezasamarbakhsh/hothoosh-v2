'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  type KnowledgeBase,
  type KBStatusFilter,
  type KBTypeFilter,
  type KBSortField,
  type SortOrder,
  type KBProcessingStatus,
  KB_TYPE_LABELS,
  KB_STATUS_LABELS,
} from '../types/knowledge.types';
import { KBCard } from './kb-card';

interface KBListProps {
  knowledgeBases: KnowledgeBase[];
}

const DEFAULT_FILTERS = {
  status: 'all' as KBStatusFilter,
  type: 'all' as KBTypeFilter,
  search: '',
  sortField: 'updated_at' as KBSortField,
  sortOrder: 'desc' as SortOrder,
};

function FilterPill<T extends string>({
  value,
  current,
  onChange,
  label,
  activeClass,
}: {
  value: T;
  current: T;
  onChange: (v: T) => void;
  label: string;
  activeClass: string;
}) {
  const isActive = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={
        'rounded-full px-3 py-1.5 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
        (isActive
          ? activeClass
          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-solid)] hover:text-[var(--color-text-primary)]')
      }
      style={{ fontSize: 'var(--text-caption-sm)' }}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

export function KBList({ knowledgeBases }: KBListProps) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const setStatus = useCallback(
    (status: KBStatusFilter) => setFilters((p) => ({ ...p, status })),
    [],
  );
  const setType = useCallback(
    (type: KBTypeFilter) => setFilters((p) => ({ ...p, type })),
    [],
  );
  const setSearch = useCallback(
    (search: string) => setFilters((p) => ({ ...p, search })),
    [],
  );
  const setSortField = useCallback(
    (sortField: KBSortField) =>
      setFilters((p) => ({
        ...p,
        sortField,
        sortOrder: p.sortField === sortField && p.sortOrder === 'desc' ? 'asc' : 'desc',
      })),
    [],
  );

  const filtered = useMemo(() => {
    let result = [...knowledgeBases];
    if (filters.status !== 'all') result = result.filter((k) => k.processingStatus === filters.status);
    if (filters.type !== 'all') result = result.filter((k) => k.kbType === filters.type);
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          (k.description && k.description.toLowerCase().includes(q)),
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortField) {
        case 'name': cmp = a.name.localeCompare(b.name, 'fa'); break;
        case 'document_count': cmp = a.documentCount - b.documentCount; break;
        case 'chunk_count': cmp = a.chunkCount - b.chunkCount; break;
        case 'updated_at': cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [knowledgeBases, filters]);

  const readyCount = knowledgeBases.filter((k) => k.processingStatus === 'ready').length;
  const totalChunks = knowledgeBases.reduce((s, k) => s + k.chunkCount, 0);
  const totalDocs = knowledgeBases.reduce((s, k) => s + k.documentCount, 0);

  const statusOptions: { value: KBStatusFilter; label: string }[] = [
    { value: 'all', label: 'همه' },
    { value: 'ready', label: 'آماده' },
    { value: 'processing', label: 'در حال پردازش' },
    { value: 'empty', label: 'خالی' },
    { value: 'failed', label: 'خطا' },
  ];

  const typeOptions: { value: KBTypeFilter; label: string }[] = [
    { value: 'all', label: 'همه' },
    { value: 'document', label: KB_TYPE_LABELS.document },
    { value: 'web', label: KB_TYPE_LABELS.web },
    { value: 'api', label: KB_TYPE_LABELS.api },
    { value: 'database', label: KB_TYPE_LABELS.database },
    { value: 'hybrid', label: KB_TYPE_LABELS.hybrid },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-lg)' }}>
            پایگاه دانش
          </h2>
          <span className="rounded-full bg-[var(--color-surface-subtle)] px-2.5 py-0.5 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
            {knowledgeBases.length} پایگاه
          </span>
        </div>
        <button
          type="button"
          className={
            'inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 ' +
            'font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] ' +
            'transition-opacity duration-[var(--duration-150)] hover:opacity-90'
          }
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 4.5h2v4H7v-4zm0 5.5h2v1.5H7V10z" fill="currentColor" />
          </svg>
          پایگاه جدید
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="کل پایگاه‌ها" value={String(knowledgeBases.length)} color="text-[var(--color-text-primary)]" />
        <StatCard label="آماده" value={String(readyCount)} color="text-[var(--color-success-600)]" />
        <StatCard label="کل اسناد" value={totalDocs.toLocaleString('fa-IR')} color="text-[var(--color-info-600)]" />
        <StatCard label="کل قطعات" value={totalChunks.toLocaleString('fa-IR')} color="text-[var(--color-accent)]" />
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
            <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z" fill="currentColor" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی پایگاه دانش..."
            className={
              'w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] ' +
              'ps-9 pe-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] ' +
              'transition-colors duration-[var(--duration-150)] focus:border-[var(--color-accent)] focus:outline-none'
            }
            style={{ fontSize: 'var(--text-body-sm)' }}
            aria-label="جستجوی پایگاه دانش"
          />
        </div>
        <SortBtn label="نام" field="name" current={filters.sortField} order={filters.sortOrder} onClick={setSortField} />
        <SortBtn label="تعداد سند" field="document_count" current={filters.sortField} order={filters.sortOrder} onClick={setSortField} />
        <SortBtn label="آخرین بروزرسانی" field="updated_at" current={filters.sortField} order={filters.sortOrder} onClick={setSortField} />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>وضعیت:</span>
        {statusOptions.map((s) => (
          <FilterPill key={s.value} value={s.value} current={filters.status} onChange={setStatus} label={s.label} activeClass="bg-[var(--color-primary-600)] text-white" />
        ))}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>نوع:</span>
        {typeOptions.map((t) => (
          <FilterPill key={t.value} value={t.value} current={filters.type} onChange={setType} label={t.label} activeClass="bg-[var(--color-accent)] text-[var(--color-text-inverse)]" />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--color-text-muted)]" aria-hidden="true">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-4 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-md)' }}>
            پایگاه دانشی یافت نشد
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            فیلترها را تغییر دهید یا پایگاه جدیدی ایجاد کنید
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((kb) => (
            <KBCard key={kb.id} kb={kb} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-panel-solid rounded-lg p-3">
      <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</p>
      <p className={"mt-1 font-[var(--font-weight-semibold)] " + color} style={{ fontSize: 'var(--text-heading-sm)' }}>{value}</p>
    </div>
  );
}

function SortBtn({ label, field, current, order, onClick }: { label: string; field: KBSortField; current: KBSortField; order: SortOrder; onClick: (f: KBSortField) => void }) {
  const isActive = field === current;
  return (
    <button
      type="button"
      onClick={() => onClick(field)}
      className={
        'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
        (isActive ? 'bg-[var(--color-surface-solid)] text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')
      }
      style={{ fontSize: 'var(--text-caption-sm)' }}
      aria-label={`مرتب‌سازی بر اساس ${label}`}
    >
      {label}
      {isActive && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className={"transition-transform duration-[var(--duration-200)] " + (order === 'asc' ? 'rotate-180' : '')} aria-hidden="true">
          <path d="M6 2L10 8H2L6 2z" />
        </svg>
      )}
    </button>
  );
}
