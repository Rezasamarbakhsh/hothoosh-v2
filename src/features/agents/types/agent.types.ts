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
    id: 'pta-marketing',
    name: 'PTA Marketing',
    description: 'دستیار هوشمند بازاریابی و استراتژی‌های فروش. تخصص در تحلیل بازار، برنامه‌ریزی کمپین‌های بازاریابی، شناسایی فرصت‌های فروش و بهینه‌سازی کانال‌های توزیع برای گروه شرکت‌های هاترو.',
    agentType: 'rag',
    status: 'active',
    modelId: 'model-1',
    modelName: 'GPT-4o',
    systemPrompt: 'تو دستیار هوشمند بازاریابی هاترو هستی...',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: 30,
    rateLimitPerWorkspace: null,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-02T14:00:00Z',
    knowledgeBaseCount: 3,
    toolCount: 2,
    memoryPackCount: 1,
    totalSessions: 892,
    totalMessages: 5621,
  },
  {
    id: 'pta-branding',
    name: 'PTA Branding',
    description: 'دستیار هوشمند برندسازی و هویت بصری. تخصص در طراحی هویت برند، مدیریت نام‌های تجاری، استراتژی‌های بصری و حفظ یکپارچگی برند در تمامی شرکت‌های زیرمجموعه هاترو.',
    agentType: 'chat',
    status: 'active',
    modelId: 'model-1',
    modelName: 'GPT-4o',
    systemPrompt: 'تو دستیار هوشمند برندسازی هاترو هستی...',
    temperature: 0.8,
    topP: 0.95,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: null,
    rateLimitPerWorkspace: null,
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-07-28T16:30:00Z',
    knowledgeBaseCount: 2,
    toolCount: 0,
    memoryPackCount: 1,
    totalSessions: 456,
    totalMessages: 2891,
  },
  {
    id: 'pta-advertising',
    name: 'PTA Advertising',
    description: 'دستیار هوشمند تبلیغات و کمپین‌های تبلیغاتی. تخصص در طراحی کمپین‌های تبلیغاتی، مدیریت رسانه‌های اجتماعی، تولید محتوای تبلیغاتی و بهینه‌سازی نرخ تبدیل برای برندهای هاترو.',
    agentType: 'chat',
    status: 'active',
    modelId: 'model-3',
    modelName: 'GPT-4o',
    systemPrompt: 'تو دستیار هوشمند تبلیغات هاترو هستی...',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
    avatarUrl: null,
    rateLimitPerUser: null,
    rateLimitPerWorkspace: null,
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-08-01T11:00:00Z',
    knowledgeBaseCount: 1,
    toolCount: 1,
    memoryPackCount: 0,
    totalSessions: 324,
    totalMessages: 1876,
  },
  {
    id: 'pta-pr',
    name: 'PTA PR',
    description: 'دستیار هوشمند روابط عمومی و ارتباطات سازمانی. تخصص در مدیریت روابط عمومی، پاسخگویی به رسانه‌ها، مدیریت بحران و ارتباطات داخلی و خارجی برای هلدینگ هاترو.',
    agentType: 'rag',
    status: 'active',
    modelId: 'model-2',
    modelName: 'Claude 3.5 Sonnet',
    systemPrompt: 'تو دستیار هوشمند روابط عمومی هاترو هستی...',
    temperature: 0.3,
    topP: 0.9,
    maxTokens: 8192,
    avatarUrl: null,
    rateLimitPerUser: 20,
    rateLimitPerWorkspace: 100,
    createdAt: '2026-04-20T14:00:00Z',
    updatedAt: '2026-07-30T09:00:00Z',
    knowledgeBaseCount: 2,
    toolCount: 1,
    memoryPackCount: 1,
    totalSessions: 567,
    totalMessages: 3452,
  },
  {
    id: 'pta-holding',
    name: 'PTA Holding',
    description: 'دستیار هوشمند هلدینگ هاترو (گروه شرکت‌های توسعه کشت و صنعت کوروش). صاحب ۹ شرکت زیرمجموعه فعال در تولید، تأمین، فرآوری و عرضه محصولات غذایی. این دستیار به اطلاعات جامع تمامی شرکت‌ها دسترسی دارد.',
    agentType: 'rag',
    status: 'active',
    modelId: 'model-1',
    modelName: 'GPT-4o',
    systemPrompt: 'تو دستیار هوشمند هلدینگ هاترو هستی...',
    temperature: 0.4,
    topP: 0.9,
    maxTokens: 8192,
    avatarUrl: null,
    rateLimitPerUser: 15,
    rateLimitPerWorkspace: 200,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    knowledgeBaseCount: 10,
    toolCount: 3,
    memoryPackCount: 2,
    totalSessions: 2341,
    totalMessages: 12450,
  },
];

