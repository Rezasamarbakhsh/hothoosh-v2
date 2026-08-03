// Memory System Types — Feature 6
// Per PRD FR-MEM-001 through FR-MEM-005
// Per Frontend-Architecture.md §4.2 (memory route), §6.3 (memoryKeys)

export type MemoryType = 'context' | 'preference' | 'knowledge' | 'system';

export type MemoryPackStatus = 'draft' | 'active' | 'archived';

export type MemoryScope = 'workspace' | 'brand' | 'company' | 'organization';

export interface MemoryVersion {
  id: string;
  memoryPackId: string;
  versionNumber: number;
  content: string;
  summary: string | null;
  tokenCount: number;
  createdBy: string;
  createdAt: string;
}

export interface MemoryPack {
  id: string;
  name: string;
  description: string | null;
  memoryType: MemoryType;
  status: MemoryPackStatus;
  scope: MemoryScope;
  content: string;
  tokenCount: number;
  currentVersion: number;
  versionCount: number;
 autoInject: boolean;
  relevanceScore: number;
  createdAt: string;
  updatedAt: string;
 boundAgentCount: number;
 totalInjections: number;
  lastInjectedAt: string | null;
}

export interface MemoryPackDetail extends MemoryPack {
  versions: MemoryVersion[];
  boundAgents: { id: string; name: string; agentType: string }[];
}

// UI filter types
export type MemoryTypeFilter = MemoryType | 'all';
export type MemoryStatusFilter = MemoryPackStatus | 'all';
export type MemoryScopeFilter = MemoryScope | 'all';
export type MemorySortField = 'name' | 'updated_at' | 'totalInjections' | 'tokenCount' | 'versionCount';
export type SortOrder = 'asc' | 'desc';

export interface MemoryFilters {
  type: MemoryTypeFilter;
  status: MemoryStatusFilter;
  scope: MemoryScopeFilter;
  search: string;
  sortField: MemorySortField;
  sortOrder: SortOrder;
}

// Persian labels
export const MEMORY_TYPE_LABELS: Record<MemoryType, string> = {
  context: 'زمینه‌ای',
  preference: 'ترجیحات',
  knowledge: 'دانش',
  system: 'سیستمی',
};

export const MEMORY_STATUS_LABELS: Record<MemoryPackStatus, string> = {
  draft: 'پیش‌نویس',
  active: 'فعال',
  archived: 'بایگانی',
};

export const MEMORY_SCOPE_LABELS: Record<MemoryScope, string> = {
  workspace: 'فضای کار',
  brand: 'برند',
  company: 'شرکت',
  organization: 'سازمان',
};

export const MEMORY_TYPE_COLORS: Record<MemoryType, string> = {
  context: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  preference: 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]',
  knowledge: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
  system: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
};

export const MEMORY_STATUS_COLORS: Record<MemoryPackStatus, string> = {
  draft: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]',
  active: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  archived: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]',
};

export const MEMORY_SCOPE_COLORS: Record<MemoryScope, string> = {
  workspace: 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)] border border-[var(--color-primary-200)]',
  brand: 'bg-[var(--color-accent-50)] text-[var(--color-accent-500)] border border-[var(--color-accent-200)]',
  company: 'bg-[var(--color-info-50)] text-[var(--color-info-500)] border border-[var(--color-info-200)]',
  organization: 'bg-[var(--color-success-50)] text-[var(--color-success-500)] border border-[var(--color-success-200)]',
};

// Type icons (simple SVG paths)
export const MEMORY_TYPE_ICONS: Record<MemoryType, { d: string; viewBox?: string }> = {
  context: { d: 'M4 2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 1.5h8a.5.5 0 01.5.5v8a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z' },
  preference: { d: 'M8 1.5A6.5 6.5 0 1014.5 8 6.5 6.5 0 008 1.5zM8 3a5 5 0 110 10A5 5 0 018 3zm0 1.5a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 4.5z' },
  knowledge: { d: 'M8 1.5l-6 3.5v6L8 14.5l6-3.5V5L8 1.5zM3.5 5.86L8 3.22l4.5 2.64v4.28L8 12.78l-4.5-2.64V5.86z' },
  system: { d: 'M2 4a2 2 0 012-2h8a2 2 0 012 2v1.5H2V4zm0 3h12v5a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm3 1.5a.75.75 0 000 1.5h2a.75.75 0 000-1.5H5z' },
};

