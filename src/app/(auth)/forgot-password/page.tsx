import type { Metadata } from 'next';
import ForgotPasswordForm from './forgot-password-form';

export const metadata: Metadata = {
  title: 'فراموشی رمز عبور — هات‌هوش',
  description: 'بازنشانی رمز عبور در هات‌هوش',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