export const MOCK_AGENT_DETAILS: Record<string, AgentDetail> = {
  'pta-marketing': {
    ...MOCK_AGENTS[0],
    knowledgeBindings: [
      { id: 'kb-1', agentId: 'pta-marketing', knowledgeBaseId: 'kb-hatro', knowledgeBaseName: 'هلدینگ هاترو', relevanceThreshold: 0.7, maxChunks: 10, priority: 0 },
      { id: 'kb-2', agentId: 'pta-marketing', knowledgeBaseId: 'kb-koush-dryfruits', knowledgeBaseName: 'خشکبار کوروش', relevanceThreshold: 0.75, maxChunks: 8, priority: 1 },
      { id: 'kb-3', agentId: 'pta-marketing', knowledgeBaseId: 'kb-koush-rice', knowledgeBaseName: 'برنج کوروش', relevanceThreshold: 0.75, maxChunks: 8, priority: 2 },
    ],
    toolBindings: [
      { id: 'tool-1', agentId: 'pta-marketing', toolId: 'tool-1', toolName: 'تحلیل بازار', toolDescription: 'تحلیل روندهای بازار و شناسایی فرصت‌های فروش', isEnabled: true },
      { id: 'tool-2', agentId: 'pta-marketing', toolId: 'tool-2', toolName: 'جستجوی وب', toolDescription: 'جستجوی اطلاعات در وب برای تحلیل رقبا', isEnabled: true },
    ],
    memoryBindings: [
      { id: 'mem-1', agentId: 'pta-marketing', memoryPackId: 'mem-1', memoryPackName: 'سبک نگارش برند', memoryType: 'preference' },
    ],
  },
  'pta-branding': {
    ...MOCK_AGENTS[1],
    knowledgeBindings: [
      { id: 'kb-4', agentId: 'pta-branding', knowledgeBaseId: 'kb-hatro', knowledgeBaseName: 'هلدینگ هاترو', relevanceThreshold: 0.7, maxChunks: 10, priority: 0 },
      { id: 'kb-5', agentId: 'pta-branding', knowledgeBaseId: 'kb-golbarg', knowledgeBaseName: 'گلبرگ', relevanceThreshold: 0.8, maxChunks: 5, priority: 1 },
    ],
    toolBindings: [],
    memoryBindings: [
      { id: 'mem-2', agentId: 'pta-branding', memoryPackId: 'mem-1', memoryPackName: 'سبک نگارش برند', memoryType: 'preference' },
    ],
  },
  'pta-advertising': {
    ...MOCK_AGENTS[2],
    knowledgeBindings: [
      { id: 'kb-6', agentId: 'pta-advertising', knowledgeBaseId: 'kb-hatro', knowledgeBaseName: 'هلدینگ هاترو', relevanceThreshold: 0.7, maxChunks: 5, priority: 0 },
    ],
    toolBindings: [
      { id: 'tool-3', agentId: 'pta-advertising', toolId: 'tool-3', toolName: 'تولید محتوا', toolDescription: 'تولید محتوای تبلیغاتی متناسب با برند', isEnabled: true },
    ],
    memoryBindings: [],
  },
  'pta-pr': {
    ...MOCK_AGENTS[3],
    knowledgeBindings: [
      { id: 'kb-7', agentId: 'pta-pr', knowledgeBaseId: 'kb-hatro', knowledgeBaseName: 'هلدینگ هاترو', relevanceThreshold: 0.8, maxChunks: 10, priority: 0 },
      { id: 'kb-8', agentId: 'pta-pr', knowledgeBaseId: 'kb-proushat', knowledgeBaseName: 'پروشات', relevanceThreshold: 0.75, maxChunks: 8, priority: 1 },
    ],
    toolBindings: [
      { id: 'tool-4', agentId: 'pta-pr', toolId: 'tool-4', toolName: 'جستجوی اخبار', toolDescription: 'جستجوی اخبار و رویدادهای مرتبط با هاترو', isEnabled: true },
    ],
    memoryBindings: [
      { id: 'mem-3', agentId: 'pta-pr', memoryPackId: 'mem-2', memoryPackName: 'دستورالعمل‌های امنیتی', memoryType: 'system' },
    ],
  },
  'pta-holding': {
    ...MOCK_AGENTS[4],
    knowledgeBindings: [
      { id: 'kb-9', agentId: 'pta-holding', knowledgeBaseId: 'kb-hatro', knowledgeBaseName: 'هلدینگ هاترو', relevanceThreshold: 0.7, maxChunks: 15, priority: 0 },
      { id: 'kb-10', agentId: 'pta-holding', knowledgeBaseId: 'kb-koush-dryfruits', knowledgeBaseName: 'خشکبار کوروش', relevanceThreshold: 0.75, maxChunks: 10, priority: 1 },
      { id: 'kb-11', agentId: 'pta-holding', knowledgeBaseId: 'kb-koush-rice', knowledgeBaseName: 'برنج کوروش', relevanceThreshold: 0.75, maxChunks: 10, priority: 2 },
      { id: 'kb-12', agentId: 'pta-holding', knowledgeBaseId: 'kb-proushat', knowledgeBaseName: 'پروشات', relevanceThreshold: 0.75, maxChunks: 10, priority: 3 },
      { id: 'kb-13', agentId: 'pta-holding', knowledgeBaseId: 'kb-golbarg', knowledgeBaseName: 'گلبرگ', relevanceThreshold: 0.75, maxChunks: 10, priority: 4 },
      { id: 'kb-14', agentId: 'pta-holding', knowledgeBaseId: 'kb-basti-arin', knowledgeBaseName: 'باستی آرین', relevanceThreshold: 0.75, maxChunks: 10, priority: 5 },
      { id: 'kb-15', agentId: 'pta-holding', knowledgeBaseId: 'kb-tala-nab', knowledgeBaseName: 'طلا ناب', relevanceThreshold: 0.75, maxChunks: 10, priority: 6 },
      { id: 'kb-16', agentId: 'pta-holding', knowledgeBaseId: 'kb-pakban', knowledgeBaseName: 'پاکبان', relevanceThreshold: 0.75, maxChunks: 10, priority: 7 },
      { id: 'kb-17', agentId: 'pta-holding', knowledgeBaseId: 'kb-koush-protein', knowledgeBaseName: 'پروتئین کوروش', relevanceThreshold: 0.75, maxChunks: 10, priority: 8 },
      { id: 'kb-18', agentId: 'pta-holding', knowledgeBaseId: 'kb-koush-fruit', knowledgeBaseName: 'میوه کوروش', relevanceThreshold: 0.75, maxChunks: 10, priority: 9 },
    ],
    toolBindings: [
      { id: 'tool-5', agentId: 'pta-holding', toolId: 'tool-5', toolName: 'پرس‌وجوی دیتابیس', toolDescription: 'اجرای کوئری روی دیتابیس تحلیلی هلدینگ', isEnabled: true },
      { id: 'tool-6', agentId: 'pta-holding', toolId: 'tool-6', toolName: 'جستجوی وب', toolDescription: 'جستجوی اطلاعات در وب', isEnabled: true },
      { id: 'tool-7', agentId: 'pta-holding', toolId: 'tool-7', toolName: 'نمودارسازی', toolDescription: 'تولید نمودار از داده‌های تحلیلی', isEnabled: true },
    ],
    memoryBindings: [
      { id: 'mem-4', agentId: 'pta-holding', memoryPackId: 'mem-1', memoryPackName: 'سبک نگارش برند', memoryType: 'preference' },
      { id: 'mem-5', agentId: 'pta-holding', memoryPackId: 'mem-2', memoryPackName: 'دستورالعمل‌های امنیتی', memoryType: 'system' },
    ],
  },
};
