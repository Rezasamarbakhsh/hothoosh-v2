import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 }), session: null };
  }
  const user = session.user as Record<string, unknown>;
  if (user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'دسترسی مدیر لازم است' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export function ok(data: unknown) {
  return NextResponse.json({ data });
}

export function err(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}