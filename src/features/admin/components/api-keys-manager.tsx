'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  type ApiKey,
  type Provider,
  PROVIDER_LABELS,
  PROVIDER_COLORS,
  MOCK_API_KEYS,
} from '../types/admin.types';

/* ---- Helpers ---- */

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

function maskKey(key: string): string {
  if (key.startsWith('local-')) return key;
  const parts = key.split('-');
  if (parts.length >= 3) return parts.slice(0, 2).join('-') + '••••••••';
  return key.slice(0, 8) + '••••••••';
}

function statusLabel(s: ApiKey['status']): string {
  switch (s) {
    case 'active': return 'فعال';
    case 'revoked': return 'ابطال‌شده';
    case 'expired': return 'منقضی';
  }
}

function statusColor(s: ApiKey['status']): string {
  switch (s) {
    case 'active': return 'bg-[var(--color-success-50)] text-[var(--color-success-600)]';
    case 'revoked': return 'bg-[var(--color-error-50)] text-[var(--color-error-600)]';
    case 'expired': return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]';
  }
}

/* ---- Summary Card ---- */

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className='glass-panel-elevated border-0'>
      <CardContent className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-400)]'>
          {icon}
        </div>
        <div>
          <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{label}</p>
          <p className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-sm)' }}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Add Key Dialog ---- */

function AddKeyDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<Provider | ''>('');
  const [key, setKey] = useState('');
  const [budget, setBudget] = useState('');

  const canSubmit = name && provider && key;

  function handleSubmit() {
    setOpen(false);
    setName('');
    setProvider('');
    setKey('');
    setBudget('');
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
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>نام</label>
            <Input
              placeholder='مثلاً: پردازش اصلی'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>سرویس‌دهنده</label>
            <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-background)]'>
                <SelectValue placeholder='انتخاب سرویس‌دهنده' />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(PROVIDER_LABELS) as [Provider, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>کلید API</label>
            <Input
              placeholder='sk-...'
              value={key}
              onChange={(e) => setKey(e.target.value)}
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>بودجه ماهانه (USD)</label>
            <Input
              type='number'
              placeholder='۵۰۰'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <Button onClick={handleSubmit} disabled={!canSubmit} className='mt-2'>
            ذخیره کلید
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- API Key Row ---- */

function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {
  const budgetPercent = apiKey.monthlyBudget > 0 ? Math.min((apiKey.monthlySpend / apiKey.monthlyBudget) * 100, 100) : 0;
  const isOverBudget = apiKey.monthlyBudget > 0 && apiKey.monthlySpend >= apiKey.monthlyBudget * 0.9;

  return (
    <Card className='glass-panel-elevated border-0'>
      <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Left: provider + name + key */}
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary' className={PROVIDER_COLORS[apiKey.provider]}>{PROVIDER_LABELS[apiKey.provider]}</Badge>
            <Badge variant='secondary' className={statusColor(apiKey.status)}>{statusLabel(apiKey.status)}</Badge>
            <span className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-md)' }}>
              {apiKey.name}
            </span>
          </div>
          <p dir='ltr' className='font-mono text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
            {maskKey(apiKey.key)}
          </p>
          {/* Usage bar */}
          {apiKey.monthlyBudget > 0 && (
            <div className='flex items-center gap-3' style={{ maxWidth: 280 }}>
              <Progress value={budgetPercent} className='h-2 flex-1' />
              <span className={`shrink-0 ${isOverBudget ? 'text-[var(--color-warning-500)]' : 'text-[var(--color-text-muted)]'}`} style={{ fontSize: 'var(--text-caption-xs)' }}>
                {formatCurrency(apiKey.monthlySpend)} / {formatCurrency(apiKey.monthlyBudget)}
              </span>
            </div>
          )}
        </div>

        {/* Right: meta + actions */}
        <div className='flex items-center gap-4'>
          <div className='hidden text-end sm:block'>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{relativeTime(apiKey.lastUsedAt)}</p>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-xs)' }}>
              {formatNumber(apiKey.tokensUsed)} توکن
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem className='gap-2'>
                <Copy className='h-4 w-4' />
                کپی کلید
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2'>
                <Ban className='h-4 w-4' />
                ابطال
              </DropdownMenuItem>
              <DropdownMenuItem className='gap-2 text-[var(--color-error-500)]'>
                <Trash2 className='h-4 w-4' />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Main Component ---- */

export function ApiKeysManager() {
  const activeKeys = MOCK_API_KEYS.filter((k) => k.status === 'active').length;
  const totalSpend = MOCK_API_KEYS.reduce((s, k) => s + k.monthlySpend, 0);
  const totalRequests = MOCK_API_KEYS.reduce((s, k) => s + k.totalRequests, 0);
  const totalTokens = MOCK_API_KEYS.reduce((s, k) => s + k.tokensUsed, 0);

  return (
    <div className='flex flex-col gap-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <SummaryCard icon={<Key className='h-5 w-5' />} label='کلیدهای فعال' value={`${formatNumber(activeKeys)} کلید`} />
        <SummaryCard icon={<DollarSign className='h-5 w-5' />} label='هزینه ماهانه' value={formatCurrency(totalSpend)} />
        <SummaryCard icon={<Activity className='h-5 w-5' />} label='کل درخواست‌ها' value={formatNumber(totalRequests)} />
        <SummaryCard icon={<Cpu className='h-5 w-5' />} label='توکن مصرفی' value={formatNumber(totalTokens)} />
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Header row */}
      <div className='flex items-center justify-between'>
        <h2 className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-sm)' }}>
          کلیدهای API
        </h2>
        <AddKeyDialog />
      </div>

      {/* Key list */}
      <div className='flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1'>
        {MOCK_API_KEYS.map((k) => (
          <ApiKeyRow key={k.id} apiKey={k} />
        ))}
      </div>
    </div>
  );
}
