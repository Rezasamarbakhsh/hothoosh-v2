'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Lock, LogOut, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);
  const colorMap = { success: 'bg-[var(--color-success-600)]', error: 'bg-[var(--color-error-500)]', info: 'bg-[var(--color-primary-500)]' };
  return (
    <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-[var(--color-text-inverse)] shadow-lg transition-opacity duration-300 ${colorMap[type]} ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setVisible(false)}>
      <div className='flex items-center gap-2'>
        {type === 'success' && <Check className='h-4 w-4' />}
        <span style={{ fontSize: 'var(--text-body-sm)' }}>{message}</span>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  const { data: session } = useSession();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const user = session?.user as Record<string, unknown> | null;
  const userName = (user?.name as string) || 'کاربر';
  const userEmail = (user?.email as string) || 'user@hothoosh.com';
  const userRole = (user?.role as string) || 'کاربر';
  const roleLabel = userRole === 'admin' ? 'مدیر سیستم' : 'کاربر عادی';
  const initial = userName.charAt(0);

  // Profile edit state
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [isEditing, setIsEditing] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleProfileSave() {
    setIsEditing(false);
    showToast('پروفایل با موفقیت ذخیره شد');
  }

  function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('لطفاً همه فیلدها را پر کنید', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('رمز عبور جدید باید حداقل ۸ کاراکتر باشد', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('رمز عبور جدید و تکرار آن مطابقت ندارند', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('رمز عبور با موفقیت تغییر کرد');
  }

  return (
    <div className='mx-auto max-w-2xl flex flex-col gap-6'>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Profile Header */}
      <div className='glass-panel-elevated rounded-xl p-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)]/15 text-2xl font-[var(--font-weight-bold)] text-[var(--color-primary-400)]'>
            {initial}
          </div>
          <div className='min-w-0 flex-1'>
            <h1 className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-lg)' }}>{userName}</h1>
            <p className='mt-1 text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>{userEmail}</p>
            <span className='mt-2 inline-flex items-center rounded-full bg-[var(--color-primary-500)]/10 px-2.5 py-0.5 font-[var(--font-weight-medium)] text-[var(--color-primary-400)]' style={{ fontSize: 'var(--text-caption-sm)' }}>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className='glass-panel-solid rounded-xl p-5 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <User className='h-5 w-5 text-[var(--color-text-secondary)]' />
            <h2 className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-md)' }}>اطلاعات حساب</h2>
          </div>
          {!isEditing && (
            <Button variant='outline' size='sm' onClick={() => setIsEditing(true)} style={{ fontSize: 'var(--text-caption-sm)' }}>ویرایش</Button>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>نام</label>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} disabled={!isEditing} className='border-[var(--color-border-default)] bg-[var(--color-background)] disabled:opacity-70' />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>ایمیل</label>
            <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} disabled={!isEditing} dir='ltr' className='text-left border-[var(--color-border-default)] bg-[var(--color-background)] disabled:opacity-70' />
          </div>
        </div>

        {isEditing && (
          <div className='flex items-center justify-end gap-2'>
            <Button variant='outline' onClick={() => { setIsEditing(false); setEditName(userName); setEditEmail(userEmail); }}>انصراف</Button>
            <Button onClick={handleProfileSave}>ذخیره</Button>
          </div>
        )}
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Change Password */}
      <div className='glass-panel-solid rounded-xl p-5 space-y-4'>
        <div className='flex items-center gap-2'>
          <Lock className='h-5 w-5 text-[var(--color-text-secondary)]' />
          <h2 className='font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-body-md)' }}>تغییر رمز عبور</h2>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>رمز عبور فعلی</label>
            <div className='relative'>
              <Input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type={showCurrent ? 'text' : 'password'} dir='ltr' className='text-left border-[var(--color-border-default)] bg-[var(--color-background)] pe-10' />
              <button type='button' onClick={() => setShowCurrent(!showCurrent)} className='absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]' aria-label='نمایش رمز'>
                {showCurrent ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>رمز عبور جدید</label>
            <div className='relative'>
              <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showNew ? 'text' : 'password'} dir='ltr' className='text-left border-[var(--color-border-default)] bg-[var(--color-background)] pe-10' />
              <button type='button' onClick={() => setShowNew(!showNew)} className='absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]' aria-label='نمایش رمز'>
                {showNew ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>تکرار رمز عبور جدید</label>
            <div className='relative'>
              <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirm ? 'text' : 'password'} dir='ltr' className='text-left border-[var(--color-border-default)] bg-[var(--color-background)] pe-10' />
              <button type='button' onClick={() => setShowConfirm(!showConfirm)} className='absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]' aria-label='نمایش رمز'>
                {showConfirm ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-end'>
          <Button onClick={handlePasswordChange}>تغییر رمز عبور</Button>
        </div>
      </div>

      <Separator className='bg-[var(--color-border-default)]' />

      {/* Logout */}
      <div className='rounded-xl border border-[var(--color-error-500)]/30 bg-[var(--color-error-500)]/5 p-5 space-y-3'>
        <div className='flex items-center gap-2'>
          <LogOut className='h-5 w-5 text-[var(--color-error-500)]' />
          <h2 className='font-[var(--font-weight-semibold)] text-[var(--color-error-500)]' style={{ fontSize: 'var(--text-body-md)' }}>خروج از حساب</h2>
        </div>
        <p className='text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-sm)' }}>
          با خروج از حساب، از تمام دستگاه‌ها خارج خواهید شد.
        </p>
        <Button variant='destructive' onClick={() => signOut({ callbackUrl: window.location.origin + '/login' })}>
          <LogOut className='h-4 w-4 ml-2' />
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}
