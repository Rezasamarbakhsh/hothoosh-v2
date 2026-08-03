'use client';

import { ShieldCheck, Building2, Users, Key, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CompaniesManager } from './companies-manager';
import { UsersManager } from './users-manager';
import { ApiKeysManager } from './api-keys-manager';
import { UsageDashboard } from './usage-dashboard';

export function AdminPanelClient() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-400)]'>
          <ShieldCheck className='h-5 w-5' />
        </div>
        <h1 className='font-[var(--font-weight-bold)] text-[var(--color-text-primary)]' style={{ fontSize: 'var(--text-heading-lg)' }}>
          پنل مدیریت
        </h1>
      </div>

      <Tabs defaultValue='companies'>
        <TabsList className='bg-[var(--color-surface-subtle)]'>
          <TabsTrigger value='companies' className='gap-1.5'>
            <Building2 className='h-4 w-4' />
            <span className='hidden sm:inline'>شرکت‌ها</span>
          </TabsTrigger>
          <TabsTrigger value='users' className='gap-1.5'>
            <Users className='h-4 w-4' />
            <span className='hidden sm:inline'>کاربران</span>
          </TabsTrigger>
          <TabsTrigger value='api-keys' className='gap-1.5'>
            <Key className='h-4 w-4' />
            <span className='hidden sm:inline'>کلیدهای API</span>
          </TabsTrigger>
          <TabsTrigger value='usage' className='gap-1.5'>
            <BarChart3 className='h-4 w-4' />
            <span className='hidden sm:inline'>مصرف</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='companies'>
          <CompaniesManager />
        </TabsContent>
        <TabsContent value='users'>
          <UsersManager />
        </TabsContent>
        <TabsContent value='api-keys'>
          <ApiKeysManager />
        </TabsContent>
        <TabsContent value='usage'>
          <UsageDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
