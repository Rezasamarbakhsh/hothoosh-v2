import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAdmin, ok, err } from '@/lib/admin-auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.role !== undefined) data.role = body.role;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  if (body.companyId !== undefined) {
    if (body.companyId) {
      const company = await db.company.findUnique({ where: { id: body.companyId } });
      if (!company) return err('شرکت یافت نشد');
    }
    data.companyId = body.companyId || null;
  }

  if (body.password) {
    data.passwordHash = await bcrypt.hash(body.password, 10);
  }

  const user = await db.user.update({
    where: { id },
    data,
    include: { company: { select: { id: true, name: true, slug: true } } },
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await db.session.deleteMany({ where: { userId: id } });
  await db.usageLog.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });

  return ok({ deleted: true });
}