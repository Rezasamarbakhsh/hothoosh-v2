'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  Plus,
  MoreHorizontal,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Check,
  Loader2,
  Search,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

/* ---- Types ---- */

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  userCount: number;
  isActive: boolean;
  createdAt: string;
}

interface CompaniesResponse {
  companies: Company[];
}

/* ---- Helpers ---- */

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

/* ---- Toast ---- */
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);
  const colorMap = {
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
function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className='glass-panel-elevated border-0'>
      <CardContent className='flex items-center gap-3 p-4'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-400)]'>
          {icon}
        </div>
        <div>
          <p
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-caption-sm)' }}
          >
            {label}
          </p>
          <p
            className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]'
            style={{ fontSize: 'var(--text-heading-sm)' }}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Confirm Dialog ---- */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmVariant = 'destructive',
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmVariant?: 'destructive' | 'default';
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>{title}</DialogTitle>
          <DialogDescription className='text-[var(--color-text-secondary)]'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-end gap-2 pt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            تایید
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Edit Company Dialog ---- */
function EditCompanyDialog({
  company,
  open,
  onOpenChange,
  onSaved,
}: {
  company: Company | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: (updated: Company) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (company) {
      setName(company.name);
      setDescription(company.description ?? '');
    }
  }, [company]);

  const canSubmit = name.trim().length > 0;

  function handleSubmit() {
    if (!company) return;
    onSaved({
      ...company,
      name: name.trim(),
      description: description.trim() || null,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>
            ویرایش شرکت
          </DialogTitle>
          <DialogDescription className='text-[var(--color-text-muted)]'>
            اطلاعات شرکت «{company?.name}» را ویرایش کنید.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              نام شرکت
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              شناسه (Slug)
            </label>
            <Input
              value={company?.slug ?? ''}
              dir='ltr'
              disabled
              className='text-left border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              توضیحات
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='توضیحات شرکت...'
              className='w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!canSubmit} className='mt-2'>
            ذخیره تغییرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Company Row ---- */
function CompanyRow({
  company,
  onAction,
}: {
  company: Company;
  onAction: (id: string, action: string, payload?: Partial<Company>) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditSaved = useCallback(
    (updated: Company) => {
      onAction(company.id, 'edit', updated);
    },
    [company.id, onAction],
  );

  return (
    <>
      <Card className='glass-panel-elevated border-0'>
        <CardContent className='p-4'>
          {/* Desktop row layout */}
          <div className='hidden items-center gap-4 lg:flex'>
            {/* Name & slug */}
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <span
                  className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
                  style={{ fontSize: 'var(--text-body-md)' }}
                >
                  {company.name}
                </span>
                <Badge
                  variant='secondary'
                  className={
                    company.isActive
                      ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                  }
                >
                  {company.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>
              <p
                dir='ltr'
                className='font-mono text-[var(--color-text-muted)]'
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                {company.slug}
              </p>
            </div>

            {/* Description */}
            <div
              className='max-w-[220px] truncate text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
              title={company.description ?? undefined}
            >
              {company.description || '—'}
            </div>

            {/* User count */}
            <div className='flex items-center gap-1.5 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)', minWidth: 'fit-content' }}>
              <Users className='h-4 w-4' />
              <span>{formatNumber(company.userCount)} کاربر</span>
            </div>

            {/* Created date */}
            <div
              className='text-[var(--color-text-muted)]'
              style={{ fontSize: 'var(--text-caption-sm)', minWidth: 'fit-content' }}
            >
              {formatDate(company.createdAt)}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  className='gap-2'
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className='h-4 w-4' />
                  ویرایش
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2'
                  onClick={() => setToggleOpen(true)}
                >
                  {company.isActive ? (
                    <ToggleLeft className='h-4 w-4' />
                  ) : (
                    <ToggleRight className='h-4 w-4' />
                  )}
                  {company.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2 text-[var(--color-error-500)]'
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className='h-4 w-4' />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile / tablet layout */}
          <div className='flex flex-col gap-3 lg:hidden'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span
                  className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
                  style={{ fontSize: 'var(--text-body-md)' }}
                >
                  {company.name}
                </span>
                <Badge
                  variant='secondary'
                  className={
                    company.isActive
                      ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                  }
                >
                  {company.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    className='gap-2'
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className='h-4 w-4' />
                    ویرایش
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='gap-2'
                    onClick={() => setToggleOpen(true)}
                  >
                    {company.isActive ? (
                      <ToggleLeft className='h-4 w-4' />
                    ) : (
                      <ToggleRight className='h-4 w-4' />
                    )}
                    {company.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='gap-2 text-[var(--color-error-500)]'
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className='h-4 w-4' />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p
              dir='ltr'
              className='font-mono text-[var(--color-text-muted)]'
              style={{ fontSize: 'var(--text-caption-sm)' }}
            >
              {company.slug}
            </p>
            {company.description && (
              <p
                className='text-[var(--color-text-secondary)]'
                style={{ fontSize: 'var(--text-body-sm)' }}
              >
                {company.description}
              </p>
            )}
            <div className='flex items-center gap-4 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              <span className='flex items-center gap-1'>
                <Users className='h-3.5 w-3.5' />
                {formatNumber(company.userCount)} کاربر
              </span>
              <span>{formatDate(company.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditCompanyDialog
        company={company}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={handleEditSaved}
      />

      {/* Toggle Confirm */}
      <ConfirmDialog
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        title={
          company.isActive
            ? 'غیرفعال‌سازی شرکت'
            : 'فعال‌سازی شرکت'
        }
        description={
          company.isActive
            ? `آیا از غیرفعال‌سازی «${company.name}» اطمینان دارید؟ تمام کاربران این شرکت دسترسی خود را از دست خواهند داد.`
            : `آیا از فعال‌سازی مجدد «${company.name}» اطمینان دارید؟`
        }
        onConfirm={() => onAction(company.id, 'toggle')}
        confirmVariant='default'
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='حذف شرکت'
        description={`آیا از حذف دائمی شرکت «${company.name}» اطمینان دارید؟ تمام داده‌های مرتبط حذف خواهد شد.`}
        onConfirm={() => onAction(company.id, 'delete')}
      />
    </>
  );
}

/* ---- Main Component ---- */

export function CompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* Fetch companies on mount */
  useEffect(() => {
    let cancelled = false;

    async function fetchCompanies() {
      try {
        const res = await fetch('/api/admin/companies');
        if (!res.ok) throw new Error(`خطا در دریافت اطلاعات (${res.status})`);
        const data: CompaniesResponse = await res.json();
        if (!cancelled) {
          setCompanies(data.companies);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'خطای ناشناخته');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCompanies();
    return () => { cancelled = true; };
  }, []);

  /* Toast helper */
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  /* Action handler */
  const handleAction = useCallback(
    (id: string, action: string, payload?: Partial<Company>) => {
      switch (action) {
        case 'edit':
          if (payload) {
            setCompanies((prev) =>
              prev.map((c) => (c.id === id ? { ...c, ...payload } : c)),
            );
            showToast('اطلاعات شرکت با موفقیت بروزرسانی شد');
          }
          break;
        case 'toggle':
          setCompanies((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, isActive: !c.isActive } : c,
            ),
          );
          showToast(
            companies.find((c) => c.id === id)?.isActive
              ? 'شرکت غیرفعال شد'
              : 'شرکت فعال شد',
          );
          break;
        case 'delete':
          setCompanies((prev) => prev.filter((c) => c.id !== id));
          showToast('شرکت با موفقیت حذف شد');
          break;
      }
    },
    [companies, showToast],
  );

  /* Derived data */
  const totalCompanies = companies.length;
  const totalUsers = companies.reduce((sum, c) => sum + c.userCount, 0);
  const activeCompanies = companies.filter((c) => c.isActive).length;

  /* Search filter */
  const filteredCompanies = companies.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description?.toLowerCase().includes(q) ?? false)
    );
  });

  /* Render */
  return (
    <div className='flex flex-col gap-6'>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
        <SummaryCard
          icon={<Building2 className='h-5 w-5' />}
          label='کل شرکت‌ها'
          value={`${formatNumber(totalCompanies)} شرکت`}
        />
        <SummaryCard
          icon={<Users className='h-5 w-5' />}
          label='کل کاربران'
          value={`${formatNumber(totalUsers)} کاربر`}
        />
        <SummaryCard
          icon={<CheckCircle2 className='h-5 w-5' />}
          label='شرکت‌های فعال'
          value={`${formatNumber(activeCompanies)} شرکت`}
        />
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Header + Search */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2
          className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-heading-sm)' }}
        >
          لیست شرکت‌ها
        </h2>
        <div className='relative w-full sm:w-64'>
          <Search className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]' />
          <Input
            placeholder='جستجو نام، شناسه یا توضیحات...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='border-[var(--color-border-default)] bg-[var(--color-background)] pr-9'
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex flex-col items-center justify-center gap-3 py-16'>
          <Loader2
            className='h-8 w-8 animate-spin text-[var(--color-primary-500)]'
          />
          <p
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            در حال بارگذاری شرکت‌ها...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          className='flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-error-500)]/20 bg-[var(--color-error-500)]/5 py-12'
        >
          <p
            className='font-[var(--font-weight-medium)] text-[var(--color-error-500)]'
            style={{ fontSize: 'var(--text-body-md)' }}
          >
            خطا در دریافت اطلاعات
          </p>
          <p
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            {error}
          </p>
          <Button
            variant='outline'
            onClick={() => window.location.reload()}
            className='mt-2'
          >
            تلاش مجدد
          </Button>
        </div>
      )}

      {/* Empty State (no results from search) */}
      {!loading && !error && companies.length > 0 && filteredCompanies.length === 0 && (
        <div
          className='py-12 text-center text-[var(--color-text-muted)]'
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          نتیجه‌ای برای «{searchQuery}» یافت نشد.
        </div>
      )}

      {/* Empty State (no companies) */}
      {!loading && !error && companies.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-3 py-16'>
          <Building2
            className='h-10 w-10 text-[var(--color-text-muted)]'
          />
          <p
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            هنوز شرکتی ثبت نشده است.
          </p>
        </div>
      )}

      {/* Companies List */}
      {!loading &&
        !error &&
        filteredCompanies.length > 0 && (
          <div className='flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1'>
            {filteredCompanies.map((c) => (
              <CompanyRow key={c.id} company={c} onAction={handleAction} />
            ))}
          </div>
        )}
    </div>
  );
}
