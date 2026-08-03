// Admin Panel Types — API Key Management

export type Provider = 'openai' | 'anthropic' | 'google' | 'local';

export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiKey {
  id: string;
  name: string;
  provider: Provider;
  key: string;
  status: ApiKeyStatus;
  monthlySpend: number;
  monthlyBudget: number;
  totalRequests: number;
  tokensUsed: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google AI',
  local: 'محلی',
};

export const PROVIDER_COLORS: Record<Provider, string> = {
  openai: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  anthropic: 'bg-[var(--color-primary-50)] text-[var(--color-primary-400)]',
  google: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  local: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]',
};

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'پردازش اصلی',
    provider: 'openai',
    key: 'sk-proj-abc123xyz456DEF789GHI012JKL345MNO678',
    status: 'active',
    monthlySpend: 342.5,
    monthlyBudget: 500,
    totalRequests: 128450,
    tokensUsed: 84500000,
    lastUsedAt: '2026-08-13T14:30:00Z',
    createdAt: '2025-11-20T10:00:00Z',
  },
  {
    id: 'key-2',
    name: 'Claude تحلیلی',
    provider: 'anthropic',
    key: 'sk-ant-api03-pqr789STU012VWX345YZA678BCD012EFG345',
    status: 'active',
    monthlySpend: 218.75,
    monthlyBudget: 300,
    totalRequests: 45230,
    tokensUsed: 32100000,
    lastUsedAt: '2026-08-13T12:15:00Z',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'key-3',
    name: 'Gemini ریتـریوال',
    provider: 'google',
    key: 'AIzaSyB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX',
    status: 'active',
    monthlySpend: 87.2,
    monthlyBudget: 200,
    totalRequests: 23890,
    tokensUsed: 15600000,
    lastUsedAt: '2026-08-13T09:45:00Z',
    createdAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'key-4',
    name: 'OpenAI جدیـد',
    provider: 'openai',
    key: 'sk-proj-new789abc456DEF123GHI456JKL789MNO012',
    status: 'active',
    monthlySpend: 56.3,
    monthlyBudget: 500,
    totalRequests: 8750,
    tokensUsed: 5400000,
    lastUsedAt: '2026-08-12T22:10:00Z',
    createdAt: '2026-07-01T16:00:00Z',
  },
  {
    id: 'key-5',
    name: 'Anthropic آزمایشی',
    provider: 'anthropic',
    key: 'sk-ant-api03-test456MNO789PQR012STU345VWX678YZA012',
    status: 'revoked',
    monthlySpend: 0,
    monthlyBudget: 100,
    totalRequests: 1520,
    tokensUsed: 980000,
    lastUsedAt: '2026-06-20T11:30:00Z',
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 'key-6',
    name: 'مدل محلی Llama',
    provider: 'local',
    key: 'local-llama3-70b-instruct-endpoint',
    status: 'active',
    monthlySpend: 0,
    monthlyBudget: 0,
    totalRequests: 34560,
    tokensUsed: 45800000,
    lastUsedAt: '2026-08-13T15:00:00Z',
    createdAt: '2026-04-18T13:00:00Z',
  },
];
