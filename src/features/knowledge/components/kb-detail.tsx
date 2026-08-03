'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Upload, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  type KnowledgeBaseDetail as KBDetailType,
  type KnowledgeDocument,
  type KnowledgeChunk,
  type SearchResult,
  KB_STATUS_LABELS,
  KB_TYPE_LABELS,
  KB_STATUS_COLORS,
  KB_TYPE_COLORS,
  DOC_STATUS_LABELS,
  DOC_STATUS_COLORS,
  FILE_TYPE_ICONS,
  CHUNKING_STRATEGY_LABELS,
  MOCK_SEARCH_RESULTS,
} from '../types/knowledge.types';

interface KBDetailProps {
  kb: KBDetailType;
}

type TabId = 'documents' | 'chunks' | 'search' | 'settings';

const TABS: { id: TabId; label: string }[] = [
  { id: 'documents', label: 'اسناد' },
  { id: 'chunks', label: 'قطعات' },
  { id: 'search', label: 'تست جستجو' },
  { id: 'settings', label: 'تنظیمات' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const units = ['بایت', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// --- Documents Tab ---
function DocumentsTab({ documents }: { documents: KnowledgeDocument[] }) {
  if (documents.length === 0) {
    return (
      <EmptyTab
        icon="\u{1F4C1}"
        title="سندی آپلود نشده است"
        description="برای شروع، فایل‌های خود را در این پایگاه دانش آپلود کنید."
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Upload area placeholder */}
      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border-default)] p-8 transition-colors hover:border-[var(--color-accent)]">
        <div className="text-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto text-[var(--color-text-muted)]" aria-hidden="true">
            <path d="M16 4v18m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20v4a4 4 0 004 4h16a4 4 0 004-4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-2 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            فایل‌ها را اینجا بکشید یا کلیک کنید
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
            PDF, DOCX, TXT, MD, HTML, CSV, JSON
          </p>
        </div>
      </div>

      {/* Document list */}
      <div className="glass-panel-solid rounded-xl divide-y divide-[var(--color-border-default)]">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-lg" aria-hidden="true">
                {FILE_TYPE_ICONS[doc.fileType]}
              </span>
              <div className="min-w-0">
                <p className="truncate font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
                  {doc.fileName}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                  <span>{formatBytes(doc.fileSize)}</span>
                  {doc.chunkCount > 0 && (
                    <>
                      <span aria-hidden="true">|</span>
                      <span>{doc.chunkCount} قطعه</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {doc.errorMessage && (
                <span className="text-[var(--color-danger-500)]" style={{ fontSize: 'var(--text-caption-xs)' }} title={doc.errorMessage}>
                  خطا
                </span>
              )}
              <span
                className={
                  'inline-flex items-center rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
                  DOC_STATUS_COLORS[doc.processingStatus]
                }
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {DOC_STATUS_LABELS[doc.processingStatus]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Chunks Tab ---
function ChunksTab({ chunks, totalChunks }: { chunks: KnowledgeChunk[]; totalChunks: number }) {
  if (totalChunks === 0) {
    return (
      <EmptyTab
        icon="\u{1F4D0}"
        title="قطعه‌ای وجود ندارد"
        description="پس از پردازش موفق اسناد، قطعات اینجا نمایش داده می‌شوند."
      />
    );
  }

  const displayChunks = chunks.length > 0 ? chunks : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          نمایش {displayChunks.length} از {totalChunks.toLocaleString('fa-IR')} قطعه
        </p>
      </div>
      {displayChunks.length === 0 ? (
        <p className="py-8 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          قطعات اخیر در اینجا نمایش داده می‌شوند.
        </p>
      ) : (
        <div className="space-y-3">
          {displayChunks.map((chunk) => (
            <div key={chunk.id} className="glass-panel-solid rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                  قطعه {chunk.chunkIndex + 1}
                </span>
                <span className="rounded-full bg-[var(--color-surface-subtle)] px-2 py-0.5 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                  {chunk.tokenCount} توکن
                </span>
              </div>
              {typeof chunk.metadata.heading === 'string' && (
                <p className="mb-1.5 font-[var(--font-weight-medium)] text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                  {chunk.metadata.heading}
                </p>
              )}
              <p className="text-[var(--color-text-secondary)] leading-relaxed" style={{ fontSize: 'var(--text-body-sm)' }} dir="auto">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Search Test Tab ---
function SearchTestTab({ kbName }: { kbName: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    setHasSearched(true);

    // Simulate search
    setTimeout(() => {
      setResults(MOCK_SEARCH_RESULTS);
      setIsSearching(false);
    }, 1200);
  }, [query, isSearching]);

  return (
    <div className="space-y-6">
      {/* Search info */}
      <div className="glass-panel-solid rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--color-info-600)]" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            تست بازیابی
          </span>
        </div>
        <p className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          با وارد کردن یک پرسش، کیفیت بازیابی پایگاه دانش «{kbName}» را آزمایش کنید. نتایج شامل امتیاز شباهت و نوع جستجو است.
        </p>
      </div>

      {/* Search input */}
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
 <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>پرسش:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="مثلا: محصولات کوروش چه شرکت‌هایی را شامل می‌شود؟"
            dir="auto"
            className={
              'mt-1.5 w-full rounded-lg border border-[var(--color-border-default)] ' +
              'bg-[var(--color-surface-subtle)] px-3 py-2 text-[var(--color-text-primary)] ' +
              'placeholder:text-[var(--color-text-muted)] ' +
              'focus:border-[var(--color-accent)] focus:outline-none'
            }
            style={{ fontSize: 'var(--text-body-sm)' }}
            aria-label="پرسش آزمایشی"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className={
            'flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 font-[var(--font-weight-medium)] transition-opacity duration-[var(--duration-150)] ' +
            (query.trim() && !isSearching
              ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:opacity-90'
              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')
          }
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          {isSearching ? (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              جستجو...
            </span>
          ) : (
            'جستجو'
          )}
        </button>
      </div>

      {/* Results */}
      {hasSearched && !isSearching && results.length === 0 && (
        <div className="py-8 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          نتیجه‌ای یافت نشد. عبارت دیگری را امتحان کنید.
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
            {results.length} نتیجه
          </p>
          {results.map((r, i) => (
            <div key={r.chunk.id} className="glass-panel-solid rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)', fontWeight: 'var(--font-weight-semibold)' as any }}>
                    {i + 1}
                  </span>
                  <span className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
                    {r.document.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={
                    'rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' +
                    (r.searchType === 'hybrid'
                      ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]'
                      : r.searchType === 'vector'
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
                        : 'bg-[var(--color-info-100)] text-[var(--color-info-600)]')
                  } style={{ fontSize: 'var(--text-caption-xs)' }}>
                    {r.searchType === 'hybrid' ? 'ترکیبی' : r.searchType === 'vector' ? 'برداری' : 'BM25'}
                  </span>
                  <span className="rounded-full bg-[var(--color-surface-subtle)] px-2 py-0.5 font-mono text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                    {(r.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed" style={{ fontSize: 'var(--text-body-sm)' }} dir="auto">
                {r.chunk.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Settings Tab ---
function SettingsTab({ kb }: { kb: KBDetailType }) {
  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          اطلاعات پایه
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="نام پایگاه" value={kb.name} />
          <FieldRow label="نوع" value={KB_TYPE_LABELS[kb.kbType]} />
          <FieldRow label="وضعیت" value={KB_STATUS_LABELS[kb.processingStatus]} />
          <FieldRow label="مدل امبدینگ" value={kb.embeddingModel} />
          <FieldRow label="تعداد سند" value={String(kb.documentCount)} />
          <FieldRow label="تعداد قطعه" value={kb.chunkCount.toLocaleString('fa-IR')} />
          <FieldRow label="حجم کل" value={formatBytes(kb.totalSizeBytes)} />
          <FieldRow label="NLP فارسی" value={kb.persianNlpEnabled ? 'فعال' : 'غیرفعال'} />
        </div>
      </div>

      {/* Chunking config */}
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          تنظیمات تکه‌تکه‌سازی
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="استراتژی" value={CHUNKING_STRATEGY_LABELS[kb.chunkingStrategy]} />
          <FieldRow label="اندازه قطعه" value={`${kb.chunkSize} توکن`} />
          <FieldRow label="همپوشانی" value={`${kb.chunkOverlap} توکن`} />
          <div>
            <dt className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>نسبت همپوشانی</dt>
            <dd className="mt-1.5">
              <div className="h-2 w-full rounded-full bg-[var(--color-surface-subtle)]">
                <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${(kb.chunkOverlap / kb.chunkSize) * 100}%` }} />
              </div>
              <span className="mt-1 inline-block text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
                {((kb.chunkOverlap / kb.chunkSize) * 100).toFixed(0)}%
              </span>
            </dd>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-[var(--color-danger-500)]/30 bg-[var(--color-danger-500)]/5 p-5 space-y-3">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-danger-500)]" style={{ fontSize: 'var(--text-body-md)' }}>
          منطقه خطر
        </h3>
        <p className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          حذف پایگاه دانش تمام اسناد، قطعات و بردارهای امبدینگ را به صورت دائمی پاک می‌کند. این عمل قابل بازگشت نیست.
        </p>
        <button
          type="button"
          className="rounded-lg border border-[var(--color-danger-500)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-danger-500)] transition-colors hover:bg-[var(--color-danger-500)]/10"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          حذف پایگاه دانش
        </button>
      </div>
    </div>
  );
}

// --- Add Knowledge Card ---
function AddKnowledgeCard() {
  const [textContent, setTextContent] = useState('');

  return (
    <div className="glass-panel-solid rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-4 w-4 text-[var(--color-accent)]" />
        <h2 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>
          افزودن دانش
        </h2>
      </div>
      <Tabs defaultValue="text" dir="rtl">
        <TabsList className="bg-[var(--color-surface-subtle)]">
          <TabsTrigger value="text" className="gap-1.5 data-[state=active]:text-[var(--color-accent)] data-[state=active]:bg-[var(--color-surface-elevated)]">
            <FileText className="h-4 w-4" />
            افزودن متن
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-1.5 data-[state=active]:text-[var(--color-accent)] data-[state=active]:bg-[var(--color-surface-elevated)]">
            <Upload className="h-4 w-4" />
            آپلود فایل
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-4">
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="متن مورد نظر خود را اینجا وارد یا جای‌گذاری کنید..."
            dir="auto"
            className="min-h-[120px] resize-y border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus-visible:ring-[var(--color-accent)]"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              {textContent.length > 0 ? `${textContent.length} کاراکتر` : ''}
            </span>
            <Button
              type="button"
              disabled={!textContent.trim()}
              className="gap-2 bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent)]/90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              <Plus className="h-4 w-4" />
              افزودن به پایگاه دانش
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="file" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border-default)] p-8 transition-colors hover:border-[var(--color-accent)] cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] mb-3">
              <Upload className="h-5 w-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
              فایل‌ها را اینجا بکشید و رها کنید
            </p>
            <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              یا کلیک کنید برای انتخاب فایل
            </p>
            <p className="mt-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)' }}>
              PDF, DOCX, TXT, MD, HTML, CSV, JSON — حداکثر ۵۰ مگابایت
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Shared ---
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</dt>
      <dd className="mt-1 font-[var(--font-weight-medium)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-sm)' }}>{value}</dd>
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

// --- Main ---
export function KBDetail({ kb }: KBDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('documents');

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }} aria-label="مسیر ناوبری">
        <Link href="/knowledge" className="transition-colors hover:text-[var(--color-accent)]">پایگاه دانش</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-primary)]">{kb.name}</span>
      </nav>

      {/* Header */}
      <div className="glass-panel-elevated rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-lg)' }}>
                {kb.name}
              </h1>
              <span className={
                'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' +
                KB_STATUS_COLORS[kb.processingStatus]
              } style={{ fontSize: 'var(--text-caption-xs)' }}>
                {KB_STATUS_LABELS[kb.processingStatus]}
              </span>
              <span className={
                'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' +
                KB_TYPE_COLORS[kb.kbType]
              } style={{ fontSize: 'var(--text-caption-xs)' }}>
                {KB_TYPE_LABELS[kb.kbType]}
              </span>
            </div>
            {kb.description && (
              <p className="mt-2 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>{kb.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              <span>{kb.documentCount} سند</span>
              <span aria-hidden="true">|</span>
              <span>{kb.chunkCount.toLocaleString('fa-IR')} قطعه</span>
              <span aria-hidden="true">|</span>
              <span>{formatBytes(kb.totalSizeBytes)}</span>
              {kb.boundAgentCount > 0 && (
                <>
                  <span aria-hidden="true">|</span>
                  <span className="text-[var(--color-accent)]">{kb.boundAgentCount} دستیار هوشمند متصل</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-opacity hover:opacity-90"
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 8h8m-4-4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            آپلود سند
          </button>
        </div>
      </div>

      {/* Add Knowledge Card */}
      <AddKnowledgeCard />

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-default)] overflow-x-auto" role="tablist" aria-label="بخش‌های جزئیات پایگاه دانش">
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
                (isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')
              }
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              {tab.label}
              {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === 'documents' && <DocumentsTab documents={kb.documents} />}
        {activeTab === 'chunks' && <ChunksTab chunks={kb.recentChunks} totalChunks={kb.chunkCount} />}
        {activeTab === 'search' && <SearchTestTab kbName={kb.name} />}
        {activeTab === 'settings' && <SettingsTab kb={kb} />}
      </div>
    </div>
  );
}
