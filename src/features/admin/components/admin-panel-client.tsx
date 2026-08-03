'use client';

import { ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ApiKeysManager } from './api-keys-manager';

export function AdminPanelClient() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-400)]'>
          <ShieldCheck className='h-5 w-5' />
        </div>
        <h1 className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-lg)' }}>
          پنل مدیریت
        </h1>
      </div>

      <Tabs defaultValue='api-keys'>
        <TabsList className='bg-[var(--color-surface-subtle)]'>
          <TabsTrigger value='api-keys'>مدیریت API</TabsTrigger>
          <TabsTrigger value='settings'>تنظیمات سیستم</TabsTrigger>
        </TabsList>
        <TabsContent value='api-keys'>
          <ApiKeysManager />
        </TabsContent>
        <TabsContent value='settings'>
          <div className='glass-panel-elevated flex flex-col items-center justify-center gap-3 rounded-xl py-20 text-center'>
            <p className='font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]' style={{ fontSize: 'var(--text-body-md)' }}>
              به‌زودی...
            </p>
            <p className='text-[var(--color-text-muted)]' style={{ fontSize: 'var(--text-body-sm)' }}>
              تنظیمات سیستم در نسخه‌های آینده در دسترس خواهد بود.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
