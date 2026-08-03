import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

const COMPANIES = [
  { name: 'صنعت خشکبار و حبوبات کوروش', slug: 'kourosh-dried-fruits', description: 'تولید و فروش انواع خشکبار و حبوبات' },
  { name: 'کشت و صنعت برنج کوروش', slug: 'kourosh-rice', description: 'کشت، تولید و فرآوری برنج' },
  { name: 'فرآورده‌های غذایی پروشات کوروش', slug: 'proshat-food', description: 'تولید فرآورده‌های غذایی پروشات' },
  { name: 'گلبرگ غذایی کوروش', slug: 'golbarag-food', description: 'تولید محصولات غذایی گلبرگ' },
  { name: 'هستی آرین تامین', slug: 'hasti-arin', description: 'تامین مواد اولیه و محصولات' },
  { name: 'طلای ناب کوروش', slug: 'tala-nab', description: 'طراحی و تولید جواهرات و زیورآلات' },
  { name: 'صنایع غذایی پاکبان', slug: 'pakban-food', description: 'تولید محصولات غذایی پاکبان' },
  { name: 'فرآورده‌های پروتئینی کوروش', slug: 'kourosh-protein', description: 'تولید فرآورده‌های پروتئینی' },
  { name: 'صنعت میوه کوروش', slug: 'kourosh-fruit', description: 'تولید و بسته‌بندی میوه' },
  { name: 'هاترو (توسعه کشت و صنعت کوروش)', slug: 'hatro-kourosh-dev', description: 'شرکت توسعه و فناوری کشت و صنعت کوروش' },
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
