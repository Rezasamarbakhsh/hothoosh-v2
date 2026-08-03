// Knowledge Base Types — Feature 5
// Per PRD FR-KNOW-001 through FR-KNOW-007
// Per Database §7 (knowledge_bases, knowledge_documents, knowledge_chunks)

export type KBType = 'document' | 'web' | 'api' | 'database' | 'hybrid';

export type KBProcessingStatus = 'empty' | 'processing' | 'ready' | 'failed';

export type DocumentProcessingStatus =
  | 'uploaded'
  | 'extracting'
  | 'chunking'
  | 'embedding'
  | 'indexed'
  | 'ready'
  | 'failed';

export type ChunkingStrategy = 'fixed_size' | 'semantic' | 'paragraph' | 'heading_based';

export type DocumentFileType = 'pdf' | 'docx' | 'txt' | 'md' | 'html' | 'csv' | 'json';

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  kbType: KBType;
  chunkingStrategy: ChunkingStrategy;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  persianNlpEnabled: boolean;
  documentCount: number;
  chunkCount: number;
  totalSizeBytes: number;
  processingStatus: KBProcessingStatus;
  createdAt: string;
  updatedAt: string;
  boundAgentCount: number;
}

export interface KnowledgeDocument {
  id: string;
  knowledgeBaseId: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  processingStatus: DocumentProcessingStatus;
  errorMessage: string | null;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  knowledgeBaseId: string;
  content: string;
  tokenCount: number;
  chunkIndex: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  document: { id: string; fileName: string };
  score: number;
  searchType: 'vector' | 'bm25' | 'hybrid';
}

export interface KnowledgeBaseDetail extends KnowledgeBase {
 documents: KnowledgeDocument[];
 recentChunks: KnowledgeChunk[];
}

// UI types
export type KBStatusFilter = KBProcessingStatus | 'all';
export type KBTypeFilter = KBType | 'all';
export type KBSortField = 'name' | 'document_count' | 'chunk_count' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface KBFilters {
  status: KBStatusFilter;
  type: KBTypeFilter;
  search: string;
  sortField: KBSortField;
  sortOrder: SortOrder;
}

// Persian labels
export const KB_TYPE_LABELS: Record<KBType, string> = {
  document: 'سند',
  web: 'وب',
  api: 'API',
  database: 'پایگاه داده',
  hybrid: 'ترکیبی',
};

export const KB_STATUS_LABELS: Record<KBProcessingStatus, string> = {
  empty: 'خالی',
  processing: 'در حال پردازش',
  ready: 'آماده',
  failed: 'خطا',
};

export const KB_TYPE_COLORS: Record<KBType, string> = {
  document: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  web: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
  api: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
  database: 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]',
  hybrid: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
};

export const KB_STATUS_COLORS: Record<KBProcessingStatus, string> = {
  empty: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
  processing: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
  ready: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  failed: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
};

export const DOC_STATUS_LABELS: Record<DocumentProcessingStatus, string> = {
  uploaded: 'آپلود شده',
  extracting: 'در حال استخراج',
  chunking: 'در حال تکه‌تکه‌سازی',
  embedding: 'در حال امبدینگ',
  indexed: 'ایندکس شده',
  ready: 'آماده',
  failed: 'خطا',
};

export const DOC_STATUS_COLORS: Record<DocumentProcessingStatus, string> = {
  uploaded: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
  extracting: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
  chunking: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
  embedding: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
  indexed: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  ready: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  failed: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
};

export const CHUNKING_STRATEGY_LABELS: Record<ChunkingStrategy, string> = {
  fixed_size: 'ثابت',
  semantic: 'معنایی',
  paragraph: 'پاراگراف',
  heading_based: 'بر اساس عنوان',
};

// File type icons
export const FILE_TYPE_ICONS: Record<DocumentFileType, string> = {
  pdf: '\u{1F4C4}',
  docx: '\u{1F4DD}',
  txt: '\u{1F4C4}',
  md: '\u{1F4C4}',
  html: '\u{1F310}',
  csv: '\u{1F4CA}',
  json: '\u{1F4CB}',
};

