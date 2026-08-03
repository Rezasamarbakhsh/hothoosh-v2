import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';

async function seed() {
  console.log('Seeding users...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Upsert admin
  await db.user.upsert({
    where: { email: 'admin@hothoosh.ir' },
    update: { passwordHash: adminPassword, role: 'admin', name: 'مدیر سیستم' },
    create: { email: 'admin@hothoosh.ir', passwordHash: adminPassword, role: 'admin', name: 'مدیر سیستم' },
  });
  console.log('Admin created: admin@hothoosh.ir / admin123');

  // Upsert regular user
  await db.user.upsert({
    where: { email: 'user@hothoosh.ir' },
    update: { passwordHash: userPassword, role: 'user', name: 'کاربر عادی' },
    create: { email: 'user@hothoosh.ir', passwordHash: userPassword, role: 'user', name: 'کاربر عادی' },
  });
  console.log('User created: user@hothoosh.ir / user123');

  const allUsers = await db.user.findMany();
  console.log('All users:', allUsers.map((u) => `${u.email} (${u.role})`));

  await db.$disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
