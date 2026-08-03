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
  if (body.provider !== undefined) data.provider = body.provider;
  if (body.model !== undefined) data.model = body.model;
  if (body.monthlyBudget !== undefined) data.monthlyBudget = body.monthlyBudget;
  if (body.status !== undefined) data.status = body.status;

  if (body.toggleStatus) {
    const current = await db.apiKey.findUnique({ where: { id } });
    if (!current) return err('کلید یافت نشد', 404);
    data.status = current.status === 'active' ? 'revoked' : 'active';
  }

  const apiKey = await db.apiKey.update({ where: { id }, data });
  return ok(apiKey);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await db.apiKey.delete({ where: { id } });
  return ok({ deleted: true });
}