// --- Mock Data ---

export const MOCK_MEMORY_PACKS: MemoryPack[] = [
  {
    id: 'mem-1',
    name: 'پیشرفت کاربر',
    description: 'ذخیره‌سازی پیشرفت و وضعیت فعلی کاربر شامل وظایف در دست انجام، اولویت‌ها و اهداف کوتاه‌مدت و بلندمدت. این بسته حافظه به عوامل کمک می‌کند تا در جلسات مختلف گفتگو، ادامه کار کاربر را به خاطر بسپارند.',
    memoryType: 'context',
    status: 'active',
    scope: 'workspace',
    content: 'کاربر در حال توسعه یک پلتفرم هوش مصنوعی سازمانی است. فاز فعلی: ساخت رابط کاربری وب. تکنولوژی‌ها: Next.js 15, TypeScript, Tailwind CSS. تیم شامل ۵ نفر توسعه‌دهنده. اولویت فعلی: تکمیل ماژول عوامل هوشمند.',
    tokenCount: 87,
    currentVersion: 3,
    versionCount: 3,
    autoInject: true,
    relevanceScore: 0.92,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2026-08-02T09:30:00Z',
    boundAgentCount: 1,
    totalInjections: 2847,
    lastInjectedAt: '2026-08-02T09:30:00Z',
  },
  {
    id: 'mem-2',
    name: 'سبک نگارش برند',
    description: 'ترجیحات نگارشی و لحن برند شامل سطح رسمیت، واژگان ترجیحی، الگوهای جمله‌بندی و قوانین نگارش محتوا. تمام عوامل تولید محتوا از این بسته استفاده می‌کنند.',
    memoryType: 'preference',
    status: 'active',
    scope: 'brand',
    content: 'لحن: رسمی ولی دوستانه. سطح زبان: حرفه‌ای. واژگان ترجیحی: «پلتفرم» به جای «سیستم»، «عامل هوشمند» به جای «ربات». جمله‌بندی: کوتاه و شفاف. پرهیز از اصطلاحات خارجی بدون معادل فارسی. استفاده از نیم‌فاصله استاندارد.',
    tokenCount: 72,
    currentVersion: 5,
    versionCount: 5,
    autoInject: true,
    relevanceScore: 0.88,
    createdAt: '2025-10-15T08:00:00Z',
    updatedAt: '2026-07-28T14:00:00Z',
    boundAgentCount: 2,
    totalInjections: 5621,
    lastInjectedAt: '2026-08-01T16:20:00Z',
  },
  {
    id: 'mem-3',
    name: 'ترجیحات تحلیل',
    description: 'تنظیمات و ترجیحات مربوط به تحلیل داده شامل فرمت خروجی، سطح جزئیات، معیارهای ارزیابی و رویکرد تحلیلی ترجیحی کاربر.',
    memoryType: 'preference',
    status: 'active',
    scope: 'workspace',
    content: 'فرمت خروجی ترجیحی: جدول + نمودار. سطح جزئیات: متوسط (نه خیلی خلاصه، نه خیلی طولانی). معیارهای ارزیابی: MAPE و R². رویکرد: bottom-up. زبان پاسخ: فارسی با اصطلاحات فنی انگلیسی.',
    tokenCount: 58,
    currentVersion: 2,
    versionCount: 2,
    autoInject: false,
    relevanceScore: 0.75,
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-07-15T10:00:00Z',
    boundAgentCount: 1,
    totalInjections: 890,
    lastInjectedAt: '2026-07-28T16:30:00Z',
  },
  {
    id: 'mem-4',
    name: 'دستورالعمل‌های امنیتی',
    description: 'مجموعه قوانین و محدودیت‌های امنیتی که تمام عوامل هوشمند باید رعایت کنند. شامل قوانین دسترسی داده، محرمانگی و compliance.',
    memoryType: 'system',
    status: 'active',
    scope: 'organization',
    content: '۱. هرگز اطلاعات شخصی کاربران را ذخیره نکن. ۲. دسترسی به داده‌ها بر اساس نقش کاربر محدود شود. ۳. تمام درخواست‌های API باید لاگ شوند. ۴. پاسخ‌ها نباید شامل اطلاعات حساس مالی باشند. ۵. در صورت شناسایی محتوای مشکوک، به مدیر هشدار بده.',
    tokenCount: 64,
    currentVersion: 8,
    versionCount: 8,
    autoInject: true,
    relevanceScore: 0.95,
    createdAt: '2025-09-01T09:00:00Z',
    updatedAt: '2026-07-30T12:00:00Z',
    boundAgentCount: 4,
    totalInjections: 12450,
    lastInjectedAt: '2026-08-02T09:30:00Z',
  },
  {
    id: 'mem-5',
    name: 'خلاصه دانش محصول',
    description: 'خلاصه‌سازی دانش کلیدی درباره محصولات شرکت شامل ویژگی‌های اصلی، مزایای رقابتی و نقاط تمایز. این بسته از پایگاه دانش استخراج شده و به‌روزرسانی می‌شود.',
    memoryType: 'knowledge',
    status: 'active',
    scope: 'company',
    content: 'محصول اصلی: هات‌هوش — پلتفرم هوش مصنوعی سازمانی. ویژگی‌های کلیدی: عوامل هوشمند چندمنظوره، پایگاه دانش RAG با پشتیبانی فارسی، حافظه پایدار جلسات، تحلیل داده. مزیت رقابتی: پشتیبانی بومی RTL/Farsi، معماری multi-tenant، کامپلایانس با مقررات داخلی.',
    tokenCount: 68,
    currentVersion: 4,
    versionCount: 4,
    autoInject: true,
    relevanceScore: 0.85,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-08-01T20:00:00Z',
    boundAgentCount: 3,
    totalInjections: 3450,
    lastInjectedAt: '2026-08-02T08:00:00Z',
  },
  {
    id: 'mem-6',
    name: 'قالب گزارش‌دهی',
    description: 'الگوی استاندارد گزارش‌دهی سازمانی شامل ساختار، بخش‌های обязатель и فرمت خروجی. برای تولید گزارش‌های یکپارچه توسط عوامل مختلف.',
    memoryType: 'system',
    status: 'draft',
    scope: 'company',
    content: 'ساختار گزارش: ۱. خلاصه اجرایی (حداکثر ۳ جمله) ۲. معرفی مسئله ۳. روش‌شناسی ۴. یافته‌ها ۵. تحلیل و تفسیر ۶. پیشنهادها ۷. پیوست‌ها. فرمت: PDF با هدر سازمانی. حداکثر طول: ۵ صفحه.',
    tokenCount: 55,
    currentVersion: 1,
    versionCount: 1,
    autoInject: false,
    relevanceScore: 0.0,
    createdAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    boundAgentCount: 0,
    totalInjections: 0,
    lastInjectedAt: null,
  },
  {
    id: 'mem-7',
    name: 'پروفایل مشتریان کلیدی',
    description: 'اطلاعات جمعیت‌شناختی و ترجیحات مشتریان کلیدی سازمان. برای شخصی‌سازی پاسخ‌ها و پیشنهاد محصولات مناسب.',
    memoryType: 'context',
    status: 'archived',
    scope: 'brand',
    content: 'بخش اصلی مشتریان: شرکت‌های فناوری اطلاعات با ۵۰ تا ۵۰۰ کارمند. بودجه متوسط AI: ۲۰۰ تا ۱۰۰۰ میلیون تومان ماهانه. اولویت‌ها: امنیت داده، پشتیبانی فارسی، یکپارچگی با سیستم‌های موجود. چالش اصلی: کمبود نیروی متخصص AI.',
    tokenCount: 61,
    currentVersion: 6,
    versionCount: 6,
    autoInject: false,
    relevanceScore: 0.0,
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2026-05-15T11:00:00Z',
    boundAgentCount: 0,
    totalInjections: 4520,
    lastInjectedAt: '2026-05-15T11:00:00Z',
  },
  {
    id: 'mem-8',
    name: 'تاریخچه تصمیم‌گیری',
    description: 'ثبت تصمیمات کلیدی معماری و محصول گرفته شده در طول پروژه شامل دلایل، جایگزین‌ها و نتایج.',
    memoryType: 'knowledge',
    status: 'draft',
    scope: 'workspace',
    content: 'تصمیم ۱: انتخاب Next.js 15 به جای Nuxt.js — دلیل: اکوسیستم بزرگ‌تر TypeScript. تصمیم ۲: استفاده از Prisma ORM — دلیل: type safety و migrations خودکار. تصمیم ۳: معماری multi-tenant — دلیل: الزام مشتریان سازمانی.',
    tokenCount: 48,
    currentVersion: 2,
    versionCount: 2,
    autoInject: false,
    relevanceScore: 0.0,
    createdAt: '2026-07-20T09:00:00Z',
    updatedAt: '2026-08-01T15:00:00Z',
    boundAgentCount: 0,
    totalInjections: 0,
    lastInjectedAt: null,
  },
];

