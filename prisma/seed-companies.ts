import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

const COMPANIES = [
  { name: 'خشکبار کوروش', slug: 'kourosh-dried-fruits', description: 'تولید و فروش انواع خشکبار و آجیل' },
  { name: 'پروشات', slug: 'proshat', description: 'شرکت بازرگانی پروشات' },
  { name: 'طلای ناب', slug: 'tala-nab', description: 'طراحی و تولید جواهرات و زیورآلات' },
  { name: 'هاترو مدیا', slug: 'hatro-media', description: 'آژانس تبلیغات و رسانه دیجیتال' },
  { name: 'هاترو لجستیک', slug: 'hatro-logistics', description: 'خدمات لجستیک و حمل و نقل' },
  { name: 'هاترو تک', slug: 'hatro-tech', description: 'توسعه نرم‌افزار و فناوری اطلاعات' },
  { name: 'هاترو فود', slug: 'hatro-food', description: 'صنایع غذایی و تولید مواد غذایی' },
  { name: 'هاترو سازه', slug: 'hatro-sazeh', description: 'ساختمان‌سازی و پروژه‌های عمرانی' },
  { name: 'هاترو انرژی', slug: 'hatro-energy', description: 'تولید و توزیع انرژی‌های تجدیدپذیر' },
];

async function main() {
  console.log('Seeding companies...');

  for (const c of COMPANIES) {
    await db.company.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    console.log(`  ✓ ${c.name}`);
  }

  // Create admin user if not exists
  const adminEmail = 'admin@hatro.ir';
  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 10);
    await db.user.create({
      data: {
        email: adminEmail,
        name: 'مدیر سیستم',
        passwordHash: hash,
        role: 'admin',
      },
    });
    console.log(`  ✓ Admin user created: ${adminEmail} / admin123`);
  } else {
    console.log(`  ✓ Admin user already exists: ${adminEmail}`);
  }

  console.log('\nDone!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
