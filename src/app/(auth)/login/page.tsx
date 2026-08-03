import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'ورود — هات‌هوش',
  description: 'ورود به حساب کاربری هات‌هوش',
};

export default function LoginPage() {
  return <LoginForm />;
}
