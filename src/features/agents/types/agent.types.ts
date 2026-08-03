// Agent System Types — Feature 4
// Per PRD FR-AGENT-001 through FR-AGENT-008
// Per Agent-System.md §2 (Agent Types), §3 (Lifecycle), §4 (Configuration)

export type AgentType = 'chat' | 'rag' | 'tool_use' | 'autonomous' | 'workflow';

export type AgentStatus = 'draft' | 'active' | 'deprecated';

export type AutonomyLevel = 'supervised' | 'semi_autonomous' | 'fully_autonomous';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  agentType: AgentType;
  status: AgentStatus;
  modelId: string;
  modelName: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  avatarUrl: string | null;
  rateLimitPerUser: number | null;
  rateLimitPerWorkspace: number | null;
  createdAt: string;
  updatedAt: string;
  knowledgeBaseCount: number;
  toolCount: number;
  memoryPackCount: number;
  totalSessions: number;
  totalMessages: number;
}

export interface AgentKnowledgeBinding {
  id: string;
  agentId: string;
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  relevanceThreshold: number;
  maxChunks: number;
  priority: number;
}

export interface AgentToolBinding {
  id: string;
  agentId: string;
  toolId: string;
  toolName: string;
  toolDescription: string;
  isEnabled: boolean;
}

export interface AgentMemoryBinding {
  id: string;
  agentId: string;
  memoryPackId: string;
  memoryPackName: string;
  memoryType: string;
}

export interface AgentDetail extends Agent {
  knowledgeBindings: AgentKnowledgeBinding[];
  toolBindings: AgentToolBinding[];
  memoryBindings: AgentMemoryBinding[];
}

export type AgentTypeFilter = AgentType | 'all';
export type AgentStatusFilter = AgentStatus | 'all';
export type AgentSortField = 'name' | 'created_at' | 'updated_at' | 'totalSessions';
export type SortOrder = 'asc' | 'desc';

export interface AgentFilters {
  type: AgentTypeFilter;
  status: AgentStatusFilter;
  search: string;
  sortField: AgentSortField;
  sortOrder: SortOrder;
}

export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  chat: 'گفتگو',
  rag: 'RAG',
  tool_use: 'ابزار',
  autonomous: 'مستقل',
  workflow: 'جریان کاری',
};

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  draft: 'پیش‌نویس',
  active: 'فعال',
  deprecated: 'منسوخ',
};

export const AGENT_TYPE_COLORS: Record<AgentType, string> = {
  chat: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  rag: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  tool_use: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]',
  autonomous: 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]',
  workflow: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]',
};

