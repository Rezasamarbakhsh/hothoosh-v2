import type { Metadata } from 'next';
import { AdminPanelClient } from '@/features/admin/components/admin-panel-client';

export const metadata: Metadata = {
  title: 'پنل مدیریت — هات‌هوش',
};

export default function AdminPage() {
  return <AdminPanelClient />;
}
