'use client';

import Link from 'next/link';
import {
  type Agent,
  AGENT_TYPE_LABELS,
  AGENT_STATUS_LABELS,
  AGENT_TYPE_COLORS,
  AGENT_STATUS_COLORS,
} from '../types/agent.types';

interface AgentCardProps {
  agent: Agent;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function getTypeIcon(type: Agent['agentType']): string {
  const icons: Record<Agent['agentType'], string> = {
    chat: '\u{1F4AC}',
    rag: '\u{1F4DA}',
    tool_use: '\u{1F527}',
    autonomous: '\u{1F916}',
    workflow: '\u{1F504}',
  };
  return icons[type];
}

export function AgentCard({ agent }: AgentCardProps) {
  const hasBindings = agent.knowledgeBaseCount > 0 || agent.toolCount > 0 || agent.memoryPackCount > 0;

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={
        'group glass-panel-elevated flex flex-col rounded-xl p-5 transition-all duration-[var(--duration-200)] ' +
        'hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5'
      }
    >
      {/* Header: avatar + name + badges */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ' +
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

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="truncate font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
              style={{ fontSize: 'var(--text-body-md)' }}
            >
              {agent.name}
            </h3>
            <span
              className={
                'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
                AGENT_STATUS_COLORS[agent.status]
              }
              style={{ fontSize: 'var(--text-caption-xs)' }}
            >
              {AGENT_STATUS_LABELS[agent.status]}
            </span>
          </div>
          <span
            className={
              'mt-1 inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
              AGENT_TYPE_COLORS[agent.agentType]
            }
            style={{ fontSize: 'var(--text-caption-xs)' }}
          >
            {getTypeIcon(agent.agentType)} {AGENT_TYPE_LABELS[agent.agentType]}
          </span>
        </div>
      </div>

      {/* Description */}
      {agent.description && (
        <p
          className="mt-3 line-clamp-2 text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          {agent.description}
        </p>
      )}

      {/* Footer: model + stats + bindings */}
      <div className="mt-auto pt-4 border-t border-[var(--color-border-default)] mt-4">
        {/* Model name */}
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" fill="currentColor" className="text-[var(--color-text-muted)]" />
          </svg>
          <span className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
            {agent.modelName}
          </span>
        </div>

        {/* Usage stats */}
        {agent.totalSessions > 0 && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              {formatNumber(agent.totalSessions)} جلسه
            </span>
            <span className="text-[var(--color-border-default)]" aria-hidden="true">|</span>
            <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              {formatNumber(agent.totalMessages)} پیام
            </span>
          </div>
        )}

        {/* Binding indicators */}
        {hasBindings && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {agent.knowledgeBaseCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-success-100)] px-1.5 py-0.5 text-[var(--color-success-600)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9zM3.5 3.5v9h9v-9h-9zM5 5.5h6v1.5H5V5.5zM5 9h4v1.5H5V9z" />
                </svg>
                {agent.knowledgeBaseCount} پایگاه دانش
              </span>
            )}
            {agent.toolCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-warning-100)] px-1.5 py-0.5 text-[var(--color-warning-600)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85z" />
                </svg>
                {agent.toolCount} ابزار
              </span>
            )}
            {agent.memoryPackCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-accent-100)] px-1.5 py-0.5 text-[var(--color-accent-600)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 1a7 7 0 110 14A7 7 0 018 1z" />
                </svg>
                {agent.memoryPackCount} حافظه
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
