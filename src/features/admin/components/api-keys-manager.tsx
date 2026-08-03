'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Key,
  DollarSign,
  Activity,
  Cpu,
  Plus,
  MoreHorizontal,
  Copy,
  Ban,
  Trash2,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

/* ---- Types ---- */

type Provider = 'openai' | 'anthropic' | 'google' | 'local';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  status: string;
  model: string | null;
  monthlyBudget: number;
  totalRequests: number;
  totalTokens: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ---- Constants ---- */

const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google AI',
  local: 'محلی',
};

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  anthropic: 'bg-[var(--color-primary-50)] text-[var(--color-primary-400)]',
  google: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  local: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]',
};

/* ---- Helpers ---- */

function maskKey(key: string): string {
  if (key.startsWith('local-')) return key;
  const parts = key.split('-');
  if (parts.length >= 3) return parts.slice(0, 2).join('-') + '••••••••';
  return key.slice(0, 12) + '••••••••';
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'همین الان';
  if (diffMin < 60) return `${formatNumber(diffMin)} دقیقه پیش`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${formatNumber(diffHr)} ساعت پیش`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${formatNumber(diffDay)} روز پیش`;
  return `${formatNumber(Math.floor(diffDay / 30))} ماه پیش`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function statusLabel(s: string): string {
  switch (s) {
    case 'active': return 'فعال';
    case 'revoked': return 'ابطال‌شده';
    default: return s;
  }
}

function statusColor(s: string): string {
  switch (s) {
    case 'active': return 'bg-[var(--color-success-50)] text-[var(--color-success-600)]';
    case 'revoked': return 'bg-[var(--color-error-500)]/10 text-[var(--color-error-500)]';
    default: return 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]';
  }
}

/* ---- Toast ---- */

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);
  const colorMap: Record<string, string> = {
    success: 'bg-[var(--color-success-600)]',
    error: 'bg-[var(--color-error-500)]',
    info: 'bg-[var(--color-primary-500)]',
  };
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-[var(--color-text-inverse)] shadow-lg transition-opacity duration-300 ${colorMap[type]} ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setVisible(false)}
    >
      <div className='flex items-center gap-2'>
        <Check className='h-4 w-4' />
        <span style={{ fontSize: 'var(--text-body-sm)' }}>{message}</span>
      </div>
    </div>
  );
}

/* ---- Summary Card ---- */

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className='glass-panel-elevated border-0'>
      <CardContent className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-400)]'>{icon}</div>
        <div>
          <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</p>
          <p className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-sm)' }}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Confirm Dialog ---- */

function ConfirmDialog({ open, onOpenChange, title, description, onConfirm }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>{title}</DialogTitle>
          <DialogDescription className='text-[var(--color-text-secondary)]'>{description}</DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>انصراف</Button>
          <Button variant='destructive' onClick={() => { onConfirm(); onOpenChange(false); }}>تایید</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Add Key Dialog ---- */

function AddKeyDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<Provider | ''>('');
  const [keyValue, setKeyValue] = useState('');
  const [model, setModel] = useState('');
  const [budget, setBudget] = useState('');

  const canSubmit = name && provider && keyValue && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const body: Record<string, string | number> = { name, provider, key: keyValue };
      if (model.trim()) body.model = model.trim();
      if (budget.trim()) body.monthlyBudget = Number(budget);

      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('خطا در ایجاد کلید');
      setOpen(false);
      setName('');
      setProvider('');
      setKeyValue('');
      setModel('');
      setBudget('');
      onAdded();
    } catch {
      // Error is handled silently; parent could add toast support
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2'>
          <Plus className='h-4 w-4' />
          افزودن کلید جدید
        </Button>
      </DialogTrigger>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>افزودن کلید API جدید</DialogTitle>
          <DialogDescription className='text-[var(--color-text-muted)]'>
            کلید API جدیدی برای دسترسی به سرویس‌های هوش مصنوعی اضافه کنید.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>نام</label>
            <Input
              placeholder='مثلاً: پردازش اصلی'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-[var(--color-border-default)] bg-[var(--color-surface-solid)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>سرویس‌دهنده</label>
            <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-surface-solid)]'>
                <SelectValue placeholder='انتخاب سرویس‌دهنده' />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(PROVIDER_LABELS) as [string, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>کلید API</label>
            <Input
              placeholder='sk-...'
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-surface-solid)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>مدل (اختیاری)</label>
            <Input
              placeholder='مثلاً: gpt-4o'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-surface-solid)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>بودجه ماهانه (USD - اختیاری)</label>
            <Input
              type='number'
              placeholder='۵۰۰'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-surface-solid)]'
            />
          </div>
          <Button onClick={handleSubmit} disabled={!canSubmit} className='mt-2'>
            {submitting ? 'در حال ذخیره…' : 'ذخیره کلید'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- API Key Row ---- */

function ApiKeyRow({ apiKey, onAction }: { apiKey: ApiKey; onAction: (id: string, action: string) => void }) {
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(apiKey.key)
      .then(() => onAction(apiKey.id, 'copy'))
      .catch(() => onAction(apiKey.id, 'copy'));
  }, [apiKey.id, apiKey.key, onAction]);

  const budgetPercent = apiKey.monthlyBudget > 0
    ? Math.min((apiKey.totalTokens / (apiKey.monthlyBudget * 1_000_000)) * 100, 100)
    : 0;
  const isOverBudget = apiKey.monthlyBudget > 0 && budgetPercent >= 90;

  const isActive = apiKey.status === 'active';

  return (
    <Card className='glass-panel-elevated border-0'>
      <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary' className={PROVIDER_COLORS[apiKey.provider] ?? 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]'}>
              {PROVIDER_LABELS[apiKey.provider] ?? apiKey.provider}
            </Badge>
            <Badge variant='secondary' className={statusColor(apiKey.status)}>
              {statusLabel(apiKey.status)}
            </Badge>
            <span className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-md)' }}>
              {apiKey.name}
            </span>
          </div>
          <p dir='ltr' className='font-mono text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            {maskKey(apiKey.key)}
          </p>
          {apiKey.monthlyBudget > 0 && (
            <div className='flex items-center gap-3' style={{ maxWidth: 280 }}>
              <Progress value={budgetPercent} className='h-2 flex-1' />
              <span
                className={`shrink-0 ${isOverBudget ? 'text-[var(--color-warning-500)]' : 'text-[var(--color-text-muted)]'}`}
                style={{ fontSize: 'var(--text-caption-xs)' }}
              >
                {formatCurrency(apiKey.monthlyBudget)}
              </span>
            </div>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden text-end sm:block'>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{relativeTime(apiKey.lastUsedAt)}</p>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-xs)' }}>{formatNumber(apiKey.totalTokens)} توکن</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'><MoreHorizontal className='h-4 w-4' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem className='gap-2' onClick={handleCopy}>
                <Copy className='h-4 w-4' />
                کپی کلید
              </DropdownMenuItem>
              <DropdownMenuItem
                className='gap-2'
                onClick={() => isActive ? setRevokeOpen(true) : onAction(apiKey.id, 'activate')}
              >
                <Ban className='h-4 w-4' />
                {isActive ? 'ابطال' : 'فعال‌سازی'}
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 text-[var(--color-error-500)]' onClick={() => setDeleteOpen(true)}>
                <Trash2 className='h-4 w-4' />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <ConfirmDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title='ابطال کلید API'
        description={`آیا از ابطال کلید «${apiKey.name}» اطمینان دارید؟ این کلید دیگر قابل استفاده نخواهد بود.`}
        onConfirm={() => onAction(apiKey.id, 'revoke')}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='حذف کلید API'
        description={`آیا از حذف دائمی کلید «${apiKey.name}» اطمینان دارید؟`}
        onConfirm={() => onAction(apiKey.id, 'delete')}
      />
    </Card>
  );
}