export const AGENT_STATUS_COLORS: Record<AgentStatus, string> = {
  draft: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]',
  active: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]',
  deprecated: 'bg-[var(--color-danger-100)] text-[var(--color-danger-600)]',
};

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'دستیار پشتیبانی',
    description: 'دستیار هوشمند برای پاسخگویی به سوالات متداول مشتریان و ارائه راهنمایی‌های فنی درباره محصولات شرکت.',
    agentType: 'rag',
    status: 'active',
    modelId: 'model-1',
    modelName: 'GPT-4o',
    systemPrompt: 'تو یک دستیار پشتیبانی مشتری هستی. به زبان فارسی و با لحن رسمی و حرفه‌ای پاسخ بده.',
    temperature: 0.3,
    topP: 0.9,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: 30,
    rateLimitPerWorkspace: null,
    createdAt: '2025-12-15T10:30:00Z',
    updatedAt: '2026-01-20T14:00:00Z',
    knowledgeBaseCount: 3,
    toolCount: 0,
    memoryPackCount: 1,
    totalSessions: 1247,
    totalMessages: 8934,
  },
  {
    id: 'agent-2',
    name: 'تحلیلگر داده',
    description: 'عامل هوشمند برای تحلیل داده‌ها، ساخت گزارش‌های آماری و پاسخ به سوالات تحلیلی با استفاده از ابزارهای پردازش داده.',
    agentType: 'tool_use',
    status: 'active',
    modelId: 'model-2',
    modelName: 'Claude 3.5 Sonnet',
    systemPrompt: 'تو یک تحلیلگر داده هستی. از ابزارهای موجود برای استخراج و تحلیل داده استفاده کن.',
    temperature: 0.1,
    topP: 0.9,
    maxTokens: 8192,
    avatarUrl: null,
    rateLimitPerUser: 15,
    rateLimitPerWorkspace: 200,
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-07-28T16:30:00Z',
    knowledgeBaseCount: 1,
    toolCount: 4,
    memoryPackCount: 0,
    totalSessions: 456,
    totalMessages: 2891,
  },
  {
    id: 'agent-3',
    name: 'نویسنده محتوا',
    description: 'عامل خلاق برای تولید محتوای متنی شامل مقالات، پست‌های وبلاگ، متن‌های تبلیغاتی و محتوای شبکه‌های اجتماعی.',
    agentType: 'chat',
    status: 'active',
    modelId: 'model-3',
    modelName: 'GPT-4o',
    systemPrompt: 'تو یک نویسنده حرفه‌ای محتوا هستی. متن‌های جذاب و خوانا بنویس.',
    temperature: 0.8,
    topP: 0.95,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: null,
    rateLimitPerWorkspace: null,
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-06-15T09:45:00Z',
    knowledgeBaseCount: 0,
    toolCount: 0,
    memoryPackCount: 1,
    totalSessions: 892,
    totalMessages: 5621,
  },
  {
    id: 'agent-4',
    name: 'دستیار برنامه‌نویسی',
    description: 'عامل تخصصی برای کمک در برنامه‌نویسی، دیباگ کردن کد، پیشنهاد بهبود و تولید مستندات فنی.',
    agentType: 'tool_use',
    status: 'draft',
    modelId: 'model-4',
    modelName: 'Claude 3.5 Sonnet',
    systemPrompt: 'تو یک دستیار برنامه‌نویسی هستی. کد تمیز و بهینه بنویس و توضیحات فارسی ارائه بده.',
    temperature: 0.2,
    topP: 0.9,
    maxTokens: 8192,
    avatarUrl: null,
    rateLimitPerUser: 20,
    rateLimitPerWorkspace: null,
    createdAt: '2026-07-25T11:00:00Z',
    updatedAt: '2026-08-01T15:20:00Z',
    knowledgeBaseCount: 2,
    toolCount: 3,
    memoryPackCount: 0,
    totalSessions: 0,
    totalMessages: 0,
  },
  {
    id: 'agent-5',
    name: 'تحلیلگر رقابتی',
    description: 'عامل مستقل برای تحلیل بازار رقبا، جمع‌آوری اطلاعات و تولید گزارش‌های جامع تحلیل رقابتی به صورت خودکار.',
    agentType: 'autonomous',
    status: 'draft',
    modelId: 'model-5',
    modelName: 'GPT-4o',
    systemPrompt: 'تو یک تحلیلگر رقابتی هستی. با استفاده از ابزارهای جستجو و تحلیل، گزارش‌های جامع تولید کن.',
    temperature: 0.4,
    topP: 0.9,
    maxTokens: 16384,
    avatarUrl: null,
    rateLimitPerUser: 5,
    rateLimitPerWorkspace: 50,
    createdAt: '2026-07-28T09:30:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    knowledgeBaseCount: 1,
    toolCount: 5,
    memoryPackCount: 1,
    totalSessions: 0,
    totalMessages: 0,
  },
  {
    id: 'agent-6',
    name: 'مترجم تخصصی',
    description: 'عامل گفتگویی برای ترجمه تخصصی متون بین فارسی و انگلیسی با حفظ لحن و اصطلاحات تخصصی هر حوزه.',
    agentType: 'chat',
    status: 'deprecated',
    modelId: 'model-1',
    modelName: 'GPT-4o',
    systemPrompt: 'تو یک مترجم حرفه‌ای هستی. متون را با دقت و حفظ لحن اصلی ترجمه کن.',
    temperature: 0.2,
    topP: 0.9,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: null,
    rateLimitPerWorkspace: null,
    createdAt: '2025-10-01T14:00:00Z',
    updatedAt: '2026-03-15T11:30:00Z',
    knowledgeBaseCount: 0,
    toolCount: 0,
    memoryPackCount: 0,
    totalSessions: 2341,
    totalMessages: 12450,
  },
];

