'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/schemas/auth-schemas';
import { AuthFormField } from '@/features/auth/components/auth-form-field';

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      invitationToken: '',
      displayName: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(_data: RegisterFormData) {
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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success-100)]">
          <svg
            className="h-6 w-6 text-[var(--color-success-500)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
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
          ثبت‌نام با موفقیت انجام شد
        </h2>
        <p
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          اکنون می‌توانید با حساب کاربری خود وارد شوید.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-[var(--color-primary-500)] px-6 py-2.5 font-[var(--font-weight-medium)] text-[var(--color-text-inverse)] transition-colors duration-150 hover:bg-[var(--color-primary-600)]"
          style={{ fontSize: 'var(--text-body-md)' }}
        >
          ورود به حساب
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
          ایجاد حساب کاربری
        </h2>
        <p
          className="mt-1 text-[var(--color-text-secondary)]"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          توکن دعوت‌نامه سازمانی و اطلاعات خود را وارد کنید
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
          id="reg-token"
          label="توکن دعوت‌نامه"
          type="text"
          placeholder="کد دعوت‌نامه دریافتی"
          dir="ltr"
          autoComplete="off"
          error={errors.invitationToken?.message}
          registration={register('invitationToken')}
        />

        <AuthFormField
          id="reg-display-name"
          label="نام نمایشی"
          type="text"
          placeholder="نام و نام خانوادگی"
          autoComplete="name"
          error={errors.displayName?.message}
          registration={register('displayName')}
        />

        <AuthFormField
          id="reg-password"
          label="رمز عبور"
          type="password"
          placeholder="حداقل ۸ کاراکتر"
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register('password')}
        />

        <AuthFormField
          id="reg-confirm-password"
          label="تکرار رمز عبور"
          type="password"
          placeholder="مجدداً رمز عبور را وارد کنید"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword')}
        />

        {/* Password requirements hint */}
        <div
          className="rounded-lg bg-[var(--color-surface-raised)] p-3"
          style={{ fontSize: 'var(--text-caption-sm)' }}
        >
          <p className="mb-1.5 font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
            رمز عبور باید شامل موارد زیر باشد:
          </p>
          <ul className="space-y-1 text-[var(--color-text-muted)]">
            <li>حداقل ۸ کاراکتر</li>
            <li>حداقل یک حرف بزرگ انگلیسی (A-Z)</li>
            <li>حداقل یک حرف کوچک انگلیسی (a-z)</li>
            <li>حداقل یک عدد (0-9)</li>
            <li>حداقل یک کاراکتر خاص (!@#$%...)</li>
          </ul>
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
          {isSubmitting ? 'در حال ثبت‌نام...' : 'ایجاد حساب'}
        </button>
      </form>

      {/* Back to login */}
      <p
        className="text-center text-[var(--color-text-muted)]"
        style={{ fontSize: 'var(--text-caption-sm)' }}
      >
        قبلاً ثبت‌نام کرده‌اید؟{' '}
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