/* ---- Main Component ---- */

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setKeys(json.data ?? []);
    } catch {
      showToast('خطا در دریافت لیست کلیدها', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleAction = useCallback(async (id: string, action: string) => {
    switch (action) {
      case 'copy':
        showToast('کلید در کلیپ‌بورد کپی شد');
        break;

      case 'revoke':
        try {
          const res = await fetch(`/api/admin/api-keys/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toggleStatus: true }),
          });
          if (!res.ok) throw new Error();
          showToast('کلید API با موفقیت ابطال شد');
          fetchKeys();
        } catch {
          showToast('خطا در ابطال کلید', 'error');
        }
        break;

      case 'activate':
        try {
          const res = await fetch(`/api/admin/api-keys/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toggleStatus: true }),
          });
          if (!res.ok) throw new Error();
          showToast('کلید API با موفقیت فعال شد');
          fetchKeys();
        } catch {
          showToast('خطا در فعال‌سازی کلید', 'error');
        }
        break;

      case 'delete':
        try {
          const res = await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error();
          showToast('کلید API حذف شد');
          fetchKeys();
        } catch {
          showToast('خطا در حذف کلید', 'error');
        }
        break;
    }
  }, [showToast, fetchKeys]);

  const handleAdded = useCallback(() => {
    showToast('کلید API جدید با موفقیت ذخیره شد');
    fetchKeys();
  }, [showToast, fetchKeys]);

  const activeKeys = keys.filter((k) => k.status === 'active').length;
  const totalRequests = keys.reduce((s, k) => s + k.totalRequests, 0);
  const totalTokens = keys.reduce((s, k) => s + k.totalTokens, 0);
  const totalBudget = keys.reduce((s, k) => s + k.monthlyBudget, 0);

  return (
    <div className='flex flex-col gap-6' dir='rtl'>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <SummaryCard
          icon={<Key className='h-5 w-5' />}
          label='کلیدهای فعال'
          value={`${formatNumber(activeKeys)} کلید`}
        />
        <SummaryCard
          icon={<Activity className='h-5 w-5' />}
          label='کل درخواست‌ها'
          value={formatNumber(totalRequests)}
        />
        <SummaryCard
          icon={<Cpu className='h-5 w-5' />}
          label='توکن مصرفی'
          value={formatNumber(totalTokens)}
        />
        <SummaryCard
          icon={<DollarSign className='h-5 w-5' />}
          label='بودجه ماهانه'
          value={totalBudget > 0 ? formatCurrency(totalBudget) : '—'}
        />
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2
          className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-heading-sm)' }}
        >
          کلیدهای API
        </h2>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={fetchKeys} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <AddKeyDialog onAdded={handleAdded} />
        </div>
      </div>

      {/* Key List */}
      <div className='flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1'>
        {loading && keys.length === 0 ? (
          <div className='flex items-center justify-center py-12'>
            <RefreshCw className='h-6 w-6 animate-spin text-[var(--color-text-muted)]' />
          </div>
        ) : keys.length === 0 ? (
          <div
            className='py-12 text-center text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            کلید API‌ای وجود ندارد. با دکمه «افزودن کلید جدید» یک کلید اضافه کنید.
          </div>
        ) : (
          keys.map((k) => <ApiKeyRow key={k.id} apiKey={k} onAction={handleAction} />)
        )}
      </div>
    </div>
  );
}
