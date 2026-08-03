import type { UseFormRegisterReturn } from 'react-hook-form';

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
  dir?: string;
}

export function AuthFormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
  autoComplete,
  dir,
}: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[var(--color-text-secondary)]"
        style={{
          fontSize: 'var(--text-body-sm)',
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        dir={dir}
        autoComplete={autoComplete}
        className={
          'w-full rounded-lg border bg-[var(--color-surface-base)] px-3.5 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors duration-150 ' +
          'focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] ' +
          (error
            ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]'
            : 'border-[var(--color-border-default)]')
        }
        style={{
          fontSize: 'var(--text-body-md)',
          lineHeight: 'var(--leading-body-md)',
        }}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registration}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[var(--color-error-500)]"
          style={{
            fontSize: 'var(--text-caption-sm)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