// --- Mock Data ---

export const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: 'مستندات محصول',
    description: 'مستندات فنی و راهنمای کاربری تمامی محصولات شرکت. شامل API Reference، راهنمای نصب و عیب‌یابی.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 24,
    chunkCount: 1847,
    totalSizeBytes: 52428800,
    processingStatus: 'ready',
    createdAt: '2025-11-10T08:00:00Z',
    updatedAt: '2026-07-20T14:30:00Z',
    boundAgentCount: 3,
  },
  {
    id: 'kb-2',
    name: 'سوالات متداول',
    description: 'مجموعه سوالات متداول مشتریان و پاسخ‌های استاندارد بخش پشتیبانی.',
    kbType: 'document',
    chunkingStrategy: 'paragraph',
    chunkSize: 256,
    chunkOverlap: 50,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 3,
    chunkCount: 342,
    totalSizeBytes: 2097152,
    processingStatus: 'ready',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-06-15T09:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-3',
    name: 'راهنمای نصب',
    description: 'راهنمای گام‌به‌گام نصب و راه‌اندازی محصولات روی سکوهای مختلف (Linux, Windows, Docker).',
    kbType: 'document',
    chunkingStrategy: 'fixed_size',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 8,
    chunkCount: 567,
    totalSizeBytes: 10485760,
    processingStatus: 'ready',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-07-25T16:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-4',
    name: 'تعاریف شاخص‌ها',
    description: 'تعاریف و فرمول‌های محاسبه تمامی شاخص‌های کلیدی عملکرد (KPI) مورد استفاده در گزارش‌های تحلیلی.',
    kbType: 'document',
    chunkingStrategy: 'semantic',
    chunkSize: 384,
    chunkOverlap: 75,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 5,
    chunkCount: 203,
    totalSizeBytes: 3145728,
    processingStatus: 'ready',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-07-28T11:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-5',
    name: 'مستندات API',
    description: 'مستندات کامل API داخلی و خارجی شامل نقاط پایانی، پارامترها و نمونه پاسخ‌ها.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 768,
    chunkOverlap: 150,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: false,
    documentCount: 12,
    chunkCount: 0,
    totalSizeBytes: 15728640,
    processingStatus: 'processing',
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-6',
    name: 'الگوهای کد',
    description: 'الگوهای رایج برنامه‌نویسی و نمونه کدها برای پروژه‌های سازمانی.',
    kbType: 'document',
    chunkingStrategy: 'fixed_size',
    chunkSize: 1024,
    chunkOverlap: 200,
    embeddingModel: 'text-embedding-3-large',
    persianNlpEnabled: false,
    documentCount: 0,
    chunkCount: 0,
    totalSizeBytes: 0,
    processingStatus: 'empty',
    createdAt: '2026-07-30T10:00:00Z',
    updatedAt: '2026-08-01T15:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-7',
    name: 'گزارش‌های بازار',
    description: 'گزارش‌های تحلیل بازار و رقبا از منابع وب. به صورت خودکار از وب استخراج شده‌اند.',
    kbType: 'web',
    chunkingStrategy: 'semantic',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 45,
    chunkCount: 2340,
    totalSizeBytes: 83886080,
    processingStatus: 'ready',
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-08-01T20:00:00Z',
    boundAgentCount: 1,
  },
];

