import { db } from '@/lib/db';
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
  if (body.slug !== undefined) {
    const dup = await db.company.findFirst({ where: { slug: body.slug, NOT: { id } } });
    if (dup) return err('این شناسه شرکت قبلا ثبت شده');
    data.slug = body.slug;
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  const company = await db.company.update({ where: { id }, data });
  return ok(company);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const usersCount = await db.user.count({ where: { companyId: id } });
  if (usersCount > 0) return err(`این شرکت دارای ${usersCount} کاربر است. ابتدا کاربران را جابجا کنید.`);

  await db.company.delete({ where: { id } });
  return ok({ deleted: true });
}
