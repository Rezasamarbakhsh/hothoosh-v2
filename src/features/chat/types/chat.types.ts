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

/** Mock agents — PTA group */
export const MOCK_AGENTS: AgentSummary[] = [
  {
    id: 'auto',
    name: 'تشخیص خودکار',
    avatarUrl: null,
    status: 'active',
    description: 'انتخاب خودکار مناسب‌ترین دستیار بر اساس نوع سوال',
  },
  {
    id: 'pta-marketing',
    name: 'PTA Marketing',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند بازاریابی و استراتژی‌های فروش',
  },
  {
    id: 'pta-branding',
    name: 'PTA Branding',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند برندسازی و هویت بصری',
  },
  {
    id: 'pta-advertising',
    name: 'PTA Advertising',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند تبلیغات و کمپین‌های promo',
  },
  {
    id: 'pta-pr',
    name: 'PTA PR',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند روابط عمومی و ارتباطات',
  },
  {
    id: 'pta-holding',
    name: 'PTA Holding',
    avatarUrl: null,
    status: 'active',
    description: 'دستیار هوشمند هلدینگ هاترو — صاحب ۹ شرکت زیرمجموعه',
  },
];

/** Mock sessions — August 2026 */
export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-marketing',
    agentName: 'PTA Marketing',
    agentAvatarUrl: null,
    title: 'تحلیل بازار خشکبار کوروش',
    messageCount: 14,
    totalInputTokens: 4200,
    totalOutputTokens: 5600,
    status: 'active',
    lastMessageAt: '2026-08-15T14:30:00Z',
    lastMessagePreview: 'بر اساس تحلیل داده‌ها، فروش خشکبار در...',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'session-2',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-holding',
    agentName: 'PTA Holding',
    agentAvatarUrl: null,
    title: 'گزارش عملکرد سه‌ماهه هلدینگ',
    messageCount: 8,
    totalInputTokens: 3100,
    totalOutputTokens: 4200,
    status: 'active',
    lastMessageAt: '2026-08-15T11:15:00Z',
    lastMessagePreview: 'خلاصه عملکرد ۹ شرکت زیرمجموعه...',
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-15T11:15:00Z',
  },
  {
    id: 'session-3',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-branding',
    agentName: 'PTA Branding',
    agentAvatarUrl: null,
    title: 'برندسازی طلای ناب',
    messageCount: 6,
    totalInputTokens: 1800,
    totalOutputTokens: 2400,
    status: 'active',
    lastMessageAt: '2026-08-15T09:45:00Z',
    lastMessagePreview: 'پیشنهاد هویت بصری جدید برای برند...',
    createdAt: '2026-08-14T08:30:00Z',
    updatedAt: '2026-08-15T09:45:00Z',
  },
  {
    id: 'session-4',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-marketing',
    agentName: 'PTA Marketing',
    agentAvatarUrl: null,
    title: 'استراتژی بازاریابی پروشات',
    messageCount: 10,
    totalInputTokens: 2800,
    totalOutputTokens: 3900,
    status: 'active',
    lastMessageAt: '2026-08-14T16:20:00Z',
    lastMessagePreview: 'نقشه راه بازاریابی دیجیتال پروشات...',
    createdAt: '2026-08-13T14:00:00Z',
    updatedAt: '2026-08-14T16:20:00Z',
  },
  {
    id: 'session-5',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-advertising',
    agentName: 'PTA Advertising',
    agentAvatarUrl: null,
    title: 'کمپین تبلیغاتی نوروز ۱۴۰۵',
    messageCount: 5,
    totalInputTokens: 1200,
    totalOutputTokens: 1800,
    status: 'active',
    lastMessageAt: '2026-08-14T10:00:00Z',
    lastMessagePreview: 'ایده‌های خلاقانه برای کمپین نوروزی...',
    createdAt: '2026-08-13T09:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z',
  },
  {
    id: 'session-6',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-pr',
    agentName: 'PTA PR',
    agentAvatarUrl: null,
    title: 'مدیریت بحران اطلاع‌رسانی',
    messageCount: 7,
    totalInputTokens: 2100,
    totalOutputTokens: 2900,
    status: 'active',
    lastMessageAt: '2026-08-13T15:30:00Z',
    lastMessagePreview: 'پروتکل پاسخگویی به رسانه‌ها در بحران...',
    createdAt: '2026-08-12T11:00:00Z',
    updatedAt: '2026-08-13T15:30:00Z',
  },
  {
    id: 'session-7',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-holding',
    agentName: 'PTA Holding',
    agentAvatarUrl: null,
    title: 'تحلیل رقبا و موقعیت بازار',
    messageCount: 4,
    totalInputTokens: 1600,
    totalOutputTokens: 2200,
    status: 'archived',
    lastMessageAt: '2026-08-10T12:00:00Z',
    lastMessagePreview: 'نقشه موقعیت رقبا در بازار خشکبار...',
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'session-8',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-branding',
    agentName: 'PTA Branding',
    agentAvatarUrl: null,
    title: 'طراحی بسته‌بندی محصولات جدید',
    messageCount: 9,
    totalInputTokens: 2400,
    totalOutputTokens: 3100,
    status: 'archived',
    lastMessageAt: '2026-08-07T14:00:00Z',
    lastMessagePreview: 'مفهوم طراحی بسته‌بندی لوکس برای...',
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-08-07T14:00:00Z',
  },
  {
    id: 'session-9',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-advertising',
    agentName: 'PTA Advertising',
    agentAvatarUrl: null,
    title: 'برنامه تبلیغات شبکه‌های اجتماعی',
    messageCount: 3,
    totalInputTokens: 900,
    totalOutputTokens: 1200,
    status: 'archived',
    lastMessageAt: '2026-08-05T11:30:00Z',
    lastMessagePreview: 'تقویم محتوایی اینستاگرام و لینکدین...',
    createdAt: '2026-08-04T10:00:00Z',
    updatedAt: '2026-08-05T11:30:00Z',
  },
  {
    id: 'session-10',
    workspaceId: 'ws-1',
    userId: 'user-1',
    agentId: 'pta-pr',
    agentName: 'PTA PR',
    agentAvatarUrl: null,
    title: 'نوشتن بیانیه مطبوعاتی هلدینگ',
    messageCount: 6,
    totalInputTokens: 1800,
    totalOutputTokens: 2500,
    status: 'active',
    lastMessageAt: '2026-08-12T09:00:00Z',
    lastMessagePreview: 'بیانیه مطبوعاتی رونمایی از زیرمجموعه جدید...',
    createdAt: '2026-08-11T08:00:00Z',
    updatedAt: '2026-08-12T09:00:00Z',
  },
];

