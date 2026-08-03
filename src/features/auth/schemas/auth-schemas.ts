import { z } from 'zod';

/**
 * Login form validation schema.
 * Matches PRD FR-AUTH-001: invitation-only registration,
 * FR-AUTH-005: password policy enforcement.
 */
export const loginSchema = z.object({
  email: z
    .string({ error: 'ایمیل الزامی است' })
    .min(1, 'ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است'),

  password: z
    .string({ error: 'رمز عبور الزامی است' })
    .min(1, 'رمز عبور الزامی است'),

  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema.
 * PRD FR-AUTH-001: invitation-only, no public self-registration.
 * Invitation token is required and validated server-side.
 */
export const registerSchema = z
  .object({
    invitationToken: z
      .string({ error: 'توکن دعوت الزامی است' })
      .min(1, 'توکن دعوت الزامی است'),

    displayName: z
      .string({ error: 'نام نمایشی الزامی است' })
      .min(2, 'نام نمایشی باید حداقل ۲ کاراکتر باشد')
      .max(100, 'نام نمایشی نباید بیشتر از ۱۰۰ کاراکتر باشد'),

    password: z
      .string({ error: 'رمز عبور الزامی است' })
      .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
      .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد')
      .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد')
      .regex(/[0-9]/, 'رمز عبور باید حداقل یک عدد داشته باشد')
      .regex(/[^A-Za-z0-9]/, 'رمز عبور باید حداقل یک کاراکتر خاص داشته باشد'),

    confirmPassword: z.string({ error: 'تکرار رمز عبور الزامی است' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password form validation schema.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ error: 'ایمیل الزامی است' })
    .min(1, 'ایمیل الزامی است')
    .email('فرمت ایمیل نامعتبر است'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
