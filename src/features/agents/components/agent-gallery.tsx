'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  type Agent,
  type AgentFilters,
  type AgentTypeFilter,
  type AgentStatusFilter,
  type AgentSortField,
  type SortOrder,
  type AgentType,
  type AgentStatus,
  AGENT_TYPE_LABELS,
  AGENT_STATUS_LABELS,
  MOCK_AGENTS,
} from '../types/agent.types';
import { AgentCard } from './agent-card';

interface AgentGalleryProps {
  agents: Agent[];
}

const DEFAULT_FILTERS: AgentFilters = {
  type: 'all',
  status: 'all',
  search: '',
  sortField: 'updated_at',
  sortOrder: 'desc',
};

function AgentTypeFilterPill({
  value,
  current,
  onChange,
}: {
  value: AgentTypeFilter;
  current: AgentTypeFilter;
  onChange: (v: AgentTypeFilter) => void;
}) {
  const isActive = value === current;
  const label = value === 'all' ? 'همه' : AGENT_TYPE_LABELS[value];
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={
        'rounded-full px-3 py-1.5 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
        (isActive
          ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-solid)] hover:text-[var(--color-text-primary)]')
      }
      style={{ fontSize: 'var(--text-caption-sm)' }}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

function AgentStatusFilterPill({
  value,
  current,
  onChange,
}: {
  value: AgentStatusFilter;
  current: AgentStatusFilter;
  onChange: (v: AgentStatusFilter) => void;
}) {
  const isActive = value === current;
  const label = value === 'all' ? 'همه وضعیت‌ها' : AGENT_STATUS_LABELS[value];
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={
        'rounded-full px-3 py-1.5 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
        (isActive
          ? 'bg-[var(--color-primary-600)] text-white'
          : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-solid)] hover:text-[var(--color-text-primary)]')
      }
      style={{ fontSize: 'var(--text-caption-sm)' }}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}

export function AgentGallery({ agents }: AgentGalleryProps) {
  const [filters, setFilters] = useState<AgentFilters>(DEFAULT_FILTERS);

  const setType = useCallback(
    (type: AgentTypeFilter) => setFilters((prev) => ({ ...prev, type })),
    [],
  );

  const setStatus = useCallback(
    (status: AgentStatusFilter) => setFilters((prev) => ({ ...prev, status })),
    [],
  );

  const setSearch = useCallback(
    (search: string) => setFilters((prev) => ({ ...prev, search })),
    [],
  );

  const setSortField = useCallback(
    (sortField: AgentSortField) =>
      setFilters((prev) => ({
        ...prev,
        sortField,
        sortOrder: prev.sortField === sortField && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      })),
    [],
  );

  const filteredAgents = useMemo(() => {
    let result = [...agents];

    if (filters.type !== 'all') {
      result = result.filter((a) => a.agentType === filters.type);
    }
    if (filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name, 'fa');
          break;
        case 'created_at':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated_at':
          cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'totalSessions':
          cmp = a.totalSessions - b.totalSessions;
          break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [agents, filters]);

  const activeCount = agents.filter((a) => a.status === 'active').length;
  const draftCount = agents.filter((a) => a.status === 'draft').length;

  const typeOptions: AgentTypeFilter[] = ['all', 'chat', 'rag', 'tool_use', 'autonomous', 'workflow'];
  const statusOptions: AgentStatusFilter[] = ['all', 'active', 'draft', 'deprecated'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2
            className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-heading-lg)' }}
          >
            دستیاران هوشمند
          </h2>
          <span
            className="rounded-full bg-[var(--color-surface-subtle)] px-2.5 py-0.5 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]"
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {agents.length} دستیار هوشمند
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
          دستیار هوشمند جدید
        </button>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="glass-panel-solid rounded-lg p-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>کل دستیاران</p>
          <p className="mt-1 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-sm)' }}>{agents.length}</p>
        </div>
        <div className="glass-panel-solid rounded-lg p-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>فعال</p>
          <p className="mt-1 font-[var(--font-weight-semibold)] text-[var(--color-success-600)]" style={{ fontSize: 'var(--text-heading-sm)' }}>{activeCount}</p>
        </div>
        <div className="glass-panel-solid rounded-lg p-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>پیش‌نویس</p>
          <p className="mt-1 font-[var(--font-weight-semibold)] text-[var(--color-warning-600)]" style={{ fontSize: 'var(--text-heading-sm)' }}>{draftCount}</p>
        </div>
        <div className="glass-panel-solid rounded-lg p-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>منسوخ</p>
          <p className="mt-1 font-[var(--font-weight-semibold)] text-[var(--color-danger-600)]" style={{ fontSize: 'var(--text-heading-sm)' }}>{agents.length - activeCount - draftCount}</p>
        </div>
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            aria-hidden="true"
          >
            <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85zm-5.242.156a5 5 0 110-10 5 5 0 010 10z" fill="currentColor" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی دستیاران..."
            className={
              'w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] ' +
              'ps-9 pe-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] ' +
              'transition-colors duration-[var(--duration-150)] focus:border-[var(--color-accent)] focus:outline-none'
            }
            style={{ fontSize: 'var(--text-body-sm)' }}
            aria-label="جستجوی دستیاران"
          />
        </div>
        <SortButton
          label="نام"
          field="name"
          currentField={filters.sortField}
          order={filters.sortOrder}
          onClick={setSortField}
        />
        <SortButton
          label="بیشترین استفاده"
          field="totalSessions"
          currentField={filters.sortField}
          order={filters.sortOrder}
          onClick={setSortField}
        />
        <SortButton
          label="آخرین بروزرسانی"
          field="updated_at"
          currentField={filters.sortField}
          order={filters.sortOrder}
          onClick={setSortField}
        />
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>نوع:</span>
        {typeOptions.map((t) => (
          <AgentTypeFilterPill key={t} value={t} current={filters.type} onChange={setType} />
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>وضعیت:</span>
        {statusOptions.map((s) => (
          <AgentStatusFilterPill key={s} value={s} current={filters.status} onChange={setStatus} />
        ))}
      </div>

      {/* Grid */}
      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--color-text-muted)]" aria-hidden="true">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-4 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-md)' }}>
            دستیار هوشمندی یافت نشد
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            فیلترها را تغییر دهید یا دستیار هوشمند جدیدی ایجاد کنید
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

function SortButton({
  label,
  field,
  currentField,
  order,
  onClick,
}: {
  label: string;
  field: AgentSortField;
  currentField: AgentSortField;
  order: SortOrder;
  onClick: (f: AgentSortField) => void;
}) {
  const isActive = field === currentField;
  return (
    <button
      type="button"
      onClick={() => onClick(field)}
      className={
        'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' +
        (isActive
          ? 'bg-[var(--color-surface-solid)] text-[var(--color-accent)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')
      }
      style={{ fontSize: 'var(--text-caption-sm)' }}
      aria-label={`مرتب‌سازی بر اساس ${label}`}
    >
      {label}
      {isActive && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          className={
            'transition-transform duration-[var(--duration-200)] ' +
            (order === 'asc' ? 'rotate-180' : '')
          }
          aria-hidden="true"
        >
          <path d="M6 2L10 8H2L6 2z" />
        </svg>
      )}
    </button>
  );
}
