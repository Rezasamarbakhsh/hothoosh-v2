'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth-schemas';
import { AuthFormField } from '@/features/auth/components/auth-form-field';

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit() {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // TODO(HOT-XXX): Wire up to auth API endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch {
      setServerError(
        'خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-info-100)]">
          <svg
            className="h-6 w-6 text-[var(--color-info-500)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2
          className="text-[var(--color-text-primary)]"
          style={{
            fontSize: 'var(--text-heading-md)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--leading-heading-md)',
          }}
        >
          لینک بازنشانی ارسال شد
        </h2>
        <p
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          اگر ایمیل وارد شده در سیستم ثبت باشد، لینک بازنشانی رمز عبور به آن ارسال
          خواهد شد.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          بازگشت به ورود
        </Link>
      </div>
    );
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
          فراموشی رمز عبور
        </h2>
        <p
          className="mt-1 text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور برایتان ارسال شود
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
          id="forgot-email"
          label="ایمیل"
          type="email"
          placeholder="email@example.com"
          dir="ltr"
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />

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
          {isSubmitting ? 'در حال ارسال...' : 'ارسال لینک بازنشانی'}
        </button>
      </form>

      {/* Back to login */}
      <p
        className="text-center text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-sm)' }}
      >
        رمز عبور خود را به خاطر آوردید؟{' '}
        <Link
          href="/login"
          className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors duration-150"
        >
          ورود به حساب
        </Link>
      </p>
    </div>
  );
}
