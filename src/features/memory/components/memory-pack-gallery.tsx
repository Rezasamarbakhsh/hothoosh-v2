'use client';

import { useState, useMemo } from 'react';
import {
  type MemoryPack,
  type MemoryTypeFilter,
  type MemoryStatusFilter,
  type MemoryScopeFilter,
  type MemorySortField,
  type SortOrder,
  MEMORY_TYPE_LABELS,
  MEMORY_STATUS_LABELS,
  MEMORY_SCOPE_LABELS,
  MEMORY_TYPE_COLORS,
  MEMORY_STATUS_COLORS,
} from '../types/memory.types';
import { MemoryPackCard } from './memory-pack-card';

interface MemoryPackGalleryProps {
  packs: MemoryPack[];
}

const TYPE_OPTIONS: { value: MemoryTypeFilter; label: string }[] = [
  { value: 'all', label: 'همه انواع' },
  { value: 'context', label: MEMORY_TYPE_LABELS.context },
  { value: 'preference', label: MEMORY_TYPE_LABELS.preference },
  { value: 'knowledge', label: MEMORY_TYPE_LABELS.knowledge },
  { value: 'system', label: MEMORY_TYPE_LABELS.system },
];

const STATUS_OPTIONS: { value: MemoryStatusFilter; label: string }[] = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'active', label: MEMORY_STATUS_LABELS.active },
  { value: 'draft', label: MEMORY_STATUS_LABELS.draft },
  { value: 'archived', label: MEMORY_STATUS_LABELS.archived },
];

const SCOPE_OPTIONS: { value: MemoryScopeFilter; label: string }[] = [
  { value: 'all', label: 'همه حوزه‌ها' },
  { value: 'workspace', label: MEMORY_SCOPE_LABELS.workspace },
  { value: 'brand', label: MEMORY_SCOPE_LABELS.brand },
  { value: 'company', label: MEMORY_SCOPE_LABELS.company },
  { value: 'organization', label: MEMORY_SCOPE_LABELS.organization },
];

const SORT_OPTIONS: { value: MemorySortField; label: string }[] = [
  { value: 'updated_at', label: 'بروزرسانی' },
  { value: 'name', label: 'نام' },
  { value: 'totalInjections', label: 'تزریق' },
  { value: 'tokenCount', label: 'توکن' },
  { value: 'versionCount', label: 'نسخه' },
];

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

