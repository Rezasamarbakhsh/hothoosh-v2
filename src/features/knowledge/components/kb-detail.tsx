'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FileText, Upload, Plus, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

// --- Toast notification ---
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);
  const colorMap = { success: 'bg-[var(--color-success-600)]', error: 'bg-[var(--color-error-500)]', info: 'bg-[var(--color-primary-500)]' };
  return (
    <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-[var(--color-text-inverse)] shadow-lg transition-opacity duration-300 ${colorMap[type]} ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setVisible(false)}>
      <div className='flex items-center gap-2'>
        {type === 'success' && <Check className='h-4 w-4' />}
        {type === 'error' && <X className='h-4 w-4' />}
        {type === 'info' && <FileText className='h-4 w-4' />}
        <span style={{ fontSize: 'var(--text-body-sm)' }}>{message}</span>
      </div>
    </div>
  );
}

// --- Confirm Dialog ---
function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel = 'حذف', variant = 'danger' }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; onConfirm: () => void; confirmLabel?: string; variant?: 'danger' | 'primary' }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>{title}</DialogTitle>
          <DialogDescription className='text-[var(--color-text-secondary)]'>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>انصراف</Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={() => { onConfirm(); onOpenChange(false); }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Documents Tab ---
function DocumentsTab({ documents, onUploadClick }: { documents: KnowledgeDocument[]; onUploadClick: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    }
  }

  return (
    <div className="space-y-3">
      {/* Upload area */}
      <div
        className={`flex items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer ${dragOver ? 'border-[var(--color-primary-400)] bg-[var(--color-primary-50)]' : 'border-[var(--color-border-default)] hover:border-[var(--color-accent)]'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type='file' multiple accept='.pdf,.docx,.txt,.md,.html,.csv,.json' className='hidden' onChange={handleFileSelect} />
        <div className="text-center">
          <Upload className={`mx-auto h-8 w-8 ${dragOver ? 'text-[var(--color-primary-400)]' : 'text-[var(--color-text-muted)]'}`} />
          <p className="mt-2 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            فایل‌ها را اینجا بکشید یا کلیک کنید
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
            PDF, DOCX, TXT, MD, HTML, CSV, JSON
          </p>
        </div>
      </div>

      {/* Show newly uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="rounded-xl border border-[var(--color-success-500)]/30 bg-[var(--color-success-50)] p-4">
          <p className="font-[var(--font-weight-medium)] text-[var(--color-success-600)]" style={{ fontSize: 'var(--text-body-sm)' }}>
            {uploadedFiles.length} فایل جدید افزوده شد
          </p>
          <div className="mt-2 space-y-1">
            {uploadedFiles.map((f, i) => (
              <p key={i} className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{f}</p>
            ))}
          </div>
        </div>
      )}

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
                <span className="text-[var(--color-error-500)]" style={{ fontSize: 'var(--text-caption-xs)' }} title={doc.errorMessage}>
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
        icon="۱"
        title="قطعه‌ای وجود ندارد"
        description="پس از پردازش موفق اسناد، قطعات اینجا نمایش داده می‌شوند."
      />
    );
  }
  const displayChunks = chunks;
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
    setTimeout(() => {
      setResults(MOCK_SEARCH_RESULTS);
      setIsSearching(false);
    }, 1200);
  }, [query, isSearching]);

  return (
    <div className="space-y-6">
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
          با وارد کردن یک پرسش، کیفیت بازیابی پایگاه دانش «{kbName}» را آزمایش کنید.
        </p>
      </div>
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <span className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>پرسش:</span>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} placeholder="مثلا: محصولات کوروش چه شرکت‌هایی را شامل می‌شود؟" dir="auto" className={'mt-1.5 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none'} style={{ fontSize: 'var(--text-body-sm)' }} aria-label="پرسش آزمایشی" />
        </div>
        <button type="button" onClick={handleSearch} disabled={!query.trim() || isSearching} className={'flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 font-[var(--font-weight-medium)] transition-opacity duration-[var(--duration-150)] ' + (query.trim() && !isSearching ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:opacity-90' : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]')} style={{ fontSize: 'var(--text-body-sm)' }}>
          {isSearching ? (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              جستجو...
            </span>
          ) : 'جستجو'}
        </button>
      </div>
      {hasSearched && !isSearching && results.length === 0 && (
        <div className="py-8 text-center text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          نتیجه‌ای یافت نشد. عبارت دیگری را امتحان کنید.
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{results.length} نتیجه</p>
          {results.map((r, i) => (
            <div key={r.chunk.id} className="glass-panel-solid rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-xs)', fontWeight: 600 as any }}>{i + 1}</span>
                  <span className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-caption-sm)' }}>{r.document.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={'rounded-full px-2 py-0.5 font-[var(--font-weight-medium)] ' + (r.searchType === 'hybrid' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' : r.searchType === 'vector' ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]' : 'bg-[var(--color-info-100)] text-[var(--color-info-600)]')} style={{ fontSize: 'var(--text-caption-xs)' }}>
                    {r.searchType === 'hybrid' ? 'ترکیبی' : r.searchType === 'vector' ? 'برداری' : 'BM25'}
                  </span>
                  <span className="rounded-full bg-[var(--color-surface-subtle)] px-2 py-0.5 font-mono text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-xs)' }}>{(r.score * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed" style={{ fontSize: 'var(--text-body-sm)' }} dir="auto">{r.chunk.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Settings Tab ---
function SettingsTab({ kb, onDelete }: { kb: KBDetailType; onDelete: () => void }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>اطلاعات پایه</h3>
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
      <div className="glass-panel-solid rounded-xl p-5 space-y-5">
        <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>تنظیمات تکه‌تکه‌سازی</h3>
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
              <span className="mt-1 inline-block text-[var(--color-accent)]" style={{ fontSize: 'var(--text-caption-xs)' }}>{((kb.chunkOverlap / kb.chunkSize) * 100).toFixed(0)}%</span>
            </dd>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--color-error-500)]/30 bg-[var(--color-error-500)]/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--color-error-500)]" />
          <h3 className="font-[var(--font-weight-semibold)] text-[var(--color-error-500)]" style={{ fontSize: 'var(--text-body-md)' }}>منطقه خطر</h3>
        </div>
        <p className="text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>
          حذف پایگاه دانش تمام اسناد، قطعات و بردارهای امبدینگ را به صورت دائمی پاک می‌کند.
        </p>
        <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-error-500)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-error-500)] transition-colors hover:bg-[var(--color-error-500)]/10" style={{ fontSize: 'var(--text-body-sm)' }}>
          <Trash2 className="h-4 w-4" />
          حذف پایگاه دانش
        </button>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف پایگاه دانش"
        description={`آیا از حذف دائمی «${kb.name}» اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        onConfirm={onDelete}
      />
    </div>
  );
}

// --- Add Knowledge Card ---
function AddKnowledgeCard({ onTextSubmit, onFileUpload }: { onTextSubmit: (text: string) => void; onFileUpload: (files: File[]) => void }) {
  const [textContent, setTextContent] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files);
      setToast({ message: `${files.length} فایل با موفقیت افزوده شد`, type: 'success' });
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
      setToast({ message: `${files.length} فایل با موفقیت افزوده شد`, type: 'success' });
    }
  }

  function handleTextSubmit() {
    if (!textContent.trim()) return;
    onTextSubmit(textContent);
    setToast({ message: 'متن با موفقیت افزوده شد', type: 'success' });
    setTextContent('');
  }

  return (
    <div className="glass-panel-solid rounded-xl p-5">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-4 w-4 text-[var(--color-accent)]" />
        <h2 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-body-md)' }}>افزودن دانش</h2>
      </div>
      <Tabs defaultValue="text" dir="rtl" onValueChange={(v) => setActiveTab(v as 'text' | 'file')}>
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
              onClick={handleTextSubmit}
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
          <input ref={fileInputRef} type='file' multiple accept='.pdf,.docx,.txt,.md,.html,.csv,.json' className='hidden' onChange={handleFileSelect} />
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer ${dragOver ? 'border-[var(--color-primary-400)] bg-[var(--color-primary-50)]' : 'border-[var(--color-border-default)] hover:border-[var(--color-accent)]'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleted, setDeleted] = useState(false);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  if (deleted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {toast && <Toast message={toast.message} type={toast.type} />}
        <Check className="h-12 w-12 text-[var(--color-success-500)]" />
        <p className="mt-4 font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-md)' }}>
          پایگاه دانش حذف شد
        </p>
        <Link href='/knowledge' className='mt-4 text-[var(--color-primary-400)] hover:underline' style={{ fontSize: 'var(--text-body-sm)' }}>
          بازگشت به لیست پایگاه دانش
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
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
              <h1 className="font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-heading-lg)' }}>{kb.name}</h1>
              <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' + KB_STATUS_COLORS[kb.processingStatus]} style={{ fontSize: 'var(--text-caption-xs)' }}>{KB_STATUS_LABELS[kb.processingStatus]}</span>
              <span className={'inline-flex items-center rounded-full px-2.5 py-0.5 font-[var(--font-weight-medium)] ' + KB_TYPE_COLORS[kb.kbType]} style={{ fontSize: 'var(--text-caption-xs)' }}>{KB_TYPE_LABELS[kb.kbType]}</span>
            </div>
            {kb.description && <p className="mt-2 text-[var(--color-text-secondary)]" style={{ fontSize: 'var(--text-body-sm)' }}>{kb.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]" style={{ fontSize: 'var(--text-caption-sm)' }}>
              <span>{kb.documentCount} سند</span>
              <span aria-hidden="true">|</span>
              <span>{kb.chunkCount.toLocaleString('fa-IR')} قطعه</span>
              <span aria-hidden="true">|</span>
              <span>{formatBytes(kb.totalSizeBytes)}</span>
              {kb.boundAgentCount > 0 && (<><span aria-hidden="true">|</span><span className="text-[var(--color-accent)]">{kb.boundAgentCount} دستیار هوشمند متصل</span></>)}
            </div>
          </div>
          <button type="button" onClick={() => setActiveTab('documents')} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-opacity hover:opacity-90" style={{ fontSize: 'var(--text-body-sm)' }}>
            <Upload className="h-4 w-4" />
            آپلود سند
          </button>
        </div>
      </div>

      {/* Add Knowledge Card */}
      <AddKnowledgeCard
        onTextSubmit={(text) => showToast(`متن با موفقیت افزوده شد (${text.length} کاراکتر)`)}
        onFileUpload={(files) => showToast(`${files.length} فایل با موفقیت آپلود شد`)}
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-default)] overflow-x-auto" role="tablist" aria-label="بخش‌های جزئیات پایگاه دانش">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => setActiveTab(tab.id)} className={'relative whitespace-nowrap px-4 py-3 font-[var(--font-weight-medium)] transition-colors duration-[var(--duration-150)] ' + (isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')} style={{ fontSize: 'var(--text-body-sm)' }}>
              {tab.label}
              {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === 'documents' && <DocumentsTab documents={kb.documents} onUploadClick={() => {}} />}
        {activeTab === 'chunks' && <ChunksTab chunks={kb.recentChunks} totalChunks={kb.chunkCount} />}
        {activeTab === 'search' && <SearchTestTab kbName={kb.name} />}
        {activeTab === 'settings' && <SettingsTab kb={kb} onDelete={() => { setDeleted(true); showToast('پایگاه دانش با موفقیت حذف شد'); }} />}
      </div>
    </div>
  );
}
