import { db } from '@/lib/db';
import { requireAdmin, ok, err } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const keys = await db.apiKey.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return ok(keys);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, provider, key, model, monthlyBudget } = body;

  if (!name || !provider || !key) return err('نام، سرویس‌دهنده و کلید الزامی است');

  const apiKey = await db.apiKey.create({
    data: {
      name,
      provider,
      key,
      model: model ?? null,
      monthlyBudget: monthlyBudget ?? 0,
    },
  });

  return ok(apiKey);
}