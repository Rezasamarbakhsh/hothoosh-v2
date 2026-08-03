'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  MoreHorizontal,
  Pencil,
  Ban,
  CheckCircle2,
  Building2,
  Search,
  RefreshCw,
  Check,
  Loader2,
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

/* ---- Types ---- */

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  companyId: string | null;
  companyName: string | null;
  companySlug: string | null;
  usageCount: number;
  createdAt: string;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  _count: { users: number };
  createdAt: string;
  updatedAt: string;
}

/* ---- Helpers ---- */

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fa-IR');
}

/* ---- Toast ---- */
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  const [visible, setVisible] = useState(true);
  const colorMap = { success: 'bg-[var(--color-success-600)]', error: 'bg-[var(--color-error-500)]' };
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
  loading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmVariant?: 'destructive' | 'default';
  loading?: boolean;
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
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={loading}>
            انصراف
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
            تایید
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Create User Dialog ---- */
function CreateUserDialog({
  open,
  onOpenChange,
  companies,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  companies: Company[];
  onCreated: (user: User) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [companyId, setCompanyId] = useState<string>('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setCompanyId('none');
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string> = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      };
      if (companyId !== 'none') {
        body.companyId = companyId;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || `خطا در ایجاد کاربر (${res.status})`);
      }

      onCreated(json.data as User);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>
            ایجاد کاربر جدید
          </DialogTitle>
          <DialogDescription className='text-[var(--color-text-muted)]'>
            اطلاعات کاربر جدید را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              نام و نام خانوادگی
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='نام کامل کاربر'
              className='border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              ایمیل
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='user@example.com'
              type='email'
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              رمز عبور
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='رمز عبور'
              type='password'
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              نقش
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'user')}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-background)]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='user'>کاربر عادی</SelectItem>
                <SelectItem value='admin'>مدیر سیستم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              شرکت (اختیاری)
            </label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-background)]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>بدون شرکت</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className='text-[var(--color-error-500)]' style={{ fontSize: 'var(--text-body-sm)' }}>
              {error}
            </p>
          )}

          <Button onClick={handleSubmit} disabled={!canSubmit || loading} className='mt-2'>
            {loading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
            ایجاد کاربر
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Edit User Dialog ---- */
function EditUserDialog({
  user,
  open,
  onOpenChange,
  companies,
  onSaved,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  companies: Company[];
  onSaved: (id: string, updated: Partial<User>) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [companyId, setCompanyId] = useState<string>('none');
  const [isActive, setIsActive] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      setName(user.name);
      setRole(user.role);
      setCompanyId(user.companyId || 'none');
      setIsActive(user.isActive);
      setNewPassword('');
      setError(null);
      setLoading(false);
    }
  }, [user, open]);

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        role,
        isActive,
      };
      if (companyId !== 'none') {
        body.companyId = companyId;
      } else {
        body.companyId = null;
      }
      if (newPassword.trim()) {
        body.password = newPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || `خطا در بروزرسانی کاربر (${res.status})`);
      }

      onSaved(user.id, json.data);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='glass-panel-elevated border-0 sm:max-w-md' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-[var(--color-text-primary)]'>
            ویرایش کاربر
          </DialogTitle>
          <DialogDescription className='text-[var(--color-text-muted)]'>
            اطلاعات «{user?.name}» را ویرایش کنید.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-2'>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              ایمیل
            </label>
            <Input
              value={user?.email ?? ''}
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
              نام و نام خانوادگی
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
              نقش
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'user')}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-background)]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='user'>کاربر عادی</SelectItem>
                <SelectItem value='admin'>مدیر سیستم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              شرکت
            </label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className='border-[var(--color-border-default)] bg-[var(--color-background)]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>بدون شرکت</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center justify-between rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background)] px-3 py-2'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              وضعیت فعال
            </label>
            <button
              type='button'
              onClick={() => setIsActive(!isActive)}
              className='flex items-center gap-1.5'
            >
              {isActive ? (
                <CheckCircle2 className='h-5 w-5 text-[var(--color-success-500)]' />
              ) : (
                <Ban className='h-5 w-5 text-[var(--color-text-muted)]' />
              )}
              <span
                className={isActive ? 'text-[var(--color-success-500)]' : 'text-[var(--color-text-muted)]'}
                style={{ fontSize: 'var(--text-body-sm)' }}
              >
                {isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </button>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              className='text-[var(--color-text-secondary)]'
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              رمز عبور جدید (اختیاری)
            </label>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='برای تغییر رمز عبور وارد کنید'
              type='password'
              dir='ltr'
              className='text-left border-[var(--color-border-default)] bg-[var(--color-background)]'
            />
          </div>

          {error && (
            <p className='text-[var(--color-error-500)]' style={{ fontSize: 'var(--text-body-sm)' }}>
              {error}
            </p>
          )}

          <Button onClick={handleSubmit} disabled={loading} className='mt-2'>
            {loading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
            ذخیره تغییرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---- User Row ---- */
function UserRow({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    setDeleteLoading(true);
    await onDelete(user);
    setDeleteLoading(false);
  }

  return (
    <>
      <Card className='glass-panel-elevated border-0'>
        <CardContent className='p-4'>
          {/* Desktop row layout */}
          <div className='hidden items-center gap-4 lg:flex'>
            {/* Name & email */}
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <span
                  className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
                  style={{ fontSize: 'var(--text-body-md)' }}
                >
                  {user.name}
                </span>
                <Badge
                  variant='secondary'
                  className={
                    user.role === 'admin'
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)]'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                  }
                >
                  {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                </Badge>
                <Badge
                  variant='secondary'
                  className={
                    user.isActive
                      ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
                      : 'bg-[var(--color-warning-50)] text-[var(--color-warning-500)]'
                  }
                >
                  {user.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>
              <p
                dir='ltr'
                className='font-mono text-[var(--color-text-muted)]'
                style={{ fontSize: 'var(--text-caption-sm)' }}
              >
                {user.email}
              </p>
            </div>

            {/* Company */}
            <div className='flex items-center gap-1.5 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)', minWidth: 'fit-content' }}>
              {user.companyName ? (
                <>
                  <Building2 className='h-4 w-4' />
                  <span>{user.companyName}</span>
                </>
              ) : (
                <span className='text-[var(--color-text-muted)]'>—</span>
              )}
            </div>

            {/* Usage */}
            <div className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)', minWidth: 'fit-content' }}>
              {formatNumber(user.usageCount)} استفاده
            </div>

            {/* Created date */}
            <div
              className='text-[var(--color-text-muted)]'
              style={{ fontSize: 'var(--text-caption-sm)', minWidth: 'fit-content' }}
            >
              {formatDate(user.createdAt)}
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
                  onClick={() => onEdit(user)}
                >
                  <Pencil className='h-4 w-4' />
                  ویرایش
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
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span
                    className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
                    style={{ fontSize: 'var(--text-body-md)' }}
                  >
                    {user.name}
                  </span>
                  <Badge
                    variant='secondary'
                    className={
                      user.role === 'admin'
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)]'
                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                    }
                  >
                    {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                  </Badge>
                  <Badge
                    variant='secondary'
                    className={
                      user.isActive
                        ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
                        : 'bg-[var(--color-warning-50)] text-[var(--color-warning-500)]'
                    }
                  >
                    {user.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>
                <p
                  dir='ltr'
                  className='font-mono text-[var(--color-text-muted)]'
                  style={{ fontSize: 'var(--text-caption-sm)' }}
                >
                  {user.email}
                </p>
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
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className='h-4 w-4' />
                    ویرایش
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
            <div className='flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-caption-sm)' }}>
              {user.companyName && (
                <span className='flex items-center gap-1'>
                  <Building2 className='h-3.5 w-3.5' />
                  {user.companyName}
                </span>
              )}
              <span>{formatNumber(user.usageCount)} استفاده</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='حذف کاربر'
        description={`آیا از حذف دائمی کاربر «${user.name}» اطمینان دارید؟ تمام داده‌های مرتبط حذف خواهد شد.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
}

/* ---- Main Component ---- */

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* Fetch users & companies on mount */
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [usersRes, companiesRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/companies'),
        ]);

        if (!usersRes.ok) throw new Error(`خطا در دریافت اطلاعات کاربران (${usersRes.status})`);
        if (!companiesRes.ok) throw new Error(`خطا در دریافت اطلاعات شرکت‌ها (${companiesRes.status})`);

        const usersJson = await usersRes.json();
        const companiesJson = await companiesRes.json();

        if (!cancelled) {
          setUsers(usersJson.data ?? usersJson.users ?? []);
          setCompanies(companiesJson.data ?? companiesJson.companies ?? []);
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

    fetchData();
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

  /* Create handler */
  const handleCreated = useCallback(
    (user: User) => {
      setUsers((prev) => [user, ...prev]);
      showToast('کاربر با موفقیت ایجاد شد');
    },
    [showToast],
  );

  /* Edit handler */
  const handleEditSaved = useCallback(
    (id: string, updated: Partial<User>) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u)),
      );
      showToast('اطلاعات کاربر با موفقیت بروزرسانی شد');
    },
    [showToast],
  );

  /* Delete handler */
  const handleDelete = useCallback(
    async (user: User) => {
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!res.ok || json.error) {
          throw new Error(json.error || 'خطا در حذف کاربر');
        }
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showToast('کاربر با موفقیت حذف شد');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'خطا در حذف کاربر',
          'error',
        );
      }
    },
    [showToast],
  );

  /* Derived data */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  /* Search filter */
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.companyName?.toLowerCase().includes(q) ?? false)
    );
  });

  /* Render */
  return (
    <div className='flex flex-col gap-6'>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
        <SummaryCard
          icon={<Users className='h-5 w-5' />}
          label='کل کاربران'
          value={`${formatNumber(totalUsers)} کاربر`}
        />
        <SummaryCard
          icon={<CheckCircle2 className='h-5 w-5' />}
          label='کاربران فعال'
          value={`${formatNumber(activeUsers)} کاربر`}
        />
        <SummaryCard
          icon={<Shield className='h-5 w-5' />}
          label='مدیران سیستم'
          value={`${formatNumber(adminCount)} مدیر`}
        />
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Header + Search + Create */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h2
          className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]'
          style={{ fontSize: 'var(--text-heading-sm)' }}
        >
          لیست کاربران
        </h2>
        <div className='flex items-center gap-2'>
          <div className='relative w-full sm:w-64'>
            <Search className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]' />
            <Input
              placeholder='جستجو نام، ایمیل یا شرکت...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-[var(--color-border-default)] bg-[var(--color-background)] pr-9'
            />
          </div>
          <Button onClick={() => setCreateOpen(true)} className='shrink-0'>
            <UserPlus className='ml-2 h-4 w-4' />
            کاربر جدید
          </Button>
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
            در حال بارگذاری کاربران...
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
      {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
        <div
          className='py-12 text-center text-[var(--color-text-muted)]'
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          نتیجه‌ای برای «{searchQuery}» یافت نشد.
        </div>
      )}

      {/* Empty State (no users) */}
      {!loading && !error && users.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-3 py-16'>
          <Users
            className='h-10 w-10 text-[var(--color-text-muted)]'
          />
          <p
            className='text-[var(--color-text-muted)]'
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            هنوز کاربری ثبت نشده است.
          </p>
        </div>
      )}

      {/* Users List */}
      {!loading &&
        !error &&
        filteredUsers.length > 0 && (
          <div className='flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1'>
            {filteredUsers.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                onEdit={setEditingUser}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        companies={companies}
        onCreated={handleCreated}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => { if (!open) setEditingUser(null); }}
        companies={companies}
        onSaved={handleEditSaved}
      />
    </div>
  );
}