export function MemoryPackGallery({ packs }: MemoryPackGalleryProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MemoryTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<MemoryStatusFilter>('all');
  const [scopeFilter, setScopeFilter] = useState<MemoryScopeFilter>('all');
  const [sortField, setSortField] = useState<MemorySortField>('updated_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filtered = useMemo(() => {
    let result = [...packs];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((p) => p.memoryType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Scope filter
    if (scopeFilter !== 'all') {
      result = result.filter((p) => p.scope === scopeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name, 'fa');
          break;
        case 'updated_at':
          cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'totalInjections':
          cmp = a.totalInjections - b.totalInjections;
          break;
        case 'tokenCount':
          cmp = a.tokenCount - b.tokenCount;
          break;
        case 'versionCount':
          cmp = a.versionCount - b.versionCount;
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [packs, search, typeFilter, statusFilter, scopeFilter, sortField, sortOrder]);

  // Stats
  const stats = useMemo(() => ({
    total: packs.length,
    active: packs.filter((p) => p.status === 'active').length,
    draft: packs.filter((p) => p.status === 'draft').length,
    archived: packs.filter((p) => p.status === 'archived').length,
    totalInjections: packs.reduce((sum, p) => sum + p.totalInjections, 0),
  }), [packs]);

  function cycleSortField() {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Stats row */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <StatCard label='کل بسته‌ها' value={formatNumber(stats.total)} color='var(--color-primary-500)' />
        <StatCard label='فعال' value={formatNumber(stats.active)} color='var(--color-success-500)' />
        <StatCard label='پیش‌نویس' value={formatNumber(stats.draft)} color='var(--color-warning-500)' />
        <StatCard label='بایگانی' value={formatNumber(stats.archived)} color='var(--color-text-muted)' />
      </div>

      {/* Search */}
      <div className='relative'>
        <svg
          width='16' height='16'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]'
          aria-hidden='true'
        >
          <path d='M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z' />
        </svg>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='جستجو در بسته‌های حافظه...'
          dir='rtl'
          className='w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pe-4 ps-10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors duration-[var(--duration-150)] focus:border-[var(--color-accent)]'
          style={{ fontSize: 'var(--text-body-sm)' }}
        />
      </div>

      {/* Filter pills */}
      <div className='flex flex-col gap-3'>
        {/* Type filter */}
        <FilterPillRow
          options={TYPE_OPTIONS}
          value={typeFilter}
          onChange={setTypeFilter}
          activeColorClass={(v) => (v !== 'all' ? MEMORY_TYPE_COLORS[v as keyof typeof MEMORY_TYPE_COLORS] : '')}
        />
        {/* Status filter */}
        <FilterPillRow
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          activeColorClass={(v) => (v !== 'all' ? MEMORY_STATUS_COLORS[v as keyof typeof MEMORY_STATUS_COLORS] : '')}
        />
        {/* Scope filter */}
        <FilterPillRow
          options={SCOPE_OPTIONS}
          value={scopeFilter}
          onChange={setScopeFilter}
        />
      </div>

      {/* Sort + count */}
      <div className='flex items-center justify-between'>
        <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
          {formatNumber(filtered.length)} بسته حافظه
        </span>
        <button
          type='button'
          onClick={cycleSortField}
          className='flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-150)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          <span>مرتب‌سازی:</span>
          <span className='font-[var(--font-weight-medium)]'>
            {SORT_OPTIONS.find((o) => o.value === sortField)?.label}
          </span>
          <svg
            width='12' height='12'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='transition-transform duration-[var(--duration-200)]'
            style={{ transform: sortOrder === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)' }}
            aria-hidden='true'
          >
            <path d='M8 3.5l.75 1.5H13l-2.5 3 1.5 5H4l1.5-5L3 5h4.25L8 3.5z' />
          </svg>
        </button>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((pack) => (
            <MemoryPackCard key={pack.id} pack={pack} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-default)] py-16'>
          <svg width='40' height='40' viewBox='0 0 16 16' fill='currentColor' className='text-[var(--color-text-muted)]' aria-hidden='true'>
            <path d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a5 5 0 110 10A5 5 0 018 3zM6.5 7a1 1 0 100 2 1 1 0 000-2zm3 0a1 1 0 100 2 1 1 0 000-2zM5 10.5c0-.28.22-.5.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z' />
          </svg>
          <p className='mt-3 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-body-sm)' }}>
            بسته حافظه‌ای یافت نشد
          </p>
          <p className='mt-1 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            فیلترها را تغییر دهید یا بسته جدیدی بسازید
          </p>
        </div>
      )}
    </div>
  );
}

/* --- Sub-components --- */

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className='glass-panel-elevated rounded-xl p-4'>
      <div className='flex items-center gap-2'>
        <span className='h-2 w-2 rounded-full' style={{ backgroundColor: color }} aria-hidden='true' />
        <span className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</span>
      </div>
      <p
        className='mt-1 font-[var(--font-weight-bold)] text-[var(--color-text-primary)]'
        style={{ fontSize: 'var(--text-heading-lg)' }}
      >
        {value}
      </p>
    </div>
  );
}

function FilterPillRow<T extends string>({
  options,
  value,
  onChange,
  activeColorClass,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  activeColorClass?: (v: string) => string;
}) {
  return (
    <div className='flex flex-wrap gap-1.5' role='radiogroup'>
      {options.map((opt) => {
        const isActive = opt.value === value;
        const activeClass = activeColorClass ? activeColorClass(opt.value) : 'bg-[var(--color-accent)] text-white';
        return (
          <button
            key={opt.value}
            type='button'
            role='radio'
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={'rounded-full px-3 py-1 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
              (isActive
                ? activeClass
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-default)]')}
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