export const MOCK_KB_DETAILS: Record<string, KnowledgeBaseDetail> = {
  'kb-1': {
    ...MOCK_KNOWLEDGE_BASES[0],
    documents: [
      { id: 'doc-1', knowledgeBaseId: 'kb-1', fileName: 'API-Reference-v3.pdf', fileType: 'pdf', fileSize: 8388608, processingStatus: 'ready', errorMessage: null, chunkCount: 234, createdAt: '2025-11-10T08:00:00Z', updatedAt: '2026-06-20T14:00:00Z' },
      { id: 'doc-2', knowledgeBaseId: 'kb-1', fileName: 'Installation-Guide.md', fileType: 'md', fileSize: 209715, processingStatus: 'ready', errorMessage: null, chunkCount: 67, createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-05-10T09:00:00Z' },
      { id: 'doc-3', knowledgeBaseId: 'kb-1', fileName: 'Troubleshooting.pdf', fileType: 'pdf', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 189, createdAt: '2025-12-01T12:00:00Z', updatedAt: '2026-07-20T14:30:00Z' },
      { id: 'doc-4', knowledgeBaseId: 'kb-1', fileName: 'Product-Overview.docx', fileType: 'docx', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 156, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-07-15T11:00:00Z' },
      { id: 'doc-5', knowledgeBaseId: 'kb-1', fileName: 'Release-Notes-v4.pdf', fileType: 'pdf', fileSize: 1048576, processingStatus: 'embedding', errorMessage: null, chunkCount: 0, createdAt: '2026-08-01T10:00:00Z', updatedAt: '2026-08-02T10:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-1', documentId: 'doc-1', knowledgeBaseId: 'kb-1', content: 'نقطه پایانی POST /api/v1/chat/sessions برای ایجاد یک جلسه گفتگوی جدید استفاده می‌شود. این نقطه پایانی یک درخواست JSON با فیلدهای agent_id و optional_message دریافت می‌کند.', tokenCount: 45, chunkIndex: 0, metadata: { heading: 'API Reference > Chat Sessions' }, createdAt: '2025-11-10T08:10:00Z' },
      { id: 'chunk-2', documentId: 'doc-1', knowledgeBaseId: 'kb-1', content: 'پاسخ شامل شناسه جلسه، وضعیت و لیست پیام‌های اولیه است. در صورت عدم ارائه agent_id، خطای 400 برگردانده می‌شود.', tokenCount: 32, chunkIndex: 1, metadata: { heading: 'API Reference > Chat Sessions' }, createdAt: '2025-11-10T08:10:00Z' },
    ],
  },
  'kb-2': {
    ...MOCK_KNOWLEDGE_BASES[1],
    documents: [
      { id: 'doc-6', knowledgeBaseId: 'kb-2', fileName: 'FAQ-Support.json', fileType: 'json', fileSize: 524288, processingStatus: 'ready', errorMessage: null, chunkCount: 120, createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-06-15T09:00:00Z' },
      { id: 'doc-7', knowledgeBaseId: 'kb-2', fileName: 'FAQ-Billing.json', fileType: 'json', fileSize: 314572, processingStatus: 'ready', errorMessage: null, chunkCount: 89, createdAt: '2025-12-05T10:00:00Z', updatedAt: '2026-06-15T09:00:00Z' },
      { id: 'doc-8', knowledgeBaseId: 'kb-2', fileName: 'FAQ-Technical.json', fileType: 'json', fileSize: 419430, processingStatus: 'ready', errorMessage: null, chunkCount: 133, createdAt: '2025-12-10T10:00:00Z', updatedAt: '2026-06-15T09:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-3', documentId: 'doc-6', knowledgeBaseId: 'kb-2', content: 'سوال: آیا امکان تغییر طرح اشتراک در میانه دوره وجود دارد؟ پاسخ: بله، از بخش تنظیمات > اشتراک می‌توانید طرح خود را ارتقا دهید. تفاوت هزینه به صورت روزشمار محاسبه می‌شود.', tokenCount: 38, chunkIndex: 12, metadata: { category: 'billing' }, createdAt: '2025-12-01T10:10:00Z' },
    ],
  },
  'kb-3': {
    ...MOCK_KNOWLEDGE_BASES[2],
    documents: [
      { id: 'doc-9', knowledgeBaseId: 'kb-3', fileName: 'Install-Linux.md', fileType: 'md', fileSize: 1048576, processingStatus: 'ready', errorMessage: null, chunkCount: 78, createdAt: '2026-01-15T12:00:00Z', updatedAt: '2026-07-25T16:00:00Z' },
      { id: 'doc-10', knowledgeBaseId: 'kb-3', fileName: 'Install-Docker.md', fileType: 'md', fileSize: 1572864, processingStatus: 'ready', errorMessage: null, chunkCount: 112, createdAt: '2026-02-01T12:00:00Z', updatedAt: '2026-07-25T16:00:00Z' },
    { id: 'doc-11', knowledgeBaseId: 'kb-3', fileName: 'Install-Windows.pdf', fileType: 'pdf', fileSize: 2097152, processingStatus: 'failed', errorMessage: 'فرمت PDF رمزگذاری شده پشتیبانی نمی‌شود.', chunkCount: 0, createdAt: '2026-03-10T12:00:00Z', updatedAt: '2026-07-25T16:00:00Z' },
    ],
    recentChunks: [],
  },
  'kb-4': {
    ...MOCK_KNOWLEDGE_BASES[3],
    documents: [
      { id: 'doc-12', knowledgeBaseId: 'kb-4', fileName: 'KPI-Definitions.csv', fileType: 'csv', fileSize: 1048576, processingStatus: 'ready', errorMessage: null, chunkCount: 203, createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-07-28T11:00:00Z' },
    ],
    recentChunks: [],
  },
  'kb-5': {
    ...MOCK_KNOWLEDGE_BASES[4],
    documents: [
      { id: 'doc-13', knowledgeBaseId: 'kb-5', fileName: 'Internal-API-v2.pdf', fileType: 'pdf', fileSize: 4194304, processingStatus: 'embedding', errorMessage: null, chunkCount: 0, createdAt: '2026-07-25T14:00:00Z', updatedAt: '2026-08-02T10:00:00Z' },
      { id: 'doc-14', knowledgeBaseId: 'kb-5', fileName: 'External-API-v1.pdf', fileType: 'pdf', fileSize: 6291456, processingStatus: 'chunking', errorMessage: null, chunkCount: 0, createdAt: '2026-07-26T14:00:00Z', updatedAt: '2026-08-02T10:00:00Z' },
      { id: 'doc-15', knowledgeBaseId: 'kb-5', fileName: 'Webhook-Docs.md', fileType: 'md', fileSize: 524288, processingStatus: 'extracting', errorMessage: null, chunkCount: 0, createdAt: '2026-07-28T14:00:00Z', updatedAt: '2026-08-02T10:00:00Z' },
    ],
    recentChunks: [],
  },
  'kb-6': {
    ...MOCK_KNOWLEDGE_BASES[5],
    documents: [],
    recentChunks: [],
  },
  'kb-7': {
    ...MOCK_KNOWLEDGE_BASES[6],
    documents: [],
    recentChunks: [],
  },
};

// Mock search results
export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    chunk: { id: 'sr-1', documentId: 'doc-1', knowledgeBaseId: 'kb-1', content: 'نقطه پایانی POST /api/v1/chat/sessions برای ایجاد یک جلسه گفتگوی جدید استفاده می‌شود.', tokenCount: 20, chunkIndex: 0, metadata: { heading: 'Chat Sessions' }, createdAt: '2025-11-10T08:10:00Z' },
    document: { id: 'doc-1', fileName: 'API-Reference-v3.pdf' },
    score: 0.94,
    searchType: 'hybrid',
  },
  {
    chunk: { id: 'sr-2', documentId: 'doc-9', knowledgeBaseId: 'kb-3', content: 'برای نصب روی لینوکس ابتدا باید وابستگی‌های مورد نیاز را با دستور apt-get install نصب کنید.', tokenCount: 18, chunkIndex: 3, metadata: { heading: 'Linux Installation' }, createdAt: '2026-01-15T12:10:00Z' },
    document: { id: 'doc-9', fileName: 'Install-Linux.md' },
    score: 0.87,
    searchType: 'hybrid',
  },
  {
    chunk: { id: 'sr-3', documentId: 'doc-6', knowledgeBaseId: 'kb-2', content: 'امکان تغییر طرح اشتراک در میانه دوره وجود دارد. تفاوت هزینه به صورت روزشمار محاسبه می‌شود.', tokenCount: 16, chunkIndex: 12, metadata: {}, createdAt: '2025-12-01T10:10:00Z' },
    document: { id: 'doc-6', fileName: 'FAQ-Support.json' },
    score: 0.79,
    searchType: 'vector',
  },
];
