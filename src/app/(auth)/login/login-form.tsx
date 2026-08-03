'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth-schemas';
import { AuthFormField } from '@/features/auth/components/auth-form-field';

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('ایمیل یا رمز عبور اشتباه است.');
      } else {
        router.push('/chat');
        router.refresh();
      }
    } catch {
      setServerError('خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-lg)',
          }}
        >
          ورود به حساب کاربری
        </h2>
        <p
          className="mt-1 text-[var(--color-text-secondary)]"
          style={{
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--leading-body-sm)',
          }}
        >
          ایمیل و رمز عبور خود را وارد کنید
        </p>
      </div>

      {/* Server error alert */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-[var(--color-error-200)] bg-[var(--color-error-50)] px-4 py-3"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          <p className="font-[var(--font-weight-medium)] text-[var(--color-error-600)]">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthFormField
          id="login-email"
          label="ایمیل"
          type="email"
          placeholder="email@example.com"
          dir="ltr"
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />

        <AuthFormField
          id="login-password"
          label="رمز عبور"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          registration={register('password')}
        />

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[var(--color-border-default)] accent-[var(--color-primary-500)]"
              {...register('rememberMe')}
            />
            <span
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: 'var(--text-body-sm)' }}
            >
              مرا به خاطر بسپار
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors duration-150"
            style={{ fontSize: 'var(--text-body-sm)' }}
          >
            فراموشی رمز عبور
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            'w-full rounded-lg bg-[var(--color-primary-500)] text-[var(--color-text-inverse)] ' +
            'font-[var(--font-weight-medium)] transition-colors duration-150 ' +
            'hover:bg-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] ' +
            'disabled:opacity-60 disabled:cursor-not-allowed'
          }
          style={{
            fontSize: 'var(--text-body-md)',
            lineHeight: 'var(--leading-body-md)',
            paddingBlock: '0.625rem',
          }}
        >
          {isSubmitting ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>

      {/* Register link — invitation-only note */}
      <p
        className="text-center text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-sm)' }}
      >
        حساب کاربری ندارید؟ ثبت‌نام تنها از طریق دعوت‌نامه سازمانی امکان‌پذیر است.
      </p>

      {/* Test credentials */}
      <div
        className="rounded-lg border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-3"
      >
        <p
          className="font-[var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1.5"
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          حساب‌های آزمایشی
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => { setValue('email', 'admin@hothoosh.ir'); setValue('password', 'admin123'); }}
            className="cursor-pointer rounded px-2 py-1 text-start text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border-default)] hover:text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-caption-xs)', direction: 'ltr', textAlign: 'left' }}
          >
            <span className="text-[var(--color-primary-500)]">Admin:</span> admin@hothoosh.ir / admin123
          </button>
          <button
            type="button"
            onClick={() => { setValue('email', 'user@hothoosh.ir'); setValue('password', 'user123'); }}
            className="cursor-pointer rounded px-2 py-1 text-start text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border-default)] hover:text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-caption-xs)', direction: 'ltr', textAlign: 'left' }}
          >
            <span className="text-[var(--color-success-500)]">User:</span> user@hothoosh.ir / user123
          </button>
        </div>
      </div>
    </div>
  );
}
