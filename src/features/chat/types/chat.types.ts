import { z } from 'zod';

/** Message role — matches Database §6.2 chat_messages.role */
export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  TOOL: 'tool',
} as const;

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];

/** Chat message — frontend representation */
export interface ChatMessage {
  id: string;
  sessionId: string;
  parentMessageId: string | null;
  branchIndex: number;
  role: MessageRole;
  content: string;
  tokenCount: number | null;
  modelId: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number | null;
  toolCalls: ToolCall[] | null;
  createdAt: string;
}

export interface ToolCall {
  name: string;
  arguments: string;
  result?: string;
}

/** Chat session — frontend representation */
export interface ChatSession {
  id: string;
  workspaceId: string;
  userId: string;
  agentId: string;
  agentName: string;
  agentAvatarUrl: string | null;
  title: string | null;
  messageCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  status: 'active' | 'archived' | 'deleted';
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Agent summary for selector */
export interface AgentSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  status: 'active' | 'draft' | 'deprecated';
  description: string | null;
}

/** Mock data for UI development */
export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'agent-1',
    agentName: 'دستیار عمومی',
    agentAvatarUrl: null,
    title: 'بررسی گزارش فروش فصلی',
    messageCount: 12,
    totalInputTokens: 3400,
    totalOutputTokens: 1800,
    status: 'active',
    lastMessageAt: '2025-08-02T14:30:00Z',
    lastMessagePreview: 'بر اساس تحلیل داده‌ها، فروش در...',
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-02T14:30:00Z',
  },
  {
    id: 'session-2',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'agent-2',
    agentName: 'تحلیلگر داده',
    agentAvatarUrl: null,
    title: 'طراحی دیتابیس پروژه جدید',
    messageCount: 8,
    totalInputTokens: 2100,
    totalOutputTokens: 3200,
    status: 'active',
    lastMessageAt: '2025-08-02T11:15:00Z',
    lastMessagePreview: 'پیشنهاد من برای ساختار جداول...',
    createdAt: '2025-07-31T09:00:00Z',
    updatedAt: '2025-08-02T11:15:00Z',
  },
  {
    id: 'session-3',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'agent-1',
    agentName: 'دستیار عمومی',
    agentAvatarUrl: null,
    title: 'مترجم تخصصی فارسی-انگلیسی',
    messageCount: 24,
    totalInputTokens: 5600,
    totalOutputTokens: 7200,
    status: 'archived',
    lastMessageAt: '2025-07-28T16:45:00Z',
    lastMessagePreview: 'ترجمه دقیق این عبارت فنی...',
    createdAt: '2025-07-25T08:30:00Z',
    updatedAt: '2025-07-28T16:45:00Z',
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sessionId: 'session-1',
    parentMessageId: null,
    branchIndex: 0,
    role: 'user',
    content: 'لطفاً گزارش فروش فصل دوم را بررسی کن و نکات کلیدی را خلاصه کن.',
    tokenCount: 24,
    modelId: null,
    inputTokens: null,
    outputTokens: null,
    latencyMs: null,
    toolCalls: null,
    createdAt: '2025-08-02T14:00:00Z',
  },
  {
    id: 'msg-2',
    sessionId: 'session-1',
    parentMessageId: 'msg-1',
    branchIndex: 0,
    role: 'assistant',
    content:
      'بر اساس تحلیل داده‌های فروش فصل دوم، نکات کلیدی زیر قابل مشاهده است:\n\n**۱. رشد کلی فروش**\nفروش کل در مقایسه با فصل اول **۱۸٪ رشد** داشته است. این رشد عمدتاً ناشی از افزایش فروش محصولات دیجیتال است.\n\n**۲. محصولات پرفروش**\n- محصول الف: ۳۴٪ از کل فروش\n- محصول ب: ۲۸٪ از کل فروش\n- محصول ج: ۱۵٪ از کل فروش\n\n**۳. نکات قابل بهبود**\n- فروش منطقه جنوب ۱۲٪ کاهش یافته\n- نرخ بازگشت مشتریان جدید پایین‌تر از حد انتظار است',
    tokenCount: 186,
    modelId: 'model-1',
    inputTokens: 340,
    outputTokens: 186,
    latencyMs: 1200,
    toolCalls: null,
    createdAt: '2025-08-02T14:00:02Z',
  },
  {
    id: 'msg-3',
    sessionId: 'session-1',
    parentMessageId: 'msg-2',
    branchIndex: 0,
    role: 'user',
    content: 'دلیل کاهش فروش منطقه جنوب چیست؟',
    tokenCount: 14,
    modelId: null,
    inputTokens: null,
    outputTokens: null,
    latencyMs: null,
    toolCalls: null,
    createdAt: '2025-08-02T14:05:00Z',
  },
  {
    id: 'msg-4',
    sessionId: 'session-1',
    parentMessageId: 'msg-3',
    branchIndex: 0,
    role: 'assistant',
    content:
      'تحلیل دلایل کاهش فروش منطقه جنوب:\n\n**۱. عوامل بازار**\nرقابت جدید در منطقه جنوب با ورود دو شرکت جدید تشدید شده. قیمت‌گذاری رقبا ۱۰-۱۵٪ پایین‌تر از ماست.\n\n**۲. عوامل عملیاتی**\nنماینده منطقه جنوب در خرداد ماه تغییر کرده و تیم فروش جدید هنوز با مشتریان آشنا نشده.\n\n**۳. پیشنهاد**\n- بررسی استراتژی قیمت‌گذاری رقابتی\n- تقویت تیم فروش با آموزش‌های تخصصی\n- ارائه تخفیف‌های موقت برای جلب مشتریان قدیمی',
    tokenCount: 142,
    modelId: 'model-1',
    inputTokens: 180,
    outputTokens: 142,
    latencyMs: 950,
    toolCalls: null,
    createdAt: '2025-08-02T14:05:01Z',
  },
];

export const MOCK_AGENTS: AgentSummary[] = [
  {
    id: 'agent-1',
    name: 'دستیار عمومی',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند عمومی برای سؤالات متنوع',
  },
  {
    id: 'agent-2',
    name: 'تحلیلگر داده',
    avatarUrl: null,
    status: 'active',
    description: 'تحلیل و تفسیر داده‌های سازمانی',
  },
  {
    id: 'agent-3',
    name: 'مترجم تخصصی',
    avatarUrl: null,
    status: 'active',
    description: 'ترجمه حرفه‌ای فارسی-انگلیسی',
  },
];
