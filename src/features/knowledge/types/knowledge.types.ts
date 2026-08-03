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
    id: 'kb-hatro',
    name: 'کسب و کار هاترو',
    description: 'هاترو، شرکت مادر گروه شرکت‌های توسعه کشت و صنعت کوروش، زیرمجموعه گروه سرمایه‌گذاری کوروش و عضوی از خانواده بزرگ گروه صنعتی گلرنگ. دربرگیرنده ۹ شرکت فعال در صنایع غذایی ایران و بازارهای جهانی.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 15,
    chunkCount: 2340,
    totalSizeBytes: 83886080,
    processingStatus: 'ready',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-koush-dryfruits',
    name: 'صنعت خشکبار و حبوبات کوروش',
    description: 'تولیدکننده خشکبار، حبوبات، غلات، سویا، آجیل و تنقلات با گواهینامه ایزو ۲۲۰۰۰. صادرات به بیش از ۵۰ کشور در ۵ قاره.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 12,
    chunkCount: 1560,
    totalSizeBytes: 47185920,
    processingStatus: 'ready',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-02T09:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-koush-rice',
    name: 'کشت و صنعت برنج کوروش',
    description: 'تولید، واردات و بسته‌بندی انواع برنج داخلی و خارجی با ۶ برند تجاری. در حال احداث بزرگ‌ترین مجتمع فرآوری برنج در مازندران.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 8,
    chunkCount: 890,
    totalSizeBytes: 33554432,
    processingStatus: 'ready',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-07-28T16:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-proushat',
    name: 'فرآورده‌های غذایی پروشات کوروش',
    description: 'تولیدکننده تخصصی سس، رب گوجه‌فرنگی، سرکه، عرقیات گیاهی، گلاب و پودر ژله. مجتمع صنعتی ۸۰ هزار مترمربعی در تاکستان قزوین.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 10,
    chunkCount: 1200,
    totalSizeBytes: 39845888,
    processingStatus: 'ready',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-01T11:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-golbarg',
    name: 'گلبرگ غذایی کوروش',
    description: 'تولید، تامین و عرضه تخصصی محصولات غذایی با ماندگاری بالا: زیتون، خیارشور، عسل، کنسرو ماهی تُن و مرباها.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 9,
    chunkCount: 1100,
    totalSizeBytes: 36700160,
    processingStatus: 'ready',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-07-30T14:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-basti-arin',
    name: 'هستی آرین تامین',
    description: 'تولید و عرضه چای (ایرانی و وارداتی)، قهوه فوری، نوشیدنی‌های ویژه، ادویه و دمنوش‌های گیاهی. بیش از ۸۴ قلم محصول در ۵ برند.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 14,
    chunkCount: 1780,
    totalSizeBytes: 54525952,
    processingStatus: 'ready',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-tala-nab',
    name: 'طلای ناب کوروش',
    description: 'تولید و عرضه خرما، فرآورده‌های آن، زعفران و نبات. بیش از ۳۰ قلم کالا با بسته‌بندی لوکس برای بازارهای جهانی.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 7,
    chunkCount: 650,
    totalSizeBytes: 23068672,
    processingStatus: 'ready',
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-07-29T15:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-pakban',
    name: 'صنایع غذایی پاکبان',
    description: 'یکی از باتجربه‌ترین تولیدکنندگان لبنی ایران. بیش از ۸۰ قلم کالا با نام تجاری پاکبان و نوشیدنی میوه‌ای ماکسیتو.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 11,
    chunkCount: 1450,
    totalSizeBytes: 50331648,
    processingStatus: 'ready',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-08-01T16:00:00Z',
    boundAgentCount: 1,
  },
  {
    id: 'kb-koush-protein',
    name: 'فرآورده‌های پروتئینی کوروش',
    description: 'عرضه انواع محصولات پروتئینی، نیمه‌آماده، منجمد و فرآوری‌شده با زنجیره خلق ارزش نوآورانه و بسته‌بندی مدرن.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 6,
    chunkCount: 0,
    totalSizeBytes: 18874368,
    processingStatus: 'processing',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-08-02T08:00:00Z',
    boundAgentCount: 0,
  },
  {
    id: 'kb-koush-fruit',
    name: 'صنعت میوه کوروش',
    description: 'تازه‌ترین عضو گروه شرکت‌های هاترو. در دورنمای فعالیت در زمینه میوه، سبزی و صیفی‌جات تازه، خشک‌شده، منجمد و فرآوری‌شده.',
    kbType: 'document',
    chunkingStrategy: 'heading_based',
    chunkSize: 512,
    chunkOverlap: 100,
    embeddingModel: 'text-embedding-3-small',
    persianNlpEnabled: true,
    documentCount: 0,
    chunkCount: 0,
    totalSizeBytes: 0,
    processingStatus: 'empty',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-02T12:00:00Z',
    boundAgentCount: 0,
  },
];

