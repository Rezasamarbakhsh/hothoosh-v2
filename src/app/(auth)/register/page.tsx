import type { Metadata } from 'next';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'ثبت‌نام — هات‌هوش',
  description: 'ایجاد حساب کاربری در هات‌هوش',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
