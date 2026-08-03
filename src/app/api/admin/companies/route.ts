import { db } from '@/lib/db';
import { requireAdmin, ok, err } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const companies = await db.company.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } },
  });
  return ok(companies);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, slug, description } = body;
  if (!name || !slug) return err('نام و شناسه شرکت الزامی است');

  const existing = await db.company.findUnique({ where: { slug } });
  if (existing) return err('این شناسه شرکت قبلا ثبت شده');

  const company = await db.company.create({
    data: { name, slug, description: description ?? null },
  });
  return ok(company);
}
