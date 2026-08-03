import type { Metadata } from 'next';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'پروفایل کاربر — هات‌هوش',
  description: 'مدیریت پروفایل و تنظیمات حساب کاربری',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