/** Mock messages for session-1 — Analysis of Kourosh Dried Fruits market */
export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sessionId: 'session-1',
    parentMessageId: null,
    branchIndex: 0,
    role: 'user',
    content: 'لطفاً گزارش فروش فصل دوم خشکبار کوروش را بررسی کن و نکات کلیدی را خلاصه کن.',
    tokenCount: 28,
    modelId: null,
    inputTokens: null,
    outputTokens: null,
    latencyMs: null,
    toolCalls: null,
    createdAt: '2026-08-15T14:00:00Z',
  },
  {
    id: 'msg-2',
    sessionId: 'session-1',
    parentMessageId: 'msg-1',
    branchIndex: 0,
    role: 'assistant',
    content:
      'بر اساس تحلیل داده‌های فروش فصل دوم **خشکبار کوروش**، نکات کلیدی زیر قابل مشاهده است:\n\n**۱. رشد کلی فروش**\nفروش کل در مقایسه با فصل اول **۱۸٪ رشد** داشته است. این رشد عمدتاً ناشی از افزایش فروش پسته و بادام درختی در بازار داخلی است.\n\n**۲. محصولات پرفروش**\n- **پسته احمدآقایی**: ۳۴٪ از کل فروش\n- **بادام درختی مغز**: ۲۸٪ از کل فروش\n- **مخلوط آجیل لوکس**: ۱۵٪ از کل فروش\n\n**۳. کانال‌های فروش**\nفروش آنلاین نسبت به فصل قبل **۴۲٪ رشد** داشته و حالا ۲۳٪ از کل فروش را تشکیل می‌دهد. فروشگاه‌های فیزیکی همچنان بزرگترین کانال با ۵۸٪ سهم هستند.',
    tokenCount: 220,
    modelId: 'model-1',
    inputTokens: 340,
    outputTokens: 220,
    latencyMs: 1200,
    toolCalls: null,
    createdAt: '2026-08-15T14:00:02Z',
  },
  {
    id: 'msg-3',
    sessionId: 'session-1',
    parentMessageId: 'msg-2',
    branchIndex: 0,
    role: 'user',
    content: 'دلیل کاهش فروش در کانال B2B چیست؟',
    tokenCount: 14,
    modelId: null,
    inputTokens: null,
    outputTokens: null,
    latencyMs: null,
    toolCalls: null,
    createdAt: '2026-08-15T14:05:00Z',
  },
  {
    id: 'msg-4',
    sessionId: 'session-1',
    parentMessageId: 'msg-3',
    branchIndex: 0,
    role: 'assistant',
    content:
      'تحلیل دلایل کاهش فروش **خشکبار کوروش** در کانال B2B:\n\n**۱. افزایش رقابت**\nورود دو بازیکن جدید به بازار خشکبار عمده‌فروشی با قیمت‌گذاری **۱۰-۱۵٪ پایین‌تر** از ما. این رقبا عمدتاً واردات مستقیم از افغانستان دارند.\n\n**۲. تغییر قراردادها**\nتعدادی از قراردادهای بلندمدت با سوپرمارکت‌های زنجیره‌ای در پایان فصل اول منقضی شده و تمدید آنها با تاخیر همراه بوده.\n\n**۳. پیشنهاد اقدام**\n- بررسی امکان **تخفیف حجمی** برای سفارش‌های بالای ۵۰۰ کیلوگرم\n- مذاکره مجدد با زنجیره‌های سوپرمارکتی برای قراردادهای سالانه\n- توسعه بسته‌بندی‌های اختصاصی B2B با برند کوروش',
    tokenCount: 180,
    modelId: 'model-1',
    inputTokens: 180,
    outputTokens: 180,
    latencyMs: 950,
    toolCalls: null,
    createdAt: '2026-08-15T14:05:01Z',
  },
  {
    id: 'msg-5',
    sessionId: 'session-1',
    parentMessageId: 'msg-4',
    branchIndex: 0,
    role: 'user',
    content: 'یک استراتژی بازاریابی برای افزایش فروش آنلاین پسته کوروش بده.',
    tokenCount: 16,
    modelId: null,
    inputTokens: null,
    outputTokens: null,
    latencyMs: null,
    toolCalls: null,
    createdAt: '2026-08-15T14:10:00Z',
  },
  {
    id: 'msg-6',
    sessionId: 'session-1',
    parentMessageId: 'msg-5',
    branchIndex: 0,
    role: 'assistant',
    content:
      '**استراتژی بازاریابی دیجیتال پسته کوروش**\n\n**فاز ۱: محتواسازی و سئو (هفته ۱-۴)**\n- تولید ۱۲ محتوای ویدیویی کوتاه از مزرعه تا بسته‌بندی\n- بهینه‌سازی صفحه محصول پسته در سایت با کلمات کلیدی «خرید پسته عمده» و «پسته احمدآقایی درجه یک»\n- راه‌اندازی بلاگ با مقالاتی مثل «تفاوت پسته کال و خام»\n\n**فاز ۲: تبلیغات هدفمند (هفته ۵-۸)**\n- کمپین **Google Ads** روی کلمات کلیدی خرید پسته\n- تبلیغات **اینستاگرام** با هدف‌گذاری افراد ۲۵-۵۰ سال در مناطق با قدرت خرید بالا\n- همکاری با ۵ اینفلوئنسر غذایی برای معرفی محصول\n\n**فاز ۳: وفادارسازی (هفته ۹-۱۲)**\n- راه‌اندازی **برنامه اشتراک ماهانه** آجیل\n- ارسال ایمیل‌های تخفیف ویژه برای خریداران تکراری\n- ایجاد سیستم امتیازدهی و تخفیف برای مشتریان قدیمی',
    tokenCount: 280,
    modelId: 'model-1',
    inputTokens: 220,
    outputTokens: 280,
    latencyMs: 1400,
    toolCalls: null,
    createdAt: '2026-08-15T14:10:02Z',
  },
];