export const MOCK_KB_DETAILS: Record<string, KnowledgeBaseDetail> = {
  'kb-hatro': {
    ...MOCK_KNOWLEDGE_BASES[0],
    documents: [
      { id: 'doc-h-1', knowledgeBaseId: 'kb-hatro', fileName: 'Hatro-Overview.pdf', fileType: 'pdf', fileSize: 8388608, processingStatus: 'ready', errorMessage: null, chunkCount: 312, createdAt: '2026-01-05T08:00:00Z', updatedAt: '2026-07-20T14:00:00Z' },
      { id: 'doc-h-2', knowledgeBaseId: 'kb-hatro', fileName: 'ساختار-گروه-هاترو.docx', fileType: 'docx', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 198, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-07-15T09:00:00Z' },
      { id: 'doc-h-3', knowledgeBaseId: 'kb-hatro', fileName: 'گزارش-عملکرد-سالانه-۱۴۰۴.md', fileType: 'md', fileSize: 2097152, processingStatus: 'ready', errorMessage: null, chunkCount: 245, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-08-01T14:30:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-h-1', documentId: 'doc-h-1', knowledgeBaseId: 'kb-hatro', content: 'هاترو (گروه شرکت‌های توسعه کشت و صنعت کوروش)، به عنوان زیرمجموعه گروه سرمایه‌گذاری کوروش و عضوی از خانواده بزرگ گروه صنعتی گلرنگ، دربرگیرنده مجموعه‌ای از شرکت‌های توانمند در تولید، تأمین، فرآوری، بسته‌بندی و عرضه محصولات غذایی در ایران و بازارهای جهانی است. این شرکت‌ها بیش از ۵۰۰ قلم کالا را در حدود ۵۰ رسته محصولی تولید و با بیش از ۲۰ برند به بازارهای داخلی و خارجی عرضه می‌کنند.', tokenCount: 342, chunkIndex: 0, metadata: { heading: 'معرفی هاترو' }, createdAt: '2026-01-05T08:10:00Z' },
      { id: 'chunk-h-2', documentId: 'doc-h-1', knowledgeBaseId: 'kb-hatro', content: 'گروه شرکت‌های هاترو متشکل از ۹ شرکت تخصصی فعال در حوزه‌های خشکبار و حبوبات، برنج، سس و رب، محصولات با ماندگاری بالا، چای و قهوه، خرما و زعفران، لبنیات، محصولات پروتئینی و میوه و سبزیجات است. هر یک از این شرکت‌ها با تمرکز بر کیفیت، نوآوری و صادرات، نقشی کلیدی در زنجیره تأمین غذایی کشور و منطقه ایفا می‌کنند.', tokenCount: 298, chunkIndex: 1, metadata: { heading: 'ساختار گروه' }, createdAt: '2026-01-05T08:10:00Z' },
    ],
  },
  'kb-koush-dryfruits': {
    ...MOCK_KNOWLEDGE_BASES[1],
    documents: [
      { id: 'doc-df-1', knowledgeBaseId: 'kb-koush-dryfruits', fileName: 'معرفی-خشکبار-کوروش.pdf', fileType: 'pdf', fileSize: 5242880, processingStatus: 'ready', errorMessage: null, chunkCount: 287, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-08-02T09:00:00Z' },
      { id: 'doc-df-2', knowledgeBaseId: 'kb-koush-dryfruits', fileName: 'گواهینامه-ایزو-۲۲۰۰۰.pdf', fileType: 'pdf', fileSize: 2097152, processingStatus: 'ready', errorMessage: null, chunkCount: 95, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-07-20T09:00:00Z' },
      { id: 'doc-df-3', knowledgeBaseId: 'kb-koush-dryfruits', fileName: 'فهرست-محصولات-صادراتی.md', fileType: 'md', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 210, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-07-28T11:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-df-1', documentId: 'doc-df-1', knowledgeBaseId: 'kb-koush-dryfruits', content: 'شرکت صنعت خشکبار و حبوبات کوروش، فعالیت خود را با تولید گروه‌های محصولی خشکبار، حبوبات، غلات و سویا بسته‌بندی‌شده، آجیل و تنقلات آغاز کرد. این شرکت با به‌کارگیری تجهیزات صنعتی و آزمایشگاهی روزآمد، کنترل‌های دقیق و سخت‌گیرانه‌ای بر کیفیت و سلامت محصولات خود اعمال کرده و رویکرد نوینی را در طراحی و بسته‌بندی به کار گرفته است.', tokenCount: 310, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-01-10T10:10:00Z' },
      { id: 'chunk-df-2', documentId: 'doc-df-1', knowledgeBaseId: 'kb-koush-dryfruits', content: 'به پشتوانه همین رویکرد و روش، خشکبار و حبوبات کوروش موفق به دریافت بالاترین استاندارد کیفیت محصولات غذایی یعنی ایزو ۲۲۰۰۰ شده است و محصولات خود را به ده‌ها کشور در ۵ قاره جهان صادر می‌کند. این شرکت با دارا بودن خطوط تولید مدرن و کنترل کیفیت چندمرحله‌ای، توانسته جایگاه ویژه‌ای در بازارهای داخلی و بین‌المللی کسب کند.', tokenCount: 285, chunkIndex: 1, metadata: { heading: 'استانداردها و صادرات' }, createdAt: '2026-01-10T10:10:00Z' },
    ],
  },
  'kb-koush-rice': {
    ...MOCK_KNOWLEDGE_BASES[2],
    documents: [
      { id: 'doc-r-1', knowledgeBaseId: 'kb-koush-rice', fileName: 'معرفی-برنج-کوروش.pdf', fileType: 'pdf', fileSize: 6291456, processingStatus: 'ready', errorMessage: null, chunkCount: 198, createdAt: '2026-01-20T08:00:00Z', updatedAt: '2026-07-28T16:00:00Z' },
      { id: 'doc-r-2', knowledgeBaseId: 'kb-koush-rice', fileName: 'برندها-و-محصولات.docx', fileType: 'docx', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 142, createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-07-25T14:00:00Z' },
      { id: 'doc-r-3', knowledgeBaseId: 'kb-koush-rice', fileName: 'طرح-توسعه-مازندران.md', fileType: 'md', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 230, createdAt: '2026-03-01T08:00:00Z', updatedAt: '2026-07-30T11:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-r-1', documentId: 'doc-r-1', knowledgeBaseId: 'kb-koush-rice', content: 'شرکت کشت و صنعت برنج کوروش، فعالیت خود را با هدف تولید، واردات و بسته‌بندی انواع برنج داخلی (طارم، هاشمی، کامفیروزی)، انواع برنج خارجی (هند و پاکستان) و قند و شکر آغاز کرد. هم‌اکنون محصولات خود را در قالب ۶ برند به خانوارهای ایرانی عرضه می‌کند و در حال توسعه زیرساخت‌های صنعتی در بازار برنج است.', tokenCount: 296, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-01-20T08:10:00Z' },
      { id: 'chunk-r-2', documentId: 'doc-r-1', knowledgeBaseId: 'kb-koush-rice', content: 'این شرکت در حال احداث بزرگ‌ترین مجتمع فرآوری و بسته‌بندی برنج در استان مازندران است که با بهره‌گیری از پیشرفته‌ترین تجهیزات روز دنیا، ظرفیت تولید و بسته‌بندی قابل توجهی را فراهم خواهد کرد. هدف از ایجاد این مجتمع، ارتقای کیفیت برنج عرضه‌شده و افزایش سهم بازار در بخش برنج بسته‌بندی‌شده است.', tokenCount: 275, chunkIndex: 1, metadata: { heading: 'طرح توسعه' }, createdAt: '2026-01-20T08:10:00Z' },
    ],
  },
  'kb-proushat': {
    ...MOCK_KNOWLEDGE_BASES[3],
    documents: [
      { id: 'doc-p-1', knowledgeBaseId: 'kb-proushat', fileName: 'معرفی-پروشات.pdf', fileType: 'pdf', fileSize: 7340032, processingStatus: 'ready', errorMessage: null, chunkCount: 265, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-08-01T11:00:00Z' },
      { id: 'doc-p-2', knowledgeBaseId: 'kb-proushat', fileName: 'محصولات-سس-و-رب.docx', fileType: 'docx', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 187, createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-07-28T14:00:00Z' },
      { id: 'doc-p-3', knowledgeBaseId: 'kb-proushat', fileName: 'عرقیات-گیاهی-و-گلاب.md', fileType: 'md', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 156, createdAt: '2026-03-01T08:00:00Z', updatedAt: '2026-07-30T09:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-p-1', documentId: 'doc-p-1', knowledgeBaseId: 'kb-proushat', content: 'فرآورده‌های غذایی پروشات کوروش تولیدکننده تخصصی گروه‌های محصولی انواع سس، رب گوجه‌فرنگی، سرکه، آبلیمو، عرقیات گیاهی، گلاب و پودر ژله در یک مجتمع صنعتی به مساحت ۸۰ هزار مترمربع در تاکستان قزوین است.', tokenCount: 245, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-02-01T08:10:00Z' },
      { id: 'chunk-p-2', documentId: 'doc-p-1', knowledgeBaseId: 'kb-proushat', content: 'مجتمع صنعتی پروشات با مساحت ۸۰ هزار مترمربع در تاکستان قزوین، یکی از بزرگ‌ترین مراکز تولید سس و رب در کشور است. این مجتمع مجهز به خطوط تولید مدرن و آزمایشگاه‌های کنترل کیفیت پیشرفته بوده و محصولات خود را تحت برندهای متنوع به بازار عرضه می‌کند.', tokenCount: 260, chunkIndex: 1, metadata: { heading: 'مجتمع صنعتی' }, createdAt: '2026-02-01T08:10:00Z' },
    ],
  },
  'kb-golbarg': {
    ...MOCK_KNOWLEDGE_BASES[4],
    documents: [
      { id: 'doc-g-1', knowledgeBaseId: 'kb-golbarg', fileName: 'معرفی-گلبرگ.pdf', fileType: 'pdf', fileSize: 6291456, processingStatus: 'ready', errorMessage: null, chunkCount: 234, createdAt: '2026-02-15T09:00:00Z', updatedAt: '2026-07-30T14:00:00Z' },
      { id: 'doc-g-2', knowledgeBaseId: 'kb-golbarg', fileName: 'زیتون-و-شوری‌جات.docx', fileType: 'docx', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 178, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-07-28T16:00:00Z' },
      { id: 'doc-g-3', knowledgeBaseId: 'kb-golbarg', fileName: 'عسل-و-کنسرو-تن.md', fileType: 'md', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 198, createdAt: '2026-03-15T08:00:00Z', updatedAt: '2026-07-25T10:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-g-1', documentId: 'doc-g-1', knowledgeBaseId: 'kb-golbarg', content: 'شرکت گلبرگ غذایی کوروش، با تمرکز بر تولید، تامین و عرضه تخصصی انواع محصولات غذایی با ماندگاری بالا جای خود را در بازار کنسرو زیتون، خیارشور، شوری‌جات، عسل، کنسرو ماهی تُن و مرباها تثبیت کرده است.', tokenCount: 215, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-02-15T09:10:00Z' },
      { id: 'chunk-g-2', documentId: 'doc-g-1', knowledgeBaseId: 'kb-golbarg', content: 'محصولات گلبرگ با تأکید بر کیفیت مواد اولیه و فرآیندهای تولید استاندارد، در طیف گسترده‌ای از محصولات با ماندگاری بالا عرضه می‌شوند. این شرکت با بهره‌گیری از تکنولوژی‌های نوین بسته‌بندی و کنترل کیفیت چندمرحله‌ای، محصولات خود را با ضمانت کیفیت و سلامت به مصرف‌کنندگان ارائه می‌دهد.', tokenCount: 278, chunkIndex: 1, metadata: { heading: 'محصولات و کیفیت' }, createdAt: '2026-02-15T09:10:00Z' },
    ],
  },
  'kb-basti-arin': {
    ...MOCK_KNOWLEDGE_BASES[5],
    documents: [
      { id: 'doc-ba-1', knowledgeBaseId: 'kb-basti-arin', fileName: 'معرفی-هستی-آرین.pdf', fileType: 'pdf', fileSize: 7340032, processingStatus: 'ready', errorMessage: null, chunkCount: 310, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-08-02T10:00:00Z' },
      { id: 'doc-ba-2', knowledgeBaseId: 'kb-basti-arin', fileName: 'چای-و-قهوه-فوری.docx', fileType: 'docx', fileSize: 5242880, processingStatus: 'ready', errorMessage: null, chunkCount: 245, createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-07-30T14:00:00Z' },
      { id: 'doc-ba-3', knowledgeBaseId: 'kb-basti-arin', fileName: 'ادویه-و-دمنوش.md', fileType: 'md', fileSize: 4194304, processingStatus: 'ready', errorMessage: null, chunkCount: 198, createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-07-28T11:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-ba-1', documentId: 'doc-ba-1', knowledgeBaseId: 'kb-basti-arin', content: 'شرکت هستی آرین تامین با اتکا به واحد صنعتی پیشرفته و زنجیره تامین متنوع، روی تولید و عرضه گروه محصولات چای، قهوه فوری، نوشیدنی‌های ویژه، ادویه و دمنوش‌های گیاهی تمرکز دارد. بیش از ۸۴ قلم محصول در قالب ۵ برند گوناگون در بازار موجود است.', tokenCount: 268, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-03-01T10:10:00Z' },
      { id: 'chunk-ba-2', documentId: 'doc-ba-1', knowledgeBaseId: 'kb-basti-arin', content: 'هستی آرین تامین با ۵ برند متنوع در بازار محصولات نوشیدنی و چای فعالیت می‌کند. این شرکت با تمرکز بر کیفیت چای ایرانی و وارداتی، قهوه فوری با طعم‌های متنوع و ادویه‌های اصیل ایرانی، سبد محصولات گسترده‌ای را برای مصرف‌کنندگان فراهم آورده است.', tokenCount: 255, chunkIndex: 1, metadata: { heading: 'برندها و محصولات' }, createdAt: '2026-03-01T10:10:00Z' },
    ],
  },
  'kb-tala-nab': {
    ...MOCK_KNOWLEDGE_BASES[6],
    documents: [
      { id: 'doc-tn-1', knowledgeBaseId: 'kb-tala-nab', fileName: 'معرفی-طلای-ناب.pdf', fileType: 'pdf', fileSize: 5242880, processingStatus: 'ready', errorMessage: null, chunkCount: 198, createdAt: '2026-03-15T08:00:00Z', updatedAt: '2026-07-29T15:00:00Z' },
      { id: 'doc-tn-2', knowledgeBaseId: 'kb-tala-nab', fileName: 'خرما-و-زعفران.docx', fileType: 'docx', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 165, createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-07-25T14:00:00Z' },
      { id: 'doc-tn-3', knowledgeBaseId: 'kb-tala-nab', fileName: 'نبات-سنتی.md', fileType: 'md', fileSize: 2097152, processingStatus: 'ready', errorMessage: null, chunkCount: 112, createdAt: '2026-04-15T08:00:00Z', updatedAt: '2026-07-28T09:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-tn-1', documentId: 'doc-tn-1', knowledgeBaseId: 'kb-tala-nab', content: 'شرکت طلای ناب کوروش با تولید و عرضه خرما، فرآورده‌های آن، زعفران و نبات، علاوه بر تامین نیاز داخلی، در حال ارائه این محصولات اصیل ایرانی به بازارهای جهانی است. با تولید بیش از ۳۰ قلم کالا.', tokenCount: 205, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-03-15T08:10:00Z' },
      { id: 'chunk-tn-2', documentId: 'doc-tn-1', knowledgeBaseId: 'kb-tala-nab', content: 'طلای ناب کوروش با تمرکز بر بسته‌بندی لوکس و صادرات‌محور، محصولات اصیل ایرانی از جمله خرما، زعفران و نبات را با کیفیت برتر به بازارهای جهانی عرضه می‌کند. بیش از ۳۰ قلم کالا در سبد محصولات این شرکت قرار دارد که هر یک با دقت در انتخاب مواد اولیه و طراحی بسته‌بندی، برای رقابت در بازارهای بین‌المللی آماده شده‌اند.', tokenCount: 298, chunkIndex: 1, metadata: { heading: 'محصولات و صادرات' }, createdAt: '2026-03-15T08:10:00Z' },
    ],
  },
  'kb-pakban': {
    ...MOCK_KNOWLEDGE_BASES[7],
    documents: [
      { id: 'doc-pk-1', knowledgeBaseId: 'kb-pakban', fileName: 'معرفی-پاکبان.pdf', fileType: 'pdf', fileSize: 8388608, processingStatus: 'ready', errorMessage: null, chunkCount: 298, createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-08-01T16:00:00Z' },
      { id: 'doc-pk-2', knowledgeBaseId: 'kb-pakban', fileName: 'محصولات-لبنی.docx', fileType: 'docx', fileSize: 5242880, processingStatus: 'ready', errorMessage: null, chunkCount: 245, createdAt: '2026-04-15T10:00:00Z', updatedAt: '2026-07-30T11:00:00Z' },
      { id: 'doc-pk-3', knowledgeBaseId: 'kb-pakban', fileName: 'نوشیدنی-ماکسیتو.md', fileType: 'md', fileSize: 3145728, processingStatus: 'ready', errorMessage: null, chunkCount: 178, createdAt: '2026-05-01T08:00:00Z', updatedAt: '2026-07-28T14:00:00Z' },
    ],
    recentChunks: [
      { id: 'chunk-pk-1', documentId: 'doc-pk-1', knowledgeBaseId: 'kb-pakban', content: 'شرکت صنایع غذایی پاکبان یکی از باتجربه‌ترین مجموعه‌های تولید محصولات لبنی ایران است. با تولید بیش از ۸۰ قلم کالا در گروه‌های متنوع لبنی با نام تجاری پاکبان و نوشیدنی‌های میوه‌ای با برند ماکسیتو.', tokenCount: 198, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-04-01T08:10:00Z' },
      { id: 'chunk-pk-2', documentId: 'doc-pk-1', knowledgeBaseId: 'kb-pakban', content: 'پاکبان با سابقه‌ای درخشان در تولید محصولات لبنی، شیر، خامه، کره و ماست را در بالاترین سطح کیفیت تولید می‌کند. برند ماکسیتو نیز به عنوان برند نوشیدنی‌های میوه‌ای این شرکت، با طعم‌های متنوع و کیفیت برتر شناخته شده است. این مجموعه با بیش از ۸۰ قلم کالا، یکی از گسترده‌ترین سبد محصولات لبنی را در ایران ارائه می‌دهد.', tokenCount: 312, chunkIndex: 1, metadata: { heading: 'محصولات' }, createdAt: '2026-04-01T08:10:00Z' },
    ],
  },
  'kb-koush-protein': {
    ...MOCK_KNOWLEDGE_BASES[8],
    documents: [
      { id: 'doc-pr-1', knowledgeBaseId: 'kb-koush-protein', fileName: 'معرفی-پروتئینی-کوروش.pdf', fileType: 'pdf', fileSize: 6291456, processingStatus: 'chunking', errorMessage: null, chunkCount: 0, createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-08-02T08:00:00Z' },
      { id: 'doc-pr-2', knowledgeBaseId: 'kb-koush-protein', fileName: 'محصولات-نیمه‌آماده.docx', fileType: 'docx', fileSize: 4194304, processingStatus: 'embedding', errorMessage: null, chunkCount: 0, createdAt: '2026-07-05T10:00:00Z', updatedAt: '2026-08-02T08:00:00Z' },
      { id: 'doc-pr-3', knowledgeBaseId: 'kb-koush-protein', fileName: 'بسته‌بندی-مدرن.md', fileType: 'md', fileSize: 2097152, processingStatus: 'chunking', errorMessage: null, chunkCount: 0, createdAt: '2026-07-10T08:00:00Z', updatedAt: '2026-08-02T08:00:00Z' },
    ],
    recentChunks: [],
  },
  'kb-koush-fruit': {
    ...MOCK_KNOWLEDGE_BASES[9],
    documents: [],
    recentChunks: [],
  },
};

// Mock search results
export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    chunk: { id: 'sr-1', documentId: 'doc-h-1', knowledgeBaseId: 'kb-hatro', content: 'هاترو (گروه شرکت‌های توسعه کشت و صنعت کوروش)، به عنوان زیرمجموعه گروه سرمایه‌گذاری کوروش و عضوی از خانواده بزرگ گروه صنعتی گلرنگ، دربرگیرنده مجموعه‌ای از شرکت‌های توانمند در تولید، تأمین، فرآوری، بسته‌بندی و عرضه محصولات غذایی در ایران و بازارهای جهانی است.', tokenCount: 245, chunkIndex: 0, metadata: { heading: 'معرفی هاترو' }, createdAt: '2026-01-05T08:10:00Z' },
    document: { id: 'doc-h-1', fileName: 'Hatro-Overview.pdf' },
    score: 0.94,
    searchType: 'hybrid',
  },
  {
    chunk: { id: 'sr-2', documentId: 'doc-df-1', knowledgeBaseId: 'kb-koush-dryfruits', content: 'شرکت صنعت خشکبار و حبوبات کوروش، فعالیت خود را با تولید گروه‌های محصولی خشکبار، حبوبات، غلات و سویا بسته‌بندی‌شده، آجیل و تنقلات آغاز کرد. این شرکت با به‌کارگیری تجهیزات صنعتی و آزمایشگاهی روزآمد، کنترل‌های دقیق و سخت‌گیرانه‌ای بر کیفیت و سلامت محصولات خود اعمال کرده و رویکرد نوینی را در طراحی و بسته‌بندی به کار گرفته است.', tokenCount: 310, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-01-10T10:10:00Z' },
    document: { id: 'doc-df-1', fileName: 'معرفی-خشکبار-کوروش.pdf' },
    score: 0.87,
    searchType: 'hybrid',
  },
  {
    chunk: { id: 'sr-3', documentId: 'doc-ba-1', knowledgeBaseId: 'kb-basti-arin', content: 'شرکت هستی آرین تامین با اتکا به واحد صنعتی پیشرفته و زنجیره تامین متنوع، روی تولید و عرضه گروه محصولات چای، قهوه فوری، نوشیدنی‌های ویژه، ادویه و دمنوش‌های گیاهی تمرکز دارد. بیش از ۸۴ قلم محصول در قالب ۵ برند گوناگون در بازار موجود است.', tokenCount: 268, chunkIndex: 0, metadata: { heading: 'معرفی شرکت' }, createdAt: '2026-03-01T10:10:00Z' },
    document: { id: 'doc-ba-1', fileName: 'معرفی-هستی-آرین.pdf' },
    score: 0.79,
    searchType: 'vector',
  },
];