export const MOCK_MEMORY_DETAILS: Record<string, MemoryPackDetail> = {
  'mem-1': {
    ...MOCK_MEMORY_PACKS[0],
    versions: [
      { id: 'v-1-1', memoryPackId: 'mem-1', versionNumber: 1, content: 'کاربر در حال توسعه یک پلتفرم هوش مصنوعی سازمانی است.', summary: 'نسخه اولیه — اطلاعات پایه', tokenCount: 18, createdBy: 'علی محمدی', createdAt: '2025-11-20T10:00:00Z' },
      { id: 'v-1-2', memoryPackId: 'mem-1', versionNumber: 2, content: 'کاربر در حال توسعه یک پلتفرم هوش مصنوعی سازمانی است. فاز فعلی: ساخت رابط کاربری وب. تکنولوژی‌ها: Next.js 15, TypeScript, Tailwind CSS.', summary: 'افزودن تکنولوژی‌ها و فاز فعلی', tokenCount: 42, createdBy: 'علی محمدی', createdAt: '2026-03-15T14:00:00Z' },
      { id: 'v-1-3', memoryPackId: 'mem-1', versionNumber: 3, content: MOCK_MEMORY_PACKS[0].content, summary: 'افزودن اطلاعات تیم و اولویت‌ها', tokenCount: 87, createdBy: 'علی محمدی', createdAt: '2026-08-02T09:30:00Z' },
    ],
    boundAgents: [
      { id: 'agent-1', name: 'دستیار پشتیبانی', agentType: 'rag' },
    ],
  },
  'mem-2': {
    ...MOCK_MEMORY_PACKS[1],
    versions: [
      { id: 'v-2-1', memoryPackId: 'mem-2', versionNumber: 1, content: 'لحن: رسمی. واژگان ترجیحی: پلتفرم. جمله‌بندی: کوتاه.', summary: 'نسخه اولیه', tokenCount: 15, createdBy: 'سارا احمدی', createdAt: '2025-10-15T08:00:00Z' },
      { id: 'v-2-2', memoryPackId: 'mem-2', versionNumber: 2, content: 'لحن: رسمی ولی دوستانه. واژگان ترجیحی: پلتفرم، عامل هوشمند. جمله‌بندی: کوتاه و شفاف.', summary: 'بهبود لحن و افزودن واژگان', tokenCount: 28, createdBy: 'سارا احمدی', createdAt: '2025-12-20T10:00:00Z' },
      { id: 'v-2-3', memoryPackId: 'mem-2', versionNumber: 3, content: 'لحن: رسمی ولی دوستانه. سطح زبان: حرفه‌ای. واژگان: پلتفرم، عامل هوشمند. پرهیز از اصطلاحات خارجی.', summary: 'افزودن سطح زبان و قوانین خارجی', tokenCount: 38, createdBy: 'سارا احمدی', createdAt: '2026-02-10T11:00:00Z' },
      { id: 'v-2-4', memoryPackId: 'mem-2', versionNumber: 4, content: 'لحن: رسمی ولی دوستانه. سطح زبان: حرفه‌ای. واژگان ترجیحی: پلتفرم، عامل هوشمند. جمله‌بندی: کوتاه. پرهیز از اصطلاحات خارجی. استفاده از نیم‌فاصله.', summary: 'افزودن نیم‌فاصله و بهبود جمله‌بندی', tokenCount: 55, createdBy: 'سارا احمدی', createdAt: '2026-05-01T09:00:00Z' },
      { id: 'v-2-5', memoryPackId: 'mem-2', versionNumber: 5, content: MOCK_MEMORY_PACKS[1].content, summary: 'تکمیل نهایی با معادل‌سازی کامل', tokenCount: 72, createdBy: 'سارا احمدی', createdAt: '2026-07-28T14:00:00Z' },
    ],
    boundAgents: [
      { id: 'agent-3', name: 'نویسنده محتوا', agentType: 'chat' },
      { id: 'agent-1', name: 'دستیار پشتیبانی', agentType: 'rag' },
    ],
  },
  'mem-3': {
    ...MOCK_MEMORY_PACKS[2],
    versions: [
      { id: 'v-3-1', memoryPackId: 'mem-3', versionNumber: 1, content: 'فرمت خروجی: جدول. سطح جزئیات: متوسط.', summary: 'نسخه اولیه', tokenCount: 12, createdBy: 'رضا کریمی', createdAt: '2026-01-10T11:00:00Z' },
      { id: 'v-3-2', memoryPackId: 'mem-3', versionNumber: 2, content: MOCK_MEMORY_PACKS[2].content, summary: 'افزودن معیارها و رویکرد تحلیلی', tokenCount: 58, createdBy: 'رضا کریمی', createdAt: '2026-07-15T10:00:00Z' },
    ],
    boundAgents: [
      { id: 'agent-2', name: 'تحلیلگر داده', agentType: 'tool_use' },
    ],
  },
  'mem-4': {
    ...MOCK_MEMORY_PACKS[3],
    versions: [
      { id: 'v-4-1', memoryPackId: 'mem-4', versionNumber: 1, content: '۱. اطلاعات شخصی را ذخیره نکن. ۲. دسترسی بر اساس نقش.', summary: 'نسخه اولیه', tokenCount: 14, createdBy: 'مدیر سیستم', createdAt: '2025-09-01T09:00:00Z' },
      { id: 'v-4-2', memoryPackId: 'mem-4', versionNumber: 2, content: '۱. اطلاعات شخصی را ذخیره نکن. ۲. دسترسی بر اساس نقش. ۳. لاگ درخواست‌ها. ۴. بدون اطلاعات مالی.', summary: 'افزودن لاگ و محدودیت مالی', tokenCount: 22, createdBy: 'مدیر سیستم', createdAt: '2025-11-15T10:00:00Z' },
      { id: 'v-4-3', memoryPackId: 'mem-4', versionNumber: 3, content: '۱. اطلاعات شخصی را ذخیره نکن. ۲. دسترسی بر اساس نقش. ۳. لاگ تمام API. ۴. بدون اطلاعات حساس مالی. ۵. هشدار محتوای مشکوک.', summary: 'افزودن سیستم هشدار', tokenCount: 30, createdBy: 'مدیر سیستم', createdAt: '2026-02-01T09:00:00Z' },
      { id: 'v-4-4', memoryPackId: 'mem-4', versionNumber: 4, content: MOCK_MEMORY_PACKS[3].content, summary: 'تبدیل به فارسی و بهبود فرمت', tokenCount: 64, createdBy: 'مدیر سیستم', createdAt: '2026-07-30T12:00:00Z' },
    ],
    boundAgents: [
      { id: 'agent-1', name: 'دستیار پشتیبانی', agentType: 'rag' },
      { id: 'agent-2', name: 'تحلیلگر داده', agentType: 'tool_use' },
      { id: 'agent-3', name: 'نویسنده محتوا', agentType: 'chat' },
      { id: 'agent-5', name: 'تحلیلگر رقابتی', agentType: 'autonomous' },
    ],
  },
  'mem-5': {
    ...MOCK_MEMORY_PACKS[4],
    versions: [
      { id: 'v-5-1', memoryPackId: 'mem-5', versionNumber: 1, content: 'محصول: هات‌هوش. ویژگی: عوامل هوشمند و پایگاه دانش.', summary: 'نسخه اولیه', tokenCount: 16, createdBy: 'سارا احمدی', createdAt: '2025-12-01T08:00:00Z' },
      { id: 'v-5-2', memoryPackId: 'mem-5', versionNumber: 2, content: 'محصول: هات‌هوش. ویژگی: عوامل هوشمند، پایگاه دانش RAG، حافظه جلسات. مزیت: پشتیبانی فارسی.', summary: 'افزودن ویژگی‌ها و مزیت', tokenCount: 30, createdBy: 'سارا احمدی', createdAt: '2026-03-01T10:00:00Z' },
      { id: 'v-5-3', memoryPackId: 'mem-5', versionNumber: 3, content: MOCK_MEMORY_PACKS[4].content, summary: 'تکمیل با جزئیات معماری', tokenCount: 68, createdBy: 'سارا احمدی', createdAt: '2026-08-01T20:00:00Z' },
    ],
    boundAgents: [
      { id: 'agent-1', name: 'دستیار پشتیبانی', agentType: 'rag' },
      { id: 'agent-3', name: 'نویسنده محتوا', agentType: 'chat' },
      { id: 'agent-2', name: 'تحلیلگر داده', agentType: 'tool_use' },
    ],
  },
  'mem-6': {
    ...MOCK_MEMORY_PACKS[5],
    versions: [
      { id: 'v-6-1', memoryPackId: 'mem-6', versionNumber: 1, content: MOCK_MEMORY_PACKS[5].content, summary: 'نسخه اولیه', tokenCount: 55, createdBy: 'رضا کریمی', createdAt: '2026-08-01T10:00:00Z' },
    ],
    boundAgents: [],
  },
  'mem-7': {
    ...MOCK_MEMORY_PACKS[6],
    versions: [
      { id: 'v-7-1', memoryPackId: 'mem-7', versionNumber: 1, content: 'مشتریان: شرکت‌های IT با ۵۰-۵۰۰ کارمند.', summary: 'نسخه اولیه', tokenCount: 12, createdBy: 'سارا احمدی', createdAt: '2025-10-01T10:00:00Z' },
      { id: 'v-7-6', memoryPackId: 'mem-7', versionNumber: 6, content: MOCK_MEMORY_PACKS[6].content, summary: 'آخرین نسخه قبل از بایگانی', tokenCount: 61, createdBy: 'سارا احمدی', createdAt: '2026-05-15T11:00:00Z' },
    ],
    boundAgents: [],
  },
  'mem-8': {
    ...MOCK_MEMORY_PACKS[7],
    versions: [
      { id: 'v-8-1', memoryPackId: 'mem-8', versionNumber: 1, content: 'تصمیم ۱: Next.js 15. تصمیم ۲: Prisma.', summary: 'نسخه اولیه', tokenCount: 10, createdBy: 'علی محمدی', createdAt: '2026-07-20T09:00:00Z' },
      { id: 'v-8-2', memoryPackId: 'mem-8', versionNumber: 2, content: MOCK_MEMORY_PACKS[7].content, summary: 'افزودن تصمیم معماری multi-tenant', tokenCount: 48, createdBy: 'علی محمدی', createdAt: '2026-08-01T15:00:00Z' },
    ],
    boundAgents: [],
  },
};
