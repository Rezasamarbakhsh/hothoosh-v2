'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Cpu,
  BarChart3,
  RefreshCw,
  Users,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface UsageTotal {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

interface CompanyUsage {
  companyId: string;
  companyName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
}

interface UserUsage {
  userId: string;
  name: string;
  email: string;
  companyName: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
}

interface UsageData {
  period: string;
  total: UsageTotal;
  byCompany: CompanyUsage[];
  byUser: UserUsage[];
}

type Period = 'week' | 'month' | 'year';

const PERIOD_LABELS: Record<Period, string> = {
  week: 'هفته',
  month: 'ماه',
  year: 'سال',
};

const fmt = (n: number): string => n.toLocaleString('fa-IR');

export function UsageDashboard() {
  const [period, setPeriod] = useState<Period>('month');
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/usage?period=${p}`);
      if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage(period);
  }, [period, fetchUsage]);

  const summaryCards = data
    ? [
        {
          label: 'کل درخواست‌ها',
          value: fmt(data.total.requests),
          icon: Activity,
          color: 'var(--color-primary-500)',
          bgColor: 'var(--color-primary-50)',
        },
        {
          label: 'توکن ورودی',
          value: fmt(data.total.inputTokens),
          icon: ArrowDownToLine,
          color: 'var(--color-success-500)',
          bgColor: 'var(--color-success-50)',
        },
        {
          label: 'توکن خروجی',
          value: fmt(data.total.outputTokens),
          icon: ArrowUpFromLine,
          color: 'var(--color-warning-500)',
          bgColor: 'var(--color-primary-50)',
        },
        {
          label: 'مجموع توکن‌ها',
          value: fmt(data.total.totalTokens),
          icon: Cpu,
          color: 'var(--color-primary-400)',
          bgColor: 'var(--color-primary-50)',
        },
      ]
    : [];

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              background: 'var(--color-primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={20} style={{ color: 'var(--color-primary-500)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--text-h4)', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              داشبورد مصرف
            </h1>
            <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
              مشاهده آمار مصرف و درخواست‌های سیستم
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {PERIOD_LABELS[p]}
            </Button>
          ))}
          <Separator orientation="vertical" style={{ height: '1.5rem', marginRight: '0.25rem', marginLeft: '0.25rem' }} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchUsage(period)}
            disabled={loading}
          >
            <RefreshCw
              size={14}
              style={Object.assign(
                { marginLeft: '0.375rem' },
                loading ? { animation: 'spin 1s linear infinite' } : {}
              )}
            />
            بروزرسانی
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Card style={{ borderColor: 'var(--color-error-500)' }}>
          <CardContent style={{ padding: '1rem 1.25rem' }}>
            <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-error-500)', margin: 0 }}>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.5rem',
                    background: 'var(--color-surface-subtle)',
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '60%',
                      height: '0.75rem',
                      borderRadius: '0.25rem',
                      background: 'var(--color-surface-subtle)',
                    }}
                  />
                  <div
                    style={{
                      width: '40%',
                      height: '1rem',
                      borderRadius: '0.25rem',
                      background: 'var(--color-surface-subtle)',
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      {data && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.5rem',
                      background: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: 'var(--text-body-xs)',
                        color: 'var(--color-text-muted)',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.label}
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--text-h5)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0.125rem 0 0 0',
                      }}
                    >
                      {loading ? '...' : card.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Company Usage Table */}
      {data && data.byCompany.length > 0 && (
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <Building2 size={18} style={{ color: 'var(--color-primary-500)' }} />
              <h2
                style={{
                  fontSize: 'var(--text-h5)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                مصرف بر اساس سازمان
              </h2>
              <Badge variant="secondary">{fmt(data.byCompany.length)} سازمان</Badge>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                <thead>
                  <tr>
                    {['نام سازمان', 'درخواست‌ها', 'توکن ورودی', 'توکن خروجی', 'مجموع توکن‌ها'].map(
                      (header) => (
                        <th
                          key={header}
                          style={{
                            textAlign: 'right',
                            padding: '0.625rem 0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500,
                            fontSize: 'var(--text-body-xs)',
                            borderBottom: '1px solid var(--color-border-default)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.byCompany.map((company) => (
                    <tr
                      key={company.companyId}
                      style={{ borderBottom: '1px solid var(--color-border-default)' }}
                    >
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-primary)',
                          fontWeight: 500,
                        }}
                      >
                        {company.companyName}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(company.requests)}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(company.inputTokens)}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(company.outputTokens)}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-primary)',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(company.inputTokens + company.outputTokens)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Usage Table */}
      {data && data.byUser.length > 0 && (
        <Card>
          <CardContent style={{ padding: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <Users size={18} style={{ color: 'var(--color-primary-500)' }} />
              <h2
                style={{
                  fontSize: 'var(--text-h5)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                مصرف بر اساس کاربر
              </h2>
              <Badge variant="secondary">
                {data.byUser.length >= 20 ? '۲۰' : fmt(data.byUser.length)} کاربر برتر
              </Badge>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                <thead>
                  <tr>
                    {[
                      'نام کاربر',
                      'سازمان',
                      'ایمیل',
                      'درخواست‌ها',
                      'توکن ورودی',
                      'توکن خروجی',
                    ].map((header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: 'right',
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-muted)',
                          fontWeight: 500,
                          fontSize: 'var(--text-body-xs)',
                          borderBottom: '1px solid var(--color-border-default)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.byUser.map((user) => (
                    <tr
                      key={user.userId}
                      style={{ borderBottom: '1px solid var(--color-border-default)' }}
                    >
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-primary)',
                          fontWeight: 500,
                        }}
                      >
                        {user.name}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                          maxWidth: '10rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user.companyName}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-muted)',
                          direction: 'ltr',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(user.requests)}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(user.inputTokens)}
                      </td>
                      <td
                        style={{
                          padding: '0.625rem 0.75rem',
                          color: 'var(--color-text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(user.outputTokens)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && data && data.byCompany.length === 0 && data.byUser.length === 0 && (
        <Card>
          <CardContent
            style={{
              padding: '3rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <BarChart3 size={40} style={{ color: 'var(--color-text-muted)' }} />
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-text-muted)',
                margin: 0,
              }}
            >
              داده‌ای برای نمایش وجود ندارد
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
