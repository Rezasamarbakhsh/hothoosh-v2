import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAdmin, ok, err } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      company: { select: { id: true, name: true, slug: true } },
      _count: { select: { usageLogs: true } },
    },
  });

  const result = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    companyId: u.companyId,
    companyName: u.company?.name ?? null,
    companySlug: u.company?.slug ?? null,
    usageCount: u._count.usageLogs,
    createdAt: u.createdAt,
  }));

  return ok(result);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { email, name, password, role, companyId } = body;

  if (!email || !password) return err('ایمیل و رمز عبور الزامی است');

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return err('این ایمیل قبلا ثبت شده');

  if (companyId) {
    const company = await db.company.findUnique({ where: { id: companyId } });
    if (!company) return err('شرکت یافت نشد');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      name: name ?? null,
      passwordHash,
      role: role ?? 'user',
      companyId: companyId ?? null,
    },
    include: {
      company: { select: { id: true, name: true, slug: true } },
    },
  });

  return ok({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    companyId: user.companyId,
    companyName: user.company?.name ?? null,
    createdAt: user.createdAt,
  });
}