export const MOCK_AGENT_DETAILS: Record<string, AgentDetail> = {
  'agent-1': {
    ...MOCK_AGENTS[0],
    knowledgeBindings: [
      { id: 'kb-1', agentId: 'agent-1', knowledgeBaseId: 'kb-1', knowledgeBaseName: 'مستندات محصول', relevanceThreshold: 0.7, maxChunks: 10, priority: 0 },
      { id: 'kb-2', agentId: 'agent-1', knowledgeBaseId: 'kb-2', knowledgeBaseName: 'سوالات متداول', relevanceThreshold: 0.8, maxChunks: 5, priority: 1 },
      { id: 'kb-3', agentId: 'agent-1', knowledgeBaseId: 'kb-3', knowledgeBaseName: 'راهنمای نصب', relevanceThreshold: 0.7, maxChunks: 8, priority: 2 },
    ],
    toolBindings: [],
    memoryBindings: [
      { id: 'mem-1', agentId: 'agent-1', memoryPackId: 'mem-1', memoryPackName: 'پیشرفت کاربر', memoryType: 'context' },
    ],
  },
  'agent-2': {
    ...MOCK_AGENTS[1],
    knowledgeBindings: [
      { id: 'kb-4', agentId: 'agent-2', knowledgeBaseId: 'kb-4', knowledgeBaseName: 'تعاریف شاخص‌ها', relevanceThreshold: 0.7, maxChunks: 5, priority: 0 },
    ],
    toolBindings: [
      { id: 'tool-1', agentId: 'agent-2', toolId: 'tool-1', toolName: 'پرس‌وجوی دیتابیس', toolDescription: 'اجرای کوئری SQL روی دیتابیس تحلیلی', isEnabled: true },
      { id: 'tool-2', agentId: 'agent-2', toolId: 'tool-2', toolName: 'نمودارسازی', toolDescription: 'تولید نمودار از داده‌های تحلیلی', isEnabled: true },
      { id: 'tool-3', agentId: 'agent-2', toolId: 'tool-3', toolName: 'جستجوی وب', toolDescription: 'جستجوی اطلاعات در وب', isEnabled: true },
      { id: 'tool-4', agentId: 'agent-2', toolId: 'tool-4', toolName: 'محاسبه آماری', toolDescription: 'انجام محاسبات آماری روی مجموعه داده', isEnabled: true },
    ],
    memoryBindings: [],
  },
  'agent-3': {
    ...MOCK_AGENTS[2],
    knowledgeBindings: [],
    toolBindings: [],
    memoryBindings: [
      { id: 'mem-2', agentId: 'agent-3', memoryPackId: 'mem-2', memoryPackName: 'سبک نگارش برند', memoryType: 'preference' },
    ],
  },
  'agent-4': {
    ...MOCK_AGENTS[3],
    knowledgeBindings: [
      { id: 'kb-5', agentId: 'agent-4', knowledgeBaseId: 'kb-5', knowledgeBaseName: 'مستندات API', relevanceThreshold: 0.7, maxChunks: 10, priority: 0 },
      { id: 'kb-6', agentId: 'agent-4', knowledgeBaseId: 'kb-6', knowledgeBaseName: 'الگوهای کد', relevanceThreshold: 0.7, maxChunks: 8, priority: 1 },
    ],
    toolBindings: [
      { id: 'tool-5', agentId: 'agent-4', toolId: 'tool-5', toolName: 'اجرا کد', toolDescription: 'اجرای کد در محیط ایزوله', isEnabled: true },
      { id: 'tool-6', agentId: 'agent-4', toolId: 'tool-6', toolName: 'جستجوی مخزن', toolDescription: 'جستجو در مخازن کد', isEnabled: true },
      { id: 'tool-7', agentId: 'agent-4', toolId: 'tool-7', toolName: 'بررسی کد', toolDescription: 'تحلیل استاتیک کد و شناسایی مشکلات', isEnabled: false },
    ],
    memoryBindings: [],
  },
  'agent-5': {
    ...MOCK_AGENTS[4],
    knowledgeBindings: [
      { id: 'kb-7', agentId: 'agent-5', knowledgeBaseId: 'kb-7', knowledgeBaseName: 'گزارش‌های بازار', relevanceThreshold: 0.6, maxChunks: 15, priority: 0 },
    ],
    toolBindings: [
      { id: 'tool-8', agentId: 'agent-5', toolId: 'tool-8', toolName: 'جستجوی وب', toolDescription: 'جستجوی اطلاعات در وب', isEnabled: true },
      { id: 'tool-9', agentId: 'agent-5', toolId: 'tool-9', toolName: 'استخراج داده', toolDescription: 'استخراج داده از صفحات وب', isEnabled: true },
      { id: 'tool-10', agentId: 'agent-5', toolId: 'tool-10', toolName: 'تحلیل متن', toolDescription: 'تحلیل و خلاصه‌سازی متن', isEnabled: true },
      { id: 'tool-11', agentId: 'agent-5', toolId: 'tool-11', toolName: 'نوشتن گزارش', toolDescription: 'تولید گزارش ساختاریافته', isEnabled: true },
      { id: 'tool-12', agentId: 'agent-5', toolId: 'tool-12', toolName: 'پرس‌وجوی دیتابیس', toolDescription: 'اجرای کوئری SQL', isEnabled: true },
    ],
    memoryBindings: [
      { id: 'mem-3', agentId: 'agent-5', memoryPackId: 'mem-3', memoryPackName: 'ترجیحات تحلیل', memoryType: 'preference' },
    ],
  },
  'agent-6': {
    ...MOCK_AGENTS[5],
    knowledgeBindings: [],
    toolBindings: [],
    memoryBindings: [],
  },
};
