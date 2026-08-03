import { db } from '@/lib/db';
import { requireAdmin, ok } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const period = url.searchParams.get('period') ?? 'month';

  const now = new Date();
  const startDate = new Date();
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (period === 'year') {
    startDate.setFullYear(now.getFullYear() - 1);
  } else {
    startDate.setMonth(now.getMonth() - 1);
  }

  const [totalStats, byCompany, byUser, dailyUsage] = await Promise.all([
    db.usageLog.aggregate({
      where: { createdAt: { gte: startDate } },
      _sum: { inputTokens: true, outputTokens: true },
      _count: true,
    }),
    db.usageLog.groupBy({
      by: ['companyId'],
      where: { createdAt: { gte: startDate } },
      _sum: { inputTokens: true, outputTokens: true },
      _count: true,
    }),
    db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: { select: { name: true } },
        _count: { select: { usageLogs: { where: { createdAt: { gte: startDate } } } } },
        usageLogs: {
          where: { createdAt: { gte: startDate } },
          _sum: { inputTokens: true, outputTokens: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    db.$queryRaw<Array<{ date: string; total: number }>>(`
      SELECT DATE(createdAt) as date, COUNT(*) as total
      FROM UsageLog
      WHERE createdAt >= '${startDate.toISOString()}'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `),
  ]);

  const companyMap: Record<string, string> = {};
  if (byCompany) {
    const ids = byCompany.map((c) => c.companyId).filter(Boolean) as string[];
    const companies = await db.company.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    for (const c of companies) companyMap[c.id] = c.name;
  }

  return ok({
    period,
    startDate: startDate.toISOString(),
    total: {
      requests: totalStats._count,
      inputTokens: totalStats._sum.inputTokens ?? 0,
      outputTokens: totalStats._sum.outputTokens ?? 0,
      totalTokens: (totalStats._sum.inputTokens ?? 0) + (totalStats._sum.outputTokens ?? 0),
    },
    byCompany: byCompany?.map((c) => ({
      companyId: c.companyId,
      companyName: c.companyId ? (companyMap[c.companyId] ?? 'نامشخص') : 'بدون شرکت',
      requests: c._count,
      inputTokens: c._sum.inputTokens ?? 0,
      outputTokens: c._sum.outputTokens ?? 0,
    })),
    byUser: byUser.map((u) => ({
      userId: u.id,
      name: u.name,
      email: u.email,
      companyName: u.company?.name ?? null,
      requests: u._count.usageLogs,
      inputTokens: u.usageLogs[0]?._sum.inputTokens ?? 0,
      outputTokens: u.usageLogs[0]?._sum.outputTokens ?? 0,
    })),
    daily: dailyUsage,
  });
}
